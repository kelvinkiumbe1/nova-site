package ke.novasitecare.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record Me(String email, String fullName, AdminRole role) {}

    private final AuthenticationManager authManager;
    private final SecurityContextRepository contextRepository;
    private final AdminUserRepository users;

    public AuthController(AuthenticationManager authManager, SecurityContextRepository contextRepository,
                          AdminUserRepository users) {
        this.authManager = authManager;
        this.contextRepository = contextRepository;
        this.users = users;
    }

    /** Touching the token makes Spring Security issue the XSRF-TOKEN cookie before the first POST. */
    @GetMapping("/csrf")
    ResponseEntity<Void> csrf(CsrfToken token) {
        token.getToken();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    ResponseEntity<Me> login(@Valid @RequestBody LoginRequest body, HttpServletRequest request,
                             HttpServletResponse response) {
        Authentication auth;
        try {
            auth = authManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(body.email(), body.password()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        request.getSession(true);
        request.changeSessionId(); // prevent session fixation
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
        return ResponseEntity.ok(toMe(auth.getName()));
    }

    @GetMapping("/me")
    ResponseEntity<Me> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(toMe(auth.getName()));
    }

    private Me toMe(String email) {
        AdminUser u = users.findByEmailIgnoreCase(email).orElseThrow();
        return new Me(u.getEmail(), u.getFullName(), u.getRole());
    }
}

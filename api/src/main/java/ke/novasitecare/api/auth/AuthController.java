package ke.novasitecare.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record Me(String email, String fullName, AdminRole role) {}
    public record PasswordChange(@NotBlank String currentPassword,
                                 @NotBlank @Size(min = 12, max = 200, message = "must be at least 12 characters")
                                 String newPassword) {}

    private final AuthenticationManager authManager;
    private final SecurityContextRepository contextRepository;
    private final AdminUserRepository users;
    private final PasswordEncoder encoder;

    public AuthController(AuthenticationManager authManager, SecurityContextRepository contextRepository,
                          AdminUserRepository users, PasswordEncoder encoder) {
        this.authManager = authManager;
        this.contextRepository = contextRepository;
        this.users = users;
        this.encoder = encoder;
    }

    /** Lives under /api/admin so the security config requires a logged-in admin. */
    @PostMapping("/api/admin/account/password")
    @Transactional
    ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChange body, Authentication auth) {
        AdminUser u = users.findByEmailIgnoreCase(auth.getName()).orElseThrow();
        if (!encoder.matches(body.currentPassword(), u.getPasswordHash())) {
            throw new ke.novasitecare.api.common.BadRequestException("Your current password is incorrect.");
        }
        u.setPasswordHash(encoder.encode(body.newPassword()));
        return ResponseEntity.noContent().build();
    }

    /** Touching the token makes Spring Security issue the XSRF-TOKEN cookie before the first POST. */
    @GetMapping("/api/auth/csrf")
    ResponseEntity<Void> csrf(CsrfToken token) {
        token.getToken();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/auth/login")
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

    @GetMapping("/api/auth/me")
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

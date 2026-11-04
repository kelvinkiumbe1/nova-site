package ke.novasitecare.api.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists yet. */
@Component
public class AdminBootstrap implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final AdminUserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    public AdminBootstrap(AdminUserRepository users, PasswordEncoder encoder,
                          @Value("${nova.admin.bootstrap-email:}") String email,
                          @Value("${nova.admin.bootstrap-password:}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (users.count() > 0) return;
        if (email.isBlank() || password.isBlank()) {
            log.warn("No admin users exist. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.");
            return;
        }
        if (password.length() < 12) {
            log.error("ADMIN_PASSWORD must be at least 12 characters; admin not created.");
            return;
        }
        users.save(new AdminUser(email.trim(), encoder.encode(password), "Administrator", AdminRole.ADMIN));
        log.info("Created initial admin user {}", email);
    }
}

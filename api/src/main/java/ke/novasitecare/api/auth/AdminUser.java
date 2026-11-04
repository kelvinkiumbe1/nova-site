package ke.novasitecare.api.auth;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_user")
public class AdminUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String passwordHash;
    private String fullName;
    @Enumerated(EnumType.STRING)
    private AdminRole role = AdminRole.ADMIN;
    private boolean enabled = true;
    @Column(insertable = false, updatable = false)
    private Instant createdAt;

    protected AdminUser() {}

    public AdminUser(String email, String passwordHash, String fullName, AdminRole role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getFullName() { return fullName; }
    public AdminRole getRole() { return role; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
}

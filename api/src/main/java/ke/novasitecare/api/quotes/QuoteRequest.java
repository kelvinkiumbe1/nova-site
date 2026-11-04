package ke.novasitecare.api.quotes;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "quote_request")
public class QuoteRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String company;
    private String phone;
    private String email;
    private String serviceSlug;
    private String propertyType;
    private String siteLocation;
    private String projectStage;
    private String sizeEstimate;
    private LocalDate preferredDate;
    private String message;
    @Enumerated(EnumType.STRING)
    private QuoteStatus status = QuoteStatus.NEW;
    private String adminNotes;
    private String sourceIp;
    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    void onCreate() { createdAt = updatedAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { fullName = v; }
    public String getCompany() { return company; }
    public void setCompany(String v) { company = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { phone = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getServiceSlug() { return serviceSlug; }
    public void setServiceSlug(String v) { serviceSlug = v; }
    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String v) { propertyType = v; }
    public String getSiteLocation() { return siteLocation; }
    public void setSiteLocation(String v) { siteLocation = v; }
    public String getProjectStage() { return projectStage; }
    public void setProjectStage(String v) { projectStage = v; }
    public String getSizeEstimate() { return sizeEstimate; }
    public void setSizeEstimate(String v) { sizeEstimate = v; }
    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate v) { preferredDate = v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { message = v; }
    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus v) { status = v; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String v) { adminNotes = v; }
    public String getSourceIp() { return sourceIp; }
    public void setSourceIp(String v) { sourceIp = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

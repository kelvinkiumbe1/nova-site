package ke.novasitecare.api.settings;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/** Single-row table (id = 1) holding company-wide details shown across the site. */
@Entity
@Table(name = "site_settings")
public class SiteSettings {
    @Id
    private Integer id = 1;
    private String companyName;
    private String tagline;
    private String phone;
    private String whatsapp;
    private String email;
    private String address;
    private String businessHours;
    private String facebookUrl;
    private String instagramUrl;
    private String linkedinUrl;
    private String tiktokUrl;
    private String mapEmbedUrl;
    @JdbcTypeCode(SqlTypes.ARRAY)
    private List<String> serviceAreas = new ArrayList<>();
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() { updatedAt = Instant.now(); }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String v) { companyName = v; }
    public String getTagline() { return tagline; }
    public void setTagline(String v) { tagline = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { phone = v; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String v) { whatsapp = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { address = v; }
    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String v) { businessHours = v; }
    public String getFacebookUrl() { return facebookUrl; }
    public void setFacebookUrl(String v) { facebookUrl = v; }
    public String getInstagramUrl() { return instagramUrl; }
    public void setInstagramUrl(String v) { instagramUrl = v; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String v) { linkedinUrl = v; }
    public String getTiktokUrl() { return tiktokUrl; }
    public void setTiktokUrl(String v) { tiktokUrl = v; }
    public String getMapEmbedUrl() { return mapEmbedUrl; }
    public void setMapEmbedUrl(String v) { mapEmbedUrl = v; }
    public List<String> getServiceAreas() { return serviceAreas; }
    public void setServiceAreas(List<String> v) { serviceAreas = v == null ? new ArrayList<>() : new ArrayList<>(v); }
    public Instant getUpdatedAt() { return updatedAt; }
}

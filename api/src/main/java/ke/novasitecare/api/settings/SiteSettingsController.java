package ke.novasitecare.api.settings;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class SiteSettingsController {

    public record SettingsView(String companyName, String tagline, String phone, String phoneAlt, String whatsapp, String email,
                               String address, String businessHours, String facebookUrl, String instagramUrl,
                               String linkedinUrl, String tiktokUrl, String mapEmbedUrl, List<String> serviceAreas) {
        static SettingsView of(SiteSettings s) {
            return new SettingsView(s.getCompanyName(), s.getTagline(), s.getPhone(), s.getPhoneAlt(), s.getWhatsapp(), s.getEmail(),
                    s.getAddress(), s.getBusinessHours(), s.getFacebookUrl(), s.getInstagramUrl(),
                    s.getLinkedinUrl(), s.getTiktokUrl(), s.getMapEmbedUrl(), s.getServiceAreas());
        }
    }

    private static final String HTTPS_URL = "^$|^https://\\S+$";

    public record SettingsUpdate(
            @NotBlank @Size(max = 200) String companyName,
            @Size(max = 300) String tagline,
            @Size(max = 50) String phone,
            @Size(max = 50) String phoneAlt,
            @Pattern(regexp = "^$|^[1-9][0-9]{7,14}$", message = "international format digits only, e.g. 254712345678")
            String whatsapp,
            @Email @Size(max = 200) String email,
            @Size(max = 300) String address,
            @Size(max = 200) String businessHours,
            @Pattern(regexp = HTTPS_URL, message = "must be an https:// link") @Size(max = 300) String facebookUrl,
            @Pattern(regexp = HTTPS_URL, message = "must be an https:// link") @Size(max = 300) String instagramUrl,
            @Pattern(regexp = HTTPS_URL, message = "must be an https:// link") @Size(max = 300) String linkedinUrl,
            @Pattern(regexp = HTTPS_URL, message = "must be an https:// link") @Size(max = 300) String tiktokUrl,
            @Pattern(regexp = "^$|^https://www\\.google\\.com/maps/embed\\?\\S+$",
                     message = "must be a Google Maps embed link (https://www.google.com/maps/embed?...)")
            @Size(max = 1000) String mapEmbedUrl,
            @Size(max = 50) List<@NotBlank @Size(max = 100) String> serviceAreas) {}

    private final SiteSettingsRepository repo;

    public SiteSettingsController(SiteSettingsRepository repo) {
        this.repo = repo;
    }

    @GetMapping({"/api/public/settings", "/api/admin/settings"})
    SettingsView get() {
        return SettingsView.of(repo.get());
    }

    @PutMapping("/api/admin/settings")
    @Transactional
    SettingsView update(@Valid @RequestBody SettingsUpdate b) {
        SiteSettings s = repo.get();
        s.setCompanyName(b.companyName().trim());
        s.setTagline(b.tagline());
        s.setPhone(b.phone());
        s.setPhoneAlt(b.phoneAlt());
        s.setWhatsapp(b.whatsapp());
        s.setEmail(b.email());
        s.setAddress(b.address());
        s.setBusinessHours(b.businessHours());
        s.setFacebookUrl(b.facebookUrl());
        s.setInstagramUrl(b.instagramUrl());
        s.setLinkedinUrl(b.linkedinUrl());
        s.setTiktokUrl(b.tiktokUrl());
        s.setMapEmbedUrl(b.mapEmbedUrl());
        s.setServiceAreas(b.serviceAreas());
        return SettingsView.of(repo.saveAndFlush(s));
    }
}

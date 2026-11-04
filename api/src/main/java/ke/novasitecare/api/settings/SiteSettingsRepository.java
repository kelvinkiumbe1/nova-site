package ke.novasitecare.api.settings;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Integer> {
    default SiteSettings get() {
        return findById(1).orElseThrow(() -> new IllegalStateException("site_settings row missing"));
    }
}

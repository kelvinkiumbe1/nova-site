package ke.novasitecare.api.content;

import java.time.Instant;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class ServiceDtos {
    private ServiceDtos() {}

    public record ServiceView(Long id, String slug, String title, ServiceCategory category, String summary,
                              String body, List<String> highlights, String imageUrl, int sortOrder,
                              boolean featured, boolean published, String seoTitle, String seoDescription,
                              Instant updatedAt) {
        static ServiceView of(ServiceItem s) {
            return new ServiceView(s.getId(), s.getSlug(), s.getTitle(), s.getCategory(), s.getSummary(),
                    s.getBody(), s.getHighlights(), s.getImageUrl(), s.getSortOrder(), s.isFeatured(),
                    s.isPublished(), s.getSeoTitle(), s.getSeoDescription(), s.getUpdatedAt());
        }
    }

    public record ServiceUpsert(
            @Pattern(regexp = "^$|^[a-z0-9]+(-[a-z0-9]+)*$", message = "lowercase letters, numbers and dashes only")
            @Size(max = 120) String slug,
            @NotBlank @Size(max = 200) String title,
            @NotNull ServiceCategory category,
            @NotBlank @Size(max = 500) String summary,
            String body,
            @Size(max = 12) List<@NotBlank @Size(max = 200) String> highlights,
            @Size(max = 500) String imageUrl,
            int sortOrder,
            boolean featured,
            boolean published,
            @Size(max = 200) String seoTitle,
            @Size(max = 300) String seoDescription) {}
}

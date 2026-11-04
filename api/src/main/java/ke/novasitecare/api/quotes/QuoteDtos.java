package ke.novasitecare.api.quotes;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class QuoteDtos {
    private QuoteDtos() {}

    public record QuoteSubmission(
            @NotBlank @Size(max = 200) String fullName,
            @Size(max = 200) String company,
            @NotBlank @Pattern(regexp = "^\\+?[0-9 ()-]{9,20}$", message = "enter a valid phone number")
            String phone,
            @Email @Size(max = 200) String email,
            @Size(max = 120) String serviceSlug,
            @Size(max = 100) String propertyType,
            @NotBlank @Size(max = 300) String siteLocation,
            @Size(max = 100) String projectStage,
            @Size(max = 100) String sizeEstimate,
            LocalDate preferredDate,
            @Size(max = 4000) String message,
            /** Cloudflare Turnstile token from the browser widget. */
            @Size(max = 4096) String turnstileToken,
            /** Honeypot: hidden field real users never fill. */
            @Size(max = 200) String website) {}

    public record QuoteView(Long id, String fullName, String company, String phone, String email,
                            String serviceSlug, String propertyType, String siteLocation, String projectStage,
                            String sizeEstimate, LocalDate preferredDate, String message, QuoteStatus status,
                            String adminNotes, Instant createdAt, Instant updatedAt) {
        static QuoteView of(QuoteRequest q) {
            return new QuoteView(q.getId(), q.getFullName(), q.getCompany(), q.getPhone(), q.getEmail(),
                    q.getServiceSlug(), q.getPropertyType(), q.getSiteLocation(), q.getProjectStage(),
                    q.getSizeEstimate(), q.getPreferredDate(), q.getMessage(), q.getStatus(), q.getAdminNotes(),
                    q.getCreatedAt(), q.getUpdatedAt());
        }
    }

    public record QuoteUpdate(@NotNull QuoteStatus status, @Size(max = 4000) String adminNotes) {}

    public record QuoteStats(long newCount, long openCount, long lastSevenDays, long total) {}
}

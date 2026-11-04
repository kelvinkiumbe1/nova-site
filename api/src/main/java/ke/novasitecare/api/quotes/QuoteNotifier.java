package ke.novasitecare.api.quotes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/** Emails the Nova team when a new quote request arrives. Logs instead when mail isn't configured. */
@Component
public class QuoteNotifier {
    private static final Logger log = LoggerFactory.getLogger(QuoteNotifier.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String mailHost;
    private final String notifyEmail;
    private final String fromEmail;
    private final String siteUrl;

    public QuoteNotifier(ObjectProvider<JavaMailSender> mailSender,
                         @Value("${spring.mail.host:}") String mailHost,
                         @Value("${nova.quotes.notify-email:}") String notifyEmail,
                         @Value("${nova.quotes.from-email}") String fromEmail,
                         @Value("${nova.site-url}") String siteUrl) {
        this.mailSender = mailSender;
        this.mailHost = mailHost;
        this.notifyEmail = notifyEmail;
        this.fromEmail = fromEmail;
        this.siteUrl = siteUrl;
    }

    @Async
    public void newQuote(QuoteDtos.QuoteView q) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (mailHost.isBlank() || notifyEmail.isBlank() || sender == null) {
            log.info("New quote request #{} from {} ({}) - email notification not configured", q.id(),
                    q.fullName(), q.phone());
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(notifyEmail.split("\\s*,\\s*"));
        if (q.email() != null && !q.email().isBlank()) msg.setReplyTo(q.email());
        msg.setSubject("New quote request: " + q.fullName() + (q.company() != null ? " (" + q.company() + ")" : ""));
        msg.setText("""
                A new quotation request was submitted on the website.

                Name:          %s
                Company:       %s
                Phone:         %s
                Email:         %s
                Service:       %s
                Property type: %s
                Site location: %s
                Project stage: %s
                Size:          %s
                Preferred date:%s

                Message:
                %s

                Manage it in the admin dashboard: %s/admin/quotes/%d
                """.formatted(q.fullName(), nz(q.company()), q.phone(), nz(q.email()), nz(q.serviceSlug()),
                nz(q.propertyType()), q.siteLocation(), nz(q.projectStage()), nz(q.sizeEstimate()),
                q.preferredDate() == null ? " -" : " " + q.preferredDate(), nz(q.message()), siteUrl, q.id()));
        try {
            sender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send quote notification for #{}", q.id(), e);
        }
    }

    private static String nz(String s) {
        return s == null || s.isBlank() ? "-" : s;
    }
}

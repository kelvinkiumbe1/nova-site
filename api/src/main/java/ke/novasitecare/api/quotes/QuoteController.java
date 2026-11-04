package ke.novasitecare.api.quotes;

import java.time.Duration;
import java.time.Instant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import ke.novasitecare.api.common.BadRequestException;
import ke.novasitecare.api.common.ClientIp;
import ke.novasitecare.api.common.NotFoundException;
import ke.novasitecare.api.common.PageResponse;
import ke.novasitecare.api.common.TooManyRequestsException;
import ke.novasitecare.api.quotes.QuoteDtos.*;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class QuoteController {

    public record SubmissionAck(Long id) {}

    private final QuoteRequestRepository repo;
    private final SubmissionRateLimiter rateLimiter;
    private final TurnstileVerifier turnstile;
    private final QuoteNotifier notifier;

    public QuoteController(QuoteRequestRepository repo, SubmissionRateLimiter rateLimiter,
                           TurnstileVerifier turnstile, QuoteNotifier notifier) {
        this.repo = repo;
        this.rateLimiter = rateLimiter;
        this.turnstile = turnstile;
        this.notifier = notifier;
    }

    @PostMapping("/api/public/quotes")
    @ResponseStatus(HttpStatus.CREATED)
    SubmissionAck submit(@Valid @RequestBody QuoteSubmission b, HttpServletRequest request) {
        String ip = ClientIp.of(request);
        if (b.website() != null && !b.website().isBlank()) {
            return new SubmissionAck(null); // honeypot tripped: pretend success, store nothing
        }
        if (!rateLimiter.tryAcquire(ip)) {
            throw new TooManyRequestsException("Too many requests. Please call or WhatsApp us instead.");
        }
        if (!turnstile.verify(b.turnstileToken(), ip)) {
            throw new BadRequestException("Bot check failed. Please refresh the page and try again.");
        }
        QuoteRequest q = new QuoteRequest();
        q.setFullName(b.fullName().trim());
        q.setCompany(blankToNull(b.company()));
        q.setPhone(b.phone().trim());
        q.setEmail(blankToNull(b.email()));
        q.setServiceSlug(blankToNull(b.serviceSlug()));
        q.setPropertyType(blankToNull(b.propertyType()));
        q.setSiteLocation(b.siteLocation().trim());
        q.setProjectStage(blankToNull(b.projectStage()));
        q.setSizeEstimate(blankToNull(b.sizeEstimate()));
        q.setPreferredDate(b.preferredDate());
        q.setMessage(blankToNull(b.message()));
        q.setSourceIp(ip);
        QuoteRequest saved = repo.save(q);
        notifier.newQuote(QuoteView.of(saved));
        return new SubmissionAck(saved.getId());
    }

    @GetMapping("/api/admin/quotes")
    PageResponse<QuoteView> list(@RequestParam(required = false) QuoteStatus status,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "20") int size) {
        PageRequest pr = PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        var result = status == null ? repo.findAll(pr) : repo.findByStatus(status, pr);
        return PageResponse.of(result.map(QuoteView::of));
    }

    @GetMapping("/api/admin/quotes/stats")
    QuoteStats stats() {
        long open = repo.countByStatus(QuoteStatus.NEW) + repo.countByStatus(QuoteStatus.CONTACTED)
                + repo.countByStatus(QuoteStatus.QUOTED);
        return new QuoteStats(repo.countByStatus(QuoteStatus.NEW), open,
                repo.countByCreatedAtAfter(Instant.now().minus(Duration.ofDays(7))), repo.count());
    }

    @GetMapping("/api/admin/quotes/{id}")
    QuoteView get(@PathVariable Long id) {
        return QuoteView.of(find(id));
    }

    @PatchMapping("/api/admin/quotes/{id}")
    @Transactional
    QuoteView update(@PathVariable Long id, @Valid @RequestBody QuoteUpdate b) {
        QuoteRequest q = find(id);
        q.setStatus(b.status());
        q.setAdminNotes(blankToNull(b.adminNotes()));
        return QuoteView.of(repo.saveAndFlush(q));
    }

    @DeleteMapping("/api/admin/quotes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void delete(@PathVariable Long id) {
        repo.delete(find(id));
    }

    private QuoteRequest find(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Quote request"));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}

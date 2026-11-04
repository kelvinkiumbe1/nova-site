package ke.novasitecare.api.quotes;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
    Page<QuoteRequest> findByStatus(QuoteStatus status, Pageable pageable);
    long countByStatus(QuoteStatus status);
    long countByCreatedAtAfter(Instant since);
}

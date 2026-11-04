package ke.novasitecare.api.content;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByPublishedTrueOrderBySortOrderAscIdAsc();
    List<ServiceItem> findAllByOrderBySortOrderAscIdAsc();
    Optional<ServiceItem> findBySlugAndPublishedTrue(String slug);
}

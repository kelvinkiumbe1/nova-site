package ke.novasitecare.api.content;

import java.util.List;

import jakarta.validation.Valid;

import ke.novasitecare.api.common.NotFoundException;
import ke.novasitecare.api.common.Slugs;
import ke.novasitecare.api.content.ServiceDtos.ServiceUpsert;
import ke.novasitecare.api.content.ServiceDtos.ServiceView;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class ServiceController {
    private final ServiceRepository repo;

    public ServiceController(ServiceRepository repo) {
        this.repo = repo;
    }

    // ---- public ----

    @GetMapping("/api/public/services")
    List<ServiceView> publicList() {
        return repo.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(ServiceView::of).toList();
    }

    @GetMapping("/api/public/services/{slug}")
    ServiceView publicGet(@PathVariable String slug) {
        return repo.findBySlugAndPublishedTrue(slug).map(ServiceView::of)
                .orElseThrow(() -> new NotFoundException("Service"));
    }

    // ---- admin ----

    @GetMapping("/api/admin/services")
    List<ServiceView> adminList() {
        return repo.findAllByOrderBySortOrderAscIdAsc().stream().map(ServiceView::of).toList();
    }

    @GetMapping("/api/admin/services/{id}")
    ServiceView adminGet(@PathVariable Long id) {
        return ServiceView.of(find(id));
    }

    @PostMapping("/api/admin/services")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    ServiceView create(@Valid @RequestBody ServiceUpsert body) {
        return ServiceView.of(repo.save(apply(new ServiceItem(), body)));
    }

    @PutMapping("/api/admin/services/{id}")
    @Transactional
    ServiceView update(@PathVariable Long id, @Valid @RequestBody ServiceUpsert body) {
        return ServiceView.of(repo.saveAndFlush(apply(find(id), body)));
    }

    @DeleteMapping("/api/admin/services/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void delete(@PathVariable Long id) {
        repo.delete(find(id));
    }

    private ServiceItem find(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Service"));
    }

    private static ServiceItem apply(ServiceItem s, ServiceUpsert b) {
        s.setSlug(b.slug() == null || b.slug().isBlank() ? Slugs.slugify(b.title()) : b.slug());
        s.setTitle(b.title().trim());
        s.setCategory(b.category());
        s.setSummary(b.summary().trim());
        s.setBody(b.body());
        s.setHighlights(b.highlights());
        s.setImageUrl(b.imageUrl());
        s.setSortOrder(b.sortOrder());
        s.setFeatured(b.featured());
        s.setPublished(b.published());
        s.setSeoTitle(b.seoTitle());
        s.setSeoDescription(b.seoDescription());
        return s;
    }
}

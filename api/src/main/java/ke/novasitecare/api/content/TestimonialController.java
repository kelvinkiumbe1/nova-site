package ke.novasitecare.api.content;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import ke.novasitecare.api.common.NotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class TestimonialController {

    public record TestimonialView(Long id, String authorName, String authorRole, String company, String quote,
                                  int sortOrder, boolean published) {
        static TestimonialView of(Testimonial t) {
            return new TestimonialView(t.getId(), t.getAuthorName(), t.getAuthorRole(), t.getCompany(),
                    t.getQuote(), t.getSortOrder(), t.isPublished());
        }
    }

    public record TestimonialUpsert(@NotBlank @Size(max = 200) String authorName,
                                    @Size(max = 200) String authorRole,
                                    @Size(max = 200) String company,
                                    @NotBlank @Size(max = 2000) String quote,
                                    int sortOrder,
                                    boolean published) {}

    private final TestimonialRepository repo;

    public TestimonialController(TestimonialRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/api/public/testimonials")
    List<TestimonialView> publicList() {
        return repo.findByPublishedTrueOrderBySortOrderAscIdAsc().stream().map(TestimonialView::of).toList();
    }

    @GetMapping("/api/admin/testimonials")
    List<TestimonialView> adminList() {
        return repo.findAllByOrderBySortOrderAscIdAsc().stream().map(TestimonialView::of).toList();
    }

    @PostMapping("/api/admin/testimonials")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    TestimonialView create(@Valid @RequestBody TestimonialUpsert body) {
        return TestimonialView.of(repo.save(apply(new Testimonial(), body)));
    }

    @PutMapping("/api/admin/testimonials/{id}")
    @Transactional
    TestimonialView update(@PathVariable Long id, @Valid @RequestBody TestimonialUpsert body) {
        return TestimonialView.of(apply(find(id), body));
    }

    @DeleteMapping("/api/admin/testimonials/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void delete(@PathVariable Long id) {
        repo.delete(find(id));
    }

    private Testimonial find(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Testimonial"));
    }

    private static Testimonial apply(Testimonial t, TestimonialUpsert b) {
        t.setAuthorName(b.authorName().trim());
        t.setAuthorRole(b.authorRole());
        t.setCompany(b.company());
        t.setQuote(b.quote().trim());
        t.setSortOrder(b.sortOrder());
        t.setPublished(b.published());
        return t;
    }
}

package ke.novasitecare.api.projects;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import ke.novasitecare.api.common.NotFoundException;
import ke.novasitecare.api.common.Slugs;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectController {

    public record ProjectView(Long id, String slug, String title, String location, String serviceSlug,
                              String description, String coverImageUrl, String beforeImageUrl,
                              String afterImageUrl, List<String> gallery, LocalDate completedOn,
                              boolean featured, boolean published, Instant updatedAt) {
        static ProjectView of(Project p) {
            return new ProjectView(p.getId(), p.getSlug(), p.getTitle(), p.getLocation(), p.getServiceSlug(),
                    p.getDescription(), p.getCoverImageUrl(), p.getBeforeImageUrl(), p.getAfterImageUrl(),
                    p.getGallery(), p.getCompletedOn(), p.isFeatured(), p.isPublished(), p.getUpdatedAt());
        }
    }

    public record ProjectUpsert(
            @Pattern(regexp = "^$|^[a-z0-9]+(-[a-z0-9]+)*$", message = "lowercase letters, numbers and dashes only")
            @Size(max = 120) String slug,
            @NotBlank @Size(max = 200) String title,
            @Size(max = 200) String location,
            @Size(max = 120) String serviceSlug,
            String description,
            @Size(max = 500) String coverImageUrl,
            @Size(max = 500) String beforeImageUrl,
            @Size(max = 500) String afterImageUrl,
            @Size(max = 40) List<@NotBlank @Size(max = 500) String> gallery,
            LocalDate completedOn,
            boolean featured,
            boolean published) {}

    private final ProjectRepository repo;

    public ProjectController(ProjectRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/api/public/projects")
    List<ProjectView> publicList() {
        return repo.findPublished().stream().map(ProjectView::of).toList();
    }

    @GetMapping("/api/public/projects/{slug}")
    ProjectView publicGet(@PathVariable String slug) {
        return repo.findBySlugAndPublishedTrue(slug).map(ProjectView::of)
                .orElseThrow(() -> new NotFoundException("Project"));
    }

    @GetMapping("/api/admin/projects")
    List<ProjectView> adminList() {
        return repo.findAllForAdmin().stream().map(ProjectView::of).toList();
    }

    @GetMapping("/api/admin/projects/{id}")
    ProjectView adminGet(@PathVariable Long id) {
        return ProjectView.of(find(id));
    }

    @PostMapping("/api/admin/projects")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    ProjectView create(@Valid @RequestBody ProjectUpsert body) {
        return ProjectView.of(repo.save(apply(new Project(), body)));
    }

    @PutMapping("/api/admin/projects/{id}")
    @Transactional
    ProjectView update(@PathVariable Long id, @Valid @RequestBody ProjectUpsert body) {
        return ProjectView.of(repo.saveAndFlush(apply(find(id), body)));
    }

    @DeleteMapping("/api/admin/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    void delete(@PathVariable Long id) {
        repo.delete(find(id));
    }

    private Project find(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Project"));
    }

    private static Project apply(Project p, ProjectUpsert b) {
        p.setSlug(b.slug() == null || b.slug().isBlank() ? Slugs.slugify(b.title()) : b.slug());
        p.setTitle(b.title().trim());
        p.setLocation(b.location());
        p.setServiceSlug(b.serviceSlug());
        p.setDescription(b.description());
        p.setCoverImageUrl(b.coverImageUrl());
        p.setBeforeImageUrl(b.beforeImageUrl());
        p.setAfterImageUrl(b.afterImageUrl());
        p.setGallery(b.gallery());
        p.setCompletedOn(b.completedOn());
        p.setFeatured(b.featured());
        p.setPublished(b.published());
        return p;
    }
}

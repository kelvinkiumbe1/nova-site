package ke.novasitecare.api.projects;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select p from Project p where p.published = true order by p.featured desc, p.completedOn desc nulls last, p.id desc")
    List<Project> findPublished();

    @Query("select p from Project p order by p.updatedAt desc nulls last, p.id desc")
    List<Project> findAllForAdmin();

    Optional<Project> findBySlugAndPublishedTrue(String slug);
}

package ke.novasitecare.api.media;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    @Query("select m from MediaAsset m order by m.id desc")
    Page<MediaAsset> findLatest(Pageable pageable);

    List<MediaAsset> findByShowInGalleryTrueOrderBySortOrderAscIdDesc();
}

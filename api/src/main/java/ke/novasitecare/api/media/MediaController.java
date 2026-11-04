package ke.novasitecare.api.media;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import ke.novasitecare.api.common.BadRequestException;
import ke.novasitecare.api.common.NotFoundException;
import ke.novasitecare.api.common.PageResponse;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class MediaController {

    public record MediaView(Long id, String url, String contentType, Integer width, Integer height, long sizeBytes,
                            String originalName, String altText, String caption, boolean showInGallery,
                            int sortOrder, Instant createdAt) {
        static MediaView of(MediaAsset m) {
            return new MediaView(m.getId(), m.getUrl(), m.getContentType(), m.getWidth(), m.getHeight(),
                    m.getSizeBytes(), m.getOriginalName(), m.getAltText(), m.getCaption(), m.isShowInGallery(),
                    m.getSortOrder(), m.getCreatedAt());
        }
    }

    public record GalleryItem(Long id, String url, String altText, String caption, Integer width, Integer height) {}

    public record MediaUpdate(@Size(max = 300) String altText, @Size(max = 300) String caption,
                              boolean showInGallery, int sortOrder) {}

    private final MediaAssetRepository repo;
    private final MediaStorage storage;
    private final ImageProcessor images;
    private final MediaUsage usage;

    public MediaController(MediaAssetRepository repo, MediaStorage storage, ImageProcessor images, MediaUsage usage) {
        this.repo = repo;
        this.storage = storage;
        this.images = images;
        this.usage = usage;
    }

    @GetMapping("/api/public/gallery")
    List<GalleryItem> gallery() {
        return repo.findByShowInGalleryTrueOrderBySortOrderAscIdDesc().stream()
                .map(m -> new GalleryItem(m.getId(), m.getUrl(), m.getAltText(), m.getCaption(), m.getWidth(),
                        m.getHeight()))
                .toList();
    }

    @GetMapping("/api/admin/media")
    PageResponse<MediaView> list(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "48") int size) {
        return PageResponse.of(repo.findLatest(PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, 100)))
                .map(MediaView::of));
    }

    @PostMapping(value = "/api/admin/media", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    MediaView upload(@RequestParam("file") MultipartFile file,
                     @RequestParam(value = "altText", required = false) String altText) throws IOException {
        if (file.isEmpty()) throw new BadRequestException("The file is empty.");
        ImageProcessor.Processed img = images.process(file.getBytes());
        LocalDate d = LocalDate.now();
        String key = "%d/%02d/%s.%s".formatted(d.getYear(), d.getMonthValue(), UUID.randomUUID(), img.extension());
        String url = storage.put(key, img.data(), img.contentType());
        String name = file.getOriginalFilename();
        MediaAsset asset = new MediaAsset(key, url, img.contentType(), img.width(), img.height(), img.data().length,
                name == null ? null : name.substring(0, Math.min(name.length(), 300)));
        asset.setAltText(altText == null || altText.isBlank() ? null : altText.trim());
        try {
            return MediaView.of(repo.save(asset));
        } catch (RuntimeException e) {
            storage.delete(key); // don't leave orphaned files if the DB write fails
            throw e;
        }
    }

    @PatchMapping("/api/admin/media/{id}")
    @Transactional
    MediaView update(@PathVariable Long id, @Valid @RequestBody MediaUpdate b) {
        MediaAsset m = find(id);
        m.setAltText(b.altText() == null || b.altText().isBlank() ? null : b.altText().trim());
        m.setCaption(b.caption() == null || b.caption().isBlank() ? null : b.caption().trim());
        m.setShowInGallery(b.showInGallery());
        m.setSortOrder(b.sortOrder());
        return MediaView.of(m);
    }

    @DeleteMapping("/api/admin/media/{id}")
    @Transactional
    ResponseEntity<?> delete(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean force) {
        MediaAsset m = find(id);
        List<String> uses = usage.whereUsed(m.getUrl());
        if (!uses.isEmpty() && !force) {
            ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
                    "This image is still used on the website.");
            pd.setProperty("usedBy", uses);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
        }
        repo.delete(m);
        storage.delete(m.getStorageKey());
        return ResponseEntity.noContent().build();
    }

    private MediaAsset find(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Image"));
    }
}

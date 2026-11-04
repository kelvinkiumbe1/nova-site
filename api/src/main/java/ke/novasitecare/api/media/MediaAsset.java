package ke.novasitecare.api.media;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "media_asset")
public class MediaAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String storageKey;
    private String url;
    private String contentType;
    private Integer width;
    private Integer height;
    private long sizeBytes;
    private String originalName;
    private String altText;
    private String caption;
    private boolean showInGallery;
    private int sortOrder;
    @Column(insertable = false, updatable = false)
    private Instant createdAt;

    protected MediaAsset() {}

    public MediaAsset(String storageKey, String url, String contentType, Integer width, Integer height,
                      long sizeBytes, String originalName) {
        this.storageKey = storageKey;
        this.url = url;
        this.contentType = contentType;
        this.width = width;
        this.height = height;
        this.sizeBytes = sizeBytes;
        this.originalName = originalName;
    }

    public Long getId() { return id; }
    public String getStorageKey() { return storageKey; }
    public String getUrl() { return url; }
    public String getContentType() { return contentType; }
    public Integer getWidth() { return width; }
    public Integer getHeight() { return height; }
    public long getSizeBytes() { return sizeBytes; }
    public String getOriginalName() { return originalName; }
    public String getAltText() { return altText; }
    public void setAltText(String v) { altText = v; }
    public String getCaption() { return caption; }
    public void setCaption(String v) { caption = v; }
    public boolean isShowInGallery() { return showInGallery; }
    public void setShowInGallery(boolean v) { showInGallery = v; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int v) { sortOrder = v; }
    public Instant getCreatedAt() { return createdAt; }
}

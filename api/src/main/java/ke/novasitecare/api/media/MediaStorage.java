package ke.novasitecare.api.media;

/** Where uploaded images live. Local disk in dev, Cloudflare R2 (S3 API) in production. */
public interface MediaStorage {
    /** Stores the bytes under the key and returns the public URL. */
    String put(String key, byte[] data, String contentType);

    void delete(String key);
}

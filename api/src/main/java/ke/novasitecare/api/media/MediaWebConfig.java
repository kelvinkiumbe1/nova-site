package ke.novasitecare.api.media;

import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MediaWebConfig implements WebMvcConfigurer {
    private final MediaStorage storage;

    public MediaWebConfig(MediaStorage storage) {
        this.storage = storage;
    }

    @Bean
    static MediaStorage mediaStorage(@Value("${nova.storage.type}") String type,
                                     @Value("${nova.storage.local-dir}") String localDir,
                                     @Value("${nova.storage.s3.endpoint}") String endpoint,
                                     @Value("${nova.storage.s3.region}") String region,
                                     @Value("${nova.storage.s3.bucket}") String bucket,
                                     @Value("${nova.storage.s3.access-key}") String accessKey,
                                     @Value("${nova.storage.s3.secret-key}") String secretKey,
                                     @Value("${nova.storage.s3.public-base-url}") String publicBaseUrl) {
        if ("s3".equalsIgnoreCase(type)) {
            if (endpoint.isBlank() || bucket.isBlank() || accessKey.isBlank() || secretKey.isBlank()
                    || publicBaseUrl.isBlank()) {
                throw new IllegalStateException("STORAGE_TYPE=s3 requires S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, "
                        + "S3_SECRET_KEY and S3_PUBLIC_BASE_URL");
            }
            return new S3MediaStorage(endpoint, region, bucket, accessKey, secretKey, publicBaseUrl);
        }
        return new LocalMediaStorage(Path.of(localDir));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (storage instanceof LocalMediaStorage local) {
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations(local.root().toUri().toString() + "/")
                    .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable());
        }
    }
}

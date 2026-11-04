package ke.novasitecare.api.media;

import java.net.URI;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

/** S3-compatible storage (Cloudflare R2 in production). Files are served from the bucket's public URL. */
public class S3MediaStorage implements MediaStorage {
    private final S3Client s3;
    private final String bucket;
    private final String publicBaseUrl;

    public S3MediaStorage(String endpoint, String region, String bucket, String accessKey, String secretKey,
                          String publicBaseUrl) {
        this.s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .build();
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl.replaceAll("/+$", "");
    }

    @Override
    public String put(String key, byte[] data, String contentType) {
        s3.putObject(b -> b.bucket(bucket).key(key).contentType(contentType)
                        .cacheControl("public, max-age=31536000, immutable"),
                RequestBody.fromBytes(data));
        return publicBaseUrl + "/" + key;
    }

    @Override
    public void delete(String key) {
        s3.deleteObject(b -> b.bucket(bucket).key(key));
    }
}

package ke.novasitecare.api.media;

import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/** Finds where an image URL is used, so admins don't delete a picture that's still on the site. */
@Component
public class MediaUsage {
    private final JdbcClient jdbc;

    public MediaUsage(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<String> whereUsed(String url) {
        List<String> uses = new ArrayList<>();
        jdbc.sql("select title from service where image_url = :u").param("u", url)
                .query(String.class).list().forEach(t -> uses.add("Service: " + t));
        jdbc.sql("""
                select title from project
                where cover_image_url = :u or before_image_url = :u or after_image_url = :u or :u = any(gallery)
                """).param("u", url)
                .query(String.class).list().forEach(t -> uses.add("Project: " + t));
        return uses;
    }
}

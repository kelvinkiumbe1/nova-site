package ke.novasitecare.api.common;

import java.text.Normalizer;
import java.util.Locale;

public final class Slugs {
    private Slugs() {}

    public static String slugify(String input) {
        String s = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return s.isEmpty() ? "item" : s;
    }
}

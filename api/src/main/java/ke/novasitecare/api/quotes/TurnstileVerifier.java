package ke.novasitecare.api.quotes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** Verifies Cloudflare Turnstile tokens. Disabled (always passes) when TURNSTILE_SECRET is unset, e.g. in dev. */
@Component
public class TurnstileVerifier {
    private static final Logger log = LoggerFactory.getLogger(TurnstileVerifier.class);
    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    record VerifyResponse(boolean success) {}

    private final String secret;
    private final RestClient http;

    public TurnstileVerifier(@Value("${nova.turnstile.secret:}") String secret) {
        this.secret = secret;
        this.http = RestClient.create();
        if (secret.isBlank()) log.warn("TURNSTILE_SECRET not set: quote form bot protection is DISABLED");
    }

    public boolean verify(String token, String ip) {
        if (secret.isBlank()) return true;
        if (token == null || token.isBlank()) return false;
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("secret", secret);
        form.add("response", token);
        form.add("remoteip", ip);
        try {
            VerifyResponse r = http.post().uri(VERIFY_URL)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(VerifyResponse.class);
            return r != null && r.success();
        } catch (Exception e) {
            log.error("Turnstile verification failed", e);
            return false;
        }
    }
}

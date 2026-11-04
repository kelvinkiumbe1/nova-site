package ke.novasitecare.api.common;

import jakarta.servlet.http.HttpServletRequest;

public final class ClientIp {
    private ClientIp() {}

    /**
     * Real client IP. CF-Connecting-IP is only trustworthy if the origin accepts traffic from
     * Cloudflare alone (enforced in the production Caddy/firewall config).
     */
    public static String of(HttpServletRequest request) {
        String cf = request.getHeader("CF-Connecting-IP");
        return (cf != null && !cf.isBlank()) ? cf : request.getRemoteAddr();
    }
}

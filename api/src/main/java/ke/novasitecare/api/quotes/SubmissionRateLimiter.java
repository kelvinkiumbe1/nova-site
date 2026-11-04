package ke.novasitecare.api.quotes;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Simple in-memory sliding-window limiter: at most MAX submissions per IP per WINDOW. */
@Component
public class SubmissionRateLimiter {
    static final int MAX = 5;
    static final Duration WINDOW = Duration.ofMinutes(15);

    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public boolean tryAcquire(String ip) {
        Instant now = Instant.now();
        Deque<Instant> q = hits.computeIfAbsent(ip, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && q.peekFirst().isBefore(now.minus(WINDOW))) q.pollFirst();
            if (q.size() >= MAX) return false;
            q.addLast(now);
            return true;
        }
    }

    @Scheduled(fixedDelay = 30 * 60 * 1000)
    void evictIdle() {
        Instant cutoff = Instant.now().minus(WINDOW);
        hits.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                Instant last = e.getValue().peekLast();
                return last == null || last.isBefore(cutoff);
            }
        });
    }
}

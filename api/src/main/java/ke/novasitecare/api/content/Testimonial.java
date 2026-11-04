package ke.novasitecare.api.content;

import java.time.Instant;

import jakarta.persistence.*;

@Entity
@Table(name = "testimonial")
public class Testimonial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String authorName;
    private String authorRole;
    private String company;
    private String quote;
    private int sortOrder;
    private boolean published = true;
    @Column(insertable = false, updatable = false)
    private Instant createdAt;

    public Long getId() { return id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}

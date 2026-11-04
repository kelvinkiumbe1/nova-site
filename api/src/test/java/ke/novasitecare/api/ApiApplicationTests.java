package ke.novasitecare.api;

import static org.assertj.core.api.Assertions.assertThat;

import ke.novasitecare.api.quotes.QuoteRequestRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class ApiApplicationTests {

    @Autowired MockMvc mvc;
    @Autowired QuoteRequestRepository quotes;

    @Test
    void seededServicesArePublic() throws Exception {
        mvc.perform(get("/api/public/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(9))
                .andExpect(jsonPath("$[0].category").value("CONSTRUCTION"));
    }

    @Test
    void quoteSubmissionIsStored() throws Exception {
        long before = quotes.count();
        mvc.perform(post("/api/public/quotes").contentType(MediaType.APPLICATION_JSON).content("""
                {"fullName":"Test Client","phone":"0712345678","siteLocation":"Karen"}"""))
                .andExpect(status().isCreated());
        assertThat(quotes.count()).isEqualTo(before + 1);
    }

    @Test
    void honeypotSubmissionIsDropped() throws Exception {
        long before = quotes.count();
        mvc.perform(post("/api/public/quotes").contentType(MediaType.APPLICATION_JSON).content("""
                {"fullName":"Bot","phone":"0712345678","siteLocation":"X","website":"spam.example"}"""))
                .andExpect(status().isCreated());
        assertThat(quotes.count()).isEqualTo(before);
    }

    @Test
    void invalidQuoteIsRejected() throws Exception {
        mvc.perform(post("/api/public/quotes").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").exists());
    }

    @Test
    void emptySlugIsGeneratedFromTitle() throws Exception {
        mvc.perform(post("/api/admin/projects").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Westlands Tower Handover\",\"slug\":\"\"}")
                        .with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("westlands-tower-handover"));
    }

    @Test
    void adminEndpointsRequireLogin() throws Exception {
        mvc.perform(get("/api/admin/quotes")).andExpect(status().isUnauthorized());
    }
}

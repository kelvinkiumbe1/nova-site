package ke.novasitecare.api.media;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ke.novasitecare.api.TestcontainersConfiguration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import com.jayway.jsonpath.JsonPath;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(properties = "nova.storage.local-dir=target/test-uploads")
@AutoConfigureMockMvc
class MediaApiTest {
    @Autowired MockMvc mvc;

    @Test
    void uploadShowInGalleryAndProtectInUseImages() throws Exception {
        var file = new MockMultipartFile("file", "site.png", "image/png", ImageProcessorTest.png(300, 200, false));
        String body = mvc.perform(multipart("/api/admin/media").file(file).param("altText", "Team at work")
                        .with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentType").value("image/jpeg"))
                .andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(body, "$.id");
        String url = JsonPath.read(body, "$.url");

        mvc.perform(get(url)).andExpect(status().isOk());

        mvc.perform(patch("/api/admin/media/" + id).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"altText\":\"Team at work\",\"showInGallery\":true}")
                        .with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isOk());
        mvc.perform(get("/api/public/gallery")).andExpect(jsonPath("$[?(@.id == " + id + ")]").exists());

        mvc.perform(post("/api/admin/projects").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Media test project\",\"coverImageUrl\":\"" + url + "\"}")
                        .with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isCreated());

        mvc.perform(delete("/api/admin/media/" + id).with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.usedBy[0]").value("Project: Media test project"));
        mvc.perform(delete("/api/admin/media/" + id).param("force", "true")
                        .with(user("a@b.c").roles("ADMIN")).with(csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get(url)).andExpect(status().isNotFound());
    }

    @Test
    void uploadRequiresAdmin() throws Exception {
        var file = new MockMultipartFile("file", "x.png", "image/png", ImageProcessorTest.png(10, 10, false));
        mvc.perform(multipart("/api/admin/media").file(file).with(csrf())).andExpect(status().isUnauthorized());
    }
}

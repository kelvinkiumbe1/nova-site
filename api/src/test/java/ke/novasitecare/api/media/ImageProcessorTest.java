package ke.novasitecare.api.media;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import javax.imageio.ImageIO;

import ke.novasitecare.api.common.BadRequestException;

import org.junit.jupiter.api.Test;

class ImageProcessorTest {
    private final ImageProcessor processor = new ImageProcessor();

    static byte[] png(int w, int h, boolean transparent) throws Exception {
        BufferedImage img = new BufferedImage(w, h, transparent ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
        var g = img.createGraphics();
        g.setColor(transparent ? new Color(0, 0, 0, 0) : Color.ORANGE);
        g.fillRect(0, 0, w, h);
        g.dispose();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(img, "png", out);
        return out.toByteArray();
    }

    @Test
    void largeOpaqueImageIsScaledAndConvertedToJpeg() throws Exception {
        var r = processor.process(png(4800, 3200, false));
        assertThat(r.contentType()).isEqualTo("image/jpeg");
        assertThat(r.width()).isEqualTo(2400);
        assertThat(r.height()).isEqualTo(1600);
        BufferedImage decoded = ImageIO.read(new ByteArrayInputStream(r.data()));
        assertThat(decoded.getWidth()).isEqualTo(2400);
    }

    @Test
    void transparentImageStaysPng() throws Exception {
        var r = processor.process(png(200, 100, true));
        assertThat(r.contentType()).isEqualTo("image/png");
        assertThat(r.width()).isEqualTo(200);
    }

    @Test
    void exifRotationSwapsDimensionsAndMovesPixels() {
        BufferedImage img = new BufferedImage(40, 20, BufferedImage.TYPE_INT_RGB);
        img.setRGB(0, 0, Color.RED.getRGB()); // top-left marker
        BufferedImage rotated = ImageProcessor.applyOrientation(img, 6); // 90° clockwise
        assertThat(rotated.getWidth()).isEqualTo(20);
        assertThat(rotated.getHeight()).isEqualTo(40);
        assertThat(rotated.getRGB(19, 0)).isEqualTo(Color.RED.getRGB()); // now top-right
        BufferedImage ccw = ImageProcessor.applyOrientation(img, 8);
        assertThat(ccw.getRGB(0, 39)).isEqualTo(Color.RED.getRGB()); // now bottom-left
        BufferedImage flipped = ImageProcessor.applyOrientation(img, 3);
        assertThat(flipped.getRGB(39, 19)).isEqualTo(Color.RED.getRGB());
    }

    @Test
    void rejectsNonImages() {
        assertThatThrownBy(() -> processor.process("not an image at all".getBytes()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void rejectsHeicWithHelpfulMessage() {
        byte[] heic = new byte[32];
        System.arraycopy("\0\0\0\u0018ftypheic".getBytes(), 0, heic, 0, 12);
        assertThatThrownBy(() -> processor.process(heic)).hasMessageContaining("HEIC");
    }
}

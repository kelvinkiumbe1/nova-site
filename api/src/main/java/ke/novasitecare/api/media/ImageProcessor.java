package ke.novasitecare.api.media;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;

import ke.novasitecare.api.common.BadRequestException;

import org.springframework.stereotype.Component;

/**
 * Validates uploads and prepares them for the web: applies the phone camera's EXIF rotation, scales large
 * photos down, re-encodes as JPEG (or PNG when transparent) and thereby strips metadata such as GPS location.
 */
@Component
public class ImageProcessor {
    static final int MAX_EDGE = 2400;
    static final long MAX_PIXELS = 60_000_000L;
    static final float JPEG_QUALITY = 0.85f;

    public record Processed(byte[] data, String contentType, String extension, Integer width, Integer height) {}

    public Processed process(byte[] input) {
        if (isWebp(input)) {
            // Java can't decode WebP; it's already web-optimised, so store as uploaded.
            return new Processed(input, "image/webp", "webp", null, null);
        }
        if (isHeic(input)) {
            throw new BadRequestException("HEIC photos aren't supported. On iPhone, set Camera > Formats to "
                    + "'Most Compatible', or export the photo as JPEG.");
        }
        BufferedImage img = decode(input);
        img = applyOrientation(img, exifOrientation(input));
        img = scaleDown(img, MAX_EDGE);
        boolean alpha = img.getColorModel().hasAlpha() && hasTransparency(img);
        try {
            if (alpha) {
                return new Processed(encodePng(img), "image/png", "png", img.getWidth(), img.getHeight());
            }
            return new Processed(encodeJpeg(toRgb(img)), "image/jpeg", "jpg", img.getWidth(), img.getHeight());
        } catch (IOException e) {
            throw new BadRequestException("Could not process this image.");
        }
    }

    private static BufferedImage decode(byte[] input) {
        try (ImageInputStream in = ImageIO.createImageInputStream(new ByteArrayInputStream(input))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
            if (in == null || !readers.hasNext()) {
                throw new BadRequestException("Unsupported file. Please upload a JPEG, PNG or WebP image.");
            }
            ImageReader reader = readers.next();
            try {
                String format = reader.getFormatName().toLowerCase();
                if (!format.equals("jpeg") && !format.equals("png")) {
                    throw new BadRequestException("Unsupported file. Please upload a JPEG, PNG or WebP image.");
                }
                reader.setInput(in, true, true);
                // Check dimensions before decoding to avoid memory exhaustion ("decompression bombs").
                if ((long) reader.getWidth(0) * reader.getHeight(0) > MAX_PIXELS) {
                    throw new BadRequestException("Image dimensions are too large.");
                }
                return reader.read(0);
            } finally {
                reader.dispose();
            }
        } catch (IOException e) {
            throw new BadRequestException("This file couldn't be read as an image.");
        }
    }

    private static int exifOrientation(byte[] input) {
        try {
            Metadata md = ImageMetadataReader.readMetadata(new ByteArrayInputStream(input));
            ExifIFD0Directory dir = md.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if (dir != null && dir.containsTag(ExifIFD0Directory.TAG_ORIENTATION)) {
                return dir.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            }
        } catch (Exception ignored) {
            // no/invalid EXIF: treat as upright
        }
        return 1;
    }

    static BufferedImage applyOrientation(BufferedImage img, int orientation) {
        if (orientation <= 1 || orientation > 8) return img;
        int w = img.getWidth(), h = img.getHeight();
        boolean swap = orientation >= 5;
        AffineTransform t = new AffineTransform();
        switch (orientation) {
            case 2 -> { t.translate(w, 0); t.scale(-1, 1); }
            case 3 -> { t.translate(w, h); t.rotate(Math.PI); }
            case 4 -> { t.translate(0, h); t.scale(1, -1); }
            case 5 -> { t.rotate(Math.PI / 2); t.scale(1, -1); }
            case 6 -> { t.translate(h, 0); t.rotate(Math.PI / 2); }
            case 7 -> { t.scale(-1, 1); t.translate(-h, w); t.rotate(-Math.PI / 2); }
            case 8 -> { t.translate(0, w); t.rotate(-Math.PI / 2); }
            default -> { return img; }
        }
        BufferedImage out = new BufferedImage(swap ? h : w, swap ? w : h, imageType(img));
        Graphics2D g = out.createGraphics();
        g.drawImage(img, t, null);
        g.dispose();
        return out;
    }

    /** Progressive halving then a final bicubic step: good quality without extra libraries. */
    static BufferedImage scaleDown(BufferedImage img, int maxEdge) {
        int w = img.getWidth(), h = img.getHeight();
        if (Math.max(w, h) <= maxEdge) return img;
        double scale = (double) maxEdge / Math.max(w, h);
        int tw = Math.max(1, (int) Math.round(w * scale)), th = Math.max(1, (int) Math.round(h * scale));
        BufferedImage cur = img;
        while (cur.getWidth() / 2 >= tw && cur.getHeight() / 2 >= th) {
            cur = resize(cur, cur.getWidth() / 2, cur.getHeight() / 2);
        }
        return resize(cur, tw, th);
    }

    private static BufferedImage resize(BufferedImage src, int w, int h) {
        BufferedImage out = new BufferedImage(w, h, imageType(src));
        Graphics2D g = out.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.drawImage(src, 0, 0, w, h, null);
        g.dispose();
        return out;
    }

    private static int imageType(BufferedImage img) {
        return img.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
    }

    private static boolean hasTransparency(BufferedImage img) {
        int step = Math.max(1, Math.min(img.getWidth(), img.getHeight()) / 64);
        for (int y = 0; y < img.getHeight(); y += step)
            for (int x = 0; x < img.getWidth(); x += step)
                if ((img.getRGB(x, y) >>> 24) != 0xFF) return true;
        return false;
    }

    private static BufferedImage toRgb(BufferedImage img) {
        if (img.getType() == BufferedImage.TYPE_INT_RGB) return img;
        BufferedImage out = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, img.getWidth(), img.getHeight());
        g.drawImage(img, 0, 0, null);
        g.dispose();
        return out;
    }

    private static byte[] encodeJpeg(BufferedImage img) throws IOException {
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try (ImageOutputStream out = ImageIO.createImageOutputStream(bos)) {
            writer.setOutput(out);
            ImageWriteParam p = writer.getDefaultWriteParam();
            p.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            p.setCompressionQuality(JPEG_QUALITY);
            p.setProgressiveMode(ImageWriteParam.MODE_DEFAULT);
            writer.write(null, new IIOImage(img, null, null), p);
        } finally {
            writer.dispose();
        }
        return bos.toByteArray();
    }

    private static byte[] encodePng(BufferedImage img) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", bos);
        return bos.toByteArray();
    }

    private static boolean isWebp(byte[] b) {
        return b.length > 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
    }

    private static boolean isHeic(byte[] b) {
        if (b.length < 12 || b[4] != 'f' || b[5] != 't' || b[6] != 'y' || b[7] != 'p') return false;
        String brand = new String(b, 8, 4, java.nio.charset.StandardCharsets.US_ASCII);
        return brand.startsWith("hei") || brand.startsWith("hev") || brand.equals("mif1") || brand.equals("msf1");
    }
}

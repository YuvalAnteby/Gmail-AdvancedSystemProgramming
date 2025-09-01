package com.asp.android_app.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import android.util.Pair;
import android.widget.ImageView;

import androidx.core.content.FileProvider;

import com.asp.android_app.R;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/**
 * Util class for handling conversion of files to and from Base64 string format.
 * Used when uploading and downloading files from the backend.
 */
public class Base64Converter {

    /**
     * Converts a file to base64 string
     *
     * @param uri     uri of a file
     * @param context context called from
     * @return string in base64 format, if an error occurred will return empty string
     */
    public static String fileUriToBase64(Uri uri, Context context) {
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            byte[] fileBytes = readAllBytes(inputStream);

            // Detect file type from URI
            String mimeType = context.getContentResolver().getType(uri);
            if (mimeType == null) {
                mimeType = "image/jpeg"; // fallback
            }

            String base64Data = Base64.encodeToString(fileBytes, Base64.NO_WRAP);
            return "data:" + mimeType + ";base64," + base64Data; // ✅ data URI format
        } catch (Exception e) {
            Log.i("fileUriToBase64", Objects.requireNonNull(e.getMessage()));
            return "";
        }
    }

    // Helper method (safe for small files)
    private static byte[] readAllBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[4096];

        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }

        buffer.flush();
        return buffer.toByteArray();
    }

    public String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
        byte[] imageBytes = outputStream.toByteArray();
        return Base64.encodeToString(imageBytes, Base64.DEFAULT);
    }

    /**
     * Converts a string of Base64 format to a Bitmap to show as an image in the image view
     *
     * @param base64String string in Base64 format
     * @param imageView    image view to show the image in
     */
    public static void displayBase64Image(String base64String, ImageView imageView) {
        if (base64String == null || base64String.isEmpty()) return;

        try {
            // Strip prefix if it exists (e.g. "data:image/jpeg;base64,...")
            if (base64String.contains(",")) {
                base64String = base64String.substring(base64String.indexOf(",") + 1);
            }

            byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);
            Bitmap decodedBitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

            if (decodedBitmap != null) {
                imageView.setImageBitmap(decodedBitmap);
                Log.i("Base64Display", "Given photo set");
            } else {
                Log.e("Base64Display", "Failed to decode Base64 image");
            }
        } catch (Exception e) {
            Log.e("Base64Display", "Exception while decoding image: " + e.getMessage());
        }
    }


    /**
     * Parses a base64 Data URL string (e.g. data:image/png;base64,...) into MIME and byte array
     */
    public static Pair<String, byte[]> parseBase64Data(String dataUrl) {
        try {
            String[] parts = dataUrl.split(",");
            if (parts.length != 2) return null;

            String meta = parts[0]; // e.g., "data:image/jpeg;base64"
            String base64 = parts[1];

            String mimeType = meta.substring(meta.indexOf(":") + 1, meta.indexOf(";"));
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);

            return new Pair<>(mimeType, bytes);
        } catch (Exception e) {
            Log.e("Base64Parser", "Failed to parse base64 data: " + e.getMessage());
            return null;
        }
    }

    /**
     * Saves a file to the cache directory and returns a URI for opening it
     */
    public static Uri saveBase64FileToCache(Context context, String fileName, String base64Data) {
        Pair<String, byte[]> parsed = parseBase64Data(base64Data);
        if (parsed == null) return null;

        String mimeType = parsed.first;
        byte[] fileBytes = parsed.second;

        try {
            File file = new File(context.getCacheDir(), fileName);
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(fileBytes);
            fos.close();

            return FileProvider.getUriForFile(
                    context,
                    context.getPackageName() + ".provider",
                    file
            );
        } catch (Exception e) {
            Log.e("FileSave", "Error writing file: " + e.getMessage());
            return null;
        }
    }

    public static String getMimeType(String base64Data) {
        Pair<String, byte[]> parsed = parseBase64Data(base64Data);
        return parsed != null ? parsed.first : null;
    }

    /**
     * Gets the drawable asset matching for a file type
     *
     * @param fileName the name of the file
     * @return R.drawable.</ br>
     * ic_photo if file of image type (png, jpg, jpeg)</br>
     * ic_pdf if file is of pdf type</br>
     * ic_office if file is of microsoft office type (doc, docx, xls, xlsx)</br>
     * ic_attachment otherwise
     */
    public static int getFileIconResource(String fileName) {
        fileName = fileName.toLowerCase();

        if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
            return R.drawable.ic_photo;

        if (fileName.endsWith(".pdf"))
            return R.drawable.ic_pdf;

        if (
                fileName.endsWith(".doc") ||
                        fileName.endsWith(".docx") ||
                        fileName.endsWith(".xls") ||
                        fileName.endsWith(".xlsx")
        )
            return R.drawable.ic_office;

        return R.drawable.ic_attachment;
    }
}
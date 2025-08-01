package com.asp.android_app.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
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
            return Base64.encodeToString(fileBytes, Base64.NO_WRAP);
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
            } else {
                Log.e("Base64Converter", "Failed to decode Base64 image");
            }
        } catch (Exception e) {
            Log.e("Base64Converter", "Exception while decoding image: " + e.getMessage());
        }
    }

}
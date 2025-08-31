package com.asp.android_app.utils;

import android.content.Context;

import androidx.activity.result.ActivityResultCaller;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

/**
 * Utility class for picking images and converting them to base64 strings.
 * This is typically used for profile image selection and upload.
 */
public class ImagePicker {

    /**
     * Interface for receiving the result of an image selection.
     */
    public interface ImagePickerCallback {
        void onImagePicked(String base64Image);

        void onError(String message);
    }

    /**
     * Registers an image picker launcher for use inside Activities or Fragments.
     *
     * @param caller   the Activity or Fragment implementing ActivityResultCaller
     * @param context  context for opening the stream
     * @param callback callback to handle result or error
     * @return launcher to be triggered when user wants to pick an image
     */
    public static ActivityResultLauncher<String> registerImagePicker(ActivityResultCaller caller, Context context, ImagePickerCallback callback) {
        return caller.registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            if (uri != null) {
                String base64Image = Base64Converter.fileUriToBase64(uri, context);
                callback.onImagePicked(base64Image);
            }
        });
    }

}
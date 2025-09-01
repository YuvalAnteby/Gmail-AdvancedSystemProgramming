package com.asp.android_app.model.request;


/**
 * Request body for changing profile image.
 * Used in:
 * - PATCH /users/{id}
 */
public class ProfileImageRequest {
    private String image;

    /**
     * Constructs a request with a base64 image string.
     *
     * @param image base64-encoded image string
     */
    public ProfileImageRequest(String image) {
        this.image = image;
    }

    /**
     * @return base64 image string
     */
    public String getImage() {
        return image;
    }

    /**
     * @param image base64 image string to set
     */
    public void setImage(String image) {
        this.image = image;
    }
}
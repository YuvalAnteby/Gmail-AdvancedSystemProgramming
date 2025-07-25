package com.asp.android_app.model.response;

/**
 * Represents basic public profile information for a user.
 * Used in:
 * - GET /users/{id}
 */
public class UserInfo {

    /**
     * The full name of the user.
     */
    private String fullName;

    /**
     * The URL to the user's profile image.
     */
    private String imageUrl;

    /**
     * @return full name of the user
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName full name to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return profile image URL
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * @param imageUrl URL of the profile image
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
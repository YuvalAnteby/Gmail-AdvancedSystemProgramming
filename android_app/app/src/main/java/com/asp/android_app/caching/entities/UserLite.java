package com.asp.android_app.caching.entities;

/**
 * Lightweight user used inside Room JSON columns (recipients).
 * This mirrors the subset we need for offline display.
 */
public class UserLite {
    public int id;
    public String mail;
    public String fullName;
    public String imageUrl; // optional

    public UserLite(int id, String mail, String fullName, String imageUrl) {
        this.id = id;
        this.mail = mail;
        this.fullName = fullName;
        this.imageUrl = imageUrl;
    }
}

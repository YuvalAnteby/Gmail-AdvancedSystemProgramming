package com.asp.android_app.model.response;

/**
 * Represents a single result item when searching for users by email.
 * Used in:
 * - GET /users/search?email=...
 */
public class UserSearchResult {

    /**
     * Unique ID of the user.
     */
    private int id;

    /**
     * Full name of the user.
     */
    private String fullName;

    /**
     * Email address of the user.
     */
    private String mail;

    /**
     * @return unique ID of the user
     */
    public int getId() {
        return id;
    }

    /**
     * @param id unique user ID to assign
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return full name of the user
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName full name to assign
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return email address of the user
     */
    public String getMail() {
        return mail;
    }

    /**
     * @param mail email address to assign
     */
    public void setMail(String mail) {
        this.mail = mail;
    }
}
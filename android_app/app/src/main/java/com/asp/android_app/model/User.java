package com.asp.android_app.model;

/**
 * Represents a user used for registration and login operations.
 * Used in:
 * - POST /users (registration)
 * - Passed as part of LoginRequest (email and password)
 */
public class User {
    /**
     * Full name of the user.
     */
    private String fullName;

    /**
     * Email address of the user.
     */
    private String mail;

    /**
     * Password chosen by the user.
     */
    private String password;

    /**
     * Constructs a new User for registration.
     *
     * @param fullName the full name of the user
     * @param mail     the user's email address
     * @param password the user's password
     */
    public User(String fullName, String mail, String password) {
        this.fullName = fullName;
        this.mail = mail;
        this.password = password;
    }

    /**
     * @return the full name of the user
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName the full name to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return the email address of the user
     */
    public String getMail() {
        return mail;
    }

    /**
     * @param mail the email address to set
     */
    public void setMail(String mail) {
        this.mail = mail;
    }

    /**
     * @return the user's password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
}

package com.asp.android_app.model.request;

/**
 * Request body for user login.
 * Used in:
 * - POST /tokens
 */
public class LoginRequest {
    private String mail;
    private String password;

    /**
     * Constructs a login request.
     *
     * @param mail     user's email address
     * @param password user's password
     */
    public LoginRequest(String mail, String password) {
        this.mail = mail;
        this.password = password;
    }

    /**
     * @return email address of the user
     */
    public String getMail() {
        return mail;
    }

    /**
     * @param mail email address to set
     */
    public void setMail(String mail) {
        this.mail = mail;
    }

    /**
     * @return password of the user
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
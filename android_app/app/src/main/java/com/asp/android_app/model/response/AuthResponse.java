package com.asp.android_app.model.response;

/**
 * Represents the response returned after a successful login or registration.
 * Used in:
 * - POST /tokens
 * - POST /users
 */
public class AuthResponse {

    /**
     * JWT token assigned to the authenticated user.
     */
    private String token;

    /**
     * @return JWT token returned by the server
     */
    public String getToken() {
        return token;
    }

    /**
     * @param token JWT token to assign
     */
    public void setToken(String token) {
        this.token = token;
    }
}
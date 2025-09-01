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
     * User object returned in the JSON from the backend
     */
    private UserInfo user;

    /**
     * @return JWT token returned by the server
     */
    public String getToken() {
        return token;
    }

    /**
     * @return user object from the server
     */
    public UserInfo getUser() {
        return user;
    }

}
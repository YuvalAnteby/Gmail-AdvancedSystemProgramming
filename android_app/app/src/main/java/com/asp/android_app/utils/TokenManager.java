package com.asp.android_app.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.asp.android_app.model.response.UserInfo;
import com.google.gson.Gson;

/**
 * Singleton utility class for saving and retrieving the JWT token using SharedPreferences.
 * Used for attaching Authorization header to every Retrofit request.
 */
public class TokenManager {
    private static final String PREF_NAME = "GmailPrefs";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_EXPIRE = "jwt_expire";
    private static final String KEY_USER = "last_user_json";

    /**
     * in hours - 24 is the default
     * TODO change this value if changing the JWT expiration time in the server!!!!
     */
    private static final int JWT_EXPIRATION_TIME = 24;

    private static TokenManager instance;
    private final SharedPreferences prefs;
    private final Gson gson = new Gson();


    private TokenManager(Context context) {
        prefs = context.getApplicationContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Initializes and returns the singleton instance.
     */
    public static synchronized TokenManager getInstance(Context context) {
        if (instance == null) {
            synchronized (TokenManager.class) {
                instance = new TokenManager(context);
            }
        }
        return instance;
    }

    /**
     * Saves the JWT token to SharedPreferences.
     */
    public void saveToken(String token) {
        long now = System.currentTimeMillis();
        long skew = 2 * 60 * 1000; // 2 minutes in ms
        // converts the validation time to ms and calculates last time of use
        long validUntil = now + (JWT_EXPIRATION_TIME * 60L * 60L * 1000) - skew;
        prefs.edit()
                .putString(KEY_TOKEN, token)
                .putLong(KEY_EXPIRE, validUntil)
                .commit();
    }

    /**
     * Retrieves the JWT token from SharedPreferences.
     */
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    /**
     * Clears the saved JWT token (e.g., on logout).
     */
    public void clearToken() {
        prefs.edit().remove(KEY_TOKEN).remove(KEY_EXPIRE).apply();
    }

    /**
     * @return true if the JWT token is still valid by last time of use, otherwise false
     * IMPORTANT: this doesn't check the JWT validation itself, only expiry time
     */
    public boolean isFreshToken() {
        String tok = getToken();
        if (tok == null || tok.isBlank()) return false;
        long validUntil = prefs.getLong(KEY_EXPIRE, 0L);
        return System.currentTimeMillis() < validUntil;
    }


    /**
     * Saves the user we got from AuthResponse.
     */
    public void saveUser(UserInfo user) {
        prefs.edit().putString(KEY_USER, gson.toJson(user)).apply();
    }

    /**
     * Retrieve last user or null if never logged in.
     */
    public UserInfo getUser() {
        String json = prefs.getString(KEY_USER, null);
        if (json == null)
            return null;
        try {
            return gson.fromJson(json, UserInfo.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Clear on logout.
     */
    public void clearUser() {
        prefs.edit().remove(KEY_USER).apply();
    }
}

package com.asp.android_app.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Singleton utility class for saving and retrieving the JWT token using SharedPreferences.
 * Used for attaching Authorization header to every Retrofit request.
 */
public class TokenManager {
    private static final String PREF_NAME = "GmailPrefs";
    private static final String KEY_TOKEN = "jwt_token";

    private static TokenManager instance;
    private final SharedPreferences prefs;

    private TokenManager(Context context) {
        prefs = context.getApplicationContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Initializes and returns the singleton instance.
     */
    public static synchronized TokenManager getInstance(Context context) {
        if (instance == null) {
            instance = new TokenManager(context);
        }
        return instance;
    }

    /**
     * Saves the JWT token to SharedPreferences.
     */
    public void saveToken(String token) {
        prefs.edit().putString(KEY_TOKEN, token).apply();
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
        prefs.edit().remove(KEY_TOKEN).apply();
    }
}

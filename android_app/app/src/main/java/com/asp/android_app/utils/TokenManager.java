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
    private static final String KEY_USER = "last_user_json";

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

// Updated JsonConverters.java
package com.asp.android_app.caching.utils;

import androidx.annotation.Nullable;
import androidx.room.TypeConverter;

import com.asp.android_app.caching.entities.UserLite;
import com.asp.android_app.model.response.File;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collections;
import java.util.List;

/**
 * Room TypeConverters for small JSON blobs.
 * - List<String> for simple string lists
 * - List<UserLite> for recipients
 * - List<File> for complete attachment information
 * Keeping JSON simple avoids extra tables until we actually need them.
 */
public class JsonConverters {
    private static final Gson gson = new Gson();
    private static final Type LIST_STRING = new TypeToken<List<String>>() {}.getType();
    private static final Type LIST_USERLITE = new TypeToken<List<UserLite>>() {}.getType();
    private static final Type LIST_FILE = new TypeToken<List<File>>() {}.getType(); // ADDED

    @TypeConverter
    public static String listStringToJson(@Nullable List<String> list) {
        return gson.toJson(list == null ? Collections.<String>emptyList() : list, LIST_STRING);
    }

    @TypeConverter
    public static List<String> jsonToListString(@Nullable String json) {
        if (json == null || json.isEmpty()) return Collections.emptyList();
        return gson.fromJson(json, LIST_STRING);
    }

    @TypeConverter
    public static String listUserLiteToJson(@Nullable List<UserLite> list) {
        return gson.toJson(list == null ? Collections.<UserLite>emptyList() : list, LIST_USERLITE);
    }

    @TypeConverter
    public static List<UserLite> jsonToListUserLite(@Nullable String json) {
        if (json == null || json.isEmpty()) return Collections.emptyList();
        return gson.fromJson(json, LIST_USERLITE);
    }

    // ADDED: Converters for File objects
    @TypeConverter
    public static String listFileToJson(@Nullable List<File> list) {
        return gson.toJson(list == null ? Collections.<File>emptyList() : list, LIST_FILE);
    }

    @TypeConverter
    public static List<File> jsonToListFile(@Nullable String json) {
        if (json == null || json.isEmpty()) return Collections.emptyList();
        return gson.fromJson(json, LIST_FILE);
    }
}
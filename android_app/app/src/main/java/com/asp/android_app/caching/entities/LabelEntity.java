package com.asp.android_app.caching.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

/**
 * Room cache for a Label as returned by backend.
 * Parent is an Integer (nullable) in the server model,
 * stored here as Integer-compatible (use -1 for "no parent" if you prefer).
 */
@Entity(tableName = "labels")
public class LabelEntity {
    @PrimaryKey
    public int id;
    public String name;
    public Integer parent; // null = no parent
}

package com.asp.android_app.caching;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.asp.android_app.caching.dao.MailDao;
import com.asp.android_app.caching.dao.LabelDao;
import com.asp.android_app.caching.entities.MailEntity;
import com.asp.android_app.caching.entities.LabelEntity;
import com.asp.android_app.caching.entities.MailLabelCrossRef;
import com.asp.android_app.caching.utils.JsonConverters;


/**
 * Room database entry-point.
 * Version 1 keeps it simple; we can add auto-migrations later if needed.
 */
@Database(
        entities = {
                MailEntity.class,
                LabelEntity.class,
                MailLabelCrossRef.class
        },
        version = 1,
        exportSchema = false
)
@TypeConverters({JsonConverters.class})
public abstract class AppDatabase extends RoomDatabase {

    public abstract MailDao mailDao();
    public abstract LabelDao labelDao();

    private static volatile AppDatabase INSTANCE;

    /**
     * Thread-safe singleton getter. Keeps one DB per process.
     */
    public static AppDatabase get(Context ctx) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                                    ctx.getApplicationContext(),
                                    AppDatabase.class,
                                    "gmail_clone.db")
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}

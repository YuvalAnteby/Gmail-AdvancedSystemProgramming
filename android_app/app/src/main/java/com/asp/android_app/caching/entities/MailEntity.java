package com.asp.android_app.caching.entities;

import androidx.room.Entity;
import androidx.room.Index;
import androidx.room.PrimaryKey;

/**
 * Room cache model for a Mail.
 * - Denormalized for speed (flags directly on the row).
 * - We keep a few denormalized sender fields so lists render without joins.
 * - Recipients & attachment names are stored as JSON strings (simple & fast).
 * <p>
 * NOTE: We sort by sentAtEpoch (fallback to createdAtEpoch) to match backend's order.
 */
@Entity(tableName = "mails",
        indices = {
                @Index(value = {"id"}, unique = true),
                @Index(value = {"ownerId"}),
                @Index(value = {"isDraft"}),
                @Index(value = {"isRead"}),
                @Index(value = {"isStarred"}),
                @Index(value = {"isTrashed"}),
                @Index(value = {"isSpam"}),
                @Index(value = {"sentAtEpoch"}),
                @Index(value = {"createdAtEpoch"})
        })
public class MailEntity {

    @PrimaryKey
    public int id;                     // server mail id

    public int ownerId;                // owner per server model

    // Sender (denormalized for quick list rendering)
    public int fromId;
    public String fromName;
    public String fromEmail;
    public String fromImageUrl;

    // Main content
    public String subject;
    public String body;

    // Dates: raw ISO + parsed epoch for sort/filter
    public String sentAtRaw;           // can be "" for drafts
    public String createdAtRaw;
    public long sentAtEpoch;           // 0 if unknown
    public long createdAtEpoch;        // fallback

    // Flags (we derive inboxes by these)
    public boolean isDraft;
    public boolean isRead;
    public boolean isStarred;
    public boolean isTrashed;
    public boolean isSpam;

    // JSON blobs to keep schema simple
    public String recipientsJson;      // List<UserLite> as JSON
    public String attachmentNamesJson; // List<String> names only

    // Bookkeeping for cache eviction (simple LRU)
    public long lastAccessEpoch;       // updated whenever we read/open
}

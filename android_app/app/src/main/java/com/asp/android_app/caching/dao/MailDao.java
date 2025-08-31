package com.asp.android_app.caching.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.asp.android_app.caching.entities.MailEntity;

import java.util.List;

/**
 * DAO for MailEntity.
 * - Queries reflect the "flags-as-inbox" approach (no separate tables).
 * - Search is simple LIKE over subject/body/from fields (offline only).
 */
@Dao
public interface MailDao {

    /** Upsert a batch of mails returned from server. */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertAll(List<MailEntity> mails);

    /** Upsert a single mail (used for open mail details caching). */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertOne(MailEntity mail);

    /** Update mail row (used to bump LRU or small tweaks if ever needed). */
    @Update
    void update(MailEntity mail);

    /** Get a single mail by id (for reading activity). */
    @Query("SELECT * FROM mails WHERE id = :mailId LIMIT 1")
    MailEntity getById(int mailId);

    /** Delete a single mail by ID. */
    @Query("DELETE FROM mails WHERE id = :mailId")
    void deleteById(int mailId);

    // ---- inbox list queries (flags drive membership) ----

    @Query("SELECT * FROM mails WHERE isTrashed = 0 AND isSpam = 0 AND isDraft = 0 ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getIncoming();

    @Query("SELECT * FROM mails WHERE isDraft = 0 AND ownerId = fromId ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getSent();

    @Query("SELECT * FROM mails WHERE isStarred = 1 AND isTrashed = 0 ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getStarred();

    @Query("SELECT * FROM mails WHERE isDraft = 1 ORDER BY createdAtEpoch DESC")
    List<MailEntity> getDrafts();

    @Query("SELECT * FROM mails WHERE isSpam = 1 ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getSpam();

    @Query("SELECT * FROM mails WHERE isTrashed = 1 ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getTrash();

    // ---- Clear methods for cache invalidation ----

    /** Clear mails by inbox type for cache invalidation */
    @Query("DELETE FROM mails WHERE isTrashed = 0 AND isSpam = 0 AND isDraft = 0")
    void deleteIncoming();

    @Query("DELETE FROM mails WHERE isDraft = 0 AND ownerId = fromId")
    void deleteSent();

    @Query("DELETE FROM mails WHERE isStarred = 1 AND isTrashed = 0")
    void deleteStarred();

    @Query("DELETE FROM mails WHERE isDraft = 1")
    void deleteDrafts();

    @Query("DELETE FROM mails WHERE isSpam = 1")
    void deleteSpam();

    @Query("DELETE FROM mails WHERE isTrashed = 1")
    void deleteTrash();

    // Generic delete by type method
    @Query("DELETE FROM mails WHERE " +
            "CASE :type " +
            "WHEN 'incoming' THEN (isTrashed = 0 AND isSpam = 0 AND isDraft = 0) " +
            "WHEN 'sent' THEN (isDraft = 0 AND ownerId = fromId) " +
            "WHEN 'starred' THEN (isStarred = 1 AND isTrashed = 0) " +
            "WHEN 'draft' THEN (isDraft = 1) " +
            "WHEN 'spam' THEN (isSpam = 1) " +
            "WHEN 'trash' THEN (isTrashed = 1) " +
            "ELSE 0 END")
    void deleteByType(String type);

    // ---- label filter (join is maintained in repository to keep DAO simple) ----
    @Query("SELECT * FROM mails WHERE id IN (:mailIds) ORDER BY " +
            "CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> getByIdsOrdered(List<Integer> mailIds);

    // ---- search (offline over cached set) ----
    @Query("SELECT * FROM mails " +
            "WHERE (subject LIKE '%' || :q || '%' " +
            "   OR body LIKE '%' || :q || '%' " +
            "   OR fromName LIKE '%' || :q || '%' " +
            "   OR fromEmail LIKE '%' || :q || '%')" +
            "ORDER BY CASE WHEN sentAtEpoch > 0 THEN sentAtEpoch ELSE createdAtEpoch END DESC")
    List<MailEntity> search(String q);

    // ---- LRU / housekeeping ----

    /** Update LRU timestamp when user views a mail or a list uses it. */
    @Query("UPDATE mails SET lastAccessEpoch = :now WHERE id IN (:ids)")
    void touch(List<Integer> ids, long now);

    /** Count total cached mails (for LRU capping). */
    @Query("SELECT COUNT(*) FROM mails")
    int countAll();

    /** Kill oldest rows by lastAccessEpoch (simple LRU). */
    @Query("DELETE FROM mails WHERE id IN (" +
            "SELECT id FROM mails ORDER BY lastAccessEpoch ASC LIMIT :howMany)")
    void evictOldest(int howMany);

    /** Remove everything (used on logout). */
    @Query("DELETE FROM mails")
    void clearAll();
}
package com.asp.android_app.caching;

import android.content.Context;

import com.asp.android_app.caching.dao.LabelDao;
import com.asp.android_app.caching.dao.MailDao;
import com.asp.android_app.caching.entities.LabelEntity;
import com.asp.android_app.caching.entities.MailEntity;
import com.asp.android_app.caching.entities.MailLabelCrossRef;

import java.util.ArrayList;
import java.util.List;

/**
 * Small facade over DAOs.
 * - Encapsulates LRU logic.
 * - Provides simple methods the repository can call.
 */
public class MailLocalDataSource {

    /**
     * total mails cap in cache
     */
    private static final int CACHE_CAP = 200;
    private final MailDao mailDao;
    private final LabelDao labelDao;

    public MailLocalDataSource(Context ctx) {
        AppDatabase db = AppDatabase.get(ctx);
        this.mailDao = db.mailDao();
        this.labelDao = db.labelDao();
    }

    /**
     * Upsert mails and their label cross-refs, then prune to keep LRU under cap.
     */
    public void upsertMails(List<MailEntity> mails, List<MailLabelCrossRef> refsToReplace) {
        if (mails == null || mails.isEmpty()) return;
        mailDao.upsertAll(mails);
        // replace label refs for these mails
        List<Integer> ids = new ArrayList<>();
        for (MailEntity m : mails) ids.add(m.id);
        labelDao.clearRefsForMails(ids);
        if (refsToReplace != null && !refsToReplace.isEmpty()) {
            labelDao.upsertCrossRefs(refsToReplace);
        }
        pruneIfNeeded();
    }

    /**
     * Touch mails for LRU when presented in a list.
     */
    public void touchMails(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            mailDao.touch(ids, System.currentTimeMillis());
        }
    }

    /**
     * Return lists by "inbox flags".
     */
    public List<MailEntity> getIncoming() {
        return mailDao.getIncoming();
    }

    public List<MailEntity> getSent() {
        return mailDao.getSent();
    }

    public List<MailEntity> getStarred() {
        return mailDao.getStarred();
    }

    public List<MailEntity> getDrafts() {
        return mailDao.getDrafts();
    }

    public List<MailEntity> getSpam() {
        return mailDao.getSpam();
    }

    public List<MailEntity> getTrash() {
        return mailDao.getTrash();
    }

    /**
     * Delete a specific mail by ID
     */
    public void deleteMailById(int mailId) {
        mailDao.deleteById(mailId);
        // Also clear any cross-refs for this mail
        labelDao.clearRefsForMails(List.of(mailId));
    }

    // ---- Cache clearing methods for proper invalidation ----

    /**
     * Clear all incoming mails from cache
     */
    public void clearIncoming() {
        mailDao.deleteIncoming();
    }

    /**
     * Clear all sent mails from cache
     */
    public void clearSent() {
        mailDao.deleteSent();
    }

    /**
     * Clear all starred mails from cache
     */
    public void clearStarred() {
        mailDao.deleteStarred();
    }

    /**
     * Clear all draft mails from cache
     */
    public void clearDrafts() {
        mailDao.deleteDrafts();
    }

    /**
     * Clear all spam mails from cache
     */
    public void clearSpam() {
        mailDao.deleteSpam();
    }

    /**
     * Clear all trash mails from cache
     */
    public void clearTrash() {
        mailDao.deleteTrash();
    }

    /**
     * Generic clear method for any inbox type
     */
    public void clearByType(String inboxType) {
        switch ((inboxType == null ? "incoming" : inboxType).toLowerCase()) {
            case "sent":
                clearSent();
                break;
            case "star":
            case "starred":
                clearStarred();
                break;
            case "draft":
                clearDrafts();
                break;
            case "spam":
                clearSpam();
                break;
            case "trash":
                clearTrash();
                break;
            case "incoming":
            case "all":
            default:
                clearIncoming();
                break;
        }
    }

    /**
     * Label-based list using cross-refs.
     */
    public List<MailEntity> getByLabel(int labelId) {
        List<Integer> ids = labelDao.getMailIdsForLabel(labelId);
        if (ids.isEmpty()) return new ArrayList<>();
        return mailDao.getByIdsOrdered(ids);
    }

    /**
     * Clear mails for a specific label (useful for label-based cache invalidation)
     */
    public void clearByLabel(int labelId) {
        List<Integer> mailIds = labelDao.getMailIdsForLabel(labelId);
        if (!mailIds.isEmpty()) {
            for (int mailId : mailIds) {
                mailDao.deleteById(mailId);
            }
            labelDao.clearRefsForLabel(labelId);
        }
    }

    /**
     * Search within cached mails only.
     */
    public List<MailEntity> search(String q) {
        return mailDao.search(q);
    }

    /**
     * Single mail for reading.
     */
    public MailEntity getById(int id) {
        return mailDao.getById(id);
    }

    /**
     * Upsert labels cache.
     */
    public void upsertLabels(List<LabelEntity> labels) {
        if (labels == null || labels.isEmpty()) return;
        labelDao.upsertLabels(labels);
    }

    /**
     * Prune cache if it exceeds capacity
     */
    private void pruneIfNeeded() {
        int count = mailDao.countAll();
        if (count > CACHE_CAP) {
            mailDao.evictOldest(count - CACHE_CAP);
        }
    }

    /**
     * Wipe cache (use on logout).
     */
    public void clearAll() {
        mailDao.clearAll();
        labelDao.clearLabels();
    }
}
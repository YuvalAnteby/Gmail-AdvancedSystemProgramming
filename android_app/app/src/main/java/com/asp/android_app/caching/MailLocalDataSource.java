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
        mailDao.touch(ids, System.currentTimeMillis());
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
     * Label-based list using cross-refs.
     */
    public List<MailEntity> getByLabel(int labelId) {
        List<Integer> ids = labelDao.getMailIdsForLabel(labelId);
        if (ids.isEmpty()) return new ArrayList<>();
        return mailDao.getByIdsOrdered(ids);
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

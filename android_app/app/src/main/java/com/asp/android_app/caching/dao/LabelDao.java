package com.asp.android_app.caching.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;


import com.asp.android_app.caching.entities.LabelEntity;
import com.asp.android_app.caching.entities.MailLabelCrossRef;

import java.util.List;

/**
 * DAO for Label cache and cross-refs.
 */
@Dao
public interface LabelDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertLabels(List<LabelEntity> labels);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertCrossRefs(List<MailLabelCrossRef> refs);

    @Query("DELETE FROM mail_label WHERE mailId IN (:mailIds)")
    void clearRefsForMails(List<Integer> mailIds);

    @Query("SELECT mailId FROM mail_label WHERE labelId = :labelId")
    List<Integer> getMailIdsForLabel(int labelId);

    @Query("SELECT * FROM labels")
    List<LabelEntity> getAllLabels();

    @Query("DELETE FROM labels")
    void clearLabels();
}

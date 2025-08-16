package com.asp.android_app.caching.entities;

import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.Index;

/**
 * Many-to-many relation between mails and labels.
 * We only need mailId & labelId since both sides are unique.
 */
@Entity(tableName = "mail_label",
        primaryKeys = {"mailId", "labelId"},
        foreignKeys = {
                @ForeignKey(entity = MailEntity.class,
                        parentColumns = "id", childColumns = "mailId",
                        onDelete = ForeignKey.CASCADE),
                @ForeignKey(entity = LabelEntity.class,
                        parentColumns = "id", childColumns = "labelId",
                        onDelete = ForeignKey.CASCADE)
        },
        indices = {
                @Index("mailId"),
                @Index("labelId")
        })
public class MailLabelCrossRef {
    public int mailId;
    public int labelId;

    public MailLabelCrossRef(int mailId, int labelId) {
        this.mailId = mailId;
        this.labelId = labelId;
    }
}

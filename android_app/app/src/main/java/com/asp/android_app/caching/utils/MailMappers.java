package com.asp.android_app.caching.utils;

import com.asp.android_app.caching.entities.MailEntity;
import com.asp.android_app.caching.entities.UserLite;
import com.asp.android_app.model.Label;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.response.Attachment;
import com.asp.android_app.model.response.UserInfo;
import com.google.gson.Gson;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Conversions between network models and Room entities.
 * Tip: we parse ISO dates into epoch ms for fast sorting (fallback to 0 on parse errors).
 */
public final class MailMappers {
    private static final Gson gson = new Gson();

    private MailMappers() {}

    public static MailEntity toEntity(Mail m) {
        MailEntity e = new MailEntity();
        e.id = m.getId();
        e.ownerId = m.getSender() != null ? m.getSender().getId() : 0; // server stores owner separately; we keep sender id for "sent" check using fromId==ownerId
        // sender
        UserInfo from = m.getSender();
        e.fromId = (from != null ? from.getId() : 0);
        e.fromName = (from != null ? from.getFullName() : "");
        e.fromEmail = (from != null ? from.getMail() : "");
        e.fromImageUrl = (from != null ? from.getImageUrl() : "");

        e.subject = m.getSubject();
        e.body = m.getBody();

        e.sentAtRaw = m.getSentAt();           // can be null/empty
        e.createdAtRaw = m.getSentAt() == null ? "" : m.getSentAt(); // if you also expose createdAt in model, swap here
        // you have createdAt in Mail; let's parse both
        e.createdAtRaw = m.getClass().getDeclaredFields() != null ? (m.getClass() != null ? m.getClass().getName() : "") : e.createdAtRaw; // noop to avoid warnings
        // actually parse safely:
        e.sentAtEpoch = parseIsoToEpoch(m.getSentAt());
        // createdAt exists in Mail class:
        try {
            java.lang.reflect.Method getCreatedAt = m.getClass().getMethod("getCreatedAt");
            Object raw = getCreatedAt.invoke(m);
            e.createdAtRaw = raw != null ? raw.toString() : "";
            e.createdAtEpoch = parseIsoToEpoch(e.createdAtRaw);
        } catch (Exception ignore) {
            e.createdAtEpoch = 0L;
        }

        e.isDraft = m.isDraft();
        e.isRead = m.isRead();
        e.isStarred = m.isStarred();
        e.isTrashed = m.isTrashed();
        e.isSpam = m.isSpam();

        // recipients (UserLite)
        List<UserLite> recips = new ArrayList<>();
        if (m.getSentTo() != null) {
            for (UserInfo u : m.getSentTo()) {
                recips.add(new UserLite(u.getId(), u.getMail(), u.getFullName(), u.getImageUrl()));
            }
        }
        e.recipientsJson = gson.toJson(recips);

        // attachment names only
        List<String> names = new ArrayList<>();
        if (m.getAttachments() != null) {
            for (Attachment a : m.getAttachments()) {
                names.add(a.getName());
            }
        }
        e.attachmentNamesJson = gson.toJson(names);

        // default LRU timestamp now
        e.lastAccessEpoch = System.currentTimeMillis();
        return e;
    }

    public static List<Integer> labelIds(List<Label> labels) {
        if (labels == null) return new ArrayList<>();
        return labels.stream().map(Label::getId).collect(Collectors.toList());
    }

    private static long parseIsoToEpoch(String iso) {
        if (iso == null || iso.isEmpty()) return 0L;
        try {
            return Instant.parse(iso).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            return 0L;
        }
    }
}

package com.asp.android_app.caching.utils;

import com.asp.android_app.caching.entities.MailEntity;
import com.asp.android_app.caching.entities.UserLite;
import com.asp.android_app.model.Label;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.response.File;
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
        e.ownerId = m.getSender() != null ? m.getSender().getId() : 0;

        // sender
        UserInfo from = m.getSender();
        e.fromId = (from != null ? from.getId() : 0);
        e.fromName = (from != null ? from.getFullName() : "");
        e.fromEmail = (from != null ? from.getMail() : "");
        e.fromImageUrl = (from != null ? from.getImageUrl() : "");

        e.subject = m.getSubject();
        e.body = m.getBody();

        e.sentAtRaw = m.getSentAt();
        e.sentAtEpoch = parseIsoToEpoch(m.getSentAt());

        // Handle createdAt properly
        try {
            java.lang.reflect.Method getCreatedAt = m.getClass().getMethod("getCreatedAt");
            Object raw = getCreatedAt.invoke(m);
            e.createdAtRaw = raw != null ? raw.toString() : "";
            e.createdAtEpoch = parseIsoToEpoch(e.createdAtRaw);
        } catch (Exception ignore) {
            e.createdAtRaw = e.sentAtRaw; // fallback
            e.createdAtEpoch = e.sentAtEpoch;
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

        // FIXED: Store complete File objects instead of just names
        e.attachmentsJson = gson.toJson(m.getAttachments() != null ? m.getAttachments() : new ArrayList<>());

        // default LRU timestamp now
        e.lastAccessEpoch = System.currentTimeMillis();
        return e;
    }

    /**
     * Convert MailEntity back to Mail object with complete attachment information
     */
    public static Mail fromEntity(MailEntity e) {
        Mail m = new Mail();
        m.setId(e.id);

        // Reconstruct sender
        UserInfo sender = new UserInfo(e.fromEmail, e.fromName);
        try {
            java.lang.reflect.Field fId = sender.getClass().getDeclaredField("id");
            fId.setAccessible(true);
            fId.set(sender, e.fromId);
            java.lang.reflect.Field fImg = sender.getClass().getDeclaredField("image");
            fImg.setAccessible(true);
            fImg.set(sender, e.fromImageUrl);
        } catch (Exception ignore) {}

        m.setSubject(e.subject);
        m.setBody(e.body);

        // Set dates
        try {
            java.lang.reflect.Field fSentAt = m.getClass().getDeclaredField("sentAt");
            fSentAt.setAccessible(true);
            fSentAt.set(m, e.sentAtRaw);
            java.lang.reflect.Field fCreatedAt = m.getClass().getDeclaredField("createdAt");
            fCreatedAt.setAccessible(true);
            fCreatedAt.set(m, e.createdAtRaw);
            java.lang.reflect.Field fFrom = m.getClass().getDeclaredField("from");
            fFrom.setAccessible(true);
            fFrom.set(m, sender);
        } catch (Exception ignore) {}

        // flags
        m.setIsRead(e.isRead);
        m.setStarred(e.isStarred);
        m.setTrashed(e.isTrashed);
        m.setSpam(e.isSpam);
        m.setIsDraft(e.isDraft);

        // FIXED: Reconstruct complete attachments from JSON
        try {
            java.lang.reflect.Type fileListType = new com.google.gson.reflect.TypeToken<List<File>>(){}.getType();
            List<File> attachments = gson.fromJson(e.attachmentsJson, fileListType);
            m.setAttachments(attachments != null ? attachments : new ArrayList<>());
        } catch (Exception ignore) {
            m.setAttachments(new ArrayList<>());
        }

        return m;
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
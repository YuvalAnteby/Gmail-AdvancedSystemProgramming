package com.asp.android_app.utils;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.asp.android_app.model.Mail;

/**
 * Mini helper for building reply/forward HTML.
 * Keeps the Compose clean and avoids repeating HTML strings all over.
 */
public final class MailHtmlUtil {
    private MailHtmlUtil() {
    }

    /**
     * Adds "Re: " if it's not already there (case-insensitive).
     */
    @NonNull
    public static String subjectForReply(@Nullable String subject) {
        return ensurePrefix(subject, "Re: ");
    }

    /**
     * Adds "Fwd: " if it's not already there (case-insensitive).
     */
    @NonNull
    public static String subjectForForward(@Nullable String subject) {
        return ensurePrefix(subject, "Fwd: ");
    }

    /**
     * Builds the “On <date>, <from> wrote:” + original body block for replies (HTML).
     */
    @NonNull
    public static String buildReplyQuotedHtml(@NonNull Mail mail) {
        String date = safeDateTime(mail);
        String from = mail.getSender() != null ? nullToEmpty(mail.getSender().getMail()) : "";
        String body = nullToEmpty(mail.getBody()); // original is already HTML from server
        return "<br><br>On " + TextUtils.htmlEncode(date) + ", "
                + TextUtils.htmlEncode(from) + " wrote:<br>" + body;
    }

    /**
     * Builds a Gmail-style forwarded header + original body (HTML).
     */
    @NonNull
    public static String buildForwardQuotedHtml(@NonNull Mail mail) {
        String date = safeDateTime(mail);
        String from = mail.getSender() != null ? nullToEmpty(mail.getSender().getMail()) : "";
        String subj = nullToEmpty(mail.getSubject());
        String body = nullToEmpty(mail.getBody());
        return "<br><br>---------- Forwarded message ----------<br>"
                + "<b>From:</b> " + TextUtils.htmlEncode(from) + "<br>"
                + "<b>Date:</b> " + TextUtils.htmlEncode(date) + "<br>"
                + "<b>Subject:</b> " + TextUtils.htmlEncode(subj) + "<br><br>"
                + body;
    }

    /**
     * Combines the user's typed text with the quoted HTML:
     * the typed part is escaped and linebreaks become &lt;br&gt; so the final body is valid HTML.
     */
    @NonNull
    public static String mergeTypedWithQuote(@Nullable String typed, @Nullable String quotedHtml) {
        String t = typed == null ? "" : typed;
        if (quotedHtml == null || quotedHtml.isEmpty()) return t;
        String escaped = TextUtils.htmlEncode(t).replace("\n", "<br>");
        return escaped + quotedHtml;
    }

    // ----- helpers -----
    @NonNull
    private static String ensurePrefix(@Nullable String subject, @NonNull String prefix) {
        String s = subject == null ? "" : subject.trim();
        String low = s.toLowerCase();
        String p = prefix.toLowerCase();
        if (low.startsWith(p)) return s;
        return prefix + s;
    }

    @NonNull
    private static String safeDateTime(@NonNull Mail mail) {
        // prefer sentAt if present, else empty (we don’t have createdAt in this model)
        if (mail.getSentAt() != null && !mail.getSentAt().isBlank()) {
            String d = DateUtil.getFormattedDate(mail.getSentAt());
            String t = DateUtil.getFormattedHour(mail.getSentAt());
            return d + " " + t;
        }
        return "";
    }

    @NonNull
    private static String nullToEmpty(@Nullable String s) {
        return s == null ? "" : s;
    }
}

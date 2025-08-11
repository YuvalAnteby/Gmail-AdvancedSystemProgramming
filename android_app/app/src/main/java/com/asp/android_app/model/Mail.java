package com.asp.android_app.model;

import com.asp.android_app.model.response.Attachment;
import com.asp.android_app.model.response.UserInfo;

import java.util.List;

/**
 * Represents an email message.
 * Used in:
 * - GET /mails
 * - GET /mails/:id
 * - PATCH /mails/:id (to update read/starred/trash status)
 */
public class Mail {
    private int id;
    private int owner;
    private UserInfo from;
    private List<UserInfo> sentTo;
    private String subject;
    private String body;
    private String sentAt;
    private String createdAt;
    private boolean isDraft;
    private boolean isRead;
    private boolean isStarred;
    private boolean isTrashed;
    private boolean isSpam;
    private List<Attachment> files;
    private List<Label> labels;

    /**
     * @return the unique ID of the mail
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the unique ID of the mail
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the sender user object
     */
    public UserInfo getSender() {
        return from;
    }

    /**
     * @return list of users the mail was sent to
     */
    public List<UserInfo> getSentTo() {
        return sentTo;
    }

    /**
     * @return the subject of the mail
     */
    public String getSubject() {
        return subject;
    }

    /**
     * @param subject the subject to set
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }

    /**
     * @return the body content of the mail
     */
    public String getBody() {
        return body;
    }

    /**
     * @param body the content of the mail
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * @return timestamp string of when the mail was sent
     */
    public String getSentAt() {
        return sentAt;
    }

    /**
     * @return true if the mail is starred
     */
    public boolean isStarred() {
        return isStarred;
    }

    /**
     * @param starred whether the mail is starred
     */
    public void setStarred(boolean starred) {
        isStarred = starred;
    }

    /**
     * @return true if the mail is in the trash
     */
    public boolean isTrashed() {
        return isTrashed;
    }

    /**
     * @param trashed whether the mail is in the trash
     */
    public void setTrashed(boolean trashed) {
        isTrashed = trashed;
    }

    /**
     * @return true if the mail is marked as spam
     */
    public boolean isSpam() {
        return isSpam;
    }

    /**
     * @return true if the mail is marked as read, otherwise false
     */
    public boolean isRead() {
        return isRead;
    }

    /**
     * @param isRead update the is read flag
     */
    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    /**
     * @param spam whether the mail is marked as spam
     */
    public void setSpam(boolean spam) {
        isSpam = spam;
    }

    /**
     * @return true if the mail is marked as a draft, otherwise false
     */
    public boolean isDraft() {
        return isDraft;
    }

    /**
     * @return list of files attached to mail
     */
    public List<Attachment> getAttachments() {
        return files;
    }

    /**
     * @return list of labels objects the mail is marked with
     */
    public List<Label> getLabels() {
        return labels;
    }

    /**
     * @param labels new list of labels to set for a mail
     */
    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }
}
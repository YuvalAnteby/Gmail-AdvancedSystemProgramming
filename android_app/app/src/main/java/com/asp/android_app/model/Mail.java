package com.asp.android_app.model;


/**
 * Represents an email message.
 * Used in:
 * - GET /mails
 * - GET /mails/:id
 * - PATCH /mails/:id (to update read/starred/trash status)
 */
public class Mail {
    private int id;
    private int senderId;
    private String senderName;
    private String senderMail;
    private String subject;
    private String body;
    private String timestamp;
    private boolean isRead;
    private boolean isStarred;
    private boolean isTrashed;
    private boolean isSpam;

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
     * @return the sender's user ID
     */
    public int getSenderId() {
        return senderId;
    }

    /**
     * @param senderId the sender's user ID
     */
    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    /**
     * @return the full name of the sender
     */
    public String getSenderName() {
        return senderName;
    }

    /**
     * @param senderName the full name of the sender
     */
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    /**
     * @return the email address of the sender
     */
    public String getSenderMail() {
        return senderMail;
    }

    /**
     * @param senderMail the sender's email address
     */
    public void setSenderMail(String senderMail) {
        this.senderMail = senderMail;
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
    public String getTimestamp() {
        return timestamp;
    }

    /**
     * @param timestamp timestamp string of when the mail was sent
     */
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * @return true if the mail has been read
     */
    public boolean isRead() {
        return isRead;
    }

    /**
     * @param read whether the mail has been read
     */
    public void setRead(boolean read) {
        isRead = read;
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
     * @param spam whether the mail is marked as spam
     */
    public void setSpam(boolean spam) {
        isSpam = spam;
    }
}
package com.asp.android_app.model.request;


/**
 * Request body for updating the "read" status of a mail.
 * Used in:
 * - PATCH /mails/{id}
 */
public class ReadStatus {
    private boolean isRead;

    /**
     * Constructs a request to mark a mail as read.
     *
     * @param isRead true if mail should be marked as read
     */
    public ReadStatus(boolean isRead) {
        this.isRead = isRead;
    }

    /**
     * @return true if the mail is marked as read
     */
    public boolean isRead() {
        return isRead;
    }

    /**
     * @param isRead whether to mark the mail as read
     */
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}
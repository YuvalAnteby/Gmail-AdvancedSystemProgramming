package com.asp.android_app.model.response;

/**
 * Request body for updating the "trashed" status of a mail.
 * Used in:
 * - PATCH /mails/{id} (for restore)
 */
public class TrashStatus {
    private boolean isTrashed;

    /**
     * Constructs a request to update trash status.
     *
     * @param isTrashed false to restore from trash
     */
    public TrashStatus(boolean isTrashed) {
        this.isTrashed = isTrashed;
    }

    /**
     * @return true if the mail is currently trashed
     */
    public boolean isTrashed() {
        return isTrashed;
    }

    /**
     * @param isTrashed whether the mail should be marked as trashed
     */
    public void setTrashed(boolean isTrashed) {
        this.isTrashed = isTrashed;
    }
}
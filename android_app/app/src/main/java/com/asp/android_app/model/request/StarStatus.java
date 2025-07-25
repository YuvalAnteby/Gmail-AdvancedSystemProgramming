package com.asp.android_app.model.request;

/**
 * Request body for toggling the "starred" status of a mail.
 *
 * Used in:
 * - PATCH /mails/{id}
 */
public class StarStatus {
    private boolean isStarred;

    /**
     * Constructs a request to update starred status.
     *
     * @param isStarred true if the mail should be starred
     */
    public StarStatus(boolean isStarred) {
        this.isStarred = isStarred;
    }

    /**
     * @return true if the mail should be starred
     */
    public boolean isStarred() {
        return isStarred;
    }

    /**
     * @param isStarred whether the mail should be starred
     */
    public void setStarred(boolean isStarred) {
        this.isStarred = isStarred;
    }
}
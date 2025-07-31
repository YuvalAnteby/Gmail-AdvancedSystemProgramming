package com.asp.android_app.model.request;

/**
 * Request model used to mark or unmark a mail as spam.
 * Used in:
 * - POST /blacklist   (to mark as spam)
 * - DELETE /blacklist (to remove from spam)
 */
public class SpamRequest {
    private int mailId;
    private boolean isPreviouslySpam = false;

    /**
     * Constructs a request for marking or unmarking spam.
     *
     * @param mailId ID of the mail being reported or unreported as spam
     */
    public SpamRequest(int mailId) {
        this.mailId = mailId;
    }

    /**
     * @return ID of the mail
     */
    public int getMailId() {
        return mailId;
    }

    /**
     * @param mailId ID of the mail to set
     */
    public void setMailId(int mailId) {
        this.mailId = mailId;
    }

    public boolean getIsPreviouslySpam() {
        return isPreviouslySpam;
    }

    public void setIsPreviouslySpam(boolean isSpam) {
        this.isPreviouslySpam = isSpam;
    }
}
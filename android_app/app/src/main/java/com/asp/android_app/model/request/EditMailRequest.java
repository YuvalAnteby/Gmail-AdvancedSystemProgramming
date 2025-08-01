package com.asp.android_app.model.request;

import java.util.List;

public class EditMailRequest {
    private final Boolean isRead;
    private final Boolean isStarred;
    private final Boolean isTrashed;
    private final List<Integer> labels;

    public Boolean getRead() {
        return isRead;
    }

    public Boolean getStarred() {
        return isStarred;
    }

    public Boolean getTrashed() {
        return isTrashed;
    }

    public List<Integer> getLabels() {
        return labels;
    }

    /**
     * Creates a edit mail request object, marks what fields to edit.
     * fields that shouldn't be changed should receive value <b>null</b>
     *
     * @param isRead  true if the flag should be marked as read
     * @param isStar  new star flag value
     * @param isTrash true if should move to trash/ delete forever, false if restoring mail
     * @param labels  list of labels new ids to replace the old values
     */
    public EditMailRequest(Boolean isRead, Boolean isStar, Boolean isTrash, List<Integer> labels) {
        this.isRead = isRead;
        this.isStarred = isStar;
        this.isTrashed = isTrash;
        this.labels = labels;
    }
}
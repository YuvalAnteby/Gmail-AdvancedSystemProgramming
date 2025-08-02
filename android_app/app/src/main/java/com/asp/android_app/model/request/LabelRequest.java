package com.asp.android_app.model.request;

/**
 * Request body for creating or editing a label.
 * Sent to the server with the label's name.
 */
public class LabelRequest {
    private String name;

    /**
     * @param name new name for the label
     */
    public LabelRequest(String name) {
        this.name = name;
    }

    /**
     * @return new name that will be or just been set for the label
     */
    public String getName() {
        return name;
    }

    /**
     * @param name new name to be set for the label
     */
    public void setName(String name) {
        this.name = name;
    }
}

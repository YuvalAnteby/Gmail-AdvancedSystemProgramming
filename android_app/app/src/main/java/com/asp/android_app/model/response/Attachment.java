package com.asp.android_app.model.response;

/**
 * Class to represent an attachment (file) sent in mails
 */
public class Attachment {

    /**
     * File name
     */
    private String name;

    /**
     * File data in base64 format
     */
    private String data;

    public Attachment() { }

    public Attachment(String name, String data) {
        this.name = name;
        this.data = data;
    }

    public String getName() {
        return name;
    }

    public String getData() {
        return data;
    }

    public boolean isImage() {
        return name != null && name.matches("(?i).+\\.(png|jpg|jpeg|gif|bmp|webp)$");
    }

    /** Equals by name+data to prevent duplicates in the chip list (good enough for now) */
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Attachment)) return false;
        Attachment that = (Attachment) o;
        return name != null && name.equals(that.name)
                && data != null && data.equals(that.data);
    }

    @Override public int hashCode() {
        int r = name != null ? name.hashCode() : 0;
        r = 31 * r + (data != null ? data.hashCode() : 0);
        return r;
    }

}
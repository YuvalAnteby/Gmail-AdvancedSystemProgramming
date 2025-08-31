package com.asp.android_app.model.response;

import android.os.Parcelable;

/**
 * Class to represent an attachment (file) sent in mails
 */
public class Attachment implements Parcelable {

    /**
     * File name
     */
    private String name;

    /**
     * File data in base64 format
     */
    private String data;

    public Attachment() {
    }

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

    /**
     * Equals by name+data to prevent duplicates in the chip list (good enough for now)
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Attachment)) return false;
        Attachment that = (Attachment) o;
        return name != null && name.equals(that.name)
                && data != null && data.equals(that.data);
    }

    @Override
    public int hashCode() {
        int r = name != null ? name.hashCode() : 0;
        r = 31 * r + (data != null ? data.hashCode() : 0);
        return r;
    }


    // ---- Parcelable bits ----
    protected Attachment(android.os.Parcel in) {
        name = in.readString();
        data = in.readString();
    }

    public static final Creator<Attachment> CREATOR = new Creator<Attachment>() {
        @Override
        public Attachment createFromParcel(android.os.Parcel in) {
            return new Attachment(in);
        }

        @Override
        public Attachment[] newArray(int size) {
            return new Attachment[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(android.os.Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeString(data);
    }
}
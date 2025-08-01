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

    public String getName() {
        return name;
    }

    public String getData() {
        return data;
    }
}
package com.asp.android_app.model.request;

import com.asp.android_app.model.response.File;

import java.util.List;

/**
 * Minimal request we use for saving drafts or sending mails (using POST)
 */
public class SendMailRequest {
    private String subject;
    private String body;
    private List<String> sentTo;
    private boolean saveAsDraft;
    private List<File> files;

    public SendMailRequest(String subject, String body, List<String> sentTo, boolean saveAsDraft, List<File> files) {
        this.subject = subject;
        this.body = body;
        this.sentTo = sentTo;
        this.saveAsDraft = saveAsDraft;
        this.files = files;
    }
}

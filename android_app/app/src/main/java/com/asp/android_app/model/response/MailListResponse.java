package com.asp.android_app.model.response;

import com.asp.android_app.model.Mail;

import java.util.List;

public class MailListResponse {
    private List<Mail> mails;

    public List<Mail> getMails() {
        return mails;
    }

    public void setMails(List<Mail> mails) {
        this.mails = mails;
    }
}
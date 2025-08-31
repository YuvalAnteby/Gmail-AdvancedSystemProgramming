package com.asp.android_app.model.request;

import com.asp.android_app.model.User;
import com.google.gson.annotations.SerializedName;

public class RegisterRequest {

    @SerializedName("fullName")
    private String fullName;

    @SerializedName("mail")
    private String mail;

    @SerializedName("password")
    private String password;

    @SerializedName("dateOfBirth")
    private String dateOfBirth;

    @SerializedName("image")
    private String image;

    public RegisterRequest(String fullName, String mail, String password, String dateOfBirth, String image) {
        this.fullName = fullName;
        this.mail = mail;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.image = image;
    }

    public RegisterRequest(User user) {
        this.fullName = user.getFullName();
        this.mail = user.getMail();
        this.password = user.getPassword();
        this.dateOfBirth = user.getDateOfBirth();
        this.image = user.getImage();
    }

}

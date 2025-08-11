package com.asp.android_app.model.response;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

/**
 * Represents basic public profile information for a user.
 * Used in:
 * - GET /users/{id}
 */
public class UserInfo implements Parcelable {

    /**
     * User id in the backend
     */
    private final int id;

    /**
     * Mail address of a user
     */
    private final String mail;

    /**
     * The full name of the user.
     */
    private String fullName;

    /**
     * The URL to the user's profile image.
     */
    private String image;

    /**
     * Birthday of a user
     */
    private final String dateOfBirth;

    public UserInfo(String mail, String fullName) {
        this.id = -1;
        this.mail = mail;
        this.fullName = fullName;
        this.image = "";
        this.dateOfBirth = "";
    }

    public UserInfo(UserSearchResult u) {
        this.id = u.getId();
        this.mail = u.getMail();
        this.fullName = u.getName();
        dateOfBirth = "";
        image = "";
    }

    // Constructor from Parcel
    protected UserInfo(Parcel in) {
        id = in.readInt();
        mail = in.readString();
        fullName = in.readString();
        image = in.readString();
        dateOfBirth = in.readString();
    }

    /**
     * @return id of the user
     */
    public int getId() {
        return id;
    }

    /**
     * @return mail address of the user
     */
    public String getMail() {
        return mail;
    }

    /**
     * @return full name of the user
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName full name to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return profile image URL
     */
    public String getImageUrl() {
        return image;
    }

    /**
     * @param imageUrl URL of the profile image
     */
    public void setImageUrl(String imageUrl) {
        this.image = imageUrl;
    }

    /**
     * @return user's date of birth
     */
    public String getDateOfBirth() {
        return this.dateOfBirth;
    }

    public static final Creator<UserInfo> CREATOR = new Creator<UserInfo>() {
        @Override
        public UserInfo createFromParcel(Parcel in) {
            return new UserInfo(in);
        }

        @Override
        public UserInfo[] newArray(int size) {
            return new UserInfo[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int flags) {
        parcel.writeInt(id);
        parcel.writeString(mail);
        parcel.writeString(fullName);
        parcel.writeString(image);
        parcel.writeString(dateOfBirth);
    }

    @NonNull
    @Override
    public String toString() {
        // Used if the view tries to setText after selection.
        // We immediately clear the field on selection, but keep this clean.
        return fullName + " <" + mail + ">";
    }

}
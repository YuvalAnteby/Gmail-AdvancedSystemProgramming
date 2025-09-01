package com.asp.android_app.utils;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.Nullable;

import com.asp.android_app.model.response.File;
import com.asp.android_app.model.response.UserInfo;

import java.util.ArrayList;

/**
 * Utility class we use to pass data to Compose to pre fill reply/forward fields.
 */
public class ComposeParams implements Parcelable {

    /**
     * pre-selected recipients (chips)
     */
    public ArrayList<UserInfo> recipients = new ArrayList<>();

    /**
     * subject line to show (e.g., "Re: Something")
     */
    public String subject = "";

    /**
     * quoted HTML block (reply/forward header + original body)
     */
    @Nullable
    public String quotedHtml;

    /**
     * files to pre-fill (for Forward)
     */
    public ArrayList<File> files = new ArrayList<>();

    /**
     * flags for analytics/debug if needed
     */
    public boolean isReply = false;
    public boolean isForward = false;

    public ComposeParams() {
    }

    protected ComposeParams(Parcel in) {
        recipients = in.createTypedArrayList(UserInfo.CREATOR);
        subject = in.readString();
        quotedHtml = in.readString();
        files = in.createTypedArrayList(File.CREATOR);
        isReply = in.readByte() != 0;
        isForward = in.readByte() != 0;
    }

    public static final Creator<ComposeParams> CREATOR = new Creator<ComposeParams>() {
        @Override
        public ComposeParams createFromParcel(Parcel in) {
            return new ComposeParams(in);
        }

        @Override
        public ComposeParams[] newArray(int size) {
            return new ComposeParams[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeTypedList(recipients);
        dest.writeString(subject);
        dest.writeString(quotedHtml);
        dest.writeTypedList(files);
        dest.writeByte((byte) (isReply ? 1 : 0));
        dest.writeByte((byte) (isForward ? 1 : 0));
    }
}

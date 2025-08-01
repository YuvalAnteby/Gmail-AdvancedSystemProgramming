package com.asp.android_app.utils;

import android.text.format.DateUtils;
import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;
import java.util.TimeZone;


/**
 * Util class to handle formatting a timestamp string to more phone friendly format
 */
public class DateUtil {

    /**
     * Converts a timestamp string to a date in the format MONTH DD, YYYY or `Today` and `Yesterday`
     *
     * @param isoTimestamp timestamp string
     * @return - `Today` if timestamp's date is today
     * - `Yesterday` if timestamp's date is yesterday
     * - `MONTH DD, YYYY` format for any other date
     * - empty string if an error occurred
     */
    public static String getFormattedDate(String isoTimestamp) {
        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
        isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

        try {
            Date date = isoFormat.parse(isoTimestamp);
            if (date == null) return "";

            long now = System.currentTimeMillis();
            long inputTime = date.getTime();

            if (DateUtils.isToday(inputTime)) {
                return "Today";
            } else if (DateUtils.isToday(inputTime + DateUtils.DAY_IN_MILLIS)) {
                return "Yesterday";
            } else {
                SimpleDateFormat friendlyFormat = new SimpleDateFormat("MMMM d, yyyy", Locale.getDefault());
                return friendlyFormat.format(date);
            }

        } catch (ParseException e) {
            Log.i("DATE UTIL:", Objects.requireNonNull(e.getMessage()));
            return "";
        }
    }
}
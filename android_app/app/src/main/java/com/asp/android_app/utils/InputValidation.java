package com.asp.android_app.utils;

import android.util.Patterns;

import java.util.Calendar;

/**
 * Class to handle input validation. e.g. mail, password, age etc.
 */
public class InputValidation {

    public static boolean isFullNameValid(String name) {
        if (name == null || name.trim().isEmpty())
            return false;
        // Regex: only letters, hyphens, and apostrophes (e.g., O'Connor, Anne-Marie)
        String namePartRegex = "^[A-Za-zÀ-ÿ'-]+$";
        return name.matches(namePartRegex);
    }

    /**
     * Checks the validity of the given mail address
     *
     * @param email email address
     * @return true if the email address is of valid format, otherwise false
     */
    public static boolean isEmailValid(String email) {
        return !email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    /**
     * Checks the validity of the given password
     *
     * @param password password of a user
     * @return false if empty or contains whitespaces only, otherwise false
     */
    public static boolean isPasswordValid(String password) {
        return !password.isBlank();
    }

    /**
     * calculates an age from a given string
     *
     * @param birthDateStr string of a birth date in the format YYYY/MM/DD
     * @return -1 if the string is empty or null, otherwise the age as an int
     */
    public static int calculateAge(String birthDateStr) {
        if (birthDateStr == null || birthDateStr.isBlank())
            return -1;
        // Expecting input format: "YYYY/MM/DD"
        String[] parts = birthDateStr.split("/");

        if (parts.length != 3) {
            return -1; // invalid format
        }

        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]) - 1; // Calendar months are 0-based
        int day = Integer.parseInt(parts[2]);

        Calendar today = Calendar.getInstance();
        Calendar birthDate = Calendar.getInstance();
        birthDate.set(year, month, day);

        int age = today.get(Calendar.YEAR) - birthDate.get(Calendar.YEAR);

        // Check if birthday has not occurred yet this year
        if (today.get(Calendar.DAY_OF_YEAR) < birthDate.get(Calendar.DAY_OF_YEAR)) {
            age--;
        }

        return age;
    }
}
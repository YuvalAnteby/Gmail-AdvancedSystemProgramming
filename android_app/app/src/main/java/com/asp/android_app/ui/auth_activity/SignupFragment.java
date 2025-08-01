package com.asp.android_app.ui.auth_activity;

import android.app.DatePickerDialog;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.asp.android_app.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import java.util.Calendar;

public class SignupFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.signup_fragment, container, false);

        // Initialize the views
        TextInputLayout emailLayout = view.findViewById(R.id.emailLayout);
        TextInputEditText etEmail = view.findViewById(R.id.etEmail);
        TextInputLayout passwordLayout = view.findViewById(R.id.passwordLayout);
        TextInputEditText etPassword = view.findViewById(R.id.etPassword);
        TextInputLayout birthDateLayout = view.findViewById(R.id.birthDateLayout);
        TextInputEditText etBirthDate = view.findViewById(R.id.etBirthDate);
        ImageView profileImage = view.findViewById(R.id.profileImage);
        MaterialButton btnSignup = view.findViewById(R.id.btnSignup);

        etBirthDate.setOnClickListener(v -> showDatePicker(etBirthDate));
        profileImage.setOnClickListener(v -> chooseImage(profileImage));
        btnSignup.setOnClickListener(v ->
                handleSignup(
                        profileImage,
                        emailLayout,
                        etEmail,
                        passwordLayout,
                        etPassword,
                        birthDateLayout,
                        etBirthDate
                ));

        return view;
    }

    private void showDatePicker(TextInputEditText etBirthDate) {
        Calendar calendar = Calendar.getInstance();
        DatePickerDialog dialog = new DatePickerDialog(requireContext(),
                (view, year, month, dayOfMonth) -> {
                    String formatted = String.format("%04d/%02d/%02d", year, month + 1, dayOfMonth);
                    etBirthDate.setText(formatted);
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH));
        dialog.show();
    }

    private void chooseImage(ImageView imageProfile) {
        // You can implement image picker logic using Intent.ACTION_PICK
        Toast.makeText(getContext(), "Image picker not implemented", Toast.LENGTH_SHORT).show();
    }

    private void handleSignup(
            ImageView imageProfile,
            TextInputLayout emailLayout,
            TextInputEditText etEmail,
            TextInputLayout passwordLayout,
            TextInputEditText etPassword,
            TextInputLayout birthDateLayout,
            TextInputEditText etBirthDate
    ) {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String birthDate = etBirthDate.getText().toString().trim();
        Resources res = getResources();
        // check email input validity
        boolean isEmailValid = isEmailValid(email);
        if (!isEmailValid) {
            emailLayout.setError(res.getString(R.string.invalid_email));
        } else {
            emailLayout.setError(null);
        }
        // check password input validity
        boolean isPasswordValid = isPasswordValid(password);
        if (!isPasswordValid) {
            passwordLayout.setError(res.getString(R.string.empty_password));
        } else {
            passwordLayout.setError(null);
        }
        // check birth date input validity, showing custom messages if age is invalid
        int age = calculateAge(birthDate);
        boolean isAgeValid;
        if (age < 0) {
            birthDateLayout.setError(getResources().getString(R.string.empty_birth_date));
            isAgeValid = false;
        } else if (age < 3) {
            birthDateLayout.setError(res.getString(R.string.invalid_birth_date, age));
            isAgeValid = false;
        } else if (age > 100) {
            birthDateLayout.setError(res.getString(R.string.invalid_birth_date, age));
            isAgeValid = false;
        } else {
            birthDateLayout.setError(null);
            isAgeValid = true;
        }

        // don't attempt server access if invalid input
        if (!isEmailValid || !isPasswordValid || !isAgeValid)
            return;


        // TODO: Send signup data to server or handle locally
        Toast.makeText(getContext(), "Signup successful!", Toast.LENGTH_SHORT).show();
    }

    /**
     * Checks the validity of the given mail address
     *
     * @param email email address
     * @return true if the email address is of valid format, otherwise false
     */
    private boolean isEmailValid(String email) {
        return !email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    /**
     * Checks the validity of the given password
     *
     * @param password password of a user
     * @return false if empty or contains whitespaces only, otherwise false
     */
    private boolean isPasswordValid(String password) {
        return !password.isBlank();
    }

    /**
     * calculates an age from a given string
     *
     * @param birthDateStr string of a birth date in the format YYYY/MM/DD
     * @return -1 if the string is empty or null, otherwise the age as an int
     */
    public int calculateAge(String birthDateStr) {
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

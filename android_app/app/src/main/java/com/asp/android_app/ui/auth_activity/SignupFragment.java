package com.asp.android_app.ui.auth_activity;

import static com.asp.android_app.utils.Base64Converter.displayBase64Image;
import static com.asp.android_app.utils.InputValidation.calculateAge;
import static com.asp.android_app.utils.InputValidation.isEmailValid;
import static com.asp.android_app.utils.InputValidation.isFullNameValid;
import static com.asp.android_app.utils.InputValidation.isPasswordValid;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.User;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.ui.inbox_activity.InboxActivity;
import com.asp.android_app.utils.ImagePicker;
import com.asp.android_app.utils.Result;
import com.asp.android_app.utils.TokenManager;
import com.asp.android_app.viewmodel.UserViewModel;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import java.util.Calendar;

public class SignupFragment extends Fragment {

    private ActivityResultLauncher<String> imagePickerLauncher;

    UserViewModel userViewModel;

    TextInputLayout nameLayout, emailLayout, passwordLayout, birthDateLayout;
    TextInputEditText etName, etEmail, etPassword, etBirthDate;
    ImageView profileImage;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.signup_fragment, container, false);

        // Initialize the view model class
        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        // Initialize the views
        nameLayout = view.findViewById(R.id.nameLayout);
        etName = view.findViewById(R.id.etName);
        emailLayout = view.findViewById(R.id.emailLayout);
        etEmail = view.findViewById(R.id.etEmail);
        passwordLayout = view.findViewById(R.id.passwordLayout);
        etPassword = view.findViewById(R.id.etPassword);
        birthDateLayout = view.findViewById(R.id.birthDateLayout);
        etBirthDate = view.findViewById(R.id.etBirthDate);
        profileImage = view.findViewById(R.id.profileImage);
        MaterialButton btnSignup = view.findViewById(R.id.btnSignup);

        // clicking the date of birth will let you pick a date
        etBirthDate.setOnClickListener(v -> showDatePicker(etBirthDate));
        // clicking the avatar will let you pick a new profile picture
        profileImage.setOnClickListener(v -> imagePickerLauncher.launch("image/*"));
        // clicking signup will ensure the input is valid and create a new user
        btnSignup.setOnClickListener(view1 -> handleSignup());

        // create the external activity of picking an image
        imagePickerLauncher = ImagePicker.registerImagePicker(this, requireContext(),
                new ImagePicker.ImagePickerCallback() {
                    @Override
                    public void onImagePicked(String base64Image) {
                        displayBase64Image(base64Image, profileImage);
                        // store base64 in a tag or field for use in registering
                        profileImage.setTag(base64Image);
                    }

                    @Override
                    public void onError(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                    }
                });


        return view;
    }

    /**
     * Shows a dialog to pick the birthday
     *
     * @param etBirthDate edit text of the birthday, will edit it with the date picked
     */
    private void showDatePicker(TextInputEditText etBirthDate) {
        Calendar calendar = Calendar.getInstance();
        DatePickerDialog dialog = new DatePickerDialog(requireContext(),
                (view, year, month, dayOfMonth) -> {
                    final String FORMAT = "%04d/%02d/%02d";
                    String formatted = String.format(FORMAT, year, month + 1, dayOfMonth);
                    etBirthDate.setText(formatted);
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH));
        dialog.show();
    }

    /**
     * Checks if input fields are valid
     *
     * @return true if all fields are valid, otherwise false
     */
    private boolean isInputValid() {
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String birthDate = etBirthDate.getText().toString().trim();
        Resources res = getResources();

        // check name input validity
        boolean isNameValid = isFullNameValid(name);
        if (!isNameValid) {
            nameLayout.setError(res.getString(R.string.invalid_name));
        } else {
            nameLayout.setError(null);
        }
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

        // if all fields are valid return true
        return isNameValid && isEmailValid && isPasswordValid && isAgeValid;
    }


    /**
     * Handles the signup of a user, checks the user's input and sends the input to the server
     */
    private void handleSignup() {
        // get the input
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String birthDate = etBirthDate.getText().toString().trim();
        String imageBase64 = "";

        Object tag = profileImage.getTag();
        if (tag instanceof String)
            imageBase64 = (String) tag;

        // check input validity - if info isn't valid don't continue
        if (!isInputValid())
            return;

        // register
        User newUser = new User(email, password, name, birthDate, imageBase64);
        userViewModel.register(newUser);
        // wait for results
        userViewModel.getAuthResult().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                AuthResponse auth = ((Result.Success<AuthResponse>) result).getData();
                handleSignupSuccess(auth);
            } else if (result instanceof Result.Error) {
                String msg = ((Result.Error<?>) result).getMessage();
                handleSignupErrors(msg, emailLayout);
            }
        });
    }

    /**
     * Handles the case of successful signup - saves the JWT token and moves to inbox
     *
     * @param auth authorization call response instance
     */
    private void handleSignupSuccess(AuthResponse auth) {
        // save the token
        TokenManager tokenManager = TokenManager.getInstance(requireContext());
        tokenManager.saveToken(auth.getToken());
        // navigate to the inbox screen
        Toast.makeText(getContext(), "Welcome " + auth.getUser().getFullName(), Toast.LENGTH_SHORT).show();
        startActivity(new Intent(getContext(), InboxActivity.class));
        requireActivity().finish();
    }

    /**
     * Handles errors that occur during login
     *
     * @param msg         message from the server
     * @param emailLayout layout containing the edit text of the mail address
     */
    private void handleSignupErrors(String msg, TextInputLayout emailLayout) {
        Log.i("signup error:", msg);
        // error of already existing mail address
        if (msg.contains("400") || msg.contains("exists")) {
            emailLayout.setError("Email address taken");
            return;
        }
        Toast.makeText(
                getContext(),
                getResources().getString(R.string.unexpected_error) + msg,
                Toast.LENGTH_LONG
        ).show();
    }

}

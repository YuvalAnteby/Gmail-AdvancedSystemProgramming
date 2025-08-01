package com.asp.android_app.ui.auth_activity;

import static android.app.Activity.RESULT_OK;
import static com.asp.android_app.utils.Base64Converter.displayBase64Image;
import static com.asp.android_app.utils.InputValidation.calculateAge;
import static com.asp.android_app.utils.InputValidation.isEmailValid;
import static com.asp.android_app.utils.InputValidation.isFullNameValid;
import static com.asp.android_app.utils.InputValidation.isPasswordValid;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.R;
import com.asp.android_app.model.User;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.repository.UserRepository;
import com.asp.android_app.ui.inbox_activity.InboxActivity;
import com.asp.android_app.utils.Base64Converter;
import com.asp.android_app.utils.Result;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import java.util.Calendar;

public class SignupFragment extends Fragment {

    private ActivityResultLauncher<Intent> imagePickerLauncher;
    private Uri selectedImageUri = null;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.signup_fragment, container, false);

        // Initialize the views
        TextInputLayout nameLayout = view.findViewById(R.id.nameLayout);
        TextInputEditText etName = view.findViewById(R.id.etName);
        TextInputLayout emailLayout = view.findViewById(R.id.emailLayout);
        TextInputEditText etEmail = view.findViewById(R.id.etEmail);
        TextInputLayout passwordLayout = view.findViewById(R.id.passwordLayout);
        TextInputEditText etPassword = view.findViewById(R.id.etPassword);
        TextInputLayout birthDateLayout = view.findViewById(R.id.birthDateLayout);
        TextInputEditText etBirthDate = view.findViewById(R.id.etBirthDate);
        ImageView profileImage = view.findViewById(R.id.profileImage);
        MaterialButton btnSignup = view.findViewById(R.id.btnSignup);

        // clicking the date of birth will let you pick a date
        etBirthDate.setOnClickListener(v -> showDatePicker(etBirthDate));
        // clicking the avatar will let you pick a new profile picture
        profileImage.setOnClickListener(v -> chooseImage());
        // clicking signup will ensure the input is valid and create a new user
        btnSignup.setOnClickListener(view1 -> {
            handleSignup(nameLayout,
                    etName,
                    emailLayout,
                    etEmail,
                    passwordLayout,
                    etPassword,
                    birthDateLayout,
                    etBirthDate);
        });

        // create the external activity of picking an image
        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        Uri imageUri = result.getData().getData();
                        //String img = handleImageUri(imageUri);
                        selectedImageUri = imageUri;
                        String img = Base64Converter.fileUriToBase64(imageUri, view.getContext());
                        displayBase64Image(img, profileImage);
                    }
                }
        );

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
     * Launches the external activity to pick an image
     */
    private void chooseImage() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType("image/*");
        imagePickerLauncher.launch(intent);
    }

    /**
     * Checks if input fields are valid
     *
     * @param nameLayout      layout containing the full name input
     * @param etName          edit text of the name
     * @param emailLayout     layout containing the email address input
     * @param etEmail         edit text of the email
     * @param passwordLayout  layout containing the password input
     * @param etPassword      edit text of the password
     * @param birthDateLayout layout containing the birthday input
     * @param etBirthDate     edit text of the birthday
     * @return true if all fields are valid, otherwise false
     */
    private boolean isInputValid(
            TextInputLayout nameLayout,
            TextInputEditText etName,
            TextInputLayout emailLayout,
            TextInputEditText etEmail,
            TextInputLayout passwordLayout,
            TextInputEditText etPassword,
            TextInputLayout birthDateLayout,
            TextInputEditText etBirthDate
    ) {
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
     *
     * @param nameLayout      layout containing the full name input
     * @param etName          edit text of the name
     * @param emailLayout     layout containing the email address input
     * @param etEmail         edit text of the email
     * @param passwordLayout  layout containing the password input
     * @param etPassword      edit text of the password
     * @param birthDateLayout layout containing the birthday input
     * @param etBirthDate     edit text of the birthday
     */
    private void handleSignup(
            TextInputLayout nameLayout,
            TextInputEditText etName,
            TextInputLayout emailLayout,
            TextInputEditText etEmail,
            TextInputLayout passwordLayout,
            TextInputEditText etPassword,
            TextInputLayout birthDateLayout,
            TextInputEditText etBirthDate
    ) {
        // Initialize the repository class
        UserRepository userRepository = new UserRepository(requireContext());

        // get the input
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String birthDate = etBirthDate.getText().toString().trim();
        String imageBase64 = "";
        if (selectedImageUri != null)
            imageBase64 = Base64Converter.fileUriToBase64(selectedImageUri, requireContext());

        // check input validity - if info isn't valid don't continue
        if (!isInputValid(
                nameLayout,
                etName,
                emailLayout,
                etEmail,
                passwordLayout,
                etPassword,
                birthDateLayout, etBirthDate
        ))
            return;

        User newUser = new User(email, password, name, birthDate, imageBase64);
        MutableLiveData<Result<AuthResponse>> resultLiveData = new MutableLiveData<>();

        resultLiveData.observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Loading) {
                /// TODO show loading
                Toast.makeText(getContext(), "LOADING", Toast.LENGTH_SHORT).show();
            } else if (result instanceof Result.Success) {
                AuthResponse auth = ((Result.Success<AuthResponse>) result).getData();
                Toast.makeText(getContext(), "Welcome " + auth.getUser().getFullName(), Toast.LENGTH_SHORT).show();
                startActivity(new Intent(getContext(), InboxActivity.class));
                requireActivity().finish();
            } else if (result instanceof Result.Error) {
                Log.i("login:", ((Result.Error<?>) result).getMessage());
                Toast.makeText(getContext(), "Login failed: " + ((Result.Error<?>) result).getMessage(), Toast.LENGTH_LONG).show();
            }
        });

        userRepository.register(newUser, resultLiveData);

    }

}

package com.asp.android_app.ui.auth_activity;

import static com.asp.android_app.utils.InputValidation.isEmailValid;
import static com.asp.android_app.utils.InputValidation.isPasswordValid;

import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.R;
import com.asp.android_app.model.request.LoginRequest;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.repository.UserRepository;
import com.asp.android_app.ui.InboxActivity;
import com.asp.android_app.utils.Result;
import com.asp.android_app.utils.TokenManager;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

public class LoginFragment extends Fragment {

    public LoginFragment() {
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.login_fragment, container, false);

        // Initialize views
        Button btnSwitch = view.findViewById(R.id.btnSignup);
        Button btnLogin = view.findViewById(R.id.btnLogin);
        TextInputLayout emailLayout = view.findViewById(R.id.emailLayout);
        TextInputEditText etAddress = view.findViewById(R.id.etAddress);
        TextInputLayout passwordLayout = view.findViewById(R.id.passwordLayout);
        TextInputEditText etPassword = view.findViewById(R.id.etPassword);

        // Initialize the repository class
        UserRepository userRepository = new UserRepository(requireContext());

        // Handle signup button clicks - change to the signup fragment
        btnSwitch.setOnClickListener(v ->
                requireActivity().getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, new SignupFragment())
                        .addToBackStack(null)
                        .commit());

        // Handle login button clicks - navigate to the inbox activity
        btnLogin.setOnClickListener(view1 -> {
            onLoginCLick(emailLayout, etAddress, passwordLayout, etPassword, userRepository);
        });

        return view;
    }

    /**
     * Checks if input fields are valid
     *
     * @param emailLayout    layout containing the email address input
     * @param email          mail address input
     * @param passwordLayout layout containing the password input
     * @param password       password input
     * @return true if all fields are valid, otherwise false
     */
    private boolean isInputValid(
            TextInputLayout emailLayout,
            String email,
            TextInputLayout passwordLayout,
            String password) {

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

        // if all fields are valid return true
        return isEmailValid && isPasswordValid;
    }

    /**
     * Handles login button click - checks validity and login
     *
     * @param emailLayout    layout containing the email address input
     * @param etEmail        edit text of the email
     * @param passwordLayout layout containing the password input
     * @param etPassword     edit text of the password
     * @param repo           user repository class instance
     */
    private void onLoginCLick(
            TextInputLayout emailLayout,
            TextInputEditText etEmail,
            TextInputLayout passwordLayout,
            TextInputEditText etPassword,
            UserRepository repo) {
        String mail = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (!isInputValid(emailLayout, mail, passwordLayout, password))
            return;

        LoginRequest request = new LoginRequest(mail, password);
        MutableLiveData<Result<AuthResponse>> resultLiveData = new MutableLiveData<>();

        resultLiveData.observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Loading) {
                /// TODO show loading
                Toast.makeText(getContext(), "LOADING", Toast.LENGTH_SHORT).show();
            } else if (result instanceof Result.Success) {
                AuthResponse auth = ((Result.Success<AuthResponse>) result).getData();
                handleLoginSuccess(auth);
            } else if (result instanceof Result.Error) {
                String msg = ((Result.Error<?>) result).getMessage();
                handleLoginError(msg, passwordLayout, etPassword);
            }
        });

        repo.login(request, resultLiveData);
    }

    /**
     * Handles the case of successful login - saves the JWT token and moves to inbox
     *
     * @param auth authorization call response instance
     */
    private void handleLoginSuccess(AuthResponse auth) {
        // save the token
        TokenManager tokenManager = TokenManager.getInstance(requireContext());
        tokenManager.saveToken(auth.getToken());
        // navigate to the inbox screen
        startActivity(new Intent(getContext(), InboxActivity.class));
        requireActivity().finish();
        Toast.makeText(getContext(), "Welcome " + auth.getUser().getFullName(), Toast.LENGTH_SHORT).show();
    }

    /**
     * Handles errors that occur during login
     *
     * @param msg    message from the server
     * @param layout layout containing the password edit text
     * @param et     edit text of the password
     */
    private void handleLoginError(String msg, TextInputLayout layout, TextInputEditText et) {
        Log.i("login error:", msg); // log
        // if it's wrong mail and password - clear the password and inform
        if (msg.contains("401") || msg.contains("wrong")) {
            layout.setError(getResources().getString(R.string.wrong_input));
            et.setText("");
            return;
        }
        // check if the server is up
        if (msg.contains("Failed to connect")) {
            Toast.makeText(requireContext(), getResources().getString(R.string.server_off), Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(requireContext(), "Unexpected Error, try again", Toast.LENGTH_SHORT).show();
    }
}
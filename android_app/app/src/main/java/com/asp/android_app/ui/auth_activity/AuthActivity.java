package com.asp.android_app.ui.auth_activity;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.ui.inbox_activity.InboxActivity;
import com.asp.android_app.utils.Result;
import com.asp.android_app.utils.TokenManager;
import com.asp.android_app.viewmodel.UserViewModel;

public class AuthActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_auth);

        UserViewModel userViewModel = new ViewModelProvider(this).get(UserViewModel.class);
        TokenManager tokenManager = TokenManager.getInstance(this);
        String token = tokenManager.getToken();

        // attempt to login when starting the app
        if (token == null || token.isBlank())
            showLoginFragment();
        else
            attemptAutoLogin(userViewModel);

        // set observer
        userViewModel.getAuthResult().observe(this, result -> {
            if (result instanceof Result.Success) {
                // If token exists and valid, skip login
                AuthResponse auth = ((Result.Success<AuthResponse>) result).getData();
                Intent intent = new Intent(this, InboxActivity.class);
                intent.putExtra("user", auth.getUser());
                startActivity(intent);
                finish();
            } else {
                showLoginFragment();
            }
        });

    }

    /**
     * attempts to auto login using a JWT token saved locally
     *
     * @param userViewModel view model of users
     */
    private void attemptAutoLogin(UserViewModel userViewModel) {
        userViewModel.validateToken();
    }

    /**
     * Shows the login/ signup fragments
     */
    private void showLoginFragment() {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_container, new LoginFragment())
                .commit();
    }
}
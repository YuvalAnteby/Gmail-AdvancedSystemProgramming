package com.asp.android_app.ui.auth_activity;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.ui.inbox_activity.InboxActivity;
import com.asp.android_app.utils.NetworkUtil;
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

        // set observer
        userViewModel.getAuthResult().observe(this, result -> {
            if (result instanceof Result.Success) {
                // cache user for future offline boots
                AuthResponse auth = ((Result.Success<AuthResponse>) result).getData();
                if (auth != null && auth.getUser() != null) tokenManager.saveUser(auth.getUser());
                goToInbox(auth != null ? auth.getUser() : tokenManager.getUser(), false);
            } else if (result instanceof Result.Error) {
                String msg = ((Result.Error<?>) result).getMessage();
                // If we are ONLINE and got explicit UNAUTHORIZED - bounce to login.
                if (NetworkUtil.isOnline(this) && "UNAUTHORIZED".equals(msg)) {
                    tokenManager.clearToken();
                    tokenManager.clearUser();
                    showLoginFragment();
                } else {
                    UserInfo cached = tokenManager.getUser();
                    if (cached != null) {
                        goToInbox(cached, true);
                    } else {
                        showLoginFragment();
                    }
                }
            }
        });

        // Entry decision - make sure the token exists, and still fresh
        if (token == null || token.isBlank() || !tokenManager.isFreshToken()) {
            showLoginFragment();
            return;
        }

        // Token exists:
        if (NetworkUtil.isOnline(this)) {
            // Online -> do real validation
            userViewModel.validateToken();
        } else {
            // Offline - enter Inbox immediately using cached user (if we have one)
            UserInfo cached = tokenManager.getUser();
            // If cached == null, we can still enter Inbox (it only reads from Room ),
            // or show login—your call. I prefer entering Inbox so offline cache is useful.
            goToInbox(cached, true);
            // Optional: We could register a network callback here to revalidate when online.
            // Keeping it simple; Inbox can also trigger revalidation.
        }

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

    /**
     * Launch Inbox with an optional user and an offline flag.
     * If user is null, Inbox should still work (local cache + "unknown user" UI).
     */
    private void goToInbox(UserInfo user, boolean offline) {
        Intent intent = new Intent(this, InboxActivity.class);
        if (user != null) intent.putExtra("user", user);
        intent.putExtra("offline_mode", offline);
        startActivity(intent);
        finish();
    }
}
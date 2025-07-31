package com.asp.android_app.ui.auth_activity;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.asp.android_app.R;

public class AuthActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_auth);

        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, new LoginFragment())
                    .commit();
        }

    }

}
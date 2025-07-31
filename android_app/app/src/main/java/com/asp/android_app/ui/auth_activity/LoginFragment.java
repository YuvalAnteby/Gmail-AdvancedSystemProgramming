package com.asp.android_app.ui.auth_activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.R;
import com.asp.android_app.model.request.LoginRequest;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.repository.UserRepository;
import com.asp.android_app.ui.InboxActivity;
import com.asp.android_app.utils.Result;

public class LoginFragment extends Fragment {

    public LoginFragment() {
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.login_fragment, container, false);

        // Initialize views
        Toast.makeText(inflater.getContext(), "LOGIN", Toast.LENGTH_SHORT).show();
        Button btnSwitch = view.findViewById(R.id.btnSignup);
        Button btnLogin = view.findViewById(R.id.btnLogin);
        EditText etAddress = view.findViewById(R.id.etAddress);
        EditText etPassword = view.findViewById(R.id.etPassword);

        // Initialize the repository class
        UserRepository userRepository = new UserRepository(requireContext());

        // Handle signup button clicks - change to the signup fragment
        btnSwitch.setOnClickListener(v -> {
            requireActivity().getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, new SignupFragment())
                    .addToBackStack(null)
                    .commit();
        });

        // Handle login button clicks - navigate to the inbox activity
        btnLogin.setOnClickListener(view1 -> {
            onLoginCLick(etAddress, etPassword, userRepository);
        });

        return view;
    }

    private void onLoginCLick(EditText etAddress, EditText etPassword, UserRepository repo) {
        String address = etAddress.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        /// TODO replace with more modern UI change
        if (address.isEmpty() || password.isEmpty()) {
            Toast.makeText(getContext(), "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        LoginRequest request = new LoginRequest(address, password);
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

        repo.login(request, resultLiveData);
    }

}
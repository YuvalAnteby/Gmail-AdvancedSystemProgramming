package com.asp.android_app.ui.auth_activity;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.asp.android_app.R;

public class SignupFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.signup_fragment, container, false);

        /*
        Button btnSwitch = view.findViewById(R.id.btn_to_first);
        btnSwitch.setOnClickListener(v -> {
            requireActivity().getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, new FirstFragment())
                    .addToBackStack(null)
                    .commit();
        });*/

        return view;
    }
}
package com.asp.android_app.ui.compose_activity;

import android.os.Bundle;
import android.view.View;

import androidx.fragment.app.Fragment;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;

public class ComposeFragment extends Fragment {


    private static final String ARG_DRAFT_ID = "arg_draft_id";
    private long draftId = -1;

    /**
     * Factory for creating a compose instance.
     *
     * @param draftId pass -1 for a new mail, or an existing draft id to edit
     */
    public static ComposeFragment newInstance(long draftId) {
        Bundle b = new Bundle();
        b.putLong(ARG_DRAFT_ID, draftId);
        ComposeFragment f = new ComposeFragment();
        f.setArguments(b);
        return f;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.compose_fragment, container, false);
    }
}

package com.asp.android_app.ui.compose_activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.PersistableBundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Simple holder Activity for ComposeFragment.
 * I prefer this so the compose UI can be reused (e.g., reply and forward).
 */
public class ComposeMailActivity extends AppCompatActivity {

    /**
     * Key for passing a draftId. -1 means new mail (not a draft to edit)
     */
    public static final String EXTRA_DRAFT_ID = "extra_draft_id";

    /**
     * Factory to create an Intent for opening compose (optionally with a draftId to edit).
     */
    public static Intent newIntent(Context c, long draftId) {
        Intent i = new Intent(c, ComposeMailActivity.class);
        i.putExtra(EXTRA_DRAFT_ID, draftId);
        return i;
    }


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (savedInstanceState == null)
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(
                            android.R.id.content,
                            ComposeFragment.newInstance(
                                    getIntent().getLongExtra(EXTRA_DRAFT_ID, -1)
                            ))
                    .commit();
    }
}

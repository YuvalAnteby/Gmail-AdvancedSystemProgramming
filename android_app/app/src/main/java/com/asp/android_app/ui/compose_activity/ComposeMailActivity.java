package com.asp.android_app.ui.compose_activity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.asp.android_app.utils.ComposeParams;

/**
 * Simple holder Activity for ComposeFragment.
 * I prefer this so the compose UI can be reused (e.g., reply and forward).
 */
public class ComposeMailActivity extends AppCompatActivity {

    /**
     * Key for passing a draftId. -1 means new mail (not a draft to edit)
     */
    public static final String EXTRA_DRAFT_ID = "extra_draft_id";
    public static final String EXTRA_PREFILL = "extra_prefill";

    /**
     * Factory to create an Intent for opening compose (optionally with a draftId to edit).
     */
    public static Intent newIntent(Context c, long draftId) {
        Intent i = new Intent(c, ComposeMailActivity.class);
        i.putExtra(EXTRA_DRAFT_ID, draftId);
        return i;
    }

    /**
     * Factory to create an intent for opening compose for reply/ forward functionalities
     *
     * @param context where we called from
     * @param params  object of data to pass when using reply/forward
     */
    public static Intent newIntent(Context context, @Nullable ComposeParams params) {
        Intent i = newIntent(context, -1);
        if (params != null) i.putExtra(EXTRA_PREFILL, params);
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

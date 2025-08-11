package com.asp.android_app.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.asp.android_app.ui.compose_activity.ComposeMailActivity;

/**
 * Small helper to start the Compose flow and parse the result.
 * I made overloads for both Activity and Fragment so each screen can register its own launcher.
 */
public final class ComposeNavigation {

    private ComposeNavigation() { /* no instances */ }

    /**
     * Listener for compose results. I kept it simple with two callbacks.
     * You can add more if you later return more actions (e.g., "discarded").
     */
    public interface ResultListener {
        /**
         * Called when the compose screen finished with a "sent" action.
         */
        void onSent();

        /**
         * Called when the compose screen finished with a "saved" (draft) action.
         */
        void onSaved();
    }

    /**
     * Registers a launcher in an Activity to handle compose results.
     *
     * @param activity a ComponentActivity (e.g., AppCompatActivity)
     * @param listener callbacks for "sent"/"saved"
     * @return the launcher you should keep as a field and use to launch intents
     */
    public static ActivityResultLauncher<Intent> register(
            @NonNull ComponentActivity activity,
            @NonNull ResultListener listener
    ) {
        return activity.registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null)
                        return;
                    String action = result.getData().getStringExtra("compose_result_action");
                    if ("sent".equals(action)) {
                        listener.onSent();
                    } else if ("saved".equals(action)) {
                        listener.onSaved();
                    }
                }
        );
    }

    /**
     * Registers a launcher in a Fragment to handle compose results.
     *
     * @param fragment a Fragment
     * @param listener callbacks for "sent"/"saved"
     * @return the launcher you should keep as a field and use to launch intents
     */
    public static ActivityResultLauncher<Intent> register(
            @NonNull Fragment fragment,
            @NonNull ResultListener listener
    ) {
        return fragment.registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null)
                        return;
                    String action = result.getData().getStringExtra("compose_result_action");
                    if ("sent".equals(action)) {
                        listener.onSent();
                    } else if ("saved".equals(action)) {
                        listener.onSaved();
                    }
                }
        );
    }

    /**
     * Starts compose for a brand new mail.
     *
     * @param launcher the launcher returned by {@link #register(ComponentActivity, ResultListener)} or {@link #register(Fragment, ResultListener)}
     * @param ctx      context used to build the Intent
     */
    public static void openNew(@NonNull ActivityResultLauncher<Intent> launcher, @NonNull Context ctx) {
        launcher.launch(ComposeMailActivity.newIntent(ctx, -1));
    }

    /**
     * Starts compose for editing an existing draft.
     *
     * @param launcher the registered launcher
     * @param ctx      context used to build the Intent
     * @param draftId  id of the draft to edit
     */
    public static void openDraft(@NonNull ActivityResultLauncher<Intent> launcher, @NonNull Context ctx, long draftId) {
        launcher.launch(ComposeMailActivity.newIntent(ctx, draftId));
    }
}

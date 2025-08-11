package com.asp.android_app.ui.inbox_activity;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.asp.android_app.R;
import com.asp.android_app.model.Label;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.utils.ComposeNavigation;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.LabelViewModel;
import com.asp.android_app.viewmodel.MailViewModel;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.snackbar.Snackbar;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Fragment containing the inbox, responsible on the showing the mails list, handling clicks,
 * selection and refreshes.
 */
public class InboxFragment extends Fragment {

    private MailViewModel mailViewModel;
    private MailAdapter mailAdapter;
    private String inboxType = "incoming"; // default inbox is incoming mails
    private final ActivityResultLauncher<Intent> readingLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    boolean shouldRefresh = result.getData().getBooleanExtra("refresh", false);
                    String returnedInboxType = result.getData().getStringExtra("inboxType");
                    if (shouldRefresh && returnedInboxType != null && returnedInboxType.equals(inboxType)) {
                        mailViewModel.loadMails(inboxType); // refresh only if same inbox
                    }
                }
            });

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.inbox_fragment, container, false);

        // initialize the mails view model
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        mailViewModel.loadMails(inboxType);

        initializeActionBar();

        ActivityResultLauncher<Intent> composeLauncher = ComposeNavigation.register(this, new ComposeNavigation.ResultListener() {
            @Override
            public void onSent() {
                setInbox("incoming");
                Snackbar.make(view.findViewById(android.R.id.content),
                        R.string.compose_sent_success, Snackbar.LENGTH_SHORT).show();
            }

            @Override
            public void onSaved() {
                setInbox("draft");
                Snackbar.make(view.findViewById(android.R.id.content),
                        R.string.compose_saved_success, Snackbar.LENGTH_SHORT).show();
            }
        });

        // initialize the recycler view
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        MailSelectionListener selectionListener = hasSelection -> {
            requireActivity().runOnUiThread(() -> {
                View customBar = requireActivity().findViewById(R.id.custom_toolbar);
                View actionBar = requireActivity().findViewById(R.id.action_bar);
                customBar.setVisibility(hasSelection ? GONE : VISIBLE);
                actionBar.setVisibility(hasSelection ? VISIBLE : GONE);
            });
        };
        mailAdapter = new MailAdapter(
                requireContext(),
                getViewLifecycleOwner(),
                inboxType,
                readingLauncher,
                mailViewModel,
                selectionListener,
                composeLauncher
        );
        recyclerView.setAdapter(mailAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        // initialize the swiping down for refresh
        SwipeRefreshLayout swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            // Trigger refresh from ViewModel
            String loadInbox = inboxType;
            if (loadInbox == null || loadInbox.isBlank())
                loadInbox = "incoming";
            mailViewModel.loadMails(loadInbox);
        });
        observeViewModel(swipeRefreshLayout);

        return view;
    }

    /**
     * Observer for mail data changes
     */
    private void observeViewModel(SwipeRefreshLayout swipeRefreshLayout) {
        // mails load observer
        mailViewModel.getMailsLiveData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Loading) {
                Log.i("loadMails", inboxType);
                swipeRefreshLayout.setRefreshing(true);
            } else if (result instanceof Result.Success) {
                MailListResponse mails = ((Result.Success<MailListResponse>) result).getData();
                mailAdapter.setMailList(mails.getMails());
                swipeRefreshLayout.setRefreshing(false);
            } else if (result instanceof Result.Error) {
                swipeRefreshLayout.setRefreshing(false);
                String msg = ((Result.Error<?>) result).getMessage();
                Log.i("err", msg);
                Toast.makeText(getContext(), getResources().getString(R.string.err_mails_load) + msg, Toast.LENGTH_LONG).show();
            }
        });

        // edit observer
        mailViewModel.getEditMailStatus().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                mailAdapter.clearSelection();
                mailViewModel.loadMails(inboxType);
            } else if (result instanceof Result.Error) {
                Toast.makeText(getContext(), R.string.unexpected_error, Toast.LENGTH_SHORT).show();
            }
        });

        // search observer
        mailViewModel.getSearchData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Loading) {
                swipeRefreshLayout.setRefreshing(true);
            } else if (result instanceof Result.Success) {
                List<Mail> mails = ((Result.Success<List<Mail>>) result).getData();
                mailAdapter.setMailList(mails);
                swipeRefreshLayout.setRefreshing(false);
            } else if (result instanceof Result.Error) {
                swipeRefreshLayout.setRefreshing(false);
                String msg = ((Result.Error<?>) result).getMessage();
                Toast.makeText(getContext(), getResources().getString(R.string.err_mails_load) + msg, Toast.LENGTH_LONG).show();
            }
        });
    }

    /**
     * Initializes the views related to th action bar and sets the click listeners
     */
    private void initializeActionBar() {
        // closing the action bar
        ImageButton btnClose = requireActivity().findViewById(R.id.btn_close_action_bar);
        btnClose.setOnClickListener(v -> {
            View customBar = requireActivity().findViewById(R.id.custom_toolbar);
            View actionBar = requireActivity().findViewById(R.id.action_bar);
            customBar.setVisibility(VISIBLE);
            actionBar.setVisibility(GONE);
            mailAdapter.clearSelection();
        });

        // marking mails as read
        ImageButton btnMarkRead = requireActivity().findViewById(R.id.btn_mark_read);
        btnMarkRead.setOnClickListener(v -> {
            List<Mail> selected = mailAdapter.getSelectedMails();
            for (Mail mail : selected)
                if (!mail.isRead()) {
                    mail.setIsRead(true);
                    mailViewModel.markAsRead(mail);
                }
        });

        // toggle spam flag
        ImageButton btnToggleSpam = requireActivity().findViewById(R.id.btn_toggle_spam);
        btnToggleSpam.setOnClickListener(v -> {
            for (Mail mail : mailAdapter.getSelectedMails())
                mailViewModel.toggleSpam(new SpamRequest(mail.getId(), mail.isSpam()));
        });

        // move to trash or delete forever
        ImageButton btnTrash = requireActivity().findViewById(R.id.btn_trash);
        btnTrash.setOnClickListener(v -> {
            for (Mail mail : mailAdapter.getSelectedMails())
                mailViewModel.deleteMail(mail.getId());
        });

        // restore mail - allow it only if viewing the trash inbox
        Button btnRestore = requireActivity().findViewById(R.id.btn_trash_restore);
        if ("trash".equals(inboxType)) {
            btnRestore.setVisibility(VISIBLE);
        } else {
            btnRestore.setVisibility(GONE);
        }
        btnRestore.setOnClickListener(v -> {
            for (Mail mail : mailAdapter.getSelectedMails())
                mailViewModel.restoreMail(mail.getId());
        });

        // labels un/marking
        ImageButton btnLabel = requireActivity().findViewById(R.id.btn_labels);
        btnLabel.setOnClickListener(v -> {
            showLabelPickerDialog(mailAdapter.getSelectedMails());
        });

    }

    /**
     * Sets a new inbox using the picked option from the drawer menu
     *
     * @param newInboxType new inbox type
     */
    public void setInbox(String newInboxType) {
        if (newInboxType == null)
            return;
        this.inboxType = newInboxType;
        if (inboxType.startsWith("label:")) {
            int labelId = Integer.parseInt(inboxType.substring("label:".length()));
            mailViewModel.loadMailsByLabel(labelId);
        } else {
            mailViewModel.loadMails(inboxType);
        }
    }

    /**
     * Triggers a search through the MailViewModel for a given query.
     * Also resets pagination and updates the RecyclerView on result.
     *
     * @param query the string to search by
     */
    public void searchMails(String query) {
        mailViewModel.resetPage();
        if (query.isEmpty()) {
            mailViewModel.loadMails(inboxType);
        } else {
            mailViewModel.searchMail(query);
        }
    }

    /**
     * Shows a dialog to un/mark mails with labels
     *
     * @param selectedMails list of selected mails to change for
     */
    private void showLabelPickerDialog(List<Mail> selectedMails) {
        LabelViewModel labelVM = new ViewModelProvider(this).get(LabelViewModel.class);
        labelVM.fetchAllLabels();
        labelVM.getAllLabels().observe(getViewLifecycleOwner(), allLabels -> {
            if (allLabels == null || allLabels.isEmpty()) {
                Toast.makeText(getContext(), R.string.labels_not_found, Toast.LENGTH_SHORT).show();
                return;
            }
            String[] labelNames = allLabels.stream().map(Label::getName).toArray(String[]::new);
            boolean[] checked = new boolean[allLabels.size()];

            // Pre select labels common across all selected mails
            Set<Label> common = new HashSet<>(selectedMails.get(0).getLabels());
            for (Mail m : selectedMails)
                common.retainAll(m.getLabels());

            for (int i = 0; i < allLabels.size(); i++)
                if (common.contains(allLabels.get(i)))
                    checked[i] = true;

            AlertDialog alertDialog = new MaterialAlertDialogBuilder(requireContext())
                    .setTitle(R.string.choose_label)
                    .setMultiChoiceItems(labelNames, checked, (dialogInterface, indexSelected, isChecked) -> {
                        checked[indexSelected] = isChecked;
                    })
                    .setPositiveButton(R.string.apply, null)
                    .setNegativeButton(R.string.cancel, null)
                    .create();
            // Prevent outside touch from dismissing or passing through
            alertDialog.setCanceledOnTouchOutside(true);
            alertDialog.setCancelable(true);
            // Block swipe gestures from passing through
            alertDialog.getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
            );
            alertDialog.show();
            // set click listeners
            alertDialog.getButton(AlertDialog.BUTTON_NEGATIVE).setOnClickListener(v -> alertDialog.dismiss());
            alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
                List<Label> selectedLabels = new ArrayList<>();
                // create a list of selected labels
                for (int i = 0; i < checked.length; i++)
                    if (checked[i])
                        selectedLabels.add(allLabels.get(i));
                // update each mail locally
                for (Mail m : selectedMails)
                    m.setLabels(selectedLabels);
                // update labels in the backend
                mailViewModel.updateMailLabels(selectedMails, selectedLabels);
                alertDialog.dismiss();
            });
        });
    }
}
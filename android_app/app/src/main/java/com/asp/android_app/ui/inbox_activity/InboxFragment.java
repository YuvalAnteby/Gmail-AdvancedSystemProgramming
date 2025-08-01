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
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;

import java.util.List;

/**
 * Fragment containing the inbox, responsible on the showing the mails list, handling clicks,
 * selection and refreshes.
 */
public class InboxFragment extends Fragment {

    private MailViewModel mailViewModel;
    private MailAdapter mailAdapter;
    private String inboxType = "all"; // default inbox is incoming mails
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
                selectionListener
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
                    mailViewModel.markAsRead(mail.getId());
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
        mailViewModel.loadMails(inboxType);
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
}
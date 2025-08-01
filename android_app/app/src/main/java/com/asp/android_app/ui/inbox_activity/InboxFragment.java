package com.asp.android_app.ui.inbox_activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;

/**
 * Fragment containing the inbox, responsible on the showing the mails list, handling clicks,
 * selection and refreshes.
 */
public class InboxFragment extends Fragment {

    private MailViewModel mailViewModel;
    private MailAdapter mailAdapter;
    private final String inboxType = "all"; // default inbox is incoming mails

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

        // initialize the recycler view
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        mailAdapter = new MailAdapter(
                requireContext(), getViewLifecycleOwner(), inboxType, readingLauncher, mailViewModel
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
        mailViewModel.getMailsLiveData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                MailListResponse mails = ((Result.Success<MailListResponse>) result).getData();
                mailAdapter.setMailList(mails.getMails());
                swipeRefreshLayout.setRefreshing(false);

            } else if (result instanceof Result.Error) {
                swipeRefreshLayout.setRefreshing(false);
                String msg = ((Result.Error<?>) result).getMessage();
                // TODO remove logs
                Log.i("INBOX ERROR:", msg);
                Toast.makeText(
                        getContext(),
                        getResources().getString(R.string.err_mails_load) + msg,
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }
}
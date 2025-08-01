package com.asp.android_app.ui.inbox_activity;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

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

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.inbox_fragment, container, false);
        // initialize the recycler view
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        mailAdapter = new MailAdapter();
        recyclerView.setAdapter(mailAdapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        // initialize the swiping down for refresh
        SwipeRefreshLayout swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            // Trigger refresh from ViewModel
            mailViewModel.loadMails("incoming");
        });

        // initialize the mails view model
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        observeViewModel(swipeRefreshLayout);

        mailViewModel.loadMails("incoming"); // default inbox is incoming mails


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
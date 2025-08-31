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
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.ImageView;
import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
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

    private boolean isLoading = false;
    private boolean hasMoreData = true;
    private int PAGE_LIMIT = 50;

    private LinearLayout emptyStateContainer;
    private TextView emptyStateTitle;
    private TextView emptyStateSubtitle;
    private ImageView emptyStateIcon;
    private MaterialButton emptyStateActionButton;
    private MaterialButton emptyStateRefreshButton;

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
                showSnack(R.string.compose_sent_success);
            }

            @Override
            public void onSaved() {
                setInbox("draft");
                showSnack(R.string.compose_saved_success);
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
        initializeEmptyState(view);
        setupPaginationScrollListener(recyclerView);

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
     * Sets up the pagination listeners to load in a 'lazy loading' way
     *
     * @param recyclerView the recycler view to load into
     */
    private void setupPaginationScrollListener(RecyclerView recyclerView) {
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (layoutManager != null && !isLoading && hasMoreData && dy > 0) {
                    int visibleItemCount = layoutManager.getChildCount();
                    int totalItemCount = layoutManager.getItemCount();
                    int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                    // Load more when we're 5 items from the bottom
                    if ((visibleItemCount + firstVisibleItemPosition + 5) >= totalItemCount) {
                        loadNextPage();
                    }
                }
            }
        });
    }

    /**
     * Loads the next batch of mails
     */
    private void loadNextPage() {
        if (isLoading || !hasMoreData) return;

        isLoading = true;
        if (inboxType.startsWith("label:")) {
            int labelId = Integer.parseInt(inboxType.substring("label:".length()));
            mailViewModel.nextPage("label:" + labelId);
            mailViewModel.loadMoreMailsByLabel(labelId);
            //mailViewModel.loadMailsByLabel(labelId);
        } else {
            mailViewModel.nextPage(inboxType);
            mailViewModel.loadMoreMails(inboxType);
            //mailViewModel.loadMails(inboxType);
        }
    }

    /**
     * initializes the alternative view of an empty inbox, showing dynamic message depending on the
     * inbox's type
     *
     * @param view root view object
     */
    private void initializeEmptyState(View view) {
        emptyStateContainer = view.findViewById(R.id.empty_state_container);
        emptyStateTitle = view.findViewById(R.id.empty_state_title);
        emptyStateSubtitle = view.findViewById(R.id.empty_state_subtitle);
        emptyStateIcon = view.findViewById(R.id.empty_state_icon);
        emptyStateActionButton = view.findViewById(R.id.empty_state_action_button);
        emptyStateRefreshButton = view.findViewById(R.id.empty_state_refresh_button);

        // Set up refresh button click listener
        emptyStateRefreshButton.setOnClickListener(v -> {
            String loadInbox = inboxType;
            if (loadInbox == null || loadInbox.isBlank()) {
                loadInbox = "incoming";
            }
            mailViewModel.loadMails(loadInbox);
        });

        // Set up action button click listener (for compose)
        emptyStateActionButton.setOnClickListener(v -> {
            // Trigger the compose action - you might want to reference your composeLauncher here
            // For now, we'll make it trigger the FAB click
            Activity activity = getActivity();
            if (activity != null) {
                FloatingActionButton fab = activity.findViewById(R.id.fabCompose);
                if (fab != null) {
                    fab.performClick();
                }
            }
        });
    }

    /**
     * updates the content according to the inbox's type and state
     *
     * @param inboxType inbox's type
     */
    private void updateEmptyStateContent(String inboxType) {
        if (emptyStateTitle == null || emptyStateSubtitle == null || emptyStateIcon == null) {
            return;
        }

        switch (inboxType) {
            case "incoming":
                emptyStateTitle.setText(R.string.empty_inbox_title);
                emptyStateSubtitle.setText(R.string.empty_inbox_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_mail);
                emptyStateActionButton.setVisibility(VISIBLE);
                emptyStateActionButton.setText(R.string.compose_new_mail);
                break;

            case "sent":
                emptyStateTitle.setText(R.string.empty_sent_title);
                emptyStateSubtitle.setText(R.string.empty_sent_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_send);
                emptyStateActionButton.setVisibility(VISIBLE);
                emptyStateActionButton.setText(R.string.compose_new_mail);
                break;

            case "draft":
                emptyStateTitle.setText(R.string.empty_draft_title);
                emptyStateSubtitle.setText(R.string.empty_draft_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_draft);
                emptyStateActionButton.setVisibility(VISIBLE);
                emptyStateActionButton.setText(R.string.compose_new_mail);
                break;

            case "star":
                emptyStateTitle.setText(R.string.empty_starred_title);
                emptyStateSubtitle.setText(R.string.empty_starred_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_star_outline);
                emptyStateActionButton.setVisibility(GONE);
                break;

            case "trash":
                emptyStateTitle.setText(R.string.empty_trash_title);
                emptyStateSubtitle.setText(R.string.empty_trash_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_delete);
                emptyStateActionButton.setVisibility(GONE);
                break;

            case "spam":
                emptyStateTitle.setText(R.string.empty_spam_title);
                emptyStateSubtitle.setText(R.string.empty_spam_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_report);
                emptyStateActionButton.setVisibility(GONE);
                break;

            case "all":
                emptyStateTitle.setText(R.string.empty_all_title);
                emptyStateSubtitle.setText(R.string.empty_all_subtitle);
                emptyStateIcon.setImageResource(R.drawable.ic_mail);
                emptyStateActionButton.setVisibility(VISIBLE);
                emptyStateActionButton.setText(R.string.compose_new_mail);
                break;

            default:
                if (inboxType.startsWith("label:")) {
                    emptyStateTitle.setText(R.string.empty_label_title);
                    emptyStateSubtitle.setText(R.string.empty_label_subtitle);
                    emptyStateIcon.setImageResource(R.drawable.ic_label);
                    emptyStateActionButton.setVisibility(GONE);
                } else {
                    emptyStateTitle.setText(R.string.empty_inbox_title);
                    emptyStateSubtitle.setText(R.string.empty_inbox_subtitle);
                    emptyStateIcon.setImageResource(R.drawable.ic_mail);
                    emptyStateActionButton.setVisibility(VISIBLE);
                    emptyStateActionButton.setText(R.string.compose_new_mail);
                }
                break;
        }
    }

    /**
     * Toggles between an empty inbox state view and the regular
     *
     * @param isEmpty true if should show the empty inbox UI, otherwise will show the inbox
     */
    private void toggleEmptyState(boolean isEmpty) {
        if (emptyStateContainer != null) {
            emptyStateContainer.setVisibility(isEmpty ? VISIBLE : GONE);
            updateEmptyStateContent(inboxType);
        }
    }

    private void showSnack(@androidx.annotation.StringRes int resId) {
        if (!isAdded()) return; // fragment not attached
        View root = getView();
        if (root != null) {
            Snackbar.make(root, resId, Snackbar.LENGTH_SHORT).show();
        } else {
            // Fallback if view is gone (e.g., after rotation/detach)
            Toast.makeText(requireContext(), resId, Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Observer for mail data changes
     */
    private void observeViewModel(SwipeRefreshLayout swipeRefreshLayout) {
        // mails load observer
        mailViewModel.getMailsLiveData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Loading) {
                Log.i("loadMails", inboxType);
                if (!isLoading) {
                    swipeRefreshLayout.setRefreshing(true);
                    toggleEmptyState(false);
                }
            } else if (result instanceof Result.Success) {
                MailListResponse response = ((Result.Success<MailListResponse>) result).getData();
                List<Mail> newMails = response.getMails();
                // stop loading state
                isLoading = false;
                mailViewModel.setLoadingMore(false);
                swipeRefreshLayout.setRefreshing(false);

                if (mailViewModel.getCurrentPage() == 1) {
                    mailAdapter.setMailList(newMails);
                    // Show empty state if no mails
                    boolean isEmpty = newMails == null || newMails.isEmpty();
                    toggleEmptyState(isEmpty);
                } else {
                    // Subsequent pages - append mails
                    if (newMails != null && !newMails.isEmpty()) {
                        mailAdapter.appendMails(newMails);
                        hasMoreData = newMails.size() >= PAGE_LIMIT; // Assume no more data if less than limit
                    } else {
                        hasMoreData = false; // No more data available
                    }
                }

            } else if (result instanceof Result.Error) {
                isLoading = false;
                mailViewModel.setLoadingMore(false);
                swipeRefreshLayout.setRefreshing(false);

                String msg = ((Result.Error<?>) result).getMessage();
                Log.i("err", msg);
                Toast.makeText(getContext(), getResources().getString(R.string.err_mails_load) + msg, Toast.LENGTH_LONG).show();
                // Don't show empty state on error, just leave current state

                // If it was a pagination request that failed, decrement page
                if (mailViewModel.getCurrentPage() > 1)
                    mailViewModel.previousPage(inboxType);
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
                toggleEmptyState(false);
            } else if (result instanceof Result.Success) {
                List<Mail> mails = ((Result.Success<List<Mail>>) result).getData();
                mailAdapter.setMailList(mails);
                swipeRefreshLayout.setRefreshing(false);
                // Show empty state if no search results
                boolean isEmpty = mails == null || mails.isEmpty();
                if (isEmpty) {
                    // For search results, show a different empty state
                    emptyStateTitle.setText(R.string.no_search_results);
                    emptyStateSubtitle.setText(R.string.no_search_results_subtitle);
                    emptyStateIcon.setImageResource(R.drawable.ic_search);
                    emptyStateActionButton.setVisibility(GONE);
                    emptyStateContainer.setVisibility(VISIBLE);
                } else {
                    toggleEmptyState(false);
                }
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
        // reset pagination
        isLoading = false;
        hasMoreData = true;
        mailViewModel.resetPage();

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
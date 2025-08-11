package com.asp.android_app.ui.compose_activity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SendMailRequest;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.model.response.UserSearchResult;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;
import com.asp.android_app.viewmodel.UserViewModel;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.MaterialAutoCompleteTextView;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class ComposeFragment extends Fragment {

    private static final String ARG_DRAFT_ID = "arg_draft_id";
    private long draftId = -1;

    private MailViewModel mailVm;
    private UserViewModel userVm;

    private MaterialAutoCompleteTextView etTo;
    private ChipGroup chipsRecipients;
    private TextInputEditText etSubject, etBody;

    private final List<UserInfo> selectedRecipients = new ArrayList<>();
    private final Set<String> selectedMails = new HashSet<>(); // for quick duplicate checks

    private SuggestionAdapter suggestionAdapter;
    private final Handler debounceHandler = new Handler(Looper.getMainLooper());
    private Runnable pendingSearch;

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

    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);

        // init view models
        initializeMailViewModel();
        initializeUserViewModel();

        // Views
        etTo = v.findViewById(R.id.et_to);
        chipsRecipients = v.findViewById(R.id.chips_recipients);
        etSubject = v.findViewById(R.id.et_subject);
        etBody = v.findViewById(R.id.et_body);

        // Suggestions adapter
        suggestionAdapter = new SuggestionAdapter(requireContext());
        etTo.setAdapter(suggestionAdapter);
        etTo.setThreshold(1); // show after 1 char

        // Handle selection from dropdown
        etTo.setOnItemClickListener((parent, view, pos, id) -> {
            if (suggestionAdapter.getItem(pos) == null) return;
            addRecipient(new UserInfo(Objects.requireNonNull(suggestionAdapter.getItem(pos))));
            // clear text & close dropdown
            etTo.setText("");
            etTo.dismissDropDown();
        });

        // Debounced search-on-typing
        etTo.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                String q = s.toString().trim();
                if (pendingSearch != null)
                    debounceHandler.removeCallbacks(pendingSearch);
                if (q.isBlank()) {
                    suggestionAdapter.setData(null);
                    return;
                }
                // calling with debounce logic to search users in the backend
                pendingSearch = () -> {
                    userVm.searchUsers(q);
                };
                debounceHandler.postDelayed(pendingSearch, 300);
            }
        });


        // Load draft if needed (do after VM init)
        draftId = getArguments() != null ? getArguments().getLong(ARG_DRAFT_ID, -1) : -1;
        if (draftId != -1)
            mailVm.fetchMailById((int) draftId);

        // Sends the mail on click
        Button btnSend = v.findViewById(R.id.btn_send);
        btnSend.setOnClickListener(view -> {
            SendMailRequest req = buildRequest(false);
            if (req == null) return; // validation failed
            mailVm.sendNewMail(req);
        });

        // Saves the mail as a draft on click
        Button btnSave = v.findViewById(R.id.btn_save);
        btnSave.setOnClickListener(view -> {
            SendMailRequest req = buildRequest(true);
            if (req == null) return;
            if (draftId != -1) mailVm.updateDraft((int) draftId, req);
            else
                mailVm.sendNewMail(req); // backend supports creating a new draft via POST with saveAsDraft=true
        });
    }

    /**
     * Initializes the mail view model and it's observers
     */
    private void initializeMailViewModel() {
        mailVm = new ViewModelProvider(this).get(MailViewModel.class);

        // Observe draft load - prefill with already existing data of draft
        mailVm.getMailLiveData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                Mail draft = ((Result.Success<Mail>) result).getData();
                etSubject.setText(draft.getSubject());
                etBody.setText(draft.getBody());
                // If draft has recipients, add them as chips
                if (draft.getSentTo() != null)
                    for (UserInfo u : draft.getSentTo()) addRecipient(u);

            } else if (result instanceof Result.Error) {
                Toast.makeText(getContext(), ((Result.Error<Mail>) result).getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        // Observe send/save result // TODO show a snack bar with result
        mailVm.getSendMailStatus().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                Toast.makeText(requireContext(), "sent/saved success"/*R.string.mail_sent_or_saved*/, Toast.LENGTH_SHORT).show();
                requireActivity().onBackPressed();
            } else if (result instanceof Result.Error) {
                Toast.makeText(requireContext(), ((Result.Error<?>) result).getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    /**
     * Initializes the user view model and it's observers
     */
    private void initializeUserViewModel() {
        userVm = new ViewModelProvider(this).get(UserViewModel.class);

        // Observe user search results - update dropdown when fetched successfully
        userVm.getSearchResults().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                List<UserSearchResult> found = ((Result.Success<List<UserSearchResult>>) result).getData();
                // Filter out already-selected emails
                List<UserSearchResult> filtered = new ArrayList<>();
                for (UserSearchResult u : found)
                    if (!selectedMails.contains(u.getMail())) filtered.add(u);

                suggestionAdapter.setData(filtered);
                if (!filtered.isEmpty()) etTo.showDropDown();

            } else if (result instanceof Result.Error) {
                String msg = ((Result.Error<List<UserSearchResult>>) result).getMessage();
                Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Shows a new recipient suggestion to the mail/ draft while ensuring no duplicate users in it
     *
     * @param user new user object to add
     */
    private void addRecipient(@NonNull UserInfo user) {
        // prevent duplicates by mail
        if (selectedMails.contains(user.getMail())) return;
        selectedRecipients.add(user);
        selectedMails.add(user.getMail());

        // If you don't have m3_chip_input, create chips programmatically:
        Chip chip = new Chip(requireContext());
        chip.setText(user.toString());
        chip.setCloseIconVisible(true);
        chip.setOnCloseIconClickListener(v -> {
            chipsRecipients.removeView(chip);
            selectedMails.remove(user.getMail());
            selectedRecipients.remove(user);
        });
        chipsRecipients.addView(chip);
    }

    /**
     * Factory to create a new request for saving or sending a mail with the current data
     */
    @Nullable
    private SendMailRequest buildRequest(boolean saveAsDraft) {
        String subject = safeText(etSubject);
        String body = safeText(etBody);

        if (!saveAsDraft && selectedRecipients.isEmpty()) {
            Toast.makeText(requireContext(), R.string.err_min_recipients, Toast.LENGTH_SHORT).show();
            return null;
        }

        List<String> sentTo = new ArrayList<>();
        for (UserInfo u : selectedRecipients) sentTo.add(u.getMail());

        // attachments: TODO skip for now or plug your picker list
        return new SendMailRequest(subject, body, sentTo, saveAsDraft, /*files=*/new ArrayList<>());
    }

    /**
     * Gets string input from edit text safely, default value is an empty string
     *
     * @param et edit text field to get input from
     * @return the input from the user, if an error occurred will return an empty string
     */
    private String safeText(@Nullable TextInputEditText et) {
        try {
            return et != null && et.getText() != null ? et.getText().toString() : "";
        } catch (Exception e) {
            return "";
        }
    }
}

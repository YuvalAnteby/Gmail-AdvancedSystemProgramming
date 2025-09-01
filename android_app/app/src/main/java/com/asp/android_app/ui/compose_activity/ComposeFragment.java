package com.asp.android_app.ui.compose_activity;

import static android.app.Activity.RESULT_OK;

import android.content.ClipData;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.OpenableColumns;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SendMailRequest;
import com.asp.android_app.model.response.File;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.model.response.UserSearchResult;
import com.asp.android_app.utils.Base64Converter;
import com.asp.android_app.utils.ComposeParams;
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

/**
 * ComposeFragment is the mail writer screen.
 * In this version I added attachment picking using ACTION_OPEN_DOCUMENT (multi-select).
 * Picked files are converted to Base64 Data URIs and attached to SendMailRequest.
 */
public class ComposeFragment extends Fragment {

    private static final String ARG_DRAFT_ID = "arg_draft_id";
    /**
     * naive single file hard limit ~2MB
     */
    private static final long MAX_FILE_BYTES = 2L * 1024L * 1024L;

    private long draftId = -1;

    private MailViewModel mailVm;
    private UserViewModel userVm;

    private MaterialAutoCompleteTextView etTo;
    private ChipGroup chipsRecipients;
    private TextInputEditText etSubject, etBody;
    private ChipGroup chipsAttachments;
    private Button btnAddAttachment;

    private final List<UserInfo> selectedRecipients = new ArrayList<>();
    private final Set<String> selectedMails = new HashSet<>(); // for quick duplicate checks

    /**
     * holds the attachments to send; reflected in chipsAttachments
     */
    private final List<File> files = new ArrayList<>();

    private SuggestionAdapter suggestionAdapter;
    private final Handler debounceHandler = new Handler(Looper.getMainLooper());
    private Runnable pendingSearch;

    /**
     * Tracks whether the last mail action was a send or a save draft
     */
    private boolean lastActionWasDraft = false;

    // incoming prefill
    @Nullable
    private ComposeParams prefill;
    // reply/forward HTML block
    @Nullable
    private String quotedHtml;

    /**
     * Launcher for the system document picker. I use ACTION_OPEN_DOCUMENT so the user can
     * pick from Drive/Downloads/etc and we persist permission for reuse while the draft lives.
     */
    private final ActivityResultLauncher<Intent> pickFilesLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (result.getResultCode() != RESULT_OK || result.getData() == null) return;

                Intent data = result.getData();
                if (data.getClipData() != null) {
                    ClipData clip = data.getClipData();
                    for (int i = 0; i < clip.getItemCount(); i++) {
                        handlePickedUri(clip.getItemAt(i).getUri());
                    }
                } else if (data.getData() != null) {
                    handlePickedUri(data.getData());
                }
            });

    /**
     * Factory method to create the fragment with an optional draft id.
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
        chipsAttachments = v.findViewById(R.id.chips_attachments);
        btnAddAttachment = v.findViewById(R.id.btn_add_attachment);

        // Suggestions adapter
        suggestionAdapter = new SuggestionAdapter(requireContext());
        etTo.setAdapter(suggestionAdapter);
        etTo.setThreshold(1); // show after 1 char

        // Handle selection from dropdown
        etTo.setOnItemClickListener((parent, view, pos, id) -> {
            if (suggestionAdapter.getItem(pos) == null) return;
            addRecipient(new UserInfo(Objects.requireNonNull(suggestionAdapter.getItem(pos))));
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
                if (pendingSearch != null) debounceHandler.removeCallbacks(pendingSearch);
                if (q.isBlank()) {
                    suggestionAdapter.setData(null);
                    return;
                }
                pendingSearch = () -> userVm.searchUsers(q);
                debounceHandler.postDelayed(pendingSearch, 300);
            }
        });

        // Add attachments button
        btnAddAttachment.setOnClickListener(v1 -> openSystemPicker());

        // Load draft if needed (do after VM init)
        draftId = getArguments() != null ? getArguments().getLong(ARG_DRAFT_ID, -1) : -1;
        if (draftId != -1) mailVm.fetchMailById((int) draftId);

        // Sends the mail on click
        Button btnSend = v.findViewById(R.id.btn_send);
        btnSend.setOnClickListener(view -> {
            lastActionWasDraft = false;
            SendMailRequest req = buildRequest(false);
            if (req == null) return; // validation failed
            mailVm.sendNewMail(req);
        });

        // Saves the mail as a draft on click
        Button btnSave = v.findViewById(R.id.btn_save);
        btnSave.setOnClickListener(view -> {
            lastActionWasDraft = true;
            SendMailRequest req = buildRequest(true);
            if (req == null) return;
            if (draftId != -1)
                mailVm.updateDraft((int) draftId, req);
            else
                mailVm.sendNewMail(req); // backend supports creating a new draft via POST with saveAsDraft=true
        });

        // update fields using the prefill params
        Intent host = requireActivity().getIntent();
        prefill = host.getParcelableExtra(ComposeMailActivity.EXTRA_PREFILL);
        if (prefill != null) {
            // recipients are UserInfo objects → use your existing addRecipient(UserInfo)
            if (prefill.recipients != null)
                for (UserInfo u : prefill.recipients)
                    if (u != null && u.getMail() != null) addRecipient(u);

            if (prefill.subject != null) etSubject.setText(prefill.subject);
            quotedHtml = prefill.quotedHtml;

            if (prefill.files != null && !prefill.files.isEmpty())
                for (File a : prefill.files) {
                    files.add(a);
                    addAttachmentChip(a);
                }
        }

    }

    /**
     * Opens the platform file picker and allows user to select multiple files.
     * Using ACTION_OPEN_DOCUMENT (not GET_CONTENT) so we can persist the URI.
     */
    private void openSystemPicker() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("*/*"); // let the user choose any file
        pickFilesLauncher.launch(intent);
    }

    /**
     * Handles one picked file URI:
     * 1) Takes persistable read permission
     * 2) Checks size
     * 3) Reads into Base64 Data URI via Base64Converter
     * 4) Adds to chips + internal list if not duplicate
     */
    private void handlePickedUri(@NonNull Uri uri) {
        try {
            // persist permission for the lifetime of this draft session
            final int flag = Intent.FLAG_GRANT_READ_URI_PERMISSION;
            requireContext().getContentResolver().takePersistableUriPermission(uri, flag);

            String displayName = queryDisplayName(uri);
            long size = querySize(uri);
            if (size > MAX_FILE_BYTES) {
                Toast.makeText(requireContext(), R.string.err_file_too_large, Toast.LENGTH_SHORT).show();
                return;
            }

            String dataUri = Base64Converter.fileUriToBase64(uri, requireContext());
            if (dataUri.isEmpty()) {
                Toast.makeText(requireContext(), R.string.err_attachment_failed, Toast.LENGTH_SHORT).show();
                return;
            }

            File att = new File(displayName != null ? displayName : "file", dataUri);
            if (!files.contains(att)) {
                files.add(att);
                addAttachmentChip(att);
            }
        } catch (SecurityException se) {
            // Some providers don't allow persist; still try to read immediately
            String displayName = queryDisplayName(uri);
            String dataUri = Base64Converter.fileUriToBase64(uri, requireContext());
            if (!dataUri.isEmpty()) {
                File att = new File(displayName != null ? displayName : "file", dataUri);
                if (!files.contains(att)) {
                    files.add(att);
                    addAttachmentChip(att);
                }
            } else {
                Toast.makeText(requireContext(), R.string.err_attachment_failed, Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            Toast.makeText(requireContext(), R.string.err_attachment_failed, Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Renders a single attachment as a Material chip with an icon + close (remove).
     */
    private void addAttachmentChip(@NonNull File att) {
        Chip chip = new Chip(requireContext());
        chip.setText(att.getName());
        int iconRes = Base64Converter.getFileIconResource(att.getName());
        chip.setChipIconResource(iconRes);
        chip.setCloseIconVisible(true);
        chip.setOnCloseIconClickListener(v -> {
            chipsAttachments.removeView(chip);
            files.remove(att);
        });
        chipsAttachments.addView(chip);
    }

    /**
     * Initializes the mail view model and its observers.
     * When a draft loads, we pre-fill subject/body/recipients and also render any saved attachments.
     */
    private void initializeMailViewModel() {
        mailVm = new ViewModelProvider(this).get(MailViewModel.class);

        mailVm.getMailLiveData().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                Mail draft = ((Result.Success<Mail>) result).getData();
                etSubject.setText(draft.getSubject());
                etBody.setText(draft.getBody());

                if (draft.getSentTo() != null)
                    for (UserInfo u : draft.getSentTo()) addRecipient(u);

                // If the draft already has attachments, show them
                if (draft.getAttachments() != null && !draft.getAttachments().isEmpty()) {
                    files.clear();
                    files.addAll(draft.getAttachments());
                    chipsAttachments.removeAllViews();
                    for (File a : files) addAttachmentChip(a);
                }

            } else if (result instanceof Result.Error) {
                Toast.makeText(getContext(), ((Result.Error<Mail>) result).getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        mailVm.getSendMailStatus().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                Intent data = new Intent();
                data.putExtra("compose_result_action", lastActionWasDraft ? "saved" : "sent");
                requireActivity().setResult(RESULT_OK, data);
                requireActivity().finish(); // closes ComposeMailActivity and delivers the result

            } else if (result instanceof Result.Error) {
                Toast.makeText(requireContext(), ((Result.Error<?>) result).getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    /**
     * Initializes the user view model and it's observers (autocomplete suggestions).
     */
    private void initializeUserViewModel() {
        userVm = new ViewModelProvider(this).get(UserViewModel.class);

        userVm.getSearchResults().observe(getViewLifecycleOwner(), result -> {
            if (result instanceof Result.Success) {
                List<UserSearchResult> found = ((Result.Success<List<UserSearchResult>>) result).getData();
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
     * Adds a recipient chip if not already selected.
     *
     * @param user new user object to add
     */
    private void addRecipient(@NonNull UserInfo user) {
        if (selectedMails.contains(user.getMail())) return;
        selectedRecipients.add(user);
        selectedMails.add(user.getMail());

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
     * Builds the send/save request with current fields and the selected attachments.
     * Very basic validation - at least 1 recipient when sending (not required for drafts).
     * if we have quotedHtml (reply/forward) we will send as: typed text + quoted block (HTML)
     */
    @Nullable
    private SendMailRequest buildRequest(boolean saveAsDraft) {
        String subject = safeText(etSubject);
        String typed = safeText(etBody);

        if (!saveAsDraft && selectedRecipients.isEmpty()) {
            Toast.makeText(requireContext(), R.string.err_min_recipients, Toast.LENGTH_SHORT).show();
            return null;
        }

        List<String> sentTo = new ArrayList<>();
        for (UserInfo u : selectedRecipients)
            sentTo.add(u.getMail());
        // If any raw emails were added (selectedMails), include them too (guards edge-cases)
        for (String m : selectedMails)
            if (!sentTo.contains(m)) sentTo.add(m);

        // Final HTML body
        String body = com.asp.android_app.utils.MailHtmlUtil.mergeTypedWithQuote(typed, quotedHtml);

        // pass the attachments that were added
        return new SendMailRequest(subject, body, sentTo, saveAsDraft, new ArrayList<>(files));
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

    /**
     * Queries a human friendly file name for the given content URI using OpenableColumns.DISPLAY_NAME.
     */
    @Nullable
    private String queryDisplayName(@NonNull Uri uri) {
        Cursor c = null;
        try {
            c = requireContext().getContentResolver().query(uri, null, null, null, null);
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx != -1) return c.getString(idx);
            }
        } catch (Exception ignored) {
        } finally {
            if (c != null) c.close();
        }
        return null;
    }

    /**
     * Tries to read file size from the content resolver to enforce a rough limit.
     * Returns -1 if unknown.
     */
    private long querySize(@NonNull Uri uri) {
        Cursor c = null;
        try {
            c = requireContext().getContentResolver().query(uri, null, null, null, null);
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.SIZE);
                if (idx != -1) return c.getLong(idx);
            }
        } catch (Exception ignored) {
        } finally {
            if (c != null) c.close();
        }
        return -1;
    }
}

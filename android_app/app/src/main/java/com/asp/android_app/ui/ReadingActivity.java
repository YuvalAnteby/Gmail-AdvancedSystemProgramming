package com.asp.android_app.ui;

import static android.view.View.GONE;
import static com.asp.android_app.utils.Base64Converter.displayBase64Image;
import static com.asp.android_app.utils.Base64Converter.getFileIconResource;
import static com.asp.android_app.utils.Base64Converter.getMimeType;
import static com.asp.android_app.utils.Base64Converter.saveBase64FileToCache;

import android.content.Intent;
import android.content.res.ColorStateList;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.widget.CompoundButtonCompat;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.Attachment;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.utils.DateUtil;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ReadingActivity extends AppCompatActivity {

    private ImageView senderAvatar;
    // sender info
    private TextView senderName, senderEmail;
    // mail contents
    private TextView mailDate, mailSubject, mailBody;
    private LinearLayout attachmentsContainer, attachmentsLayout;
    private CheckBox starCheckbox;
    private boolean isMailStarred, suppressStarChange = false;

    private TextView toggleRecipients, allRecipients;
    private boolean recipientsExpanded = false;
    private String lastEditAction = "";
    private Mail mail = null;
    private MailViewModel mailViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reading);

        // Init views
        senderAvatar = findViewById(R.id.sender_avatar);
        senderName = findViewById(R.id.sender_name);
        senderEmail = findViewById(R.id.sender_email);
        mailDate = findViewById(R.id.mail_date);
        mailSubject = findViewById(R.id.mail_subject);
        mailBody = findViewById(R.id.mail_body);
        attachmentsContainer = findViewById(R.id.attachments_container);
        attachmentsLayout = findViewById(R.id.attachmentsLayout);
        starCheckbox = findViewById(R.id.starCheckbox);

        toggleRecipients = findViewById(R.id.tv_toggle_recipients);
        allRecipients = findViewById(R.id.tv_all_recipients);

        Button btnReply = findViewById(R.id.btn_reply);
        Button btnForward = findViewById(R.id.btn_forward);

        // get mail id and fetch the mail from server
        int mailId = getIntent().getIntExtra("mailId", -1);
        if (mailId == -1) {
            Toast.makeText(this, "Error loading mail", Toast.LENGTH_SHORT).show();
            finish();
        }
        // initialize the mails view model
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        initializeModelViewObservers();
        mailViewModel.fetchMailById(mailId);

        // initialize reply action buttons
        btnReply.setOnClickListener(view -> onReplyClick());
        btnForward.setOnClickListener(view -> onForwardClick());

        // initialize the star checkbox
        int color = ContextCompat.getColor(this, R.color.star_fill);
        CompoundButtonCompat.setButtonTintList(starCheckbox, ColorStateList.valueOf(color));
        starCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            // prevent extra calls when setting manually
            if (suppressStarChange)
                return;
            if (mailId != -1) {
                // Disable to prevent mass clicking while waiting for backend response
                starCheckbox.setEnabled(false);
                lastEditAction = "star";
                mailViewModel.toggleStar(mailId, isChecked);
                isMailStarred = isChecked;
            }
        });

        // set the action bar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);
        toolbar.setNavigationOnClickListener(v -> onBackPressed());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.reading_menu, menu);
        MenuItem deleteRestoreItem = menu.findItem(R.id.action_trash);
        MenuItem spamToggleItem = menu.findItem(R.id.action_spam);
        MenuItem deleteForeverItem = menu.findItem(R.id.action_delete_forever);

        // depending on the inbox, change the icons and titles to undo actions like deleting
        String inboxType = getIntent().getStringExtra("inboxType"); // e.g. "trash", "spam"
        if ("trash".equals(inboxType)) {
            deleteRestoreItem.setTitle(R.string.restore_mail);
            deleteRestoreItem.setIcon(R.drawable.ic_restore);
            deleteForeverItem.setVisible(true);
        } else {
            deleteRestoreItem.setTitle(R.string.delete_mail);
            deleteRestoreItem.setIcon(R.drawable.ic_delete);
            deleteForeverItem.setVisible(false);
        }
        if ("spam".equals(inboxType)) {
            spamToggleItem.setTitle(R.string.unspam_mail);
            spamToggleItem.setIcon(R.drawable.ic_checkmark);
        } else {
            spamToggleItem.setTitle(R.string.spam_mails);
            spamToggleItem.setIcon(R.drawable.ic_report);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_trash) {
            if (mail.isTrashed()) {
                lastEditAction = "restore";
                mailViewModel.restoreMail(mail.getId());
            } else {
                lastEditAction = "delete";
                mailViewModel.deleteMail(mail.getId());
            }
            return true;
        }
        if (id == R.id.action_spam) {
            lastEditAction = "spam";
            mailViewModel.toggleSpam(new SpamRequest(mail.getId(), mail.isSpam()));
            return true;
        }
        if (id == R.id.action_delete_forever) {
            lastEditAction = "delete";
            mailViewModel.deleteMail(mail.getId());
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * Observer for changes of the mail object data, when fetching successfully shows the mail's
     * contents and the sender info.
     */
    private void initializeModelViewObservers() {
        // mail update
        mailViewModel.getMailLiveData().observe(this,
                result -> {
                    if (result instanceof Result.Success) {
                        mail = ((Result.Success<Mail>) result).getData();
                        showSenderAndRecipientsInfo(mail);
                        showMailContent(mail);
                        isMailStarred = mail.isStarred();
                        suppressStarChange = true;
                        starCheckbox.setChecked(isMailStarred);
                        suppressStarChange = false;
                    } else if (result instanceof Result.Error) {
                        Log.i("ERROR READING", ((Result.Error<Mail>) result).getMessage());
                    }
                });

        // mail edit
        mailViewModel.getEditMailStatus().observe(this, result -> {
            if (result instanceof Result.Error) {
                Toast.makeText(this, R.string.unexpected_error, Toast.LENGTH_SHORT).show();
                Log.e("READING", ((Result.Error<Void>) result).getMessage());
            }
            Intent resultIntent = new Intent();
            resultIntent.putExtra("refresh", true);
            resultIntent.putExtra("inboxType", getIntent().getStringExtra("inboxType"));

            switch (lastEditAction) {
                case "star":
                    starCheckbox.setEnabled(true);
                    lastEditAction = "";
                    break;
                case "delete":
                case "restore":
                case "spam":
                    setResult(RESULT_OK, resultIntent);
                    lastEditAction = "";
                    finish();
                    break;
            }
        });
    }

    /**
     * Sets the activity's fields to show the sender's info and other recipients
     *
     * @param mail mail object
     */
    private void showSenderAndRecipientsInfo(Mail mail) {
        // show sender's info
        senderName.setText(mail.getSender().getFullName());
        senderEmail.setText(mail.getSender().getMail());
        displayBase64Image(mail.getSender().getImageUrl(), senderAvatar);

        // show recipients info, toggle between showing a few and all recipients
        List<UserInfo> recipients = mail.getSentTo();
        if (recipients == null || recipients.isEmpty()) {
            toggleRecipients.setVisibility(View.GONE);
            allRecipients.setVisibility(View.GONE);
            return;
        }

        List<String> recipientMails = new ArrayList<>();
        for (UserInfo recipient : recipients)
            recipientMails.add(recipient.getMail());

        // Join with comma and zero width space to allow safe line wrapping
        String allMails = TextUtils.join(",\u200B ", recipientMails);
        // Show in full list view
        allRecipients.setText(allMails);
        // Show abbreviated preview
        int count = Math.min(2, recipientMails.size());
        toggleRecipients.setVisibility(recipientMails.size() > count ? View.VISIBLE : View.GONE);

        // observe clicks on the hide/show text view
        toggleRecipients.setOnClickListener(v -> {
            recipientsExpanded = !recipientsExpanded;
            if (recipientsExpanded) {
                allRecipients.setVisibility(View.VISIBLE);
                toggleRecipients.setText(R.string.hide_recipients);
                return;
            }
            allRecipients.setVisibility(View.GONE);
            toggleRecipients.setText(R.string.more_recipients);
        });
    }

    /**
     * Sets the activity's fields to show the mail's contents (subject, body, time etc.)
     *
     * @param mail mail object
     */
    private void showMailContent(Mail mail) {
        if (mail.getSentAt() != null && !mail.getSentAt().isBlank()) {
            String formattedDate = DateUtil.getFormattedDate(mail.getSentAt());
            String formattedTime = DateUtil.getFormattedHour(mail.getSentAt());
            String combined = formattedDate + "\n" + formattedTime;
            mailDate.setText(combined);
        }
        mailSubject.setText(mail.getSubject());

        // display formatted mail content
        if (mail.getBody() != null && !mail.getBody().isEmpty()) {
            Spanned formatted;
            formatted = Html.fromHtml(mail.getBody(), Html.FROM_HTML_MODE_LEGACY);
            mailBody.setText(formatted);
            // Clickable <a href="..."> links
            mailBody.setMovementMethod(LinkMovementMethod.getInstance());
        }

        // if there are no attachments - hide the header
        List<Attachment> attachments = mail.getAttachments();
        if (attachments.isEmpty()) {
            attachmentsContainer.setVisibility(GONE);
        } else {
            attachmentsContainer.setVisibility(View.VISIBLE);
            showAttachments(mail.getAttachments());
        }
    }

    /**
     * Shows mail attachments as a horizontal list
     *
     * @param attachments list of attachments in mail
     */
    private void showAttachments(List<Attachment> attachments) {
        attachmentsLayout.removeAllViews(); // Clear any previous ones
        for (Attachment attachment : attachments) {
            View attachmentView = getLayoutInflater().inflate(R.layout.attachment_item, attachmentsLayout, false);
            TextView fileName = attachmentView.findViewById(R.id.attachment_name);
            ImageView thumbnail = attachmentView.findViewById(R.id.attachment_thumbnail);
            // set resources
            fileName.setText(attachment.getName());
            int iconRes = getFileIconResource(attachment.getName());
            thumbnail.setImageResource(iconRes);
            // cache and preview on click
            attachmentView.setOnClickListener(v -> {
                openFile(attachment.getName(), attachment.getData());
            });
            attachmentsLayout.addView(attachmentView);
        }
    }

    /**
     * Opens an attachment file
     *
     * @param fileName   name of the file
     * @param base64Data string in base64 format of the file
     */
    private void openFile(String fileName, String base64Data) {
        // attempt to save the file to cache
        Uri fileUri = saveBase64FileToCache(this, fileName, base64Data);
        if (fileUri == null) {
            Toast.makeText(this, "Failed to cache file", Toast.LENGTH_SHORT).show();
            return;
        }

        String mimeType = getMimeType(base64Data);
        if (mimeType == null) mimeType = "*/*";

        // open the file, if several options exist let the user pick
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(fileUri, mimeType);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        try {
            startActivity(Intent.createChooser(intent, "Open with"));
        } catch (Exception e) {
            Toast.makeText(this, "No app found to open this file type", Toast.LENGTH_SHORT).show();
        }
    }

    // TODO handle replying to mail sender
    private void onReplyClick() {
        Toast.makeText(this, "TODO reply mail", Toast.LENGTH_SHORT).show();
    }

    // TODO handle forwarding mail
    private void onForwardClick() {
        Toast.makeText(this, "TODO forward mail", Toast.LENGTH_SHORT).show();
    }
}
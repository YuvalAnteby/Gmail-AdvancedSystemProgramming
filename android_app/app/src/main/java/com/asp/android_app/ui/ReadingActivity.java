package com.asp.android_app.ui;

import static android.view.View.GONE;
import static com.asp.android_app.utils.Base64Converter.displayBase64Image;

import android.content.res.ColorStateList;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.widget.CompoundButtonCompat;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.response.Attachment;
import com.asp.android_app.model.response.StarStatus;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.utils.DateUtil;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;

import java.util.List;

public class ReadingActivity extends AppCompatActivity {

    private ImageView senderAvatar;
    // sender info
    private TextView senderName, senderEmail;
    // mail contents
    private TextView mailDate, mailSubject, mailBody, mailAttachments;
    private LinearLayout attachmentsContainer;
    private CheckBox starCheckbox;
    private boolean isMailStarred, suppressStarChange = false;

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
        mailAttachments = findViewById(R.id.tvAttachments);
        starCheckbox = findViewById(R.id.starCheckbox);

        Button btnReply = findViewById(R.id.btn_reply);
        Button btnForward = findViewById(R.id.btn_forward);

        // get mail id and fetch the mail from server
        int mailId = getIntent().getIntExtra("mailId", -1);
        if (mailId == -1) {
            Toast.makeText(this, "Error loading mail", Toast.LENGTH_SHORT).show();
            finish();
        }
        // initialize the mails view model
        MailViewModel mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        observeMailViewModel(mailViewModel);
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
                StarStatus status = new StarStatus(isChecked);
                mailViewModel.toggleStar(mailId, status);
                isMailStarred = isChecked;

            }
        });
    }


    /**
     * Observer for changes of the mail object data, when fetching successfully shows the mail's
     * contents and the sender info.
     *
     * @param viewModel view model that loads the mail
     */
    private void observeMailViewModel(MailViewModel viewModel) {
        // mail update
        viewModel.getMailLiveData().observe(this,
                result -> {
                    if (result instanceof Result.Success) {
                        Mail mail = ((Result.Success<Mail>) result).getData();
                        showSenderInfo(mail.getSender());
                        showMailContent(mail);
                        isMailStarred = mail.isStarred();
                        suppressStarChange = true;
                        starCheckbox.setChecked(isMailStarred);
                        suppressStarChange = false;
                    } else if (result instanceof Result.Error) {
                        Log.i("ERROR READING", ((Result.Error<Mail>) result).getMessage());
                    }
                });

        // star update
        viewModel.getStarStatus().observe(this, result -> {
            starCheckbox.setEnabled(true);
            if (result instanceof Result.Error) {
                Toast.makeText(
                        this,
                        getResources().getString(R.string.star_error),
                        Toast.LENGTH_SHORT
                ).show();
            }
        });
    }

    /**
     * Sets the activity's fields to show the sender's info
     *
     * @param sender user object of the sender
     */
    private void showSenderInfo(UserInfo sender) {
        senderName.setText(sender.getFullName());
        senderEmail.setText(sender.getMail());
        displayBase64Image(sender.getImageUrl(), senderAvatar);
    }

    /**
     * Sets the activity's fields to show the mail's contents (subject, body, time etc.)
     *
     * @param mail mail object
     */
    private void showMailContent(Mail mail) {
        if (mail.getSentAt() != null && !mail.getSentAt().isBlank()) {
            String formattedTime = DateUtil.getFormattedDate(mail.getSentAt());
            mailDate.setText(formattedTime);
        }
        mailSubject.setText(mail.getSubject());
        mailBody.setText(mail.getBody());
        // if there are no attachments - hide the header
        List<Attachment> attachments = mail.getAttachments();
        if (attachments.isEmpty()) {
            attachmentsContainer.setVisibility(GONE);
        } else {
            // TODO show attachments
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
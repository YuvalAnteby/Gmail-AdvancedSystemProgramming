package com.asp.android_app.ui.inbox_activity;

import static com.asp.android_app.utils.Base64Converter.displayBase64Image;

import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.text.Html;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;
import androidx.recyclerview.widget.RecyclerView;

import com.asp.android_app.R;
import com.asp.android_app.model.Mail;
import com.asp.android_app.ui.ReadingActivity;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.MailViewModel;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.imageview.ShapeableImageView;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * RecyclerView Adapter for displaying a list of Mail items.
 */
public class MailAdapter extends RecyclerView.Adapter<MailAdapter.MailViewHolder> {

    private List<Mail> mailList;
    private final Set<Integer> selectedPositions = new HashSet<>();
    private final Context context;
    private final String inboxType;
    private final ActivityResultLauncher<Intent> launcher;
    private final MailViewModel mailViewModel;

    public MailAdapter(Context context, LifecycleOwner lifecycle, String inboxType,
                       ActivityResultLauncher<Intent> launcher, MailViewModel mailViewModel) {
        this.context = context;
        this.inboxType = inboxType;
        this.launcher = launcher;
        this.mailViewModel = mailViewModel;
        mailViewModel.getEditMailStatus().observe(lifecycle, result -> {
            if (result instanceof Result.Error)
                Log.i("ROW", ((Result.Error<Void>) result).getMessage());
        });
    }

    public void setMailList(List<Mail> mailList) {
        this.mailList = mailList;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.mail_item, parent, false);
        return new MailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder holder, int position) {
        // set the data to the fields
        Mail mail = mailList.get(position);
        holder.subjectText.setText(mail.getSubject());
        holder.senderText.setText(mail.getSender().getFullName());
        // remove HTML formatting in preview
        if (mail.getBody() != null && !mail.getBody().isEmpty()) {
            String plainText = Html.fromHtml(mail.getBody(), Html.FROM_HTML_MODE_LEGACY).toString();
            holder.previewText.setText(plainText);
        }
        displayBase64Image(mail.getSender().getImageUrl(), holder.imageCheckbox);

        // set different style if the mail is unread
        if (!mail.isRead()) {
            holder.subjectText.setTypeface(null, Typeface.BOLD);
            holder.senderText.setTypeface(null, Typeface.BOLD);
            holder.mailCard.setCardBackgroundColor(
                    ContextCompat.getColor(holder.itemView.getContext(), R.color.unread_mail));
        } else {
            holder.subjectText.setTypeface(null, Typeface.NORMAL);
            holder.senderText.setTypeface(null, Typeface.NORMAL);
            holder.mailCard.setCardBackgroundColor(
                    ContextCompat.getColor(holder.itemView.getContext(), R.color.read_mail));
        }

        // handle the image checkbox - shows V when selected, user's image when not
        handleImageCheckbox(holder, position);

        // handle clicks on anything else beside the checkbox
        holder.mailCard.setOnClickListener(view -> onContentClick(position));
    }

    /**
     * Handles the selection of mail rows by showing a V vector asset instead of a user's image.
     *
     * @param holder   view
     * @param position row index
     */
    private void handleImageCheckbox(@NonNull MailViewHolder holder, int position) {
        Mail mail = mailList.get(position);
        boolean isSelected = selectedPositions.contains(position);

        if (isSelected) {
            holder.imageCheckbox.setImageResource(R.drawable.ic_checkmark);
            holder.imageContainer.setBackgroundResource(R.drawable.circle_selected_background);
            // scaling to make it look better
            holder.imageCheckbox.setScaleX(0.8f);
            holder.imageCheckbox.setScaleY(0.8f);
            holder.imageContainer.setScaleX(0.9f);
            holder.imageContainer.setScaleY(0.9f);
        } else {
            displayBase64Image(mail.getSender().getImageUrl(), holder.imageCheckbox);
            holder.imageContainer.setBackgroundResource(R.drawable.circle_background);
        }
        // listen to clicks on the image
        holder.imageCheckbox.setOnClickListener(v -> {
            if (isSelected) {
                selectedPositions.remove(position);
            } else {
                selectedPositions.add(position);
            }
            notifyItemChanged(position);
        });
    }

    private void onContentClick(int position) {
        Mail m = mailList.get(position);

        // update the read flag in the backend
        if (!m.isRead()) {
            mailViewModel.markAsRead(m.getId());
            m.setIsRead(true);
            notifyItemChanged(position);
        }
        // navigate to read the mail
        Intent intent = new Intent(context, ReadingActivity.class);
        intent.putExtra("inboxType", inboxType);
        intent.putExtra("mailId", m.getId());
        launcher.launch(intent);
    }

    @Override
    public int getItemCount() {
        return mailList != null ? mailList.size() : 0;
    }

    static class MailViewHolder extends RecyclerView.ViewHolder {
        TextView subjectText, senderText, previewText;
        ShapeableImageView imageCheckbox;
        FrameLayout imageContainer;
        MaterialCardView mailCard;

        public MailViewHolder(@NonNull View itemView) {
            super(itemView);
            mailCard = itemView.findViewById(R.id.cardMail);
            subjectText = itemView.findViewById(R.id.text_subject);
            senderText = itemView.findViewById(R.id.text_sender);
            previewText = itemView.findViewById(R.id.text_preview);
            imageCheckbox = itemView.findViewById(R.id.image_checkbox);
            imageContainer = itemView.findViewById(R.id.image_checkbox_container);
        }
    }
}
package com.asp.android_app.ui.compose_activity;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.asp.android_app.R;
import com.asp.android_app.model.response.UserSearchResult;

import java.util.ArrayList;
import java.util.List;

public class SuggestionAdapter extends ArrayAdapter<UserSearchResult> {
    private final LayoutInflater inflater;
    private final List<UserSearchResult> items = new ArrayList<>();

    public SuggestionAdapter(@NonNull Context ctx) {
        super(ctx, 0);
        inflater = LayoutInflater.from(ctx);
    }

    public void setData(List<UserSearchResult> data) {
        items.clear();
        if (data != null) items.addAll(data);
        notifyDataSetChanged();
    }

    @Override public int getCount() { return items.size(); }
    @Nullable @Override public UserSearchResult getItem(int position) { return items.get(position); }

    @NonNull
    @Override public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        View v = convertView;
        if (v == null) v = inflater.inflate(R.layout.item_user_suggestion, parent, false);
        UserSearchResult u = getItem(position);
        TextView tvName = v.findViewById(R.id.tv_name);
        TextView tvMail = v.findViewById(R.id.tv_mail);
        if (u != null) {
            tvName.setText(u.getName());
            tvMail.setText(u.getMail());
        }
        return v;
    }
}

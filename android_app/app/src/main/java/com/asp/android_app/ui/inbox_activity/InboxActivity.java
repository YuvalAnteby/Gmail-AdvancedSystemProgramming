package com.asp.android_app.ui.inbox_activity;

import static com.asp.android_app.utils.Base64Converter.displayBase64Image;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.asp.android_app.R;
import com.asp.android_app.model.response.UserInfo;

public class InboxActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);
        // initialize the mail list
        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, new InboxFragment())
                    .commit();
        }
        // initialize the profile image
        ImageView userImageView = findViewById(R.id.user_avatar);
        loadProfileImage(userImageView);
        // initialize the drawer menu
        DrawerLayout drawerLayout = findViewById(R.id.main);
        ImageView hamburgerIcon = findViewById(R.id.hamburger_icon);
        hamburgerIcon.setOnClickListener(v -> {
            drawerLayout.openDrawer(GravityCompat.START);
        });

        // initialize the search bar
        EditText searchInput = findViewById(R.id.search_input);
        searchInput.setSelected(false); // on creation - don't show as focused
        handleMailSearch(searchInput);
    }

    /**
     * Loads the user image using base64, if no image found uses the default avatar
     *
     * @param userImageView image view instance to show on
     */
    private void loadProfileImage(ImageView userImageView) {
        UserInfo user = getIntent().getParcelableExtra("user");
        if (user != null && user.getImageUrl() != null) {
            String imageBase64 = user.getImageUrl();
            displayBase64Image(imageBase64, userImageView);
        } else {
            userImageView.setImageResource(R.drawable.profile_default);
        }
    }

    /**
     * TODO implement drawer menu functionality
     */
    private void handleDrawerMenu() {
        Log.i("DRAWER", "");
    }

    /**
     * TODO implement search
     *
     * @param searchInput
     */
    private void handleMailSearch(EditText searchInput) {
        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // Live filtering logic here
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

}
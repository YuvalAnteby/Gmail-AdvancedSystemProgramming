package com.asp.android_app.ui.inbox_activity;

import static com.asp.android_app.utils.Base64Converter.displayBase64Image;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.asp.android_app.R;
import com.asp.android_app.model.response.UserInfo;
import com.google.android.material.navigation.NavigationView;

public class InboxActivity extends AppCompatActivity {
    private InboxFragment inboxFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);
        // initialize the mail list
        if (savedInstanceState == null) {
            inboxFragment = new InboxFragment();
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, inboxFragment)
                    .commit();
        } else {
            inboxFragment = (InboxFragment) getSupportFragmentManager()
                    .findFragmentById(R.id.fragment_container);
        }
        // initialize the profile image
        ImageView userImageView = findViewById(R.id.user_avatar);
        loadProfileImage(userImageView);
        // initialize the drawer menu
        initializeDrawerMenu();

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
     * Initializes the drawer layout and listens to clicks to show the type of inbox
     */
    private void initializeDrawerMenu() {
        DrawerLayout drawerLayout = findViewById(R.id.main);
        ImageView hamburgerIcon = findViewById(R.id.hamburger_icon);
        hamburgerIcon.setOnClickListener(v -> {
            drawerLayout.openDrawer(GravityCompat.START);
        });

        NavigationView navView = findViewById(R.id.navigation_view);
        navView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            drawerLayout.closeDrawer(GravityCompat.START);
            item.setChecked(true);

            if (id == R.id.nav_all_mails) {
                inboxFragment.setInbox("all");
                return true;
            }
            if (id == R.id.nav_incoming) {
                inboxFragment.setInbox("incoming");
                return true;
            }
            if (id == R.id.nav_sent) {
                inboxFragment.setInbox("sent");
                return true;
            }
            if (id == R.id.nav_draft) {
                inboxFragment.setInbox("draft");
                return true;
            }
            if (id == R.id.nav_star) {
                inboxFragment.setInbox("star");
                return true;
            }
            if (id == R.id.nav_trash) {
                inboxFragment.setInbox("trash");
                return true;
            }
            if (id == R.id.nav_spam) {
                inboxFragment.setInbox("spam");
                return true;
            }

            // TODO add view by labels

            return false;
        });

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
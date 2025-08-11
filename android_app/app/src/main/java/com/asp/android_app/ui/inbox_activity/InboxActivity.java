package com.asp.android_app.ui.inbox_activity;

import static com.asp.android_app.utils.Base64Converter.displayBase64Image;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;

import com.asp.android_app.R;
import com.asp.android_app.model.Label;
import com.asp.android_app.ui.compose_activity.ComposeFragment;
import com.asp.android_app.ui.compose_activity.ComposeMailActivity;
import com.asp.android_app.utils.TokenManager;
import com.asp.android_app.model.request.ProfileImageRequest;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.ui.auth_activity.AuthActivity;
import com.asp.android_app.utils.ImagePicker;
import com.asp.android_app.utils.Result;
import com.asp.android_app.viewmodel.LabelViewModel;
import com.asp.android_app.viewmodel.UserViewModel;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InboxActivity extends AppCompatActivity {
    private InboxFragment inboxFragment;
    private ActivityResultLauncher<String> imagePickerLauncher;
    private ImageView userImageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);
        UserInfo user = getIntent().getParcelableExtra("user");

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

        // initialize user related observers and data sources
        UserViewModel userViewModel = new ViewModelProvider(this).get(UserViewModel.class);
        initializeUserObservers(userViewModel);

        // initialize the profile image
        userImageView = findViewById(R.id.user_avatar);
        loadProfileImage(userImageView, user, userViewModel);
        userImageView.setOnClickListener(view -> showProfileOptionsDialog(user));
        // initialize the drawer menu and labels
        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        initializeDrawerMenu(labelViewModel);

        // initialize the search bar
        EditText searchInput = findViewById(R.id.search_input);
        searchInput.setSelected(false); // on creation - don't show as focused
        handleMailSearch(searchInput);

        // initialize the floating compose button
        initializeComposeButton();
    }


    /**
     * initializes and sets the click listener for the compose floating action button
     */
    private void initializeComposeButton() {
        ActivityResultLauncher<Intent> composeLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    // if RESULT_OK - we sent the draft, so we got to refresh the inbox
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        String action = result.getData().getStringExtra("compose_result_action");
                        if ("sent".equals(action)) {
                            if (inboxFragment != null) inboxFragment.setInbox("sent");
                            Snackbar.make(findViewById(android.R.id.content),
                                    R.string.compose_sent_success, Snackbar.LENGTH_SHORT).show();
                        } else if ("saved".equals(action)) {
                            if (inboxFragment != null) inboxFragment.setInbox("draft");
                            Snackbar.make(findViewById(android.R.id.content),
                                    R.string.compose_saved_success, Snackbar.LENGTH_SHORT).show();
                        }
                    }
                });

        FloatingActionButton fab = findViewById(R.id.fabCompose);
        fab.setOnClickListener(v -> {
            Intent i = ComposeMailActivity.newIntent(this, -1);
            composeLauncher.launch(i);
        });
    }

    /**
     * Initializes user related observers like the user view model and image picker click listeners
     *
     * @param userViewModel view model containing the single source of truth
     */
    private void initializeUserObservers(UserViewModel userViewModel) {
        userViewModel.getUserInfoResult().observe(this, result -> {
            if (result instanceof Result.Success) {
                UserInfo updatedUser = ((Result.Success<UserInfo>) result).getData();
                displayBase64Image(updatedUser.getImageUrl(), userImageView);
            } else if (result instanceof Result.Error) {
                Toast.makeText(this, ((Result.Error<?>) result).getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        userViewModel.getImageUpdateStatus().observe(this, result -> {
            if (result instanceof Result.Success) {
                UserInfo updatedUser = ((Result.Success<UserInfo>) result).getData();
                displayBase64Image(updatedUser.getImageUrl(), userImageView);
            } else if (result instanceof Result.Error) {
                Toast.makeText(this, ((Result.Error<?>) result).getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        imagePickerLauncher = ImagePicker.registerImagePicker(this, this,
                new ImagePicker.ImagePickerCallback() {
                    @Override
                    public void onImagePicked(String base64Image) {
                        UserInfo user = getIntent().getParcelableExtra("user");
                        if (user != null) {
                            ProfileImageRequest request = new ProfileImageRequest(base64Image);
                            userViewModel.changeProfileImage(user.getId(), request);
                        }
                    }

                    @Override
                    public void onError(String message) {
                        Toast.makeText(InboxActivity.this, message, Toast.LENGTH_SHORT).show();
                    }
                });
    }

    /**
     * Loads the user image using base64, if no image found uses the default avatar
     *
     * @param userImageView image view instance to show on
     */
    private void loadProfileImage(ImageView userImageView, UserInfo user, UserViewModel userVM) {
        if (user != null) {
            userVM.fetchUserInfo(user.getId());
        } else {
            userImageView.setImageResource(R.drawable.profile_default);
        }
    }

    private void showProfileOptionsDialog(UserInfo user) {
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.user_settings)
                .setItems(new String[]{
                        getString(R.string.change_picture),
                        getString(R.string.logout_user)
                }, (dialogInterface, i) -> {
                    if (i == 0) {
                        // Change profile picture
                        imagePickerLauncher.launch("image/*");
                    } else if (i == 1) {
                        // Log out
                        TokenManager tokenManager = TokenManager.getInstance(this);
                        tokenManager.clearToken();
                        Intent intent = new Intent(this, AuthActivity.class);
                        startActivity(intent);
                    }
                })
                .show();
    }

    /**
     * Initializes the drawer layout and listens to clicks to show the type of inbox
     *
     * @param labelViewModel view model containing the single source of truth
     */
    private void initializeDrawerMenu(LabelViewModel labelViewModel) {
        DrawerLayout drawerLayout = findViewById(R.id.main);
        ImageView hamburgerIcon = findViewById(R.id.hamburger_icon);
        hamburgerIcon.setOnClickListener(v -> {
            drawerLayout.openDrawer(GravityCompat.START);
        });

        NavigationView navView = findViewById(R.id.navigation_view);
        navView.setNavigationItemSelectedListener(item -> {
            clearAllMenuSelection();
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
            if (id == R.id.nav_create_label) {
                showCreateLabelDialog(labelViewModel);
                return true;
            }
            return false;
        });
        // init labels
        labelViewModel.fetchAllLabels();
        initializeLabels(labelViewModel);
    }

    /**
     * Adds a text change listener to the search input field and triggers
     * the mail search after user types (with a small delay).
     *
     * @param searchInput the EditText for entering search queries
     */
    private void handleMailSearch(EditText searchInput) {
        final Handler handler = new Handler(Looper.getMainLooper());
        final long delayMillis = 300; // debounce time
        final Runnable[] searchRunnable = new Runnable[1];

        searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                handler.removeCallbacks(searchRunnable[0]);

            }

            @Override
            public void afterTextChanged(Editable editable) {
                String query = editable.toString().trim();
                searchRunnable[0] = () -> {
                    if (inboxFragment != null) {
                        inboxFragment.searchMails(query);
                    }
                };
                handler.postDelayed(searchRunnable[0], delayMillis);
            }
        });
    }

    /**
     * Initializes the labels in the drawer menu
     *
     * @param labelViewModel view model containing the single source of truth
     */
    private void initializeLabels(LabelViewModel labelViewModel) {
        // observer for fetching labels
        labelViewModel.getAllLabels().observe(this, result -> {
            if (result == null) {
                return;
            }
            populateLabelsInDrawer(result);
        });
        // observer for label creation
        labelViewModel.getCreatedLabel().observe(this, result -> {
            if (result == null)
                return;
            labelViewModel.fetchAllLabels();
        });
        labelViewModel.getCreatedSublabel().observe(this, result -> {
            if (result == null)
                return;
            labelViewModel.fetchAllLabels();
        });
        // observer for editing
        labelViewModel.getLabelUpdated().observe(this, result -> {
            if (result == null)
                return;
            labelViewModel.fetchAllLabels();
        });
        // observer for deletion
        labelViewModel.getLabelDeleted().observe(this, result -> {
            if (result == null)
                return;
            labelViewModel.fetchAllLabels();
        });
    }

    /**
     * Adds the given labels to the drawer menu
     *
     * @param labels list of labels from the backend
     */
    private void populateLabelsInDrawer(List<Label> labels) {
        NavigationView navView = findViewById(R.id.navigation_view);
        Menu menu = navView.getMenu();

        // Remove any previous dynamic labels
        for (int i = menu.size() - 1; i >= 0; i--) {
            MenuItem item = menu.getItem(i);
            if (item.getGroupId() == R.id.nav_dynamic_labels_group)
                menu.removeItem(item.getItemId());
        }

        // Use a high `order` value for the "Create Label" item to ensure it's always last
        MenuItem createLabelItem = menu.findItem(R.id.nav_create_label);
        if (createLabelItem != null)
            menu.removeItem(R.id.nav_create_label);

        Map<Integer, List<Label>> childrenMap = new HashMap<>();
        List<Label> rootLabels = new ArrayList<>();

        for (Label label : labels) {
            if (label.getParent() == null) {
                rootLabels.add(label);
                continue;
            }
            childrenMap
                    .computeIfAbsent(label.getParent(), k -> new ArrayList<>())
                    .add(label);
        }

        // Add dynamic labels with a mid-range order value (after inboxes, before "create label")
        int[] orderCounter = {0}; // use array to allow mutation inside lambda
        for (Label parent : rootLabels) {
            addLabelToMenu(menu, parent, 0, orderCounter, childrenMap);
        }

        // Re-add "Create Label" with a higher order so it would be last
        if (createLabelItem != null) {
            menu.add(
                            Menu.NONE,
                            R.id.nav_create_label,
                            orderCounter[0] + labels.size() + 10,
                            createLabelItem.getTitle())
                    .setIcon(R.drawable.ic_add);
        }
    }

    /**
     * Adds a new label to the drawer menu
     *
     * @param menu         menu to be inserted to
     * @param label        label object to insert
     * @param level        indentation level of the label (0 for root)
     * @param orderCounter counter to place labels in correct order (sub label after parent)
     * @param childrenMap  map to track sub labels correctly
     */
    private void addLabelToMenu(
            Menu menu,
            Label label,
            int level,
            int[] orderCounter,
            Map<Integer, List<Label>> childrenMap
    ) {
        String indent = "       ".repeat(level);
        String labelName = indent + label.getName();

        MenuItem item = menu.add(R.id.nav_dynamic_labels_group, Menu.NONE, 100 + orderCounter[0]++, labelName);
        item.setIcon(R.drawable.ic_label);
        item.setOnMenuItemClickListener(menuItem -> {
            clearAllMenuSelection();
            menuItem.setChecked(true);
            inboxFragment.setInbox("label:" + label.getId());
            DrawerLayout drawerLayout = findViewById(R.id.main);
            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });

        List<Label> children = childrenMap.get(label.getId());
        if (children != null)
            for (Label child : children)
                addLabelToMenu(menu, child, level + 1, orderCounter, childrenMap);
    }

    /**
     * Unchecks all items in the drawer menu (static and dynamic).
     */
    private void clearAllMenuSelection() {
        NavigationView navView = findViewById(R.id.navigation_view);
        Menu menu = navView.getMenu();

        for (int i = 0; i < menu.size(); i++) {
            MenuItem item = menu.getItem(i);
            item.setChecked(false);
            // Handle nested groups like nav_dynamic_labels_group
            if (item.hasSubMenu())
                for (int j = 0; j < item.getSubMenu().size(); j++)
                    item.getSubMenu().getItem(j).setChecked(false);
        }
    }

    /**
     * Shows a dialog to create a new label
     *
     * @param labelViewModel view model containing the single source of truth
     */
    private void showCreateLabelDialog(LabelViewModel labelViewModel) {
        final EditText etName = new EditText(this);
        etName.setHint(R.string.label_hint);
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.new_label)
                .setView(etName)
                .setPositiveButton(R.string.next, (dialog, which) -> {
                    String labelName = etName.getText().toString().trim();
                    if (labelName.isBlank()) {
                        Toast.makeText(this, R.string.name_required_error, Toast.LENGTH_SHORT).show();
                        return;
                    }
                    showSublabelChoiceDialog(labelViewModel, labelName);
                })
                .setNegativeButton(R.string.cancel, null)
                .show();
    }

    /**
     * Shows a dialog to create a new sub label
     *
     * @param labelViewModel view model containing the single source of truth
     * @param labelName      new sub label's name
     */
    private void showSublabelChoiceDialog(LabelViewModel labelViewModel, String labelName) {
        String[] options = getResources().getStringArray(R.array.label_options);
        List<Label> currentLabels = labelViewModel.getAllLabels().getValue();
        // if no labels exist yet - just create the label as a parent label
        if (currentLabels == null || currentLabels.isEmpty()) {
            labelViewModel.createLabel(labelName);
            labelViewModel.getAllLabels();
            return;
        }
        // let the user pick if it's a parent label or sub label
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.create_label_as)
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        labelViewModel.createLabel(labelName);
                        labelViewModel.getAllLabels();
                    } else {
                        // Open another dialog with list of existing labels
                        showParentPickerDialog(labelViewModel, labelName, currentLabels);
                    }
                })
                .show();
    }

    /**
     * Shows a dialog to pick a parent label for a sub label
     *
     * @param labelVM view model containing the single source of truth
     * @param name    new sub label's name
     */
    private void showParentPickerDialog(LabelViewModel labelVM, String name, List<Label> labels) {
        String[] labelNames = labels.stream().map(Label::getName).toArray(String[]::new);
        new MaterialAlertDialogBuilder(this)
                .setTitle(R.string.pick_parent_label)
                .setItems(labelNames, (dialog, which) -> {
                    int parentId = labels.get(which).getId();
                    labelVM.createSublabel(parentId, name);
                })
                .show();
    }

}
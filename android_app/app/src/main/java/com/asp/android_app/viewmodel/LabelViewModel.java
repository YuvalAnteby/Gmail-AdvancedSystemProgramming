package com.asp.android_app.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.asp.android_app.model.Label;
import com.asp.android_app.repository.LabelRepository;

import java.util.List;

/**
 * ViewModel class for handling label-related logic and exposing LiveData to the UI.
 * Acts as a bridge between the Repository and UI layer.
 */
public class LabelViewModel extends AndroidViewModel {

    private final LabelRepository repository;

    private final MutableLiveData<List<Label>> allLabels = new MutableLiveData<>();
    private final MutableLiveData<Label> createdLabel = new MutableLiveData<>();
    private final MutableLiveData<Label> createdSublabel = new MutableLiveData<>();
    private final MutableLiveData<Boolean> labelUpdated = new MutableLiveData<>();
    private final MutableLiveData<Boolean> labelDeleted = new MutableLiveData<>();

    public LabelViewModel(@NonNull Application application) {
        super(application);
        this.repository = new LabelRepository(application.getApplicationContext());
    }

    /**
     * Triggers the fetching of all labels from the repository.
     */
    public void fetchAllLabels() {
        repository.getAllLabels().observeForever(allLabels::setValue);
    }

    /**
     * Creates a new root-level label and updates LiveData with the result.
     * @param name The name of the new label.
     */
    public void createLabel(String name) {
        repository.createLabel(name).observeForever(createdLabel::setValue);
    }

    /**
     * Creates a new sublabel under a parent and updates LiveData with the result.
     * @param parentId ID of the parent label.
     * @param name Name of the sublabel.
     */
    public void createSublabel(int parentId, String name) {
        repository.createSublabel(parentId, name).observeForever(createdSublabel::setValue);
    }

    /**
     * Edits the name of an existing label and updates LiveData with success flag.
     * @param labelId ID of the label to edit.
     * @param newName New name for the label.
     */
    public void editLabel(int labelId, String newName) {
        repository.editLabel(labelId, newName).observeForever(labelUpdated::setValue);
    }

    /**
     * Deletes a label and updates LiveData with success flag.
     * @param labelId ID of the label to delete.
     */
    public void deleteLabel(int labelId) {
        repository.deleteLabel(labelId).observeForever(labelDeleted::setValue);
    }

    // Getters for LiveData to observe from UI

    public LiveData<List<Label>> getAllLabels() {
        return allLabels;
    }

    public LiveData<Label> getCreatedLabel() {
        return createdLabel;
    }

    public LiveData<Label> getCreatedSublabel() {
        return createdSublabel;
    }

    public LiveData<Boolean> getLabelUpdated() {
        return labelUpdated;
    }

    public LiveData<Boolean> getLabelDeleted() {
        return labelDeleted;
    }
}

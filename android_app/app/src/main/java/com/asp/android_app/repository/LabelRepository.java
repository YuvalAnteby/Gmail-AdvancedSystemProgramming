package com.asp.android_app.repository;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.api.LabelApi;
import com.asp.android_app.api.ApiClient;
import com.asp.android_app.model.Label;
import com.asp.android_app.model.request.LabelRequest;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository class responsible for handling label-related data operations.
 * Responsible for calling the LabelApi and exposing results via LiveData.
 */
public class LabelRepository {

    private final LabelApi labelApi;

    public LabelRepository(Context context) {
        this.labelApi = ApiClient.getClient(context).create(LabelApi.class);
    }

    /**
     * Fetches all labels for the authenticated user.
     *
     * @return LiveData list of labels.
     */
    public LiveData<List<Label>> getAllLabels() {
        MutableLiveData<List<Label>> labelsLiveData = new MutableLiveData<>();
        labelApi.getAllLabels().enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<List<Label>> call, Response<List<Label>> response) {
                Log.i("LABELS ALL", response.code() + " " + response.errorBody());
                if (response.isSuccessful()) {
                    labelsLiveData.setValue(response.body());
                } else {
                    labelsLiveData.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<List<Label>> call, Throwable t) {
                labelsLiveData.setValue(null);
            }
        });
        return labelsLiveData;
    }

    /**
     * Creates a new root-level label.
     *
     * @param name Name of the label.
     * @return LiveData containing the created label or null if failed.
     */
    public LiveData<Label> createLabel(String name) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        labelApi.createLabel(new LabelRequest(name)).enqueue(new Callback<Label>() {
            @Override
            public void onResponse(Call<Label> call, Response<Label> response) {
                result.setValue(response.isSuccessful() ? response.body() : null);
            }

            @Override
            public void onFailure(Call<Label> call, Throwable t) {
                result.setValue(null);
            }
        });
        return result;
    }

    /**
     * Creates a sub-label under the given parent label.
     *
     * @param parentId ID of the parent label.
     * @param name     Name of the new sub-label.
     * @return LiveData containing the created sub-label or null if failed.
     */
    public LiveData<Label> createSublabel(int parentId, String name) {
        MutableLiveData<Label> result = new MutableLiveData<>();
        labelApi.createSublabel(parentId, new LabelRequest(name)).enqueue(new Callback<Label>() {
            @Override
            public void onResponse(Call<Label> call, Response<Label> response) {
                result.setValue(response.isSuccessful() ? response.body() : null);
            }

            @Override
            public void onFailure(Call<Label> call, Throwable t) {
                result.setValue(null);
            }
        });
        return result;
    }

    /**
     * Renames an existing label by ID.
     *
     * @param labelId ID of the label to rename.
     * @param newName New name for the label.
     * @return LiveData<Boolean> true if successful, false otherwise.
     */
    public LiveData<Boolean> editLabel(int labelId, String newName) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        labelApi.editLabel(labelId, new LabelRequest(newName)).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                result.setValue(response.isSuccessful());
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                result.setValue(false);
            }
        });
        return result;
    }

    /**
     * Deletes a label by its ID.
     *
     * @param labelId ID of the label to delete.
     * @return LiveData<Boolean> true if successful, false otherwise.
     */
    public LiveData<Boolean> deleteLabel(int labelId) {
        MutableLiveData<Boolean> result = new MutableLiveData<>();
        labelApi.deleteLabel(labelId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                result.setValue(response.isSuccessful());
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                result.setValue(false);
            }
        });
        return result;
    }
}

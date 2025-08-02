package com.asp.android_app.api;

import com.asp.android_app.model.Label;
import com.asp.android_app.model.request.LabelRequest;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * Retrofit interface for managing label-related operations.
 * Connects to endpoints defined in the NodeJS server.
 * All calls require authentication via Authorization header.
 */
public interface LabelApi {

    /**
     * Fetch all labels belonging to the authenticated user.
     * @return A list of LabelResponse objects.
     */
    @GET("labels/")
    Call<List<Label>> getAllLabels();

    /**
     * Create a new root-level label.
     * @param labelRequest The request body containing the label name.
     * @return The newly created LabelResponse.
     */
    @POST("labels/")
    Call<Label> createLabel(@Body LabelRequest labelRequest);

    /**
     * Create a new sub-label under a parent label.
     * @param parentId The ID of the parent label.
     * @param labelRequest The request body containing the sub-label name.
     * @return The newly created sub-label.
     */
    @POST("labels/{id}/sublabel")
    Call<Label> createSublabel(@Path("id") int parentId, @Body LabelRequest labelRequest);

    /**
     * Edit the name of an existing label.
     * @param labelId The ID of the label to edit.
     * @param labelRequest The new name.
     * @return An empty response with status 204 on success.
     */
    @PATCH("labels/{id}")
    Call<Void> editLabel(@Path("id") int labelId, @Body LabelRequest labelRequest);

    /**
     * Delete a label by ID. May also delete sub-labels depending on server logic.
     * @param labelId The ID of the label to delete.
     * @return An empty response with status 204 on success.
     */
    @DELETE("labels/{id}")
    Call<Void> deleteLabel(@Path("id") int labelId);
}

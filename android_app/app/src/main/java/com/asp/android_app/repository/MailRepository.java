package com.asp.android_app.repository;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.api.ApiClient;
import com.asp.android_app.api.MailApi;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.EditMailRequest;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.utils.Result;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository class for handling mail-related data operations.
 * Responsible for calling the MailApi and exposing results via LiveData.
 */
public class MailRepository {

    private final MailApi mailApi;

    public MailRepository(Context context) {
        mailApi = ApiClient.getClient(context).create(MailApi.class);
    }

    /**
     * Fetch mails by inbox type and page number.
     *
     * @param inboxType      "incoming", "sent", "star", "trash", etc.
     * @param page           current page number
     * @param resultLiveData a LiveData object to observe result (mail list)
     */
    public void getMailsByType(String inboxType, int page, MutableLiveData<Result<MailListResponse>> resultLiveData) {
        final int MAIL_LIMIT = 50;
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.getMailsByType(inboxType, page, MAIL_LIMIT).enqueue(createCallback(resultLiveData));
    }

    /**
     * Fetch a mail by it's id.
     *
     * @param id             id of the mail
     * @param resultLiveData a LiveData object to observe result (mail object)
     */
    public void fetchMail(int id, MutableLiveData<Result<Mail>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.fetchMail(id).enqueue(createCallback(resultLiveData));
    }

    /**
     * Delete a mail by its ID.
     *
     * @param mailId         The ID of the mail to delete
     * @param resultLiveData a LivData object to observe result (void on success)
     */
    public void deleteMail(int mailId, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.deleteMail(mailId).enqueue(createCallback(resultLiveData));
    }

    /**
     * toggle a mail's spam flag by calling the backend's POST or DELETE /blacklist/:id endpoint.
     *
     * @param request        contains the mail ID and user ID
     * @param resultLiveData result live data to observe success or error
     */
    public void toggleSpam(SpamRequest request, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        if (!request.getIsPreviouslySpam())
            mailApi.markAsSpam(request).enqueue(createCallback(resultLiveData));
        else
            mailApi.removeFromSpam(request).enqueue(createCallback(resultLiveData));
    }

    /**
     * Edits a mail
     * @param mailId the ID of the mail to edit
     * @param req    request object containing all data to edit
     * @param result result live data to observe success or error
     */
    public void editMail(int mailId, EditMailRequest req, MutableLiveData<Result<Void>> result) {
        result.postValue(new Result.Loading<>());
        mailApi.editMail(mailId, req).enqueue(createCallback(result));
    }


    /**
     * Search mails using a query from the user.
     *
     * @param query          string to search for in mails
     * @param resultLiveData result live data to observe success or error
     */
    public void searchMails(String query, MutableLiveData<Result<List<Mail>>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.searchMails(query).enqueue(createCallback(resultLiveData));
    }

    // TODO Additional methods: sendNewMail


    /**
     * Helper class to centralize callback creation
     *
     * @param liveData result live data to show
     * @return callback of type T
     */
    private <T> Callback<T> createCallback(MutableLiveData<Result<T>> liveData) {
        return new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<T> call, @NonNull Response<T> response) {
                if (response.isSuccessful()) {
                    liveData.postValue(new Result.Success<>(response.body()));
                } else {
                    liveData.postValue(new Result.Error<>("Error: " + response.code()));
                }
            }

            @Override
            public void onFailure(@NonNull Call<T> call, @NonNull Throwable t) {
                liveData.postValue(new Result.Error<>(t.getMessage()));
            }
        };
    }
}
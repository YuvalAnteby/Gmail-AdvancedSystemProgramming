package com.asp.android_app.repository;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.api.ApiClient;
import com.asp.android_app.api.MailApi;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.ReadStatus;
import com.asp.android_app.model.response.StarStatus;
import com.asp.android_app.model.response.TrashStatus;
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
    public void getMailsByType(String inboxType, int page, MutableLiveData<Result<List<Mail>>> resultLiveData) {
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
     * Restores a mail from the trash by its ID.
     *
     * @param mailId         The ID of the mail to restore
     * @param status         The trash flag status
     * @param resultLiveData a LiveData object to observe result (trash status result)
     */
    public void restoreMail(int mailId, TrashStatus status, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.restoreMail(mailId, status).enqueue(createCallback(resultLiveData));
    }

    /**
     * toggle a mail's spam flag by calling the backend's POST or DELETE /blacklist/:id endpoint.
     *
     * @param request        contains the mail ID and user ID
     * @param resultLiveData result live data to observe success or error
     */
    public void markAsSpam(SpamRequest request, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.markAsSpam(request).enqueue(createCallback(resultLiveData));
    }

    /**
     * Remove a mail from the spam list by calling DELETE /blacklist.
     *
     * @param request        contains the mail ID and user ID
     * @param resultLiveData result live data to observe success or error
     */
    public void removeFromSpam(SpamRequest request, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.removeFromSpam(request).enqueue(createCallback(resultLiveData));
    }

    /**
     * Toggles a mail's star flag.
     *
     * @param mailId         The ID of the mail to un/star
     * @param status         The star flag status
     * @param resultLiveData result live data to observe success or error
     */
    public void toggleStar(int mailId, StarStatus status, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        mailApi.toggleStar(mailId, status).enqueue(createCallback(resultLiveData));
    }

    /**
     * Marks a mail as read.
     *
     * @param mailId         The ID of the mail to un/star
     * @param status         The read flag status
     * @param resultLiveData result live data to observe success or error
     */
    public void markRead(int mailId, ReadStatus status, MutableLiveData<Result<Void>> resultLiveData) {

        resultLiveData.postValue(new Result.Loading<>());
        mailApi.markAsRead(mailId, status).enqueue(createCallback(resultLiveData));
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
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
     * @param resultLiveData a LiveData object to observe result (success, error, loading)
     */
    public void getMailsByType(
            String inboxType,
            int page,
            MutableLiveData<Result<List<Mail>>> resultLiveData) {
        final int MAIL_LIMIT = 50;
        resultLiveData.postValue(new Result.Loading<>());

        // GET mails by type
        mailApi.getMailsByType(inboxType, page, MAIL_LIMIT).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> res) {
                if (res.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(res.body()));
                    return;
                }
                resultLiveData.postValue(new Result.Error<>("Error fetching mails: " + res.code()));

            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Fetch a mail by it's id.
     *
     * @param id             id of the mail
     * @param resultLiveData a LiveData object to observe result (success, error, loading)
     */
    public void fetchMail(int id, MutableLiveData<Result<Mail>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.fetchMail(id).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> res) {
                if (res.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(res.body()));
                    return;
                }
                resultLiveData.postValue(new Result.Error<>("Error fetching mail: " + res.code()));
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Delete a mail by its ID.
     *
     * @param mailId         The ID of the mail to delete
     * @param resultLiveData The LiveData object where the result will be posted
     */
    public void deleteMail(int mailId, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.deleteMail(mailId).enqueue(
                new Callback<>() {
                    @Override
                    public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> res) {
                        if (res.isSuccessful()) {
                            // no content expected in body (code 204)
                            resultLiveData.postValue(new Result.Success<>(null));
                        } else {
                            resultLiveData.postValue(new Result.Error<>(
                                    "Error deleting mail: " + res.code())
                            );
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                        resultLiveData.postValue(new Result.Error<>(t.getMessage()));
                    }
                }
        );
    }

    /**
     * Restores a mail from the trash by its ID.
     *
     * @param mailId         The ID of the mail to restore
     * @param status         The trash flag status
     * @param resultLiveData The LiveData object where the result will be posted
     */
    public void restoreMail(
            int mailId,
            TrashStatus status,
            MutableLiveData<Result<TrashStatus>> resultLiveData) {

        resultLiveData.postValue(new Result.Loading<>());

        mailApi.restoreMail(mailId, status).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(null));
                } else {
                    resultLiveData.postValue(new Result.Error<>(
                            "Failed to restore mail: " + response.code())
                    );
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));

            }
        });
    }

    /**
     * toggle a mail's spam flag by calling the backend's POST or DELETE /blacklist/:id endpoint.
     *
     * @param request        contains the mail ID and user ID
     * @param resultLiveData result live data to observe success or error
     */
    public void markAsSpam(SpamRequest request, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.markAsSpam(request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(null));
                } else {
                    resultLiveData.postValue(new Result.Error<>(
                            "Failed to mark as spam: " + response.code())
                    );
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Remove a mail from the spam list by calling DELETE /blacklist.
     *
     * @param request        contains the mail ID and user ID
     * @param resultLiveData result live data to observe success or error
     */
    public void removeFromSpam(SpamRequest request, MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.removeFromSpam(request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(null));
                } else {
                    resultLiveData.postValue(new Result.Error<>(
                            "Failed to remove from spam: " + response.code())
                    );
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Toggles a mail's star flag.
     *
     * @param mailId         The ID of the mail to un/star
     * @param status         The star flag status
     * @param resultLiveData result live data to observe success or error
     */
    public void toggleStar(
            int mailId,
            StarStatus status,
            MutableLiveData<Result<Void>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.toggleStar(mailId, status).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(null));
                } else {
                    resultLiveData.postValue(new Result.Error<>(
                            "Failed to toggle star: " + response.code())
                    );
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Marks a mail as read.
     *
     * @param mailId         The ID of the mail to un/star
     * @param status         The read flag status
     * @param resultLiveData result live data to observe success or error
     */
    public void markAsRead(
            int mailId,
            ReadStatus status,
            MutableLiveData<Result<Void>> resultLiveData) {

        resultLiveData.postValue(new Result.Loading<>());

        mailApi.markAsRead(mailId, status).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(null));
                } else {
                    resultLiveData.postValue(new Result.Error<>(
                            "Failed to toggle star: " + response.code())
                    );
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    /**
     * Search mails using a query from the user.
     *
     * @param query          string to search for in mails
     * @param resultLiveData result live data to observe success or error
     */
    public void searchMails(String query, MutableLiveData<Result<List<Mail>>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());

        mailApi.searchMails(query).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful()) {
                    resultLiveData.postValue(new Result.Success<>(response.body()));
                    return;
                }
                resultLiveData.postValue(new Result.Error<>(
                        "Error searching mails: " + response.code())
                );
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                resultLiveData.postValue(new Result.Error<>(t.getMessage()));
            }
        });
    }

    // TODO Additional methods: sendNewMail

}
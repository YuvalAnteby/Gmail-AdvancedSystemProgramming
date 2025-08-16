package com.asp.android_app.repository;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.api.ApiClient;
import com.asp.android_app.api.MailApi;
import com.asp.android_app.caching.MailLocalDataSource;
import com.asp.android_app.caching.entities.LabelEntity;
import com.asp.android_app.caching.entities.MailEntity;
import com.asp.android_app.caching.entities.MailLabelCrossRef;
import com.asp.android_app.caching.utils.LabelMappers;
import com.asp.android_app.caching.utils.MailMappers;
import com.asp.android_app.model.Label;
import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.EditMailRequest;
import com.asp.android_app.model.request.SendMailRequest;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.utils.NetworkUtil;
import com.asp.android_app.utils.Result;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository class for handling mail-related data operations.
 * 1. Exposes immediately cached (Room) data.
 * 2. Will attempt calling the backend API to update cache and expose to user
 * Rule: The backend is the real source of truth, data fetched from it will override localData data
 */
public class MailRepository {

    private final MailApi mailApi;
    private final MailLocalDataSource localData;
    private final ExecutorService io;
    private final Context context;

    public MailRepository(Context context) {
        this.context = context;
        io = Executors.newSingleThreadExecutor();
        mailApi = ApiClient.getClient(context).create(MailApi.class);
        localData = new MailLocalDataSource(context);
    }

    /**
     * Build a MailListResponse from localData entities for quick UI usage.
     */
    private MailListResponse mapLocalToListResponse(List<MailEntity> entities) {
        MailListResponse r = new MailListResponse();
        r.setMails(mapEntitiesToNetwork(entities));
        //r.setTotal(entities.size());
        return r;
    }

    /**
     * Converts Room MailEntity to network Mail (minimal for list screen).
     * Keeping only necessary fields: sender name+email+image, subject, body, flags, dates, id.
     *
     * @return list of mails in Mail object instead of cache object
     */
    private List<Mail> mapEntitiesToNetwork(List<MailEntity> es) {
        List<Mail> out = new ArrayList<>();
        for (MailEntity e : es) {
            Mail m = new Mail();
            m.setId(e.id);
            // sender
            UserInfo sender = new UserInfo(e.fromEmail, e.fromName);
            try {
                // tiny hack to set id + image since UserInfo fields are final/non-final mix
                java.lang.reflect.Field fId = sender.getClass().getDeclaredField("id");
                fId.setAccessible(true);
                fId.set(sender, e.fromId);
                java.lang.reflect.Field fImg = sender.getClass().getDeclaredField("image");
                fImg.setAccessible(true);
                fImg.set(sender, e.fromImageUrl);
            } catch (Exception ignore) {
            }
            m.setSubject(e.subject);
            m.setBody(e.body);
            // raw dates back (UI formats)
            try {
                java.lang.reflect.Field fSentAt = m.getClass().getDeclaredField("sentAt");
                fSentAt.setAccessible(true);
                fSentAt.set(m, e.sentAtRaw);
                java.lang.reflect.Field fCreatedAt = m.getClass().getDeclaredField("createdAt");
                fCreatedAt.setAccessible(true);
                fCreatedAt.set(m, e.createdAtRaw);
                java.lang.reflect.Field fFrom = m.getClass().getDeclaredField("from");
                fFrom.setAccessible(true);
                fFrom.set(m, sender);
            } catch (Exception ignore) {
            }
            // flags
            m.setIsRead(e.isRead);
            m.setStarred(e.isStarred);
            m.setTrashed(e.isTrashed);
            m.setSpam(e.isSpam);
            // we skip recipients/attachments for list; detail fetch can fill them
            out.add(m);
        }
        return out;
    }

    private List<Integer> idsOf(List<MailEntity> es) {
        List<Integer> ids = new ArrayList<>();
        for (MailEntity e : es) ids.add(e.id);
        return ids;
    }

    private List<MailEntity> getLocalByType(String inboxType) {
        switch ((inboxType == null ? "incoming" : inboxType).toLowerCase()) {
            case "sent":
                return localData.getSent();
            case "star":
                return localData.getStarred();
            case "draft":
                return localData.getDrafts();
            case "spam":
                return localData.getSpam();
            case "trash":
                return localData.getTrash();
            case "incoming":
            case "all":
            default:
                return localData.getIncoming();
        }
    }

    private void upsertServerMails(List<Mail> mails) {
        if (mails == null || mails.isEmpty()) return;

        List<MailEntity> entities = new ArrayList<>();
        List<MailLabelCrossRef> refs = new ArrayList<>();

        // collect UNIQUE labels from all mails (by id)
        LinkedHashMap<Integer, Label> uniq = new LinkedHashMap<>();
        for (Mail m : mails) {
            // map mail to entity
            MailEntity e = MailMappers.toEntity(m);
            entities.add(e);

            // build cross-refs and collect labels
            if (m.getLabels() != null) {
                for (com.asp.android_app.model.Label l : m.getLabels()) {
                    if (l == null) continue;
                    uniq.put(l.getId(), l); // keep unique by id
                    refs.add(new MailLabelCrossRef(m.getId(), l.getId()));
                }
            }
        }

        // upsert labels **BEFORE** cross refs (this prevents a crash don't touch!)
        List<LabelEntity> labelEntities = LabelMappers.toEntities(new ArrayList<>(uniq.values()));
        localData.upsertLabels(labelEntities);
        // now it's safe to upsert mails + cross refs thank god
        localData.upsertMails(entities, refs);
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
        // fetch cached mails
        io.execute(() -> {
            List<MailEntity> cached = getLocalByType(inboxType);
            if (!cached.isEmpty()) {
                localData.touchMails(idsOf(cached));  // also Room -> keep in background
                resultLiveData.postValue(new Result.Success<>(mapLocalToListResponse(cached)));
            } else {
                if (NetworkUtil.isOnline(context))
                    resultLiveData.postValue(new Result.Loading<>());
                else
                    resultLiveData.postValue(new Result.Success<>(
                            mapLocalToListResponse(Collections.emptyList())));
            }
        });
        // skip if not connected to internet
        if (!NetworkUtil.isOnline(context))
            return;
        // attempt calling the backend
        mailApi.getMailsByType(inboxType, page, MAIL_LIMIT).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<MailListResponse> call, @NonNull Response<MailListResponse> resp) {
                if (!resp.isSuccessful() || resp.body() == null) {
                    // we already emitted cache - only error if there was none
                    io.execute(() -> {
                        if (getLocalByType(inboxType).isEmpty())
                            resultLiveData.postValue(new Result.Error<>("Error: " + resp.code()));
                    });
                    return;
                }
                // Room writes/reads off main
                io.execute(() -> {
                    upsertServerMails(resp.body().getMails());
                    List<MailEntity> now = getLocalByType(inboxType);
                    localData.touchMails(idsOf(now));
                    resultLiveData.postValue(new Result.Success<>(mapLocalToListResponse(now)));
                });
            }

            @Override
            public void onFailure(@NonNull Call<MailListResponse> call, @NonNull Throwable t) {
                io.execute(() -> {
                    if (getLocalByType(inboxType).isEmpty()) {
                        resultLiveData.postValue(new Result.Error<>(t.getMessage()));
                    }
                });
            }
        });
    }

    /**
     * Fetch mails by label ID.
     *
     * @param labelId        the label ID to filter by
     * @param page           page number (for pagination)
     * @param resultLiveData LiveData object to observe result
     */
    public void getMailsByLabel(int labelId, int page, MutableLiveData<Result<MailListResponse>> resultLiveData) {
        final int MAIL_LIMIT = 50;
        // cache first
        io.execute(() -> {
            List<MailEntity> cached = localData.getByLabel(labelId);
            if (!cached.isEmpty()) {
                localData.touchMails(idsOf(cached));
                resultLiveData.postValue(new Result.Success<>(mapLocalToListResponse(cached)));
            } else {
                if (NetworkUtil.isOnline(context))
                    resultLiveData.postValue(new Result.Loading<>());
                else
                    resultLiveData.postValue(new Result.Loading<>());
            }
        });
        // skip if not connected to internet
        if (!NetworkUtil.isOnline(context))
            return;
        // attempt calling the backend
        mailApi.getMailsByLabel(labelId, page, MAIL_LIMIT).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<MailListResponse> call, @NonNull Response<MailListResponse> resp) {
                if (!resp.isSuccessful() || resp.body() == null) {
                    io.execute(() -> {
                        if (localData.getByLabel(labelId).isEmpty())
                            resultLiveData.postValue(new Result.Error<>("Error: " + resp.code()));
                    });
                    return;
                }
                io.execute(() -> {
                    upsertServerMails(resp.body().getMails());
                    List<MailEntity> now = localData.getByLabel(labelId);
                    localData.touchMails(idsOf(now));
                    resultLiveData.postValue(new Result.Success<>(mapLocalToListResponse(now)));
                });
            }

            @Override
            public void onFailure(@NonNull Call<MailListResponse> call, @NonNull Throwable t) {
                io.execute(() -> {
                    if (localData.getByLabel(labelId).isEmpty())
                        resultLiveData.postValue(new Result.Error<>(t.getMessage()));
                });
            }
        });
    }

    /**
     * Fetch a mail by it's id.
     *
     * @param id             id of the mail
     * @param resultLiveData a LiveData object to observe result (mail object)
     */
    public void fetchMail(int id, MutableLiveData<Result<Mail>> resultLiveData) {
        // show cached if available (instant open offline)
        io.execute(() -> {
            MailEntity cached = localData.getById(id);
            if (cached != null) {
                localData.touchMails(java.util.Collections.singletonList(id));
                List<MailEntity> single = new ArrayList<>();
                single.add(cached);
                List<Mail> mails = mapEntitiesToNetwork(single);
                resultLiveData.postValue(new Result.Success<>(mails.get(0)));
            } else {
                resultLiveData.postValue(new Result.Loading<>());
            }
        });
        // skip if not connected to internet
        if (!NetworkUtil.isOnline(context))
            return;
        // then try network to refresh
        mailApi.fetchMail(id).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> response) {
                if (!response.isSuccessful() || response.body() == null) return;
                io.execute(() -> {
                    // keep cache fresh for the opened mail as well
                    List<Mail> list = new ArrayList<>();
                    list.add(response.body());
                    upsertServerMails(list);
                    MailEntity fresh = localData.getById(id);
                    if (fresh != null) {
                        List<MailEntity> single = new ArrayList<>();
                        single.add(fresh);
                        List<Mail> mails = mapEntitiesToNetwork(single);
                        resultLiveData.postValue(new Result.Success<>(mails.get(0)));
                    }
                });
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                // ignore here; cached value already shown (or Loading posted)
            }
        });
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
     *
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

    /**
     * Sends a specific mail to other users
     *
     * @param req    request object containing mail's data to be sent
     * @param result result live data to observe success or error
     */
    public void sendMail(SendMailRequest req, MutableLiveData<Result<Void>> result) {
        result.postValue(new Result.Loading<>());
        mailApi.sendMail(req).enqueue(createCallback(result));
    }

    /**
     * Updates a specific draft
     *
     * @param mailId id of the draft we edited
     * @param req    request object containing all data to edit
     * @param result result live data to observe success or error
     */
    public void updateDraft(int mailId, SendMailRequest req, MutableLiveData<Result<Void>> result) {
        result.postValue(new Result.Loading<>());
        mailApi.updateDraft(mailId, req).enqueue(createCallback(result));
    }

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
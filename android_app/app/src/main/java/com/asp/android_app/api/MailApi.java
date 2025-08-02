package com.asp.android_app.api;

import com.asp.android_app.model.Mail;
import com.asp.android_app.model.request.EditMailRequest;
import com.asp.android_app.model.request.SpamRequest;
import com.asp.android_app.model.response.MailListResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * MailApi defines the REST API endpoints related to mail operations.
 * These match the backend's `/mails` and `/blacklist` routes.
 * All calls expect a valid JWT token in the Authorization header.
 */
public interface MailApi {

    @GET("mails/{id}")
    Call<Mail> fetchMail(@Path("id") int id);

    @GET("mails")
    Call<MailListResponse> getMailsByType(
            @Query("inboxType") String inboxType,
            @Query("page") int page,
            @Query("limit") int limit
    );

    @GET("mails")
    Call<MailListResponse> getMailsByLabel(
            @Query("label") int labelId,
            @Query("page") int page,
            @Query("limit") int limit
    );
    
    @PATCH("mails/{id}")
    Call<Void> editMail(@Path("id") int mailId, @Body EditMailRequest request);

    @DELETE("mails/{id}")
    Call<Void> deleteMail(@Path("id") int id);

    @POST("blacklist/")
    Call<Void> markAsSpam(@Body SpamRequest spamRequest);

    @HTTP(method = "DELETE", path = "blacklist/", hasBody = true)
    Call<Void> removeFromSpam(@Body SpamRequest spamRequest);

    @GET("mails/search/{query}")
    Call<List<Mail>> searchMails(@Path("query") String query);

}

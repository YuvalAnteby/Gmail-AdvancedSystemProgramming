package com.asp.android_app.api;


import com.asp.android_app.model.User;
import com.asp.android_app.model.request.LoginRequest;
import com.asp.android_app.model.request.ProfileImageRequest;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.model.response.UserSearchResult;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * UserApi defines the REST API endpoints for user authentication and profile management.
 * These match the backend's `/users` and `/tokens` routes.
 * Most calls require either a Bearer token or a `user-id` header, depending on server expectations.
 */
public interface UserApi {

    @POST("users")
    Call<AuthResponse> register(@Body User user);

    @POST("tokens")
    Call<AuthResponse> login(@Body LoginRequest loginRequest);

    @GET("users/search")
    Call<List<UserSearchResult>> searchByEmail(@Query("email") String query);

    @GET("users/{id}")
    Call<UserInfo> fetchUserInfo(@Path("id") int userId);

    @PATCH("users/{id}")
    Call<UserInfo> changeProfileImage(@Path("id") int userId, @Body ProfileImageRequest body);
}
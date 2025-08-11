package com.asp.android_app.repository;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.api.ApiClient;
import com.asp.android_app.api.UserApi;
import com.asp.android_app.model.User;
import com.asp.android_app.model.request.LoginRequest;
import com.asp.android_app.model.request.ProfileImageRequest;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.model.response.UserSearchResult;
import com.asp.android_app.utils.Result;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository class for user related operations such as login, registration, and profile fetch.
 */
public class UserRepository {

    private final UserApi userApi;

    public UserRepository(Context context) {
        userApi = ApiClient.getClient(context).create(UserApi.class);
    }

    public void login(LoginRequest request, MutableLiveData<Result<AuthResponse>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        userApi.login(request).enqueue(createCallback(resultLiveData));
    }

    public void register(User user, MutableLiveData<Result<AuthResponse>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        userApi.register(user).enqueue(createCallback(resultLiveData));
    }

    public void validateToken(MutableLiveData<Result<AuthResponse>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        userApi.validateToken().enqueue(createCallback(resultLiveData));
    }

    public void fetchUserInfo(int userId, MutableLiveData<Result<UserInfo>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        userApi.fetchUserInfo(userId).enqueue(createCallback(resultLiveData));
    }

    public void changeProfileImage(int userId, ProfileImageRequest request,
                                   MutableLiveData<Result<UserInfo>> resultLiveData) {
        resultLiveData.postValue(new Result.Loading<>());
        userApi.changeProfileImage(userId, request).enqueue(createCallback(resultLiveData));
    }

    public void searchUsers(String q, MutableLiveData<Result<List<UserSearchResult>>> result) {
        result.postValue(new Result.Loading<>());
        userApi.searchByEmail(q).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<UserSearchResult>> call, @NonNull Response<List<UserSearchResult>> resp) {
                if (resp.isSuccessful()) result.postValue(new Result.Success<>(resp.body()));
                else result.postValue(new Result.Error<>("Search error: " + resp.code()));
            }

            @Override
            public void onFailure(@NonNull Call<List<UserSearchResult>> call, @NonNull Throwable t) {
                result.postValue(new Result.Error<>(t.getMessage()));
            }
        });
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
package com.asp.android_app.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.asp.android_app.model.User;
import com.asp.android_app.model.request.LoginRequest;
import com.asp.android_app.model.request.ProfileImageRequest;
import com.asp.android_app.model.response.AuthResponse;
import com.asp.android_app.model.response.UserInfo;
import com.asp.android_app.repository.UserRepository;
import com.asp.android_app.utils.Result;

/**
 * ViewModel class for handling user authentication and profile management.
 */
public class UserViewModel extends AndroidViewModel {

    private final UserRepository userRepository;

    private final MutableLiveData<Result<AuthResponse>> authResult = new MutableLiveData<>();
    private final MutableLiveData<Result<UserInfo>> userInfoResult = new MutableLiveData<>();


    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application.getApplicationContext());
    }

    public LiveData<Result<AuthResponse>> getAuthResult() {
        return authResult;
    }

    public LiveData<Result<UserInfo>> getUserInfoResult() {
        return userInfoResult;
    }

    public void login(LoginRequest request) {
        userRepository.login(request, authResult);
    }

    public void register(User user) {
        userRepository.register(user, authResult);
    }

    public void validateToken() {
        userRepository.validateToken(authResult);
    }

    public void fetchUserInfo(int userId) {
        userRepository.fetchUserInfo(userId, userInfoResult);
    }


    public void changeProfileImage(int userId, ProfileImageRequest request) {
        userRepository.changeProfileImage(userId, request, userInfoResult);
    }

    public LiveData<Result<UserInfo>> getImageUpdateStatus() {
        return userInfoResult;
    }
}
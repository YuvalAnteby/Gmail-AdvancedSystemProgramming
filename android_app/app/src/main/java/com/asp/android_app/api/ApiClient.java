package com.asp.android_app.api;

import android.content.Context;

import com.asp.android_app.BuildConfig;
import com.asp.android_app.utils.TokenManager;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Singleton class responsible for providing a configured Retrofit instance.
 * - Uses `http://10.0.2.2:3001/api/` as the base URL (emulator-friendly localhost)
 * - Automatically adds a Bearer token to all requests using an OkHttp interceptor
 * - Applies `GsonConverterFactory` to handle JSON serialization/deserialization
 */
public class ApiClient {
    private static final String BASE_URL = BuildConfig.API_BASE_URL;
    private static Retrofit retrofit = null;

    public static Retrofit getClient(Context context) {
        String token = TokenManager.getInstance(context).getToken();
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(chain -> {
                    Request original = chain.request();
                    Request.Builder requestBuilder = original.newBuilder();
                    // Add token Authorization only if token exists and isn't empty
                    if (token != null && !token.isBlank())
                            requestBuilder.header("Authorization", "Bearer " + token);
                    // add the request's body
                    requestBuilder.method(original.method(), original.body());
                    return chain.proceed(requestBuilder.build());
                }).build();

        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}

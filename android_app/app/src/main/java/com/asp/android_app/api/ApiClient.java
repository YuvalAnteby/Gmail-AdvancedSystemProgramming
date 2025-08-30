package com.asp.android_app.api;

import android.content.Context;
import android.content.Intent;

import com.asp.android_app.BuildConfig;
import com.asp.android_app.ui.auth_activity.AuthActivity;
import com.asp.android_app.utils.TokenManager;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
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
    private static Context appContext = null;

    public static Retrofit getClient(Context context) {
        if (appContext == null) {
            appContext = context.getApplicationContext();
        }

        if (retrofit == null) {
            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(chain -> {
                        Request original = chain.request();
                        Request.Builder requestBuilder = original.newBuilder();
                        // Get token fresh for each request
                        TokenManager tokenManager = TokenManager.getInstance(appContext);
                        String token = tokenManager.getToken();
                        // Add token Authorization only if token exists, isn't empty and isn't expired
                        if (token != null && !token.isBlank())
                            requestBuilder.header("Authorization", "Bearer " + token);

                        // add the request's body
                        requestBuilder.method(original.method(), original.body());
                        Response response = chain.proceed(requestBuilder.build());

                        // check if the response includes unauthorized
                        String bodyStr = response.peekBody(Long.MAX_VALUE).string();
                        if (isTokenUnauthorized(bodyStr)) {
                            response.close();
                            tokenManager.clearToken();
                            tokenManager.clearUser();
                            moveToLogin(appContext);
                        }
                        return response;
                    }).build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    /**
     * @param bodyStr response body as a string
     * @return true if includes an error message from the backend of invalid/expired/missing token,
     * otherwise false
     */
    private static boolean isTokenUnauthorized(String bodyStr) {
        return bodyStr.contains("\"error\":\"Invalid or expired token\"") ||
                bodyStr.contains("\"error\":\"Authorization header missing\"");
    }

    /**
     * Navigates the user to the login page (in case of unAuthorised request to server)
     *
     * @param context app context
     */
    private static void moveToLogin(Context context) {
        Intent i = new Intent(context, AuthActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(i);
    }
}
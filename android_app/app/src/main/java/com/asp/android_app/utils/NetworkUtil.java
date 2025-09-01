package com.asp.android_app.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.util.Log;

/**
 * Small helper to check if user's device currently has any network connection (wifi or cellular)
 */
public final class NetworkUtil {
    private NetworkUtil() {}

    /**
     * @return true if device currently has a network that can reach the internet.
     */
    public static boolean isOnline(Context ctx) {
        ConnectivityManager cm = (ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        Network active = cm.getActiveNetwork();
        Log.i("activeNetwork", "true");
        if (active == null) return false;
        NetworkCapabilities nc = cm.getNetworkCapabilities(active);
        Log.i("capableNetwork", "true");
        if (nc == null) return false;
        return nc.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                && (nc.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
                || nc.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
                || nc.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));
    }
}

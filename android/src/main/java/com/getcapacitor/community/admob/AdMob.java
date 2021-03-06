package com.getcapacitor.community.admob;

import android.Manifest;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.community.admob.executors.AdRewardExecutor;
import com.getcapacitor.community.admob.helpers.AdViewIdHelper;
import com.getcapacitor.community.admob.helpers.RequestHelper;
import com.getcapacitor.community.admob.models.AdOptions;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import org.json.JSONException;

@NativePlugin(permissions = { Manifest.permission.ACCESS_NETWORK_STATE, Manifest.permission.INTERNET })
public class AdMob extends Plugin {
    public static final JSArray EMPTY_TESTING_DEVICES = new JSArray();

    private AdRewardExecutor adRewardExecutor = new AdRewardExecutor(this::getContext, this::getActivity, getLogTag());
    private PluginCall call;
    private ViewGroup mViewGroup;
    private RelativeLayout mAdViewLayout;
    private AdView mAdView;
    private InterstitialAd mInterstitialAd;

    // Initialize AdMob with appId
    @PluginMethod
    public void initialize(final PluginCall call) {
        final boolean initializeForTesting = call.getBoolean("initializeForTesting", false);

        if (initializeForTesting) {
            JSArray testingDevices = call.getArray("testingDevices", AdMob.EMPTY_TESTING_DEVICES);
            this.setTestingDevicesTo(testingDevices);
        } else {
            this.setTestingDevicesTo(EMPTY_TESTING_DEVICES);
        }

        try {
            MobileAds.initialize(
                getContext(),
                new OnInitializationCompleteListener() {

                    @Override
                    public void onInitializationComplete(InitializationStatus initializationStatus) {}
                }
            );
            mViewGroup = (ViewGroup) ((ViewGroup) getActivity().findViewById(android.R.id.content)).getChildAt(0);
            call.success(new JSObject().put("value", true));
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    // Show a banner Ad
    @PluginMethod
    public void showBanner(final PluginCall call) {
        /**
         * TODO: Allow the user to manually reload the ad? (ignore mAdView != null)
         *  Why? Well the user could remove their personalized ads consent and we need to update that!
         */
        if (mAdView != null) {
            return;
        }

        final AdOptions adOptions = AdOptions.getFactory().createBannerOptions(call);

        // Why a try catch block?
        try {
            mAdView = new AdView(getContext());
            mAdView.setAdSize(adOptions.adSize.size);

            // Setup AdView Layout
            mAdViewLayout = new RelativeLayout(getContext());
            mAdViewLayout.setHorizontalGravity(Gravity.CENTER_HORIZONTAL);
            mAdViewLayout.setVerticalGravity(Gravity.BOTTOM);

            final CoordinatorLayout.LayoutParams mAdViewLayoutParams = new CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.WRAP_CONTENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT
            );

            // TODO: Make an enum like the AdSizeEnum?
            switch (adOptions.position) {
                case "TOP_CENTER":
                    mAdViewLayoutParams.gravity = Gravity.TOP;
                    break;
                case "CENTER":
                    mAdViewLayoutParams.gravity = Gravity.CENTER;
                    break;
                default:
                    mAdViewLayoutParams.gravity = Gravity.BOTTOM;
                    break;
            }

            mAdViewLayout.setLayoutParams(mAdViewLayoutParams);

            float density = getContext().getResources().getDisplayMetrics().density;
            int densityMargin = (int) (adOptions.margin * density);
            mAdViewLayoutParams.setMargins(0, densityMargin, 0, densityMargin);

            // Run AdMob In Main UI Thread
            getActivity()
                .runOnUiThread(
                    new Runnable() {

                        @Override
                        public void run() {
                            final AdRequest adRequest = RequestHelper.createRequest(adOptions);
                            // Assign the correct id needed
                            AdViewIdHelper.assignIdToAdView(mAdView, adOptions, adRequest, getLogTag(), getContext());
                            // Add the AdView to the view hierarchy.
                            mAdViewLayout.addView(mAdView);
                            // Start loading the ad.
                            mAdView.loadAd(adRequest);

                            mAdView.setAdListener(
                                new AdListener() {

                                    @Override
                                    public void onAdLoaded() {
                                        notifyListeners("onAdLoaded", new JSObject().put("value", true));

                                        JSObject ret = new JSObject();
                                        ret.put("width", mAdView.getAdSize().getWidth());
                                        ret.put("height", mAdView.getAdSize().getHeight());
                                        notifyListeners("onAdSize", ret);

                                        super.onAdLoaded();
                                    }

                                    @Override
                                    public void onAdFailedToLoad(int i) {
                                        notifyListeners("onAdFailedToLoad", new JSObject().put("errorCode", i));

                                        JSObject ret = new JSObject();
                                        ret.put("width", 0);
                                        ret.put("height", 0);
                                        notifyListeners("onAdSize", ret);

                                        super.onAdFailedToLoad(i);
                                    }

                                    @Override
                                    public void onAdOpened() {
                                        notifyListeners("onAdOpened", new JSObject().put("value", true));
                                        super.onAdOpened();
                                    }

                                    @Override
                                    public void onAdClosed() {
                                        notifyListeners("onAdClosed", new JSObject().put("value", true));
                                        super.onAdClosed();
                                    }
                                }
                            );

                            // Add AdViewLayout top of the WebView
                            mViewGroup.addView(mAdViewLayout);
                        }
                    }
                );

            call.success(new JSObject().put("value", true));
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    // Hide the banner, remove it from screen, but can show it later
    @PluginMethod
    public void hideBanner(final PluginCall call) {
        try {
            getActivity()
                .runOnUiThread(
                    new Runnable() {

                        @Override
                        public void run() {
                            if (mAdViewLayout != null) {
                                mAdViewLayout.setVisibility(View.GONE);
                                mAdView.pause();
                            }
                        }
                    }
                );

            JSObject ret = new JSObject();
            ret.put("width", 0);
            ret.put("height", 0);
            notifyListeners("onAdSize", ret);

            call.success(new JSObject().put("value", true));
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    // Resume the banner, show it after hide
    @PluginMethod
    public void resumeBanner(final PluginCall call) {
        try {
            getActivity()
                .runOnUiThread(
                    new Runnable() {

                        @Override
                        public void run() {
                            if (mAdViewLayout != null && mAdView != null) {
                                mAdViewLayout.setVisibility(View.VISIBLE);
                                mAdView.resume();

                                JSObject ret = new JSObject();
                                ret.put("width", mAdView.getAdSize().getWidth());
                                ret.put("height", mAdView.getAdSize().getHeight());
                                notifyListeners("onAdSize", ret);

                                Log.d(getLogTag(), "Banner AD Resumed");
                            }
                        }
                    }
                );

            call.success(new JSObject().put("value", true));
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    // Destroy the banner, remove it from screen.
    @PluginMethod
    public void removeBanner(final PluginCall call) {
        try {
            if (mAdView != null) {
                getActivity()
                    .runOnUiThread(
                        new Runnable() {

                            @Override
                            public void run() {
                                if (mAdView != null) {
                                    mViewGroup.removeView(mAdViewLayout);
                                    mAdViewLayout.removeView(mAdView);
                                    mAdView.destroy();
                                    mAdView = null;
                                    Log.d(getLogTag(), "Banner AD Removed");
                                }
                            }
                        }
                    );
            }

            call.success(new JSObject().put("value", true));
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    @PluginMethod
    public void prepareInterstitial(final PluginCall call) {
        final AdOptions adOptions = AdOptions.getFactory().createInterstitialOptions(call);

        // This is never read, why is saved?
        this.call = call;

        try {
            mInterstitialAd = new InterstitialAd(getContext());

            getActivity()
                .runOnUiThread(
                    new Runnable() {

                        @Override
                        public void run() {
                            final AdRequest adRequest = RequestHelper.createRequest(adOptions);
                            AdViewIdHelper.assignIdToAdView(mInterstitialAd, adOptions, adRequest, getLogTag(), getContext());

                            mInterstitialAd.loadAd(adRequest);

                            mInterstitialAd.setAdListener(
                                new AdListener() {

                                    @Override
                                    public void onAdLoaded() {
                                        // Code to be executed when an ad finishes loading.
                                        notifyListeners("onAdLoaded", new JSObject().put("value", true));
                                        call.success(new JSObject().put("value", true));
                                        super.onAdLoaded();
                                    }

                                    @Override
                                    public void onAdFailedToLoad(int errorCode) {
                                        // Code to be executed when an ad request fails.
                                        notifyListeners("onAdFailedToLoad", new JSObject().put("errorCode", errorCode));
                                        super.onAdFailedToLoad(errorCode);
                                    }

                                    @Override
                                    public void onAdOpened() {
                                        // Code to be executed when the ad is displayed.
                                        notifyListeners("onAdOpened", new JSObject().put("value", true));
                                        super.onAdOpened();
                                    }

                                    @Override
                                    public void onAdLeftApplication() {
                                        // Code to be executed when the user has left the app.
                                        notifyListeners("onAdLeftApplication", new JSObject().put("value", true));
                                        super.onAdLeftApplication();
                                    }

                                    @Override
                                    public void onAdClosed() {
                                        // Code to be executed when when the interstitial ad is closed.
                                        notifyListeners("onAdClosed", new JSObject().put("value", true));
                                        super.onAdClosed();
                                    }
                                }
                            );
                        }
                    }
                );
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    // Show interstitial Ad
    @PluginMethod
    public void showInterstitial(final PluginCall call) {
        try {
            getActivity()
                .runOnUiThread(
                    new Runnable() {

                        @Override
                        public void run() {
                            if (mInterstitialAd != null && mInterstitialAd.isLoaded()) {
                                getActivity()
                                    .runOnUiThread(
                                        new Runnable() {

                                            @Override
                                            public void run() {
                                                mInterstitialAd.show();
                                            }
                                        }
                                    );
                                call.success(new JSObject().put("value", true));
                            } else {
                                call.error("The interstitial wasn't loaded yet.");
                            }
                        }
                    }
                );
        } catch (Exception ex) {
            call.error(ex.getLocalizedMessage(), ex);
        }
    }

    @PluginMethod
    public void prepareRewardVideoAd(final PluginCall call) {
        adRewardExecutor.prepareRewardVideoAd(call, this::notifyListeners);
    }

    @PluginMethod
    public void showRewardVideoAd(final PluginCall call) {
        adRewardExecutor.showRewardVideoAd(call);
    }

    @PluginMethod
    public void pauseRewardedVideo(final PluginCall call) {
        adRewardExecutor.pauseRewardedVideo(call);
    }

    @PluginMethod
    public void resumeRewardedVideo(final PluginCall call) {
        adRewardExecutor.resumeRewardedVideo(call);
    }

    @PluginMethod
    public void stopRewardedVideo(final PluginCall call) {
        adRewardExecutor.destroyRewardedVideo(call);
    }

    /**
     * An Array of devices IDs that will be marked as tested devices.
     *
     * @see <a href="https://developers.google.com/admob/android/test-ads#enable_test_devices">Test Devices</a>
     */
    private void setTestingDevicesTo(JSArray testingDevices) {
        // TODO: create a function to automatically get the device ID when isTesting is true? https://stackoverflow.com/a/36242494/1255819
        try {
            final RequestConfiguration configuration = new RequestConfiguration.Builder()
                .setTestDeviceIds(testingDevices.<String>toList())
                .build();

            MobileAds.setRequestConfiguration(configuration);
        } catch (JSONException error) {
            call.error(error.toString());
        }
    }
}

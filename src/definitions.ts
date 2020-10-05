import { PluginListenerHandle } from '@capacitor/core';

declare global {
  interface PluginRegistry {
    AdMob?: AdMobPlugin;
  }
}

export interface AdMobPlugin {
  /**
   * Initialize AdMob with AdMobInitializationOptions
   *
   * @group Initialize
   * @param options AdMobInitializationOptions
   * @since 1.1.2
   */
  initialize(options: AdMobInitializationOptions): Promise<{ value: boolean }>;

  /**
   * Show a banner Ad
   *
   * @group Banner
   * @param options AdOptions
   * @since 1.1.2
   */
  showBanner(options: AdOptions): Promise<{ value: boolean }>;

  /**
   * Hide the banner, remove it from screen, but can show it later
   *
   * @group Banner
   * @since 1.1.2
   */
  hideBanner(): Promise<{ value: boolean }>;

  /**
   * Resume the banner, show it after hide
   *
   * @group Banner
   * @since 1.1.2
   */
  resumeBanner(): Promise<{ value: boolean }>;

  /**
   * Destroy the banner, remove it from screen.
   *
   * @group Banner
   * @since 1.1.2
   */
  removeBanner(): Promise<{ value: boolean }>;

  /**
   * Prepare interstitial banner
   *
   * @group Interstitial
   * @param options AdOptions
   * @since 1.1.2
   */
  prepareInterstitial(options: AdOptions): Promise<{ value: boolean }>;

  /**
   * Show interstitial ad when it’s ready
   *
   * @group Interstitial
   * @since 1.1.2
   */
  showInterstitial(): Promise<{ value: boolean }>;

  /**
   * Prepare a reward video ad
   *
   * @group RewardVideo
   * @param options AdOptions
   * @since 1.1.2
   */
  prepareRewardVideoAd(options: AdOptions): Promise<{ value: boolean }>;

  /**
   * Show a reward video ad
   *
   * @group RewardVideo
   * @since 1.1.2
   */
  showRewardVideoAd(): Promise<{ value: boolean }>;

  /**
   * Pause RewardedVideo
   *
   * @group RewardVideo
   * @since 1.1.2
   */
  pauseRewardedVideo(): Promise<{ value: boolean }>;

  /**
   * Resume RewardedVideo
   *
   * @group RewardVideo
   * @since 1.1.2
   */
  resumeRewardedVideo(): Promise<{ value: boolean }>;

  /**
   * Close RewardedVideo
   *
   * @group RewardVideo
   * @since 1.1.2
   */
  stopRewardedVideo(): Promise<{ value: boolean }>;

  /**
   * Notice: banner ad is loaded(android)
   *
   * @group Banner
   * @param eventName onAdLoaded
   * @param listenerFunc
   */
  addListener(
    eventName: 'onAdLoaded',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: failed to load Banner ad(android)
   *
   * @group Banner
   * @param eventName onAdFailedToLoad
   * @param listenerFunc
   */
  addListener(
    eventName: 'onAdFailedToLoad',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: banner ad is show(android)
   *
   * @group Banner
   * @param eventName onAdOpened
   * @param listenerFunc
   */
  addListener(
    eventName: 'onAdOpened',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Banner ad is closed(android)
   *
   * @group Banner
   * @param eventName onAdClosed
   * @param listenerFunc
   */
  addListener(
    eventName: 'onAdClosed',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: request loaded Banner ad(iOS)
   *
   * @group Banner
   * @param eventName adViewDidReceiveAd
   * @param listenerFunc
   */
  addListener(
    eventName: 'adViewDidReceiveAd',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: request failed Banner ad(iOS)
   *
   * @group Banner
   * @param eventName adView:didFailToReceiveAdWithError
   * @param listenerFunc
   */
  addListener(
    eventName: 'adView:didFailToReceiveAdWithError',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: full-screen view will be presented in response to the user clicking on an ad.(iOS)
   *
   * @group Banner
   * @param eventName adViewWillPresentScreen
   * @param listenerFunc
   */
  addListener(
    eventName: 'adViewWillPresentScreen',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: The full-screen view will be dismissed.(iOS)
   *
   * @group Banner
   * @param eventName adViewWillDismissScreen
   * @param listenerFunc
   */
  addListener(
    eventName: 'adViewWillDismissScreen',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: The full-screen view has been dismissed.(iOS)
   *
   * @group Banner
   * @param eventName adViewDidDismissScreen
   * @param listenerFunc
   */
  addListener(
    eventName: 'adViewDidDismissScreen',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: User click will open another app.(iOS)
   *
   * @group Banner
   * @param eventName adViewWillLeaveApplication
   * @param listenerFunc
   */
  addListener(
    eventName: 'adViewWillLeaveApplication',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Interstitial ad loaded
   *
   * @group Interstitial
   * @param eventName onInterstitialAdLoaded
   * @param listenerFunc
   */
  addListener(
    eventName: 'onInterstitialAdLoaded',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Failed to load Interstitial ad
   *
   * @group Interstitial
   * @param eventName onInterstitialAdFailedToLoad
   * @param listenerFunc
   */
  addListener(
    eventName: 'onInterstitialAdFailedToLoad',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Interstitial ad opened
   *
   * @group Interstitial
   * @param eventName onInterstitialAdOpened
   * @param listenerFunc
   */
  addListener(
    eventName: 'onInterstitialAdOpened',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Interstitial ad closed
   *
   * @group Interstitial
   * @param eventName onInterstitialAdClosed
   * @param listenerFunc
   */
  addListener(
    eventName: 'onInterstitialAdClosed',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Click link of Interstitial ad
   *
   * @group Interstitial
   * @param eventName onInterstitialAdLeftApplication
   * @param listenerFunc
   */
  addListener(
    eventName: 'onInterstitialAdLeftApplication',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Prepared RewardedVideo
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdLoaded
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoAdLoaded',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: RewardedVideo is opened
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdOpened
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoAdOpened',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: RewardedVideo go to background(Android)
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdOpened
   * @param listenerFunc
   */
  addListener(
    eventName: 'onAdLeftApplication',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: RewardedVideo is started
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoStarted
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoStarted',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: RewardedVideo is closed
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdClosed
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoAdClosed',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: User get reward by RewardedVideo
   *
   * @group RewardedVideo
   * @param eventName onRewarded
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewarded',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: click link of RewardedVideo ad
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdLeftApplication
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoAdLeftApplication',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Failed to load RewardVideo ad
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoAdFailedToLoad
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoAdFailedToLoad',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;

  /**
   * Notice: Watch RewardVideo complete
   *
   * @group RewardedVideo
   * @param eventName onRewardedVideoCompleted
   * @param listenerFunc
   */
  addListener(
    eventName: 'onRewardedVideoCompleted',
    listenerFunc: (info: any) => void,
  ): PluginListenerHandle;
}

export interface AdMobInitializationOptions {
  /**
   * Use or not requestTrackingAuthorization in iOS(>14)
   * @see https://developer.apple.com/documentation/apptrackingtransparency/attrackingmanager/3547037-requesttrackingauthorization?changes=latest_minor
   */
  requestTrackingAuthorization?: boolean;
  /**
   * An Array of devices IDs that will be marked as tested devices if {@link AdMobInitializationOptions.initializeForTesting} is true
   * (Real Ads will be served to Testing devices but they will not count as 'real').
   * @see https://developers.google.com/admob/android/test-ads#enable_test_devices
   */
  testingDevices?: string[];
  /**
   * If set to true, the devices on {@link AdMobInitializationOptions.testingDevices} will
   * be registered to receive test production ads.
   * @see AdMobInitializationOptions.testingDevices
   */
  initializeForTesting?: boolean;
}

export interface AdOptions {
  /**
   * The ad unit ID that you want to request
   * @see https://support.google.com/admob/answer/7356431?hl=en
   */
  adId: string;
  /**
   * Banner Ad Size, defaults to SMART_BANNER.
   * IT can be: SMART_BANNER, BANNER, MEDIUM_RECTANGLE,
   * FULL_BANNER, LEADERBOARD, SKYSCRAPER, or CUSTOM
   */
  adSize?: AdSize;
  position?: AdPosition;
  isTesting?: boolean;

  /**
   * Margin Banner. Default is 0 px;
   * If position is BOTTOM_CENTER, margin is be margin-bottom.
   * If position is TOP_CENTER, margin is be margin-top.
   */
  margin?: number;

  /**
   * The default behavior of the Google Mobile Ads SDK is to serve personalized ads.
   * Set this to true to request Non-Personalized Ads
   * @see https://developers.google.com/admob/android/eu-consent
   * @default false
   */
  npa?: boolean;
}

/**
 *  For more information:
 *  https://developers.google.com/android/reference/com/google/android/gms/ads/AdSize
 * */
export enum AdSize {
  // Mobile Marketing Association (MMA)
  // banner ad size (320x50 density-independent pixels).
  BANNER = 'BANNER',

  // A dynamically sized banner that matches its parent's
  // width and expands/contracts its height to match the ad's
  // content after loading completes.
  FLUID = 'FLUID',

  //Interactive Advertising Bureau (IAB)
  // full banner ad size (468x60 density-independent pixels).
  FULL_BANNER = 'FULL_BANNER',

  // Large banner ad size (320x100 density-independent pixels).
  LARGE_BANNER = 'LARGE_BANNER',

  // Interactive Advertising Bureau (IAB)
  // leaderboard ad size (728x90 density-independent pixels).
  LEADERBOARD = 'LEADERBOARD',

  // Interactive Advertising Bureau (IAB)
  // medium rectangle ad size (300x250 density-independent pixels).
  MEDIUM_RECTANGLE = 'MEDIUM_RECTANGLE',

  // A dynamically sized banner that is full-width and auto-height.
  SMART_BANNER = 'SMART_BANNER',

  // To define a custom banner size, set your desired AdSize
  CUSTOM = 'CUSTOM',
}

/**
 *
 * More information
 * https://developer.android.com/reference/android/widget/LinearLayout#attr_android:gravity
 * */

export enum AdPosition {
  TOP_CENTER = 'TOP_CENTER',
  CENTER = 'CENTER',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
}

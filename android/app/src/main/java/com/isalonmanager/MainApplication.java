package com.isalonmanager;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCWebViewPackage(),
            new AsyncStoragePackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new SplashScreenReactPackage(),
            new ReactNativeOneSignalPackage(),
            new MapsPackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new PickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

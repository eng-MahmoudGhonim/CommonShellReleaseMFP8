cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-globalization.GlobalizationError",
      "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
      "pluginId": "cordova-plugin-globalization",
      "clobbers": [
        "window.GlobalizationError"
      ]
    },
    {
      "id": "cordova-plugin-globalization.globalization",
      "file": "plugins/cordova-plugin-globalization/www/globalization.js",
      "pluginId": "cordova-plugin-globalization",
      "clobbers": [
        "navigator.globalization"
      ]
    },
    {
      "id": "cordova-plugin-mfp.mfp",
      "file": "plugins/cordova-plugin-mfp/bootstrap.js",
      "pluginId": "cordova-plugin-mfp",
      "runs": true
    },
    {
      "id": "cordova-plugin-mfp-push.MFPPush",
      "file": "plugins/cordova-plugin-mfp-push/www/MFPPush.js",
      "pluginId": "cordova-plugin-mfp-push",
      "clobbers": [
        "MFPPush"
      ]
    },
    {
      "id": "cordova-plugin-network-information.network",
      "file": "plugins/cordova-plugin-network-information/www/network.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "navigator.connection",
        "navigator.network.connection"
      ]
    },
    {
      "id": "cordova-plugin-network-information.Connection",
      "file": "plugins/cordova-plugin-network-information/www/Connection.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "Connection"
      ]
    },
    {
      "id": "cordova-plugin-appavailability.AppAvailability",
      "file": "plugins/cordova-plugin-appavailability/www/AppAvailability.js",
      "pluginId": "cordova-plugin-appavailability",
      "clobbers": [
        "appAvailability"
      ]
    },
    {
      "id": "es6-promise-plugin.Promise",
      "file": "plugins/es6-promise-plugin/www/promise.js",
      "pluginId": "es6-promise-plugin",
      "runs": true
    },
    {
      "id": "cordova-plugin-x-socialsharing.SocialSharing",
      "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
      "pluginId": "cordova-plugin-x-socialsharing",
      "clobbers": [
        "window.plugins.socialsharing"
      ]
    },
    {
      "id": "cordova-plugin-tts.tts",
      "file": "plugins/cordova-plugin-tts/www/tts.js",
      "pluginId": "cordova-plugin-tts",
      "clobbers": [
        "TTS"
      ]
    },
    {
      "id": "cordova-plugin-touch-id.TouchID",
      "file": "plugins/cordova-plugin-touch-id/www/TouchID.js",
      "pluginId": "cordova-plugin-touch-id",
      "clobbers": [
        "window.plugins.touchid"
      ]
    },
    {
      "id": "cordova-plugin-speech-recognition-feat-siri.SpeechRecognitionFeatSiri",
      "file": "plugins/cordova-plugin-speech-recognition-feat-siri/www/SpeechRecognitionFeatSiri.js",
      "pluginId": "cordova-plugin-speech-recognition-feat-siri",
      "clobbers": [
        "SpeechRecognitionFeatSiri"
      ]
    },
    {
      "id": "com.telerik.plugins.nativepagetransitions.NativePageTransitions",
      "file": "plugins/com.telerik.plugins.nativepagetransitions/www/NativePageTransitions.js",
      "pluginId": "com.telerik.plugins.nativepagetransitions",
      "clobbers": [
        "window.plugins.nativepagetransitions"
      ]
    },
    {
      "id": "cordova-plugin-app-version.AppVersionPlugin",
      "file": "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
      "pluginId": "cordova-plugin-app-version",
      "clobbers": [
        "cordova.getAppVersion"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-plugin-globalization": "1.11.0",
    "cordova-plugin-mfp": "8.0.2020052505",
    "cordova-plugin-mfp-push": "8.0.2020052609",
    "cordova-plugin-network-information": "2.0.2",
    "cordova-plugin-appavailability": "0.4.2",
    "es6-promise-plugin": "4.2.2",
    "cordova-plugin-x-socialsharing": "5.6.8",
    "cordova-plugin-tts": "0.2.3",
    "cordova-plugin-touch-id": "3.3.1",
    "cordova-plugin-speech-recognition-feat-siri": "3.0.0",
    "com.telerik.plugins.nativepagetransitions": "0.6.5",
    "cordova-plugin-app-version": "0.1.9",
    "cordova-plugin-splashscreen": "5.0.4"
  };
});
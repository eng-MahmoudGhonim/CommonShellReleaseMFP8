
var Messages = {
  // Add here your messages for the default language.
  // Generate a similar file with a language suffix containing the translated messages.
  // key1 : message1,
};

var wlInitOptions = {
  // Options to initialize with the WL.Client object.
  // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};
var PinCodeChallengeHandler;

function wlCommonInit() {
  initEventListener();
  wlSuccessfullyInitialized();
  document.addEventListener("deviceready", onDeviceReady, false);

}

function onDeviceReady() {
    console.log("DeviceReady... "+device.cordova);
}


var app = {


}

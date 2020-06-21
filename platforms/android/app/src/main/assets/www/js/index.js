
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
  userLoginChallengeHandler=UserLoginChallengeHandler();
  WLAuthorizationManager.obtainAccessToken(userLoginChallengeHandler.securityCheckName).then(
     function (accessToken) {
         WL.Logger.debug("obtainAccessToken onSuccess");
   console.log("obtainAccessToken onSuccess" +JSON.stringify(accessToken));
     },
     function (response) {
   console.log("obtainAccessToken onFailure");
         WL.Logger.debug("obtainAccessToken onFailure: " + JSON.stringify(response));
   console.log("obtainAccessToken onFailure" +JSON.stringify(response));
   // showLoginDiv();
 });

//  app.init();
  //document.getElementById("getBalance").addEventListener("click", getBalance, false);
  //  PinCodeChallengeHandler();
  document.addEventListener("deviceready", onDeviceReady, false);

}

function onDeviceReady() {
    console.log("DeviceReady... "+device.cordova);
}
function getBalance() {
    var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance",WLResourceRequest.GET);

    resourceRequest.send().then(
        function(response) {
            WL.Logger.debug("resourceRequest.send success: " + response.responseText);
            document.getElementById("balanceLabel").innerHTML = response.responseText;
        },
        function(response) {
            WL.Logger.debug("resourceRequest.send failure: " + response.errorMsg);
            document.getElementById("balanceLabel").innerHTML = response.errorMsg;
        }
    );
}

var app = {
  //initialize app
  "init": function init() {
    var buttonElement = document.getElementById("ping_button");
    var dialogElement = document.getElementById("dilog_button");
	var confirmElement = document.getElementById("confirm_button");
	var promptElement = document.getElementById("prompt_button");
	var deviceDetailsElement= document.getElementById("device_button");
var networStatusElement= document.getElementById("network_status_button");

var adapterElement= document.getElementById("adapter_button");


    buttonElement.style.display = "block";
    dialogElement.addEventListener('click', app.showDialog, false);
    buttonElement.addEventListener('click', app.testServerConnection, false);
	confirmElement.addEventListener('click', app.showConfirm, false);
	promptElement.addEventListener('click', app.showPrompt, false);
	deviceDetailsElement.addEventListener('click', app.showDeviceDetails, false);
	networStatusElement.addEventListener('click', app.checkConnection, false);
	document.addEventListener("offline", app.onOffline, false);
	document.addEventListener("online", app.onLine, false);

	adapterElement.addEventListener('click', app.runAdapter, false);

},"runAdapter":function runAdapter() {




var resourceRequest = new WLResourceRequest(
    "/adapters/JavaScriptSOAP/getWeatherInfo",
    WLResourceRequest.GET
);

resourceRequest.setQueryParameter("params", "['Washington', 'United States']");

resourceRequest.send().then(
    function(response) {
        var $result = $(response.invocationResult.Envelope.Body.GetWeatherResponse.GetWeatherResult);
		var weatherInfo = {
			location: $result.find('Location').text(),
			time: $result.find('Time').text(),
			wind: $result.find('Wind').text(),
			temperature: $result.find('Temperature').text(),
		};
    },
    function() {
            alert("Failure: ERROR");

    }
)









	  /*
var request = new WLResourceRequest("/adapters/httpAdapter/getGhonim", WLResourceRequest.GET);
request.setQueryParameter("params", "['ghonimmmmmmmmmm','123']");
request.send().then(
     function(response) {
         // success flow, the result can be found in response.responseJSON
   alert("SUCCESS: " + JSON.stringify(response));
     },
     function(error) {
     alert("Failure: " + JSON.stringify(error));
         // failure flow
         // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
     }
);*/


  },"onOffline":function onOffline() {
          var titleText = document.getElementById("main_info");
			titleText.innerHTML = "check your connection plz";
			app.alertDismissed;
},"onLine":function onLine() {
          var titleText = document.getElementById("main_info");
			titleText.innerHTML = "you are online";




},
"checkConnection": function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
   // alert('Connection type: ' + states[networkState]);

	navigator.notification.alert(
        states[networkState],  // message
        app.alertDismissed,         // callback
        'netwokStatus',            // title
        'Done'                  // buttonName
    );
},
  "showDeviceDetails": function showDeviceDetails() {
      var titleText = document.getElementById("main_info");
    titleText.innerHTML = "Model:"+device.model+"\n"+
"Platform:"+device.platform+"\n"+
 "UUID:"+device.uuid+"\n"+
 "Version:"+device.version+"\n"+
 "Manufacturer:"+device.manufacturer+"\n"+
 "IsVirtual:"+device.isVirtual;
  }, "showDialog": function showDialog() {
      var titleText = document.getElementById("main_title");
    titleText.innerHTML = "TestDialog";
    navigator.notification.alert(
        'mobilefirst version 8',  // message
        app.alertDismissed,         // callback
        'version',            // title
        'Done'                  // buttonName
    );

  },  "alertDismissed": function alertDismissed() {
           navigator.notification.beep(1);

        },

"onConfirm": function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
},
"showConfirm": function showConfirm(buttonIndex) {
navigator.notification.confirm(
    'You are the winner!', // message
     app.onConfirm,            // callback to invoke with index of button pressed
    'Game Over',           // title
    ['Restart','Exit']     // buttonLabels
);
},

"onPrompt": function onPrompt(results) {
    alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
},


"showPrompt": function showPrompt(results) {
navigator.notification.prompt(
    'Please enter your name',  // message
    app.onPrompt,                  // callback to invoke
    'Registration',            // title
    ['Ok','Exit'],             // buttonLabels
    'name'                 // defaultText
);
},
  //test server connection
  "testServerConnection": function testServerConnection() {

    var titleText = document.getElementById("main_title");
    var statusText = document.getElementById("main_status");
    var infoText = document.getElementById("main_info");
    titleText.innerHTML = "Hello MobileFirst";
    statusText.innerHTML = "Connecting to Server...";
    infoText.innerHTML = "";
    WL.App.getServerUrl(function (url) {
      infoText.innerHTML = url;
    });
WLAuthorizationManager.obtainAccessToken()
    .then(
        function(accessToken) {
            titleText.innerHTML = "Yay!";
            statusText.innerHTML = "Connected to MobileFirst Server";

            var resourceRequest = new WLResourceRequest(
                "/adapters/javaAdapter/resource/greet/",
                WLResourceRequest.GET
            );

            resourceRequest.setQueryParameter("name", "world");
            resourceRequest.send().then(
                function(response) {
                    // Will display "Hello world" in an alert dialog.
                    alert("Success: " + response.responseText);
                },
                function(response) {
                    alert("Failure: " + JSON.stringify(response));
                }
            );
        },

        function(error) {
            titleText.innerHTML = "Bummer...";
            statusText.innerHTML = "Failed to connect to MobileFirst Server";
        }
    );
  }

}

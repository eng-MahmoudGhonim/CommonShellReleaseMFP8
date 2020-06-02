function wlSuccessfullyInitialized(){
	console.log("@@@@@@@@@"+WL.Client.getEnvironment());
if( WL.Client.getEnvironment() == WL.Environment.IPAD || WL.Client.getEnvironment() == WL.Environment.IPHONE ||  WL.Client.getEnvironment() == WL.Environment.ANDROID){
	var touchid = {
			isAvailable: function(successCallback, errorCallback){
				cordova.exec(successCallback, errorCallback, "TouchID", "isAvailable", []);
			},
			save: function(key,password, successCallback, errorCallback) {
				cordova.exec(successCallback, errorCallback, "TouchID", "save", [key,password]);
			},
			verify: function(key,message,successCallback, errorCallback){
				cordova.exec(successCallback, errorCallback, "TouchID", "verify", [key,message]);
			},
			has: function(key,successCallback, errorCallback){
				cordova.exec(successCallback, errorCallback, "TouchID", "has", [key]);
			},
			_delete: function(key,successCallback, errorCallback){
				cordova.exec(successCallback, errorCallback, "TouchID", "delete", [key]);
			},
			setLocale: function(locale,successCallback, errorCallback){
				cordova.exec(successCallback, errorCallback, "TouchID", "setLocale", [locale]);
			}
	};
	installTouchID = function () {
		if (!window.plugins) {
			window.plugins = {};
		}

		window.plugins.touchid = touchid;
		console.log("Touch Id Initialized");
		return window.plugins.touchid;
	};

	cordova.addConstructor(installTouchID);
}
}

(function(){
	'use strict';
	var GoogleAPIs = (function () {
		'use strict';
		// Instance stores a reference to the Singleton
		var instance;
		function init() {
			var getMobileOperatingSystem=function() {
				var userAgent = navigator.userAgent || navigator.vendor || window.opera;
				if (/android/i.test(userAgent)) {
					return "android";
				}
				if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
					return "iOS";
				}
				return "unknown";
			};
			var googleAPIs= ['Maps JavaScript API','Maps Static API','Places API','Directions API'];
			var appNames= ['SHELL','DNVAPP','CORPAPP','PTAPP'];
			var verifyGoogleAPI = function (googleAPI){
				if (googleAPIs.indexOf(googleAPI) > -1){
					return true;
				}else{
					return false;
				}
			}
			var verifyAPPName = function (appName){
				if (appNames.indexOf(appName) > -1){
					return true;
				}else{
					return false;
				}
			}
			var validateParams= function (appName,googleAPI){
				if(!verifyGoogleAPI(googleAPI)){return false;}
				if(!verifyAPPName(appName)){return false;}
				return true;
			};
			var generateMapsURL=function(appName,googleAPI, options, callback){
				try {
					if (!validateParams(appName,googleAPI)){
						callback( {"error":"please set appName and googleAPI with vaild values"})
					}
					var invocationData = {
							adapter: 'googleAPIAdapter',
							procedure: 'getAPIURL',
							parameters: [appName,getMobileOperatingSystem(),googleAPI,"",options],
							invocationContext: this
					};
					invokeWLResourceRequest(invocationData,
						function(result) {

							if(result&&result.invocationResult && result.invocationResult.url){
								callback(result.invocationResult.url);
							}else{
								var error= result.invocationResult.error || "Failed";
								callback( {"error":error});
							}

						},
						function(e) {
							console.warn(e);
							var error = e&&e.errorMsg?e.errorMsg : "Failure";
							callback({"error":error});
						}
					);
				}catch(e){
					var error = e&&e.errorMsg?e.errorMsg : "Failure";
					callback({"error":error});
				}
			}

			var getAPIURL = function (appName,googleAPI,query, options, callback){
				try {
					var invocationData = {
							adapter: 'googleAPIAdapter',
							procedure: 'getAPIURL',
							parameters: [appName,"IPRestrictedKey",googleAPI,query,options],
							invocationContext: this
					};
					invokeWLResourceRequest(invocationData,
						function(result) {
							callback(result.invocationResult.url);
						},
						function(e) {
							callback(false);

						}

					);
				}catch(e){callback(false);}
			}
			var destroyGoogleScripts = function (callback,trial){
				try {
					if (!trial)trial=0;
					if(trial >= 5) {
						callback();
						return;
					}
					var scripts = document.getElementsByTagName("script");
					var exists= false;
					for(var i = 0; i < scripts.length; i++) {
						if (scripts[i].src.match(/googleAPIs/)){
							continue;
						}
						if (scripts[i].src.match(/google/)) {
							exists=true;
							if( scripts[i].parentNode){
								scripts[i].parentNode.removeChild(scripts[i])
							}
						}
					}
					console.log("exists = " +exists);
					console.log("trial = " +trial);
					window.google.maps=undefined;
					window.google=undefined;

					if(exists==true){
						trial++;
						destroyGoogleScripts(callback,trial);
					}
					else{
						callback();
					}

				}catch(e){
					callback();
				}
			}

			return {
				generateMapsURL:generateMapsURL,
				getAPIURL:getAPIURL,
				destroyGoogleScripts:destroyGoogleScripts
			};

		};

		return {
			getInstance: function () {
				if ( !instance ) {
					instance = init();
				}
				return instance;
			}
		};
	})();
	window.GoogleAPIs = GoogleAPIs;
})();

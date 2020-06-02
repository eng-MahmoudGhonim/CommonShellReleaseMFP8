define(["backbone"], function(Backbone) {

	// The Model constructor
	var Constants = Backbone.Model.extend({},{
		/**
		 * APP_ID can take the following variables only
		 * 	RTA_Public_Transport,
		 * 	RTA_Corporate_Services,
		 * 	RTA_Drivers_And_Vehicles,
		 */

		APP_ID : "RTA_Drivers_And_Vehicles",
		showLoyalty:false,// show loyalty
		//UAEPASSBASEURL:"https://qa-id.uaepass.ae/trustedx-authserver/oauth/main-as",
		//UAEPASSRedirectURL:"https://mfp-staging.rta.ae:6443/UAEPassCallback/uaePassRedirect",//"https://mfp-staging.rta.ae:6443/oauthCallback/oauthCallback",
		MY_APPS_LINK : "shell/commonShellExamples.html",
		APP_URL_SCHEMA:"uaepassdemoapp",
		EnableSalik:true,
		CHAT_URL:"https://chat.rta.ae/RtaAppChat/web/livechat", // original one
//		CHAT_URL:"https://chat.rta.ae/rtachat2/web/livechat", // original one
		//CHAT_URL:"https://rtauedcpgdbuat/RtaAppChat/web/livechat", for testing
		//CHAT_URL:"http://rtauedcpgdbuat:8080/RtaAppChat/web/livechat", for testing

//		EN: https://chat.rta.ae/RtaAppChat/web/livechat?lang=en&name=Ahmed%20Mohamed&email=rtatestacc@gmail.com&phone=00971501234567&appname=dubaidrive&ver=6.5.1
		ButtonSheetProdURL:"https://m.rta.ae:443/MFPGatherContent/?serviceId=",//WE Need Change
		ButtonSheetDevURL:"https://mfp-staging.rta.ae:6443/MFPGatherContent/?serviceId=",

		PORTAL_APP_IDs: {
			RTA_Public_Transport:"PTAPP",
			RTA_Corporate_Services:"CORPAPP",
			RTA_Drivers_And_Vehicles:"DNVAPP",
		},
		HOMEPAGE_URL: "shell/dashboard.html",	//This will be used to set customized home location
		FOLDER_TEMPLATES : "templates/shell/",
		EXTENSION_TEMPLATES : ".handlebars",
		CACHED_DATA_EXPIRY_IN_MS : 86400000, // 1 day
		CLAIM_INDEX : "98924566",
		privacyVN:"1.0",
		termsVN:"1.1",
		TIPS:"shell2",	//change this token to show the tips pages
		SERVICE_MAPPING : {
			"172": {url: "shell/commonShellExamples.html", type: 0, visible: true, appName:'RTA_Public_Transport'},
			"171": {url: "shell/cssExamples.html", type: 0, visible: true, appName:'RTA_Public_Transport'},
			"173": {url: "shell/commonShellExamples.html", type: 1, visible: true, appName:'RTA_Public_Transport'},
		},
		/**** default settings ****/
		SETTINGS_DEFAULT_LANGUAGE : ("en"),
		BODY_CONTAINER_RTL_CLASS : "container-rtl",

		/**** resolution constants ****/
		RESOLUTION_PHONE : 480,
		RESOLUTION_TABLET : 767,
		RESOLUTION_DESKTOP : 1200,

		/**** events constants ****/
		EVENT_SETTINGS_UPDATE : "settingsupdate",
		EVENT_SIDEPANEL_OPENED : "sidePanelOpened",
		EVENT_SIDEPANEL_CLOSED : "sidePanelClosed"
	}
	);

	// Returns the Model class
	return Constants;

});

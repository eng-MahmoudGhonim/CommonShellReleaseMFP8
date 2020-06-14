define([ "backbone", "com/models/Constants", "com/utils/Utils",
         "com/utils/DataUtils", "com/models/shell/UserProfileModel", ],
         function(Backbone, Constants, Utils, DataUtils, UserProfileModel) {

	var HapinessMeterRatingModel = Backbone.Model.extend({}, {
		getHappinessMeterUrl : function(params, callBack) {
			var invocationData = {
					adapter : 'happinessMeterAdapterV2',
					procedure : 'getHappinessMeterUrl',
					parameters : [ params ]
			};

			invokeWLResourceRequest(invocationData,
				function(result) {
					if (result.invocationResult) {
						callBack("SUCCESS",result.invocationResult.url);
					} else {
						callBack("FAIL");
					}
					HapinessMeterRatingModel.transactionData = null;
				},
				function() {
					callBack("FAIL");
					HapinessMeterRatingModel.transactionData = null;
				}
			);
		},
		prepareHappinessParams : function() {
			var appName = Utils.getAppNameForHappinessMeter(Constants.APP_ID);
			var appURL = Utils.getAppStoreLink();
			var appThemeColor = Utils.getAppThemeColor();
			var appPlatform = Utils.getCurrentPlatform();
			var profile = UserProfileModel.getUserProfile();
			if(profile){
				profile = profile.Users[0];
				var appSource = "LOCAL";
				var name = profile.first_name_en + " " + profile.last_name_en;
				var email = profile.mail;
				var phone = profile.mobile;
			}else{
				var appSource = "ANONYMOUS";
				var name = "";
				var email = "";
				var phone = "";
			}
			return {
				"user": {
					"source": appSource,
					"username": name,
					"email": email,
					"mobile": phone
				},
				"header": {
					"themeColor": appThemeColor,
					"lang": getApplicationLanguage()
				},
				"application": {
					"applicationID": appName,
					"platform": appPlatform,
					"url": appURL,
          "version":Utils.APP_VERSION,//WL.Client.getAppProperty("APP_VERSION"),
					"type": "SMARTAPP"
				}
			};
		},
		prepareHappinessParamsForTransactionLevel : function() {
			var appName = Utils.getAppNameForHappinessMeter(Constants.APP_ID);
			var appURL = Utils.getAppStoreLink();
			var appThemeColor = Utils.getAppThemeColor();
			var appPlatform = Utils.getCurrentPlatform();
			var profile = UserProfileModel.getUserProfile();
			if(profile){
				profile = profile.Users[0];
				var appSource = "LOCAL";
				var name = profile.first_name_en + " " + profile.last_name_en;
				var email = profile.mail;
				var phone = profile.mobile;
			}else{
				var appSource = "ANONYMOUS";
				var name = "";
				var email = "";
				var phone = "";
			}
			return {
				"user": {
					"source": appSource,
					"username": name,
					"email": email,
					"mobile": phone
				},
				"header": {
					"themeColor": appThemeColor,
					"lang": getApplicationLanguage()
				}
			};
		},
		/*
		 * Modes: - Application - Service - Transaction
		 *
		 */
		showHappinessMeter : function(transactionData) {
			if(!transactionData){
				var params = HapinessMeterRatingModel.prepareHappinessParams();
				happinessOptions = {
						"user": params.user,
						"header": params.header
				}
				happinessOptions.application = params.application;
				if(HapinessMeterRatingModel.HappinessMode == "Service"){
					happinessOptions.header.microApp = HapinessMeterRatingModel.currentService.ServiceNameEn;
					if(getApplicationLanguage() == "en"){
						happinessOptions.header.mircoAppDisplay = HapinessMeterRatingModel.currentService.ServiceNameEn;
					}else{
						happinessOptions.header.mircoAppDisplay = HapinessMeterRatingModel.currentService.ServiceNameAr;
					}
				}
				HappinessMeter.show(function(callBack){
					HapinessMeterRatingModel.getHappinessMeterUrl(happinessOptions,callBack)
				});
			}else{
				var params = HapinessMeterRatingModel.prepareHappinessParamsForTransactionLevel();
				happinessOptions = {
						"user": params.user,
						"header": params.header,
						"transaction":HapinessMeterRatingModel.transactionData
				}
//				happinessOptions.application = params.application;

				if(HapinessMeterRatingModel.HappinessMode == "Service"){
					happinessOptions.header.microApp = HapinessMeterRatingModel.currentService.ServiceNameEn;
					if(getApplicationLanguage() == "en"){
						happinessOptions.header.mircoAppDisplay = HapinessMeterRatingModel.currentService.ServiceNameEn;
					}else{
						happinessOptions.header.mircoAppDisplay = HapinessMeterRatingModel.currentService.ServiceNameAr;
					}
				}
				HappinessMeter.show(function(callBack){
					HapinessMeterRatingModel.getHappinessMeterUrl(happinessOptions,callBack)
				});
			}
		},
		getPageHtmlName:function(url){
			var arr = url.split("/");
			var lastStng = arr[arr.length-1];
			var indx = lastStng.indexOf(".htm");
			var pageName = lastStng.substring(0,indx);
			return pageName;
		},
		setHappinessMode:function(url){
			try {
				var page = HapinessMeterRatingModel.getPageHtmlName(url);
				var found = false;
				for(var i=0;i<HapinessMeterRatingModel.CSPages.length;i++){
					if(HapinessMeterRatingModel.CSPages[i].indexOf(page) != -1){
						found = true;
						HapinessMeterRatingModel.HappinessMode = "Application";
						HapinessMeterRatingModel.currentService = null;
						break;
					}
				}
				if(!found){
					for(var i=0;i<HapinessMeterRatingModel.services.length;i++){
						if(HapinessMeterRatingModel.services[i].ServicePageUrl.indexOf(page) != -1){
							HapinessMeterRatingModel.HappinessMode = "Service";
							HapinessMeterRatingModel.currentService = HapinessMeterRatingModel.services[i];
							break;
						}
					}
				}
			}catch(e){}
		},
		initModel:function(){
			HapinessMeterRatingModel.services = [];
			for(var i=0;i< ServiceCategories.length;i++){
				HapinessMeterRatingModel.services =
					HapinessMeterRatingModel.services.concat(ServiceCategories[i].CategoryServices);
			}

			$.getJSON("common/data/commonShellServices.json", function (pages) {
				HapinessMeterRatingModel.CSPages = pages;
			});
		}
	});

	HapinessMeterRatingModel.HappinessMode = "Application";
	HapinessMeterRatingModel.transactionData = null;
	return HapinessMeterRatingModel;

});

define([
"jquery",
"backbone",
"com/utils/DataUtils"
], function($, Backbone, DataUtils) {
	var CustomerSupportCenterModel = Backbone.Model.extend({}, {
		getLocalizedInfoObject : function(centerAttributesObject){
			var language = getApplicationLanguage();
			var centerInfo ={};
			centerInfo.latitude = centerAttributesObject.LATITUDE;
			centerInfo.longitude = centerAttributesObject.LONGITUDE;
			centerInfo.centerName = centerAttributesObject.CENTER_NAME;
			centerInfo.serviceProvided = centerAttributesObject.SERVICES_PROVIDED;
			//centerInfo.category = centerAttributesObject.CATEGORY;
			centerInfo.location = centerAttributesObject.LOCATION;
			centerInfo.workingHours = centerAttributesObject.OPERATING_HOURS;
			centerInfo.phoneNumber = centerAttributesObject.TELEPHONE_NBR;
			if(getApplicationLanguage() == "ar"){
				centerInfo.centerName = centerAttributesObject.CENTER_NAME_AR;
				centerInfo.serviceProvided = centerAttributesObject.SERVICES_PROVIDED_AR;
				centerInfo.category = centerAttributesObject.CATEGORY_AR;
				centerInfo.location = centerAttributesObject.LOCATION_AR;
				centerInfo.workingHours = centerAttributesObject.OPERATING_HOURS_AR;
			}

			return centerInfo;
		},
		closeAllInfoWindows : function(infoWindows) {
			if(infoWindows.length != 0){
				for (var i=0;i<infoWindows.length;i++) {
					infoWindows[i].close();
				}
			}
		},
		getContactRTAData:function(callback){

//			read from cash first
			var cashedData = localStorage.getItem("shellContactRTA");
			if(cashedData != null){
				callback(JSON.parse(cashedData));

			}else{
				$.getJSON(window.mobile.baseUrl +"/common/data/contact_RTA_services.json",function(data){
					callback(data);
				},function(e){

				});
			}
			// get from the DB and update the local storage
			CustomerSupportCenterModel.getContactRTADataBE(function(data){
				if(data != null)
					localStorage.setItem("shellContactRTA",JSON.stringify(data));
			});
		},
		getContactRTADataBE:function(callback){
			var invocationData = {
					adapter : 'GIS_ContactRTAAdapter',
					procedure : 'getContactRTAData',
					parameters : []
			};

			invokeWLResourceRequest(invocationData,
				function(result){
					if(result && !result.error) {
						callback(result.invocationResult);
					}
					else {
						callback(null);
					}
				},
				function(result) {
					callback(null);
				}
			);
		},


		getTrustedAgents:function(callback){

			var invocationData = {
					adapter : 'GIS_ContactRTAAdapter',
					procedure : 'getTrustedAgents',
					parameters : []
			};

			invokeWLResourceRequest(invocationData,
				function(result){

					if(result && !result.error) {
						// Update Cashed Data
						localStorage.setItem("shellTrustedAgentsOpticals",JSON.stringify(result));
						callback(result.invocationResult);

					}
					else {
						callback(null);
					}
				},
				function(result) {
					callback(null);
				}
			);
		},


		getOpticiansFromLocalStorage:function(callBack){

			$.getJSON(window.mobile.baseUrl +"/common/data/TrustedAgents.json",function(data){

				callBack(data);
			},function(e){

			});
		},

		getCashedOpticals:function()
		{
			var cashedData=localStorage.getItem("shellTrustedAgentsOpticals");
			if(cashedData)
				return JSON.parse(cashedData);
		}



	});
	return CustomerSupportCenterModel;
});

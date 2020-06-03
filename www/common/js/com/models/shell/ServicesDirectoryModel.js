define([

        "jquery",
        "backbone",
        "underscore",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/Constants"

], function($, Backbone, underscore, Utils, DataUtils, Constants)
{
	var ServicesDirectoryModel = Backbone.Model.extend({},
	{
		/**
		 * This is our last option, we will load a locally stored file
		 * @param callback: function to be called passing list data
		 */
		_loadFallbackServiceList:function(callback, minimumInfo){
			if(minimumInfo){
				$.getJSON(window.mobile.baseUrl +"/common/data/services_list_min.json", callback);
			}
			else{
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_services_list.json", callback);
			}
		},

		/**
		 * Get all services, the function will check cache
		 * if found in cache and not expired then use the cached version
		 * otherwise try to load it from server
		 * if server failed go to fallback list
		 *
		 * @param callback: function to be called passing list data
		 */
		getAllServices:function(callback){

			//Check if services are cached and didn't expire
			var callbackCalled = false;
			var lastSaveDate = DataUtils.getLocalStorageData("rtaServicesLastSavedDate","shell");
			var savedAppVersion = DataUtils.getLocalStorageData("rtaServicesLastSavedAppVersion","shell");
			if(lastSaveDate && savedAppVersion && (savedAppVersion == WL.Client.getAppProperty(WL.AppProperty.APP_VERSION))){
				var myDate = new Date().getTime();
				if (myDate - parseInt(lastSaveDate) < Constants.CACHED_DATA_EXPIRY_IN_MS){
					var dataStr = DataUtils.getLocalStorageData("rtaServices","shell");
					try{
						var data = JSON.parse(dataStr);
						callback(data);
						callbackCalled = true;
					}
					catch(e){

					}
				}
			}

			if(!callbackCalled){
				this._loadFallbackServiceList(callback);

				//Load online version and keep in cache
				//Preparing adapter call
				var invocationData = {
						adapter : 'iDosServiceAdapter',
						procedure : 'getAllServices',
						parameters : [],
						compressResponse : true,
            invocationContext: this
				};

				//Calling adapter
				invokeWLResourceRequest(invocationData,{
					function(result){
						if(result.invocationResult.isSuccessful){
							var data = result.invocationResult;
							if(data && data.Envelope && data.Envelope.Body
									&& data.Envelope.Body.iDosService_Response
									&& data.Envelope.Body.iDosService_Response.services
									&& data.Envelope.Body.iDosService_Response.services.service ){
								data = data.Envelope.Body.iDosService_Response.services.service;
							}
							else{
								data = null;
							}
							if(data){
								//Save to local storage
								DataUtils.setLocalStorageData("rtaServices",JSON.stringify(data),false,"shell");
								var myDate = new Date().getTime();
								DataUtils.setLocalStorageData("rtaServicesLastSavedDate",myDate,false,"shell");
								DataUtils.setLocalStorageData("rtaServicesLastSavedAppVersion",WL.Client.getAppProperty(WL.AppProperty.APP_VERSION),false,"shell");

								//Fire callback
//								callback(data);
							}
//							else{
//								if(result.invocationContext){
//									result.invocationContext._loadFallbackServiceList(callback);
//								}
//							}
						}
//						else{
//							if(result.invocationContext){
//								result.invocationContext._loadFallbackServiceList(callback);
//							}
//						}
					},
					function(result){
//						if(result && result.invocationContext){
//							result.invocationContext._loadFallbackServiceList(callback);
//						}
					}

				);
			}
		},

		/**
		 * This function is used to load the services found in this App
		 * @param none
		 *
		 */
		returnSubCatAndCatForService:function (serviceId){
			var catSpecs={};
			for(var i=0;i<ServiceCategories.length;i++){
				for(var j=0;j<ServiceCategories[i].CategoryServices.length;j++){
					if(ServiceCategories[i].CategoryServices[j].ServiceId == serviceId){
						catSpecs["Cat_ID"] = ServiceCategories[i].CategoryId;
						catSpecs["serv_url"] = ServiceCategories[i].CategoryServices[j].ServicePageUrl;
						return catSpecs;
					}
				}
			}
			return null;
		},
		/*Check if service exist in this app or not New home page grouping */
		isServiceInThisApp:function(ServID,model){
			for(var i=0;i<ServiceCategories.length;i++){
				for(var j=0;j<ServiceCategories[i].CategoryServices.length;j++){
					if(ServiceCategories[i].CategoryServices[j].ServiceId == ServID){
						return true;
					}
				}
			}
			return false;
		},
		getServicesInTheFollowingApp:function(appId, callback){
			var future=false;
			this.getAllServices(function(AllServices){
			    var filtered = [];

				var filteredTmp = _.filter(AllServices, function(item) {
					var mapItem = Constants.SERVICE_MAPPING[item.serviceID];
					return	 mapItem && mapItem.visible&&mapItem &&mapItem.type==0 &&mapItem.appName.toLocaleLowerCase() == appId.toLocaleLowerCase();
				});

				if(filteredTmp) {
				    filtered = filteredTmp;
				}

				callback(filtered,future);
				 future=true;
				var filteredTmpFuture = _.filter(AllServices, function(item) {
					var mapItem = Constants.SERVICE_MAPPING[item.serviceID];
				     return mapItem && mapItem.visible && mapItem.type==1&& mapItem.appName.toLocaleLowerCase() == appId.toLocaleLowerCase();
				});

				if(filteredTmpFuture) {
				    filtered = filteredTmpFuture;
				}

			});
		},


		/**
		 * This function is used to load the cached list data or fallback if no cache
		 * @param none
		 */
		getCachedServices:function(callback, minimumInfo){
			var servicesJson = DataUtils.getLocalStorageData("rtaServices","shell");
			if(servicesJson){
				try{
					var data = $.parseJSON(servicesJson);
					callback(data);
				}
				catch(e){
					this._loadFallbackServiceList(function(data){
						callback(data);
					}, minimumInfo);
				}
			}
			else{
				this._loadFallbackServiceList(function(data){
					callback(data);
				}, minimumInfo);
			}
		},

		/**
		 * This function is used to get the cached custom list data.
		 * @param Json object
		 */
		loadCachedCustomServices:function(){
			var data = {};
			var servicesListCustom = DataUtils.getLocalStorageData("rtaHomeServices", "shell");
			if(servicesListCustom){
				try{
					data = JSON.parse(servicesListCustom);
				}
				catch(e) {
					console.log("ServicesDirectoryModel :: loadCachedCustomServices :: " + e.toString());
				}
			}
			else{
				data = Constants.SERVICE_HOME_MAPPING;
				DataUtils.setLocalStorageData("rtaHomeServices", JSON.stringify(data), false, "shell");
			}

			return data;
		},

		/**
		 * This function will indicate that service is supported in this application or not.
		 * @param Number
		 */
		isServiceInApp:function(serviceId){
			if(Constants.SERVICE_MAPPING) {
				var supportedServicesIds = Object.keys(Constants.SERVICE_MAPPING);
				var supportedServicesLen = supportedServicesIds.length;
				for(var i=0;i<supportedServicesLen;i++) {
					var serviceItemId = supportedServicesIds[i];
					if(serviceItemId == serviceId) {
						return true;
					}
				}
			}
			return false;
		},

		/**
		 * This function will return the service from service directory
		 * @param Number
		 */
		getServiceDetails:function(serviceId, callback){
			this.getCachedServices(function(data){
				for(var i=0;i<data.length;i++) {
					var serviceItemId = data[i].serviceID;
					if(serviceItemId == serviceId) {
						 callback(data[i]);
					}
				}
				callback(null);
			});
		},

		/**
		 * This function will return the service from service directory (Sync)
		 * @param Number
		 */
		getSyncServiceDetails:function(serviceId){
			var data = {};
			if(!MobileRouter.servicesMinList){
				var url;
				if(WL.Client.getEnvironment() == WL.Environment.WINDOWS_PHONE_8){
					url = '/www/default/data/services_list_min.json';
				}
				else{
					url = '../../common/data/services_list_min.json';
				}
				try{
					var ServicesListMin = $.ajax({
						type: "GET",
						url: url,
						async: false,
						success : function(data) {
						}
					}).responseText;
					data = $.parseJSON(ServicesListMin);
					MobileRouter.servicesMinList = data;
				}
				catch(e){
				}
			}
			else{
				data = MobileRouter.servicesMinList;
			}

			for(var i=0;i<data.length;i++) {
				if(data[i].serviceID == serviceId) {
					 return data[i];
				}
			}
			return {};
		}

	});

	return ServicesDirectoryModel;

});

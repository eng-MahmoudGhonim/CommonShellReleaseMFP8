define([

        "jquery",
        "backbone",
        "com/utils/DataUtils",
        "com/models/Constants"

        ], function($, Backbone, DataUtils, Constants)
        {
//	var TERMS_CONDITIONS = 'termsConditions';

	var PrivacyAndSecurityModel = Backbone.Model.extend({},
			{
		getPrivacyAndSecurityContent : function(callback){

			//check if terms and conditions are cached and not expired
			var callbackCalled = false;
			var lastSaveDate = DataUtils.getLocalStorageData("rtaPravicyPolicyLastSavedDate","shell");

			if(lastSaveDate){
				var myDate = new Date().getTime();
				if (myDate - parseInt(lastSaveDate) < Constants.CACHED_DATA_EXPIRY_IN_MS){
					var dataStr = DataUtils.getLocalStorageData("rtaPravicyPolicy","shell");
					var data = JSON.parse(dataStr);
					callback(data);
					callbackCalled = true;
				}
			}

			if(!callbackCalled){
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_privacy_security.json", callback);
				return;
				//comment till update database
				var invocationData = {
						adapter : 'WCMAdapter',
						procedure : 'getNewPrivacyContent',
						parameters : [],
            invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						if(result.invocationResult.isSuccessful && result.invocationResult.resultSet
								&& (result.invocationResult.resultSet instanceof Array) && (result.invocationResult.resultSet.length > 0)){

							var data = result.invocationResult.resultSet;

							//Save to local storage
							DataUtils.setLocalStorageData("rtaPravicyPolicy",JSON.stringify(data),false,"shell");
							var myDate = new Date().getTime();

							DataUtils.setLocalStorageData("rtaPravicyPolicyLastSavedDate",myDate,false,"shell");

							//Fire callback
							callback(data);
						}
						else{
						$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_privacy_security.json", callback);
						}
					},
					function() {
						$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_privacy_security.json", callback);
					}

				);

			}
		}
			})

			return PrivacyAndSecurityModel;

        });

define([

		"jquery",
		"backbone",
		"com/utils/DataUtils",
		"com/models/Constants"

	], function($, Backbone, DataUtils, Constants)
	{
//		var TERMS_CONDITIONS = 'termsConditions';

	var TermsConditionsModel = Backbone.Model.extend({},
	{

		getTermsAndConditionsContent : function(callback){

			//check if terms and conditions are cached and not expired
			var callbackCalled = false;
			var lastSaveDate = DataUtils.getLocalStorageData("rtaTermsAndConditionsLastSavedDate","shell");

			if(lastSaveDate){
				var myDate = new Date().getTime();
				if (myDate - parseInt(lastSaveDate) < Constants.CACHED_DATA_EXPIRY_IN_MS){
					var dataStr = DataUtils.getLocalStorageData("rtaTermsAndConditions","shell");
					var data = JSON.parse(dataStr);
					callback(data);
					callbackCalled = true;
				}
			}

			if(!callbackCalled){
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_terms_conditions.json", callback);
				return;
				var invocationData = {
						adapter : 'WCMAdapter',
						procedure : 'getNewTermsAndConditions',
						parameters : [],
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						if(result.invocationResult.isSuccessful && result.invocationResult.resultSet
							&& (result.invocationResult.resultSet instanceof Array) && (result.invocationResult.resultSet.length > 0)){

							var data = result.invocationResult.resultSet;

							//Save to local storage
							DataUtils.setLocalStorageData("rtaTermsAndConditions",JSON.stringify(data),false,"shell");
							var myDate = new Date().getTime();

							DataUtils.setLocalStorageData("rtaTermsAndConditionsLastSavedDate",myDate,false,"shell");

							//Fire callback
							callback(data);
						}
						else{
							$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_terms_conditions.json", callback);
						}
					},
					function() {
						$.getJSON(window.mobile.baseUrl +"/common/data/fallback_rta_terms_conditions.json", callback);
					}

				);

			}
		}

	});

	return TermsConditionsModel;

});

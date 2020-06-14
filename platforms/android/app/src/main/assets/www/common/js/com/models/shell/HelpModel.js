define([
	"jquery",
	"backbone",
	"com/utils/DataUtils",
	"com/models/Constants"
	], function($, Backbone, DataUtils, Constants) {


	var HelpModel = Backbone.Model.extend({}, {

		getHelpData : function(callback) {

			//Check if data are cached and didn't expire
			var callbackCalled = false;
			var lastSaveDate = DataUtils.getLocalStorageData("helpLastSavedDate","shell");

			if(lastSaveDate){
				var myDate = new Date().getTime();
				if (myDate - parseInt(lastSaveDate) < Constants.CACHED_DATA_EXPIRY_IN_MS){
					var dataStr = DataUtils.getLocalStorageData("help","shell");
					var data = JSON.parse(dataStr);
					callback(data);
					callbackCalled = true;
				}
			}

			if(!callbackCalled){
				$.getJSON(window.mobile.baseUrl +"/common/data/" + Constants.APP_ID + "_fallback_help_topics.json", callback);

				var invocationData = {
						adapter : 'WCMAdapter',
						procedure : 'getHelpTopics',
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						if(result.invocationResult.isSuccessful && result.invocationResult.resultSet
							&& (result.invocationResult.resultSet instanceof Array) && (result.invocationResult.resultSet.length > 0)){

							var data = result.invocationResult.resultSet;

							//Save to local storage
							DataUtils.setLocalStorageData("help",JSON.stringify(data),false,"shell");
							var myDate = new Date().getTime();

							DataUtils.setLocalStorageData("helpLastSavedDate",myDate,false,"shell");

							//Fire callback
//							callback(data);
						}
//						else{
//							$.getJSON('../../common/data/fallback_help_topics.json', callback);
//						}
					},
					function() {
//						$.getJSON('../../common/data/fallback_help_topics.json', callback);
					}

				);
			}
		}
	});

	return HelpModel;
});

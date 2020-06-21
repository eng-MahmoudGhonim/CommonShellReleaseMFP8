define([

		"jquery",
		"backbone",
		"com/utils/DataUtils",
		"com/models/Constants",

	], function($, Backbone, DataUtils, Constants)
	{


	var AboutRTAModel = Backbone.Model.extend({},
	{
		getAboutRTAData : function(callback) {

			//Check if data are cached and didn't expire
			var callbackCalled = false;
			var lastSaveDate = DataUtils.getLocalStorageData("rtaAboutLastSavedDate","shell");

			if(lastSaveDate){
				var myDate = new Date().getTime();
				if (myDate - parseInt(lastSaveDate) < Constants.CACHED_DATA_EXPIRY_IN_MS){
					var dataStr = DataUtils.getLocalStorageData("rtaAbout","shell");
					var data = JSON.parse(dataStr);
					callback(data);
					callbackCalled = true;
				}
			}

			if(!callbackCalled){
				$.getJSON(window.mobile.baseUrl +"/common/data/fallback_about_rta.json", callback);

				var invocationData = {
						adapter : 'WCMAdapter',
						procedure : 'getAboutRTA',
						invocationContext: this
				};

				invokeWLResourceRequest(invocationData,
					function(result){
						if(result.invocationResult.isSuccessful && result.invocationResult.resultSet
							&& (result.invocationResult.resultSet instanceof Array) && (result.invocationResult.resultSet.length > 0)){

							var data = result.invocationResult.resultSet;

							//Save to local storage
							DataUtils.setLocalStorageData("rtaAbout",JSON.stringify(data),false,"shell");
							var myDate = new Date().getTime();

							DataUtils.setLocalStorageData("rtaAboutLastSavedDate",myDate,false,"shell");

							//Fire callback
//							callback(data);
						}
//						else{
//							$.getJSON('../../common/data/fallback_about_rta.json', callback);
//						}
					},
					function() {
//						$.getJSON('../../common/data/fallback_about_rta.json', callback);
					}

				);
			}
		}
	});

	return AboutRTAModel;

});

define([

        "jquery", 
        "backbone",
        "com/utils/DataUtils",
        "com/models/Constants",

        ], function($, Backbone, DataUtils, Constants) {
	var SalikAccountModel = Backbone.Model.extend({},{	    

		getSalikAccount:function (user_id,callback){
			var lastSaveAccount = DataUtils.getLocalStorageData("SavedSalikAccount","shell"+user_id);
			if (lastSaveAccount){
				console.log('getting from local storage')
				lastSaveAccount = JSON.parse(lastSaveAccount);
				callback(lastSaveAccount) ;
				return;
			}else{
				var invocationData = {
						adapter : 'userProfile',
						procedure : 'getSalikAccount',
						parameters : [ user_id ]

				};

				WL.Client.invokeProcedure(invocationData, {
					onSuccess : function(result){
						if(result.invocationResult.isSuccessful && result.invocationResult.resultSet){
							var data = result.invocationResult.resultSet; 
							if(!isUndefinedOrNullOrBlank(data[0]))
							{
								SalikAccountModel.setSalikAccountInLocalStorage(data[0].user_id,data[0].nickname,data[0].account_number,data[0].account_pin,data[0].active);
								callback(data[0]);
							}else {
								callback(null);

							}
						}
					},
					onFailure : function() {
						callback(null);
					},
					invocationContext: this
				});
			}
		},
		saveSalikAccount:function (user_id,nickname,accountnumber,pincode,active,successCallback,failureCallback){
			var invocationData = {
					adapter : 'userProfile',
					procedure : 'setSalikAccount',
					parameters : [ user_id,nickname,accountnumber,pincode,active ]
			};
			WL.Client.invokeProcedure(invocationData, {
				onSuccess : function(response) {
					if(response.status == 200 && response.invocationResult && response.invocationResult.isSuccessful)
					{
						SalikAccountModel.setSalikAccountInLocalStorage(user_id,nickname,accountnumber,pincode,active);
						successCallback();
					}else {
						failureCallback(response);
					}
				},
				onFailure : function(response) {
					failureCallback(response);
				},
				invocationContext: this
			});


		},
		setSalikAccountInLocalStorage:function (user_id,nickname,accountnumber,pincode,active){
			var SalikObj={};
			SalikObj["user_id"]=user_id;
			SalikObj["nickname"]=nickname;

			SalikObj["account_number"]=accountnumber;
			SalikObj["account_pin"]=pincode;
			SalikObj["active"]=active;

			DataUtils.setLocalStorageData("SavedSalikAccount",JSON.stringify(SalikObj),false,"shell"+user_id);

		}
		/*getAboutRTAData : function(callback) {

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
				$.getJSON('../../common/data/fallback_about_rta.json', callback);

				var invocationData = {
						adapter : 'WCMAdapter',
						procedure : 'getAboutRTA'
				};

				WL.Client.invokeProcedure(invocationData, {
					onSuccess : function(result){
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
					onFailure : function() {
//						$.getJSON('../../common/data/fallback_about_rta.json', callback);
					},
					invocationContext: this
				});
			}
		}*/
	});

	return SalikAccountModel;

});
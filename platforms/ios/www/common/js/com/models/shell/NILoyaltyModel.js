
define([
"jquery",
"backbone",
"com/utils/DataUtils",
"com/utils/Utils",
"com/models/Constants"
], function($, Backbone, DataUtils, Utils,Constants) {

	var loyalityModel = Backbone.Model.extend({
	}, {



		getLoyalityBalance:function(callback,loaderCallback){
			try {

					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					var userId;
					if (userProfile) {
						userProfile = JSON.parse(userProfile);
						userId=userProfile && userProfile.Users[0]?userProfile.Users[0].user_id:null;
					}

					var invocationData = {
							adapter: 'NILoyaltyAdapter',
							procedure: 'getBalance',
							parameters: [userId,"PL"]
					};

					invokeWLResourceRequest(invocationData,
						function (result) {
							//registewred user
							if (result && result.invocationResult.isSuccessful&&result.invocationResult.isRegistered&&result.invocationResult.balance) {

								var loyalty=result.invocationResult.balance; // return balance object
								loyalty.updateDate=new Date();
								loyalty.isRegistered=true;
								DataUtils.setLocalStorageData('niLoyalty', JSON.stringify(loyalty), true, "shell");
								if(typeof callback == "function")
									callback(loyalty,loaderCallback);
								return;
							}

							loyalty={isRegistered: false};
							DataUtils.setLocalStorageData('niLoyalty', JSON.stringify(loyalty), true, "shell");
							callback(loyalty,loaderCallback);// user is not registered
						},
						function (e) {
							if(typeof callback == "function")
								callback(null,loaderCallback);
						}
					);


			}
			catch (e) {
				callback(null);
			}
		}
	});
	return loyalityModel;
});

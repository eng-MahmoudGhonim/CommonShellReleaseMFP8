define([

		"jquery",
		"backbone",
		"com/utils/DataUtils",
		"com/models/Constants",

	], function($, Backbone, DataUtils, Constants)
	{


	var pushNotificationModel = Backbone.Model.extend({},
	{
		pushNotification : function(username,serviceID,bodyText){
			var invocationData = {
					adapter : "PushAdapter",
					procedure : "submitNotification",
					parameters : [ username, serviceID, bodyText ],
					invocationContext: this
			};
			//Calling adapter
			invokeWLResourceRequest(invocationData,
				function(result){
//					Message Send successfully
				},
				function(result){
//					An error happened
				}

			);
		}

	});

	return pushNotificationModel;

});

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
					parameters : [ username, serviceID, bodyText ]
			};
			//Calling adapter
			WL.Client.invokeProcedure(invocationData,{
				onSuccess : function(result){
//					Message Send successfully
				},
				onFailure : function(result){
//					An error happened
				},
				invocationContext: this
			});	
		}

	});

	return pushNotificationModel;
	
});
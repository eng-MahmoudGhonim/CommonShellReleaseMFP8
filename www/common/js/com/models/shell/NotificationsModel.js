


define([
"jquery",
"backbone",
"com/utils/DataUtils", 
"com/utils/Utils", 
"com/models/Constants"
], function($, Backbone, DataUtils, Utils,Constants) {
	var userNotifications = 'userNotifications';
	var notificationsModel = Backbone.Model.extend({
	}, {
		setUserNotications: function (notifications) {
			if(!notifications) {
				notifications = {};
			}
			DataUtils.setLocalStorageData(userNotifications, JSON.stringify(notifications), true, "shell");
		},
		getUserNotications: function () {
			var notifications = DataUtils.getLocalStorageData(userNotifications, "shell");
			if (notifications) {
				notifications = JSON.parse(notifications);
				return notifications;
			}
			return null;
		},
		DeleteUserNotifications:function(checkList,callback){
			var self= this;
			var notifications=self.getUserNotications();
			var updateNotification=[];
			if(checkList&&notifications){

				for(var i =0; i<notifications.length;i++){
					var current=notifications[i];
					if(checkList.includes((current.Id).toString()))
					{
						current.IsDeleted=true;
					}
					updateNotification.push(current);
				}
				self.setUserNotications(updateNotification);
			}
			if(typeof callback === "function")
				callback();
		},

		findObjectByKey:function(array, id) {
			if(array&&array.length>0)
			{
				for (var i = 0; i < array.length; i++) {
					if (array[i].Id==id) {
						return array[i];
					}
				}
			}
			return "";
		},

		filtercashedNotification:function(){
			var self= this;
			//Filter Cashed Data 
			var cashedNotifications=self.getUserNotications();
			var filteredList=[];
			if(cashedNotifications)
			{
				for(var i =0; i<cashedNotifications.length;i++){
					if(!cashedNotifications[i].hasOwnProperty("IsDeleted")||(cashedNotifications[i].hasOwnProperty("IsDeleted")&&cashedNotifications[i].IsDeleted==false))
					{
						filteredList.push(cashedNotifications[i])
					}

				}
			}
			return filteredList;
		},
		getLast30DaysNotifications:function(callback){
			var self = this;
			var currentApp = Constants.APP_ID;
			if(currentApp=="RTA_Drivers_And_Vehicles")
				currentApp="Drivers_and_Vehicles";
			else if(currentApp=="RTA_Corporate_Services")
				currentApp="RTACorporateMobile";
			//currentApp="RTA_Common_Shell";// this is for testing 


			var userId = "";
			var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
			if (userProfile) 
			{
				userProfile = JSON.parse(userProfile);
				userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;
			}

			try {
				var invocationData = {
						adapter: 'NotificationsAdapter', 
						procedure: 'getLast30DaysNotifications',
						parameters: [currentApp,userId]
				};
				var userNotification=[];/* it contains old and new without deleted from User*/
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
					if (result && result.invocationResult.isSuccessful) {
							var newNotificationsList=[];
							if(userId){
						    	 var userNotification=result.invocationResult.UserNotificationsList.resultSet;
						    	 if(userNotification&&userNotification.length>0){
						    		 for(var j=0;j<userNotification.length;j++){
						    			 newNotificationsList.push(userNotification[j]);
						    		 }
						    	 }
						     }
							 var generalNotifications=result.invocationResult.GeneralNotificationsList.resultSet
							if(generalNotifications&&generalNotifications.length>0){
					    		 for(var i=0;i<generalNotifications.length;i++){
					    			 newNotificationsList.push(generalNotifications[i])
					    		 }
					    	 }
							
							;	 /* come from server contains all notif */
     

							var oldNotification=self.getUserNotications() /* saved notifications */

							if(newNotificationsList&&newNotificationsList.length>0) 
							{
								//var filteredList=[];
								if(oldNotification&&newNotificationsList.length>0) /* if we have old data update new data */
								{
									for(var i =0; i<newNotificationsList.length;i++){

										var getOldNotification=self.findObjectByKey(oldNotification,newNotificationsList[i].Id)
										/* check show in dashboard */
										if(getOldNotification)
										{
											if(getOldNotification.hasOwnProperty("IsShowDB")||getOldNotification.IsShowDB==true )
											{
												newNotificationsList[i].IsShowDB=true;
											}
											/* check Deleted Before */
											if(getOldNotification.hasOwnProperty("IsDeleted")||getOldNotification.IsDeleted==true) /* it mean deleted */
											{
												newNotificationsList[i].IsDeleted=true;/* Update old  one */
											}
										}
									}
									self.setUserNotications(newNotificationsList); /* Update Local storage with new list*/
									if(typeof callback == "function")
										callback(newNotificationsList); /* read from filtered list with saved user actions cashed */
								}
								else
								{
									/* success but no cashed data it will see all list */
									self.setUserNotications(newNotificationsList); /* Update Local storage with new list for next request */
									DataUtils.setLocalStorageData('filteredNotifications', JSON.stringify(newNotificationsList), true, "shell"); /* saved for notification page only*/
									if(typeof callback == "function")
										callback(newNotificationsList); /* read  server list */
								}
							}
							else{
								// Success and empty data from server
								var noNotification=[];
								self.setUserNotications(noNotification); 
								if(typeof callback == "function")
									callback(self.filtercashedNotification()); /* read from cashed */ 
							}
						}
						else {
							if(typeof callback == "function")
								callback(self.filtercashedNotification()); 
						}
					},
					onFailure: function (result) {
						if(typeof callback == "function")
							callback(self.filtercashedNotification()); /* read from cashed */
					}
				});
			}
			catch (e) {
				callback(null);
			}
		},

		insertUserPreferredLocation:function(northEast,southWest,callback){
			try{
				var userId = "";
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile) 
				{
					userProfile = JSON.parse(userProfile);
					userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;

					//userId="aymannageh";// testing 
					var invocationData = {
							adapter: 'NotificationsAdapter', 
							procedure: 'insertUserPreferredLocation',
							parameters: [userId,northEast,southWest]
					};

					WL.Client.invokeProcedure(invocationData, {
						onSuccess: function (result) {
							if (result && result.invocationResult.isSuccessful) {
								var userIdRecord = result.invocationResult.result==true;
								callback(userIdRecord);
							}

						},

						onFailure: function (result) {
							if(typeof callback == "function")
								callback(null); 
						}

					});
				}
			}
			catch (e) {
				console.log(e);
				callback(null);
			}
			callback(null);
		},



		getUserLocation:function(callback){
			try{
				var userId = "";
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile) {
					userProfile = JSON.parse(userProfile);
					userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;

					//userId="aymannageh";// testing 

					var invocationData = {
							adapter: 'NotificationsAdapter', 
							procedure: 'SelectByUserId',
							parameters: [userId]
					};

					WL.Client.invokeProcedure(invocationData, {
						onSuccess: function (result) {
							$(".ui-loader").hide();
							if (result && result.invocationResult.isSuccessful) {
								var userIdRecord = result.invocationResult.result;
								if(userIdRecord.resultSet)
									callback(userIdRecord.resultSet);
							}

						},

						onFailure: function (result) {
							$(".ui-loader").hide();
							if(typeof callback == "function")
								callback(null); 
						}

					});
				}
			}
			catch (e) {
				console.log(e);
				callback(null);
			}
		},
		deleteUserLocation:function(callback){
			try{

				var userId = "";
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile) {
					userProfile = JSON.parse(userProfile);
					userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;

					//userId="aymannageh";// testing 

					var invocationData = {
							adapter: 'NotificationsAdapter', 
							procedure: 'deletePreferredLocation',
							parameters: [userId]
					};

					WL.Client.invokeProcedure(invocationData, {
						onSuccess: function (result) {
							$(".ui-loader").hide();
							if (result && result.invocationResult.isSuccessful) {
								var userIdRecord = result.invocationResult.result;
								if(userIdRecord.resultSet)
									callback(userIdRecord.resultSet);
							}

						},

						onFailure: function (result) {
							$(".ui-loader").hide();
							if(typeof callback == "function")
								callback(null); 
						}

					});
				}
			}
			catch (e) {
				callback(null);
				console.log(e);
			}
		}

	});
	return notificationsModel;
});

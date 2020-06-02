define([
        
        "jquery",
        "backbone",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/UserProfileModel",
        "com/models/shell/AuthenticationModel"
        
        ], function($, Backbone, Utils, DataUtils, UserProfileModel, AuthenticationModel) {
	
	var MessagesModel = Backbone.Model.extend({},{
		
		defaults: {
			messageTitle: '',
			messageDescription: '',
			messageStatus: ''
		},
		
		initialize: function() {
		},
		
		getAllMessages: function(user_id, callback) {
			var invocationData = {
					adapter : 'userProfile',
					procedure : 'getUserNotifications',
					parameters : [user_id]
			};
			
			WL.Client.invokeProcedure(invocationData, {
				onSuccess : function(result) {
					if(result.status == 200) {
						callback(result);
					}	
				},
				onFailure : function(error) {
				},
				invocationContext: this
			});
			
		},
		
		syncPendingTasks : function() {
			WL.Logger.debug("MessagesModel :: syncPendingTasks :: Started");
			
			try {
				var pendingTasksRest = [];
				var pendingTasks = DataUtils.getLocalStorageData('PENDING_MESSAGES_TASKS', 'shell');
				if (pendingTasks) {
					var pendingTasksArray = JSON.parse(pendingTasks);
					if(pendingTasksArray && pendingTasksArray.length > 0) {
						var pendingTasksArrayLength = pendingTasksArray.length;
						for(var i=0;i<pendingTasksArrayLength;i++) {
							var taskDetails = pendingTasksArray[i];
							if(taskDetails) {
								if(taskDetails.type == "msg_read") {
									this.setMessageRead(taskDetails.id, taskDetails.status, taskDetails.user_id, function() {
										WL.Logger.debug("MessagesModel :: syncPendingTasks :: setMessageRead :: Invocation success");
									});
								}
								else if(taskDetails.type == "msg_delete") {
									this.deleteMessage(taskDetails.id, taskDetails.user_id, function() {
										WL.Logger.debug("MessagesModel :: syncPendingTasks :: deleteMessage :: Invocation success");
									});
								}
								else {
									pendingTasksRest[pendingTasksRest.length] = taskDetails;
								}
							}
						}
						
						DataUtils.setLocalStorageData('PENDING_MESSAGES_TASKS', JSON.stringify(pendingTasksRest), false, 'shell');
					}
				}
			}
			catch(e) {
				
			}
			
			WL.Logger.debug("MessagesModel :: syncPendingTasks :: Finished");
		},
		setMessageUnread: function(message_id, message_status, user_id, callback) {
			var self = this;
			//MGRT71
			WL.Device.getNetworkInfo(function (networkInfo) {
				if((networkInfo && networkInfo.isNetworkConnected == "true")){
					//Online mode
					var invocationData = {
							adapter : 'userProfile',
							procedure : 'setUserNotificationReadFlag',
							parameters : [message_id, user_id, 0]
					};

					WL.Client.invokeProcedure(invocationData, {
						onSuccess : function(result) {
							self._setMessageRealFlagLocally(message_id, 1);

							if(result.status == 200) {
								callback(result);
							}
						},
						onFailure : function(error) {
						},
						invocationContext: this
					});
				} else {
					// Off-line mode
					var pendingTasks = DataUtils.getLocalStorageData('PENDING_MESSAGES_TASKS', 'shell');
					if (pendingTasks) {
						pendingTasks = JSON.parse(pendingTasks);
					}
					if(!pendingTasks) {
						pendingTasks = [];
					}

					var taskArgs = {};
					taskArgs.type = "msg_read";
					taskArgs.id = message_id;
					taskArgs.user_id = user_id;
					taskArgs.status = 1;

					pendingTasks[pendingTasks.length] = taskArgs;

					DataUtils.setLocalStorageData('PENDING_MESSAGES_TASKS', JSON.stringify(pendingTasks), false, 'shell');

					self._setMessageRealFlagLocally(message_id, 1);

					callback({isSuccessful: true});
				}
			});

		},
		setMessageRead: function(message_id, message_status, user_id, callback) {
			var self = this;
			//MGRT71
			WL.Device.getNetworkInfo(function (networkInfo) {
				if((networkInfo && networkInfo.isNetworkConnected == "true") ){
					//Online mode
					var invocationData = {
							adapter : 'userProfile',
							procedure : 'setUserNotificationReadFlag',
							parameters : [message_id, user_id, 1]
					};
					
					WL.Client.invokeProcedure(invocationData, {
						onSuccess : function(result) {
							self._setMessageRealFlagLocally(message_id, 1);
							
							if(result.status == 200) {
								callback(result);
							}
						},
						onFailure : function(error) {
						},
						invocationContext: this
					});
				} else {
					// Off-line mode
					var pendingTasks = DataUtils.getLocalStorageData('PENDING_MESSAGES_TASKS', 'shell');
					if (pendingTasks) {
						pendingTasks = JSON.parse(pendingTasks);
					}
					if(!pendingTasks) {
						pendingTasks = [];
					}
					
					var taskArgs = {};
					taskArgs.type = "msg_read";
					taskArgs.id = message_id;
					taskArgs.user_id = user_id;
					taskArgs.status = 1;
					
					pendingTasks[pendingTasks.length] = taskArgs;
					
					DataUtils.setLocalStorageData('PENDING_MESSAGES_TASKS', JSON.stringify(pendingTasks), false, 'shell');
					
					self._setMessageRealFlagLocally(message_id, 1);
					
					callback({isSuccessful: true});
				}
			});
		},
		
		deleteMessage: function(message_id, user_id, callback) {
			
			var self = this;
			WL.Device.getNetworkInfo(function(deviceStatus) {
				//MGRT71
				if ((deviceStatus && deviceStatus.isNetworkConnected == "true") ) {
					//Online mode
					var invocationData = {
							adapter : 'userProfile',
							procedure : 'deleteUserNotification',
							parameters : [message_id, user_id]
					};
					
					WL.Client.invokeProcedure(invocationData, {
						onSuccess: function(result) {
							if(result.status == 200) {
								callback(result);
								self.updateNotificationsCounter();
							}
						},
						onFailure: function(error) {
							
						},
						invocationContext: this
					});
				}
				else {
					// Off-line mode
					var pendingTasks = DataUtils.getLocalStorageData('PENDING_MESSAGES_TASKS', 'shell');
					if (pendingTasks) {
						pendingTasks = JSON.parse(pendingTasks);
					}
					if(!pendingTasks) {
						pendingTasks = [];
					}
					
					var taskArgs = {};
					taskArgs.type = "msg_delete";
					taskArgs.id = message_id;
					taskArgs.user_id = user_id;
					
					pendingTasks[pendingTasks.length] = taskArgs;
					
					DataUtils.setLocalStorageData('PENDING_MESSAGES_TASKS', JSON.stringify(pendingTasks), false, 'shell');
					callback({isSuccessful: true});
				}
			});
		},
		
		getUserMessageAfterDate: function(user_id, date, callback) {
			var invocationData = {
				adapter : 'userProfile',
				procedure : 'getUserNotificationsFromTimeStamp',
				parameters : [user_id, date]
			};
			
			WL.Client.invokeProcedure(invocationData, {
				onSuccess: function(result) {
					if(result.status == 200) {
						callback(result);
					}
				},
				onFailure: function(error) {
					
				},
				invocationContext: this
			});
		},
		
		getUserNotificationsWithLimit: function(user_id, limit, callback) {
			var invocationData = {
					adapter : 'userProfile',
					procedure : 'getUserNotificationsWithLimit',
					parameters : [user_id, limit]
			};
			
			WL.Client.invokeProcedure(invocationData, {
				onSuccess: function(result) {
					if(result.status == 200) {
						callback(result);
					}
				},
				onFailure: function(error) {
					
				},
				invocationContext: this
			});
		},
		
		getOldNotifications: function(user_id, startIndex, numberOfRecords, callback) {
			var invocationData = {
				adapter : 'userProfile',
				procedure : 'getUserNotificationsWithLimit',
				parameters : [user_id, startIndex, numberOfRecords]
			};

			WL.Client.invokeProcedure(invocationData, {
				onSuccess: function(result) {
					if(result.status == 200) {
						callback(result);
					}
				},
				onFailure: function(error) {

				},
				invocationContext: this
			});
		},
		
		updateNotificationsCounter: function() {
			
			 if(AuthenticationModel.isAuthenticated()){
				 var self = this;
					
					var unreadMessages = 0;
					try {
						WL.Device.getNetworkInfo(function(deviceStatus) {
							//MGRT71
							if ((deviceStatus && deviceStatus.isNetworkConnected == "true")) {
								var user_id = "";
								try {
									user_id = UserProfileModel.getUserProfile().Users[0].user_id;
								}
								catch(e) {
								}
								
								var invocationData = {
									adapter : 'userProfile',
									procedure : 'getUserNotificationsCoun',
									parameters : [ user_id ]
								};

								WL.Client.invokeProcedure(invocationData, {
									onSuccess : function(result) {
										if (result && result.status == 200 && result.invocationResult 
												&& result.invocationResult.resultSet 
												&& result.invocationResult.resultSet.length > 0 
												&& result.invocationResult.resultSet[0].counter) {
											unreadMessages = result.invocationResult.resultSet[0].counter;
											DataUtils.setLocalStorageData("UNREAD_MESSAGES_COUNTER",JSON.stringify(unreadMessages),false,"shell");
											self._updateMessagesCounterInView(unreadMessages);
										}
										else{
											self._updateMessagesCounterInView(unreadMessages);
										}
									},
									onFailure : function(error) {
										self._updateMessagesCounterInView(unreadMessages);
									},
									invocationContext : this
								});
							} else {
								unreadMessages = DataUtils.getLocalStorageData("UNREAD_MESSAGES_COUNTER", "shell");
								if(unreadMessages && parseInt(unreadMessages) > 0) {
									var pendingTasks = DataUtils.getLocalStorageData('PENDING_MESSAGES_TASKS', 'shell');
									if (pendingTasks) {
										var pendingTasksArray = JSON.parse(pendingTasks);
										if(pendingTasksArray && pendingTasksArray.length > 0) {
											unreadMessages = parseInt(unreadMessages);
											unreadMessages -= pendingTasksArray.length;
										}
									}
								}
								
								self._updateMessagesCounterInView(unreadMessages);
							}
						});
					} catch (e) {

					}
			 }
        },
        
        _updateMessagesCounterInView : function(unreadMessages) {
			var lang = getApplicationLanguage();			
        	if (unreadMessages && parseInt(unreadMessages) > 0) {
				$("#notificationBtn.itemListText").html(Globalize.localize("%shell.menu.yourMessages%", lang) + " (" + unreadMessages + ")");
				$("#messagesCounter").html(unreadMessages);
				$("#messagesCounter").show();
			} else {
				$("#notificationBtn.itemListText").html(Globalize.localize("%shell.menu.yourMessages%", lang));
				$("#messagesCounter").hide();
			}
        },
        
        _setMessageRealFlagLocally : function(message_id, message_status) {
			var self = this;
			var cachedMessages = DataUtils.getLocalStorageData("rtaMessages", "shell");
			if(cachedMessages) {
				var cachedMessagesArray = JSON.parse(cachedMessages);
				if(cachedMessagesArray && cachedMessagesArray.length > 0) {
					var cachedMessagesArrayLength = cachedMessagesArray.length;
					for(var i=0;i<cachedMessagesArrayLength;i++) {
						var item = cachedMessagesArray[i];
						
						if(item.id == message_id) {
							cachedMessagesArray[i].status = message_status;
							DataUtils.setLocalStorageData("rtaMessages",JSON.stringify(cachedMessagesArray),false,"shell");
							self.updateNotificationsCounter();
							break;
						}
					}
				}
			}
		}
	});
	
	return MessagesModel;
	
});
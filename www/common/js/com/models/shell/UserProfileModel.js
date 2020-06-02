define([
        "jquery",
        "backbone",
        "com/utils/DataUtils",
        "com/models/shell/ServicesDirectoryModel",
        "com/models/shell/PasswordModel",
        "com/models/Constants",
        "com/models/drivers_and_vehicles/DVDashboardModel"

        ], function ($, Backbone, DataUtils, ServicesDirectoryModel, PasswordModel, Constants, DVDashboardModel) {

	var USER_PROFILE = 'userProfile';
	var USER_Service_Related = 'serviceRelated';
	var USER_VIP = 'vipUSER';
	var UserProfileModel = Backbone.Model.extend({}, {
		SUCCESS: "SUCCESS",
		FAILED: "FAILED",
		EMPTYLIST: "EMPTYLIST",
		setUserProfile: function (profile) {
			if (!profile) {
				profile = {};
			}
			DataUtils.setLocalStorageData(USER_PROFILE, JSON.stringify(profile), true, "shell");
		},
		setServiceRelatedInfo: function (serviceRelatedInfo) {
			if (!serviceRelatedInfo) {
				serviceRelatedInfo = [];
			}
			DataUtils.setLocalStorageData(USER_Service_Related, JSON.stringify(serviceRelatedInfo), true, "shell");
		},
		updateServiceRelatedInfoByKey: function (key, value) {
			try {
				var updated = false;
				var serviceRelatedInfo = DataUtils.getLocalStorageData(USER_Service_Related, "shell");
				if (serviceRelatedInfo) {
					serviceRelatedInfo = JSON.parse(serviceRelatedInfo);
					for (var i = 0; i < serviceRelatedInfo.length; i++) {
						if (serviceRelatedInfo[i].serviceId == key) {
							serviceRelatedInfo[i].linkingAttribute = value;
							DataUtils.setLocalStorageData(USER_Service_Related, JSON.stringify(serviceRelatedInfo), true, "shell");
							updated = true;
							break;
						}
					}
					return updated
				} else {
					return updated;
				}
			} catch (e) {
				return false;
			}
		},
		isVIPUserLocalStorage: function () {
			try {
				var currentApp = Constants.APP_ID;
				var appName = Constants.PORTAL_APP_IDs[currentApp];
				var isVIP = false;
				var currentUser = this.getUserProfile().VIP_USERS[0];
				if (currentUser && currentUser.APPNAMES && currentUser.APPNAMES.indexOf(appName) !== -1)
					isVIP = true;

				return isVIP
			} catch (e) {
				return false;
			}
		},
		isVIPUser: function (sync, callback) {
			try {
				var userId = "";
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile) {
					userProfile = JSON.parse(userProfile);
					userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;
					var currentApp = Constants.APP_ID;
					var appName = Constants.PORTAL_APP_IDs[currentApp];
					var result = false;
					if (userId && appName) {
						if (sync) { // call server
							var invocationData = {
									adapter: 'userProfile',
									procedure: 'isUserVip',
									parameters: [userId, appName]
							};

							WL.Client.invokeProcedure(invocationData, {
								onSuccess: function (response) {
									if (response.invocationResult && response.invocationResult.isSuccessful == true) {
										result = response.IsVIP ? true : false;
										callback(result);
									}
								},
								onFailure: function (result) {
									result = false;
									callback(result);
								}
							});
						}
						else // get from local storage
						{
							var currentUser = this.getUserProfile().VIP_USERS[0];
							if (currentUser && currentUser.APPNAMES && currentUser.APPNAMES.indexOf(appName) !== -1)
								result = true;
							callback(result);
						}
					}
				}
			} catch (e) {
				result = false;
				callback(result);
			}
		},

		isVIPUserNotifiedBefore: function (user_Id, appName) {
			var result = false;
			try {
				if (user_Id && appName) {

					var currentUser = this.getUserProfile().VIP_USERS[0];
					if (currentUser && currentUser.APPNAMES && currentUser.APPNAMES.indexOf(appName) !== -1) {
						// check if not notified before 
						if (currentUser && currentUser.NOTIFIED_ON && currentUser.NOTIFIED_ON.indexOf(appName) == -1) {
							result = true;
						}

					}

				}
			} catch (e) { return result; }
			return result;
		},
		updateVIPUser: function (user_Id, appName) {
			var result = false;
			try {
				if (user_Id && appName) {	
					var invocationData = {
							adapter: 'userProfile',
							procedure: 'updateNotifiedVIPUser',
							parameters: [user_Id, appName]
					};
					WL.Client.invokeProcedure(invocationData, {
						onSuccess: function (response) {
							// update local storage  is notified 
							DataUtils.setLocalStorageData('VIPUserNotifications', JSON.stringify(true), true, "shell");
						},
						onFailure: function (result) {

						}
					});

				}
			} catch (e) { 
				return false;
			}
		},
		getServiceRelatedInfoByKey: function (key, callback, async) {
			try {
				var self = this;
				DVDashboardModel.getServiceRelatedInfoByKey(key, callback, async, self);
				/*	return;


					var self= this;
					var result = null ;
					if(async== true){
						self.getPortalProfile(function (profile){
							if(profile && profile.serviceRelatedInfo){
								var _serviceRelatedInfo =(Object.prototype.toString.call(profile.serviceRelatedInfo) === '[object Array]') ? profile.serviceRelatedInfo: convertObiectToArray(profile.serviceRelatedInfo);
								self.setServiceRelatedInfo(_serviceRelatedInfo);
								if (key != "ALL"){
									for (var i =0 ; i < _serviceRelatedInfo.length ; i++ ){
										if (_serviceRelatedInfo[i].serviceId == key){
											  var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved","shell")
										   var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink","shell")
											  if(key =="SALIK"){
											  if(SalikAccountRemoved == "true" && (SalikAccountRemovedLink === _serviceRelatedInfo[i].linkingAttribute || _serviceRelatedInfo[i].linkingAttribute == null)){
											  result = null;

											  }else{
											  DataUtils.setLocalStorageData("SalikAccountRemoved","false",true,"shell");
											  result = _serviceRelatedInfo[i];
											  }
											  }else{
											   result = _serviceRelatedInfo[i];
											  }




										}
									}
								}else{
									var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved","shell")
								var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink","shell")
									for (var i =0 ; i < _serviceRelatedInfo.length ; i++ ){
										if(_serviceRelatedInfo[i].serviceId =="SALIK"){
											  if(SalikAccountRemoved == "true" && (SalikAccountRemovedLink === _serviceRelatedInfo[i].linkingAttribute || _serviceRelatedInfo[i].linkingAttribute == null)){
											  _serviceRelatedInfo.splice(i,1);
											  }else{
											  DataUtils.setLocalStorageData("SalikAccountRemoved","false",true,"shell");
											  }
										}
									}
									result=_serviceRelatedInfo;
								}
								callback(result);
							}

							else{
								callback(null);
							}

						});
					}else{
						var serviceRelatedInfo = DataUtils.getLocalStorageData(USER_Service_Related, "shell");
						if (serviceRelatedInfo) {
							serviceRelatedInfo = JSON.parse(serviceRelatedInfo);
							if (key != "ALL"){
								for (var i =0 ; i < serviceRelatedInfo.length ; i++ ){
									if (serviceRelatedInfo[i].serviceId == key){
										var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved","shell")
									 var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink","shell")
									if(key =="SALIK" ){
										if( SalikAccountRemoved == "true" && (SalikAccountRemovedLink === serviceRelatedInfo[i].linkingAttribute || serviceRelatedInfo[i].linkingAttribute == null)){
													 result = null;

													 }else{
														DataUtils.setLocalStorageData("SalikAccountRemoved","false",true,"shell");
													 result = serviceRelatedInfo[i];
													 }
													 }else{
													 result = serviceRelatedInfo[i];
													 }



									}
								}
							}else{
								var SalikAccountRemoved = DataUtils.getLocalStorageData("SalikAccountRemoved","shell")
							var SalikAccountRemovedLink = DataUtils.getLocalStorageData("SalikAccountRemovedLink","shell")
								for (var i =0 ; i < serviceRelatedInfo.length ; i++ ){
									if(serviceRelatedInfo[i].serviceId =="SALIK"){
										if(SalikAccountRemoved == "true" && (SalikAccountRemovedLink === serviceRelatedInfo[i].linkingAttribute || serviceRelatedInfo[i].linkingAttribute == null)){
											serviceRelatedInfo.splice(i,1);
													 }else{
											DataUtils.setLocalStorageData("SalikAccountRemoved","false",true,"shell");
													 }
									}
								}
								result=serviceRelatedInfo;
							}
							callback(result);
						}else{
							callback(null);
						}
					}*/
			} catch (e) {callback(null); }
		},
		getPortalProfile: function (callback) {
			try{
				var user_id = this.getUserProfile().Users[0].user_id;
				var invocationData = {
						adapter: 'portalAdapter',
						procedure: 'getUserProfileV2',
						parameters: [user_id, Constants.PORTAL_APP_IDs[Constants.APP_ID]]
				};

				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (response) {
						if (response.invocationResult && response.invocationResult.isSuccessful == true) {
							var profile = response.invocationResult.Envelope.Body.getUserProfileReturn.userProfile;
							callback(profile);
						}
						else {
							callback(null);
						}
					},
					onFailure: function (result) {
						callback(null);
					}
				});
			} catch (e) { callback(null); }
		},

		getUserProfile: function () {
			try{
				var userProfile = DataUtils.getLocalStorageData(USER_PROFILE, "shell");
				if (userProfile) {
					userProfile = JSON.parse(userProfile);
					return userProfile;
				}
				return null;
			} catch (e) { return(null); }
		},
		isCorporateUser: function () {
			try{
				var userProfile = this.getUserProfile();
				if (userProfile) {
					// User Types UM_PUBLICUSER , UM_BUSINESSUSER , UM_COMPANYADMIN
					if (userProfile.Users[0].user_type == "UM_BUSINESSUSER" || userProfile.Users[0].user_type == "UM_COMPANYADMIN") {
						return true;
					}
				}
				return false
			} catch (e) { return false; }
		},
		getUserProfileFromServer: function (callback) {
			try {
				var self = this;
				var user_id = this.getUserProfile().Users[0].user_id;

				var invocationData = {
						adapter: 'userProfile',
						procedure: 'getUserProfile',
						parameters: [user_id]
				};

				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result && result.invocationResult) {
							var profile = result.invocationResult.Users[0];
							self.setUserProfile(result.invocationResult);
							callback(result.invocationResult);
						}
						else {
							callback(null);
						}
					},
					onFailure: function (result) {
						callback(null);
					}
				});
			}
			catch (e) {
				callback(null);
			}
		},

		updateProfile: function (tableName, columnName, value) {
			var profile = this.getUserProfile();
			if (profile) {
				try {
					profile[tableName][0][columnName] = value;
					this.setUserProfile(profile);
				} catch (e) {
				}
			}
		},

		isUserProfileCached: function () {
			var profile = this.getUserProfile();
			if (profile) {
				return (!$.isEmptyObject(profile));
			}

			return false;
		},
		updateMobileNumber: function (userData, callback) {
			var self = this;
			try{
				var invocationData = {
						adapter: "portalAdapter",
						procedure: "updateMobileNumber",
						parameters: [userData.userId,
						             userData.oldMobileNo,
						             userData.newMobileNo,
						             Constants.PORTAL_APP_IDs[Constants.APP_ID]]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult && result.invocationResult.isSuccessful == true && result.invocationResult.success == true) {
							self.updateProfile("Users", "mobile", userData.newMobileNo);
							self.updateProfile("Users", "user_id", userData.userId);
							self.updateProfile("Users", "is_mobile_verified", "true");
							if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
								var DVDashboardModel = require("com/models/shell/DashboardModel");
								var linkingAttribute = result.invocationResult.linkingAttribute;
								DVDashboardModel.onUpdateMobileNumber(linkingAttribute);
							}
							callback("SUCCESS", result);

						} else {
							callback("FAILED", result);
						}
					},

					onFailure: function () {
						callback("FAILED");
					}
				});
			}
			catch (e) {
				callback("FAILED");
			}

		},
		updateMail: function (userData, callback) {
			try{
				var self = this;
				var invocationData = {
						adapter: "portalAdapter",
						procedure: "updateMail",
						parameters: [userData.userId,
						             userData.mail,
						             Constants.PORTAL_APP_IDs[Constants.APP_ID]]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult && result.invocationResult.isSuccessful == true && result.invocationResult.success == true) {
							self.updateProfile("Users", "mail", userData.mail);
							callback("SUCCESS", result);

						} else {
							callback("FAILED", result);
						}
					},

					onFailure: function () {
						callback("FAILED");
					}
				});

			}
			catch (e) {
				callback("FAILED");
			}

		},
		updateUserProfile: function (userData, callback) {
			try{
				var self = this;
				var invocationData = {
						adapter: "portalAdapter",
						procedure: "updateUserProfile",
						parameters: [Constants.PORTAL_APP_IDs[Constants.APP_ID], userData.title, userData.firstName,
						             userData.lastName, userData.nationality, userData.mobileNo, userData.userId,
						             userData.prefLanguage, userData.prefComm,
						             userData.email, userData.isEmailVerified, userData.isMobileVerified]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult && result.invocationResult.isSuccessful == true) {
							self.updateProfile("Users", "title_id", userData.title);
							self.updateProfile("Users", "first_name_en", userData.firstName);
							self.updateProfile("Users", "last_name_en", userData.lastName);
							self.updateProfile("Users", "nationality_id", userData.nationality);
							self.updateProfile("Users", "mobile", userData.mobileNo);
							self.updateProfile("Users", "user_id", userData.userId);
							self.updateProfile("Users", "preferred_language", userData.prefLanguage);
							self.updateProfile("Users", "preferred_communication", userData.prefComm)
							self.updateProfile("Users", "mail", userData.email);
							self.updateProfile("Users", "is_email_verified", userData.isEmailVerified);
							self.updateProfile("Users", "is_mobile_verified", userData.isMobileVerified);
							callback("SUCCESS", result);

						} else {
							callback("FAILED", result);
						}
					},

					onFailure: function () {
						callback("FAILED");
					}
				});
			}
			catch (e) {
				callback("FAILED");
			}
		},

		getUserFavoriteServicesFromDB: function (user_id, callback) {
			try{
				var self = this;

				var invocationData = {
						adapter: "userProfile",
						procedure: "getUserFavoriteServices",
						parameters: [user_id]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.statusCode != "500" && result.invocationResult.resultSet.length > 0) {
							callback(self.SUCCESS, result.invocationResult.resultSet);
						}
						else {
							callback(self.EMPTYLIST);
						}
					},

					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}

		},

		deleteUserFavoriteServiceFromDB: function (userServiceDetails, callback) {
			var self = this;
			try{
				var invocationData = {
						adapter: "userProfile",
						procedure: "deleteUserFavoriteService",
						parameters: [userServiceDetails.service_id, userServiceDetails.user_id]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.statusCode != "500" && result.invocationResult.updateStatementResult.updateCount != 0) {
							callback(self.SUCCESS);
						}
						else {
							callback(self.FAILED);
						}

					},

					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},

		setUserFavoriteServiceInDB: function (userServiceDetails, callback) {
			var self = this;
			try{
				var invocationData = {
						adapter: "userProfile",
						procedure: "setUserFavoriteService",
						parameters: [userServiceDetails.service_id, userServiceDetails.user_id, userServiceDetails.service_title]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.updateStatementResult.updateCount != 0) {
							callback(self.SUCCESS);
						}
						else {
							callback(self.FAILED);
						}

					},

					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},

		updateOfflineFavoriteServicesInDB: function (userId, callback) {
			var self = this;
			try{
				var invocationData = {
						adapter: "userProfile",
						procedure: "updateUserFavoriteServices",
						parameters: [userId, JSON.stringify(UserProfileModel.getFavFromStack())]
				};

				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.statusCode != "500" && result.invocationResult.resultSet.length > 0) {
							callback(self.SUCCESS, result.invocationResult.resultSet);
						}
						else {
							callback(self.EMPTYLIST);
						}
					},

					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},

		updateOfflineStack: function (service, action) {
			try{
				UserProfileModel.favoritesStack = UserProfileModel.getFavFromStack();

				var offlineService = {
						action: action,
						ServiceId: service.ServiceId
				}

				var inStack = false;
				for (var i = 0; i < UserProfileModel.favoritesStack.length; i++) {
					if (service.ServiceId == UserProfileModel.favoritesStack[i].ServiceId) {
						inStack = i;
						break;
					}
				}
				if (inStack === false) {
					UserProfileModel.favoritesStack.push(offlineService);
				} else {
					UserProfileModel.favoritesStack.splice(inStack, 1);
				}
				DataUtils.setLocalStorageData("offlineFavStack", JSON.stringify(UserProfileModel.favoritesStack), false, "shell");
			}
			catch (e) {
				console.log(e)
			}
		},

		getFavFromStack: function () {
			try{
				if (UserProfileModel.favoritesStack == null || UserProfileModel.favoritesStack == undefined) {
					var cashedStack = DataUtils.getLocalStorageData("offlineFavStack", "shell");
					if (cashedStack != null) {
						UserProfileModel.favoritesStack = JSON.parse(cashedStack);
					} else {
						UserProfileModel.favoritesStack = [];
					}
				}
				return UserProfileModel.favoritesStack;

			}
			catch (e) {
				console.log(e)
			}
		},

		emptyFavStack: function () {
			UserProfileModel.favoritesStack = [];
			DataUtils.setLocalStorageData("offlineFavStack", JSON.stringify([]), false, "shell");
			return UserProfileModel.favoritesStack;
		},

		mergeFavoritesWithStack: function (favorites) {
			try{
				UserProfileModel.favoritesStack = UserProfileModel.getFavFromStack();

				for (var j = 0; j < UserProfileModel.favoritesStack.length; j++) {
					if (favorites.hasOwnProperty(UserProfileModel.favoritesStack[j].ServiceId)) {
						if (UserProfileModel.favoritesStack[j].action == "remove") {
							delete favorites[UserProfileModel.favoritesStack[j].ServiceId];
						}
					} else {
						if (UserProfileModel.favoritesStack[j].action == "add") {
							var returnItem = ServicesDirectoryModel.returnSubCatAndCatForService(UserProfileModel.favoritesStack[j].ServiceId);
							favorites[UserProfileModel.favoritesStack[j].ServiceId] = {};
							favorites[UserProfileModel.favoritesStack[j].ServiceId].serviceId = UserProfileModel.favoritesStack[j].ServiceId;
							favorites[UserProfileModel.favoritesStack[j].ServiceId].cat = returnItem.Cat_ID;
							//						favorites[UserProfileModel.favoritesStack[j].ServiceId].subCat = returnItem.SubCat_ID;
							favorites[UserProfileModel.favoritesStack[j].ServiceId].serv_url = returnItem.serv_url;
						}
					}
				}

				return favorites;
			}
			catch (e) {
				console.log(e)
			}
		},

		changePassword: function (inputParams, captchaObject, callback) {
			try{
				var self = this;
				var invocationData = {
						adapter: "IAMServicesAdapter",
						procedure: "changePassword",
						parameters: [Constants.PORTAL_APP_IDs[Constants.APP_ID], this.getUserProfile().Users[0].user_id, inputParams.currentPassVal, inputParams.newPassVal, inputParams.confirmPassVal, captchaObject]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.statusCode != "500" && result.invocationResult.success == true) {
							callback(result.invocationResult);
						}
						else {
							callback(result.invocationResult);
						}

					},

					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},
		forgotPassword: function (inputParams, captchaObject, callback) {
			try{
				var self = this;
				var invocationData = {
						adapter: "IAMServicesAdapter",
						procedure: "ForgetPassword",
						parameters: [Constants.PORTAL_APP_IDs[Constants.APP_ID], inputParams.userID, inputParams.newPassVal, inputParams.confirmPassVal, captchaObject]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {
						if (result.invocationResult.isSuccessful && result.invocationResult.statusCode == "200") {
							callback(self.SUCCESS, result.invocationResult.Envelope.Body.resetPasswordResponse);
						}
						else {
							callback(self.FAILED);
						}
					},
					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},

		linkUAEPASSAccount: function (userId, uaepassId, callback) {
			var self = this;
			try{
				//			var userId=userProfile && userProfile.Users[0]?userProfile.Users[0].user_id:null;
				var updatedBy = Constants.PORTAL_APP_IDs[Constants.APP_ID];
				var applicationId = Constants.PORTAL_APP_IDs[Constants.APP_ID];

				var invocationData = {
						adapter: "portalAdapter",
						procedure: "linkUAEPassId",
						parameters: [userId, uaepassId, updatedBy, applicationId]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function (result) {

						if (result.invocationResult.isSuccessful &&
								result.invocationResult.result == "true") {
							// success call and link successfuly 
							callback(self.SUCCESS);
						}
						else {
							callback(self.FAILED);
						}
					},
					onFailure: function () {
						callback(self.FAILED);
					}
				});
			}
			catch (e) {
				callback(self.FAILED);
			}
		},

		destroyUserProfile: function () {
			
			DataUtils.removeFromLocalStorage(USER_PROFILE, "shell");
			//DataUtils.removeFromLocalStorage(USER_SERVICES, "shell");
		}
	});

	return UserProfileModel;
});

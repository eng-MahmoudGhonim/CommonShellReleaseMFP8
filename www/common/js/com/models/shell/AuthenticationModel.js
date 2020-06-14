
/* JavaScript content from js/com/models/shell/AuthenticationModel.js in folder common */
define([

	"jquery",
	"backbone",
	"com/models/Constants",
	"com/utils/DataUtils",
	"com/utils/Utils",
	"com/models/shell/UserProfileModel",
	"com/models/shell/MStoreCoverModel"


], function ($, Backbone, Constants, DataUtils, Utils, UserProfileModel, MStoreCoverModel) {

	var AuthenticationModel = Backbone.Model.extend({}, {
		SUCCESS: "SUCCESS",
		FAILED: "FAILED",
		LOCAL_STORAGE_MSTORE: "MSTORE_CARDS",
		LOCAL_STORAGE_ACTIVITIES: "RECENT_ACTIVITIES",

		logout: function (redirectPage) {
			$(".ui-loader").show();
			try {
				//Unsubscribe from push notification
				if (isPushSubscribed()) {
					doUnsubscribe();
				}
				if (Constants.showLoyalty) {
					// remove loyalty
					DataUtils.removeFromLocalStorage("niLoyalty", "shell");
					DataUtils.setLocalStorageData('niLoyalty', "", true, "shell");
				}
				this.deAuthenticate(redirectPage, function () {
					var sidepanel = MobileRouter.getSidePanel();
					sidepanel.updateSidePanel();
					DataUtils.removeFromLocalStorage("userFavoritServices", "shell");
					DataUtils.removeFromLocalStorage("offlineFavStack", "shell");
					DataUtils.removeFromLocalStorage("OTP", "shell");
					DataUtils.removeFromLocalStorage("GreenPoints", "shell");
					DataUtils.removeFromLocalStorage("MSTORE_CARDS", "shell");

					DataUtils.setLocalStorageData('isLoggedIn', "false", false, 'shell');
					UserProfileModel.favoritesStack = [];

					var data = DataUtils.getLocalStorageData("userProfile", "shell");
					if (data) {
						data = JSON.parse(data);
					}
					var username = data && data.Users[0].user_id;
					//					DataUtils.removeFromLocalStorage('userprofileImg'+username,"shell")


					Utils.loadEntryPage();
					document.dispatchEvent(logoutEventSuccess);
					try {
						MStoreCoverModel.destroyStoredData();
					} catch (e) { }
					$(".ui-loader").hide();
				});
			} catch (e) {
				$(".ui-loader").hide();
			}
		},
		registerAmUser: function (input, captchaObject, callback) {
			var self = this;

			var invocationData = {
				adapter: "amRegisterationAdapter",
				procedure: "createIndividualUser",
				parameters: [input.userName,
				input.email,
				input.mobileNo,
				input.password,
				input.title,
				input.firstName,
				input.lastName,
				input.nationality,
				input.prefLanguage,
				Constants.PORTAL_APP_IDs[Constants.APP_ID],
				input.isEmailVerified,
				input.isMobileVerified,
					captchaObject
				]
			};

			invokeWLResourceRequest(invocationData,
				function (result) {
					callback(self.SUCCESS, result);
				},

				function () {
					callback(self.FAILED);
				}

			);
		},
		checkUserIdAvailability: function (userId, callback) {
			var self = this;

			var invocationData = {
				adapter: "portalAdapter",
				procedure: "checkUserAvailability",
				parameters: [userId, Constants.PORTAL_APP_IDs[Constants.APP_ID]]
			};

			invokeWLResourceRequest(invocationData,
				function (result) {
					callback(self.SUCCESS, result.invocationResult);
				},

				function (e) {
					callback(self.FAILED);
				}

			);
		},


		requestAuthentication: function (callback) {

			console.log(">> requestAuthentication : changepage");
			try {

				this.logout();
			} catch (e) {

			}

			if (callback) {
				callback();
			}
		},

		authenticate: function (type, username, password, appID, onSuccess, onError) {
			UserProfileModel.destroyUserProfile();
			try {
				MStoreCoverModel.destroyStoredData();
			} catch (e) { }
			var credentialsValidationResponse = this.isValidCredentials(username, password);
			if (type == "UAEPassLogin") {
				credentialsValidationResponse = true;
			}
			if (credentialsValidationResponse == true) {
				afterAuthenticationCompleted.onSuccess = onSuccess;
				afterAuthenticationCompleted.onFailure = onError;
				WL.Client.updateUserInfo();
				this.deAuthenticate(null, function () {
					WL.Client.updateUserInfo();
					if (type == "IAMLogin") {
						amAdapterAuthChallengeHandler.userId = username;
						amAdapterAuthChallengeHandler.password = password;
						var invocationData = {
							adapter: "authenticationIAM",
							procedure: "authenticate",
							parameters: [username, password, appID]
						};

						amAdapterAuthChallengeHandler.submitAdapterAuthentication(invocationData, {
							timeout: 180000
						});
					} else if (type == "MYIDLogin") {
						var invocationData = {
							adapter: "authenticationMyID",
							procedure: "authenticate",
							parameters: [username, password, Constants.CLAIM_INDEX, ""]
						};

						adapterAuthChallengeHandler.submitAdapterAuthentication(invocationData, {
							timeout: 180000
						});
					} else if (type == "UAEPassLogin") {
						var code = username;
						var invocationData = {
							adapter: "authenticationUAEPass",
							procedure: "submitAuthentication",
							parameters: [code, appID]
						};

						uaePassAdapterAuthChallengeHandler.submitAdapterAuthentication(invocationData, {
							timeout: 180000
						});
					}
				});
			} else {
				if (onError) {
					onError(credentialsValidationResponse);
				}
			}
		},
		deAuthenticate: function (redirectPage, callback) {
			var self = this;

			//Unsubscribe from receiving notifications
			doUnsubscribe();

			try {
				self.clearLocalData();

				//WL.Client.deleteUserPref("activeUserId");
				//MGRT71
			//	WL.Device.getNetworkInfo(function (networkInfo) {
			//		if ((networkInfo && networkInfo.isNetworkConnected == "true")) {
	if (Utils.IS_NETWORK_CONNECTED==true) {
						self.logutAMAdapterAuthRealm(redirectPage, callback);
					} else {
						if (redirectPage) {
							self.reloadApp(redirectPage);
						}
						if (callback) {
							callback();
						}
					}
			//	});
			}
			catch (e) {
				console.log("User was logged out before");
			}
		},

		clearLocalData: function () {
			UserProfileModel.destroyUserProfile();
			DataUtils.removeFromLocalStorage(self.LOCAL_STORAGE_MSTORE, 'shell');
			DataUtils.removeFromLocalStorage(self.LOCAL_STORAGE_ACTIVITIES, 'shell');
		},
		logutAMAdapterAuthRealm: function (redirectPage, callback) {
			var self = this;

			try {
				WL.Client.logout('AMAdapterAuthRealm', {
					onSuccess: function () {
						self.logutAdapterAuthRealm(redirectPage, callback);
					},
					onFailure: function () {
						self.logutAdapterAuthRealm(redirectPage, callback);
					}
				});
			} catch (e) {
				self.logutMasterAuthRealm(redirectPage, callback);
			}
		},
		logutAdapterAuthRealm: function (redirectPage, callback) {
			var self = this;

			try {
				WL.Client.logout('AdapterAuthRealm', {
					onSuccess: function () {
						self.logutUAEPassAdapterAuthRealm(redirectPage, callback);
					},
					onFailure: function () {
						self.logutUAEPassAdapterAuthRealm(redirectPage, callback);
					}
				});
			} catch (e) {
				self.logutUAEPassAdapterAuthRealm(redirectPage, callback);
			}
		},
		logutUAEPassAdapterAuthRealm: function (redirectPage, callback) {
			var self = this;

			try {
				WL.Client.logout('UAEPassAdapterAuthRealm', {
					onSuccess: function () {
						self.logutMasterAuthRealm(redirectPage, callback);
					},
					onFailure: function () {
						self.logutMasterAuthRealm(redirectPage, callback);
					}
				});
			} catch (e) {
				self.logutMasterAuthRealm(redirectPage, callback);
			}
		},
		logutMasterAuthRealm: function (redirectPage, callback) {
			var self = this;

			try {
				WL.Client.logout('masterAuthRealm', {
					onSuccess: function () {
						if (redirectPage) {
							self.reloadApp(redirectPage);
						}
						if (callback) {
							callback();
						}
					},
					onFailure: function () {
						if (redirectPage) {
							self.reloadApp(redirectPage);
						}
						if (callback) {
							callback();
						}
					}
				});
			} catch (e) {
			}
		},

		getActiveUserId: function () {
			var activeUserId = null;

			if (this.isAuthenticated()) {
				activeUserId = WL.Client.getUserPref("activeUserId");
			}
			else if (this.isAuthenticatedWithServer()) {
				activeUserId = WL.Client.getUserInfo("masterAuthRealm", "userId");
				WL.Client.setUserPref("activeUserId", activeUserId);
			}

			return activeUserId;
		},

		isAuthenticated: function () {
			return UserProfileModel.isUserProfileCached();
		},

		isAuthenticatedWithServer: function () {
			if (WL.Client.isUserAuthenticated("masterAuthRealm") == true) {
				var activeUserId = WL.Client.getUserInfo("masterAuthRealm", "userId");
				return (activeUserId != undefined && activeUserId != null && activeUserId != "");
			}

			return false;
		},

		isValidCredentials: function (username, password) {
			if (username && password) {
				return true;
			}

			var errorDetails = {
				failure: {
					errorCode: "01"
				}
			};

			return errorDetails;
		},

		isValidToken: function (token) {
			if (token) {
				return true;
			}

			var errorDetails = {
				failure: {
					errorCode: "01"
				}
			};

			return errorDetails;
		},

		reloadApp: function (redirectPage) {
			UserProfileModel.destroyUserProfile();
			try {
				MStoreCoverModel.destroyStoredData();
			} catch (e) { }
			if (redirectPage) {
				var historyLength = history.length;
				window.history.go(-historyLength);
				mobile.changePage(redirectPage, { changeHash: true });
			} else {
				Utils.loadEntryPage();
			}
		},

		generateUAEPASSURL: function (callback) {

			var self = this;
			var invocationData = {
				adapter: "authenticationUAEPass",
				procedure: "generateUAEPassURL",
				parameters: [Constants.PORTAL_APP_IDs[Constants.APP_ID]]
			};

			invokeWLResourceRequest(invocationData,
			function (result) {
					if (result.invocationResult && result.invocationResult.URL)
						callback(result.invocationResult.URL);
				},

				function (e) {
					callback();
				}

			);


		}
	});

	return AuthenticationModel;

});

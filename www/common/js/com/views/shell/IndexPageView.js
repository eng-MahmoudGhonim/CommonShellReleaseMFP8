define(["com/views/PageView", "com/utils/Utils", "com/utils/DataUtils", "com/models/shell/UserProfileModel", "com/models/shell/MessagesModel", "com/models/Constants", "com/models/shell/AuthenticationModel", ], function(PageView, Utils, DataUtils, UserProfileModel, MessagesModel, Constants, AuthenticationModel) {
	var IndexPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			_indexPageViewInstance = this;
			if (!options) {
				options = {};
			}
			options.hideHeader = true;
			options.hideFooter = true;
			options.hideSidePanel = true;
			PageView.prototype.initialize.call(_indexPageViewInstance, options);
			document.addEventListener("online", function() {
				// Sync pending tasks with server
				try {
					WL.Client.connect({
						onSuccess: function() {
							MessagesModel.syncPendingTasks();
						},
						onFailure: function() {},
						timeout: 5000
					});
				} catch (e) {}
				//
			}, false);
			document.addEventListener("offline", function() {
				console.log("going offline");
				var header = MobileRouter.getHeader();
				if (header.options && header.options.enabledInternetManagament != false) header.handleOfflineMode();
			}, false);
			document.addEventListener("online", function() {
					console.log("going online");
					var header = MobileRouter.getHeader();
					if (header.options && header.options.enabledInternetManagament != false) header.handleOnlineMode();
			}, false);
			document.addEventListener(WL.Events.WORKLIGHT_IS_CONNECTED, function() {
				console.log("Worklight Connected");
			}, false);
			document.addEventListener(WL.Events.WORKLIGHT_IS_DISCONNECTED, function() {
				console.log("Worklight DisConnected");
			}, false);
		},
		loadofflineBoard: function() {
			//Subscribe to push notification
			if (!isPushSubscribed()) {
				doSubscribe();
			}
			Utils.loadHomePage();
		},
		handleLoggedInUserOffline: function() {
			console.log('Off-line mode');
			Utils.loadHomePage();
		},
		handleLoggedInUserOnline: function() {
			try {
				console.log('Check Online mode');
				var invocationData = {
					adapter: 'authenticationMaster',
					procedure: 'heartbeat',
					parameters: []
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function(e) {
						console.log('Online mode');
						console.log("heartbeat onSuccess : " + JSON.stringify(e));
						if (AuthenticationModel.isAuthenticatedWithServer()) {
							var user_id = AuthenticationModel.getActiveUserId();
							//Subscribe to push notification
							if (user_id && !isPushSubscribed()) {
								doSubscribe();
							}
							if (user_id) {
								_indexPageViewInstance.loadUserProfileData(user_id);
							} else {
								AuthenticationModel.logout();
							}
						}
					},
					onFailure: function(e) {
						console.log("heartbeat onFailure : " + JSON.stringify(e));
						if (e.errorCode && e.errorCode == "REQUEST_TIMEOUT") {
							_indexPageViewInstance.handleLoggedInUserOffline();
						} else {
							AuthenticationModel.logout();
						}
					},
					timeout: 5000
				});
			} catch (e) {
				AuthenticationModel.logout();
			}
		},
		handleLoggedInUser: function() {
			if (navigator.onLine) {
				_indexPageViewInstance.handleLoggedInUserOnline();
			} else {
				_indexPageViewInstance.handleLoggedInUserOffline();
			}
		},
		handleGuestUser: function() {
			DataUtils.setLocalStorageData('isLoggedIn', "false", false, 'shell');
			Utils.loadHomePage(true);
		},
		onPageShow: function() {
			if (AuthenticationModel.isAuthenticated()) {
				this.handleLoggedInUser();
			} else {
				this.handleGuestUser();
			};
		},
		loadUserProfileData: function(user_id) {
			var invocationData = {
				adapter: 'userProfile',
				procedure: 'getUserProfile',
				parameters: [user_id]
			};
			WL.Client.invokeProcedure(invocationData, {
				onSuccess: function(response) {
					if (response.status == 200) {
						var result = response.invocationResult;
						delete result.responseID;
						delete result.isSuccessful;
						UserProfileModel.destroyUserProfile();
						UserProfileModel.setUserProfile(result);
						Utils.loadHomePage();
					}
				},
				onFailure: function(response) {
					_indexPageViewInstance.loadofflineBoard();
				},
				timeout: 90000
			});
		},
		dispose: function() {
			PageView.prototype.dispose.call(_indexPageViewInstance);
		},
	});
	// Returns the View class
	return IndexPageView;
});

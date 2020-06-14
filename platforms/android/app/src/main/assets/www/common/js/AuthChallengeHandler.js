
/* JavaScript content from js/AuthChallengeHandler.js in folder common */
var MAX_UNEXPECTED_SERVER_TRIALS = 10;
var UNEXPECTED_SERVER_TRIALS_WAIT = 500;

var authenticationHandler = {};
var afterAuthenticationCompleted = {};

var masterAuthChallengeHandler = WL.Client.createChallengeHandler("masterAuthRealm");
var adapterAuthChallengeHandler = WL.Client.createChallengeHandler("AdapterAuthRealm");
var amAdapterAuthChallengeHandler = WL.Client.createChallengeHandler("AMAdapterAuthRealm");
var uaePassAdapterAuthChallengeHandler = WL.Client.createChallengeHandler("UAEPassAdapterAuthRealm");



amAdapterAuthChallengeHandler.userId = null;
amAdapterAuthChallengeHandler.userPassword = null;
amAdapterAuthChallengeHandler.userProfileForLinking = null;
amAdapterAuthChallengeHandler.response = null;
adapterAuthChallengeHandler.response = null;
uaePassAdapterAuthChallengeHandler.response = null;


define(["com/utils/Utils",
	"com/models/shell/AuthenticationModel",
	"com/models/shell/UserProfileModel",
	"com/models/Constants"
], function (Utils, AuthenticationModel, UserProfileModel, Constants) {

	masterAuthChallengeHandler.isCustomResponse = function (response) {
		try {
			console.log("masterAuthChallenge Calling adapter : " + response.request.parameters.adapter + ", procedure : " + response.request.parameters.procedure + ", parameters : " + response.request.parameters.parameters);
		} catch (e) { }
		console.log(response);
		//       WL.Client.updateUserInfo();
		console.log("User Authentication with the server");
		console.log(WL.Client.isUserAuthenticated("masterAuthRealm"));
		if (response && response.responseJSON && response.responseText != null
			&& response.request.parameters.adapter != "authenticationIAM"
			&& response.request.parameters.adapter != "authenticationMyID"
			&& response.request.parameters.adapter != "authenticationUAEPass"
			&& response.request.parameters.adapter != "PushAdapter") {
			if (typeof (response.responseJSON.authRequired) !== 'undefined' &&
				response.responseJSON.name == "authenticationMaster") {
				if (response.responseJSON.authRequired == true && AuthenticationModel.isAuthenticated()) {
					AuthenticationModel.logout();
				}
			}
		}
		if (!response || !response.responseJSON || response.responseText === null) {
			return false;
		}
		if (typeof (response.responseJSON.authRequired) !== 'undefined' && response.responseJSON.name == "authenticationMaster") {
			return true;
		} else {
			return false;
		}
	};
	adapterAuthChallengeHandler.isCustomResponse = function (response) {
		if (!response || !response.responseJSON || response.responseText === null) {
			return false;
		}
		if (typeof (response.responseJSON.authRequired) !== 'undefined' && response.responseJSON.name == "authenticationMyID") {
			return true;
		} else {
			return false;
		}
	};
	amAdapterAuthChallengeHandler.isCustomResponse = function (response) {
		if (!response || !response.responseJSON || response.responseText === null) {
			return false;
		}
		if (typeof (response.responseJSON.authRequired) !== 'undefined' && response.responseJSON.name == "authenticationIAM") {
			return true;
		} else {
			return false;
		}
	};
	uaePassAdapterAuthChallengeHandler.isCustomResponse = function (response) {
		if (!response || !response.responseJSON || response.responseText === null) {
			return false;
		}
		if (typeof (response.responseJSON.authRequired) !== 'undefined' && response.responseJSON.name == "authenticationUAEPass") {
			return true;
		} else {
			return false;
		}
	};
	masterAuthChallengeHandler.handleChallenge = function (response) {
		console.log("masterAuthChallengeHandler handleChallenge");
		console.log(response);
		var authRequired = response.responseJSON.authRequired;
		if (authRequired == true) {
			console.log("masterAuthChallengeHandler.handleChallenge :: Master authentication failed");
			masterAuthChallengeHandler.submitFailure(response);
		} else if (authRequired == false) {
			console.log("masterAuthChallengeHandler.handleChallenge :: Master authentication succeeded");
			masterAuthChallengeHandler.submitSuccess(response);
		}
	};
	adapterAuthChallengeHandler.handleChallenge = function (response) {
		console.log("adapterAuthChallengeHandler handleChallenge");
		console.log(response);
		UserProfileModel.destroyUserProfile();

		var authRequired = response.responseJSON.authRequired;
		if (authRequired == true) {
			console.log("adapterAuthChallengeHandler.handleChallenge :: Adapter authentication failed");
			adapterAuthChallengeHandler.submitFailure(response);
		} else if (authRequired == false) {
			console.log("adapterAuthChallengeHandler.handleChallenge :: Adapter authentication succeeded");
			adapterAuthChallengeHandler.submitSuccess(response);
		}
	};
	amAdapterAuthChallengeHandler.handleChallenge = function (response) {
		console.log("amAdapterAuthChallengeHandler handleChallenge");
		console.log(response);
		UserProfileModel.destroyUserProfile();

		var authRequired = response.responseJSON.authRequired;
		if (authRequired == true) {
			console.log("amAdapterAuthChallengeHandler.handleChallenge :: Adapter authentication failed");
			amAdapterAuthChallengeHandler.submitFailure(response);
		} else if (authRequired == false) {
			console.log("amAdapterAuthChallengeHandler.handleChallenge :: Adapter authentication succeeded");
			amAdapterAuthChallengeHandler.submitSuccess(response);
		}
	};


	uaePassAdapterAuthChallengeHandler.handleChallenge = function (response) {
		console.log("uaePassAdapterAuthChallengeHandler handleChallenge");
		console.log(response);
		UserProfileModel.destroyUserProfile();

		var authRequired = response.responseJSON.authRequired;
		if (authRequired == true) {
			console.log("uaePassAdapterAuthChallengeHandler.handleChallenge :: Adapter authentication failed");
			uaePassAdapterAuthChallengeHandler.submitFailure(response);
		} else if (authRequired == false) {
			console.log("uaePassAdapterAuthChallengeHandler.handleChallenge :: Adapter authentication succeeded");
			uaePassAdapterAuthChallengeHandler.submitSuccess(response);
		}
	};


	masterAuthChallengeHandler.submitSuccess = function (response) {
		console.log('masterAuthChallengeHandler.submitSuccess');
		console.log(response);
	};
	masterAuthChallengeHandler.submitFailure = function (response) {
		console.log('masterAuthChallengeHandler.submitFailure');
		console.log(response);
		UserProfileModel.destroyUserProfile();
		afterAuthenticationCompleted.redirectToBase();
	};
	adapterAuthChallengeHandler.submitSuccess = function (response) {
		console.log('adapterAuthChallengeHandler.submitSuccess');
		console.log(response);

		//Subscribe to receive notifications
		doSubscribe();

		if (response && response.responseJSON) {
			if (response.responseJSON.havePortalAccount && response.responseJSON.userProfile) {
				WL.Client.setUserPref("activeUserId", response.responseJSON.userProfile.Users[0].user_id);
				WL.Client.setUserPref("recentUserIdMyId", response.responseJSON.userProfile.Users[0].cn);
				var profile = response.responseJSON.userProfile.Users[0]
				//				if(profile.mobile[0] != "0" && profile.mobile[1] != "0"){
				//				response.responseJSON.userProfile.Users[0].mobile =
				//				"00" + profile.mobile;
				//				}
				UserProfileModel.setUserProfile(response.responseJSON.userProfile);
				UserProfileModel.setServiceRelatedInfo(response.responseJSON.serviceRelatedInfo);

			}

			afterAuthenticationCompleted.onSuccess(response);
		}
	};

	adapterAuthChallengeHandler.submitFailure = function (response) {
		console.log('adapterAuthChallengeHandler.submitFailure');
		console.log(response);
		UserProfileModel.destroyUserProfile();

		afterAuthenticationCompleted.redirectToBase();

		var errorDetails = {
			failure: {
				errorCode: "99"
			}
		};

		if (response && response.responseJSON && response.responseJSON.errorMessage && response.responseJSON.errorMessage.failure) {
			errorDetails = response.responseJSON.errorMessage;
		}

		afterAuthenticationCompleted.onFailure(errorDetails);
	};

	amAdapterAuthChallengeHandler.submitSuccess = function (response) {
		console.log('amAdapterAuthChallengeHandler.submitSuccess');
		console.log(response);
		//Subscribe to receive notifications
		doSubscribe();

		//		amAdapterAuthChallengeHandler.syncWithServer();
		if (response && response.responseJSON) {
			var activeUserId = response.responseJSON.userProfile.Users[0].user_id;
			WL.Client.setUserPref("activeUserId", activeUserId);
			WL.Client.setUserPref("recentUserIdIAM", activeUserId);
			var profile = response.responseJSON.userProfile.Users[0];
			UserProfileModel.setUserProfile(response.responseJSON.userProfile);
			UserProfileModel.setServiceRelatedInfo(response.responseJSON.serviceRelatedInfo);



			if (amAdapterAuthChallengeHandler.userProfileForLinking) {
				console.log('amAdapterAuthChallengeHandler :: userProfileForLinking');

				var MYIDuserProfile = amAdapterAuthChallengeHandler.userProfileForLinking;
				var portalProfile = response.responseJSON.userProfile.Users[0];
				if (!portalProfile.title_en) {
					portalProfile.title_en = "Mr";
				}

				//afterAuthenticationCompleted.onSuccess(response);

				var invocationDataPortal = {
					adapter: 'portalAdapter',
					procedure: 'linkEmiratesId',
					parameters: [portalProfile.user_id, MYIDuserProfile.id_number, "true", Constants.PORTAL_APP_IDs[Constants.APP_ID]],
					timeout: 180000
				};
				invokeWLResourceRequest(invocationDataPortal,
					function (result) {
						console.log('portalAdapter->linkEmiratesId:onSuccess() called');
						amAdapterAuthChallengeHandler.userProfileForLinking = null;
						if (result && result.invocationResult) {
							console.log('amAdapterAuthChallengeHandler :: linkEmiratesId :: onSuccess');
							if (result.invocationResult.success && result.invocationResult.success == true) {
								afterAuthenticationCompleted.onSuccess(result.invocationResult);
							} else {
								afterAuthenticationCompleted.onFailure(result.invocationResult);
							}
						}
					},
					function (result) {
						console.log('amAdapterAuthChallengeHandler :: linkEmiratesId :: onFailure');

						amAdapterAuthChallengeHandler.userProfileForLinking = null;
						afterAuthenticationCompleted.onFailure({
							failure: {
								errorCode: "99"
							}
						});
					}

				);
			} else if (amAdapterAuthChallengeHandler.userProfileForLinkingUAEPass) {
				console.log('amAdapterAuthChallengeHandler :: userProfileForLinkingUAEPass');

				var UAEPassUserProfile = amAdapterAuthChallengeHandler.userProfileForLinkingUAEPass;
				var portalProfile = response.responseJSON.userProfile.Users[0];
				if (!portalProfile.title_en) {
					portalProfile.title_en = "Mr";
				}
				UserProfileModel.linkUAEPASSAccount(portalProfile.user_id, UAEPassUserProfile.uuid, function (response) {

					console.log('portalAdapter->linkUAEPass:onSuccess() called');
					amAdapterAuthChallengeHandler.userProfileForLinkingUAEPass = null;
					if (response == UserProfileModel.SUCCESS) {
						// Success Linked popup with UAE PAss
						//TODO hanling linking success popup
						//	if ($(".ui-loader"))
						//	{$(".ui-loader").hide();}
						//var successLinkedWithUAEPass=new Popup("successLinkUAEPassPopup");
						//successLinkedWithUAEPass.show();
						console.log('amAdapterAuthChallengeHandler :: linkUAEPass :: onSuccess');
						afterAuthenticationCompleted.onSuccess();
					} else {
						afterAuthenticationCompleted.onFailure();
					}
				});


			} else {
				afterAuthenticationCompleted.onSuccess(response);
			}
		}

	};

	amAdapterAuthChallengeHandler.submitFailure = function (response) {
		console.log('amAdapterAuthChallengeHandler.submitFailure');
		console.log(response);
		UserProfileModel.destroyUserProfile();

		afterAuthenticationCompleted.redirectToBase();

		var errorDetails = {
			failure: {
				errorCode: "99"
			}
		};

		if (response && response.responseJSON && response.responseJSON.errorMessage && response.responseJSON.errorMessage.failure) {
			errorDetails = response.responseJSON.errorMessage;
		}

		afterAuthenticationCompleted.onFailure(errorDetails);
	};


	uaePassAdapterAuthChallengeHandler.submitSuccess = function (response) {
		console.log('uaePassAdapterAuthChallengeHandler.submitSuccess');
		console.log(response);
		doSubscribe();

		if (response && response.responseJSON) {
			if (response.responseJSON.havePortalAccount && response.responseJSON.userProfile) {
				console.log("activeUserId");
				console.log(response.responseJSON.userProfile.Users[0].user_id);
				console.log(response.responseJSON.userProfile.Users[0].cn);
				WL.Client.setUserPref("activeUserId", response.responseJSON.userProfile.Users[0].user_id);
				WL.Client.setUserPref("recentUserIdUAEPASS", response.responseJSON.userProfile.Users[0].cn);
				var profile = response.responseJSON.userProfile.Users[0]
				UserProfileModel.setUserProfile(response.responseJSON.userProfile);
				UserProfileModel.setServiceRelatedInfo(response.responseJSON.serviceRelatedInfo);
			}
			setTimeout(function () {
				afterAuthenticationCompleted.onSuccess(response);
			}, 2000);

		}
	};

	uaePassAdapterAuthChallengeHandler.submitFailure = function (response) {
		console.log('uaePassAdapterAuthChallengeHandler.submitFailure');
		console.log(response);
		UserProfileModel.destroyUserProfile();

		// Fail UAE PASS LOgin Popup
		if (LoginViewInstance) {
			LoginViewInstance.LoginPopup.hide();
			$(".ui-loader").hide();
		}
		var loginFailUAEPassPopup_Options = {
			popupId: "loginFailUAEPassPopup",
			title: localize("%shell.Login.loginUAEPASS%"),
			content: window.Utils.applyLocalization('<div class="loginUAEPASSPopupContent"><img class="loginUAEPASSLogo"></div>' +
				'<div class="loginUAEPASSIconChecked  errorUAEPASSLogin icon-danger"></div> ' +
				'<div class="loginUAEPASSCongratulation">%shell.OTPVerificationLimitPopup.title%</div> ' +
				'<div class="loginUAEPASSBody">%shell.Login.FailLoginUAEPassContent%</div>'
			),

			primaryBtnCallBack: function () {

			},
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: function () {

			}
		}
		var loginFailUAEPassPopup = new Popup(loginFailUAEPassPopup_Options);
		setTimeout(function () {
			loginFailUAEPassPopup.show();
		}, 600);


		afterAuthenticationCompleted.redirectToBase();

		var errorDetails = {
			failure: {
				errorCode: "99"
			}
		};

		if (response && response.responseJSON && response.responseJSON.errorMessage && response.responseJSON.errorMessage.failure) {
			errorDetails = response.responseJSON.errorMessage;
		}

		afterAuthenticationCompleted.onFailure(errorDetails);
	};




	afterAuthenticationCompleted.redirectToBase = function () {
		console.log("afterAuthenticationCompleted.redirectToBase");

		var currentPage = $.mobile.activePage[0].baseURI.split('/');
		currentPage = currentPage[currentPage.length - 1];

		if (window.loginProcessing != true) {
			AuthenticationModel.requestAuthentication();
		}
	};

	afterAuthenticationCompleted.onSuccess = function () {
		// Body of this function will be override-d in application Models.
	};

	afterAuthenticationCompleted.onFailure = function () {
		// Body of this function will be override-d in application Models.
	};

	authenticationHandler.getAuthenticationErrorMessageByCode = function (errorCode) {
		console.log('authenticationHandler.getAuthenticationErrorMessageByCode');
		var lang = getApplicationLanguage()
		var errorInvalidCredentials = Globalize.localize("%shell.error.auth.99%", lang);

		if (errorCode == "01") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.01%", lang);
		} else if (errorCode == "02") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.02%", lang);
		} else if (errorCode == "03") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.03%", lang);
		} else if (errorCode == "04") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.04%", lang);
		} else if (errorCode == "05") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.05%", lang);
		} else if (errorCode == "77") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.77%", lang);
		} else if (errorCode == "99") {
			errorInvalidCredentials = Globalize.localize("%shell.error.auth.99%", lang);
		}

		return errorInvalidCredentials;
	};
});

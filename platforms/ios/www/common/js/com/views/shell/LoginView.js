
/* JavaScript content from js/com/views/shell/LoginView.js in folder common */

/* JavaScript content from js/com/views/shell/LoginView.js in folder common */
define(["com/models/Constants", "com/utils/TemplateUtils", "com/models/shell/AuthenticationModel", "com/models/shell/PasswordModel", "com/models/shell/ActivityLoggerModel", "com/models/shell/UserProfileModel", "com/utils/DataUtils", "com/utils/Utils", "com/models/corporates/CorporateDashboardModel", "AuthChallengeHandler", "deserialize"], function (Constants, TemplateUtils, AuthenticationModel, PasswordModel, ActivityLoggerModel, UserProfileModel, DataUtils, Utils, CorporateDashboardModel) {
	var LoginView = Backbone.View.extend({
		initialize: function (options) {
			LoginViewInstance = this;
			LoginViewInstance.rememberRTALogin = true;
			//LoginViewInstance.rememberMYIDLogin = true;
			var url = MobileRouter.baseUrl + '/common/pages/shell/login_popup.html';
			var onTemplate = function (loginContent) {
				//				console.log("login html ");
				var LoginPopup_Options = {
						popupId: "LoginPopup",
						title: localize("%shell.MyDocs.Login%"),
						content: loginContent,
						primaryBtnText: localize("%shell.login.loginAccount%"),
						primaryBtnCallBack: null,
						primaryBtnDisabled: true,
						secondaryBtnText: localize("%shell.login.registerAccount%"),
						secondaryBtnCallBack: function () {
							LoginViewInstance.LoginPopup.hide();
							mobile.changePage("shell/register.html");
						},
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: false,
						hideOnSecondaryClick: false,
						aroundClickable: true,
						onAroundClick: null
				}
				var options = {
						startIndex: 0,
						touchEnabled: false,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				LoginViewInstance.LoginPopup = new Popup(LoginPopup_Options);
				LoginViewInstance.LoginPopup.onHide = function () {
					var usernameField = document.querySelector("#usernameField");
					var passwordField = document.querySelector("#passwordField");
					/*var myIdUsernameField = document.querySelector("#myIdUsernameField");
					var passwordMyIdField = document.querySelector("#passwordMyIdField");*/
					usernameField.classList.remove("valid");
					passwordField.classList.remove("valid");
					//myIdUsernameField.classList.remove("valid");
					//passwordMyIdField.classList.remove("valid");
				}
				LoginViewInstance.LoginPopup.tabs = new Tabs(LoginViewInstance.LoginPopup.el.querySelector(".tabsCont"), options);
				LoginViewInstance.LoginPopup.tabs.onIndexChange = LoginViewInstance.updateUpdateBtn;
				LoginViewInstance.LoginPopup.onShow = LoginViewInstance.onShow;
				LoginViewInstance.LoginPopup.onBeforeShow = LoginViewInstance.onBeforeShow;
				LoginViewInstance.rtaUserName = LoginViewInstance.LoginPopup.el.querySelector("#usernameInput");
				LoginViewInstance.rtaPassword = LoginViewInstance.LoginPopup.el.querySelector("#passwordInput")
				//LoginViewInstance.myIdUserName = LoginViewInstance.LoginPopup.el.querySelector("#myIdInput")
				//LoginViewInstance.myIdPassword = LoginViewInstance.LoginPopup.el.querySelector("#myIdpasswordInput")
				LoginViewInstance.LoginPopup.options.primaryBtnCallBack = function () {
					if (LoginViewInstance.LoginPopup.tabs.index == 0) {
						LoginViewInstance.onRTALogin(LoginViewInstance.rtaUserName.value, LoginViewInstance.rtaPassword.value);
					}
					else if (LoginViewInstance.LoginPopup.tabs.index == 1) { // UAE Pass Action
						LoginViewInstance.onUAEPassLogin(); //start login with UAE Pass
					}
					/*else {
						LoginViewInstance.onMyIdLogin(LoginViewInstance.myIdUserName.value, LoginViewInstance.myIdPassword.value);
					}*/
				}
				LoginViewInstance.LoginPopup.el.querySelector("#forgetPasswordRTA").onclick = function () {
					LoginViewInstance.LoginPopup.hide(function () {
						if (typeof CommonShellServicesConfig[Constants.APP_ID].ForgotPassword == "function") {
							CommonShellServicesConfig[Constants.APP_ID].ForgotPassword();
						} else {
							mobile.changePage("shell/forgotPassword.html");
						}
					});
				};
				/*LoginViewInstance.LoginPopup.el.querySelector("#forgetPasswordMYID").onclick = function () {
					LoginViewInstance.LoginPopup.hide(function () {
						window.open('https://myid.dubai.gov.ae/ForgotPassword.aspx', '_system');
					});
				};*/
				/*LoginViewInstance.LoginPopup.el.querySelector("#forgetUserMYID").onclick = function () {
					LoginViewInstance.LoginPopup.hide(function () {
						window.open('https://myid.dubai.gov.ae/ForgotPassword.aspx', '_system');
					});
				};*/
				LoginViewInstance.LoginPopup.el.querySelector("#rememberMeRTA").onclick = function () {
					LoginViewInstance.rememberRTALogin == true ? LoginViewInstance.rememberRTALogin = false : LoginViewInstance.rememberRTALogin = true;
					if (LoginViewInstance.rememberRTALogin == true) {
						this.getElementsByTagName('i')[0].classList.add('mdi')
						this.getElementsByTagName('i')[0].classList.add('mdi-check')
					} else {
						this.getElementsByTagName('i')[0].classList.remove('mdi')
						this.getElementsByTagName('i')[0].classList.remove('mdi-check')
					}
				};
				LoginViewInstance.LoginPopup.el.querySelector("#forgetUserRTA").onclick = function () {
					LoginViewInstance.LoginPopup.hide(function () {
						if (getApplicationLanguage() == 'en') {
							window.open("https://www.rta.ae/wps/portal/rta/ae/home/forgot-username/?lang=en", "_system")
						} else {
							window.open("https://www.rta.ae/wps/portal/rta/ae/home/forgot-username/?lang=ar", "_system")
						}
					});
				};
				/*LoginViewInstance.LoginPopup.el.querySelector("#rememberMeMyID").onclick = function () {
					LoginViewInstance.rememberMYIDLogin == true ? LoginViewInstance.rememberMYIDLogin = false : LoginViewInstance.rememberMYIDLogin = true;
					if (LoginViewInstance.rememberMYIDLogin == true) {
						this.getElementsByTagName('i')[0].classList.add('mdi')
						this.getElementsByTagName('i')[0].classList.add('mdi-check')
					} else {
						this.getElementsByTagName('i')[0].classList.remove('mdi')
						this.getElementsByTagName('i')[0].classList.remove('mdi-check')
					}
				};*/
				document.querySelector('#LoginPopup #usernameInput').onkeyup = function (e) {
					if (e.keyCode == 13) document.querySelector('#LoginPopup #passwordInput').focus();
				}
				document.querySelector('#LoginPopup #passwordInput').onkeyup = function (e) {
					if (e.keyCode == 13) LoginViewInstance.handleGoButtonAction(e);
				}
				/*document.querySelector('#LoginPopup #myIdInput').onkeyup = function (e) {
					if (e.keyCode == 13) document.querySelector('#LoginPopup #passwordInput').focus();
				}
				document.querySelector('#LoginPopup #myIdpasswordInput').onkeyup = function (e) {
					if (e.keyCode == 13) LoginViewInstance.handleGoButtonAction(e);
				}*/
			}
			TemplateUtils.getStaticTemp(url, onTemplate, true, true);
		},
		setValidationRules: function () {
			try {
				LoginViewInstance.rtaUsernameValidator = new Validator(document.querySelector("#usernameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.login.validation.username.required%"),
						order: 0
					}],
					onValidate: LoginViewInstance.updateUpdateBtn
				});
				LoginViewInstance.rtaPasswordValidator = new Validator(document.querySelector("#passwordField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.login.validation.password.required%"),
						order: 0
					}],
					onValidate: LoginViewInstance.updateUpdateBtn
				});
				/*LoginViewInstance.myidUsernameValidator = new Validator(document.querySelector("#myIdUsernameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.login.validation.username.required%"),
						order: 0
					}],
					onValidate: LoginViewInstance.updateUpdateBtn
				});*/
				/*LoginViewInstance.myidPasswordValidator = new Validator(document.querySelector("#passwordMyIdField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.login.validation.password.required%"),
						order: 0
					}],
					onValidate: LoginViewInstance.updateUpdateBtn
				});*/

			} catch (e) {
				console.log(e);
			}
		},
		updateUpdateBtn: function () {
			try {
				var language = getApplicationLanguage();
				LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup  .popupBtns .okBtn").style.borderRadius = "30px";
				LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup  .popupBtns .okBtn").style.background = "#ee0000";
				if (LoginViewInstance.rtaUsernameValidator && LoginViewInstance.rtaUsernameValidator.isValid && LoginViewInstance.rtaPasswordValidator && LoginViewInstance.rtaPasswordValidator.isValid && LoginViewInstance.LoginPopup.tabs.index == 0) {
					LoginViewInstance.LoginPopup.options.primaryBtnDisabled = false;
					LoginViewInstance.LoginPopup.el.querySelector(".okBtn").innerHTML = localize("%shell.dashboard.coporate.login%");

					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "0px !important";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "0px !important";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "20px !important";
				}
				else if (LoginViewInstance.LoginPopup.tabs.index == 1) {
					var okButton = LoginViewInstance.LoginPopup.el.querySelector(".okBtn");
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup  .popupBtns .okBtn").style.borderRadius = "10px";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup  .popupBtns .okBtn").style.background = "white";
					okButton.innerHTML = "";
					var img = document.createElement("img");
					// img.src = language == "en" ? "../../common/images/shell/login/UAE_PASS_Login_Button_Green_En.png" : "../../common/images/shell/login/UAE_PASS_Login_Button_Green_Ar.png";
					img.id = "UAEPassButtonId";

					okButton.appendChild(img);
					LoginViewInstance.LoginPopup.options.primaryBtnDisabled = false;
					LoginViewInstance.LoginPopup.options.secondaryBtnVisible = false;

					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "0px !important";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "0px !important";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "20px !important";
					LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingLeft = "0"
						language == 'ar' ? LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingRight = "0" : "";
				}
				else {
					if ( Constants.APP_ID == "RTA_Corporate_Services") {
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "20px !important";
						LoginViewInstance.LoginPopup.options.secondaryBtnVisible = false;
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingLeft = "22px";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingRight = "";


					}
					else {
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "20px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingLeft = "22px";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingRight = "";

						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "";
						LoginViewInstance.LoginPopup.options.secondaryBtnVisible = true;
						/*language=='ar'?LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.paddingRight ="50px":"";*/
					}

					LoginViewInstance.LoginPopup.options.primaryBtnDisabled = true;
					LoginViewInstance.LoginPopup.el.querySelector(".okBtn").innerHTML = localize("%shell.dashboard.coporate.login%");
					var okButton = LoginViewInstance.LoginPopup.el.querySelector("#UAEPassButtonId");
					if (okButton && okButton.parentNode) {
						okButton.parentNode.removeChild(okButton);

					}
				}
			} catch (e) {
				console.log(e);
			}
		},

		onBeforeShow: function () {
			try {
				if (Constants.APP_ID == "RTA_Corporate_Services")
					document.getElementById("LoginPopup").getElementsByClassName("tabsHead")[0].style.display = "none";



				LoginViewInstance.setValidationRules();
				LoginViewInstance.updateUpdateBtn();
				LoginViewInstance.rtaPassword.value = "";
				/*LoginViewInstance.myIdPassword.value = "";*/
				var lastLoginMethod = DataUtils.getLocalStorageData('LastLoginMethod', 'shell');
				var lastUser;
				/*if (!isUndefinedOrNullOrBlank(lastLoginMethod) && lastLoginMethod == "myid" && !LoginViewInstance.linkMYID) {
					lastUser = DataUtils.getLocalStorageData('MYIDUsername', 'shell');
					LoginViewInstance.LoginPopup.tabs.changeIndex(1);
					//Retrieve last logged user
					LoginViewInstance.myIdUserName.value = lastUser;
					LoginViewInstance.myidUsernameValidator.isValid = true;


				} else {*/
				lastUser = DataUtils.getLocalStorageData('RTAUsername', 'shell');
				LoginViewInstance.LoginPopup.tabs.changeIndex(0);
				//Retrieve last logged user
				LoginViewInstance.rtaUserName.value = lastUser;
				LoginViewInstance.rtaUsernameValidator.isValid = true;
				/*}*/
				var username = lastUser;
				if (Utils.isiOS() || Utils.isAndroid()) {
					var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
					var isTouchIdEnabled = false;
					currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
					if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
						currentTouchIdConfig = [];
					}
					for (var i = 0; i < currentTouchIdConfig.length; i++) {
						if (currentTouchIdConfig[i].username == username && currentTouchIdConfig[i].isActivated == true) {
							isTouchIdEnabled = true;
						}
					}
					if (window.plugins && isTouchIdEnabled == true) {
						window.plugins.touchid.isAvailable(function () {
							window.plugins.touchid.has(username, function () {
								var fingerprintMessage = Globalize.localize("%shell.touchid.scan%", getApplicationLanguage());
								window.plugins.touchid.verify(username, fingerprintMessage, function (password) {
									/*if (LoginViewInstance.LoginPopup.tabs.index == 1) {
										LoginViewInstance.myIdPassword.value = password;
										LoginViewInstance.onMyIdLogin(username, password)
									} else {*/
									LoginViewInstance.rtaPassword.value = password;
									LoginViewInstance.onRTALogin(username, password)
									/*}*/
								});
							}, function () {
								// "Touch ID available but no Password Key available"
							});
						}, function (msg) {
							//"no Touch ID available"
						});
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		onShow: function () { },
		handleGoButtonAction: function (e) {
			try {
				var code = (e.keyCode ? e.keyCode : e.which);
				if ((code == 13) || (code == 10)) {
					//Your code goes here
					if (LoginViewInstance.LoginPopup.tabs.index == 0) {
						LoginViewControl.rtaUsernameValidator.validate(true)
						LoginViewControl.rtaUsernameValidator.visited = true;
						LoginViewControl.rtaPasswordValidator.validate(true)
						LoginViewControl.rtaPasswordValidator.visited = true;
						if (LoginViewControl.rtaUsernameValidator.isValid && LoginViewControl.rtaPasswordValidator.isValid) {
							document.activeElement.blur();
							LoginViewInstance.onRTALogin(LoginViewInstance.rtaUserName.value, LoginViewInstance.rtaPassword.value);
						}
					} /*else {
						LoginViewControl.myidUsernameValidator.validate(true)
						LoginViewControl.myidUsernameValidator.visited = true;
						LoginViewControl.myidPasswordValidator.validate(true)
						LoginViewControl.myidPasswordValidator.visited = true;
						if (LoginViewControl.myidUsernameValidator.isValid && LoginViewControl.myidPasswordValidator.isValid) {
							document.activeElement.blur();
							LoginViewInstance.onMyIdLogin(LoginViewInstance.myIdUserName.value, LoginViewInstance.myIdPassword.value);
						}
					}*/
				}
			} catch (e) {
				console.log(e);
			}
		},
		show: function (options) {
			try {
				LoginViewInstance.nextPageUrl = null;
				if (options != null) {
					LoginViewInstance.options = options;
				} else {
					LoginViewInstance.options = null;
				}
				setTimeout(function () {
					var callback = function () {
						if (LoginViewInstance.options != null && LoginViewInstance.options.scenario) {
							switch (LoginViewInstance.options.scenario) {
							case "Registration":
								if (LoginViewInstance.options.username && LoginViewInstance.options.password) {
									LoginViewInstance.onRTALogin(LoginViewInstance.options.username, LoginViewInstance.options.password, LoginViewInstance.options.scenario);
								}
								break;
							case "changePage":
								if (LoginViewInstance.options.url) {
									LoginViewInstance.nextPageUrl = LoginViewInstance.options.url;
								}
								break;
							}
						}
					}
					LoginViewInstance.LoginPopup.show(callback);

				}, 600);
				setTimeout(function () {
					if (Constants.APP_ID == "RTA_Corporate_Services") {
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.left = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.right = "0px !important";
						LoginViewInstance.LoginPopup.el.querySelector("#LoginPopup .popupBtns .okBtn").style.marginLeft = "20px !important";
						LoginViewInstance.LoginPopup.options.secondaryBtnVisible = false;
					}
				}, 700);
			} catch (e) {
				console.log(e);
			}

		},
		onRTALogin: function (username, password, scenario) {
			try {
				if (!navigator.onLine) {
					LoginViewInstance.LoginPopup.hide();
					setTimeout(function () {
						showInternetProblemPopup();
					}, 300);
					return;
				}
				if (scenario != null) {
					LoginViewInstance.rtaUserName.value = username;
					LoginViewInstance.rtaPassword.value = password;
				}
				//Handling My id case
				if (adapterAuthChallengeHandler && adapterAuthChallengeHandler.response && adapterAuthChallengeHandler.response.responseJSON.userProfile) {
					amAdapterAuthChallengeHandler["userProfileForLinking"] = adapterAuthChallengeHandler.response.responseJSON.userProfile;
					//				amAdapterAuthChallengeHandler.userProfileForLinking["rtaID"] = LoginViewInstance.rtaUserName.value;
				}

				//Handling UAE Pass case
				if (uaePassAdapterAuthChallengeHandler && uaePassAdapterAuthChallengeHandler.response && uaePassAdapterAuthChallengeHandler.response.responseJSON.UAEPassProfile) {
					amAdapterAuthChallengeHandler["userProfileForLinkingUAEPass"] = uaePassAdapterAuthChallengeHandler.response.responseJSON.UAEPassProfile;
					//				amAdapterAuthChallengeHandler.userProfileForLinking["rtaID"] = LoginViewInstance.rtaUserName.value;
				}
				var appIDForPortal = Constants.PORTAL_APP_IDs[Constants.APP_ID];
				var password = LoginViewInstance.rtaPassword.value;
				var username = username.toLowerCase().trim();


				password = PasswordModel.encPassword(username, password);
				var credentialsValidationResponse = AuthenticationModel.isValidCredentials(username, password);
				if (credentialsValidationResponse == true) {
					$(".ui-loader").show();
					window.loginProcessing = true;
					AuthenticationModel.authenticate("IAMLogin", username, password, appIDForPortal, LoginViewInstance.authenticateOnSuccess, LoginViewInstance.authenticateOnFailure, "");
					//Set timeout for login module
					authHandlerThread = window.setTimeout(function () {
						LoginViewInstance.authenticateOnFailure({
							failure: {
								errorCode: "77"
							}
						});
					}, 60000);
				} else {
					LoginViewInstance.authenticateOnFailure(credentialsValidationResponse);
				}
			} catch (e) {
				console.log(e);
			}
		},
		openRegisterpageUAEPass: function (event) {
			try {
				var UAEPassUserProfile = uaePassAdapterAuthChallengeHandler.response.responseJSON.UAEPassProfile;
				LoginViewInstance.getCountryIdByCountryName(UAEPassUserProfile.nationalityEN, function (nationalId) {
					var UAEProfile = {
							mail: UAEPassUserProfile.email,
							mobile: UAEPassUserProfile.mobile,
							first_name_en: UAEPassUserProfile.firstnameEN,
							last_name_en: UAEPassUserProfile.lastnameEN,
							nationalityEN: UAEPassUserProfile.nationalityEN,
							nationalityAR: UAEPassUserProfile.nationalityAR,
							gender: UAEPassUserProfile.gender,
							nationalId: nationalId
					}
					mobile.changePage("shell/register.html", { data: UAEProfile });
				});
			} catch (e) {
				console.log(e);
			}
		},
		getCountryIdByCountryName: function (countryName, callback) {
			try {
				if (countryName) {
					$.getJSON(window.mobile.baseUrl +"/common/data/countries_code.json", function (countries) {
						for (var i = 0; i < countries.length; i++) {
							if (countries[i].Country == countryName) {
								callback(countries[i].Id);
								return;
							}
						}
						callback(null);
					});
				} else {
					callback(null);
				}
			} catch (e) {
				console.log(e);
				callback(null);
			}
		},
		destoryWindow: function (_window) {
			try {
				_window.close();
				_window = undefined;
			} catch (e) {

			}
		},
		handleRecievedUAEPassCode: function (url) {
			try {
				var appIDForPortal = Constants.PORTAL_APP_IDs[Constants.APP_ID];
				var credentialsValidationResponse = AuthenticationModel.isValidCredentials();
				if (url.indexOf('UAEPassCallback') != -1) {
					window.callbackURLCalled = true;
					var queryParams = JSON.parse('{"' + decodeURI(url.split("?")[1].replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
					var code = queryParams.code;
					if (!isUndefinedOrNullOrBlank(code)) {
						if (window.uaewin) {
							LoginViewInstance.destoryWindow(window.uaewin);
						}

						AuthenticationModel.authenticate("UAEPassLogin", code, null, appIDForPortal, LoginViewInstance.onAuthenticationUAEPassSuccess, LoginViewInstance.onAuthenticationUAEPassFailure);
						window.authHandlerThread = window.setTimeout(function () {
							console.log("setting loginProcessing to false")
							if (window.loginProcessing == true) {
								window.loginProcessing = false;
								var error = {
										failure: {
											errorCode: "77",
											errorDescription: "Request Timeout Front-End Side"
										}
								};
								LoginViewInstance.onAuthenticationUAEPassFailure(error);
							}
						}, 90000);
					} else {
						LoginViewInstance.destoryWindow(window.uaewin);
						console.log("setting loginProcessing to false")
						window.loginProcessing = false;
						var error = {
								failure: {
									errorCode: "78",
									errorDescription: "UAE Pass Code Not Returned",
									error: queryParams.error
								}
						};
						LoginViewInstance.onAuthenticationUAEPassFailure(error);
					}
				}
			} catch (e) { console.log(e); }
		},
		checkUAEPassAvailability: function (callback) {
			try {
				var scheme;

				// Don't forget to add the org.apache.cordova.device plugin!
				if (device.platform === 'iOS') {
					scheme = 'uaepass://';
				}
				else if (device.platform === 'Android') {
					scheme = 'ae.uaepass.mainapp';
				}

				appAvailability.check(
						scheme,       // URI Scheme or Package Name
						function () {  // Success callback
							console.log(scheme + ' is available :)');
							callback(true);
						},
						function () {  // Error callback
							console.log(scheme + ' is not available :(');
							callback(false);
						}
				);
			} catch (e) { console.log(e); callback(false); }
		},
		handleUAEPassloginAndroid: function (newURL) {
			try {
				var appIDForPortal = Constants.PORTAL_APP_IDs[Constants.APP_ID];
				var credentialsValidationResponse = AuthenticationModel.isValidCredentials();
				window.uaePassApp = undefined;
				window.uaePassApp = window.open(newURL.replace("http://", ""), "_system");
				window.uaePassApp.addEventListener("loadstart", function (event) {
					console.log("loadstart uaePassApp"); console.log(event);
					LoginViewInstance.handleRecievedUAEPassCode(event.url);
				});
				window.uaePassApp.addEventListener("loadstop", function (event) { console.log("loadstop uaePassApp"); console.log(event); });
				window.uaePassApp.addEventListener("loaderror", function (event) { console.log("loaderror uaePassApp"); console.log(event); });
				window.uaePassApp.addEventListener("exit", function (event) { console.log("exit uaePassApp"); console.log(event); });
			} catch (e) { console.log(e); }
		},
		handleUAEPassloginIOS: function (newURL) {
			console.log("handleUAEPassloginIOS")
			// window.uaewin = window.open(newURL);




			window.uaewin.executeScript({
				code: "window.location = '" + newURL + "';"
			}, function () {
				//alert("Redirected!");
				console.log("hello")
				debugger;
			});

		},
		rewriteUAEPassURL: function (_url) {
			try {
				//				var url =_url.replace("http://","");
				var url = _url;
				var app_url_schema = Constants.APP_URL_SCHEMA;
				var url_prefix = url.split('?')[0]
				var url_success = url.split('?')[1].split('&')[0].replace("successurl=", "");
				var url_failure = url.split('?')[1].split('&')[1].replace("failureurl=", "");
				var new_success = "successurl=" + app_url_schema + ":///resume_authn?url=" + url_success;
				var new_failure = "failureurl=" + app_url_schema + ":///dont_resume_authn?url=" + url_failure;
				return url_prefix + "?" + new_success + "&" + new_failure + "&closeondone=false";
			} catch (e) { console.log(e); }
		},
		proceedUAEPassLogin: function () {
			try {
				window.loginProcessing = true;
				window.callbackURLCalled = false;
				$(".ui-loader").show();
				// call backend to get UAEPAss URL
				AuthenticationModel.generateUAEPASSURL(function (url) {
					if (url) {

						if (device.platform == "Android") {
							window.webview.Show(url, function (params) { console.log(params); }, function (error) { console.log('error'); }, false);
							window.webview.SubscribeCallback(function (params) {

								console.log(params);
								if (params && params.url)
									LoginViewInstance.handleRecievedUAEPassCode(params.url);

							}, function (error) { console.log('error'); })
							//							window.webview.SubscribeExitCallback(function(params) {  console.log(params); }, function(error){   console.log('error'); })
							return;
						}

						window.uaewin = undefined;
						// window.uaewin = window.open(url, "_blank", "hidden=no,clearcache=yes,clearsessioncache=yes,location=no,footer=yes");
						window.uaewin = window.open(url, "uaewin", "beforeload=yes,hidden=no,clearcache=no,clearsessioncache=no,location=no,footer=yes,hidenavigationbuttons=yes,hideurlbar=yes,closebuttoncaption=Close");

						if (device.platform != "Android") {
							var i = 0;
							function beforeloadCallBack(params, callback) {
								var _continue = true;
								console.log(i);
								i++;
								console.log("beforeload");
								console.log(JSON.stringify(params));
								if (params.url.startsWith("uaepass://") && _continue) {
									_continue = false;
									console.log("Rewirting");
									var newURL = LoginViewInstance.rewriteUAEPassURL(params.url);
									console.log(newURL);
									callback(newURL);
									// window.uaewin = window.open(newURL);

								} else {
									if (_continue) {
										callback(params.url);
									} else {
										console.log("stopping");
										// return;
									}

								}
							}
							window.uaewin.addEventListener("beforeload", beforeloadCallBack);
							// window.uaewin.addEventListener("loadstart", function (event) {
							// 	console.log("loadstart uaewin"); console.log(event);
							// 	// LoginViewInstance.handleRecievedUAEPassCode(event.url);
							// });
							// window.uaewin.addEventListener("loadstop", function (event) { console.log("loadstop uaewin"); console.log(event); });
							// window.uaewin.addEventListener("loaderror", function (event) { console.log("loaderror uaewin"); console.log(event); });
							// window.uaewin.addEventListener("exit", function (event) { console.log("exit uaewin"); console.log(event); });
						}

						// window.uaewin.addEventListener("loadAfterBeforeload", function (event) {
						// 	console.log("loadAfterBeforeload"); console.log(event);
						// });
						// window.uaewin.addEventListener("loadstart", function (event) {
						// 	console.log("loadstart"); console.log(event);
						// 	if (event.url.startsWith("uaepass://")) {
						// 		console.log("Rewirting")
						// 		var newURL = LoginViewInstance.rewriteUAEPassURL(event.url);
						// 		console.log(newURL);
						// 		window.uaewin.executeScript({
						// 			code: "window.location = '" + newURL + "';"
						// 		}, function () {
						// 			//alert("Redirected!");
						// 			console.log("hello")
						// 			debugger;
						// 		});
						// 	}
						// });
					}
					else {
						$(".ui-loader").hide();
						LoginViewInstance.LoginPopup.hide();
						errorMsg = localize("%shell.error.auth.77%");
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = errorMsg;
						setTimeout(function () {
							errorPopup.show();
						}, 600);

					}
				});
			} catch (e) { console.log(e); }
		},
		onUAEPassLogin: function () {
			try {
				if (!navigator.onLine) {
					LoginViewInstance.LoginPopup.hide();
					setTimeout(function () {
						showInternetProblemPopup();
					}, 300);
					return;
				}
				LoginViewInstance.checkUAEPassAvailability(LoginViewInstance.initUAEPassLogin);
			} catch (e) { console.log(e); }
		},
		initUAEPassLogin: function (isUAEPassInstalled) {
			try {
				if (isUAEPassInstalled == true) {
					LoginViewInstance.proceedUAEPassLogin();
				} else {
					if ($(".ui-loader")) {
						$(".ui-loader").hide();
					}
					LoginViewInstance.LoginPopup.hide();
					setTimeout(function () {
						var appNotINstalled = new Popup("UAEPassNotInstalledPopup");
						appNotINstalled.show();
					}, 300);
				}
			} catch (e) { console.log(e); }
		},
		onAuthenticationUAEPassSuccess: function (response) {
			try {
				window.loginProcessing = false;
				console.log('onAuthenticationUAEPassSuccess');
				console.log(response);
				if (window.authHandlerThread) {
					window.clearTimeout(window.authHandlerThread);
					window.authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				// load loyalty
				if (Constants.showLoyalty) {
					dashboardPageViewInstance.loadNILoyalty();
				}
				if (response && response.responseJSON) {
					if (response.responseJSON.havePortalAccount) {
						// update user login status here and also in indexPageView
						var activeLogin = function () {

							ActivityLoggerModel.updateLoginDate();
							var sidepanel = MobileRouter.getSidePanel();
							sidepanel.updateSidePanel();
							mobile.changePage(Constants.HOMEPAGE_URL, {
								changeHash: true,
								reloadPage: true
							});
							//						if (Utils.isiOS() || Utils.isAndroid()) {
							//						LoginViewInstance.handleTouchID(username, password);
							//						}
						};
						activeLogin();
						//TODO:if possible, move to a model
						//update user login status here and also in indexPageView
						//					if (Constants.APP_ID == "RTA_Corporate_Services") {
						//					CorporateDashboardModel.checkUserVerification(username, function(username, isVerified, callback) {
						//					if (isVerified && isVerified == true) {
						//					activeLogin(username);
						//					} else {
						//					AuthenticationModel.logout();
						//					if (callback) callback();
						//					}
						//					});
						//					} else {
						//					activeLogin(username);
						//					}
					} else {
						uaePassAdapterAuthChallengeHandler.response = response;
						var linkRTAAccountWithUAEPassPopup_Options = {
								popupId: "linkRTAUAEPassPopup",
								title: localize("%shell.Login.linkUAEPassTitlePopup%"),
								content: window.Utils.applyLocalization('<div id="linkUAEPASSHeader"><img id="LinkRta-logo">' +
										'<span class="arrowLine icon-link-account"> </span><img id="LinkUAELogoId"></img></div>' +
										'<div id="linkUAEBodyId"><span class="linkUAEPopupCont1">%shell.Login.linkUAEPassSuccessfullylogged%</span>  ' +
										'<span class="linkUAEPopupCont2">%shell.Login.linkUAEPassAskForLogged%</span> ' +
										'<span class="linkUAEPopupCont3">%shell.Login.linkUAEPassAskRegister%	</span></div>'
								),
								primaryBtnText: localize("%shell.login.loginAccount%"),
								primaryBtnCallBack: LoginViewInstance.linkUAEPassToPortalAccount,
								secondaryBtnText: localize("%shell.login.registerAccount%"),
								secondaryBtnCallBack: LoginViewInstance.openRegisterpageUAEPass,
								secondaryBtnVisible: true,
								secondaryBtnDisabled: false,
								hideOnPrimaryClick: true,
								hideOnSecondaryClick: true,
								aroundClickable: true,
								onAroundClick: null
						}
						var linkRTAAccountWithUAEPassPopup = new Popup(linkRTAAccountWithUAEPassPopup_Options);
						setTimeout(function () {
							linkRTAAccountWithUAEPassPopup.show();
						}, 600);
					}
				}

				document.dispatchEvent(loginEventSuccess);
			} catch (e) { console.log(e); }
		},
		onAuthenticationUAEPassFailure: function (response) {
			try {
				window.loginProcessing = false;
				console.log('onAuthenticationUAEPassFailure' + JSON.stringify(response));
				//if (authHandlerThread != undefined || authHandlerThread == null) {

				if (!isUndefinedOrNullOrBlank(window.authHandlerThread)) {
					window.clearTimeout(window.authHandlerThread);
					window.authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				if (response && response.failure) {
					var failureResponse = response.failure;
					var errorCode = failureResponse.errorCode;
					if (errorCode && (errorCode == 0 || errorCode == "01" || errorCode == "02" || errorCode == "03" || errorCode == "04" || errorCode == "05" || errorCode == "77" || errorCode == "99")) {
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = authenticationHandler.getAuthenticationErrorMessageByCode(errorCode);
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					} else {
						var lang = getApplicationLanguage()
						var errorMsg = Globalize.localize("%shell.error.auth.99%", lang);
						if (lang == "ar" && failureResponse.violationAr) {
							errorMsg = failureResponse.violationAr;
						} else if (failureResponse.violationEn) {
							errorMsg = failureResponse.violationEn;
						}
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = errorMsg;
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					}
				}
				document.dispatchEvent(loginEventFailure);
			} catch (e) { console.log(e); }
		},

		authenticateOnSuccess: function (response) {
			try {
				window.loginProcessing = false;
				var password = LoginViewInstance.rtaPassword.value;
				var username = LoginViewInstance.rtaUserName.value.toLowerCase();
				if (authHandlerThread) {
					window.clearTimeout(authHandlerThread);
					authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				var activeLogin = function (username) {
					if (LoginViewInstance.rememberRTALogin == true) {
						DataUtils.setLocalStorageData('RTAUsername', username, false, 'shell');
						DataUtils.setLocalStorageData('LastLoginMethod', "rta", false, 'shell');
					}
					DataUtils.setLocalStorageData('isIAMLoggedIn', "true", false, 'shell');
					ActivityLoggerModel.updateLoginDate();
					var sidepanel = MobileRouter.getSidePanel();
					sidepanel.updateSidePanel();
					var loginPage = LoginViewInstance.nextPageUrl || Constants.HOMEPAGE_URL;
					if(loginPage.indexOf('manage-salik-vehicles-list')>=0){
						UserProfileModel.getServiceRelatedInfoByKey("SALIK",function (salikObject){
							if(isUndefinedOrNullOrBlank(salikObject) ){
								loginPage="salik/link-your-salik-account/link-salik-mobile-and-plateNo.html";
								mobile.changePage(loginPage, {
									changeHash: true,
									reloadPage: true
								});
							}
							else if(!isUndefinedOrNullOrBlank(salikObject) && !isUndefinedOrNullOrBlank(salikObject.serviceId) ){

								mobile.changePage(loginPage, {
									changeHash: true,
									reloadPage: true
								});
							}
							else {
								loginPage =Constants.HOMEPAGE_URL;
								mobile.changePage(loginPage, {
									changeHash: true,
									reloadPage: true
								});
							}
						},false);
					}
					else{

						mobile.changePage(loginPage, {
							changeHash: true,
							reloadPage: true
						});
					}

					if (Utils.isiOS() || Utils.isAndroid()) {
						LoginViewInstance.handleTouchID(username, password);
					}
				};
				//TODO:if possible, move to a model
				//update user login status here and also in indexPageView
				if (Constants.APP_ID == "RTA_Corporate_Services") {
					CorporateDashboardModel.checkUserVerification(username, function (username, isVerified, callback) {
						if (isVerified && isVerified == true) {
							activeLogin(username);
						} else {
							AuthenticationModel.logout();
							if (callback) callback();
						}
					});
				} else {
					activeLogin(username);
				}

				// call  model on dubai Drive only
				if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
					if (Constants.showLoyalty) {
						dashboardPageViewInstance.loadNILoyalty();
					}
				}
			} catch (e) { console.log(e); }
		},
		authenticateOnFailure: function (response) {
			try {
				console.log('authenticateOnFailure' + JSON.stringify(response));
				window.loginProcessing = false;
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile && AuthenticationModel.isAuthenticated() /*&& AuthenticationModel.isAuthenticatedWithServer()*/) {
					AuthenticationModel.logout();
				}
				if (authHandlerThread != undefined || authHandlerThread != null) {
					window.clearTimeout(authHandlerThread);
					authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				if (response && response.failure) {
					var failureResponse = response.failure;
					var errorCode = failureResponse.errorCode;
					if (errorCode && (errorCode == 0 || errorCode == "01" || errorCode == "02" || errorCode == "03" || errorCode == "04" || errorCode == "05" || errorCode == "77" || errorCode == "99")) {
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = authenticationHandler.getAuthenticationErrorMessageByCode(errorCode);
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					} else {
						var lang = getApplicationLanguage().toLowerCase();
						var errorMsg = Globalize.localize("%shell.error.auth.99%", lang);
						if (lang == "ar" && failureResponse.violationAr) {
							errorMsg = failureResponse.violationAr;
						} else if (failureResponse.violationEn) {
							errorMsg = failureResponse.violationEn;
						}
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = errorMsg;
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					}
				}
				document.dispatchEvent(loginEventFailure);
			} catch (e) { console.log(e); }
		},
		/*onMyIdLogin: function (username, password) {
			try {
				if (!navigator.onLine) {
					LoginViewInstance.LoginPopup.hide();
					setTimeout(function () {
						showInternetProblemPopup();
					}, 300);
					return;
				}
				window.loginProcessing = true;
				var appIDForPortal = Constants.PORTAL_APP_IDs[Constants.APP_ID];
				var credentialsValidationResponse = AuthenticationModel.isValidCredentials(username, password);
				if (credentialsValidationResponse == true) {
					$(".ui-loader").show();
					AuthenticationModel.authenticate("MYIDLogin", username, password, appIDForPortal, LoginViewInstance.onAuthenticationMyidSuccess, LoginViewInstance.onAuthenticationMyidFailure);
					//Set timeout for login module
					authHandlerThread = window.setTimeout(function () {
						LoginViewInstance.onAuthenticationMyidFailure({
							failure: {
								errorCode: "77"
							}
						});
					}, 90000);
				} else {
					LoginViewInstance.authenticateOnFailure(credentialsValidationResponse);
				}
			} catch (e) { console.log(e); }
		},*/
		/*onAuthenticationMyidSuccess: function (response) {
			try {
				window.loginProcessing = false;
				// load loyalty
				if (Constants.showLoyalty) {
					dashboardPageViewInstance.loadNILoyalty();
				}
				console.log('onAuthenticationMyidSuccess' + JSON.stringify(response));
				var username = LoginViewInstance.myIdUserName.value;
				var password = LoginViewInstance.myIdPassword.value;
				if (authHandlerThread) {
					window.clearTimeout(authHandlerThread);
					authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				if (response && response.responseJSON) {
					if (response.responseJSON.havePortalAccount) {
						// update user login status here and also in indexPageView
						var activeLogin = function (username) {
							if (LoginViewInstance.rememberMYIDLogin == true) {
								DataUtils.setLocalStorageData('MYIDUsername', LoginViewInstance.myIdUserName.value, false, 'shell');
								DataUtils.setLocalStorageData('LastLoginMethod', "myid", false, 'shell');
							}
							ActivityLoggerModel.updateLoginDate();
							var sidepanel = MobileRouter.getSidePanel();
							sidepanel.updateSidePanel();
							mobile.changePage(Constants.HOMEPAGE_URL, {
								changeHash: true,
								reloadPage: true
							});
							if (Utils.isiOS() || Utils.isAndroid()) {
								LoginViewInstance.handleTouchID(username, password);
							}
						};
						//TODO:if possible, move to a model
						//update user login status here and also in indexPageView
						if (Constants.APP_ID == "RTA_Corporate_Services") {
							CorporateDashboardModel.checkUserVerification(username, function (username, isVerified, callback) {
								if (isVerified && isVerified == true) {
									activeLogin(username);
								} else {
									AuthenticationModel.logout();
									if (callback) callback();
								}
							});
						} else {
							activeLogin(username);
						}
					} else {
						adapterAuthChallengeHandler.response = response;
						var linkRegisterMyIdPopup_Options = {
							popupId: "linkRegisterMyIdPopup",
							title: localize("%shell.login.linkRegister.title%"),
							content: localize("%shell.login.linkPortalAccount.text%"),
							primaryBtnText: localize("%shell.login.linkAccount%"),
							primaryBtnCallBack: LoginViewInstance.linkMYIDToPortalAccount,
							primaryBtnDisabled: false,
							secondaryBtnText: localize("%shell.login.registerAccount%"),
							secondaryBtnCallBack: LoginViewInstance.registerRTAPortalAccount,
							secondaryBtnVisible: true,
							secondaryBtnDisabled: false,
							hideOnPrimaryClick: true,
							hideOnSecondaryClick: true,
							aroundClickable: true,
							onAroundClick: null
						}
						var linkRegisterMyIdPopup = new Popup(linkRegisterMyIdPopup_Options);
						setTimeout(function () {
							linkRegisterMyIdPopup.show();
						}, 600);
					}
				}
				document.dispatchEvent(loginEventSuccess);
			} catch (e) { console.log(e); }
		},*/
		/*onAuthenticationMyidFailure: function (response) {
			try {
				window.loginProcessing = false;
				console.log('onAuthenticationMyidFailure' + JSON.stringify(response));
				if (authHandlerThread != undefined || authHandlerThread == null) {
					window.clearTimeout(authHandlerThread);
					authHandlerThread = null;
				}
				if ($(".ui-loader")) {
					$(".ui-loader").hide();
					LoginViewInstance.LoginPopup.hide();
				}
				if (response && response.failure) {
					var failureResponse = response.failure;
					var errorCode = failureResponse.errorCode;
					if (errorCode && (errorCode == 0 || errorCode == "01" || errorCode == "02" || errorCode == "03" || errorCode == "04" || errorCode == "05" || errorCode == "77" || errorCode == "99")) {
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = authenticationHandler.getAuthenticationErrorMessageByCode(errorCode);
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					} else {
						var lang = getApplicationLanguage()
						var errorMsg = Globalize.localize("%shell.error.auth.99%", lang);
						if (lang == "ar" && failureResponse.violationAr) {
							errorMsg = failureResponse.violationAr;
						} else if (failureResponse.violationEn) {
							errorMsg = failureResponse.violationEn;
						}
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = errorMsg;
						setTimeout(function () {
							errorPopup.show();
						}, 600);
					}
				}
				document.dispatchEvent(loginEventFailure);
			} catch (e) { console.log(e); }
		},*/
		/*linkMYIDToPortalAccount: function (event) {

			LoginViewInstance.linkMYID = true;
			setTimeout(function () {
				LoginViewInstance.LoginPopup.show();
			}, 600);
		},*/
		linkUAEPassToPortalAccount: function (event) {
			LoginViewInstance.linkUAEPass = true;
			setTimeout(function () {
				LoginViewInstance.LoginPopup.show();
			}, 600);
		},
		registerRTAPortalAccount: function (event) {
			try {
				var userProfile = adapterAuthChallengeHandler.response.responseJSON.userProfile;
				var params = {};
				var language = getApplicationLanguage();
				if (language == "ar") {
					params.title = userProfile.title_ar;
					params.fname = userProfile.first_name_ar;
					params.lname = userProfile.last_name_ar;
					params.dob = userProfile.date_of_birth;
					if (params.dob) {
						params.dob = params.dob.split('T')[0];
					} else {
						params.dob = "";
					}
					params.idn = userProfile.id_number;
					params.nationality = userProfile.nationality_ar;
					params.mobile = userProfile.mobile;
					params.email = userProfile.mail;
					params.confirm_email = userProfile.mail;
					params.plang = userProfile.preferred_language;
				} else {
					params.title = userProfile.title_en;
					params.fname = userProfile.first_name_en;
					params.lname = userProfile.last_name_en;
					params.dob = userProfile.date_of_birth;
					if (params.dob) {
						params.dob = params.dob.split('T')[0];
					} else {
						params.dob = "";
					}
					params.idn = userProfile.id_number;
					params.nationality = userProfile.nationality_en;
					params.mobile = userProfile.mobile;
					params.email = userProfile.mail;
					params.confirm_email = userProfile.mail;
					params.plang = userProfile.preferred_language;
				}
				mobile.changePage("shell/register.html", {
					data: params
				});
			} catch (e) { console.log(e); }
		},
		handleTouchID: function (username, password) {
			try {
				var currentAndroidAPIsVersion = parseInt(getAndroidVersion(), 10)
				if (Utils.isAndroid() && currentAndroidAPIsVersion < 6) {
					document.dispatchEvent(loginEventSuccess);
					return;
				}
				if (Utils.isiOS() || Utils.isAndroid()) {
					var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
					var isTouchIdConfigured = false;
					var isTouchIdConfiguredAndDeactivate = false;
					currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
					if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) currentTouchIdConfig = [];
					for (var i = 0; i < currentTouchIdConfig.length; i++) {
						if (currentTouchIdConfig[i].username == username) {
							isTouchIdConfigured = true;
						}
						if (currentTouchIdConfig[i].username == username && currentTouchIdConfig[i].isActivated == false) {
							isTouchIdConfiguredAndDeactivate = true;
						}
					}
					if (!isTouchIdConfigured || isTouchIdConfiguredAndDeactivate == true) {
						window.plugins.touchid.isAvailable(function (msg) {
							//Check local var
							if (getApplicationLanguage() == 'en') {
								navigator.notification.confirm(Globalize.localize("%shell.touchid.msg%", getApplicationLanguage()), function (buttonIndex) {
									if (buttonIndex == 1) {
										window.plugins.touchid.save(username, password, function () {
											//														"Password saved"
										});
										var touchidConfig = {}
										touchidConfig.username = username;
										touchidConfig.isActivated = true;
										var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
										currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
										if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
											currentTouchIdConfig = [touchidConfig];
										} else {
											var isConfiguredBefore = false;
											var configurationIndex = 0;
											for (var i = 0; i < currentTouchIdConfig.length; i++) {
												if (currentTouchIdConfig[i].username == touchidConfig.username) {
													isConfiguredBefore = true;
													configurationIndex = i;
												}
											}
											if (isConfiguredBefore == true) {
												currentTouchIdConfig[configurationIndex].isActivated = true;
											} else {
												currentTouchIdConfig.push(touchidConfig);
											}
										}
										DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
									} else {
										window.plugins.touchid._delete(username, function () {
											//														"Password key deleted"
										});
										var touchidConfig = {}
										touchidConfig.username = username;
										touchidConfig.isActivated = false;
										var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
										currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
										if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
											currentTouchIdConfig = [touchidConfig];
										} else {
											var isConfiguredBefore = false;
											var configurationIndex = 0;
											for (var i = 0; i < currentTouchIdConfig.length; i++) {
												if (currentTouchIdConfig[i].username == touchidConfig.username) {
													isConfiguredBefore = true;
													configurationIndex = i;
												}
											}
											if (isConfiguredBefore == true) {
												currentTouchIdConfig[configurationIndex].isActivated = false;
											} else {
												currentTouchIdConfig.push(touchidConfig);
											}
										}
										DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
									}
									// To be removed
									document.dispatchEvent(loginEventSuccess);
								}, 'TOUCH ID', [Globalize.localize("%shell.touchid.msg.yes%", getApplicationLanguage()), Globalize.localize("%shell.touchid.msg.no%", getApplicationLanguage())]);
							} else {
								navigator.notification.confirm(Globalize.localize("%shell.touchid.msg%", getApplicationLanguage()), function (buttonIndex) {
									if (buttonIndex == 2) {
										window.plugins.touchid.save(username, password, function () {
											//														"Password saved"
										});
										var touchidConfig = {}
										touchidConfig.username = username;
										touchidConfig.isActivated = true;
										var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
										currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
										if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
											currentTouchIdConfig = [touchidConfig];
										} else {
											var isConfiguredBefore = false;
											var configurationIndex = 0;
											for (var i = 0; i < currentTouchIdConfig.length; i++) {
												if (currentTouchIdConfig[i].username == touchidConfig.username) {
													isConfiguredBefore = true;
													configurationIndex = i;
												}
											}
											if (isConfiguredBefore == true) {
												currentTouchIdConfig[configurationIndex].isActivated = true;
											} else {
												currentTouchIdConfig.push(touchidConfig);
											}
										}
										DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
									} else {
										window.plugins.touchid._delete(username, function () {
											//														"Password key deleted"
										});
										var touchidConfig = {}
										touchidConfig.username = username;
										touchidConfig.isActivated = false;
										var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
										currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
										if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
											currentTouchIdConfig = [touchidConfig];
										} else {
											var isConfiguredBefore = false;
											var configurationIndex = 0;
											for (var i = 0; i < currentTouchIdConfig.length; i++) {
												if (currentTouchIdConfig[i].username == touchidConfig.username) {
													isConfiguredBefore = true;
													configurationIndex = i;
												}
											}
											if (isConfiguredBefore == true) {
												currentTouchIdConfig[configurationIndex].isActivated = false;
											} else {
												currentTouchIdConfig.push(touchidConfig);
											}
										}
										DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
									}
									// To be removed
									document.dispatchEvent(loginEventSuccess);
								}, 'TOUCH ID', [Globalize.localize("%shell.touchid.msg.no%", getApplicationLanguage()), Globalize.localize("%shell.touchid.msg.yes%", getApplicationLanguage())]);
							}
						}, function (msg) {
							console.log('Touch ID is not available: ' + msg);
							document.dispatchEvent(loginEventSuccess);
						});
					} else {
						document.dispatchEvent(loginEventSuccess);
					}
				} else {
					document.dispatchEvent(loginEventSuccess);
				}
			} catch (e) { console.log(e); }
		}

	});
	return LoginView;
});

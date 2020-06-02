/* JavaScript content from js/com/views/shell/ForgotPasswordPageView.js in folder common */
define(
		[
		 "backbone",
		 "com/views/PageView",
		 "com/models/Constants",
		 "com/views/Header",
		 "com/models/shell/UserProfileModel",
		 "com/utils/Utils",
		 "com/utils/DataUtils",
		 "com/models/shell/OTPModel",
		 "com/models/shell/PasswordModel",
		 "com/models/shell/CaptchaModel"
		 ],
		 function(
				 Backbone,
				 PageView,
				 Constants,
				 Header,
				 UserProfileModel,
				 Utils,
				 DataUtils,
				 OTPModel,
				 PasswordModel,
				 CaptchaModel
		 ) {
			var ForgotPasswordPageView = PageView.extend({
				events: {
					pageshow: "onPageShow"
				},
				initialize: function(options) {
					
					FPwdObj = this;
					options.phoneTitle = localize("%shell.login.forget%");
					options.headerState = Header.STATE_MENU;
					PageView.prototype.initialize.call(this, options);
				},
				onPageShow: function() {
					
					FPwdObj.otpType = "";
					FPwdObj.passHintPopup = new Popup("passwordHint");
					FPwdObj.verificationType = new Popup("verifyOTPType");
					FPwdObj.verificationType.options.primaryBtnCallBack = function() {
						FPwdObj.sendOTPRequest("EMAIL");
					};

					FPwdObj.verificationType.options.secondaryBtnCallBack = function() {
						FPwdObj.sendOTPRequest("SMS");
					};

					document.getElementById("updateBtn").onclick = function() {
						FPwdObj.onUpdateClick();
					};

					FPwdObj.otpPopup = new Popup("OTP");
					FPwdObj.otpPopup.options.secondaryBtnCallBack = null;

					FPwdObj.otpPopup.options.primaryBtnCallBack = function() {
						
						var userID = document.getElementById("userID").value;
						var OTP = FPwdObj.otpPopup.pinInput.value;
						OTPModel.verifyOTP(OTP, userID, function(res) {
							if (res.isVerified == "true" || res.isVerified == true) {
								FPwdObj.otpPopup.hide(function() {
									$(".ui-loader").show();
									var passwordInputs = {
											userID: document.getElementById("userID").value,
											newPassVal: PasswordModel.encPassword(
													document.getElementById("userID").value,
													document.getElementById("newPasswordInput").value
											),
											confirmPassVal: PasswordModel.encPassword(
													document.getElementById("userID").value,
													document.getElementById("rePassword").value
											)
									};
									
									// after press update
									var captcha={
											"key":FPwdObj.newCaptch.captchaKey,
											"userAnswerId":FPwdObj.newCaptch.captchaAnswer,
											"type":FPwdObj.newCaptch.captchaType,
									}
									
									var captchaObject=JSON.stringify(captcha);

									UserProfileModel.forgotPassword(passwordInputs,captchaObject, function(
											status,
											res
									) {
										
										$(".ui-loader").hide();
										if (status == "SUCCESS") {
											if (res.operationStatus == "SUCCESS") {
												if (Utils.isiOS() || Utils.isAndroid()) {
													var password = document.getElementById(
															"newPasswordInput"
													).value;
													var username = document.getElementById("userID").value;

													var currentTouchIdConfig = DataUtils.getLocalStorageData(
															"Touchid",
															"shell"
													);
													currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
													if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
														currentTouchIdConfig = [];
													}

													var isConfiguredBefore = false;
													var configurationIndex = 0;
													for (var i = 0; i < currentTouchIdConfig.length; i++) {
														if (currentTouchIdConfig[i].username == username) {
															isConfiguredBefore = true;
														}
													}

													if (isConfiguredBefore == true) {
														window.plugins.touchid.save(
																username,
																password,
																function() {}
														);
													}
												}

												var successPop = new Popup("forgotPasswordSuccessPopup");
												successPop.show();
											} else {
												var errorpop = new Popup("generalErrorPopup");
												errorpop.show();
											}
										} else {
											var errorpop = new Popup("generalErrorPopup");
											errorpop.show();
										}
									});
								});
							} else {
								/////////show OTP invalid

								FPwdObj.otpPopup.options.primaryBtnDisabled = true;
								FPwdObj.otpPopup.pinInput.clear();
								FPwdObj.otpPopup.el.querySelector(
										".otpInvalid"
								).style.opacity = 1;

								if (res.errorCode == "ERR-VO-B-14") {
									clearInterval(FPwdObj.otpPopup.timerInterval);
									FPwdObj.otpPopup.stopTimer();
									FPwdObj.otpPopup.hide(function() {
										var OTPVerificationLimitPopup = new Popup(
												"OTPVerificationLimitPopup"
										);
										OTPVerificationLimitPopup.show();
									});
								}
							}
						});
					};

					FPwdObj.otpPopup.el.querySelector(".resend").onclick = function() {
						var userID = document.getElementById("userID").value;
						OTPModel.sendOTPbyID(
								userID,
								"ResetPassword",
								FPwdObj.otpType,
								function(res) {
									FPwdObj.otpPopup.stopTimer();
									FPwdObj.otpPopup.pinInput.clear();
									FPwdObj.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
									FPwdObj.otpPopup.updateResendButton(
											res.AttemptsRemaining,
											Number(res.CurrentCycleRemainingTime)
									);
									FPwdObj.otpPopup.options.primaryBtnDisabled = true;
									setTimeout(function() {
										FPwdObj.otpPopup.startTimer();
									}, 150);
								}
						);
					};

					FPwdObj.verificationLimitPopup = new Popup("OTPVerificationLimitPopup");
					FPwdObj.verificationLimitPopup.options.secondaryBtnText = localize(
							"%shell.label.cancel%"
					);
					FPwdObj.verificationLimitPopup.options.secondaryBtnCallBack = null;
					FPwdObj.verificationLimitPopup.options.primaryBtnCallBack = function() {
						var userID = document.getElementById("userID").value;
						OTPModel.sendOTPbyID(
								userID,
								"ResetPassword",
								FPwdObj.otpType,
								function(res) {
									FPwdObj.otpPopup.el.querySelector("#customContent").innerHTML =
										"";
									FPwdObj.otpPopup.options.OTPduration = Number(res.OTPvalidFor);

									FPwdObj.otpPopup.updateResendButton(
											res.AttemptsRemaining,
											Number(res.CurrentCycleRemainingTime)
									);

									FPwdObj.otpPopup.show();
								}
						);
					};
					//////////////////////////////////////////////
					FPwdObj.timeoutPop = new Popup("OTPTimeoutPopup");
					FPwdObj.timeoutPop.options.secondaryBtnText = localize(
							"%shell.label.cancel%"
					);
					FPwdObj.timeoutPop.options.secondaryBtnCallBack = null;
					FPwdObj.timeoutPop.options.primaryBtnCallBack = function() {
						var userID = document.getElementById("userID").value;
						OTPModel.sendOTPbyID(
								userID,
								"ResetPassword",
								FPwdObj.otpType,
								function(res) {
									FPwdObj.otpPopup.el.querySelector("#customContent").innerHTML =
										"";
									FPwdObj.otpPopup.options.OTPduration = Number(res.OTPvalidFor);

									FPwdObj.otpPopup.updateResendButton(
											res.AttemptsRemaining,
											Number(res.CurrentCycleRemainingTime)
									);

									FPwdObj.otpPopup.show();
								}
						);
					};
					//////////////////////////////////////////////
					FPwdObj.userNameValidator = new Validator(
							document.querySelector("#userNameField"),
							{
								validations: [
								              {
								            	  regEx: "empty",
								            	  errorMessage: localize(
								            			  "%shell.registeration.validation.username.required2%"
								            	  ),
								            	  order: 0
								              }
								              ],
								              onValidate: FPwdObj.updateContinueBtn
							}
					);

					FPwdObj.passwordValidator = new Validator(
							document.querySelector("#newPasswordField"),
							{
								validations: [
								              {
								            	  regEx: "empty",
								            	  errorMessage: localize(
								            			  "%shell.registeration.validation.password.required2%"
								            	  ),
								            	  order: 0
								              },
								              {
								            	  regEx: "password",
								            	  errorMessage: localize(
								            			  "%shell.registeration.validation.password.required3%"
								            	  ),
								            	  order: 1
								              }
								              ],
								              onValidate: FPwdObj.updateContinueBtn
							}
					);
					FPwdObj.rePasswordValidator = new Validator(
							document.querySelector("#rePasswordField"),
							{
								validations: [
								              {
								            	  regEx: "empty",
								            	  errorMessage: localize(
								            			  "%shell.registeration.validation.confirmpassword.required%"
								            	  ),
								            	  order: 0
								              },
								              {
								            	  regEx: function(val) {
								            		  if (
								            				  val == document.querySelector("#newPasswordInput").value
								            		  ) {
								            			  return true;
								            		  } else {
								            			  return false;
								            		  }
								            	  },
								            	  errorMessage: localize(
								            			  "%shell.registeration.validation.confirmpassword.required3%"
								            	  ),
								            	  order: 1
								              }
								              ],
								              onValidate: FPwdObj.updateContinueBtn
							}
					);

					var newValidatorOptions = {
							passwordElement: document.getElementById("newPasswordInput"),
							confirmPasswordElement: document.getElementById("rePassword"),
							infoElement: document.getElementById("passInfo"),
							passwordValidator: FPwdObj.passwordValidator,
							rePasswordValidator: FPwdObj.rePasswordValidator,
							lang: getApplicationLanguage()
					};
					window.newValidator = new PasswordStrength(newValidatorOptions);

					// start call captcha
					var captchaOptions = {
							
							lang: getApplicationLanguage(),
							captchaModel: CaptchaModel,
							serviceName:"ForgotPassword",
							onChange: function() {
								FPwdObj.updateContinueBtn();
							}
							
					};
				
					FPwdObj.newCaptch = new captcha(captchaOptions);
					//End call captcha

					var lastUser = DataUtils.getLocalStorageData("RTAUsername", "shell");
					if (lastUser != null && lastUser != undefined) {
						document.getElementById("userID").value = lastUser;
						FPwdObj.userNameValidator.validate();
					}
					FPwdObj.passwordVisible = false;
					var togglePasswords = document.querySelectorAll(".icon-hide-password");
					var passwords = document.querySelectorAll(
							"#PasswordFormPage .password"
					);
					for (var i = 0; i < togglePasswords.length; i++) {
						togglePasswords[i].onclick = function() {
							for (var j = 0; j < passwords.length; j++) {
								if (passwords[j].type == "password") {
									togglePasswords[j].className =
										"icon-view-password waves-effect";
									passwords[j].type = "text";
								} else {
									togglePasswords[j].className =
										"icon-hide-password waves-effect";
									passwords[j].type = "password";
								}
							}
						};
					}
				},
				updateContinueBtn: function() {
					if (
							FPwdObj.userNameValidator.isValid &&
							FPwdObj.passwordValidator.isValid &&
							FPwdObj.rePasswordValidator.isValid &&
							FPwdObj.newCaptch.isValid
					) {
						document.getElementById("updateBtn").className =
							"continueBtn waves-effect";
					} else {
						document.getElementById("updateBtn").className =
							"continueBtn waves-effect disabled";
					}
				},
				sendOTPRequest: function(type) {
					var userID = document.getElementById("userID").value;
					FPwdObj.otpType = type;

					OTPModel.sendOTPbyID(userID, "ResetPassword", type, function(res) {
						FPwdObj.otpPopup.el.querySelector("#customContent").innerHTML = "";
						FPwdObj.otpPopup.options.OTPduration = Number(res.OTPvalidFor);

						FPwdObj.otpPopup.updateResendButton(
								res.AttemptsRemaining,
								Number(res.CurrentCycleRemainingTime)
						);

						FPwdObj.otpPopup.show();
					});
				},
				onUpdateClick: function() 
				{
					FPwdObj.verificationType.show();
				},
				_afterSubmitPasswordRefestHandler: function(result, data) {
					loadingInd = $(".ui-loader");
					if (result == "SUCCESS") {
						loadingInd.hide();
						var sucessPasswordChangePopup_Options = {
								popupId: "sucessPasswordChangePopup",
								title: localize("%shell.popup.error.title%"),
								content: localize("%shell.error.password.changed%"),
								primaryBtnText: localize("%shell.dialog.button.ok%"),
								primaryBtnCallBack: function() {
									/*mobile.changePage("shell/profile.html");*/
									mobile.changePage("shell/profile.html");
								},
								primaryBtnDisabled: false,
								secondaryBtnText: null,
								secondaryBtnCallBack: null,
								secondaryBtnVisible: false,
								secondaryBtnDisabled: false,
								hideOnPrimaryClick: true,
								hideOnSecondaryClick: true,
								aroundClickable: true,
								onAroundClick: function() {
									/*mobile.changePage("shell/profile.html");*/
									mobile.changePage("shell/profile.html");
								}
						};

						var sucessPasswordChangePopup = new Popup(
								sucessPasswordChangePopup_Options
						);
						sucessPasswordChangePopup.show();
					} else {
						loadingInd.hide();
						var errorMsg = localize("%shell.error.password.unchanged%");
						var errorPopup = new Popup("customErrorPopup");
						errorPopup.options.content = errorMsg;
						errorPopup.show();
					}
				},
				_clearFields: function() {
					$("#currentPassVal").empty();
					$("#newPassVal").empty();
					$("#confirmPassVal").empty();
				},
				dispose: function() {
					PageView.prototype.dispose.call(this);
				}
			});

			// Returns the View class
			return ForgotPasswordPageView;
		}
);

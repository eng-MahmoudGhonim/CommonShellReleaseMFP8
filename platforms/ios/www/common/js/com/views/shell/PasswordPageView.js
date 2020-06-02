/* JavaScript content from js/com/views/shell/PasswordPageView.js in folder common */
define(
  [
    "com/views/PageView",
    "com/utils/Utils",
    "com/views/Header",
    "com/models/shell/UserProfileModel",
    "com/models/shell/PasswordModel",
    "com/models/shell/OTPModel",
    "com/utils/DataUtils",
    "com/models/shell/CaptchaModel"
  ],
  function(
    PageView,
    Utils,
    Header,
    UserProfileModel,
    PasswordModel,
    OTPModel,
    DataUtils,
    CaptchaModel
  ) {
    // Extends PagView class
    var PasswordPageView = PageView.extend({
      /**
       * The View Constructor
       * @param el, DOM element of the page
       */
      events: {
        pageshow: "onPageShow"
      },
      initialize: function(options) {
        PasswordPageViewInsance = this;
        options.phoneTitle = Globalize.localize(
          "%shell.change.password.header%",
          getApplicationLanguage()
        );
        options.headerState = Header.STATE_MENU;
        PageView.prototype.initialize.call(this, options);
      },
      onPageShow: function() {
        //			document.getElementById("PasswordFormPage").setAttribute("data-role","content");
        //PasswordPageViewInsance.passHintPopup = new Popup("passwordHint");
        PasswordPageViewInsance.verificationType = new Popup("verifyOTPType");
        PasswordPageViewInsance.verificationType.options.primaryBtnCallBack = function() {
          PasswordPageViewInsance.sendOTPRequest("EMAIL");
        };

        PasswordPageViewInsance.verificationType.options.secondaryBtnCallBack = function() {
          PasswordPageViewInsance.sendOTPRequest("SMS");
        };

        PasswordPageViewInsance.forgotPasswordSuccessPopup = new Popup(
          "forgotPasswordSuccessPopup"
        );

        // we added strength password do we don't need it
        /*document.getElementById("passwordHintBtn").onclick = function () {
				PasswordPageViewInsance.passHintPopup.show()
			}*/

        document.getElementById("updateBtn").onclick = function() {
          PasswordPageViewInsance.onUpdateClick();
        };

        PasswordPageViewInsance.otpPopup = new Popup("OTP");
        PasswordPageViewInsance.otpPopup.options.secondaryBtnCallBack = null;

        PasswordPageViewInsance.otpPopup.options.primaryBtnCallBack = function() {
          var userProfile = DataUtils.getLocalStorageData(
            "userProfile",
            "shell"
          );
          userProfile = JSON.parse(userProfile);
          var userID = userProfile.Users[0].user_id;
          var OTP = PasswordPageViewInsance.otpPopup.pinInput.value;
          OTPModel.verifyOTP(OTP, userID, function(res) {
            if (res.isVerified == "true" || res.isVerified == true) {
              PasswordPageViewInsance.otpPopup.hide(function() {
                ///TODO forgot password
                $(".ui-loader").show();
                var passwordInputs = {
                  currentPassVal: PasswordModel.encPassword(
                    userProfile.Users[0].user_id,
                    document.getElementById("currentPassword").value
                  ),
                  newPassVal: PasswordModel.encPassword(
                    userProfile.Users[0].user_id,
                    document.getElementById("newPasswordInput").value
                  ),
                  confirmPassVal: PasswordModel.encPassword(
                    userProfile.Users[0].user_id,
                    document.getElementById("rePassword").value
                  )
                };

                // on change captcha
                var captcha={
						"key":PasswordPageViewInsance.newCaptch.captchaKey,
						"userAnswerId":PasswordPageViewInsance.newCaptch.captchaAnswer,
						"type":PasswordPageViewInsance.newCaptch.captchaType,
				}
				
				var captchaObject=JSON.stringify(captcha);
                
                
                UserProfileModel.changePassword(passwordInputs,captchaObject, function(res) {
                  $(".ui-loader").hide();
                  if (res.operationStatus && res.operationStatus == "SUCCESS") {
                    PasswordPageViewInsance.forgotPasswordSuccessPopup.show();

                    if (Utils.isiOS() || Utils.isAndroid()) {
                      var password = $("#password").val();
                      var username = userProfile.Users[0].user_id;

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
                  } else {
                    var errorPop = new Popup("generalErrorPopup");
                    errorPop.show();
                  }
                });
              });
            } else {
              /////////show OTP invalid
              PasswordPageViewInsance.otpPopup.options.primaryBtnDisabled = true;
              PasswordPageViewInsance.otpPopup.pinInput.clear();
              PasswordPageViewInsance.otpPopup.el.querySelector(
                ".otpInvalid"
              ).style.opacity = 1;

              if (res.errorCode == "ERR-VO-B-14") {
                clearInterval(PasswordPageViewInsance.otpPopup.timerInterval);
                PasswordPageViewInsance.otpPopup.stopTimer();
                PasswordPageViewInsance.otpPopup.hide(function() {
                  var OTPVerificationLimitPopup = new Popup(
                    "OTPVerificationLimitPopup"
                  );
                  OTPVerificationLimitPopup.show();
                });
              }
            }
          });
        };

        PasswordPageViewInsance.otpPopup.el.querySelector(
          ".resend"
        ).onclick = function() {
          PasswordPageViewInsance.sendOTPRequest(
            PasswordPageViewInsance.otpType,
            function(res) {
              PasswordPageViewInsance.otpPopup.stopTimer();

              PasswordPageViewInsance.otpPopup.pinInput.clear();

              PasswordPageViewInsance.otpPopup.options.OTPduration = Number(
                res.OTPvalidFor
              );

              PasswordPageViewInsance.otpPopup.updateResendButton(
                res.AttemptsRemaining,
                Number(res.CurrentCycleRemainingTime)
              );
              PasswordPageViewInsance.otpPopup.options.primaryBtnDisabled = true;
              setTimeout(function() {
                PasswordPageViewInsance.otpPopup.startTimer();
              }, 150);
            }
          );
        };
        PasswordPageViewInsance.verificationLimitPopup = new Popup(
          "OTPVerificationLimitPopup"
        );
        PasswordPageViewInsance.verificationLimitPopup.options.secondaryBtnText = localize(
          "%shell.label.cancel%"
        );
        PasswordPageViewInsance.verificationLimitPopup.options.secondaryBtnCallBack = null;
        PasswordPageViewInsance.verificationLimitPopup.options.primaryBtnCallBack = function() {
          PasswordPageViewInsance.sendOTPRequest(
            PasswordPageViewInsance.otpType,
            function(res) {
              PasswordPageViewInsance.otpPopup.el.querySelector(
                "#customContent"
              ).innerHTML =
                "";
              PasswordPageViewInsance.otpPopup.options.OTPduration = Number(
                res.OTPvalidFor
              );

              PasswordPageViewInsance.otpPopup.updateResendButton(
                res.AttemptsRemaining,
                Number(res.CurrentCycleRemainingTime)
              );

              PasswordPageViewInsance.otpPopup.show();
            }
          );
        };
        PasswordPageViewInsance.timeoutPop = new Popup("OTPTimeoutPopup");
        PasswordPageViewInsance.timeoutPop.options.secondaryBtnText = localize(
          "%shell.label.cancel%"
        );
        PasswordPageViewInsance.timeoutPop.options.secondaryBtnCallBack = null;
        PasswordPageViewInsance.timeoutPop.options.primaryBtnCallBack = function() {
          PasswordPageViewInsance.sendOTPRequest(
            PasswordPageViewInsance.otpType,
            function(res) {
              PasswordPageViewInsance.otpPopup.el.querySelector(
                "#customContent"
              ).innerHTML =
                "";
              PasswordPageViewInsance.otpPopup.options.OTPduration = Number(
                res.OTPvalidFor
              );

              PasswordPageViewInsance.otpPopup.updateResendButton(
                res.AttemptsRemaining,
                Number(res.CurrentCycleRemainingTime)
              );

              PasswordPageViewInsance.otpPopup.show();
            }
          );
        };

        PasswordPageViewInsance.currentPasswordValidator = new Validator(
          document.querySelector("#currentPasswordField"),
          {
            validations: [
              {
                regEx: "empty",
                errorMessage: localize(
                  "%shell.validations.currentpassword.required%"
                ),
                order: 0
              }
              //
            ],
            onValidate: PasswordPageViewInsance.updateContinueBtn
          }
        );
        PasswordPageViewInsance.passwordValidator = new Validator(
          document.querySelector("#newPasswordField"),
          {
            validations: [
              {
                regEx: "empty",
                errorMessage: localize("%shell.validations.password.required%"),
                order: 0
              },
              {
                regEx: "password",
                errorMessage: localize(
                  "%shell.validations.password.notcorect%"
                ),
                order: 1
              },
              {
                regEx: function(val) {
                  if (val == document.querySelector("#currentPassword").value) {
                    return false;
                  } else {
                    return true;
                  }
                },
                errorMessage: localize(
                  "%shell.validations.newpassword.notmatch%"
                ),
                order: 2
              }
            ],
            onValidate: PasswordPageViewInsance.updateContinueBtn
          }
        );
        PasswordPageViewInsance.rePasswordValidator = new Validator(
          document.querySelector("#rePasswordField"),
          {
            validations: [
              {
                regEx: "empty",
                errorMessage: localize(
                  "%shell.validations.newpassword.required%"
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
                  "%shell.validations.confirmpassword.required%"
                ),
                order: 1
              }
            ],
            onValidate: PasswordPageViewInsance.updateContinueBtn
          }
        );

        // strength password component
        var newValidatorOptions = {
          passwordElement: document.getElementById("newPasswordInput"),
          confirmPasswordElement: document.getElementById("rePassword"),
          infoElement: document.getElementById("passInfo"),
          passwordValidator: PasswordPageViewInsance.passwordValidator,
          rePasswordValidator: PasswordPageViewInsance.rePasswordValidator,
          lang: getApplicationLanguage()
        };
        window.newValidator = new PasswordStrength(newValidatorOptions);
        
        
     // start call captcha
		var captchaOptions = {
				lang: getApplicationLanguage(),
				captchaModel: CaptchaModel,
				serviceName:"ChangePassword",
				onChange: function() {
					PasswordPageViewInsance.updateContinueBtn();
				}
		};
		PasswordPageViewInsance.newCaptch = new captcha(captchaOptions);
		//End call captcha
        
        
      
        
        
        PasswordPageViewInsance.passwordVisible = false;
        var togglePasswords = document.querySelectorAll(".icon-view-password");
        var passwords = document.querySelectorAll("#PasswordFormPage input");
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
          PasswordPageViewInsance.currentPasswordValidator.isValid &&
          PasswordPageViewInsance.passwordValidator.isValid &&
          PasswordPageViewInsance.rePasswordValidator.isValid&&
          PasswordPageViewInsance.newCaptch.isValid
        ) {
          document.getElementById("updateBtn").className =
            "continueBtn waves-effect";
        } else {
          document.getElementById("updateBtn").className =
            "continueBtn waves-effect disabled";
        }
      },
      sendOTPRequest: function(type, callBack) {
        var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
        if (userProfile) {
          userProfile = JSON.parse(userProfile);
          if (userProfile && userProfile.Users[0]) {
            var userID = userProfile.Users[0].user_id;
            PasswordPageViewInsance.otpType = type;
            switch (type) {
              case "EMAIL": {
                if (
                  userProfile.Users[0].is_email_verified == "true" ||
                  userProfile.Users[0].is_email_verified == true
                ) {
                  var email = userProfile.Users[0].mail;
                  OTPModel.sendOTP(
                    userID,
                    "changePassword",
                    null,
                    email,
                    function(res) {
                      if (callBack) {
                        callBack(res);
                      } else {
                        PasswordPageViewInsance.otpPopup.el.querySelector(
                          "#customContent"
                        ).innerHTML =
                          "";
                        PasswordPageViewInsance.otpPopup.options.OTPduration = Number(
                          res.OTPvalidFor
                        );

                        PasswordPageViewInsance.otpPopup.updateResendButton(
                          res.AttemptsRemaining,
                          Number(res.CurrentCycleRemainingTime)
                        );

                        PasswordPageViewInsance.otpPopup.show();
                      }
                    },
                    function(time) {
                      if (typeof time == "string") {
                        var errorpop = new Popup("customErrorPopup");
                        errorpop.options.content =
                          localize("%shell.OTP.sendOTP.text%") + time;
                        errorpop.show();
                      } else {
                        var errorpop = new Popup("generalErrorPopup");
                        errorpop.show();
                      }
                    }
                  );
                } else {
                  ///Email Not Verified
                }
                break;
              }
              case "SMS": {
                if (
                  userProfile.Users[0].is_mobile_verified == "true" ||
                  userProfile.Users[0].is_mobile_verified == true
                ) {
                  var phone = userProfile.Users[0].mobile;
                  OTPModel.sendOTP(
                    userID,
                    "changePassword",
                    phone,
                    null,
                    function(res) {
                      if (callBack) {
                        callBack(res);
                      } else {
                        PasswordPageViewInsance.otpPopup.el.querySelector(
                          "#customContent"
                        ).innerHTML =
                          "";
                        PasswordPageViewInsance.otpPopup.options.OTPduration = Number(
                          res.OTPvalidFor
                        );

                        PasswordPageViewInsance.otpPopup.updateResendButton(
                          res.AttemptsRemaining,
                          Number(res.CurrentCycleRemainingTime)
                        );

                        PasswordPageViewInsance.otpPopup.show();
                      }
                    },
                    function(time) {
                      if (typeof time == "string") {
                        var errorpop = new Popup("customErrorPopup");
                        errorpop.options.content =
                          localize("%shell.OTP.sendOTP.text%") + time;
                        errorpop.show();
                      } else {
                        var errorpop = new Popup("generalErrorPopup");
                        errorpop.show();
                      }
                    }
                  );
                } else {
                  var errorPopup = new Popup("customErrorPopup");
                  errorPopup.options.content = localize(
                    "%shell.popup.error.mobileNotVerified%"
                  );
                  errorPopup.show();
                }
                break;
              }
            }
          }
        }
      },
      onUpdateClick: function() {
        PasswordPageViewInsance.verificationType.show();
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
            /*  mobile.changePage("shell/profile.html");*/
            	Utils.loadMyAccountPage();
            	
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
             /* mobile.changePage("shell/profile.html");*/
            	Utils.loadMyAccountPage();
            }
          };

          var sucessPasswordChangePopup = new Popup(
            sucessPasswordChangePopup_Options
          );
          sucessPasswordChangePopup.show();
        } else {
          loadingInd.hide();
          var errorMsg = Globalize.localize(
            "%shell.error.password.unchanged%",
            getApplicationLanguage()
          );
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

      /**
       * do any cleanup, remove window binding here
       * @param none
       */
      dispose: function() {
        PageView.prototype.dispose.call(this);
      }
    });

    // Returns the View class
    return PasswordPageView;
  }
);

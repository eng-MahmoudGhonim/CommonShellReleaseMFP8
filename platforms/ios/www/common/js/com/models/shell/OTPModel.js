define(["backbone", "com/models/Constants", "com/utils/Utils", "com/utils/DataUtils", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel"], function(Backbone, Constants, Utils, DataUtils, UserProfileModel, AuthenticationModel) {
	var OTPModel = Backbone.Model.extend({}, {
		millisToMinutesAndSeconds: function(millis) {
			var minutes = Math.floor(millis / 60000);
			var seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
		},
		formatAMPM: function(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? "pm" : "am";
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? "0" + minutes : minutes;
			var strTime = hours + ":" + minutes + " " + ampm;
			return strTime;
		},
		sendOTP: function(userID, method, phone, email, callBack, errorCallBack) {
			var generalErrorPopup = new Popup("customErrorPopup");
			var otpData = localStorage.getItem("shellOTP");
			if (otpData != null) {
				otpData = JSON.parse(otpData);
				if (otpData.AttemptsRemaining == 0) {
					if (Date.now() < otpData.availableTime) {
						var time = this.formatAMPM(new Date(Date.now() + Math.abs(Date.now() - otpData.availableTime)));
						if (errorCallBack) {
							errorCallBack(time);
						} else {
							generalErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + time;
							generalErrorPopup.show();
						}
					} else {
						this.sendOTPRequest(userID, method, phone, email, callBack, errorCallBack);
					}
				} else {
					this.sendOTPRequest(userID, method, phone, email, callBack, errorCallBack);
				}
			} else {
				this.sendOTPRequest(userID, method, phone, email, callBack, errorCallBack);
			}
		},
		sendOTPRequest: function(userID, method, phone, email, callBack, errorCallBack) {
			$(".ui-loader").show();
			var invocationData = {
				adapter: "OTPAdapter",
				procedure: "sendOTP",
				invocationContext: this,
				parameters: [
					Constants.PORTAL_APP_IDs[Constants.APP_ID],
					userID,
					getApplicationLanguage() == "en" ? "En" : "Ar",
					method,
					phone,
					email

				]
			};
			invokeWLResourceRequest(invocationData,
				function(result) {
					$(".ui-loader").hide();
					if (result.invocationResult.isSuccessful && !result.invocationResult.failure) {
						var response = result.invocationResult.response;
						if (response.transStatus == 0) {
							response.availableTime = Date.now() + Number(response.CurrentCycleRemainingTime);
							localStorage.setItem("shellOTP", JSON.stringify(response));
							if (callBack) callBack(response);
						} else {
							if (response.errorCode == "ERR-SO-B-10") {
								var DataToCache = {
									AttemptsRemaining: 0,
									availableTime: Date.now() + Number(response.lockOutPeriod),
									locked: true
								};
								localStorage.setItem("shellOTP", JSON.stringify(DataToCache));
							}
							if (errorCallBack) {
								errorCallBack(response);
							} else {
								var errorPop = new Popup("customErrorPopup");
								errorPop.options.content = response.errorMessage;
								errorPop.show();
							}
						}
					} else {
						if (errorCallBack) {
							errorCallBack(response);
						} else {
							//TODO
							var errorpop = new Popup("generalErrorPopup");
							errorpop.show();
						}
					}
				},
				function(e) {
					$(".ui-loader").hide();
					if (errorCallBack) {
						errorCallBack(response);
					} else {
						//TODO
						var errorpop = new Popup("generalErrorPopup");
						errorpop.show();
					}
				}

			);
		},
		sendOTPbyID: function(userID, method, otpType, callBack, errorCallBack) {
			var generalErrorPopup = new Popup("customErrorPopup");
			var otpData = localStorage.getItem("shellOTP");
			if (otpData != null) {
				otpData = JSON.parse(otpData);
				if (otpData.AttemptsRemaining == 0) {
					if (Date.now() < otpData.availableTime) {
						var time = this.formatAMPM(new Date(Date.now() + Math.abs(Date.now() - otpData.availableTime)));
						if (errorCallBack) {
							errorCallBack(time);
						} else {
							generalErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") +
								//							+ this.millisToMinutesAndSeconds(Math.abs(Date.now() - otpData.availableTime));
								time;
							generalErrorPopup.show();
						}
					} else {
						this.sendOTPRequestByID(userID, method, otpType, callBack);
					}
				} else {
					this.sendOTPRequestByID(userID, method, otpType, callBack);
				}
			} else {
				this.sendOTPRequestByID(userID, method, otpType, callBack);
			}
		},
		sendOTPRequestByID: function(userID, method, otpType, callBack, errorCallBack) {
			$(".ui-loader").show();
			var invocationData = {
				adapter: "OTPAdapter",
				procedure: "sendOTPByID",
				invocationContext: this,
				parameters: [
					Constants.PORTAL_APP_IDs[Constants.APP_ID],
					userID,
					getApplicationLanguage() == "en" ? "En" : "Ar",
					method,
					otpType

				]
			};
			invokeWLResourceRequest(invocationData,
				function(result) {
					$(".ui-loader").hide();
					if (result.invocationResult.isSuccessful && !result.invocationResult.failure) {
						var response = result.invocationResult.response;
						if (response.transStatus == 0) {
							response.availableTime = Date.now() + Number(response.CurrentCycleRemainingTime);
							localStorage.setItem("shellOTP", JSON.stringify(response));
							if (callBack) callBack(response);
						} else {
							var errorPop = new Popup("customErrorPopup");
							if (response.errorCode == "ERR-SO-B-10") {
								var DataToCache = {
									AttemptsRemaining: 0,
									availableTime: Date.now() + Number(response.lockOutPeriod),
									locked: true
								};
								localStorage.setItem("shellOTP", JSON.stringify(DataToCache));
							}
							errorPop.options.content = response.errorMessage;
							errorPop.show();
						}
					} else {
						///TODO
						var errorCode = result.invocationResult.failure.errorCode;
						if (errorCode == "E0046") {
							var errorpop = new Popup("customErrorPopup");
							errorpop.options.content = localize("%shell.username%") + " '" + userID + "' " + localize("%shell.OTP.sendOTP.text3%");
							errorpop.show();
						} else if (errorCode == "ERR-VERIFICATION-MAIL") {
							var errorpop = new Popup("customErrorPopup");
							errorpop.options.content = localize("%shell.OTP.sendOTP.text1%");
							errorpop.show();
						} else if (errorCode == "ERR-VERIFICATION-SMS") {
							var errorpop = new Popup("customErrorPopup");
							errorpop.options.content = localize("%shell.OTP.sendOTP.text2%");
							errorpop.show();
						} else {
							var errorpop = new Popup("generalErrorPopup");
							errorpop.show();
						}
					}
				},
				function(e) {
					$(".ui-loader").hide();
					Popup.hide(function() {
						var errorpop = new Popup("generalErrorPopup");
						errorpop.show();
					});
				}

			);
		},
		verifyOTP: function(OTP, userID, callBack, errorCallBack) {
			$(".ui-loader").show();
			var transRef = "";
			var otpData = localStorage.getItem("shellOTP");
			if (otpData != null) {
				otpData = JSON.parse(otpData);
				transRef = otpData.transRef;
			}
			var invocationData = {
				adapter: "OTPAdapter",
				procedure: "verifyOTP",
				invocationContext: this,
				parameters: [
					OTP,
					Constants.PORTAL_APP_IDs[Constants.APP_ID],
					userID,
					transRef

				]
			};
			invokeWLResourceRequest(invocationData,
				function(result) {
					$(".ui-loader").hide();
					if (result.invocationResult.isSuccessful && !result.invocationResult.failure) {
						if (callBack) callBack(result.invocationResult.response);
					} else {
						if (errorCallBack) {
							errorCallBack();
						} else {
							Popup.hide(function() {
								var errorpop = new Popup("generalErrorPopup");
								errorpop.show();
							});
						}
					}
				},
				function(e) {
					$(".ui-loader").hide();
					if (errorCallBack) {
						errorCallBack();
					} else {
						Popup.hide(function() {
							var errorpop = new Popup("generalErrorPopup");
							errorpop.show();
						});
					}
				}

			);
		},
		checkMobileVerification: function() {
			var self = this;
			var otpPopup = new Popup("MobileOTPPopup");
			var OTPErrorPopup;
			var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
			if (userProfile) {
				var profile = JSON.parse(userProfile).Users[0];
			}
			if (profile && !(profile.is_mobile_verified == "true" || profile.is_mobile_verified == true)) {
				var OTPErrorPopup_Options = {
					popupId: "OTPErrorPopup",
					title: localize("%shell.popup.error.title%"),
					content: localize("%shell.popup.error.default.applicationError%"),
					primaryBtnText: localize("%shell.OTP.resend%"),
					primaryBtnCallBack: function() {
						self.sendOTP(profile.user_id, "updateMobile", profile.mobile, null, function(res) {
							otpPopup.currentMobile = profile.mobile;
							otpPopup.el.querySelector("#mobileNumber").value = profile.mobile;
							otpPopup.options.OTPduration = Number(res.OTPvalidFor);
							otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
							Popup.hide(function() {
								otpPopup.show();
							});
						}, function(err) {
							//TODO resend error
							if (typeof err == "string") {
								OTPErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + err;
							} else {
								OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
							}
							Popup.hide(function() {
								OTPErrorPopup.show();
							});
						});
					},
					primaryBtnDisabled: false,
					secondaryBtnText: localize("%shell.logout.link%"),
					secondaryBtnCallBack: function() {
						var AuthenticationModel = require("com/models/shell/AuthenticationModel");
						AuthenticationModel.logout();
					},
					secondaryBtnVisible: true,
					secondaryBtnDisabled: false,
					hideOnPrimaryClick: true,
					hideOnSecondaryClick: true,
					aroundClickable: false,
					onAroundClick: null
				};
				OTPErrorPopup = new Popup(OTPErrorPopup_Options);
				//				otpPopup = new Popup("MobileOTPPopup");
				if (UserProfileModel.isCorporateUser()) {
					otpPopup.el.querySelector("#changeBtn").className = "disabled";
					//					$("#changeBtn").hide();
				} else {
					otpPopup.el.querySelector("#changeBtn").className = "";
					//					$("#changeBtn").show();
				}
				otpPopup.options.primaryBtnCallBack = function() {
					var userId = profile.user_id;
					var OTP = otpPopup.pinInput.value;
					self.verifyOTP(OTP, userId, function(res) {
						if (res.isVerified == "true") {
							otpPopup.hide(function() {
								$(".ui-loader").show();
								var inputs = {
									userId: profile.user_id,
									oldMobileNo: null,
									newMobileNo: otpPopup.currentMobile
								};
								UserProfileModel.updateMobileNumber(inputs, function(status, result) {
									$(".ui-loader").hide();
									if (status == AuthenticationModel.SUCCESS && result.invocationResult.isSuccessful) {} else {
										///TODO show OTP again
										OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
										Popup.hide(function() {
											OTPErrorPopup.show();
										});
									}
								});
							});
						} else {
							/////////show OTP invalid
							otpPopup.options.primaryBtnDisabled = true;
							otpPopup.pinInput.clear();
							otpPopup.el.querySelector(".otpInvalid").style.opacity = 1;
						}
					}, function() {
						Popup.hide(function() {
							OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
							Popup.hide(function() {
								OTPErrorPopup.show();
							});
						});
					});
				};
				otpPopup.el.querySelector(".resend").onclick = function() {
					var mobile = otpPopup.currentMobile;
					self.sendOTP(profile.user_id, "updateMobile", mobile, null, function(res) {
						otpPopup.stopTimer();
						otpPopup.pinInput.clear();
						otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						otpPopup.options.primaryBtnDisabled = true;
						setTimeout(function() {
							otpPopup.startTimer();
						}, 150);
					}, function(err) {
						//TODO resend error
						Popup.hide(function() {
							OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
							Popup.hide(function() {
								OTPErrorPopup.show();
							});
						});
					});
				};
				var timeoutPop = new Popup("OTPTimeoutPopup");
				timeoutPop.options.primaryBtnCallBack = function() {
					var mobile = otpPopup.currentMobile;
					self.sendOTP(profile.user_id, "updateMobile", mobile, null, function(res) {
						timeoutPop.hide(function() {
							otpPopup.el.querySelector("#mobileNumber").value = otpPopup.currentMobile;
							otpPopup.options.OTPduration = Number(res.OTPvalidFor);
							otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
							Popup.hide(function() {
								otpPopup.show();
							});
						});
					}, function(err) {
						//TODO handle error
						timeoutPop.hide(function() {
							if (typeof err == "string") {
								OTPErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + err;
							} else {
								OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
							}
							Popup.hide(function() {
								OTPErrorPopup.show();
							});
						});
					});
				};
				timeoutPop.options.secondaryBtnText = localize("%shell.logout.link%");
				timeoutPop.options.secondaryBtnCallBack = function() {
					var AuthenticationModel = require("com/models/shell/AuthenticationModel");
					AuthenticationModel.logout();
				};
				self.sendOTP(profile.user_id, "updateMobile", profile.mobile, null, function(res) {
					otpPopup.currentMobile = profile.mobile;
					otpPopup.el.querySelector("#mobileNumber").value = profile.mobile;
					otpPopup.options.OTPduration = Number(res.OTPvalidFor);
					otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
					Popup.hide(function() {
						otpPopup.show();
					});
				}, function(err) {
					//TODO resend error
					if (typeof err == "string") {
						OTPErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + err;
					} else {
						OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
					}
					Popup.hide(function() {
						OTPErrorPopup.show();
					});
				});
				otpPopup.el.querySelector("#changeBtn").onclick = function() {
					otpPopup.stopTimer();
					otpPopup.hide(function() {
						var changePhone = new Popup("changePhonePopup");
						changePhone.options.primaryBtnCallBack = function() {
							otpPopup.currentMobile = "971" + changePhone.el.querySelector("#changePopupMobilePrefix").options[changePhone.el.querySelector("#changePopupMobilePrefix").selectedIndex].value + changePhone.el.querySelector("#changeMbileEditInput").value;
							var mobile = otpPopup.currentMobile;
							//							UserProfileModel.updateProfile("Users","traffic_number",value)
							self.sendOTP(profile.user_id, "updateMobile", mobile, null, function(res) {
								changePhone.hide(function() {
									otpPopup.el.querySelector("#mobileNumber").value = otpPopup.currentMobile;
									otpPopup.options.OTPduration = Number(res.OTPvalidFor);
									otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
									otpPopup.options.primaryBtnDisabled = true;
									Popup.hide(function() {
										otpPopup.show();
									});
								});
							}, function(err) {
								//TODO resend error
								changePhone.hide(function() {
									if (typeof err == "string") {
										OTPErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + err;
									} else {
										OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
									}
									Popup.hide(function() {
										OTPErrorPopup.show();
									});
								});
							});
						};
						changePhone.show();
					});
				};
				//otpPopup.el.querySelector("#saveBtn").onclick = function(){
				//    otpPopup.currentMobile =
				//    "971"
				//    + otpPopup.el.querySelector("#phonePrefix")
				//    .options[otpPopup.el.querySelector("#phonePrefix").selectedIndex].value
				//    + otpPopup.el.querySelector("#newMobile").value;
				//    var mobile = otpPopup.currentMobile;
				//    self.sendOTP(profile.user_id,"updateProfile", mobile,null,
				//    function(res){
				//        otpPopup.el.querySelector("#mobileNumber").value
				//            = otpPopup.currentMobile;
				//        otpPopup.toggleUpdatePhone();
				//        otpPopup.stopTimer();
				//        document.getElementById("MobileOTPPopup").getElementsByClassName("inputContainer")[0]
				//        .getElementsByTagName("label")[0].style.display = "block";
				//        document.getElementById("MobileOTPPopup").getElementsByClassName("inputContainer")[0]
				//        .getElementsByTagName("input")[0].value = "";
				//        document.getElementById("MobileOTPPopup").getElementsByClassName("inputContainer")[0]
				//        .getElementsByTagName("input")[0].style.borderColor = "#ccc";
				//        document.getElementById("MobileOTPPopup").getElementsByClassName("inputContainer")[0]
				//        .getElementsByTagName("span")[0].style.display = "none";
				//        otpPopup.options.OTPduration
				//            = Number(res.OTPvalidFor);
				//        otpPopup
				//            .updateResendButton(res.AttemptsRemaining,Number(res.CurrentCycleRemainingTime));
				//        otpPopup.options.primaryBtnDisabled = true;
				//        setTimeout(function(){
				//            otpPopup.startTimer();
				//        },150);
				//    },function(err){
				//        //TODO resend error
				//        if(typeof err == "string"){
				//            OTPErrorPopup.options.content = localize("%shell.OTP.sendOTP.text%") + err;
				//        }else{
				//            OTPErrorPopup.options.content = localize("%shell.popup.error.default.applicationError%");
				//        }
				//        Popup.hide(function(){
				//            OTPErrorPopup.show();
				//        });
				//    });
				//}
			}
		}
	});
	return OTPModel;
});

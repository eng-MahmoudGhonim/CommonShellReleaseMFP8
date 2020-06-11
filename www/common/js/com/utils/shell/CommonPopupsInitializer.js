(function() {
	"use strict",
	window.CommonPopupsInitializer = function() {
		Popup.initialize();
		//////////////////////////////MPay User Is not found ////////////////
		var mpayUserNotFoundPopup_Options = {
				popupId: "mpayUserNotFoundPopup",
				title: localize("%shell.OTPVerificationLimitPopup.title%"),
				content: window.Utils.applyLocalization('<div class="mpayPopupContent"><span class="usercontent1">%shell.Mpay.MpayUserNameNotFoundContent1%</span><span class="usercontent2">%shell.Mpay.MpayUserNameNotFoundContent2%</span> </div>'
				),
				primaryBtnText: localize("%shell.Mpay.RegisterMpay%"),
				primaryBtnCallBack: function(){

					 window.open("http://mpay.dubai.ae/userPortal", '_system');
				},
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack: null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
		}
		var mpayUserNotFoundPopup = new Popup(mpayUserNotFoundPopup_Options);
		//setTimeout(function() {
			//mpayUserNotFoundPopup.show();
		//}, 600);
		/////////////////////////////////////////mpay wallet blocked///////////////////
		var mpayWalletBlockedPopup_Options = {
				popupId: "mpayWalletBlockedPopup",
				title: localize("%shell.OTPVerificationLimitPopup.title%"),
				content: window.Utils.applyLocalization('<div class="mpayWalletPopupContent">%shell.Mpay.MpayWalletBlocked%</div><div class="callRTA">%shell.Mpay.MpayCallCenter%</div>'
				),
				primaryBtnText: localize("%shell.Mpay.CallRTA%"),
				primaryBtnCallBack: function(){
					window.open("tel:8009090", "_system");
				},
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack: null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
		}
		var mpayWalletBlockedPopup = new Popup(mpayWalletBlockedPopup_Options);
		//setTimeout(function() {
		//	mpayWalletBlockedPopup.show();
		//}, 600);
		////////////////////////////UAE PAss ///////////////////////////////////
		// success linked UAE PAss
		var successLinkUAEPassPopup_Options = {
				popupId: "successLinkUAEPassPopup",
				title: localize("%shell.Login.linkUAEPassTitlePopup%"),
				content: window.Utils.applyLocalization('<div class="successLinkUAEPassHeader"><img id="successLinkRta-logo">'+
						'<span class="arrowLine icon-link-account"> </span><img id="sucessLinkUAELogoId"></img></div>'+
						'<div  class="checkedIcon icon-checked "></div>  '+
						'<div  class=" congratulationText">%shell.Login.SuccessLoginUAEPass%</div> '+
						'<div  class=" successContent">%shell.Login.SuccessLinkUAEPassContent%</div>'
				),

				primaryBtnCallBack: null,
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack: null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
		}
		var successLinkUAEPassPopup = new Popup(successLinkUAEPassPopup_Options);
		/*setTimeout(function() {
			successLinkUAEPassPopup.show();
		}, 600);*/










		// UAE PAss is not installed
		var UAEPassNotInstalledPopup_Options ={
				popupId: "UAEPassNotInstalledPopup",
				title: localize("%shell.Login.appNotInstalled%"),
				content: window.Utils.applyLocalization('<div class="appUAEPASSNotInstalledPopupContent"><img class="loginUAEPASSLogo"></div>'+
						'<div class="icon-danger"></div> '+
						//'<div class="appNotInstalledTitle">%shell.OTPVerificationLimitPopup.title%</div> '+
						'<div class="appNotInstalledBody">%shell.Login.NotInstalledUAEPassContent%</div>'
				),
				primaryBtnText: localize("%shell.Login.Install%"),
				primaryBtnCallBack: function(){
					var url=Utils.getAppStoreUAEPass();
					if(url){
						var winUAEPass = window.open(url, "_system");
						winUAEPass.focus();
					}
				},
				primaryBtnDisabled: false,
				secondaryBtnText: localize("%shell.label.cancel%"),
				secondaryBtnCallBack: null,
				secondaryBtnVisible: true,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: false,
				onAroundClick: null
		}
		var UAEPassNotInstalledPopup = new Popup(UAEPassNotInstalledPopup_Options);
		/*setTimeout(function() {
			UAEPassNotInstalledPopup.show();
		}, 600);*/
       /////////////////////////////////////////////////////////////////////////
		// User has cancelled UAE PASS login
		var UAEPassCancelledPopup_Options ={
				popupId: "UAEPassCancelledPopup",
				title: localize("%shell.Login.loginUAEPassCancelledTitle%"),
				content: window.Utils.applyLocalization('<div class="appUAEPASSNotInstalledPopupContent"><img class="loginUAEPASSLogo"></div>'+
						'<div class="icon-cancel1" alt="close"></div> '+
						'<div class="appCancelledBody">%shell.Login.loginUAEPassCancelledBody%</div>'
				),
				primaryBtnText: localize("%shell.dashboard.coporate.login%"),
				primaryBtnCallBack: function(){
					window.LoginViewControl.show();
				},
				primaryBtnDisabled: false,
				secondaryBtnText: localize("%shell.label.cancel%"),
				secondaryBtnCallBack: null,
				secondaryBtnVisible: true,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: false,
				onAroundClick: null
		}
		var UAEPassCancelledPopup = new Popup(UAEPassCancelledPopup_Options);
		/*setTimeout(function() {
			UAEPassCancelledPopup.show();
		}, 600);*/


		///////////////////////////////////////////////////////////////////////////
		var verifyOTPTypePopup_Options = {
			popupId: "verifyOTPType",
			title: localize("%shell.verifyOTPTypePopup.title%"),
			content: localize("%shell.verifyOTPTypePopup.content%"),
			primaryBtnText: localize("%shell.email.address%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.sms.label%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var verifyOTPTypePopup = new Popup(verifyOTPTypePopup_Options);
		////////////////////////////////////////////////////////////////////////////////////////
		var changePhonePopup_Options = {
			popupId: "changePhonePopup",
			title: localize("%shell.mobileOTP.title%"),
			content: window.Utils.applyLocalization('<div class="fieldRow mobileRow"> <span class="shell-label">%shell.register2.mobile%</span> <div class="shell-dropdown-wrapper mdi mdi-chevron-down countryCode"> <select data-role="none" class="shell-select disabled"> <option value="971">+971</option> </select> </div><div class="shell-dropdown-wrapper mdi mdi-chevron-down prefix"> <select id="changePopupMobilePrefix" data-role="none" class="shell-select disabled"> <option value="50">50</option> <option value="52">52</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="58">58</option> </select> </div><div class="shell-input-cont" id="changeMobilePopupEditField"> <input data-role="none" data-role="none" id="changeMbileEditInput" type="number"/> <span class="icon-input-error"></span> <span class="errorMessage"></span> </div></div>'),
			primaryBtnText: "Change",
			primaryBtnCallBack: null,
			primaryBtnDisabled: true,
			secondaryBtnText: localize("%shell.logout.link%"),
			secondaryBtnCallBack: function() {
				var AuthenticationModel = require("com/models/shell/AuthenticationModel");
				AuthenticationModel.logout();
			},
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: false,
			hideOnSecondaryClick: false,
			aroundClickable: false,
			onAroundClick: null
		}
		var changePhonePopup = new Popup(changePhonePopup_Options);
		var mbileEditFieldValidator = new Validator(changePhonePopup.el.querySelector("#changeMobilePopupEditField"), {
			validations: [{
				regEx: "empty",
				errorMessage: localize("%shell.registeration.validation.mobile.required2%"),
				order: 0
			}, {
				regEx: function(val, el) {
					if (val.length >= 7) {
						el.value = val.substring(0, 7);
						return true;
					} else {
						return false;
					}
				},
				errorMessage: localize("%shell.registeration.validation.mobile.required3%"),
				order: 1
			}],
			onValidate: function(valid) {
				if (valid) {
					changePhonePopup.options.primaryBtnDisabled = false;
				} else {
					changePhonePopup.options.primaryBtnDisabled = true;
				}
			}
		});
		changePhonePopup.onHide = function() {
			changePhonePopup.el.querySelector("#changeMbileEditInput").value = "";
			mbileEditFieldValidator.visited = false;
			mbileEditFieldValidator.removeValidation();
		}
		// ////////////////////////////////////////////////////////////////////////////////////////
		var OTPPopup_Options = {
			popupId: "OTP",
			title: localize("%shell.OTP.title%"),
			content: localize("%shell.OTP.content%"),
			primaryBtnText: localize("%shell.OTP.primaryBtnText%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: true,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: false,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var OTPPopup = new Popup(OTPPopup_Options);
		OTPPopup.updateResendButton = function(remaining, duration) {
			var el = document.getElementById("OTP");
			if (remaining > 0) {
				el.querySelector(".noMoreAttempts").style.display = "none";
				el.querySelector(".resend").style.display = "block";
			} else {
				el.querySelector(".noMoreAttempts").style.display = "block";
				el.querySelector(".resend").style.display = "none";
				OTPPopup.resendTimeout = setTimeout(function() {
					el.querySelector(".noMoreAttempts").style.display = "none";
					el.querySelector(".resend").style.display = "block";
				}, duration);
			}
		}
		OTPPopup.startTimer = function() {
			var el = document.getElementById("OTP");
			el.getElementsByClassName("remainCounter")[0].innerText = "5:00";
			el.getElementsByClassName("timerLine")[0].style.webkitAnimation = "timerAnimation " + OTPPopup.options.OTPduration + "ms linear forwards";
			var totalSeconds = OTPPopup.options.OTPduration / 1000;
			OTPPopup.timerInterval = setInterval(function() {
				--totalSeconds;
				if (totalSeconds < 0) {
					clearInterval(OTPPopup.timerInterval);
					OTPPopup.options.primaryBtnDisabled = true;
					OTPPopup.hide(function() {
						var timeoutPop = new Popup("OTPTimeoutPopup");
						timeoutPop.show();
					});
					return;
				}
				var seconds = pad(totalSeconds % 60);
				var minutes = pad(parseInt(totalSeconds / 60));
				el.getElementsByClassName("remainCounter")[0].innerText = minutes + ":" + seconds;
			}, 1000);
		}
		OTPPopup.stopTimer = function() {
			var el = document.getElementById("OTP");
			el.getElementsByClassName("timerLine")[0].style.webkitAnimation = "";
			clearInterval(OTPPopup.timerInterval);
			OTPPopup.timerInterval = null;
			el.getElementsByClassName("remainCounter")[0].innerText = "5:00";
		}
		OTPPopup.onHide = function() {
			OTPPopup.el.querySelector(".otpInvalid").style.opacity = 0;
			OTPPopup.stopTimer();
			clearTimeout(OTPPopup.resendTimeout);
			OTPPopup.pinInput.clear();
		}
		OTPPopup.onShow = OTPPopup.startTimer;

		function pad(val) {
			var valString = val + "";
			if (valString.length < 2) {
				return "0" + valString;
			} else {
				return valString;
			}
		}
		OTPPopup.pinOptions = {
			direction: "ltr",
			element: OTPPopup.el.querySelector("#formPinInput"),
			autoClearFocus: true,
			onComplete: function() {
				OTPPopup.options.primaryBtnDisabled = false;
			}
		}
		OTPPopup.pinInput = new PinInput(OTPPopup.pinOptions);
		OTPPopup.pinInput.onchange = function(val) {
			OTPPopup.el.querySelector(".otpInvalid").style.opacity = 0;
			if (OTPPopup.pinInput.value != null) {
				OTPPopup.options.primaryBtnDisabled = false;
			} else {
				OTPPopup.options.primaryBtnDisabled = true;
			}
		}
		// ////////////////////////////////////////////////////////////////////////////////////////
		var passwordHintPopup_Options = {
			popupId: "passwordHint",
			title: localize("%shell.passwordHintPopup.title%"),
			content: localize("%shell.passwordHintPopup.content%"),
			primaryBtnText: localize("%shell.label.ok%"),
			secondaryBtnVisible: false,
			primaryBtnDisabled: false,
			aroundClickable: true,
		}
		var passwordHintPopup = new Popup(passwordHintPopup_Options);
		// ////////////////////////////////////////////////////////////////////////////////////////
		var OTPTimeoutPopup_Options = {
			popupId: "OTPTimeoutPopup",
			title: localize("%shell.OTPtimeout.title%"),
			content: localize("%shell.OTPtimeout.content%"),
			primaryBtnText: localize("%shell.OTP.resend%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: false,
			onAroundClick: null
		}
		var OTPTimeoutPopup = new Popup(OTPTimeoutPopup_Options);
		// ////////////////////////////////////////////////////////////////////////////////////////
		var OTPVerificationLimitPopup_Options = {
			popupId: "OTPVerificationLimitPopup",
			title: localize("%shell.OTPVerificationLimitPopup.title%"),
			content: localize("%shell.OTPVerificationLimitPopup.content%"),
			primaryBtnText: localize("%shell.OTP.resend%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: false,
			onAroundClick: null
		}
		var OTPVerificationLimitPopup = new Popup(OTPVerificationLimitPopup_Options);
		// ////////////////////////////////////////////////////////////////////////////////////////
		var MobileOTPPopup_Options = {
			popupId: "MobileOTPPopup",
			title: localize("%shell.mobileOTP.title%"),
			content: localize("%shell.mobileOTP.content%"),
			primaryBtnText: localize("%shell.OTP.primaryBtnText%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: true,
			secondaryBtnText: localize("%shell.logout.link%"),
			secondaryBtnCallBack: function() {
				var AuthenticationModel = require("com/models/shell/AuthenticationModel");
				AuthenticationModel.logout();
			},
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: false,
			hideOnSecondaryClick: true,
			aroundClickable: false,
			onAroundClick: null
		}
		var MobileOTPPopup = new Popup(MobileOTPPopup_Options);
		MobileOTPPopup.otpWaiting = true;
		MobileOTPPopup.updateResendButton = function(remaining, duration) {
			var el = document.getElementById("MobileOTPPopup");
			if (remaining > 0) {
				el.querySelector(".noMoreAttempts").style.display = "none";
				el.querySelector(".resend").style.display = "block";
				el.querySelector("#changeBtn").style.display = "block";
			} else {
				el.querySelector(".noMoreAttempts").style.display = "block";
				el.querySelector(".resend").style.display = "none";
				el.querySelector("#changeBtn").style.display = "none";
				MobileOTPPopup.resendTimeout = setTimeout(function() {
					el.querySelector(".noMoreAttempts").style.display = "none";
					el.querySelector(".resend").style.display = "block";
					el.querySelector("#changeBtn").style.display = "block";
				}, duration);
			}
		}
		MobileOTPPopup.startTimer = function() {
			var el = document.getElementById("MobileOTPPopup");
			el.getElementsByClassName("remainCounter")[0].innerText = "5:00";
			el.getElementsByClassName("timerLine")[0].style.webkitAnimation = "timerAnimation " + MobileOTPPopup.options.OTPduration + "ms linear forwards";
			var totalSeconds = MobileOTPPopup.options.OTPduration / 1000;
			MobileOTPPopup.timerInterval = setInterval(function() {
				--totalSeconds;
				if (totalSeconds < 0) {
					clearInterval(MobileOTPPopup.timerInterval);
					MobileOTPPopup.options.primaryBtnDisabled = true;
					MobileOTPPopup.hide(function() {
						var timeoutPop = new Popup("OTPTimeoutPopup");
						timeoutPop.show();
					});
					return;
				}
				var seconds = pad(totalSeconds % 60);
				var minutes = pad(parseInt(totalSeconds / 60));
				el.getElementsByClassName("remainCounter")[0].innerText = minutes + ":" + seconds;
			}, 1000);
		}
		MobileOTPPopup.stopTimer = function() {
			var el = document.getElementById("MobileOTPPopup");
			el.getElementsByClassName("timerLine")[0].style.webkitAnimation = "";
			clearInterval(MobileOTPPopup.timerInterval);
			el.getElementsByClassName("remainCounter")[0].innerText = "5:00";
		}
		MobileOTPPopup.onHide = function() {
			MobileOTPPopup.el.querySelector(".otpInvalid").style.opacity = 0;
			MobileOTPPopup.stopTimer();
			clearTimeout(MobileOTPPopup.resendTimeout);
			MobileOTPPopup.pinInput.clear();
			MobileOTPPopup.otpWaiting = true;
			//document.getElementById("MobileOTPPopup").querySelector("#otpWaiting").style.display = "block";
			//document.getElementById("MobileOTPPopup").querySelector(".editPhone").style.display = "none";
		}
		MobileOTPPopup.onShow = MobileOTPPopup.startTimer;
		MobileOTPPopup.pinOptions = {
			direction: "ltr",
			element: MobileOTPPopup.el.querySelector("#mobileOTPPinInput"),
			autoClearFocus: true,
			onComplete: function() {
				MobileOTPPopup.options.primaryBtnDisabled = false;
			}
		}
		MobileOTPPopup.pinInput = new PinInput(MobileOTPPopup.pinOptions);
		MobileOTPPopup.pinInput.onchange = function(val) {
			MobileOTPPopup.el.querySelector(".otpInvalid").style.opacity = 0;
			if (MobileOTPPopup.pinInput.value != null) {
				MobileOTPPopup.options.primaryBtnDisabled = false;
			} else {
				MobileOTPPopup.options.primaryBtnDisabled = true;
			}
		}
		MobileOTPPopup.toggleUpdatePhone = function() {
			/*if(MobileOTPPopup.otpWaiting){
				document.getElementById("MobileOTPPopup").querySelector("#otpWaiting").style.display = "none";
				document.getElementById("MobileOTPPopup").querySelector(".editPhone").style.display = "block";
			}else{
				document.getElementById("MobileOTPPopup").querySelector("#otpWaiting").style.display = "block";
				document.getElementById("MobileOTPPopup").querySelector(".editPhone").style.display = "none";
			}
			document.getElementById("MobileOTPPopup").querySelector("#newMobile").value = "";
			document.getElementById("MobileOTPPopup").querySelector("#saveBtn").className = "ui-disabled bgColorCS";
			MobileOTPPopup.otpWaiting = !MobileOTPPopup.otpWaiting;*/
		}
		document.getElementById("MobileOTPPopup").querySelector("#changeBtn").onclick = function() {
			MobileOTPPopup.options.primaryBtnDisabled = true;
			MobileOTPPopup.toggleUpdatePhone();
		}
		// ///////////////////////////////////////////////////////////////////////////////
		var registerSuccessPopup_Options = {
			popupId: "registerSuccessPopup",
			title: localize("%shell.registerSuccess.title%"),
			content: localize("%shell.registerSuccess.content%"),
			primaryBtnText: localize("%shell.label.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var registerSuccessPopup = new Popup(registerSuccessPopup_Options);
		////////////////////////////////////////////////////////////////////


		var saveChangesSuccessPopup_Options = {
				popupId: "saveChangesSuccessPopup",
				title: localize("%shell.incidentDetection.popupTitle%"),
				content: localize("%shell.incidentDetection.content%"),
				primaryBtnText: localize("%shell.label.ok%"),
				primaryBtnCallBack: null,
				primaryBtnDisabled: false,
				secondaryBtnText: localize("%shell.label.cancel%"),
				secondaryBtnCallBack: null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}
			var saveChangesSuccessPopup = new Popup(saveChangesSuccessPopup_Options);


		// ///////////////////////////////////////////////////////////////////////////////
		inputsValidations = {
			_emailValid: false,
			get emailValid() {
				return this._emailValid;
			},
			set emailValid(value) {
				var el = updateMailPopup.el.querySelector("#newEmailValid");
				if (value) {
					el.style.display = "none";
				} else {
					el.style.display = "block";
				}
				this._emailValid = value;
			},
			_mobileNumberValid: false,
			get mobileNumberValid() {
				return this._mobileNumberValid;
			},
			set mobileNumberValid(value) {
				var el = updatePhonePopup.el.querySelector("#newPhoneValid");
				if (value) {
					el.style.display = "none";
				} else {
					el.style.display = "block";
				}
				this._mobileNumberValid = value;
			}
		}
		var updatePhonePopup_Options = {
			popupId: "updatePhonePopup",
			title: localize("%shell.updatePhonePopup.title%"),
			content: localize("%shell.updatePhonePopup.content%"),
			primaryBtnText: localize("%shell.label.save%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: true,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var updatePhonePopup = new Popup(updatePhonePopup_Options);
		updatePhonePopup.onHide = function() {
			setTimeout(function() {
				inputsValidations.mobileNumberValid = false;
				updatePhonePopup.options.primaryBtnDisabled = true;
				updatePhonePopup.options.content = localize("%shell.updatePhonePopup.content%");
				updatePhonePopup.el.querySelector("#phoneNumber").oninput = validatePhone;
				updatePhonePopup.el.querySelector("#phoneNumber").onblur = function(e) {
					if (e.currentTarget != undefined) {
						validatePhone();
					}
				}
			});
		}

		function validatePhone() {
			var el = updatePhonePopup.el.querySelector("#phoneNumber");
			if (el.value == "") {
				updatePhonePopup.el.querySelector("#newPhoneValid").innerText = localize("%shell.registeration.validation.mobile.required2%");
				el.style.borderColor = "crimson"
				inputsValidations.mobileNumberValid = false;
				updatePhonePopup.options.primaryBtnDisabled = true;
			} else {
				el.value = el.value.substring(0, 7);
				var regex = /^.{7,7}$/;
				if (!regex.test(el.value)) {
					updatePhonePopup.el.querySelector("#newPhoneValid").innerText = localize("%shell.registeration.validation.mobile.required3%");
					el.style.borderColor = "crimson"
					inputsValidations.mobileNumberValid = false;
					updatePhonePopup.options.primaryBtnDisabled = true;
				} else {
					el.style.borderColor = "#ccc"
					inputsValidations.mobileNumberValid = true;
					updatePhonePopup.options.primaryBtnDisabled = false;
				}
			}
		}
		updatePhonePopup.el.querySelector("#phoneNumber").oninput = validatePhone;
		updatePhonePopup.el.querySelector("#phoneNumber").onblur = function(e) {
			if (e.currentTarget != undefined) {
				validatePhone();
			}
		}
		var updateMailPopup_Options = {
			popupId: "updateMailPopup",
			title: localize("%shell.updateMailPopup.title%"),
			content: localize("%shell.updateMailPopup.content%"),
			primaryBtnText: localize("%shell.label.save%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: true,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var updateMailPopup = new Popup(updateMailPopup_Options);
		updateMailPopup.onHide = function() {
			setTimeout(function() {
				inputsValidations.emailValid = false;
				updateMailPopup.options.primaryBtnDisabled = true;
				updateMailPopup.options.content = localize("%shell.updateMailPopup.content%");
				updateMailPopup.el.querySelector("#emailAddress").oninput = validateEmail;
				updateMailPopup.el.querySelector("#emailAddress").onblur = function(e) {
					if (e.currentTarget != undefined) {
						validateEmail();
					}
				}
			});
		}

		function validateEmail() {
			var el = updateMailPopup.el.querySelector("#emailAddress");
			if (el.value == "") {
				updateMailPopup.el.querySelector("#newEmailValid").innerText = localize("%shell.registeration.validation.mail.required2%");;
				el.style.borderColor = "crimson"
				inputsValidations.emailValid = false;
				updateMailPopup.options.primaryBtnDisabled = true;
			} else {
				var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!regex.test(el.value)) {
					updateMailPopup.el.querySelector("#newEmailValid").innerText = localize("%shell.registeration.validation.mail.required3%");
					el.style.borderColor = "crimson"
					inputsValidations.emailValid = false;
					updateMailPopup.options.primaryBtnDisabled = true;
				} else {
					el.style.borderColor = "#ccc"
					inputsValidations.emailValid = true;
					updateMailPopup.options.primaryBtnDisabled = false;
				}
			}
		}
		updateMailPopup.el.querySelector("#emailAddress").oninput = validateEmail;
		updateMailPopup.el.querySelector("#emailAddress").onblur = function(e) {
			if (e.currentTarget != undefined) {
				validateEmail();
			}
		}
		// ////////////////////////////////////////////////////////////////////////////////
		var forgotPasswordSuccessPopup_Options = {
			popupId: "forgotPasswordSuccessPopup",
			title: localize("%shell.popup.success.title%"),
			content: localize("%shell.error.password.changed%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: function() {
				history.back();
			},
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.label.cancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: false,
			onAroundClick: null
		}
		var forgotPasswordSuccessPopup = new Popup(forgotPasswordSuccessPopup_Options);
		// ///////////////////////////////////////////////////////////////////////////////
		var generalErrorPopup_Options = {
			popupId: "generalErrorPopup",
			title: localize("%shell.popup.error.title%"),
			content: localize("%shell.popup.error.default.applicationError%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var generalErrorPopup = new Popup(generalErrorPopup_Options);
		// ///////////////////////////////////////////////////////////////////////////////
		var loginRegisterPopup_Options = {
			popupId: "loginRegisterPopup",
			title: localize("%shell.sidepanel.loginOrRegisterTitle%"),
			content: localize("%shell.sidepanel.loginOrRegisterMsg%"),
			primaryBtnText: localize("%shell.login.loginAccount%"),
			primaryBtnCallBack: function() {
				window.LoginViewControl.show();
			},
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.registeration.title%"),
			secondaryBtnCallBack: function() {
				mobile.changePage("shell/register.html");
			},
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var loginRegisterPopup = new Popup(loginRegisterPopup_Options);
		/////////////////////////////////////////////////////////////////////////////
		var logoutPopup_Options = {
			popupId: "logoutPopup",
			title: localize("%shell.logout.link%"),
			content: localize("%shell.sidepanel.logoutMsg%"),
			primaryBtnText: localize("%shell.sidepanel.logoutConfirm%"),
			primaryBtnCallBack: function() {
				var AuthenticationModel = require("com/models/shell/AuthenticationModel");
				AuthenticationModel.logout();
			},
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.sidepanel.logoutCancel%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var logoutPopup = new Popup(logoutPopup_Options);
		///////////////////////////////////////////////////////////////////////////////
		var customErrorPopup_Options = {
			popupId: "customErrorPopup",
			title: localize("%shell.popup.error.title%"),
			content: localize("%shell.popup.error.default.applicationError%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var customErrorPopup = new Popup(customErrorPopup_Options);
		///////////////////////////////////////////////////////////////////////////////
		var DVCustomErrorPopup_Options = {
			popupId: "DVCustomErrorPopup",
			title: localize("%shell.popup.error.title%"),
			content: localize("%shell.popup.error.default.applicationError%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var DVCustomErrorPopup = new Popup(DVCustomErrorPopup_Options);
		///////////////////////////////////////////////////////////////////////
		var commingSoonPopup_Options = {
			popupId: "commingSoonPopup",
			title: localize("%shell.popup.soon.title%"),
			content: localize("%shell.popup.soon.message%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.sms.label%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var commingSoonPopup = new Popup(commingSoonPopup_Options);
		///////////////////////////////////////////////////////////////////////
		var registerStepsPopup_Options = {
			popupId: "registerStepsPopup",
			title: localize("%shell.popup.registerSteps.title%"),
			content: localize("%shell.popup.registerSteps.content%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: "",
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var registerStepsPopup = new Popup(registerStepsPopup_Options);
		///////////////////////////////////////////////////////////////////////
		var customHomeErrorPopup_Options = {
			popupId: "customHomeErrorPopup",
			title: localize("%shell.popup.error.title%"),
			content: localize("%shell.popup.error.default.applicationError%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: function() {
				mobile.changePage("shell/home.html");
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
				mobile.changePage("shell/home.html");
			}
		}
		var customHomeErrorPopup = new Popup(customHomeErrorPopup_Options);
		//////////////////////////////////////////////////////////////////////////////
		var internetErrorPopup_Options = {
			popupId: "internetErrorPopup",
			title: localize("%shell.popup.internetIssuestitle%"),
			content: localize("%shell.popup.internetIssues%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var internetErrorPopup = new Popup(internetErrorPopup_Options);
		//////////////////////////////////////////////////////////////////////////////
		var locationErrorPopup_Options = {
			popupId: "locationErrorPopup",
			title: localize("%shell.popup.noLocationConnectivityTitle%"),
			content: localize("%shell.popup.noLocationConnectivityBody%"),
			primaryBtnText: localize("%shell.dialog.button.ok%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: null,
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var locationErrorPopup = new Popup(locationErrorPopup_Options);
		//////////////////////////////////////////////////////////////////////////////
		var selectPhotoPopup_Options = {
			popupId: "selectPhotoPopup",
			title: localize("%shell.profile.editprofilepicture%"),
			content: '',
			primaryBtnText: localize("%shell.profile.takephoto%"),
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: localize("%shell.profile.opengallery%"),
			secondaryBtnCallBack: null,
			secondaryBtnVisible: true,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var selectPhotoPopup = new Popup(selectPhotoPopup_Options);
		//////////////////////////////////////////////////////////////////////////////
		var noVirtualMolikyiaPopup_Options = {
				popupId: "noVirtualMolikyiaPopup",
				title: localize("%shell.popup.error.title%"),
				content: localize("%shell.popup.error.VirtualMolikyiaBody%"),
				primaryBtnText: localize("%shell.dialog.button.ok%"),
				primaryBtnCallBack: null,
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack: null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}
			var noVirtualMolikyiaPopup = new Popup(noVirtualMolikyiaPopup_Options);
		/////////////////////////////////////////////////////////////
		var loyaltyPopup_Options = {
				popupId: "loyaltyPopup",
				title: localize("%shell.dashboard.visitNolPlusTitle%"),
				content:'<span class="nolPlusContent">' + localize("%shell.dashboard.visitNolPlusBody%")+ '</span>',
				primaryBtnText: localize("%shell.dashboard.letsGo%"),
				primaryBtnCallBack: function() {
					window.open('https://www.nolplus.ae', '_system')
				},
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack:null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}
			var loyaltyPopup= new Popup(loyaltyPopup_Options);
		// for testing only
		//setTimeout(function() {
			//loyaltyPopup.show();

		//})
		/////////////////////////////////////////////////////////////////////////////
		var loyaltyEnrolPopup_Options = {
				popupId: "loyaltyEnrolPopup",
				title: localize("%shell.dashboard.NolPlusTitle%"),
				content:'<span class="nolPlusEnrolContent">' + localize("%shell.dashboard.enrollPopupBody%")+ '</span>',
				primaryBtnText: localize("%shell.dashboard.letsGo%"),
				primaryBtnCallBack: function() {
					window.open('https://www.nolplus.ae', '_system')
				},
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack:null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}
			var loyaltyEnrolPopup= new Popup(loyaltyEnrolPopup_Options);
		//setTimeout(function() {
			//loyaltyEnrolPopup.show();

		//})
		//////////////////////////////////////////////////////////////////////////////
		var loyaltyNotAvailablePopup_Options = {
				popupId: "loyaltyNotAvailablePopup",
				title: localize("%shell.dashboard.loyaltySorrytitle%"),
				content: '<span class="retrieveNol">'+localize("%shell.dashboard.loyaltyNotRetrieve%") + '</span>' +'<span class="tryRefresh">'+ localize("%shell.dashboard.loyaltyTryRefresh%")+ '</span>',
				primaryBtnText: localize("%shell.dialog.button.ok%"),
				primaryBtnCallBack: null,
				primaryBtnDisabled: false,
				secondaryBtnText: null,
				secondaryBtnCallBack:null,
				secondaryBtnVisible: false,
				secondaryBtnDisabled: false,
				hideOnPrimaryClick: true,
				hideOnSecondaryClick: true,
				aroundClickable: true,
				onAroundClick: null
			}
			var loyaltyNotAvailablePopup= new Popup(loyaltyNotAvailablePopup_Options);
		// for testing only
		//setTimeout(function() {
			//loyaltyNotAvailablePopup.show();

		//})
		//////////////////////////////////////////////////////////////////////////////
		var nationalitySelectorPopup_Options = {
			popupId: "nationalitySelectorPopup",
			title: localize("%shell.popup.error.title%"),
			content: localize("%shell.nationalityPopup.content%"),
			primaryBtnText: "",
			primaryBtnCallBack: null,
			primaryBtnDisabled: false,
			secondaryBtnText: "",
			secondaryBtnCallBack: null,
			secondaryBtnVisible: false,
			secondaryBtnDisabled: false,
			hideOnPrimaryClick: true,
			hideOnSecondaryClick: true,
			aroundClickable: true,
			onAroundClick: null
		}
		var nationalitySelectorPopup = new Popup(nationalitySelectorPopup_Options);
		$.getJSON(window.mobile.baseUrl + "/common/data/nationalities.json", function(countries) {
			var nationalitySelectorPopup = new Popup("nationalitySelectorPopup");
			if (getApplicationLanguage() == "en") {
				countries = countries.sort(function(a, b) {
					if (a.DISPLAYNAME < b.DISPLAYNAME) return -1;
					if (a.DISPLAYNAME > b.DISPLAYNAME) return 1;
					return 0;
				});
			} else {
				countries = countries.sort(function(a, b) {
					if (a.DISPLAYNAMEAR < b.DISPLAYNAMEAR) return -1;
					if (a.DISPLAYNAMEAR > b.DISPLAYNAMEAR) return 1;
					return 0;
				});
			}
			nationalitySelectorPopup.countries = countries;
			var html = "";
			for (var i = 0; i < countries.length; i++) {
				if (getApplicationLanguage() == 'ar') {
					html += "<div id='nationality_" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAMEAR + "</div>";
				} else {
					html += "<div id='nationality_" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAME + "</div>";
				}
				nationalitySelectorPopup.countries[i].index = i;
			}
			setTimeout(function() {
				nationalitySelectorPopup.el.querySelector(".nationalityScroll").innerHTML += html;
				var items = nationalitySelectorPopup.el.querySelector(".nationalityScroll").getElementsByTagName('div');
				for (var i = 0; i < items.length; i++) {
					items[i].onclick = function(e) {
						var id = this.id.replace('nationality_', "");
						nationalitySelectorPopup.hide(function() {
							if (nationalitySelectorPopup.onItemClick) {
								nationalitySelectorPopup.onItemClick(id);
							}
						})
					}
				}
			}, 500);
		});

		function searchNationality(array, text, index) {
			if (text == "") {
				return [];
			}
			var searchResult = [];
			if (getApplicationLanguage() == 'ar') {
				for (var i = 0; i < array.length; i++) {
					if (array[i].DISPLAYNAMEAR.toLowerCase()[index] == text.toLowerCase()[index]) {
						searchResult.push(array[i]);
					}
				}
			} else {
				for (var i = 0; i < array.length; i++) {
					if (array[i].DISPLAYNAME.length > index && text.length > index) {
						if (array[i].DISPLAYNAME.toLowerCase()[index] == text.toLowerCase()[index]) {
							searchResult.push(array[i]);
						}
					}
				}
			}
			if (text.length - 1 > index) {
				if (searchResult.length > 0) {
					index++;
					return searchNationality(searchResult, text, index);
				} else {
					return searchResult;
				}
			} else {
				return searchResult;
			}
		}
		nationalitySelectorPopup.el.querySelector("input").oninput = function(e) {
			var searchText = nationalitySelectorPopup.el.querySelector("input").value;
			var items = nationalitySelectorPopup.el.querySelector(".nationalityScroll").getElementsByTagName('div');
			var countries = nationalitySelectorPopup.countries;
			var searchResult = searchNationality(countries, searchText, 0);
			if (searchText.length > 0) {
				for (var k = 0; k < items.length; k++) {
					items[k].style.display = "none";
				}
				for (var i = 0; i < searchResult.length; i++) {
					for (var k = 0; k < items.length; k++) {
						if (searchResult[i].index == k) {
							items[k].style.display = "block";
						}
					}
				}
			} else {
				for (var k = 0; k < items.length; k++) {
					items[k].style.display = "block";
				}
			}
		}
		nationalitySelectorPopup.onHide = function() {
			nationalitySelectorPopup.el.querySelector("input").value = "";
			var items = nationalitySelectorPopup.el.querySelector(".nationalityScroll").getElementsByTagName('div');
			for (var k = 0; k < items.length; k++) {
				items[k].style.display = "block";
			}
		}
		nationalitySelectorPopup.onShow = function() {
			//			nationalitySelectorPopup.el.querySelector("input").focus();
		}
	}
})();


/* JavaScript content from js/com/views/shell/RegisterPageView.js in folder common */

/* JavaScript content from js/com/views/shell/RegisterPageView.js in folder common */

/* JavaScript content from js/com/views/shell/RegisterPageView.js in folder common */
define(["backbone", "com/views/PageView", "com/views/Header", "com/models/Constants", "com/models/shell/AuthenticationModel", "com/utils/DataUtils", "com/utils/Utils", "com/models/shell/PasswordModel", "com/models/shell/OTPModel", "com/models/shell/CaptchaModel"], function(Backbone, PageView, Header, Constants, AuthenticationModel, DataUtils, Utils, PasswordModel, OTPModel, CaptchaModel) {
	// Extends PageView class
	var RegisterPageView = PageView.extend({
		events: {
			pageshow: "onPageShow",
			pagebeforeshow: "onPageBeforeShow"
		},
		initialize: function(options) {
			var self = this;
			registerationPageViewInstance = this;
			if (!options) {
				options = {};
			}
			registerationPageViewInstance.options = options;
			options.hideHeader = false;
			options.hideFooter = true;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.registeration.title%");
			PageView.prototype.initialize.call(this, options);
		},
		onPageBeforeShow: function() {
			$.getJSON(window.mobile.baseUrl +"/common/data/nationalities.json", function(countries) {
				if (getApplicationLanguage() == "en") {
					registerationPageViewInstance.countries = countries.sort(function(a, b) {
						if (a.DISPLAYNAME < b.DISPLAYNAME) return -1;
						if (a.DISPLAYNAME > b.DISPLAYNAME) return 1;
						return 0;
					});
				} else {
					registerationPageViewInstance.countries = countries.sort(function(a, b) {
						if (a.DISPLAYNAMEAR < b.DISPLAYNAMEAR) return -1;
						if (a.DISPLAYNAMEAR > b.DISPLAYNAMEAR) return 1;
						return 0;
					});
				}
				var html = "";
				for (var i = 0; i < countries.length; i++) {
					if (getApplicationLanguage() == "ar") {
						html += "<option value='" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAMEAR + "</option>";
					} else {
						html += "<option value='" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAME + "</option>";
					}
				}
				registerationPageViewInstance.el.querySelector("#countries").innerHTML += html;
				if(registerationPageViewInstance.populattedNationalId)
					document.getElementById("countries").value=registerationPageViewInstance.populattedNationalId
			});
		},
		populateData:function(data){
			if(data)
			{
				var populatedProfile= data;
				document.getElementById("email").value=populatedProfile.mail?populatedProfile.mail:"";
				if(populatedProfile.mobile){
					var mobile=populatedProfile.mobile;
					var prefix=mobile.substring(3,5);
					var suifix=mobile.substring(5);
					document.getElementById("mbileEditInput").value=suifix;
					registerationPageViewInstance.setDDLByText("editMobilePrefix",prefix);
				}


				if(populatedProfile.userName){
					document.getElementById("userNameInput").value=populatedProfile.userName;
				}

				if(populatedProfile.password){
					document.getElementById("newPasswordInput").value=populatedProfile.password;
				}
				if(populatedProfile.rePassword){
					document.getElementById("rePassword").value=populatedProfile.rePassword;
				}
				// it come from uae pass
				if(populatedProfile.first_name_en){
					var fullName=populatedProfile.first_name_en.split('+');
					if(fullName&&fullName.length>0){
						document.getElementById("firstName").value=fullName[0]?fullName[0]:"";

						document.getElementById("lastName").value=fullName[1]?fullName[1]:"";
					}
				}

				if(populatedProfile.firstName){
					document.getElementById("firstName").value=populatedProfile.firstName;
				}

				if(populatedProfile.lastName){
					document.getElementById("lastName").value=populatedProfile.lastName;
				}

				if(populatedProfile.gender=="M"){
					document.getElementById("title").value="1";
				}
				else
				{
					document.getElementById("title").value="2";
				}

				if(populatedProfile.nationality){
					document.getElementById("countries").value=Number(populatedProfile.nationality);
					registerationPageViewInstance.populattedNationalId=Number(populatedProfile.nationality);
				}

				if(populatedProfile.preferredLanguage){
					if( populatedProfile.preferredLanguage == "Arabic"){
						document.getElementById("radio2").checked = true;
					}
					else{
						document.getElementById("radio1").checked = true;
					}

				}
				//set focus in first element
				registerationPageViewInstance.emailValidator.validate(true);
				registerationPageViewInstance.userNameValidator.validate(true);
				registerationPageViewInstance.fNameValidator.validate(true);
				registerationPageViewInstance.lNameValidator.validate(true);
				registerationPageViewInstance.phoneValidator.validate(true);
				registerationPageViewInstance.passwordValidator.validate(true);
				registerationPageViewInstance.rePasswordValidator.validate(true);
               registerationPageViewInstance.updateRegisterBtn();
               registerationPageViewInstance.updateContinueBtn();
               registerationPageViewInstance.stepper.activateStep(1);


			}
		},
		onPageShow: function(event) {
			try{

				event.preventDefault();
				var options = {
						direction: getApplicationLanguage() == "en" ? "ltr" : "rtl",
								element: document.getElementById("formStepper"),
								enablePages: true
				};
				registerationPageViewInstance.stepper = new Stepper(options);
				registerationPageViewInstance.passHintPopup = new Popup("passwordHint");
				registerationPageViewInstance.otpPopup = new Popup("OTP");
				registerationPageViewInstance.otpPopup.options.secondaryBtnCallBack = function() {
					registerationPageViewInstance.otpPopup.options.primaryBtnDisabled = true;
					document.getElementById("email").value = "";
					registerationPageViewInstance.emailValidator.validate(true);
					registerationPageViewInstance.stepper.activateStep(0);
				};
				registerationPageViewInstance.otpPopup.options.primaryBtnCallBack = function() {
					var userId = document.getElementById("userNameInput").value;
					var email = document.getElementById("email").value;
					var OTP = registerationPageViewInstance.otpPopup.pinInput.value;
					OTPModel.verifyOTP(OTP, email, function(res) {
						if (res.isVerified == "true" || res.isVerified == true) {
							registerationPageViewInstance.otpPopup.hide(function() {
								registerationPageViewInstance.registerUser();
							});
						} else {
							/////////show OTP invalid
							registerationPageViewInstance.otpPopup.options.primaryBtnDisabled = true;
							registerationPageViewInstance.otpPopup.pinInput.clear();
							registerationPageViewInstance.otpPopup.el.querySelector(".otpInvalid").style.opacity = 1;
							if (res.errorCode == "ERR-VO-B-14") {
								clearInterval(registerationPageViewInstance.otpPopup.timerInterval);
								registerationPageViewInstance.otpPopup.stopTimer();
								registerationPageViewInstance.otpPopup.hide(function() {
									var OTPVerificationLimitPopup = new Popup("OTPVerificationLimitPopup");
									OTPVerificationLimitPopup.show();
								});
							}
						}
					});
				};
				//
				registerationPageViewInstance.otpPopup.el.querySelector(".resend").onclick = function() {
					var email = document.getElementById("email").value;
					OTPModel.sendOTP(email, "createUser", null, email, function(res) {
						registerationPageViewInstance.otpPopup.stopTimer();
						registerationPageViewInstance.otpPopup.pinInput.clear();
						registerationPageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						registerationPageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						registerationPageViewInstance.otpPopup.options.primaryBtnDisabled = true;
						setTimeout(function() {
							registerationPageViewInstance.otpPopup.startTimer();
						}, 150);
					});
				};
				registerationPageViewInstance.verificationLimitPopup = new Popup("OTPVerificationLimitPopup");
				registerationPageViewInstance.verificationLimitPopup.options.secondaryBtnText = localize("%shell.label.cancel%");
				registerationPageViewInstance.verificationLimitPopup.options.secondaryBtnCallBack = null;
				registerationPageViewInstance.verificationLimitPopup.options.primaryBtnCallBack = function() {
					var email = document.getElementById("email").value;
					OTPModel.sendOTP(email, "createUser", null, email, function(res) {
						if (getApplicationLanguage() == "en") {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " to your Email <span>" + email + "</span>";
						} else {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " الى بريدك الإلكتروني <span>" + email + "</span>";
						}
						registerationPageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						registerationPageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						registerationPageViewInstance.otpPopup.show();
					});
				};
				registerationPageViewInstance.timeoutPop = new Popup("OTPTimeoutPopup");
				//
				registerationPageViewInstance.timeoutPop.options.secondaryBtnText = localize("%shell.label.cancel%");
				registerationPageViewInstance.timeoutPop.options.secondaryBtnCallBack = null;
				registerationPageViewInstance.timeoutPop.options.primaryBtnCallBack = function() {
					var email = document.getElementById("email").value;
					OTPModel.sendOTP(email, "createUser", null, email, function(res) {
						if (getApplicationLanguage() == "en") {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " to your Email <span>" + email + "</span>";
						} else {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " الى بريدك الإلكتروني <span>" + email + "</span>";
						}
						registerationPageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						registerationPageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						registerationPageViewInstance.otpPopup.show();
					});
				};
				var lang = getApplicationLanguage();
				if (lang == "en") {
					document.getElementById("radio1").checked = true;
				} else {
					document.getElementById("radio2").checked = true;
				}
				//            registerationPageViewInstance.emiratesID = "";
				/*document.getElementById("passwordHintBtn").onclick = function () {
			        registerationPageViewInstance.passHintPopup.show()
			    }*/
				//
				document.getElementById("continueBtn").onclick = function() {
					registerationPageViewInstance.stepper.activateStep(1);
				};
				//
				document.getElementById("registerContBtn").onclick = function() {
					// Start Point for registeration
					var email = document.getElementById("email").value;
					OTPModel.sendOTP(email, "createUser", null, email, function(res) {
						if (getApplicationLanguage() == "en") {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " to your Email <span>" + email + "</span>";
						} else {
							registerationPageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = " الى بريدك الإلكتروني <span>" + email + "</span>";
						}
						registerationPageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						registerationPageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						registerationPageViewInstance.otpPopup.show();
					});
				};
				//            document.getElementById("termsRow").onclick = function(){
				//            	document.getElementById("privacyAgree").checked =
				//            		!document.getElementById("privacyAgree").checked;
				//            	registerationPageViewInstance.updateRegisterBtn();
				//            }
				registerationPageViewInstance.userIdValidated = false;
				document.getElementById("userNameInput").onfocus = function() {
					registerationPageViewInstance.userIdValidated = false;
					document.getElementById("userIdLoader").style.display = "none";
					document.getElementById("userIdValid").style.display = "none";
					document.getElementById("userIdInvalid").style.display = "none";
					registerationPageViewInstance.userIdActive = true;
				};
				document.getElementById("userNameInput").addEventListener("blur", function() {
					registerationPageViewInstance.userIdValidated = false;
					registerationPageViewInstance.userIdActive = false;
				});
				registerationPageViewInstance.userNameValidator = new Validator(document.querySelector("#userNameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.username.required2%"),
						order: 0
					}, {
						regEx: function(val, el) {
							if (val.length < 6) {
								return false;
							} else {
								return true;
							}
						},
						errorMessage: localize("%shell.mpay.validation.username.notcorect%"),
						order: 2
					}, {
						regEx: "userName",
						errorMessage: localize("%shell.mpay.validation.username.notcorect%"),
						order: 1
					}, {
						regEx: function(val, el) {
							if (val.indexOf(" ") != -1) {
								return false;
							} else {
								return true;
							}
						},
						errorMessage: localize("%shell.mpay.validation.username.notcorect%"),
						order: 3
					}],
					onValidate: function(valid, el) {
						el.value = el.value.toLowerCase();
						registerationPageViewInstance.updateContinueBtn();
						registerationPageViewInstance.userIdValidated = false;
						if (valid) {
							registerationPageViewInstance.verifyUserId(el.value);
						}
					}
				});
				registerationPageViewInstance.emailValidator = new Validator(document.querySelector("#emailField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.mail.required2%"),
						order: 0
					}, {
						regEx: "email",
						errorMessage: localize("%shell.registeration.validation.mail.required3%"),
						order: 1
					}],
					onValidate: registerationPageViewInstance.updateContinueBtn
				});
				registerationPageViewInstance.phoneValidator = new Validator(document.querySelector("#mbileEditField"), {
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
					onValidate: registerationPageViewInstance.updateContinueBtn
				});
				registerationPageViewInstance.passwordValidator = new Validator(document.querySelector("#newPasswordField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.password.required2%"),
						order: 0
					}, {
						regEx: "password",
						errorMessage: localize("%shell.registeration.validation.password.required3%"),
						order: 1
					}, {
						regEx: function(val, el) {
							if (val == document.getElementById("userNameInput").value) {
								return false;
							} else {
								return true;
							}
						},
						errorMessage: localize("%shell.registeration.validation.password.required3%"),
						order: 1
					}],
					onValidate: registerationPageViewInstance.updateContinueBtn
				});
				registerationPageViewInstance.rePasswordValidator = new Validator(document.querySelector("#rePasswordField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.confirmpassword.required%"),
						order: 0
					}, {
						regEx: function(val) {
							if (val == document.querySelector("#newPasswordInput").value) {
								return true;
							} else {
								return false;
							}
						},
						errorMessage: localize("%shell.registeration.validation.confirmpassword.required3%"),
						order: 1
					}],
					onValidate: registerationPageViewInstance.updateContinueBtn
				});
				registerationPageViewInstance.fNameValidator = new Validator(document.querySelector("#fnameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.firstname.required2%"),
						order: 0
					}, {
						regEx: "name",
						errorMessage: localize("%shell.registeration.validation.firstname.required2%"),
						order: 1
					}],
					onValidate: registerationPageViewInstance.updateRegisterBtn
				});
				registerationPageViewInstance.lNameValidator = new Validator(document.querySelector("#lnameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.lastname.required2%"),
						order: 0
					}, {
						regEx: "name",
						errorMessage: localize("%shell.registeration.validation.lastname.required3%"),
						order: 1
					}],
					onValidate: registerationPageViewInstance.updateRegisterBtn
				});
				// Start Call Strength password component
				var newValidatorOptions = {
						passwordElement: document.getElementById("newPasswordInput"),
						confirmPasswordElement: document.getElementById("rePassword"),
						infoElement: document.getElementById("passInfo"),
						passwordValidator: registerationPageViewInstance.passwordValidator,
						rePasswordValidator: registerationPageViewInstance.rePasswordValidator,
						lang: getApplicationLanguage()
				};
				window.newValidator = new PasswordStrength(newValidatorOptions);
				// End Call Strength password component
				// start call captcha
				var captchaOptions = {
						lang: getApplicationLanguage(),
						captchaModel: CaptchaModel,
						serviceName: "Register",
						onChange: function() {
							registerationPageViewInstance.updateRegisterBtn();
						}
				};
				registerationPageViewInstance.newCaptch = new captcha(captchaOptions);
				//End call captcha
				document.getElementById("countries").onchange = registerationPageViewInstance.updateRegisterBtn;
				document.getElementById("title").onchange = registerationPageViewInstance.updateRegisterBtn;
				document.getElementById("privacyAgree").onclick = registerationPageViewInstance.updateRegisterBtn;
				// populate Data for UAE PAss
				var options =registerationPageViewInstance.options;
				if(options&&options.data){
					registerationPageViewInstance.populateData(options.data);
				}



				// add event for privacy policy link
				document.querySelector("#privacy-policy-link").addEventListener("click",function(){
					//get data from register page
					var preferedLang = "";
					if (document.getElementById("radio1").checked) preferedLang = "English";
					if (document.getElementById("radio2").checked) preferedLang = "Arabic";
					var inputs = {
							userName: document.getElementById("userNameInput").value,
							mail: document.getElementById("email").value,
							mobile: "971" + document.getElementById("editMobilePrefix").options[document.getElementById("editMobilePrefix").selectedIndex].value + document.getElementById("mbileEditInput").value,
							password:  document.getElementById("newPasswordInput").value,
							rePassword:  document.getElementById("rePassword").value,
							title: document.getElementById("title").options[document.getElementById("title").selectedIndex].value,
							firstName: document.getElementById("firstName").value,
							lastName: document.getElementById("lastName").value,
							nationality: document.getElementById("countries").options[document.getElementById("countries").selectedIndex].value,
							preferredLanguage: preferedLang,
					};
					var stringifyData=JSON.stringify(inputs);
					DataUtils.setLocalStorageData('CurrentRegisterUser', stringifyData, false, 'shell');
					mobile.changePage("shell/TermsAndPolicies.html", {data:{isOpenedFromSplash:true}});

				});

				// populate data after seeing policies

				var currentRegisterUser = DataUtils.getLocalStorageData('CurrentRegisterUser', 'shell');
				if(currentRegisterUser)
				{
					var parseData=JSON.parse(currentRegisterUser);
                   registerationPageViewInstance.populateData(parseData) ;
                   DataUtils.removeFromLocalStorage("CurrentRegisterUser", "shell");
				}

			}
			catch(e){

			}
		},
		setDDLByText:function(ddlID,text){
			if(ddlID&&text){
				setTimeout(function() {
					var dd = document.getElementById(ddlID);
					for (var i = 0; i < dd.options.length; i++) {
						if (dd.options[i].text.toUpperCase() === text.toUpperCase()) {
							dd.selectedIndex = i;
							break;
						}
					}
				},200)
			}
		},
		updateRegisterBtn: function() {
			if (registerationPageViewInstance.fNameValidator.isValid && registerationPageViewInstance.lNameValidator.isValid && document.getElementById("title").selectedIndex != 0 && document.getElementById("countries").selectedIndex != 0 && document.getElementById("privacyAgree").checked && registerationPageViewInstance.newCaptch.isValid) {
				document.getElementById("registerContBtn").className = "continueBtn waves-effect";
			} else {
				document.getElementById("registerContBtn").className = "continueBtn waves-effect disabled";
			}
		},
		updateContinueBtn: function() {
			if (registerationPageViewInstance.userIdValidated && registerationPageViewInstance.userNameValidator.isValid && registerationPageViewInstance.emailValidator.isValid && registerationPageViewInstance.phoneValidator.isValid && registerationPageViewInstance.passwordValidator.isValid && registerationPageViewInstance.rePasswordValidator.isValid) {
				document.getElementById("continueBtn").className = "continueBtn waves-effect";
			} else {
				document.getElementById("continueBtn").className = "continueBtn waves-effect disabled";
			}
		},
		verifyUserId: function(userId) {
//			if (registerationPageViewInstance.userIdActive) return;
			document.getElementById("userIdLoader").style.display = "block";
			registerationPageViewInstance.userIdValidated = false;
			document.getElementById("userIdValid").style.display = "none";
			document.getElementById("userIdInvalid").style.display = "none";
			AuthenticationModel.checkUserIdAvailability(userId, function(status, res) {
				if (registerationPageViewInstance.userNameValidator.isValid) {
					document.getElementById("userIdLoader").style.display = "none";
					if (status == "SUCCESS") {
						if (res.userIdAvailable == "false") {
							registerationPageViewInstance.userIdValidated = true;
							document.getElementById("userIdValid").style.display = "block";
							document.getElementById("userIdInvalid").style.display = "none";
						} else {
							registerationPageViewInstance.userIdValidated = false;
							document.getElementById("userIdValid").style.display = "none";
							document.getElementById("userIdInvalid").style.display = "block";
						}
					} else {
						registerationPageViewInstance.userIdValidated = false;
						document.getElementById("userIdValid").style.display = "none";
						document.getElementById("userIdInvalid").style.display = "block";
					}
				}
				registerationPageViewInstance.updateContinueBtn();
			});
		},
		registerUser: function() {
			$(".ui-loader").show();
			var preferedLang = "";
			if (document.getElementById("radio1").checked) preferedLang = "English";
			if (document.getElementById("radio2").checked) preferedLang = "Arabic";
			var inputs = {
					userName: document.getElementById("userNameInput").value,
					email: document.getElementById("email").value,
					mobileNo: "971" + document.getElementById("editMobilePrefix").options[document.getElementById("editMobilePrefix").selectedIndex].value + document.getElementById("mbileEditInput").value,
					password: PasswordModel.encPassword(document.getElementById("userNameInput").value, document.getElementById("newPasswordInput").value),
					title: document.getElementById("title").options[document.getElementById("title").selectedIndex].value,
					firstName: document.getElementById("firstName").value,
					lastName: document.getElementById("lastName").value,
					nationality: document.getElementById("countries").options[document.getElementById("countries").selectedIndex].value,
					//            		emiratesId:document.getElementById("emiratesId").value.replace(/-/g, ''),
					prefLanguage: preferedLang,
					isEmailVerified: true,
					isMobileVerified: false
					//            		isEmiratesIdVerified:false
			};
			// on change captcha get captcha
			var captcha = {
					"key": registerationPageViewInstance.newCaptch.captchaKey,
					"userAnswerId": registerationPageViewInstance.newCaptch.captchaAnswer,
					"type": registerationPageViewInstance.newCaptch.captchaType,
			}
			var captchaObject = JSON.stringify(captcha);
			AuthenticationModel.registerAmUser(inputs, captchaObject, function(status, res) {
				$(".ui-loader").hide();
				if (status == "SUCCESS" && !res.invocationResult.failure) {
					if (res.invocationResult.isSuccessful && res.invocationResult.success) {
						registerationPageViewInstance.stepper.activateStep(2);
						document.getElementById("registerStep1").style.pointerEvents = "none";
						document.getElementById("registerStep2").style.pointerEvents = "none";
						document.getElementById("usernameSpan").textContent = document.getElementById("userNameInput").value;
						document.getElementById("successLoginBtn").onclick = function() {
							var loginOptions = {
									scenario: "Registration",
									username: document.getElementById("userNameInput").value,
									password: document.getElementById("newPasswordInput").value
							};
							window.LoginViewControl.show(loginOptions);
						};
					} else {
						///display error
						var errorpop = new Popup("generalErrorPopup");
						errorpop.show();
					}
				} else {
					///display error
					var errorpop = new Popup("generalErrorPopup");
					errorpop.show();
				}
			});
		},
		openTerms: function() {
			document.querySelector("#termsPop").style.webkitTransform = "translate3d(0,0,0)";
		},
		closeTerms: function() {
			document.querySelector("#termsPop").style.webkitTransform = "";
		},
		bindData: function(container, data) {
			for (var i = 0; i < data.length; i++) {
				var temp = document.getElementById("itemTemplate").getElementsByClassName("itemCont")[0].cloneNode(true);
				temp.querySelector("input[type=checkbox]").onclick = registerationPageViewInstance.onCollapseItemClick;
				temp.querySelector("input[type=checkbox]").index = i;
				temp.querySelector(".head").textContent = data[i].mainHead;
				temp.querySelector(".content").innerHTML = data[i].mainContent;
				if (data[i].subContent) temp.querySelector(".content").innerHTML += data[i].subContent;
				document.querySelector("#" + container).appendChild(temp);
			}
		},
		onCollapseItemClick: function(e) {
			var currentItem = e.currentTarget.parentElement;
			if (!e.currentTarget.checked) {
				currentItem.className += " active";
			} else {
				currentItem.className = currentItem.className.replace(" active", "");
			}
		},
		onSearch: function(e) {
			var searchText = document.getElementById("searchInput").value;
			var collapseItems = document.getElementById("policies").getElementsByClassName("itemCont");
			var contentToSearch = registerationPageViewInstance.policies;
			var searchResult = [];
			for (var i = 0; i < contentToSearch.length; i++) {
				for (var j in contentToSearch[i]) {
					if (contentToSearch[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
						searchResult.push(i);
						break;
					}
				}
			}
			if (searchResult.length == 0) {
				document.getElementById("policiesTitle").style.display = "none";
			} else {
				document.getElementById("policiesTitle").style.display = "block";
			}
			for (var k = 0; k < collapseItems.length; k++) {
				if (searchResult.indexOf(k) != -1) {
					collapseItems[k].style.display = "block";
				} else {
					collapseItems[k].style.display = "none";
				}
			}
			collapseItems = document.getElementById("terms").getElementsByClassName("itemCont");
			contentToSearch = registerationPageViewInstance.terms;
			searchResult = [];
			for (var i = 0; i < contentToSearch.length; i++) {
				for (var j in contentToSearch[i]) {
					if (contentToSearch[i][j].toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
						searchResult.push(i);
						break;
					}
				}
			}
			if (searchResult.length == 0) {
				document.getElementById("termsTitle").style.display = "none";
			} else {
				document.getElementById("termsTitle").style.display = "block";
			}
			for (var k = 0; k < collapseItems.length; k++) {
				if (searchResult.indexOf(k) != -1) {
					collapseItems[k].style.display = "block";
				} else {
					collapseItems[k].style.display = "none";
				}
			}
		},
		selectItem: function(select, val) {
			$("#" + select).selectmenu();
			var sel = document.getElementById(select);
			var opts = sel.options;
			var selected = false;
			for (var opt, j = 0;
			(opt = opts[j]); j++) {
				if (opt.value == val) {
					sel.selectedIndex = j;
					$("#" + select).selectmenu("refresh");
					selected = true;
					break;
				}
			}
			return selected;
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	// Returns the View class
	return RegisterPageView;
});

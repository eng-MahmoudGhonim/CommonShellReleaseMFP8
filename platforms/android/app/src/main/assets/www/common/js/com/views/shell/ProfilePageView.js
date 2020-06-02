define(["com/views/PageView", "com/utils/DataUtils", "com/utils/Utils", "com/views/Header", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/models/shell/OTPModel", "com/views/shell/AddNewNumberPageView", "com/models/drivers_and_vehicles/DVAccountModel","com/models/Constants"], function(PageView, DataUtils, Utils, Header, UserProfileModel, AuthenticationModel, OTPModel, AddNewNumberPageView, DVAccountModel,Constants) {
	// Extends PagView class
	var ProfilePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'pagebeforeshow': 'onPageBeforeShow',
			'tap #updateBtn': 'saveProfileData',
			'tap #cancelBtn': 'cancelSaveProfileData',
			'tap #userprofilebutton': 'userProfileButtonClick',
			'tap #userprofileImg': 'userProfileButtonClick',
			'tap #dummyprofileImg': 'userProfileButtonClick',
			'tap #AddNewNumberBtn': 'AddNewNumberButtonClick',
			'tap #continueProfilebtn': 'ContinueButtonClick'
		},
		userProfileButtonClick: function(event) {
			event.preventDefault();
			var selectPhotoPopup = new Popup("selectPhotoPopup");
			selectPhotoPopup.options.primaryBtnCallBack = profilePageViewInstance.openCameraForUserProfilePhoto;
			selectPhotoPopup.options.secondaryBtnCallBack = profilePageViewInstance.openAlbumForUserProfilePhoto;
			selectPhotoPopup.show();
		},
		AddNewNumberButtonClick: function(event) {
			event.preventDefault();
			this.addNewNumberPageView.show(null);
		},
		initialize: function(options) {
			profilePageViewInstance = this;
			options.phoneTitle =localize("%shell.profile.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
		onPageBeforeShow: function() {},
		manageTouchId: function(checked) {
			var data = DataUtils.getLocalStorageData("userProfile", "shell");
			if (data) {
				data = JSON.parse(data);
			}
			var username = data && data.Users[0].user_id;
			if (checked == true) {
				var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
				currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
				if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
					currentTouchIdConfig = [];
				}
				for (var i = 0; i < currentTouchIdConfig.length; i++) {
					if (currentTouchIdConfig[i].username == username) {
						currentTouchIdConfig[i].isActivated = true;
					}
				}
				DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
			} else {
				var currentTouchIdConfig = DataUtils.getLocalStorageData('Touchid', 'shell');
				currentTouchIdConfig = JSON.parse(currentTouchIdConfig);
				if (isUndefinedOrNullOrBlank(currentTouchIdConfig)) {
					currentTouchIdConfig = [];
				}
				for (var i = 0; i < currentTouchIdConfig.length; i++) {
					if (currentTouchIdConfig[i].username == username) {
						currentTouchIdConfig[i].isActivated = false;
					}
				}
				DataUtils.setLocalStorageData('Touchid', JSON.stringify(currentTouchIdConfig), false, 'shell');
			}
		},
		getSalikNumbersList:function(){
			DVAccountModel.getSalikNumbers(profilePageViewInstance.bindOtherSalikNumbers);
		},
		bindOtherSalikNumbers: function(salikNumbers) {

			if (salikNumbers&&salikNumbers.length>0) {
				document.querySelector("#MyContactDetails .OtherNumbers").style.display = "block";
				for (var j = 0; j < salikNumbers.length; j++) // Swap array for put default the first one
				{
					if (salikNumbers[j].IsDefault == "true") {
						var defaultNumber = salikNumbers[j];
						salikNumbers[j] = salikNumbers[0];
						salikNumbers[0] = defaultNumber;
						break;
					}
				}
				document.querySelector("#addedNewMobile").innerHTML = "";

				for (var i = 0; i < salikNumbers.length; i++) {
					var current = salikNumbers[i];
					var linkTemplate = document.getElementById("mobileRowTemplate");
					var item = $(linkTemplate).clone()[0];
					profilePageViewInstance.indexNewNumber = i + 1; //set index for Bind array
					item.style.display = "block";
					item.removeAttribute("id");
					item.querySelector(".editSalikNumberBtn").setAttribute("index", i);
					//add id for edit button
					var id = "salikNumber" + profilePageViewInstance.indexNewNumber;
					item.querySelector(".editSalikNumberBtn").setAttribute("id", id);

					item.querySelector(".shell-label").innerHTML =getApplicationLanguage() == 'en'? current.PhoneType:current.PhoneType;
					//	Country Code
					item.querySelector(".countryCodeTemp").options[0].text=current.CountryCode.replace("00","+");

					if (salikNumbers[i].IsDefault=="true") {

						var DefaultOtp=localize("%shell.Profile.DefaultOTPVerified%");
						item.querySelector(".shell-label").innerHTML =( getApplicationLanguage() == 'en'? current.PhoneType:current.PhoneType) +" " +DefaultOtp

						item.querySelector(".deleteSalikNumberBtn").style.display = "none"
							item.querySelector(".mobileRow input").style.width = "calc(77% - 48px)";
						item.className +="defaultSalik";
					}
					item.querySelector(".phoneNumber").value = current.PhoneNumber;
					item.querySelector("#" + id).addEventListener("click", function(event) {
						event.preventDefault();
						var currentNumber = salikNumbers[event.currentTarget.getAttribute("index")];
						profilePageViewInstance.addNewNumberPageView.show(currentNumber);
					});
					// add delete for list
					var deleteIndex = "deleteOtherNumber" + profilePageViewInstance.indexNewNumber;
					item.querySelector(".deleteSalikNumberBtn").setAttribute("indx", i);
					item.querySelector(".deleteSalikNumberBtn").setAttribute("id", deleteIndex);

					item.querySelector(".deleteSalikNumberBtn").setAttribute("deleteid", salikNumbers[i].PhoneTypeId);
					item.querySelector("#" + deleteIndex).addEventListener("click", function(event) {
						event.preventDefault();
						profilePageViewInstance.currentSalikNumberToDelete = event.currentTarget.getAttribute("deleteid");
						var currentElement = salikNumbers[event.currentTarget.getAttribute("indx")];
						var messageBody = "";
						if (getApplicationLanguage() == 'en') {
							messageBody =localize("%shell.profile.DeleteMobileNumber%") + " " + "<i>" + currentElement.PhoneType + "</i>" + " " + "number"+" " + "<span>" +"("  + currentElement.PhoneNumber + ")" + "</span>" + " " + localize("%shell.profile.DeleteSalikProfileNumber%");
						} else {
							messageBody = localize("%shell.profile.DeleteMobileNumber%") + " " + "<i>" + currentElement.PhoneType + "</i>" + " " + "<span>" +"("+ currentElement.PhoneNumber  +")"+"</span>" + " " +localize("%shell.profile.DeleteSalikProfileNumber%");
						}
						var deleteOtherNumber = new Popup("DeleteSalikNumber");
						deleteOtherNumber.options.content = "<div id='deleteNumberHeader'>" + messageBody + "<div>";

						deleteOtherNumber.options.primaryBtnCallBack = function(event) {

							var id=profilePageViewInstance.currentSalikNumberToDelete;
							DVAccountModel.deleteOtherNumber(current.CustPhoneId,profilePageViewInstance.getSalikNumbersList);


						};
						deleteOtherNumber.options.secondaryBtnCallBack = function(event) {
							var deleteId = event.target.categ.getAttribute('deleteid');
							alert(deleteId);
						};
						deleteOtherNumber.show();
					});

					$("#addedNewMobile").append(item);
				}
			}
			else // Case is not linked will hide Link salik number
			{
				document.querySelector("#MyContactDetails .OtherNumbers").style.display = "none";
			}
		},
		showLinkProfileNumberPopup:function(salikNumbers)
		{
			document.querySelector("#MyContactDetails .OtherNumbers").style.display = "block";
			if(salikNumbers&&salikNumbers.length>0)
			{
				for (var j = 0; j < salikNumbers.length; j++) // Swap array for put default the first one
				{
					if (salikNumbers[j].IsDefault == "true") {
						var defaultNumber = salikNumbers[j];
						salikNumbers[j] = salikNumbers[0];
						salikNumbers[0] = defaultNumber;
						break;
					}
				}
				defaultSalikNumber=salikNumbers[0];

				profilePageViewInstance.bindOtherSalikNumbers(salikNumbers)

				var profileNumber=	profilePageViewInstance.ProfilePhone ;
				// show popup if profile number not equal salik number
				if (defaultSalikNumber){
					var defaultSalikPhoneNumber;
					var _PhoneNumber;
					if(defaultSalikNumber.PhoneNumber > 9 && defaultSalikNumber.PhoneNumber.substring(0,1) == "0"){
						_PhoneNumber = defaultSalikNumber.PhoneNumber.substring(1)
						defaultSalikPhoneNumber = (defaultSalikNumber.CountryCode == "00971" ? defaultSalikNumber.CountryCode.substring(2):defaultSalikNumber.CountryCode) + _PhoneNumber
					}else{
						defaultSalikPhoneNumber = (defaultSalikNumber.CountryCode == "00971" ? defaultSalikNumber.CountryCode.substring(2):defaultSalikNumber.CountryCode) + defaultSalikNumber.PhoneNumber;
					}

					if(profileNumber != defaultSalikPhoneNumber)
					{
						document.querySelector("#MyContactDetails .OtherNumbers").style.display = "block";
						// show linked  Popup to change salik number with profile number
						var salikNumber = defaultSalikPhoneNumber;
						var messageHeader1 = "";
						var messageHeader2 = "";
						var messageQues = "";
						if (getApplicationLanguage() == 'en'){
							messageHeader1 = "<div class='changeHeader'><span class='changeHeader1'>"+ localize("%shell.profile.DefaultMobileNumber%") + " " + "<i>" + "(" + salikNumber + ")" + "</i>" + localize("%shell.profile.NotMatching%")+ "</span>";
							messageHeader2 = "<span class='changeHeader2'>" +localize("%shell.profile.RTAProfileNumber%") + "<i>" + "(" + profileNumber + ")" + "</i>" + ".</span>" + ".</div>";
							messageQues = "<div class='changeQues'><span class='quesPart1'>"+localize("%shell.profile.WantToChangeSalikNumber%")+" </span> <span class='quespart2'>"+localize("%shell.profile.RTAProfileMobile%")+"</span> <span class='quespart3'>"+localize("%shell.profile.ChangeMobileNumber%")+"</span></div>";
						} else {

							messageHeader1 = "<div class='changeHeader'><span class='changeHeader1'>"+ localize("%shell.profile.DefaultMobileNumber%") + " " + "<i>" + "(" + salikNumber + ")" + "</i>" + localize("%shell.profile.NotMatching%")+ "</span>";
							messageHeader2 = "<span class='changeHeader2'>" +localize("%shell.profile.RTAProfileNumber%")  + "<i>" + "(" + profileNumber + ")" + "</i>" + ".</span>" + "</div>";
							messageQues = "<div class='changeQues'><span class='quesPart1'>"+localize("%shell.profile.WantToChangeSalikNumber%")+" </span> <span class='quespart2'>"+localize("%shell.profile.RTAProfileMobile%")+  "</div>";
						}
						var changeSalikNumberPopup_Options = {
								popupId: "changeSalikNumber_popup",
								title: localize("%shell.Profile.notMatching%"),
								content: messageHeader1 + messageHeader2 + messageQues,
								primaryBtnText: localize("%shell.Profile.yes%"),
								secondaryBtnText: localize("%shell.Profile.No%"),
								primaryBtnCallBack: null,
								primaryBtnDisabled: false,
								secondaryBtnCallBack: null,
								secondaryBtnVisible: true,
								secondaryBtnDisabled: false,
								hideOnPrimaryClick: true,
								hideOnSecondaryClick: true,
								aroundClickable: true,
								onAroundClick: null
						}
						var changeDefaultNumber = new Popup(changeSalikNumberPopup_Options);
						changeDefaultNumber.options.primaryBtnCallBack = function(event) {
							// we need after link to reload
							var isExist=false;
							for (var j = 0; j < salikNumbers.length; j++) // Swap array for put default the first one
							{
								var salikNum;
								if(salikNumbers[j].PhoneNumber > 9 && salikNumbers[j].PhoneNumber.substring(0,1) == "0"){
									_PhoneNumber = salikNumbers[j].PhoneNumber.substring(1)
									salikNum = (salikNumbers[j].CountryCode == "00971" ? salikNumbers[j].CountryCode.substring(2):salikNumbers[j].CountryCode) + _PhoneNumber
								}else{
									salikNum = (salikNumbers[j].CountryCode == "00971" ? salikNumbers[j].CountryCode.substring(2):salikNumbers[j].CountryCode) + salikNumbers[j].PhoneNumber;
								}
								if (salikNum == profileNumber) {
									isExist=true;
									profileSalikModel.set("rtaIsExistInSalikOthers",JSON.stringify(salikNumbers[j]));
									break;
								}
							}
							profileSalikModel.set("defaultSalikPhoneNumber",defaultSalikNumber);
							DVAccountModel.linkProfielWithSalik(profilePageViewInstance.ProfilePhone,profilePageViewInstance.getSalikNumbersList,isExist)   // callback *******
						};
						changeDefaultNumber.options.secondaryBtnCallBack = function(event) {
						};
						changeDefaultNumber.show();
					}
					else (profileNumber == defaultSalikPhoneNumber) // case linked with salik and equal profile number
					{
						document.querySelector("#MyContactDetails .OtherNumbers").style.display = "block";
					}
				}
				else // Case is not linked will hide Link salik number
				{
					document.querySelector("#MyContactDetails .OtherNumbers").style.display = "none";
				}
			}

		},
		onPageShow: function() {
//			event.preventDefault();
			try {
				if(Constants.EnableSalik == true){
					DVAccountModel.getCountryCodes(null);
				}

				document.querySelector("#MyContactDetails .OtherNumbers").style.display = "none";

				this.addNewNumberPageView = new AddNewNumberPageView();
				var NewNumberPopup_Options = {
						popupId: "DeleteSalikNumber",
						title: localize("%shell.Profile.DeleteNumber%"),
						content: null,
						primaryBtnText: localize("%shell.Profile.yes%"),
						secondaryBtnText: localize("%shell.Profile.No%"),
						primaryBtnCallBack: null,
						primaryBtnDisabled: false,
						secondaryBtnCallBack: null,
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick: null
				}
				var deleteOtherNumber = new Popup(NewNumberPopup_Options);

				var options = {
						startIndex: 0,
						touchEnabled: false,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				profilePageViewInstance.tabs = new Tabs(this.$el[0].querySelector(".tabsCont"), options);

				var data = DataUtils.getLocalStorageData("userProfile", "shell");
				if (data) {
					data = JSON.parse(data);
				}
				var username = data && data.Users[0].user_id;
				profilePageViewInstance.ProfilePhone=data && data.Users[0].mobile;
				$.getJSON(window.mobile.baseUrl +"/common/data/nationalities.json", function(countries) {
					profilePageViewInstance.countries = (getApplicationLanguage() == 'en') ? countries.sort(function(a, b) {
						if (a.DISPLAYNAME < b.DISPLAYNAME) return -1;
						if (a.DISPLAYNAME > b.DISPLAYNAME) return 1;
						return 0;
					}) : countries.sort(function(a, b) {
						return a.DISPLAYNAMEAR.localeCompare(b.DISPLAYNAMEAR);
					}); // sort arabic
					var html = "";
					for (var i = 0; i < countries.length; i++) {
						if (getApplicationLanguage() == 'ar') {
							html += "<option value='" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAMEAR + "</option>";
						} else {
							html += "<option value='" + countries[i].NATIONALITYID + "'>" + countries[i].DISPLAYNAME + "</option>";
						}
					}
					profilePageViewInstance.el.querySelector("#countries").innerHTML += html;
					if (UserProfileModel.getUserProfile()) {
						var profile = UserProfileModel.getUserProfile().Users[0];
						profilePageViewInstance.bindData(profile);
					}
				});
				profilePageViewInstance.fnameValidator = new Validator(document.querySelector("#fnameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.firstname.required2%"),
						order: 0
					}, {
						regEx: "name",
						errorMessage: localize("%shell.registeration.validation.firstname.required3%"),
						order: 1
					}],
					onValidate: profilePageViewInstance.updateUpdateBtn
				});
				profilePageViewInstance.lnameValidator = new Validator(document.querySelector("#lnameField"), {
					validations: [{
						regEx: "empty",
						errorMessage: localize("%shell.registeration.validation.lastname.required2%"),
						order: 0
					}, {
						regEx: "name",
						errorMessage: localize("%shell.registeration.validation.lastname.required3%"),
						order: 1
					}],
					onValidate: profilePageViewInstance.updateUpdateBtn
				});
				profilePageViewInstance.fnameValidator.isValid = true;
				profilePageViewInstance.lnameValidator.isValid = true;
				document.getElementById("editPhone").onclick = profilePageViewInstance.onEditPhone;
				document.getElementById("editMail").onclick = profilePageViewInstance.onEditEmail;
				document.getElementById("cancelEditFields").onclick = function() {
					document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
				}
				document.getElementById("cancelPhoneBtn").onclick = function() {
					document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
				}
				document.getElementById("cancelEmailBtn").onclick = function() {
					document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
				}
				document.getElementById("updateProfileBtn").onclick = profilePageViewInstance.saveProfileData;
				document.getElementById("updateEmailBtn").onclick = function() {
					profilePageViewInstance.email = document.querySelector("#editEmailInput").value;
					profilePageViewInstance.sendOTPRequest("EMAIL", null);
				}
				document.getElementById("updatePhoneBtn").onclick = function() {
					profilePageViewInstance.mobileNumber = "971"+ document.querySelector("#mbileEditInput").value;
					profilePageViewInstance.sendOTPRequest("SMS", null);
				}
				profilePageViewInstance.otpPopup = new Popup("OTP");
				profilePageViewInstance.otpPopup.options.secondaryBtnCallBack = null;
				var nationalitySelectorPopup = new Popup("nationalitySelectorPopup");
				nationalitySelectorPopup.onItemClick = function(id) {
					profilePageViewInstance.selectItem("countries", id);
					profilePageViewInstance.updateUpdateBtn();
				}

				profilePageViewInstance.otpPopup.options.primaryBtnCallBack = function() {
					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					userProfile = JSON.parse(userProfile);
					var userID = userProfile.Users[0].user_id;
					var OTP = profilePageViewInstance.otpPopup.pinInput.value;;
					OTPModel.verifyOTP(OTP, userID, function(res) {
						if (res.isVerified == "true" || res.isVerified == true) {
							profilePageViewInstance.otpPopup.hide(function() {
								///TODO update profile
								if (profilePageViewInstance.otpType == "EMAIL") {
									document.getElementById("email").value = profilePageViewInstance.email;
									profilePageViewInstance.saveMailAndProfileData();
								} else {
									var mobilePrefix = profilePageViewInstance.mobileNumber.substring(3, 5);
									var mobileSuffix = profilePageViewInstance.mobileNumber.substring(3, profilePageViewInstance.mobileNumber.length);
									document.getElementById('mbileNumberSuffix').value = mobileSuffix;
									profilePageViewInstance.saveMobileNumberAndProfileData();
								}
							});
						} else {
							profilePageViewInstance.otpPopup.options.primaryBtnDisabled = true;
							profilePageViewInstance.otpPopup.pinInput.clear();
							profilePageViewInstance.otpPopup.el.querySelector(".otpInvalid").style.opacity = 1;
							if (res.errorCode == "ERR-VO-B-14") {
								clearInterval(profilePageViewInstance.otpPopup.timerInterval);
								profilePageViewInstance.otpPopup.stopTimer();
								profilePageViewInstance.otpPopup.hide(function() {
									var OTPVerificationLimitPopup = new Popup("OTPVerificationLimitPopup");
									OTPVerificationLimitPopup.show();
								});
							}
						}
					});
				}
				profilePageViewInstance.otpPopup.el.querySelector(".resend").onclick = function() {
					profilePageViewInstance.sendOTPRequest(profilePageViewInstance.otpType, function(res) {
						profilePageViewInstance.otpPopup.stopTimer();
						profilePageViewInstance.otpPopup.pinInput.clear();
						profilePageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						profilePageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						profilePageViewInstance.otpPopup.options.primaryBtnDisabled = true;
						setTimeout(function() {
							profilePageViewInstance.otpPopup.startTimer();
						}, 150);
					});
				}
				profilePageViewInstance.verificationLimitPopup = new Popup("OTPVerificationLimitPopup");
				profilePageViewInstance.verificationLimitPopup.options.secondaryBtnText = localize("%shell.label.cancel%");
				profilePageViewInstance.verificationLimitPopup.options.secondaryBtnCallBack = null;
				profilePageViewInstance.verificationLimitPopup.options.primaryBtnCallBack = function() {
					profilePageViewInstance.sendOTPRequest(profilePageViewInstance.otpType);
				}
				profilePageViewInstance.timeoutPop = new Popup("OTPTimeoutPopup");
				profilePageViewInstance.timeoutPop.options.secondaryBtnText = localize("%shell.label.cancel%");
				profilePageViewInstance.timeoutPop.options.secondaryBtnCallBack = null;
				profilePageViewInstance.timeoutPop.options.primaryBtnCallBack = function() {
					profilePageViewInstance.sendOTPRequest(profilePageViewInstance.otpType);
				}
				document.getElementById("radio1").onclick = profilePageViewInstance.updateUpdateBtn;
				document.getElementById("radio2").onclick = profilePageViewInstance.updateUpdateBtn;
				document.getElementById("radio3").onclick = profilePageViewInstance.updateUpdateBtn;
				document.getElementById("radio4").onclick = profilePageViewInstance.updateUpdateBtn;
				document.getElementById("title").onchange = profilePageViewInstance.updateUpdateBtn;
				document.getElementById("countries").onchange = profilePageViewInstance.updateUpdateBtn;
				if(Constants.EnableSalik == true){
					DVAccountModel.getSalikNumbers(profilePageViewInstance.showLinkProfileNumberPopup);
				}else{
					document.querySelectorAll('.OtherNumbers')[0].style.display="none"

				}
			}catch(e){}
		},
		saveMailAndProfileData: function(event) {
			$(".ui-loader").show();
			var profile = UserProfileModel.getUserProfile().Users[0];
			var inputs = {
					userId: profile.user_id,
					mail: document.getElementById("email").value
			};
			UserProfileModel.updateMail(inputs, function(status, result) {
				$(".ui-loader").hide();
				if (status == AuthenticationModel.SUCCESS && result.invocationResult.isSuccessful) {
					var profileUpdatedPopup_Options = {
							popupId: "profileUpdated",
							title: localize("%shell.popup.success.title%"),
							content: localize("%shell.profile.save.sucess.text%"),
							primaryBtnText: localize("%shell.dialog.button.ok%"),
							primaryBtnCallBack: function() {
								history.back();
								document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
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
					var profileUpdated = new Popup(profileUpdatedPopup_Options);
					profileUpdated.show();
					document.getElementById("updatePhoneBtn").className = "waves-effect btn disabled";
				} else {
					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					var profile = JSON.parse(userProfile).Users[0];

					if (profilePageViewInstance.otpType == "EMAIL") {
						document.getElementById("email").value = profile.mail;
					} else {
						var mobilePrefix = profile.mobile.substring(3, 5);
						var mobileSuffix = profile.mobile.substring(3, profile.mobile.length);
						profilePageViewInstance.ProfileMobileNumber=mobileSuffix;
						//	profilePageViewInstance.selectItem('mobilePrefix',mobilePrefix);
						document.getElementById('mbileNumberSuffix').value = mobileSuffix;
					}
					var errorpop = new Popup("generalErrorPopup");
					errorpop.show();
				}
			});
		},
		saveMobileNumberAndProfileData: function(event) {
			$(".ui-loader").show();
			var profile = UserProfileModel.getUserProfile().Users[0];
			var inputs = {
					userId: profile.user_id,
					oldMobileNo: profile.mobile,
					//document.getElementById("mobilePrefix").options[document.getElementById("mobilePrefix").selectedIndex].value+
					newMobileNo: "971" + document.getElementById("mbileNumberSuffix").value
			};
			UserProfileModel.updateMobileNumber(inputs, function(status, result) {
				$(".ui-loader").hide();
				if (status == AuthenticationModel.SUCCESS && result.invocationResult.isSuccessful) {
					var profileUpdatedPopup_Options = {
							popupId: "profileUpdated",
							title: localize("%shell.popup.success.title%"),
							content: localize("%shell.profile.save.sucess.text%"),
							primaryBtnText: localize("%shell.dialog.button.ok%"),
							primaryBtnCallBack: function() {
								//								history.back();
								document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
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
					var profileUpdated = new Popup(profileUpdatedPopup_Options);
					profileUpdated.show();
					document.getElementById("updatePhoneBtn").className = "waves-effect btn disabled";
				} else {
					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					var profile = JSON.parse(userProfile).Users[0];
					if (profilePageViewInstance.otpType == "EMAIL") {
						document.getElementById("email").value = profile.mail;
					} else {
						var mobilePrefix = profile.mobile.substring(3, 5);
						var mobileSuffix = profile.mobile.substring(3, profile.mobile.length);
						//profilePageViewInstance.selectItem('mobilePrefix',mobilePrefix);
						document.getElementById('mbileNumberSuffix').value = mobileSuffix;
					}
					var errorpop = new Popup("generalErrorPopup");
					errorpop.show();
				}
			});
		},
		ContinueButtonClick: function() {
			/*document.getElementById("contatDetailsId").classList.remove("active");
			document.getElementById("profileDetailsId").classList.add("active");
			document.getElementById("profileDetailsId").classList.remove("disabled");
			document.getElementById("contatDetailsId").classList.add("disabled");*/
			var options = {
					startIndex: 1,
					touchEnabled: false,
					direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
			}
			profilePageViewInstance.Tabs = new Tabs(this.$el[0].querySelector(".tabsCont"), options);
		},
		saveProfileData: function(event) {
			//			if(!profilePageViewInstance.validateForm())return;
			$(".ui-loader").show();
			var profile = UserProfileModel.getUserProfile().Users[0];
			/*******************************************/
			var preferedLang;
			if (document.getElementById("radio1").checked) preferedLang = "English";
			if (document.getElementById("radio2").checked) preferedLang = "Arabic";
			var prefCom;
			if (document.getElementById("radio3").checked) prefCom = "Email";
			if (document.getElementById("radio4").checked) prefCom = "SMS";
			var inputs = {
					userId: profile.user_id,
					email: document.getElementById("email").value,
					//document.getElementById("mobilePrefix").options[document.getElementById("mobilePrefix").selectedIndex].value+
					mobileNo: "971" + document.getElementById("mbileNumberSuffix").value,
					title: document.getElementById("title").options[document.getElementById("title").selectedIndex].value,
					firstName: document.getElementById("firstName").value,
					lastName: document.getElementById("lastName").value,
					nationality: document.getElementById("countries").options[document.getElementById("countries").selectedIndex].value,
					//					emiratesId:document.getElementById("emiratesId").value.replace(/-/g, ''),
					prefLanguage: preferedLang,
					prefComm: prefCom,
					isEmailVerified: "true",
					isMobileVerified: "true"
			};
			UserProfileModel.updateUserProfile(inputs, function(status, result) {
				$(".ui-loader").hide();
				if (status == AuthenticationModel.SUCCESS && result.invocationResult.isSuccessful) {
					var profileUpdatedPopup_Options = {
							popupId: "profileUpdated",
							title: localize("%shell.popup.success.title%"),
							content: localize("%shell.profile.save.sucess.text%"),
							primaryBtnText: localize("%shell.dialog.button.ok%"),
							primaryBtnCallBack: function() {
								//								history.back();
								document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,100%,0)";
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
					var profileUpdated = new Popup(profileUpdatedPopup_Options);
					profileUpdated.show();
					document.getElementById("updatePhoneBtn").className = "waves-effect btn disabled";
				} else {
					var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
					var profile = JSON.parse(userProfile).Users[0];
					if (profilePageViewInstance.otpType == "EMAIL") {
						document.getElementById("email").value = profile.mail;
					} else {
						var mobilePrefix = profile.mobile.substring(3, 5);
						var mobileSuffix = profile.mobile.substring(3, profile.mobile.length);
						//	profilePageViewInstance.selectItem('mobilePrefix',mobilePrefix);
						document.getElementById('mbileNumberSuffix').value = mobileSuffix;
					}
					var errorpop = new Popup("generalErrorPopup");
					errorpop.show();
				}
			});
		},
		updateUpdateBtn: function() {
			var profile = UserProfileModel.getUserProfile().Users[0];
			var preferedLang;
			if (document.getElementById("radio1").checked) preferedLang = "English";
			if (document.getElementById("radio2").checked) preferedLang = "Arabic";
			var prefCom;
			if (document.getElementById("radio3").checked) prefCom = "Email";
			if (document.getElementById("radio4").checked) prefCom = "SMS";
			if (profile.preferred_communication != prefCom || profile.preferred_language != preferedLang || profile.title_id != document.getElementById("title").options[document.getElementById("title").selectedIndex].value || profile.first_name_en != document.getElementById("firstName").value || profile.last_name_en != document.getElementById("lastName").value || profile.nationality_id != document.getElementById("countries").options[document.getElementById("countries").selectedIndex].value) {
				//				var fnameValid = profilePageViewInstance.fnameValidator.validate();
				//				var lnameValid = profilePageViewInstance.lnameValidator.validate();
				if (profilePageViewInstance.fnameValidator.isValid && profilePageViewInstance.lnameValidator.isValid) {
					document.getElementById("updateProfileBtn").className = "saveBtn waves-effect";
				} else {
					document.getElementById("updateProfileBtn").className = "saveBtn waves-effect disabled";
				}
			} else {
				document.getElementById("updateProfileBtn").className = "saveBtn waves-effect disabled";
			}
		},
		selectItem: function(select, val) {
			var sel = document.getElementById(select);
			var opts = sel.options;
			var selected = false;
			for (var opt, j = 0; opt = opts[j]; j++) {
				if (opt.value == val) {
					sel.selectedIndex = j;
					selected = true;
					break;
				}
			}
			return selected;
		},
		bindData: function(profile) {
			document.getElementById("email").value = profile.mail;
			var mobilePrefix = profile.mobile.substring(3, 5);
			var mobileSuffix = profile.mobile.substring(3, profile.mobile.length);
			profilePageViewInstance.ProfileMobileNumbe=profile.mobile;
			//profilePageViewInstance.selectItem('mobilePrefix',mobilePrefix);
			document.getElementById('mbileNumberSuffix').value = mobileSuffix;
			profilePageViewInstance.selectItem('title', profile.title_id);
			document.getElementById("firstName").value = profile.first_name_en;
			document.getElementById("lastName").value = profile.last_name_en;
			profilePageViewInstance.selectItem('countries', profile.nationality_id);
			if (profile.preferred_language == "English") {
				document.getElementById("radio1").checked = true;
			} else {
				document.getElementById("radio2").checked = true;
			}
			if (profile.preferred_communication == "Email") {
				document.getElementById("radio3").checked = true;
			} else {
				document.getElementById("radio4").checked = true;
			}
		},
		onEditPhone: function() {
			document.querySelector("#changeMobileCont").style.display = "block";
			document.querySelector("#changeMailCont").style.display = "none";
			document.querySelector("#mbileEditInput").value = "";
			var mbileEditFieldValidator = new Validator(document.querySelector("#mbileEditField"), {
				validations: [{
					regEx: "empty",
					errorMessage: localize("%shell.registeration.validation.mobile.required2%"),
					order: 0
				}, {
					regEx: function(val, el) {
						if (val.length >= 9) {
							el.value = val.substring(0, 9);
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
						document.querySelector("#updatePhoneBtn").className = document.querySelector("#updatePhoneBtn").className.replace(new RegExp("disabled", 'g'), "")
					} else {
						document.querySelector("#updatePhoneBtn").className += " disabled";
					}
				}
			});
			setTimeout(function() {
				document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,0,0)";
			});
		},
		onEditEmail: function() {
			document.querySelector("#changeMobileCont").style.display = "none";
			document.querySelector("#changeMailCont").style.display = "block";
			document.querySelector("#editEmailInput").value = "";
			var mbileEditFieldValidator = new Validator(document.querySelector("#editEmailField"), {
				validations: [{
					regEx: "empty",
					errorMessage: localize("%shell.registeration.validation.mail.required2%"),
					order: 0
				}, {
					regEx: "email",
					errorMessage: localize("%shell.registeration.validation.mail.required3%"),
					order: 1
				}],
				onValidate: function(valid) {
					if (valid) {
						document.querySelector("#updateEmailBtn").className = document.querySelector("#updateEmailBtn").className.replace(new RegExp(" disabled", 'g'), "");
					} else {
						document.querySelector("#updateEmailBtn").className += " disabled";
					}
				}
			});
			setTimeout(function() {
				document.querySelector("#editFieldsCont").style.webkitTransform = "translate3d(0,0,0)";
			});
		},
		sendOTPRequest: function(type, callBack) {
			var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
			userProfile = JSON.parse(userProfile);
			var userID = userProfile.Users[0].user_id;
			profilePageViewInstance.otpType = type;
			switch (type) {
			case "EMAIL":
			{
				OTPModel.sendOTP(userID, "updateEmail", null, profilePageViewInstance.email, function(res) {
					if (callBack) {
						callBack(res);
					} else {
						profilePageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = localize("%shell.OTP.mail.text%") + "<span>" + profilePageViewInstance.email + "</span>";
						profilePageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						profilePageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						profilePageViewInstance.otpPopup.show();
					}
				});
				break;
			}
			case "SMS":
			{
				OTPModel.sendOTP(userID, "updateMobile", profilePageViewInstance.mobileNumber, null, function(res) {
					if (callBack) {
						callBack(res);
					} else {
						profilePageViewInstance.otpPopup.el.querySelector("#customContent").innerHTML = localize("%shell.OTP.mobile.text%") + "<span>" + profilePageViewInstance.mobileNumber + "</span>";
						profilePageViewInstance.otpPopup.options.OTPduration = Number(res.OTPvalidFor);
						profilePageViewInstance.otpPopup.updateResendButton(res.AttemptsRemaining, Number(res.CurrentCycleRemainingTime));
						profilePageViewInstance.otpPopup.show();
					}
				});
				break;
			}
			}
		},

		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});
	// Returns the View class
	return ProfilePageView;
});

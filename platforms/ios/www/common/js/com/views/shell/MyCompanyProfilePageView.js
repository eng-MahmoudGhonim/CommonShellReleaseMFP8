
define(["com/views/PageView", "com/utils/DataUtils", "com/utils/Utils", "com/views/Header", "com/models/shell/UserProfileModel","com/models/corporates/MyAccountCorporateModel"], function(PageView, DataUtils, Utils, Header, UserProfileModel,MyAccountCorporateModel) {
	// Extends PagView class
	var MyCompanyProfilePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			profilePageViewInstance = this;
			options.phoneTitle =localize("%shell.Companyprofile.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
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
		onPageShow: function(event) {
			event.preventDefault();


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
				/*if (UserProfileModel.getUserProfile()) {
					var profile = UserProfileModel.getUserProfile().Users[0];
					profilePageViewInstance.bindData(profile);
				}*/
				$('.ui-loader').show();
				MyAccountCorporateModel.getCorporateProfile(function (profile){
					$('.ui-loader').hide();
					profilePageViewInstance.bindData(profile);

				});
			});

			var nationalitySelectorPopup = new Popup("nationalitySelectorPopup");
			nationalitySelectorPopup.onItemClick = function(id) {
				profilePageViewInstance.selectItem("countries", id);
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


			profilePageViewInstance.ProfileMobileNumber=profile.mobile;

			document.getElementById('AdminMobileValue').value = profile.mobile;
			document.getElementById('MobileNumberCompanyOffice').value = profile.mobile;
			document.getElementById('MobileNumberFaxNumber').value = profile.mobile;

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
			document.getElementById("BusinessLicNumber").value = profile.businessLicNumber;
			document.getElementById("IssueDate").value = profile.issueDate;
			document.getElementById("ExpireDate").value = profile.expireDate;
			document.getElementById("BusinessLicenseIssued").value = profile.businessLicenseIssued;
			document.getElementById("MobileNumberCompanyOffice").value = profile.officeTelephone;
			document.getElementById("MobileNumberFaxNumber").value = profile.officeFax;
			document.getElementById("CompanyEmail").value = profile.companyEmail;
			document.getElementById("POBox").value = profile.pOBox;
			document.getElementById("AdminEmail").value = profile.adminEmail;

		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});
	// Returns the View class
	return MyCompanyProfilePageView;
});

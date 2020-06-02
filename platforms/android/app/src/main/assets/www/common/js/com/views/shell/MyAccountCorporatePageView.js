define(["com/utils/DataUtils", "com/views/PageView", "com/views/Header", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/models/corporates/MyAccountCorporateModel"],
		function(DataUtils, PageView, Header, UserProfileModel, AuthenticationModel, MyAccountCorporateModel) {
	var MyAccountCorporatePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap #userprofilebutton': 'userProfileButtonClick',
			'tap #profileDetails': 'openProfileDetails',
			'tap #myTransactionsCorporate': 'openMyTransactions',
			'tap #MyVehiclesCorporate': 'openMyVehicles',
			'tap #templateProfileImage': 'userProfileButtonClick',
			'tap #userprofileImg': 'userProfileButtonClick',
			'tap #CreateNewNOCBTn': 'createNewNocClick',
			'tap #ManageNOCBtn': 'manageNocClick',

		},
		createNewNocClick:function(){
			MyAccountCorporateModel.createNewNoc(myAccountCorporatePageViewInstance.bindNOCs);
		},
		manageNocClick:function(){
			MyAccountCorporateModel.manageNOCs(myAccountCorporatePageViewInstance.bindNOCs);
		},
		openMyTransactions: function(event) {
			event.preventDefault();
			MyAccountCorporateModel.openMyTransactions(); // currently not supported
		},
		openMyVehicles: function(event) {
			event.preventDefault();
			MyAccountCorporateModel.openMyVehicles();
		},
		openCameraForUserProfilePhoto: function() {
			try {
				$(".ui-loader").show();
				var destinationType = Camera.DestinationType.DATA_URL;
				if (Utils.isiOS()) {
					destinationType = Camera.DestinationType.DATA_URL;
				}
				navigator.camera.getPicture(onSuccess, onFail, {
					quality: 50,
					destinationType: destinationType,
					sourceType: Camera.PictureSourceType.CAMERA,
					correctOrientation: true //Corrects Android orientation quirks
				});

				function onSuccess(imageData) {
					try {
						imageData = "data:image/jpeg;base64," + imageData;
						document.getElementById('userprofileImg').setAttribute('src', imageData);
						$("#userprofileImg").show();
						var data = DataUtils.getLocalStorageData("userProfile", "shell");
						if (data) {
							data = JSON.parse(data);
						}
						var username = data && data.Users[0].user_id;
						DataUtils.removeFromLocalStorage('userprofileImg' + username, "shell")
						DataUtils.setLocalStorageData('userprofileImg' + username, imageData, false, 'shell');
						var sidepanel = MobileRouter.getSidePanel();
						sidepanel.updateUserProfileImage();

						$(".ui-loader").hide();
					} catch (e) {
						$(".ui-loader").hide();
					}
				}
				function onFail(message) {
					$(".ui-loader").hide();
				}
			} catch (e) {
				$(".ui-loader").hide();
			}
		},
		openAlbumForUserProfilePhoto: function() {
			try {
				$(".ui-loader").show();
				var destinationType = Camera.DestinationType.DATA_URL;
				if (Utils.isiOS()) {
					destinationType = Camera.DestinationType.DATA_URL;
				}
				navigator.camera.getPicture(onSuccess, onFail, {
					quality: 50,
					destinationType: destinationType,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit: true,
					correctOrientation: true //Corrects Android orientation quirks
				});

				function onSuccess(imageData) {
					try {
						imageData = "data:image/jpeg;base64," + imageData;
						//var imgSrc =imageData+ '?' + Math.random();
						document.getElementById('userprofileImg').setAttribute('src', imageData);
						$("#userprofileImg").show();
						var data = DataUtils.getLocalStorageData("userProfile", "shell");
						if (data) {
							data = JSON.parse(data);
						}
						var username = data && data.Users[0].user_id;
						DataUtils.removeFromLocalStorage('userprofileImg' + username, "shell")
						DataUtils.setLocalStorageData('userprofileImg' + username, imageData, false, 'shell');
						var sidepanel = MobileRouter.getSidePanel();
						sidepanel.updateUserProfileImage();

						$("#templateProfileImage").hide();
						$(".ui-loader").hide();
					} catch (e) {
						$(".ui-loader").hide();
					}
				}

				function onFail(message) {
					$(".ui-loader").hide();
				}
			} catch (e) {
				$(".ui-loader").hide();
			}
		},
		userProfileButtonClick: function(event) {
			event.preventDefault();
			var selectPhotoPopup = new Popup("selectPhotoPopup");
			selectPhotoPopup.options.primaryBtnCallBack = myAccountCorporatePageViewInstance.openCameraForUserProfilePhoto;
			selectPhotoPopup.options.secondaryBtnCallBack = myAccountCorporatePageViewInstance.openAlbumForUserProfilePhoto;
			selectPhotoPopup.show();
		},
		initialize: function(options) {
			var self = this;
			myAccountCorporatePageViewInstance = this;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.sidepanel.CorporateAccount%");
			PageView.prototype.initialize.call(this, options);
		},


		RenderPersonalDetails:function()
		{
			var data= DataUtils.getLocalStorageData("userProfile", "shell");
			if (data) {
				data = JSON.parse(data);
				var username = data&& data.Users[0].user_id;

				if(username)
				{
					document.getElementById("AccountUserName").innerHTML = username;
					var firstName = getApplicationLanguage() == 'en' ? "Hello" + " " + "<i>"+ data.Users[0].first_name_en+ "</i>" : (data.Users[0].first_name_ar ? "مرحبا" + " " + "<i>" + data.Users[0].first_name_ar  + "</i>": "مرحبا" + " " + "<i>" + data.Users[0].first_name_en + "</i>");
					document.getElementById("ProfileUserName").innerHTML = firstName ;
				}
				var userProfileImage = DataUtils.getLocalStorageData("userprofileImg" + username, "shell");
				if (!isUndefinedOrNullOrBlank(userProfileImage)) {
					document.getElementById('userprofileImg').setAttribute('src', userProfileImage);
					$("#userprofileImg").show();
				}
				var companyName=data.companyName;

			}
			},
			renderCompanyName:function(data){
				if(data){
					document.getElementById("AccountCompanyName").innerHTML = data.companyName ;
				}
			},

			bindNOCs:function()
			{
				$('.ui-loader').show();
				MyAccountCorporateModel.getNOCsDetails(function (nocs){
					$('.ui-loader').hide();
					totalNumberNOC=MyAccountCorporateModel.numberOfNOCsLastThreeMonths();
					document.querySelector("#MyAccountCorporatePage #LinkedAccounts #LinkedAccountHeader i").innerHTML=totalNumberNOC;
					var elements=document.getElementsByClassName("NocBox");
					for(var i=0 ; i<nocs.length; i++){
						elements[i].getElementsByClassName("NocBoxValue")[0].innerHTML=nocs[i].Value;
					}
				});

			},
			onPageShow: function() {
				var options = {
						startIndex: 0,
						touchEnabled: false,
						onIndexChange: this.onMainTabChanged,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				var tabs = new Tabs(this.$el[0].querySelector(".tabsCont"), options);
				myAccountCorporatePageViewInstance.RenderPersonalDetails();
				MyAccountCorporateModel.getCorporateProfile(myAccountCorporatePageViewInstance.renderCompanyName)

				// Nocs Binding
				myAccountCorporatePageViewInstance.bindNOCs();



			},
			onMainTabChanged: function(index) {
				console.log(index)
			},
			openProfileDetails: function(event) {
				event.preventDefault();
				mobile.changePage("shell/myCompanyProfile.html");

			},
			dispose: function() {
				PageView.prototype.dispose.call(this);
			}
	});
	return MyAccountCorporatePageView;
});

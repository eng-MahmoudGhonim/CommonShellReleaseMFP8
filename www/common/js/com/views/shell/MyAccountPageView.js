define(["com/utils/DataUtils", "com/views/PageView", "com/views/Header", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/models/drivers_and_vehicles/DVAccountModel","com/models/drivers_and_vehicles/DVDashboardModel","com/models/Constants"], function(DataUtils, PageView, Header, UserProfileModel, AuthenticationModel, DVAccountModel,DVDashboardModel,Constants) {
	var MyAccountPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap #userprofilebutton': 'userProfileButtonClick',
			'tap #changePassBtn': 'changePasswordClick',
			'tap #profileDetails': 'openProfileDetails',
			'tap #myTransactions': 'openMyTransactions',
			'tap #myDriveLicense': 'openMyDriveLicense',
			'tap #myVehicles': 'openMyVehicles',
			'tap #myDocs': 'openMyDocs',
			'tap #myPlaces': 'openMyPlaces',
			'tap #templateProfileImage': 'userProfileButtonClick',
			'tap #userprofileImg': 'userProfileButtonClick',
			'tap #AddSalikAccountNumber': 'addSalikAccountNumberClick',
			'tap #DeleteSalikAccountNumber': 'deleteSalikAccountNumberClick',
			'tap #AddParkingAccountNumber':'addParkingAccountNumberClick',
			'tap #AddTrafficFileNumber':'addTrafficFilseNumberClick'
		},

		addParkingAccountNumberClick:function()
		{
			DVAccountModel.addParkingAccount();
		},
		getParkingAccountNumberClick:function()
		{
			var parkingNumber=DVAccountModel.getParkingAccount();
			if(!isUndefinedOrNullOrBlank(parkingNumber))
			{
				document.getElementById("AddParkingAccountNumber").style.display="none";
				document.getElementById("ParkingAccountNumberValue").innerHTML=parkingNumber.number;
			}
		},

		getTrafficFilseNumberClick:function()
		{
			trafficNumber=DVAccountModel.getTrafficFileNumber();
			if(!isUndefinedOrNullOrBlank(trafficNumber))
			{
				document.getElementById("AddTrafficFileNumber").style.display="none";
				document.getElementById("TrafficFileNumberValue").innerHTML=trafficNumber.number;
			}
		},
		addTrafficFilseNumberClick:function()
		{
			DVAccountModel.addTrafficFileNumber();
		},

		getSalikAccountNumberClick:function(salikAccount)
		{
			var swap;
			if(!isUndefinedOrNullOrBlank(salikAccount))
			{
				document.getElementById("AddSalikAccountNumber").style.display="none"; // hide add button
				document.getElementById("SalikAccountNumberValue").innerHTML=salikAccount.number;
				document.getElementById('SalikNumberCont').style.pointerEvents="all";
				if (getApplicationLanguage() == 'en' ){
					swap= Swiped.init({
						query: '#SalikNumberCont',
						right: 90,
						onMove:function(){
							document.querySelector("#UpdateSalikAccountNumber").classList.remove("ChangeZIndex");
						},
						onClose:function(){
							document.querySelector("#UpdateSalikAccountNumber").classList.remove("ChangeZIndex");
						},
						onOpen:function(){
							var mainElBounding =this.elem.getBoundingClientRect();
							if (mainElBounding.x < 0)
								document.querySelector("#UpdateSalikAccountNumber").classList.contains("ChangeZIndex")==false?document.querySelector("#UpdateSalikAccountNumber").classList.add("ChangeZIndex"):"";
						}
					});

				}else {
					swap= Swiped.init({
						query: '#SalikNumberCont',
						left: 120,
						onMove:function(){
							document.querySelector("#UpdateSalikAccountNumber").classList.remove("ChangeZIndex");
						},
						onClose:function(){
							document.querySelector("#UpdateSalikAccountNumber").classList.remove("ChangeZIndex");
						},
						onOpen:function(){						
							var mainElBounding =this.elem.getBoundingClientRect();
							if (mainElBounding.x < 0) 
								document.querySelector("#UpdateSalikAccountNumber").classList.contains("ChangeZIndex")==false?document.querySelector("#UpdateSalikAccountNumber").classList.add("ChangeZIndex"):"";
						}
					});
				}


			}
			else{
				if (!isUndefinedOrNullOrBlank(Swiped._elems[0])){ 
					Swiped._elems[0].close();
					Swiped._elems[0].destroy(false);
				}			
				document.getElementById("SalikAccountNumberValue").innerHTML="";// add new 
				document.getElementById("AddSalikAccountNumber").style.display="block";// show add buttom
				if (!isUndefinedOrNullOrBlank(Swiped._elems[0])){ 
					Swiped._elems[0].close();
					Swiped._elems[0].destroy(false);
				}
			}
		},

		addSalikAccountNumberClick:function()
		{
			DVAccountModel.addSalikAccount(myAccountPageViewInstance.getSalikAccountNumberClick);
		},
		deleteSalikAccountNumberClick:function()
		{
			DVAccountModel.removeSalikAccount(myAccountPageViewInstance.getSalikAccountNumberClick);
		},

		openMyTransactions: function(event) {
			event.preventDefault();
			DVAccountModel.openMyTransactions();
		},
		openMyDriveLicense: function(event) {
			event.preventDefault();
			DVAccountModel.openMyDriveLicense();
		},
		openMyVehicles: function(event) {
			event.preventDefault();
			DVAccountModel.openMyVehicles();
		},
		openMyDocs: function(event) {
			event.preventDefault();
			if (AuthenticationModel.isAuthenticated()) {
				if (!UserProfileModel.getUserProfile().Users[0].traffic_number) {
					DVDashboardModel.onLinkTrafficFileClick();
				} else {
					mobile.changePage("shell/mstore.html");
				}
			} else {
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}
		},
		openMyPlaces: function(event) {
			event.preventDefault();
			DVAccountModel.openMyPlaces();
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
			selectPhotoPopup.options.primaryBtnCallBack = myAccountPageViewInstance.openCameraForUserProfilePhoto;
			selectPhotoPopup.options.secondaryBtnCallBack = myAccountPageViewInstance.openAlbumForUserProfilePhoto;
			selectPhotoPopup.show();
		},
		changePasswordClick: function(event) {
			event.preventDefault();
			mobile.changePage("shell/password.html");
		},
		initialize: function(options) {
			var self = this;
			myAccountPageViewInstance = this;
			//myAccountPageViewInstance.LinkedSalikAccountData=DVAccountModel.getSalikAccount();
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = localize("%shell.profile.myAccount%");
			PageView.prototype.initialize.call(this, options);
		},

		RenderPersonalDetails:function()
		{
			var data = DataUtils.getLocalStorageData("userProfile", "shell");
			if (data) {
				data = JSON.parse(data);
				var username = data && data.Users[0].user_id;
				if(username){
					document.getElementsByClassName("usernameValue")[0].innerHTML = username;
					var name=fullName(data.Users[0].first_name_en);
					var firstName = getApplicationLanguage() == 'en' ? "Hello" + " " + "<i>"+ name+ "</i>" : (data.Users[0].first_name_ar ? "مرحبا" + " " + "<i>" + name  + "</i>": "مرحبا" + " " + "<i>" + name+ "</i>");
					document.getElementById("ProfileUserName").innerHTML = firstName ;
				}
				var userProfileImage = DataUtils.getLocalStorageData("userprofileImg" + username, "shell");
				if (!isUndefinedOrNullOrBlank(userProfileImage)) {
					document.getElementById('userprofileImg').setAttribute('src', userProfileImage);
					$("#userprofileImg").show();
				}
			}
		},

		handleSalikButtonAnimation:function (salikAccount){
			var animateSalik = DataUtils.getLocalStorageData("SalikAccountContainerAnimated", "shell");
			if(!isUndefinedOrNullOrBlank(salikAccount) && animateSalik !="true"){
				document.querySelector("#SalikNumberCont").style.transitionDuration ="1000ms";
				document.querySelector("#SalikNumberCont").style.transitionTimingFunction  ="ease-in-out";
				getApplicationLanguage() == 'en'?document.querySelector("#SalikNumberCont").style.webkitTransform ='translate(-145px)':document.querySelector("#SalikNumberCont").style.webkitTransform ='translate(145px)';
				setTimeout(function(){ 
					document.querySelector("#UpdateSalikAccountNumber").classList.remove("ChangeZIndex");
					document.querySelector("#SalikNumberCont").style.transitionDuration ="750ms";
					document.querySelector("#SalikNumberCont").style.webkitTransform ='translate(0px)';
				}, 1000);
				DataUtils.setLocalStorageData("SalikAccountContainerAnimated",true , true, "shell");
			}
		},
		changeTabIndex:function(index){
			if ( index==1)
				DVAccountModel.getSalikAccount(myAccountPageViewInstance.handleSalikButtonAnimation)
		},
		onPageShow: function() {


			if(Constants.EnableSalik == true){
				DVAccountModel.getSalikAccount(myAccountPageViewInstance.getSalikAccountNumberClick)
			}else{

			}

			var options = myAccountPageViewInstance.options;
			if(options.data && options.data.openMyAccount=="true")
			{
				var options = {
						startIndex: 1,
						touchEnabled: false,
						onIndexChange: this.onMainTabChanged=myAccountPageViewInstance.changeTabIndex,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				var tabs = new Tabs(this.$el[0].querySelector(".tabsCont"), options);
			}
			else{
				var options = {
						startIndex: 0,
						touchEnabled: false,
						onIndexChange: this.onMainTabChanged=myAccountPageViewInstance.changeTabIndex,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				var tabs = new Tabs(this.$el[0].querySelector(".tabsCont"), options);
			}
			myAccountPageViewInstance.RenderPersonalDetails();
			if(Constants.EnableSalik == true){
				myAccountPageViewInstance.getParkingAccountNumberClick();
				myAccountPageViewInstance.getTrafficFilseNumberClick();
			}else{
				tabs.el.querySelectorAll('#tabsContent')[0].style.top="0px";
				tabs.el.querySelectorAll('.tabsHead')[0].style.display="none";				
			}

		},
		openProfileDetails: function(event) {
			event.preventDefault();
			mobile.changePage("shell/profile.html");
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});
	return MyAccountPageView;
});
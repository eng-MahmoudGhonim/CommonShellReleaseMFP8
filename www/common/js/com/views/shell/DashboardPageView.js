
/* JavaScript content from js/com/views/shell/DashboardPageView.js in folder common */
define(["com/models/Constants", "com/utils/DataUtils", "com/views/PageView", "com/views/Header", "com/utils/Utils", "com/models/shell/CustomerSupportCenterModel", "com/models/shell/GreenPointsModel", "com/models/shell/MStoreCoverModel", "com/models/shell/UserProfileModel", "com/models/shell/GroupingModel", "com/models/shell/AuthenticationModel", "com/models/shell/OTPModel", "com/models/shell/UserFavoritesModel", "com/models/shell/DashboardModel", "com/models/shell/DashboardModelCorporate", "com/models/shell/NotificationsModel", "com/models/shell/NILoyaltyModel"], function (Constants, DataUtils, PageView, Header, Utils, CustomerSupportCenterModel, GreenPointsModel, MStoreCoverModel, UserProfileModel, GroupingModel, AuthenticationModel, OTPModel, UserFavoritesModel, DashboardModel, DashboardModelCorporate, NotificationsModel, NILoyaltyModel) {
	var DashboardPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
		},
		initialize: function (options) {
			dashboardPageViewInstance = this;
			language = getApplicationLanguage();
			options.phoneTitle = "%shell.dashboard.title%";
			options.headerState = Header.DASHBOARD;
			options.preventiOSDefaultScroll = true;
			options.currentScrollingContentId = "dashboardPage";
			PageView.prototype.initialize.call(this, options);
			dashboardPageViewInstance.CurrentWhatsNew = false;
		},
		handleSSLPinning: function () {
			if (window.app.sslCertificatePinned == false) {
				var sslPinningContent;
				if (Utils.isAndroid()) {
					sslPinningContent = localize("%shell.popup.SSLPinningPopup.androidContent%");
				} else {
					sslPinningContent = localize("%shell.popup.SSLPinningPopup.iOSContent%");
				}
				var SSLPinningPopup_Options = {
						popupId: "SSLPinningPopup",
						title: localize("%shell.popup.error.title%"),
						content: sslPinningContent,
						primaryBtnText: localize("%shell.dialog.button.ok%"),
						primaryBtnCallBack: function () {
							if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
								if (Utils.isAndroid()) {
									window.open('market://details?id=com.rta.driversandvehicles', "_system");
								} else if (Utils.isiOS()) {
									window.open('itms-apps://itunes.apple.com/app/id912748782', "_system");
								}

							} else if (Constants.APP_ID == "RTA_Corporate_Services") {
								if (Utils.isAndroid()) {
									window.open('market://details?id=com.rta.corporates', "_system");
								} else if (Utils.isiOS()) {
									window.open('itms-apps://itunes.apple.com/app/id912419810', "_system");
								}

							} else if (Constants.APP_ID == "RTA_Public_Transport") {
								if (Utils.isAndroid()) {
									window.open('market://details?id=com.rta.publictransportation', "_system");
								} else if (Utils.isiOS()) {
									window.open('itms-apps://itunes.apple.com/app/id913050130', "_system");

								}
							}
							MobileRouter.killApp();
						},

						primaryBtnDisabled: false,
						secondaryBtnText: null,
						secondaryBtnCallBack: null,
						secondaryBtnVisible: false,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: false,
						onAroundClick: null
				}
				var SSLPinningPopup = new Popup(SSLPinningPopup_Options);
				SSLPinningPopup.show();
			}
		},

		notificationBody: function (latestNotification) {
			document.querySelector("#dashboardPage #DashboardNotification").style.display = "block";
			document.querySelector("#dashboardPage #DashboardNotification i").classList = "";
			document.querySelector("#dashboardPage #DashboardNotification i").classList.add("icon");
			var iconName = latestNotification.Icon_Name.replace(/\s/g, '');
			document.querySelector("#dashboardPage #DashboardNotification i").classList.add(iconName);
			var title = (getApplicationLanguage() == 'en') ? latestNotification.Title_En : latestNotification.Title_Ar
					document.querySelector("#dashboardPage #DashboardNotification .NotificationTitle").innerHTML = title;
			var body = (getApplicationLanguage() == 'en') ? latestNotification.Body_En : latestNotification.Body_Ar;
			if (body.length > 120) {

				body = body.slice(0, 90) + "...";
			}
			document.querySelector("#dashboardPage #DashboardNotification .NotificationBody").innerHTML = body;
		},

		readConfiguration: function (latestNotification) {

			if (notificationsConfig && !isEmpty(dashboardPageViewInstance)) {
				var type = latestNotification.Type ? latestNotification.Type : "GenericInfo";
				type = type.replace(/\s/g, '');
				var currentType = notificationsConfig[type];
				if (currentType && !isEmpty(currentType)) {

					var tileBG = currentType.TileBackGroundColor ? currentType.TileBackGroundColor : "";
					var iconColor = currentType.IconColor ? currentType.IconColor : "";
					var borderColor = currentType.CricleBorderColor ? currentType.CricleBorderColor : "";
					var iconBG = currentType.IconBackGroundColor ? currentType.IconBackGroundColor : "";
					var textColor = currentType.TextColor ? currentType.TextColor : "";
					var notificationDate = latestNotification.NotificationDate ? latestNotification.NotificationDate : "";
					document.querySelector("#DashboardNotification").style.background = tileBG;
					/*Change close back ground depend on back ground tile*/
					document.querySelector("#DashboardNotification .icon").style.color = iconColor;
					document.querySelector("#DashboardNotification .icon").style.border = "1px solid " + borderColor;
					if (currentType.Radius)
						currentType.Radius ? document.querySelector("#DashboardNotification").style.borderRadius = "10px" : "";
					document.querySelector("#DashboardNotification .icon").style.background = iconBG;
					document.querySelector("#DashboardNotification .NotificationTitle").style.color = textColor;
					document.querySelector("#DashboardNotification .NotificationBody").style.color = textColor;
					document.querySelector("#CancelDashNotification").style.color = textColor;
					/*render notification date time*/
					var body = (getApplicationLanguage() == 'en') ? latestNotification.Body_En : latestNotification.Body_Ar;
					if ((type == "WhatsNew" || type == "RoadInfo") && notificationDate) {

						document.querySelector("#dashboardCont .NotificationMess").style.height = "90px";
						var releasedOn = type == "WhatsNew" ? localize("%shell.Notifications.ReleasedOn%") : "";
						document.querySelector("#notifDateTime").style.display = "block";

						document.querySelector("#notifDateTime i").classList.add("icon-calendar");
						document.querySelector("#notifDateTime i").style.color = textColor;
						document.querySelector("#notifDateTime i").style.background = tileBG;
						document.querySelector("#notifDateTime .NotificationTime").style.color = textColor;
						document.querySelector("#notifDateTime .NotificationTime").innerHTML = releasedOn + " " + notificationDate;
						document.querySelector("#DashboardNotification .NotificationBody").style.height = "50px";
					}
				}
				else {

					document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
				}
			}
		},

		whatsNewNotification: function () {
			var whatsNewObject = (Constants.APP_ID == "RTA_Drivers_And_Vehicles") ? RTA_Drivers_And_Vehicles_appConfig : RTA_Corporate_Services_appConfig;
			if (whatsNewObject) {
				var showNotification = false;
				var latestVersionDate = Utils.convertStringToDate(whatsNewObject.lastUpdated, "dd/MM/yyyy", "/");

				var lastSeensNotification = DataUtils.getLocalStorageData('LastSeenWhatsnewNotifications', "shell");
				if (lastSeensNotification) {

					var lastSeennotificationDate = new Date(lastSeensNotification);

					if (lastSeennotificationDate <= latestVersionDate)
						showNotification = true;
				}
				else if (latestVersionDate <= new Date()) /* it mean not cashed first time open app*/ {

					showNotification = true;
				}
				if (showNotification) {

					dashboardPageViewInstance.CurrentWhatsNew = true;
					var lang = getApplicationLanguage();
					var body = localize("%shell.Dashboard.WhatsNewBody%");
					var title = localize("%shell.Dashboard.WhatsNew%");
					var latestNotification = {
							"Body_En": body,
							"Body_Ar": body,
							"Title_En": title,
							"Icon_Name": "icon-whatsnew",
							"Title_Ar": title,
							"Type": "WhatsNew",
							"NotificationDate": whatsNewObject.lastUpdated
					}
					DataUtils.setLocalStorageData('LastSeenWhatsnewNotifications', new Date().toString(), true, "shell");
					document.querySelector("#notifDateTime").style.display = "none";
					dashboardPageViewInstance.notificationBody(latestNotification);
					dashboardPageViewInstance.readConfiguration(latestNotification);
					document.querySelector("#dashboardCont .NotificationMess").style.height = "75px";
					var whatsNewEvent = document.querySelector("#dashboardPage #DashboardNotification");
					if (whatsNewEvent)
						whatsNewEvent.addEventListener('touchend', function (e) {
							document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
							dashboardPageViewInstance.CurrentWhatsNew = false;// hide whats new ;
							if (e.target.id != "CancelDashNotification") {

								DataUtils.setLocalStorageData('FromWhatsNew', true, true, "shell");
								mobile.changePage("shell/about_app.html");
							}
						});
				}
			}

		},
		crisisAnnouncement:function(){
			try{
				DashboardModel.getCrisisAnnouncement(function(result){

					if(result){
						document.querySelector("#dashboardPage #DashboardBanner").style.display = "block";
						/*document.querySelector("#dashboardPage #DashboardNotification i").classList = "";
					document.querySelector("#dashboardPage #DashboardNotification i").classList.add("icon");*/
						var title = (getApplicationLanguage() == 'en') ? result.TITLE : result.TITLE_AR;
						document.querySelector("#dashboardPage #DashboardBanner .BannerTitle").innerHTML = title;
						var body = (getApplicationLanguage() == 'en') ? result.BODY : result.BODY_AR;
						if (body.length > 200) {

							body = body.slice(0, 200) + "...";
						}
						document.querySelector("#dashboardPage #DashboardBanner .bannerBody").innerHTML = body;
						var dateTime=result.EVENT_DATE?result.EVENT_DATE:"";
						document.querySelector("#dashboardPage #DashboardBanner #BannerEventDate").innerHTML = dateTime;

						bannerTwitter=result.TWITTERURL;
						 
						bannerExtenernal=(getApplicationLanguage() == 'en')?result.EXTRNALURL:result.EXTRNALURL_AR;

						document.querySelector("#dashboardPage #DashboardBanner #BannerTwitter").addEventListener('click', function (e) {
							e.preventDefault();
							//var bannerTwitter=e.target.twiterURL
							/*dashboardPageViewInstance.checkTwitterAvailability(function(available){
							if(available){
								var twitterWindow = window.open("https://twitter.com/", '_blank', 'location=no');
								twitterWindow.addEventListener('loadstart',  function(event) {
									alert("Current Event : "+ event.url);
								});
							}
							else{
								if(bannerTwitter)
									window.open(bannerTwitter, "_system")
							}	

						});*/
							if(bannerTwitter)
								window.open(bannerTwitter, "_system")

						})

						document.querySelector("#dashboardPage #DashboardBanner #BannerExternal").addEventListener('click', function (e) {
							e.preventDefault();
							//var bannerExtenernal=e.target.externalURL
							if(bannerExtenernal)
								window.open(bannerExtenernal, "_system")
						})

						document.querySelector("#dashboardPage #DashboardBanner #BannerCancel").addEventListener('click', function (e) {
							document.querySelector("#dashboardPage #DashboardBanner").style.display="none";
							DataUtils.setLocalStorageData('BannerClosed', JSON.stringify(true), true, "shell");
						})


					}
					else{
						document.querySelector("#dashboardPage #DashboardBanner").style.display = "none";
					}
				})

			} catch (e) { 
				console.log(e); 
				document.querySelector("#dashboardPage #DashboardBanner").style.display = "none";
			}
		},

		checkTwitterAvailability: function (callback) {
			try {
				var scheme;

				// Don't forget to add the org.apache.cordova.device plugin!
				if (device.platform === 'iOS') {
					scheme = 'twitter://';
				}
				else if (device.platform === 'Android') {
					scheme = 'com.twitter.android';
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

		checkVIPUser: function () {
			try {

				if (AuthenticationModel.isAuthenticated()) {

					UserProfileModel.isVIPUser(false, function (isVIPUser) {
						// is vip user 
						if (isVIPUser) {
							// check for vip notification 
							var userVIPNotification = DataUtils.getLocalStorageData('VIPUserNotifications', "shell");
							if (!userVIPNotification || (userVIPNotification && userVIPNotification != "true")) {
								dashboardPageViewInstance.CurrentWhatsNew = true; // to prevent any notification to show till hide this noti
								var lang = getApplicationLanguage();
								var body = localize("%shell.Dashboard.VIPNotification%");
								//var title=localize("%shell.Dashboard.WhatsNew%");
								var latestNotification = {
										"Body_En": body,
										"Body_Ar": body,
										"Title_En": null,
										"Icon_Name": "icon-vip",
										"Title_Ar": null,
										"Type": "VIPUser",
										"NotificationDate": null
								}
								document.querySelector("#notifDateTime").style.display = "none";
								dashboardPageViewInstance.notificationBody(latestNotification);
								dashboardPageViewInstance.readConfiguration(latestNotification);
								document.querySelector("#dashboardCont .NotificationMess").style.height = "90px";
								document.querySelector("#dashboardCont .NotificationMess .NotificationBody").style.fontSize = "14px";
								document.querySelector("#dashboardCont .NotificationMess .NotificationBody").style.top = "25px";
								var vipEvent = document.querySelector("#dashboardPage #DashboardNotification");
								if (vipEvent)
									vipEvent.onclick = function (event) {
									event.preventDefault()
									document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
									dashboardPageViewInstance.CurrentWhatsNew = false;// hide current notification ;
									DataUtils.setLocalStorageData('VIPUserNotifications', JSON.stringify(true), true, "shell");
									if (event.target.id != "CancelDashNotification") {
										DashboardModel.openEnquirePage();
										var userId = "";

										userId = userProfile && userProfile.Users[0] ? userProfile.Users[0].user_id : null;
										var currentApp = Constants.APP_ID;
										var appName = Constants.PORTAL_APP_IDs[currentApp];
										UserProfileModel.updateVIPUser(userId, appName);


									}
								};
							}




							// Add VIP Tile action
							document.getElementsByClassName("vipStuff")[0].style.display = "block";
							document.getElementsByClassName("vipStuff")[1].style.display = "block";

							document.querySelector(".vipEnquireBtn").onclick = function (event) {
								event.preventDefault();
								DashboardModel.openEnquirePage();
							}
						}
					});

				}
			} catch (e) { }
		},
		renderNotification: function (notificationList) {

			if (!dashboardPageViewInstance.CurrentWhatsNew) {

				if (notificationList) {

					if (document.querySelector("#notifDateTime")!=null)
						document.querySelector("#notifDateTime").style.display = "none";
					var latestNotification = notificationList;
					/*check latest item to show it in dashboard and not deleted*/
					if (latestNotification && (latestNotification.IsShowDB == false || latestNotification.hasOwnProperty("IsShowDB") == false) && (!latestNotification.hasOwnProperty("IsDeleted") || latestNotification.IsDeleted == false)) {
						dashboardPageViewInstance.notificationBody(latestNotification);
						dashboardPageViewInstance.readConfiguration(latestNotification);
						var notificationElem = document.getElementById("notificationBtn");
						if (notificationElem && notificationElem.classList.contains("icon-notifications")) {
							notificationElem.classList.remove("icon-notifications")
							notificationElem.classList.add("icon-notifications-new")
						}
						/*hide notification tile and only whats new it will be open what is new */
						document.querySelector("#dashboardPage #DashboardNotification").addEventListener('click', function (e) {
							document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
							/*Swipe icon of notification*/
							var notificationElem = document.getElementById("notificationBtn");
							if (notificationElem && notificationElem.classList.contains("icon-notifications-new")) {

								notificationElem.classList.remove("icon-notifications-new")
								notificationElem.classList.add("icon-notifications");

							}

							var notificationList = DataUtils.getLocalStorageData('userNotifications', "shell");
							var currentElement;
							if (notificationList && notificationList.length > 0) {

								var notifications = JSON.parse(notificationList);
								currentElement = notifications[0];
								notifications[0].IsShowDB = true;
								DataUtils.setLocalStorageData('userNotifications', JSON.stringify(notifications), true, "shell");
							}
							if (e.target.id != "CancelDashNotification") {

								if (currentElement && currentElement.Type == "WhatsNew")
									mobile.changePage("shell/about_app.html");
								else
									mobile.changePage("shell/notifications.html");
							}
						});
					}
					else {

						var elem = document.querySelector("#dashboardPage #DashboardNotification");
						if (elem)
							document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
					}
				}
			}
		},
		callNotification: function (payload) {
			dashboardPageViewInstance.renderNotification(payload);
			//	NotificationsModel.getLast30DaysNotifications(dashboardPageViewInstance.renderNotification);
		},
		onPageShow: function () {
			try {
				//mahmoud 
				/*calling notification from backend*/
				var bannerClosed=DataUtils.getLocalStorageData('BannerClosed', "shell");
				if(bannerClosed&&bannerClosed=="true"){
					dashboardPageViewInstance.whatsNewNotification();
				}else{
					dashboardPageViewInstance.crisisAnnouncement(); 
				}
				if (AuthenticationModel.isAuthenticated())
					document.querySelector("#refreshInfo").style.display = "block";
				else {

					document.querySelector("#refreshInfo").style.display = "none";
				}

				try {
					if (AuthenticationModel.isAuthenticated()) {
						document.querySelector("#dashboardPage #favhintCont").innerText = localize("%shell.dashboard.Fav.tapandswipe%");
					}
					else {
						document.querySelector("#dashboardPage #favhintCont").innerText = localize("%shell.dashboard.Fav.Guesttapandswipe%");
					}
					if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
						dashboardPageViewInstance.checkVIPUser();
					}



					var generalNotification = localStorage.getItem("shellActiveGeneralNotification");
					generalNotification = generalNotification != null ? JSON.parse(generalNotification) : false;
					/*if (generalNotification == true)// Check is enable Receive GenerNotifications 
						NotificationsModel.getLast30DaysNotifications(dashboardPageViewInstance.renderNotification);*/

				}
				catch (e) {
					/* handle any error that will happen in notification */


					var elem = document.querySelector("#dashboardPage #DashboardNotification");
					if (elem)
						document.querySelector("#dashboardPage #DashboardNotification").style.display = "none";
				}
				this.handleSSLPinning();
				window.appInitialized = true;
				switch (Constants.APP_ID) {
				case "RTA_Public_Transport":
					document.getElementById("tilesTitleDash").innerHTML = localize("%shell.dashboard.pta.title%");
					break;
				case "RTA_Corporate_Services":
					document.getElementById("tilesTitleDash").innerHTML = localize("%shell.dashboard.corporate.title%");
					document.getElementById("welLoginButton").innerHTML = localize("%shell.login.title%");
					break;
				case "RTA_Drivers_And_Vehicles":


					document.getElementById("tilesTitleDash").innerHTML = localize("%shell.dashboard.dv.title%");
					break;
				}
				if (Constants.APP_ID != "RTA_Corporate_Services") OTPModel.checkMobileVerification();
				document.querySelector("#dashboardPage .tileTitle .icon-personalise").onclick = document.querySelector("#dashboardPage #editDashbtn").onclick = function (event) {
					event.preventDefault();
					window.PersonalizeData = [];
					for (var i = 0; i < DashboardConfig.tiles.length; i++) {
						var item = DashboardConfig.tiles[i];
						item.el = DashboardViewModel[DashboardConfig.tiles[i].name].el.cloneNode(true);
						window.PersonalizeData.push(item);
					}
					mobile.changePage("shell/personalize.html");
				}
				var isVipUser = UserProfileModel.isVIPUserLocalStorage();
				document.getElementById('serviceCount').innerHTML = servicesCount(isVipUser);
				var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
				if (userProfile && AuthenticationModel.isAuthenticated() /*&& AuthenticationModel.isAuthenticatedWithServer()*/) {
					userProfile = JSON.parse(userProfile);
					if (userProfile && userProfile.Users[0]) {
						DataUtils.setLocalStorageData('isLoggedIn', "true", false, 'shell');
					}
					var pullToRefresh = DashboardViewModel.getPullToRefresh();
				} else {
					DataUtils.setLocalStorageData('isLoggedIn', "false", false, 'shell');
				}
				var dashIndex = window.DashboardIndex || "1";
				window.boradSlide = new BoardSlider(dashIndex);
				boradSlide.onSlide = function (index) {
					switch (index) {
					case 0:
						window.DashboardIndex = "0";
						appFooter.setFooterActiveItem('Favourites');
						break;
					case 1:
						window.DashboardIndex = "1";
						appFooter.setFooterActiveItem('Dashboard');
						break;
					case 2:
						window.DashboardIndex = "2";
						appFooter.setFooterActiveItem('Dashboard');
						break;
					}
				}
				if (DashboardConfig.sliderTemplates.left) {
					var leftItemEl = document.getElementById(DashboardConfig.sliderTemplates.left.template).cloneNode(true);
					document.querySelector("#welcome .scroller").insertBefore(leftItemEl, document.querySelector("#welcomeItem"));
					DashboardViewModel[DashboardConfig.sliderTemplates.left.controller](DataUtils, AuthenticationModel);
				}
				if (DashboardConfig.sliderTemplates.right) {
					var rightItemEl = document.getElementById(DashboardConfig.sliderTemplates.right.template).cloneNode(true);
					document.querySelector("#welcome .scroller").appendChild(rightItemEl);
					DashboardViewModel[DashboardConfig.sliderTemplates.right.controller](DataUtils, AuthenticationModel);
				}
				// read loyalty from Local storage and it must logged and dubia drive app
				if (AuthenticationModel.isAuthenticated() && Constants.APP_ID == "RTA_Drivers_And_Vehicles" && Constants.showLoyalty) {
					//if(true){ // for testing only











					document.getElementById("loyaltyId").style.display = "block";
					var loyatyObject = DataUtils.getLocalStorageData("niLoyalty", "shell");
					if (loyatyObject) {
						var balanceObject = JSON.parse(loyatyObject)




						dashboardPageViewInstance.addLoyaltyEvents(balanceObject);
						//dashboardPageViewInstance.loadNILoyalty();
					}
					else {
						dashboardPageViewInstance.addLoyaltyEvents(null);

					}






				}
				dashboardPageViewInstance.loadGreetingTile();
				dashboardPageViewInstance.addEventListeners();

				document.dispatchEvent(pageHomeOnCreate);
				DashboardViewModel.initTilesObjects();
				DashboardConfig.tiles = DashboardConfig.tiles.sort(function (a, b) {
					return a.order - b.order;
				});
				var tileIndex = 0;
				var direction = (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				for (var i = 0; i < DashboardConfig.tiles.length; i++) {
					if (DashboardConfig.tiles[i].enabled) {
						DashboardViewModel[DashboardConfig.tiles[i].name].draw(direction, tileIndex);
						tileIndex++;
					}
				}
				var tiles = document.querySelectorAll(".dashboardTile");
				for (var i = tiles.length - 3; i < tiles.length; i++) {
					tiles[i].classList.add('dashboardTilechild' + i);
				}
				/*async to favourites*/
				setTimeout(function () {
					dashboardPageViewInstance.bindServices();
					dashboardPageViewInstance.bindFavorites();
					dashboardPageViewInstance.updateGreeting();
					setTimeout(function () {
						document.getElementById("header").style.webkitTransform = "translate3d(0,0,0)";
						document.getElementById("footer").style.webkitTransform = "translate3d(0,0,0)";
						if (!window.dashboardInitialized) {
							window.dashboardInitialized = true;
							setTimeout(function () {
								dashboardPageViewInstance.activateFavorites();
								dashboardPageViewInstance.activateDashboard();
								dashboardPageViewInstance.activateServices();
							}, 600);
						}
					}, 300);
					if (window.dashboardInitialized) {
						document.getElementsByClassName("sliderHead")[0].style.webkitTransform = "translate3d(0,0,0)";
						dashboardPageViewInstance.activateFavorites();
						dashboardPageViewInstance.activateDashboard();
						dashboardPageViewInstance.activateServices();
					}
				}, 400);
				var timer = null;
				document.getElementById("serviceSearchInput").oninput = function (e) {
					if (e) e.preventDefault();
					clearTimeout(timer);
					var val = this.value;
					timer = setTimeout(function () {
						dashboardPageViewInstance.searchServices(val);
					}, 1000)
				}
				if (Constants.APP_ID == "RTA_Drivers_And_Vehicles" && document.querySelector("#dashboardPage #myDocsTile")) {
					document.querySelector("#dashboardPage #myDocsTile").addEventListener("click", function (event) {
						mobile.changePage("shell/mstore.html");
					});
				}

			} catch (e) {
				console.log(e);
			}
		},
		searchServicesLogic: function (searchText) {
			var searchResult = {};

			var isVipUser = UserProfileModel.isVIPUserLocalStorage();
			var isloggedIn = AuthenticationModel.isAuthenticated();


			for (var i = 0; i < ServiceCategories.length; i++) {
				var cat = {
						catIndex: null,
						services: []
				};
				if (ServiceCategories[i].CategoryNameEn.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || ServiceCategories[i].CategoryNameAr.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
					for (var j = 0; j < ServiceCategories[i].CategoryServices.length; j++) {

						cat.catIndex = i;
						cat.services.push(j);
					}
				} else {
					for (var j = 0; j < ServiceCategories[i].CategoryServices.length; j++) {
						//Skip Search if not vip and not loged 
						var isVIPService = ServiceCategories[i].CategoryServices[j].VIPService;
						if ((!isloggedIn && isVIPService == true) || (isloggedIn && isVIPService == true && !isVipUser)) {
							//skip VIP Service
							continue;
						}
						if (ServiceCategories[i].CategoryServices[j].ServiceNameEn.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || ServiceCategories[i].CategoryServices[j].ServiceNameAr.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
							cat.catIndex = i;
							cat.services.push(j);
						}
					}
				}
				if (cat.catIndex != null) {
					searchResult[cat.catIndex] = cat.services;
				}
			}
			console.log(searchResult);
			return searchResult;
		},
		searchServices: function (searchText) {
			dashboardPageViewInstance.collapsible.close();
			var visibleHeads = [];
			var result = dashboardPageViewInstance.searchServicesLogic(searchText);
			var heads = document.querySelectorAll(".collapseCont .collapseHead");
			var bodies = document.querySelectorAll(".collapseCont .collapseBody");
			for (var i = 0; i < bodies.length; i++) {
				bodies[i].items = bodies[i].querySelectorAll(".item");
			}
			for (var i = 0; i < bodies.length; i++) {
				if (result[i] != undefined) {
					heads[i].style.opacity = "1";
					heads[i].style.pointerEvents = "all";
					heads[i].visible = true;
					visibleHeads.push(heads[i]);
					var serviceCount = 0;
					for (var j = 0; j < bodies[i].items.length; j++) {
						var currentSubCatIndex = parseInt(bodies[i].items[j].getAttribute("subcat"));
						if (result[i].indexOf(currentSubCatIndex) != -1) {
							serviceCount++;
							bodies[i].items[j].style.display = "block";
							bodies[i].style.opacity = "1";
						} else {
							bodies[i].items[j].style.display = "none";
						}
					}
					heads[i].querySelector(".count").textContent = "(" + serviceCount + ")";
				} else {
					heads[i].visible = false;
					heads[i].style.opacity = "0";
					heads[i].style.pointerEvents = "none";
					bodies[i].style.opacity = "0";
				}
			}
			setTimeout(function () {
				dashboardPageViewInstance.collapsible.updateCollapsible();
				if (Object.keys(result).length == 0) {
					document.querySelector("#noServiceResult").style.display = "block";
				} else {
					document.querySelector("#noServiceResult").style.display = "none";
				}
			})
		},
		updateGreeting: function () {
			try {
				var currentHour = new Date().getHours();
				if (currentHour >= 5 && currentHour < 12) {
					document.querySelector("#welcomeItem .blackCover").style.background = "#ffdb00";
					document.querySelector("#welcomeItem .greeting").innerText = localize("%shell.dashboard.greetings.goodmorning%");
				} else if (currentHour >= 12 && currentHour < 17) {
					document.querySelector("#welcomeItem .blackCover").style.background = "orange";
					document.querySelector("#welcomeItem .greeting").innerText = localize("%shell.dashboard.greetings.goodafternoon%");
				} else if (currentHour >= 17 && currentHour < 21) {
					document.querySelector("#welcomeItem .blackCover").style.background = "#3b7a8b";
					document.querySelector("#welcomeItem .greeting").innerText = localize("%shell.dashboard.greetings.goodevening%");
				} else if (currentHour >= 21 || currentHour < 5) {
					document.querySelector("#welcomeItem .blackCover").style.background = "#171b8f";
					document.querySelector("#welcomeItem .greeting").innerText = localize("%shell.dashboard.greetings.goodnight%");
				}
			} catch (e) { }
		},
		activateDashboard: function () {
			try {
				var welcomeItemsSlider;
				if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
					welcomeItemsSlider = new ItemsSlider("welcome", 0);
				} else {
					welcomeItemsSlider = new ItemsSlider("welcome", 0);
				}

				var tiles = document.querySelectorAll(".dashboardTile");
				for (var i = 0; i < tiles.length; i++) {
					tiles[i].classList.add('sensitiveTransform');
				}
				setTimeout(function () {
					var index = 0;
					var getClassName = function (classList) {
						var _class = '';
						for (var i = 0; i < classList.length; i++) {
							if (classList[i].contains('dashboardTilechild')) _class = classList[i];
						}
						return _class;
					}
					var myinterval = setInterval(function () {
						if (index >= tiles.length) clearInterval(myinterval);
						if (tiles[index] && getClassName(tiles[index].classList) != '') {
							tiles[index].classList.remove(getClassName(tiles[index].classList));
							tiles[index].classList.remove('sensitiveTransform');
							tiles[index].classList.remove('outTransform');
						}
						index++;
					}, 400);
				}, 400);
				document.getElementById("vipTileTitle").style.webkitTransform = "translate3d(0, 0, 0)";
				document.getElementById("tilesTitle").style.webkitTransform = "";
				setTimeout(function () {
					DashboardViewModel.initializeTilesState();
				}, 1200);
			} catch (e) { }
		},
		activateFavorites: function () { },
		activateServices: function () {
			try {
				if (dashboardPageViewInstance.servicesActive) return;
				dashboardPageViewInstance.servicesActive = true;
				document.querySelector("#servicesCont .searchCont").style.cssText = "";
				document.querySelector("#servicesCont .servicesCount").style.cssText = "";
				var heads = document.querySelectorAll(".collapseCont .collapseHead");
				var delay = 150;
				for (var i = 0; i < heads.length; i++) {
					heads[i].style.transitionDuration = "300ms";
					heads[i].style.transitionDelay = delay + "ms";
					delay += 150;
				}
				document.querySelector("#servicesCont .searchCont").style.webkitTransform = "translate3d(0,0,0)";
				document.querySelector("#servicesCont .servicesCount").style.webkitTransform = "translate3d(0,0,0)";
				for (var j = 0; j < heads.length; j++) {
					heads[j].style.webkitTransform = "translate3d(0,0,0)";
				}
				setTimeout(function () {
					for (var k = 0; k < heads.length; k++) {
						heads[k].style.webkitTransform = "";
						heads[k].style.transitionDelay = "";
					}
					if (document.querySelector(".servicesScroller")) document.querySelector(".servicesScroller").style.pointerEvents = "all";
				}, (heads.length * 300) - (heads.length * 150));
			} catch (e) { }
		},
		generateDDServicesCollapsable: function (item) {
			if (item.toLowerCase().contains('driver')) {
				return 'Drivers';
			} else if (item.toLowerCase().contains('parking')) {
				return 'Parking';
			} else if (item.toLowerCase().contains('vehicle')) {
				return 'My-Vehicles';
			} else if (item.toLowerCase().contains('salik')) {
				return 'Salik';
			} else if (item.toLowerCase().contains('plate')) {
				return 'Plates';
			} else if (item.toLowerCase().contains('permit')) {
				return 'Parking-Permits';
			} else if (item.toLowerCase().contains('fines')) {
				return 'My-Fines';
			} else if (item.toLowerCase().contains('docs')) {
				return 'Docs-Validation';
			}
			return "";
		},
		bindServices: function () {
			try {
				var servicesCount = 0;
				var delay = 150;
				var rebind = false;
				if (dashboardPageViewInstance.collapsible) {
					dashboardPageViewInstance.collapsible.close()
					rebind = true;
				}
				document.querySelector(".collapseCont").innerHTML = '';

				for (var i = 0; i < ServiceCategories.length; i++) {
					var head = document.querySelector(".collapseHead").cloneNode(true);
					var body = document.querySelector(".collapseBody").cloneNode(true);
					if (rebind == false) {
						head.style.transitionDelay = delay + "ms";
						head.style.webkitTransform = "translate3d(120%,0,0)";
					}

					if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
						try {
							var newClass = this.generateDDServicesCollapsable(ServiceCategories[i].TileNameEn.replace(" ", "-")) + "-Head"
							head.classList.add(newClass);
							var newClass2 = this.generateDDServicesCollapsable(ServiceCategories[i].TileNameEn.replace(" ", "-")) + "-Body"
							body.classList.add(newClass2);
						} catch (e) { }
					}
					delay += 150;
					head.querySelector("i").className = "icon " + ServiceCategories[i].Icon;

					if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
						head.querySelector("i").style.color = ServiceCategories[i].Color;
						head.querySelector(".serviceTitle").style.color = ServiceCategories[i].Color;
					}

					if (getApplicationLanguage() == "en") {
						head.querySelector(".serviceTitle").innerHTML = ServiceCategories[i].CategoryNameEn;
					} else {
						head.querySelector(".serviceTitle").innerHTML = ServiceCategories[i].CategoryNameAr;
					}

					if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
						head.querySelector(".count").style.color = ServiceCategories[i].Color;
					}
					var counterHeader= ServiceCategories[i].CategoryServices.length;
					head.querySelector(".count").innerText = "(" + counterHeader + ")";
					var subText = "";
					for (var k = 0; k < ServiceCategories[i].CategoryServices.length; k++) {
						servicesCount++;
						var isVipUser = UserProfileModel.isVIPUserLocalStorage();
						var isloggedIn = AuthenticationModel.isAuthenticated();
						var isVIPService = ServiceCategories[i].CategoryServices[k].VIPService;
						if ((!isloggedIn && isVIPService == true) || (isloggedIn && isVIPService == true && !isVipUser)) {
							//skip VIP Service
							var counterVIP=counterHeader-1;
							servicesCount--;
							head.querySelector(".count").innerText = "(" + counterVIP + ")";
							continue;
						}
						if (getApplicationLanguage() == "en") {
							if (k < ServiceCategories[i].CategoryServices.length - 1) {
								subText += ServiceCategories[i].CategoryServices[k].ServiceNameEn + ", ";
							} else {
								subText += ServiceCategories[i].CategoryServices[k].ServiceNameEn;
							}
						} else {
							if (k < ServiceCategories[i].CategoryServices.length - 1) {
								subText += ServiceCategories[i].CategoryServices[k].ServiceNameAr + ", ";
							} else {
								subText += ServiceCategories[i].CategoryServices[k].ServiceNameAr;
							}
						}
						var itemText = null;
						if (getApplicationLanguage() == "en") {
							itemText = ServiceCategories[i].CategoryServices[k].ServiceNameEn;
						} else {
							itemText = ServiceCategories[i].CategoryServices[k].ServiceNameAr;
						}
						var item = document.createElement("div");
						item.classList.add("item");
						item.innerHTML = itemText;
						var allowDivClick = true;
						var isLoginRequired = ServiceCategories[i].CategoryServices[k].requireLogin;
						var isLinkingRequired = ServiceCategories[i].CategoryServices[k].requireLinking;




						if (isLoginRequired == true && !isloggedIn) {
							allowDivClick = false;
							item.innerText = itemText;
							item.classList.add("require-login");
							var loginButton = document.createElement("div");
							loginButton.classList.add("loginBtn-servicelist");
							loginButton.classList.add("waves-effect");
							loginButton.innerText = localize("%shell.login.title%");
							var lockIcon = document.createElement("i");
							lockIcon.classList.add("icon");
							lockIcon.classList.add("icon-lock");
							loginButton.appendChild(lockIcon);
							loginButton.onclick = function (e) {
								var loginOptions = {
										scenario: "changePage",
										url: e.target.parentElement.url
								};
								window.LoginViewControl.show(loginOptions);
							}
							item.appendChild(loginButton);
						} else if (isloggedIn && isLinkingRequired == true) {
							allowDivClick = false;
							item.innerText = itemText;
							item.classList.add("require-linking");
							var linkButton = document.createElement("div");
							linkButton.classList.add("linkingBtn-servicelist");
							linkButton.classList.add("waves-effect");
							linkButton.innerText = localize("%shell.myAccount.LinkSalikAccount%");
							var lockIcon = document.createElement("i");
							lockIcon.classList.add("icon");
							lockIcon.classList.add("icon-lock");
							linkButton.appendChild(lockIcon);
							linkButton.onclick = function (e) {
								document.dispatchEvent(linkActionButton);
							}
							item.appendChild(linkButton);
						}
						if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
							item.style.color = ServiceCategories[i].Color;
						}
						item.url = ServiceCategories[i].CategoryServices[k].ServicePageUrl;
						item.data = ServiceCategories[i].CategoryServices[k];
						item.setAttribute("cat", i);
						item.setAttribute("subcat", k);

						if (allowDivClick == true) {

//							var isVIPService =favCategories[i].CategoryServices[j].VIPService;

							if(isVIPService){
								item.onclick = function() {
									var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
									_DVDashboardModel.openEnquirePage();
								}
							}else {
								item.onclick = function(e) {
									mobile.changePage(e.currentTarget.url);
								}
							}
//							item.onclick = function (e) {
//							mobile.changePage(e.currentTarget.url);
//							}
						}
						body.appendChild(item);

					}
					head.querySelector(".subCats").innerHTML = subText;


					document.querySelector(".collapseCont").appendChild(head);
					document.querySelector(".collapseCont").appendChild(body);
				}
				if (getApplicationLanguage() == "en") {
					document.getElementsByClassName("servicesCount")[0].innerText = servicesCount + " services in total";
				} else {
					document.getElementsByClassName("servicesCount")[0].innerText = servicesCount + " خدمة ";
				}
				setTimeout(function () {
					dashboardPageViewInstance.collapsible = new Collapsible(document.querySelector(".collapseCont"));
				});
			} catch (e) { }
		},
		bindFavorites: function () {
			try {
				GroupingModel.getuserFavoritServices(function (userFavoritServicesList) {
					if (Object.keys(userFavoritServicesList).length > 0) {
						document.querySelector("#favScroller").style.display = "block";
						document.querySelector("#noFavorites").style.display = "none";
						var favCategories = [];
						for (var j = 0; j < ServiceCategories.length; j++) {
							var CategoryServices = [];
							for (var k = 0; k < ServiceCategories[j].CategoryServices.length; k++) {
								for (var l in userFavoritServicesList) {
									if (ServiceCategories[j].CategoryServices[k].ServiceId == l) {
										CategoryServices.push(ServiceCategories[j].CategoryServices[k]);
									}
								}
							}
							if (CategoryServices.length > 0) {
								var category = clone(ServiceCategories[j]);
								category.CategoryServices = CategoryServices;
								favCategories.push(category)
							}
						}
						for (var i = 0; i < favCategories.length; i++) {
							var serviceCont = document.querySelector("#templates .serviceCont").cloneNode(true);
							serviceCont.style.color = favCategories[i].Color;
							serviceCont.querySelector(".serviceIcon").className = "serviceIcon " + favCategories[i].Icon;
							if (getApplicationLanguage() == "en") {
								serviceCont.querySelector(".favServiceTitle").innerText = favCategories[i].CategoryNameEn;
							} else {
								serviceCont.querySelector(".favServiceTitle").innerText = favCategories[i].CategoryNameAr;
							}
							for (var j = 0; j < favCategories[i].CategoryServices.length; j++) {
								var favService = document.querySelector("#templates .favService").cloneNode(true);
								if (getApplicationLanguage() == "en") {
									favService.querySelector(".favServiceName").innerHTML = favCategories[i].CategoryServices[j].ServiceNameEn;
								} else {
									favService.querySelector(".favServiceName").innerHTML = favCategories[i].CategoryServices[j].ServiceNameAr;
								}
								favService.url = favCategories[i].CategoryServices[j].ServicePageUrl;



								var isVIPService =favCategories[i].CategoryServices[j].VIPService;

								if(isVIPService){
									favService.onclick = function() {
										var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
										_DVDashboardModel.openEnquirePage();
									}
								}else {
									favService.onclick = function(e) {
										mobile.changePage(e.currentTarget.url);
									}
								}
//								favService.onclick = function (e) {
//								mobile.changePage(e.currentTarget.url);
//								}
								serviceCont.querySelector(".favServicesCont").appendChild(favService);
							}
							document.querySelector("#favScroller").appendChild(serviceCont);
						}
					} else {
						document.querySelector("#favScroller").style.display = "none";
						document.querySelector("#noFavorites").style.display = "block";
					}
				});
			} catch (e) { }
		},
		loadGreetingTile: function () {
			var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
			if (userProfile && AuthenticationModel.isAuthenticated() /*&& AuthenticationModel.isAuthenticatedWithServer()*/) {
				userProfile = JSON.parse(userProfile);
				if (userProfile && userProfile.Users[0]) {
					var userProfileImage = DataUtils.getLocalStorageData("userprofileImg" + userProfile.Users[0].user_id, "shell");
					if (!isUndefinedOrNullOrBlank(userProfileImage)) {
						document.getElementById('userprofileImgDash').setAttribute('src', userProfileImage);
						$("#userprofileImgDash").show();
						$("#dummyprofileImg").hide();
					}
					var username = userProfile.Users[0].first_name_en;
					var welcomeItem = document.getElementById("welcomeItem");
					welcomeItem.querySelectorAll(".greeting")[0].classList.add('login-greeting');
					welcomeItem.querySelectorAll(".greeting")[1].classList.add('login-greeting');
					document.getElementById("welUsername").innerText = username;
					$('.welUsername').show();
					$('#driverScore').show();
					$('#welLoginButton').hide();
					document.getElementById("welcomeItem").onclick = function (e) {
						e.preventDefault();
						e.stopPropagation();
						/*mobile.changePage("shell/profile.html");*/
						Utils.loadMyAccountPage();
					}
					return;
				}
			}
			document.getElementById("welUsername").innerText = "";
			$('.welUsername').hide();
			$('#driverScore').hide();
			$('#welLoginButton').show();
		},
		addLoyaltyEvents: function (loyalty, callback) {
			document.querySelector("#loyaltyId .loyaltyLoader").style.display = "none";

			if (loyalty) {

				if (loyalty.isRegistered)// joined 
				{
					document.getElementById("loyaltyBalanceId").innerHTML = "<span>" + localize("%shell.dashboard.myPoints%") + "</span><i>" + Number(loyalty.amount) + "</i>";

					document.getElementById("loyaltyId").onclick = function (e) {
						e.stopPropagation();
						// user joined the program
						var loyaltyPopup = new Popup("loyaltyPopup");
						loyaltyPopup.show();
					}
				}
				else {
					document.getElementById("loyaltyBalanceId").innerHTML = "<span class='enrollSpan'>" + localize("%shell.dashboard.EnrollNow%") + "</span>";
					document.getElementById("loyaltyId").onclick = function (e) {
						e.stopPropagation();

						var loyaltyEnrolPopup = new Popup("loyaltyEnrolPopup");

						loyaltyEnrolPopup.show();
					}
				}
			}
			else {
				document.getElementById("loyaltyBalanceId").innerHTML = localize("%shell.dashboard.loyaltyUnavailable%");
				document.getElementById("loyaltyId").onclick = function (e) {
					e.stopPropagation();

					var loyaltyNotAvailablePopup = new Popup("loyaltyNotAvailablePopup");
					loyaltyNotAvailablePopup.show();
				}

			}
			if (callback) callback();// stop refresh loader
		},
		loadNILoyalty: function (loaderCallback) {
			if (AuthenticationModel.isAuthenticated()) {
				//if(true){ // for testing only
				document.getElementById("loyaltyId").style.display = "block";
				document.querySelector("#loyaltyId .loyaltyLoader").style.display = "block";
				NILoyaltyModel.getLoyalityBalance(dashboardPageViewInstance.addLoyaltyEvents, loaderCallback)
			}
			else { // user is not logged in
				document.getElementById("loyaltyId").style.display = "none";
			}
		},

		addEventListeners: function () {
			$("#quickCalls #PoliceAmbulance span").bind("click", function (e) {
				e.preventDefault();
				window.open("tel:999", '_system');
			});
			$("#quickCalls #FireDepartement span").bind("click", function (e) {
				e.preventDefault();
				window.open("tel:997", '_system');
			});
			$("#quickCalls #RoadServices span").bind("click", function (e) {
				e.preventDefault();
				window.open("tel:80088088", '_system');
			});
			$('.servicesSearchTile').bind('click', function () {
				boradSlide.changeIndex(2);
			});
			var loginRegisterBtns = document.querySelectorAll("#dashboardPage .loginButton");

			for (var i = 0; i < loginRegisterBtns.length; i++) {
				// show login popup
				loginRegisterBtns[i].onclick = function () {
					window.LoginViewControl.show();
				};

				/*switch (Constants.APP_ID) {
					case "RTA_Public_Transport":
						{
							loginRegisterBtns[i].onclick = function () {
								var loginRegisterPopup = new Popup("loginRegisterPopup");
								loginRegisterPopup.show();
							}
						}
						break;
					case "RTA_Corporate_Services":
						{

							loginRegisterBtns[i].onclick = function () {
								window.LoginViewControl.show();
							}
						}
						break;
					case "RTA_Drivers_And_Vehicles":
						{
							loginRegisterBtns[i].onclick = function () {

								var loginRegisterPopup = new Popup("loginRegisterPopup");
								loginRegisterPopup.show();
							}
							break;
						}

				}*/


			}
		},
		dispose: function () {
			for (var i = 0; i < DashboardConfig.tiles.length; i++) {
				DashboardViewModel[DashboardConfig.tiles[i].name] = null;
			}
			PageView.prototype.dispose.call(this);
		},
	});
//	Returns the View class
	return DashboardPageView;
});

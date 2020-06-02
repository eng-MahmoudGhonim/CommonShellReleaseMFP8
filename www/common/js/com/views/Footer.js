define(["com/models/Constants",
        "com/utils/Utils",
        "com/utils/DataUtils",
        "com/models/shell/UserProfileModel",
        "com/models/shell/AuthenticationModel",
        "com/models/shell/HapinessMeterRatingModel",
        "com/models/drivers_and_vehicles/DVDashboardModel"

        ], function(Constants, Utils, DataUtils,UserProfileModel, AuthenticationModel , HapinessMeterRatingModel,DVDashboardModel) {

	// Extends Backbone.View
	var Footer = Backbone.View.extend( {

		initialize: function(options) 
		{
			appFooter = this ; 
			this.render(options.parent);
			this.currentSelectedFooterItem="Dashboard";

		},
		handleFooterActivation:function(hash,activate){
			if (activate==true){
				if (location.hash.contains("shell/help_center.html")){
					appFooter.setFooterActiveItem('HelpCenter');
				}else if (location.hash.contains("shell/dashboard.html")){
					if(window.DashboardIndex == 0){
						appFooter.setFooterActiveItem('Favourites');
					}else if(window.DashboardIndex == 1){
						appFooter.setFooterActiveItem('Dashboard');
					}else if(window.DashboardIndex == 2){
						appFooter.setFooterActiveItem('Dashboard');
					}else{
						appFooter.setFooterActiveItem('Dashboard');
					}
				}else if (location.hash.contains("shell/mstore.html")){
					appFooter.setFooterActiveItem('DriveMode');
				}else if (location.hash.contains(Constants.MY_APPS_LINK)){
					appFooter.setFooterActiveItem('MyApps');	
				}else {
					appFooter.setFooterActiveItem();
				}
			}else {
				if (!hash.contains("shell/help_center.html")
						&&!hash.contains("shell/dashboard.html")
						&&!hash.contains("shell/mstore.html")
						&&!hash.contains(Constants.MY_APPS_LINK)){
					appFooter.setFooterActiveItem();
				}
			}

		},
		setFooterActiveItem:function (currentItem){
			var language = getApplicationLanguage();
			if (language == "en"){
				switch (currentItem){
				case "Dashboard":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(0,0,0)";
					break;
				case "Favourites":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(100%,0,0)";
					break;
				case "HelpCenter":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(200%,0,0)";
					break;
				case "DriveMode":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(300%,0,0)";
					break;
				case "MyApps":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(300%,0,0)";
					break;
				case "HapinessMeter":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(400%,0,0)";
					break;
				default : 
					document.getElementById("activeBar").style.visibility = "hidden";
				break;
				}

			}else {

				switch (currentItem){
				case "Dashboard":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(0,0,0)";
					break;
				case "Favourites":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(-100%,0,0)";
					break;
				case "HelpCenter":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(-200%,0,0)";
					break;
				case "DriveMode":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(-300%,0,0)";
					break;
				case "MyApps":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(-300%,0,0)";
					break;
				case "HapinessMeter":
					document.getElementById("activeBar").style.visibility = "visible";
					document.getElementById("activeBar").style.webkitTransform = "translate3d(-400%,0,0)";
					break;
				default : 
					document.getElementById("activeBar").style.visibility = "hidden";
				break;
				}
			}

		},
		openDashboard:function(event){
			event.preventDefault();
			appFooter.setFooterActiveItem("Dashboard");
			if(window.location.hash.indexOf("shell/dashboard.html")!=-1){
				boradSlide.changeIndex(1);
			}else{
				window.DashboardIndex = "1";
				mobile.changePage("shell/dashboard.html");	
			}
		},
		openFavourites:function(event){
			event.preventDefault();
			appFooter.setFooterActiveItem("Favourites");
			if(window.location.hash.indexOf("shell/dashboard.html")!=-1){
				boradSlide.changeIndex(0);
			}else{
				window.DashboardIndex = "0";
				mobile.changePage("shell/dashboard.html");	
			}

		},
		openHelpCenter:function(event){
			event.preventDefault();
			if(this.className.indexOf("active") == -1){
				appFooter.setFooterActiveItem("HelpCenter");
				mobile.changePage("shell/help_center.html");
//				if (!navigator.onLine){
//					showInternetProblemPopup();
//					return;
//				}
//				try { 
//					var mChatOpenPopup_Options = {
//							popupId: "mChatOpenPopup",
//							title: localize("%shell.menu.mchat%"),
//							content: localize("%shell.popup.mchat.message%"),
//							primaryBtnText: localize("%shell.dialog.button.ok%"),
//							primaryBtnCallBack: appFooter.openChatPage,
//							primaryBtnDisabled: false,
//							secondaryBtnText: localize("%shell.label.cancel%"),
//							secondaryBtnCallBack: null,
//							secondaryBtnVisible: true,
//							secondaryBtnDisabled: false,
//							hideOnPrimaryClick: true,
//							hideOnSecondaryClick: true,
//							aroundClickable: true,
//							onAroundClick: null
//					}
//
//					var mChatOpenPopup = new Popup(mChatOpenPopup_Options);
//					mChatOpenPopup.show();
//				}catch(e){$('.ui-loader').hide();}

			}
		},
		openDriveMode:function(event){
			event.preventDefault();
			mobile.changePage("shell/mstore.html");
			/*if(AuthenticationModel.isAuthenticated()) {
				if(!UserProfileModel.getUserProfile().Users[0].traffic_number){
					DVDashboardModel.onLinkTrafficFileClick();
				}else{
					mobile.changePage("shell/mstore.html");
				}
			}else{
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}*/
		},
		openMyApps:function(event){
			event.preventDefault();
			appFooter.setFooterActiveItem("MyApps");
			mobile.changePage(Constants.MY_APPS_LINK);
		},
		openHapinessMeter:function(event){
			event.preventDefault();
			if (!navigator.onLine){
				showInternetProblemPopup();
				return;
			}
			appFooter.setFooterActiveItem("HapinessMeter");

			HapinessMeterRatingModel.showHappinessMeter();
		},
		render: function(parent,translated) 
		{
			var html= '<div id="footer" class="animate">'+
			'<span id="dashboard" class="item icon icon-footer-dashboard waves-effect waves-light"><span class="footer-text">%shell.footer.dashboard%</span></span>'+
			'<span id="favourites" class="item icon icon-footer-favourites waves-effect waves-light"><span class="footer-text">%shell.footer.Favourites%</span></span>'+
			'<span id="helpCenter" class="item icon icon-footer-help-center waves-effect waves-light"><span class="footer-text">%shell.footer.HelpCenter%</span></span>'+
			((Constants.APP_ID =="RTA_Corporate_Services")? '<span id="myApps" class="item icon icon-mstore2 waves-effect waves-light"><span class="footer-text">%shell.footer.myApps%</span> </span>' :
			'<span id="driveMode" class="item icon icon-mstore2 waves-effect waves-light"><span class="footer-text">%shell.footer.mStore%</span> </span>')+
			'<span id="hapinessMeter" class="item icon icon-happiness waves-effect waves-light"><span class="footer-text">%shell.footer.HapinessMeter%</span></span>'+
			'<span id="activeBar" class="active"></span>'+
			'</div>';
			var language = getApplicationLanguage();
			html = Utils.applyLocalization(html, language);
			var footerElements = $(parent).find("#footer");
			if(footerElements.length == 0){
				$(parent).append(html);

			}else{

				if(translated==true &&footerElements !=undefined ){
					footerElements[0].style.transitionDuration="500ms";
					footerElements[0].style.webkitTransform="translate3d(0, 56px, 0)";
				}

				footerElements.replaceWith(html);
			}

			appFooter.$el = $("#footer"); //update the reference

			appFooter.$el.on("tap", "#dashboard", appFooter.openDashboard);
			appFooter.$el.on("tap", "#favourites", appFooter.openFavourites);
			appFooter.$el.on("tap", "#helpCenter", appFooter.openHelpCenter);
			appFooter.$el.on("tap", "#driveMode", appFooter.openDriveMode);
			appFooter.$el.on("tap", "#myApps", appFooter.openMyApps);
			appFooter.$el.on("tap", "#hapinessMeter", appFooter.openHapinessMeter);

			if(window.footerAnimated == true && !(translated==true))
				appFooter.$el.removeClass("animate");

			window.footerAnimated = true;
		},
		

		thanksHapinessSuccess : function(){
			$(".ui-loader").hide();
			$(".askHapinessContainer").addClass("hidden");
			$(".thanksHapinessContainer").removeClass("hidden");
			$('#closeContainer').on('tap',function(e){
				e.preventDefault();
			});
		},
		thanksHapinessFailure : function(){
			$(".ui-loader").hide();
			var generalErrorPopup = new Popup('generalErrorPopup');
			generalErrorPopup.show();
		},
		mStoreLoginRegisterAlert: function(msgText){
			if(msgText != undefined){
				var mStoreLoginRegisterPopup_Options = {
						popupId: "mStoreLoginRegisterPopup",
						title: localize("%shell.sidepanel.loginOrRegisterTitle%"),
						content:msgText,
						primaryBtnText: localize("%shell.login.loginAccount%"),
						primaryBtnCallBack: function(){
							mobile.changePage("shell/login.html");
						},
						primaryBtnDisabled: false,
						secondaryBtnText: localize("%shell.registeration.title%"),
						secondaryBtnCallBack: function(){
							mobile.changePage("shell/register.html");
						},
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick: null
				}

				var mStoreLoginRegisterPopup = new Popup(mStoreLoginRegisterPopup_Options);
				mStoreLoginRegisterPopup.show();
			}else {
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();

			}
		},

		hide: function() {
			this.$el.hide();
		},
		show: function(chatSkill) {
			this.$el.show();
		},
		dispose: function() {
		},

	});

//	Returns the View class
	return Footer;

});

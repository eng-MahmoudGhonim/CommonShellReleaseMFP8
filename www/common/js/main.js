var DEVELOPMENT_MODE= true;
var isWeb = false;

//var env = WL.Client.getEnvironment();
//if ((env != WL.Environment.MOBILE_WEB) && (env != WL.Environment.DESKTOPBROWSER) && (env != WL.Environment.PREVIEW)) {
	//isWeb = false;
//}
window.app = {
		sslCertificatePinned: true,
		supportsPassive : false
};

try {
	var opts = Object.defineProperty({}, 'passive', {
		get: function() {
			window.app.supportsPassive = true;
		}
	});
	window.addEventListener("testPassive", null, opts);
	window.removeEventListener("testPassive", null, opts);
} catch (e) {}

//try{
//window.logger = WL.Logger.create({pkg: 'ShellUtils'});

//}catch(e){

//}
//isWeb=false;
if (isWeb) {
	var callback = function() {
		launchIndexPage();
	}
	setRequireConfiguration();
	preInitPages(callback);
} else {
	//Start Running splash screen
	SplashModel.getSplashScreen(function() {
		setTimeout(function() {
			var loadLogo = function() {
				var loadLogoDeferred = new Deferred();
				SplashModel.animateSplash(loadLogoDeferred);
				return loadLogoDeferred;
			};
			loadLogo().done(function(callback) {
				setRequireConfiguration();
				preInitPages(callback);
			});
		}, 0);
	});
}

function launchIndexPage() {
	require(["jquerymobile"], function() {
		//Override JQM default search behavior
		var jqmDefaultFilter = $.mobile.filterable.prototype.options.filterCallback;
		$.mobile.filterable.prototype.options.filterCallback = function(index, searchValue) {
			if (searchValue) {
				searchValue = searchValue.split(" ");
				for (var i = 0; i < searchValue.length; i++) {
					if (jqmDefaultFilter.call(this, index, searchValue[i])) {
						return true;
					}
				}
			}
			return false;
		};
	});
}
/*
function wlConnect() {
	try {
		WL.Client.addGlobalHeader('Cache-Control', 'no-store, no-cache');
		WL.Client.connect({
			onSuccess: function(e) {},
			onFailure: function(e) {},
			timeout: 30000
		});
		//return; // for testing
		WL.Client.Push.onMessage = function (props, payload) {
			try{
				var notificationElem=document.getElementById("notificationBtn");
				if(notificationElem)
				{

					document.getElementById("notificationBtn").classList.remove("icon-notifications")
					document.getElementById("notificationBtn").classList.add("icon-notifications-new")

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg)" }, 100);

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg)" }, 200);

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg);" }, 300);

					setTimeout(function(){document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg);" }, 400);

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg)" }, 500);

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg)" }, 600);

					setTimeout(function(){ document.getElementById("notificationBtn").style.webkitTransform   = "translate(1px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(-20deg);" }, 700);

					setTimeout(function(){document.getElementById("notificationBtn").style.webkitTransform   = "translate(0px, 0px)";
					document.getElementById("notificationBtn").style.webkitTransform  = "rotate(20deg);" }, 800);
					if(dashboardPageViewInstance&&typeof dashboardPageViewInstance.callNotification === 'function')
						dashboardPageViewInstance.callNotification(payload);
				}
			}
			catch(e){
				console.log(e);
			}
			//mobile.changePage("shell/dashboard.html");

			/*WL.SimpleDialog.show("Tag Notifications", "Provider notification data: " + JSON.stringify(props), [ {
		    text : props.alert["action-loc-key"] ? props.alert["action-loc-key"] : 'Close',
		    handler : function() {
		    	WL.SimpleDialog.show("Tag Notifications", "Application notification data: " + JSON.stringify(payload), [ {
		    	    text : 'Close',
		    	    handler : function() {}
		    	  }]);
		    }
		}])///
		}
	}catch(e){}
}*/

function initEventListener() {
	// Common initialization code goes here
	// For vendors to be able to test [Will be removed later]
	loginEventSuccess = document.createEvent('Event');
	loginEventFailure = document.createEvent('Event');
	logoutEventSuccess = document.createEvent('Event');
	registerEventSuccess = document.createEvent('Event');
	registerEventFailure = document.createEvent('Event');
	pageHomeOnCreate = document.createEvent('Event');
	linkActionButton = document.createEvent('Event');
	linkAttributesUpdated = document.createEvent('Event');

	loginEventSuccess.initEvent('loginEventSuccess', true, true);
	loginEventFailure.initEvent('loginEventFailure', true, true);
	logoutEventSuccess.initEvent('logoutEventSuccess', true, true);
	registerEventSuccess.initEvent('registerEventSuccess', true, true);
	registerEventFailure.initEvent('registerEventFailure', true, true);
	pageHomeOnCreate.initEvent('pageHomeOnCreate', true, true);
	console.log("pageHomeOnCreate initiated");
	linkActionButton.initEvent('linkActionButton', true, true);
	linkAttributesUpdated.initEvent('linkAttributesUpdated', true, true);

	document.addEventListener("loginEventSuccess", function(event) {
		// [Event handler task] Code goes here
	}, false);
	document.addEventListener("loginEventFailure", function(event) {
		// [Event handler task] Code goes here
	}, false);
	document.addEventListener("registerEventSuccess", function(event) {
		// [Event handler task] Code goes here
	}, false);
	document.addEventListener("registerEventFailure", function(event) {
		// [Event handler task] Code goes here
	}, false);
	document.addEventListener("logoutEventSuccess", function(event) {
		// [Event handler task] Code goes here
	}, false);
}

function setRequireConfiguration() {
	// Sets the require.js configuration for your application.
	require.config({
		waitSeconds: 0,
		baseUrl: 'common/js',
		// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
		paths: {
			// Core Libraries
			"jquery": "../libs/jquery/jquery",
			"jquerymobile": "../libs/jquery.mobile/1.4.5/jquery.mobile-1.4.5",
			"jqueryui": "../libs/jquery.ui/jquery-ui.min",
			"jqueryuitouch": "../libs/jquery.ui.touch/jquery.ui.touch-punch.min",
			"underscore": "../libs/underscore/underscore-min",
			"backbone": "../libs/backbone/backbone-min",
			"touchpunch": "../libs/jquery.touchpunch/jquery.ui.touch-punch",
			"jqrcode": "../libs/jquery.qr/jquery.qrcode.min",
			"panzoom": "../libs/panzoom/jquery.panzoom",
			"jmousewheel": "../libs/jquery.mousewheel/jquery.mousewheel.min",
			"jimageresizer": "../libs/jquery.imageresizer/jquery.ae.image.resize",
			"handlebars": "../libs/handlebars/handlebars.min-latest",
			"scrollto": "../libs/jquery.scrollto/jquery.scrollTo.min",
			"hammer": "../libs/hammerjs/hammer.min",
			"jqueryhammer": "../libs/hammerjs/jquery.hammer.min",
			"deserialize": "../libs/jquery.deserialize/jquery.deserialize",
			"globalize": "../libs/globalize/globalize",
			"touchslider": "../libs/jquery.touchslider/rp.touch-slider",
			"jqueryMd5": "../libs/jquery.md5/jquery.md5",
			"dateformat": "../libs/jquery.dateformat/jquery-dateFormat.min",
			"mobiscroll": "../libs/jquery.mobiscroll/mobiscroll.custom-2.6.2.min",
			"async": "../libs/jquery.async/async",
			"validate": "../libs/jquery.validate/jquery.validate.min",
			"jspdf": "../libs/pdfjs/jspdf",
			"jspdfpluginaddimage": "../libs/pdfjs/jspdf.plugin.addimage",
			//flexslider library should be added by vendor if needed to the location below
			"flexslider": "../libs/flexslider/jquery.flexslider"
		},
		// Sets the configuration for your third party scripts that are not AMD compatible
		shim: {
			"backbone": {
				"deps": ["underscore", "jquery"],
				"exports": "Backbone" //attaches "Backbone" to the window object
			},
			"jqueryuitouch": {
				"deps": ["jqueryui"]
			},
			"handlebars": {
				"deps": ["jquery"],
				"exports": "Handlebars"
			},
			"underscore": {
				"exports": "_"
			},
			"jspdfpluginaddimage": {
				"deps": ["jspdf"]
			},
			"jimageresizer": ["jquery"],
			"jmousewheel": ["jquery"],
			"panzoom": ["jquery", "jmousewheel"],
			"jqrcode": ["jquery"],
			"jqueryui": ["jquery"],
			"touchpunch": ["jquery", "jqueryui"],
			"scrollto": ["jquery"],
			"jqueryhammer": ["jquery", "hammer"],
			"easing": ["jquery"],
			"deserialize": ["jquery"],
			"jqueryui": ["jquery"],
			"jqueryMd5": ["jquery"],
			"jqueryWheather": ["jquery"],
			"touchslider": ["jquery"],
		} // end Shim Configuration
	});
}

function preInitPages(callback) {
	// Includes File Dependencies
	require(["com/utils/TemplateUtils",
//	         "com/routers/MobileRouter",
	         "com/models/Constants",
	         "com/utils/ApplicationUtils",
	         "offlineFavoritesHandler" ,
	         "config/shell/viewClasses"],
	         function(TemplateUtils,
//	        		 MobileRouter,
	        		 Constants,
	        		 ApplicationUtil,
	        		 offlineFavoritesHandler) {
//		var viewClasses = require("config/shell/viewClasses");
//		console.log(viewClasses);



		$(document).on("mobileinit",
				// Set up the "mobileinit" handler before requiring jQuery Mobile's module
				function() {
			Waves.init();
			//			console.log("mobile init!");
			window.myNamespace = window.myNameSpace || {};
			window.myNamespace.TemplateUtils = TemplateUtils;
			$.event.special.tap.emitTapOnTaphold = false;
			$.event.special.swipe.horizontalDistanceThreshold = window.devicePixelRatio >= 2 ? 15 : 30;
			$.event.special.swipe.verticalDistanceThreshold = window.devicePixelRatio >= 2 ? 15 : 30;
			//Configure spinner
			var loader = '<div class="googleLoader">' + '<svg class="circular" viewBox="25 25 50 50">' + '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10" />' + '</svg>' + '</div>';
			if (getApplicationLanguage() == "en") {
				loader += '<div class="ui-loader-desc">Please wait.. <br>Your data is being loaded</div>';
			} else {
				loader += "<div class='ui-loader-desc'>من فضلك انتظر..<br>جاري تحميل بياناتك</div>";
			}
			$.mobile.loader.prototype.options.html = loader;
			var win = $(window),
			height = win.height(),
			width = win.width();
			// fix the header and footer issue on iOS
			$(document).on('blur', 'input, textarea, select', function() {
				$('body').css('min-height', (height) + 'px');
				setTimeout(function() {
					$('body').css('min-height', (height + 1) + 'px');
				}, 10);
			});
			// Prevents all anchor click handling including the addition of active button state and alternate link blurring.
			//			$.mobile.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;
			// test to fix the flickering of header and footer
			$.mobile.defaultPageTransition = "none";
			//			$.mobile.keepNative = "select,input";
			// Instantiates a new Backbone.js Mobile Router
//			window.mobile = new MobileRouter();
//			window.MobileRouter = window.mobile; // this one is needed to support legacy code
			//disable selection for any element on the page
			document.onselectstart = function() {
				return false;
			};
			//make sure scroll event fires sooner on ios
			document.addEventListener("touchmove", function() {
				$(window).trigger("scroll");
			}, false);
			document.addEventListener("scroll", function() {
				$(window).trigger("scroll");
			}, false);
			window.myopen = window.open;

//			window.DashboardViewModel = window[Constants.APP_ID + "_DashboardViewModel"];
//			window.TipsScreens = window[Constants.APP_ID + "_tipsScreens"];
//			window.APPConfig = window[Constants.APP_ID + "_appConfig"];
			switch (Constants.APP_ID) {
			case "RTA_Public_Transport":
				require(["com/routers/MobileRouter",
				         "com/views/nol/StartUpPageView",
				         "com/views/public_transport/StartUpPageView",
//				         "config/publicTransport/dashboardConfig",
				         "config/publicTransport/viewClasses",
				         "config/publicTransport/favouriteServices",
				         "config/publicTransport/serviceCategories",
				         "config/publicTransport/tipsConfig",
				         "config/publicTransport/appConfig"
				         ], function(MobileRouter,nol_StartUpPageView, public_transport_StartUpPageView) {
					new nol_StartUpPageView().onStartUp();
					new public_transport_StartUpPageView().onStartUp();

					window.ServiceCategories = window[Constants.APP_ID + "_ServiceCategories"];


					require(["config/publicTransport/dashboardConfig"],function (){


						var _dashboardConfig = JSON.parse(localStorage.getItem("shellDashboardConfig_" + Constants.APP_ID));
						if (_dashboardConfig != null) window.DashboardConfig = _dashboardConfig;
						window.PushEventSource="RTA_Public_Transport_Push_Source";
						window.DashboardViewModel = window[Constants.APP_ID + "_DashboardViewModel"];
						window.viewClasses = window.viewClasses.concat(eval(Constants.APP_ID+"_viewClasses"));
						window.favouriteServices =eval(Constants.APP_ID+"_favouriteServices");
						window.TipsScreens = window[Constants.APP_ID + "_tipsScreens"];
						window.APPConfig = window[Constants.APP_ID + "_appConfig"];
						window.mobile = new MobileRouter();
						window.MobileRouter = window.mobile;
					});
				});
				document.body.className += " PublicTransportApp";
				break;
			case "RTA_Corporate_Services":
				require(["com/routers/MobileRouter",
				         "com/views/corporates/StartUpPageView",
				         "config/corporate/serviceCategories",
//				         "config/corporate/dashboardConfig",
				         "config/corporate/popularServices",
				         "config/corporate/viewClasses",
				         "config/corporate/favouriteServices",
				         "config/corporate/tipsConfig",
				         "config/corporate/appConfig"
				         ], function(MobileRouter,corporates_StartUpPageView) {
					new corporates_StartUpPageView().onStartUp();
					window.ServiceCategories = window[Constants.APP_ID + "_ServiceCategories"];
					require(["config/corporate/dashboardConfig","com/models/shell/DashboardViewModel_RTA_Corporate_Services"],function (){
						var _dashboardConfig = JSON.parse(localStorage.getItem("shellDashboardConfig_" + Constants.APP_ID));
						if (_dashboardConfig != null) window.DashboardConfig = _dashboardConfig;
						window.PushEventSource="RTA_Corporate_Services_Push_Source";
						window.DashboardViewModel = window[Constants.APP_ID + "_DashboardViewModel"];
						window.viewClasses = window.viewClasses.concat(eval(Constants.APP_ID+"_viewClasses"));
						window.favouriteServices =eval(Constants.APP_ID+"_favouriteServices");
						window.TipsScreens = window[Constants.APP_ID + "_tipsScreens"];
						window.APPConfig = window[Constants.APP_ID + "_appConfig"];
						window.mobile = new MobileRouter();
						window.MobileRouter = window.mobile;
					});

				});
				document.body.className += " CorporateApp";
				break;
			case "RTA_Drivers_And_Vehicles":
				require(["com/routers/MobileRouter",
				         "com/views/drivers_and_vehicles/StartUpPageView",
//				         "config/dubaiDrive/dashboardConfig",
				         "config/dubaiDrive/popularServices",
				         "config/dubaiDrive/viewClasses",
				         "config/dubaiDrive/favouriteServices",
				         "config/dubaiDrive/serviceCategories",
				         "config/dubaiDrive/tipsConfig",
				         "config/dubaiDrive/appConfig"], function(MobileRouter,drivers_and_vehicles_StartUpPageView) {


					window.ServiceCategories = window[Constants.APP_ID + "_ServiceCategories"];
					require(["config/dubaiDrive/dashboardConfig", "com/models/shell/DashboardViewModel_RTA_Drivers_And_Vehicles"],function (){
						var _dashboardConfig = JSON.parse(localStorage.getItem("shellDashboardConfig_" + Constants.APP_ID));
						if (_dashboardConfig != null) window.DashboardConfig = _dashboardConfig;
						window.PushEventSource="RTA_Drivers_And_Vehicles_Push_Source";

						window.DashboardViewModel = window[Constants.APP_ID + "_DashboardViewModel"];
						// window.viewClasses = window.viewClasses.concat(eval(Constants.APP_ID+"_viewClasses"));
						window.favouriteServices =eval(Constants.APP_ID+"_favouriteServices");
						window.TipsScreens = window[Constants.APP_ID + "_tipsScreens"];
						window.APPConfig = window[Constants.APP_ID + "_appConfig"];
						window.mobile = new MobileRouter();
						window.MobileRouter = window.mobile;
						new drivers_and_vehicles_StartUpPageView().onStartUp();
					});

				});
				document.body.className += " DubaiDriveApp";




				break;
			}
		});
		if (callback) callback();
	});
	try{
		// reset Banner in dashboard
		localStorage.setItem("shellBannerClosed","");
	}catch(e){
		console.log(e);
	}
}
/*
function wlCommonInit() {
	try {
		if (DEVELOPMENT_MODE)
			WL.Client.pinTrustedCertificatePublicKey('mfps.cer').then(onSuccessPinning, onFailurePinning);
		else
			WL.Client.pinTrustedCertificatePublicKey('mfp_production.cer').then(onSuccessPinning, onFailurePinning);
	} catch (e) {}
	//MGRT71
	WL.Analytics.disable();
	//Connect to Worklight
	wlConnect();
	initEventListener();
}
*//*
function onSuccessPinning(e) {
//	console.log("onSuccessPinning")
//	console.log(e)
}

function onFailurePinning(e) {
//	console.log("onFailurePinning")
//	console.log(e)
	window.app.sslCertificatePinned = false;
}*/
/* JavaScript content from js/main.js in folder android */
//This method is invoked after loading the main HTML and successful initialization of the IBM MobileFirst Platform runtime.
/*function wlEnvInit(){
	wlCommonInit();
	// Environment initialization code goes here
}*/

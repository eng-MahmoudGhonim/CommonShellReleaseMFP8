define(["com/models/Constants",
        "com/utils/Utils"
        ], function(Constants, Utils) {
	var Header = Backbone.View.extend({
		_state: null, //string constant
		_sidePanelClosedEvent: "", //string
		_confirmFlag: false,
		initialize: function(options) {
			this.render(options.parent);
			this.options = options;
			var self = this;
			this._sidePanelClosedEvent = Constants.EVENT_SIDEPANEL_CLOSED + "." + this.cid;
		},
		handleOfflineMode: function(event) {
			var pages = document.querySelectorAll('[data-role="page"]');
			var pageTop ='106px';
			document.getElementById("noInternet").style.top='56px';
			if(!isUndefinedOrNullOrBlank(pageViewInstance.options.subTitle)) {
				pageTop= '130px'; //adding 50 pixel for internet error div and also adding 24 pexils of the sub header
				document.getElementById("noInternet").style.top='80px';
			}

			pages[1].style.top = pageTop;
			
			if (!event)
				pages[1].style.transitionDuration = "300ms";
			
			document.getElementById("noInternet").style.display='block';
			
			setTimeout(function() {
				document.getElementById("noInternet").style.webkitTransform = "translate3d(0,0,0)";
				setTimeout(function() {
					pages[1].style.transitionDuration = "0ms";
				}, 300);
			},10);
		},
		handleOnlineMode: function(event) {
			document.getElementById("noInternet").style.webkitTransform = "translate3d(0,-50px,0)";
			var pageTop ='56px';
			if(!isUndefinedOrNullOrBlank(pageViewInstance.options.subTitle)) {
				pageTop= '80px'; //adding 24 pexils of the sub header
			}
			var pages = document.querySelectorAll('[data-role="page"]');
			pages[1].style.top = pageTop;
			if (!event)
				pages[1].style.transitionDuration = "300ms";
			setTimeout(function() {
				document.getElementById("noInternet").style.display='none';
				pages[1].style.transitionDuration = "0ms";
			}, 300);
		},
		openSidepanel: function(event) {
			event.preventDefault();
			var sidepanel = MobileRouter.getSidePanel();
			document.activeElement.blur();
			sidepanel.open();
		},
		backAction: function(event) {
			event.preventDefault();
			var options = {
					"direction": "right", // 'left|right|up|down', default 'left' (which is like 'next')
					"duration": 250, // in milliseconds (ms), default 400
					"slowdownfactor": 3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					"slidePixels": 0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay": -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
					"androiddelay": -1, // same as above but for Android, default 70
					"winphonedelay": -1, // same as above but for Windows Phone, default 200,
					"fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
					"fixedPixelsBottom": 0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
			};
			window.plugins.nativepagetransitions.slide(
					options,
					function(msg) {}, // called when the animation has finished
					function(msg) {} // called in case you pass in weird values
			);
			history.back();
		},
		render: function(parent) {
			var noInternet = localize('<div id="noInternet">' + localize('%shell.header.offline%') + '</div>');
			var noInternetElements = $(parent).find("#noInternet");
			if (noInternetElements.length == 0) {
				$(parent).append(noInternet);
			} else {
				noInternetElements.replaceWith(noInternet);
			}

			var self = this;
			var html = '<div id="header" class="animate">' +
			'<span id="backBtnHeaderActionBtn" class="left icon-back waves-effect"></span>' +
			'<span id="searchBtn" class="left icon icon-menu-search waves-effect" style="display:none;"></span>' +
			'<span id="notificationBtn" class="right icon icon-notifications waves-effect" style="display:none;"></span>' +
			'<span id="sidePanelHeaderActionBtn" class="right icon icon-menu waves-effect"> </span>' +
			'<div id="phone_title" class="title"></div><div id="sub_title" style="display:none;"></div>' +
			'<span id="headerRTALogo" class="icon-RTA-logo"></span>' +
			'</div>';
			var headerElements = $(parent).find("#header");
			if (headerElements.length == 0) {
				$(parent).append(html);

			} else {
				headerElements.replaceWith(html);
			}
			this.$el = $("#header"); //update the reference

			if (window.headerAnimated == true)
				$("#header").removeClass("animate");
			window.headerAnimated = true;

			$("#sidePanelHeaderActionBtn").on("tap", self.openSidepanel);
			$("#backBtnHeaderActionBtn").on("tap", self.backAction);
			$("#notificationBtn").on("tap", self.notificationBtnAction);
			$("#searchBtn").on("tap", self.searchBtnAction);

			return this; //Maintains chainability
		},
		searchBtnAction: function(event) {
			event.preventDefault();
			mobile.changePage('shell/search.html');
		},
		notificationBtnAction: function(event) {
			event.preventDefault();
			mobile.changePage('shell/notifications.html');
		},
		/**
		 * hide
		 * @param none
		 */
		hide: function() {
			this.$el.hide();
		},

		/**
		 * show
		 * @param state, constant [optional] default is full
		 */
		show: function(state) {
			if (state == undefined) {
				state = Header.STATE_FULL;
			}

			this._setState(state);

			this.$el.show();
		},

		/**
		 * set the state of the header
		 * @param state, constant
		 */
		_setState: function(state) {
			$("#phone_title").hide();
			$("#headerRTALogo").hide();
			$("#sidePanelHeaderActionBtn").hide();
			$("#notificationBtn").hide();
			$("#backBtnHeaderActionBtn").hide();
			$("#searchBtn").hide();
			$("#sub_title").hide();

			document.getElementById('searchBtn').style.left = "56px";

			switch (state) {
			case Header.STATE_TITLE_BACK:
				$("#phone_title").show();
				$("#backBtnHeaderActionBtn").show();
				break;
			case Header.STATE_SIMPLER:
			case Header.STATE_EMPTY:
				$("#phone_title").show();
				break;
			case Header.STATE_MENU:
				$("#phone_title").show();
				$("#backBtnHeaderActionBtn").show();
				$("#sidePanelHeaderActionBtn").show();
				$("#searchBtn").show();
				$("#notificationBtn").show();
				break;
			case Header.STATE_SIMPLE:
				// show only back button and search and notifications
				$("#phone_title").show();
				$("#backBtnHeaderActionBtn").show();
				$("#searchBtn").show();
				$("#notificationBtn").show();
				break;

			case Header.STATE_ONLY_MENU:
				// only Menu button
				$("#phone_title").show();
				$("#sidePanelHeaderActionBtn").show();
				break;
			case Header.DASHBOARD:
				document.getElementById('searchBtn').style.left = "0";
				$("#headerRTALogo").show();
				$("#notificationBtn").show();
				$("#sidePanelHeaderActionBtn").show();
				$("#searchBtn").show();
				break;
			default:
				$("#phone_title").show();
			$("#sidePanelHeaderActionBtn").show();
			$("#backBtnHeaderActionBtn").show();
			$("#searchBtn").show();
			$("#notificationBtn").show();
			break;

			}
			this._state = state;
		},

		/**
		 * set the title to show in the header only for the phone layout
		 * @param title, string
		 */
		setHeaderText: function(title) {
			var temp = Utils.makeEveryFirstLetterCapital(title);

			// here you add the exceptional cases
			temp = temp.replace(/MPay/g, 'mPay');
			temp = temp.replace(/EPay/g, 'ePay');
			temp = temp.replace(/MStore/g, 'mStore');
			temp = temp.replace(/MChat/g, 'mChat');
			temp = temp.replace(' A ', ' a ');
			temp = temp.replace(' The ', ' the ');
			temp = temp.replace(/Nol/g, 'nol');
			temp = temp.replace(/Click N Park/g, 'Click n Park');
			$("#phone_title").html(temp);
		},

		setHeaderSubText: function(title) {
			var temp = Utils.makeEveryFirstLetterCapital(title);

			// here you add the exceptional cases
			temp = temp.replace(/MPay/g, 'mPay');
			temp = temp.replace(/EPay/g, 'ePay');
			temp = temp.replace(/MStore/g, 'mStore');
			temp = temp.replace(/MChat/g, 'mChat');
			temp = temp.replace(' A ', ' a ');
			temp = temp.replace(' The ', ' the ');
			temp = temp.replace(/Nol/g, 'nol');
			temp = temp.replace(/Click N Park/g, 'Click n Park');
			$("#sub_title").html(temp);
			$("#sub_title").show();

			var pages = document.querySelectorAll('[data-role="page"]');
			pages[1].style.top = (parseInt(pages[1].style.top.replace("px",""))+ 20 ) +'px';
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			this.$el.remove();
		},

	}, {

		STATE_SIMPLER: 0,
		STATE_SIMPLE: 1,
		STATE_FULL: 2,
		STATE_CANCEL: 3,
		STATE_ONLY_MENU: 4,
		STATE_EMPTY: 5,
		STATE_MENU: 6,
		DASHBOARD: 7,
		STATE_TITLE_BACK:8

	});

	// Returns the View class
	return Header;

});
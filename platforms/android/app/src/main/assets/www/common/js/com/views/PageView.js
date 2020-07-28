define(["backbone", "com/models/Constants", "com/utils/Utils", "com/models/shell/HapinessMeterRatingModel"], function(Backbone, Constants, Utils, HapinessMeterRatingModel) {
	// Extends Backbone.View
	var PageView = Backbone.View.extend({
		sharedData: {},
		template: {},
		handlePageHeader:function (options){
			var header = MobileRouter.getHeader();
			if (header) {
				var headerState = options ? options.headerState : undefined;
				options && options.hideHeader ? header.hide() : header.show(headerState);
				if (options && options.showSearch) {
					$("#searchBtnHeaderActionBtn").show();
					$("#backBtnHeaderActionBtn").hide();
				} else {
					$("#searchBtnHeaderActionBtn").hide();
				}
				var phoneTitle = options && options.phoneTitle ? options.phoneTitle : "";
				header.setHeaderText(localize(phoneTitle));
				var subTitle = options && options.subTitle ? options.subTitle : "";
//				console.log(subTitle);
				if(subTitle!="")
				header.setHeaderSubText(localize(subTitle));
			}
		},
		handlePageFooter:function (options){
			var footer = MobileRouter.getFooter();
			if (footer) {
				options && options.hideFooter ? footer.hide() : footer.show();
				window.hideFooter = options && options.hideFooter;
			}
		},
		handleIOSScroll:function (options){
//			if (!Utils.isiOS()) {
//			var scrolledElement = this.$el;
//			if (options && options.preventiOSDefaultScroll != true) {
//			if (options.currentScrollingContentId) {
//			scrolledElement = $("#" + options.currentScrollingContentId);
//			}
//			$(".iosScrolling").removeClass("iosScrolling");
//			scrolledElement.addClass("iosScrolling");
//			}
//			}
		},
		handlePageSidepanel:function (options){
			var sidepanel = MobileRouter.getSidePanel();
			if (sidepanel) {
				if (sidepanel.isOpened()) {
					sidepanel.close();
				}
				options && options.hideSidePanel ? sidepanel.hide() : sidepanel.show();
			}
		},
		initialize: function(options) {
			var self = this;
			pageViewInstance = this;
			pageViewInstance.options=options;
			pageViewInstance.validator = [];
			HapinessMeterRatingModel.setHappinessMode(window.location.href);
//			self.handlePageHeader(options);
//			self.handlePageFooter(options);
			this.$el.on("tap", ".ui-btn", function(event) {
				$("input,textarea").each(function() {
					$(this).blur();
				});
			});
			this.$el.on("pagebeforehide", function(event, data) {
				if (self.isDisposeRequired()) self.dispose();
			}).on("pagebeforeshow", function() {
				//show header and footer by default
				$(".ui-loader").hide();
				self.handlePageHeader(options);
				self.handlePageFooter(options);
				self.handlePageSidepanel(options);
				var language = getApplicationLanguage();
				if (language == "ar") {
					$("body").removeClass(Constants.BODY_CONTAINER_RTL_CLASS).addClass(Constants.BODY_CONTAINER_RTL_CLASS);
				} else {
					$("body").removeClass(Constants.BODY_CONTAINER_RTL_CLASS);
				}
				setTimeout(function() {
					document.getElementById("header").style.webkitTransform = "translate3d(0,0,0)";
					document.getElementById("footer").style.webkitTransform = "translate3d(0,0,0)";
					setTimeout(function() {
						document.getElementById("header").style.transitionDuration = "0ms";
						document.getElementById("footer").style.transitionDuration = "0ms";
					}, 300);
				});
			}).on("pageshow", function() {
				try {
					if (window.location.hash != "" && window.location.hash != null && !pageViewInstance.el.getAttribute("data-url").contains("shell/index.html")) {
						setTimeout(function() {
//							console.log("Execute native Transition");
							window.plugins.nativepagetransitions.executePendingTransition(function(msg) {}, // called when the animation has finished
									function(msg) {} // called in case you pass in weird values
							);
						}, 100);
						pageViewInstance.initAppState();
					}
				} catch (e) {}
			}).on("pagecreate", function() {});
			$(document).on("backbutton", function() {
			//	debugger;
				if (document.getElementsByClassName("ui-loader")[0].style.display == "block") {
					return;
				}

				if(window.HappinessMeter && window.HappinessMeter.visible()){
					HappinessMeter.hide();
					return;
				  }

				if(window.currentBottonSheet && window.currentBottonSheet.visible()){
					window.currentBottonSheet.hide();
					return;
				  }

				var sidepanel = MobileRouter.getSidePanel();
				//Close menu if it is open
				if (sidepanel && sidepanel.isOpened()) {
					sidepanel.close();
				}
				//Discard popup if open
				if (window.Gallery) {
					window.Gallery.close();
					return;
				} else if (Popup.VisiblePopup() != null) {
					if (Popup.VisiblePopup().options.aroundClickable) {
						Popup.hide();
					} else {
						return;
					}
				} else {
					//go back if inside a page
					if (location.hash.indexOf(Constants.HOMEPAGE_URL) < 0 && location.hash.indexOf("entryPage=true") < 0) {
						var options = {
								direction: "right", // 'left|right|up|down', default 'left' (which is like 'next')
								duration: 600, // in milliseconds (ms), default 400
								slowdownfactor: 6, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
								slidePixels: 0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
								iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
								androiddelay: -1, // same as above but for Android, default 70
								winphonedelay: -1, // same as above but for Windows Phone, default 200,
								fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
								fixedPixelsBottom: 0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
						};
						window.plugins.nativepagetransitions.slide(options, function(msg) {}, // called when the animation has finished
								function(msg) {} // called in case you pass in weird values
						);
						history.back();
					} else {
						//close app if on homepage or login
						MobileRouter.killApp();
					}
				}
			});
		},
		isDisposeRequired: function() {
			var isDispose = (location.hash.indexOf("?") > 0 ? location.hash : window.location.href).replace(/.*disposePage=/, "").indexOf("false") == 0 ? false : true;
			if (!isDispose) {
				return false;
			}
			return true;
		},
		initAppState: function() {
			if (navigator.onLine == true) {
				var header = MobileRouter.getHeader();
				header.handleOnlineMode(true);
			} else {
				var header = MobileRouter.getHeader();
				header.handleOfflineMode(true);
			}
		},
		/**
		 * Renders all of the Category models on the UI
		 * called whenever the collection is changed for this view
		 * @param none
		 */
		render: function() {
			return this; //Maintains chainability
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {}
	});
	// Returns the View class
	return PageView;
});

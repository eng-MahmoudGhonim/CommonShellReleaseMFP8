define(["com/models/Constants",
	"com/models/Model",
	"com/views/Header",
	"com/views/Footer",
	"com/views/shell/SidePanel",
	"com/views/shell/LoginView",
	"com/utils/Utils",
	"com/utils/DataUtils",
	"handlebars",
	"deserialize",
	"com/models/shell/HapinessMeterRatingModel"], function (Constants, Model, Header, Footer, SidePanel, LoginView, Utils, DataUtils, Handlebars, deserialize, HapinessMeterRatingModel) {
		// Extends Backbone.Router
		var MobileRouter = Backbone.Router.extend({
			_pageViewClasses: null, //stores loaded pageview classes, object {"key" : PageView};
			_header: null, //Header object
			_footer: null, //Footer object
			_sidepanel: null, //SidePanel object
			_model: null, //Model object
			currentPage: null, //current page view class
			baseUrl: "",
			routes: {
				"*hash": "handleHash"
			},
			handleHash: function (hash) {
				//			console.log('handleHash hash ' +hash);
				var self = this;
				if (!hash) {
					hash = "shell/index.html";//"../index.html";
				}
				//go to index page and init components
				self.initComponents(function () {
					var hashParts = hash.split('|');
					//Handle custom homepage
					if (hashParts[0] == 'shell/home.html' && Constants.APP_ID != "Smart_Dubai_Parking") {
						if (hashParts.length > 1 && $.deserialize(hashParts[1]).servicesList == "true") { } else {
							hashParts[0] = Constants.HOMEPAGE_URL;
						}
					}
					if (hashParts.length == 1) {
						$.mobile.changePage(self.baseUrl + "/common/pages/" + hashParts[0]);
					} else if (hashParts.length > 1) {
						$.mobile.changePage(self.baseUrl + "/common/pages/" + hashParts[0], $.deserialize(hashParts[1]));
					}
				});
			},
			changePage: function (hash, changePageObj) {
				//Stop Navigation if accessibilty working
if((window.TextToSpeech&&window.TextToSpeech.isSpeakerEnabled())){
	return ;
}

				//			console.log('changePage hash ' +hash+ 'changePageObj '+ JSON.stringify(changePageObj));
				var self = this;
				var navigateObj = {
					trigger: true
				};
				var options = {
					"direction": "left", // 'left|right|up|down', default 'left' (which is like 'next')
					"duration": 400, // in milliseconds (ms), default 400
					"slowdownfactor": 6, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					"slidePixels": 0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay": -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
					"androiddelay": -1, // same as above but for Android, default 70
					"winphonedelay": -1, // same as above but for Windows Phone, default 200,
					"fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
					"fixedPixelsBottom": 0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
				};
				appFooter.handleFooterActivation(hash, false);
				if (changePageObj) {
					var replace = false;
					if (typeof changePageObj.changeHash === "boolean" && !changePageObj.changeHash) {
						replace = true;
					}
					hash += '|' + $.param(changePageObj);
					if (changePageObj.reloadPage) {
						hash += '|' + Math.floor((Math.random() * 1000000)); //Force refresh
					}
					navigateObj = {
						trigger: true,
						replace: replace
					};
				}
				if (window.location.hash.indexOf(hash) == -1) {
					if (isWeb && isWeb == true) {
						self.navigate(hash, navigateObj);
					}
					if (window.appInitialized == false) {
						self.navigate(hash, navigateObj);
					} else {
						//					console.log("Add native Transition");
						window.plugins.nativepagetransitions.slide(options, function (msg) { }, // called when the animation has finished
							function (msg) { } // called in case you pass in weird values
						);
						setTimeout(function () {
							self.navigate(hash, navigateObj);
						});
					}
				}
			},
			/**
			 * The Router constructor
			 * @param none
			 */
			initialize: function () {
				var self = this;



				var viewClasses = window.viewClasses;//Constants.VIEW_CLASSES;
				var viewClasses2 = eval(Constants.APP_ID + "_viewClasses");

				require(viewClasses, function () {
					//				console.log("VIEW CLASSES Intialized");
					self._pageViewClasses = {};
					for (var i = 0; i < viewClasses.length; i++) {
						var className = viewClasses[i];
						self._pageViewClasses[className] = arguments[i];
					}
					require(viewClasses2, function () {
						console.log("viewClasses2 Intialized");
						for (var i = 0; i < viewClasses2.length; i++) {
							var className = viewClasses2[i];
							self._pageViewClasses[className] = arguments[i];
						}
						//initialize the view class associate with each view
						$(document).on("pagebeforecreate", function (event, data) {
							try {
								self.currentPage = null;
								var page = $("div[data-role=page]").last();
								if (page) {
									self._resetBackButton();
									var pageClassName = $(page).attr("data-class");
									var d = null;
									try {
										var url = event.target.baseURI; //data && data.dataUrl
										// Added if(url) because of preventing starting application in IE and some android devices.
										if (url && url.indexOf("?") != -1) {
											var start = url.indexOf("?") + 1;
											d = $.deserialize(url.substring(start));
										}
									} catch (e) {
										console.log('ERROR ::: ' + e);
										d = null;
									}
									if (pageClassName) {
										//							console.log("Initializing " + pageClassName);
										if (self._pageViewClasses.hasOwnProperty(pageClassName)) {
											var PageClass = self._pageViewClasses[pageClassName];
											self.currentPage = new PageClass({
												el: page,
												data: d
											});
										} else {
											throw new Error("Page Class needs to be added to VIEW_CLASSES!");
										}
									}
								}
								//parse page content as template, and apply localization
								var page = event.target;
								if (self._model && page) {
									var settings = self._model.get("settings");
									var culture = Globalize.culture(getApplicationLanguage());
									//parse page html as handlebars template to allow for localization
									var template = Handlebars.compile($(page).html());
									var params = {
										isRTL: culture.isRTL,
										isLTR: !culture.isRTL
									};
									var html = template(params);
									var localizedHTML = Utils.applyLocalization(html, getApplicationLanguage());
									$(page).html(localizedHTML);
								}
							} catch (e) { }
						});
						$(document).on("pageshow", function () {
							$("a").on("tap", function (event) {
								var link = $(this).attr("href");
								if (!(link && ((link.indexOf('http') == 0) || (link.indexOf('mailto') == 0)))) { //Check if not an external link
									if (link && link.length > 2) {
										event.preventDefault();
										if (link[0] == '#') {
											link = link.substring(1, link.length);
										}
										self.changePage(link);
									}
								}
							});
							if (navigator.userAgent.match(/(iPod|iPad)/)) {
								$('a[href^=tel]').click(function (e) {
									e.preventDefault();
								});
							}
						});
						$(document).on("pagechange", function (event, data) {
							appFooter.handleFooterActivation(location.hash, true);
						});
						var lastHeight = $(window).height(); //  store the intial height.
						var lastWidth = $(window).width(); //  store the intial width.
						var keyboardIsOn = false;
						$(window).resize(function (event) {
							//					var page = $("div[data-role=page]").last().css("min-height", "100%");
							//					setTimeout(function(){
							//					$(page).css("min-height", "100%");
							//					}, 250);
							//					var page = $("div[data-role=page]").last();
							//					if ($("input").is(":focus")) {
							keyboardIsOn = ((lastWidth == $(window).width()) && (lastHeight > $(window).height()));
							//					}
							if (keyboardIsOn) {
								var keyboardHeight = lastHeight - $(window).height();
								var pages = document.querySelectorAll('[data-role="page"]');
								pages[1].style.bottom = "0px";
								//pages[1].style.height = keyboardHeight+ "px";
								if (document.activeElement.tagName == "INPUT") {
									var containerScrollTop = $('.ui-page-active .ui-content')[0].scrollTop;
									var spaceBetweenItemAndKeyboard = 70;
									var scrollTo = $(document.activeElement).offset().top - (keyboardHeight - containerScrollTop - spaceBetweenItemAndKeyboard);
									$('.ui-page-active .ui-content').animate({
										scrollTop: scrollTo
									}, 300);
								}
								if (window.hideFooter != true) $("#footer").hide();
							} else {
								if (window.hideFooter != true) $("#footer").show();
								var pages = document.querySelectorAll('[data-role="page"]');
								pages[1].style.bottom = "56px";
								//pages[1].style.height = "auto";
								document.getElementById("footer").style.webkitTransform = "translate3d(0,0,0)";
								//or if you just want to remove the padding
								//$("footer").css("padding", 0);
							}
						});
						// Tells Backbone to start watching for hashchange events
						Backbone.history.start();
					});
				});

			},
			/**
			 * return the reference to the header
			 * @param none
			 * @return header, Header object
			 */
			getHeader: function () {
				return this._header;
			},
			/**
			 * return the reference to the footer
			 * @param none
			 * @return footer, Footer object
			 */
			getFooter: function () {
				return this._footer;
			},
			/**
			 * return the reference to the sidepanel
			 * @param none
			 * @return sidePanel, SidePanel object
			 */
			getSidePanel: function () {
				return this._sidepanel;
			},
			/**
			 * initialize singleton objects
			 * should be called after splash page so urls for templates can stay consistent
			 * @param onInit, function
			 */
			initComponents: function (onInit) {
				if (!this._model) {
					//TODO: use a more robust regex
					var path = window.location.pathname;
					this.baseUrl = path.substring(0, path.lastIndexOf('/'));
					//initialize localization and load default language
					var self = this;
					var onLocalization = function () {
						var onLanguage = function () {
							self._header = new Header({
								parent: $("body")
							});
							self._footer = new Footer({
								parent: $("body")
							});
							self._sidepanel = new SidePanel({
								parent: $("body"),
								moveElementsSelector: "div[data-role=page], #header, #footer, #newHeader"
							});
							var galleryElement = document.createElement("div");
							galleryElement.innerHTML = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="actionsCont"></div><div class="pswp__bg"></div><div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div></div></div>'
							document.body.appendChild(galleryElement.firstChild);



							var connenctionErrorElement = document.createElement("div");
							connenctionErrorElement.innerHTML = localize('<div id="connenctionErrorElement" style="display:none"> <i id="closeErrorConnection" class="mdi mdi-close">' +
								'</i><div id="ErrorConnectionBody"><i class="iconSocket icon-plug-socket"></i><span class="errorHeader">' + localize("%shell.ErrorConection.OPS%") + '</span>' +
								'<span class="errorDescript">' + localize("%shell.ErrorConection.UnExpectedProblem%") + '</span>' +
								'<div id="LetsTryBtn" class="tryagain waves-effect ">' + localize("%shell.ErrorConection.TryAgain%") + '</div></div><span class="connenctionErrorText"></span></div>');
							document.body.appendChild(connenctionErrorElement.firstChild);



							window.HappinessMeter = new window.HappinessMeter();
							window.HappinessMeter.onHide = function () {
								appFooter.handleFooterActivation(window.location.hash, true);
							}
							HapinessMeterRatingModel.initModel();
							CommonPopupsInitializer();
							window.LoginViewControl = new LoginView();

							// window.dbStorage= new SQLLiteStorage({dbName:"dbStorage"});

							if (onInit) {
								onInit();
							}
						};
						self._model = new Model({}); //init model first so selected language can be retrieved
						var settings = self._model.get("settings");
						var language = getApplicationLanguage();
						DataUtils.loadLanguage(language, onLanguage);
					};
					DataUtils.initLocalization(onLocalization);
				} else {
					if (onInit) {
						onInit();
					}
				}
			},
			/**
			 * return the reference to the model
			 * @param none
			 * @return model, Model object
			 */
			getModel: function () {
				return this._model;
			},
			/**
			 * get the id of the current page DOM element
			 * @param none
			 * @return id, string
			 */
			getCurrentPageId: function () {
				var id = '';
				var page = this.currentPage.$el;
				if (page) {
					id = $(page).attr("id");
				}
				return id;
			},
			/**
			 * quit the app, if app does have the kill api, just log user out
			 * @param none
			 */
			killApp: function () {
				if (navigator.app) {
					navigator.app.exitApp();
					return false;
				}
			},
			/**
			 * reset the back button handler
			 * @param none
			 */
			_resetBackButton: function () {
				$(document).off("backbutton");
			}
		});
		// Returns the Router class
		return MobileRouter;
	});

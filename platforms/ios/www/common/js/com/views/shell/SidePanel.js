define(["com/models/Constants", "com/utils/TemplateUtils", "com/utils/Utils", "com/utils/DataUtils", "com/models/shell/AuthenticationModel", "com/models/shell/SocialSharingModel","com/models/drivers_and_vehicles/DVSidePanelModel","com/models/corporates/CorporateSidePanelModel"], function(Constants, TemplateUtils, Utils, DataUtils, AuthenticationModel, SocialSharingModel,DVSidePanelModel,CorporateSidePanelModel) {
	var SidePanel = Backbone.View.extend({
		initialize: function(options) {
			var self = this;
			var language = getApplicationLanguage();
			currentTap = 'settings';
			this.render();
		},
		render: function() {
			var self = this;
			self.template = {};
			var onTemplate = function(html) {
				var language = getApplicationLanguage();
				html = Utils.applyLocalization(html, language);
				if (document.getElementById("sidepanel") != null) {
					document.body.removeChild(document.getElementById("sidepanel"));
				}
				var htmlNode = document.createElement("div");
				htmlNode.innerHTML = html;
				document.body.appendChild(htmlNode.firstChild);
				self.$el = $("#sidepanel");
				window.mySideNav = new SideNav();
				var options = {
						startIndex: 1,
						touchEnabled: false,
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				}
				setTimeout(function() {
					window.sideNavTabs = new Tabs(self.$el[0].querySelector(".tabsCont"), options);
				}, 150);
				self.updateSidePanel();
				var activateCheckbox = function(el) {
					el.parentElement.getElementsByClassName('shell-lever')[0].classList.add('shell-lever-active')
					el.checked = true;
				}
				var deactivateCheckbox = function(el) {
					el.parentElement.getElementsByClassName('shell-lever')[0].classList.remove('shell-lever-active')
					el.checked = false;
				}
				var languageCheckbox = document.getElementById('language-checkbox')
				if (language == "ar") {
					activateCheckbox(languageCheckbox);
				} else {
					deactivateCheckbox(languageCheckbox);
				}
				languageCheckbox.onchange = function(event) {
					$(".ui-loader").show();
					var language = getApplicationLanguage();
					if (language == "ar") {
						deactivateCheckbox(this);
						setTimeout(function() {
							self.changeLanguage();
						}, 300);
					} else {
						activateCheckbox(this);
						setTimeout(function() {
							self.changeLanguage();
						}, 300);
					}
				};
				if (Constants.APP_ID == "RTA_Corporate_Services") {
					document.getElementById("greenpointsBtn").style.display = "none";
					document.getElementById("registerBtn").style.display = "none";
					document.getElementById("loginBtn").innerHTML = localize("%shell.sidepanel.logintocorporateservices%");
				}
				document.getElementsByClassName('searchInput')[0].onclick = function(event) {
					if (window.location.hash.indexOf("dashboard.html") != -1) {
						self.close(function() {
							boradSlide.changeIndex(2);
							document.getElementById("serviceSearchInput").focus();
						});
					} else {
						window.DashboardIndex = "2";
						self._changePage("shell/dashboard.html", true);
						setTimeout(function() {
							document.getElementById("serviceSearchInput").focus();
						}, 1000);
					}
				};
				document.getElementById("editButtonText").onclick = function(event) {
					self.close(function() {
						Utils.loadMyAccountPage();
					});
				};
				document.getElementById("userprofileimgsidepanel").onclick = function(event) {
					self.close(function() {
						Utils.loadMyAccountPage();
					});
				};
				document.getElementById("welcomeMessage").onclick = function(event) {
					self.close(function() {
						Utils.loadMyAccountPage();
					});
				};
				document.getElementById("loginTap").onclick = function(event) {
					self.close(function() {
						window.LoginViewControl.show();
					});
				};
				document.getElementById("loginBtn").onclick = function(event) {
					self.close(function() {
						window.LoginViewControl.show();
					});
				};
				document.getElementById("registerBtn").onclick = function(event) {
					self._changePage("shell/register.html", true);
				};
				document.getElementById("logoutBtn").onclick = function(event) {
					self.close(function() {
						var logoutPopup = new Popup("logoutPopup");
						logoutPopup.show();
					});
				};
				document.getElementById("shareBtn").onclick = function(event) {
					event.preventDefault();
					self.close(function() {
						var RTAAppNameTodisplay = "",
						shareMessage = "",
						sharingLink = Utils.getAppStoreLink();
						if (Constants.APP_ID == "RTA_Public_Transport") {
							RTAAppNameTodisplay = localize("%shell.welcomepage.AppName.RTA_Public_Transport%");
							shareMessage = localize("%shell.socialShare.downloadApp%") + RTAAppNameTodisplay + localize("%shell.socialShare.downloadApp2%");
						} else if (Constants.APP_ID == "RTA_Corporate_Services") {
							RTAAppNameTodisplay = localize("%shell.welcomepage.AppName.RTA_Corporate_Services%");
							shareMessage = localize("%shell.socialShare.downloadApp%") + RTAAppNameTodisplay + localize("%shell.socialShare.downloadApp2%");
						} else if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
							shareMessage = localize("%shell.share.DubaiDrive%").replace("#STORELINK#", sharingLink);
							sharingLink = null;
						}
						SocialSharingModel.share(shareMessage, null, sharingLink);
					});
				};
				document.getElementById("notificationsBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/notifications_settings.html", true);
				};
				document.getElementById("accessibilityBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/accessibility.html", true);
				};
				document.getElementById("accountBtn").onclick = function(event) {
					event.preventDefault();
					if (!AuthenticationModel.isAuthenticated()) {
						self.close(function() {
							var loginRegisterPopup = new Popup("loginRegisterPopup");
							loginRegisterPopup.show();
						});
					} else {
						self.close(function() {
							Utils.loadMyAccountPage();
						});
					}
				};
				document.getElementById("myplacesBtn").onclick = function(event) {
					event.preventDefault();
					var commingSoonPopup = new Popup("commingSoonPopup");
					commingSoonPopup.show();
				};
				document.getElementById("mytransactionsBtn").onclick = function(event) {
					event.preventDefault();
					if (!AuthenticationModel.isAuthenticated()) {
						self.close(function() {
							/*var loginRegisterPopup = new Popup("loginRegisterPopup");
							loginRegisterPopup.show();*/
							window.LoginViewControl.show();
						});
					} else {
						if (Constants.APP_ID == "RTA_Corporate_Services") {
							CorporateSidePanelModel.openMyTransaction(event);
						} else if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
							DVSidePanelModel.openMyTransaction(event);
						}
					}
				};
				document.getElementById("apptipsBtn").onclick = function(event) {
					event.preventDefault();
					self.close();
					setTimeout(function() {
						mobile.changePage("shell/tips.html", {
							changeHash: true
						});
					}, 350);
				};
				document.getElementById("greenpointsBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/greenpoints_leaf.html", true);
				};
				document.getElementById("rtaservicesBtn").onclick = function(event) {
					event.preventDefault();
					self.close(function() {
						if (getApplicationLanguage() == 'en') {
							window.open("https://www.rta.ae/wps/portal/rta/ae/home/rta-services?lang=en", "_system")
						} else {
							window.open("https://www.rta.ae/wps/portal/rta/ae/home/rta-services?lang=ar", "_system")
						}
					});
				};
				document.getElementById("aboutrtaBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/about_the_rta.html", true);
				};
				document.getElementById("contactrtaBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/contact_rta.html", true);
				};
				document.getElementById("sendfeedbackBtn").onclick = function(event) {
					event.preventDefault();
					if (!AuthenticationModel.isAuthenticated()) {
						self.close(function() {
							var loginRegisterPopup = new Popup("loginRegisterPopup");
							loginRegisterPopup.show();
						});
					} else {
						self._changePage("shell/feedback_form.html", true);
					}
				};
				document.getElementById("aboutthisappBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/about_app.html", true);
				};
				document.getElementById("helpfaqsBtn").onclick = function(event) {
//					event.preventDefault();
//					var commingSoonPopup = new Popup("commingSoonPopup");
//					commingSoonPopup.show();
//					return;
//					self._changePage("shell/help.html", true);

					event.preventDefault();
					self.close(function() {
						if (getApplicationLanguage() == 'en') {
							window.open("https://www.rta.ae/wps/portal/rta/ae/contact-us/help-and-support/AllGuides?lang=en", "_system")
						} else {
							window.open("https://www.rta.ae/wps/portal/rta/ae/contact-us/help-and-support/AllGuides?lang=ar", "_system")
						}
					});
				};
				document.getElementById("termspoliciesBtn").onclick = function(event) {
					event.preventDefault();
					self._changePage("shell/TermsAndPolicies.html", true);
				};
				self._isOpened = false;
			};
			var url = MobileRouter.baseUrl + '/common/pages/shell/sidepanel.html';
			TemplateUtils.getStaticTemp(url, onTemplate, true, true);
			return this;
		},
		open: function() {
			var self = this;
			self._isOpened = true;
			mySideNav.open();
		},
		close: function(callback) {
			this._isOpened = false;
			mySideNav.close(true);
			if (callback) callback();
		},
		updateUserProfileImage: function() {
			var data = DataUtils.getLocalStorageData("userProfile", "shell");
			if (data) {
				data = JSON.parse(data);
			}
			var userProfileImage = DataUtils.getLocalStorageData("userprofileImg" + data.Users[0].user_id, "shell");
			if (!isUndefinedOrNullOrBlank(userProfileImage)) {
				document.getElementById('userprofileimgsidepanel').setAttribute('src', userProfileImage);
				$("#userprofileimgsidepanel").show();
				$("#dummyiconsidepanel").hide();
			}
		},
		updateSidePanel: function() {
			//set the version number
			var language = getApplicationLanguage();
			var txt = language == "en" ? "version" : "اصدار";
			//document.getElementById("versionNumber").innerText = txt + " " + WL.Client.getAppProperty("APP_VERSION");

			var ver=Utils.getAppicationVersion(function callFunction(version) {
					document.getElementById("versionNumber").innerText = txt + " " + version;
			 });
			var data = DataUtils.getLocalStorageData("userProfile", "shell");
			if (data) {
				data = JSON.parse(data);
			}
			var loggedInUserName = localize("%shell.sidepanel.hello%") + " ";
			if (data && data.Users[0]) {
				if (language == "en") {
					loggedInUserName += fullName(data.Users[0].first_name_en);
				} else {
					if (data.Users[0].first_name_ar == "") {
						loggedInUserName += fullName(data.Users[0].first_name_ar);
					} else {
						loggedInUserName += fullName(data.Users[0].first_name_en);
					}
				}
				document.getElementById("welcomeMessage").innerText =loggedInUserName
				this.updateUserProfileImage();
				//show login stuff
				$("#logoutBtn").show();
				$("#loginBtn").hide();
				$("#registerBtn").hide();
				//$("#versionNumber").hide();
				$("#tabsContent").removeClass("guestSidePanel");
				$("#tabsContent").addClass("loggedInSidePanel");
				$("#guestWelcomeMessage").hide();
				$("#loggedInWelcomeMessage").show();
				//	$("#notificationsBtn").show();
				$("#accountBtn").show();
				$("#myplacesBtn").show();
				$("#mytransactionsBtn").show();
			} else {
				document.getElementById("welcomeMessage").innerText = "";
				$("#logoutBtn").hide();
				$("#loginBtn").show();
				$("#registerBtn").show();
				//$("#versionNumber").show();
				$("#tabsContent").addClass("guestSidePanel");
				$("#tabsContent").removeClass("loggedInSidePanel");
				$("#guestWelcomeMessage").show();
				$("#loggedInWelcomeMessage").hide();
				//$("#notificationsBtn").hide();
				$("#accountBtn").hide();
				$("#myplacesBtn").hide();
				$("#mytransactionsBtn").show();
			}
		},
		_changePage: function(page, isReverse) {
			isReverse = isReverse == undefined ? false : isReverse;
			this.close();
			if (page) {
				setTimeout(function() {
					mobile.changePage(page);
				}, 350);
			}
		},
		changeLanguage: function() {
			var self = this;
			var settings = MobileRouter.getModel().get("settings");
			var language = getApplicationLanguage();
			var newLanguage = '';
			if (language == 'ar') {
				newLanguage = 'en';
			} else {
				newLanguage = 'ar';
			}
			var onLoaded = function() {
				settings.changeLanguage(newLanguage);
				settings.save();
				try {
					appFooter.$el[0].style.transitionDuration = "500ms"
						appFooter.$el[0].style.webkitTransform = "translate3d(0, 56px, 0)";
					setTimeout(function() {
						appFooter.render($("body"), true);
						//						setTimeout(function(){
						//						appFooter.$el[0].style.transform="translate3d(0, 0, 0)";
						//						}, 500);
						var sidepanel = MobileRouter.getSidePanel();
						sidepanel.render($("body"));
						sidepanel.updateSidePanel();
						CommonPopupsInitializer();
						window.LoginViewControl.initialize();
						mobile.changePage(Constants.HOMEPAGE_URL, {
							reloadPage: true,
							disposePage: false,
							data: {
								languageChange: true
							}
						});
						var loader = '<div class="googleLoader">' + '<svg class="circular" viewBox="25 25 50 50">' + '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10" />' + '</svg>' + '</div>';
						if (getApplicationLanguage() == "en") {
							loader += '<div class="ui-loader-desc">Please wait.. <br>Your data is being loaded</div>';
						} else {
							loader += "<div class='ui-loader-desc'>من فضلك انتظر..<br>جاري تحميل بياناتك</div>";
						}
						document.querySelector(".ui-loader").innerHTML = loader;
						$(".ui-loader").hide();
					}, 500);
					// Hide Text speech on arabic
				try{
					var language = getApplicationLanguage();
					if(language&&language=='ar'&&window.TextToSpeech&&window.TextToSpeech.isSpeechEnabled()){
						window.TextToSpeech.toggle();}}catch(e){console.log(e)}
				} catch (e) {
					$(".ui-loader").hide();
				}
			};
			self.close(function() {
				DataUtils.loadLanguage(newLanguage, onLoaded);
			});
		},
		isOpened: function() {
			return this._isOpened;
		},
		hide: function() {
			this.$el.hide();
		},
		show: function() {
			this.$el.show();
		},
		/**
		 * returns if side panel is currently showing
		 * @param none
		 * @return isShowing, boolean
		 */
		isShowing: function() {
			return this.$el.is(":visible");
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			this.close();
			this.$el.remove();
		}
	}, {
		CURRENT_CONTENT: ''
	});
	//	Returns the View class
	return SidePanel;
});

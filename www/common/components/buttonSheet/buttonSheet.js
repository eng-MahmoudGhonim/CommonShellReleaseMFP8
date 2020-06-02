(function () {
	"use strict";
	var bottonSheet = function () {
		this.init();
		window.currentBottonSheet=this;
	};
	bottonSheet.prototype = (function () {
		var sheetBottonControl,
			buttonSheetWrapper,
			buttonSheetIframe,
			buttonSheetBlack,
			scrollDown,
			closeButton,
			closeElement,
			applyForServices,
			isOffline = false,
			visible = false;

		function show(serviceId) {
			if (!isOffline) {
				 visible = true;
				if (serviceId) {
					//visible = true;
					sheetBottonControl.style.disple = "block";
					// sheetBottonControl.style.webkitTransform = "translate3d(0,0,0)";
					buttonSheetWrapper.style.webkitTransform = "translate3d(0,0,0)";
					buttonSheetBlack.style.opacity = 1;
					// get time 
					var DataUtils = require("com/utils/DataUtils");
					var time = 2000;
					if (DataUtils) {
						var loadedComponent = DataUtils.getLocalStorageData("buttonSheetLoaded", "shell");
						if (!loadedComponent) {
							DataUtils.setLocalStorageData("buttonSheetLoaded", JSON.stringify({
								"loaded": true
							}), true, "shell");
							time = 10000;
						}
					}
					var lang = getApplicationLanguage() == "ar" ? "ar" : "en";
					var constant = require("com/models/Constants");
					var url = null;
					if (DEVELOPMENT_MODE) {
						url = constant.ButtonSheetDevURL + serviceId + "&language=" + lang + "&date=" + Date.now() +"&version="+WL.Client.getAppProperty("APP_VERSION")+ "&app=" + constant.APP_ID;
						console.log(url);
					} else {
						url = constant.ButtonSheetProdURL + serviceId + "&language=" + lang + "&date=" + Date.now()+"&version="+WL.Client.getAppProperty("APP_VERSION")+ "&app=" + constant.APP_ID;
					}
					buttonSheetIframe.contentWindow.location.replace(url);
					$(".ui-loader").show();
					buttonSheetIframe.onload = function (e) {
						console.log(e);
						setTimeout(function () {
							buttonSheetIframe.style.display = "block";
							applyForServices.style.display = "block";
							$(".ui-loader").hide();
						}, time);
					};

				} else {
					hide();
				}
			}
			// hide loader if exist 
			setTimeout(function () {
				$(".ui-loader").hide();
			}, 15000);
		}

		function hide(e) {
			visible = false;
			debugger;
			$(".ui-loader").hide();
			if (e) e.preventDefault();
		
			buttonSheetWrapper.style.webkitTransform = "translate3d(0,120%,0)";

			setTimeout(function () {
				buttonSheetIframe.onload = null;
				buttonSheetIframe.contentWindow.location.replace("");
				buttonSheetIframe.style.display = "none";
				buttonSheetBlack.style.opacity = 0;
				// remove div from body
				var currentSheet = document.getElementById("sheetBottonControl");
				if (currentSheet) currentSheet.remove();
			}, 1000);
		}

		function init() {
			if (!navigator.onLine) {
				setTimeout(function () {
					showInternetProblemPopup();
					}, 100);

				isOffline = true;
				return;
			} else {
				isOffline = false;
				sheetBottonControl = document.createElement("div");
				sheetBottonControl.id = "sheetBottonControl";
				buttonSheetWrapper = document.createElement("div");
				buttonSheetWrapper.id = "buttonSheetWrapper";
				buttonSheetBlack = document.createElement("div");
				buttonSheetBlack.id = "buttonSheetBlack";
				closeButton = document.createElement("div");
				closeButton.id = "closeButton";
				closeElement = document.createElement("i");
				closeElement.id = "closeElement";
				closeElement.className += "mdi mdi-close";
				closeElement.addEventListener("click", function () {
					hide();
				});
				applyForServices = document.createElement("div");
				applyForServices.id = "applyForServices";
				applyForServices.className += "continueBtn waves-effect disabled";
				applyForServices.style.display = "none";
				applyForServices.addEventListener("click", function () {
					hide();
				});
				if (getApplicationLanguage() == "ar")
					applyForServices.innerHTML = "التقدم بطلب للحصول على الخدمة";
				else applyForServices.innerHTML = "Apply For Service";
				closeButton.appendChild(closeElement);
				buttonSheetIframe = document.createElement("iframe");
				buttonSheetIframe.id = "buttonSheetIframe";
				buttonSheetWrapper.appendChild(buttonSheetIframe);
				sheetBottonControl.appendChild(buttonSheetBlack);
				buttonSheetWrapper.appendChild(closeElement);
				sheetBottonControl.appendChild(buttonSheetWrapper);
				buttonSheetWrapper.appendChild(applyForServices);
				sheetBottonControl.style.disple = "none";
				document.body.appendChild(sheetBottonControl);
				buttonSheetBlack.onclick = hide;
			}

		}
		 function isVisible() {
	            return visible;
	        }
		return {
			init: init,
			show: show,
			hide: hide,
			onHide: null,
			visible: isVisible

		};
	})();
	window.BottonSheet = bottonSheet;
})();
(function() {
	var serviceTileControl = function(options) {
		this.init(options);
	}
	serviceTileControl.prototype = function() {
		var tileTemplate = '<div class="serviceTileCont dashboardTile">' + '<div class="expandButton"><i class="icon icon-dots-v"></i></div>' + '<div class="tileDataCont">' + '<div class="tileLoader"></div>' + '</div>' + '<div class="reloadCont">' + '<span class="icon-reload"></span>' + '<div>TAP TO RELOAD</div>' + '</div>' + '<div class="serviceListCtrl">' + '<div class="scrollArrow"><i class="icon icon-arrow-right"></i></div>' + '<div class="serviceList">' + '<div class="itemsScroller">' + '<!-- <div class="serviceListItem">item</div> -->' + '</div>' + '</div>' + '</div>' + '<div class="serviceTitle"></div>' + '</div>',
		tileLogoTemplate = '<div class="serviceLogo">' + '<div class="logo">' + '<i class="icon icon-service-fines"></i>' + '</div>' + '</div>';

		function openClose(e) {
			var el = e.currentTarget.parentElement
			el.serviceOpened ? closeServices(el) : openServices(el);
		}

		function openServices(el) {
			el.serviceOpened = true;
			el.serviceList.style.webkitTransform = "translate3d(0,0,0)";
			el.serviceListCtrl.style.webkitTransform = "translate3d(0,0,0)";
			el.expandButton.style.setProperty("background", tinycolor(el.options.category.Color).darken(10).toString(), "important");
			el.expandButton.className = "expandButton active";
			el.expandButton.getElementsByTagName('i')[0].style.webkitTransform = "rotateZ(90deg)";
			if (el.serviceTitle) {
				var xVal = 15;
				if (el.options.direction == "rtl") {
					xVal *= -1;
				}
				el.serviceTitle.style.webkitTransform = "translate3d(" + xVal + "px,0,0)";
			}
		}

		function closeServices(el) {
			el.serviceOpened = false;
			var vw = window.innerWidth;
			if (el.options.direction == "rtl") {
				vw *= -1;
			}
			el.serviceList.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			el.serviceListCtrl.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			el.expandButton.style.background = "rgba(0,0,0,0)";
			el.expandButton.className = "expandButton";
			el.expandButton.getElementsByTagName('i')[0].style.webkitTransform = "rotateZ(0deg)";
			if (el.serviceTitle) el.serviceTitle.style.webkitTransform = "";
		}

		function scrollServices(e) {
			var el = e.currentTarget.parentElement.querySelector(".serviceList");
			var scrollLeft = ((1 - ((el.scrollLeft / 81) - Math.trunc(el.scrollLeft / 81))) * 81);
			if (this.parentElement.parentElement.options.direction == "rtl") {
				scrollLeft *= -1;
			}
			el.scrollLeft += scrollLeft != 0 ? scrollLeft : 81;
		}

		function draw(direction, index) {
			closeServices(this.el);
			this.el.options.direction = direction;
			var vw = window.innerWidth;
			if (this.el.options.direction == "rtl") {
				vw *= -1;
			}
			this.el.serviceList.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			this.el.serviceListCtrl.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			
			var upTilesCount = document.getElementsByClassName('serviceTileCont');
			var _idExt= parseInt(index);
			if(upTilesCount && upTilesCount.length >0)
				_idExt = _idExt+parseInt(1);
				
			this.el.classList.add('dashboardTilechild' + _idExt);
			document.getElementById("serviceTiles").appendChild(this.el);
		}

		function changeTemplate(self, template) {
			self.hideReload();
			var currentTempName = self.options.template;
			self.options.template = template;
			var temp = self.options.contTemplates[self.options.template];
			var tempName = template;
			var tempElCont = document.createElement("div");
			tempElCont.innerHTML = temp.html;
			tempElCont.style.transitionDelay = "300ms";
			tempElCont.style.webkitTransform = "translate3d(0,100%,0)";
			tempElCont.className = tempName + " tempElCont";;
			if (currentTempName != "") {
				var currentTemp = self.el.querySelector("." + currentTempName);
				currentTemp.style.transitionDelay = "0ms";
			}
			self.el.querySelector(".tileDataCont").appendChild(tempElCont);
			setTimeout(function() {
				if (currentTempName != "") self.el.querySelector("." + currentTempName).style.webkitTransform = "translate3d(0,-100%,0)";
				tempElCont.style.webkitTransform = "";
				tempElCont.style.transform = "";
				tempElCont.style.transitionDelay = "";
				//                    tempElCont.removeAttribute("style")
				//                     tempElCont.removeAttribute("transform")
				setTimeout(function() {
					if (currentTempName != "") self.el.querySelector("." + currentTempName).parentElement.removeChild(self.el.querySelector("." + currentTempName));
				}, 300);
			}, 100);
			setTimeout(function() {
				self.options.contTemplates[self.options.template].control(tempElCont);
				if (self.options.category.dashboardURL != "") tempElCont.onclick = function() {
					mobile.changePage(self.options.category.dashboardURL);
				}
			});
		}

		function showReload() {
			var reloadEl = this.el.querySelector(".reloadCont");
			this.el.querySelector(".tileDataCont").style.webkitFilter = "blur(3px)";
			reloadEl.style.display = "block";
		}

		function hideReload() {
			var reloadEl = this.el.querySelector(".reloadCont");
			this.el.querySelector(".tileDataCont").style.webkitFilter = "";
			reloadEl.style.display = "none";
		}

		function init(options) {
			var div = document.createElement("div");
			div.innerHTML = tileTemplate;
			var el = div.firstChild;
			el.id = options.tileId;
			var logo = document.createElement("div");
			logo.innerHTML = tileLogoTemplate;
			if (getApplicationLanguage() == "en") {
				el.querySelector(".serviceTitle").innerText = options.category.TileNameEn
			} else {
				el.querySelector(".serviceTitle").innerText = options.category.TileNameAr
			}
			logo.querySelector("i").className = "icon " + options.category.Icon;
			if (options.category.dashboardURL != "") logo.querySelector(".logo").onclick = function() {
				mobile.changePage(options.category.dashboardURL);
			}
			el.appendChild(logo.firstChild);
			el.options = options;
			for (var i = 0; i < options.serviceList.length; i++) {
				
				var serviceItem = document.createElement("div");
				serviceItem.className = "serviceListItem";
				var isLoginRequired = options.serviceList[i].requireLogin;
				var authModel = require("com/models/shell/AuthenticationModel");
	        	var isloggedIn = authModel.isAuthenticated();
				var isLinkingRequired = options.serviceList[i].requireLinking;

	        	var _UserProfileModel= require ("com/models/shell/UserProfileModel");
	        	var isVipUser =_UserProfileModel.isVIPUserLocalStorage() ;
 				var isVIPService =options.serviceList[i].VIPService;
	        	if((!isloggedIn && isVIPService == true ) || (isloggedIn && isVIPService == true && !isVipUser)){
					//skip VIP Service
					continue;
				}
				if(isLoginRequired == true &&isloggedIn !=true){
					serviceItem.classList.add("require-login");
					var lockIcon= document.createElement("i");
					lockIcon.classList.add("icon");
					lockIcon.classList.add("icon-lock");
					serviceItem.appendChild(lockIcon);
				}else if(isloggedIn == true && isLinkingRequired == true ){
					serviceItem.classList.add("require-login");
					var lockIcon= document.createElement("i");
					lockIcon.classList.add("icon");
					lockIcon.classList.add("icon-lock");
					serviceItem.appendChild(lockIcon);
				}
				var serviceText = document.createElement("span");
				if (getApplicationLanguage() == "en") {
					serviceText.innerHTML = options.serviceList[i].ServiceNameEn;
				} else {
					serviceText.innerHTML = options.serviceList[i].ServiceNameAr;
				}
				serviceItem.appendChild(serviceText);
				serviceItem.pageUrl = options.serviceList[i].ServicePageUrl;
				
				if (isLoginRequired == true && isloggedIn !=true){
					serviceItem.onclick = function() {
						var loginOptions = {
						scenario: "changePage",
						url: this.pageUrl
						};
						window.LoginViewControl.show(loginOptions);
					}
				}else if(isloggedIn == true && isLinkingRequired == true ){
					serviceItem.onclick = function() {
					var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
					_DVDashboardModel.openSalikLinkPopup();};
				}else{
					if(isVIPService){
						serviceItem.onclick = function() {
							var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
							_DVDashboardModel.openEnquirePage();
						}
					}else {
					  serviceItem.onclick = function() {
						  mobile.changePage(this.pageUrl);
                      }
					}
					
//					serviceItem.onclick = function() {
//						mobile.changePage(this.pageUrl);
//					}
				}
				
				el.querySelector(".itemsScroller").appendChild(serviceItem);
			}
			el.serviceOpened = false;
			el.serviceTitle = el.querySelector(".serviceTitle")
			el.querySelector(".serviceLogo").style.background = options.category.Color;
			el.expandButton = el.querySelector(".expandButton");
			el.itemsScroller = el.querySelector(".itemsScroller");
			el.serviceListCtrl = el.querySelector('.serviceListCtrl');
			el.serviceList = el.querySelector('.serviceList');
			el.scrollArrow = el.querySelector('.scrollArrow');
			el.querySelector('.tileLoader').style.background = options.category.Color;
			el.scrollArrow.style.background = tinycolor(options.category.Color).darken(10).toString();
			el.scrollArrow.onclick = scrollServices;
			el.querySelector(".tileDataCont").style.color = options.category.Color;
			el.querySelector(".serviceListCtrl").style.background = options.category.Color;
			if (options.serviceList.length > 0) el.expandButton.onclick = openClose;
			el.querySelector(".reloadCont").onclick = function(e) {
				var el = e.currentTarget.parentElement;
				//select the current template
				var template = el.controlObject.options.contTemplates[el.controlObject.options.template];
				if (template.reload) {
					el.querySelector(".reloadCont span").className = "icon-reload active";
					template.reload(function(success) {
						el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							el.controlObject.hideReload();
						}
					});
				} else {
					el.querySelector(".reloadCont span").className = "icon-reload";
				}
			}
			var vw = window.innerWidth;
			if (el.options.direction == "rtl") {
				vw *= -1;
			}
			el.serviceList.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			el.serviceListCtrl.style.webkitTransform = "translate3d(" + (vw * -1) + "px,0,0)";
			el.controlObject = this;
			this.height = el.getBoundingClientRect().height;
			this.el = el;
			this.options = options;
		}
		return {
			init: init,
			draw: draw,
			set reload(value) {
				this.options.contTemplates[this.options.template].reload = value;
			},
			get reload() {
				return this.options.contTemplates[this.options.template].reload;
			},
			showReload: showReload,
			hideReload: hideReload,
			get template() {
				return this.options.template;
			},
			set template(value) {
				changeTemplate(this, value)
				//            	this.options.state = value;
			},
			showLoading: function() {
				this.el.querySelector(".tileLoader").style.display = "block";
			},
			hideLoading: function() {
				this.el.querySelector(".tileLoader").style.display = "none";
			},
			activateFavourite: function() {}
		}
	}();
	window.ServiceTileControl = serviceTileControl;
})();
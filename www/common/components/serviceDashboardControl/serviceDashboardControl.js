
/* JavaScript content from components/serviceDashboardControl/serviceDashboardControl.js in folder common */
﻿(function() {
	"use strict";
	window.ServiceDashboardControl = function(categoryId, infolinks,linkingObject) {
		var startX, endX, startY, touchExceeded = false,
		width, lang, favoritesModel, category;

		function getServiceObjectById(id) {
			var category = null;
			for (var i = 0; i < ServiceCategories.length; i++) {
				if (ServiceCategories[i].CategoryId == id) {
					category = ServiceCategories[i];
				}
			}
			return category;
		}
		var serviceItem = '<div class="serviceItem"><div class="serviceFace"><div class="title"><span class="icon-service-fav"></span><div></div></div><div class="loginBtn waves-effect">#Login# <i class="icon icon-lock"></i></div><div class="linkBtn waves-effect">#linkBtn# <i class="icon icon-lock"></i></div><span class="icon-service-right-arrow"></span></div><div class="addRemoveFavBtn"></div></div>';
		var infoItem = '<div class="infoItem"><span class="icon-info-circle-filled"></span><div class="title"></div></div>';

		function openService(e) {
			mobile.changePage(this.ServicePageUrl);
		}

		function infoLinkClick(e) {
			var action = this.clickBehavior;
			if (action != null && action != undefined) {
				if (typeof action == "string") {
					mobile.changePage(action);
				} else if (typeof action == "function") {
					action();
				}
			}
		}

		function addRemoveFav(e) {
			var self = this;
			var service = self.service;
			var index = self.index;
			var isFav = self.isFav;
			//var el = document.querySelectorAll("#serviceDashboardContainer .serviceItem")[index];
			var el=e.target.parentElement.parentElement;
			if (isFav) {
				favoritesModel.removeFavorite(service.ServiceId, function() {
					self.isFav = false;
					el.querySelector('.serviceFace .icon-service-fav').style.display = "none";
					if (lang == "en") {
						el.querySelector(".addRemoveFavBtn div").textContent = "Add to favourites";
					} else {
						el.querySelector(".addRemoveFavBtn div").textContent = "اضف للمفضلة";
					}
				});
			} else {
				favoritesModel.addFavorite(service.ServiceId, function() {
					self.isFav = true;
					el.querySelector('.serviceFace .icon-service-fav').style.display = "inline-block";
					if (lang == "en") {
						el.querySelector(".addRemoveFavBtn div").textContent = "Remove from favourites";
					} else {
						el.querySelector(".addRemoveFavBtn div").textContent = "امسح من المفضلة";
					}
				});
			}
			var face = el.querySelector('.serviceFace');
			face.style.transitionDuration = "200ms";
			face.val = 0;
			face.style.webkitTransform = "translate3d(" + face.val + "px,0,0)";
			setTimeout(function() {
				face.style.transitionDuration = "0ms";
			}, 200);
		}

		function ontouchstart(e) {
			startX = endX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			var el = e.currentTarget;
			width = el.getBoundingClientRect().width;
			el.ontouchmove = ontouchmove;
			el.ontouchend = ontouchend;
		}

		function ontouchmove(e) {
			if (touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) {
				e.preventDefault();
				touchExceeded = true;
				var el = e.currentTarget;
				el.val += e.touches[0].clientX - endX;
				if (lang == "en") {
					if (el.val < 0) el.val = 0;
					if (el.val > width / 2) el.val = width / 2;
				} else {
					if (el.val > 0) el.val = 0;
					if (el.val < -width / 2) el.val = -width / 2;
				}
				e.currentTarget.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";
				endX = e.touches[0].clientX;
			}
		}

		function ontouchend(e) {
			var el = e.currentTarget;
			touchExceeded = false;
			el.style.transitionDuration = "200ms";
			if (lang == "en") {
				if (el.val < width / 4) {
					el.val = 0;
				} else {
					el.val = width / 2;
				}
			} else {
				if (el.val > -width / 4) {
					el.val = 0;
				} else {
					el.val = -width / 2;
				}
			}
			el.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";
			setTimeout(function() {
				el.style.transitionDuration = "0ms";
			}, 200);
			el.ontouchmove = null;
			el.ontouchend = null;
		}
		//Constructor
		;
		(function() {
			favoritesModel = require("com/models/shell/UserFavoritesModel");
			var authModel = require("com/models/shell/AuthenticationModel");
			var isloggedIn = authModel.isAuthenticated()
			category = getServiceObjectById(categoryId);
			var cont = document.querySelector("#serviceDashboardContainer");
			if (!cont) return;
			lang = getApplicationLanguage();
			var _UserProfileModel= require ("com/models/shell/UserProfileModel");
			var isVipUser =_UserProfileModel.isVIPUserLocalStorage() ;

			for (var i = 0; i < category.CategoryServices.length; i++) {
                
				var isVIPService = category.CategoryServices[i].VIPService;
				if((!isloggedIn && isVIPService == true ) || (isloggedIn && isVIPService == true && !isVipUser)){
					//skip VIP Service
					continue;
				}
//				if (isloggedIn && isVIPService == true && !isVipUser) {
//					continue;
//				}


				var item = document.createElement('div');
				
				serviceItem=serviceItem.replace("#Login#",localize("%shell.login.title%"));
				if (isloggedIn == true && category.CategoryServices[i].requireLinking && category.CategoryServices[i].linkBtnTextEn)
				{
					if (lang == "en") {
						serviceItem=serviceItem.replace("#linkBtn#",localize(category.CategoryServices[i].linkBtnTextEn));
					} else {
						serviceItem=serviceItem.replace("#linkBtn#",localize(category.CategoryServices[i].linkBtnTextAr));
					}
				}
				item.innerHTML = localize(serviceItem);
                  // fix vib set service Id
                   item.querySelector(".serviceItem").setAttribute("serviceId",category.CategoryServices[i].ServiceId);

				item.querySelector(".addRemoveFavBtn").innerHTML = '<span class="icon-service-fav"></span><div></div>';
				if (lang == "en") {
					item.querySelector('.title div').innerHTML = category.CategoryServices[i].ServiceNameEn;
				} else {
					item.querySelector('.title div').innerHTML = category.CategoryServices[i].ServiceNameAr;
				}
				item.querySelector(".serviceFace").val = 0;
				item.querySelector(".serviceFace").ServicePageUrl = category.CategoryServices[i].ServicePageUrl;
				
				
				
				if(isVIPService){
					
					item.querySelector(".serviceFace").onclick =   function() {
						var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
						_DVDashboardModel.openEnquirePage();
					}
				}else {
					item.querySelector(".serviceFace").onclick = openService;
					 
				}
				
				item.querySelector(".addRemoveFavBtn").index = i;
				item.querySelector(".addRemoveFavBtn").service = category.CategoryServices[i];
				item.querySelector(".addRemoveFavBtn").onclick = addRemoveFav;
				item.firstChild.style.color = category.Color;
				if (!isloggedIn && category.CategoryServices[i].requireLogin) item.firstChild.className = "serviceItem requireLogin";
				if (isloggedIn && category.CategoryServices[i].requireLinking)item.firstChild.className = "serviceItem requireLinking";

				item.querySelector(".loginBtn").onclick = function(e) {
					e.stopPropagation()
					var loginRegisterPopup = new Popup("loginRegisterPopup");
					loginRegisterPopup.show();
				}
				item.querySelector(".linkBtn").onclick = function(e) {
					e.stopPropagation()
					if (typeof linkingObject == "object" && typeof linkingObject.linkingFunction == "function"){
//						if (linkingObject.linkingCondition == true)
						linkingObject.linkingFunction(e);
					}else{
						console.warn("please configure linkingFunction")
					}
				}
				cont.appendChild(item.firstChild);
			}
			favoritesModel.getFavoriteList(function(userFavoritServicesList) {
				var items = cont.querySelectorAll(".serviceItem");
				for (var k = 0; k < items.length; k++) {
                    //get serviceId
					var serviceId=items[k].getAttribute("serviceId");
					var isFav =serviceId?userFavoritServicesList.hasOwnProperty(serviceId):false;

					if (lang == "en") {
						if (isFav) {
							items[k].querySelector(".addRemoveFavBtn div").textContent = "Remove from favourites";
						} else {
							items[k].querySelector(".addRemoveFavBtn div").textContent = "Add to favourites";
						}
					} else {
						if (isFav) {
							items[k].querySelector(".addRemoveFavBtn div").textContent = "امسح من المفضلة";
						} else {
							items[k].querySelector(".addRemoveFavBtn div").textContent = "اضف للمفضلة";
						}
					}
					if (isFav) {
						items[k].querySelector('.serviceFace .icon-service-fav').style.display = "inline-block";
					} else {
						items[k].querySelector('.serviceFace .icon-service-fav').style.display = "none";
					}
					if (isloggedIn) items[k].querySelector(".serviceFace").ontouchstart = ontouchstart;
					items[k].querySelector(".addRemoveFavBtn").isFav = isFav;
				}
			});
			for (var j = 0; j < infolinks.length; j++) {
				var temp = document.createElement('div');
				temp.innerHTML = infoItem;
				if (lang == "en") {
					temp.querySelector('.title').textContent = infolinks[j].nameEn;
				} else {
					temp.querySelector('.title').textContent = infolinks[j].nameAr;
				}
				temp.firstChild.clickBehavior = infolinks[j].onclick;
				temp.firstChild.onclick = infoLinkClick;
				cont.appendChild(temp.firstChild);
			}
		})();
	}
})();
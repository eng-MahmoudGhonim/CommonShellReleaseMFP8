
/* JavaScript content from components/serviceDashboardWithTabsControl/serviceDashboardWithTabsControl.js in folder common */

/* JavaScript content from components/serviceDashboardWithTabsControl/serviceDashboardWithTabsControl.js in folder common */
﻿﻿(function() {
	"use strict";
	window.serviceDashboardWithTabsControl = function(categoryId, infolinks,linkingObject,tabOptions) {
		// VARS
		var startX, endX, startY, touchExceeded = false,
		width, lang, favoritesModel, category;

		var serviceItem = '<div class="serviceItem"><div class="serviceFace"><div class="title"><span class="icon-service-fav"></span><div></div></div><div class="loginBtn waves-effect">#Login# <i class="icon icon-lock"></i></div><div class="linkBtn waves-effect">#linkBtn# <i class="icon icon-lock"></i></div><span class="icon-service-right-arrow"></span></div><div class="addRemoveFavBtn"></div></div>';
		var infoItem = '<div class="infoItem" id="#ID#"><span id="icon" class="icon-info-circle-filled"></span><div class="title"></div></div>';



		function getServiceObjectById(id) {
			try{
				var category = null;
				if(id){
					for (var i = 0; i < ServiceCategories.length; i++) {
						if (ServiceCategories[i].CategoryId == id) {
							category = ServiceCategories[i];
						}
					}
				}
				return category;
			}catch(e){
				console.log(e);
				return;
			}

		}

		function openService(e) {
			mobile.changePage(this.ServicePageUrl);
		}

		function infoLinkClick(e) {
			try{
				var action = this.clickBehavior;
				if (action != null && action != undefined) {
					if (typeof action == "string") {
						mobile.changePage(action);
					} else if (typeof action == "function") {
						action();
					}
				}
			}catch(e){
				console.log(e);
				return;
			}
		}

		function addRemoveFav(e) {
			try{
				var self = this;
				var service = self.service;
				var index = self.index;
				var isFav = self.isFav;
				//var el = document.querySelectorAll(".serviceTabDashboardContainer .serviceItem")[index];
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
			}catch(e){
				console.log(e);
				return;
			}

		}


		function ontouchstart(e) {
			try{
				startX = endX = e.touches[0].clientX;
				startY = e.touches[0].clientY;
				var el = e.currentTarget;
				width = el.getBoundingClientRect().width;
				el.ontouchmove = ontouchmove;
				el.ontouchend = ontouchend;
			}catch(e){
				console.log(e);
				return;
			}

		}

		function ontouchmove(e) {
			try{
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
			}catch(e){
				console.log(e);
				return;
			}

		}

		function ontouchend(e) {
			try{
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
			}catch(e){
				console.log(e);
				return;
			}
		}

		function createTabs(tabOptions){
			try{
				lang = getApplicationLanguage();
				var header ="";
				for(var i=0 ;i<tabOptions.length;i++){
					var tabName=lang=="en"?tabOptions[i].tabNameEn:tabOptions[i].tabNameAr;
					header+='<div class="head waves-effect">'+tabName+'</div>';
				}

				var content=""
					for(var j=0 ;j<tabOptions.length;j++){
						content+='<div  class="serviceTabDashboardContainer tabContent"></div>'
					}
				return '<div class="tabsHead">'+header+'<div class="bar"></div></div> '+
				'<div id="tabsContent" class="tabsContent guestSidePanel">'+content+'</div>'
			}catch(e){
				console.log(e);
				return;
			}
		};

		//Constructor
		(function() {
			try{
				favoritesModel = require("com/models/shell/UserFavoritesModel");
				var authModel = require("com/models/shell/AuthenticationModel");
				var isloggedIn = authModel.isAuthenticated()
				category = getServiceObjectById(categoryId);
				var item=document.querySelector('#serviceTabDashboard');
				var color=category.Color;
				// create Tabs
				item.classList.add("tabsCont");
				var tabs=createTabs(tabOptions);
				if(!tabs)return;
				item.innerHTML = tabs;
				var options = {
						startIndex: 0,
						touchEnabled: false,
						onIndexChange: item.onMainTabChanged=function(index){
							if(index==0){
                  var firstTab=document.querySelectorAll(".firstCategory").length;
                  document.getElementById("serviceTabDashboard").style.height=firstTab * 47 +"px";
							}else{
					var secondTab=document.querySelectorAll(".secondCategory").length;
					 document.getElementById("serviceTabDashboard").style.height=secondTab * 47 +"px";
							}
					

							// color of tabs
							var tabsHeadColor=document.querySelectorAll("#serviceTabDashboard .tabsHead .head ")
							if(tabsHeadColor){
								for (var i = 0; i < tabsHeadColor.length; i++) {
									tabsHeadColor[i].style.color="#777";
								}
							}	
							document.querySelector("#serviceTabDashboard .tabsHead  .active").style.color=color;
							document.querySelector("#serviceTabDashboard .tabsHead .bar").style.background=color;
						},
						direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl"
				};
				var tabs = new Tabs(item,options);

				lang = getApplicationLanguage();
				var _UserProfileModel= require ("com/models/shell/UserProfileModel");
				var isVipUser =_UserProfileModel.isVIPUserLocalStorage() ;
			
				for (var i = 0; i < category.CategoryServices.length; i++) {

					var isVIPService = category.CategoryServices[i].VIPService;
					if((!isloggedIn && isVIPService == true ) || (isloggedIn && isVIPService == true && !isVipUser)){
						//skip VIP Service
						continue;
					}
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
					item.querySelector(".serviceItem").setAttribute("ServiceId", category.CategoryServices[i].ServiceId);
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
					item.firstChild.style.color = color;
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
//							if (linkingObject.linkingCondition == true)
							linkingObject.linkingFunction(e);
						}else{
							console.warn("please configure linkingFunction")
						}
					}
					var setItemInTab=tabOptions;
					var serviceSubCategoriesId =category.CategoryServices[i].serviceSubCategoriesId;

					if(serviceSubCategoriesId==0)
				      item.querySelector(".serviceItem").classList.add("firstCategory")
					else
					item.querySelector(".serviceItem").classList.add("secondCategory")
					
					if(serviceSubCategoriesId !=undefined){
						var tabContent=document.getElementsByClassName("serviceTabDashboardContainer");
						if(tabContent&&tabContent.length>=serviceSubCategoriesId)
						    var serviceSubCategories=document.getElementsByClassName("serviceTabDashboardContainer")[serviceSubCategoriesId];
						serviceSubCategories?serviceSubCategories.append(item.firstChild):"";

					}

					
				}
				favoritesModel.getFavoriteList(function(userFavoritServicesList) {
					var items = document.querySelectorAll(".serviceTabDashboardContainer .serviceItem");

					for (var k = 0; k < items.length; k++) {
						var isFav = userFavoritServicesList.hasOwnProperty(items[k].getAttribute("serviceid"));
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
						if (isloggedIn) 
							items[k].querySelector(".serviceFace").ontouchstart = ontouchstart;
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
					if (infolinks[j].className == undefined){
						infolinks[j].className = "icon-info-circle-filled"
					}
					if (infolinks[j].itemId == undefined){
						infolinks[j].itemId = ""
					}
					temp.querySelector('#icon').className = infolinks[j].className
					temp.querySelector('.infoItem').id = infolinks[j].itemId
					temp.firstChild.clickBehavior = infolinks[j].onclick;
					temp.firstChild.onclick = infoLinkClick;
					if(infolinks&&infolinks.length>0){
              

						var serviceTabDashboard= document.getElementsByClassName("serviceTabDashboardContainer")[infolinks[j].serviceSubCategoriesId];
						if([infolinks[j].serviceSubCategoriesId]==0)
				      temp.querySelector(".infoItem").classList.add("firstCategory")
					else   
                        temp.querySelector(".infoItem").classList.add("secondCategory")
						serviceTabDashboard?serviceTabDashboard.append(temp.firstChild):"";
					}
				}


				
			}catch(e){
				console.log(e);
				return;
			}
		})();
	}
})();

define(["com/models/Constants", "com/views/PageView", "com/views/Header", "com/models/shell/AuthenticationModel","com/models/shell/UserProfileModel"], function(Constants, PageView, Header, AuthenticationModel,UserProfileModel) {
	var SearchPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap #cancelSearch': 'cancelSearch'
		},
		initialize: function(options) {
			SearchPageViewInstane = this;
			options.hideFooter = true;
			options.hideHeader = true;
			options.enabledInternetManagament=false;
			PageView.prototype.initialize.call(this, options);
		},
		cancelSearch: function() {
			if(!(window.TextToSpeech&&window.TextToSpeech.isSpeakerEnabled())){
						history.back();
					}
		},
		getUserPopularSearch: function() {
			var currentApp = Constants.APP_ID
			var popularSearchList = (currentApp == "RTA_Drivers_And_Vehicles") ? popularSearchListDuabiDrive : popularSearchListCorporate;
			var lang = (getApplicationLanguage() == 'en') ? "en" : "ar";
			document.getElementById("popularSearch").innerHTML = "";
			var header = document.createElement("i");
			header.innerText = localize("%shell.search.PopularSearches%");
			document.getElementById("popularSearch").appendChild(header);


			var popularSearch1 = document.createElement("div");

			currentApp == "RTA_Drivers_And_Vehicles" ? popularSearch1.classList.add("popularSearchItems") : popularSearch1.classList.add("popularSearchItemsCorporate");
			var popular = document.createElement("span");
			popular.onclick = function(e) {
				mobile.changePage(popularSearchList[0].URL);
			}

			popular.innerText = popularSearchList[0].Name[lang];
			popularSearch1.appendChild(popular)

			var popular = document.createElement("span");
			popular.innerText = popularSearchList[1].Name[lang];
			popular.onclick = function(e) {
				mobile.changePage(popularSearchList[1].URL);
			}
			popularSearch1.appendChild(popular)

			var popular = document.createElement("span");
			popular.innerText = popularSearchList[2].Name[lang]
			popular.onclick = function(e) {
				mobile.changePage(popularSearchList[2].URL);
			}
			popularSearch1.appendChild(popular)

			document.getElementById("popularSearch").appendChild(popularSearch1);

			var popularSearch2 = document.createElement("div");
			currentApp == "RTA_Drivers_And_Vehicles" ? popularSearch2.classList.add("popularSearchItems") : popularSearch2.classList.add("popularSearchItemsCorporate");
			var popular = document.createElement("span");
			popular.innerText = popularSearchList[3].Name[lang];
			popular.onclick = function(e) {
				mobile.changePage(popularSearchList[3].URL);
			}
			popularSearch2.appendChild(popular)

			var popular = document.createElement("span");
			popular.innerText = popularSearchList[4].Name[lang];
			popular.onclick = function(e) {
				mobile.changePage(popularSearchList[4].URL);
			}
			popularSearch2.appendChild(popular)

			document.getElementById("popularSearch").appendChild(popularSearch2);

		},


		searchServicesLogic: function(searchText) {
			var searchResult = [];
			for (var i = 0; i < ServiceCategories.length; i++) {
				var cat = {
						catIndex: null,
						CategoryId: ServiceCategories[i].CategoryId,
						CategoryNameAr: ServiceCategories[i].CategoryNameAr,
						CategoryNameEn: ServiceCategories[i].CategoryNameEn,
						Color: ServiceCategories[i].Color,
						Icon: ServiceCategories[i].Icon,
						CategoryServices: []

				};

				var matchData = false;
				for (var j = 0; j < ServiceCategories[i].CategoryServices.length; j++) {
					var subService = ServiceCategories[i].CategoryServices[j];
					if (subService.ServiceNameEn.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || subService.ServiceNameAr.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
						matchData = true;
						var isVIP=subService.VIPService?true:false;
						var serviceItem = {
								ServiceId: subService.ServiceId,
								ServiceNameAr: subService.ServiceNameAr,
								ServiceNameEn: subService.ServiceNameEn,
								ServicePageUrl: subService.ServicePageUrl,
								requireLogin: subService.requireLogin,
								VIPService:subService.VIPService,
								requireLinking : subService.requireLinking,
						}
						cat.CategoryServices.push(serviceItem);
					}
				}
				//}
			// check if found match
			if (matchData) {
				searchResult.push(cat);
			}
		}
			console.log(searchResult);
			return searchResult;
		},
		searchServices: function(searchText) {
			document.getElementById("NoSearchResult").style.display = "none";
			var visibleHeads = [];
			if (searchText) {
				document.querySelector(".searchCont i").style.color = "#ee0000";
				document.getElementById("searchResultCount").style.display = "none";


				var ServiceCategories = SearchPageViewInstane.searchServicesLogic(searchText);
				if (ServiceCategories && ServiceCategories.length > 0) {
					document.getElementById("ServicesSearchResult").style.display = "block";
					document.getElementById("ServicesSearchResult").innerHTML = "";


					for (var i = 0; i < ServiceCategories.length; i++) {
						var subServiceCount = " " + "(" + ServiceCategories[i].CategoryServices.length + ")";
						var categoryTemplate = document.querySelector("#templateserviceCategory").cloneNode(true);
						categoryTemplate.removeAttribute("id");
						categoryTemplate.style.display = "block";
						categoryTemplate.classList.add("categoryBlock")

						categoryTemplate.querySelector("i").className = "icon " + ServiceCategories[i].Icon;
						categoryTemplate.style.border = "1px solid " + ServiceCategories[i].Color;
						// categoryTemplate.style.marginBottom ="10px";

						if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
							categoryTemplate.querySelector("i").style.color = ServiceCategories[i].Color;
							categoryTemplate.querySelector(".categoryHeader").style.background = ServiceCategories[i].Color;
						}
						if (getApplicationLanguage() == "en") {
							categoryTemplate.querySelector(".categoryHeader span").innerText = ServiceCategories[i].CategoryNameEn;
							categoryTemplate.querySelector(".categoryHeader .servicesCount").innerText = subServiceCount;
						} else {
							categoryTemplate.querySelector(".categoryHeader span").innerText = ServiceCategories[i].CategoryNameAr;
							categoryTemplate.querySelector(".categoryHeader .servicesCount").innerText = subServiceCount;
						}

						  var subcatCounter=0;
						for (var k = 0; k < ServiceCategories[i].CategoryServices.length; k++) {
							var isVipUser = UserProfileModel.isVIPUserLocalStorage();
							var isloggedIn = AuthenticationModel.isAuthenticated();
							var isVIPService = ServiceCategories[i].CategoryServices[k].VIPService;
							if ((!isloggedIn && isVIPService == true) || (isloggedIn && isVIPService == true && !isVipUser)) {
								//skip VIP Service
							//	var counterVIP=counterHeader-1;
							//	servicesCount--;
								//head.querySelector(".count").innerText = "(" + counterVIP + ")";
								continue;
							}
							subcatCounter++;
							var itemText = null;
							if (getApplicationLanguage() == "en") {
								itemText = ServiceCategories[i].CategoryServices[k].ServiceNameEn;
							} else {
								itemText = ServiceCategories[i].CategoryServices[k].ServiceNameAr;
							}
							var isLoginRequired = ServiceCategories[i].CategoryServices[k].requireLogin;
							var isLinkingRequired = ServiceCategories[i].CategoryServices[k].requireLinking;
							var allowDivClick = true;

							var serviceName = document.createElement("div");
							serviceName.classList.add("serviceBodyitems");
							serviceName.innerHTML = itemText;
//							For testing
//							isloggedIn=true;
							if (isLoginRequired == true && !isloggedIn) {
//							if (isLoginRequired == true && !AuthenticationModel.isAuthenticated()) {
								allowDivClick = true;
								serviceName.innerHTML = itemText;
								serviceName.classList.add("require-login");

								var loginButton = document.createElement("div");
								loginButton.classList.add("loginBtn-servicelist");
								loginButton.classList.add("waves-effect");
								loginButton.innerText = localize("%shell.login.title%");
								var lockIcon = document.createElement("i");
								lockIcon.classList.add("icon");
								lockIcon.classList.add("icon-lock");
								loginButton.appendChild(lockIcon);
								loginButton.onclick = function(e) {
									var loginOptions = {
											scenario: "changePage",
											url: e.target.parentElement.url
									};
									window.LoginViewControl.show(loginOptions);
								}
								serviceName.appendChild(loginButton);
							}else if (isloggedIn && isLinkingRequired == true) {
								allowDivClick = false;
								serviceName.innerText = itemText;
								serviceName.classList.add("require-linking");
								var linkButton = document.createElement("div");
								linkButton.classList.add("linkingBtn-servicelist");
								linkButton.classList.add("waves-effect");
								linkButton.innerText = localize("%shell.myAccount.LinkSalikAccount%");
								var lockIcon = document.createElement("i");
								lockIcon.classList.add("icon");
								lockIcon.classList.add("icon-lock");
								linkButton.appendChild(lockIcon);
								linkButton.onclick = function (e) {
									document.dispatchEvent(linkActionButton);
								}
								serviceName.appendChild(linkButton);
							}

							if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
								serviceName.style.color = ServiceCategories[i].Color;
							}
							serviceName.url = ServiceCategories[i].CategoryServices[k].ServicePageUrl;
							serviceName.data = ServiceCategories[i].CategoryServices[k];

							if (isLoginRequired == true && !AuthenticationModel.isAuthenticated()) {
								//								item.onclick = function(e) {
								//								var loginOptions = {
								//								scenario: "changePage",
								//								url: e.currentTarget.url
								//								};
								//								window.LoginViewControl.show(loginOptions);
								////								mobile.changePage(e.currentTarget.url);
								//								}
							} else {
								if (allowDivClick == true) {
									if(isVIPService){
										serviceName.onclick = function() {
											var _DVDashboardModel = require("com/models/drivers_and_vehicles/DVDashboardModel");
											_DVDashboardModel.openEnquirePage();
										}
									}else {
										serviceName.onclick = function(e) {
											mobile.changePage(e.currentTarget.url);
									  }
									}
								}
//								serviceName.onclick = function(e) {
//									mobile.changePage(e.currentTarget.url);
//								}
							}
							categoryTemplate.querySelector(".categoryBody").appendChild(serviceName);
						}
						var subServiceCount = " " + "(" + subcatCounter + ")";
						categoryTemplate.querySelector(".categoryHeader .servicesCount").innerText = subServiceCount;
                      if(subcatCounter>0)
						document.getElementById("ServicesSearchResult").appendChild(categoryTemplate);
					}
				} else {
					/*document.getElementById("ServicesSearchResult").style.display="block";
               document.getElementById("ServicesSearchResult").innerHTML="";
               var noResult = document.createElement("span");
               noResult.classList.add("noResultFound");
               noResult.innerHTML="No Result Found"//localize("%shell.login.noResultFound%");
               document.getElementById("ServicesSearchResult").appendChild(noResult);*/
					document.getElementById("searchResultCount").style.display = "none";
					document.getElementById("ServicesSearchResult").style.display = "none";
					document.getElementById("NoSearchResult").style.display = "block";
				}
			}
			// show other result
			else {

				document.querySelector(".searchCont i").style.color = "";
				document.getElementById("searchResultCount").style.display = "block";
				document.getElementById("ServicesSearchResult").style.display = "none";
				SearchPageViewInstane.getUserPopularSearch();

			}
		},
		onPageShow: function() {
			document.getElementById("searchResultCount").style.display = "block";
			document.getElementById("ServicesSearchResult").style.display = "none";
			document.getElementById("NoSearchResult").style.display = "none";
			SearchPageViewInstane.getUserPopularSearch();
			//SearchPageView.getUserPopularSearch();
			//SearchPageViewInstane.bindServices();
			var timer = null;
			document.getElementById("deleteSearchText").onclick=function(e){
				document.getElementById("SearchText").value="";
				SearchPageViewInstane.searchServices("");
				document.getElementById("deleteSearchText").style.display="none";
				SearchPageViewInstane.exitClicked=true;
			}
			document.getElementById("SearchText").oninput = function(e) {
				if (e) e.preventDefault();
				clearTimeout(timer);
				var val = this.value;
				if(isUndefinedOrNullOrBlank(val)){
					document.getElementById("deleteSearchText").style.display="none";
//					return;
				}else {
					document.getElementById("deleteSearchText").style.display="block";
				}
				timer = setTimeout(function() {
					if(SearchPageViewInstane.exitClicked != true) {
						SearchPageViewInstane.searchServices(val);
					}
					else {
						SearchPageViewInstane.exitClicked=false;
					}
				}, 1000)
			}
			//	document.getElementById("#searchResultCount")
		},
		dispose: function() {
			//   PageView.prototype.dispose.call(this);
		}
	});
	return SearchPageView;
});

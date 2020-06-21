define(["com/views/PageView", "com/views/Header", "com/models/drivers_and_vehicles/DVDashboardModel", "com/models/Constants", "com/models/shell/CustomerSupportCenterModel"], function(PageView, Header, DVDashboardModel, Constants, CustomerSupportCenterModel) {
	var ContactRtaPageView = PageView.extend({
		events: {
			pageshow: "onPageShow"
		},
		initialize: function(options) {
			options.phoneTitle = localize("%shell.footer.HelpCenter%");
			options.subTitle=localize("%shell.contactrta.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
			contactRtaObj = this;
		},
		initTabs: function() {
			var options = {
					startIndex: 0,
					touchEnabled: false,
					direction: getApplicationLanguage() == "en" ? "ltr" : "rtl"
			};
			new Tabs(document.querySelector("#ContactRtaPage .tabsCont"), options);
		},

		successLocation: function(position) {
			console.log("successLocation")
			console.log(contactRtaObj.data)
			contactRtaObj.lat = position.coords.latitude;
			contactRtaObj.long = position.coords.longitude;
			var rtaCenter = {
					LATITUDE: 25.234241,
					LONGITUDE: 55.356575
			};
			var distanceBetweenLocations = getDistanceFromLatLonInKm(contactRtaObj.lat, contactRtaObj.long, rtaCenter.LATITUDE, rtaCenter.LONGITUDE);
			if (distanceBetweenLocations < 1) {
				document.querySelector("#headOfficeDistance").innerText = Math.round(distanceBetweenLocations * 1000) + localize("%shell.dashboard.drivemodetile.meter%");
			} else {
				document.querySelector("#headOfficeDistance").innerText = Math.round(distanceBetweenLocations) + localize("%shell.greenpoints.km%");
			}
			for (var i = 0; i < contactRtaObj.data.salik.length; i++) {
				var Salikdistance = getDistanceFromLatLonInKm(contactRtaObj.lat, contactRtaObj.long, contactRtaObj.data.salik[i].pos[0], contactRtaObj.data.salik[i].pos[1]);
				var intdist = Salikdistance < 1 ? Math.round(Salikdistance * 1000) + localize("%shell.dashboard.drivemodetile.meter%") : Math.round(Salikdistance) + localize("%shell.greenpoints.km%");
				contactRtaObj.data.salik[i].ditsance = intdist;
			}
			for (var i = 0; i < contactRtaObj.data.services.length; i++) {
				var distance = getDistanceFromLatLonInKm(contactRtaObj.lat, contactRtaObj.long, contactRtaObj.data.services[i].geometry.y, contactRtaObj.data.services[i].geometry.x);
				var intdist = distance < 1 ? Math.round(distance * 1000) + localize("%shell.dashboard.drivemodetile.meter%") : Math.round(distance) + localize("%shell.greenpoints.km%");
				contactRtaObj.data.services[i].attributes.ditsance = intdist;
			}
			// happinessCenters
			for (var i = 0; i < contactRtaObj.data.kiosks.happinessCenters.length; i++) {
				var distance = getDistanceFromLatLonInKm(contactRtaObj.lat, contactRtaObj.long, contactRtaObj.data.kiosks.happinessCenters[i].geometry.y, contactRtaObj.data.kiosks.happinessCenters[i].geometry.x);
				var intdist = distance < 1 ? Math.round(distance * 1000) + localize("%shell.dashboard.drivemodetile.meter%") : Math.round(distance) + localize("%shell.greenpoints.km%");
				contactRtaObj.data.kiosks.happinessCenters[i].attributes.ditsance = intdist;
			}
			//Kiosks  salikNol Data
			for (var i = 0; i < contactRtaObj.data.kiosks.salikNol.length; i++) {
				var distance = getDistanceFromLatLonInKm(contactRtaObj.lat, contactRtaObj.long, contactRtaObj.data.kiosks.salikNol[i].geometry.y, contactRtaObj.data.kiosks.salikNol[i].geometry.x);
				var intdist = distance < 1 ? Math.round(distance * 1000) + localize("%shell.dashboard.drivemodetile.meter%") : Math.round(distance) + localize("%shell.greenpoints.km%");
				contactRtaObj.data.kiosks.salikNol[i].attributes.ditsance = intdist;
			}
			contactRtaObj.bindData(contactRtaObj.data);
		},
		errorLocation: function(error) {
			contactRtaObj.bindData(contactRtaObj.data);
			var locationErrorPopup_Options = {
					popupId: "locationErrorPopup",
					title: localize("%shell.popup.error.title%"),
					content: localize("%shell.locationError%"),
					primaryBtnText: localize("%shell.dialog.button.ok%"),
					primaryBtnCallBack: null,
					primaryBtnDisabled: false,
					secondaryBtnText: localize("%shell.sms.label%"),
					secondaryBtnCallBack: null,
					secondaryBtnVisible: false,
					secondaryBtnDisabled: false,
					hideOnPrimaryClick: true,
					hideOnSecondaryClick: true,
					aroundClickable: true,
					onAroundClick: null
			};
			var locationErrorPopup = new Popup(locationErrorPopup_Options);
			locationErrorPopup.show();
		},
		initPageListener: function() {
			try {
				contactRtaObj.applyScrollEffect(document.querySelectorAll("#ContactRtaPage .servicesList")[0]);
				contactRtaObj.applyScrollEffect(document.querySelectorAll("#ContactRtaPage .servicesList")[1]);
				document.getElementById("searchServices").onkeydown = function(event) {
					if (event.keyCode == 13) {
						document.activeElement.blur();
					}
					return;
				};
				document.getElementById("salikSearchInput").onkeydown = function(event) {
					if (event.keyCode == 13) {
						document.activeElement.blur();
					}
					return;
				};
				document.querySelector("#sheetCover").onclick = contactRtaObj.closeButtomSheet;
				contactRtaObj.activeService = "services";
				document.querySelector("#radio1").onclick = contactRtaObj.toggleServiceList;
				document.querySelector("#radio2").onclick = contactRtaObj.toggleServiceList;
				document.querySelector("#emergency").onclick = contactRtaObj.onCallEmergency;
				document.querySelector("#tollfree").onclick = contactRtaObj.onCallTollFree;
				document.querySelector("#facebookBtn").onclick = contactRtaObj.onClickfacebookBtn;
				document.querySelector("#twitterBtn").onclick = contactRtaObj.onClicktwitterBtn;
				document.querySelector("#instagramBtn").onclick = contactRtaObj.onClickinstagramBtn;
				document.querySelector("#linkedinBtn").onclick = contactRtaObj.onClicklinkedinBtn;
				document.querySelector("#youtubeBtn").onclick = contactRtaObj.onClickyoutubeBtn;
				document.querySelectorAll("#ContactRtaPage .closeSheet")[1].onclick = contactRtaObj.closeButtomSheet;
				document.querySelectorAll("#ContactRtaPage .closeSheet")[0].onclick = contactRtaObj.closeButtomSheet;
				document.querySelector("#ContactRtaPage .getDirections").onclick = function() {
					/* if (Constants.APP_ID == "RTA_Drivers_And_Vehicles") {
             	DVDashboardModel.openDriveModeDirectionsForContactRTA(
             			contactRtaObj.activeItem.data.attributes
             	);
             } else {*/
					if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
						window.open("maps://?q=" + contactRtaObj.activeItem.data.attributes.LATITUDE + "," + contactRtaObj.activeItem.data.attributes.LONGITUDE, "_system");
					} else {
						var latLong = contactRtaObj.lat + "," + contactRtaObj.long;
						if (contactRtaObj.activeService == "services") {
							latLongDest = contactRtaObj.activeItem.data.attributes.LATITUDE + "," + contactRtaObj.activeItem.data.attributes.LONGITUDE;
						} else {
							latLongDest = contactRtaObj.activeItem.data.geometry.y + "," + contactRtaObj.activeItem.data.geometry.x;
						}
						window.open("https://www.google.com/maps/dir/?api=1&origin=" + latLong + "&destination=" + latLongDest + "&travelmode=Driving", "_system");
						/*
             window.open(
                "geo: "+contactRtaObj.lat+","+contactRtaObj.long+"?q=" +
                  contactRtaObj.activeItem.data.attributes.LATITUDE +
                  "," +
                  contactRtaObj.activeItem.data.attributes.LONGITUDE,
                "_system"
              );*/
					}
					//}
				};
				var timer = null;
				document.getElementById("searchServices").oninput = function(e) {
					if (e) e.preventDefault();
					clearTimeout(timer);
					var val = this.value;
					if (val) {
						document.getElementsByClassName("icon-menu-search")[0].style.color = "red";
						document.getElementsByClassName("icon-menu-search")[1].style.color = "red";
					} else {
						document.getElementsByClassName("icon-menu-search")[0].style.color = "";
						document.getElementsByClassName("icon-menu-search")[1].style.color = "";
					}
					timer = setTimeout(function() {
						if (contactRtaObj.activeService == "services") {
							contactRtaObj.searchServicesList(val);
						} else {
							contactRtaObj.searchKiosksList(val);
						}
					}, 1000);
				};
				document.getElementById("salikSearchInput").oninput = function(e) {
					if (e) e.preventDefault();
					clearTimeout(timer);
					var val = this.value;
					timer = setTimeout(function() {
						contactRtaObj.searchSalikList(val);
					}, 1000);
				};
			} catch (e) {
				console.log(e);
			}
		},
		onPageShow: function() {
			try {
				
				document.querySelector(".contactRTANumber").addEventListener("click", function(e) {
					e.preventDefault();
					window.open("tel:0097142065555", "_system");
				});
				
				document.querySelector(".contactSalikNumber2").addEventListener("click", function(e) {
					e.preventDefault();
					window.open("tel:0097142065555", "_system");
				});
			
				document.querySelector(".contactSalikNumber").addEventListener("click", function(e) {
					e.preventDefault();
					window.open("tel:80072545", "_system");
				});
				

				document.querySelector(".contactSalikNumber3").addEventListener("click", function(e) {
					e.preventDefault();
					window.open("tel:009714233 5121", "_system");
				});
				
				document.querySelector(".contactSalikNumber4").addEventListener("click", function(e) {
					e.preventDefault();
					window.open("tel:0097142335l80", "_system");
				});
			

				var options = contactRtaObj.options;
				if(options.data && options.data.openLocations=="true")
				{

					var options = {
							startIndex: 1,
							touchEnabled: false,
							direction: getApplicationLanguage() == "en" ? "ltr" : "rtl"
					};
					new Tabs(document.querySelector("#ContactRtaPage .tabsCont"), options);
				}
				else
					this.initTabs();

				CustomerSupportCenterModel.getContactRTAData(function(data) {
					contactRtaObj.data = data;
					console.log("data");
					console.log(data);
					navigator.geolocation.getCurrentPosition(contactRtaObj.successLocation, contactRtaObj.errorLocation, {
						enableHighAccuracy: true,
						maximumAge: Infinity,
						timeout: 5000
					});
				});
				this.initPageListener();
				setTimeout(function() {
					console.log("Execute native Transition");
					window.plugins.nativepagetransitions.executePendingTransition(function(msg) {}, function(msg) {});
				}, 300);
			} catch (e) {
				console.log(e)
			}
		},
		bindRTACenters: function(data) {
			for (var i = 0; i < data.services.length; i++) {
				var serviceItem = document.querySelector("#templates .serviceItem").cloneNode(true);
				if (getApplicationLanguage() == "en") {
					serviceItem.querySelector(".serviceTitle").innerText = data.services[i].attributes.CENTER_NAME;
					serviceItem.querySelector(".services").innerText = data.services[i].attributes.SERVICES_PROVIDED.replace(new RegExp("\r\n\r\n", "g"), "");
					serviceItem.querySelector(".workHrs").innerText = data.services[i].attributes.OPERATING_HOURS;
					serviceItem.querySelector(".number").innerText = data.services[i].attributes.TELEPHONE_NBR;
					serviceItem.querySelector(".number").onclick = function() {
						contactRtaObj.openDial(data.services[i].attributes.TELEPHONE_NBR);
					};
				} else {
					serviceItem.querySelector(".serviceTitle").innerText = data.services[i].attributes.CENTER_NAME_AR;
					serviceItem.querySelector(".services").innerText = data.services[i].attributes.SERVICES_PROVIDED_AR;
					serviceItem.querySelector(".workHrs").innerText = data.services[i].attributes.OPERATING_HOURS_AR;
					serviceItem.querySelector(".number").innerText = data.services[i].attributes.TELEPHONE_NBR;
				}
				if (data.services[i].attributes.hasOwnProperty("ditsance")) {
					serviceItem.querySelector(".distance").innerText = data.services[i].attributes.ditsance;
				}
				serviceItem.index = i;
				serviceItem.data = data.services[i];
				serviceItem.type = "services";
				serviceItem.onclick = contactRtaObj.onItemClick;
				document.querySelector("#RTAServicesList").appendChild(serviceItem);
			}
		},
		bindKiosks: function(data) {
			try{
				//Kiosks  happinessCenters
				for (var i = 0; i < data.kiosks.happinessCenters.length; i++) {
					var serviceItem = document.querySelector("#templates .serviceItem").cloneNode(true);
					if (getApplicationLanguage() == "en") {
						var title = data.kiosks.happinessCenters[i].attributes.CLIENT.split("-");
						if (title.length > 0) {
							serviceItem.querySelector(".serviceTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = title.length > 0 ? title[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							address.innerHTML = title.length > 1 ? title[1] : "";
							address.style.display = "block";
							serviceItem.querySelector(".serviceTitle").appendChild(header);
							serviceItem.querySelector(".serviceTitle").appendChild(address);
						}

						var kiosksTime=data.kiosks.happinessCenters[i].attributes.KIOSKS_TIMING?data.kiosks.happinessCenters[i].attributes.KIOSKS_TIMING:"";
						var kiosksDistance=data.kiosks.happinessCenters[i].attributes.ditsance?data.kiosks.happinessCenters[i].attributes.ditsance:"";
						serviceItem.querySelector(".workHrs").innerText = kiosksTime;
						serviceItem.querySelector(".distance").innerText = kiosksDistance;

					} else {
						var title = data.kiosks.happinessCenters[i].attributes.CLIENT_AR.split("–");
						if (title.length > 0) {
							serviceItem.querySelector(".serviceTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = title.length > 0 ? title[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							address.innerHTML = title.length > 1 ? title[1] : "";
							address.style.display = "block";
							serviceItem.querySelector(".serviceTitle").appendChild(header);
							serviceItem.querySelector(".serviceTitle").appendChild(address);
						}
						serviceItem.querySelector(".workHrs").innerText = data.kiosks.happinessCenters[i].attributes.KIOSKS_TIMING_AR;
						serviceItem.querySelector(".distance").innerText = data.kiosks.happinessCenters[i].attributes.ditsance;
					}
					serviceItem.querySelector(".services").style.display = "none";
					serviceItem.querySelector(".phoneNum").style.display = "none";
					serviceItem.index = i;
					serviceItem.data = data.kiosks.happinessCenters[i];
					serviceItem.type = "kiosks";
					serviceItem.onclick = contactRtaObj.onItemClick;
					document.querySelector("#RTAKiosksList").appendChild(serviceItem);
				}
			} catch (e) {
				console.log(e);
			}
		},
		bindKiosksSalikNol:function (data){
			try {
				//Kiosks  Nol And Salik
				for (var i = 0; i < data.kiosks.salikNol.length; i++) {
					if (data.kiosks.salikNol[i]) {
						var serviceItem = document.querySelector("#templates .serviceItem").cloneNode(true);
						//							console.log(i);
						if (getApplicationLanguage() == "en") {
							var title = data.kiosks.salikNol[i].attributes.CLIENT.split("-");
							serviceItem.querySelector(".serviceTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = title.length > 0 ? title[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							address.innerHTML = data.kiosks.salikNol[i].attributes.LOCATION_NAMES ? data.kiosks.salikNol[i].attributes.LOCATION_NAMES : "";
							address.style.display = "block";
							serviceItem.querySelector(".serviceTitle").appendChild(header);
							serviceItem.querySelector(".serviceTitle").appendChild(address);
							serviceItem.querySelector(".workHrs").innerText = data.kiosks.salikNol[i].attributes.KIOSKS_TIMING ? data.kiosks.salikNol[i].attributes.KIOSKS_TIMING : "";
							serviceItem.querySelector(".distance").innerText = data.kiosks.salikNol[i].attributes.ditsance ? data.kiosks.salikNol[i].attributes.ditsance : "";
						} else {
							var title = data.kiosks.salikNol[i].attributes.CLIENT_AR.split("–");
							if (title.length > 0) {
								serviceItem.querySelector(".serviceTitle").innerHTML = "";
								var header = document.createElement("span");
								header.innerHTML = title.length > 0 ? title[0] : "";
								header.style.display = "block";
								var address = document.createElement("span");
								address.innerHTML = data.kiosks.salikNol[i].attributes.LOCATION_AR ? data.kiosks.salikNol[i].attributes.LOCATION_AR : "";
								address.style.display = "block";
								serviceItem.querySelector(".serviceTitle").appendChild(header);
								serviceItem.querySelector(".serviceTitle").appendChild(address);
							}
							serviceItem.querySelector(".workHrs").innerText = data.kiosks.salikNol[i].attributes.KIOSKS_TIMING_AR ? data.kiosks.salikNol[i].attributes.KIOSKS_TIMING_AR : "";
							serviceItem.querySelector(".distance").innerText = data.kiosks.salikNol[i].attributes.ditsance ? data.kiosks.salikNol[i].attributes.ditsance : "";
							// create element for salik and Nol
							/*var salikNolAvailable = document.createElement("div");
																	salikNolAvailable.innerHTML =  "Salik : "+ data.kiosks.salikNol[i].attributes.SALIK  + "  " + " Nol " + data.kiosks.salikNol[i].attributes.NOL
																	salikNolAvailable.style.display = "block";
																	dserviceItem.querySelector(".workHrs").appendChild(salikNolAvailable);*/
						}
						serviceItem.querySelector(".services").style.display = "none";
						serviceItem.querySelector(".phoneNum").style.display = "none";
						serviceItem.index = i;
						serviceItem.data = data.kiosks.salikNol[i];
						serviceItem.type = "kiosks";
						serviceItem.onclick = contactRtaObj.onItemClick;
						document.querySelector("#RTAKiosksList").appendChild(serviceItem);
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		bindSalikGates:function (data){
			try {
				for (var i = 0; i < data.salik.length; i++) {
					var serviceItem = document.querySelector("#templates .gateItem").cloneNode(true);
					if (getApplicationLanguage() == "en") {
						serviceItem.querySelector(".serviceTitle").innerText = data.salik[i].titleEn;
					} else {
						serviceItem.querySelector(".serviceTitle").innerText = data.salik[i].titleAr;
					}
					if (data.salik[i].hasOwnProperty("ditsance")) {
						serviceItem.querySelector(".distance").innerText = data.salik[i].ditsance;
					}
					serviceItem.index = i;
					serviceItem.data = data.salik[i];
					serviceItem.type = "salik";
					serviceItem.onclick = contactRtaObj.onItemClick;
					document.querySelector("#SalikGatesList").appendChild(serviceItem);
				}
			} catch (e) {
				console.log(e);
			}
		},
	

		
		bindData: function(data) {
			try {
				contactRtaObj.data = data;
				contactRtaObj.activeItem = null;
				this.bindRTACenters(data);
				this.bindKiosks(data);
				this.bindKiosksSalikNol(data);
				this.bindSalikGates(data);
//				if (window.google) {
//				this.initMapforContactRTA();
//				} else {
				var googleAPIs = GoogleAPIs.getInstance();
				var _this= this;
				googleAPIs.destroyGoogleScripts(function (){
					var params = {
							"googleAPI":"Maps JavaScript API",
							"appName":"SHELL",
//							"query":"",
							"options":{
								"region":"AE",
								"callback":"contactRtaObj.initMapforContactRTA"
							}
					};
					var googleAPIs = GoogleAPIs.getInstance();
					googleAPIs.generateMapsURL(params.appName,params.googleAPI,params.options,
							function (url){
						console.log(url);
						
						if(url&&!url.error){
						    $.getScript(url);
						}
//						$.getScript("https://maps.google.com/maps/api/js?region=AE&callback=contactRtaObj.initMapforContactRTA");
					});
				});



//				var invocationData = {
//				adapter: 'googleAPIAdapter',
//				procedure: 'getAPIURL',
//				parameters: [params.appName,params.platform,params.googleAPI,params.query,params.options]
//				};
//				invokeWLResourceRequest(invocationData, {
//				onSuccess: function(result) {

//				$.getScript(result.url);

//				},
//				onFailure: function(e) {
//				$.getScript("https://maps.google.com/maps/api/js?region=AE&callback=contactRtaObj.initMapforContactRTA");

//				},
//				invocationContext: this
//				});

//				$.getScript("https://maps.google.com/maps/api/js?key="+GoogleAPIs.getInstance().getKey("Shell")+"&region=AE&callback=contactRtaObj.initMapforContactRTA");



//				}
			} catch (e) {
				console.log(e);
			}
		},
		initMapforContactRTA: function() {
			var rtaCenter = {
					LATITUDE: 25.234241,
					LONGITUDE: 55.356575
			};
			contactRtaObj.initMaps(rtaCenter, contactRtaObj.data.services, contactRtaObj.data.kiosks, contactRtaObj.data.salik); //  add kiosks list
		},
		initMaps: function(rtaCenter, serviceCenters, kiosks, salikGates) {
			console.log("initMaps")
			try {
				contactRtaObj.markers = {};
				contactRtaObj.maps = {};
				contactRtaObj.map = new google.maps.Map(document.getElementsByClassName("map")[0], {
					center: {
						lat: rtaCenter.LATITUDE,
						lng: rtaCenter.LONGITUDE
					},
					zoom: 12,
					disableDefaultUI: true,
					gestureHandling: "greedy",
					styles: contactRtaObj.getMapStyle()
				});
				contactRtaObj.createMapMarker(contactRtaObj.map, rtaCenter, "pin-40.png");
				/*************************/
				contactRtaObj.mapCenters = new google.maps.Map(document.getElementsByClassName("servicesMap")[0], {
					center: {
						lat: 25.142164,
						lng: 55.190967
					},
					zoom: 10,
					disableDefaultUI: true,
					gestureHandling: "greedy",
					styles: contactRtaObj.getMapStyle()
				});
				contactRtaObj.maps.services = contactRtaObj.mapCenters;
				contactRtaObj.markers.services = [];
				for (var i = 0; i < serviceCenters.length; i++) {
					var pinLocation = contactRtaObj.createMapMarker(contactRtaObj.mapCenters, serviceCenters[i].attributes, "happiness-center-pin-40.png");
					contactRtaObj.markers.services.push(pinLocation);
				}
				/*************************/
				contactRtaObj.KiosksMap = new google.maps.Map(document.getElementsByClassName("KiosksMap")[0], {
					center: {
						lat: 25.142164,
						lng: 55.190967
					},
					zoom: 10,
					disableDefaultUI: true,
					gestureHandling: "greedy",
					styles: contactRtaObj.getMapStyle()
				});
				contactRtaObj.maps.kiosks = contactRtaObj.KiosksMap;
				contactRtaObj.markers.kiosks = [];
				// for kiosks happiness
				for (var i = 0; i < kiosks.happinessCenters.length; i++) {
					var latLong = {
							LATITUDE: kiosks.happinessCenters[i].geometry.y,
							LONGITUDE: kiosks.happinessCenters[i].geometry.x
					};
					contactRtaObj.markers.kiosks.push(contactRtaObj.createMapMarker(contactRtaObj.KiosksMap, latLong, "happiness-pin-40.png"));
				}
				// for kiosks Salik and Nol
				for (var i = 0; i < kiosks.salikNol.length; i++) {
					var latLong = {
							LATITUDE: kiosks.salikNol[i].geometry.y,
							LONGITUDE: kiosks.salikNol[i].geometry.x
					};
					if (kiosks.salikNol[i].attributes.SALIK == "Yes" && kiosks.salikNol[i].attributes.NOL == "Yes") {
						contactRtaObj.markers.kiosks.push(contactRtaObj.createMapMarker(contactRtaObj.KiosksMap, latLong, "salik-nol-pin-40.png"));
					} else if (kiosks.salikNol[i].attributes.SALIK == "Yes" && kiosks.salikNol[i].attributes.NOL == "NO") // Need Ping
					{
						contactRtaObj.markers.kiosks.push(contactRtaObj.createMapMarker(contactRtaObj.KiosksMap, latLong, "salik-gate-pin-40.png"));
					} else if (kiosks.salikNol[i].attributes.SALIK == "NO" && kiosks.salikNol[i].attributes.NOL == "Yes") // Need Ping for Nol
					{
						contactRtaObj.markers.kiosks.push(contactRtaObj.createMapMarker(contactRtaObj.KiosksMap, latLong, "nol-pin-40.png"));
					}
				}
				/*************************/
				contactRtaObj.salikGatesMap = new google.maps.Map(document.getElementsByClassName("map")[2], {
					center: {
						lat: 25.142164,
						lng: 55.190967
					},
					zoom: 10,
					disableDefaultUI: true,
					gestureHandling: "greedy",
					styles: contactRtaObj.getMapStyle()
				});
				contactRtaObj.maps.salik = contactRtaObj.salikGatesMap;
				contactRtaObj.markers.salik = [];
				for (var i = 0; i < salikGates.length; i++) {
					contactRtaObj.markers.salik.push(contactRtaObj.createMapMarker(contactRtaObj.salikGatesMap, {
						LATITUDE: salikGates[i].pos[0],
						LONGITUDE: salikGates[i].pos[1]
					}, "salik-gate-pin-40.png"));
				}
			} catch (e) {
				console.log(e);
			}
		},
		createMapMarker: function(map, center, image) {
			console.log("createMapMarker")
			var icon = {
				url:
					/*"https://mfp-staging.rta.ae:6443/index/smartgov/apps/dubai_drive/images/" +*/ // this is for testing
					"http://m.rta.ae/index/smartgov/apps/dubai_drive/images/" + // production
					image, // url
					scaledSize: new google.maps.Size(20, 20), // scaled size
					origin: new google.maps.Point(0, 0), // origin
					anchor: new google.maps.Point(0, 0) // anchor
			};
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(center.LATITUDE, center.LONGITUDE),
				map: map,
				icon: icon
			});
			/*marker.addListener('click', function() {
            	var lat=event.latLng.lat();
            	var long =event.latLng.lng();
            		contactRtaObj.toggleButtomSheet(this);
            	})*/
			return marker;
			// 					marker.setOptions({'opacity': 0.5})
		},
		highlightMarker: function(markers, index) {
			console.log("highlightMarker")
			var opacity;
			if (index != undefined) {
				opacity = 0.2;
				for (var i = 0; i < markers.length; i++) {
					markers[i].setOptions({
						opacity: opacity
					});
				}
				markers[index].setOptions({
					opacity: 1
				});
				markers[index].icon.size.height = 35;
				markers[index].icon.size.width = 35;
			} else {
				opacity = 1;
				for (var i = 0; i < markers.length; i++) {
					markers[i].setOptions({
						opacity: opacity
					});
					markers[i].icon.size.height = 20;
					markers[i].icon.size.width = 20;
				}
			}
		},
		getMapStyle: function() {
			console.log("getMapStyle")
			return [{
				elementType: "geometry",
				stylers: [{
					color: "#f5f5f5"
				}]
			}, {
				elementType: "labels.icon",
				stylers: [{
					visibility: "off"
				}]
			}, {
				elementType: "labels.text.fill",
				stylers: [{
					color: "#616161"
				}]
			}, {
				elementType: "labels.text.stroke",
				stylers: [{
					color: "#f5f5f5"
				}]
			}, {
				featureType: "administrative.land_parcel",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#bdbdbd"
				}]
			}, {
				featureType: "poi",
				elementType: "geometry",
				stylers: [{
					color: "#eeeeee"
				}]
			}, {
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#757575"
				}]
			}, {
				featureType: "poi.park",
				elementType: "geometry",
				stylers: [{
					color: "#e5e5e5"
				}]
			}, {
				featureType: "poi.park",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#9e9e9e"
				}]
			}, {
				featureType: "road",
				elementType: "geometry",
				stylers: [{
					color: "#ffffff"
				}]
			}, {
				featureType: "road.arterial",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#757575"
				}]
			}, {
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{
					color: "#dadada"
				}]
			}, {
				featureType: "road.highway",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#616161"
				}]
			}, {
				featureType: "road.local",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#9e9e9e"
				}]
			}, {
				featureType: "transit.line",
				elementType: "geometry",
				stylers: [{
					color: "#e5e5e5"
				}]
			}, {
				featureType: "transit.station",
				elementType: "geometry",
				stylers: [{
					color: "#eeeeee"
				}]
			}, {
				featureType: "water",
				elementType: "geometry",
				stylers: [{
					color: "#c9c9c9"
				}]
			}, {
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [{
					color: "#9e9e9e"
				}]
			}];
		},
		getSalikGateDetails: function() {
			console.log("getSalikGateDetails")
			return [{
				id: "0",
				tollChargeEN: "Toll charge: <span style='color:red'>4 AED</span>",
				tollChargeAR: "<span> التعرفة المرورية </span><span style='color:red'> 4 درهم</span>",
				tollHours: "Toll hours <span style='color:red'>24/7</span>",
				tollHoursAR: "<span style='color:red'>24/7</span>: ساعات التحصيل"
			}, {
				id: "1",
				name: "Al Maktoum",
				tollHours: "Free from <span style='color:red'> 10pm Thursday </span> to <span style='color:red'>6am Saturday</span>",
				tollHoursAR: "  مجانا من <span style='color:red'>الساعة 10مسا الخميس</span>الى<span style='color:red'>الساعة 6 صباح السبت</span>"
			}, {
				id: "2",
				name: "Al Mamzar south",
				tollHours: "When Passing through Al Mamzar south & north gates in the same direction within an hour you will be charged only once.",
				tollHoursAR: " سيتم خصم رحلة واحدة فقط عند العبور خلال بوابتي الممزر في نفس الاتجاه خلال ساعة واحدة"
			}, {
				id: "3",
				name: "Al Mamzar north",
				tollHours: "When Passing through Al Mamzar south & north gates in the same direction within an hour you will be charged only once.",
				tollHoursAR: " سيتم خصم رحلة واحدة فقط عند العبور خلال بوابتي الممزر في نفس الاتجاه خلال ساعة واحدة"
			}];
		},
		onItemClick: function(e) {
			contactRtaObj.toggleButtomSheet(this);
		},
		toggleButtomSheet: function(item) {
			contactRtaObj.sheetOpen ? contactRtaObj.closeButtomSheet(item) : contactRtaObj.openButtomSheet(item);
		},
		onCallEmergency: function(e) {
			e.preventDefault();
			window.open("tel:042905000", "_system");
		},
		onCallTollFree: function(e) {
			e.preventDefault();
			window.open("tel:8009090", "_system");
		},
		onClickfacebookBtn: function(e) {
			e.preventDefault();
			var winfacebook = window.open("http://www.facebook.com/rtadubai", "_system");
			winfacebook.focus();
		},
		onClicktwitterBtn: function(e) {
			e.preventDefault();
			var winfacebook = window.open("http://twitter.com/RTA_Dubai", "_system");
			winfacebook.focus();
		},
		onClickyoutubeBtn: function(e) {
			e.preventDefault();
			var winfacebook = window.open("http://youtube.com/user/rtadubaigov", "_system");
			winfacebook.focus();
		},
		onClicklinkedinBtn: function(e) {
			e.preventDefault();
			var winfacebook = window.open("https://www.linkedin.com/company/road-and-transport-authority", "_system");
			winfacebook.focus();
		},
		onClickinstagramBtn: function(e) {
			e.preventDefault();
			var winfacebook = window.open("http://instagram.com/rta_dubai", "_system");
			winfacebook.focus();
		},
		openButtomSheet: function(item) {
			try {
				document.querySelector("#centerSheet .salikNol").innerHTML = '';
				var search = document.querySelector(".searchCont");
				var servicesList;
				if (item.type == "services") {
					servicesList = document.querySelectorAll("#ContactRtaPage .servicesList")[0];
					document.querySelectorAll("#ContactRtaPage .listScroller")[0].scrollTop = 0;
					if (getApplicationLanguage() == "en") {
						var serviceTitle = item.data.attributes.CENTER_NAME.split("-");
						if (serviceTitle.length > 0) {
							document.querySelector("#centerSheet .sheetTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = serviceTitle.length > 0 ? serviceTitle[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							address.innerHTML = serviceTitle.length > 1 ? serviceTitle[1] : "";
							address.style.display = "block";
							document.querySelector("#centerSheet .sheetTitle").appendChild(header);
							document.querySelector("#centerSheet .sheetTitle").appendChild(address);
						}
						document.querySelector("#centerSheet .sheetHours").innerText = item.data.attributes.OPERATING_HOURS;
					} else {
						var serviceTitle = item.data.attributes.CENTER_NAME_AR.split("–");
						if (serviceTitle.length > 0) {
							document.querySelector("#centerSheet .sheetTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = serviceTitle.length > 0 ? serviceTitle[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							address.innerHTML = serviceTitle.length > 1 ? serviceTitle[1] : "";
							address.style.display = "block";
							document.querySelector("#centerSheet .sheetTitle").appendChild(header);
							document.querySelector("#centerSheet .sheetTitle").appendChild(address);
						}
						document.querySelector("#centerSheet .sheetHours").innerText = item.data.attributes.OPERATING_HOURS_AR;
					}
					document.querySelector("#centerSheet").style.display = "block";
					setTimeout(function() {
						document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,0,0)";
					});
				} else if (item.type == "kiosks") {
					servicesList = document.querySelectorAll("#ContactRtaPage .servicesList")[0];
					document.querySelectorAll("#ContactRtaPage .listScroller")[0].scrollTop = 0;
					if (getApplicationLanguage() == "en") {
						var kiosksTitle = item.data.attributes.CLIENT.split("-");
						if (kiosksTitle.length > 0) {
							document.querySelector("#centerSheet .sheetTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = kiosksTitle.length > 0 ? kiosksTitle[0] : "";
							header.style.display = "block";
							var address = document.createElement("span");
							if (item.data.attributes.hasOwnProperty('SALIK')) // this mean salik and nol
							{
								address.innerHTML = item.data.attributes.LOCATION_NAMES ? item.data.attributes.LOCATION_NAMES : "";
								// create element for salik data
								var salikData = document.createElement("div");
								salikData.className = 'salikDiv';
								var salikTitle = document.createElement("span");
								salikTitle.className = 'salikTitle';
								salikTitle.innerHTML = 'Salik : ';
								salikTitle.style.display = "inline";
								var salikTitledata = document.createElement("span");
								salikTitledata.className = 'salikTitledata';
								salikTitledata.innerHTML = item.data.attributes.SALIK ? item.data.attributes.SALIK : "";
								salikTitledata.style.color = "red";
								salikTitledata.style.display = "inline";
								salikData.appendChild(salikTitle);
								salikData.appendChild(salikTitledata);
								document.querySelector("#centerSheet .salikNol").innerHTML = '';
								document.querySelector("#centerSheet .salikNol").appendChild(salikData);
								// create element for Nol data
								var nolDataDiv = document.createElement("div");
								nolDataDiv.className = 'nolDiv';
								var nolTitle = document.createElement("span");
								nolTitle.className = 'nolTitle';
								nolTitle.innerHTML = 'Nol : ';
								nolTitle.style.display = "inline";
								var nolTitledata = document.createElement("span");
								nolTitledata.className = 'salikTitledata';
								nolTitledata.innerHTML = item.data.attributes.NOL ? item.data.attributes.NOL : "";
								nolTitledata.style.color = "red";
								nolTitledata.style.display = "inline";
								nolDataDiv.appendChild(nolTitle);
								nolDataDiv.appendChild(nolTitledata);
								document.querySelector("#centerSheet .salikNol").appendChild(nolDataDiv);
							} else {
								var happinlLocation = item.data.attributes.LOCATION_NAME.split("-");
								address.innerHTML = happinlLocation.length > 0 ? happinlLocation[1] : "";
							}
							address.style.display = "block";
							document.querySelector("#centerSheet .sheetTitle").appendChild(header);
							document.querySelector("#centerSheet .sheetTitle").appendChild(address);
						}
						document.querySelector("#centerSheet .sheetHours").innerText = item.data.attributes.KIOSKS_TIMING ? item.data.attributes.KIOSKS_TIMING : "";
						document.querySelector("#centerSheet .distanceDetails").innerText = item.data.attributes.ditsance ? item.data.attributes.ditsance : "";
					} else {
						var kiosksTitle = item.data.attributes.CLIENT_AR.split("–");
						if (kiosksTitle.length > 0) {
							document.querySelector("#centerSheet .sheetTitle").innerHTML = "";
							var header = document.createElement("span");
							header.innerHTML = kiosksTitle.length > 0 ? kiosksTitle[0] : "";
							header.style.display = "block";
						}
						var address = document.createElement("span");
						if (item.data.attributes.SALIK) // this mean salik and nol
						{
							address.innerHTML = item.data.attributes.LOCATION_AR ? item.data.attributes.LOCATION_AR : "";
						} else {
							address.innerHTML = kiosksTitle.length > 1 ? kiosksTitle[1] : ""; // this is Happiness
						}
						address.style.display = "block";
						document.querySelector("#centerSheet .sheetTitle").appendChild(header);
						document.querySelector("#centerSheet .sheetTitle").appendChild(address);
						document.querySelector("#centerSheet .sheetHours").innerText = item.data.attributes.KIOSKS_TIMING_AR ? item.data.attributes.KIOSKS_TIMING_AR : "";
						document.querySelector("#centerSheet .distanceDetails").innerText = item.data.attributes.ditsance ? item.data.attributes.ditsance : "";
						if (item.data.attributes.hasOwnProperty('SALIK')) // this mean salik and nol
						{
							var salikData = document.createElement("div");
							salikData.className = 'salikDiv';
							var salikTitle = document.createElement("span");
							salikTitle.className = 'salikTitle';
							salikTitle.innerHTML = 'سالك : ';
							salikTitle.style.display = "inline";
							var salikTitledata = document.createElement("span");
							salikTitledata.className = 'salikTitledata';
							salikTitledata.innerHTML = item.data.attributes.SALIK == "Yes" ? "نعم" : "لا";
							salikTitledata.style.color = "red";
							salikTitledata.style.display = "inline";
							salikData.appendChild(salikTitle);
							salikData.appendChild(salikTitledata);
							document.querySelector("#centerSheet .salikNol").innerHTML = '';
							document.querySelector("#centerSheet .salikNol").appendChild(salikData);
							// create element for Nol data
							var nolDataDiv = document.createElement("div");
							nolDataDiv.className = 'nolDiv';
							var nolTitle = document.createElement("span");
							nolTitle.className = 'nolTitle';
							nolTitle.innerHTML = 'نول : ';
							nolTitle.style.display = "inline";
							var nolTitledata = document.createElement("span");
							nolTitledata.className = 'salikTitledata';
							nolTitledata.innerHTML = item.data.attributes.NOL == "Yes" ? "نعم" : "لا";
							nolTitledata.style.color = "red";
							nolTitledata.style.display = "inline";
							nolDataDiv.appendChild(nolTitle);
							nolDataDiv.appendChild(nolTitledata);
							document.querySelector("#centerSheet .salikNol").appendChild(nolDataDiv);
						}
					}
					document.querySelector("#centerSheet").style.display = "block";
					setTimeout(function() {
						document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,0,0)";
					});
				} else {
					servicesList = document.querySelectorAll("#ContactRtaPage .servicesList")[1];
					gateDetails = contactRtaObj.getSalikGateDetails();
					document.querySelector("#ContactRtaPage #SalikGatesList").scrollTop = 0;
					if (getApplicationLanguage() == "en") {
						document.querySelector("#salikSheet .gateName").innerText = item.data.titleEn;
						document.querySelector("#salikSheet .tollCharge").innerHTML = gateDetails[0].tollChargeEN;
						if (item.data.titleEn == gateDetails[1].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[1].tollHours;
						} else if (item.data.titleEn == gateDetails[2].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[2].tollHours;
						} else if (item.data.titleEn == gateDetails[3].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[3].tollHours;
						} else {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[0].tollHours;
						}
					} else {
						document.querySelector("#salikSheet .gateName").innerText = item.data.titleAr;
						document.querySelector("#salikSheet .tollCharge").innerHTML = gateDetails[0].tollChargeAR;
						//document.querySelector("#salikSheet .Worktimes").innerHTML  = gateDetails[0].tollHoursAR;
						if (item.data.titleEn == gateDetails[1].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[1].tollHoursAR;
						} else if (item.data.titleEn == gateDetails[2].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[2].tollHoursAR;
						} else if (item.data.titleEn == gateDetails[3].name) {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[3].tollHoursAR;
						} else {
							document.querySelector("#salikSheet .Worktimes").innerHTML = gateDetails[0].tollHoursAR;
						}
					}
					if (item.data.hasOwnProperty("ditsance")) {
						document.querySelector("#salikSheet .distanceDetails").innerText = item.data.ditsance;
					}
					document.querySelector("#salikSheet").style.display = "block";
					setTimeout(function() {
						document.querySelector("#salikSheet").style.webkitTransform = "translate3d(0,0,0)";
					});
				}
				item.style.border = "1px solid #ee0000";
				document.querySelector("#sheetCover").style.display = "block";
				contactRtaObj.sheetOpen = true;
				contactRtaObj.activeItem = item;
				var Latlng = new google.maps.LatLng(contactRtaObj.markers[item.type][item.index].position.lat(), contactRtaObj.markers[item.type][item.index].position.lng());
				contactRtaObj.maps[contactRtaObj.activeItem.type].setCenter(Latlng);
				contactRtaObj.maps[contactRtaObj.activeItem.type].setZoom(12);
				contactRtaObj.highlightMarker(contactRtaObj.markers[item.type], item.index);
				search.style.borderRadius = "20px";
				search.style.width = "90%";
				search.style.height = "35px";
				search.style.webkitTransform = "translate3d(0,0,0)";
				servicesList.style.transitionDuration = "300ms";
				servicesList.style.webkitTransform = "translate3d(0,0,0)";
			}catch(e){
				console.log(e);
			}
		},
		closeButtomSheet: function() {
			if (contactRtaObj.activeItem.type == "services") {
				document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,200px,0)";
			}
			if (contactRtaObj.activeItem.type == "kiosks") {
				document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,200px,0)";
			} else {
				document.querySelector("#salikSheet").style.webkitTransform = "translate3d(0,200px,0)";
			}
			contactRtaObj.activeItem.style.border = "";
			document.querySelector("#sheetCover").style.display = "none";
			contactRtaObj.sheetOpen = false;
			var Latlng = new google.maps.LatLng(25.142164, 55.190967);
			contactRtaObj.maps[contactRtaObj.activeItem.type].setCenter(Latlng);
			contactRtaObj.maps[contactRtaObj.activeItem.type].setZoom(10);
			contactRtaObj.highlightMarker(contactRtaObj.markers[contactRtaObj.activeItem.type]);
			setTimeout(function() {
				if (contactRtaObj.activeItem.type == "services") {
					document.querySelector("#centerSheet").style.display = "none";
				} else {
					document.querySelector("#salikSheet").style.display = "none";
				}
			}, 300);
		},
		toggleServiceList: function(e) {
			contactRtaObj.activeService = this.value;
			if (this.value == "services") {
				document.querySelector("#RTAServicesList").style.display = "block";
				document.querySelector("#RTAKiosksList").style.display = "none";
				document.querySelector(".KiosksMap").style.display = "none";
				document.querySelector(".KiosksMap").style.display = "relative";
				document.querySelector(".servicesMap").style.display = "block";
				document.querySelector(".servicesMap").style.position = "";
			} else {
				document.querySelector("#RTAServicesList").style.display = "none";
				s;
				document.querySelector("#RTAKiosksList").style.display = "block";
				document.querySelector(".KiosksMap").style.display = "block";
				document.querySelector(".servicesMap").style.display = "none";
				document.querySelector(".servicesMap").style.display = "relative";
				document.querySelector(".KiosksMap").style.position = "";
			}
			setTimeout(function() {
				contactRtaObj.applyScrollEffect(document.querySelectorAll("#ContactRtaPage .servicesList")[0]);
			});
		},
		searchServicesList: function(text) {
			var items = document.querySelectorAll("#RTAServicesList .serviceItem");
			var data = contactRtaObj.data.services;
			var searchResult = [];
			for (var i = 0; i < data.length; i++) {
				for (var item in data[i].attributes) {
					if (typeof data[i].attributes[item] == "string")
						if (data[i].attributes[item].toString().toLowerCase().indexOf(text.toString().toLowerCase()) != -1) {
							searchResult.push(i);
						}
				}
			}
			for (var j = 0; j < items.length; j++) {
				if (searchResult.indexOf(j) != -1) {
					items[j].style.display = "block";
				} else {
					items[j].style.display = "none";
				}
			}
		},
		searchSalikList: function(text) {
			var items = document.querySelectorAll("#SalikGatesList .gateItem");
			var data = contactRtaObj.data.salik;
			var searchResult = [];
			for (var i = 0; i < data.length; i++) {
				for (var item in data[i]) {
					if (typeof data[i][item] == "string")
						if (data[i][item].toString().toLowerCase().indexOf(text.toString().toLowerCase()) != -1) {
							searchResult.push(i);
						}
				}
			}
			for (var j = 0; j < items.length; j++) {
				if (searchResult.indexOf(j) != -1) {
					items[j].style.display = "block";
				} else {
					items[j].style.display = "none";
				}
			}
		},
		// add  kiosks list
		searchKiosksList: function(text) {
			document.getElementsByClassName("icon-menu-search")[0].style.color = "red";
			var items = document.querySelectorAll("#RTAKiosksList  .serviceItem");
			// Kiosks Happiness centers search
			var data = contactRtaObj.data.kiosks.happinessCenters;
			var searchResult = [];
			for (var i = 0; i < data.length; i++) {
				for (var item in data[i].attributes) {
					if (typeof data[i].attributes[item] == "string")
						if (data[i].attributes[item].toString().toLowerCase().indexOf(text.toString().toLowerCase()) != -1) {
							searchResult.push(i);
						}
				}
			}
			// Kiosks salik and Nol
			var data = contactRtaObj.data.kiosks.salikNol;
			for (var i = 0; i < data.length; i++) {
				for (var item in data[i].attributes) {
					if (typeof data[i].attributes[item] == "string")
						if (data[i].attributes[item].toString().toLowerCase().indexOf(text.toString().toLowerCase()) != -1) {
							searchResult.push(i);
						}
				}
			}
			for (var j = 0; j < items.length; j++) {
				if (searchResult.indexOf(j) != -1) {
					items[j].style.display = "block";
				} else {
					items[j].style.display = "none";
				}
			}
		},
		applyScrollEffect: function(container) {
			var servicesList = container; //document.querySelector("#ContactRtaPage .servicesList");
			var scrollers = container.querySelectorAll(".listScroller");
			var scroller;
			for (var i = 0; i < scrollers.length; i++) {
				if (window.getComputedStyle(scrollers[i], null).getPropertyValue("display") != "none") scroller = scrollers[i];
			}
			var search = container.querySelector(".searchCont");
			var endY = 0,
			val = 0;
			servicesList.ontouchstart = function(e) {
				endY = e.touches[0].clientY;
				servicesList.ontouchmove = ontouchmove;
			};

			function ontouchmove(e) {
				if (scroller.scrollTop == 0) {
					if (val == -183 && endY > e.touches[0].clientY) return;
					e.preventDefault();
					e.stopPropagation();
					val += e.touches[0].clientY - endY;
					if (val <= -183) {
						val = -183;
					}
					if (val <= -166) {
						search.style.borderRadius = "0";
						search.style.width = "100%";
						search.style.height = "50px";
						search.style.webkitTransform = "translate3d(0,17px,0)";
					} else {
						search.style.borderRadius = "20px";
						search.style.width = "90%";
						search.style.height = "35px";
						search.style.webkitTransform = "translate3d(0,0,0)";
					}
					if (val >= 0) {
						val = 0;
					}
					servicesList.style.webkitTransform = "translate3d(0," + val + "px,0)";
					endY = e.touches[0].clientY;
					servicesList.ontouchend = ontouchend;
				}
			}

			function ontouchend(e) {
				if (val <= -92) {
					val = -183;
					search.style.borderRadius = "0";
					search.style.width = "100%";
					search.style.height = "50px";
					search.style.webkitTransform = "translate3d(0,17px,0)";
				} else {
					val = 0;
					search.style.borderRadius = "20px";
					search.style.width = "90%";
					search.style.height = "35px";
					search.style.webkitTransform = "translate3d(0,0,0)";
				}
				servicesList.style.transitionDuration = "300ms";
				servicesList.style.webkitTransform = "translate3d(0," + val + "px,0)";
				servicesList.ontouchmove = null;
				servicesList.ontouchend = null;
				setTimeout(function() {
					servicesList.style.transitionDuration = "0ms";
				});
			}
			document.getElementsByClassName("kiosksServiceMap")[0].addEventListener("click", function() {
				document.getElementsByClassName("servicesMap")[0].style.display = "block";
				document.getElementsByClassName("servicesMap")[0].style.position = "";
				document.getElementById("searchServices").value = "";
			});
			document.getElementById("radio1").addEventListener("click", function() {
				document.getElementById("searchServices").value = "";
				contactRtaObj.searchServicesList("");
				document.getElementsByClassName("icon-menu-search")[0].style.color = "";
			});
			document.getElementById("radio2").addEventListener("click", function() {
				document.getElementById("searchServices").value = "";
				contactRtaObj.searchSalikList("");
				document.getElementsByClassName("icon-menu-search")[1].style.color = "";
			});
			contactRtaObj.openDial = function(num) {
				if (num) {
					window.open("tel:" + ("" + num).replace(/\s/g, ""), "_system");
				}
			};
		},
		dispose: function() {
			var googleAPIs = GoogleAPIs.getInstance();
			var _this= this;
			googleAPIs.destroyGoogleScripts(function (){
				PageView.prototype.dispose.call(_this);
			});

		}
	});
	// Returns the View class
	return ContactRtaPageView;
});

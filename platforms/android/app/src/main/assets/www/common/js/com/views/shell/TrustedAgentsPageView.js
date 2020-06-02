
/* JavaScript content from js/com/views/shell/TrustedAgentsPageView.js in folder common */
/* JavaScript content from js/com/views/shell/TrustedAgentsPageView.js in folder common */
define(["jquery", "backbone", "com/views/PageView", "com/views/Header", "com/utils/Utils", "com/models/shell/CustomerSupportCenterModel","com/utils/DataUtils",], function($, Backbone, PageView, Header, Utils, CustomerSupportCenterModel,DataUtils) {
	// Extends PagView class
	var TrustedAgentsPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
		},
		initialize: function(options) {
			var self = this;
			trustedAgentsPageViewInstance = this;
			trustedAgentsPageViewInstance.language = getApplicationLanguage();
			if (!options) {
				options = {};
			}
			trustedAgentsPageViewInstance.options = options;
			options.hideHeader = false;
			options.hideFooter = false;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = Globalize.localize("%shell.trustedAgents.title%", trustedAgentsPageViewInstance.language);
			navigator.geolocation.getCurrentPosition( // get current location
					successLocation, errorLocation, {
						timeout: 5000
					});

			function successLocation(position) {
				trustedAgentsPageViewInstance.lat = position.coords.latitude;
				trustedAgentsPageViewInstance.long = position.coords.longitude;
			}

			function errorLocation() {
				console.log("error in location");
			}
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function() {
			var options = {
					startIndex: 0,
					touchEnabled: false,
					direction: (getApplicationLanguage() == 'en') ? "ltr" : "rtl",
							onIndexChange: function() {
								document.getElementById("centerSheet").style.display = "none";
								document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
								renderOpticalCenters(opticalData);
							},
			}
			var tabs = new Tabs(trustedAgentsPageViewInstance.$el[0].querySelector(".tabsCont"), options);
			var VehiclesServicesEn = [{
				name: "Emarat Shamil",
				website: "http://www.shamil.ae",
				phone: "8004559"
			}, {
				name: "Enoc Tasjeel",
				website: "http://www.enoctasjeel.com",
				phone: "8003662"
			}, {
				name: "Wasel Vehicle Testing Center",
				website: "http://www.waselvehiclestesting.ae/en/",
				phone: "043245524"
			}, {
				name: "Almumayaz Vehicle Testing",
				website: "http://www.almumayaz.com",
				phone: "042840303"
			}, {
				name: "Tamam Vehicle Testing",
				website: "http://www.alghandi.com/tamam/",
				phone: "043334393"
			}, {
				name: "Cars VTC",
				website: "http://www.carsvtc.com",
				phone: "600567776"
			}, {
				name: "Speed Fit",
				website: "http://www.speedfit.me",
				phone: "042531700"
			}, {
				name: "Quick Registration",
				website: "http://quickregistration.ae",
				phone: "042633322"
			}, {
				name: "PAL Auto Garage",
				website: "http://www.palautogarage.com/",
				phone: "042971222"
			}, {
				name: "Platinum CWK Vehicles Registration Services",
				website: "http://www.platinumcwk.com",
				phone: "042790800"
			}, {
				name: "AL SHIRAWI Enterprises",
				website: "http://www.alshirawienterprises.com",
				phone: "043718585"
			}];
			var VehiclesServicesAr = [{
				name: "الامارات الشامل",
				website: "http://www.shamil.ae",
				phone: "8004559"
			}, {
				name: "اينوك تسجيل",
				website: "http://www.enoctasjeel.com",
				phone: "8003662"
			}, {
				name: "واصل لفحص المركبات",
				website: "http://www.waselvehiclestesting.ae/en/",
				phone: "043245524"
			}, {
				name: "المميز لفحص المركبات",
				website: "http://www.almumayaz.com",
				phone: "042840303"
			}, {
				name: "تمام لفحص المركبات",
				website: "http://www.alghandi.com/tamam/",
				phone: "043334393"
			}, {
				name: "كارس لفحص المركبات",
				website: "http://www.carsvtc.com",
				phone: "600567776"
			}, {
				name: "سبيد فت",
				website: "www.speedfit.me",
				phone: "042531700"
			}, {
				name: "كويك للتسجيل",
				website: "http://quickregistration.ae",
				phone: "042633322"
			}, {
				name: "كراج بال",
				website: "http://www.palautogarage.com/",
				phone: "042971222"
			}, {
				name: "بلاتينيوم",
				website: "http://www.platinumcwk.com",
				phone: "042790800"
			}, {
				name: "مشاريع الشيراوي",
				website: "http://www.alshirawienterprises.com",
				phone: "043718585"
			}];
			var DriversLicensingServicesEn = [{
				name: "Galadari",
				website: "http://gmdc.ae",
				phone: "600595956"
			}, {
				name: "Belhasa",
				website: "http://www.bdc.ae",
				phone: "8002354272"
			}, {
				name: "Emirates Driving Institute (EDI)",
				website: "http://edi-uae.com",
				phone: "042631100"
			}, {
				name: "Dubai Driving Center",
				website: "http://www.dubaidrivingcenter.net",
				phone: "043455855"
			}, {
				name: "Al Ahli Driving Center",
				website: "http://www.alahlidubai.ae",
				phone: "800252454"
			}, {
				name: "DriveDubai Driving Center",
				website: "http://www.drivedubai.ae",
				phone: "048855118"
			}];
			var DriversLicensingServicesAr = [{
				name: "كالداري",
				website: "http://gmdc.ae",
				phone: "600595956"
			}, {
				name: "بالحصاة",
				website: "http://www.bdc.ae",
				phone: "8002354272"
			}, {
				name: "مركز الامارات",
				website: "http://edi-uae.com",
				phone: "042631100"
			}, {
				name: "مركز دبي للسياقة",
				website: "http://www.dubaidrivingcenter.net",
				phone: "043455855"
			}, {
				name: "مركز الأهلي للسياقة",
				website: "http://www.alahlidubai.ae",
				phone: "800252454"
			}, {
				name: "درايف دبي",
				website: "http://www.drivedubai.ae",
				phone: "048855118"
			}];
			var template = document.getElementById("itemTemplate").getElementsByClassName("agentItem")[0];
			var openDial = function(num) {
				window.open('tel:' + num.replace(/\s/g, ''), '_system')
			}
			var VehiclesList, DriversList;
			if (getApplicationLanguage() == "en") {
				VehiclesList = VehiclesServicesEn;
				DriversList = DriversLicensingServicesEn;
			} else {
				VehiclesList = VehiclesServicesAr;
				DriversList = DriversLicensingServicesAr;
			}
			for (var i = 0; i < VehiclesList.length; i++) {
				var item = $(template).clone()[0];
				item.indx = i;
				item.getElementsByClassName("agentName")[0].innerText = VehiclesList[i].name;
				item.getElementsByClassName("agentPhone")[0].getElementsByTagName("span")[0].innerText = VehiclesList[i].phone;
				item.getElementsByClassName("agentPhone")[0].onclick = function() {
					openDial(VehiclesList[this.parentElement.indx].phone);
				}
				item.getElementsByClassName("agentWeb")[0].onclick = function() {
					window.open(VehiclesList[this.parentElement.indx].website, '_system')
				}
				document.getElementById("VehicleList").appendChild(item);
			}
			for (var i = 0; i < DriversList.length; i++) {
				var item = $(template).clone()[0];
				item.indx = i;
				item.getElementsByClassName("agentName")[0].innerText = DriversList[i].name;
				item.getElementsByClassName("agentPhone")[0].getElementsByTagName("span")[0].innerText = DriversList[i].phone;
				item.getElementsByClassName("agentPhone")[0].onclick = function() {
					openDial(DriversList[this.parentElement.indx].phone);
				}
				item.getElementsByClassName("agentWeb")[0].onclick = function() {
					window.open(DriversList[this.parentElement.indx].website, '_system')
				}
				document.getElementById("DriverList").appendChild(item);
			}
			// perpare object to show 
			function arraySearch(nameKey, myArray) {
				for (var i = 0; i < myArray.length; i++) {
					var currentelement = (myArray[i].attributes.CENTER_NAME_EN).replace("\n", "").split("-")[0];
					var tirmCurrent = currentelement.replace(/\s/g, '');
					var tirmKey = nameKey.replace(/\s/g, '');
					if (tirmCurrent === tirmKey) {
						return i;
					}
				}
				return -1;
			}
			var opticalData = []; // Global set objects after grouping
			CustomerSupportCenterModel.getTrustedAgents(function(cloneOpticals) {
				
				if (cloneOpticals) {
					var i = 0;
					while (cloneOpticals.hasOwnProperty('TrustedAgents')&&cloneOpticals.TrustedAgents.length > 0) {
						var count = 0
						var opticalObject = {};
						opticalObject.indx = i;
						var currentAgent = cloneOpticals.TrustedAgents[i].attributes;
						var centerName = currentAgent.CENTER_NAME_EN ? (currentAgent.CENTER_NAME_EN).replace("\n", "").split("-")[0] : "";
						var CenterName_Ar = currentAgent.CENTER_NAME_AR ? (currentAgent.CENTER_NAME_AR).replace("\n", "").split("-")[0] : "";
						opticalObject.CenterName = centerName ? centerName : "";
						opticalObject.CenterName_Ar = CenterName_Ar ? CenterName_Ar : "";
						opticalObject.CenterAddresses = [];
						for (var j = 0; j < cloneOpticals.TrustedAgents.length; j++) {
							var matchedelement = arraySearch(centerName, cloneOpticals.TrustedAgents);
							if (matchedelement >= 0) {
								opticalObject.CenterAddresses.push(cloneOpticals.TrustedAgents[matchedelement])
								count = count + 1;
								cloneOpticals.TrustedAgents.splice(matchedelement, 1)
								j = -1;
							} else {
								break;
							}
						}
						opticalObject.Count = count;
						opticalData.push(opticalObject);
					}
					renderOpticalCenters(opticalData);
					
				}
				else
					{
					// Read data from cashed
					opticalData=CustomerSupportCenterModel.getCashedOpticals();
					if(opticalData)
					   renderOpticalCenters(opticalData)
					}

			});


			function renderOpticalCenters(opticalList) {

				if (getApplicationLanguage() == "en") {
					document.getElementById("OpticalHead1").innerHTML = "All RTA trusted opticians listed below, provides";
					document.getElementById("OpticalHead2").innerHTML = "Eye testing services for Driver License and Drivers Experience Certificate ";
					document.getElementById("OpticalHead2").style.fontWeight = 'bold';
				} else {
					document.getElementById("OpticalHead1").innerHTML = "جميع RTA موثوق بها أخصائي العيون المذكورة أدناه ، يوفر";
					document.getElementById("OpticalHead2").innerHTML = "خدمات اختبار العين للحصول على رخصة القيادة وشهادة السائقين الخبرة";
					document.getElementById("OpticalHead2").style.fontWeight = 'bold';
				}

				
				if (opticalList&&opticalList.length==0) {
					// read from storage 
					CustomerSupportCenterModel.getOpticiansFromLocalStorage(function(data){
						renderopticiansList(data);
					});

				}
				else
				{
					renderopticiansList(opticalList)
				}



			}

			function renderopticiansList(opticalList){
				document.getElementById("opticalCenterAgents").innerHTML = "";
				document.getElementById("CenterAgentHead").innerHTML = "";
				var centertemplate = document.getElementById("itemTemplate").getElementsByClassName("centerHeaderItems")[0];


				for (var i = 0; i < opticalList.length; i++) {
					var item = $(centertemplate).clone()[0];
					item.indx = i;
					var centerName = opticalList[i].CenterName ? opticalList[i].CenterName : "";
					var centerName_Ar = opticalList[i].CenterName_Ar ? opticalList[i].CenterName_Ar : "";
					item.getElementsByClassName("centerAgentName")[0].innerText = getApplicationLanguage() == "en" ? centerName : centerName_Ar;
					var locationLocalize = getApplicationLanguage() == "en" ? " Locations " : " مواقع "
						item.getElementsByClassName("TrustedAgentscount")[0].innerText = opticalList[i].Count + locationLocalize;
					item.addEventListener("click", function(event) {
						var index = event.currentTarget.indx;
						renderAgentDetails(index, opticalList);
					});
					document.getElementById("CenterAgentHead").appendChild(item);
				}
			}

			function renderAgentDetails(index, opticalData) {
				document.getElementById("CenterAgentHead").innerHTML = "";
				document.getElementById("OpticalHead1").innerHTML = "";
				document.getElementById("OpticalHead2").innerHTML = "";
				var currentCenter = opticalData[index]
				if (currentCenter) {
					var CenterAdressestemplate = document.getElementById("itemTemplate").getElementsByClassName("centerAddresses")[0];
					// draw header
					var headerDiv = document.createElement("div");
					headerDiv.setAttribute("class", "headerAgenet");
					headerDiv.addEventListener("click", function() {
					renderOpticalCenters(opticalData);

						// Close open Details Sheet
						document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,200px,0)";
						document.getElementById("centerSheet").style.display = "none";
						document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
					});
					var headerSpan = document.createElement("span");
					var centerNameLocalize = getApplicationLanguage() == "en" ? currentCenter.CenterName : currentCenter.CenterName_Ar
							headerSpan.innerHTML = centerNameLocalize;
					var backSpan = document.createElement("i");
					backSpan.setAttribute("class", "icon icon-back");
					headerDiv.appendChild(backSpan);
					headerDiv.appendChild(headerSpan);
					backSpan.addEventListener("click", function(event) {
						renderOpticalCenters(opticalData);
					});
					document.getElementById("opticalCenterAgents").appendChild(headerDiv);
					for (var i = 0; i < currentCenter.CenterAddresses.length; i++) {
						var item = $(CenterAdressestemplate).clone()[0];
						item.indexCenter = index;
						item.indexAddress = i;
						var currentAddress = currentCenter.CenterAddresses[i].attributes;
						if (getApplicationLanguage() == "en") {
							var centerHeaderName=(currentAddress.CENTER_NAME_EN).split("-");
							item.getElementsByClassName("centeraddress")[0].innerText = centerHeaderName.length>1?centerHeaderName[1].replace("\n", ""):centerHeaderName;
							item.getElementsByClassName("workingdaysHeader")[0].innerText = "Working Days:";
							item.getElementsByClassName("workingHrsHeader")[0].innerText = "Working hrs:";
							item.getElementsByClassName("workingDays")[0].innerText = currentAddress.WORKING_DAYS_EN;
							item.getElementsByClassName("workinghrs")[0].innerText = currentAddress.OPERATING_HOURS_EN ? currentAddress.OPERATING_HOURS_EN.replace("From", "").replace("to", " - ") : "";
						} else {
							var centerHeaderName=(currentAddress.CENTER_NAME_AR).split("-");
							item.getElementsByClassName("centeraddress")[0].innerText = centerHeaderName.length>1?centerHeaderName[1].replace("\n", ""):centerHeaderName;
							item.getElementsByClassName("workingdaysHeader")[0].innerText = "أيام العمل:";
							item.getElementsByClassName("workingHrsHeader")[0].innerText = "ساعات العمل:";
							item.getElementsByClassName("workingDays")[0].innerText = currentAddress.WORKING_DAYS_AR ? currentAddress.WORKING_DAYS_AR : "";
							item.getElementsByClassName("workinghrs")[0].innerText = currentAddress.OPERATING_HOURS_AR ? currentAddress.OPERATING_HOURS_AR.replace("من", "").replace("إلى", " - ") : "";
						}
						item.getElementsByClassName("teleNumber")[0].innerText = currentAddress.TELEPHONE_NBR;
						item.getElementsByClassName("teleNumber")[0].onclick = function(event) {
							var telep = event.target.textContent;
							if (telep) {
								openDial(telep);
							}
						}
						if (trustedAgentsPageViewInstance.lat && trustedAgentsPageViewInstance.long) {
							currentCenter.CenterAddresses[i].attributes.Distance = getAgentDistances(currentCenter.CenterAddresses[i].geometry.y, currentCenter.CenterAddresses[i].geometry.x);
							item.getElementsByClassName("TrustedAgentscount")[0].innerText = currentCenter.CenterAddresses[i].attributes.Distance;
						}
						// click center and to show sheet
						item.addEventListener("click", function(event) {
							if (event.currentTarget.className.contains("selectedAgenet")) // if user click item selected before 
							{
								document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
								document.getElementById("centerSheet").style.display = "none"; // hide sheet
								return;
							}
							document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
							document.getElementById("centerSheet").style.display = "none"; // hide sheet
							
							var indexCenter = event.currentTarget.indexCenter;
							var indexAddress = event.currentTarget.indexAddress;
							var currentOpticalCenter = opticalData[indexCenter].CenterAddresses[indexAddress];
							var geometry = JSON.stringify(currentOpticalCenter.geometry); // set attribute for lat and long
							document.querySelector("#centerSheet .getDirections").setAttribute("geometry", geometry);
							document.getElementById("centerSheet").style.display = "block";
							document.querySelector("#centerSheet .sheetTitle").innerHTML = getApplicationLanguage() == "en" ? (currentOpticalCenter.attributes.CENTER_NAME_EN).replace("\n", "").split("-")[0] : (currentOpticalCenter.attributes.CENTER_NAME_AR).replace("\n", "").split("-")[0];
							document.querySelector("#centerSheet .distanceDetails").innerHTML = currentOpticalCenter.attributes.Distance ? currentOpticalCenter.attributes.Distance : "";
							var sheetTime = getApplicationLanguage() == "en" ? "<i>" + currentOpticalCenter.attributes.WORKING_DAYS_EN + "</i>" + " " + currentOpticalCenter.attributes.OPERATING_HOURS_EN : "<i>" + currentOpticalCenter.attributes.WORKING_DAYS_AR + "</i>" + " " + currentOpticalCenter.attributes.OPERATING_HOURS_AR;
							if (sheetTime) {
								sheetTime = sheetTime.replace("From", "");
								sheetTime = sheetTime.replace("to", "<i>to</i>");
								sheetTime = sheetTime.replace("من", "");
								sheetTime = sheetTime.replace("إلى", "<i>إلى</i>");
								sheetTime = getApplicationLanguage() == "en" ? sheetTime.replace("From", "").replace("to", "<i>to</i>") : sheetTime.replace("من", "").replace("إلى", "<i>إلى</i>");
							}
							document.querySelector("#centerSheet .sheetTime").innerHTML = sheetTime;
							document.querySelector("#centerSheet .sheetAddress").innerHTML = getApplicationLanguage() == "en" ? (currentOpticalCenter.attributes.CENTER_NAME_EN).replace("\n", "").split("-")[1] : (currentOpticalCenter.attributes.CENTER_NAME_AR).replace("\n", "").split("-")[1];
							this.classList.add("selectedAgenet");
						});
						document.querySelector("#centerSheet .closeSheet").addEventListener("click", function(event) {
							document.querySelector("#centerSheet").style.webkitTransform = "translate3d(0,200px,0)";
							document.getElementById("centerSheet").style.display = "none";
							document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
						});
						document.getElementById("opticalCenterAgents").appendChild(item);
					}
				}
			}

			function getAgentDistances(latCurrent, longCurrent) {
				var distanceBetweenLocations = getDistanceFromLatLonInKm(trustedAgentsPageViewInstance.lat, trustedAgentsPageViewInstance.long, latCurrent, longCurrent);
				if (distanceBetweenLocations < 1) {
					return Math.round(distanceBetweenLocations * 1000) + localize("%shell.dashboard.drivemodetile.meter%");
				} else {
					return Math.round(distanceBetweenLocations) + localize("%shell.greenpoints.km%");
				}
			}
			document.querySelector("#centerSheet .getDirections").onclick = function() {
				if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
					window.open("maps://?q=" + trustedAgentsPageViewInstance.lat + "," + trustedAgentsPageViewInstance.long, "_system");
				} else {
					var geometry = this.getAttribute("geometry")
					if (geometry) {
						var currentLocation = JSON.parse(geometry);
						var latLong = trustedAgentsPageViewInstance.lat + "," + trustedAgentsPageViewInstance.long;
						latLongDest = currentLocation.y + "," + currentLocation.x;
					}
					window.open("https://www.google.com/maps/dir/?api=1&origin=" + latLong + "&destination=" + latLongDest + "&travelmode=Driving", "_system");
				}
			};
			document.querySelector("#TrustedAgentsPage .tabContent").onclick = function() {
				document.getElementById("centerSheet").style.display = "none";
				document.getElementsByClassName("selectedAgenet")[0] ? document.getElementsByClassName("selectedAgenet")[0].classList.remove("selectedAgenet") : ""; // remove selected class
			};
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});
	// Returns the View class
	return TrustedAgentsPageView;
});
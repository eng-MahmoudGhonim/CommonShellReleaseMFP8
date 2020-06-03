
/* JavaScript content from js/com/models/shell/DashboardModel.js in folder common */
define(["com/models/Constants", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/models/drivers_and_vehicles/DVDashboardModel", "com/models/shell/MStoreCoverModel"], function (Constants, UserProfileModel, AuthenticationModel, dashboardModelDV, MStoreCoverModel) {
	var DashboardModel = Backbone.Model.extend({}, {
		isLoggedin: false,
		dashboardConfig: [],
		dashboardConfigGuest: [],
		dashboardConfigLogin: [],
		getTrafficFileNumber: function () {
			return dashboardModelDV.getTrafficFileNumber();
		},
		getCrisisAnnouncement:function(callback){
			try{
				var invocationData = {
						adapter: 'crisisAnnouncement',
						procedure: 'getCrisisAnnouncement',
						parameters: []
				};
				invokeWLResourceRequest(invocationData,
					function (result) {
						var bannerResult=result.invocationResult&&result.invocationResult.Current.resultSet?result.invocationResult.Current.resultSet:null;
				    	 if(bannerResult&&bannerResult.length>0)
						   callback(bannerResult[0]);
						   else
							   callback(null);
					},
					function (e) {
						callback(null);
						///for testing only /////////////////////////
						/*result=
						                      {
								 "BODY": "In line with the precautionary measures to ensure the highest levels of health and safety, we urge you to use our online services that are available round the clock. \nYour health is important to us!\n",
					                "EVENT_DATE": "31 MAR 2020, 03:23 pm",
					                "CREATED_DATE": "2020-04-02T15:38:32.000Z",
					                "ACTIVE": "true",
					                "EXTRNALURL": "https://www.rta.ae/wps/portal/rta/ae/home/public-transport-and-services-updates?lang=en",
					                "TITLE_AR": "مستجدات خدمات الهيئة",
					                "TITLE": "Operational timings & Services updates",
					                "ID": 1,
					                "TWITTERURL": "https://twitter.com/rta_dubai?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor",
					                "BODY_AR": "تماشيًا مع الإجراءات الاحترازية لضمان أعلى مستويات الصحة والسلامة ، ندعوك لاستخدام خدماتنا الإلكترونية  المتوفرة على مدار الساعة.\n صحتك تهمنا"
						                      };
						callback(result)*/

					}
				);
			}
			catch(e){
				console.log(e);
			}
		},
		getDeviceState: function () {
			//TODO get device internet connectivity and GPS connectivity
			var isOnline = navigator.onLine;
			return {
				internetOnline: isOnline,
				GPSOnline: true,
			}
		},
		isUserLoggedIn: function () {
			return AuthenticationModel.isAuthenticated();
		},
		isLocationEnabled: function (callBack) {
			navigator.geolocation.getCurrentPosition(function (e) {
				callBack(true, e);
			}, function (e) {
				callBack(false, e);
			},
			//			{enableHighAccuracy:false,maximumAge:Infinity, timeout:60000}
			{
				maximumAge: 3000,
				timeout: 3000,
				enableHighAccuracy: false
			}
			);
		},
		/************************************/
		// draw plates inside tiles in dashboard
		bindPlate:function(temp,plateOject){
			try{
				switch (plateOject.plate.plateSource) {
				case "Dubai":
				case "دبي":
					if (plateOject.plate.isDubaiMotorcycle && plateOject.plate.isDubaiMotorcycle == true) {
						temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceMotorcycle"):"";
						temp.querySelector(".plateCode")?temp.querySelector(".plateCode").classList.add("plateCodeMotorcycle"):"";
						temp.querySelector(".plateNo")?temp.querySelector(".plateNo").classList.add("plateNoMotorcycle"):"";
						temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-dubai-old"):"";
						temp.querySelector(".motorcycleIcon")?temp.querySelector(".motorcycleIcon").classList.add("icon-uae-bike"):"";
						temp.querySelector(".platCont")?temp.querySelector(".platCont").style.width="80px":"";
					} else
					{
						temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-dubai_logo"):"";
						temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceDubai"):"";
						temp.querySelector(".plateCode")?temp.querySelector(".plateCode").classList.add("plateCodeDubai"):"";
					}
					break;
				case "Abu Dhabi":
				case "أبو ظبي":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-abudhabi"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;
				case "Sharjah":
				case "الشارقة":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-sharjah"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;

				case "Umm AlQuwain":
				case "Umm Al Quwain":
				case "أم القيوين":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-uaq"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;
				case "Ras Al Khaimah":
				case "Ras Al Khaymah":
				case "رأس الخيمة":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-rak"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;
				case "Fujairah":
				case "Al Fujairah":
				case "الفجيرة":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-fujairah"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;
					// GCC Plates With Ajman
				case "Ajman":
				case "عجمان":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-ajman"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceOthers"):"";
					break;

				case "Oman":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-oman"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceGCC"):"";
					temp.querySelector(".plateNo")?temp.querySelector(".plateNo").classList.add("plateNoGCC"):"";
					temp .querySelector(".platCont")?temp .querySelector(".platCont").style.background="#ffb600":"";
					break;

				case "Bahrain":
					temp.querySelector(".plateCode")?temp.querySelector(".plateCode").style.display="none":"";
					temp.querySelector('.platCont img')?temp.querySelector('.platCont img').style.display="block":"";
					temp.querySelector('.platCont img')?temp.querySelector('.platCont img').src = "../../common/images/shell/emirates-plate-logos/bahrain-flag.png":"";
					temp.querySelector('.platCont img')?temp.querySelector('.platCont img').classList.add("plateCodeBahrain"):"";

					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-bahrain"):"";
					temp.querySelector(".plateNo")?temp.querySelector(".plateNo").classList.add("plateNoGCC"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceGCC"):"";
					break;
				case "KSA":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-saudi-arabia"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceGCC"):"";
					temp.querySelector(".plateNo")?temp.querySelector(".plateNo").classList.add("plateNoGCC"):"";
					temp .querySelector(".platCont")?temp .querySelector(".platCont").style.background="#ffffff":"";
					break;

				case "Kuwait":
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("icon-kuwait"):"";
					temp.querySelector(".platCont i")?temp.querySelector(".platCont i").classList.add("plateSourceKuwait"):"";
					temp.querySelector(".plateCode")?temp.querySelector(".plateCode").classList.add("plateCodeKuwait"):"";
					break;
				}}
			catch(e){
				console.log(e);
			}
		},
		/*
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************PARKING************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		parkingLoggedInControl: function (el) {
			el.querySelector(".clickPark").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onClickNParkClicked();
			};
			DashboardViewModel.parkingTile.showLoading();
			var slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var balanceUpdated = false;
			var balanceCounter = new CountUp(el.querySelector("#amount"), 100, 999, 0, 2, options);
			var runCounter = function () {
				if (!balanceUpdated) {
					var start, end;
					if (el.querySelector("#amount").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#amount"), start, end, 0, 2, options);
					balanceCounter.start(runCounter)
				}
			};
			balanceCounter.start(runCounter);

			/*****************************/
			dashboardModelDV.getParkingCashedBalance(function (balance) {
				if (balance != null && balance != undefined) {
					//    					DashboardViewModel.parkingTile.hideReload();
					balanceUpdated = true;
					//    					clearInterval(interval);
					balanceCounter = new CountUp(el.querySelector("#amount"), 100, balance, 0, 2, options);
					balanceCounter.start();
					dashboardModelDV.getParkingBalance(function (balance1) {
						if (balance1 != null && balance1 != undefined) {
							//        						DashboardViewModel.parkingTile.hideReload();
							balanceCounter = new CountUp(el.querySelector("#amount"), balance, balance1, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.parkingTile.hideLoading();
						} else {
							DashboardViewModel.parkingTile.hideLoading();
							DashboardViewModel.parkingTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				} else {
					dashboardModelDV.getParkingBalance(function (balance2) {
						if (!document.getElementById("dashboardPage")) return;
						//    						clearInterval(interval);
						if (balance2 != null && balance2 != undefined) {
							//    							DashboardViewModel.parkingTile.hideReload();
							balanceUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#amount"), 100, balance2, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.parkingTile.hideLoading();
						} else {
							balanceUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#amount"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.parkingTile.hideLoading();
							DashboardViewModel.parkingTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});
			/*******************************/
			var hasCashedTickets = false;
			var updateTicketsCounter = function (el, slider) {
				var timeDiff = el.expiryTime.getTime() - new Date().getTime();
				if (timeDiff > 0) {
					el.querySelector(".colun").style.opacity != 0 ? el.querySelector(".colun").style.opacity = 0 : el.querySelector(".colun").style.opacity = 1;
					var duration = convertMS(timeDiff);
					if (duration.d > 0) {
						var hoursPerDays = (duration.d) * 24;
						duration.h = duration.h + hoursPerDays;
					}

					var hour="h";
					var minute="m";
					var second="s";
					hour=getApplicationLanguage() == "ar"?"س":"h";
					minute=getApplicationLanguage() == "ar"?"د":"m";
					second=getApplicationLanguage() == "ar"?"ث":"s";

					if (duration.h > 0) {
						el.querySelector(".hours").textContent = duration.h + hour;
						el.querySelector(".minutes").textContent = duration.m + minute;
					} else {
						el.querySelector(".hours").textContent = duration.m + minute;
						el.querySelector(".minutes").textContent = duration.s + second;
					}
					setTimeout(function () {
						updateTicketsCounter(el, slider)
					}, 500);
				} else {
					slider.removeSlide(el);
					el = null;
				}
			}


			var bindActiveTickets = function (activeTickets) {
				try{
					var currentTickets = el.querySelectorAll(".activeTicket");
					for (var i = 0; i < currentTickets.length; i++) {
						currentTickets[i].parentElement.removeChild(currentTickets[i]);
					}
					for (var i = 0; i < activeTickets.length; i++) {
						var expiryTime = activeTickets[i].expiryTime;
						var timeDiff = expiryTime.getTime() - new Date().getTime();
						if (timeDiff > 0) {
							var temp = document.querySelector("#templates .activeTicket").cloneNode(true);
							if (activeTickets[i].plate.plateCode == "castle") {
								temp.querySelector("div.plateCode").style.display = "none";
							} else {
								temp.querySelector("div.plateCode").style.display = "block";
								temp.querySelector("div.plateCode").textContent = activeTickets[i].plate.plateCode;
							}
							temp.getElementsByTagName('img')[0].style.display="none";
							// draw plate
							DashboardModel.bindPlate(temp,activeTickets[i]);

							var plateNoDB="";
							if(activeTickets[i].plate&&activeTickets[i].plate.plateNo){
								plateNoDB=activeTickets[i].plate.plateNo;
								if(activeTickets[i].plate.plateNo.length>5){
									plateNoDB=getApplicationLanguage()=="ar"?".."+activeTickets[i].plate.plateNo.substring(0, 4):activeTickets[i].plate.plateNo.substring(0, 4)+"..";
								}
							}

							temp.querySelector(".plateNo").textContent =  plateNoDB;
							temp.querySelector(".zoneCont").textContent = activeTickets[i].zone.zoneNo + " " + activeTickets[i].zone.zoneCategory;
							temp.querySelector(".extendBtn").ticketId = activeTickets[i].ticketId;
							temp.querySelector(".extendBtn").onclick = function (e) {
								e.preventDefault();
								e.stopPropagation();
								dashboardModelDV.onExtendBtnClick(e.currentTarget.ticketId);
							}
							var duration = convertMS(timeDiff);
							if (duration.d > 0) {
								var hoursPerDays = (duration.d) * 24;
								duration.h = duration.h + hoursPerDays;
							}
							var hour="h";
							var minute="m";
							var second="s";
							hour=getApplicationLanguage() == "ar"?"س":"h";
							minute=getApplicationLanguage() == "ar"?"د":"m";
							second=getApplicationLanguage() == "ar"?"ث":"s";
							if (duration.h > 0) {

								second=getApplicationLanguage() == "ar"?"ث":"s";
								temp.querySelector(".hours").textContent = duration.h + hour;
								temp.querySelector(".minutes").textContent = duration.m + minute;
							} else {
								temp.querySelector(".hours").textContent = duration.m + minute;
								temp.querySelector(".minutes").textContent = duration.s + second;
							}
							temp.expiryTime = expiryTime;
							slider.addSlide(temp);
							updateTicketsCounter(temp, slider);
						}
					}}
				catch(e){
					console.log(e);
				}
			}
			var sortActiveTickets = function (a, b) {
				return a.expiryTime.getTime() - b.expiryTime.getTime();
			}
			dashboardModelDV.getCashedActiveTickets(function (activeTickets) {
				if (activeTickets != null && activeTickets.length != 0) {
					//        				DashboardViewModel.parkingTile.hideReload();
					bindActiveTickets(activeTickets.sort(sortActiveTickets));
					dashboardModelDV.getParkingActiveTickets(function (activeTickets1) {
						if (activeTickets1 != null) {
							//        						DashboardViewModel.parkingTile.hideReload();
							bindActiveTickets(activeTickets1.sort(sortActiveTickets));
						} else {
							//                            DashboardViewModel.parkingTile.showReload();
							//show reload
						}
					});
				} else {
					dashboardModelDV.getParkingActiveTickets(function (activeTickets) {
						if (!document.getElementById("dashboardPage")) return;
						if (activeTickets != null) {
							//        						DashboardViewModel.parkingTile.hideReload();
							if (activeTickets.length != 0) {
								bindActiveTickets(activeTickets.sort(sortActiveTickets));
							}
						} else {
							//                            DashboardViewModel.parkingTile.showReload();
							//show reload
						}
						//						DashboardViewModel.onReloadFinished();
					});
				}
			});
			this.reload = function (callBack) {
				DashboardViewModel.parkingTile.showLoading();
				var ayncRemaining = 2;
				var responses = [];
				var options = {
						useEasing: false,
						useGrouping: true,
						separator: ',',
						decimal: '.',
						prefix: '',
						suffix: ''
				};
				dashboardModelDV.getParkingBalance(function (balance2) {
					if (!document.getElementById("dashboardPage")) return;
					if (balance2 != null && balance2 != undefined) {
						balanceUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#amount"), el.querySelector("#amount").innerText, balance2, 0, 2, options);
						balanceCounter.start();
						responses.push(true);
					} else {
						responses.push(false);
					}
					if (responses.length == ayncRemaining) {
						DashboardViewModel.parkingTile.hideLoading();
						var succeded = true;
						for (var i = 0; i < responses.length; i++) {
							succeded = (responses[i] && succeded);
						}
						callBack(succeded, DashboardViewModel.parkingTile)
						DashboardViewModel.onReloadFinished();
					}
				});
				dashboardModelDV.getParkingActiveTickets(function (activeTickets) {
					if (!document.getElementById("dashboardPage")) return;
					if (activeTickets != null) {
						//						DashboardViewModel.parkingTile.hideReload();
						if (activeTickets.length != 0) {
							bindActiveTickets(activeTickets.sort(sortActiveTickets));
						}
						responses.push(true);
					} else {
						responses.push(false);
					}
					if (responses.length == ayncRemaining) {
						DashboardViewModel.parkingTile.hideLoading();
						var succeded = true;
						for (var i = 0; i < responses.length; i++) {
							succeded = (responses[i] && succeded);
						}
						callBack(succeded, DashboardViewModel.parkingTile)
						DashboardViewModel.onReloadFinished();
					}
				});
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		parkingGuestOnlineControl: function (el) {
			el.querySelector(".clickParkBtn ").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onClickNParkClicked();
			}
			DashboardViewModel.parkingTile.showLoading();
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var Counter = new CountUp(el.querySelector(".zoneNo"), 100, 999, 0, 2, options);
			var zoneUpdated = false;
			var runCounter = function () {
				if (!zoneUpdated) {
					var start, end;
					if (el.querySelector(".zoneNo").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					Counter = new CountUp(el.querySelector(".zoneNo"), start, end, 0, 2, options);
					Counter.start(runCounter)
				}
			};
			Counter.start(runCounter);
			DashboardModel.isLocationEnabled(function (enabled, data) {
				if (!document.getElementById("dashboardPage")) return;
				if (enabled) {
					dashboardModelDV.getNearstZone(function (response) {
						if (!document.getElementById("dashboardPage")) return;
						DashboardViewModel.parkingTile.hideLoading();
						zoneUpdated = true;
						if (response) {
							Counter = new CountUp(el.querySelector(".zoneNo"), el.querySelector(".zoneNo").innerText, response.zoneNo, 0, 2, options);
							Counter.start(runCounter);
							el.querySelector(".zoneCat").innerText = response.zoneCategory;
							el.querySelector(".distanceTime").innerText = Number(response.distance).toFixed(0) + " " + localize("%shell.dashboard.parkingtile.metersaway%");
						} else {
							DashboardViewModel.parkingTile.template = "guestTempOffline";
						}
					}, data);
				} else {
					if (DashboardViewModel.parkingTile) DashboardViewModel.parkingTile.hideLoading();
					zoneUpdated = true;
					DashboardViewModel.parkingTile.template = "guestTempOffline";
				}
			});
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		parkingGuestOfflineControl: function (el) { },
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *******************************FINES**************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		finesLoggedInControl: function (el) {
			el.querySelector(".payfineBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onPayNowBtnClick();
			}
			el.querySelector("#TFN").innerText = dashboardModelDV.getTrafficFileNumber();
			DashboardViewModel.finesTile.showLoading();
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var finesUpdated = false;
			var balanceCounter = new CountUp(el.querySelector("#amount"), 100, 999, 0, 2, options);
			var runCounter = function () {
				if (!finesUpdated) {
					var start, end;
					if (el.querySelector("#amount").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#amount"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			balanceCounter.start(runCounter);
			dashboardModelDV.getCashedFines(function (fines) {
				if (fines != null && fines != undefined) {
					if (fines > 0) {
						finesUpdated = true;
						balanceCounter = new CountUp(el.querySelector("#amount"), 100, fines, 0, 2, options);
						balanceCounter.start();
					}
					dashboardModelDV.getFines(function (fines1) {
						if (!document.getElementById("dashboardPage")) return;
						if (fines1 != null && fines1 != undefined) {
							finesUpdated = true;
							DashboardViewModel.finesTile.hideLoading();
							if (fines1 > 0) {
								balanceCounter = new CountUp(el.querySelector("#amount"), fines, fines1, 0, 2, options);
								balanceCounter.start();
							} else if (fines1 < 0) {
								DashboardViewModel.finesTile.template = "loggedInNonPayableFines";
							} else {
								DashboardViewModel.finesTile.template = "loggedInNoFines";
							}
						} else {
							DashboardViewModel.finesTile.hideLoading();
							if (fines > 0) {
								finesUpdated = true;
								DashboardViewModel.finesTile.showReload();
							} else {
								finesUpdated = true;
								balanceCounter = new CountUp(el.querySelector("#amount"), 100, 0, 0, 2, options);
								balanceCounter.start();
								DashboardViewModel.finesTile.showReload();
							}
						}
						DashboardViewModel.onReloadFinished();
					});
				} else {
					dashboardModelDV.getFines(function (fines2) {
						if (!document.getElementById("dashboardPage")) return;
						if (fines2 != null && fines2 != undefined) {
							finesUpdated = true;
							DashboardViewModel.finesTile.hideLoading();
							if (fines2 > 0) {
								balanceCounter = new CountUp(el.querySelector("#amount"), 100, fines2, 0, 2, options);
								balanceCounter.start();
							} else if (fines2 < 0) {
								DashboardViewModel.finesTile.template = "loggedInNonPayableFines";
							} else {
								DashboardViewModel.finesTile.template = "loggedInNoFines";
							}
						} else {
							DashboardViewModel.finesTile.hideLoading();
							finesUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#amount"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.finesTile.showReload();
							//show reload
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});
			this.reload = function (callBack) {
				DashboardViewModel.finesTile.showLoading();
				dashboardModelDV.getFines(function (fines2) {
					if (!document.getElementById("dashboardPage")) return;
					DashboardViewModel.finesTile.hideLoading();
					if (fines2 != null && fines2 != undefined) {
						if (fines2 > 0) {
							balanceCounter = new CountUp(el.querySelector("#amount"), 0, fines2, 0, 2, options);
							balanceCounter.start();
						} else if (fines2 < 0) {
							DashboardViewModel.finesTile.template = "loggedInNonPayableFines";
						} else {
							DashboardViewModel.finesTile.template = "loggedInNoFines";
						}
						callBack(true, DashboardViewModel.finesTile);
					} else {
						callBack(false, DashboardViewModel.finesTile);
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		finesGuestTemp: function (el) {
			el.querySelector(".payfineBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onPayAFineBtnClick();
				//				var loginRegisterPopup = new Popup("loginRegisterPopup");
				//				loginRegisterPopup.show();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		finesLoggedInNoFines: function (el) {
			el.querySelector(".payfineBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onPayForFriendClick();
				//				dashboardModelDV.onPayAFineBtnClick();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * ******************************Drivers************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */

		driverGuestTemp: function (el) {
			el.querySelector(".linkBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				// dashboardModelDV.onLinkBtnDriverTileClick();
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}
		},
		driverLoggedInNoTFN: function (el) {
			el.querySelector(".linkBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onLinkTrafficFileClick();
			}
		},
		driversLoggedInControl: function (el) {
			var slider = null;
			var clearSlider = function () {
				if (slider != null) {
					var slides = slider.el.querySelectorAll(".slide");
					for (var j = 0; j < slides.length; j++) {
						slider.removeSlide(slides[j]);
					}
				} else {
					el.querySelector(".slidsCont").innerHTML = "";
				}
			}
			var bindLicenseAndPermit = function (driverTileDetails) {
				if (isEmpty(driverTileDetails)){
					DashboardViewModel.driverTile.template="loggedInNoLicenseNoPermit";
					return;
				}
				clearSlider();

				if (driverTileDetails && driverTileDetails.permitDetails) {
					var permitTemp = document.querySelector("#templates #driverTilePermitTemplate").cloneNode(true);
					permitTemp.className = "slide";
					permitTemp.querySelector("#driverlicNumber").textContent = driverTileDetails.permitDetails.permitNumber;
					permitTemp.querySelector("#permitClass").textContent = driverTileDetails.permitDetails.classType;
					permitTemp.querySelector("#expireDate").textContent = driverTileDetails.permitDetails.expiredate;
					if (driverTileDetails.permitDetails.isToExpire == true) permitTemp.querySelector("#expireDate").style.color = "red";


				}

				if (driverTileDetails && driverTileDetails.licenseDetails) {
					var driverTemp = document.querySelector("#templates #driverTileLicenseTemplate").cloneNode(true);
					driverTemp.className = "slide";
					driverTemp.querySelector("#driverlicNumber").textContent = driverTileDetails.licenseDetails.licenseNumber;
					driverTemp.querySelector("#blackPoints").textContent = driverTileDetails.licenseDetails.blackpoints;
					driverTemp.querySelector("#expireDate").textContent = driverTileDetails.licenseDetails.expiredate;
					if (driverTileDetails.licenseDetails.isToExpire == true) driverTemp.querySelector("#expireDate").style.color = "red";

				}
				if (getApplicationLanguage() == "en") {
					if (permitTemp) el.querySelector(".slidsCont").appendChild(permitTemp);
					if (driverTemp) el.querySelector(".slidsCont").appendChild(driverTemp);
				} else {
					if (driverTemp) el.querySelector(".slidsCont").appendChild(driverTemp);
					if (permitTemp) el.querySelector(".slidsCont").appendChild(permitTemp);
				}


				setTimeout(function () {
					slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
				});
			}
			DashboardViewModel.driverTile.showLoading();
			dashboardModelDV.getCashedLicenseAndPermitDetails(function (driverTileDetailsCached) {


				if (driverTileDetailsCached != null && driverTileDetailsCached != undefined) {

					bindLicenseAndPermit(driverTileDetailsCached);
					dashboardModelDV.getLicenseAndPermitDetails(function (driverTileDetails) {
						if (!document.getElementById("dashboardPage")) return;
						if (driverTileDetails != null && driverTileDetails != undefined) {
							bindLicenseAndPermit(driverTileDetails);
							if (DashboardViewModel.driverTile) DashboardViewModel.driverTile.hideLoading();
						} else {
							DashboardViewModel.driverTile.hideLoading();
							DashboardViewModel.driverTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				} else {
					dashboardModelDV.getLicenseAndPermitDetails(function (driverTileDetails) {
						if (!document.getElementById("dashboardPage")) return;
						if (driverTileDetails != null && driverTileDetails != undefined) {
							bindLicenseAndPermit(driverTileDetails);
							if (DashboardViewModel.driverTile) DashboardViewModel.driverTile.hideLoading();
						} else {
							DashboardViewModel.driverTile.hideLoading();
							DashboardViewModel.driverTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});

			this.reload = function (callBack) {
				DashboardViewModel.driverTile.showLoading();
				dashboardModelDV.getLicenseAndPermitDetails(function (driverTileDetails) {
					if (!document.getElementById("dashboardPage")) return;
					if (driverTileDetails != null && driverTileDetails != undefined) {
						bindLicenseAndPermit(driverTileDetails);
						if (DashboardViewModel.driverTile) DashboardViewModel.driverTile.hideLoading();
						callBack(true, DashboardViewModel.driverTile)
					} else {
						DashboardViewModel.driverTile.hideLoading();
						DashboardViewModel.driverTile.showReload();
						callBack(false, DashboardViewModel.driverTile)
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},

		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * ******************************VEHICLES************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		vehiclesLoggedInControl: function (el) {
			DashboardViewModel.vehicleTile.showLoading();
			var slider = null;
			dashboardModelDV.getCashedVehicles(function (vehicles) {
				if (vehicles != null && vehicles != undefined) {
					if (vehicles.length > 0) {
						var length = vehicles.length > 4 ? 4 : vehicles.length
								for (var i = 0; i < length; i++) {
									var vehicleTemp = document.querySelector("#templates #vehicleTileTemplate").cloneNode(true);
									//vehicleTemp.querySelector(".carLogo").src = vehicles[i].carLogo;
									vehicleTemp.querySelector(".carName").textContent = vehicles[i].carName;
									vehicleTemp.querySelector(".plateCode").textContent = vehicles[i].plate.plateCode;

									// Draw Plate
									DashboardModel.bindPlate(vehicleTemp,vehicles[i]);
									var plateNoDB="";
									if( vehicles[i].plate&& vehicles[i].plate.plateNo){
										plateNoDB=vehicles[i].plate.plateNo;
										if( vehicles[i].plate.plateNo.length>5){
											plateNoDB= vehicles[i].plate.plateNo.substring(0, 4)+"..";
										}
									}

									vehicleTemp.querySelector(".plateNo").textContent = plateNoDB;
									var expiryDate = vehicles[i].expiryDate;
									vehicleTemp.querySelector(".expiryDate").textContent = expiryDate.getDate() + '/' + (expiryDate.getMonth() + 1) + '/' + expiryDate.getFullYear();
									vehicleTemp.id = "";
									vehicleTemp.className = "slide";
									el.querySelector(".slidsCont").appendChild(vehicleTemp);
								}
						setTimeout(function () {
							slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
						});
					}
					dashboardModelDV.getVehicles(function (vehicles) {
						if (!document.getElementById("dashboardPage")) return;
						DashboardViewModel.vehicleTile.hideLoading();
						if (vehicles != null && vehicles != undefined) {
							if (slider != null) {
								var slides = slider.el.querySelectorAll(".slide");
								for (var j = 0; j < slides.length; j++) {
									slider.removeSlide(slides[j]);
								}
							} else {
								el.querySelector(".slidsCont").innerHTML = "";
							}
							if (vehicles.length > 0) {
								var length = vehicles.length> 4 ? 4 : vehicles.length
										for (var i = 0; i < length; i++) {
											var vehicleTemp = document.querySelector("#templates #vehicleTileTemplate").cloneNode(true);
											//vehicleTemp.querySelector(".carLogo").src = vehicles[i].carLogo;
											vehicleTemp.querySelector(".carName").textContent = vehicles[i].carName;
											vehicleTemp.querySelector(".plateCode").textContent = vehicles[i].plate.plateCode;

											DashboardModel.bindPlate(vehicleTemp,vehicles[i]);

											var plateNoDB="";
											if( vehicles[i].plate&& vehicles[i].plate.plateNo){
												plateNoDB=vehicles[i].plate.plateNo;
												if( vehicles[i].plate.plateNo.length>5){
													plateNoDB= vehicles[i].plate.plateNo.substring(0, 4)+"..";
												}
											}

											vehicleTemp.querySelector(".plateNo").textContent = plateNoDB;
											var expiryDate = vehicles[i].expiryDate;
											vehicleTemp.querySelector(".expiryDate").textContent = expiryDate.getDate() + '/' + (expiryDate.getMonth() + 1) + '/' + expiryDate.getFullYear();
											vehicleTemp.id = "";
											vehicleTemp.className = "slide";
											if (slider != null) {
												slider.addSlide(vehicleTemp);
											} else {
												el.querySelector(".slidsCont").appendChild(vehicleTemp);
											}
										}
								setTimeout(function () {
									slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
								});
							} else {
								DashboardViewModel.vehicleTile.template = "loggedInNoVehicles";
							}
						} else {
							DashboardViewModel.vehicleTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				} else {
					dashboardModelDV.getVehicles(function (vehicles) {
						if (!document.getElementById("dashboardPage")) return;
						DashboardViewModel.vehicleTile.hideLoading();
						if (vehicles != null && vehicles != undefined) {
							if (slider != null) {
								var slides = slider.el.querySelectorAll(".slide");
								for (var j = 0; j < slides.length; j++) {
									slider.removeSlide(slides[j]);
								}
							} else {
								el.querySelector(".slidsCont").innerHTML = "";
							}
							if (vehicles.length > 0) {
								var length = vehicles.length > 4 ? 4 : vehicles.length
										for (var i = 0; i < length; i++) {
											var vehicleTemp = document.querySelector("#templates #vehicleTileTemplate").cloneNode(true);
											vehicleTemp.querySelector(".carLogo").src = vehicles[i].carLogo;
											vehicleTemp.querySelector(".carName").textContent = vehicles[i].carName;
											vehicleTemp.querySelector(".plateCode").textContent = vehicles[i].plate.plateCode;
											vehicleTemp.querySelector(".plateNo").textContent = vehicles[i].plate.plateNo;
											var expiryDate = vehicles[i].expiryDate;
											vehicleTemp.querySelector(".expiryDate").textContent = expiryDate.getDate() + '/' + (expiryDate.getMonth() + 1) + '/' + expiryDate.getFullYear();
											vehicleTemp.id = "";
											vehicleTemp.className = "slide";
											if (slider != null) {
												slider.addSlide(vehicleTemp);
											} else {
												el.querySelector(".slidsCont").appendChild(vehicleTemp);
											}
										}
								setTimeout(function () {
									slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
								});
							} else {
								DashboardViewModel.vehicleTile.template = "loggedInNoVehicles";
							}
						} else {
							DashboardViewModel.vehicleTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});
			this.reload = function (callBack) {
				DashboardViewModel.vehicleTile.showLoading();
				dashboardModelDV.getVehicles(function (vehicles) {
					if (!document.getElementById("dashboardPage")) return;
					DashboardViewModel.vehicleTile.hideLoading();
					if (vehicles != null && vehicles != undefined) {
						if (slider != null) {
							var slides = slider.el.querySelectorAll(".slide");
							for (var j = 0; j < slides.length; j++) {
								slider.removeSlide(slides[j]);
							}
						} else {
							el.querySelector(".slidsCont").innerHTML = "";
						}
						if (vehicles.length > 0) {
							var length = vehicles.length > 4 ? 4 : vehicles.length
									for (var i = 0; i < length; i++) {
										var vehicleTemp = document.querySelector("#templates #vehicleTileTemplate").cloneNode(true);
										vehicleTemp.querySelector(".carLogo").src = vehicles[i].carLogo;
										vehicleTemp.querySelector(".carName").textContent = vehicles[i].carName;
										vehicleTemp.querySelector(".plateCode").textContent = vehicles[i].plate.plateCode;
										vehicleTemp.querySelector(".plateNo").textContent = vehicles[i].plate.plateNo;
										var expiryDate = vehicles[i].expiryDate;
										vehicleTemp.querySelector(".expiryDate").textContent = expiryDate.getDate() + '/' + (expiryDate.getMonth() + 1) + '/' + expiryDate.getFullYear();
										vehicleTemp.id = "";
										vehicleTemp.className = "slide";
										if (slider != null) {
											slider.addSlide(vehicleTemp);
										} else {
											el.querySelector(".slidsCont").appendChild(vehicleTemp);
										}
									}
							setTimeout(function () {
								slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
							});
							DashboardViewModel.onReloadFinished();
						} else {
							DashboardViewModel.vehicleTile.template = "loggedInNoVehicles";
						}
						callBack(true, DashboardViewModel.vehicleTile)
					} else {
						DashboardViewModel.vehicleTile.showReload();
						callBack(false, DashboardViewModel.vehicleTile)
					}
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		vehicleGuestTemp: function (el) {
			el.querySelector(".payfineBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		LoggedInNoTFN: function (el) {
			el.querySelector(".payfineBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onLinkTrafficFileClick();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *****************************PLATES***************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		platesControl: function (el) {
			el.querySelector(".platesBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onPlatesForSaleBtnClick();
			}
			//			var slider = null;
			//			DashboardViewModel.platesTile.showLoading();
			//			dashboardModelDV.getCashedPlatesForSale(function (plates) {
			//			if (plates != null && plates != undefined) {
			//			for (var i = 0; i < 2; i++) {
			//			el.querySelectorAll(".plateCode")[i].textContent = plates[i].plateCode;
			//			el.querySelectorAll(".plateSource")[i].textContent = plates[i].plateSource;
			//			el.querySelectorAll(".plateNo")[i].textContent = plates[i].plateNo;
			//			}
			//			dashboardModelDV.getPlatesForSale(function (plates) {
			//			DashboardViewModel.platesTile.hideLoading();
			//			if (plates != null && plates != undefined) {
			//			if (plates.length > 0) {
			//			for (var i = 0; i < 2; i++) {
			//			el.querySelectorAll(".plateCode")[i].textContent = plates[i].plateCode;
			//			el.querySelectorAll(".plateSource")[i].textContent = plates[i].plateSource;
			//			el.querySelectorAll(".plateNo")[i].textContent = plates[i].plateNo;
			//			}
			//			} else {
			//			//								DashboardViewModel.vehicleTile.template = "loggedInNoVehicles";
			//			}
			//			} else {
			//			DashboardViewModel.platesTile.showReload();
			//			}
			//			});
			//			} else {
			//			dashboardModelDV.getPlatesForSale(function (plates) {
			//			DashboardViewModel.platesTile.hideLoading();
			//			if (plates != null && plates != undefined) {
			//			if (plates.length > 0) {
			//			for (var i = 0; i < 2; i++) {
			//			el.querySelectorAll(".plateCode")[i].textContent = plates[i].plateCode;
			//			el.querySelectorAll(".plateSource")[i].textContent = plates[i].plateSource;
			//			el.querySelectorAll(".plateNo")[i].textContent = plates[i].plateNo;
			//			}
			//			} else {
			//			//								DashboardViewModel.vehicleTile.template = "loggedInNoVehicles";
			//			}
			//			} else {
			//			DashboardViewModel.platesTile.showReload();
			//			}
			//			});
			//			}
			//			});
			//			this.reload = function (callBack) {
			//			DashboardViewModel.platesTile.showLoading();
			//			dashboardModelDV.getPlatesForSale(function (plates) {
			//			DashboardViewModel.platesTile.hideLoading();
			//			if (plates != null && plates != undefined) {
			//			if (plates.length > 0) {
			//			for (var i = 0; i < 2; i++) {
			//			el.querySelectorAll(".plateCode")[i].textContent = plates[i].plateCode;
			//			el.querySelectorAll(".plateSource")[i].textContent = plates[i].plateSource;
			//			el.querySelectorAll(".plateNo")[i].textContent = plates[i].plateNo;
			//			}
			//			} else {
			//			//show no vehicles
			//			}
			//			callBack(true,DashboardViewModel.platesTile)
			//			} else {
			//			DashboardViewModel.platesTile.showReload();
			//			callBack(false,DashboardViewModel.platesTile)
			//			}
			//			});
			//			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * ********************************DOCS**************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		docsControl: function (el) {
			el.querySelector(".applyMcert").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onApplyFormCertClick();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * ******************************mStore**************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		mStoreGuestControl: function (el) {
			el.querySelector(".scanNow").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}
		},
		mStoreNoTFNControl: function (el) {
			el.querySelector(".scanNow").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onLinkTrafficFileClick();
			}
		},
		mStoreLoggedInTFNControl: function (el) {
			DashboardViewModel.myDocsTile.showLoading();
			el.querySelector(".scanNow").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				mobile.changePage("shell/mstore.html");
			};
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};
			var countUpdated = false;
			var balanceCounter = new CountUp(el.querySelector(".count"), 0, 10, 0, 2, options);
			var runCounter = function () {
				if (!countUpdated) {
					var start, end;
					if (el.querySelector(".count").innerText > 10) {
						start = 20;
						end = 10;
					} else {
						start = 10;
						end = 20;
					}
					balanceCounter = new CountUp(el.querySelector(".count"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			balanceCounter.start(runCounter);
			var userId = UserProfileModel.getUserProfile().Users[0].user_id;
			MStoreCoverModel.requestCardsDetails(userId, "", function (result) {
				if (!document.getElementById("dashboardPage")) return;
				DashboardViewModel.myDocsTile.hideLoading();
				countUpdated = true;
				var count = 0;
				for (var i in result) {
					count += Object.keys(result[i]).length
				}
				balanceCounter = new CountUp(el.querySelector(".count"), 0, count, 0, 2, options);
				balanceCounter.start();
			});
			this.reload = function (callBack) {
				DashboardViewModel.myDocsTile.showLoading();
				var userId = UserProfileModel.getUserProfile().Users[0].user_id;
				MStoreCoverModel._invokeBackendToGetData(userId, "", function (result) {
					if (!document.getElementById("dashboardPage")) return;
					DashboardViewModel.myDocsTile.hideLoading();
					countUpdated = true;
					var count = 0;
					for (var i in result) {
						count += Object.keys(result[i]).length
					}
					balanceCounter = new CountUp(el.querySelector(".count"), 0, count, 0, 2, options);
					balanceCounter.start();
					callBack(true, DashboardViewModel.myDocsTile)
					DashboardViewModel.onReloadFinished();
				});
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *****************************SALIK****************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		salikGuestControl: function (el) {
			//			el.querySelector(".rechargeBtn").onclick = function(e){
			//			e.preventDefault();
			//			e.stopPropagation();
			//			var loginRegisterPopup = new Popup("loginRegisterPopup");
			//			loginRegisterPopup.show();
			//			}
			el.querySelector(".rechargeBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				// dashboardModelDV.onLinkSalikBtnClickForGuest();
				var loginRegisterPopup = new Popup("loginRegisterPopup");
				loginRegisterPopup.show();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		salikLoggedInNoAcc: function (el) {
			el.querySelector(".rechargeBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onLinkSalikBtnClick();
			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		isUserLinkedToSalik: function (callback) {

			UserProfileModel.getServiceRelatedInfoByKey("SALIK", function (salikObject) {
				if (!isUndefinedOrNullOrBlank(salikObject) && !isUndefinedOrNullOrBlank(salikObject.serviceId))
					callback(true);
				else
					callback(false);
			}, false);

		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		getCurrentLinkingDetails: function (callback) {

			UserProfileModel.getServiceRelatedInfoByKey("ALL", function (serviceRelatedInfo) {
				if (!isUndefinedOrNullOrBlank(serviceRelatedInfo)) {
					callback(serviceRelatedInfo);
				} else
					callback(null);
			}, true);

		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 */
		salikLoggedInAcc: function (el) {
			el.querySelector(".rechargeBtn").onclick = function (e) {
				e.preventDefault();
				e.stopPropagation();
				dashboardModelDV.onRechargeBtnClick();
			}
			DashboardViewModel.salikTile.showLoading();
			var slider = new BulletSlider(el.querySelector('.bulletSlider'), true);
			var options = {
					useEasing: false,
					useGrouping: true,
					separator: ',',
					decimal: '.',
					prefix: '',
					suffix: ''
			};

			var showAccountNumber = function (el, acc) {
				if (!isUndefinedOrNullOrBlank(acc)) {
					el.querySelector("#ACNo").innerText = acc;
					el.querySelector("#parkingBalance .accDesc").style.display = 'block';
				} else {
					el.querySelector("#parkingBalance .accDesc").style.display = 'none';
				}
			}
			var balanceUpdated = false;
			var balanceCounter = new CountUp(el.querySelector("#amount"), 100, 999, 0, 2, options);
			var runCounter = function () {
				if (!balanceUpdated) {
					var start, end;
					if (el.querySelector("#amount").innerText > 100) {
						start = 999;
						end = 100;
					} else {
						start = 100;
						end = 999;
					}
					balanceCounter = new CountUp(el.querySelector("#amount"), start, end, 0, 2, options);
					balanceCounter.start(runCounter);
				}
			}
			balanceCounter.start(runCounter);
			/// GET SALIK BALANCE
			dashboardModelDV.getCashedSalikBalance(function (result) {

				if (result != null && result != undefined) {
					var balance = result.balance;
					//if cached balance
					balanceUpdated = true;
					balanceCounter = new CountUp(el.querySelector("#amount"), 100, balance, 0, 2, options);
					balanceCounter.start();
					showAccountNumber(el, result.accountNumber);
					dashboardModelDV.getSalikBalance(function (result1) {

						if (!document.getElementById("dashboardPage")) return;
						if (result1 != null && result1 != undefined) {
							var balance1 = result1.balance;
							if (balance1 == -1) {
								DashboardViewModel.salikTile.template = "loggedInNoAcc";
							}
							balanceUpdated = true;
							if (DashboardViewModel.salikTile) DashboardViewModel.salikTile.hideLoading();
							balanceCounter = new CountUp(el.querySelector("#amount"), balance, balance1, 0, 2, options);
							balanceCounter.start();
							showAccountNumber(el, result1.accountNumber);
						} else {
							DashboardViewModel.salikTile.hideLoading();
							balanceUpdated = true;
							DashboardViewModel.salikTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				} else {
					// if there is NO cached balance
					dashboardModelDV.getSalikBalance(function (result2) {
						if (!document.getElementById("dashboardPage")) return;
						if (result2 != null && result2 != undefined) {
							var balance2 = result2.balance;
							balanceUpdated = true;
							DashboardViewModel.salikTile.hideLoading();

							if (balance2 == -1) {
								DashboardViewModel.salikTile.template = "loggedInNoAcc";
							} else {
								balanceCounter = new CountUp(el.querySelector("#amount"), 100, balance2, 0, 2, options);
								balanceCounter.start();
								showAccountNumber(el, result2.accountNumber);
							}

						} else {
							DashboardViewModel.salikTile.hideLoading();
							balanceUpdated = true;
							balanceCounter = new CountUp(el.querySelector("#amount"), 100, 0, 0, 2, options);
							balanceCounter.start();
							DashboardViewModel.salikTile.showReload();
						}
						DashboardViewModel.onReloadFinished();
					});
				}
			});
			/// GET LATEST SALIK DISPUTE
			/*******************************/
			// var hasCashedSalikDispute = false;
			var bindSalikDispute = function (salikDispute) {
				try {
					console.log(salikDispute);
					if (salikDispute.disputeNumber != null && salikDispute.disputeNumber != undefined) {
						var currentDisputes = el.querySelectorAll(".salikDispute");
						for (var i = 0; i < currentDisputes.length; i++) {
							currentDisputes[i].parentElement.removeChild(currentDisputes[i]);
						}
						var temp = document.querySelector("#templates .salikDispute").cloneNode(true);
						temp.querySelector(".disputeNumber").textContent = salikDispute.disputeNumber;
						temp.querySelector("#disputeDate").textContent = salikDispute.disputeDate;
						//Handle view dispute Button
						temp.querySelector(".viewDisputeBtn").disputeNumber = salikDispute.disputeNumber;
						temp.querySelector(".viewDisputeBtn").onclick = function (e) {
							e.preventDefault();
							e.stopPropagation();
							dashboardModelDV.onViewDisputeBtnClick(e.currentTarget.disputeNumber);
						}
						slider.addSlide(temp);
					} else {
						if (el.querySelector('.salikDispute')) {
							slider.removeSlide(el.querySelector('.salikDispute'));
							el = null;
						}
					}
				} catch (e) { }
			}
			dashboardModelDV.getCachedSalikDispute(function (salikDispute) {
				if (salikDispute != null && salikDispute.disputeNumber != null && salikDispute.disputeNumber != undefined) {
					bindSalikDispute(salikDispute);
					dashboardModelDV.getSalikDispute(function (salikDispute1) {
						if (salikDispute != null) {
							bindSalikDispute(salikDispute1);
						}
					});
				} else {
					dashboardModelDV.getSalikDispute(function (salikDispute) {
						if (!document.getElementById("dashboardPage")) return;
						if (salikDispute != null) {
							bindSalikDispute(salikDispute);
						}
					});
				}
			});
			/// GET LATEST SALIK VIOLATION
			/*******************************/
			// var hasCashedSalikDispute = false;
			var bindSalikViolation = function (salikViolation) {
				console.log(salikViolation);
				if (salikViolation.violationNumber != null && salikViolation.violationNumber != undefined) {
					var currentViolations = el.querySelectorAll(".salikViolation");
					for (var i = 0; i < currentViolations.length; i++) {
						currentViolations[i].parentElement.removeChild(currentViolations[i]);
					}

					var temp = document.querySelector("#templates .salikViolation").cloneNode(true);
					if (salikViolation.plate.plateCode == "castle") {
						//temp.querySelector("img.plateCode").style.display = "block";
						temp.querySelector("div.plateCode").style.display = "none";
					} else {
						//	temp.querySelector("img.plateCode").style.display = "none";
						temp.querySelector("div.plateCode").style.display = "block";
						temp.querySelector("div.plateCode").textContent = salikViolation.plate.plateCode;
						if (salikViolation.plate.plateSource == "Abu Dhabi") {
							temp.querySelector("div.plateCode").style.background = "#ee0000";
							temp.querySelector("div.plateCode").style.color = "#fff";
						}
					}
					// draw plates

					DashboardModel.bindPlate(temp,salikViolation);

					var plateNoDB="";
					if( salikViolation.plate&& salikViolation.plate.plateNo){
						plateNoDB=salikViolation.plate.plateNo;
						if( salikViolation.plate.plateNo.length>5){
							plateNoDB= salikViolation.plate.plateNo.substring(0, 4)+"..";
						}
					}

					temp.querySelector(".plateNo").textContent = plateNoDB;
					temp.querySelector(".salikViolationNumber").textContent = salikViolation.violationNumber;
					temp.querySelector("#salikViolationAmount").textContent = salikViolation.violationAmount;
					//Handle view dispute Button
					temp.querySelector(".viewViolationBtn").violationNumber = salikViolation.violationNumber;
					temp.querySelector(".viewViolationBtn").onclick = function (e) {
						e.preventDefault();
						e.stopPropagation();
						dashboardModelDV.onViewViolationBtnClick(e.currentTarget.violationNumber);
					}
					slider.addSlide(temp);
				} else {
					if (el && el.querySelector('.salikDispute')) {
						slider.removeSlide(el.querySelector('.salikDispute'));
						el = null;
					}
				}
			}
			dashboardModelDV.getCachedSalikViolation(function (salikViolation) {
				if (salikViolation != null) {
					bindSalikViolation(salikViolation);
					dashboardModelDV.getSalikViolation(function (salikViolation1) {
						if (salikViolation != null) {
							bindSalikViolation(salikViolation1);
						}
					});
				} else {
					dashboardModelDV.getSalikViolation(function (salikViolation) {
						if (!document.getElementById("dashboardPage")) return;
						if (salikViolation != null) {
							bindSalikViolation(salikViolation);
						}
					});
				}
			});
			this.reload = function (callBack) {
				DashboardViewModel.salikTile.showLoading();
				var ayncRemaining = 3;
				var responses = [];
				var options = {
						useEasing: false,
						useGrouping: true,
						separator: ',',
						decimal: '.',
						prefix: '',
						suffix: ''
				};
				dashboardModelDV.getSalikBalance(function (result2) {
					if (!document.getElementById("dashboardPage")) return;
					if (result2 != null && result2 != undefined) {
						var balance2 = result2.balance;
						balanceUpdated = true;
						DashboardViewModel.salikTile.hideLoading();
						if (balance2 == -1) {
							DashboardViewModel.salikTile.template = "loggedInNoAcc";
						} else {
							var amount = el.querySelector("#amount") ? el.querySelector("#amount").innerText.replace(/,/g, "") : "";
							balanceCounter = new CountUp(amount, el.querySelector("#amount").innerText, balance2, 0, 2, options);
							balanceCounter.start();
							showAccountNumber(el, result2.accountNumber);
						}
						responses.push(true);
					} else {
						responses.push(false);
					}
					if (responses.length == ayncRemaining) {
						DashboardViewModel.salikTile.hideLoading();
						var succeded = true;
						for (var i = 0; i < responses.length; i++) {
							succeded = (responses[i] && succeded);
						}
						callBack(succeded, DashboardViewModel.salikTile)
						DashboardViewModel.onReloadFinished();
					}
				});
				dashboardModelDV.getSalikDispute(function (salikDispute) {
					if (!document.getElementById("dashboardPage")) return;
					if (salikDispute != null) {
						bindSalikDispute(salikDispute);
						responses.push(true);
					} else {
						responses.push(false);
					}
					if (responses.length == ayncRemaining) {
						DashboardViewModel.salikTile.hideLoading();
						var succeded = true;
						for (var i = 0; i < responses.length; i++) {
							succeded = (responses[i] && succeded);
						}
						callBack(succeded, DashboardViewModel.salikTile)
						DashboardViewModel.onReloadFinished();
					}
				});
				dashboardModelDV.getSalikViolation(function (salikViolation) {
					if (!document.getElementById("dashboardPage")) return;
					if (salikViolation != null) {
						bindSalikViolation(salikViolation);
						responses.push(true);
					} else {
						responses.push(false);
					}
					if (responses.length == ayncRemaining) {
						DashboardViewModel.salikTile.hideLoading();
						var succeded = true;
						for (var i = 0; i < responses.length; i++) {
							succeded = (responses[i] && succeded);
						}
						callBack(succeded, DashboardViewModel.salikTile)
						DashboardViewModel.onReloadFinished();
					}
				});
			}
			// DashboardViewModel.salikTile.showLoading();
			// dashboardModelDV.getSalikBalance(function(balance2) {
			// 	if (!document.getElementById("dashboardPage")) return;
			// 	DashboardViewModel.salikTile.hideLoading();
			// 	if (balance2 != null && balance2 != undefined) {
			// 		balanceCounter = new CountUp(el.querySelector("#amount"), 0, balance2, 0, 2, options);
			// 		balanceCounter.start();
			// 		callBack(true, DashboardViewModel.salikTile);
			// 	} else {
			// 		callBack(false, DashboardViewModel.salikTile);
			// 	}
			// });
			//			}
		},
		/**
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * *****************************DriveMode************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 * **************************************************************************
		 */
		getDriveModeCashedData: function (callBack) {
			var data = localStorage.getItem("shellDriveModeData");
			return JSON.parse(data);
		},
		getDriveModeData: function (callBack) {
			var petrolData = null;
			var mosqueData = null;
			var atmData = null;
			var evData = null;
			DashboardModel.isLocationEnabled(function (enabled, location) {
				if (!document.getElementById("dashboardPage")) return;

				if (enabled) {
					var googleAPIs = GoogleAPIs.getInstance();
					var center;
					var lat = location.coords.latitude;
					var lng = location.coords.longitude;
					var centerObj = {
							lat: lat,
							lng: lng
					}
					center = lat + ',' + lng;

					var mosqueDef = $.Deferred();
					var petrolDef = $.Deferred();
					var atmDef = $.Deferred();
					var evDef = $.Deferred();
					////////////////Mosque State////////////////////////////////

					// first call API
					var currentLang = getApplicationLanguage();

					var params = {
							"googleAPI": "Places API",
							"appName": "SHELL",
							"query": "nearbysearch",
							"options": {
								'location': center,
								'language': currentLang,
								'type': 'mosque',
								'radius': 1500,
								'keyword': 'mosque'

							}
					};

					googleAPIs.getAPIURL(params.appName, params.googleAPI, params.query, params.options,
							function (url) {


						//$.getJSON('https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'location= ' + center + '&language=' + getApplicationLanguage() + '&type=mosque' + '&radius=1500' + '&keyword=mosque' + '&key='+GoogleAPIs.getInstance().getIPRestrictedKey("Shell"),
						$.getJSON(url,
								function (res) {
							var locations = DashboardModel.handleLocationResponse(centerObj, res);
							DashboardModel.getBase64MapImage(locations, center, "mosque-40.png", function (imgData) {
								prayTimes.setMethod('Makkah');
								var today = new Date();
								var dubaiCoords = [25.276987, 55.296249];
								var timezone = 'auto';
								var daylightSaving = 'auto';
								var format = '24h';
								var times = prayTimes.getTimes(today, dubaiCoords, timezone, daylightSaving, format);
								mosqueData = {
										mapImage: imgData,
										locations: locations,
										prayerTimes: times
								}
								mosqueDef.resolve();
							})
						}).error(function () {
							mosqueDef.reject();
						});
					});

					////////////////petrol State////////////////////////////////


					var petrolLocationsDef = $.Deferred();
					var petrolPricesDef = $.Deferred();


					//					var params = {
					//					"googleAPI":"Places API",
					//					"appName":"Shell",
					//					"query":"nearbysearch",
					//					"options":{
					//					"location":center,
					//					"language":getApplicationLanguage(),
					//					"type":"gas_station",
					//					"radius":"1500",
					//					"keyword":"petrol+station"
					//					},
					//					"platform":"IPRestrictedKey"
					//					};



					//					var invocationData = {
					//					adapter: 'googleAPIAdapter',
					//					procedure: 'callGoogleAPI',
					//					parameters: [params.appName,params.platform,params.googleAPI,params.query,params.options]
					//					};
					//					invokeWLResourceRequest(invocationData, {
					//					onSuccess: function(result) {
					//					var locations = DashboardModel.handleLocationResponse(centerObj, res);
					//					DashboardModel.getBase64MapImage(locations, center, "fuel-pump-40.png", function(imgData) {
					//					petrolLocationsDef.resolve({
					//					mapImage: imgData,
					//					locations: locations
					//					});
					//					})
					//					},
					//					onFailure: function(e) {
					//					petrolLocationsDef.reject();
					//					},
					//					invocationContext: this
					//					});

					// second call API

					var params = {
							"googleAPI": "Places API",
							"appName": "SHELL",
							"query": "nearbysearch",
							"options": {
								'location': center,
								'language': currentLang,
								'type': 'gas_station',
								'radius': 1500,
								'keyword': 'petrol+station'

							}
					};
					//					var googleAPIs = GoogleAPIs.getInstance();
					googleAPIs.getAPIURL(params.appName, params.googleAPI, params.query, params.options,
							function (url) {
						//	$.getJSON('https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'location=' + center + '&language=' + getApplicationLanguage() + '&type=gas_station' + '&radius=1500' + '&keyword=petrol+station' + '&key='+GoogleAPIs.getInstance().getIPRestrictedKey("Shell")
						$.getJSON(url
								, function (res) {
							var locations = DashboardModel.handleLocationResponse(centerObj, res);
							DashboardModel.getBase64MapImage(locations, center, "fuel-pump-40.png", function (imgData) {
								petrolLocationsDef.resolve({
									mapImage: imgData,
									locations: locations
								});
							})
						}).error(function () {
							petrolLocationsDef.reject();
						});

					});


					var invocationData = {
							adapter: 'DriveModeAdapter',
							procedure: 'getDriveModeData',
							parameters: [],
							invocationContext: this
					};
					invokeWLResourceRequest(invocationData,
						function (result) {
							petrolPricesDef.resolve(result);
						},
						function (e) {
							petrolPricesDef.reject(e);
						}

					);
					$.when(petrolLocationsDef, petrolPricesDef).done(function (locationsData, result) {
						petrolData = locationsData;
						petrolData.petrolPrices = result.invocationResult.petrolPrices;
						petrolDef.resolve();
					}).fail(function () {
						petrolDef.reject();
					})
					////////////////ATM State////////////////////////////////

					// Third Call API

					var params = {
						"googleAPI": "Places API",
						"appName": "SHELL",
						"query": "nearbysearch",
						"options": {
							'location': center,
							'language': currentLang,
							'type': 'atm',
							'radius': 1500,
							'keyword': 'atm'

						}
					};
					//					var googleAPIs = GoogleAPIs.getInstance();
					googleAPIs.getAPIURL(params.appName, params.googleAPI, params.query, params.options,
							function (url) {
						//$.getJSON('https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'location=' + center + '&language=' + getApplicationLanguage() + '&type=atm' + '&radius=1500' + '&keyword=atm' + '&key='+GoogleAPIs.getInstance().getIPRestrictedKey("Shell")
						$.getJSON(url, function (res) {
							var locations = DashboardModel.handleLocationResponse(centerObj, res);
							DashboardModel.getBase64MapImage(locations, center, "atm-40.png", function (imgData) {
								atmData = {
										mapImage: imgData,
										locations: locations
								}
								atmDef.resolve();
							})
						}).error(function () {
							atmDef.reject();
						});
					});
					////////////////EV State////////////////////////////////
					var EVURL = getApplicationLanguage() == "en" ? "https://www.dewa.gov.ae/content/data/payment_locations_en.json" : "https://www.dewa.gov.ae/content/data/payment_locations_ar.json";
					var evArDef = $.Deferred();
					var evEnDef = $.Deferred();
					var invocationData = {
							adapter: 'DriveModeAdapter',
							procedure: 'getEVData',
							parameters: [],
							invocationContext: this
					};
					invokeWLResourceRequest(invocationData,
						function (res) {
							res = res.invocationResult;
							var locations = res.Locations.EVChargeAr.item;
							for (var i = 0; i < locations.length; i++) {
								locations[i].location = locations[i].latitude + "," + locations[i].longitude;
								locations[i].distance = DashboardModel.getDistanceFromLatLonInKm(centerObj.lat, centerObj.lng, locations[i].latitude, locations[i].longitude) * 1000;
							}
							locations.sort(function (a, b) {
								return a.distance - b.distance;
							});
							if (locations.length > 10) locations = locations.slice(0, 10);
							evArDef.resolve(locations);
							var locations = res.Locations.EVChargeEn.item;
							for (var i = 0; i < locations.length; i++) {
								locations[i].location = locations[i].latitude + "," + locations[i].longitude;
								locations[i].distance = DashboardModel.getDistanceFromLatLonInKm(centerObj.lat, centerObj.lng, locations[i].latitude, locations[i].longitude) * 1000;
							}
							locations.sort(function (a, b) {
								return a.distance - b.distance;
							});
							if (locations.length > 10) locations = locations.slice(0, 10);
							evEnDef.resolve(locations);
						},
						function (e) {
							$.getJSON(window.mobile.baseUrl +"/common/data/ev_data_ar.json", function (res) {
								var locations = res.Locations.EVChargeAr.item;
								for (var i = 0; i < locations.length; i++) {
									locations[i].location = locations[i].latitude + "," + locations[i].longitude;
									locations[i].distance = DashboardModel.getDistanceFromLatLonInKm(centerObj.lat, centerObj.lng, locations[i].latitude, locations[i].longitude) * 1000;
								}
								locations.sort(function (a, b) {
									return a.distance - b.distance;
								});
								if (locations.length > 10) locations = locations.slice(0, 10);
								evArDef.resolve(locations);
							});
							$.getJSON(window.mobile.baseUrl +"/common/data/ev_data_en.json", function (res) {
								var locations = res.Locations.EVChargeEn.item;
								for (var i = 0; i < locations.length; i++) {
									locations[i].location = locations[i].latitude + "," + locations[i].longitude;
									locations[i].distance = DashboardModel.getDistanceFromLatLonInKm(centerObj.lat, centerObj.lng, locations[i].latitude, locations[i].longitude) * 1000;
								}
								locations.sort(function (a, b) {
									return a.distance - b.distance;
								});
								if (locations.length > 10) locations = locations.slice(0, 10);
								evEnDef.resolve(locations);
							})
						}

					);
					$.when(evArDef, evEnDef).done(function (arLocations, enLocations) {
						DashboardModel.getBase64MapImage(enLocations, center, "electric-station-40.png", function (imgData) {
							evData = {
									mapImage: imgData,
									locationsAr: arLocations,
									locationsEn: enLocations
							}
							evDef.resolve();
						});
					}).fail(function () {
						evDef.reject();
					})
					$.when(mosqueDef, petrolDef, atmDef, evDef).done(function (res) {
						var data = {
								petrolData: petrolData,
								mosqueData: mosqueData,
								atmData: atmData,
								evData: evData
						}
						localStorage.setItem("shellDriveModeData", JSON.stringify(data))
						DashboardModel.driveModeData = {
							currentLocation: center,
							data: data
						}
						callBack(data)
					}).fail(function () {
						callBack(null);
					})
				} else {
					callBack(null);
				}
			});
		},
		getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
			var R = 6371; // Radius of the earth in km
			var dLat = DashboardModel.deg2rad(lat2 - lat1); // deg2rad below
			var dLon = DashboardModel.deg2rad(lon2 - lon1);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(DashboardModel.deg2rad(lat1)) * Math.cos(DashboardModel.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c; // Distance in km
			return d;
		},
		deg2rad: function (deg) {
			return deg * (Math.PI / 180)
		},
		handleLocationResponse: function (center, res) {
			var locations = [];
			if (res.status == "OK") {
				var length = res.results.length <= 10 ? res.results.length : 10;
				for (var i = 0; i < length; i++) {
					var item = {};
					item.name = res.results[i].name;
					item.address = res.results[i].vicinity;
					item.location = res.results[i].geometry.location.lat + "," + res.results[i].geometry.location.lng;
					item.distance = DashboardModel.getDistanceFromLatLonInKm(center.lat, center.lng, res.results[i].geometry.location.lat, res.results[i].geometry.location.lng) * 1000;
					locations.push(item);
				}
			}
			locations.sort(function (a, b) {
				return a.distance - b.distance;
			});
			return locations;
		},
		getBase64MapImage: function (locations, center, img, callback) {
			var markers = new Array();;

			for (var i = 0; i < locations.length; i++) {

				markers.push('icon:https://m.rta.ae/index/smartgov/apps/dubai_drive/images/' + img + '%7Cshadow:true' + '%7Cscale:2' + '%7C' + locations[i].location);
				//				markers = '&markers=icon:https://m.rta.ae/index/smartgov/apps/dubai_drive/images/' + img + '%7Cshadow:true' + '%7Cscale:2' + '%7C' + locations[i].location
			}
			//			markers += '&markers=icon:https://m.rta.ae/index/smartgov/apps/dubai_drive/images/map-marker%2040.png' + '%7Cshadow:true' + '%7Cscale:2' + '%7C' + center
			markers.push('icon:https://m.rta.ae/index/smartgov/apps/dubai_drive/images/map-marker%2040.png' + '%7Cshadow:true' + '%7Cscale:2' + '%7C' + center);
			var params = {
					"googleAPI": "Maps Static API",
					"appName": "SHELL",
					//					"query":"",
					"options": {
						'center': center,
						'zoom': '12',
						'scale': '2',
						'size': '325x150',
						'maptype': 'roadmap',
						'format': 'png',
						'visual_refresh': 'true',
						'markers': markers,
						'style': ['element:geometry%7Ccolor:0xf5f5f5',
						          'element:labels.icon%7Cvisibility:off',
						          'element:labels.text.fill%7Ccolor:0x616161',
						          'element:labels.text.stroke%7Ccolor:0xf5f5f5',
						          'feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd',
						          'feature:poi%7Celement:geometry%7Ccolor:0xeeeeee',
						          'feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575',
						          'feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5',
						          'feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e',
						          'feature:road%7Celement:geometry%7Ccolor:0xffffff',
						          'feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575',
						          'feature:road.highway%7Celement:geometry%7Ccolor:0xdadada',
						          'feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161',
						          'feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e',
						          'feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5',
						          'feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee',
						          'feature:water%7Celement:geometry%7Ccolor:0xc9c9c9',
						          'feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e']

					}
			};




			var googleAPIs = GoogleAPIs.getInstance();
			googleAPIs.generateMapsURL(params.appName, params.googleAPI, params.options,
					function (url) {
				console.log(url);
				//				$.getScript("https://maps.google.com/maps/api/js?region=AE&callback=contactRtaObj.initMapforContactRTA");
				var img = new Image();
				img.onload = function () {
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					canvas.height = this.height;
					canvas.width = this.width;
					ctx.drawImage(img, 0, 0);
					callback(canvas.toDataURL());
					canvas = null;
					img = null;
				}
				img.src = url;





			});
		},
		openDriveMode: function (state) {
			DashboardModel.driveModeData.currentState = state;
			dashboardModelDV.openDriveMode(DashboardModel.driveModeData);
		},
		getDriveModeDirections: function (state) {
			DashboardModel.driveModeData.currentState = state;
			dashboardModelDV.openDriveModeDirections(DashboardModel.driveModeData);
		},
		onUpdateMobileNumber: function (linkingAttribute) {
			console.log(linkingAttribute)
			dashboardModelDV.onUpdateMobileNumber(linkingAttribute);
		},
		openEnquirePage: function () {
			dashboardModelDV.openEnquirePage();
		},
	});
	return DashboardModel;
});

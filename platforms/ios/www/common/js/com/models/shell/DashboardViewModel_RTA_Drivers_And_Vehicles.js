(function () {
	"use strict";
	window.RTA_Drivers_And_Vehicles_DashboardViewModel = function () {
		var tiles = {
			_driverTile: null,
			_vehicleTile: null,
			_finesTile: null,
			_parkingTile: null,
			_platesTile: null,
			_docsTile: null,
			_myDocs: null,
			_salikTile: null,
			_driveModeTile: null
		}
		var AppServices = null,
			DashboardModel = null,
			reloadCount = 0,
			pullToRefresh = null,
			driveModeTile = null;
		var Constants = require("com/models/Constants");
		function loadGreenPointsTile(DataUtils, AuthenticationModel) {
			var GreenPointsModel = require("com/models/shell/GreenPointsModel");

			var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
			if (userProfile && AuthenticationModel.isAuthenticated() /*&& AuthenticationModel.isAuthenticatedWithServer()*/) {
				userProfile = JSON.parse(userProfile);
				if (userProfile && userProfile.Users[0]) {
					document.querySelector(".scroller #greenpointItem").onclick = function () {
						mobile.changePage("shell/greenpoints_leaf.html");
					};
					GreenPointsModel.getGreenPoints(function (freshdata, callFailed) {
						if (freshdata) {
							// timestamp the data and store
							var timestamp = new Date().getTime();
							freshdata.timestamp = timestamp;
							var GREEN_DATA = freshdata;
							if ((isUndefinedOrNullOrBlank(GREEN_DATA.SCORE) || GREEN_DATA.SCORE == 0) && !callFailed) {
								document.querySelector(".scroller #greenPointsNumbers").innerHTML = "0";
								$('.guestItem').hide();
								$('.loginItem').show();
								return;
							}
							document.querySelector(".scroller #greenPointsNumbers").innerHTML = freshdata.SCORE;
							$('.guestItem').hide();
							$('.loginItem').show();
							if (freshdata.RANK == -1) {
								document.querySelector(".scroller #dashboardRanker").style.display = 'none';
								return
							}
							var moveTo = -1 * (100 - freshdata.RANK);
							console.log("moveTo", moveTo)
							if (getApplicationLanguage() == "ar") moveTo = (moveTo * -1) + 100;
							document.querySelector(".scroller #dashboardRankerFill").style.webkitTransform = 'translate3d(' + moveTo + '%, 0, 0)';
							return;
						}
					});
					document.querySelector(".scroller #greenPointsNumbers").innerHTML = "0";
					$('.guestItem').hide();
					$('.loginItem').show();
					return;
				}
			}
			document.querySelector(".scroller #greenPointsNumbers").innerHTML = "";
			$('.guestItem').show();
			$('.loginItem').hide();
		}



		function onReloadFinished() {
			console.log("onReloadFinished  " + reloadCount);
			if (!pullToRefresh) return;
			reloadCount--;
			if (reloadCount <= 0 && pullToRefresh.isLoading()) {
				if ((Constants.showLoyalty)) {
					document.querySelector("#loyaltyId .loyaltyLoader").style.display = "none";// stop loytalty
				}
				pullToRefresh.reloadFinished();

			}
		}

		function reloadDashboard() {

			try {
				reloadCount = 0;

				////////////////////////////////////////////////
				//	Reload Loyalty
				if (Constants.showLoyalty) {
					reloadCount++;
					dashboardPageViewInstance.loadNILoyalty(function () {

						DashboardViewModel.onReloadFinished();
					});
				}
				///driver tile//////////////////////////////////
				if (tiles._driverTile.template == "loggedInNoLicenseNoPermit") {
					tiles._driverTile.template = "loggedInTFN";
					reloadCount++;
				} else if (tiles._driverTile.template == "loggedInTFN") {
					reloadCount++;
					tiles._driverTile.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._driverTile.options.contTemplates["loggedInTFN"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}
				///vehicle tile//////////////////////////////////
				if (tiles._vehicleTile.template == "loggedInNoVehicles") {
					tiles._vehicleTile.template = "loggedInTFN";
					reloadCount++;
				} else if (tiles._vehicleTile.template == "loggedInTFN") {
					reloadCount++;
					tiles._vehicleTile.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._vehicleTile.options.contTemplates["loggedInTFN"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}
				///fines tile//////////////////////////////////
				if (tiles._finesTile.template == "loggedInNoFines" || tiles._finesTile.template == "loggedInNonPayableFines") {
					tiles._finesTile.template = "loggedInFines";
					reloadCount++;
				} else if (tiles._finesTile.template == "loggedInFines") {
					reloadCount++;
					tiles._finesTile.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._finesTile.options.contTemplates["loggedInFines"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}
				///parking tile/////////////////////////////////
				if (tiles._parkingTile.template == "loggedIn") {
					reloadCount++;
					tiles._parkingTile.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._parkingTile.options.contTemplates["loggedIn"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}
				///Drive Mode Tile/////////////////////////////////
				reloadCount++;
				driveModeTile.reloadDriveMode();
				///mDocs tile//////////////////////////////////
				if (tiles._myDocs.template == "loggedInTFN") {
					reloadCount++;
					tiles._myDocs.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._myDocs.options.contTemplates["loggedInTFN"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}
				///Salik tile//////////////////////////////////
				//				DashboardViewModel.salikTile.showLoading();
				//				DashboardModel.isUserLinkedToSalik(function (result){
				//				if(result==true){
				//				tiles._salikTile.template = "loggedIn";
				//				} else {
				//				DashboardViewModel.salikTile.hideLoading();
				//				tiles._salikTile.template = "loggedInNoAcc";
				//				}
				//				});
				if (tiles._salikTile.template == "loggedInNoAcc") {
					//					tiles._salikTile.template = "loggedIn";
					DashboardViewModel.salikTile.showLoading();
					DashboardModel.isUserLinkedToSalik(function (result) {
						if (result == true) {
							tiles._salikTile.template = "loggedIn";
							reloadCount++;
						} else {
							DashboardViewModel.salikTile.hideLoading();
							tiles._salikTile.template = "loggedInNoAcc";
						}
					});
				} else if (tiles._salikTile.template == "loggedIn") {
					reloadCount++;
					tiles._salikTile.el.querySelector(".reloadCont span").className = "icon-reload active";
					var reload = tiles._salikTile.options.contTemplates["loggedIn"].reload(function (success, tile) {
						tile.el.querySelector(".reloadCont span").className = "icon-reload";
						if (success) {
							tile.hideReload();
						} else {
							tile.showReload();
						}
					});
				}

				console.log("Services that should be reloaded" + reloadCount);
			} catch (e) {
				console.error(e);
			}
		}

		function getPullToRefresh() {
			pullToRefresh = new CSPullToRefresh(document.querySelector("#dashboardCont"), reloadDashboard);
			return pullToRefresh;
		}

		function getDriveModeTile() {
			driveModeTile = new DriveModeTileControl();
			return driveModeTile;
		}

		function getDriverTile(template) {
			var serviceId = "1";
			var category = getServiceObjectById(serviceId);
			var driverOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "driverTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTemp: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.drivertile.linkyourtrafficfile%</div><div class="linkBtn btn waves-effect">%shell.dashboard.general.linknow%</div>'),
						control: DashboardModel.driverGuestTemp,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoTFN: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.drivertile.linkyourtrafficfile%</div><div class="linkBtn btn waves-effect">%shell.dashboard.general.linknow%</div>'),
						control: DashboardModel.driverLoggedInNoTFN,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInTFN: {
						html: '<div class="bulletSlider"><div class="bulletsCont"></div><div class="slidsCont"></div></div>',
						control: DashboardModel.driversLoggedInControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoLicenseNoPermit: {
						html: window.Utils.applyLocalization("<div class='loginInfo'>%shell.dashboard.licensesItem.nothavelicense%</div>"),
						control: function () { },
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(driverOptions);
		}
		function getVehicleTile(template) {
			var serviceId = "2";
			var category = getServiceObjectById(serviceId);
			var vehicleOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "vehicleTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTemp: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.vehicletile.linkyourtrafficfile%</div><div class="payfineBtn btn waves-effect">%shell.dashboard.general.linknow%</div>'),
						control: DashboardModel.vehicleGuestTemp,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoTFN: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.vehicletile.linkyourtrafficfile%</div><div class="payfineBtn btn waves-effect">%shell.dashboard.general.linknow%</div>'),
						control: DashboardModel.LoggedInNoTFN,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInTFN: {
						html: '<div class="bulletSlider"><div class="bulletsCont"></div><div class="slidsCont"></div></div>',
						control: DashboardModel.vehiclesLoggedInControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoVehicles: {
						html: window.Utils.applyLocalization("<div class='loginInfo'>%shell.dashboard.vehicletile.nothave%</div>"),
						control: function () { },
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(vehicleOptions);
		}

		function getParkingTile(template) {
			var serviceId = "7";
			var category = getServiceObjectById(serviceId);
			var parkingOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "parkingTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTempOnline: {
						html: window.Utils.applyLocalization('<div class="neerstZone">%shell.dashboard.parkingtile.nearestzone%</div><div class="zoneCont"><span class="zoneNo">312</span><span class="zoneCat">A</span></div><div class="distanceTime">1 min away</div><div class="clickParkBtn btn waves-effect">%shell.dashboard.parkingtile.clicknpark%</div>'),
						control: DashboardModel.parkingGuestOnlineControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					guestTempOffline: {
						html: window.Utils.applyLocalization('<div>%shell.dashboard.parkingtile.cannotdetectnearestparking%<br/>%shell.dashboard.parkingtile.nodataconnection%</div>'),
						control: DashboardModel.parkingGuestOfflineControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedIn: {
						html: window.Utils.applyLocalization('<div class="bulletSlider"><div class="bulletsCont"></div><div class="slidsCont"><div id="parkingBalance" class="slide"><div class="currency">%shell.dashboard.general.AED%</div><div id="amount">150</div><div class="accDesc" >%shell.dashboard.parkingtile.parkingaccbalance%</div><div class="clickPark btn waves-effect">%shell.dashboard.parkingtile.clicknpark%</div></div></div></div>'),
						control: DashboardModel.parkingLoggedInControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(parkingOptions);
		}

		function getFinesTile(template) {
			var serviceId = "5";
			var category = getServiceObjectById(serviceId);
			var finesOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "finesTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTemp: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.finetile.needlogin%</div><div class="payfineBtn btn waves-effect">%shell.dashboard.finetile.payfine%</div>'),
						control: DashboardModel.finesGuestTemp,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoFines: {
						html: window.Utils.applyLocalization('<div class="congrats">%shell.dashboard.finetile.congrats%</div><div class="noFines">%shell.dashboard.finetile.nofine%</div><div class="moreScore"><span class="icon-heart-beat"></span>+10%</div><div class="payfineBtn btn waves-effect">') + localize("%shell.dashboard.finetile.payforfriend%") + '</div>',
						control: DashboardModel.finesLoggedInNoFines,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInFines: {
						html: window.Utils.applyLocalization('<div class="currency">%shell.dashboard.general.AED%</div><div id="amount"></div><div class="accDesc">%shell.dashboard.finetile.tfn%<span id="TFN"></span></div><div class="payfineBtn btn waves-effect">%shell.dashboard.finetile.paynow%</div>'),
						control: DashboardModel.finesLoggedInControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNonPayableFines: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.finetile.NonPayableFines%</div>'),
						control: function () { },
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoTFN: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.finetile.linkyourtrafficfile%</div><div class="payfineBtn btn waves-effect">%shell.dashboard.general.linknow%</div>'),
						control: DashboardModel.LoggedInNoTFN,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(finesOptions);
		}

		function getSalikTile(template) {
			var serviceId = "8";
			var category = getServiceObjectById(serviceId);
			var docsOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "salikTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTemp: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.saliktile.linkyouracc%</div><div class="rechargeBtn btn waves-effect">%shell.dashboard.saliktile.linksalik%</div>'),
						control: DashboardModel.salikGuestControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedIn: {
						html: window.Utils.applyLocalization('<div class="bulletSlider"><div class="bulletsCont"></div><div class="slidsCont"><div id="parkingBalance" class="slide"><div class="currency">%shell.dashboard.general.AED%</div><div id="amount"></div><div class="accDesc" style="display:none">%shell.dashboard.saliktile.accno% <span id="ACNo"></span></div><div class="rechargeBtn btn waves-effect">%shell.dashboard.saliktile.recharge%</div></div></div></div>'),
						control: DashboardModel.salikLoggedInAcc,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInNoAcc: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.saliktile.linkyouracc%</div><div class="rechargeBtn btn waves-effect">%shell.dashboard.saliktile.linksalik%</div>'),
						control: DashboardModel.salikLoggedInNoAcc,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(docsOptions);
		}

		function getPlatesTile(template) {
			var serviceId = "4";
			var category = getServiceObjectById(serviceId);
			var platesOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "platesTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					Temp: {
						html: window.Utils.applyLocalization('<div class="textContent"> %shell.dashboard.myplatetile.text%</div><div class="platCont"> <div class="plateCode">M</div><img src="../../../common/images/shell/emirates-plate-logos/emirates-plates_03.jpg" class="plateSource"/> <div class="plateNo">206</div></div><div class="platesBtn btn waves-effect">%shell.dashboard.myplatetile.buyplate%</div>'),
						control: DashboardModel.platesControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(platesOptions);
		}

		function getDocsTile(template) {
			var serviceId = "6";
			var category = getServiceObjectById(serviceId);
			var docsOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "docsTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template, //"guestTempOnline",
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					Temp: {
						html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.docvalidation.content%</div><div class="applyMcert btn waves-effect">%shell.dashboard.docvalidation.documentvalidate%</div>'),
						control: DashboardModel.docsControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(docsOptions);
		}

		function getMyDocsTile(template) {
			var category = {
				Color: "#fff",
				dashboardURL: "",
				Icon: "icon-mstore2",
				CategoryServices: [],
				TileNameEn: "My Docs",
				TileNameAr: "وثائقي"
			}
			var docsOptions = {
				direction: function () {
					return (getApplicationLanguage() == 'en') ? "ltr" : "rtl";
				},
				tileId: "myDocsTile",
				category: category,
				serviceList: category.CategoryServices,
				defaultTemp: template,
				_template: "",
				set template(value) {
					if (this.contTemplates[value] != undefined) this._template = value;
				},
				get template() {
					return this._template;
				},
				contTemplates: {
					guestTemp: {
						html: '<div class="loginInfo">' + localize('%shell.dashboard.mstore.text%') + '</div><div class="scanNow btn waves-effect">' + localize('%shell.dashboard.mstore.linknow%') + '</div>',
						control: DashboardModel.mStoreGuestControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					noTFNTemp: {
						html: '<div class="loginInfo">' + localize('%shell.dashboard.mstore.text%') + '</div><div class="scanNow btn waves-effect">' + localize('%shell.dashboard.mstore.linknow%') + '</div>',
						control: DashboardModel.mStoreNoTFNControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					},
					loggedInTFN: {
						html: window.Utils.applyLocalization('<div class="storing">%shell.dashboard.mstore.storing%</div><div class="documents"><span class="count">3</span>%shell.dashboard.mstore.docs%</div> <div class="scanNow btn waves-effect">%shell.dashboard.mstore.viewall%</div>'),
						control: DashboardModel.mStoreLoggedInTFNControl,
						_reload: null,
						set reload(value) {
							this._reload = value
						},
						get reload() {
							return this._reload;
						}
					}
				}
			};
			return new ServiceTileControl(docsOptions);
		}

		function initializeTilesState() {
			try {
				var isLoggedIn = DashboardModel.isUserLoggedIn();
				if (isLoggedIn) {

					if (DashboardModel.getTrafficFileNumber() != null) {
						tiles._driverTile.template = "loggedInTFN";
						tiles._vehicleTile.template = "loggedInTFN";
						tiles._finesTile.template = "loggedInFines";
						tiles._myDocs.template = "loggedInTFN";
					} else {
						tiles._driverTile.template = "loggedInNoTFN";
						tiles._vehicleTile.template = "loggedInNoTFN";
						tiles._finesTile.template = "loggedInNoTFN";
						tiles._myDocs.template = "noTFNTemp";
					}


					///handle salik logged in tile

					//					DashboardViewModel.salikTile.showLoading();
					//					DashboardModel.isUserLinkedToSalik(function (result){
					//					if(result==true){
					//					tiles._salikTile.template = "loggedIn";
					//					} else {
					//					DashboardViewModel.salikTile.hideLoading();
					//					tiles._salikTile.template = "loggedInNoAcc";
					//					}
					//					});

					DashboardViewModel.parkingTile.showLoading();
					DashboardViewModel.salikTile.showLoading();
					DashboardModel.getCurrentLinkingDetails(function (serviceRelatedInfo) {
						if (!isUndefinedOrNullOrBlank(serviceRelatedInfo)) {
							document.dispatchEvent(linkAttributesUpdated);
							//							var test = [{"serviceId":"SALIK","linkingAttribute":"islam"},{"serviceId":"MPARKING","linkingAttribute":"ilinmxuddm9715641068351527584299001ca6acfba2c3b435780c42b159710cfccsmiyhhtlugdeevffxngvmgicprpeftuys"}];
							var linkedToSalik = false;
							var linkedToParking = false;
							for (var i = 0; i < serviceRelatedInfo.length; i++) {
								if (serviceRelatedInfo[i].serviceId == "SALIK") {
									linkedToSalik = true;
								}
								if (serviceRelatedInfo[i].serviceId == "MPARKING") {
									linkedToParking = true;
								}
							}

							if (linkedToSalik) {
								console.log("linked to salik :: start loading salik tile")
								tiles._salikTile.template = "loggedIn";
							} else {
								console.log("not linked to salik :: start loading salik tile")
								DashboardViewModel.salikTile.hideLoading();
								tiles._salikTile.template = "loggedInNoAcc";
							}

							if (linkedToParking) {
								console.log("linked to parking :: start loading parking tile")
								tiles._parkingTile.template = "loggedIn";
							} else {
								console.log("not linked to parking :: start loading parking tile")
								tiles._parkingTile.template = "loggedIn";
							}
						} else {
							//user not linked to any service (parking , salik)
							DashboardViewModel.salikTile.hideLoading();
							tiles._salikTile.template = "loggedInNoAcc";
							tiles._parkingTile.template = "loggedIn";
						}
					});
				} else {
					tiles._driverTile.template = "guestTemp";
					if (navigator.onLine) {
						tiles._parkingTile.template = "guestTempOnline";
					} else {
						tiles._parkingTile.template = "guestTempOffline";
					}
					tiles._finesTile.template = "guestTemp";
					tiles._vehicleTile.template = "guestTemp";
					tiles._salikTile.template = "guestTemp";
					tiles._myDocs.template = "guestTemp";
				}
				tiles._platesTile.template = "Temp";
				tiles._docsTile.template = "Temp";
			} catch (e) { }
		}

		function initTilesObjects() {
			DashboardModel = require("com/models/shell/DashboardModel");
			tiles._driverTile = getDriverTile();
			tiles._parkingTile = getParkingTile();
			tiles._finesTile = getFinesTile();
			tiles._vehicleTile = getVehicleTile();
			tiles._platesTile = getPlatesTile();
			tiles._docsTile = getDocsTile();
			tiles._myDocs = getMyDocsTile();
			tiles._salikTile = getSalikTile();
			tiles._driveModeTile = getDriveModeTile();
		}
		return {
			initTilesObjects: initTilesObjects,
			initializeTilesState: initializeTilesState,
			get driverTile() {
				return tiles._driverTile
			},
			set driverTile(val) {
				tiles._driverTile = val;
			},
			get parkingTile() {
				return tiles._parkingTile
			},
			set parkingTile(val) {
				tiles._parkingTile = val;
			},
			get finesTile() {
				return tiles._finesTile;
			},
			set finesTile(val) {
				tiles._finesTile = val;
			},
			get vehicleTile() {
				return tiles._vehicleTile;
			},
			set vehicleTile(val) {
				tiles._vehicleTile = val;
			},
			get platesTile() {
				return tiles._platesTile;
			},
			set platesTile(val) {
				tiles._platesTile = val;
			},
			get docsTile() {
				return tiles._docsTile;
			},
			set docsTile(val) {
				tiles._docsTile = val;
			},
			get myDocsTile() {
				return tiles._myDocs;
			},
			set myDocsTile(val) {
				tiles._myDocs = val;
			},
			get salikTile() {
				return tiles._salikTile;
			},
			set salikTile(val) {
				tiles._salikTile = val;
			},
			get driveModeTile() {
				return tiles._driveModeTile;
			},
			set driveModeTile(val) {
				tiles._driveModeTile = val;
			},
			reloadDashboard: reloadDashboard,
			getPullToRefresh: getPullToRefresh,
			onReloadFinished: onReloadFinished,
			getDriveModeTile: getDriveModeTile,
			loadGreenPointsTile: loadGreenPointsTile
		}
	}();
})();

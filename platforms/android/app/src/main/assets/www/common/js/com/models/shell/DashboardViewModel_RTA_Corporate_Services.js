
/* JavaScript content from js/com/models/shell/DashboardViewModel_RTA_Corporate_Services.js in folder common */
(function(){
	"use strict";

	window.RTA_Corporate_Services_DashboardViewModel = function(){
		var tiles = {
				_eNocTile : null,
				_eWalletTile : null,
				_finesTile:null,
				_commercialTransportTile : null,
				_trafficTile : null,
				_driverTile : null,
				_contractsTile : null,
				_metroTile:null,
				_vehiclesTile:null,
				_platesTileCorporate:null
		}
		var AppServices = null,
		DashboardModel = null,
		reloadCount = 0,
		pullToRefresh = null,
		driveModeTile = null;

		function onReloadFinished(){
			if(!pullToRefresh)return;
			reloadCount--;
			if(reloadCount <= 0 && pullToRefresh.isLoading()){
				pullToRefresh.reloadFinished();
			}
		}

		function reloadDashboard(){
			reloadCount = 0;
			if(tiles._eNocTile.template == "NotAuthorized" || tiles._eNocTile.template == "NoNOCs"){
				tiles._eNocTile.template = "loggedIn";
				reloadCount++;
			}else if(tiles._eNocTile.template == "loggedIn"){
				reloadCount++;
				tiles._eNocTile.el.querySelector(".reloadCont span").className = "icon-reload active";
				var reload = tiles._eNocTile.options.contTemplates["loggedIn"].reload(function(success,tile){
					tile.el.querySelector(".reloadCont span").className = "icon-reload";
					if(success){
						tile.hideReload();
					}else{
						tile.showReload();
					}
				});	
			}


			if(tiles._commercialTransportTile.template == "loggedIn"){
				reloadCount++;
				tiles._commercialTransportTile.el.querySelector(".reloadCont span").className = "icon-reload active";
				var reload = tiles._commercialTransportTile.options.contTemplates["loggedIn"].reload(function(success,tile){
					tile.el.querySelector(".reloadCont span").className = "icon-reload";
					if(success){
						tile.hideReload();
					}else{
						tile.showReload();
					}
				});	
			}

			if(tiles._vehiclesTile.template == "loggedIn"){
				reloadCount++;
				tiles._vehiclesTile.el.querySelector(".reloadCont span").className = "icon-reload active";
				var reload = tiles._vehiclesTile.options.contTemplates["loggedIn"].reload(function(success,tile){
					tile.el.querySelector(".reloadCont span").className = "icon-reload";
					if(success){
						tile.hideReload();
					}else{
						tile.showReload();
					}
				});	
			}

			if(tiles._platesTileCorporate.template == "loggedIn"){
				reloadCount++;
				tiles._platesTileCorporate.el.querySelector(".reloadCont span").className = "icon-reload active";
				var reload = tiles._platesTileCorporate.options.contTemplates["loggedIn"].reload(function(success,tile){
					tile.el.querySelector(".reloadCont span").className = "icon-reload";
					if(success){
						tile.hideReload();
					}else{
						tile.showReload();
					}
				});	
			}
			
		}

		function getPullToRefresh(){
			pullToRefresh = new CSPullToRefresh(
					document.querySelector("#dashboardCont"),
					reloadDashboard);
			return pullToRefresh;
		}

		// function loadFinesTile(DataUtils,AuthenticationModel){
		// 	DashboardModel = DashboardModel||require("com/models/shell/DashboardModelCorporate");

		// 	var userProfile = DataUtils.getLocalStorageData("userProfile", "shell");
		// 	if (userProfile && AuthenticationModel.isAuthenticated()) {
		// 		document.querySelector("#welcome #finesItem .guestCont").style.display = "none";
		// 		document.querySelector("#welcome #finesItem .loginCont").style.display = "block";
		// 		document.querySelector("#welcome #finesItem .loginCont .tileLoader").style.display = "block";
		// 		document.querySelector("#welcome #finesItem .loginwitoutfines").style.display = "none";

		// 		DashboardModel.getCorporateFines(function(data){
		// 			document.querySelector("#welcome #finesItem .loginCont .tileLoader").style.display = "none";
		// 			if(data != null && data != undefined){
		// 				document.querySelector("#welcome #finesItem #finesAmount").innerText = data.finesAmount;
		// 				document.querySelector("#welcome #finesItem #permitsCount").innerText = data.permitsCount;
		// 				document.querySelector("#welcome #finesItem #expireDate").innerText = data.permitExpiryDate;
		// 			}else{
		// 				document.querySelector("#welcome #finesItem .loginwitoutfines").style.display = "block";
		// 				document.querySelector("#welcome #finesItem .loginCont").style.display = "none";
		// 				document.querySelector("#welcome #finesItem .guestCont").style.display = "none";

		// 			}
		// 		});
		// 	}else{
		// 		document.querySelector("#welcome #finesItem .guestCont").style.display = "block";
		// 		document.querySelector("#welcome #finesItem .loginCont").style.display = "none";
		// 		document.querySelector("#welcome #finesItem .loginwitoutfines").style.display = "none";

		// 	}
		// }

		function getENocTile(template){
			var serviceId = "1";
			var category = getServiceObjectById(serviceId);

			var eNocOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"eNocTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.enocguest%</div><div class="corporateTileBtn eNOCLogin btn viewENOC waves-effect">View ENOC Status</div>'),
							control: DashboardModel.eNocGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.coporate.enoctile.totalapps%</div><div id="apps-count"></div><div class="enocLastMonths">%shell.dashboard.coporate.enoctile.last% <span id="last-months">0</span> %shell.dashboard.coporate.enoctile.months%</div><div class="corporateTileBtn eNOCViewStatus btn waves-effect">%shell.dashboard.coporate.enoctile.viewstatus%</div>'),
							control: DashboardModel.eNocLoggedInControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						NotAuthorized:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.enoctile.notauthuser%</div></div>'),
							control: function(){},
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						NoNOCs:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.enoctile.noenocs%</div></div>'),
							control: function(){},
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(eNocOptions);
		}

		function geteWalletTile(template){
			var serviceId = "10";
			var category = getServiceObjectById(serviceId);

			var eWalletTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"eWalletTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.ewalletguest%</div><div class="corporateTileBtn linkEWallet btn waves-effect">%shell.dashboard.coporate.linkewallet%</div>'),
							control: DashboardModel.eWalletGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.general.AED%</div><div id="apps-count"></div><div class="enocLastMonths">%shell.dashboard.coporate.ewallettile.ewalletbalance%</div><div class="corporateTileBtn eWalletLinkMore btn waves-effect">%shell.dashboard.coporate.ewallettile.linkmore%</div>'),
							control: DashboardModel.eWalletLoggedInControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(eWalletTileOptions);
		}
		function getFinesTile(template){


			var category = {
				Color:"#FC4A4F",
				dashboardURL:DashboardModel.getVehicleTileDashboard(),
				Icon: "icon-service-fines",
				CategoryServices:[],
				TileNameEn:"Fines",
				TileNameAr:"المخالفات"
			};
			// var serviceId = "11";
			// var category = getServiceObjectById(serviceId);

			var fineTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"finesTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.greetings.loginforfines%</div><div class="corporateTileBtn finesTileLogin btn waves-effect">%shell.dashboard.coporate.login%</div>'),
							control: DashboardModel.finesGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.general.AED%</div><div id="apps-count"></div><div class="enocLastMonths">%shell.dashboard.coporate.unpaid%</div><div class="expirydate"><span>%shell.dashboard.licensesItem.blackpoints%</span><span id="expireDate" style="color: rgb(26, 28, 136);">0</span></div>'),
							control: DashboardModel.finesLoggedInControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(fineTileOptions);
		}
		function getCommercialTransportTile(template){
			var serviceId = "2";
			var category = getServiceObjectById(serviceId);

			var commercialTransportTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"commercialTransportTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.commercialtransportguest%</div><div class="corporateTileBtn commercialTransportLogin btn waves-effect">%shell.dashboard.coporate.login%</div>'),
							control: DashboardModel.commercialTransportGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.coporate.commercialtransporttile.issuedlicense%</div><div id="apps-count"></div><div class="expiryCont"><span>%shell.dashboard.vehicletile.expireon%</span><div class="expiryDate"></div></div>'),
							control: DashboardModel.commercialTransportControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(commercialTransportTileOptions);
		}

		function gettrafficTile(template){
			var serviceId = "5";
			var category = getServiceObjectById(serviceId);

			var trafficTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"trafficTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.traaficandroadsguest%</div><div class="corporateTileBtn viewTrafficAndRoadsServices btn waves-effect">%shell.dashboard.coporate.viewservices%</div>'),
							control: DashboardModel.trafficAndRoadsGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(trafficTileOptions);
		}

		function getdriverTile(template){
			var serviceId = "3";
			var category = getServiceObjectById(serviceId);

			var driverTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"driverTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.driverlicensingguest%</div><div class="corporateTileBtn viewDriverLicensingServices btn waves-effect">%shell.dashboard.coporate.viewservices%</div>'),
							control:DashboardModel.driverLicensingGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(driverTileOptions);
		}

		function getcontractsTile(template){
			var serviceId = "9";
			var category = getServiceObjectById(serviceId);

			var contractsTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"contractsTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.contractsandpurchasingguest%</div><div class="corporateTileBtn viewContractsSevices btn waves-effect">%shell.dashboard.coporate.viewservices%</div>'),
							control: DashboardModel.contractsGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(contractsTileOptions);
		}

		function getmetroTile(template){
			var serviceId = "8";
			var category = getServiceObjectById(serviceId);

			var metroTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"metroTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.metroandtramguest%</div><div class="corporateTileBtn viewMetroServices btn waves-effect">%shell.dashboard.coporate.viewservices%</div>'),
							control: DashboardModel.metroGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(metroTileOptions);
		}

		function getVehicleTile(template){
			var category = {
					Color:"#FC4A4F",
					dashboardURL:DashboardModel.getVehicleTileDashboard(),
					Icon: "icon-vehicles",
					CategoryServices:[],
					TileNameEn:"Vehicles",
					TileNameAr:"المركبات"
			}
			var vehiclesTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"vehiclesTile",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.vehicleguest%</div><div class="corporateTileBtn vehicleLogin btn waves-effect">%shell.dashboard.coporate.login%</div>'),
							control: DashboardModel.vehicleGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.coporate.vehicletile.activevehicle%</div><div id="apps-count"></div><div class="expiryCont"><span>%shell.dashboard.coporate.vehicletile.expireinthirtydays%</span><div class="expiryDate"></div></div>'),
							control: DashboardModel.vehiclesControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(vehiclesTileOptions);
		}

		function getPlatesTile(template){
			var category = {
					Color:"#FC4A4F",
					dashboardURL:DashboardModel.getPlateTileDashboard(),
					Icon: "icon-service-plates",
					CategoryServices:[],
					TileNameEn:"Plates",
					TileNameAr:"اللوحات"
			}
			var platesTileOptions = {
					direction:function () { return (getApplicationLanguage()=='en') ? "ltr": "rtl";},
					tileId:"platesTileCorporate",
					category:category,
					serviceList: category.CategoryServices,
					defaultTemp:template,//"guestTempOnline",
					_template:"",
					set template(value){
						if(this.contTemplates[value] != undefined)
							this._template = value;
					},
					get template(){
						return this._template;
					},
					contTemplates: {
						guestTemp:{
							html: window.Utils.applyLocalization('<div class="loginInfo">%shell.dashboard.coporate.plateguest%</div><div class="corporateTileBtn plateLogin btn waves-effect">%shell.dashboard.coporate.login%</div>'),
							control: DashboardModel.plateGuestControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						},
						loggedIn:{
							html:window.Utils.applyLocalization('<div class="total-apps">%shell.dashboard.coporate.platetile.activeplates%</div><div id="apps-count"></div><div class="expiryCont"><span>%shell.dashboard.coporate.vehicletile.expireinthirtydays%</span><div class="expiryDate"></div></div>'),
							control: DashboardModel.plateControl,
							_reload:null,
							set reload(value){
								this._reload = value
							},
							get reload(){
								return this._reload;
							}
						}
					}
			};
			return new ServiceTileControl(platesTileOptions);
		}

		function initializeTilesState(){

			var isLoggedIn = DashboardModel.isUserLoggedIn();
//			var isauthorized=DashboardModel.isAuthorized();

			if(isLoggedIn){
				tiles._eNocTile.template = "loggedIn";

				tiles._eWalletTile.template = "guestTemp";
				tiles._finesTile.template = "guestTemp";

				
				tiles._commercialTransportTile.template = "loggedIn";
				tiles._vehiclesTile.template = "loggedIn";
				tiles._platesTileCorporate.template = "loggedIn";
				tiles._trafficTile.template = "guestTemp";
				tiles._driverTile.template = "guestTemp";
				tiles._contractsTile.template = "guestTemp";
				tiles._metroTile.template = "guestTemp";
			}else{
				tiles._eNocTile.template = "guestTemp";
				tiles._eWalletTile.template = "guestTemp";
				tiles._finesTile.template = "guestTemp";
				tiles._commercialTransportTile.template = "guestTemp";
				tiles._vehiclesTile.template = "guestTemp";
				tiles._platesTileCorporate.template = "guestTemp";
				tiles._trafficTile.template = "guestTemp";
				tiles._driverTile.template = "guestTemp";
				tiles._contractsTile.template = "guestTemp";
				tiles._metroTile.template = "guestTemp";

			}



//			var isLoggedIn = DashboardModel.isUserLoggedIn();

		}

		function initTilesObjects(){
			//load shell dashboard model
			DashboardModel = require("com/models/shell/DashboardModelCorporate");

//			DashboardModel = require("com/models/shell/DashboardModel");
			tiles._eNocTile = getENocTile();
			tiles._eWalletTile = geteWalletTile();
			tiles._finesTile = getFinesTile();
			tiles._commercialTransportTile = getCommercialTransportTile();
			tiles._trafficTile = gettrafficTile();
			tiles._driverTile = getdriverTile();
			tiles._contractsTile = getcontractsTile();
			tiles._metroTile = getmetroTile();
			tiles._vehiclesTile = getVehicleTile();
			tiles._platesTileCorporate= getPlatesTile();
		}

		return{
			initTilesObjects:initTilesObjects,
			initializeTilesState:initializeTilesState,
			get eNocTile(){
				return tiles._eNocTile
			},
			set eNocTile(val){
				tiles._eNocTile = val;
			},
			get eWalletTile(){
				return tiles._eWalletTile
			},
			set eWalletTile(val){
				tiles._eWalletTile = val;
			},
			get finesTile(){
				return tiles._finesTile
			},
			set finesTile(val){
				tiles._finesTile = val;
			},
			get commercialTransportTile(){
				return tiles._commercialTransportTile
			},
			set commercialTransportTile(val){
				tiles._commercialTransportTile = val;
			},

			get trafficTile(){
				return tiles._trafficTile
			},
			set trafficTile(val){
				tiles._trafficTile = val;
			},

			get driverTile(){
				return tiles._driverTile
			},
			set driverTile(val){
				tiles._driverTile = val;
			},

			get contractsTile(){
				return tiles._contractsTile
			},
			set contractsTile(val){
				tiles._contractsTile = val;
			},

			get metroTile(){
				return tiles._metroTile
			},
			set metroTile(val){
				tiles._metroTile = val;
			},
			get vehiclesTile(){
				return tiles._vehiclesTile
			},
			set vehiclesTile(val){
				tiles._vehiclesTile = val;
			},
			get platesTileCorporate(){
				return tiles._platesTileCorporate
			},
			set platesTileCorporate(val){
				tiles._platesTileCorporate = val;
			},


			// loadFinesTile:loadFinesTile,
			reloadDashboard:reloadDashboard,
			getPullToRefresh:getPullToRefresh,
			onReloadFinished:onReloadFinished,
		}
	}();

})();
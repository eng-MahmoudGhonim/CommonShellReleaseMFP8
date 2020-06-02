
﻿(function () {
    "use strict";

    window.DriveModeTileControl = function () {
    	var self = this,
        	tileEl = null,
        	dashboardModel = require("com/models/shell/DashboardModel"),
            currentTemp = localStorage.getItem("shellDriveModeTileState") || "selectState",
            Utils=require("com/utils/Utils"),
//            width = tileEl.getBoundingClientRect().width,
            animating = false,
            currentData = null,
            currentStateObj = null,
            tileHTML = window.Utils.applyLocalization('<div class="dashboardTile" id="driveModeTile"> <div class="tileLoader" style="background: #171b8f;"></div><div class="dmTitle"><i class="icon icon-drive-mode"></i><span>%shell.dashboard.DriveMode%</span></div><div class="mapImageContainer"> <img class="mapPlaceHolder" src="../../../common/images/shell/dashboard/drive-mode-default-state.png"/> <img class="stateMap"/> </div><div class="reloadCont"> <span class="icon-reload"></span> <div>%shell.Dashboard.TabToReloadDriveMode%</div></div><div class="stateTemplateCont"> </div></div>'),
            selectStateTemp = window.Utils.applyLocalization('<div class="selectState"> <div class="hint">%shell.dashboard.drivemodetile.whatwouldliketosee%</div><div id="petrolState" class="item waves-effect"> <i style="background: #f30000" class="icon icon-gas-station"></i><span>%shell.dashboard.drivemodetile.petrolpump%</span> </div><div id="evState" class="item waves-effect"> <i style="background: #63d724" class="icon icon-electric-station"></i><span>%shell.dashboard.drivemodetile.evstations%</span> </div><div id="atmState" class="item waves-effect"> <i style="background: #171b8f" class="icon icon-atm"></i><span>%shell.dashboard.drivemodetile.atm%</span> </div><div id="mosqueState" class="item waves-effect"> <i style="background: #00b154" class="icon icon-mosque"></i><span>%shell.dashboard.drivemodetile.mosque%</span> </div></div>'),
            dmServiceTemp = window.Utils.applyLocalization('<div class="dmServiceTemp"> <div class="dmServicesActions"> <i id="gasStationBtn" style="background: #f30000" class="iconActive icon icon-gas-station"></i> <i id="AtmBtn" style="background: #171b8f" class="icon icon-atm"></i> <i id="mosqueBtn" style="background: #00b154" class="icon icon-mosque"></i> <i id="evBtn" style="background: #63d724" class="icon icon-electric-station"></i> <div class="desc"> <div class="weFound">%shell.dashboard.drivemodetile.wefound%</div><div class="details"> <span class="count">6</span> <span class="detailDesc">%shell.dashboard.drivemodetile.petrolstationnearby%</span> </div></div></div><div class="dmServicesCont"> <div class="petrolState"> <div class="nearstPlace"> <img class="logo" src="images/enoc.png"/><span class="distance">30 m</span> <div class="getDirectionButton dmBtn">%shell.dashboard.drivemodetile.getdirection%</div></div><div class="pricesCont"> <div class="item"> <div class="priceLabel" style="background: #025EE1">%shell.dashboard.general.AED% <span class="price"></span>/l <span class="pointerCirc" style="background: #025EE1"></span></div><div class="petrolType">%shell.dashboard.drivemodetile.supergasoline%</div><div class="petrolNumber">98</div></div><div class="item"> <div class="priceLabel" style="background: #00B154">%shell.dashboard.general.AED% <span class="price"></span>/l <span class="pointerCirc" style="background: #00B154"></span></div><div class="petrolType">%shell.dashboard.drivemodetile.specialgasoline%</div><div class="petrolNumber">95</div></div><div class="item"> <div class="priceLabel" style="background: #EE0000">%shell.dashboard.general.AED% <span class="price"></span>/l <span class="pointerCirc" style="background: #EE0000"></span></div><div class="petrolType">%shell.dashboard.drivemodetile.eplusgasoline%</div><div class="petrolNumber">91</div></div><div class="item"> <div class="priceLabel" style="background: #FFB800"> %shell.dashboard.general.AED% <span class="price"></span>/l <span class="pointerCirc" style="background: #FFB800"></span> </div><div class="petrolType">%shell.dashboard.drivemodetile.gasoil%</div><div class="petrolNumber">Diesel</div></div></div></div><div class="evState"> <div class="nearstPlace"> <img src="../../common/images/shell/dashboard/driveMode/ev-charger.png"/><span class="distance">30 m</span> <div class="getDirectionButton dmBtn">%shell.dashboard.drivemodetile.getdirection%</div><div class="name">Sheikh Zayed</div><div class="address">Sheikh Zayed</div></div><div class="timings"> <span class="timingsTitle">%shell.dashboard.drivemodetile.timings% </span><span class="timingsValue"></span> </div><div class="evPhone"> <span class="phoneTitle">%shell.dashboard.drivemodetile.Phone%: </span><span class="evPhoneNo"></span> </div></div><div class="atmState"> <div class="nearstPlace"> <i style="color: rgb(23, 27, 143)" class="icon icon-atm"></i><span class="distance">30 m</span> <div class="getDirectionButton dmBtn">%shell.dashboard.drivemodetile.getdirection%</div></div><div class="atmBranch">Burj Al Arab Branch</div><div class="address">Sheikh Zayed</div><div class="atmHint">%shell.dashboard.drivemodetile.atmcharges%</div></div><div class="mosqueState"> <div class="nearstPlace"> <i style="color: #00b154" class="icon-mosque"></i> <span class="distance">30 m</span> <div class="getDirectionButton dmBtn">%shell.dashboard.drivemodetile.getdirection%</div><div class="mosqueName">Muhammed bin Ahmed Almulla Mosque</div><div class="address">Sheikh Zayed</div></div><div class="prayerTimes"> <div class="item"> <div class="name">%shell.dashboard.drivemodetile.fajr%</div><i class="icon-fajr"></i> <div class="time">12:30</div></div><div class="item"> <div class="name">%shell.dashboard.drivemodetile.duhr%</div><i class="icon-duhr"></i> <div class="time">12:30</div></div><div class="item"> <div class="name">%shell.dashboard.drivemodetile.asr%</div><i class="icon-asr"></i> <div class="time">12:30</div></div><div class="item"> <div class="name">%shell.dashboard.drivemodetile.maghrib%</div><i class="icon-maghrib"></i> <div class="time">12:30</div></div><div class="item"> <div class="name">%shell.dashboard.drivemodetile.isha%</div><i class="icon-isha"></i> <div class="time">12:30</div></div></div></div></div></div>'),
            stateOrder = [
                     	{
                     		order:0,
                     		index:0,
                     		stateName:"petrolState",
                     		className:"icon-gas-station",
                     		id:"gasStationBtn",
                     		color:"#f30000",
                     		control:petrolStateControl,
                     		nearbyTextEn:window.Utils.applyLocalization("%shell.dashboard.drivemodetile.petrolstationnearby%"),
                     	},
                     	{
                     		order:1,
                     		index:1,
                     		stateName:"evState",
                     		className:"icon-electric-station",
                     		id:"evBtn",
                     		color:"#63d724",
                     		control:evStateControl,
                     		nearbyTextEn:window.Utils.applyLocalization("%shell.dashboard.drivemodetile.evstationnearby%"),
                     	},
                     	{
                     		order:2,
                     		index:2,
                     		stateName:"atmState",
                     		className:"icon-atm",
                     		id:"AtmBtn",
                     		color:"#171b8f",
                     		control:atmStateControl,
                     		nearbyTextEn:window.Utils.applyLocalization("%shell.dashboard.drivemodetile.atmsnearby%"),
                     	},
                     	{
                     		order:3,
                     		index:3,
                     		stateName:"mosqueState",
                     		className:"icon-mosque",
                     		id:"mosqueBtn",
                     		color:"#00b154",
                     		control:mosqueStateControl,
                     		nearbyTextEn:window.Utils.applyLocalization("%shell.dashboard.drivemodetile.mosquesnearby%"),
                     	},
                     ],
                     petrolSationsImages = [
                    	 {
                    		 nameAr:"ينوك",
                    		 nameEn:"enoc",
                    		 imgUrl:"../../common/images/shell/dashboard/driveMode/petrol-stations-png/enoc.png"
                    	 },
                    	 {
                    		 nameAr:"دنوك",
                    		 nameEn:"adnoc",
                    		 imgUrl:"../../common/images/shell/dashboard/driveMode/petrol-stations-png/adnoc.png"
                    	 },
                    	 {
                    		 nameAr:"مارات",
                    		 nameEn:"emarat",
                    		 imgUrl:"../../common/images/shell/dashboard/driveMode/petrol-stations-png/emarat.png"
                    	 },
                    	 {
                    		 nameAr:"يبكو",
                    		 nameEn:"eppco",
                    		 imgUrl:"../../common/images/shell/dashboard/driveMode/petrol-stations-png/eppco.png"
                    	 }
                     ];

        function selectStateControl(el) {

        	tileEl.querySelector(".dmTitle").onclick =
        		tileEl.querySelector(".mapImageContainer").onclick = function(){

        		tileEl.querySelector(".hint").className = "hint active";
        		tileEl.querySelector(".hint").style.webkitAnimation = "pulse 1000ms linear";
        		setTimeout(function(){
        			tileEl.querySelector(".hint").style.webkitAnimation = "";
        		},1000);
        	}

            var items = el.querySelectorAll('.item');
            for (var i = 0; i < items.length; i++) {
                items[i].onclick = function (e) {
                	if(!navigator.onLine){
                		var pop = new Popup("internetErrorPopup");
                		pop.show();
                		return;
                	}
                	tileEl.querySelector(".tileLoader").style.display = "block";
                	tileEl.querySelector(".stateTemplateCont").style.pointerEvents = "none";
                //	tileEl.querySelector(".tileLoader").style.display = "none";

                	currentTemp = e.currentTarget.id;
                	var data = localStorage.getItem("shellDriveModeData");
                	if(data){
                		currentData = JSON.parse(data);
                		serviceControl(currentData);
                        setTimeout(function () {
                        	tileEl.querySelector(".stateTemplateCont").style.pointerEvents = "";
                            el.style.webkitTransform = "translate3d(0,-170px,0)";
                            tileEl.querySelector(".dmServiceTemp").style.webkitTransform = "translate3d(0,0,0)";
                            tileEl.querySelector(".stateTemplateCont").style.height = "230px";
                            dashboardModel.getDriveModeData(function(newdata){
                            	tileEl.querySelector(".tileLoader").style.display = "none";
								if(newdata != null){
									currentData = newdata;
	                                bindData(newdata,tileEl.querySelector(".dmServiceTemp"));
								}else{
									showReload();
									//tileEl.querySelector(".reloadCont").style.display = "block";
								}

                        	})
                        });
                	}else{
                		dashboardModel.getDriveModeData(function(data){
                			tileEl.querySelector(".stateTemplateCont").style.pointerEvents = "";

                            tileEl.querySelector(".tileLoader").style.display = "none";
                			if(data != null){
                				currentData = data;

                                serviceControl(data);
                                setTimeout(function () {
                                    el.style.webkitTransform = "translate3d(0,-170px,0)";
                                    tileEl.querySelector(".dmServiceTemp").style.webkitTransform = "translate3d(0,0,0)";
                                    tileEl.querySelector(".stateTemplateCont").style.height = "230px";

                                });
                			}else{
                				tileEl.querySelector(".tileLoader").style.display = "none";
                				var pop = new Popup("locationErrorPopup");
                        		pop.show();
                			}
                    	})
                	}

                }
            }
        }

        function reorderList(){
        	var stateObject = null;
            for(var i =0;i<stateOrder.length;i++){
            	if(currentTemp == stateOrder[i].stateName)
            	{
            		stateObject = stateOrder[i];
            		break;
            	}
            }
            currentStateObj = stateObject;
            var steps = stateObject.order;

            for(var j =0;j<stateOrder.length;j++){
            	stateOrder[j].order -= steps;
            	if(stateOrder[j].order < 0)
            		stateOrder[j].order = (stateOrder[j].order + 4);
            }

            stateOrder.sort(function(a,b){
            	return a.order - b.order;
            });
        }

        function serviceControl(data) {
            var el = document.createElement('div');
            el.innerHTML = dmServiceTemp;
            var temp = el.firstChild;


            reorderList();

            tileEl.querySelector(".dmTitle").onclick =
        		tileEl.querySelector(".mapImageContainer").onclick = function(){
            	dashboardModel.openDriveMode(currentTemp);
            }

            bindData(data,temp);


            tileEl.querySelector(".stateTemplateCont").appendChild(temp);

            tileEl.querySelector(".dmServiceTemp").style.webkitTransform = "translate3d(0,0,0)";
        }


        function bindData(data,temp){
        	tileEl.querySelector(".stateMap").onload = function(){
            	tileEl.querySelector(".mapPlaceHolder").style.webkitTransform = "translate3d(0,160px,0)";
            }

            switch(currentTemp){
	            case "petrolState":

	            	tileEl.querySelector(".stateMap").src = data.petrolData.mapImage;
	            	temp.querySelector(".count").textContent = data.petrolData.locations.length;
	            	petrolStateControl(temp);

	            	break;
	            case "evState":

	            	tileEl.querySelector(".stateMap").src = data.evData.mapImage;
	            	temp.querySelector(".count").textContent = data.evData.locationsEn.length;
	            	evStateControl();

	            	break;
	            case "atmState":

	            	tileEl.querySelector(".stateMap").src = data.atmData.mapImage;
	            	temp.querySelector(".count").textContent = data.atmData.locations.length;
	            	atmStateControl();

	            	break;
	            case "mosqueState":

	            	tileEl.querySelector(".stateMap").src = data.mosqueData.mapImage;
	            	temp.querySelector(".count").textContent = data.mosqueData.locations.length;
	            	mosqueStateControl();

	            	break;
            }

            //petrol state

            if(data.petrolData.locations.length > 0){
            	var logo = null;

                for(var x =0;x<petrolSationsImages.length;x++){
                	if(/[\u0600-\u06FF]/.test(data.petrolData.locations[0].name)){
                		if(data.petrolData.locations[0].name.toLowerCase()
                				.indexOf(petrolSationsImages[x].nameAr) != -1){
                			logo = petrolSationsImages[x];
                			break;
                		}
                	}else{
                		if(data.petrolData.locations[0].name.toLowerCase()
                				.indexOf(petrolSationsImages[x].nameEn) != -1){
                			logo = petrolSationsImages[x];
                			break;
                		}
                	}
                }


                if(logo){
                	 temp.querySelector(".petrolState .logo").src =
                		logo.imgUrl;
                }else{
                	temp.querySelector(".petrolState .logo").src =
                		"../../common/images/shell/dashboard/driveMode/no-image.png";
                }

                temp.querySelector(".petrolState .distance").textContent = data.petrolData.locations[0].distance.toFixed(0) + " "+window.Utils.applyLocalization('%shell.dashboard.drivemodetile.meter%');
                temp.querySelector(".petrolState .getDirectionButton").onclick = function(){
//                	if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
//                    	window.open("maps://?q="+data.petrolData.locations[0].location,"_system")
//                    }else{
//                    	window.open("geo:0,0?q="+data.petrolData.locations[0].location,"_system")
//                    }
                	dashboardModel.getDriveModeDirections(currentTemp);
                }
            }else{
            	temp.querySelector(".petrolState .nearstPlace").innerHTML = window.Utils.applyLocalization('<div class="noData">%shell.dashboard.drivemodetile.srrynolocation%</div>');
            }
            if(data.petrolData&&data.petrolData.petrolPrices){
	            temp.querySelectorAll(".petrolState .price")[2].textContent = data.petrolData.petrolPrices.EPlus;
	            temp.querySelectorAll(".petrolState .price")[1].textContent = data.petrolData.petrolPrices.Special;
	            temp.querySelectorAll(".petrolState .price")[0].textContent = data.petrolData.petrolPrices.Super;
	            temp.querySelectorAll(".petrolState .price")[3].textContent = data.petrolData.petrolPrices.Diesel;
            }


            //ATM
            if(data.atmData.locations.length > 0){
            	temp.querySelector(".atmState .distance").textContent = data.atmData.locations[0].distance.toFixed(0) + " "+window.Utils.applyLocalization('%shell.dashboard.drivemodetile.meter%');
                temp.querySelector(".atmState .getDirectionButton").onclick = function(){
//                 	if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
//                     	window.open("maps://?q="+data.atmData.locations[0].location,"_system")
//                     }else{
//                     	window.open("geo:0,0?q="+data.atmData.locations[0].location,"_system")
//                     }
                    dashboardModel.getDriveModeDirections(currentTemp);
                }

                temp.querySelector(".atmState .atmBranch").textContent = data.atmData.locations[0].name;
                temp.querySelector(".atmState .address").textContent = data.atmData.locations[0].address;
            }else{
            	temp.querySelector(".atmState").innerHTML = window.Utils.applyLocalization('<div class="noData">%shell.dashboard.drivemodetile.srrynolocation%</div>');
            }

            //Mosque
            if(data.mosqueData.locations.length > 0){
            	temp.querySelector(".mosqueState .distance").textContent = data.mosqueData.locations[0].distance.toFixed(0) + " "+window.Utils.applyLocalization('%shell.dashboard.drivemodetile.meter%');
                temp.querySelector(".mosqueState .getDirectionButton").onclick = function(){
//                 	if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
//                     	window.open("maps://?q="+data.mosqueData.locations[0].location,"_system")
//                     }else{
//                     	window.open("geo:0,0?q="+data.mosqueData.locations[0].location,"_system")
//                     }
					dashboardModel.getDriveModeDirections(currentTemp);
                }
                temp.querySelector(".mosqueState .mosqueName").textContent = data.mosqueData.locations[0].name;
                temp.querySelector(".mosqueState .address").textContent = data.mosqueData.locations[0].address;
            }else{
            	temp.querySelector(".mosqueState .nearstPlace").innerHTML = window.Utils.applyLocalization('<div class="noData">%shell.dashboard.drivemodetile.srrynolocation%</div>');
            }

            temp.querySelectorAll(".mosqueState .time")[0].textContent = data.mosqueData.prayerTimes.fajr;
            temp.querySelectorAll(".mosqueState .time")[1].textContent = data.mosqueData.prayerTimes.dhuhr;
            temp.querySelectorAll(".mosqueState .time")[2].textContent = data.mosqueData.prayerTimes.asr;
            temp.querySelectorAll(".mosqueState .time")[3].textContent = data.mosqueData.prayerTimes.maghrib;
            temp.querySelectorAll(".mosqueState .time")[4].textContent = data.mosqueData.prayerTimes.isha;

            //Ev
            if(getApplicationLanguage() == "en"){
            	if(data.evData.locationsEn.length > 0){
                	temp.querySelector(".evState .distance").textContent = data.evData.locationsEn[0].distance.toFixed(0) + " "+window.Utils.applyLocalization('%shell.dashboard.drivemodetile.meter%');
                    temp.querySelector(".evState .getDirectionButton").onclick = function(){
//                     	if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
//                         	window.open("maps://?q="+data.evData.locationsEn[0].location,"_system")
//                         }else{
//                         	window.open("geo:0,0?q="+data.evData.locationsEn[0].location,"_system")
//                         }
						dashboardModel.getDriveModeDirections(currentTemp);
                    }

                    temp.querySelector(".evState .name").textContent = data.evData.locationsEn[0].name;
                    temp.querySelector(".evState .address").textContent = data.evData.locationsEn[0].address;
                    temp.querySelector(".evState .timingsValue").textContent = data.evData.locationsEn[0].whrs;
                    temp.querySelector(".evState .evPhoneNo").textContent = data.evData.locationsEn[0].phone;
                    temp.querySelector(".evState .evPhoneNo").onclick = function(){
                    	window.open("tel:"+data.evData.locationsEn[0].phone, '_system');
                    }
                }else{
                	temp.querySelector(".evState").innerHTML = window.Utils.applyLocalization('<div class="noData">%shell.dashboard.drivemodetile.srrynolocation%</div>');
                }
            }else{
            	if(data.evData.locationsAr.length > 0){
                	temp.querySelector(".evState .distance").textContent = data.evData.locationsAr[0].distance.toFixed(0) + " "+window.Utils.applyLocalization('%shell.dashboard.drivemodetile.meter%');
                    temp.querySelector(".evState .getDirectionButton").onclick = function(){
//                         if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
//                         	window.open("maps://?q="+data.evData.locationsAr[0].location,"_system")
//                         }else{
//                         	window.open("geo:0,0?q="+data.evData.locationsAr[0].location,"_system")
//                         }
                        dashboardModel.getDriveModeDirections(currentTemp);
                    }

                    temp.querySelector(".evState .name").textContent = data.evData.locationsAr[0].name;
                    temp.querySelector(".evState .address").textContent = data.evData.locationsAr[0].address;
                    temp.querySelector(".evState .timingsValue").textContent = data.evData.locationsAr[0].whrs;
                    temp.querySelector(".evState .evPhoneNo").textContent = data.evData.locationsAr[0].phone;
                }else{
                	temp.querySelector(".evState").innerHTML = window.Utils.applyLocalization('<div class="noData">%shell.dashboard.drivemodetile.srrynolocation%</div>');
                }
            }


            var icons = temp.querySelectorAll(".dmServicesActions .icon");

            icons[0].className = "icon iconActive " + stateOrder[0].className;
            icons[0].stateName = stateOrder[0].stateName;
        	icons[0].id = stateOrder[0].id;
        	icons[0].style.background = stateOrder[0].color;

        	temp.querySelector(".detailDesc").textContent = stateOrder[0].nearbyTextEn;

            for(var k=1;k<icons.length;k++){
            	icons[k].className = "icon " + stateOrder[k].className;
            	icons[k].id = stateOrder[k].id;
            	icons[k].style.background = stateOrder[k].color;
            	icons[k].stateName = stateOrder[k].stateName;
            }

            temp.querySelector(".dmServicesCont").style.webkitTransform = "translate3d("+(stateOrder[0].index * -100)+"%,0,0)";
//            petrolStateControl(temp.querySelector(".petrolState"));


            for (var i = 0; i < icons.length; i++) {
                icons[i].onclick = changeService;
            }
        }


        function changeService(e) {

            var item = e.currentTarget;
            if (item.className.indexOf("iconActive") != -1) return;
            if (animating) return;
            animating = true;
            var icons =
            currentTemp = item.stateName;

            reorderList();

            var icons = tileEl.querySelectorAll(".dmServicesActions .icon")

            for(var i=0;i<icons.length;i++){
            	icons[i].style.webkitTransform = "scale(0)";
            }

            setTimeout(function(){
            	icons[0].className = "icon iconActive " + stateOrder[0].className;
                icons[0].stateName = stateOrder[0].stateName;
            	icons[0].id = stateOrder[0].id;
            	icons[0].style.background = stateOrder[0].color;
            	tileEl.querySelector(".detailDesc").textContent = stateOrder[0].nearbyTextEn;

                switch(currentTemp){
    	            case "petrolState":

    	            	tileEl.querySelector(".stateMap").src = currentData.petrolData.mapImage;
    	            	tileEl.querySelector(".count").textContent = currentData.petrolData.locations.length;
    	               	petrolStateControl();

    	            	break;
    	            case "evState":

    	            	tileEl.querySelector(".stateMap").src = currentData.evData.mapImage;
    	            	tileEl.querySelector(".count").textContent = currentData.evData.locationsEn.length;
    	            	evStateControl();

    	            	break;
    	            case "atmState":

    	            	tileEl.querySelector(".stateMap").src = currentData.atmData.mapImage;
    	            	tileEl.querySelector(".count").textContent = currentData.atmData.locations.length;
    	            	atmStateControl();

    	            	break;
    	            case "mosqueState":

    	            	tileEl.querySelector(".stateMap").src = currentData.mosqueData.mapImage;
    	            	tileEl.querySelector(".count").textContent = currentData.mosqueData.locations.length;
    	            	mosqueStateControl();

    	            	break;
                }


                for(var k=1;k<icons.length;k++){
                	var name= stateOrder[k]?stateOrder[k].className:"";
                	icons[k].className = "icon " +name
                	icons[k].id = stateOrder[k]?stateOrder[k].id:"";
                	icons[k].style.background = stateOrder[k].color;
                	icons[k].stateName = stateOrder[k].stateName;
                }
                for(var j=0;j<icons.length;j++){
                	icons[j].style.webkitTransform = "scale(1)";
                }
                tileEl.querySelector(".dmServicesCont").style.webkitTransform = "translate3d("+(stateOrder[0].index * -100)+"%,0,0)";
            },200);

            setTimeout(function () {
                animating = false;
//                tileEl.querySelector(".desc").style.opacity = 1;
            }, 350);

        }

        function petrolStateControl(el) {
            localStorage.setItem("shellDriveModeTileState", "petrolState");
        }

        function atmStateControl(el) {
            localStorage.setItem("shellDriveModeTileState", "atmState");
        }

        function mosqueStateControl(el) {
            localStorage.setItem("shellDriveModeTileState", "mosqueState");
        }

        function evStateControl(el) {
            localStorage.setItem("shellDriveModeTileState", "evState");
        }

        self.reloadDriveMode = function(){
        	if(currentTemp == "selectState") {
        		DashboardViewModel.onReloadFinished();
        		return;

        	}
        	tileEl.querySelector(".reloadCont .icon-reload").className = "icon-reload active";
        	tileEl.querySelector(".tileLoader").style.display = "block";
        	dashboardModel.getDriveModeData(function(newdata){
        		tileEl.querySelector(".reloadCont .icon-reload").className = "icon-reload";
        		tileEl.querySelector(".tileLoader").style.display = "none";
        		DashboardViewModel.onReloadFinished();
            	if(newdata != null){
//            		tileEl.querySelector(".reloadCont").style.display = "none";
            		hideReload();
            		currentData = newdata;
                    bindData(newdata,tileEl.querySelector(".dmServiceTemp"));
            	}
        	})
        }



        function showReload(){
//        	tileEl.querySelector(".stateTemplateCont").style.webkitFilter = "blur(3px)";
//        	tileEl.querySelector(".mapImageContainer").style.webkitFilter = "blur(3px)";
        	tileEl.querySelector(".reloadCont").style.display = "block";
        }

        function hideReload(){
//        	tileEl.querySelector(".stateTemplateCont").style.webkitFilter = "";
//        	tileEl.querySelector(".mapImageContainer").style.webkitFilter = "";
        	tileEl.querySelector(".reloadCont").style.display = "none";
        }

        //Constructor
//        ;
        (function () {
        	;
        	var container = document.createElement('div');
        	container.innerHTML = tileHTML;
        	tileEl = container.firstChild;
        	tileEl.querySelector(".reloadCont").onclick = self.reloadDriveMode;
//        	tileEl.style.display = "block";
        	var data = localStorage.getItem("shellDriveModeData");
        	if(!data || data == ""){
        		currentTemp == "selectState"
        	}

            if (currentTemp == "selectState") {
                tileEl.querySelector(".stateTemplateCont").style.height = "170px";
                var el = document.createElement('div');
                el.innerHTML = selectStateTemp;
                tileEl.querySelector(".stateTemplateCont").appendChild(el.firstChild);
                selectStateControl(tileEl.querySelector(".stateTemplateCont .selectState"));
            } else {

            	if(data){
            		currentData = JSON.parse(data);
            		serviceControl(currentData);
                    setTimeout(function () {
                        tileEl.querySelector(".stateTemplateCont").style.height = "230px";
                        dashboardModel.getDriveModeData(function(newdata){

                        	if(newdata != null){
                        		currentData = newdata;
                                bindData(newdata,tileEl.querySelector(".dmServiceTemp"));
                        	}else{
                        		showReload();
                        		//tileEl.querySelector(".reloadCont").style.display = "block";
                        	}
                    	})
                    });
            	}else{
            		dashboardModel.getDriveModeData(function(ndata){
            			if(ndata != null){
            				currentData = ndata;
                    		tileEl.querySelector(".tileLoader").style.display = "none";
                            serviceControl(currentData);
                            setTimeout(function () {
                                tileEl.querySelector(".stateTemplateCont").style.height = "230px";
                            });
            			}else{
            				currentTemp = "selectState";
            				tileEl.querySelector(".stateTemplateCont").style.height = "170px";
                            var el = document.createElement('div');
                            el.innerHTML = selectStateTemp;
                            tileEl.querySelector(".stateTemplateCont").appendChild(el.firstChild);
                            selectStateControl(tileEl.querySelector(".stateTemplateCont .selectState"));
            			}
                	})
            	}
            }

            self.el = tileEl;

        })();

        self.draw = function(dir,index){


        	var upTilesCount = document.getElementsByClassName('serviceTileCont');
			var _idExt= parseInt(index);
			if(upTilesCount && upTilesCount.length >0)
				_idExt = _idExt+parseInt(1);

        	tileEl.classList.add('dashboardTilechild'+_idExt);
        	document.getElementById("serviceTiles").appendChild(tileEl);
        }
    }

})();

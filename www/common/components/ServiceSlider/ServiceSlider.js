(function () {
    "use strict";

    var serviceSlider = function (dataSource, lang,loggedIn,_sharinglink,_SocialSharingModel,isFavorites) {
    	this.setDataSrc(dataSource);
        this.init(lang,loggedIn,_sharinglink,_SocialSharingModel,isFavorites);
    }

    serviceSlider.prototype = function () {

        var sliderTemplate,
        sliders,
        activeItem = null,
        timer,
        _lang,
        sharingLink,
        SocialSharingModel,
        favoriteClick = null,
        removeClick = null,
        _dataSrc,
        itemToUpdate = null,
        itemToRemove = null,
        _isFavorites = false;

        var getFavClickCallBack = function(){
        	return favoriteClick;
        }
        
        var onFavoriteClick = function(callBack){
        	favoriteClick = callBack;
        }
        
        var getRemoveClickCallBack = function(){
        	return removeClick;
        }
        
        var onRemoveClick = function(callBack){
        	removeClick = callBack;
        }
        
        var setDataSrc = function(datasrc){
        	_dataSrc = datasrc;
        }
        
        var getDataSrc = function(){
        	return _dataSrc;
        }
        
        var updateUI = function(itemToUpdate){
        	if(itemToUpdate != null){
        		if(itemToUpdate.serviceobject.isFavorite){
        			itemToUpdate.getElementsByClassName("favIcon")[0].style.display = "block";
        		}else{
        			itemToUpdate.getElementsByClassName("favIcon")[0].style.display = "none";
        		}
        	}
        	itemToUpdate.getElementsByClassName("loader")[0].style.display = "none";
//        	itemToUpdate = null;
        }
        
        var removeCategory = function(sliderToRemove){
        	 if(sliderToRemove.el.currentTransformAmount == undefined){
        		 sliderToRemove.el.currentTransformAmount = 0;
			}
        	sliderToRemove.el.style.setProperty("transition-duration", "700ms", "important");
        	sliderToRemove.el.style.setProperty("opacity", "0", "important");
        	var sliders = [];
        	var currentRect = sliderToRemove.el.getBoundingClientRect();
        	var allSliders = document.getElementById("servicesContainer")
        						.getElementsByClassName("serviceSlider");
        	
        	for(var i=0;i<allSliders.length;i++){
        		if(allSliders[i].getBoundingClientRect().top >= currentRect.bottom){
        			sliders.push(allSliders[i]);
        		}
        	}
        	
        	setTimeout(function(){
        		for(var j = 0; j < sliders.length; j++){
        			if(sliders[j] !== sliderToRemove.el){
        				sliders[j].style.setProperty("transition-duration", "700ms", "important");
						if(sliders[j].currentTransformAmount == undefined){
							sliders[j].currentTransformAmount = 0;
						}
						sliders[j].currentTransformAmount -= 170;
						sliders[j].style.setProperty("-webkit-transform", "translate3d(0,"+sliders[j].currentTransformAmount+"px,0)", "important");
        			}
        		}
        		setTimeout(function(){
        			for(var k=0;k<allSliders.length;k++){
        				allSliders[k].style.setProperty("transition-duration", "150ms");
            		}
//        			sliderToRemove.el.style.visibility = "hidden";
        			sliderToRemove.el.parentNode.removeChild(sliderToRemove.el);
        			document.getElementById("servicesScroller").style.height = (allSliders.length * 170) + "px";
        			if(allSliders.length == 0){
        				document.getElementById("noFavorites").style.display = "block";
        				document.getElementById("servicesContainer").style.display = "none";
        			}
        		},700);
        	});
        	
        }
        
        var removeItem = function(itemToRemove){
        	if(itemToRemove != null){
        		if(itemToRemove.serviceobject.isFavorite){
        			itemToRemove.getElementsByClassName("favIcon")[0].style.display = "block";
        		}else{
        		    if(itemToRemove.currentTransformAmount == undefined){
        				 itemToRemove.currentTransformAmount = 0;
        			}
        			itemToRemove.getElementsByClassName("favIcon")[0].style.display = "none";
        			itemToRemove.style.setProperty("transition-duration", "700ms", "important");
        			itemToRemove.style.setProperty("-webkit-transform", "translate3d("+itemToRemove.currentTransformAmount+"px,0,0) scale(0)", "important");
        			var sliderItems = [];
        			var currentRect = itemToRemove.getBoundingClientRect();
        			var allItems = itemToRemove.slider.el.getElementsByClassName("slideItem");
        			if(_lang == "ar"){
        				for(var j = 0; j < allItems.length; j++){
        					if(allItems[j].getBoundingClientRect().right < currentRect.left){
        						sliderItems.push(allItems[j]);
        					}
            			}
        			}else{
        				for(var j = 0; j < allItems.length; j++){
        					if(allItems[j].getBoundingClientRect().left > currentRect.right){
        						sliderItems.push(allItems[j]);
        					}
            			}
        			}
        			setTimeout(function(){
        				for(var i=0;i<sliderItems.length;i++){
        					if(sliderItems[i].serviceobject.ServiceId != itemToRemove.serviceobject.ServiceId){
        						sliderItems[i].style.setProperty("transition-duration", "700ms", "important");
        						if(sliderItems[i].currentTransformAmount == undefined){
        						     sliderItems[i].currentTransformAmount = 0;
        						}
        						if(_lang == "ar"){
                                     sliderItems[i].currentTransformAmount += 120;
        						}else{
        						     sliderItems[i].currentTransformAmount -= 120;
        						}
        						sliderItems[i].style.setProperty("-webkit-transform", "translate3d("+sliderItems[i].currentTransformAmount+"px,0,0) scale(1)", "important");
        					}
        				}
        				setTimeout(function(){
        					for(var i=0;i<allItems.length;i++){
        						allItems[i].style.setProperty("transition-duration", "150ms");
            				}
        					
        					itemToRemove.parentNode.removeChild(itemToRemove);
        					if(allItems.length == 0){
        						removeCategory(itemToRemove.slider);
        					}
        					setTimeout(function(){
        						itemToRemove.slider.scroller.style.width = ((allItems.length) * (105 + 15) + 15) + "px";
        					});
        				},700);
        			});
        		}
        	}
        	itemToRemove.getElementsByClassName("loader")[0].style.display = "none";
        }
        
        var deactivateItem = function () {
            if (activeItem == null) {
                return;
            }
            var items = activeItem.slider.el.getElementsByClassName("slideItem");
            for (var i = 0; i < sliders.length; i++) {
                sliders[i].el.style.opacity = 1;
            }
            for (var j = 0; j < items.length; j++) {
                items[j].style.opacity = 1;
                items[j].ontouchmove = null;
            }
            activeItem.slider.popup.style.opacity = 0;
            setTimeout(function () {
                activeItem.slider.popup.style.transitionDuration = "0ms";
                activeItem.slider.popup.style.display = "none";
                activeItem.slider.popup.getElementsByClassName("infoBtn")[0].style.display = "none";
                for (var i = 0; i < sliders.length; i++) {
                    sliders[i].sliderBlur.style.display = "none";
                }
                activeItem = null;
            }, 150);
        }

        var activateItem = function (item) {
            activeItem = item;
            for (var i = 0; i < sliders.length; i++) {
                sliders[i].sliderBlur.style.display = "block";
            }
            
            item.slider.popup.style.display = "block";
            if(item.serviceobject.ServiceInformationPageUrl != "")
            	item.slider.popup.getElementsByClassName("infoBtn")[0].style.display = "block";
            
            var rect = item.getBoundingClientRect();
            if (_lang == "ar") {
                if (rect.left > 105) {
                    item.slider.popup.style.left = (rect.left - 5 - 105) + "px";
                    item.slider.popup.getElementsByClassName("arrow")[0].className = "arrow arrow-right";
                } else {
                    item.slider.popup.style.left = (rect.right + 5) + "px";
                    item.slider.popup.getElementsByClassName("arrow")[0].className = "arrow arrow-left";
                }
                
                item.slider.popup.getElementsByClassName("sharBtn")[0].onclick = function(){
                	var Constants = require("com/models/Constants");
                	var appName = Globalize.localize("%shell.welcomepage.AppName."+ Constants.APP_ID +"%", getApplicationLanguage());
                	var msg = 'العثور على خدمة "'+item.serviceobject.ServiceNameAr+'" في تطبيق '+appName+' عظيم حقاً، وأود أن أوصي به لك.';
        			SocialSharingModel.share(msg,null,sharingLink);
        			deactivateItem();
                }
            } else {
                if (window.innerWidth - rect.right > 105) {
                    item.slider.popup.style.left = (rect.right + 5) + "px";
                    item.slider.popup.getElementsByClassName("arrow")[0].className = "arrow arrow-left";
                } else {
                    item.slider.popup.style.left = (rect.left - 5 - 105) + "px";
                    item.slider.popup.getElementsByClassName("arrow")[0].className = "arrow arrow-right";
                }
                item.slider.popup.getElementsByClassName("sharBtn")[0].onclick = function(){
                	var Constants = require("com/models/Constants")
                	var appName = Globalize.localize("%shell.welcomepage.AppName."+ Constants.APP_ID +"%", getApplicationLanguage());
                	var msg = 'I found "'+item.serviceobject.ServiceNameEn+'" service on '+appName+' app really great and would like to recommend this to you.';
        			SocialSharingModel.share(msg,null,sharingLink);
        			deactivateItem();
                }
            }
            if(!_isFavorites){
            	if(item.serviceobject.isFavorite){
                	item.slider.popup.getElementsByClassName("favBtn")[0].style.backgroundImage = 'url("../../common/images/shell/services/star-filled.png")'
                }else{
                	item.slider.popup.getElementsByClassName("favBtn")[0].style.backgroundImage = 'url("../../common/images/shell/services/star-empty.png")'
                }
            	item.slider.popup.getElementsByClassName("favBtn")[0].onclick = function(){
//                	itemToUpdate = item;
                	item.getElementsByClassName("loader")[0].style.display = "block";
                	item.getElementsByClassName("favIcon")[0].style.display = "none";
                	var callBack = getFavClickCallBack();
                	callBack(item, updateUI);
                	deactivateItem();
                }
            }else{
            	item.slider.popup.getElementsByClassName("removeBtn")[0].onclick = function(){
//                	itemToRemove = item;
                	item.getElementsByClassName("loader")[0].style.display = "block";
                	item.getElementsByClassName("favIcon")[0].style.display = "none";
                	var callBack = getRemoveClickCallBack();
                	callBack(item, removeItem);
                	deactivateItem();
                }
            }
            
            
            item.ontouchmove = function (e) { e.preventDefault(); }
            setTimeout(function () {
                var items = item.slider.el.getElementsByClassName("slideItem");
                for (var i = 0; i < sliders.length; i++) {
                    if (sliders[i] !== item.slider) {
                        sliders[i].el.style.opacity = "0.3";
                    }
                }
                for (var j = 0; j < items.length; j++) {
                    if (items[j] !== item) {
                        items[j].style.opacity = "0.3";
                    }
                }
                item.slider.popup.style.transitionDuration = "150ms";
                item.slider.popup.style.opacity = 1;
            }, 30);

        }

        var touchstart = function (e) {
            var item = e.currentTarget;
            timer = setTimeout(function () {
                activateItem(item);
            }, 500);
        }

        var touchend = function () {
            clearTimeout(timer);
            timer = null;
        }
       
        var init = function (lang, loggedIn,_sharinglink,_SocialSharingModel,isFavorites) {
            if (lang == undefined || lang == null)
                lang = "en";
            if(loggedIn == undefined || loggedIn == null)
            	loggedIn = false;
            sharingLink = _sharinglink;
            _isFavorites = isFavorites;
            var dataSource = getDataSrc();
            SocialSharingModel = _SocialSharingModel;
            _lang = lang;
            sliderTemplate = document.getElementById("sliderTemplate");
            document.getElementById("servicesContainer").onscroll = touchend;
            document.getElementById("servicesContainer").onclick = touchend;
            document.getElementById("servicesScroller").style.height = (dataSource.length * 170) + "px";
            sliders = [];
            for (var j = 0; j < dataSource.length; j++) {
            	var length = dataSource[j].CategoryServices.length;
            	if(length == 0)
            		continue;
                var slider = {};
                slider.el = sliderTemplate.getElementsByClassName("serviceSlider")[0].cloneNode(true);
                slider.sliderBlur = slider.el.getElementsByClassName("sliderBlur")[0];
                slider.scroller = slider.el.getElementsByClassName("scroller")[0];
                slider.popup = slider.el.getElementsByClassName("popupMenu")[0];
                slider.popup.ontouchmove = function (e) { e.preventDefault(); }
                if(loggedIn){
                	if(isFavorites){
                		slider.popup.getElementsByClassName("removeBtn")[0].style.display = "block";
                	}else{
                		slider.popup.getElementsByClassName("favBtn")[0].style.display = "block";
                	}
                }
                
                slider.sliderBlur.onclick = deactivateItem;
                
                
                slider.scroller.style.width = (length * (105 + 15) + 15) + "px";
                slider.sliderBlur.ontouchmove = function (e) { e.preventDefault(); }
                //Bind The service Header
                if(dataSource[j].CategoryTheme.Color != null)
                	slider.el.style.setProperty("color", dataSource[j].CategoryTheme.Color, "important")
                slider.el.style.top = (170 * j) + "px";
                var sliderHead = slider.el.getElementsByClassName("sliderHead")[0];
                if(_lang == "ar"){
                	sliderHead.getElementsByTagName("img")[0].src = dataSource[j].CategoryTheme.IconUrl;
                	sliderHead.getElementsByClassName("serviceTitle")[0].innerText = dataSource[j].CategoryNameAr;
                	if(!isFavorites){
                		var count = document.createElement("span");
                    	var countString = " خدمات";
                    	if(length <= 2 || length > 10)
                    		countString = " خدمة";
                    	count.innerText = "("+ length + countString+")";
                    	sliderHead.getElementsByClassName("serviceTitle")[0].appendChild(count);
                	}
                	var subCatString = "";
                	for(var k=0; k < dataSource[j].SubCategories.length; k++){
                		subCatString += dataSource[j].SubCategories[k].NameAr;
                		if(k < dataSource[j].SubCategories.length - 1)
                			subCatString += ", ";
                	}
                	sliderHead.getElementsByClassName("subCategories")[0].innerText = subCatString;
                	if(subCatString == ""){
                		sliderHead.getElementsByClassName("serviceTitle")[0].style.top = "18px";
                	}
                }else{
                	sliderHead.getElementsByTagName("img")[0].src = dataSource[j].CategoryTheme.IconUrl;
                	sliderHead.getElementsByClassName("serviceTitle")[0].innerText = dataSource[j].CategoryNameEn;
                	if(!isFavorites){
	                	var count = document.createElement("span");
	                	var countString = " Services";
	                	if(length == 1)
	                		countString = " Service";
	                	count.innerText = "(" + length + countString + ")";
	                	sliderHead.getElementsByClassName("serviceTitle")[0].appendChild(count);
                	}
                	var subCatString = "";
                	for(var k = 0; k < dataSource[j].SubCategories.length; k++){
                		subCatString += dataSource[j].SubCategories[k].NameEn;
                		if(k < dataSource[j].SubCategories.length - 1)
                			subCatString += ", ";
                	}
                	sliderHead.getElementsByClassName("subCategories")[0].innerText = subCatString;
                	if(subCatString == ""){
                		sliderHead.getElementsByClassName("serviceTitle")[0].style.top = "18px";
                	}
                }
                /////////////////////////
                
                slider.el.getElementsByClassName("sliderCont")[0].onscroll = touchend;
                for (var i = 0; i < length; i++) {
                    var item = sliderTemplate.getElementsByClassName("slideItem")[0].cloneNode(true);
                    if (lang == "ar") {
                        item.style.right = (15 + (15 + 105) * i) + "px";
                    } else {
                        item.style.left = (15 + (15 + 105) * i) + "px";
                    }
                    item.index = i;
                    if(_lang == "ar"){
                    	item.getElementsByTagName("span")[0].textContent = dataSource[j].CategoryServices[i].ServiceNameAr;
                    }else{
                    	item.getElementsByTagName("span")[0].textContent = dataSource[j].CategoryServices[i].ServiceNameEn;
                    }
                    item.serviceobject = dataSource[j].CategoryServices[i];
                   // item.ServicePageUrl = dataSource[j].CategoryServices[i].ServicePageUrl;
                    item.onclick = function(e){
                    	mobile.changePage(e.currentTarget.serviceobject.ServicePageUrl);
                    }
                    item.slider = slider;
                    item.ontouchstart = touchstart;
                    item.ontouchend = touchend;
                    item.getElementsByClassName("menuBtnCont")[0].onclick = function (e) {
                    	e.stopPropagation(); 
                        activateItem(e.currentTarget.parentElement);
                    }
                    
                    if(dataSource[j].CategoryServices[i].isFavorite)
                    	item.getElementsByClassName("favIcon")[0].style.display = "block";
                    
                    slider.scroller.appendChild(item);
                }
                sliders.push(slider);
                document.getElementById("servicesScroller").appendChild(slider.el);
            }
            if(lang == "ar"){
                var containers = document.getElementsByClassName("sliderCont");
                for(var x=0;x<containers.length;x++){
                    containers[x].scrollLeft = containers[x].scrollWidth;
                }
            }
            setTimeout(function(){
                var style = document.createElement("style");
                style.innerText = ".serviceSlider .sliderCont .slideItem{-webkit-transform:none !important;}";
            	document.getElementById("servicesContainer").appendChild(style);
            	setTimeout(function(){
            		var style2 = document.createElement("style");
                    style2.innerText = ".serviceSlider .sliderCont .slideItem{-webkit-transform:none !important;transition-duration: 150ms !important;}";
                    if(document.getElementById("servicesContainer"))
                    	document.getElementById("servicesContainer").appendChild(style2);
            	},700);
            });
        }

        return {
            init: init,
            setDataSrc:setDataSrc,
            onFavoriteClick:onFavoriteClick,
            onRemoveClick:onRemoveClick
        }
    }();

    window.ServiceSlider = serviceSlider;
})();
define([
        "com/views/PageView",
        "com/models/Constants",
        "com/utils/DataUtils",
        "com/utils/Utils"
        ], function( PageView, Constants,  DataUtils, Utils) {

	// Extends PageView class
	var TipsPageView = PageView.extend({
		template:{},
		events: {
			'pageshow':	'onPageShow',
			'pageshow':	'onPageShow',
			'tap .closeContainer':	'closeIFrame',
		},
		initialize : function(options) {
			TipsPageViewInstance = this;
			TipsPageViewInstance.language = getApplicationLanguage();
			language = getApplicationLanguage();
			options.preventiOSDefaultScroll=true;
			PageView.prototype.initialize.call(this, options);

		},
		onPageShow : function(e){
			TipsPageViewInstance.bindTips();
			setTimeout(function(){
				var slider = new BulletSlider(document.querySelector('.bulletSlider'),false);
				setTimeout(function(){

					var icons = document.querySelectorAll("#TipsPageView .iconsCont .icon");
					for(var i =0;i<icons.length;i++){
						icons[i].index = i;
						icons[i].onclick = function(){
							slider.changeIndex(slider.el,this.index);
							for(var i=0;i<icons.length;i++){
								icons[i].className = "icon";
							}
							icons[this.index].className = "icon active";
							var value = 100 * this.index * -1;
							document.querySelector(".descs").style.webkitTransform = "translate3d(" + value + "%,0,0)";
						}
					}
					icons[0].className = "icon active";
					slider.onSlide = function(index){
						for(var i=0;i<icons.length;i++){
							icons[i].className = "icon";
						}
						icons[index].className = "icon active";
						var value = 100 * index * -1;
						document.querySelector(".descs").style.webkitTransform = "translate3d(" + value + "%,0,0)";

					}
					var index = 0;
					if(getApplicationLanguage() != "en"){
						index = TipsScreens.length - 1;
					}
					for(var i=0;i<icons.length;i++){
						icons[i].className = "icon";
					}
					icons[index].className = "icon active";
					var value = 100 * index * -1;
					document.querySelector(".descs").style.webkitTransform = "translate3d(" + value + "%,0,0)";


						slider.changeIndex(slider.el,index)

					document.querySelector("#TipsPageView #closeBtn").onclick = function(){
						var options = {
								"direction"        : "down", // 'left|right|up|down', default 'left' (which is like 'next')
								"duration"         :  600, // in milliseconds (ms), default 400
								"slowdownfactor"   :    6, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
								"slidePixels"      :   0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
								"iosdelay"         :  -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
								"androiddelay"     :  -1, // same as above but for Android, default 70
								"winphonedelay"    :  -1, // same as above but for Windows Phone, default 200,
								"fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
								"fixedPixelsBottom":   0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
						};
						window.plugins.nativepagetransitions.slide(
								options,
								function (msg) {}, // called when the animation has finished
								function (msg) {} // called in case you pass in weird values
						);
						DataUtils.setLocalStorageData('showTips', Constants.TIPS, true, 'shell');
//						history.back();
						Utils.loadHomePage();
					}
				});
			});
		},
		bindTips:function(){
			var screens = TipsScreens;
			for(var i=0;i<screens.length;i++){
				var slide = document.querySelector("#templates .slide").cloneNode(true);
				var desc = document.querySelector("#templates .desc").cloneNode(true);
				var icon = document.querySelector("#templates .icon").cloneNode(true);
				if(getApplicationLanguage() == "en"){
					slide.querySelector("img").src =window.mobile.baseUrl+screens[i].imageEnglish;
					desc.querySelector(".title").textContent = screens[i].descEnglish.head;
					desc.querySelector(".cont").textContent = screens[i].descEnglish.content;
					icon.innerHTML =  screens[i].icon;
				}else{
					slide.querySelector("img").src = window.mobile.baseUrl+screens[(screens.length - 1) - i].imageArabic;
					desc.querySelector(".title").textContent = screens[(screens.length - 1) - i].descArabic.head;
					desc.querySelector(".cont").textContent = screens[(screens.length - 1) - i].descArabic.content;
					icon.innerHTML = screens[(screens.length - 1) - i].icon;
				}


				document.querySelector("#TipsPageView .slidsCont").appendChild(slide);
				document.querySelector("#TipsPageView .descs").appendChild(desc);
				document.querySelector("#TipsPageView .iconsCont").appendChild(icon);
			}

		}
	});

	// Returns the View class
	return TipsPageView;

});

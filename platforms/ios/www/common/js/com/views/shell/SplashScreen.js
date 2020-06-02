window.dashboardInitialized = false;
var SplashModel = {
		adjustDimensions:function() {
			var w = window, d = document, e = d.documentElement, g = d
			.getElementsByTagName('body')[0], x = w.innerWidth
			|| e.clientWidth || g.clientWidth, y = w.innerHeight
			|| e.clientHeight || g.clientHeight;
			document.getElementById("splash-container").style.width = x+ "px";
			document.body.style.margin = "0px";
			document.body.style.padding = "0px";
		},
		getSplashScreen:function(callback){
			window.DashboardIndex = "1";
			var baseUrl = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
			var rawFile = new XMLHttpRequest();
			rawFile.open("GET", baseUrl+"/pages/shell/splash_screen.html", true);
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						var transformVal = window.innerWidth;
						var html = rawFile.responseText;
						var splashHtml= document.createElement('div');
						splashHtml.id = "splach-id";
						splashHtml.innerHTML = html;
						splashHtml.querySelector("#descAr").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						splashHtml.querySelector("#descEn").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						splashHtml.querySelector("#btnEn").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						splashHtml.querySelector("#btnAr").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						splashHtml.querySelector("#hintAr").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						splashHtml.querySelector("#hintEn").style.webkitTransform
						= 'translate3d('+transformVal+'px, 0px, 0px)';
						setTimeout(function () {
							document.body.appendChild(splashHtml);
							callback();
						});
						document.addEventListener("deviceready", function(){
							navigator.splashscreen.hide();
							setTimeout(function () {
								document.body.appendChild(splashHtml);
								callback();
							});
						},false);
					}
				}
			}
			rawFile.send(null);
		},
		languageOpened:false,
		languageClicked:function(lang){
			localStorage.setItem("language",lang); 
			SplashModel.closeSplashScreen(false);
		},
		closeSplashScreen:function(hideLoader){
			var left =  window.innerWidth;
			if(SplashModel.languageOpened){
				document.getElementById("btnEn").style.webkitTransform = 'translate3d('+(left*-1)+'px, 0px, 0px)';
            	document.getElementById("btnAr").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
            	document.getElementById("waitTextLang").style.webkitTransform = "scale(1)";
				
			}else{
				document.getElementById("waitText").style.webkitTransform = "scale(1)";
			}
			
			setTimeout(function () {
				launchIndexPage();
				var options = {
						  "direction"        : "up", // 'left|right|up|down', default 'left' (which is like 'next')
						  "duration"         :  400, // in milliseconds (ms), default 400
						  "slowdownfactor"   :    3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
						  "slidePixels"      :   0, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
						  "iosdelay"         :  -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
						  "androiddelay"     :  -1, // same as above but for Android, default 70
						  "winphonedelay"    :  -1, // same as above but for Windows Phone, default 200,
						  "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
						  "fixedPixelsBottom":   0  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
					};
					window.plugins.nativepagetransitions.slide(
						  options,
						  function (msg) {}, // called when the animation has finished
						  function (msg) {} // called in case you pass in weird values
					);
					setTimeout(function(){
						var splash = document.querySelector("#splach-id");
						splash.parentNode.removeChild(splash);
					},300);
			},650);
		},
		showLanguageSwitch:function(){
			var left = -1 * window.innerWidth;
			document.getElementById("phone").style.transitionDelay = "0ms";
			document.getElementById("text").style.transitionDelay = "150ms";
			document.getElementById("splashLoader").style.transitionDelay = "300ms";
			document.getElementById("dsgLogo").style.transitionDelay = "450ms";
			document.getElementById("govLogo").style.transitionDelay = "600ms";
			document.getElementById("phone").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
			document.getElementById("text").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
			document.getElementById("splashLoader").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
			document.getElementById("dsgLogo").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
			document.getElementById("govLogo").style.webkitTransform = 'translate3d('+left+'px, 0px, 0px)';
			document.getElementById("descAr").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			document.getElementById("descEn").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			document.getElementById("btnEn").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			document.getElementById("btnAr").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			document.getElementById("hintAr").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			document.getElementById("hintEn").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
			SplashModel.languageOpened = true;	
		},
		animateSplash:function(loadLogoDeferred){
			var gifLogo = document.getElementById("gifLogo");
        	var imgno=1;
        	var myInterval=setInterval(function(){ 
        		if(imgno==21) clearInterval(myInterval);
        		gifLogo.src ="images/shell/splash/rtaSequence/RTALogoAnimation000"+imgno+".png"
        		imgno++;
        	}, 40);
			setTimeout(function () {
				document.getElementById("btnEn").onclick = function(){
					SplashModel.languageClicked("en");
				} 
	        	document.getElementById("btnAr").onclick = function(){
					SplashModel.languageClicked("ar");
				} 
	        	
	        	setTimeout(function () {
	        		document.getElementById("gifLogo").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
					document.getElementById("dsgLogo").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
	            	document.getElementById("dsgLogo").style.opacity = 1;
	            	document.getElementById("govLogo").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
	            	document.getElementById("govLogo").style.opacity = 1;
	            	document.getElementById("phone").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
	            	document.getElementById("phone").style.opacity = 1;
	            	document.getElementById("text").style.webkitTransform = 'translate3d(0px, 0px, 0px)';
	            	document.getElementById("text").style.opacity = 1;
	            	document.getElementById("splashLoader").style.opacity = 1;
	            	setTimeout(function () {
	            		document.getElementById("splashLoader").style.transitionDelay = "0ms";
	            		document.getElementById("splashLoader").style.opacity = 0;
	            		if(loadLogoDeferred)
	                		loadLogoDeferred.resolve(function(){
	                			if(localStorage.getItem("language") == null){
	                    			SplashModel.showLanguageSwitch();
	                    		}else{
	                    			SplashModel.closeSplashScreen(true);
	                    		}
	                		});
	            	},2000);
	        	},(40 * 21 - 500 ));
	        	 
				
	        },500);
		},
		dispose:function(){
			var splashElement = document.getElementById('splach-id');
			if (splashElement)
				splashElement.remove();
			var div = document.getElementById('rtaCommonShell')
 			div.style.background = "";
			document.body.style.backgroundColor = "";
  			SplashModel="";
  			document.documentElement.style.background = "";
 			delete SplashModel;
		}
}; 




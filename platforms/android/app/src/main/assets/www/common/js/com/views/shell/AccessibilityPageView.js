define(["com/views/PageView",
        "com/views/Header",
        "com/models/Constants",
        "com/utils/Utils",
        "com/utils/DataUtils"
        ], function( PageView, Header, Constants, Utils, DataUtils) {
	var AccessibilityPageView = PageView.extend({
		events:{
			'pageshow':'onPageShow',
			"tap #openSettings":"openNativeSettings"
		},
		initialize: function(options)
		{
			self = this;
			AccessibilityPageView = this;
			AccessibilityPageView.language = getApplicationLanguage();
			if(!options){
				options = {};
			}
			AccessibilityPageView.options = options;
			options.hideFooter=true;
			options.headerState = Header.STATE_MENU;
			options.phoneTitle = Globalize.localize("%shell.sidepanel.accessibility%", getApplicationLanguage());
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow:function(){
			var resetButton = document.getElementById('resetBtn');
			resetButton.onclick=function(event){
				deactivateCheckbox(document.getElementById('highConstrast-checkbox'));
				setTimeout(function(){ 	AccessibilityPageView.invertColors(false); }, 300);
				deactivateCheckbox(document.getElementById('blackAndWhite-checkbox'));
				setTimeout(function(){ 	AccessibilityPageView.blackAndWhite(false); }, 300);

				deactivateCheckbox(document.getElementById('zoom-checkbox'));
				if(window.appZoom.isZoomEnabled()){
					activateCheckbox(document.getElementById("zoom-checkbox"));
					setTimeout(function(){ 	window.appZoom.toggle(); }, 300);
				}
        deactivateCheckbox(document.getElementById('speech-checkbox'));
      if(window.TextToSpeech.isSpeechEnabled()){
        activateCheckbox(document.getElementById("speech-checkbox"));
        setTimeout(function(){  	window.TextToSpeech.toggle();}, 300);
      }

			};
			var highConstrastSwitch = document.getElementById('highConstrast-checkbox');
			highConstrastSwitch.onchange = function(event){
				var checked =this.checked;
				if(checked ==false) {

					deactivateCheckbox(this);
					setTimeout(function(){ 	AccessibilityPageView.invertColors(checked); }, 300);

				}else {
					activateCheckbox(this);
					setTimeout(function(){ 	AccessibilityPageView.invertColors(checked); }, 300);
				}

			};

			var invertedColors = localStorage.getItem("shellInvertedColors");
			invertedColors = invertedColors != null ? JSON.parse(invertedColors):false;
			if(invertedColors){
				activateCheckbox(highConstrastSwitch);
				setTimeout(function(){ 	AccessibilityPageView.invertColors(true); }, 300);
			}



			var blackAndWhiteSwitch = document.getElementById('blackAndWhite-checkbox');
			blackAndWhiteSwitch.onchange = function(event){
				var checked =this.checked;
				if(checked ==false) {

					deactivateCheckbox(this);
					setTimeout(function(){ 	AccessibilityPageView.blackAndWhite(checked); }, 300);

				}else {
					activateCheckbox(this);
					setTimeout(function(){ 	AccessibilityPageView.blackAndWhite(checked); }, 300);
				}

			};
			var BlackAndWhite = localStorage.getItem("shellBlackAndWhite");
			BlackAndWhite = BlackAndWhite != null ? JSON.parse(BlackAndWhite):false;
			if(BlackAndWhite){
				activateCheckbox(blackAndWhiteSwitch);
				setTimeout(function(){ 	AccessibilityPageView.blackAndWhite(true); }, 300);
			}

			var zoomSwitch = document.getElementById('zoom-checkbox');
			zoomSwitch.onchange = function(event){
				var checked =this.checked;
				if(checked ==false) {

					deactivateCheckbox(this);
					setTimeout(function(){ 	window.appZoom.toggle(); }, 300);

				}else {
					activateCheckbox(this);
					setTimeout(function(){ 	window.appZoom.toggle(); }, 300);
				}

			};

			window.appZoom = new AppZoom();
			window.appZoom.onClose(function(){
				if(document.getElementById("zoom-checkbox") != null){
					deactivateCheckbox(document.getElementById("zoom-checkbox"));
				}
			})
			if(window.appZoom.isZoomEnabled()){
				activateCheckbox(document.getElementById("zoom-checkbox"));
				setTimeout(function(){ 	window.appZoom.toggle(); }, 300);
			}

			if(Utils.getCurrentPlatform() == "iOS"){
				document.getElementById("openSettings").style.display = "none";
			}

			// speech text
			var language = getApplicationLanguage();
			if(language&&language=='en'){
				document.getElementById("speechCont").style.display="block";
				var speechSwitch = document.getElementById('speech-checkbox');
				speechSwitch.onchange = function(event){
					var checked =this.checked;
					if(checked ==false) {

						deactivateCheckbox(this);
						setTimeout(function(){ 	window.TextToSpeech.toggle(); }, 300);

					}else {
						activateCheckbox(this);
						setTimeout(function(){ 	window.TextToSpeech.toggle(); }, 300);
					}

				};


				window.TextToSpeech = new textToSpeech();
				window.TextToSpeech.onClose(function(){
					if(document.getElementById("speech-checkbox") != null){
						deactivateCheckbox(document.getElementById("speech-checkbox"));
					}
				})
				if(window.TextToSpeech.isSpeechEnabled()){
					activateCheckbox(document.getElementById("speech-checkbox"));
					//setTimeout(function(){ 	window.TextToSpeech.toggle(); }, 300);
				}
			}else{
				document.getElementById("speechCont").style.display="none";
				//window.TextToSpeech.onClose("closeSpeech")

			}



		},
		invertColors:function(checked){
			if(checked){
				localStorage.setItem("shellBlackAndWhite","false");
				deactivateCheckbox(document.getElementById('blackAndWhite-checkbox'));
				localStorage.setItem("shellInvertedColors","true");
				document.documentElement.style.webkitFilter = "invert(100%)";
				document.documentElement.style.filter = "invert(100%)";
			}else{
				localStorage.setItem("shellInvertedColors","false");
				document.documentElement.style.webkitFilter = "";
				document.documentElement.style.filter = "";
			}
		},
		blackAndWhite:function(checked){
			if(checked){
				localStorage.setItem("shellInvertedColors","false");
				deactivateCheckbox(document.getElementById('highConstrast-checkbox'));
				localStorage.setItem("shellBlackAndWhite","true");
				document.documentElement.style.webkitFilter = "grayscale(100%)";
				document.documentElement.style.filter = "grayscale(100%)";
			}else{
				localStorage.setItem("shellBlackAndWhite","false");
				document.documentElement.style.webkitFilter = "";
				document.documentElement.style.filter = "";
			}
		},
		openNativeSettings:function(){
			NativeSettings.open("accessibility", function() {
				console.log('opened settings');
			},
			function () {
				console.log('failed to open settings');
			});
		}
	});

	// Returns the View class
	return AccessibilityPageView;

});

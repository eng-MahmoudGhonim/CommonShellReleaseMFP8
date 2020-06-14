
/* JavaScript content from components/TextToSpeech/TextToSpeech.js in folder common */
﻿
/* JavaScript content from components/TextToSpeech/TextToSpeech.js in folder common */
﻿(function () {
	"use strict";
	var textToSpeech = function () {
		//this.init();
	}
	textToSpeech.prototype = function () {
		var currentDir,
		speechControls,
		x,
		y,
		animating = false,
		zoomedIn = true,
		startX,
		startY,
		endX,
		endY,
		valX,
		valY,
		initialRect,
		speechPanelEnabled = false,
		closeCallBack = null;

		var latestElement;
		var speakerEnabled=false;
		var eventAdded=false;
		var speechPanelOpened=false;

		function init() {
			try{
				speechPanelEnabled = true;
				var zoomTemplate = document.createElement("div");
				zoomTemplate.innerHTML = '<div id="speechControls"><div id="speechPanel"><span class="icon-close-notification closePanel waves-effect"></span><span class="zoomOut icon-speaker speakBtn waves-effect"></span><span class="icon-drag move waves-effect"></span></div></div>';
				document.documentElement.appendChild(zoomTemplate.firstChild);
				speechControls = document.getElementById("speechControls");
				speechControls.getElementsByClassName("speakBtn")[0].onclick = speaker;
				speechControls.getElementsByClassName("closePanel")[0].onclick = closeSpeech;
				speechControls.getElementsByClassName("move")[0].ontouchstart = panelDragStart;
				speechControls.getElementsByClassName("move")[0].ontouchmove = panelDrag;
				speechControls.getElementsByClassName("move")[0].ontouchend = panelDragEnd;
				x = y = valX = valY = 0;
				initialRect = document.getElementById("speechPanel").getBoundingClientRect();
			}catch(e){
				console.log(e);
			}
		}

		function panelDragStart(e) {
			try{
				speechControls.getElementsByClassName("move")[0].style.color = "#f30000";
				//speechControls.getElementsByClassName("closePanel")[0].style.color = "#818181";
				speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
				startX = endX = e.touches[0].clientX;
				startY = endY = e.touches[0].clientY;
			}catch(e){
				console.log(e);
			}
		}

		function panelDrag(e) {
			try{
				e.preventDefault();
				valX += e.touches[0].clientX - endX;
				valY += e.touches[0].clientY - endY;
				if (valX < -Math.abs(initialRect.left - 45)) {
					valX = -Math.abs(initialRect.left - 45);
				} else if (valX > Math.abs(initialRect.right - (window.innerWidth - 45))) {
					valX = Math.abs(initialRect.right - (window.innerWidth - 45));
				}
				if (valY < -Math.abs(initialRect.top - 45)) {
					valY = -Math.abs(initialRect.top - 45);
				} else if (valY > Math.abs(initialRect.bottom - (window.innerHeight - 45))) {
					valY = Math.abs(initialRect.bottom - (window.innerHeight - 45));
				}


				document.getElementById("speechPanel").style.webkitTransform =
					"translate3d(" + valX + "px," + valY + "px,0)";
				endX = e.touches[0].clientX;
				endY = e.touches[0].clientY;
			}catch(e){
				console.log(e);
			}
		}

		function panelDragEnd(e) {
			try{
			speechControls.getElementsByClassName("move")[0].style.color = "#818181";
			//speechControls.getElementsByClassName("closePanel")[0].style.color = "#f30000";
			}catch(e){
				console.log(e);
			}
		}


		function speaker() {
			try{
				speakerEnabled=speakerEnabled?false:true;
				enableTextSpeech();
			}catch(e){
				console.log(e);
			}

		}

		function disableSpeaker(){
			try{
				speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
				speakerEnabled=false;
				if(latestElement&&	latestElement.classList.contains("selectItem")){
					latestElement.classList.remove("selectItem");}
			}catch(e){
				console.log(e);
			}
		}
		function readTextFromHtmlTag(htmltag){
			try{
				var text="";
				if(htmltag){
					text=htmltag.textContent;
					// if no text read property alt
					if(!text|| (text&&text.trim().length==0)){
						text=htmltag.getAttribute("alt");

					}

				}
				console.log(text);
				return text;
			}catch(e){
				console.log(e);
				return text;
			}
		}

		function enableTextSpeech(){
			// this flag check if event added or not 
			try{
				if(speakerEnabled){
					speechControls.getElementsByClassName("speakBtn")[0].style.color = "#f30000";
					if(!eventAdded){
						eventAdded=true;
						document.getElementById("rtaCommonShell").addEventListener("click",function(e){
							// this is the worst case to close speaker 
							var disable=setTimeout(function(){ 	
								speakerEnabled=false;
								
								speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
							}, 20000);
							if(latestElement&&	latestElement.classList.contains("selectItem")){
								latestElement.classList.remove("selectItem");
							}
							if(speakerEnabled){
								e.stopPropagation();
								e.preventDefault();
								console.log(e)
								console.log(e.target);	
								latestElement=e.target;
								var textValue=readTextFromHtmlTag(e.target);
								// if no alt get data from parent tag
								if(!textValue|| (textValue&&textValue.trim().length==0)){
									var parentElement=latestElement.parentElement;
									textValue=readTextFromHtmlTag(parentElement);
									latestElement=latestElement.parentElement;
								}

								// if no alt get data from parent parent tag
								if(!textValue|| (textValue&&textValue.trim().length==0)){
									var parentElement=latestElement.parentElement;
									textValue=readTextFromHtmlTag(parentElement);
									latestElement=latestElement.parentElement;
								}


								//latestElement.style.border = "2px solid #0000FF";
								if(textValue){
									if(latestElement&&	!latestElement.classList.contains("selectItem"))
										latestElement.classList.add("selectItem");

									TTS.checkLanguage().then(function(supportedLocale){
										var locale ='en-US' ;
										TTS.speak({
											text: textValue,
											locale: locale,
											rate: 1
										}).then(function () {
											console.log("sound end ");
											//stop speaker 
											setTimeout(function(){	speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
											speakerEnabled=false;
											if(latestElement&&	latestElement.classList.contains("selectItem")){
												latestElement.classList.remove("selectItem");
											}},300);
											clearTimeout(disable);
										
										}, function (reason) {
											speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
											console.log(reason);
											speakerEnabled=false;
											if(latestElement&&	latestElement.style){
												latestElement.style.border="none";
												clearTimeout(disable);
											}
										});
									});
								}
								else
								{
									disableSpeaker();
									TTS.stop();
								}
							}
						},true);
					}
				}
				else
				{
					disableSpeaker();
					TTS.stop();
				}
			}catch(e){
				console.log(e);
				speakerEnabled=false;
				speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
			}
		}

		function closeSpeech() {
			try{
				TTS.stop();
				if(latestElement&&latestElement.classList.contains("selectItem")){
					latestElement.classList.remove("selectItem");}
				speakerEnabled=false;
				speechPanelEnabled = false;

				setTimeout(function () {
					document.documentElement.removeChild(speechControls);
				}, 350);
				if(closeCallBack != null)
					closeCallBack();
			}catch(e){
				console.log(e);
				speakerEnabled=false;
				speechControls.getElementsByClassName("speakBtn")[0].style.color = "#818181";
			}
		}

		function toggle() {
			speechPanelEnabled ?closeSpeech() : init();
		}

		function isSpeechEnabled(){
			return speechPanelEnabled;
		}
		function isSpeakerEnabled(){
			return speakerEnabled;
		}


		function onClose(callBack){
			closeCallBack = callBack;
		}

		return {
			toggle: toggle,
			isSpeechEnabled: isSpeechEnabled,
			isSpeakerEnabled: isSpeakerEnabled,
			onClose:onClose
		}
	}();

	window.textToSpeech = textToSpeech;
})();

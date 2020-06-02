
/* JavaScript content from components/captcha/captcha.js in folder common */

/* JavaScript content from components/captcha/captcha.js in folder common */
(function(){
	'use strict';

	function captcha(options)
	{	
		
		//Elements
		this.captchaInfo=document.getElementById('captchaInfo'); // this is parent Div

		this.captchaKey=""; // this for save old key for refresh
		this.captchaType="" ;// 
		this.captchaAnswer="";//the final anser
		this.oldQuesId=0;  // this is old question
		this.currentSpeechCaptcha; // save old captcha
		this.speechLoaded=false;
		this.lang=options.lang;
		this.isValid=false;
		this.serviceName=options.serviceName;
		//Methods
		this.generateCaptcha=options.captchaModel.GenerateCaptcha;
		this.generateSpeechCaptcha=options.captchaModel.GenerateSpeechCaptcha;
		this.checkCaptchaItem=options.captchaModel.CheckCaptcha;
		this.checkSpeechCaptchaItem=options.captchaModel.CheckSpeechCaptcha;
		this.onChange=options.onChange;

		// start up point
		this.init(options); 		
	}

	captcha.prototype=function()
	{
		function init(options)
		{
			//render the component HTML
			renderCompoment.call(this);
			//Get the captcha from DB
			var _this=this;
			if (checkConnectivity()){
				hangComponent.call(this,true);
				this.generateCaptcha(this.captchaKey,this.oldQuesId,function (status,result) { renderCaptchaData.call(_this,status,result)},this.serviceName); // this call model
			}else {
				applyOffline.call(this);
			}

		}
		function createElement(tag,props){
			var element = document.createElement(tag);
			var elProps = Object.keys(props)
			for (var i = 0 ; i< elProps.length;i++){
				var key = elProps[i];
				element[key]= props[key];
			}
			return element;
		}
		function renderCompoment(){
			var _this = this;
			var detailsElement = createElement('div',{
				innerHTML:"",
				id:"details"
			});			
			var questionElement = createElement('div',{
				innerHTML:"",
				id:"question",
				style:"visibility:hidden"
			});
			var imagesElement = createElement('div',{
				innerHTML:"",
				id:"contentImages"
			});
			var iconsElement = createElement('div',{
				innerHTML:"",
				className:"optionsIcon"
			});
			var speakerIcons = createElement('span',{
				innerHTML:"",
				className:"icon icon-speaker waves-effect",
				id:"speakerCaptcha"
			});
			// refresh icon
			var refreshIcons = createElement('span',{
				innerHTML:"",
				className:"icon icon-reload waves-effect",
				id:"refreshCaptcha"
			});

			var ErrorMSGspan = createElement('span',{
				innerHTML:"",
				className:"CaptchaErrorMSGspan"
			});
			//create div for offline 
			var offlineCaptchaElement = createElement('div',{
				innerHTML:"",
				className:"offlineCaptcha"
			});	


			this.captchaInfo.appendChild(offlineCaptchaElement);
			this.captchaInfo.appendChild(detailsElement);
			detailsElement.appendChild(questionElement);
			detailsElement.appendChild(imagesElement);
			detailsElement.appendChild(iconsElement);
			iconsElement.appendChild(ErrorMSGspan);

			var iconDiv=detailsElement.querySelector(".optionsIcon");
			iconDiv.appendChild(speakerIcons);
			iconDiv.appendChild(refreshIcons);

//			TODO please replace it to select from parent
			this.questionElement=document.getElementById('question');
			this.imageElement=document.getElementById('contentImages');
			this.speekerElement=speakerIcons;
			this.refreshElement=refreshIcons;
			// draw Speaker Area
			speakerIcons.addEventListener("click",function (event){
				onSpeech.call(_this,event)
			});
			refreshIcons.addEventListener("click",function (event){
				onRefresh.call(_this,event)
			});

		}
		function checkConnectivity(){
			return navigator.onLine;
		}
		function applyOffline(){
			var _this=this;
			if(!checkConnectivity()){
				var offLineElement = this.captchaInfo.querySelector('.offlineCaptcha');

				offLineElement.classList.add("offlineConnectionCaptcha");
				var noInternetText = createElement('span',{
					innerHTML:this.lang == 'en' ? "No INTERNET "+"</br>"+ "CONNECTION FOUND": "لا يوجد "+"</br>"+ "اتصال",
							className:"noInternetText"
				});
				offLineElement.appendChild(noInternetText);

				var checkInternetConnection = createElement('span',{
					innerHTML:this.lang == 'en' ? "Please check your internet connection and try again":"يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
							className:"tryAgainText"
				});
				offLineElement.appendChild(checkInternetConnection);


				var checkInternet = createElement('span',{
					innerHTML:"",
					className:"icon-reload waves-effect reloadInternetCaptcha"
				});

				checkInternet.addEventListener("click",function (event){
					if(navigator.onLine==true)
					{
						offLineElement.classList.contains("offlineConnectionCaptcha")?offLineElement.classList.remove("offlineConnectionCaptcha"):"";
						offLineElement.innerHTML="";
						hangComponent.call(this,true);
						_this.generateCaptcha(_this.captchaKey,_this.oldQuesId,function (status,result) { renderCaptchaData.call(_this,status,result)},this.serviceName); // this call model
					}
				});
				offLineElement.appendChild(checkInternet);
			}
		}


		function resetUI(){
			var errorMSG=this.captchaInfo.getElementsByClassName('CaptchaErrorMSGspan')[0];
			this.captchaInfo.style.border='1px solid #aaa';
			errorMSG.innerHTML="";
		}
		function onRefresh(event){
			event.preventDefault();
			this.isValid=false; // to disable button 
			this.onChange();
			this.speechLoaded=false;
			if(checkConnectivity()){
				this.questionElement.style.display='block';
				this.imageElement.style.display='block';
				var refreshIcons= this.refreshElement;
				var speakerIcons= this.speekerElement;
				var _this =this;
				hangComponent.call(this,true);
				this.generateCaptcha(this.captchaKey, this.oldQuesId,function (status,result) { renderCaptchaData.call(_this,status,result)},this.serviceName); // this call model
			}else {
				applyOffline.call(this);
			}
			resetUI.call(this);
		}

		function onSpeech(event){
			this.isValid=false; // to disable button 
			event.preventDefault();
			resetUI.call(this);
			this.onChange();
			var _this =this;
			// Get Speech question from DB (this.oldQuesId!=0 mean component initiated well )
			if(this.oldQuesId!=0 && !this.speechLoaded ){
				hangComponent.call(this,true);
				this.generateSpeechCaptcha(this.captchaKey,function (status,result) { renderSpeechCaptchaData.call(_this,status,result)},this.serviceName); // this call model
				this.imageElement.innerHTML='';
				this.speechLoaded=true;
			}else{
				textToSpeech.call(this,this.currentSpeechCaptcha.Question);
			}
			this.questionElement.innerHTML=this.lang == 'en' ? 'Type in below the answer to what you ' : 'اكتب إجابة السؤال الذي ';
			this.questionElement.style.color='black';
			var speakerWord = createElement('span',{
				innerHTML:this.lang == 'en' ? "hear.":"تسمعه.",
						className:"Ques",
						id:"speakerWord",
						style:"color:#171c8f"
			});
			_this.questionElement.appendChild(speakerWord);
		}
		function textToSpeech(question){
			var _this=this;
			activateSpeakerIcon.call(_this,true);
			var inputSpeakerCaptcha = _this.captchaInfo.querySelector("#inputSpeakerCaptcha");
			inputSpeakerCaptcha.value="";
			TTS.checkLanguage().then(function(supportedLocale){
				var locale ='en-US' ;
				if(_this.lang=='ar' && supportedLocale.indexOf('ar')>=0){
					locale ='ar-AE' ;
				}

				var speechText= locale == 'en-US'? question.ENTEXT : question.ARTEXT;
				TTS.speak({
					text: speechText,
					locale: locale,
					rate: 1
				}).then(function () {
					activateSpeakerIcon.call(_this,false);
					inputSpeakerCaptcha.focus();
				}, function (reason) {
					console.log(reason);
					activateSpeakerIcon.call(_this,false);
				});
			});
		}

		function renderSpeechCaptchaData(status,result) {
			hangComponent.call(this,false);
			//var result={"isSuccessful":true,"Answers":{"ID":27,"TEXT":"20"},"Question":{"ID":12,"TEXT":"what is sum double 10"},"Key":"9ab8009a"}
			this.oldQuesId=0;// to know if user first time click sound or not ;
			this.currentSpeechCaptcha=result;
			this.captchaKey=result.Key;// iniat the key

			document.querySelector("#speakerCaptcha").style.color="#171b8f";
			document.querySelector("#speakerCaptcha").style.border='1px solid #171b8f';
			var inputSpeakerElementDiv = createElement('div',{
				innerHTML:"",
				className:"shell-input-cont"
			});	

			var inputSpeakerElement = createElement('INPUT',{
				innerHTML:"",
				id:"inputSpeakerCaptcha",
				placeholder:this.lang == 'en'? "Your answer":"جوابك",
						type:"number"
			});
			inputSpeakerElementDiv.appendChild(inputSpeakerElement)
			this.imageElement.appendChild(inputSpeakerElementDiv);
			var _this=this;
			inputSpeakerElement.onblur= function (event){
				var speechInputText=event.target.value;
				if (speechInputText && speechInputText != ""){
					_this.captchaAnswer=speechInputText.toString() // this for speach text

					_this.checkSpeechCaptchaItem(_this.captchaKey,speechInputText.toString(),function (result,selectId) { checkAnswer.call(_this,result,speechInputText,"CheckSpeechCaptcha")});
				}else {
					resetUI.call(_this);
				}
			};
//			inputSpeakerElement.onkeydown= function (event){
//			_this.isValid= false;
//			_this.onChange();

//			};
			inputSpeakerElement.oninput= function (event){
				_this.isValid= false;
				_this.onChange();
				var speechInputEL=event.target;
				if (speechInputEL.value && speechInputEL.value != ""){
					speechInputEL.style.border='1px solid #171b8f';
				}else {
					speechInputEL.style.border='none';
				}
			};

			textToSpeech.call(this,result.Question);
			this.speechLoaded=true;
		}

		function hangComponent(hang){
			if(hang==true){
				this.captchaInfo.style.pointerEvents="none";
			}else {
				this.captchaInfo.style.pointerEvents="auto";
			}

		}
		function renderCaptchaData(status,result) {
			try{
				hangComponent.call(this,false);
				var _this=this;
				//var result={"isSuccessful":true,"Answers":[{"ID":11,"ENTEXT":"happiness"},{"ID":9,"ENTEXT":"metro"},{"ID":6,"ENTEXT":"camera"},{"ID":7,"ENTEXT":"car"},{"ID":12,"ENTEXT":"nol"}],"Question":{"ID":12,"ENTEXT":"nol"},"Key":"9ab8009a"}
				this.oldQuesId=result.Question.ID; // Set the current question
				this.captchaKey=result.Key;
				this.questionElement.innerHTML='';
				var question=result.Question;
				var questionEl = this.captchaInfo.querySelector("#question");
				questionEl.style.visibility="visible";
				var quesText = createElement('span',{ 
					innerHTML: this.lang == 'en' ? "Select the ": "إختار ",
							className:"QuesText"
				});
	
				this.questionElement.appendChild(quesText);
	
				var questSpan = createElement('span',{
					innerHTML:this.lang == 'en' ? question.ENTEXT:question.ARTEXT,
							className:"CaptchaQuestion"
				});
	
				this.questionElement.appendChild(questSpan)	
	
				var quesText2 = createElement('span',{
					innerHTML:this.lang == 'en' ?  " Image": "",
							className:"QuesText"
				});
	
				this.questionElement.appendChild(quesText2);
				var answers=result.Answers.sort(compare);
				if(answers){
					this.imageElement.innerHTML='';
					for(var index =0 ;index<answers.length;index++)
					{
						var currentIcone=answers[index]; 
						var imagesTags=this.imageElement.getElementsByTagName('img');
						var span = document.createElement("span");
						span.classList.add("Images");
						var fontclass=(currentIcone.ENTEXT).replace(/ /g,"");
						fontclass="icon-"+fontclass
						span.classList.add(fontclass) 
						span.style.fontSize="25px";
						span.setAttribute('id',currentIcone.ID);	// get the name 					
						this.imageElement.appendChild(span);
						span.addEventListener("click",function (event){
							onItemClick.call(_this,event);
	
						});
					}
				}
				else
				{
	//				alert("Answers is empty is undefined ");
				}	
			}catch(e){}
		}
		function onItemClick(event){

			this.isValid=false; // to disable button 
			var _this=this;
			if(!checkConnectivity() ){
				applyOffline.call(this);
			}
			removeClassActive.call(this);
			var selectId=event.target.id;  
			hangComponent.call(this,true);
			this.captchaAnswer=selectId; // for get id for icon

			_this.checkCaptchaItem(_this.captchaKey,selectId,function (result,selectId) { checkAnswer.call(_this,result,selectId,"CheckCaptcha")});
		}

		function compare (a,b){
			// this method for sorting answers By Id
			if (a.ID < b.ID)
				return -1;
			if (a.ID > b.ID)
				return 1;
			return 0;
		}	


		function removeClassActive(){	    
			// Remove classes from  icons 
			var spanTags=this.imageElement.children;
			//var spanTags=_this.captchaInfo.querySelector('#contentImages span');
			for(var i=0;i<spanTags.length;i++)
			{
				spanTags[i].classList.contains("correctImage")?spanTags[i].classList.remove("correctImage"):"";
				spanTags[i].classList.contains("uncorrectImage")?spanTags[i].classList.remove("uncorrectImage"):"";
			}
		}   

		function checkAnswer (result){
			hangComponent.call(this,false);

			this.captchaType=result.type ; // current answer

			result.isValid=result.isValid;// current result

			var currentElement;
			var errorMSG=this.captchaInfo.getElementsByClassName('CaptchaErrorMSGspan')[0];
			if(result.type=="Icon"){


				currentElement=this.captchaInfo.querySelector('span[id="'+result.answer+'"]');

				if(result.isValid=="Valid"){
					this.isValid=true;
					currentElement.classList.add("correctImage");
					currentElement.classList.remove("uncorrectImage");
					document.querySelector(".CaptchaQuestion").style.color="#171b8f";
					//document.querySelector("#speakerCaptcha").style.color="#025ee1";
					
					resetUI.call(this); 
				}else{
					this.isValid=false;
					currentElement.classList.add("uncorrectImage");
					currentElement.classList.remove("correctImage");
					this.captchaInfo.style.border='1px solid #ee0000 ';
					errorMSG.innerHTML=this.lang=='en' ?"Sorry, the selected image to the question above is incorrect." :"عذرًا ، الصورة المحددة للسؤال أعلاه غير صحيحة.";
					document.querySelector(".CaptchaQuestion").style.color="#ee0000"
					//document.querySelector("#speakerCaptcha").style.color="#ee0000";
				}
			}else{
				currentElement=this.captchaInfo.querySelector("#inputSpeakerCaptcha");
				if(result.isValid=="Valid"){
					this.isValid=true;

					document.querySelector("#inputSpeakerCaptcha").style.color="#171b8f";
					document.querySelector("#inputSpeakerCaptcha").style.border='1px solid #171b8f';
					document.querySelector("#speakerWord").style.color="#171b8f";
					resetUI.call(this); 
				}else{
					this.isValid=false;
					this.captchaInfo.style.border='1px solid #ee0000 ';
					document.querySelector("#inputSpeakerCaptcha").style.color="#ee0000";
					document.querySelector("#inputSpeakerCaptcha").style.border='1px solid #ee0000';
					document.querySelector("#speakerWord").style.color="#ee0000";
					
				
					
					
					errorMSG.innerHTML=this.lang=='en' ?"Sorry, your given answer to the question is incorrect.":"عذرا ، إجابتك على السؤال غير صحيحة.";
				}
			}

			this.onChange();
		}
		function isValid(){
			return this.isValid;
		}
		function activateSpeakerIcon(activate){
			var speakerCaptcha = this.captchaInfo.querySelector("#speakerCaptcha");
			if (activate){
				speakerCaptcha.style.color="#ee0000";
				speakerCaptcha.style.border="solid 1px #ee0000";

			}else {
				speakerCaptcha.style.color="#171b8f";
				speakerCaptcha.style.border="solid 1px #171b8f";
			}

		}
		return {
			init:init,
		  	isValid:isValid
		}
	}();
	window.captcha=captcha;
})();
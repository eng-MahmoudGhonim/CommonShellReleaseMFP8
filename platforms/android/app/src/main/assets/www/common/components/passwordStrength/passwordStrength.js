(function(){
	'use strict';
	var STRONG_PASSWORD="Strong",
	AVG_PASSWORD="Average",
	WEAK_PASSWORD="Weak",
	GOOD_PASSWORD="Good",
	NOT_MATCHED_PASSWORD="NotMatched",
	MATCHED_PASSWORD="Matched",
	EMPTY_PASSWORD="empty";


	function passwordStrength(options)
	{
		this.passwordElement=options.passwordElement;
		this.confirmPasswordElement=options.confirmPasswordElement;
		this.infoElement=options.infoElement;
		this.passwordValidator=options.passwordValidator;
		this.rePasswordValidator=options.rePasswordValidator;
		this.lang= options.lang;
		if(this.lang=="ar")this.infoElement.classList.add("arabic-content")
		this.messages=this.getMessages();
		this.init();
	}
	passwordStrength.prototype=function (){
		function init ()
		{
			var _this= this;
			this.passwordElement.addEventListener("input",function (event){
				onInput.call(_this,event)
			});
			this.confirmPasswordElement.addEventListener("input",function (event){
				onConfirmPasswordInput.call(_this,event)
			});
			updateInfo.call(_this);
		}

		function onInput(event){
			console.log(event.target.value);
			updateInfo.call(this);
			updateConfirmPass.call(this);
		}

		function onConfirmPasswordInput(event){
			console.log(event.target.value);
			updateInfo.call(this);
			updateConfirmPass.call(this);
		}
		function passwordMeasurement()
		{
			if(this.passwordElement.value==""){
				return EMPTY_PASSWORD;	
			}
			var currentPassword=(this.passwordElement.value).replace(/\s/g,'');
			var passLength=currentPassword.length;
			var passwordNumbersCount=currentPassword.replace(/[^0-9]/g,"").length;
			var passwordLowerCaseNumber=(currentPassword.match(/[a-z]/g) || []).length;
			var passwordCountOFSpecailChars=(currentPassword.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length
			var parentClass =this.passwordElement.parentNode.classList;
			if(passLength > 8 &&
					passwordLowerCaseNumber >= 3&&
					passwordCountOFSpecailChars >= 3&&
					passwordNumbersCount >=3 )
			{
				return STRONG_PASSWORD;
			}else if(passLength >= 8 &&
					passwordLowerCaseNumber >= 2&&
					passwordCountOFSpecailChars >= 2&&
					passwordNumbersCount >=2 )
			{
				return GOOD_PASSWORD;
			}else if(passLength >= 8 &&
					passwordLowerCaseNumber >= 1&&
					passwordCountOFSpecailChars >= 1&&
					passwordNumbersCount >=1 )
			{
				return AVG_PASSWORD;
			}else {
				return WEAK_PASSWORD;
			}

			return EMPTY_PASSWORD;
		}

		function strengthMatchedPassword()// check matched but must valid password
		{
			if(isPasswordMatched.call(this)){
				return MATCHED_PASSWORD;
			}

			return NOT_MATCHED_PASSWORD;
		}

		function updateInfo(){
			var strengthMsgEl = this.infoElement.querySelector("#strengthMsg");
			var strengthPointsEl = this.infoElement.querySelector(".strengthPoints");
			var strongIcon=strengthPointsEl.querySelector("#strongId");
			var avgIcon=strengthPointsEl.querySelector("#averageId");
			var goodIcon=strengthPointsEl.querySelector("#goodId");
			var line1=strengthPointsEl.querySelector(".line1");
			var line2=strengthPointsEl.querySelector(".line2");
			var passwordMeasurementValue=passwordMeasurement.call(this);
			var lang = this.lang, messages= this.messages;
			switch (passwordMeasurementValue){
			case EMPTY_PASSWORD:
				strengthPointsEl.style.display="block";
				strengthMsgEl.innerHTML="";
				strengthMsgEl.style.display="block";
				var msgSpan= document.createElement("span");
				msgSpan.id='Msg';
				msgSpan.style.color="black";
				msgSpan.innerHTML=messages.emptyPassword[lang];//"Password must have at least 8 characters, not contain username, 1 lowercase letter, 1 number and 1 symbol, i.e #$%&'()*+,-./:;<=>? @[\]^_`{|}~!\". Must not contain symbol such as £β¥© €® ™";
				strengthMsgEl.appendChild(msgSpan)
				var hintSpan= document.createElement("span");
				hintSpan.id='hint';
				hintSpan.innerHTML=messages.emptyPasswordHint[lang];//"E.g: Password@321";
				strengthMsgEl.appendChild(hintSpan)
				goodIcon.classList.remove('active');
				avgIcon.classList.remove('active');
				
				
				break;
			case STRONG_PASSWORD:
				strengthPointsEl.style.display="block";
				strengthMsgEl.innerHTML ="";
				strengthMsgEl.style.display="none";
				goodIcon.classList.remove('active');
				avgIcon.classList.remove('active');
				strongIcon.classList.add('active');
				line1.classList.add('active');
				line2.classList.add('active');
				

				break;
			case AVG_PASSWORD:
				strengthPointsEl.style.display="block";
				strengthMsgEl.innerHTML ="";
				strengthMsgEl.style.display="none";
				strongIcon.classList.remove('active');
				goodIcon.classList.remove('active');
				avgIcon.classList.add('active');
				line1.classList.remove('active');
				line2.classList.remove('active');
				
				break;
			case GOOD_PASSWORD:
				strengthPointsEl.style.display="block";
				strengthMsgEl.innerHTML ="";
				strengthMsgEl.style.display="none";
				strongIcon.classList.remove('active');
				avgIcon.classList.remove('active');
				goodIcon.classList.add('active');			
				lang=='en'?line1.classList.add('active'):line2.classList.add('active');  
				lang=='en'?line2.classList.remove('active'):line1.classList.remove('active');
				break;
			case WEAK_PASSWORD:
				strengthPointsEl.style.display="block";
				strengthMsgEl.innerHTML="";
				strengthMsgEl.style.display="block";
				var msgSpan= document.createElement("span");
				msgSpan.id='Msg';
				msgSpan.style.color="red";
				msgSpan.innerHTML=messages.weakPassword[lang];//"Password must have at least 8 characters and 1 number";
				strengthMsgEl.appendChild(msgSpan);

				var hintSpan= document.createElement("span");
				hintSpan.id='hint';
				hintSpan.innerHTML=messages.weakPasswordHint[lang];//"E.g: Password@321";
				strengthMsgEl.appendChild(hintSpan);
				break;

			}
		}

		function updateConfirmPass()
		{
			var matching=strengthMatchedPassword.call(this);
			var strengthMsgEl = this.infoElement.querySelector("#strengthMsg");
			var strengthPointsEl = this.infoElement.querySelector(".strengthPoints");
			var lang = this.lang, messages= this.messages;

			console.log(matching);
			if(this.passwordValidator.isValid && this.confirmPasswordElement.value !="" ){
				switch(matching){
				case NOT_MATCHED_PASSWORD:
					this.infoElement.minHeight="50px";
					strengthPointsEl.style.display="none";
					strengthMsgEl.innerHTML="";
					strengthMsgEl.style.display="block";
					var msgSpan= document.createElement("span");
					msgSpan.id='Msg';
					msgSpan.style.color="red";msgSpan.style.display="block"
						msgSpan.style.margin ="0px";
					msgSpan.innerHTML= messages.notMatchedPassword[lang];//"Sorry , Your password do not match, please re-enter the password";
					strengthMsgEl.appendChild(msgSpan)

					break;
				case MATCHED_PASSWORD:
					strengthPointsEl.style.display="none";
					strengthMsgEl.innerHTML="";
					strengthMsgEl.style.display="block";
					var msgSpan= document.createElement("span");
					msgSpan.id='Msg';
					msgSpan.style.color="green";
					msgSpan.innerHTML=messages.matchedPassword[lang];//"Passwords are matched. you are almost done.";
					strengthMsgEl.appendChild(msgSpan)
					var hintSpan= document.createElement("span");
					hintSpan.id='hint';
					hintSpan.innerHTML=messages.matchedPasswordHint[lang];//"Tick the box below and tap the button below to save your new password.";
					strengthMsgEl.appendChild(hintSpan)
					break;
				}
			}
		}
		function getMessages(){
			return {
				emptyPassword:{
					"en":"Password must have at least 8 characters, not contain username, 1 lowercase letter, 1 number and 1 symbol, i.e #$%&'()*+,-./:;<=>? @[\]^_`{|}~!\". Must not contain symbol such as £β¥© €® ™",
					"ar":"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، ولا تحتوي على اسم مستخدم، أو حرف صغير، أو رقم واحد، أو رمز واحد، أي # $٪ & '() * +، -. / :؛ <=>؟ @ [\] ^ _ `{|} ~! \" يجب ألا يحتوي على رمز    £ β ¥ © € ® ™"
				},
				emptyPasswordHint:{
					"en":"E.g: Password@321",
					"ar":"على سبيل المثال: باسورد @ 321"
				},
				weakPassword:{
					"en":"Password must have at least 8 characters and 1 number",
					"ar":"يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل ورقم واحد"
				},
				weakPasswordHint:{
					"en":"E.g: Password@321",
					"ar":"على سبيل المثال: باسورد @ 321"
				},
				notMatchedPassword:{
					"en":"Sorry , Your password do not match, please re-enter the password",
					"ar":"عذرا، كلمة المرور غير متطابقة، يرجى إعادة إدخال كلمة المرور"
				},
				matchedPassword:{
					"en":"Passwords are matched. you are almost done.",
					"ar":"تتم مطابقة كلمات المرور. لقد شارفت على الانتهاء"
				},
				matchedPasswordHint:{
						"en":"Tick the box below and tap the button below to save your new password",
						"ar":"ضع علامة في المربع أدناه وانقر على الزر أدناه لحفظ كلمة المرور الجديدة"
				}
			}
		}
		function isPasswordMatched(){
			return this.passwordElement.value == this.confirmPasswordElement.value;
		}
		return {
			init:init,
			getMessages:getMessages
		}
	}();
	window.PasswordStrength = passwordStrength;
})();
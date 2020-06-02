
/* JavaScript content from js/com/utils/Utils.js in folder common */
define(["backbone",
        "com/models/Constants",
        "com/utils/DataUtils"
        ], function(Backbone, Constants,DataUtils){

	var Utils = Backbone.Model.extend({},

			{

		LANGUAGE_ALIGN_KEY : "%languageAlign%",
		LANGUAGE_ALIGN_OPPOSITE_KEY : "%!languageAlign%", //align opposite to the selected language alignment
		LANGUAGE_ALIGN_LEFT_CLASS : "languageLTR",
		LANGUAGE_ALIGN_RIGHT_CLASS : "languageRTL",
		IS_DEBUGGING_APP: Constants.IS_DEBUGGING_APP,
		loadHomePage:function (isEntry){
			if(Constants.privacyVN != localStorage.getItem("shellPrivacyVN")|| Constants.termsVN != localStorage.getItem("shellTermsVN")){
				mobile.changePage("shell/splashforupdates.html");
				return;
			}

			var data = DataUtils.getLocalStorageData("showTips", "shell");
			if (data != Constants.TIPS) {
				mobile.changePage("shell/tips.html");
				return;
			}

			data = DataUtils.getLocalStorageData("DashboardTilesOrder", "shell");
			if (data ==null || data == undefined) {
				mobile.changePage("shell/arrange_dashboard_services.html");
				return;
			}

			if(isEntry==true){
				this.loadEntryPage();
			}else {
				mobile.changePage(Constants.HOMEPAGE_URL);
			}
			window.appInitialized=true;
		},
		loadServicePage:function (categoryId){
			var searchText="";
			var timeout= 0;
			if(window.location.hash.indexOf("dashboard.html")!=-1){
				boradSlide.changeIndex(2);
			}else{
				window.DashboardIndex = "2";
				mobile.changePage("shell/dashboard.html", true);
				timeout=1000;
			}
			if (categoryId){
				if(getApplicationLanguage()=='en'){
					searchText = getServiceObjectById(categoryId).CategoryNameEn;
				}else{
					searchText = getServiceObjectById(categoryId).CategoryNameAr;
				}
				document.getElementById("serviceSearchInput").value=searchText||"";

				setTimeout(function (){
					dashboardPageViewInstance.searchServices(searchText);
				},timeout);
			}
		},
		/**
		 * convert currency to a number
		 * @param currency, string
		 * @return value, number
		 */
		convertCurrencyToNumber: function(currency)
		{
			var value = 0;
			var isNegative = currency.indexOf("(") != -1;
			currency = currency.replace("$", "");
			currency = currency.replace(/[(),]/g, "");
			if(!isNaN(currency)){
				value = Number(currency);
			}

			if(isNegative){
				value *= -1;
			}
			return value;
		},


		/**
		 * convert a number to a currency string with $ symbol prefix, thousand place separaters and precision to two decimal places
		 * @param number, Number
		 * @return currency, string
		 */
		convertNumberToCurrency: function(number)
		{
			if(isNaN(number)){
				return "$0.00";
			}

			//round off the number to max two decimal places
			number = Math.round(number * 100) / 100;
			var decimals = number - Math.floor(number);
			number = Math.floor(number);

			var isNegative = number < 0;
			var currency = "$" + String(number).replace(/\-/g, "").split("").reverse().join("").replace(/(.{3}\B)/g, "$1,").split("").reverse().join("");

			if(decimals > 0){
				var temp = String(Math.round(decimals * 100));
				currency += "." + (temp.length == 1 ? "0" : "") + temp;
			}

			if(currency.indexOf(".") == -1) {
				currency += ".00";
			}

			if(isNegative){
				currency = "(" + currency + ")";
			}

			return currency;
		},

		/**
		 * convert meters to miles
		 * @param meters, number
		 * @return miles, number
		 */
		convertMetersToMiles: function(meters)
		{
			var miles = meters * 0.000621371192;
			return miles;
		},

		/**
		 * force a number to be double digits if it's not
		 * @param num
		 * @return numString
		 */
		forceDoubleDigits: function(num)
		{
			var numString = String(num);
			if(numString.length < 2) {
				numString = "0" + numString;
			}
			return numString;
		},

		/**
		 * load a css file by appending it into the head
		 * deprecated, using Modernizr.load instead
		 * @param file, path to the file
		 */
		loadCSSFile: function(file)
		{
			$("head").append("<link>");
			var css = $("head").children(":last");
			css.attr({
				rel:  "stylesheet",
				type: "text/css",
				href: file
			});
		},

		/**
		 * check to see if environment is iOS, iphone+ipad
		 * @param none
		 * @return boolean
		 */
		isiOS: function()
		{

			var isiOS = WL.Client.getEnvironment() == WL.Environment.IPAD || WL.Client.getEnvironment() == WL.Environment.IPHONE;
			return isiOS;
		},

		/**
		 * check to see if environment is android
		 * @param none
		 * @return boolean
		 */
		isAndroid: function()
		{
			var isAndroid = WL.Client.getEnvironment() == WL.Environment.ANDROID;
			return isAndroid;
		},

		/**
		 * convert inches to a feet string
		 * @param length, int
		 * @return lenString, string
		 */
		convertInchesToFeet: function(length)
		{
			var feet = Math.floor(length/12);
			var inches = length - (feet * 12);
			var lenString = feet + "'" + inches + "\"";
			return lenString;
		},

		/**
		 * This function accepts a string as input and return the same string with all the first letter as CAPS
		 */
		makeEveryFirstLetterCapital: function(str)
		{
			if(! isUndefinedOrNullOrBlank(str))
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
			else
				return '';
		},

		/**
		 * find strings and replace with localized strings
		 * @param string, string
		 * @param language, language code string
		 * @return string
		 */
		applyLocalization: function(string)
		{
			var language = getApplicationLanguage();
			//convert language alignment classes
			var culture = Globalize.culture(language);
			var languageAlignMatch = new RegExp(Utils.LANGUAGE_ALIGN_KEY, 'g');
			string = string.replace(languageAlignMatch, (culture.isRTL ? Utils.LANGUAGE_ALIGN_RIGHT_CLASS : Utils.LANGUAGE_ALIGN_LEFT_CLASS));
			var languageAlignOppositeMatch = new RegExp(Utils.LANGUAGE_ALIGN_OPPOSITE_KEY, 'g');
			string = string.replace(languageAlignOppositeMatch, (culture.isRTL ? Utils.LANGUAGE_ALIGN_LEFT_CLASS : Utils.LANGUAGE_ALIGN_RIGHT_CLASS));

			//translate strings
			var matches = string.match(/%[^>](.*?)%/g);
			for(var i in matches)
			{
				var match = matches[i];
				var replacement = Globalize.localize(match, language);
				string = string.replace(match, replacement);
			}
			return string;
		},

		/**
		 * get translation for a key for the currently selected language
		 * @param key, String
		 * @return translation, string
		 */
		getTranslation: function(key)
		{
			var translation = Globalize.localize(key, getApplicationLanguage());
			return translation;
		},

		/**
		 * returns if the screen is a phone based on the screen size
		 * @param none
		 * @return isPhone, boolean
		 */
		isPhone: function() {
			var isPhone = $(window).width() <= Constants.RESOLUTION_PHONE;
			return isPhone;
		},

		//More accurate function to detect environment based on Worklight
		isWebApp: function() {
			var env = WL.Client.getEnvironment();
			if((env == WL.Environment.MOBILE_WEB)
					|| (env == WL.Environment.DESKTOPBROWSER)
					|| (env == WL.Environment.PREVIEW)){
				return false;
			}
			else {
				return false;
			}
		},

		isWebMobileApp: function() {
			var env = WL.Client.getEnvironment();

			// un-comment for mobile web only (I M P O R T A N T)
			// return (env == WL.Environment.MOBILE_WEB || env == WL.Environment.PREVIEW);
			return (env == WL.Environment.MOBILE_WEB);
		},

		isAndroidVersionOrLower: function(version) {
			try {
				var deviceOS = device.platform.toLowerCase();
				var deviceOSVersion = device.version;
				if(deviceOS.indexOf('android') >= 0) {
					return (parseInt(deviceOSVersion, 10) <= version);
				}
			}
			catch(e) {
			}

			return false;
		},

		loadEntryPage: function(){


			mobile.changePage(Constants.HOMEPAGE_URL, {transition:"none", reloadPage: true,changeHash: true, entryPage:true});

		},

		/**
		 * clean up the string that has a plus sign
		 * @param str, string with plus signs instead of spaces
		 * @return str, string with plus signs replaced with spaces
		 */
		replacePlusSigns: function(str) {
			if(str)
				str = str.replace(/[+]/g, " ");
			return str;
		},
		isValidateAlphapetName:function(name)
		{
			var numFlag=/[0-9]/g.test(name);
			var specialCharFlag=/^[a-zA-Z0-9- ]*$/.test(name);

			return !numFlag&&specialCharFlag;
		},
		isValidatePasswordCombination :function(password){
			var validpasswordLength=false;
			if(password.length>=8){validpasswordLength=true;}
			var capitalFlag=/[A-Z]/g.test(password);
			var smallFlag=/[a-z]/g.test(password);
			var	numFlag=/[0-9]/g.test(password);
			var specialCharFlag=/^[a-zA-Z0-9- ]*$/.test(password);
			return (!specialCharFlag)&&capitalFlag&&smallFlag&&numFlag&&validpasswordLength;
		},
		isValidateEmailAddress : function(email){
			var reg =/^[a-zA-Z0-9\_\-\']+(\.[a-zA-Z0-9\_\-\']+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$/; // using reg like backend
			return reg.test(email);
		},
		isValidateSelectOption : function(value){
			if (value== "pleaseselect")
				return false;
			else
				return true;
		},
		validTextareaMinLength: function(value , minLength){
			if(value.length <minLength)
				return false;
			else
				return true;
		},
		getAppThemeColor:function(){
			var themeColor='';
			var appID = Constants.APP_ID ;
			switch(appID) {
			case "RTA_Public_Transport":
				themeColor = "#00006A";
				break;
			case "RTA_Corporate_Services":
				themeColor = "#EF3D42";
				break;
			case "RTA_Drivers_And_Vehicles":
				themeColor ="crimson";
				break;
			case "Smart_Dubai_Parking":
				themeColor ="#F78E1E";
				break;
			}

			return themeColor;
		},
		getCurrentPlatform:function (){
			var platform="WINDOWS";
			if(this.isAndroid()){
				platform="ANDROID";
			}else if (this.isiOS()){
				platform="iOS";
			}
			return platform;
		},
		getAppNameForHappinessMeter : function(appid) {
			var appName='';
			switch(appid) {
			case "RTA_Public_Transport":
				appName = "Public Transport";
				break;
			case "RTA_Corporate_Services":
				appName ="Corporate Services";
				break;
			case "RTA_Drivers_And_Vehicles":
				appName = "Dubai Drive";
				break;
			case "Smart_Dubai_Parking":
				appName = "Smart Parking";
				break;
			}
			return appName;
		},
		getAppName : function(appid) {

//			"RTA_Public_Transport"
//			"Wojhati"
//			"Smart_Taxi"
//			"RTA_Corporate_Services"
//			"RTA_Drivers_And_Vehicles"
//			"Smart_Dubai_Parking"

			var appName = "";
			switch(appid) {
			case "RTA_Public_Transport":
				appName = Globalize.localize("%shell.homepage.AppName.PublicTransport%", getApplicationLanguage());
				break;
			case "Wojhati":
				appName = Globalize.localize("%shell.homepage.AppName.Wojhati%", getApplicationLanguage());
				break;
			case "Smart_Taxi":
				appName = Globalize.localize("%shell.homepage.AppName.Taxi%", getApplicationLanguage());
				break;
			case "RTA_Corporate_Services":
				appName = Globalize.localize("%shell.homepage.AppName.Corporate%", getApplicationLanguage());
				break;
			case "RTA_Drivers_And_Vehicles":
				appName = Globalize.localize("%shell.homepage.AppName.DriversAndVehicles%", getApplicationLanguage());
				break;
			case "Smart_Dubai_Parking":
				appName = Globalize.localize("%shell.homepage.AppName.Parking%", getApplicationLanguage());
				break;
			}

			return appName;
		},
		getAppStoreUAEPass:function(){
			if(this.isAndroid()){
				return "https://play.google.com/store/apps/details?id=ae.uaepass.mainapp";
			}
			return "https://itunes.apple.com/ae/app/uae-pass/id1377158818?mt=8";
		},
		getAppStoreLink : function (){
			var appID = Constants.APP_ID ;
			var link = "";
			if(this.isAndroid()){
				switch(appID) {
				case "RTA_Public_Transport":
					link = "https://play.google.com/store/apps/details?id=com.rta.publictransportation";
					break;
				case "RTA_Corporate_Services":
					link = "https://play.google.com/store/apps/details?id=com.rta.corporates";
					break;
				case "RTA_Drivers_And_Vehicles":
					link = "https://play.google.com/store/apps/details?id=com.rta.driversandvehicles";
					break;
				case "Smart_Dubai_Parking":
					link = "https://play.google.com/store/apps/details?id=com.rta.smartparking";
					break;
				}
			}else if (this.isiOS()){
				switch(appID) {
				case "RTA_Public_Transport":
					link = "https://itunes.apple.com/gb/app/rta-public-transport/id913050130?m";
					break;
				case "RTA_Corporate_Services":
					link = "https://itunes.apple.com/gb/app/rta-corporate-services/id912419810?mt=8";
					break;
				case "RTA_Drivers_And_Vehicles":
					link = "https://itunes.apple.com/gb/app/rta-drivers-and-vehicles/id912748782?mt=8";
					break;
				case "Smart_Dubai_Parking":
					link = "https://itunes.apple.com/gb/app/rta-smart-parking/id913460611?mt=8";
					break;
				}
			}
			return link;
		},
		getWelcomeAppName : function(appid) {

//			"RTA_Public_Transport"
//			"Wojhati"
//			"Smart_Taxi"
//			"RTA_Corporate_Services"
//			"RTA_Drivers_And_Vehicles"
//			"Smart_Dubai_Parking"

			var appName = "";
			switch(appid) {
			case "RTA_Public_Transport":
				appName = Globalize.localize("%shell.welcomepage.AppName.RTA_Public_Transport%", getApplicationLanguage());
				break;
			case "Wojhati":
				appName = Globalize.localize("%shell.welcomepage.AppName.Wojhati%", getApplicationLanguage());
				break;
			case "Smart_Taxi":
				appName = Globalize.localize("%shell.welcomepage.AppName.Smart_Taxi%", getApplicationLanguage());
				break;
			case "RTA_Corporate_Services":
				appName = Globalize.localize("%shell.welcomepage.AppName.RTA_Corporate_Services%", getApplicationLanguage());
				break;
			case "RTA_Drivers_And_Vehicles":
				appName = Globalize.localize("%shell.welcomepage.AppName.RTA_Drivers_And_Vehicles%", getApplicationLanguage());
				break;
			case "Smart_Dubai_Parking":
				appName = Globalize.localize("%shell.welcomepage.AppName.Smart_Dubai_Parking%", getApplicationLanguage());
				break;
			}

			return appName;
		},
		loadMyAccountPage:function ()
		{
			if (Constants.APP_ID == 'RTA_Drivers_And_Vehicles') {
				mobile.changePage("shell/myaccount.html");
			} else if (Constants.APP_ID == 'RTA_Corporate_Services') {
				mobile.changePage("shell/myAccountCorporate.html");
			}
		},

		convertStringToDate:function(_date,_format,_delimiter)
		{
			var formatedDate;
			if(_date&&_format&&_delimiter)
			{
				var formatLowerCase=_format.toLowerCase();
				var formatItems=formatLowerCase.split(_delimiter);
				var dateItems=_date.split(_delimiter);
				var monthIndex=formatItems.indexOf("mm");
				var dayIndex=formatItems.indexOf("dd");
				var yearIndex=formatItems.indexOf("yyyy");
				var month=parseInt(dateItems[monthIndex]);
				month-=1;
				formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
			}
			return formatedDate;

		},
		daysBetween:function (first, second) {

		    // Copy date parts of the timestamps, discarding the time parts.
		    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
		    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

		    // Do the math.
		    var millisecondsPerDay = 1000 * 60 * 60 * 24;
		    var millisBetween = two.getTime() - one.getTime();
		    var days = millisBetween / millisecondsPerDay;

		    // Round down.
		    return Math.floor(days);
		},


		 showConnectionPopup:function (letsButtonAction){
			try{
				var self=this;
				$(".ui-loader").hide();
				var connenctionErrorElement= document.getElementById("connenctionErrorElement");
				connenctionErrorElement.style.display="block";

				document.querySelector("#connenctionErrorElement .errorHeader").innerText=localize("%shell.ErrorConection.OPS%");
				document.querySelector("#connenctionErrorElement .errorDescript").innerText=localize("%shell.ErrorConection.UnExpectedProblem%");
				document.querySelector("#connenctionErrorElement #LetsTryBtn").innerText=localize("%shell.ErrorConection.TryAgain%");

				document.getElementById("closeErrorConnection").onclick = function(event){
					event.preventDefault();
					document.getElementById("connenctionErrorElement").style.display="none";
				}
				document.getElementById("LetsTryBtn").onclick= function(event){
					event.preventDefault();
					//event.stopPropagation();

						$(".ui-loader").show();
						setTimeout(function(){
							self.letsTryAgain( letsButtonAction);
						},1000)
				};

			}
			catch(e){
				$(".ui-loader").hide();
				document.getElementById("connenctionErrorElement").style.display="none";
				return;
			}
		},
		letsTryAgain:function (callBack){
			document.getElementById("connenctionErrorElement").style.display="none";
			if (callBack)callBack();
		}

			});
	window.Utils = Utils;
	return Utils;

});

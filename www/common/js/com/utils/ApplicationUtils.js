var currentYear = new Date().getFullYear();
var encryptionKey = "nIeCtrYBr3cKINg";
var encryptionPassword = "nIeCtrYBr3cKINg";
var encryptionStrength = 128;
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) == str;
	};
}
if ( !String.prototype.contains ) {
	String.prototype.contains = function() {
		return String.prototype.indexOf.apply( this, arguments ) !== -1;
	};
}
if ( !String.prototype.reverse ) {
	String.prototype.reverse = function(str) {
		if(isUndefinedOrNullOrBlank(str))
			return this.split("").reverse().join("");
		else{
			var arr = this.split(str);
			arr.reverse();
			return arr.join(str);
		}
	};
}




var activateCheckbox= function (el){
	el.parentElement.getElementsByClassName('shell-lever')[0].classList.add('shell-lever-active')
	el.checked=true;
}
var deactivateCheckbox = function (el){
	el.parentElement.getElementsByClassName('shell-lever')[0].classList.remove('shell-lever-active')
	el.checked=false;
}
function UserException(message) {
	this.message = message;
	this.name = 'UserException';
}

function servicesCount (isVIP){
	var count =0;

	for(var i =0 ; i< ServiceCategories.length ;i++){
		if(ServiceCategories[i].CategoryServices != undefined && ServiceCategories[i].CategoryServices.length>0)
		{
			
			count+=ServiceCategories[i].CategoryServices.length;
		}

	}
	// skip count vip 
	var Constants = require("com/models/Constants");
	if((Constants&&Constants.APP_ID=="RTA_Drivers_And_Vehicles")&&(!isVIP||isVIP==false)){
		count=count-1;
	}
	return count;
}


function handleLinkingForServiceCategory(serviceCategory,isLinked){
	try{
		for(var i =0 ; i< ServiceCategories.length ;i++){
			if(ServiceCategories[i].CategoryServices != undefined && ServiceCategories[i].CategoryServices.length>0 &&  ServiceCategories[i].CategoryId== serviceCategory) {
				for(var j =0 ; j< ServiceCategories[i].CategoryServices.length ;j++){
					var requireLinking =ServiceCategories[i].CategoryServices[j].requireLinking;
					if (!isUndefinedOrNullOrBlank(requireLinking)||  requireLinking==false){
						ServiceCategories[i].CategoryServices[j].requireLinking=isLinked;
					}
				}
			}
		}	
	}catch(e){}
}
function convertMS(ms) {
	var d, h, m, s;
	s = Math.floor(ms / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;
	return { d: d, h: h, m: m, s: s };
};

function disableScroll(){
	$(".sliderCont").css("overflow-x", "hidden");
	$("div[data-role=content]").css("overflow", "hidden");
	$("div[data-role=page]").css("overflow", "hidden");
	$("#staticContent").css("overflow", "hidden");
	$(".staticContent").css("overflow", "hidden");
}
function enableScroll(){
	$("div[data-role=content]").css("overflow", "");
	$("div[data-role=page]").css("overflow", "");

	$(".sliderCont").css("overflow-x", "");
	$("#staticContent").css("overflow", "");
	$(".staticContent").css("overflow", "");
}
function getAndroidVersion(ua) {
	ua = (ua || navigator.userAgent).toLowerCase();
	var match = ua.match(/android\s([0-9\.]*)/);
	return match ? match[1] : false;
};
function getEditDistance(a, b){
	if(a.length == 0) return b.length;
	if(b.length == 0) return a.length;

	var matrix = [];

	// increment along the first column of each row
	var i;
	for(i = 0; i <= b.length; i++){
		matrix[i] = [i];
	}

	// increment each column in the first row
	var j;
	for(j = 0; j <= a.length; j++){
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for(i = 1; i <= b.length; i++){
		for(j = 1; j <= a.length; j++){
			if(b.charAt(i-1) == a.charAt(j-1)){
				matrix[i][j] = matrix[i-1][j-1];
			} else {
				matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
						Math.min(matrix[i][j-1] + 1, // insertion
								matrix[i-1][j] + 1)); // deletion
			}
		}
	}

	return matrix[b.length][a.length];
};
function isUndefined(v)
{
	if(typeof v == 'undefined' ||  v == undefined || v == "undefined")
		result = true;
	else
		result = false;
	return result;
}

function isUndefinedOrNull(v)
{
	if(typeof v == 'undefined' ||  v == undefined || v == null || v == "undefined")
		result = true;
	else
		result = false;
	return result;
}

function isUndefinedOrBlank(v)
{
	if( typeof v == 'undefined' || v == undefined || v == "undefined" || v == "")
		result = true;
	else
		result = false;
	return result;
}

function isUndefinedOrNullOrBlank(v)
{
	if(typeof v == 'undefined' || v == undefined || v == "undefined" || v == null || v == "")
		result = true;
	else
		result = false;
	return result;
}

function SortArray(Array,SortAttr)
{
	Array.sort(function (Obj1, Obj2) {
		if (Obj1[SortAttr] > Obj2[SortAttr])
			return 1;
		else if (Obj1[SortAttr] < Obj2[SortAttr])
			return -1;
		else
			return 0;
	});
	return Array;
}

//this function to sort array of objects have property for date in this format >> "DD/MM/YYYY":
function sortArrayofDates(Array,SortAttr)
{
	Array.sort(function (Obj1, Obj2) {
		var date_1 = Obj1[SortAttr].split('/').reverse().join(),
		date_2 = Obj2[SortAttr].split('/').reverse().join();
		return date_1 < date_2 ? -1 : (date_1 > date_2 ? 1 : 0);
	});
	return Array;
}
function convertStringToDate(dateString)
{
	var year  = dateString.substring(6,10);
	var month = dateString.substring(3,5);
	var day  = dateString.substring(0,2);
	return new Date(month+"/"+day+"/"+year);
}
function convertToStandardDateFormat(dateString)
{
	return dateString.replace("/","-").replace("/","-").replace( /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1") + "T00:00:00.000Z";
}

function daysBetween(date1, date2) {
	// The number of milliseconds in one day
	var ONE_DAY = 1000 * 60 * 60 * 24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date1_ms - date2_ms;

	// Convert back to days and return
	var days = difference_ms / ONE_DAY;
	days = days.toFixed(2);
	return days;

}
function daysBetweenActual(date1, date2) {

	// The number of milliseconds in one day
	var ONE_DAY = 1000 * 60 * 60 * 24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date1_ms - date2_ms;

	// Convert back to days and return
	var days = Math.round(difference_ms / ONE_DAY);
	return days;

}
function showPopupDialog (popupID ,callBack, closePopupBtnID,popupCloseEvent) {
	try {
		try
		{
			$('#'+popupID).popup();
			//$('#'+popupID).popup("open");
			try{
				$('#'+popupID).popup("open");
				//$('#content').css('overflow','hidden');
			}
			catch(e){
				$('#'+popupID).popup();
				$('#'+popupID).popup("open");
				//$('#content').css('overflow','hidden');
			}
			/*$( "#"+popupID ).on( "popupbeforeposition", function( e, data ) {
				  delete data.x;
				  delete data.y;
				  data.positionTo = "window";
				});*/
			/*setTimeout(function(e){
				$('#content').css('overflow','hidden');
				$('#'+popupID).popup('reposition',{positionTo:'window'})
			},500);*/
			if(isUndefinedOrNullOrBlank(closePopupBtnID)){
				closePopupBtnID = "errorPopupBtn";
			}
			if($('#'+popupID+" #"+closePopupBtnID).length != 0 ){
				if (popupCloseEvent!=undefined)
				{
					$('#'+popupID).on("tap", "#"+closePopupBtnID,closeErrorPopUp);
					function closeErrorPopUp(event){
						event.preventDefault();
						$('#'+popupID).popup("close");
						popupCloseEvent();
					}
				}
				else
				{
					// Default Close Event
					$('#'+popupID).on("tap", "#"+closePopupBtnID,
							function (event) {
						event.preventDefault();
						$('#'+popupID).popup("close");
					});
				}
			}
			if(callBack)
				callBack();
		}
		catch(e)
		{
			// WL.Logger.error (e);
			showPopup ( message,OnClose);

		}
	}
	catch(ex)
	{
		// WL.Logger.error (ex);
	}
}
function _AllowOnlyNumberInputs(_Instance, inputText){
	_Instance.$el.on("keydown", inputText, function(event) {
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9
				|| event.keyCode == 27 || event.keyCode == 13
				|| (event.keyCode == 65 && event.ctrlKey === true)
				|| (event.keyCode >= 35 && event.keyCode <= 39)){
			return;
		}else {
			// If it's not a number stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault();
			}
		}
	});
}
function ConvertDateStringToDateObj(Date, SplitChar, Format) {
	//Must Format be Full Format As "dd-mm-yyyy"
	try {
		var DayIndex, MonthIndex, YearIndex;
		if (Format == undefined) {
			Format = "dd/mm/yy";
		}
		if (IsVaildFormatString(Format)) {

			var SplitFormat = Format.split(SplitChar);
			for (var i = 0; i < SplitFormat.length; i++) {
				if (SplitFormat[i] == "dd") {
					DayIndex = i;
				}
				else if (SplitFormat[i] == "mm") {
					MonthIndex = i;
				}
				else if (SplitFormat[i] == "yyyy") {
					YearIndex = i;
				}
			}
			var DateArr = Date.split(SplitChar);
			var DateObj = { Years: DateArr[YearIndex], Months: DateArr[MonthIndex], Days: DateArr[DayIndex] };
			//   DateObj = CorrectCultureOfDate(DateObj);
			return DateObj;
		}

	} catch (e) {
		// WL.Logger.debug("ConvertDateStringToDateObj" + e);
	}
}
function IsVaildFormatString(Format) {
	if (Format.indexOf('mm') < 0 || Format.indexOf('dd') < 0 || Format.indexOf('yyyy') < 0) {
		return false;
	}
	else {
		return true;
	}
}
function ChangeDateFormat (Date,ToFormat,FromFormat,SplitChar){
	//Set Default Format
	if (ToFormat == undefined) {
		ToFormat = "mm/dd/yy";
	}
	if (SplitChar == undefined) {
		SplitChar =  '/';
	}


	if (servicesConstantsModel.systemLanguage.getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ARABIC_LANGUAGE ){
		if (FromFormat == undefined) {
			FromFormat = "yyyy/mm/dd";
		}
	}
	else{
		if (FromFormat == undefined) {
			FromFormat = "dd/mm/yyyy";
		}
	}

	var DateObj=ConvertDateStringToDateObj(Date, SplitChar,FromFormat);
	var Result =ToFormat.replace('dd',DateObj['Days']).replace('mm',DateObj['Months']).replace('yy',DateObj['Years']);
	return Result;
}
function formatDateToDDMMYYYY(inputFormat) {
	function pad(s) { return (s < 10) ? '0' + s : s; }

	if(inputFormat == null || inputFormat == ""){
		return "";
	}
	var year  = inputFormat.substring(6,10);
	var month = inputFormat.substring(3,5);
	var day  = inputFormat.substring(0,2);
	if(inputFormat.indexOf("-") == 4 || inputFormat.indexOf("/") == 4){
		year  = inputFormat.substring(0,4);
		month = inputFormat.substring(5,7);
		day  = inputFormat.substring(8,10);
	}
	var formatted = inputFormat;
	if(getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ARABIC_LANGUAGE){
		formatted = [year, month, day].join('/');
	}else if(getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ENGLISH_LANGUAGE){
		formatted = [day, month, year].join('/');
	}
	// check for local
	return formatted;
}

function formatDateToddDDMMYYYY(inputFormat) {
	function pad(s) { return (s < 10) ? '0' + s : s; }
	var d = new Date(inputFormat);
	var year  = d.getFullYear();
	var month = pad(d.getMonth()+1);
	var day  = pad(d.getDate());

	var formatted = inputFormat;
	if(getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ARABIC_LANGUAGE){
		var weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

		var weekday = weekdays[d.getDay()];
		formatted = [year, month, day].join('/');
		formatted = weekday + ' ' + formatted;
	}else if(getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ENGLISH_LANGUAGE){

		var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		var weekday = weekdays[d.getDay()];
		formatted = [day, month, year].join('/');
		formatted = weekday + ' ' +formatted;
	}
	// check for local
	return formatted;
}

function HandleTimeSpamAccourdingToLanguage (Time){
	if(getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ENGLISH_LANGUAGE){
		Time=Time.replace('م','pm')
		.replace('م','PM')
		.replace('ص','am')
		.replace('ص','AM');
	}else {
		Time=Time.replace('pm','م')
		.replace('am','ص')
		.replace('PM','م')
		.replace('AM','ص');
	}
	return Time;
}
function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}
function getDateAndTimeFromDateTime(dateTime){
	var dateAndTime = {};
	var splitter = " ";
	if(!isUndefinedOrNullOrBlank(dateTime)){
		if(dateTime.contains("T")){
			splitter = "T";
		}
		dateAndTime["date"] = dateTime.split(splitter)[0];
		dateAndTime["time"] = dateTime.split(splitter)[1].replace("Z","");
	}
	return dateAndTime ;
}

/**
 * This function is used to override the $.get method,
 * we had to do this because of the windows phone can't
 * load relative paths,
 *
 *
 * @returns
 */
function loadPopupTemplate(TemplateUtils,templateInstance,popupName ,parameters,contentID){
	var onTemplate = function(html,templateContent){
		var template = html ;
		templateInstance.template[popupName] = templateContent;
	}
	try{
		TemplateUtils.getTemplate("popups/"+popupName, parameters, onTemplate);
	}catch(e){

	}
};
/****template Instance = page instance
 * path = folderof template/templatename .
 * parameters = template parameters.
 * drawObject = container ID , list id
 * hideBusyInd = true if you need to hide busy Ind
 *  ****/
function loadTemplate(TemplateUtils,templateInstance,path,parameters,drawObject,hideBusyInd,callBack){
	var onTemplate = function(html,templateContent){
		var template = html ;
		var templateName = path.substr(path.lastIndexOf("/")+1);
		templateInstance.template[templateName] = templateContent;
		if(!isUndefinedOrNullOrBlank(drawObject) && !isEmptyObject(drawObject) &&!isUndefinedOrNullOrBlank(drawObject.containerID)){
			$("#"+drawObject.containerID).append(template);
			$("#"+drawObject.listID).listview().listview('refresh');
			/*$("#"+drawObject.listID+" img" ).each(function(e) {
			    $(this).attr('src', $(this).attr('src'));
				  });  */
		}
		if(! isUndefinedOrNullOrBlank(hideBusyInd) && hideBusyInd){
			$(".ui-loader").hide();
		}
		if(_.isFunction(callBack))
			callBack();
	}
	try{
		TemplateUtils.getTemplate(path, parameters, onTemplate);
	}catch(e){

	}
};



function loadStaticTemplate(TemplateUtils,templateInstance,path,callBack){
	var onTemplate = function(templateContent){
		var templateName = path.substr(path.lastIndexOf("/")+1);
		templateInstance.template[templateName] = templateContent;

		if(_.isFunction(callBack))
			callBack();
	}
	try{
		TemplateUtils.getStaticTemp(path, onTemplate);
	}catch(e){
		console.log(e)
	}
};

function isEmptyObject(obj){
	return _.isEmpty(obj);
}
function renderPopupTemplate(templateHTML,templateContainerID,popupDialogOptions,callBack , dataJson){
	try{
		var templateObject  = buildTemplateObject(popupDialogOptions.type,dataJson);
		if(templateContainerID == "customPopupContainer"){
			//require (["../../../js/com/utils/TemplateUtils"],function(TemplateUtils){
			var html = window.myNamespace.TemplateUtils.bindPopupTemplateData(templateHTML,templateContainerID,templateObject);
			templateObject = null;
			getTemplate(html);
			//});
		} else{
			getTemplate(templateHTML);
		}
		function getTemplate(templateHTML,type){
			html = applyHTMLLocalization(templateHTML,getApplicationLanguage());
			if(! isUndefinedOrNullOrBlank(templateObject)){
				$.each(templateObject, function(k, v) {
					if(html.indexOf(k) != -1)
						html =  html.replace("{{"+ k +"}}",v);
				});
				if(isUndefinedOrNullOrBlank($("#content").has("#"+templateContainerID)) || $("#content").has("#"+templateContainerID).length == 0){
					$("[data-role='content']").append(html);
				}
				else{
					try{
						$('[data-role="popup"]').popup( "destroy");
					}catch(e){

					}
					$("#"+templateContainerID).replaceWith(html);
				}
			}
			if(! isUndefinedOrNullOrBlank(popupDialogOptions)){
				setTimeout(function(e){
					showPopupDialog(popupDialogOptions.popupID, callBack , popupDialogOptions.closePopupBtnID, popupDialogOptions.popupCloseEvent);
				},230);
			}
		}
	}catch(e){
		console.log(e);
	}
}
function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};
function applyHTMLLocalization(string, language)
{
	//convert language alignment classes
	var culture = Globalize.culture(language);
	var languageAlignMatch = new RegExp('%languageAlign%', 'g');
	string = string.replace(languageAlignMatch, (culture.isRTL ? 'languageRTL' : 'languageLTR'));
	var languageAlignOppositeMatch = new RegExp('%!languageAlign%', 'g');
	string = string.replace(languageAlignOppositeMatch, (culture.isRTL ? 'languageLTR' : 'languageRTL'));

	//translate strings
	var matches = string.match(/%[^>](.*?)%/g);
	for(var i in matches)
	{
		var match = matches[i];
		var replacement = Globalize.localize(match, language);
		string = string.replace(match, replacement);
	}
	return string;
}
function buildTemplateObject(templateName , params){
	var tempObj = {};
	tempObj["title"] = localize("%shell.popup.error.title%");
	tempObj["message"] = localize("%shell.popup.error.default.applicationError%");
	tempObj["closeText"] = localize("%shell.dialog.button.ok%");
	if(templateName == "commingSoon"){
		tempObj["title"] = localize("%shell.popup.soon.title%");
		tempObj["message"] = localize("%shell.popup.soon.message%");
	}
	else if(templateName == "loginRegister"){
		tempObj["title"] = localize("%shell.sidepanel.loginOrRegisterTitle%");
		tempObj["message"] = localize("%shell.sidepanel.loginOrRegisterMsg%");
		tempObj["primaryButtons"] = [
		                             {
		                            	 id : "registerBtn",
		                            	 text : "%shell.login.registerAccount%",
		                             },
		                             {
		                            	 id : "loginBtn",
		                            	 text : "%shell.login.loginAccount%",
		                             }
		                             ];
	}else if(templateName == "loginLogout"){
		tempObj["title"] = localize("%shell.logout.link%");
		tempObj["message"] = localize("%shell.sidepanel.logoutMsg%");
		tempObj ["primaryButtons"] = [
		                              {
		                            	  id : "logoutBtn",
		                            	  text : "%shell.option.yes%",
		                              }
		                              ];
		tempObj ["secondaryButtons"] = [
		                                {
		                                	id : "cancelBtn",
		                                	text : "%shell.option.no%",
		                                }
		                                ];
	}
	else if(templateName == "emailCall"){
		tempObj ["primaryButtons"] = [
		                              {
		                            	  id : "emailBtn",
		                            	  text : "%shell.mchat.email%",
		                              },
		                              {
		                            	  id : "callBtn",
		                            	  text : "%shell.mchat.call%",
		                              }
		                              ];
	}
	else if (templateName == "cancelAction"){
		tempObj ["primaryButtons"] = [
		                              {
		                            	  id : params.primaryButtons.id,
		                            	  text : params.primaryButtons.text,
		                              }];
		tempObj ["secondaryButtons"] = [
		                                {
		                                	id : "cancelBtn",
		                                	text : "%shell.mstore.alert.cancel%",
		                                }
		                                ];

	}else if (templateName == "yesNo"){
		tempObj ["primaryButtons"] = [
		                              {
		                            	  id : "yesBtn",
		                            	  text : "%shell.option.yes%",
		                              }];
		tempObj ["secondaryButtons"] = [
		                                {
		                                	id : "noBtn",
		                                	text : "%shell.option.no%",
		                                }
		                                ];

	}
	else if (templateName == "linkRegister"){
		tempObj["title"] = localize("%shell.login.linkRegister.title%");
		tempObj ["primaryButtons"] = [
		                              {
		                            	  id : "linkBtn",
		                            	  text : "%shell.login.linkAccount%",
		                              },
		                              {
		                            	  id : "registerBtn",
		                            	  text : "%shell.login.registerAccount%",
		                              }];

	}
	else if(templateName != 'error'){
		tempObj = params ;
	}
	if(! isUndefinedOrNullOrBlank(params)){
		if(!isUndefinedOrNullOrBlank(params.title))
			tempObj.title = params.title;
		if(!isUndefinedOrNullOrBlank(params.message))
			tempObj.message = params.message;
		if(!isUndefinedOrNullOrBlank(params.customContent))
			tempObj.customContent = params.customContent;
		if(!isUndefinedOrNullOrBlank(params.closeText))
			tempObj.customContent = params.closeText;
	}
	return tempObj;
}
//function getCurrentDate()
//{
//if(isUndefinedOrNullOrBlank(currentDate))
//currentDate = new Date();

//return new Date(currentDate);
//}
//function getCurrentYear()
//{
//if(isUndefinedOrNullOrBlank(currentYear))
//currentDate = new Date().getFullYear();

//return currentYear;
//}
function getEncryptionPassword()
{
	return encryptionPassword;
}

function getEncryptionStrength()
{
	return encryptionStrength;
}
function getDateFromString (dateString){
	if(dateString.contains("/")){
		dateString = dateString.replace("/","-").replace("/","-");
	}
	var day  = dateString.substring(0,2);
	var month = dateString.substring(3,5);
	var year  = dateString.substring(6,10);
	return new Date(year+"-"+month+"-"+day);
}
function convertObiectToArray(Object){
	if (!isUndefinedOrNull(Object) && !(Object instanceof Array)) {
		return [Object];
	}
	return Object;
}
function  getNumbersFromString(text){
	var numbers = text.match(/\d/g);
	numbers = numbers.join("");
	return numbers
}
function invokeWebserviceRequest(invocationData, invocationContext, timeout, successCallback, failureCallBack, isBypassEncryption, trialNo)
{
	if(invocationData.parameters == undefined || invocationData.parameters == null)
		invocationData.parameters = [];
	if(!isEnforceNoEncryption && isEncryptWebservices && (isBypassEncryption == undefined || isBypassEncryption == false))
	{
		var index = invocationData.adapter + "|" + invocationData.procedure;
		var numOfParameters = adapterProceduresNumberOfParameters[index];
		if(numOfParameters != undefined)
		{
			var numberOfMissingParameters = numOfParameters - invocationData.parameters.length;
			for(var i = 0; i < numberOfMissingParameters; i++)
				invocationData.parameters.push(null);
		}
		invocationData.parameters.push(true);
		invocationData.parameters.push(encryptionPassword);
	}
	try
	{
		WL.Client.invokeProcedure(invocationData, {
			onSuccess : function(result)
			{
				if(!isEnforceNoEncryption && isEncryptWebservices && (isBypassEncryption == undefined || isBypassEncryption == false))
				{
					var response = result;
					var encryptedResponseString = result.invocationResult.cypherText;
					var decryptedResponse = decryptData(encryptedResponseString);
					response = JSON.parse(decryptedResponse.cypherText);
					result.invocationResult = response;
				}

				successCallback(result);
			},
			onFailure : function(error)
			{
				setTimeout(	function()
						{
					if(trialNo == undefined)
						trialNo = 0;
					trialNo++;
					if(trialNo <= numOfInvocationTrials)
						invokeWebservice(invocationData, invocationContext, timeout, successCallback, failureCallBack, isBypassEncryption, trialNo);
					else
						failureCallBack(error);
						}, 5000);
			},
			invocationContext : invocationContext,
			timeout : timeout
		});
	}
	catch(ex)
	{
		setTimeout(	function()
				{
			if(trialNo == undefined)
				trialNo = 0;
			trialNo++;
			if(trialNo <= numOfInvocationTrials)
				invokeWebservice(invocationData, invocationContext, timeout, successCallback, failureCallBack, isBypassEncryption, trialNo);
			else
				failureCallBack();
				}, 5000);
	}
}


//invoke procedure v8
function invokeWLResourceRequest(invocationData,successCallback,failureCallBack , trialNo)
{
	// get from invocatioData ( invocationContext, timeout)
	try
	{
		//validate mandatory Parms
		if(invocationData && typeof successCallback == "function" && typeof failureCallBack == "function" ){
			// read data from invocation Data	
			var adapterName=invocationData.adapter;
			var procedureName=invocationData.procedure;
			var parameters =invocationData.parameters;
			var invocationContext=invocationData.invocationContext?invocationData.invocationContext:null;
			var timeout=invocationData.timeout?invocationData.timeout:null;
			var method=invocationData.method?invocationData.method:"GET";
			var scope=invocationData.scope?invocationData.scope:null;
			// for testing oonly 
			//var WLResourceRequest={};


			var options={
					timeout:timeout,
					scope :scope};
			var url="/adapters/"+adapterName+"/"+procedureName;
			//TODO WLResourceRequest.GET  check is enum 
			var request = new WLResourceRequest(url, WLResourceRequest.GET,options);

			request.setQueryParameter('params',parameters );
			request.send().then(
					function(response) {
						// success flow, the result can be found in response.responseJSON
						successCallback(response);
					},
					function(response) {
						failureCallBack(response);
						// failure flow
						/*setTimeout(	function()
							{
						if(trialNo == undefined)
							trialNo = 0;
						trialNo++;
						if(trialNo <= numOfInvocationTrials)
							invokeWLResourceRequest(invocationData, successCallback, failureCallBack, trialNo);
						else
							failureCallBack(error);
							}, 5000);*/
					}
			);

		}

	}
	catch(ex)
	{
		console.log(ex);
		/*setTimeout(	function()
				{
			if(trialNo == undefined)
				trialNo = 0;
			trialNo++;
			if(trialNo <= numOfInvocationTrials)
				invokeWLResourceRequest(invocationData, successCallback, failureCallBack, trialNo);
			else
				failureCallBack();
				}, 5000);*/
	}
}





function localize(key){
	if (isUndefinedOrNullOrBlank(key))
		return '';
	else if(key.contains('%')){
		return Globalize.localize(key,getApplicationLanguage());
	}
	else{
		return key;
	}
}
function getParameters(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(isUndefinedOrNullOrBlank(results)){
		return null;
	}
	var returned = results[1];
	if(results[1].contains("|")){
		returned = results[1].split("|")[0];
	}
	return returned;
}
function backToHome (){
	try{
		mobile.changePage("shell/home.html");
	}catch(e){}
}

/**
 * This function is used to convert time stamp to date string
 * @param time stamp
 */
function convertTimeStampToDateString(timeStamp){
	var date = convertTimeStampToDateTime(timeStamp);
	var assignedDate = "";
	if (servicesConstantsModel.systemLanguage.getApplicationLanguage() == servicesConstantsModel.constants.SETTINGS_ARABIC_LANGUAGE ){
		assignedDate += date.getFullYear() + "/" + (date.getMonth()+1)+ "/" +date.getDate();
	}else {
		assignedDate += date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
	}
	return assignedDate ;
}
/**
 * This function is used to convert time stamp to date time
 * @param time stamp
 */
function convertTimeStampToDateTime(timeStamp){
	var date = new Date();
	date.setTime(timeStamp);
	return date ;
}
/**
 * This function is used to log the error
 * @param e
 */
function logError(e) {
	// WL.Logger.error(e);
}

/**
 * This function is used to log the debug messages
 * @param debugString
 */
function logDebug(debugString) {
	// WL.Logger.debug(debugString);
}

/**
 * This function is used to log the debug messages
 * @param warnString
 */
function logWarn(warnString) {
	WL.Logger.warn(warnString);
}


function  getApplicationLanguage(){
	if (isUndefinedOrNullOrBlank(localStorage.getItem('language'))){
		return "en";
	}
	else
		return localStorage.getItem('language');
}
function getInnerObjectsElement(array){
	if(! isUndefinedOrNullOrBlank(array)){
		var returnedArray = [];
		for(var i = 0 ; i< array.length; i ++){
			var returnedObject = {};
			returnedObject["text"] =  array[i][getApplicationLanguage()];
			returnedObject["id"] = array[i]["id"];
			returnedArray.push(returnedObject);
		}
		return returnedArray;
	}
	return null;
}
function getInnerObjectsKeysElement(array){
	var returnedArray = [];
	for(var i = 0 ; i< array.length; i ++){
		var returnedObject = {};
		var arrayElement = array[i];
		for (var key in arrayElement) {
			if (arrayElement.hasOwnProperty(key)){
				if(countJsonKeys(arrayElement[key]) == 1){
					returnedObject[key]=arrayElement[key];
				}
				else{
					returnedObject[key] = arrayElement[key][getApplicationLanguage()];
				}
			}
		}
		returnedArray.push(returnedObject);
	}
	return returnedArray;
}
function checkObjectFound(obj){
	if(isUndefinedOrNullOrBlank(obj)){
		return "";
	}
	else{
		return obj;
	}
}
function countJsonKeys(obj) {
	var count=0;
	for(var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			++count;
		}
	}
	return count;
}
function sortNumber(a,b) {
	return a - b;
}
function SearchKeyArrayValue (array,key,value){
	for(var i =0 ; i<array.length ; i++){
		if(array[i][key]==value){
			return true;
		}
	}
	return false;
}
function returnKeyArrayElement (array,key,value){
	for(var i =0 ; i<array.length ; i++){
		if(array[i][key]== value){
			return array[i];
		}
	}
	return null;
}


function returnArrayElement (array,value){
	for(var i =0 ; i<array.length ; i++){
		if(array[i].contains(value)){
			return array[i];
		}
	}
	return null;
}
function containMulipleWord (searchArray,string){
	var returnedFlag = false;
	for(var i =0 ; i<searchArray.length ; i++){
		if(string.toUpperCase().contains(searchArray[i].toUpperCase())){
			returnedFlag = true ;
		}else{
			return false ;
		}
	}
	return returnedFlag;
}
//This function filtring text input to support arabic and english only
function AllowEnAndArOnly(string)
{
	var sNewVal = "";
	var sFieldVal = string;

	for(var i = 0; i < sFieldVal.length; i++) {

		var ch = sFieldVal.charAt(i);;
		var c = ch.charCodeAt(0);

		if(c < 0 || c > 255 && c < 1536 || c > 1791) {
			// Discard
		}
		else {
			sNewVal += ch;
		}
	}
	if(sNewVal == string)
		return true;
	else
		return false;
}

function checkArabicLetters( character ) {
	var RTL = ['ا','ب','پ','ت','س','ج','چ','ح','خ','د','ذ','ر','ز','ژ','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ک','گ','ل','م','ن','و','ه','ی'];
	return RTL.indexOf( character ) > -1;
};
function checkInpNumbers(x)
{
	if (isNaN(x))
	{
		return false;
	}
	return true;
}

Array.prototype.removeDuplicates = function (){
	var temp = new Array();
	this.sort();
	for(var i=0;i<this.length;i++){
		if(this[i]==this[i+1]) {
			continue;
		}
		temp[temp.length]=this[i];
	}
	return temp;
} ;

//functionto compare two objects or compare spesific property in two objects
function isEquivalentObjects(a, b,property) {
	if(isUndefinedOrNullOrBlank(a)||isUndefinedOrNullOrBlank(b)){
		return false;
	}
	var aProps = Object.getOwnPropertyNames(a);
	var bProps = Object.getOwnPropertyNames(b);
	if(!isUndefinedOrNullOrBlank(property)){
		if(a[property]!== b[property]){
			return false;
		}
	}
	if (aProps.length != bProps.length) {
		return false;
	}

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];


		if (a[propName] !== b[propName]) {
			return false;
		}
	}
	return true;
}


//Get UUID
var generateUUID = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

/////////////////////// Base64 Encoding and Decoding //////////////////////////////////
var _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function encodeBase64(e)
{
	var t="";
	var n,r,i,s,o,u,a;
	var f=0;
	e=_utf8_encode(e);
	while(f<e.length)
	{
		n=e.charCodeAt(f++);
		r=e.charCodeAt(f++);
		i=e.charCodeAt(f++);
		s=n>>2;
		o=(n&3)<<4|r>>4;
		u=(r&15)<<2|i>>6;
		a=i&63;
		if(isNaN(r))
		{
			u=a=64;
		}
		else if(isNaN(i))
		{
			a=64;
		}
		t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);
	}
	return t;
}
function decodeBase64(e)
{
	var t="";
	var n,r,i;
	var s,o,u,a;
	var f=0;
	e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
	while(f<e.length)
	{
		s=this._keyStr.indexOf(e.charAt(f++));
		o=this._keyStr.indexOf(e.charAt(f++));
		u=this._keyStr.indexOf(e.charAt(f++));
		a=this._keyStr.indexOf(e.charAt(f++));
		n=s<<2|o>>4;
		r=(o&15)<<4|u>>2;
		i=(u&3)<<6|a;
		t=t+String.fromCharCode(n);
		if(u!=64)
		{
			t=t+String.fromCharCode(r);
		}
		if(a!=64)
		{
			t=t+String.fromCharCode(i);
		}
	}
	t=_utf8_decode(t);
	return t;
}
function _utf8_encode(e)
{
	e=e.replace(/\r\n/g,"\n");
	var t="";
	for(var n=0;n<e.length;n++)
	{
		var r=e.charCodeAt(n);
		if(r<128)
		{
			t+=String.fromCharCode(r);
		}
		else if(r>127&&r<2048)
		{
			t+=String.fromCharCode(r>>6|192);
			t+=String.fromCharCode(r&63|128);
		}
		else
		{
			t+=String.fromCharCode(r>>12|224);
			t+=String.fromCharCode(r>>6&63|128);
			t+=String.fromCharCode(r&63|128);
		}
	}
	return t;
}
function _utf8_decode(e)
{
	var t="";
	var n=0;
	var r=c1=c2=0;
	while(n<e.length)
	{
		r=e.charCodeAt(n);
		if(r<128)
		{
			t+=String.fromCharCode(r);
			n++;
		}
		else if(r>191&&r<224)
		{
			c2=e.charCodeAt(n+1);
			t+=String.fromCharCode((r&31)<<6|c2&63);
			n+=2;
		}
		else
		{
			c2=e.charCodeAt(n+1);
			c3=e.charCodeAt(n+2);
			t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
			n+=3;
		}
	}
	return t;
}

function toCurrency(number , places, symbol, thousand, decimal)
{
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
			i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
			return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}
function sendEmail()
{

	var refNo = generateUUID();
	var emailDetails =localize("%drivers_and_vehicles.InfoServices.mailDetails%");

	customerEntityModel.set("refNo",refNo);
	var emailSubject = businessServiceModel.getServiceName();
	var env = WL.Client.getEnvironment();
	var mail = localize("ask@rta.ae");
	var winMail='';

	if(env == WL.Environment.BLACKBERRY10|| env == WL.Environment.WINDOWS_PHONE_8) {
		winMail = window.location.href = 'mailto:' + mail;
	} else {
		winMail = window.open("mailto:" + mail+"?subject="+emailSubject+"&body="+emailDetails+"&content='text/plain'&charset='UTF-8'", '_system');
	}
}
function checkValidLanguageInput(string,numFlag)
{
	var english = /^[A-Za-z]*$/;
	if(!isUndefinedOrNullOrBlank(numFlag) && numFlag == true){
		english = /^[A-Za-z0-9]*$/;
	}
	for(var i =0 ; i<string.length ; i++){
		var charElement = string[i];
		var validEnChar = english.test(charElement);
		var validArChar = checkArabicLetters(charElement);
		if(charElement != " " && validEnChar == false && validArChar == false)
			return false;
	}
	return true;
}

function checkArabicLetters( character ) {
	var arabic = /[^\x00-\x80]/;
	return arabic.test(character);
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript                     (c) Chris Veness 2005-2014 / MIT License */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Base64 library
!function(){function t(t){this.message=t}var r="undefined"!=typeof exports?exports:this,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.prototype=new Error,t.prototype.name="InvalidCharacterError",r.btoa||(r.btoa=function(r){for(var o,n,a=String(r),i=0,c=e,d="";a.charAt(0|i)||(c="=",i%1);d+=c.charAt(63&o>>8-i%1*8)){if(n=a.charCodeAt(i+=.75),n>255)throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");o=o<<8|n}return d}),r.atob||(r.atob=function(r){var o=String(r).replace(/=+$/,"");if(o.length%4==1)throw new t("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,a,i=0,c=0,d="";a=o.charAt(c++);~a&&(n=i%4?64*n+a:a,i++%4)?d+=String.fromCharCode(255&n>>(-2*i&6)):0)a=e.indexOf(a);return d})}();
//AES library
"use strict";var Aes={};if(Aes.cipher=function(e,r){for(var o=4,n=r.length/o-1,t=[[],[],[],[]],a=0;4*o>a;a++)t[a%4][Math.floor(a/4)]=e[a];t=Aes.addRoundKey(t,r,0,o);for(var f=1;n>f;f++)t=Aes.subBytes(t,o),t=Aes.shiftRows(t,o),t=Aes.mixColumns(t,o),t=Aes.addRoundKey(t,r,f,o);t=Aes.subBytes(t,o),t=Aes.shiftRows(t,o),t=Aes.addRoundKey(t,r,n,o);for(var s=new Array(4*o),a=0;4*o>a;a++)s[a]=t[a%4][Math.floor(a/4)];return s},Aes.keyExpansion=function(e){for(var r=4,o=e.length/4,n=o+6,t=new Array(r*(n+1)),a=new Array(4),f=0;o>f;f++){var s=[e[4*f],e[4*f+1],e[4*f+2],e[4*f+3]];t[f]=s}for(var f=o;r*(n+1)>f;f++){t[f]=new Array(4);for(var i=0;4>i;i++)a[i]=t[f-1][i];if(f%o==0){a=Aes.subWord(Aes.rotWord(a));for(var i=0;4>i;i++)a[i]^=Aes.rCon[f/o][i]}else o>6&&f%o==4&&(a=Aes.subWord(a));for(var i=0;4>i;i++)t[f][i]=t[f-o][i]^a[i]}return t},Aes.subBytes=function(e,r){for(var o=0;4>o;o++)for(var n=0;r>n;n++)e[o][n]=Aes.sBox[e[o][n]];return e},Aes.shiftRows=function(e,r){for(var o=new Array(4),n=1;4>n;n++){for(var t=0;4>t;t++)o[t]=e[n][(t+n)%r];for(var t=0;4>t;t++)e[n][t]=o[t]}return e},Aes.mixColumns=function(e){for(var r=0;4>r;r++){for(var o=new Array(4),n=new Array(4),t=0;4>t;t++)o[t]=e[t][r],n[t]=128&e[t][r]?e[t][r]<<1^283:e[t][r]<<1;e[0][r]=n[0]^o[1]^n[1]^o[2]^o[3],e[1][r]=o[0]^n[1]^o[2]^n[2]^o[3],e[2][r]=o[0]^o[1]^n[2]^o[3]^n[3],e[3][r]=o[0]^n[0]^o[1]^o[2]^n[3]}return e},Aes.addRoundKey=function(e,r,o,n){for(var t=0;4>t;t++)for(var a=0;n>a;a++)e[t][a]^=r[4*o+a][t];return e},Aes.subWord=function(e){for(var r=0;4>r;r++)e[r]=Aes.sBox[e[r]];return e},Aes.rotWord=function(e){for(var r=e[0],o=0;3>o;o++)e[o]=e[o+1];return e[3]=r,e},Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]],"undefined"!=typeof module&&module.exports&&(module.exports=Aes),"function"==typeof define&&define.amd&&define([],function(){return Aes}),"undefined"!=typeof module&&module.exports)var Aes=require("./aes");Aes.Ctr={},Aes.Ctr.encrypt=function(e,r,o){var n=16;if(128!=o&&192!=o&&256!=o)return"";e=String(e).utf8Encode(),r=String(r).utf8Encode();for(var t=o/8,a=new Array(t),f=0;t>f;f++)a[f]=isNaN(r.charCodeAt(f))?0:r.charCodeAt(f);var s=Aes.cipher(a,Aes.keyExpansion(a));s=s.concat(s.slice(0,t-16));for(var i=new Array(n),d=(new Date).getTime(),u=d%1e3,c=Math.floor(d/1e3),A=Math.floor(65535*Math.random()),f=0;2>f;f++)i[f]=u>>>8*f&255;for(var f=0;2>f;f++)i[f+2]=A>>>8*f&255;for(var f=0;4>f;f++)i[f+4]=c>>>8*f&255;for(var y="",f=0;8>f;f++)y+=String.fromCharCode(i[f]);for(var p=Aes.keyExpansion(s),v=Math.ceil(e.length/n),h=new Array(v),l=0;v>l;l++){for(var g=0;4>g;g++)i[15-g]=l>>>8*g&255;for(var g=0;4>g;g++)i[15-g-4]=l/4294967296>>>8*g;for(var w=Aes.cipher(i,p),C=v-1>l?n:(e.length-1)%n+1,m=new Array(C),f=0;C>f;f++)m[f]=w[f]^e.charCodeAt(l*n+f),m[f]=String.fromCharCode(m[f]);h[l]=m.join("")}var b=y+h.join("");return b=b.base64Encode()},Aes.Ctr.decrypt=function(e,r,o){var n=16;if(128!=o&&192!=o&&256!=o)return"";e=String(e).base64Decode(),r=String(r).utf8Encode();for(var t=o/8,a=new Array(t),f=0;t>f;f++)a[f]=isNaN(r.charCodeAt(f))?0:r.charCodeAt(f);var s=Aes.cipher(a,Aes.keyExpansion(a));s=s.concat(s.slice(0,t-16));for(var i=new Array(8),d=e.slice(0,8),f=0;8>f;f++)i[f]=d.charCodeAt(f);for(var u=Aes.keyExpansion(s),c=Math.ceil((e.length-8)/n),A=new Array(c),y=0;c>y;y++)A[y]=e.slice(8+y*n,8+y*n+n);e=A;for(var p=new Array(e.length),y=0;c>y;y++){for(var v=0;4>v;v++)i[15-v]=y>>>8*v&255;for(var v=0;4>v;v++)i[15-v-4]=(y+1)/4294967296-1>>>8*v&255;for(var h=Aes.cipher(i,u),l=new Array(e[y].length),f=0;f<e[y].length;f++)l[f]=h[f]^e[y].charCodeAt(f),l[f]=String.fromCharCode(l[f]);p[y]=l.join("")}var g=p.join("");return g=g.utf8Decode()},"undefined"==typeof String.prototype.utf8Encode&&(String.prototype.utf8Encode=function(){return unescape(encodeURIComponent(this))}),"undefined"==typeof String.prototype.utf8Decode&&(String.prototype.utf8Decode=function(){try{return decodeURIComponent(escape(this))}catch(e){return this}}),"undefined"==typeof String.prototype.base64Encode&&(String.prototype.base64Encode=function(){if("undefined"!=typeof btoa)return btoa(this);if("undefined"!=typeof Base64)return Base64.encode(this);throw new Error("No Base64 Encode")}),"undefined"==typeof String.prototype.base64Decode&&(String.prototype.base64Decode=function(){if("undefined"!=typeof atob)return atob(this);if("undefined"!=typeof Base64)return Base64.decode(this);throw new Error("No Base64 Decode")}),"undefined"!=typeof module&&module.exports&&(module.exports=Aes.Ctr),"function"==typeof define&&define.amd&&define(["Aes"],function(){return Aes.Ctr});
/*
 * End AES implementation
 */

function encryptData(data) {

	var cypherText = Aes.Ctr.encrypt(data,getEncryptionPassword(),getEncryptionStrength());
	return {cypherText: cypherText };
}

function decryptData(data) {

	var cypherText = Aes.Ctr.decrypt(data,getEncryptionPassword(),getEncryptionStrength());
	return {cypherText: cypherText };
}
function capitaliseFirstLetter(string)
{
	var frags = string.split(' ');
	for (var i=0; i<frags.length; i++) {
		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
	}
	return frags.join(' ');
	return string.charAt(0).toUpperCase() + string.slice(1);
}

//check input is number or not.
function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode
			if (charCode > 31 && (charCode < 48 || charCode > 57))
				return false;
	return true;
}

function swapElements(obj1, obj2) {
	// create marker element and insert it where obj1 is
	var temp = document.createElement("div");
	obj1.parentNode.insertBefore(temp, obj1);

	// move obj1 to right before obj2
	obj2.parentNode.insertBefore(obj1, obj2);

	// move obj2 to right before where obj1 used to be
	temp.parentNode.insertBefore(obj2, temp);

	// remove temporary marker node
	temp.parentNode.removeChild(temp);
}

function showInternetProblemPopup(){
	var pop = new Popup("internetErrorPopup");
	pop.show();
}
function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

function getServiceObjectById(id){
	try{
		var category = null;
		for(var i=0;i<ServiceCategories.length;i++){
			if(ServiceCategories[i].CategoryId == id){
				category = ServiceCategories[i];
			}
		}
		return category;
	}
	catch(e){
		console.log(e);
		return;
	}
}
function isEmpty(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad (deg) {
	return deg * (Math.PI/180)
}
function fullName(username) {
	if (username.length <= 15) {
		return username;
	} else {
		var usernameArr = username.split(" ");
		if (usernameArr[0].length <= 3) {
			username = usernameArr[0] + " " + usernameArr[1]
		} else {
			username = usernameArr[0];
		}
		return username
	}
}

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			return false;
		}
	}

	return JSON.stringify(obj) === JSON.stringify({});
}
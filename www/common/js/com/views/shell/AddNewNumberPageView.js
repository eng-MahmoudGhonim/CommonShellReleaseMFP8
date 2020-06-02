define(["com/utils/TemplateUtils", "com/utils/Utils", "com/models/drivers_and_vehicles/DVAccountModel","com/views/shell/ProfilePageView","com/utils/DataUtils"], function(TemplateUtils, Utils, DVAccountModel,profilePage,DataUtils) {
	var AddNewNumberView = Backbone.View.extend({
		
		validateMobileNumber: function() {
			AddNewNumberViewInstance.mbileEditFieldValidator = new Validator(document.querySelector("#addNewSalikNumberInput"), {
				validations: [{
					regEx: "empty",
					errorMessage: localize("%shell.registeration.validation.mobile.required2%"),
					order: 0},
					{regEx: function(val, el) {	
						var currentMobile=document.querySelector("#addNewSalikNumberInput");
						var buttonOk=document.querySelector("#AddNewNumberPopup .okBtn");
						if (val.length >=8&&val.length <=12) {
							currentMobile.classList.contains("valid")?currentMobile.classList.remove("unvalid"):currentMobile.classList +=" valid";
							buttonOk.className = buttonOk.className.replace(new RegExp("disabled", 'g'), "").replace(new RegExp(" ", 'g'), "");
						return true;
						} else {
							buttonOk.className = buttonOk.className.replace(new RegExp("disabled", 'g'), "").replace(new RegExp(" ", 'g'), "");
							buttonOk.className += " disabled";
							currentMobile.classList.contains("unvalid")?currentMobile.classList.remove("valid"):currentMobile.classList +=" unvalid";
							return false;
						}						
					},
					errorMessage: localize("%shell.registeration.validation.mobile.required3%") ,
					order:1
				}],
				onValidate: AddNewNumberViewInstance.updateEditMobileNumber
			});
		},
		initialize: function(options) {
			AddNewNumberViewInstance = this;
			AddNewNumberViewInstance.indexNewNumber = 0;
			var url = MobileRouter.baseUrl + '/pages/shell/addnewnumber_popup.html';
			var onTemplate = function(content) {
				var NewNumberPopup_Options = {
						popupId: "AddNewNumberPopup",
						title: localize("%shell.Profile.AddNewNumber%"),
						content: content,
						primaryBtnText: localize("%shell.Profile.SaveNumber%"),
						primaryBtnCallBack: null,
						primaryBtnDisabled: false,
						secondaryBtnCallBack: null,
						secondaryBtnVisible: true,
						secondaryBtnDisabled: false,
						hideOnPrimaryClick: true,
						hideOnSecondaryClick: true,
						aroundClickable: true,
						onAroundClick: null
				}
				AddNewNumberViewInstance.AddNewNumberPopup = new Popup(NewNumberPopup_Options);
				AddNewNumberViewInstance.AddNewNumberPopup.onBeforeShow = AddNewNumberViewInstance.onBeforeShow;
				var setDefaultCheckbox = document.getElementById('setDefault-checkbox');
				setDefaultCheckbox.onchange = function(event) {
					if (this.checked) {
						activateCheckbox(this);
						console.log('checked');
					} else {
						deactivateCheckbox(this);
						console.log('not checked');
					}
				};
			}
			TemplateUtils.getStaticTemp(url, onTemplate, true, true);
		},
		
		cancelDeleteNumber:function()
		{
			alert("Cancel number");
		},
		spliceString:function(idx,rem,str,mobile,isSuffix){
			String.prototype.splice = function(idx, rem, str) {
				return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
			}
			if(isSuffix)
				return mobile.splice(idx, rem,str);
			return mobile.splice(idx, rem,str).splice(6, 0,str);
		},
		
		bindMobileTypes:function(result)  
		{
			var html = "";
			for (var i = 0; i < result.length; i++) {
				if (getApplicationLanguage() == 'ar') {
					html += "<option value='" + result[i].Id + "'>" + result[i].Name_Ar + "</option>";
				} else {
					html += "<option value='" + result[i].Id + "'>" + result[i].Name + "</option>";
				}
			}
			document.getElementById("newNumberProfileDDl").innerHTML = html;
		},
		
		bindCountryCodes:function(result)
		{
			var html = ""; 
			var _result = JSON.parse(result) 
			for (var i = 0; i < _result.length; i++) 
			{
				html += "<option value='" + _result[i].Code  + "'>" + _result[i].Code.replace("00","+")+ "</option>";
			}
			document.getElementById("counrtyCodeDLL").innerHTML = html;
			
		},
		show: function(currentNumber) {

			AddNewNumberViewInstance.AddNewNumberPopup.show();
			var currentMobile=document.querySelector("#addNewSalikNumberInput");
			currentMobile.classList.remove("unvalid");
			currentMobile.classList.remove("valid");
			document.getElementById("newNumberProfileDDl").innerHTML = "";
			DVAccountModel.getMobileTypes(AddNewNumberViewInstance.bindMobileTypes); 
			
           //country code 
			document.getElementById("counrtyCodeDLL").innerHTML="";
				var codesCountries = DataUtils.getLocalStorageData('countriesCodes', "shell");
			if(!codesCountries)
		        DVAccountModel.getCountryCodes(AddNewNumberViewInstance.bindCountryCodes)
		      else
		      AddNewNumberViewInstance.bindCountryCodes(codesCountries);
			
			  AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").addEventListener("change",function(){
				var newNumberTypeDDL = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL");
				var typeText = newNumberTypeDDL.options[newNumberTypeDDL.selectedIndex].text;
				var valueId = newNumberTypeDDL.value;

				if (valueId=="1"){
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="block";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-switch label").classList.remove("shell-lever-active");
				
				}else{
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="none";
					  var setDefaultNumber = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-checkbox");
						 deactivateCheckbox(setDefaultNumber);
			}},false)
			 
			
			//check emirates code
			AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#mbileNumberSuffixTemp").addEventListener("input",function(){
				var codeCountryDDL = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#counrtyCodeDLL");
				var codeValue = codeCountryDDL.options[codeCountryDDL.selectedIndex].text;
				var mobile = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#mbileNumberSuffixTemp").value;
				mobile=mobile?mobile.replace(/ /g,""):"";
				var inputMobile=document.querySelector("#AddNewNumberPopup .shell-input-cont");
				inputMobile.classList.contains("valid")?inputMobile.classList.remove("valid"):inputMobile.classList +=" unvalid";

			},false)
			// on change code Country control set default
			AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#counrtyCodeDLL").addEventListener("change",function(){
				var inputMobile=document.querySelector("#AddNewNumberPopup .shell-input-cont");
				inputMobile.classList.contains("valid")?inputMobile.classList.remove("valid"):inputMobile.classList +=" unvalid";
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#mbileNumberSuffixTemp").value="";
			},false)
			
			document.querySelector("#AddNewNumberPopup .okBtn").classList=document.querySelector("#AddNewNumberPopup .okBtn").className.replace(new RegExp("disabled", 'g'), "").replace(new RegExp(" ", 'g'), "");
			if (currentNumber) // edit
			{
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".phoneNumber").value = currentNumber.PhoneNumber;
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").value = currentNumber.PhoneTypeId;
				document.querySelector("#counrtyCodeDLL").value = currentNumber.CountryCode.substring(0,2) != "00" ? "00"+currentNumber.CountryCode : currentNumber.CountryCode; //to change//

				var setDefaultNumber = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-checkbox");
				$.parseJSON(currentNumber.IsDefault)  ? activateCheckbox(setDefaultNumber) : deactivateCheckbox(setDefaultNumber);
				AddNewNumberViewInstance.AddNewNumberPopup.options.title = localize("%shell.Profile.EditNewNumber%");
				AddNewNumberViewInstance.AddNewNumberPopup.options.primaryBtnText = localize("%shell.Profile.Update%");
			
				if (currentNumber.IsDefault=="true") // disable Set default for edit for 
				{
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="block";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.disabled ="true";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.pointerEvents = "none";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-switch label").classList.remove("shell-lever-active");
					var mobileType=AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL"); // disable mobile type
                      mobileType.classList.contains("disabled")?"":mobileType.classList+" disabled";
					AddNewNumberViewInstance.AddNewNumberPopup.options.title = localize("%shell.Profile.EditDefaultNumber%");
				}
				else if(currentNumber.IsDefault!="true"&&currentNumber.PhoneTypeId=="1") // is not default but type mobile
				{
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="block";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-switch label").classList.remove("shell-lever-active");
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.pointerEvents = "auto";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").classList.remove("disabled"); //Remove  disable mobile type
				}
				else
				{
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="none";
					AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").classList.remove("disabled");
				}
				AddNewNumberViewInstance.AddNewNumberPopup.options.primaryBtnCallBack = function() {
					var newNumberTypeDDL = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL");
					AddNewNumberViewInstance.workType = newNumberTypeDDL.options[newNumberTypeDDL.selectedIndex].text;
					AddNewNumberViewInstance.typeId = newNumberTypeDDL.value;
					var mobileCode = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#counrtyCodeDLL").value;
					AddNewNumberViewInstance.mobileNumber = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".phoneNumber").value;
					AddNewNumberViewInstance.mobileNumber=AddNewNumberViewInstance.mobileNumber?AddNewNumberViewInstance.mobileNumber.replace(/ /g,""):"";
					var setDefaultCheckbox = document.getElementById('setDefault-checkbox');

						var salikNumber = {
								"Id": currentNumber.CustPhoneId,
								"Code":mobileCode,
								"Number": AddNewNumberViewInstance.mobileNumber,
								"TypeId": AddNewNumberViewInstance.typeId,
								"isDefault": setDefaultCheckbox.checked ? true : false,
								"CustPhoneUpdTime":	currentNumber.CustPhoneUpdTime
						}
						DVAccountModel.editSalikNumber(salikNumber,profilePageViewInstance.bindOtherSalikNumbers);
				}
			} else // add new number
			{
				document.querySelector("#AddNewNumberPopup .okBtn").classList+=" disabled";
				
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").classList.remove("disabled");
				AddNewNumberViewInstance.AddNewNumberPopup.options.title = localize("%shell.Profile.AddNewNumber%");
				AddNewNumberViewInstance.AddNewNumberPopup.options.primaryBtnText = localize("%shell.Profile.SaveNumber%");
				// reset Default inputs
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".phoneNumber").value = "";
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL").value = 1;
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.display="block";
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".setDefaultNumber").style.pointerEvents = "auto";
				AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-switch label").classList.remove("shell-lever-active");
				document.querySelector("#counrtyCodeDLL").value = "00971" 
				//to change//
				var setDefaultCheckboxx = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#setDefault-checkbox");
				deactivateCheckbox(setDefaultCheckboxx);
				
				AddNewNumberViewInstance.AddNewNumberPopup.options.primaryBtnCallBack = function() {
					var newNumberTypeDDL = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".MobileTypeDDL");
					AddNewNumberViewInstance.workType = newNumberTypeDDL.options[newNumberTypeDDL.selectedIndex].text;
					AddNewNumberViewInstance.TypeId = newNumberTypeDDL.value;;
					AddNewNumberViewInstance.mobileKey = newNumberTypeDDL.value;
					var mobileCode = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector("#counrtyCodeDLL").value;
					AddNewNumberViewInstance.mobileNumber = AddNewNumberViewInstance.AddNewNumberPopup.el.querySelector(".phoneNumber").value;
					AddNewNumberViewInstance.mobileNumber=AddNewNumberViewInstance.mobileNumber?AddNewNumberViewInstance.mobileNumber.replace(/ /g,""):"";
					//set default
					var setDefaultCheckbox = document.getElementById('setDefault-checkbox');
					// add data to model
					var salikNumber = {
							"Code":mobileCode,
							"Number": AddNewNumberViewInstance.mobileNumber,
							"TypeId": AddNewNumberViewInstance.TypeId,
							"isDefault": setDefaultCheckbox.checked ? true : false
					}
					DVAccountModel.addSalikNumber(salikNumber,profilePageViewInstance.bindOtherSalikNumbers);
				}
			};
		},
		updateEditMobileNumber: function(valid) {
		},
		onBeforeShow: function() {
			
			AddNewNumberViewInstance.validateMobileNumber();
			AddNewNumberViewInstance.updateEditMobileNumber();
		},
	});
	return AddNewNumberView;
});
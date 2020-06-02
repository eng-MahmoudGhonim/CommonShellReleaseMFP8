
define(["jquery", "backbone", "com/utils/DataUtils", "com/utils/Utils", ], function($, Backbone, DataUtils, Utils) {

	var SALIK_NUMBERS = 'saliknumbers';
	var DVAccountModel = Backbone.Model.extend({}, {

		// Manage local storage
		setCacheSalikNumbers: function (salikNumbers) {
			if(!salikNumbers) {
				salikNumbers = [];
			}
			DataUtils.setLocalStorageData(SALIK_NUMBERS, JSON.stringify(salikNumbers), true, "shell");
		},
		//Get from Local Storage 
		getCacheSalikNumbers: function () {
			var salikNumbers = DataUtils.getLocalStorageData(SALIK_NUMBERS, "shell");
			if (salikNumbers) {
				salikNumbers = JSON.parse(salikNumbers);
				return salikNumbers;
			}
			return [];
		},
		/*Start Traffic file number for  Linked Account Tab */
		getTrafficFileNumber: function() {
			// case not linked return null or undefiend 
			//return null;
			return {number:"52554555"};
		},
		addTrafficFileNumber: function() {

			alert("add tarffic file number");
		},
		/*End Traffic file number for  Linked Account Tab *ss/

		/*Start Salik Link for Linked Account Tab*/
		addSalikAccount: function() {
			
			//Add Salik Nuumber and Call Back function
			alert("AddSalikAccount")
		},
		getSalikAccount: function(callBack) {
			//case not linked return null or undefiend 
	        //return null;
			//return{number:"52554555"};
			callBack({number:"52554555"});
		},
		removeSalikAccount: function(callBack) {
		
			alert("removeSalikAccount")
			
			callBack(null);
		},
		/*Edit Salik Account */
		editSalikAccount: function() {
			alert("editSalikAccount")
		},
		/* End Salik Link for Linked Account Tab */

		/*Start parking link for Linked Account Tab*/
		addParkingAccount: function() {
			alert("addParkingAccount")
		},
		getParkingAccount: function() {
			//case not linked return null or undefiend 
			// call backend to get parking number if not we will show add button
			return {number:"3232323481"};
		},
		/*End parking link for Linked Account Tab*/

		/*Start NOL link for Linked Account Tab*/
		addNOLAccount: function() {
			alert("addNOLAccount")
		},

		getNOLAccount: function() {
			alert("getNOLAccount")
		},
		/*End NOL link for Linked Account Tab*/



		openMyTransactions: function() {
//			alert("openMyTransactions")
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},

		openMyDriveLicense: function() {
//			alert("openMyDriveLicense")
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
		openMyVehicles: function() {
//			alert("openMyVehicles")
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},
		openMyPlaces: function() {
//			alert("openMyPlaces")
			var commingSoonPopup = new Popup("commingSoonPopup");
			commingSoonPopup.show();
		},

		/*Manage Linked Account with salik in profile */
		getMobileTypes:function(callback){	
			// Array of objects contains all Mobile types(Id, typeAr,typeEn,..) 
			 callback([{"Id":1,"Name":"Mobile","Name_Ar":"موبيل"},{"Id":2,"Name":"Work","Name_Ar":"عمل"},{"Id":3,"Name":"Home","Name_Ar":"منزل"},{"Id":4,"Name":"Fax","Name_Ar":"فاكس"}]);
		},

		getCountryCodes:function(callback)
		{
			// Array of objects of countries code (Id, Code,..)
			if(typeof callback == 'function')
			 callback([{Id:1,Code:"00971"},{Id:2,Code:"0020"},{Id:3,Code:"00976"}]);
		},

		getSalikNumbers:function(callback){
			//array of objects All Salik Numbers (Default and others)
			if(typeof callback == 'function')
				 callback(this.getCacheSalikNumbers());
		},

		getDefaultSalikNumber:function()
		{
			// calling inside model 
			// if null will hide link salik div
			
			var salikNumbers=this.getSalikNumbers();
		
			if(salikNumbers){
				for(var i =0; i< salikNumbers.length;i++)
				{
					if(salikNumbers[i].isDefault)
					{
						return salikNumbers[i];
					}
				}
			}
			else
				{
				return "12321323432"; // for testing only to show salik div in UI 
				}
			return null;
		},

		addSalikNumber:function(salikNumber,callback)
		{
			// Add new Salik number and we have two scenairos for adding if 
			// 1- if this Salik just other number(is not default )  then we need to add it to database only
			// 2- if this number is default number then we need to send and verify OTP then update old default to be other Number
			callback();  // after add bind numbers

			// this is testing code 
			var OtherSalikNumbers=this.getSalikNumbers();
			var mobileType=this.getMobileNumberTypeText(salikNumber.TypeId) // Get all data about mobile type
			salikNumber.Type= mobileType.Name;
			salikNumber.Type_Ar= mobileType.Name_Ar;
			var index=OtherSalikNumbers.length+1;
			salikNumber.Id=index; // generate Id for test only
			if(salikNumber.isDefault) // set this number default
			{
				var oldDefaultSalikObj=this.getDefaultSalikNumber(); //Get Old Salik Numnber
				this.destroySalikOtherNumbers();
				OtherSalikNumbers.push(salikNumber)
				this.setCacheSalikNumbers(OtherSalikNumbers);
				if(oldDefaultSalikObj)// add to DB
				{
					oldDefaultSalikObj.isDefault=false; // update default
					this.editSalikNumber(oldDefaultSalikObj); // Update DB
				}
			}
			else
			{
				this.destroySalikOtherNumbers();
				OtherSalikNumbers.push(salikNumber);
				this.setCacheSalikNumbers(OtherSalikNumbers);
			}

		},
		editSalikNumber:function(salikNumber,callback)
		{
			// Edit  Salik number and we have two scenairos for editing if 
			// 1- if this Salik just other number(is not default ) then we need to edit it to data base only
			// 2- if this number is default number then we need to send and verify OTP then update old default to be other Number

			callback();  // after add bind numbers
			// this is testing code 
			var OtherSalikNumbers=this.getSalikNumbers();
			var oldDefaultSalikObj=this.getDefaultSalikNumber();
			var mobileType=this.getMobileNumberTypeText(salikNumber.TypeId)
			salikNumber.Type= mobileType.Name;
			salikNumber.Type_Ar= mobileType.Name_Ar;
			if(salikNumber.isDefault)
			{
				//Get Old Salik Numnber
				for(var i =0; i< OtherSalikNumbers.length;i++) // Update DB With new data
				{
					if(OtherSalikNumbers[i].Id==salikNumber.Id)
					{
						OtherSalikNumbers[i]=salikNumber; // update db with new Update 
						break;
					}
				}
				//Update old default Salik Number
				if(oldDefaultSalikObj.Id!=salikNumber.Id)
				{
					for(var i =0; i< OtherSalikNumbers.length;i++) // Update DB With new data
					{
						if(OtherSalikNumbers[i].Id==oldDefaultSalikObj.Id)
						{
							oldDefaultSalikObj.isDefault=false;   // Update Old Salik Number
							OtherSalikNumbers[i]=oldDefaultSalikObj; // update old default number in db with new Update 
							this.destroySalikOtherNumbers();
							this.setCacheSalikNumbers(OtherSalikNumbers);
							break;
						}
					}
				}
				this.destroySalikOtherNumbers();
				this.setCacheSalikNumbers(OtherSalikNumbers);
			}
			else // edit without update Default 
			{
				for(var i =0; i< OtherSalikNumbers.length;i++)
				{
					if(OtherSalikNumbers[i].Id==salikNumber.Id)
					{
						OtherSalikNumbers[i]=salikNumber; // update db with new Update 
						this.destroySalikOtherNumbers();
						this.setCacheSalikNumbers(OtherSalikNumbers);
						break;
					}
				}
			}
		},

		getMobileNumberTypeText:function(typeId)
		{
			// helping method to get all details about mobile type
			var mobileTypes=this.getMobileTypes();
			for(var i =0; i< mobileTypes.length;i++)
			{
				if(mobileTypes[i].Id==typeId)
					return mobileTypes[i]
			}
		},

		deleteOtherNumber:function(id,callback)
		{
			// send other salik number Delete 
			/*Delete from Cashed*/
			if(id){
				var otherNumbers=this.getCacheSalikNumbers();
				var index;
				for(var i =0; i< otherNumbers.length;i++) 
				{
					if(otherNumbers[i].Id==id)
					{
						index=i;
						break;
					}
				}
				otherNumbers.splice(i,1);
				this.destroySalikOtherNumbers();
				this.setCacheSalikNumbers(otherNumbers);
				/* End Delete from Cashed*/
			}
			callback();
		},
		isLinkedWithSalik:function(callback)
		{
			// return Check if this user Linked with salik or not  to hide Salik div from UI
			result= true;
			if(result)
				return callback();
		},
		linkProfielWithSalik:function(ProfileNumber ,callback)
		{
			//update Salik With Profile Number, this bussiness is related with API existed 
			return callback();
		},
		destroySalikOtherNumbers: function () {
			DataUtils.removeFromLocalStorage(SALIK_NUMBERS, "shell");
		}
	});
	return DVAccountModel;
});
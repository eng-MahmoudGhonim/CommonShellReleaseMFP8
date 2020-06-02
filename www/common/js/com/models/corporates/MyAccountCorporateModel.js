
define(["jquery", "backbone", "com/utils/DataUtils", "com/utils/Utils", ], function($, Backbone, DataUtils, Utils) {

	var corporateAccountModel = Backbone.Model.extend({}, {

		openMyTransactions: function() {
			alert("openMyTransactions")
		},

		openMyVehicles: function() {
			alert("openMyVehicles")
		},

		getCorporateProfile:function(callback)
		{
			// This Sample Return data
			setTimeout(function (){
				var profile={
						mail:"test@gmail.com",
						mobile:"522101159",
						title_id:"1",first_name_en:"Ayman",
						last_name_en:"Nageh",
						nationality_id:"2",
						preferred_language:"English",
						preferred_communication:"Email",
						businessLicNumber:"Duabi",
						issueDate:"07/11/2011",
						expireDate:"25/2/2018",
						businessLicenseIssued:"Duabi Econmic Depaerment",
						officeTelephone:"97152210115",
						officeFax:"971522101188",
						companyEmail:"BusinessAccount@gmail.com",
						pOBox:"21285",
						adminEmail:"adminstrator@gmail.com",
						companyName:"Test Comapny"

				}
				callback( profile);
			},1000);
		},

		createNewNoc:function(callback){
			// Add new Noc code
			alert("createNewNoc Model");
		},
		manageNOCs:function(){
			//Manage Nocs code
			alert("ManageNOCs Model");
		},
		getNOCsDetails:function(callback){
			//please manage the cashing mechanism for the below object .
			//all Noc Details should be like the below object
			var response =  [
			                 {Id:1,Name:"Temporarily Saved",Value:"11"},
			                 {Id:2,Name:"Pending Docs",Value:"15"},
			                 {Id:3,Name:"In-Process& Approved",Value:"25"},
			                 {Id:4,Name:"Due for Revalidation",Value:"10"},
			                 {Id:5,Name:"Cancelled/Objected",Value:"7"},
			                 {Id:6,Name:"Commented",Value:"10"}
			                 ];
			setTimeout(function(){
				callback(response);
			}, 1000);
		},
		numberOfNOCsLastThreeMonths:function(){
			//total Number of Noc Last 3 months
     var totalNocs=60;
			return totalNocs;
		},

	});
	return corporateAccountModel;
});

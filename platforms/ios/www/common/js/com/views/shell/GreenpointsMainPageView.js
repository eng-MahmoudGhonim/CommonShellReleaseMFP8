define(["com/views/PageView",
        "com/models/shell/GreenPointsModel",
        "com/utils/DataUtils",
        "com/models/shell/AuthenticationModel",
        "com/views/Header",
        "com/utils/SocialSharingUtils",
        "com/models/Constants",
        "com/utils/Utils"

        ], function(PageView, GreenPointsModel, DataUtils, AuthenticationModel, Header, SocialSharingUtils, Constants ,Utils) {


	// Extends PageView class
	var GreenpointsMainPageView = PageView.extend({

		LOCAL_STORAGE_GREENPOINTS : "GreenPoints",
		DATA_EXPIRY_IN_MS: 14400000, // 4 hours

		GREEN_DATA:{
			SCORE:0,
			RANK:0,
			TIME_PT:0,
			TIME_DT:0,
			CO2_PT:0,
			CO2_DT:0,
			MONEY_PT:0,
			MONEY_DT:0,
		},
		events:{
			'pageshow':'onPageShow'
		},
		onPageShow: function() {

			var options = {
					startIndex: 0,
					touchEnabled: false,
					direction:(getApplicationLanguage()=='en') ? "ltr": "rtl"
			}

			document.getElementById("gpinfo").onclick=function(event){
				event.preventDefault();
				mobile.changePage("shell/greenpoints_howitworks.html");
			}

			document.getElementById("sharescore").onclick=function(event){

				//Message to be pulled from the language files 
				//3rd param will be the url passed from the language files
				//this section to optain the application name 
				var RTAAppNameTodisplay="";
				if(Constants.APP_ID == "RTA_Public_Transport"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.RTA_Public_Transport%", getApplicationLanguage());
				}else if(Constants.APP_ID == "Wojhati"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.Wojhati%", getApplicationLanguage());
				}else if(Constants.APP_ID == "Smart_Taxi"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.Smart_Taxi%", getApplicationLanguage());
				}else if(Constants.APP_ID == "RTA_Corporate_Services"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.RTA_Corporate_Services%", getApplicationLanguage());
				}else if(Constants.APP_ID == "RTA_Drivers_And_Vehicles"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.RTA_Drivers_And_Vehicles%", getApplicationLanguage());
				}else if(Constants.APP_ID == "Smart_Dubai_Parking"){
					RTAAppNameTodisplay=Globalize.localize("%shell.welcomepage.AppName.Smart_Dubai_Parking%", getApplicationLanguage());
				}
				if (greenpointsMainPageViewInstance.GREEN_DATA.SCORE== undefined) greenpointsMainPageViewInstance.GREEN_DATA.SCORE=0;
				var socialShareMessagetoShare=Globalize.localize("%shell.greenpoints.socialshare.message1%", getApplicationLanguage()) + greenpointsMainPageViewInstance.GREEN_DATA.SCORE
				+Globalize.localize("%shell.greenpoints.socialshare.message2%", getApplicationLanguage())
				+RTAAppNameTodisplay+'.';/*+ Globalize.localize("%shell.greenpoints.socialshare.message3%", getApplicationLanguage())*/

				SocialSharingUtils.share(socialShareMessagetoShare , null, null);				
			};
			//if you are not logged in then show guest mode
			if(!AuthenticationModel.isAuthenticated())
			{


				//enable guest mode
				document.getElementById("currentPointsHead").classList.add('ui-disabled');
				options.startIndex = 1;
				if(DataUtils.getLocalStorageData("SHOW_LOGIN",'shell')=="true"||DataUtils.getLocalStorageData("SHOW_LOGIN",'shell')==null)
				{
					var greenPointsPopup_Options = {
							popupId: "greenPointsPopup",
							title: localize("%shell.sidepanel.loginOrRegisterTitle%"),
							content: localize("%shell.greenPoints.show.guest.popupMessage%"),
							primaryBtnText: localize("%shell.login.loginAccount%"),
							primaryBtnCallBack: function(){
								mobile.changePage("shell/login.html");
							},
							primaryBtnDisabled: false,
							secondaryBtnText: localize("%shell.registeration.title%"),
							secondaryBtnCallBack: function(){
								mobile.changePage("shell/register.html");
							},
							secondaryBtnVisible: true,
							secondaryBtnDisabled: false,
							hideOnPrimaryClick: true,
							hideOnSecondaryClick: true,
							aroundClickable: true,
							onAroundClick: null
					}

					var greenPointsPopup = new Popup(greenPointsPopup_Options);
					greenPointsPopup.show();
					DataUtils.setLocalStorageData("SHOW_LOGIN", false, false, 'shell');
				}					
			} else {
				//show greenpoints welcome page for the first time the logged in user
				if(DataUtils.getLocalStorageData("SHOW_GREENPOINTS_WELCOME",'shell')=="false" ||DataUtils.getLocalStorageData("SHOW_GREENPOINTS_WELCOME",'shell')==undefined||DataUtils.getLocalStorageData("SHOW_GREENPOINTS_WELCOME",'shell')==null)
				{
					var greenPointsLoggedInPopup_Options = {
							popupId: "greenPointsLoggedInPopup",
							title:localize("%shell.green.points.title%"),
							content: localize("%shell.greenPoints.show.loggedin.popupMessage%"),
							primaryBtnText:  localize("%shell.dialog.button.ok%"),
							primaryBtnCallBack: null,
							primaryBtnDisabled: false,
							secondaryBtnText: null,
							secondaryBtnCallBack: null,
							secondaryBtnVisible: false,
							secondaryBtnDisabled: false,
							hideOnPrimaryClick: true,
							hideOnSecondaryClick: true,
							aroundClickable: true,
							onAroundClick:  null
					}

					var greenPointsLoggedInPopup = new Popup(greenPointsLoggedInPopup_Options);
					greenPointsLoggedInPopup.show();
					DataUtils.setLocalStorageData("SHOW_GREENPOINTS_WELCOME", true, false, 'shell');
				}

				//You are logged in, show your green points from localstore and if no data load it
				try{
					//load green points data from local store
					var data = DataUtils.getLocalStorageData(greenpointsMainPageViewInstance.LOCAL_STORAGE_GREENPOINTS, 'shell');

					var now = new Date().getTime();
					var currentDate = new Date();
					//every 4 hours
					var timeAtEightAM = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0, 0).getTime();
					//we have to check first if data is empty or not 
					var lastSynchDate='';
					if(data!=null) 
					{ lastSynchDate = (JSON.parse(data)).timestamp;} //we have first to parse data to be Json Object
					else
					{timeStamp=null;}

					if( !data || !lastSynchDate //if no data
							|| ((now - lastSynchDate) > greenpointsMainPageViewInstance.DATA_EXPIRY_IN_MS) //if data expired
							|| (((timeAtEightAM - lastSynchDate) > 0) && (now - timeAtEightAM)>0) ){ //if green points captured before 8 AM and now is after 8 AM
						GreenPointsModel.getGreenPoints(function(freshdata, callFailed){
							if(freshdata)
							{
								//timestamp the data and store
								var timestamp = new Date().getTime();
								freshdata.timestamp=timestamp;
								DataUtils.setLocalStorageData(greenpointsMainPageViewInstance.LOCAL_STORAGE_GREENPOINTS, JSON.stringify(freshdata), false, 'shell');
								greenpointsMainPageViewInstance.GREEN_DATA = freshdata;

							}
							if((greenpointsMainPageViewInstance.GREEN_DATA.SCORE == 0 || greenpointsMainPageViewInstance.GREEN_DATA.SCORE == undefined) && !callFailed)
							{
								var zerogreenPointsPopup_Options = {
										popupId: "zerogreenPointsPopup",
										title:localize("%shell.greenpoints.dubai_score%"),
										content: localize("%shell.greenpoints.zeroGreenScore%"),
										primaryBtnText:  localize("%shell.dialog.button.ok%"),
										primaryBtnCallBack: null,
										primaryBtnDisabled: false,
										secondaryBtnText: null,
										secondaryBtnCallBack: null,
										secondaryBtnVisible: false,
										secondaryBtnDisabled: false,
										hideOnPrimaryClick: true,
										hideOnSecondaryClick: true,
										aroundClickable: true,
										onAroundClick:  null
								}

								var zerogreenPointsPopup = new Popup(zerogreenPointsPopup_Options);
								zerogreenPointsPopup.show();
							}
							greenpointsMainPageViewInstance.updateViewForLogin(freshdata);
						});

					}
					else
					{
						greenpointsMainPageViewInstance.GREEN_DATA = JSON.parse(data);
						greenpointsMainPageViewInstance.updateViewForLogin(greenpointsMainPageViewInstance.GREEN_DATA);
					}

				}
				catch(e){
					var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
				}
			}


			greenpointsMainPageViewInstance.tabs = new Tabs(greenpointsMainPageViewInstance.$el[0].querySelector(".tabsCont"),options);
		},
		updateViewForLogin: function(greenData) {
			var CO2EmissionSavingsLogin =0;
			var CostSavingsLogin =0;
			var TimeSavingsLogin =0;

			if(greenData.TIME_PT!=undefined || greenData.TIME_PT!=null)
				TimeSavingsLogin+=greenData.TIME_PT;
			if(greenData.TIME_DT!=undefined || greenData.TIME_DT!=null)
				TimeSavingsLogin+=greenData.TIME_DT;

			if(greenData.CO2_PT!=undefined || greenData.CO2_PT!=null)
				CO2EmissionSavingsLogin+=greenData.CO2_PT;
			if(greenData.CO2_DT!=undefined || greenData.CO2_DT!=null)
				CO2EmissionSavingsLogin+=greenData.CO2_DT;

			if(greenData.MONEY_PT!=undefined || greenData.MONEY_PT!=null)
				CostSavingsLogin+=greenData.MONEY_PT;
			if(greenData.MONEY_DT!=undefined || greenData.MONEY_DT!=null)
				CostSavingsLogin+=greenData.MONEY_DT;			

			document.getElementById("LogedinEstimatedGreenScore").innerHTML=this.numberWithCommas(greenData.SCORE, 0);
			document.getElementById("CO2EmissionSavingsLogin").innerHTML=this.numberWithCommas(Math.round(CO2EmissionSavingsLogin/1000),0);
			document.getElementById("CostSavingsLogin").innerHTML=this.numberWithCommas(Math.round(CostSavingsLogin), 0);
			document.getElementById("TimeSavingsLogin").innerHTML=this.numberWithCommas(TimeSavingsLogin, 1);
		},

		initialize: function(options) 
		{

			self = this;
			greenpointsMainPageViewInstance=this;
			options.phoneTitle =localize("%shell.green.points.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);

			this.$el.on("keyup", "#bus", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.costLimitHandler(this.id);
				greenpointsMainPageViewInstance.calculate();
			});

			this.$el.on("keyup", "#metro", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.costLimitHandler(this.id);
				greenpointsMainPageViewInstance.calculate();
			});

			this.$el.on("keyup", "#tram", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.costLimitHandler(this.id);
				greenpointsMainPageViewInstance.calculate();
			});
			this.$el.on("blur", "#bus", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.updateRankSlider(greenpointsMainPageViewInstance.greenData);
			});
			this.$el.on("blur", "#metro", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.updateRankSlider(greenpointsMainPageViewInstance.greenData);
			});
			this.$el.on("blur", "#tram", function(event) {
				event.preventDefault();
				event.stopPropagation();
				greenpointsMainPageViewInstance.updateRankSlider(greenpointsMainPageViewInstance.greenData);
			});

		},
		calculate: function() {
			var busVal=0;
			var metroVal=0;
			var tramVal=0;

			/*Adding this if conditions so that whenever any field value is empty will replace
			 * the empty field with zero
			 */
			if(($("#bus").val()).length==0)
			{
				busVal=0;
			}
			if(($("#metro").val()).length==0)
			{
				metroVal=0;			
			}
			if(($("#tram").val()).length==0)
			{
				tramVal=0;
			}

			if(busVal>=0&&metroVal>=0&&tramVal>=0)
			{
				if(($("#bus").val()).length>0)
				{
					busVal=parseInt($("#bus").val());
				}
				if(($("#metro").val()).length>0)
				{
					metroVal=parseInt($("#metro").val());
				}
				if(($("#tram").val()).length>0)
				{
					tramVal=parseInt($("#tram").val());
				}


				z=busVal + metroVal + tramVal;
				if(z > 10000000)
				{
					greenpointsMainPageViewInstance.dialogCostLimit();
					z = 10000000;
				}

				var greenPoints = z;

				//var time = 0;
				var co2 = 300*z;
				var money = 0.35*z;

				var myData = {};
				myData.SCORE = greenPoints;
				myData.RANK = 0;
				myData.TIME_PT = 0;
				myData.TIME_DT = 0;
				myData.CO2_PT = co2;
				myData.CO2_DT = 0;
				myData.MONEY_PT = money;
				myData.MONEY_DT = 0;


				greenpointsMainPageViewInstance.updateView(myData);
				//disable card flip
				$(this.el).off('tap', '#card');
			}
			else
			{

				var errorPopup = new Popup("customErrorPopup");
				errorPopup.options.content =localize("%shell.greenpoints.godistancecalculate.error%");
				errorPopup.show();
			}

		},

		costLimitHandler: function(id) {		
			if(id && $("#" + id)) {
				var strVal = $("#" + id).val();
				var floatVal = parseFloat(strVal);
				if(floatVal || floatVal == 0) {
					if(floatVal < 0) {
						$("#" + id).val("0");
					}
					else if(floatVal > 10000000) {
						$("#" + id).val("10000000");
						greenpointsMainPageViewInstance.dialogCostLimit();
					}
				}
				else {
					$("#" + id).val("");
				}
			}
		},

		dialogCostLimit: function() {
			var errorPopup = new Popup("customErrorPopup");
			errorPopup.options.content =localize("%shell.greenpoints.greenscoreExceedsLimit%");
			errorPopup.show();
		},
		updateView: function(greenData) {
			if(greenData)
			{
				$("#EstimatedGreenScore").html(this.numberWithCommas(greenData.SCORE, 0));
				$("#CostSavings").html(this.numberWithCommas(Math.round(greenData.MONEY_PT), 0));
				$("#EmissionSavings").html(this.numberWithCommas(Math.round(greenData.CO2_PT /1000),0));

				if (document.getElementById('CostSavings').innerHTML.length<=5){
					document.getElementById('CostSavings').style.fontSize="20px";
				}else if(document.getElementById('CostSavings').innerHTML.length==6){
					document.getElementById('CostSavings').style.fontSize="19px";
				}else if(document.getElementById('CostSavings').innerHTML.length==7){
					document.getElementById('CostSavings').style.fontSize="15px";
				}else if(document.getElementById('CostSavings').innerHTML.length==8){
					document.getElementById('CostSavings').style.fontSize="14px";
				}else if(document.getElementById('CostSavings').innerHTML.length==9){
					document.getElementById('CostSavings').style.fontSize="13px";
				}
			}
			greenpointsMainPageViewInstance.greenData=greenData;
		},
		updateRankSlider:function(greenData){
			if(!greenData)return;
			document.getElementById("rankText").style.webkitTransform='scale(0)';
			document.getElementById("rankDetails").style.webkitTransform = 'translate3d(0, 30px, 0)';

			var Rank=0;
			if (greenpointsMainPageViewInstance.MAXSCORE && greenData.SCORE >= greenpointsMainPageViewInstance.MAXSCORE){
				Rank= 100;
				var moveTo=((document.querySelector("#pointsBar").getBoundingClientRect().width - 18) * (Rank/100))
				if(getApplicationLanguage()=="ar") moveTo*=-1;
				document.querySelector("#ranker").style.webkitTransform = 'translate3d(' + moveTo+ 'px,0,0)'
				greenpointsMainPageViewInstance.updateGreenRanking(Rank);
				setTimeout(function (){
					document.getElementById("rankText").style.webkitTransform='scale(1)';
				},300);

			}else {
				GreenPointsModel.getGreenPointsRanking(greenData.SCORE, function (result){
					if (result && result.length > 0 ){
						greenpointsMainPageViewInstance.MAXSCORE=result[0].MAXSCORE;
					}
					if (result && result.length>0 && result.length!= 1){

						for(var i=0;i<result.length;i++){
							if(result[i].SCORE == greenData.SCORE){
								Rank= 100 - result[i].RANK;
								break;
							}
						}
						if (Rank ==0 ){
							var MaxRank= result[0].RANK;
							var MinRank= result[1].RANK;
							Rank= 100 - ((MaxRank+MinRank)/2);
						}
					}else {
						if (result && greenData.SCORE > result[0].MAXSCORE){
							Rank=100;
						}
					}

					var moveTo=((document.querySelector("#pointsBar").getBoundingClientRect().width - 18) * (Rank/100));
					if(getApplicationLanguage()=="ar") moveTo*=-1;
					document.querySelector("#ranker").style.webkitTransform = 'translate3d(' + moveTo + 'px,0,0)'
					greenpointsMainPageViewInstance.updateGreenRanking(Rank);

					setTimeout(function (){
						document.getElementById("rankText").style.webkitTransform='scale(1)';
					},300);


				});
			}
		},
		updateGreenRanking: function(data) {

			/*This if condition is added in caase the rank is coming from the backend by zero or -1*/
			if(data>0&& data!=undefined )
			{
				if(data){
					if(data>0&&data<25)
					{
						document.getElementById("rankText").innerHTML = localize("%shell.greenpoints.rank.degree1%"); 
						document.getElementById("rankDetails").innerHTML =" ";
						setTimeout(function(){document.querySelector("#rankDetails").style.webkitTransform = 'translate3d(0,0,0)'},300);;

					}
					else if (data>=25&&data<50)
					{
						document.getElementById("rankText").innerHTML = localize("%shell.greenpoints.rank.degree2%"); 
						document.getElementById("rankDetails").innerHTML =" ";
						setTimeout(function(){document.querySelector("#rankDetails").style.webkitTransform = 'translate3d(0,0,0)'},300);;

					}
					else if (data>=50&&data<75)
					{
						document.getElementById("rankText").innerHTML = localize("%shell.greenpoints.rank.degree3%");
						document.getElementById("rankDetails").innerHTML = localize("%shell.greenpoints.youcare%"); 
						setTimeout(function(){document.querySelector("#rankDetails").style.webkitTransform = 'translate3d(0,0,0)'},300);;
					}
					else if (data>=75&&data<=100)
					{
						document.getElementById("rankText").innerHTML = localize("%shell.greenpoints.rank.degree4%"); 
						document.getElementById("rankDetails").innerHTML = localize("%shell.greenpoints.youareallgreen%"); 
						setTimeout(function(){document.querySelector("#rankDetails").style.webkitTransform = 'translate3d(0,0,0)'},300);;
					}
				}

			}
			else
			{
				document.getElementById("rankText").innerHTML = localize("%shell.greenpoints.rank.degree1%");
				document.getElementById("rankDetails").innerHTML ="";
				setTimeout(function(){document.querySelector("#rankDetails").style.webkitTransform = 'translate3d(0,0,0)'},300);;

			}
		},
		numberWithCommas: function (x, y) {
			if(typeof x == "undefined" || x == null)
				return 0;
			if(typeof y == "undefined")
				y=2;
			return (Number(x.toFixed(y)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}
	});

//	Returns the View class
	return GreenpointsMainPageView;

});

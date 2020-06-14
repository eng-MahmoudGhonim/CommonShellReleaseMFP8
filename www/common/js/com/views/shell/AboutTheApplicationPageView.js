define(["com/views/PageView",
        "com/views/Header",
        "com/models/Constants",
        "com/utils/Utils",
        "com/models/shell/SocialSharingModel",
        "com/utils/DataUtils"
        ], function( PageView, Header ,Constants,Utils ,SocialSharingModel,DataUtils) {
	var AboutTheApplicationPageView = PageView.extend({
		events:{
			'tap #shareBtn': 'onShareBtnClick',
			'tap #rateBtn': 'onRateBtnClick',
			'pageshow':'onPageShow'
		},
		initialize: function(options)
		{
			AboutTheApplionInstance=this;
			options.phoneTitle = localize("%shell.aboutThisApp.title%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);

		},
		onShareBtnClick :function (event){
			event.preventDefault();
			var RTAAppNameTodisplay="" , shareMessage = "", sharingLink = Utils.getAppStoreLink();
			if(Constants.APP_ID == "RTA_Public_Transport"){
				RTAAppNameTodisplay=localize("%shell.welcomepage.AppName.RTA_Public_Transport%");
				shareMessage = localize("%shell.socialShare.downloadApp%")
				+ RTAAppNameTodisplay
				+ localize("%shell.socialShare.downloadApp2%");
			}else if(Constants.APP_ID == "RTA_Corporate_Services"){
				RTAAppNameTodisplay=localize("%shell.welcomepage.AppName.RTA_Corporate_Services%");
				shareMessage = localize("%shell.socialShare.downloadApp%")
				+ RTAAppNameTodisplay
				+ localize("%shell.socialShare.downloadApp2%");
			}else if(Constants.APP_ID == "RTA_Drivers_And_Vehicles"){
				shareMessage = localize("%shell.share.DubaiDrive%").replace("#STORELINK#",sharingLink);
				sharingLink=null;
			}
			SocialSharingModel.share(shareMessage,null,sharingLink);
		},
		whatIsNewViewed:function (){
			//var AboutThisAppOpened={"isOpened":true,"version":WL.Client.getAppProperty("APP_VERSION")};
      var AboutThisAppOpened={"isOpened":true,"version":Utils.APP_VERSION/*WL.Client.getAppProperty("APP_VERSION")*/};
			DataUtils.setLocalStorageData("AboutThisAppOpened",JSON.stringify(AboutThisAppOpened),false,"shell");
		},
		onPageShow:function (){
			this.whatIsNewViewed();
			var appIcon =document.querySelector(".aboutapphead #appIcon");
			if (Constants.APP_ID == "RTA_Drivers_And_Vehicles"){
				appIcon.src=window.mobile.baseUrl+"/common/images/shell/about-dubaidrive.png";
			}else if (Constants.APP_ID == "RTA_Corporate_Services"){
				appIcon.src=window.mobile.baseUrl+"/common/images/corporate/shell/corporate.png";
			}else if(Constants.APP_ID == "RTA_Public_Transport"){
				appIcon.src=window.mobile.baseUrl+"/common/images/corporate/shell/corporate.png";
			}
//			console.log(APPConfig);
			$('#appTitle').html(APPConfig.appTitle[getApplicationLanguage()]);
			$('#lastUpdated').html(APPConfig.lastUpdated);

			var descList =APPConfig.appDescription[getApplicationLanguage()];
			var whatsnewList =APPConfig.whatsNewList[getApplicationLanguage()];
			var describtionHTML = '',whatsnewListHTML = '';
			var temp = "<div class='item'><span>-</span><span>#item#</span> </div>";
			for (var i =0 ;i<whatsnewList.length;i++)
			{
				whatsnewListHTML+=temp.replace('#item#',whatsnewList[i]);
			}
			$('#whatsnewList').html(whatsnewListHTML);

			for (var i =0 ;i<descList.length;i++)
			{
				describtionHTML+=temp.replace('#item#',localize(descList[i]));
			}
			$('#descList').html(describtionHTML);

			setTimeout(function(){
			var collapsible = new Collapsible(document.querySelector(".collapseCont"));
			setTimeout(function(){

			var fromWhatsNew=DataUtils.getLocalStorageData('FromWhatsNew', "shell");
			if(fromWhatsNew)
				{
			    DataUtils.removeFromLocalStorage("FromWhatsNew","shell");
			    document.getElementsByClassName("collapseHead")[1].click();
				}
			else
				document.getElementsByClassName("collapseHead")[0].click();

			},500);},100);
		//	var appVersion = WL.Client.getAppProperty("APP_VERSION");
      var appVersion = Utils.APP_VERSION;//WL.Client.getAppProperty("APP_VERSION");
			$('#AppVersion').html(appVersion);


		},
		onRateBtnClick :function (event){
			event.preventDefault();
			if(Constants.APP_ID == "RTA_Drivers_And_Vehicles"){
				if(Utils.isAndroid()){
					window.open('market://details?id=com.rta.driversandvehicles',"_system");
				}else if(Utils.isiOS()){
					window.open('itms-apps://itunes.apple.com/app/id912748782',"_system");
				}
			}else if (Constants.APP_ID == "RTA_Corporate_Services"){
				if(Utils.isAndroid()){
					window.open('market://details?id=com.rta.corporates',"_system");
				}else if(Utils.isiOS()){
					window.open('itms-apps://itunes.apple.com/app/id912419810',"_system");
				}
			}else if(Constants.APP_ID == "RTA_Public_Transport"){
				if(Utils.isAndroid()){
					window.open('market://details?id=com.rta.publictransportation',"_system");
				}else if(Utils.isiOS()){
					window.open('itms-apps://itunes.apple.com/app/id913050130',"_system");
				}
			}
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		}

	});

	// Returns the View class
	return AboutTheApplicationPageView;

});

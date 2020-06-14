define(["com/views/PageView",
        "com/models/shell/AuthenticationModel",
        "com/models/Constants",
        "com/utils/PaymentUtils",
        "com/utils/SocialSharingUtils",
        "com/utils/FileStorageUtils",
        "com/models/shell/PaymentModel",
        "com/models/shell/ServicesDirectoryModel",
        "com/utils/DataUtils",
        "com/models/shell/OTPModel",
        "com/models/shell/NILoyaltyModel"

        ], function(PageView,AuthenticationModel, Constants, PaymentUtils, SocialSharingUtils, FileStorageUtils, PaymentModel,ServicesDirectoryModel,DataUtils,OTPModel,NILoyaltyModel) {

	var CommonShellExamplesPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		events: {
			'pageshow' : 'onPageShow',
			'tap #pushNotification':'testPushNotification',
			'tap #generateFile':'generateMinifiedFile',
			'tap #test_mstore' : 'mStoreTest',
			'tap #fileWriteBtn' : 'writeFile',
			'tap #fileReadBtn' : 'readFile',
			'tap #shareBtn1' : 'shareMessage',
			'tap #shareBtn2' : 'shareLink',
			'tap #shareBtn3' : 'shareLinkAndMessage',
			'tap #shareBtn4' : 'shareImage',
			'tap #shareBtn5':'shareLocalImage',
			'tap #shareBtn6':'shareInternetImage',
			'tap #shareBtn7':'shareLocalArrayImage',
			'tap #shareBtn8':'shareInternetImageLink',
			'tap #shareBtn9':'shareInternetImageArrayLink',
			'tap #mPayBtn':'mpayPayment',
			'tap #ePayBtn':'epayPayment',
			'tap #popup_demo':'popupDemo',
			'tap #Send_SMS_OTP':'sendSMSOTP',
			'tap #shellInterface':'shellInterface',
			'tap #trustedAgent':'trustedAgent',
			'tap #newParkingLaw':'newParkingLaw',
			'tap #myaccount':'newMyAccount',
			'tap #myaccountCorporate':'newMyAccountCorporate',

			'tap #isPushSupported':'isPushSupported',
			'tap #isSubscribed':'isSubscribed',
			'tap #subscribe':'subscribe',
			'tap #unSubscribe':'unSubscribe',
			'tap #ShowErrorConnectionPOpup':'ShowErrorConnectionPOpup',
			'tap #tagSubscribe':'tagSubscribe',
			'tap #tagUnSubscribe':'tagUnSubscribe',

			'tap #openLocations':'LocationsServices',
			'tap #openMyAccount':'OpenMyAccount',
			'tap #changeMchatURL':'ChangeMchatURL',
			'tap #OpenLinkRTAPopup':'OpenLinkPopup',
			'tap #OpenAnotherApp':'openAnotherApp',
			'tap #OpenRegisterPage':'openRegisterpage',
			'tap #NLoyaltyBalance':'GetNLoyaltyBalance',
			'tap #openServiceContent':'GetServiceContent'
		},

		GetServiceContent:function(){
			  bottonSheet=new BottonSheet();
			  bottonSheet.show("185");

			},

		GetNLoyaltyBalance:function(){
			NILoyaltyModel.getLoyalityBalance(function(result){
				document.getElementById("LoyaltyBalance").text=result;
				alert(result);
			});

		},
		openRegisterpage:function() {
			// Profile object
			var UAEPassUserProfile={
					"firstnameEN": "Faran",
					"firstnameAR": "جون",
					"lastnameEN": "Chawla",
					"lastnameAR": "سميث",
					"fullnameEN": "Faran Javed Javed Akhtar Chawla",
					"fullnameAR": "جون سميث",
					"gender": "M",
					"dob": "01/01/1973",
					"mobile": "971581486",
					"email": "faran.javed@gmail.com",
					"nationalityEN": "IND",
					"nationalityAR": "باكستان",
					"homeAddress": {
						"addressTypeCode": "01",
						"areaCode": "02 27",
						"areaDescriptionEN": "Bur Dubai",
						"areaDescriptionAR": "بر دبي",
						"cityCode": "01 55",
						"cityDescriptionEN": "Dubai",
						"cityDescriptionAR": "دبي",
						"emirateCode": "02",
						"emirateDescriptionEN": "Dubai",
						"emirateDescriptionAR": "دبي",
						"phone": "055555555",
						"poBox": "46777-2"
					},
					"idn": "784198579526207",
					"idCardNumber": "089263346",
					"idCardIssueDate": "28/05/2018",
					"idCardExpiryDate": "23/05/2021",
					"uuid": "0ECD4150-91E8-91A1-6A84-24CB3B6D147A",
					"passportNumber": "AF8674283",
					"userType": "SOP3",
					"acr": "urn:safelayer:tws:policies:authentication:level:high",
					"amr": ["urn:safelayer:tws:policies:authentication:adaptive:methods:mobileid", "urn:uae:authentication:method:verified"],
					"domain": "digitalid-users",
					"sub": "0ECD4150-91E8-91A1-6A84-24CB3B6D147A"
			}
			var UAEProfile={
					mail:UAEPassUserProfile.email,
					mobile:UAEPassUserProfile.mobile,
					first_name_en:UAEPassUserProfile.firstnameEN,
					last_name_en:UAEPassUserProfile.lastnameEN,
					nationalityEN: UAEPassUserProfile.nationalityEN,
					nationalityAR: UAEPassUserProfile.nationalityAR,
					gender:UAEPassUserProfile.gender
			}

			mobile.changePage("shell/register.html", {data:UAEProfile} );

		},
		openAnotherApp:function() {
			var parameter = null;

			//if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
      if (device.platform == "Android") {
				parameter = $('#packageName').val();
			}

			cordova.exec(function() {
				WL.Logger.info("App successfully opened");
			}, function(){
				WL.Logger.info("App failed opening");
			}, "OpenExternalAppPlugin", "openApp", [parameter]);
		},


		OpenLinkPopup:function(){

			var linkRTAAccountWithUAEPassPopup_Options = {
					popupId: "linkRTAAccountWithUAEPassPopup",
					title: localize("%shell.Login.linkUAEPassTitlePopup%"),

					content: window.Utils.applyLocalization('<div>%shell.Login.linkUAEPassSuccessfullylogged%</div>'),
					primaryBtnText: localize("%shell.dialog.button.ok%"),
					primaryBtnCallBack: function() {
						alert("juyuyu");
					},
					secondaryBtnText: localize("%shell.label.cancel%"),
					secondaryBtnCallBack: null,
					secondaryBtnVisible: true,
					secondaryBtnDisabled: false,
					hideOnPrimaryClick: true,
					hideOnSecondaryClick: true,
					aroundClickable: false,
					onAroundClick: null
			}
			var linkRTAAccountWithUAEPassPopup = new Popup(linkRTAAccountWithUAEPassPopup_Options);

			linkRTAAccountWithUAEPassPopup.show();
		},
		openAnotherApp:function() {
			var parameter = null;

      //if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
      if (device.platform == "Android") {
				parameter = $('#packageName').val();
			}

			cordova.exec(function() {
				WL.Logger.info("App successfully opened");
			}, function(){
				WL.Logger.info("App failed opening");
			}, "OpenExternalAppPlugin", "openApp", [parameter]);
		},


		OpenLinkPopup:function(){

			var linkRTAAccountWithUAEPassPopup_Options = {
					popupId: "linkRTAAccountWithUAEPassPopup",
					title: localize("%shell.Login.linkUAEPassTitlePopup%"),

					content: window.Utils.applyLocalization('<div>%shell.Login.linkUAEPassSuccessfullylogged%</div>'),
					primaryBtnText: localize("%shell.dialog.button.ok%"),
					primaryBtnCallBack: function() {
						alert("juyuyu");
					},
					secondaryBtnText: localize("%shell.label.cancel%"),
					secondaryBtnCallBack: null,
					secondaryBtnVisible: true,
					secondaryBtnDisabled: false,
					hideOnPrimaryClick: true,
					hideOnSecondaryClick: true,
					aroundClickable: false,
					onAroundClick: null
			}
			var linkRTAAccountWithUAEPassPopup = new Popup(linkRTAAccountWithUAEPassPopup_Options);

			linkRTAAccountWithUAEPassPopup.show();
		},
		ChangeMchatURL:function(){
			if(document.getElementById("mchatURLChange").value){
				Constants.CHAT_URL=document.getElementById("mchatURLChange").value;
				console.log("Chat URL is : ");
				console.log(Constants.CHAT_URL);
				alert ("URL is changed , please note this url changed only in the app session state , so if the app closed , please change it again from here!")
			}

		},
		OpenMyAccount:function(){
			mobile.changePage("shell/myaccount.html", {data:{openMyAccount:true}} );
		},

		LocationsServices:function(){
			mobile.changePage("shell/contact_rta.html", {data:{openLocations:true}} );
		},
		tagSubscribe:function(){
			subscribeToGeneralTag();
		},
		tagUnSubscribe:function(){
			unsubscribeGeneralTag();
		},

		ShowErrorConnectionPOpup:function(){

		},
		isPushSupported:function (event){

			var isupported =isPushSubscribed();



			WL.SimpleDialog.show("Push Notifications", JSON.stringify(isupported), [ {
				text : 'Close',
				handler : function() {
				}
			}
			]);
		},
		isSubscribed:function (event){

			var isSubscribed = false;
			if (WL.Client.Push){
				isSubscribed = WL.Client.Push.isSubscribed('myPush');
			}
			WL.SimpleDialog.show("Push Notifications", JSON.stringify(isSubscribed), [ {
				text : 'Close',
				handler : function() {}
			}
			]);
		},
		subscribe:function (event){
			doSubscribe();
		},
		unSubscribe:function (event){
			doUnsubscribe();
		},

		newMyAccountCorporate:function (event){
			event.preventDefault();
//			mobile.changePage("shell/arrange_dashboard_services.html");
			mobile.changePage("shell/myAccountCorporate.html");
		},

		newMyAccount:function (event){
			event.preventDefault();
//			mobile.changePage("shell/arrange_dashboard_services.html");
			mobile.changePage("shell/myaccount.html");
		},
		newParkingLaw:function (event){
			event.preventDefault();
//			mobile.changePage("shell/arrange_dashboard_services.html");
			mobile.changePage("shell/parking_law.html");
		},
		trustedAgent:function (event){
			event.preventDefault();
			mobile.changePage("shell/trusted_agents.html");
		},
		shellInterface:function(event){
			event.preventDefault();
			var user_id = "mustafazayed",
			title = "1",
			first_name = "Mustafa",
			last_name = "Zayed",
			id_number = "51665156456468",
			nationality = "51",
			mobile = "971544305865",
			mail = "mustafahassan403@gmail.com",
			preferred_language = "English",
			preferred_communication = "EMAIL",
			portal_id = "mustafazayed",
			password_changed_flag = "false";
			var invocationData = {
					adapter : 'shellInterface',
					procedure : 'setUserInfo',
          invocationContext: this,
					parameters : [user_id,
					              title,
					              first_name,
					              last_name,
					              id_number,
					              nationality,
					              mobile,
					              mail,
					              preferred_language,
					              preferred_communication,
					              portal_id,
					              password_changed_flag]
			};

			invokeWLResourceRequest(invocationData,
				function(result){
					var x = 0;
				},
				function(e) {
					var x = 0;
				}

			);
		},
		sendSMSOTP:function(){
			OTPModel.sendOTP("MustafaZayed","updateProfile","00971544305865",null,null);
		},
		initialize: function(options)
		{
			commonShellExamplesPageViewInstance = this ;
			options.phoneTitle = localize("%shell.csexamples.page.title%");
			options.subTitle="Test";
			commonShellExamplesPageViewInstance.options = options;
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow:function(){

			document.getElementById("mchatURLChange").value=Constants.CHAT_URL;
			// it mean process of paying end
			if(! isUndefinedOrNullOrBlank(commonShellExamplesPageViewInstance.options.data)){
				var options = commonShellExamplesPageViewInstance.options ;
				if('ePayComplete' in options.data ){
					commonShellExamplesPageViewInstance.getEpayResult(options.data.ePayComplete)
				}
			}
			//service dashboard usage/////////////////////////////////////
			var catId = "1";
			var infoLinks = [
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: function () {  //null for no action - string if URL to change page - or function to excecute
			                		 alert("clicked");
			                	 }
			                 },
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: "shell/FAQ.html"
			                 },
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: null
			                 }
			                 ];
			var linkingFunction= function (e){
				alert("link salik account")
			}
//			var linkingCondition= function (e){
//			return true;
//			}
			var linkingObject ={
					linkingFunction:linkingFunction
			}

			var x = new ServiceDashboardControl(catId, infoLinks,linkingObject);

			////////////////////////////////////////////////
			///////////////////// learner and drivers////////

			var catId = "1";
			var infoLinks = [
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: function () {  //null for no action - string if URL to change page - or function to excecute
			                		 alert("clicked");
			                	 },
			                	 "serviceSubCategoriesId":0
			                 },
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: "shell/FAQ.html",
			                	 "serviceSubCategoriesId":1
			                 },
			                 {
			                	 nameEn: "Frequently Asked questions",
			                	 nameAr: "أسئلة متكررة",
			                	 onclick: null,
			                	 "serviceSubCategoriesId":0
			                 }
			                 ];
			var linkingFunction= function (e){
				alert("link salik account")
			}
			var linkingObject ={
					linkingFunction:linkingFunction
			}
			var tabOptions=[{tabNameAr:"متدرب",tabNameEn:"Learner"},{tabNameAr:"سائق",tabNameEn:"Driver"}]
			var learner = new serviceDashboardWithTabsControl(catId, infoLinks,linkingObject,tabOptions);

			////////////////////////////////////////////////////////////
			/////prayer times usage/////////////////////////////////////
			////////////////////////////////////////////////////////////
			prayTimes.setMethod('Makkah');
			var today = new Date();
			var dubaiCoords = [25.276987,55.296249];
			var timezone = 'auto';
			var daylightSaving = 'auto';
			var format = '12h';
			var times = prayTimes.getTimes(today, dubaiCoords, timezone, daylightSaving,format);
			var cont = document.getElementById("prayerTimesCont");
			for(var i in times){
				var item = document.createElement("div");
				item.innerHTML = "<span>" + i + "</span>" + "<span>" + times[i] + "</span>";
				cont.appendChild(item);
			}
		},
		testPushNotification : function(event){
			event.preventDefault();
			mobile.changePage("shell/commonShellTestPushNotification.html");
		},
		mStoreTest : function(event){
			event.preventDefault();
			mobile.changePage("shell/mstore_cover.html");
		},
		writeFile : function(event){
			event.preventDefault();
			try{
				var file = $("#filePath").val();
				var data = $("#fileData").val();

				//file = 'file://' + blackberry.io.home + '/log.txt';
				FileStorageUtils.write(file,data,function(filePath,resultCode,resultDetails){
					var message='';
					message= resultDetails;
					if(resultCode == 0)
					{
						message = localize("%shell.popup.success.title%") +"  "+message;

					}
					else
					{
						message= localize("%shell.popup.error.title%")+"  "+ message;
					}
					var errorPopup = new Popup("customErrorPopup");
					errorPopup.options.content =message;
					errorPopup.show();
				});
			}catch(e){
				var generalErrorPopup = new Popup('generalErrorPopup');
				generalErrorPopup.show();
			}
		},
		readFile : function(event){
			event.preventDefault();
			// un-sandbox file system to access shared folder
			blackberry.io.sandbox = false;


			window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0,
					function (fs) {
				// in order to access the shared folder,
				// config.xml must declare the "access_shared" permission
				// reference file by absolute path since file system is un-sandboxed
				fs.root.getFile(blackberry.io.home + '/documents/test.txt', {create: true},
						function (fileEntry) {
					fileEntry.file(function (file) {
						var reader = new FileReader();

						reader.onloadend = function (e) {
							var txtArea = document.createElement('textarea');
							txtArea.value = this.result;
							document.body.appendChild(txtArea);
						};

						reader.readAsText(file);
					}, errorHandler);
				}, errorHandler);
			});
			function errorHandler(e) {
				var msg = '';

				switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
				break;
				};

				console.log('Error: ' + msg);
			}

			readFile();
		},
		shareMessage : function(event){
			event.preventDefault();
			var message = "Test Message";
			SocialSharingUtils.share(message , null, null);
		},
		shareLink : function(event){
			event.preventDefault();
			var link = "http://google.com";
			SocialSharingUtils.share(null , null, link);
		},
		shareLinkAndMessage : function(event){
			event.preventDefault();
			var message = "Test Message";
			var link = "http://google.com";
			SocialSharingUtils.share(message , null, link);
		},
		shareImage :  function(event){
			event.preventDefault();
			var InternetImage = 'http://icons.iconarchive.com/icons/benjigarner/glassy-software/256/WLM-icon.png';
			SocialSharingUtils.share(null , InternetImage, null);
		},
		shareLocalImage : function (event){
			event.preventDefault();
			var LocalImage = 'data:image/jpeg;base64,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';
			SocialSharingUtils.share(null , LocalImage, null);
		},
		shareInternetImage : function(event){
			event.preventDefault();
			var InternetImage = ['http://icons.iconarchive.com/icons/benjigarner/glassy-software/256/WLM-icon.png','http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Actions-fill-color-icon.png'];
			SocialSharingUtils.share(null , InternetImage, null);
		},
		shareLocalArrayImage: function(event){
			event.preventDefault();
			var LocalImageArray = ['data:image/jpeg;base64,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',
			                       'data:image/jpeg;base64,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'];

			SocialSharingUtils.share(null , LocalImageArray, null);
		},
		shareInternetImageLink : function(event){
			event.preventDefault();
			var InternetImage = 'http://icons.iconarchive.com/icons/benjigarner/glassy-software/256/WLM-icon.png';
			var link = "http://google.com";
			SocialSharingUtils.share(null , InternetImage, link);
		},
		shareInternetImageArrayLink : function(event){
			event.preventDefault();
			var InternetImage = ['http://icons.iconarchive.com/icons/benjigarner/glassy-software/256/WLM-icon.png','http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/256/Actions-fill-color-icon.png'];
			var link = "http://google.com";
			SocialSharingUtils.share(null , InternetImage, link);
		},
		mpayPayment : function(event){
			event.preventDefault();
			var dataToEncrypt = {};
			var sptrn = 'RTATEST' + Math.floor((Math.random() * 100000000)).toString();
			dataToEncrypt.AMOUNT = $("#mPayAmount").val();
			dataToEncrypt.SPTRN = sptrn;
			var invocationData = {
					adapter : "PaymentEncryptionTestAdapter",
					procedure : "encryptData",
					parameters : [ JSON.stringify(dataToEncrypt), Constants.APP_ID, 'MPAY']
			};
			invokeWLResourceRequest(invocationData,
				function(result){
					dsgParams = {
							EDATA:result.invocationResult.cypherText, //Encrypted data
							AMOUNT:dataToEncrypt.AMOUNT,
							CHANNEL:"MobileApp",
							DEP_SRV_CODE:"Mobile",
							DEP_SRV_NAME:"Mobile",
							DESCRIPTION:"test for register transaction",
							KEY_VERSION:"1",
							SP_TRN: dataToEncrypt.SPTRN, // has to be unique
							SERVICEID:"171",
							SERVICE_ACCOUNT_ID:"SERVICE_ACCOUNT_ID",
							BENIFICIARYTYPE:"Individual"
					};
					dsgParams.Services="CS";
					PaymentUtils.performMPay(dsgParams, 'shell/commonShellExamples.html');
				},
				function(){
					var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();
				}
			);
		},
		epayPayment : function(event){
			event.preventDefault();
			var dataToEncrypt = {};

			$(".ui-loader").show();
			var sptrn = 'RTATEST' + Math.floor((Math.random() * 100000000)).toString();
			dataToEncrypt.AMOUNT = $("#ePayAmount").val();
			dataToEncrypt.SPTRN = sptrn;
			var invocationData = {
					adapter : "PaymentEncryptionTestAdapter",
					procedure : "encryptData",
					parameters : [ JSON.stringify(dataToEncrypt), Constants.APP_ID, 'EPAY']
			};
			//Calling adapter
			invokeWLResourceRequest(invocationData,
				function(result){
					var DSGOptions = {
							EDATA:result.invocationResult.cypherText, //Encrypted data
							SERVICEID:'171',
							SERVICE_ACCOUNT_ID:'SERVICE_ACCOUNT_ID',
							BENIFICIARYTYPE: 'Individual',
							ACCOUNTID:'ACCOUNTID'
					};
					DSGOptions.SPTRN = sptrn;
					DSGOptions.Services="CS";
					DSGOptions.PROVIDER_APPNAME = "CS";
					PaymentUtils.performEPay($(".ui-loader"),DSGOptions,function(data){
						var popupObject = {};
						// is mean URL back Successfuly
						if(data.ePayComplete){
							DataUtils.setLocalStorageData("iframeURL",data.URL,false,"shell");
							DataUtils.setLocalStorageData("DSGOptions",DSGOptions,false,"shell");
							mobile.changePage("shell/iframe_web_page.html",{data:{URL:data.URL,previousURL:(window.location.hash).substring(1)}});
						}
						else{
							//show your payment error message

							var errorPopup = new Popup("customErrorPopup");
							errorPopup.options.content ='ePay did not complete';
							errorPopup.show();
						}
					});
				},
				function(){
					var generalErrorPopup = new Popup('generalErrorPopup');
					generalErrorPopup.show();				}
			);
		},
		getEpayResult : function(ePayComplete){

			if(ePayComplete == 'true'){
				// if payment is successful query your trasaction on Common shell
				var DSGOptions = DataUtils.getLocalStorageData("DSGOptions","shell");
				DataUtils.removeFromLocalStorage("DSGOptions","shell");
				PaymentModel.ePayQueryTransaction(DSGOptions,function(data){
					var message='';
					if(data.isSuccessful){
						message= 'Payment code: '+ data.code + '\n\rPayment message: ' + data.msg;
					}
					else{
						message = 'ePay query not successful but ePay completed';
					}

//					var errorPopup = new Popup("customErrorPopup");
//					errorPopup.options.content =message;
//					errorPopup.show();
					console.log(message);

				});
			}
			else{
				// if Payment is not successful show your error message
				var errorPopup = new Popup("customErrorPopup");
				errorPopup.options.content ='ePay did not complete';
				errorPopup.show();

			}
		},
		popupDemo : function(event){
			event.preventDefault();
			var demoPopup_Options = {
					popupId: "demoPopupPopup",
					title:localize("%shell.popup.demo.title%"),
					content: localize("%shell.popup.demo.text%"),
					primaryBtnText:  localize("%shell.dialog.button.ok%"),
					primaryBtnCallBack: function(){
						mobile.changePage("shell/home.html");
					},
					primaryBtnDisabled: false,
					secondaryBtnText: null,
					secondaryBtnCallBack: null,
					secondaryBtnVisible: false,
					secondaryBtnDisabled: false,
					hideOnPrimaryClick: true,
					hideOnSecondaryClick: true,
					aroundClickable: true,
					onAroundClick:  function(){
						mobile.changePage("shell/home.html");
					}
			}

			var demoPopupPopup = new Popup(demoPopup_Options);
			demoPopupPopup.show();
		},
		generateMinifiedFile : function(event){
			event.preventDefault();
			$.getJSON( window.mobile.baseUrl +"/common/data/fallback_services_list.json", function( data ) {

				var serviceItem='';
				for(var i=0;i<data.length;i++)
				{
					serviceItem=serviceItem+'{';
					serviceIDTOWrite='"'+'serviceID'+'":'+data[i].serviceID+',\n' ;
					serviceName_ENToWrite='"'+'serviceName_EN' +'":"'+data[i].serviceName_EN+'",\n';
					serviceGroupIDToWrite='"'+'serviceGroupID'+'":"'+data[i].serviceGroupID+'",\n';
					serviceGroupName_ENToWrite='"'+'serviceGroupName_EN'+'":"'+data[i].serviceGroupName_EN+'",\n';
					if(data[i].onlineServiceLink)
						onlineServiceLinktoWrite='"'+'onlineServiceLink'+'":"'+data[i].onlineServiceLink+'",\n';
					else
						onlineServiceLinktoWrite='"'+'onlineServiceLink'+'":"",\n';
					serviceName_ARToWrite='"'+'serviceName_AR'+'":"'+data[i].serviceName_AR+'",\n';
					serviceGroupName_ARToWrite=	'"'+'serviceGroupName_AR'+'":"'+data[i].serviceGroupName_AR+'",\n';
					if(data[i].mobileWebLink)
						mobileWebLinkToWrite='"'+'mobileWebLink'+'":"'+data[i].mobileWebLink+'"';
					else
						mobileWebLinkToWrite='"'+'mobileWebLink'+'":""';
					serviceItem=serviceItem+serviceIDTOWrite+serviceName_ENToWrite+serviceGroupIDToWrite+serviceGroupName_ENToWrite+onlineServiceLinktoWrite+serviceName_ARToWrite+serviceGroupName_ARToWrite+mobileWebLinkToWrite+'},\n';
				}
				var ServiceWholeList='['+serviceItem+']';
			});
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return CommonShellExamplesPageView;

});

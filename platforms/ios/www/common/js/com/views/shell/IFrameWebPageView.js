
define([
        "com/views/PageView", 
        "com/models/Constants",
        "com/utils/DataUtils",
        "com/utils/Utils",
        "com/views/Header",
        "com/models/shell/HapinessMeterRatingModel"

        ], function( PageView, Constants,  DataUtils, Utils,Header,HapinessMeterRatingModel) {

	// Extends PageView class
	var IFrameWebPageView = PageView.extend({
		template:{},
		events: {
			'pageshow':	'onPageShow',
			'pageshow':	'onPageShow',
			'tap .closeContainer':	'closeIFrame'
		},
		initialize : function(options) {
			IFrameWebPageViewInstance = this;

			var iframe = DataUtils.getLocalStorageData("iframeURL","shell");
			DataUtils.removeFromLocalStorage("iframeURL","shell");

			IFrameWebPageViewInstance.URL = iframe?iframe:'';
			IFrameWebPageViewInstance.previousURL = options.data.previousURL?options.data.previousURL:'';
			authHandlerThread = null ; 
			if(!options){
				options = {};
			}
			options.hideSidePanel = true;
			options.headerState = Header.STATE_ONLY_MENU;
			options.phoneTitle = localize("%shell.payment.title%");
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow : function(e){
			e.preventDefault();

			if(IFrameWebPageViewInstance.URL)
			{
				var win= window.open(IFrameWebPageViewInstance.URL, "EpayWindow","location=no");

				win.addEventListener( "loadstop", function(event){
					console.log("loadstart");

					if (event.url.indexOf('ePayReceiver/EpayRedirect') != -1) {
						setTimeout(function(){ win.close(); }, 1000);
						var iframeData = {
								data: {
									ePayComplete: true
								}
						};
						mobile.changePage(IFrameWebPageViewInstance.previousURL, iframeData);
						//HapinessMeterRatingModel.showHappinessMeter(true);
					}

				});

				//handle press back from mobile 
				win.addEventListener( "exit", function(event){
					console.log("exit");

						win.close(); 
						var iframeData = {
								data: {
									ePayComplete: true
								}
						};
						if(typeof IFrameWebPageViewInstance != "undefined") 
						mobile.changePage(IFrameWebPageViewInstance.previousURL, iframeData);
	
				});	

				win.addEventListener( "loaderror", function(event){
					console.log("loaderror");

					win.executeScript({
						code: "window.shouldClose"
					},function(){alert("error connection");win.close();});

				});	
			}
			else
			{
				mobile.changePage("shell/dashboard.html");
			}

			$(".ui-loader").hide()
		},
		/*closeIFrame : function(e){
			e.preventDefault();
			if(window.frames['iframeSource'].location.href.indexOf('ePayReceiver/EpayRedirect') != -1 ){
				mobile.changePage(IFrameWebPageViewInstance.previousURL,{data:{ePayComplete:true}});
				HapinessMeterRatingModel.showHappinessMeter(true);
			} else{
				mobile.changePage(IFrameWebPageViewInstance.previousURL,{data:{ePayComplete:false}});
			}

		},*/
		dispose: function() {
			delete IFrameWebPageViewInstance;
			PageView.prototype.dispose.call(this);
		},
	});

	// Returns the View class
	return IFrameWebPageView;

});

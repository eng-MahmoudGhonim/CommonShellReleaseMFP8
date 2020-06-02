function getLocation(callback){
	try {
		window.uaewin.executeScript({
			code: "(function(){ return window.location.href;  })();"
		},  function(params) {
			console.log("Redirected! 2");
			console.log(params);
			if(typeof params[0] === 'string' && params[0].indexOf("code")>-1){
				callback(params)
			}else{
				getLocation(callback);
			}
		});
	}catch(e){console.log(e)}
}
function handleOpenURL(url) {
	console.log("received url: " + url);
	
	var Constants = require("com/models/Constants");
	var appURLSchema = Constants.APP_URL_SCHEMA;
	var uaeSuccessCallBackURL = appURLSchema+":///resume_authn?url=";
	var uaeFailureCallBackURL = appURLSchema+":///resume_authn?url=";

//	"uaepassdemoapp:///resume_authn?url=""uaepassdemoapp:///dont_resume_authn?url="
	if (url.indexOf(uaeSuccessCallBackURL)>-1){
		var uaePassURL= url.split(uaeSuccessCallBackURL)[1];
		window.uaewin.addEventListener( "loadstart", function(event){
			console.log(event);
			console.log("loadstart after handleOpenURL");
			LoginViewInstance.handleRecievedUAEPassCode(event.url);
		});
		window.uaewin.executeScript({
			code: "window.location = '"+uaePassURL+"';"
		}, function(params) {
			console.log("Redirected");
			console.log(params);
		});
	}else if (url.indexOf(uaeFailureCallBackURL)>-1){
		var uaePassURL= url.split(uaeFailureCallBackURL)[1];
		console.log("Failed to login to UAE PASS");
		$('.ui-loader').hide();
		if (LoginViewInstance && LoginViewInstance.LoginPopup){
			LoginViewInstance.LoginPopup.hide();
		}
		setTimeout(function() {
			var _UAEPassCancelledPopup =new Popup("UAEPassCancelledPopup"); 
				_UAEPassCancelledPopup.show();
		}, 300);
	}
}


/* JavaScript content from js/com/utils/shell/loader.js in folder common */



window.myopen = window.open;
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	cordova.exec(function(res) {}, function(error) {}, "WebviewSetting", "set", []);
//    FastClick.attach(document.body);
	var iOSversion = function() {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	}
    var iOSPhone = navigator.userAgent.match(/iphone|ipad|ipod/i);
    if(!iOSPhone){FastClick.attach(document.body);}
	try {
		var updateStatusBar = navigator.userAgent.match(/iphone|ipad|ipod/i);
		if (updateStatusBar && iOSversion()[0] > 7) {
			StatusBar.overlaysWebView(false);
			StatusBar.show();
		}
	} catch (e) {
		console.log(e);
	}
	//var env = WL.Client.getEnvironment();
	//if (env == WL.Environment.BLACKBERRY10) {
		window.open = window.myopen;
	//}
};

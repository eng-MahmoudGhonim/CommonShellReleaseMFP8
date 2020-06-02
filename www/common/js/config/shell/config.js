window.appInitialized=false;
window.loginProcessing=false;
var showLogs = true; //Enable or disable console log here
if (showLogs) {
	//This will reset value in wlInitOptions (originally set in initOptions.js)
	//so no need to change it elsewhere.
	//MGRT71
	//wlInitOptions.logger.enabled = true;
	//wlInitOptions.logger.level = 'debug';
	//WL.Logger.config({level: 'debug', stringify: true, pretty: false, tag: {level: false, pkg: true}, filters: {'':'debug'}});
//	console.log = function(text) {
//		WL.Logger.log('log',text);
//	}

} else {
	//MGRT71
	//wlInitOptions.logger.enabled = false;
	WL.Logger.config({filters: {'disableLogger':'fatal'}});
	console.log = function() {}
}
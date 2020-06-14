// Uncomment the initialization options as required. For advanced initialization options please refer to IBM Worklight Information Center

 var wlInitOptions = {

	// # Should application automatically attempt to connect to Worklight Server on application start up
	// # The default value is true, we are overriding it to false here.
	//MGRT71
    //connectOnStartup : false,

	// # The callback function to invoke in case application fails to connect to Worklight Server
	// onConnectionFailure: function (){},

	// # Worklight server connection timeout
	timeout: 30000,

	// # How often heartbeat request will be sent to Worklight Server
	heartBeatIntervalInSecs: 20 * 60,
	showIOS7StatusBar:false,
  autoHideSplash:true
	// # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest (JSONStore) on iOS or Android.
	//   Requires the FIPS 140-2 optional feature to be enabled also.
	//enableFIPS : false,

	// # Application Logger, see documentation under WL.Logger for more details.
    // - enabled - Determines if log messages are shown (true) or not (false)
    // - level - Logging level, most to least verbose: 'debug', 'log', 'info', 'warn', 'error'
    // - stringify - Turn arguments into strings before printing to the console (true) or not (false)
    // - pretty - Turns JSON Objects into well spaced and formated strings.
    // - tag.level - Append a level tag (e.g. [DEBUG] Message) to the message.
    // - tag.package - Append the package tag  (e.g. [my.pkg] Message) to the message if there is one
    // - whitelist - Array of package names to show (e.g ['my.pkg'])
    // - blacklist - Array of package names to ignore (e.g ['my.pkg'])
	//MGRT71
	//logger : {enabled: false, level: 'error', stringify: true, pretty: false,
		//tag: {level: false, pkg: true}, whitelist: [], blacklist: []},

 	//#Application Analytics
	// - enabled - Determines if analytics messages are sent to the server
	// - url - server that receives the analytics data (default: [worklight-server]/analytics)
	//MGRT71
	//analytics : {
		//enabled: false
		////url : ''
	//}

	// # The options of busy indicator used during application start up
	//busyOptions: {text: "Loading..."}
};

if (document.addEventListener) {
      document.addEventListener('mfpjsloaded', function() { console.log("addEventListener WL.Client.init"); WL.Client.init(wlInitOptions); console.log("addEventListener WL.Client.init DONE");}, false);
} else if (window.attachEvent) {
      document.attachEvent('mfpjsloaded',  function() { console.log("attachEvent WL.Client.init"); WL.Client.init(wlInitOptions);console.log("attachEvent WL.Client.init Done"); });
}
// if (document.addEventListener) {
//       document.addEventListener('mfpjsloaded', function() { WL.Client.init(wlInitOptions); }, false);
// } else if (window.attachEvent) {
//       document.attachEvent('mfpjsloaded',  function() { WL.Client.init(wlInitOptions); });
// }

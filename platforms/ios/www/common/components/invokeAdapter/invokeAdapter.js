(function(){
	'use strict';

	var MFP = (function () {
		'use strict';
		// Instance stores a reference to the Singleton
		var instance;

		function init() {





			var callResource = function (appName,googleAPI,query, options, callback){
				try {


					var resourceRequest = new WLResourceRequest("/adapters/CallTestAdapter/getFeedFiltered", WLResourceRequest.POST);
					resourceRequest.setQueryParameter("params", "['MobileFirst_Platform']");

//					resourceRequest.setHeaders({"adapter":["CallTestAdapter"]})
//					resourceRequest.setHeader('Content-Type2','application/x-www-form-urlencoded');

					resourceRequest.send().then(
							function (result){
								result.adapter="CallTestAdapter";
								loadFeedsSuccess(result);
							},
							loadFeedsFailure
					);


				}catch(e){}

				function loadFeedsSuccess(result){
					WL.Logger.debug("Feed retrieve success");
					busyIndicator.hide();
					if (result.responseJSON.Items.length>0) 
						displayFeeds(result.responseJSON.Items);
					else 
						loadFeedsFailure();
				}

				function loadFeedsSuccess(result){
					WL.Logger.debug("Feed retrieve success");
					busyIndicator.hide();
					if (result.responseJSON.Items.length>0) 
						displayFeeds(result.responseJSON.Items);
					else 
						loadFeedsFailure();
				}		


			}
			return {

				callResource:callResource

			};

		};

		return {

			// Get the Singleton instance if one exists
			// or create one if it doesn't
			getInstance: function () {

				if ( !instance ) {
					instance = init();
				}

				return instance;
			}

		};

	})();
	window.MFP = MFP;
})();






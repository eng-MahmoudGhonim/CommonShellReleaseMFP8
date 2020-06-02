define(["com/models/Constants",
        "com/utils/DataUtils",
        "com/views/PageView",
        "com/views/Header",
        "com/utils/Utils",
        
        ],
        function(Constants, DataUtils, PageView, Header,
        		 Utils) {
		var DriveModePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
		},
		initialize: function(options) {
 			language = getApplicationLanguage();
			options.phoneTitle = "%shell.drivemode.title%";
			options.headerState = Header.STATE_MENU; 
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function() {
			document.querySelector("#drivemodeCont div").style.webkitTransform = "scale(1)"
			document.querySelector("#drivemodeCont span").style.webkitTransform = "scale(1)";
		 
		},
		 
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},


	});

	// Returns the View class
	return DriveModePageView;

});

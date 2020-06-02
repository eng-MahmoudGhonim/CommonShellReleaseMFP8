define(["com/views/PageView", "com/views/Header"], function(PageView, Header) {
    var CustomAlertsPageView = PageView.extend({
        events: {
            'pageshow': 'onPageShow'
        },
        initialize: function(options) {
            options.headerState = Header.STATE_MENU;
            options.phoneTitle = localize("%shell.sidepanel.notifications%");
			options.subTitle=localize("%shell.incidentDetection.IncidentDetection%");
            PageView.prototype.initialize.call(this, options);
        },
        onPageShow: function() {
        	
        document.querySelector("#preferredLocationAlert").addEventListener('click',function(){
			mobile.changePage("shell/preferred_location.html");
		});
        },
        dispose: function() {
            PageView.prototype.dispose.call(this);
        }
    });
    return CustomAlertsPageView;
});
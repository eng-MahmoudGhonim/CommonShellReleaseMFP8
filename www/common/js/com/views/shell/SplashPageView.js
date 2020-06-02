define(["com/views/PageView",
        "com/views/Header",
        "com/utils/Utils",
        "com/models/Constants"

        ], function(PageView, Header,Utils,Constants) {
	var SplashPageView = PageView.extend({
		events:{
			'pageshow' : 'onPageShow'
		},
		initialize : function(options) {
			SplashPageViewInstance = this ;
			options.hideFooter = true;
			options.hideHeader=true;
			PageView.prototype.initialize.call(this, options);
		},

		onPageShow : function(event){
			event.preventDefault();
			try {
				document.getElementById("readtcbtn").onclick= function (){
					mobile.changePage("shell/TermsAndPolicies.html", {data:{isOpenedFromSplash:true}});
				};
				document.getElementById("tcBtn").onclick= function (){
					localStorage.setItem("shellPrivacyVN",Constants.privacyVN);
					localStorage.setItem("shellTermsVN",Constants.termsVN);
					Utils.loadHomePage();
				};
				
				
			}catch(e){}
		},
		dispose : function() {
			PageView.prototype.dispose.call(this);
		}
	});

	return SplashPageView;
});
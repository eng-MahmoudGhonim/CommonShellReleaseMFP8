define([ 
		
		"jquery", 
		"backbone",
		"com/views/PageView",
		"com/models/shell/MyFinesModel",
		

	
	], function( $, Backbone, PageView, MyFinesModel ) {
		
    // Extends PagView class
    var MyFinesPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function(options) 
        {
        	var self = this;
        	 
			 
        	options.phoneTitle = Globalize.localize("%shell.myfines.title%", getApplicationLanguage());
			PageView.prototype.initialize.call(this, options);
			
			
			var data = MyFinesModel.getData();
			$('#dateInfo').html(data.Date);
			$('#refrenceNumberInfo').html(data.RefrenceNumber);
			$('#receiptContent').html(data.Receipt);
			$('#saveLbl').html(Globalize.localize("%shell.myfines.saveconfirm%", getApplicationLanguage()) + " "+ data.RefrenceNumber + " " + Globalize.localize("%shell.myfines.saveconfirm2%", getApplicationLanguage()) );
			
			this.$el.on("tap", "#greyX", function(event) {
				event.preventDefault();
				$("#greyX").attr("src","../../common/images/shell/greenXsign.png");
				$("#greyCheck").attr("src","../../common/images/shell/greychecksign.png");

			});
			
			this.$el.on("tap", "#greyCheck", function(event) {
				event.preventDefault();
				$("#greyCheck").attr("src","../../common/images/shell/greenchecksign.png");
				$("#greyX").attr("src","../../common/images/shell/greyXsign.png");
			});
			
			
			this.$el.on("tap", "#Reciept", function(event) {
				event.preventDefault();
				$("#positionWindow2").popup("open");
			});
			
			this.$el.on("tap", "#Done", function(event) {
				event.preventDefault();
				mobile.changePage("shell/home.html");
			});
			
			this.$el.on("tap", "#okFines", function(event) {
				event.preventDefault();
				$("#positionWindow2").popup("close");
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
    return MyFinesPageView;

});










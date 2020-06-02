define([
		
		"jquery", 
		"backbone"
		
	], function($, Backbone) 
	{

	var MyFinesModel = Backbone.Model.extend({},
	{
		
		getData:function(){
			
			data = {
					
					Date:"05/05/2014",
					RefrenceNumber:"123",
					Receipt:"Total cost 1000",
				
			};
			
			return $.extend(true, {}, data);
			
		},
		
		showMyFines:function(serviceID){
			
			var params = {};
			params.ID = serviceID;
			mobile.changePage("shell/my_fines.html", {data:params} );
		}
		
	});

	return MyFinesModel;

});
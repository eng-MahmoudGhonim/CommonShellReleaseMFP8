(function(){
	"use strict";

	var serviceConfig = {
		RTA_Public_Transport:{
			MobileVerification:true,
			Registeration:true,
			Profile:true,
			ChangePassword:true,
			ForgotPassword:null
		},
 	    RTA_Corporate_Services:{
 	    	MobileVerification:true,
			Registeration:false,
			Profile:true,
			ChangePassword:true,
			ForgotPassword:null
			 
 	    },
 	    RTA_Drivers_And_Vehicles:{
 	    	MobileVerification:true,
 	    	Registeration:true,
			Profile:true,
			ChangePassword:true,
			ForgotPassword:null
 	    }
	}
	
	window.CommonShellServicesConfig = serviceConfig;
	
})();

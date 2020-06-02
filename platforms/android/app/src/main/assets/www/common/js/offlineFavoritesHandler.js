define([
        "com/models/shell/UserProfileModel",
        "com/models/shell/GroupingModel"
       ], function(UserProfileModel,GroupingModel) {

	document.addEventListener("online", updateOfflineFavs, false);
	
	function updateOfflineFavs(){
		var stack = UserProfileModel.getFavFromStack();
		if(stack.length > 0){
			GroupingModel.syncUserFavoriteServices(function(){});
		}
	}
	
});
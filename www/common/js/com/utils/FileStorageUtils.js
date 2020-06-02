define([

	"jquery",
	"backbone",	
	"com/models/shell/FileStorageModel"

], function($, Backbone,FileStorageModel) {

	var FileStorageUtils = Backbone.Model.extend({}, {
	
	createDirectory:function(directoryName)
	{
		return FileStorageModel.createDirectory(directoryName);
	},
	write:function(path , content, operationCallback){
	
		FileStorageModel.write(path , content, operationCallback);
	},
	
	
	read:function(path , operationCallback){
		
		FileStorageModel.read(path , operationCallback);
	},
	
	remove:function(path){
		
		FileStorageModel.remove(path);
	},
	
	/**
	 * get data from file storage
	 * @param key, string
	 * @return data, string
	 */
	getLocalStorageData: function(key, moduleName)
	{
		return FileStorageModel.getLocalStorageData(key, moduleName);
	},
	
	/**
	 * set data to file storage
	 * @param key, string
	 * @param value, string
	 * @param encrypted, boolean
	 */
	setLocalStorageData: function(key, value, encrypted, moduleName) {
		
		return FileStorageModel.setLocalStorageData(key, value, encrypted, moduleName);
		
	},
	
	/**
	 * remove data from file storage
	 * @param key, string
	 * @param moduleName, string
	 */
	removeFromLocalStorage: function(key, moduleName) {
		if(!moduleName) 
			moduleName="";
		window.localStorage.setItem(moduleName + key, "");
		window.localStorage.removeItem(moduleName + key);
	}
	
	});
	

	return FileStorageUtils;

});

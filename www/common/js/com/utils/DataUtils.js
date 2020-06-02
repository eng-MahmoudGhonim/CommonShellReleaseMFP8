define([

		"jquery",
		"backbone",
		"com/models/Constants",

	], function($, Backbone, Constants)
	{

	var DataUtils = Backbone.Model.extend({},

	{

		//Deeb: require is defined, using module's path as starting point
		LOCALIZATION_JSON : "common/data/localizations/mapping.json",

		/**
		 * load the json data and store in memory
		 * @param file, string path to the file
		 * @param onResultHandler, function to receive the data
		 * @param async, boolean [optional]
		 */
		_getJSONData: function(file, onResultHandler, async)
		{
			$.ajax({
				type: "GET",
				url: MobileRouter.baseUrl + '/' + file,
				async: typeof async == "undefined" ? true : async,
				cache: true,
				dataType: "json",
				success: function(data){
					if(onResultHandler){
						onResultHandler(data);
					}
				}
			});
		},

		/**
		 * initialize localization
		 * load all culture files
		 * @param onInitialized, function
		 */
		initLocalization: function(onInitialized)
		{
			var onData = function(mapping)
			{
				var cultureFiles = [];
				for(var language in mapping)
				{
					var cultureFile = mapping[language].culture;
					if(cultureFile) {
						cultureFiles.push(MobileRouter.baseUrl + '/' + cultureFile); //fixing paths for intialization
					}
				}

				//load all culture files
				require(cultureFiles, function(){
					if(onInitialized) {
						onInitialized();
					}
				});
			};
			DataUtils._getJSONData(DataUtils.LOCALIZATION_JSON, onData);
		},

		/**
		 * load a language file and unload all others
		 * @param language, language code string
		 * @param onLoaded, function
		 */
		loadLanguage: function(language, onLoaded)
		{
			var self = this;

			//reset translations for all languages except for the default language
			for(var languageCode in Globalize.cultures) {
				if(languageCode != Constants.SETTINGS_DEFAULT_LANGUAGE) {
					var culture = Globalize.cultures[languageCode];
					culture.messages = {};
				}
			}

			//load selected language file into memory if exists
			var onData = function(mapping)
			{
				if(mapping.hasOwnProperty(language))
				{
					for (var item in mapping) {
						self.loadLanguageFiles(language, item, mapping, onLoaded);
					}
				}
				else {
					console.warn("Language not found in mapping: " + language);
				}
			};

			this._getJSONData(this.LOCALIZATION_JSON, onData);
		},

		loadLanguageFiles: function(langTarget, langType, mapping, onLoaded) {
			var languageFile = mapping[langType].language;
			if(languageFile)
			{
				$.getJSON(MobileRouter.baseUrl + '/' + languageFile, function(data, textStatus, jqXHR){
					Globalize.addCultureInfo(langType, { messages: data });
					if(onLoaded && langTarget == langType) {
						onLoaded();
					}
				}).fail(function(){
					console.warn("Language file failed to load for " + langType);
				});
			}
			else {
				console.warn("No language file found for " + langType);
			}
		},

		/**
		 * get all the loaded cultures in an array sorted alphabetically
		 * @param none
		 * @return cultures, array of Globalize.culture objects
		 */
		getAllCulturesAlphabetically: function()
		{
			var cultures = [];
			for(var languageCode in Globalize.cultures)
			{
				var culture = Globalize.cultures[languageCode];
				if(languageCode != "default") {
					cultures.push(culture);
				}
			}

			function sortAlphabetically(a,b) {
				if (a.language < b.language)
					return -1;
				if (a.language > b.language)
			  		return 1;
				return 0;
			}
			cultures.sort(sortAlphabetically);
			return cultures;
		},

		/**
		 * get data from local storage
		 * @param key, string
		 * @return data, string
		 */
		getLocalStorageData: function(key, moduleName)
		{
			if(!moduleName)
				moduleName="";
			var data = window.localStorage.getItem(moduleName + key);
			return data;
		},

		/**
		 * set data to local storage
		 * @param key, string
		 * @param value, string
		 * @param encrypted, boolean
		 */
		setLocalStorageData: function(key, value, encrypted, moduleName) {
			if(!moduleName)
				moduleName="";
			window.localStorage.setItem(moduleName + key, value);
		},

		/**
		 * remove data from local storage
		 * @param key, string
		 * @param moduleName, string
		 */
		removeFromLocalStorage: function(key, moduleName) {
			if(!moduleName)
				moduleName="";
			window.localStorage.setItem(moduleName + key, "");
			window.localStorage.removeItem(moduleName + key);
		},

		setLocalStorageDataWithTime:function(key,value, moduleName){
			if(!moduleName)
				moduleName="";
			window.localStorage.setItem(moduleName + key, "");
			window.localStorage.removeItem(moduleName + key);
		},

		getLocalStorageDataWithTime:function(){

		}


	});

	return DataUtils;

});

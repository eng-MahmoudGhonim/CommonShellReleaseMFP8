define([

	"jquery",
	"backbone"	

], function($, Backbone) 
{

	var FileStorageModel = Backbone.Model.extend({},
	{		
			createDirectory:function(directoryName)
			{
				var result = null;
				window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				        fileSystem.root.getDirectory(directoryName, 
				            {create: true, exclusive: false},
				            function(){result = true;}
				            , function(){result =  false; }); }
				    			, function(){result = false;});	
			    
				return result;

			},
			
			/*
			onCreateDirectoryOperationCompleted:function(resultCode)
			{
				console.log(resultCode);
			},
			*/
			
			write:function(filePath , content, operationCallback){
				
				
				function onWriteOperationFailed(evt)
				{					
					operationCallback(filePath, 1, "Failed to write file with error");
					console.log(evt);
				}
				
				 window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				        fileSystem.root.getFile(filePath, 
				            {create: true, exclusive: false}, function(fileEntry) {
				                fileEntry.createWriter(function(writer) {
				                	
				                    //var writer = new window.FileWriter();
				                    writer.onwrite = function(evt) 
				                    {				                  				                    	
				                    	console.log("file written successfully");
				                    	operationCallback(filePath,0,localize("%shell.csexamples.fileWrite.success.text%"));
				                    };
				                    writer.onerror = function(evt) 
				                    {
				                    	console.log(evt.target.result);
				                    	operationCallback(filePath,1,evt.target.error.code);				                    	
				                    };
				                    writer.write(content);
				                    
				                }, onWriteOperationFailed);
				            }, onWriteOperationFailed);
				    }, onWriteOperationFailed);	
			},
			
			read:function(filePath , operationCallback){
								
				function onReadOperationFailed(evt)
				{					
					operationCallback(null,filePath, 1, "Failed to read file with error");
					console.log(evt);
				}
				
				window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
			        fileSystem.root.getFile(filePath, 
			            {create: false, exclusive: false}, function(fileEntry) {
			                fileEntry.file(function(file) {
			                	
			                    var reader = new window.FileReader();
			                    reader.onload = function(evt) 
			                    {
			                    	console.log("file read successfully");
			                    	operationCallback(evt.target.result,filePath,0,"file read successfully");
			                    };
			                    reader.onerror = function(evt) 
			                    {
			                    	//console.log(evt.target.result);
			                    	console.log("failed to read file");
			                    	operationCallback(null,filePath,1,evt);				                    	
			                    };
			                    reader.readAsText(file);
			                    
			                },onReadOperationFailed);
			            }, onReadOperationFailed);
			    }, onReadOperationFailed);	
			},
			
			/*
			onReadOperationCompleted:function(data,resultCode,resultDetails)
			{
				console.log(resultDetails);
			},
			
			onReadOperationFailed:function (evt) {
		        console.log(evt.target.error);
		        onReadOperationCompleted(filePath, evt.target.error.code, "Failed to read file: " + evt.target.error);
		    },
		    
		    */
			
			remove:function(filePath , resultCallback){
				
				
			},
			
			getLocalStorageData : function (key, moduleName)
			{	
				//check folder exit and if not create it.
				//this.createDirectory("RTA");
				var content = null;
				var executionCompleted = false;
				var iterations = 0;
				
				if(!moduleName) 
					moduleName="";					
					
				//save all files under RTA folder				
				this.read("RTA/" + moduleName + key , function (data,filePath,resultCode,resultDetails){
					
					content = data;
					executionCompleted = true;
					
					
					if(resultCode == 0)
					{
						console.log("data retrieved from storage successfully");
					}
					else
					{
						console.log("failed to retrieve data from storage");
					}
				
				});
				
				//wait for file to be read with maximum of 2 seconds
				console.log("waiting for return data");
				while( (! executionCompleted) && iterations < 40)
					{
						console.log("wait for 200 msec");
						iterations++;
						$.delay(200);
					}
				
				console.log("return readed data");
				return content;
			},
			
			setLocalStorageData : function (key, value, encrypted, moduleName)
			{
				//check folder exit and if not create it.
				this.createDirectory("RTA");
				var result = null;
				var executionCompleted = false;
				var iterations = 0;
				
								
				if(!moduleName) 
					moduleName="";					
					
				//save all files under RTA folder
				this.write("RTA/" + moduleName + key, value , function (filePath,resultCode,resultDetails){
					
					result = resultCode == 0 ? true : false;
					executionCompleted = true;
					if(resultCode == 0)
					{						
						console.log("data written to storage successfully");
					}
				else
					{
						console.log("failed to write data from storage");
					}
				
				});
				
				
				//wait for file to be read with maximum of 2 seconds
				while( (! executionCompleted) && iterations < 20)
					{
						iterations++;
						$.delay(100);
					}
				
					
						
				return result;
			}
			
			
	});
	
	return FileStorageModel;
	
});
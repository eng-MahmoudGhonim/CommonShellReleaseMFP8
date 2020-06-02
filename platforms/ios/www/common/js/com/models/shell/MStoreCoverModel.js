define(["com/models/shell/AuthenticationModel"], function(AuthenticationModel) {
	var MStoreCoverModel = Backbone.Model.extend({}, {
		LOCAL_STORAGE_MSTORE: "MSTORE_CARDS",
		SESSION_EXPIRY_IN_MS: 86400000, //86400000// 1 day
		MSTORE_LOCALFILE_STORAGE_FILENAME: "mstore_localfile",
		getVehicleLicense :function (bookletId , callback){
			try {
				var invocationData = {
						adapter: 'JasperReportAdapter',
						procedure: 'getJasperReport',
						parameters: [bookletId]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function(result) {
						if(result && result.invocationResult && result.invocationResult.report){
							callback(result.invocationResult.report,null);
						}else{
							var hasVirtual=false;
							callback(false,hasVirtual);
						}
					},
					onFailure: function(result) {

						callback(false,null);
					},
					timeout: 120000
				});
			} catch (e) {
				callback(false);
			}
		},
		getTotalCount: function(userId, callback) {
			var myvehiclesCount = 0;
			var mylicenseCount = 0;
			var myplatesCount = 0;
			MStoreCoverModel.requestCardsDetails(userId, "", function(result) {
				if (result["Vehicle License"] != null && result["Vehicle License"] != undefined && result["Vehicle License"].length > 0) {
					myvehiclesCount = result["Vehicle License"].length;
				}
				if (result["Driving License"] != null || result["Driving License"] != undefined && result["Driving License"].length > 0) {
					mylicenseCount = result["Driving License"].length;
				}
				if (result["Plate Ownership Certificate"] != null || result["Plate Ownership Certificate"] != undefined && result["Plate Ownership Certificate"].length > 0) {
					myplatesCount = result["Plate Ownership Certificate"].length;
				}
				callback(myvehiclesCount + mylicenseCount + myplatesCount);
			});
		},
		requestCardsDetails: function(username, cardId, callback) {
			try {
				var fileExist = function(pageData) {
					if (MStoreCoverModel._isValidPageData(pageData)) {
						if (!pageData) {
							pageData = {};
						}
						if (!pageData.data) {
							pageData.data = [];
						}
						callback(pageData.data);
					} else {
						MStoreCoverModel._invokeBackendToGetData(username, cardId, callback);
					}
				};
				var fileDoesNotExist = function() {
					MStoreCoverModel._invokeBackendToGetData(username, cardId, callback);
				}
				MStoreCoverModel.getPageDataFromStorage(fileExist, fileDoesNotExist);
			} catch (e) {
				console.log(e);
			}
		},
		_invokeBackendToGetData: function(username, cardId, callback) {
			var groups = {};
			try {
				var invocationData = {
						adapter: 'mStoreAdapter',
						procedure: 'getmStoreData',
						parameters: [username, cardId]
				};
				WL.Client.invokeProcedure(invocationData, {
					onSuccess: function(result) {
						WL.Logger.debug("MStoreCoverModel :: requestCardsDetails :: Invocation success");
						if (result && result.invocationResult && result.invocationResult.resultSet) 
							groups = MStoreCoverModel._groupingCardsData(result.invocationResult.resultSet);
						if (result && result.resultSet) 
							groups = MStoreCoverModel._groupingCardsData(result.resultSet);
						window.pageDataPack = {
								data: groups,
								date: (new Date()).getTime()
						};
						MStoreCoverModel.destroyStoredData(function() {
							MStoreCoverModel.setPageDataToStorage(window.pageDataPack);
						});
						callback(pageDataPack.data);
					},
					onFailure: function(result) {
						WL.Logger.debug("MStoreCoverModel :: requestCardsDetails :: Invocation failure");
						callback({});
					},
					timeout: 120000
				});
			} catch (e) {
				WL.Logger.debug("MStoreCoverModel :: requestCardsDetails :: Invocation error");
				callback({});
			}
		},
		getPageDataFromStorage: function(fileExist, fileDoesNotExist) {
			var gotFS = function(fileSystem) {
				var fileName = 'mstore_localfile.txt';
				fileSystem.root.getFile(fileName, null, gotFileEntry, fail);
			}
			var gotFileEntry = function(fileEntry) {
				fileEntry.file(readAsText, fail);
			}
			var readAsText = function(file) {
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					console.log("Read as text");
					try {
						fileExist(JSON.parse(evt.target.result));
					} catch (ex) {
						console.log(ex);
					}
				};
				reader.readAsText(file);
			}
			var fail = function(evt) {
				fileDoesNotExist();
			}
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
		},
		writelocalfileonDevice: function(groups) {
			try {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
					console.log("Got FS");
					var fileName = 'mstore_localfile.txt';
					fileSystem.root.getFile(fileName, {
						create: true,
						exclusive: false
					}, function(fileEntry) {
						console.log("Got File", fileEntry.fullPath);
						//savedFilePath = fileEntry.fullPath;
						fileEntry.createWriter(function(writer) {
							console.log("Created writer");
							var temp = JSON.stringify(groups);
							var blob = new Blob([temp], {
								type: 'text/plain'
							});
							writer.onwriteend = function(evt) {
								//endWriting(evt, busyInd);
								console.log("Writer ended");
							};
							writer.write(blob);
							console.log("After writer write");
							return;
						}, function(evt) {
							console.log("error", evt);
						});
					}, function(evt) {
						console.log("error", evt);
					});
				}, function(evt) {
					console.log("error", evt);
				});
			} catch (e) {}
		},
		setPageDataToStorage: function(groups) {
			window.pageDataPack = null;
			if (groups) {
				MStoreCoverModel.writelocalfileonDevice(groups);
			} else {
//				MStoreCoverModel.writelocalfileonDevice("");
				try {
					MStoreCoverModel.destroyStoredData();
				}catch(e){}
			}
		},
		destroyStoredData: function(callback) {
			var onError = function() {
				console.log('error removing mStore file');
				if (callback) callback();
			}
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				var fileName = 'mstore_localfile.txt';
				fs.root.getFile(fileName, {}, function(fileEntry) {
					fileEntry.remove(function() {
						console.log('File removed.');
						if (callback) callback();
					}, onError);
				}, onError);
			}, onError);
		},
		_isValidPageData: function(pageData) {
			var dateNow = new Date().getTime();
			return (pageData && pageData.data && pageData.date && !$.isEmptyObject(pageData.data) && ((dateNow - pageData.date) < MStoreCoverModel.SESSION_EXPIRY_IN_MS));
		},
		_groupingCardsData: function(cards) {
			var groups = {};
			if (cards && cards.length > 0) {
				var cardsLength = cards.length;
				for (var c = 0; c < cardsLength; c++) {
					var card = cards[c];
					if (card && card.Type) {
						if (!groups[card.Type]) {
							groups[card.Type] = [];
						}
						groups[card.Type].push(card);
					}
				}
				var cardsTypesList = Object.keys(groups);
				if (cardsTypesList && cardsTypesList.length > 0) {
					cardsTypesList.sort();
					var cardsTypesLength = cardsTypesList.length;
					for (var ct = 0; ct < cardsTypesLength; ct++) {
						var category = cardsTypesList[ct];
						groups[category].sort(MStoreCoverModel._compareDates);
					}
				}
			}
			return groups;
		},
		_compareDates: function(item1, item2) {
			try {
				if (!item1.Expiry) {
					item1.Expiry = 0;
				}
				if (!item2.Expiry) {
					item2.Expiry = 0;
				}
				var item1Date = new Date(parseInt(item1.Expiry));
				var item2Date = new Date(parseInt(item2.Expiry));
				return item2Date.getTime() < item1Date.getTime();
			} catch (e) {}
		},
		buildPlatesItemsObjects: function(platesItemsData) {
			var i = 0;
			var index = 0;
			var platesItemsObjects = [];
			if (platesItemsData instanceof Array) {
				var platesDataLength = platesItemsData.length;
				for (i; i < platesDataLength; i++) {
					var plateItemData = platesItemsData[i];
					var plateObject = {};
					if (plateItemData.Images instanceof Array && plateItemData.Images.length != 0) {
						plateObject.image = plateItemData.Images[0];
						var plateDescription = plateItemData.Description_en;
						if (getApplicationLanguage() == 'ar') {
							plateDescription = plateItemData.Description_ar;
						}
						var startIndex = plateDescription.indexOf(":") + 2;
						var plateDetails = plateDescription.substring(startIndex);
						lastIndex = plateDetails.indexOf(" ");
						startIndex = plateDetails.lastIndexOf(" ") + 1;
						plateObject.plateCode = plateDetails.substr(startIndex);
						plateObject.plateNumber = plateDetails.substring(0, lastIndex);
						var expiryObj = plateItemData.Expiry;
						plateObject.expiryDate = expiryObj.constrcutor === {}.constructor ? expiryObj : "N/A";
						plateObject.certificateNumber = plateItemData.QRCode;
						plateObject.index = index;
						index++;
						platesItemsObjects.push(plateObject);
					}
				}
			}
			return platesItemsObjects;
		},
		checkImageObject: function(image) {
			try {
				if (image.indexOf('data:image/jpeg;base64') >= 0) {
					return image;
				} else if (image.image && image.image.CDATA && image.image.CDATA.indexOf('data:image/jpeg;base64') < 0) {
					return "data:image/png;base64," + image.image.CDATA;
				} else {
					return image;
				}
			} catch (e) {}
		},
		buildVehicleItemsObjects: function(vehiclesItemsData) {
			var vehiclesDataLength = vehiclesItemsData.length;
			var index = 0;
			var VehicleItemsObjects = [];
			for (var i = 0; i < vehiclesDataLength; i++) {
				var vehicleItemData = vehiclesItemsData[i];
				var vehicleObject = {};
				if (vehicleItemData.Images instanceof Array && vehicleItemData.Images.length != 0) {
					vehicleObject.frontView = MStoreCoverModel.checkImageObject(vehicleItemData.Images[0]);
					vehicleObject.backView = MStoreCoverModel.checkImageObject(vehicleItemData.Images[1]);
					var vehicleDescription = vehicleItemData.Description_en;
					if (getApplicationLanguage() == 'ar') {
						vehicleDescription = vehicleItemData.Description_ar;
					}
					var _plateDetails = vehicleDescription.split("<BR>")[0].split(":")[1].trim().split(" ");
					vehicleObject.plateNumber = _plateDetails[0].length > 0 ? _plateDetails[0] : "";
					vehicleObject.plateType = _plateDetails[1].length > 0 ? _plateDetails[1] : "";
					vehicleObject.plateCode = (_plateDetails[2] && _plateDetails[2].length > 0) ? _plateDetails[2] : "";
					vehicleObject.expiryDate = vehicleItemData.Expiry;
					vehicleObject.index = index;
					vehicleObject.bookletId = vehicleItemData.Id;
					index++;
					VehicleItemsObjects.push(vehicleObject);
				}
			}
			return VehicleItemsObjects;
		},
		buildLicenseItemObject: function(licenseItemData) {
			var licenseObject = {};
			if (licenseItemData.Images instanceof Array && licenseItemData.Images.length != 0) {
				licenseObject.frontView = licenseItemData.Images[0];
				licenseObject.backView = licenseItemData.Images[1];
				var licenseDescription = licenseItemData.Description_en;
				if (getApplicationLanguage() == 'ar') {
					licenseDescription = licenseItemData.Description_ar;
				}
				var startIndex = 0;
				var lastIndex = licenseItemData.QRCode.indexOf(",");
				licenseObject.trafficFileNo = licenseItemData.QRCode.substring(startIndex, lastIndex);
				startIndex = licenseDescription.indexOf(":") + 2;
				lastIndex = licenseDescription.indexOf("<BR>") - 1;
				licenseObject.licenseNo = licenseDescription.substring(startIndex, lastIndex);
				licenseObject.expiryDate = licenseItemData.Expiry;
			}
			return licenseObject;
		},
	});
	return MStoreCoverModel;
});

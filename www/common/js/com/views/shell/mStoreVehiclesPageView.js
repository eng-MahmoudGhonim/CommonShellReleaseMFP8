define(["com/views/PageView", "com/views/Header", "com/models/shell/MStoreCoverModel", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/utils/SocialSharingUtils", "com/models/drivers_and_vehicles/DVDashboardModel"], function(PageView, Header, MStoreCoverModel, UserProfileModel, AuthenticationModel, SocialSharingUtils, DVDashboardModel) {
	var mStoreVehiclesPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
			'tap #viewVehicleLicenseBtn': 'viewVehicleLicense',
		},
		initialize: function(options) {
			self = this;
			options.phoneTitle = localize("%shell.mstore.title%");
			options.subTitle=localize("%shell.mstore.myvehicle%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
		shareVehicleCard: function() {
			try {
				var i = self.slider.el.index;
				if (getApplicationLanguage() == "en") {
					var cardTitle = self.vehiclesRowObject[i].Title_en;
					var cardCategory = self.vehiclesRowObject[i].Category_en;
					if (cardTitle && cardTitle.length > 0) {
						cardTitle += ". ";
					}
				} else {
					var cardTitle = self.vehiclesRowObject[i].Title_ar;
					var cardCategory = self.vehiclesRowObject[i].Category_ar;
					if (cardTitle && cardTitle.length > 0) {
						cardTitle += ". ";
					}
				}
				var shareMessage = null,
				sharingLink = Utils.getAppStoreLink();
				if(Utils.isAndroid()){
				shareMessage = localize("%shell.share.MSTORE%").replace("#STORELINK#", sharingLink);
				}
				SocialSharingUtils.share(shareMessage, [self.vehicles[i].frontView, self.vehicles[i].backView], null);
			} catch (e) {}
		},
		filpVehicleCardInGallery: function() {
			try {
				var i = self.slider.el.index;
				var currentItem = document.querySelectorAll("#mStoreVehiclesPage .my-gallery .slide")[i];
				var zoomRapImages = window.Gallery.currItem.container.querySelectorAll("img");
				if (currentItem.orientation == "front") {
					zoomRapImages[0].src = self.vehicles[i].backView;
					if (zoomRapImages[1]) zoomRapImages[1].src = self.vehicles[i].backView;
					self.bindImg(self.vehicles[i].backView, currentItem);
					currentItem.orientation = "back";
				} else {
					zoomRapImages[0].src = self.vehicles[i].frontView;
					if (zoomRapImages[1]) zoomRapImages[1].src = self.vehicles[i].frontView;
					self.bindImg(self.vehicles[i].frontView, currentItem);
					currentItem.orientation = "front";
				}
			} catch (e) {}
		},
		renderVehiclesCards: function(result) {
			try {
				self.vehiclesRowObject = result["Vehicle License"];
				self.vehicles = MStoreCoverModel.buildVehicleItemsObjects(result["Vehicle License"]);
				for (var i = 0; i < self.vehicles.length; i++) {
					var item = document.querySelector("#template .slide").cloneNode(true);
					item.querySelector("img").onclick = function() {
						setTimeout(function() {
							var actionsCont = document.querySelector(".pswp .actionsCont");
							actionsCont.className = "actionsCont mStoreVehiclesPage";
							actionsCont.innerHTML = '<span class="icon-flip"></span><span class="icon-social-share"></span><span class="icon-cancel" alt="close"></span>';
							actionsCont.querySelector(".icon-social-share").onclick = self.shareVehicleCard;
							actionsCont.querySelector(".icon-flip").onclick = self.filpVehicleCardInGallery;
							actionsCont.querySelector(".icon-cancel").onclick = function() {
								window.Gallery.close();
							}
							if(window.Gallery){
							window.Gallery.listen('afterChange', function(e) {
								var index = window.Gallery.getCurrentIndex();
								self.slider.changeIndex(self.slider.el, index);
								document.querySelector("#mStoreVehiclesPage .detailsCont").style.webkitTransform = "translate3d(" + (index * -100) + "%,0,0)";
							});}
						});
					}
					item.orientation = "front";
					self.bindImg(self.vehicles[i].frontView, item, function(bindedItem) {
						document.querySelector('.my-gallery .slidsCont').appendChild(bindedItem);
					});
					var descItem = document.querySelector("#template .descItemCont").cloneNode(true);
					descItem.querySelector(".plateCode").innerText = self.vehicles[i].plateCode;
					descItem.querySelector(".plateNo").innerText = self.vehicles[i].plateNumber;
					var lastIndex = self.vehiclesRowObject[i].QRCode ? self.vehiclesRowObject[i].QRCode.indexOf(",") : "";
					var tfn = self.vehiclesRowObject[i].QRCode ? self.vehiclesRowObject[i].QRCode.substring(0, lastIndex) : DVDashboardModel.getTrafficFileNumber();
					descItem.querySelector("#TFN").innerText = tfn;
					descItem.querySelector("#expiry").innerText = self.vehicles[i].expiryDate;
					descItem.querySelector("#Category").innerText = self.vehicles[i].plateType;
					document.querySelector("#mStoreVehiclesPage .detailsCont").appendChild(descItem);
					descItem.querySelector("#viewVehicleLicenseBtn").setAttribute("booklet-id", self.vehicles[i].bookletId);
				}
				setTimeout(function() {
					self.slider = new BulletSlider(document.querySelector('.bulletSlider'), false)
					initPhotoSwipeFromDOM('.my-gallery');
					self.slider.onSlide = function(index) {
						document.querySelector("#mStoreVehiclesPage .detailsCont").style.webkitTransform = "translate3d(" + (index * -100) + "%,0,0)";
					}
				}, 500);
			} catch (e) {}
		},
		onPageShow: function() {
			try {
				var userId = UserProfileModel.getUserProfile().Users[0].user_id;
				MStoreCoverModel.requestCardsDetails(userId, "", self.renderVehiclesCards);
				document.querySelector("#mStoreVehiclesPage .headerCont .icon-social-share").onclick = self.shareVehicleCard;
				document.querySelector("#mStoreVehiclesPage .headerCont .icon-flip").onclick = function() {
					var i = self.slider.el.index;
					var currentItem = document.querySelectorAll(".my-gallery .slide")[i];
					if (currentItem.orientation == "front") {
						self.bindImg(self.vehicles[i].backView, currentItem);
						currentItem.orientation = "back";
					} else {
						self.bindImg(self.vehicles[i].frontView, currentItem);
						currentItem.orientation = "front";
					}
				}
				document.querySelector("#mStoreVehiclesPage .headerCont .icon-expand").onclick = function() {
					var i = self.slider.el.index;
					$(document.querySelectorAll(".my-gallery img")[i]).trigger('click');
				}
			} catch (e) {
				console.log(e)
			}
		},
		showErrorPopup: function() {
			$(".ui-loader").hide();
			var generalErrorPopup = new Popup('generalErrorPopup');
			generalErrorPopup.show();
		},
		onGettingVehicleLicense: function(report,hasVirtual) {
			try {
				if (self.pdfThread) {
					window.clearTimeout(self.pdfThread);
					self.pdfThread = null;
				}
				if(hasVirtual&&hasVirtual==false){
					$(".ui-loader").hide();
					var noVirtualMalikyiaPopup = new Popup('noVirtualMolikyiaPopup');
					noVirtualMalikyiaPopup.show();
					return
				}

				if (report == false) {
					self.showErrorPopup();
					return;
				}
				var report_atob = atob(report);
				var report_pdf = PDFJS.getDocument({
					data: report_atob
				});
				report_pdf.promise.then(function(pdf) {
					console.log('PDF loaded');
					// Fetch the first page
					var pageNumber = 1;
					pdf.getPage(pageNumber).then(function(page) {
						console.log('Page loaded');
						var scale = 1;
						var viewport = page.getViewport(scale);
						// Prepare canvas using PDF page dimensions
						window.canvas = document.createElement('canvas');
						var context = canvas.getContext('2d');
						canvas.height = viewport.height;
						canvas.width = viewport.width;
						// Render PDF page into canvas context
						var renderContext = {
								canvasContext: context,
								viewport: viewport
						};
						var renderTask = page.render(renderContext);
						renderTask.then(function() {
							console.log('Page rendered');
							if (self.pdfThread) {
								window.clearTimeout(self.pdfThread);
								self.pdfThread = null;
							}
							$(".ui-loader").hide();
							//				      window.open(window.canvas.toDataURL(),'_blank');
							var pswpElement = document.querySelector('.pswp');
							var options = {
									history: false,
									focus: false,
									index: 0,
									showAnimationDuration: 600,
									hideAnimationDuration: 600
							};
							var i = self.slider.el.index;
							self.vehicles[i].report = window.canvas.toDataURL();
							var object = {
									src: window.canvas.toDataURL(),
									w: window.innerWidth - 40,
									h: window.innerHeight - 120
							}
							var gallery2 = new PhotoSwipe(pswpElement, false, [object], options);
							gallery2.init();
							window.Gallery2 = gallery2;
							var actionsCont = document.querySelector(".pswp .actionsCont");
							actionsCont.className = "actionsCont mStoreVehiclesPage";
							actionsCont.innerHTML = '<span class="icon-social-share"></span><span class="icon-cancel" alt="close"></span>';
							actionsCont.querySelector(".icon-cancel").onclick = function() {
								window.Gallery2.close();
							}
							actionsCont.querySelector(".icon-social-share").onclick = self.shareVirtualVehicleLicense;
							window.Gallery2.listen('close', function() {
								setTimeout(function() {
									window.Gallery2 = null;
								}, 300);
							});
						});
					});
				}, function(reason) {
					// PDF loading error
					console.error(reason);
					$(".ui-loader").hide();
					if (self.pdfThread) {
						window.clearTimeout(self.pdfThread);
						self.pdfThread = null;
					}
				});
			} catch (e) {}
		},

		viewVehicleLicense: function(event) {
			try {
				if(event)
				event.preventDefault();
				//event.preventDefault();
				if (!navigator.onLine) {
					//self.viewVehicleLicense(event)
					Utils.showConnectionPopup(self.viewVehicleLicense);
					//showInternetProblemPopup();
					return;
				}
				//var bookletId = event.currentTarget.getAttribute("booklet-id");
			//	var bookletId = document.querySelector(".detailsCont #viewVehicleLicenseBtn")?document.querySelector(".detailsCont #viewVehicleLicenseBtn").getAttribute("booklet-id"):"";
				var bookletId =event.target.getAttribute("booklet-id");
				self.pdfThread = window.setTimeout(function() {
					self.showErrorPopup();
				}, 60000);
				$(".ui-loader").show();
				MStoreCoverModel.getVehicleLicense(bookletId, self.onGettingVehicleLicense);
			} catch (e) {}
		},
		shareVirtualVehicleLicense: function() {
			try {
				var i = self.slider.el.index;
				var shareMessage = null;
				var sharingLink = Utils.getAppStoreLink();
				if(Utils.isAndroid()){
					shareMessage = localize("%shell.mstore.share.vehiclelicense%").replace("#STORELINK#", sharingLink);
				}
				SocialSharingUtils.share(shareMessage, [self.vehicles[i].report], null);
			} catch (e) {}
		},
		bindImg: function(imageURI, item, callback) {
			try {
				var image = new Image();
				image.onload = function(evt) {
					var width = this.width;
					var height = this.height;
					item.querySelector("span").size = width + "x" + height;
					item.querySelector("span").url = imageURI;
					item.querySelector("img").src = imageURI;
					if (callback) callback(item);
					image = null;
				}
				image.src = imageURI;
			} catch (e) {}
		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});
	// Returns the View class
	return mStoreVehiclesPageView;
});

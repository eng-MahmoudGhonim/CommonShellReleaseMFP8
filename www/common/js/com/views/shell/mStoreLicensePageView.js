define(["com/views/PageView", "com/views/Header", "com/models/Constants", "com/models/shell/MStoreCoverModel", "com/models/shell/UserProfileModel", "com/models/shell/AuthenticationModel", "com/utils/SocialSharingUtils", ], function(PageView, Header, Constants, MStoreCoverModel, UserProfileModel, AuthenticationModel, SocialSharingUtils) {
	var mStoreLicensePageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow'
		},
		initialize: function(options) {
			self = this;
			options.phoneTitle = localize("%shell.mstore.title%");
			options.subTitle=localize("%shell.mstore.mydubailicense%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function() {
			var userId = UserProfileModel.getUserProfile().Users[0].user_id;
			MStoreCoverModel.requestCardsDetails(userId, "", function(result) {
				self.licenseRowObject = result["Driving License"][0];
				self.mylicense = MStoreCoverModel.buildLicenseItemObject(result["Driving License"][0]);
				self.bindImg(self.mylicense.frontView);
				document.querySelector("#mStoreLicensePage #userName").innerText = UserProfileModel.getUserProfile().Users[0].first_name_en + " " + UserProfileModel.getUserProfile().Users[0].last_name_en;
				document.querySelector("#mStoreLicensePage #licenseNo").innerText = self.mylicense.licenseNo;
				document.querySelector("#mStoreLicensePage #TFN").innerText = self.mylicense.trafficFileNo;
				document.querySelector("#mStoreLicensePage #expiry").innerText = self.mylicense.expiryDate;
			});
			self.orientation = "front";
			var actionsCont = document.querySelector(".pswp .actionsCont");
			actionsCont.className = "actionsCont mStoreVehiclesPage";
			actionsCont.innerHTML = '<span class="icon-flip"></span><span class="icon-social-share"></span><span class="icon-cancel" alt="close"></span>';
			document.querySelector("#mStoreLicensePage .headerCont .icon-flip").onclick = function() {
				if (self.orientation == "front") {
					self.bindImg(self.mylicense.backView);
					self.orientation = "back";
				} else {
					self.bindImg(self.mylicense.frontView);
					self.orientation = "front";
				}
			}
			document.querySelector("#mStoreLicensePage .headerCont .icon-expand").onclick = function() {
				$(document.querySelector(".my-gallery img")).trigger('click');
			}
			document.querySelector("#mStoreLicensePage .headerCont .icon-social-share").onclick = actionsCont.querySelector(".icon-social-share").onclick = function() {
				var message;
				if (getApplicationLanguage() == "en") {
					var cardTitle = self.licenseRowObject.Title_en;
					var cardCategory = self.licenseRowObject.Category_en;
					if (cardTitle && cardTitle.length > 0) {
						cardTitle += ". ";
					}
				} else {
					var cardTitle = self.licenseRowObject.Title_ar;
					var cardCategory = self.licenseRowObject.Category_ar;
					if (cardTitle && cardTitle.length > 0) {
						cardTitle += ". ";
					}
				}
				var shareMessage = null,
					sharingLink = Utils.getAppStoreLink();
				if(Utils.isAndroid()){
				shareMessage = localize("%shell.share.MSTORE%").replace("#STORELINK#", sharingLink);
				}
				SocialSharingUtils.share(shareMessage, [self.mylicense.frontView, self.mylicense.backView], null);
			}
			actionsCont.querySelector(".icon-flip").onclick = function() {
				if (self.orientation == "front") {
					document.querySelectorAll(".pswp .pswp__img")[0].src = self.mylicense.backView;
					document.querySelectorAll(".pswp .pswp__img")[1].src = self.mylicense.backView;
					self.bindImg(self.mylicense.backView);
					self.orientation = "back";
				} else {
					document.querySelectorAll(".pswp .pswp__img")[0].src = self.mylicense.frontView;
					document.querySelectorAll(".pswp .pswp__img")[1].src = self.mylicense.frontView;
					self.bindImg(self.mylicense.frontView);
					self.orientation = "front";
				}
			}
			actionsCont.querySelector(".icon-cancel").onclick = function() {
				window.Gallery.close();
			}
			setTimeout(function() {
				initPhotoSwipeFromDOM('.my-gallery');
			}, 500);
		},
		bindImg: function(imageURI) {
			var image = new Image();
			image.onload = function(evt) {
				var width = this.width;
				var height = this.height;
				document.querySelector(".my-gallery span").size = width + "x" + height;
				document.querySelector(".my-gallery span").url = imageURI;
				document.querySelector(".my-gallery img").src = imageURI;
				image = null;
			}
			image.src = imageURI;
		},
		share: function(event) {},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});
	// Returns the View class
	return mStoreLicensePageView;
});


/* JavaScript content from js/com/views/shell/mStorePlatesPageView.js in folder common */
define(["com/views/PageView",
        "com/views/Header",
        "com/models/shell/MStoreCoverModel",
        "com/models/shell/UserProfileModel",
        "com/models/shell/AuthenticationModel",
        "com/utils/SocialSharingUtils",
        ], function( PageView, Header ,MStoreCoverModel,UserProfileModel,AuthenticationModel,SocialSharingUtils) {
	var mStorePlatesPageView = PageView.extend({
		events:{
			'pageshow' : 'onPageShow'
		},
		initialize: function(options)
		{
			self = this;
			options.phoneTitle = localize("%shell.mstore.title%");
			options.subTitle=localize("%shell.mstore.myplates%");
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow:function (){
			var userId = UserProfileModel.getUserProfile().Users[0].user_id;
			MStoreCoverModel.requestCardsDetails(userId,"",function (result){
				self.platesRowObject = result["Plate Ownership Certificate"];
				self.myplates = MStoreCoverModel.buildPlatesItemsObjects(result["Plate Ownership Certificate"]);

				for(var i=0;i<self.myplates.length;i++){
					var item = document.querySelector("#template .plateItem").cloneNode(true);
					item.querySelector(".plateCode").innerText = self.myplates[i].plateCode;
					item.querySelector(".plateNo").innerText = self.myplates[i].plateNumber;
					item.querySelector("#certNo").innerText = self.myplates[i].certificateNumber;
					item.querySelector("#expiry").innerText = self.myplates[i].expiryDate;
					item.index = i;
					item.onclick = function(){
						var pswpElement = document.querySelector('.pswp');
						var options = {
					        history: false,
					        focus: false,
					        index:this.index,
					        showAnimationDuration: 600,
					        hideAnimationDuration: 600

					    };

					    var gallery = new PhotoSwipe( pswpElement, false, self.galleryObject, options);
					    gallery.init();
					    window.Gallery = gallery;
			            window.Gallery.listen('close', function() {
			            	setTimeout(function(){
			            		window.Gallery = null;
			            	},300);
			            });
					}
					document.querySelector("#mstorePlatesPage .plateList").appendChild(item);
				}

				var actionsCont = document.querySelector(".pswp .actionsCont");
				actionsCont.className = "actionsCont mStoreVehiclesPage";
        actionsCont.innerHTML = '<span class="icon-social-share"></span><span class="icon-cancel" alt="close"></span>';

				self.bindItems(self.myplates);

				actionsCont.querySelector(".icon-cancel").onclick = function(){
					window.Gallery.close();
				}

				actionsCont.querySelector(".icon-social-share").onclick =
					function(){
						var index = window.Gallery.getCurrentIndex();
						var message;
						if(getApplicationLanguage() == "en"){
							var cardTitle = self.platesRowObject.Title_en;
							var cardCategory = self.platesRowObject.Category_en;
							if(cardTitle && cardTitle.length > 0) {
								cardTitle += ". ";
							}
						}else{
							var cardTitle = self.platesRowObject.Title_ar;
							var cardCategory = self.platesRowObject.Category_ar;
							if(cardTitle && cardTitle.length > 0) {
								cardTitle += ". ";
							}
						}

						var shareMessage = null, sharingLink = Utils.getAppStoreLink();
						if(Utils.isAndroid()){
						shareMessage = localize("%shell.share.MSTORE%").replace("#STORELINK#",sharingLink);
						}
						SocialSharingUtils.share(shareMessage , [self.myplates[index].image], null);
			}

			});
		},
		bindItems:function (plates) {
			var count = plates.length;
			var items = [];

			function onObjectCreate(object){
				count--;
				items.push(object);
				if(count <= 0){
					self.galleryObject = items
				}
			}

			for(var i=0;i<plates.length;i++){
//				plates[i].image="data:image/png;base64,"+plates[i].image;
				self.crateObject(plates[i],onObjectCreate)
			}
        },
        crateObject:function(plate,callBack){
        	var image = new Image();
            image.onload = function (evt) {
                var width = this.width;
                var height = this.height;
                var object = {
                    src: plate.image,
                    w: width,
                    h: height
                }
                image = null;
                if(callBack)
                	callBack(object)
            }
            image.src = plate.image;
        },
        share: function(event) {

		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
	});

	// Returns the View class
	return mStorePlatesPageView;

});

define([ 

        "jquery", 
        "backbone",
        "com/views/PageView",
        "com/views/Footer",
        "com/views/Header",
        "com/models/Constants",
        "com/utils/DataUtils",
        "com/models/shell/MessagesModel",
        "com/models/shell/UserProfileModel",
        "com/utils/UserUtils"

        ], function( $, Backbone, PageView, Footer,Header, Constants, DataUtils, Message, UserProfileModel,UserUtils ) {

	var MessagesPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		template:{},
		events: {
			'pageshow':	'onPageShow',
		},
		initialize: function(options) 
		{
			PageView.prototype.initialize.call(this);


			options.phoneTitle = Globalize.localize("%shell.messages.title%", getApplicationLanguage());
			options.headerState = Header.STATE_MENU;
			PageView.prototype.initialize.call(this, options);
			messagesPageViewInstance= this;
			
			messagesPageViewInstance.checkedList = [];
		},
		onPageShow : function(event){
			event.preventDefault();
//			document.getElementById("messagesPage").setAttribute("data-role","content");
			messagesPageViewInstance.items = document.getElementsByClassName("messageItem");
			document.getElementById("selectAll").onclick = messagesPageViewInstance.selectAll;
			document.getElementById("selectAll").checked = false;
			for(var i=0;i<messagesPageViewInstance.items.length;i++){
				messagesPageViewInstance.items[i].index = i;
				var checkbox = messagesPageViewInstance.items[i].getElementsByClassName("checkbox")[0];
				checkbox.checked = false;
				checkbox.onclick = messagesPageViewInstance.checkBoxClick;
				checkbox.index = i;
			}
			messagesPageViewInstance.allSelected = false;
			var listSwipe = new ListSwipe(messagesPageViewInstance.items);
		},
		checkBoxClick:function(e){
			if(!e.currentTarget.checked){
				e.currentTarget.className = e.currentTarget.className.replace("blank","marked");
				messagesPageViewInstance.checkedList.push(e.currentTarget.index);
			}else{
				e.currentTarget.className = e.currentTarget.className.replace("marked","blank");
				var index = messagesPageViewInstance.checkedList.indexOf(e.currentTarget.index);
				messagesPageViewInstance.checkedList.splice(index, 1);
			}
			e.currentTarget.checked =! e.currentTarget.checked;
			if(messagesPageViewInstance.checkedList.length == messagesPageViewInstance.items.length){
				messagesPageViewInstance.selectAll();
			}else{
				if(messagesPageViewInstance.allSelected){
					document.getElementById("selectAll").checked = false;
					messagesPageViewInstance.allSelected = false;
					document.getElementById("selectAll").className = 
						document.getElementById("selectAll").className.replace("marked","blank");
				}
				messagesPageViewInstance.updateHeader();
			}
			
		},
		selectAll:function(e){
			messagesPageViewInstance.checkedList = [];
			var el = document.getElementById("selectAll");
			if(!el.checked){
				el.checked = true;
				messagesPageViewInstance.allSelected = true;
				el.className = el.className.replace("blank","marked");
				for(var i=0;i<messagesPageViewInstance.items.length;i++){
					var checkbox = messagesPageViewInstance.items[i].getElementsByClassName("checkbox")[0];
					checkbox.className = checkbox.className.replace("blank","marked");
					checkbox.checked = true;
					messagesPageViewInstance.checkedList.push(checkbox.index);
				}
			}else{
				el.checked = false;
				messagesPageViewInstance.allSelected = false;
				el.className = el.className.replace("marked","blank");
				for(var i=0;i<messagesPageViewInstance.items.length;i++){
					var checkbox = messagesPageViewInstance.items[i].getElementsByClassName("checkbox")[0];
					checkbox.className = checkbox.className.replace("marked","blank");
					checkbox.checked = false;
				}
			}
			messagesPageViewInstance.updateHeader();
		},
		updateHeader:function(){
			if(messagesPageViewInstance.checkedList.length > 0){
				var readCount = 0,unreadCount = 0;
				for(var i=0;i<messagesPageViewInstance.checkedList.length;i++){
					messagesPageViewInstance.items[messagesPageViewInstance.checkedList[i]]
						.className.indexOf("readed") > -1 ?
						readCount++ : unreadCount++;
				}
				if(readCount > 0){
					document.getElementById("unreadBtn").style.display = "inline-block";
				}else{
					document.getElementById("unreadBtn").style.display = "none";
				}
				
				if(unreadCount > 0){
					document.getElementById("readBtn").style.display = "inline-block";
				}else{
					document.getElementById("readBtn").style.display = "none";
				}
				
				document.getElementById("deleteBtn").style.display = "inline-block";
			}else{
				document.getElementById("unreadBtn").style.display = "none";
				document.getElementById("readBtn").style.display = "none";
				document.getElementById("deleteBtn").style.display = "none";
			}
		},
		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			delete messagesPageViewInstance ;
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return MessagesPageView;

});
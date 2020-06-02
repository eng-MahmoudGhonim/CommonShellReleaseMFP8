(function () {
	"use strict";

	var tabs = function (el, options) {
		var defaultOptions = {
				startIndex: 0,
				touchEnabled: false,
				direction:"ltr" // ltr for English and rtl for arabic
		},
		self = this,
		headers = el.querySelectorAll(".head"),
		bar = el.querySelector(".bar"),
		tabsContent = el.querySelector(".tabsContent");


		function headClick(e) {
			self.changeIndex(e.currentTarget.index);
		}

		self.changeIndex = function (index) {
			if (index >= headers.length) return;
			var val = tabsContent.getBoundingClientRect().width * index * -1;
			var barVal = bar.getBoundingClientRect().width * index;
			if (self.options.direction=="rtl"){
				val=val*-1;
				barVal=barVal*-1;
			}
			tabsContent.style.webkitTransform = "translate3d(" + val + "px,0,0)";
			bar.style.webkitTransform = "translate3d(" + barVal + "px,0,0)";
			for (var i = 0; i < headers.length; i++) {
				headers[i].className = headers[i].className.replace(" active", "");
			}
			headers[index].className += " active";
			self.index = index;
			
			if(self.onIndexChange){
				self.onIndexChange(self.index)
			}
		};

		//Constructor
		(function () {
			self.el = el;
			self.onIndexChange = null;
			var headerWidth = 100 / headers.length;
			for (var i = 0; i < headers.length; i++) {
				headers[i].style.width = headerWidth + "%";
				headers[i].index = i;
				headers[i].onclick = headClick;
			}
			headers[0].className += " active";
			bar.style.width = headerWidth + "%";
			options = options || {};
			for (var j in defaultOptions) {
				if (!options.hasOwnProperty(j))
					options[j] = defaultOptions[j];
			}
			self.index = 0;
			self.options = options;
			if (self.options.direction=="rtl"){
				self.el.classList.add('rtlTabs');
			}
			if (self.options.onIndexChange){
				self.onIndexChange=self.options.onIndexChange
			}
			
			setTimeout(function(){
				self.changeIndex(self.options.startIndex);
			},100);
			
			//TODO adding touch (draging) functionality
			tabsContent.ontouchstart = null;
		})();
	}

	window.Tabs = tabs;
})();
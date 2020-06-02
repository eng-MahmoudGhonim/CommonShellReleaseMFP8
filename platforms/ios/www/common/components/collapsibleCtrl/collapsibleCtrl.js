(function() {
	"use strict";
	var collapsible = function(el, onOpen) {
		var container, heads, bodies, headHeight, animating = false,
		self = this;

		function toggleHead(e) {
			e.currentTarget.opened ? close(e.currentTarget) : open(e.currentTarget);
		}

		function open(el) {
			if (animating) return;
			animating = true;
			el.opened = true;
			var index = el.index;
			if(bodies[index]){
				var height = bodies[index].getBoundingClientRect().height;
				bodies[index].style.zIndex = 5;
				container.style.height = ((headHeight * heads.length) + height) + "px";
				for (var i = 0; i < bodies.length; i++) {
					if (i < index) {
						// close the upper bodies
						heads[i].val = 0;
						heads[i].opened = false;
						heads[i].classList.add("collapseHead");
						bodies[i].classList.add("collapseBody");
						heads[i].classList.remove("active");
						bodies[i].classList.remove("active");
						heads[i].style.webkitTransform = "translate3d(0," + heads[i].val + "px,0)";
						bodies[i].style.webkitTransform = "translate3d(0," + heads[i].val + "px,0)";
						bodies[i].style.zIndex = 0;
					} else if (i > index) {
						// close the down bodies
						heads[i].val = height;
						heads[i].opened = false;
						heads[i].classList.add("collapseHead");
						bodies[i].classList.add("collapseBody");
						heads[i].classList.remove("active");
						bodies[i].classList.remove("active");
						heads[i].style.webkitTransform = "translate3d(0," + heads[i].val + "px,0)";
						bodies[i].style.webkitTransform = "translate3d(0," + heads[i].val + "px,0)";
						bodies[i].style.zIndex = 0;
					} else {
						heads[i].classList.add("collapseHead");
						heads[i].classList.add("active");
						bodies[i].classList.add("collapseBody");
						bodies[i].classList.add("active");
						heads[i].style.webkitTransform = "translate3d(0,0,0)";
						bodies[i].style.visibility = "visible";
						bodies[i].style.webkitTransform = "translate3d(0," + height + "px,0)";
					}
				}
				setTimeout(function() {
					animating = false;
					for (var j = 0; j < bodies.length; j++) {
						if (j != index) {
							bodies[j].style.visibility = "hidden";
						}
					}
					if (self.onOpen) self.onOpen(index);
//					setTimeout(function() {
//					document.querySelectorAll('.collapseHead.active')[0].scrollIntoView({
//					behavior: "smooth",
//					block: "start",
//					inline: "nearest"
//					});
//					});
				}, 300);
			}
		}

		function close(el) {
			if (animating) return;
			animating = true;
			for (var i = 0; i < bodies.length; i++) {
				heads[i].val = 0;
				//				heads[i].classList.add("collapseHead");
				heads[i].classList.remove("active");
				bodies[i].classList.remove("active");
				//				bodies[i].className = "collapseBody";
				heads[i].opened = false;
				heads[i].style.webkitTransform = "translate3d(0,0,0)";
				bodies[i].style.webkitTransform = "translate3d(0,0,0)";
			}
			setTimeout(function() {
				container.style.height = (headHeight * heads.length) + "px";
				for (var j = 0; j < bodies.length; j++) {
					bodies[j].style.visibility = "hidden";
				}
				animating = false;
			}, 300);
		}
		function getItemsHeight (_items){
//			var _items =bodies[i].querySelectorAll(".item");
			var _items_height=0;
			for (var j =0 ; j<_items.length;j++){
				_items_height+=_items[j].getBoundingClientRect().height;
			}
			return _items_height;
		}
		self.close = close;
		self.updateCollapsible = function() {
			container = document.querySelector('.collapseCont');
			heads = container.querySelectorAll('.collapseHead');
			bodies = container.querySelectorAll('.collapseBody');
			var visibleHeads = [];
			var visibleBodies = [];
			for (var i = 0; i < heads.length; i++) {
				if (heads[i].style.opacity != 0) {
					visibleHeads.push(heads[i]);
					visibleBodies.push(bodies[i]);
					bodies[i].visibleItems = [];
					var items = bodies[i].querySelectorAll(".item");
					for (var j = 0; j < items.length; j++) {
						if (items[j].style.display != "none") {
							bodies[i].visibleItems.push(items[j]);
						}
					}
				}
			}
			heads = visibleHeads;
			bodies = visibleBodies;
			container.style.height = (headHeight * heads.length) + "px";
			for (var i = 0; i < heads.length; i++) {
				heads[i].style.top = (i * headHeight) + "px";
				if(bodies[i].visibleItems[0]){
					var bodyHeight = (bodies[i].visibleItems[0].getBoundingClientRect().height * bodies[i].visibleItems.length)
					bodies[i].style.top = ((((i * headHeight) + headHeight) - bodyHeight) - 2) + "px";
					bodies[i].style.height = bodyHeight + "px";
					heads[i].index = i;
					heads[i].opened = false;
					heads[i].onclick = toggleHead;
					heads[i].val = 0;
				}
			}
		};
		(function() {
			animating = false;
			container = el;
			heads = container.querySelectorAll('.collapseHead');
			bodies = container.querySelectorAll('.collapseBody');
			// set container height 
			headHeight = heads[0].getBoundingClientRect().height;
			container.style.height = (headHeight * heads.length) + "px";
			for (var i = 0; i < heads.length; i++) {
				heads[i].style.top = (i * headHeight) + "px";
//				var bodyHeight = (bodies[i].querySelector(".item").getBoundingClientRect().height * bodies[i].querySelectorAll(".item").length)
				var bodyHeight = getItemsHeight(bodies[i].querySelectorAll(".item"));
				bodies[i].style.top = ((((i * headHeight) + headHeight) - bodyHeight) - 2) + "px";
				bodies[i].style.height = bodyHeight + "px";
				heads[i].index = i;
				heads[i].opened = false;
				heads[i].onclick = toggleHead;
				heads[i].val = 0;
				self.onOpen = onOpen;
			}
		})();
	}
	window.Collapsible = collapsible;
})();
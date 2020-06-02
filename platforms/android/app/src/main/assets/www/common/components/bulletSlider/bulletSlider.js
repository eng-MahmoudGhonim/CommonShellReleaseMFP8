(function () {
	"use strict";

	var bulletSlider = function (el,autoSlide) {
		this.init(el,autoSlide);
	}

	bulletSlider.prototype = function () {
		var startX,
		endX,
		startX,startY,touchExceeded,scrolling = false;

		function slideLeft(el) {
			if (el.index == el.count - 1) {
				return;
			}
			el.val = ++el.index * el.contWidth * -1;
			el.slidsCont.style.webkitTransform = "translate3d(" + el.val
			+ "px, 0, 0)";
		}

		function slideRight(el) {
			if (el.index == 0) {
				return;
			}
			el.val = --el.index * el.contWidth * -1;
			el.slidsCont.style.webkitTransform = "translate3d(" + el.val
			+ "px, 0, 0)";
		}

		function changeIndex(el,index){
			try{
				if(el.touching) return;
				if(index >= 0 && index < el.count){
					el.animating = true;
					el.slidsCont.style.transitionDuration = "200ms";
					el.index = index;
					el.val = el.index * el.contWidth * -1;
					el.slidsCont.style.webkitTransform = "translate3d(" + el.val
					+ "px, 0, 0)";
					for (var i = 0; i < el.bullets.length; i++) {
						el.bullets[i].className = "bullet";
					}
					el.bullets[el.index].className = "bullet active";
					setTimeout(function () {
						el.animating = false;
						el.slidsCont.style.transitionDuration = "0ms";
//						if (el.onslide) {
//						el.onslide(el.index);
//						}
					}, 200);
				}

			}catch(e){console.log(e);return false;}
		}

		function ontouchstart(e) {
			try{
				var el = e.currentTarget;
				clearInterval(el.slideInterval);
				startX = endX = e.touches[0].clientX;
				startY = e.touches[0].clientY;
				el.ontouchmove = ontouchmove;
			}catch(e){
				console.log(e);

			}
		}

		function ontouchmove(e) {
			try{
				var el = e.currentTarget;
				if ((touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) && !scrolling) {
					e.preventDefault();
					e.stopPropagation();
					el.touching = true;
					if(el.animating)return;
					if (!touchExceeded) {
						touchExceeded = true;
					}
					el.val += e.touches[0].clientX - endX;

					if (el.val > 0) el.val = 0;
					if (el.val < -(el.width - (el.width / el.count))) el.val = -(el.width - (el.width / el.count));

					el.slidsCont.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";
					endX = e.touches[0].clientX;
					el.ontouchend = function(ev){
						ontouchend(ev,true);
					}
				}else{
					scrolling = true;
					el.ontouchend = function(ev){
						ontouchend(ev,false);
					}
				}
			}catch(e){
				console.log(e);

			}
		}

		function preventDefault(e){
			e.preventDefault();
			e.stopPropagation();
		}

		function ontouchend(e,pd) {
			try{
				if(pd)
					preventDefault(e)
					var el = e.currentTarget;
				el.animating = true;
				el.slidsCont.style.transitionDuration = "200ms";
				var pageWidth = el.width / el.count;
				var leftVal = -(pageWidth * el.index);
				if (el.val < leftVal) {
					if (Math.abs(Math.abs(leftVal) - Math.abs(el.val)) > pageWidth / 4) {
						slideLeft(el);
					} else {
						el.val = -(el.width * (el.index / el.count));
						el.slidsCont.style.webkitTransform = "translate3d(" + el.val
						+ "px, 0, 0)";
					}
				} else {
					if (Math.abs(Math.abs(leftVal) - Math.abs(el.val)) > pageWidth / 4) {
						slideRight(el);
					} else {
						el.val = -(el.width * (el.index / el.count));
						el.slidsCont.style.webkitTransform = "translate3d(" + el.val
						+ "px, 0, 0)";
					}
				}

				for (var i = 0; i < el.bullets.length; i++) {
					el.bullets[i].className = "bullet";
				}
				el.bullets[el.index].className = "bullet active";
				setTimeout(function () {
					el.touching = false;
					el.animating = false;
					el.slidsCont.style.transitionDuration = "0ms";
					if (el.onslide) {
						el.onslide(el.index);
					}
					if(el.autoSlide){
						el.slideInterval = setInterval(function(){
							if(el.count > 1){
								if(el.index < el.count - 1){
									changeIndex(el,++el.index);
								}else{
									changeIndex(el,0);
								}
							}else{
								clearInterval(el.slideInterval);
								el.slideInterval = null;
							}
						},8000);
					}
				}, 200);
				touchExceeded = false;
				scrolling = false;
				el.ontouchmove = null;
				el.ontouchend = null;
			}catch(e){
				console.log(e);

			}
		}

		function updateSlider(el) {
			try{
				el.slides = el.slidsCont.querySelectorAll('.slide');
				el.count = el.slides.length;
				el.slidsCont.style.width = (el.count * 100) + "%";
//				el.contWidth = el.getBoundingClientRect().width;

				el.bulletsCont.innerHTML = "";
				for (var i = 0; i < el.count; i++) {
					el.slides[i].style.width = (100/el.count) + "%";
					var div = document.createElement("div");
					div.className = "bullet";
					el.bulletsCont.appendChild(div);
				}
				if(el.count == 1){
					el.bulletsCont.style.opacity = 0;
				}else{
					el.bulletsCont.style.opacity = 1;
				}
				el.bullets = el.bulletsCont.querySelectorAll('.bullet');
				el.animating = false;
				if(el.count > 1){
					el.ontouchstart = ontouchstart;
					el.ontouchmove = ontouchmove;
					el.ontouchend = ontouchend;
				}else{
					el.ontouchstart = null;
					el.ontouchmove = null;
					el.ontouchend = null;
				}
				el.index = el.count - 1;
				el.bullets[el.index].className = "bullet active";
				el.slidsCont.style.transitionDuration = "200ms";
				setTimeout(function () {
					el.animating = true;
					el.width = el.contWidth * el.count;//el.slidsCont.getBoundingClientRect().width;
					el.val = -(el.width * (el.index / el.count));
					el.slidsCont.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";
					setTimeout(function () {
						el.animating = false;
						el.slidsCont.style.transitionDuration = "0ms";
					}, 200);
				});

				if(el.slideInterval == null || el.slideInterval == undefined){
					if(el.autoSlide){
						el.slideInterval = setInterval(function(){
							if(el.count > 1){
								if(el.index < el.count - 1){
									changeIndex(el,++el.index);
								}else{
									changeIndex(el,0);
								}
							}else{
								clearInterval(el.slideInterval);
								el.slideInterval = null;
							}
						},8000);
					}
				}

			}catch(e){console.log(e);return false;}
		}


		function addSlide(slide) {
			var el = this.el;
			slide.className += " slide";
			el.slidsCont.appendChild(slide);
			setTimeout(function(){
				updateSlider(el);
			});
		}

		function removeSlide(slide) {
			var el = this.el;
			if(el.slidsCont.contains(slide)){
				el.slidsCont.removeChild(slide);
				setTimeout(function(){
					updateSlider(el);
				});
			}
		}

		function init(el,autoSlide) {
			try{
				this.el = el;
				touchExceeded = false;
				scrolling = false;
				el.touching = false;
				el.animating = false;
				el.bulletsCont = el.querySelector(".bulletsCont");
				el.slidsCont = el.querySelector(".slidsCont");
				el.slides = el.slidsCont.querySelectorAll('.slide');
				el.count = el.slides.length;
				el.slidsCont.style.width = (el.count * 100) + "%";
				el.contWidth = el.getBoundingClientRect().width;
				el.bulletsCont.innerHTML = "";
				for (var i = 0; i < el.count; i++) {
					el.slides[i].style.width = (100/el.count) + "%";
					var div = document.createElement("div");
					div.className = "bullet";
					el.bulletsCont.appendChild(div);
				}
				if(el.count == 1)
					el.bulletsCont.style.opacity = 0;
				el.bullets = el.bulletsCont.querySelectorAll('.bullet');
				el.animating = false;
				if(el.count > 1){
					el.ontouchstart = ontouchstart;
//					el.ontouchmove = ontouchmove;
//					el.ontouchend = ontouchend;
				}else{
					el.ontouchstart = null;
					el.ontouchmove = null;
					el.ontouchend = null;
				}

				el.index = 0;
				el.width = el.slidsCont.getBoundingClientRect().width;
				el.bullets[el.index].className = "bullet active";
				el.val = -(el.width * (el.index / el.count));
				el.slidsCont.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";
				el.autoSlide = autoSlide;
				if(!el.slideInterval){
					if(el.autoSlide){
						el.slideInterval = setInterval(function(){
							if(el.count > 1){
								if(el.index < el.count - 1){
									changeIndex(el,++el.index);
								}else{
									changeIndex(el,0);
								}
							}else{
								clearInterval(el.slideInterval);
								el.slideInterval = null;
							}
						},8000);
					}
				}
			}catch(e){console.log(e);return false;}
		}

		return {
			init: init,
			get onSlide() { return this.el.onslide; },
			set onSlide(value) { this.el.onslide = value; },
			addSlide: addSlide,
			removeSlide: removeSlide,
			changeIndex:changeIndex
		}
	}();

	window.BulletSlider = bulletSlider;
})();
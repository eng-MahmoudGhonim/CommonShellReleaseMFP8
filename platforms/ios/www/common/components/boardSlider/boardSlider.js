
/* JavaScript content from components/boardSlider/boardSlider.js in folder common */
﻿(function () {
	"use strict";

	var boardSlider = function (index) {
		this.init(index);
	}

	boardSlider.prototype = function () {
		var boardSliderCont,
		el,
		startX,
		endX,
		startY,
		animating,
		touchExceeded = false,
		val = 0,
		dir,
		width,
		index = 1,
		pages,
		bullets,
		onslide = null,
		touchStarted = false,
		scrolling = false;

		function slideLeft() {
			if (index == 2) {
				return;
			}
			val = ++index * window.innerWidth * -1;
			el.style.webkitTransform = "translate3d(" + val
			+ "px, 0, 0)";
		}

		function slideRight() {
			if (index == 0) {
				return;
			}
			val = --index * window.innerWidth * -1;
			el.style.webkitTransform = "translate3d(" + val
			+ "px, 0, 0)";
		}

		function changeIndex(indx){
			index = indx;
			el.style.transitionDuration = "200ms";
			val = index * window.innerWidth * -1;
			el.style.webkitTransform = "translate3d(" + val + "px, 0, 0)";
			setTimeout(function () {
				el.style.transitionDuration = "0ms";
				if(onslide){
					onslide(index);
				}
			}, 200);
			for (var i = 0; i < bullets.length; i++) {
				bullets[i].classList.add("sliderBullet");
				bullets[i].classList.remove("active");
//				bullets[i].className = "sliderBullet";
			}
			bullets[index].classList.add("sliderBullet");
			bullets[index].classList.add("active");
//			bullets[index].className = "sliderBullet active";
		}

		function ontouchstart(e) {
			var boardSliders = document.getElementsByClassName("serviceListCtrl");
			for(var i=0;i<boardSliders.length;i++){
				if(boardSliders[i].contains(e.srcElement)){
					return;
				}
			}
			startX = endX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
//			el.ontouchmove = ontouchmove;
//			el.ontouchend = ontouchend;


			el.addEventListener('touchmove', ontouchmove,app.supportsPassive ? {passive:true} : false);
			el.addEventListener('touchend', ontouchend,app.supportsPassive ? {passive:true} : false);
			touchStarted = true;
		}

		function ontouchmove(e) {
			if(scrolling)return;
			if (touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) {
//				e.preventDefault();
				if(!touchStarted) return;
				if (animating) return;
				if (!touchExceeded) {
					touchExceeded = true;
				}
				val += e.touches[0].clientX - endX;

				if (val > 0) val = 0;
				if (val < -(width - (width / 3))) val = -(width - (width / 3));

				el.style.webkitTransform = "translate3d(" + val + "px,0,0)";
				endX > e.touches[0].clientX ? dir = "r" : dir = "l";
				endX = e.touches[0].clientX;
			}else{
				scrolling = true;
			}

		}

		function ontouchend(e) {
//			e.preventDefault();
			e.stopPropagation()
			touchStarted = false;

//			el.style.transitionDuration = "200ms";
			var pageWidth = width / 3;
			//var quarterPage = pageWidth / 4;
			//var currentPageLeft = pageWidth * index;
			var currentPageRect = pages[index].getBoundingClientRect();

//			if (currentPageRect.left != 0) {
			if (currentPageRect.left <= -1&&currentPageRect.left >= 1) {
				//check if there is movement or not
				el.style.transitionDuration = "200ms";
			}

			if (currentPageRect.left < 0) {

				if (Math.abs(currentPageRect.left) > pageWidth / 4) {
					el.style.transitionDuration = "200ms";
					slideLeft();
				} else {
					val = -(width * (index / 3));
					el.style.webkitTransform = "translate3d(" + val
					+ "px, 0, 0)";
				}
			} else {

				if (Math.abs(Math.abs(currentPageRect.right) - pageWidth) > pageWidth / 4) {
//					el.style.transitionDuration = "200ms";
					slideRight();
				} else {
					val = -(width * (index / 3));
					el.style.webkitTransform = "translate3d(" + val
					+ "px, 0, 0)";
				}
			}

			for (var i = 0; i < bullets.length; i++) {
//				bullets[i].className = "sliderBullet";

				bullets[i].classList.add("sliderBullet");
				bullets[i].classList.remove("active");
			}
//			bullets[index].className = "sliderBullet active";
			bullets[index].classList.add("sliderBullet");
			bullets[index].classList.add("active");
			setTimeout(function () {
				el.style.transitionDuration = null;
				if(onslide){
					onslide(index);
				}
			}, 200);
			touchExceeded = false;
			scrolling = false;

			el.ontouchmove = null;
			el.ontouchend = null;
		}

		function init(indx) {
			boardSliderCont = document.getElementById('boardSlider');
			el = boardSliderCont.getElementsByClassName('sliderPages')[0];
			pages = el.getElementsByClassName('slidePage');
			bullets = boardSliderCont.getElementsByClassName('sliderBullet');
//			el.ontouchstart = ontouchstart;

			el.addEventListener('touchstart', ontouchstart,app.supportsPassive ? {passive:true} : false);
			el.addEventListener('touchmove', ontouchmove,app.supportsPassive ? {passive:true} : false);

//			el.ontouchmove = ontouchmove;
			//el.ontouchend = ontouchend;
			width = el.getBoundingClientRect().width;
			index = indx || 1;
			bullets[index].classList.add("sliderBullet");
			bullets[index].classList.add("active");
//			bullets[index].className = "sliderBullet active";
			val = -(width * (index / 3));
			el.style.webkitTransform = "translate3d(" + val + "px,0,0)";
			touchExceeded = false;
			scrolling = false;
			touchStarted = false;
		}

		return {
			init: init,
			get onSlide() { return onslide; },
			set onSlide(value){onslide = value;},
			changeIndex:changeIndex
		}
	}();

	window.BoardSlider = boardSlider;
})();
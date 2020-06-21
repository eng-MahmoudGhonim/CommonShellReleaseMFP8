(function () {
    "use strict";

    var sideNav = function () {
        var me = this;
        me.init();
    }

    sideNav.prototype = function () {
        var el,
            val,
            opened,
            animating,
            startX,
            startY,
            endX,
            width,
            dir,
            black,
            touchExceeded = false;

        function open() {
            if (animating) return;
                animating = true;
                el.style.transitionDuration = "300ms";
                el.style.webkitTransitionDuration = "300ms";
                black.style.display = "block";
                val = -width;
                el.style.webkitTransform = "translate3d(" + val + "px, 0, 0)";
                setTimeout(function() {
                    black.style.opacity = 1;
                },50);
                setTimeout(function () {
                    el.style.transitionDuration = "0ms";
                    el.style.webkitTransitionDuration = "0ms";
                    opened = true;
                    animating = false;
                }, 300);
        }


        var close = function (click) {
            if (animating && !click) return;
            animating = true;
            el.style.transitionDuration = "300ms";
            el.style.webkitTransitionDuration = "300ms";
            el.style.webkitTransform = "translate3d(0, 0, 0)";
            black.style.opacity = 0;
            setTimeout(function () {
                val = 0;
                animating = false;
                opened = false;
                black.style.display = "none";
                el.style.transitionDuration = "0ms";
                el.style.webkitTransitionDuration = "0ms";
                window.sideNavTabs.changeIndex(1);
            }, 300);
        }

        var toggle = function (e) {
            opened ? close() : open();
        }

        var isOpen = function () {
            return opened;
        }

        function ontouchstart(e) {

            startX = endX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            setTimeout(function(){
//            	el.ontouchmove = ontouchmove;
//                el.ontouchend = ontouchend;
                el.addEventListener('touchmove', ontouchmove,app.supportsPassive ? {passive:true} : false);
                el.addEventListener('touchend', ontouchend,app.supportsPassive ? {passive:true} : false);

            });
        }

        function ontouchmove(e) {
            if (touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) {
//                e.preventDefault();
                if (animating) return;
                if (!touchExceeded) {
                    touchExceeded = true;
                }
                val += e.touches[0].clientX - endX;
                if (val < -width) val = -width;
                if (val > 0) val = 0;
                el.style.webkitTransform = "translate3d(" + val + "px,0,0)";
                endX > e.touches[0].clientX ? dir = "l" : dir = "r";
                endX = e.touches[0].clientX;
            }

        }

        function ontouchend(e) {
            if (opened) {
                if (Math.abs(startX - endX) < width / 4) {
                    open();
                } else {
                    if (dir == "r") {
                        close();
                    } else {
                        open();
                    }
                }
            } else {
                if (Math.abs(startX - endX) < width / 2) {
                    close();
                } else {
                    if (dir == "r") {
                        close();
                    } else {
                        open();
                    }
                }
            }
            touchExceeded = false;
            el.ontouchmove = null;
            el.ontouchend = null;
        }

        function init() {
            el = document.getElementById("sidepanel");
//            el.ontouchstart = ontouchstart;
            el.addEventListener('touchstart', ontouchstart,app.supportsPassive ? {passive:true} : false);

            width = 297;
            if(document.getElementById("sideNavBlack") == null || document.getElementById("sideNavBlack") == undefined){
	            black = document.createElement("div");
	            var closeIcon = document.createElement("span");
	            closeIcon.className = "icon icon-cancel";
              closeIcon.setAttribute("alt", "close menu");
	            black.appendChild(closeIcon);
	            black.id = "sideNavBlack";
	            black.style.position = "absolute";
	            black.style.top = "0";
	            black.style.right = "0";
	            black.style.left = "0";
	            black.style.bottom = "0";
	            black.style.zIndex = "10000000";
	            black.style.background = "rgba(0,0,0,0.6)";
	            black.style.opacity = 0;
	            black.style.transitionDuration = "300ms";
	            black.style.webkitTransitionDuration = "300ms";
	            black.style.display = "none";
	            black.onclick = close;
	            document.body.appendChild(black);
            }
            val = 0;
            opened = false;
            animating = false;
        }

        return {
            init: init,
            open: open,
            close: close,
            toggle: toggle
        }
    }();

    window.SideNav = sideNav;

})();

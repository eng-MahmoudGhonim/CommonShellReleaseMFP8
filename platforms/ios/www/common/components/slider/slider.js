(function () {
    "use strict";
    var itemsSlider = function (id, startIndex) {
        this.init(id, startIndex);
    }

    itemsSlider.prototype = function () {
        var items, count, scroller, val, endX, dir, index = 0, onchange = null, itemWidth,
            startX, startY, touchExceeded, scrolling = false;

        function touchStart(e) {
            endX = e.touches[0].clientX;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            //            scroller.ontouchmove = touchMove;
            scroller.addEventListener('touchmove', touchMove, app.supportsPassive ? { passive: true } : false);
        }

        function touchMove(e) {
            if ((touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) && !scrolling) {
                //	            e.preventDefault();
                e.stopPropagation();
                if (!touchExceeded) {
                    touchExceeded = true;
                }
                val += e.touches[0].clientX - endX;
                scroller.style.webkitTransform = "translate3d(" + val + "px,0,0)";
                endX = e.touches[0].clientX;
                //	            scroller.ontouchend = function(ev){
                //	            	touchEnd(ev,true);
                //	            }
                scroller.addEventListener('touchend', function (ev) { touchEnd(ev, true); }, app.supportsPassive ? { passive: true } : false);
            } else {
                scrolling = true;
                //        		scroller.ontouchend = function(ev){
                //	            	touchEnd(ev,false);
                //	            };
                scroller.addEventListener('touchend', function (ev) { touchEnd(ev, false); }, app.supportsPassive ? { passive: true } : false);
            }
        }

        function preventDefault(e) {
            //        	e.preventDefault();
            e.stopPropagation();
        }

        function touchEnd(e, pd) {
            if (pd)
                preventDefault(e);
            var rect = items[index].getBoundingClientRect();
            var midL = window.innerWidth / 3;
            var midR = (window.innerWidth * 2) / 3;

            if (rect.left > midL) {
                changeIndex(index - 1);
            } else if (rect.left < midL && rect.right > midR) {
                changeIndex(index);
            } else if (rect.right < midR) {
                changeIndex(index + 1);
            }
            touchExceeded = false;
            scrolling = false;
            scroller.ontouchmove = null;
            scroller.ontouchend = null;
        }

        function changeIndex(indx) {
            if (indx < 0) {
                indx = 0;
            } else if (indx > count - 1) {
                indx = count - 1;
            }

            //            var itemRect = items[indx].getBoundingClientRect(),
            //                left = (window.innerWidth - itemRect.width) / 2;
            //
            //            val += (left - itemRect.left);

            val = (20 + (itemWidth)) * indx * -1;
            scroller.style.transitionDuration = "200ms";

            scroller.style.webkitTransform = "translate3d(" + val + "px,0,0)";
            setTimeout(function () {
                items[indx].classList.add('active');
                if (indx != index)
                    items[index].classList.remove('active');
                index = indx;
                scroller.style.transitionDuration = "0ms";
                if (onchange != null) {
                    onchange(index);
                }
            }, 200);
        }

        function init(id, startIndex) {
            var wrapper = document.getElementById(id);
            scroller = wrapper.getElementsByClassName('scroller')[0];
            items = wrapper.getElementsByClassName('item');
            count = items.length;
            touchExceeded = false;
            scrolling = false;
            var vw = window.innerWidth;
            for (var i = 0; i < items.length; i++) {
                items[i].style.width = (0.82 * vw) + "px";
            }
            var right = ((0.82 * vw) + 20) * - (count - 1);
            scroller.style.right = right + "px";
            itemWidth = items[0].getBoundingClientRect().width;

            //            scroller.ontouchstart = touchStart;
            scroller.addEventListener('touchstart', touchStart, app.supportsPassive ? { passive: true } : false);

            val = 0;
            endX = 0;
            index = startIndex || 0;
            console.log(startIndex);
            val = ((20 + (itemWidth)) * -1) * startIndex;
            scroller.style.webkitTransform = "translate3d(" + val + "px,0,0)";
            // setTimeout(function () {
            //     changeIndex(1);
            // }, 900);
        }

        return {
            init: init,
            onchange: function (_onchange) {
                onchange = _onchange;
            },
            changeIndex: changeIndex
        }
    }();

    window.ItemsSlider = itemsSlider;
})();
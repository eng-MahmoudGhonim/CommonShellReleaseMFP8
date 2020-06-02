(function () {
    "use strict";

    var listSwipe = function (list) {
        this.init(list);
    }

    listSwipe.prototype = function () {
        var startX, endX, startY, touchExceeded, width;

        function touchStart(e) {
            startX = endX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.currentTarget.ontouchmove = touchMove;
            e.currentTarget.ontouchend = touchEnd;
        }

        function touchMove(e) {
            if (touchExceeded || Math.abs(startX - e.touches[0].clientX) > Math.abs(startY - e.touches[0].clientY)) {
                e.preventDefault();
                touchExceeded = true;
                if (e.currentTarget.val < -width) {
                    e.currentTarget.val += (e.touches[0].clientX - endX) * Math.abs(width / (e.currentTarget.val * 1.5));
                } else {
                    e.currentTarget.val += e.touches[0].clientX - endX;
                }

                if (e.currentTarget.val > 0) {
                    e.currentTarget.val = 0;
                }

                e.currentTarget.style.webkitTransform = "translate3d(" + e.currentTarget.val + "px,0,0)";
                endX = e.touches[0].clientX;
            }
        }

        function touchEnd(e) {
            var el = e.currentTarget;
            var left = el.getBoundingClientRect().left;
            el.style.transitionDuration = "300ms";
            if (left < -width / 2) {
                e.currentTarget.val = -width;
            } else {
                e.currentTarget.val = 0;
            }

            el.style.webkitTransform = "translate3d(" + el.val + "px,0,0)";

            setTimeout(function () {
                el.style.transitionDuration = "0ms";
            }, 300);
            touchExceeded = false;
            el.ontouchmove = null;
            el.ontouchend = null;
        }

        function init(list) {
            for (var i = 0; i < list.length; i++) {
                list[i].getElementsByClassName("itemCont")[0].ontouchstart = touchStart;
                list[i].getElementsByClassName("itemCont")[0].val = 0;
            }
            width = list[0].getElementsByClassName("backCont")[0].getBoundingClientRect().width;
        }

        return {
            init: init
        }
    }();

    window.ListSwipe = listSwipe;
})();
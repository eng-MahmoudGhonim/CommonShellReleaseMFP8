(function () {
    "use strict";

    var appZoom = function () {
        //this.init();
    }

    appZoom.prototype = function () {
        var currentDir,
            zoomControls,
            x,
            y,
            arrowTouching = false,
            animating = false,
            zoomedIn = true,
            startX,
            startY,
            endX,
            endY,
            valX,
            valY,
            initialRect,
            zoomEnabled = false,
            closeCallBack = null;


        function init() {
            zoomEnabled = true;
            var zoomTemplate = document.createElement("div");
            var baseUrlZoom= window.mobile.baseUrl;
            zoomTemplate.innerHTML = '<div id="ZoomControls"><div id="zoomPanel"><img id="imgZoomClose" class="close"/><img id="imgZoomIn" class="zoomIn"/><img id="imgZoomOut" class="zoomOut"/><img id="imgZoomLine" class="move"/></div><div class="zoomArrow zoomArrowLeft"></div><div class="zoomArrow zoomArrowRight"></div><div class="zoomArrow zoomArrowBottom"></div><div class="zoomArrow zoomArrowTop"></div></div>';
            document.documentElement.appendChild(zoomTemplate.firstChild);
            zoomControls = document.getElementById("ZoomControls");
            document.getElementById("imgZoomClose").src = baseUrlZoom+"/common/images/shell/appZoom/close.png";
            document.getElementById("imgZoomIn").src = baseUrlZoom+"/common/images/shell/appZoom/zoom-in.png";
            document.getElementById("imgZoomOut").src = baseUrlZoom+"/common/images/shell/appZoom/zoom-out.png";
            document.getElementById("imgZoomLine").src = baseUrlZoom+"/common/images/shell/appZoom/lines.png";

            var zoomArrows = zoomControls.getElementsByClassName("zoomArrow");
            for (var i = 0; i < zoomArrows.length; i++) {
                zoomArrows[i].ontouchstart = arrowTouchStart;
                zoomArrows[i].ontouchend = arrowTouchEnd;
            }
            zoomControls.getElementsByClassName("zoomIn")[0].onclick = zoomIn;
            zoomControls.getElementsByClassName("zoomOut")[0].onclick = zoomOut;
            zoomControls.getElementsByClassName("close")[0].onclick = closeZoom;
            zoomControls.getElementsByClassName("move")[0].ontouchstart = panelDragStart;
            zoomControls.getElementsByClassName("move")[0].ontouchmove = panelDrag;
            zoomControls.getElementsByClassName("move")[0].ontouchend = panelDragEnd;
            x = y = valX = valY = 0;
            initialRect = document.getElementById("zoomPanel").getBoundingClientRect();
            zoomIn();
        }


        function panelDragStart(e) {
            startX = endX = e.touches[0].clientX;
            startY = endY = e.touches[0].clientY;
        }

        function panelDrag(e) {
            e.preventDefault();
            valX += e.touches[0].clientX - endX;
            valY += e.touches[0].clientY - endY;
            if (valX < -Math.abs(initialRect.left - 45)) {
                valX = -Math.abs(initialRect.left - 45);
            } else if (valX > Math.abs(initialRect.right - (window.innerWidth - 45))) {
                valX = Math.abs(initialRect.right - (window.innerWidth - 45));
            }

            if (valY < -Math.abs(initialRect.top - 45)) {
                valY = -Math.abs(initialRect.top - 45);
            } else if (valY > Math.abs(initialRect.bottom - (window.innerHeight - 45))) {
                valY = Math.abs(initialRect.bottom - (window.innerHeight - 45));
            }


            document.getElementById("zoomPanel").style.webkitTransform =
                "translate3d(" + valX + "px," + valY + "px,0)";
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        }

        function panelDragEnd(e) {

        }

        function arrowTouchStart(e) {
            currentDir = e.currentTarget.className.replace("zoomArrow zoomArrow", "");
            arrowTouching = true;
            navigateScreen();
        }

        function navigateScreen() {
            if (!arrowTouching) return;
            switch (currentDir) {
                case "Left":
                    x++;
                    if (x >= window.innerWidth / 4) {
                        x = window.innerWidth / 4;
                    }
                    break;
                case "Right":
                    x--;
                    if (x <= -window.innerWidth / 4) {
                        x = -window.innerWidth / 4;
                    }
                    break;
                case "Top":
                    y++;
                    if (y >= window.innerHeight / 4) {
                        y = window.innerHeight / 4;
                    }
                    break;
                case "Bottom":
                    y--;
                    if (y <= -window.innerHeight / 4) {
                        y = -window.innerHeight / 4;
                        return;
                    }
                    break;
            }

            document.body.style.webkitTransform = "scale(2) translate3d(" + x + "px," + y + "px,0)";
            setTimeout(navigateScreen);
        }

        function arrowTouchEnd(e) {
            arrowTouching = false;
        }

        function zoomIn() {
            if (animating) return;
            animating = true;
            zoomedIn = true;
            var zoomArrows = zoomControls.getElementsByClassName("zoomArrow");
            for (var i = 0; i < zoomArrows.length; i++) {
                zoomArrows[i].style.display = "block";
            }
            document.body.style.transitionDuration = "300ms";
            document.body.style.webkitTransform = "scale(2) translate3d(0,0,0)";
            setTimeout(function () {
                document.body.style.transitionDuration = "0ms";
                for (var i = 0; i < zoomArrows.length; i++) {
                    zoomArrows[i].style.opacity = 1;
                }
                animating = false;
            }, 300);
            x = y = 0;
        }

        function zoomOut() {
            if (animating) return;
            animating = true;
            zoomedIn = false;
            var zoomArrows = zoomControls.getElementsByClassName("zoomArrow");
            document.body.style.transitionDuration = "300ms";
            document.body.style.webkitTransform = "scale(1) translate3d(0,0,0)";
            for (var i = 0; i < zoomArrows.length; i++) {
                zoomArrows[i].style.opacity = 0;
            }
            setTimeout(function () {
                document.body.style.transitionDuration = "0ms";
                for (var i = 0; i < zoomArrows.length; i++) {
                    zoomArrows[i].style.display = "none";
                }
                animating = false;
            }, 300);
        }

        function closeZoom() {
            if (animating) return;
            zoomEnabled = false;
            if (zoomedIn) {
                zoomOut();
                setTimeout(function () {
                    document.documentElement.removeChild(zoomControls);
                }, 350);
            } else {
                document.documentElement.removeChild(zoomControls);
            }

            if(closeCallBack != null)
            	closeCallBack();
        }

        function toggle() {
            zoomEnabled ?
                closeZoom() : init();
        }

        function isZoomEnabled(){
        	return zoomEnabled;
        }

        function onClose(callBack){
        	closeCallBack = callBack;
        }

        return {
            toggle: toggle,
            isZoomEnabled: isZoomEnabled,
            onClose:onClose
        }
    }();

    window.AppZoom = appZoom;
})();

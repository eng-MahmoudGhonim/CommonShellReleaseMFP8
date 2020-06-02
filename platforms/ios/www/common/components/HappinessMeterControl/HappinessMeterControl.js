
(function () {
    "use strict";


    var happinessMeter = function () {
        this.init();
    }

    happinessMeter.prototype = function () {
        var happinessMeterControl,
            happinessMeterWrapper,
            happinessIframe,
            happinessMeterBlack,
            happinessLoader,
            animating = false,
            hideTimeout = null,
            showInterval = null,
            happinessOpen = false,
            visible = false;
        function show(getUrl) {
            visible = true;
            if (animating) return;
            animating = true;
            clearTimeout(hideTimeout);
            clearInterval(showInterval);
            happinessLoader.style.display = "block";
            happinessMeterControl.style.webkitTransform = "translate3d(0,0,0)";
            setTimeout(function () {
                happinessMeterBlack.style.opacity = 1;
                happinessMeterWrapper.style.webkitTransform = "scale(1)";
                happinessLoader.style.webkitTransform = "scale(1)";
                happinessMeterWrapper.style.borderRadius = "0px";
                setTimeout(function () {
                    animating = false;
                    happinessOpen = true;
                    getUrl(function (status, url) {
                        if (status != "SUCCESS") {
                            hide();
                            return;
                        }

                        if (!happinessOpen)
                            return;
                        happinessIframe.contentWindow.location.replace(url)
                        happinessIframe.onload = function () {
                            setTimeout(function () {
                                showInterval = setInterval(function () {
                                    if (happinessIframe.contentDocument.body.querySelector('[type="submit"]') != null) {
                                        //                                        happinessIframe.contentDocument
                                        //                                        .body.querySelector('[type="submit"]').onclick = function () {
                                        //                                            hideTimeout = setTimeout(function () {
                                        //                                                hide();
                                        //                                            }, 5000);
                                        //                                        }
                                        happinessLoader.style.display = "none";
                                        happinessIframe.style.display = "block";
                                        var choices = happinessIframe.contentDocument.querySelectorAll('.hmf-face-wrapper');
                                        clearInterval(showInterval);
                                        for (var i = 0; i < choices.length; i++) {
                                            choices[i].addEventListener('click', function () {
                                                setTimeout(function () {
                                                    happinessIframe.contentDocument.querySelector('.hmf-feedback-textarea').style.setProperty("height", "150px", "important");
                                                }, 300);
                                            }, false);
                                        }
                                    }
                                }, 100);

                            }, 300);
                        }
                    });
                }, 300);
            }, 500);

        }

        function hide() {
            visible = false;
            if (animating) return;
            animating = true;
            happinessOpen = false;
            clearTimeout(hideTimeout);
            clearInterval(showInterval);
            happinessIframe.onload = null;
            happinessIframe.contentWindow.location.replace("")
            happinessIframe.style.display = "none";
            happinessLoader.style.display = "block";
            happinessLoader.style.webkitTransform = "scale(6)";
            happinessMeterWrapper.style.webkitTransform = "scale(0.15)";
            happinessMeterWrapper.style.borderRadius = "500px";
            happinessMeterBlack.style.opacity = 0;
            setTimeout(function () {
                happinessMeterControl.style.webkitTransform = "translate3d(0,120%,0)";
                animating = false;
                if (HappinessMeter.onHide) {
                    HappinessMeter.onHide();
                }
            }, 300);
        }


        function init() {
            happinessMeterControl = document.createElement('div');
            happinessMeterControl.id = "happinessMeterControl";

            happinessMeterWrapper = document.createElement('div');
            happinessMeterWrapper.id = "happinessMeterWrapper";

            happinessMeterBlack = document.createElement('div');
            happinessMeterBlack.id = "happinessMeterBlack";

            happinessIframe = document.createElement('iframe');
            happinessIframe.id = "happinessIframe";

            happinessLoader = document.createElement('span');
            happinessLoader.id = "happinessLoader";
            happinessLoader.className = "hmf-face HappinessMeter-happy-face textColorCS";

            happinessMeterWrapper.appendChild(happinessIframe);
            happinessMeterWrapper.appendChild(happinessLoader);
            happinessMeterControl.appendChild(happinessMeterBlack);
            happinessMeterControl.appendChild(happinessMeterWrapper);

            document.body.appendChild(happinessMeterControl);

            //            document.addEventListener('backbutton', function(e){
            ////            	e.preventDefault();
            //            	hide();
            //            });
            happinessMeterBlack.onclick = hide;
            //            self.visible=false;
        }
        function isVisible() {
            return visible;
        }
        return {
            init: init,
            show: show,
            hide: hide,
            onHide: null,
            visible: isVisible
        }
    }();

    window.HappinessMeter = happinessMeter;

})();
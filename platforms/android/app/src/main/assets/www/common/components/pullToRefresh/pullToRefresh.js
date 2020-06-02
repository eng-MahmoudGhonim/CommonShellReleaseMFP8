
/* JavaScript content from components/pullToRefresh/pullToRefresh.js in folder common */
(function () {
	"use strict";

	window.CSPullToRefresh = function (el, onReload) {

		var self = this,
			startY,
			endY,
			pullEnabled,
			val,
			touchExceeded,
			startX,
			loading = false,
			touching = false,
			path = document.querySelector("#pullToRefreshPath"),
			info = document.querySelector("#refreshInfo"),
			pullDeltaY = 0,
			pullSlowCoef = 1.2,
			leftX = 0,
			maxPullY = 300,
			minReleaseY = 120,
			contentYCoef = 0.4,
			bodyOffsetX = 0,
			bodyW = window.innerWidth,
			height = 1,
			resetAT = 500,

			resetD = "M0,1 C125,1 250,1 " + bodyW + ",1 S" + bodyW + ",0 " + bodyW + ",1 L" + bodyW + ",0 0,0z",
			loadingD = "M0,55 C87,55 112,55 162,55 S237,55 " + bodyW + ",55 L" + bodyW + ",0 0,0z",

			easings = {
				elastic: function (t, b, c, d) {
					var ts = (t /= d) * t;
					var tc = ts * t;
					return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
				},
				inCubic: function (t, b, c, d) {
					var tc = (t /= d) * t * t;
					return (tc);
				}
			};

		function SvgPathTween(from, to, time, easing) {
			try {
				var regex = /\d+(\.\d{1,2})?/g;
				var fromD = from.getAttribute("d");
				var fm = fromD.match(regex);
				var tm = to.match(regex);
				var diff = [];
				for (var i = 0; i < fm.length; i++) {
					diff.push(fm[i] - (tm[i]));
				}
				var time = time || 600;
				var curFrame = 0;
				var frames = time / 1000 * 60;
				var easing = easing || "elastic";

				function animate() {
					if (touching && !loading) return;
					if (curFrame > frames) return;
					var i = 0;
					var newD = fromD.replace(regex, function (m) {
						if (+m === 0 || // if nothing changed - skip
							i % 2 === 0) { // in this demo I want to animate only y values
							i++;
							return m;
						}
						return +easings[easing](curFrame, +fm[i], 0 - diff[i++], frames).toFixed(2);
					});
					newD = newD.replace(new RegExp("--", "g"), "-");
					if (from)
						from.setAttribute("d", newD);
					curFrame++;
					requestAnimationFrame(animate);
				};

				animate();
			} catch (e) { console.log(e); }
		};

		function reset(time, ease) {
			try {
				el.style.transitionDuration = "300ms";
				el.style.webkitTransform = "translate3d(0,0,0)";
				info.style.transitionDuration = "200ms";
				info.style.webkitTransform = "translate3d(0,0,0)";
				info.style.opacity = 0;
				setTimeout(function () {
					info.className = "";
					path.style.fill = "";
					info.style.transitionDuration = "0ms";
				}, 300);
				SvgPathTween(path, resetD, time, ease);
			} catch (e) { console.log(e); }
		};

		function performMagic() {
			try {
				el.style.transitionDuration = "300ms";
				el.style.webkitTransform = "translate3d(0,55px,0)";
				info.style.transitionDuration = "200ms";
				info.style.webkitTransform = "translate3d(0px, 57px, 0px)";
				SvgPathTween(path, loadingD);
				info.className = "active";
				loading = true;
				onReload();
				//                setTimeout(function () {

				//                }, 5000);
			} catch (e) { console.log(e); }
		};


		function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return strTime;
		}

		function formatDate(date) {
			var dd = date.getDate();
			var mm = date.getMonth() + 1; //January is 0!

			var yyyy = date.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			var today = dd + '/' + mm + '/' + yyyy;
			return today;
		}

		self.reloadFinished = function () {
			try {

				console.log("ontouchstart");

				var lastupdate = info.querySelector("#lastpulled");
				var now = new Date();
				var lastText = formatDate(now) + " " + formatAMPM(now);
				lastupdate.innerText = lastText;

				info.className = "refreshed";
				if (path)
					path.style.fill = "rgb(11,194,74)";
				setTimeout(function () {
					loading = false;
					reset(200, "inCubic");
				}, 5000);
			} catch (e) { console.log(e); }
		}

		self.isLoading = function () {
			return loading;
		}

		function release() {
			//animating = true;
			if (loading) return;
			if (val < 250) {
				reset(2000);
			} else {
				performMagic();
			}
		};


		function ontouchstart(e) {
			try {
				console.log("ontouchstart")
				if (!navigator.onLine) return;
				endY = e.touches[0].clientY;
				startY = e.touches[0].clientY;
				startX = e.touches[0].clientX;
				val = 0;
				el.ontouchmove = ontouchmove;
			} catch (e) { console.log(e); }
		}

		function ontouchmove(e) {
			try {
				console.log("ontouchmove")
				// if (el.getBoundingClientRect().left != 0) return;
				if (el.getBoundingClientRect().left <= -1 && el.getBoundingClientRect().left >= 1) { return; }
				if (touchExceeded || Math.abs(startX - e.touches[0].clientX) < Math.abs(startY - e.touches[0].clientY)) {
					if ((endY < e.touches[0].clientY || val > 0) && el.scrollTop == 0 && e.cancelable) {
						if (loading) return;
						//helper.style.opacity = "1";

						touching = true;
						e.preventDefault();
						e.stopPropagation();

						if (!touchExceeded) {
							touchExceeded = true;
							endY = e.touches[0].clientY;
						}
						val += e.touches[0].clientY - endY;

						if (val <= 0) val = 0;
						if (val > 300) val = 300;
						var x = e.touches[0].clientX;
						//pullDeltaY = (e.touches[0].clientY - startY) / pullSlowCoef;
						var pullY = (val <= maxPullY) ? val : maxPullY;
						if (pullY < 0) pullY = 0;
						var pullYCont = +(pullY * contentYCoef).toFixed(2);
						var bodyX = parseInt(x - bodyOffsetX, 10);
						if (bodyX < 0) bodyX = 0;
						if (bodyX > bodyW) bodyX = bodyW;
						leftX = bodyX - 50;
						if (leftX < 0) leftX = 0;
						var rightX = bodyX + 50;
						if (rightX > bodyW) rightX = bodyW;
						height = (((pullYCont) * 70) / 150).toFixed(2);;

						path.setAttribute("d", "M0," + height + " C" + (leftX - 25) + "," + height + " " + (leftX) + "," + (pullYCont + 1) + " " + bodyX + "," + (pullYCont + 1) + " S" + (rightX + 25) + "," + height + " 375," + height + " L375,0 0,0z");
						info.style.webkitTransform = "translate3d(0," + height + "px,0)";
						info.style.opacity = height / 48;
						if (val >= 250) {
							info.querySelector(".pullDownTip").textContent = localize("%shell.dashboard.releasetorefresh%");
						} else {
							info.querySelector(".pullDownTip").textContent = localize("%shell.dashboard.pulltorefresh%");
						}
						endY = e.touches[0].clientY;

					}
				}
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}

		function ontouchend(e) {
			try {
				console.log("ontouchend")
				touchExceeded = false;
				touching = false;
				el.ontouchmove = null;
				release();
				return true;
			} catch (e) { console.log(e); return false; }
		}

		self.disable = function () {
			val = 0;
			ontouchend();
			el.ontouchstart = null;
			el.ontouchend = null;
		}

		self.enable = function () {
			try {
				el.ontouchstart = ontouchstart;
				el.ontouchend = ontouchend;
			} catch (e) { console.log(e); }
		}

			//constructor
			;
		(function () {
			touchExceeded = false;
			el.ontouchstart = ontouchstart;
			el.ontouchend = ontouchend;
			
			pullEnabled = false;
			val = 0;
			var lastupdate = info.querySelector("#lastpulled");
			var now = new Date();
			var lastText = formatDate(now) + " " + formatAMPM(now);
			lastupdate.innerText = lastText;
		})();
	}

})();

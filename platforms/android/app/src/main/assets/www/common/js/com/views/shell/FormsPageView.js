define(["com/views/PageView",
        "com/views/Header"],
        function(PageView, Header) {
	var DashboardPageView = PageView.extend({
		events: {
			'pageshow': 'onPageShow',
		},
		initialize: function(options) {
			dashboardPageViewInstance = this;
			language = getApplicationLanguage();
			options.phoneTitle = "Form";
			options.headerState = Header.STATE_MENU;
			options.preventiOSDefaultScroll=true;
			options.currentScrollingContentId = "dashboardPage";
			PageView.prototype.initialize.call(this, options);
		},
		onPageShow: function() {
			
			var options={
					direction:"ltr",
					element:document.getElementById("formPagePinInput"),
					autoClearFocus:true,
					onComplete:function(){
						console.log(pinInput.value)
					}
			}
			var pinInput = new PinInput(options);
			window.pinInput = pinInput;
			
			var options={
					direction:"ltr",
					element:document.getElementById("formPagePinInput2"),
					autoClearFocus:true,
					onComplete:function(){
						console.log(pinInput2.value)
					}
			}
			var pinInput2 = new PinInput(options);
			window.pinInput2 = pinInput;
			
			var options={
					direction:"ltr",
					element:document.getElementById("formStepper"),
					enablePages:true
			}
			var stepper = new Stepper(options);
			window.formstepper = stepper;
			formstepper.activateStep(1);
			
			var options={
					direction:"rtl",
					element:document.getElementById("formStepper2"),
					enablePages:false
			}
			var stepper2 = new Stepper(options);
			window.formstepper2 = stepper2;
			
			var options={
					direction:"rtl",
					element:document.getElementById("formStepper3"),
					enablePages:false
			}
			var stepper3 = new Stepper(options);
			window.formstepper3 = stepper3;

			
			
			
			document.getElementById("shell-button").onclick = function(event){
				formstepper.activateStep(1);

			};
			setTimeout(function(){
				window.plugins.nativepagetransitions.executePendingTransition(
						function (msg) {}, // called when the animation has finished
						function (msg) {} // called in case you pass in weird values
				);
			},300);			
			setTimeout(function(){
				document.getElementById("header").style.webkitTransform = "translate3d(0,0,0)";

				document.getElementById("footer").style.webkitTransform = "translate3d(0,0,0)";

			},700);


			document.getElementById("shell-select").onchange = function(event){
				alert(event.target.value);

			};

			/*document.getElementById("shell-checkbox").onchange = function(event){
				if(this.checked) {
					$(".shell-lever").removeClass("shell-lever-active");
 					 alert('checked')
				}else{
					$(".shell-lever").addClass("shell-lever-active");

 					 alert('not checked')
				}				
			};*/

		},
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},


	});

	// Returns the View class
	return DashboardPageView;

});

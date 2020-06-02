(function(){
	'use strict';
	var Stepper=function (options){
		//variables defined here.
		//all unique varabiles should be here.
		this.el=options.element;
		this.direction=options.direction;
		this.enablePages=options.enablePages;
		this.index = 0;
		this.count =0; 	
		this.init(options);
	};
	Stepper.prototype=function(){
		//private functions defined here

		var init=function(options){
			var vw = (window.innerWidth > 0) ? window.innerWidth : screen.width;

			if (this.direction=="rtl"){
				this.el.classList.add('rtlstepper');
			}else {
				this.el.classList.remove('rtlstepper');
			}

			if (this.el.getElementsByClassName("stepper")[0].getElementsByClassName("stepper-item").length>0)
				this.count = this.el.getElementsByClassName("stepper")[0].getElementsByClassName("stepper-item").length;

			var itemWidth = vw/ this.count * (0.9);
			for (var i=0 ; i< this.count ; i++){
				var el = this.el.getElementsByClassName("stepper-item")[i];
				el.style.width = itemWidth+"px";
				if (this.enablePages==true){
					var _this=this;
					el.onclick = function (e) {
						e.preventDefault();
						onItemClick.call(_this,e);
					}
				}
			}
		},
		onItemClick=function (e){
			if (e.currentTarget.className.indexOf("completed")>-1){
				var newIndex = this.el.getElementsByClassName('stepper-number')[0].getElementsByTagName('i')[1].innerText;
				activateStep.call(this,newIndex-1);
			}
		},
		activateStep=function (index){
			var vw = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			var el="";
			for (var i=0 ; i<this.count ; i++){
				el = this.el.getElementsByClassName("stepper-item")[i];

				if (i<index){
					el.classList.add('completed');
					el.classList.remove('active');
				}else if (i==index){
					el.classList.add('active');
					el.classList.remove('completed');
				}else{
					el.classList.remove('active');
					el.classList.remove('completed');
				}
			}
			if (index<this.count && this.enablePages==true){
				var translate = -1* index *vw;
				if(this.direction=="rtl") translate*=-1;
				var pageEL= this.el.getElementsByClassName("pagesCont");
				pageEL[0].style.webkitTransform = "translate3d("+translate+"px,0,0)";
			}
		};

		return{
			//public members defined here as 
			//with revealing module pattern
			init:init,
			activateStep:activateStep
		}

	}();
	window.Stepper = Stepper;


})();
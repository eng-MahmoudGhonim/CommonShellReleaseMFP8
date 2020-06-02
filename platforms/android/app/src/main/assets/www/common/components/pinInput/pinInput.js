(function(){
	'use strict';

	var pinInput = function(options){
		var self = this;
		self.options=options;
		self.value=null;

		var index = 0;
		var count =0; 
		var inputs=null;
		var inputsContainer=null;



		//private methods
		var onInput =function (event){
			var item = event.currentTarget
			var index = Array.prototype.indexOf.call(item.parentNode.children, item);
			var nextEL= inputs[++index];
			if( this.value !=""){
				if(nextEL){
					nextEL.focus();
				}else{
					item.blur();
				}
			}
			this.value = this.value.replace(this.oldVal, "");
			this.oldVal = this.value;
			updateValue();

			if(self.onchange)
				self.onchange(self.value);
		}

		var onblur = function(){
			if(self.onchange)
				self.onchange(self.value);
		}
		var onKeydown=function(){
			var key = event.keyCode || event.charCode;
			//Handle Delete button
			if(key == 8 || key == 46 ){
				if(this.oldVal=="" ){
					var item = event.currentTarget
					var index = Array.prototype.indexOf.call(item.parentNode.children, item);
					var lastEL= inputs[--index];
					if(lastEL){
						lastEL.focus();
					}else{
						item.blur();
					}
				}
				else{
					this.value=this.oldVal="";
				}}
		}
		var updateValue=function(){
			if (self.isVaild()==true){
				self.value="";
				for (var i=0 ; i< count ; i++){
					self.value+=inputs[i].value.toString();
				} 
				if (self.options.onComplete){
					self.options.onComplete();
				}
			}else {
				self.value=null;
			}
		}

		//public methods
		self.isVaild=function (){
			var vaild=true;
			for (var i=0 ; i< count ; i++){
				if(inputs[i].value == "" )
					vaild=false;
			} 
			return vaild;
		}
		self.clear=function (){
			for (var i=0 ; i< count ; i++){
				inputs[i].value = "";
				inputs[i].oldVal = "";
			}
			self.value=null;
		}


		//constructor
		;(function(){
			try {
				self.onchange = null;
				//Get the Wrapper element 
				inputsContainer= self.options.element;
				//Get all component inputs
				inputs = self.options.element.getElementsByClassName("pin-input");
				//update the count of inputs
				if (inputs.length>0)
					count = inputs.length;

				if (self.options.direction=="rtl"){
					inputsContainer.classList.add('rtl-pin-input');
				}else {
					inputsContainer.classList.remove('rtl-pin-input');
				}

				//add input listener for all inputs 
				for (var i=0 ; i< count ; i++){
					var el = inputs[i];
					el.oninput = onInput;
					el.onkeydown =onKeydown;
					el.onblur = onblur;
					el.oldVal = '';
				} 
			}catch(e){
				console.error(JSON.stringify({error : e}));
			}
		})();

	};

	window.PinInput = pinInput;


})();
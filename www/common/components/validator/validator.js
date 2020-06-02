(function () {
	"use strict";

	var validator = function (el, options) {
		var self = this;
		var regularExpresions = {
				userName: /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?][.0-9a-z]*[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/i,
				password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&.^\-_+=\/\\\`\?\,\\\/"'()<>\[\]\{\|\}\{\|\};:\~])[A-Za-z\d$@$!%*#?&.^\-_+=\/\\\`\?\,\\\/"'()<>\[\]\{\|\}\{\|\};:\~]{8,30}$/,
				email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				name: /^([a-zA-Z-\u0600-\u06FF]+\s)*[a-zA-Z-\u0600-\u06FF]+$/,
				phone: /^(?:\+971|00971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/,
				length: /^.{7,7}$/,
				empty: /^(?!\s*$).+/
		}
		var _options = {
				validations: [
				              {
				            	  regEx: regularExpresions.empty,
				            	  errorMessage: "",
				            	  order: 0
				              }
				              ],
				              onValidate: null
		}
		var timer;
		function onInput(e) { 
			self.visited ? self.validate(true):self.validate();
		}

		function onBlur(e) {
			self.visited = true;
			self.validate(true);	
		}

		function applyValidation(valid, errorMessage) {
			if (valid) {
				self.el.classList.add("valid");
				self.el.classList.remove("notValid");
			} else {
				self.el.querySelector(".errorMessage").textContent = errorMessage;
				self.el.classList.remove("valid");
				self.el.classList.add("notValid");
			}
		}

		self.removeValidation = function(){
			self.el.className = self.el.className.replace(new RegExp("notValid", 'g'), "");
			self.el.className += " valid";
		}

		self.validate = function (apply) {
			var valid = false;
			var errorMessage = "";
			for (var i = 0; i < self.validations.length; i++) {
				if (self.validations[i].regEx instanceof RegExp) {
					valid = self.validations[i].regEx.test(self.input.value);
				} else if (typeof self.validations[i].regEx == "function") {
					valid = self.validations[i].regEx(self.input.value,self.input);
				} else if (typeof self.validations[i].regEx == "string") {
					valid = regularExpresions[self.validations[i].regEx].test(self.input.value);
				}
				if (!valid) {
					errorMessage = self.validations[i].errorMessage;
					break;
				}
			}


			self.isValid = valid;
			if (self.onValidate)
				self.onValidate(valid,self.input);

			if(apply)
				applyValidation(valid,errorMessage);

			return {
				valid: valid,
				errorMessage: errorMessage
			};
		}


		//Constructor
		;
		(function () {
			self.el = el;

			self.validations = options.validations.sort(function (a, b) {
				return a.order - b.order;
			});
			self.el.className = self.el.className.replace(new RegExp("notValid", 'g'), "");
			self.onValidate = options.onValidate;

			self.input = el.querySelector("input");
			self.visited = false;
			self.isValid = false;

			self.input.oninput = onInput;
			self.input.onblur = onBlur;
		})();
	}

	var formValidator = function (options) {
		var self = this;

		var _options = {
				inputs: [],
				onFormValid: null
		}

		function onValidate() {
			var valid = true;
			for (var i = 0; i < self.inputs.length; i++) {
				valid = self.inputs[i].isValid && valid;
			}
			if (self.onFormValid) {
				self.onFormValid(valid);
			}
		}

		self.isFormValid = function () {
			var valid = true;
			for (var i = 0; i < self.inputs.length; i++) {
				valid = self.inputs[i].isValid && valid;
			}

			return valid;
		};

		//Constructor
		; (function () {
			for (var i in _options) {
				if (!options.hasOwnProperty(i))
					options[i] = _options[i];
			}

			self.onFormValid = options.onFormValid;

			self.inputs = options.inputs;

			for (var j = 0; j < self.inputs.length; j++) {
				self.inputs[j].onValidate = onValidate;
			}
		})();
	}


	window.Validator = validator;
	window.FormValidator = formValidator;
})();
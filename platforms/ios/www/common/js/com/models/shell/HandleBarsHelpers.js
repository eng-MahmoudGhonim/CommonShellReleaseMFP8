define(["handlebars"], function(Handlebars){
	Handlebars.registerPartial('myPartial', '{{name}}')
	Handlebars.registerHelper('list', function(context, options) {
		var ret = "";
		
		for(var i=0, j=context.length; i<j; i++) {
			context[i].index = i;
			ret = ret + options.fn(context[i]);
		}
		return ret;
	});
	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
		switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '!==':
			return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
		}
	}); 
		Handlebars.registerHelper('switchCase', function (v1, options) {
			/*switch (v1) {
			// for cases 
				return options.fn(this);
			break;
			//for Default
			default:
				return options.inverse(this);
			}*/
		});
	});

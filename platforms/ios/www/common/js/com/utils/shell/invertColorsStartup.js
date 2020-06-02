(function(){
	var invertedColors = localStorage.getItem("shellInvertedColors");
	invertedColors = invertedColors != null ?
		JSON.parse(invertedColors):
		false;
	if(invertedColors){
		document.documentElement.style.webkitFilter = "invert(100%)";
		document.documentElement.style.filter = "invert(100%)";
	}
	
	var BlackAndWhite = localStorage.getItem("shellBlackAndWhite");
	BlackAndWhite = BlackAndWhite != null ?
		JSON.parse(BlackAndWhite):
		false;
	if(BlackAndWhite){
		document.documentElement.style.webkitFilter = "grayscale(100%)";
		document.documentElement.style.filter = "grayscale(100%)";
	}
//	document.documentElement.style.background = "#ee3c41";
})();
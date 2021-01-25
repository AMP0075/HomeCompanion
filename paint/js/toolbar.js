(function(){
	var colorOptionsContainer = document.getElementById("toolbar-pen-color");
	var sizeOptionsContainer  = document.getElementById("toolbar-pen-size");
	var colorOptions = document.getElementById("toolbar-pen-color-list");
	var sizeOptions  = document.getElementById("toolbar-pen-size-list");
	var colorOptionsValues = document.getElementsByClassName("toolbar-pen-color-list-item");
	var sizeOptionsValues  = document.getElementsByClassName("toolbar-pen-size-list-item");
	var currentColorValue  = document.getElementById("toolbar-pen-color-value");
	var currentSizeValue   = document.getElementById("toolbar-pen-size-value");

	//Set hide them
	colorOptions.style.display = sizeOptions.style.display = "none";

	colorOptionsContainer.onclick = function(){
		sizeOptions.style.display = "none";
		if(colorOptions.style.display == "none"){
			colorOptions.style.display = "block";
		} else {
			colorOptions.style.display = "none";
		}
	};

	sizeOptionsContainer.onclick = function(){
		colorOptions.style.display = "none";
		if(sizeOptions.style.display == "none"){
			sizeOptions.style.display = "block";
		} else {
			sizeOptions.style.display = "none";
		}
	};

	//Change color event handlers
	for(var i = 0; i < colorOptionsValues.length; i++){
		colorOptionsValues[i].onclick = function(){
			document.getElementById("color-selected").id = "";
			this.id = "color-selected";
			context.strokeStyle = "" + this.childNodes[0].nodeValue;
			currentColorValue.style.backgroundColor = "" + this.childNodes[0].nodeValue;
		};
	}

	//Change pen size
	for(var i = 0; i < sizeOptionsValues.length; i++){
		sizeOptionsValues[i].onclick = function(){
			document.getElementById("size-selected").id = "";
			this.id = "size-selected";
			context.lineWidth = this.childNodes[0].nodeValue.replace("px", "");
			currentSizeValue.innerHTML = "(" + this.childNodes[0].nodeValue + ")";
		};
	}
})();
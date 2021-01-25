var canvas = document.getElementById("the-canvas"),
context = canvas.getContext("2d"),
isDraw  = false,
redoUndoImg = document.getElementById("undo-redo-img"),
undoBtn = document.getElementById("toolbar-undo"),
redoBtn = document.getElementById("toolbar-redo"),
undoContent = Array(),
redoContent = Array();

// Get the buttons and asign event handlers
// and the close button in the image viewer
var downloadImageBtn, previewImageBtn, clearCanvasBtn, closeViewerBtn;
downloadImageBtn = document.getElementById("download-image");
previewImageBtn = document.getElementById("preview-image");
clearCanvasBtn  = document.getElementById("clear-canvas");
closeViewerBtn  = document.getElementById("close-img-preview");
	
// Add Event handlers
undoBtn.onclick = undo;
redoBtn.onclick = redo;
canvas.onmousedown = startToDraw;
canvas.onmouseup   = stopToDraw;
canvas.onmouseout  = stopToDraw;
canvas.onmousemove = draw;
clearCanvasBtn.onclick  = clearCanvas;
previewImageBtn.onclick = previewImage;
closeViewerBtn.onclick  = closeViewer;
downloadImageBtn.onclick = downloadImage;
	
function startToDraw(e){
	isDraw = true;	
	context.beginPath();
	context.moveTo(e.pageX - canvas.offsetLeft,
					e.pageY - canvas.offsetTop);
}
	
function stopToDraw(){
	undoContent.push(canvas.toDataURL());
	if(isDraw){
		if(undoContent.length == 20){
			undoContent.shift();
		}
		undoBtn.className = "";
		//console.log("Undos: " + undoContent.length);
	}
	isDraw = false;
}
	
function draw(e){
	if(isDraw == true){
		context.lineTo(e.pageX - canvas.offsetLeft,
						e.pageY - canvas.offsetTop);
		context.stroke();
	}
}
	
function downloadImage(){
	var data = canvas.toDataURL("image/png");
	window.location.href = data.replace("image/png", "image/octet-stream");	
}

function previewImage(){
	var img = document.getElementById("your-image");
	img.src = canvas.toDataURL();
	var imgCont = document.getElementById("the-image-cont");
	imgCont.style.display = "block";
}
	
function clearCanvas(){
	context.clearRect(0, 0, canvas.width, canvas.height);
}
	
function closeViewer(){
	var imgCont = document.getElementById("the-image-cont");
	imgCont.style.display = "none";
}


function undo(e){
	e.preventDefault();
	clearCanvas();
	var canvasImg   = undoContent.pop();
	redoUndoImg.src = canvasImg;
	redoContent.push(canvasImg);
	
	if(undoContent.length == 0){
		undoBtn.className = "disabled";
	}
	redoBtn.className = "";
	context.drawImage(redoUndoImg, 0, 0);
	//console.log("Undos: " + undoContent.length);
}

function redo(){
	var canvasImg   = redoContent.pop();
	redoUndoImg.src = canvasImg;
	undoContent.push(canvasImg);
	clearCanvas();
	context.drawImage(redoUndoImg, 0, 0);

	if(redoContent.length == 0){
		redoBtn.className = "disabled";
	}
	undoBtn.className = "";
}

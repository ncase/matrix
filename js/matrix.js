function $(selector){
	return document.querySelectorAll(selector);
}

var transform = {};
var mtx_expanded_left = $("#mtx_expanded span.left");
function updateMatrixLeft(){

	for(var i=0;i<6;i++){
		var m = mtx_expanded_left[i];
		var t = mtx_transforms[i];
		m.innerHTML = t.value;
	}

	transform.a = parseFloat(mtx_transforms[0].value) || 0;
	transform.b = parseFloat(mtx_transforms[1].value) || 0;
	transform.tx = parseFloat(mtx_transforms[2].value) || 0;
	transform.c = parseFloat(mtx_transforms[3].value) || 0;
	transform.d = parseFloat(mtx_transforms[4].value) || 0;
	transform.ty = parseFloat(mtx_transforms[5].value) || 0;

	draw();

}

// Mouse
var Mouse = {
	x: 0,
	y: 0
};

// Make inputs scrubbable
var scrubInput = null;
var scrubPosition = {x:0, y:0};
var scrubStartValue = 0;
function makeScrubbable(input){
	input.onmousedown = function(e){
		scrubInput = e.target;
		scrubPosition.x = e.clientX;
		scrubPosition.y = e.clientY;
		scrubStartValue = parseFloat(input.value);
	}
	input.onclick = function(e){
		e.target.select();
	}
}
window.onmousemove = function(e){
	// Mouse
	Mouse.x = e.clientX;
	Mouse.y = e.clientY;

	// If browser allows it, try to find x/y relative to canvas rather than page
	if(e.offsetX != undefined){
		Mouse.x = e.offsetX;
		Mouse.y = e.offsetY;
	}
	else if(e.layerX != undefined && e.originalTarget != undefined){
		Mouse.x = e.layerX-e.originalTarget.offsetLeft;
		Mouse.y = e.layerY-e.originalTarget.offsetTop;
	}

	// Scrubbing
	if(!scrubInput) return;
	scrubInput.blur();
	var deltaX = e.clientX - scrubPosition.x;
	deltaX = Math.round(deltaX/10)*0.1; // 0.1 for every 10px
	var val = scrubStartValue + deltaX;
	scrubInput.value = (Math.round(val*10)/10).toFixed(1);
	updateMatrixLeft();

}
window.onmouseup = function(){
	scrubInput = null;
}

var mtx_transforms = $("#mtx_transform input");
for(var i=0;i<mtx_transforms.length;i++){
	var input = mtx_transforms[i];
	input.onchange = updateMatrixLeft;
	makeScrubbable(input);
}

var mtx_inputs = $("#mtx_input div");
var mtx_outputs = $("#mtx_output div");
var mtx_expanded_right = $("#mtx_expanded span.right");
var mtx_expanded = $("#mtx_expanded")[0];
function updateMatrixRight(){

	for(var i=0;i<9;i++){
		var m = mtx_expanded_right[i];
		var input = mtx_inputs[i%3];
		m.innerHTML = input.innerHTML;
	}

	if(mtx_inputs[0].innerHTML==="x"){
		mtx_outputs[0].innerHTML = "x'";
		mtx_outputs[1].innerHTML = "y'";

		// DOM
		mtx_inputs[0].style.border = "";
	    mtx_inputs[0].style.width = "";
	    mtx_inputs[0].style.height = "";
	    mtx_inputs[0].style.lineHeight = "";
	    mtx_inputs[1].style.border = "";
	    mtx_inputs[1].style.width = "";
	    mtx_inputs[1].style.height = "";
	    mtx_inputs[1].style.lineHeight = "";

		mtx_outputs[0].style.background = "";
		mtx_outputs[1].style.background = "";
		mtx_outputs[0].style.color = "";
		mtx_outputs[1].style.color = "";

		mtx_expanded.setAttribute("highlight","no");

	}else{
		var result = calculate(parseFloat(mtx_inputs[0].innerHTML),parseFloat(mtx_inputs[1].innerHTML));
		mtx_outputs[0].innerHTML = result.x.toFixed(1);
		mtx_outputs[1].innerHTML = result.y.toFixed(1);

		// DOM
		mtx_inputs[0].style.border = "5px solid #DD3838";
	    mtx_inputs[0].style.width = "40px";
	    mtx_inputs[0].style.height = "40px";
	    mtx_inputs[0].style.lineHeight = "40px";
	    mtx_inputs[1].style.border = "5px solid #DD3838";
	    mtx_inputs[1].style.width = "40px";
	    mtx_inputs[1].style.height = "40px";
	    mtx_inputs[1].style.lineHeight = "40px";

		mtx_outputs[0].style.background = "#DD3838";
		mtx_outputs[1].style.background = "#DD3838";
		mtx_outputs[0].style.color = "#FFF";
		mtx_outputs[1].style.color = "#FFF";

		mtx_expanded.setAttribute("highlight","yes");

	}

}

function calculate(x,y){

	x = x || 0;
	y = y || 0;

	var a = transform.a;
	var b = transform.b;
	var tx = transform.tx;
	var c = transform.c;
	var d = transform.d;
	var ty = transform.ty;

	var x2 = a*x + b*y + tx;
	var y2 = c*x + d*y + ty;

	return {x:x2, y:y2};
}

// Red Hover
function multiplicationHover(multDOM,transDOM,inputDOM){
	multDOM.onmouseover = function(){

		multDOM.style.background = "#DD3838";
		multDOM.style.color = "#FFF";

		if(transDOM.tagName=="INPUT"){
			transDOM.style.borderColor = "#DD3838";
			transDOM.style.borderWidth = "5px";
		}else{
			transDOM.style.border = "5px solid #DD3838"
		    transDOM.style.width = "40px";
		    transDOM.style.height = "40px";
		    transDOM.style.lineHeight = "40px";
		}

		inputDOM.style.border = "5px solid #DD3838";
	    inputDOM.style.width = "40px";
	    inputDOM.style.height = "40px";
	    inputDOM.style.lineHeight = "40px";

	};
	multDOM.onmouseout = function(){
		
		multDOM.style.background = "";
		multDOM.style.color = "";

		if(transDOM.tagName=="INPUT"){
			transDOM.style.borderColor = "";
			transDOM.style.borderWidth = "";
		}else{
			transDOM.style.border = "";
		    transDOM.style.width = "";
		    transDOM.style.height = "";
		    transDOM.style.lineHeight = "";
		}

		inputDOM.style.border = "";
	    inputDOM.style.width = "";
	    inputDOM.style.height = "";
	    inputDOM.style.lineHeight = "";

	};
}
multiplicationHover($("#mtx_expanded > div:nth-child(1)")[0], $("#mtx_transform > input:nth-child(1)")[0], $("#mtx_input > div:nth-child(1)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(2)")[0], $("#mtx_transform > input:nth-child(2)")[0], $("#mtx_input > div:nth-child(2)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(3)")[0], $("#mtx_transform > input:nth-child(3)")[0], $("#mtx_input > div:nth-child(3)")[0]);

multiplicationHover($("#mtx_expanded > div:nth-child(4)")[0], $("#mtx_transform > input:nth-child(4)")[0], $("#mtx_input > div:nth-child(1)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(5)")[0], $("#mtx_transform > input:nth-child(5)")[0], $("#mtx_input > div:nth-child(2)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(6)")[0], $("#mtx_transform > input:nth-child(6)")[0], $("#mtx_input > div:nth-child(3)")[0]);

multiplicationHover($("#mtx_expanded > div:nth-child(7)")[0], $("#mtx_transform > div:nth-child(7)")[0], $("#mtx_input > div:nth-child(1)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(8)")[0], $("#mtx_transform > div:nth-child(8)")[0], $("#mtx_input > div:nth-child(2)")[0]);
multiplicationHover($("#mtx_expanded > div:nth-child(9)")[0], $("#mtx_transform > div:nth-child(9)")[0], $("#mtx_input > div:nth-child(3)")[0]);


///////////////////////////////

var canvas = document.querySelector("canvas#bullets");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.style.width = window.innerWidth+"px";
canvas.height = 350;
canvas.style.height = 350+"px";

var originalBullets = [

	{x:-1,y:-1},
	{x:-1,y:-0.75},
	{x:-1,y:-0.50},
	{x:-1,y:-0.25},
	{x:-1,y:0},
	{x:-1,y:0.25},
	{x:-1,y:0.50},
	{x:-1,y:0.75},
	{x:-1,y:1},
	{x:-0.83,y:0.83},
	{x:-0.66,y:0.66},
	{x:-0.50,y:0.50},
	{x:-0.33,y:0.33},
	{x:-0.16,y:0.16},

	{x:0,y:0},

	{x:1,y:-1},
	{x:1,y:-0.75},
	{x:1,y:-0.50},
	{x:1,y:-0.25},
	{x:1,y:0},
	{x:1,y:0.25},
	{x:1,y:0.50},
	{x:1,y:0.75},
	{x:1,y:1},
	{x:0.83,y:0.83},
	{x:0.66,y:0.66},
	{x:0.50,y:0.50},
	{x:0.33,y:0.33},
	{x:0.16,y:0.16}

];
var bullets = [];
for(var i=0;i<originalBullets.length;i++){
	var originalBullet = originalBullets[i];
	bullets.push({
		x: originalBullet.x*10,
		y: originalBullet.y*10
	});
}

/*var tempCanvas = document.createElement("canvas");
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;
var tempContext = tempCanvas.getContext('2d');*/

function draw(){

	// TEMP CANVAS saved
	//tempContext.clearRect(0,0,canvas.width,canvas.height);	
	//tempContext.drawImage(canvas,0,0);

	// Clear canvas
	canvas.width = window.innerWidth;
	canvas.style.width = window.innerWidth+"px";
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();

	// Draw trail
	/*ctx.globalAlpha = 0.7;
	ctx.drawImage(tempCanvas,0,0);
	ctx.globalAlpha = 1.0;*/

	// Center
	ctx.translate(canvas.width/2,canvas.height/2);

	// Draw axes
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.strokeStyle = '#bbb';
	ctx.moveTo(-canvas.width/2,0);
	ctx.lineTo(canvas.width/2,0);
	ctx.moveTo(0,-canvas.height/2);
	ctx.lineTo(0,canvas.height/2);
	ctx.stroke();

	// Calculate bullets
	for(var i=0;i<bullets.length;i++){
		var bullet = bullets[i];
		var originalBullet = originalBullets[i];
		var newBullet = calculate(originalBullet.x,originalBullet.y);
		bullet.x = bullet.x*0.93 + newBullet.x*0.07;
		bullet.y = bullet.y*0.93 + newBullet.y*0.07;
	}

	// Draw bullets original
	var anyHovered = false;
	for(var i=0;i<bullets.length;i++){

		var bullet = bullets[i];
		var originalBullet = originalBullets[i];

		// IS IT HOVERED?
		var dx = (Mouse.x-canvas.width/2) - (originalBullet.x*100);
		var dy = (Mouse.y-canvas.height/2) - (-originalBullet.y*100);
		var isHovered = (dx*dx+dy*dy<25);
		dx = (Mouse.x-canvas.width/2) - (bullet.x*100);
		dy = (Mouse.y-canvas.height/2) - (-bullet.y*100);
		bullet.isHovered = isHovered || (dx*dx+dy*dy<100); // radius:10px
		if(bullet.isHovered){
			anyHovered = true;
			mtx_inputs[0].innerHTML = originalBullet.x.toFixed(1);
			mtx_inputs[1].innerHTML = originalBullet.y.toFixed(1);
			updateMatrixRight();
		}

		// Draw connecting line
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = bullet.isHovered ? "#EE3838" : '#888';
		ctx.moveTo(originalBullet.x*100, -originalBullet.y*100);
		ctx.lineTo(bullet.x*100, -bullet.y*100);
		ctx.stroke();

		// Draw where original was
		ctx.beginPath();
		ctx.arc(originalBullet.x*100, -originalBullet.y*100, 4, 0, 2*Math.PI, false);
		ctx.fillStyle = '#ddd';
		ctx.fill();
		ctx.stroke();

	}

	// Draw bullets
	for(var i=0;i<bullets.length;i++){

		var bullet = bullets[i];
		var originalBullet = originalBullets[i];

		// Draw where bullet is
		ctx.beginPath();
		ctx.arc(bullet.x*100, -bullet.y*100, 8, 0, 2*Math.PI, false);
		ctx.fillStyle = bullet.isHovered ? '#dd3838' : '#000';
		ctx.fill();

	}
	if(!anyHovered && mtx_inputs[0].innerHTML!="x"){
		mtx_inputs[0].innerHTML = "x";
		mtx_inputs[1].innerHTML = "y";
		updateMatrixRight();
	}
	ctx.restore();


	// CURSOR
	canvas.style.cursor = anyHovered ? "pointer": "default";

}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

///////////////////////////////


updateMatrixLeft();
updateMatrixRight();

(function animloop(){
	draw();
	requestAnimFrame(animloop);
})();

function $(selector){
	return document.querySelectorAll(selector);
}

var transform = {};
var mtx_expanded_left = document.querySelectorAll("#mtx_expanded span.left");
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
	x: window.innerWidth/2,
	y: 400/2
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

var mtx_transforms = document.querySelectorAll("#mtx_transform input");
for(var i=0;i<mtx_transforms.length;i++){
	var input = mtx_transforms[i];
	input.onchange = updateMatrixLeft;
	makeScrubbable(input);
}

var mtx_inputs = document.querySelectorAll("#mtx_input div");
var mtx_outputs = document.querySelectorAll("#mtx_output div");
var mtx_expanded_right = document.querySelectorAll("#mtx_expanded span.right");
function updateMatrixRight(){

	for(var i=0;i<9;i++){
		var m = mtx_expanded_right[i];
		var input = mtx_inputs[i%3];
		m.innerHTML = input.innerHTML;
	}

	if(mtx_inputs[0].innerHTML==="x"){
		mtx_outputs[0].innerHTML = "x'";
		mtx_outputs[1].innerHTML = "y'";

		mtx_inputs[0].style.background = "";
		mtx_inputs[1].style.background = "";
		mtx_outputs[0].style.background = "";
		mtx_outputs[1].style.background = "";
		mtx_inputs[0].style.color = "";
		mtx_inputs[1].style.color = "";
		mtx_outputs[0].style.color = "";
		mtx_outputs[1].style.color = "";

	}else{
		var result = calculate(parseFloat(mtx_inputs[0].innerHTML),parseFloat(mtx_inputs[1].innerHTML));
		mtx_outputs[0].innerHTML = result.x.toFixed(1);
		mtx_outputs[1].innerHTML = result.y.toFixed(1);

		mtx_inputs[0].style.background = "#DD3838";
		mtx_inputs[1].style.background = "#DD3838";
		mtx_outputs[0].style.background = "#DD3838";
		mtx_outputs[1].style.background = "#DD3838";
		mtx_inputs[0].style.color = "#FFF";
		mtx_inputs[1].style.color = "#FFF";
		mtx_outputs[0].style.color = "#FFF";
		mtx_outputs[1].style.color = "#FFF";

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
		transDOM.style.background = "#DD3838";
		inputDOM.style.background = "#DD3838";
		transDOM.style.color = "#FFF";
		inputDOM.style.color = "#FFF";
	};
	multDOM.onmouseout = function(){
		transDOM.style.background = "";
		inputDOM.style.background = "";
		transDOM.style.color = "";
		inputDOM.style.color = "";
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
canvas.height = 400;
canvas.style.height = 400+"px";

var originalBullets = [];
var bullets = [];
for(var i=0;i<12;i++){
	var angle = Math.PI*2*(i/12);
	bullets.push({
		x: Math.cos(angle)*10,
		y: Math.sin(angle)*10
	});
	originalBullets.push({
		x: Math.cos(angle)*1,
		y: Math.sin(angle)*1
	});
}

var tempCanvas = document.createElement("canvas");
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;
var tempContext = tempCanvas.getContext('2d');

function draw(){

	// TEMP CANVAS saved
	tempContext.clearRect(0,0,canvas.width,canvas.height);	
	tempContext.drawImage(canvas,0,0);

	// Clear canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
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
		bullet.x = bullet.x*0.9 + newBullet.x*0.1;
		bullet.y = bullet.y*0.9 + newBullet.y*0.1;
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
		bullet.isHovered = isHovered || (dx*dx+dy*dy<25);
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
		ctx.arc(originalBullet.x*100, -originalBullet.y*100, 5, 0, 2*Math.PI, false);
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
		ctx.arc(bullet.x*100, -bullet.y*100, 5, 0, 2*Math.PI, false);
		ctx.fillStyle = bullet.isHovered ? '#dd3838' : '#000';
		ctx.fill();

	}
	if(!anyHovered && mtx_inputs[0].innerHTML!="x"){
		mtx_inputs[0].innerHTML = "x";
		mtx_inputs[1].innerHTML = "y";
		updateMatrixRight();
	}
	ctx.restore();
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
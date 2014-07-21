var transform = {};
var mtx_expanded_left = document.querySelectorAll("#mtx_expanded span.left");
function updateMatrixLeft(){

	for(var i=0;i<6;i++){
		var m = mtx_expanded_left[i];
		var t = mtx_transforms[i];
		m.innerHTML = t.value;
	}

	transform.a = parseFloat(mtx_transforms[0].value);
	transform.b = parseFloat(mtx_transforms[1].value);
	transform.tx = parseFloat(mtx_transforms[2].value);
	transform.c = parseFloat(mtx_transforms[3].value);
	transform.d = parseFloat(mtx_transforms[4].value);
	transform.ty = parseFloat(mtx_transforms[5].value);

	draw();

}

var mtx_transforms = document.querySelectorAll("#mtx_transform input");
for(var i=0;i<mtx_transforms.length;i++){
	var input = mtx_transforms[i];
	input.onchange = updateMatrixLeft;
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
	}else{
		var result = calculate(parseFloat(mtx_inputs[0].innerHTML),parseFloat(mtx_inputs[1].innerHTML));
		mtx_outputs[0].innerHTML = result.x;
		mtx_outputs[1].innerHTML = result.y;
	}

}

function calculate(x,y){

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
		x: Math.cos(angle)*3,
		y: Math.sin(angle)*3
	});
	originalBullets.push({
		x: Math.cos(angle)*3,
		y: Math.sin(angle)*3
	});
}

var tempCanvas = document.createElement("canvas");
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;

function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	for(var i=0;i<bullets.length;i++){
		
		var bullet = bullets[i];
		var originalBullet = originalBullets[i];
		var newBullet = calculate(originalBullet.x,originalBullet.y);
		bullet.x = bullet.x*0.9 + newBullet.x*0.1;
		bullet.y = bullet.y*0.9 + newBullet.y*0.1;

		ctx.beginPath();
		ctx.arc(bullet.x*50, bullet.y*50, 5, 0, 2*Math.PI, false);
		ctx.fillStyle = '#000';
		ctx.fill();

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
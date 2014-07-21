
var mtx_expanded_left = document.querySelectorAll("#mtx_expanded span.left");
function updateMatrixLeft(){
	for(var i=0;i<6;i++){
		var m = mtx_expanded_left[i];
		var t = mtx_transforms[i];
		m.innerHTML = t.value;
	}
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
	var a = parseFloat(mtx_transforms[0].value);
	var b = parseFloat(mtx_transforms[1].value);
	var tx = parseFloat(mtx_transforms[2].value);
	var c = parseFloat(mtx_transforms[3].value);
	var d = parseFloat(mtx_transforms[4].value);
	var ty = parseFloat(mtx_transforms[5].value);

	var x2 = a*x + b*y + tx;
	var y2 = c*x + d*y + ty;

	return {x:x2, y:y2};
}

updateMatrixLeft();
updateMatrixRight();
var handler;

function processString(string){
	string = string.replace(/,/g, "");
	string = string.replace(/\./g, "");
	string = string.replace(/\(/g, "");
	string = string.replace(/\)/g, "");
	string = string.replace(/\[/g, "");
	string = string.replace(/\]/g, "");
	string = string.replace(/\{/g, "");
	string = string.replace(/\}/g, "");
	string = string.replace(/!/g, "");
	string = string.replace(/\?/g, "");
	string = string.replace(/</g, "");
	string = string.replace(/>/g, "");
	return string;
}

function getPosition(string, array){
	var position = 0;
	for(i = 0; i < array.length; i++){
		if(string > array[i]){
			position = i;
		}
	}
	return position;
}

function outputRectangle(rectangle){
	console.log("Rectangle Left: " + rectangle.left);
	console.log("Rectangle Right: " + rectangle.right);
	console.log("Rectangle Bottom: " + rectangle.bottom);
	console.log("Rectangle Top: " + rectangle.top);
}
function intersect(rectangle, point){
	if(point.x > rectangle.left && point.x < rectangle.right &&
		point.y > rectangle.bottom && point.y < rectangle.top)
		return true;
	return false;
}

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}

/*function writeMessage(text){ --> this function is for writing ON the canvas.
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	context.clearRect(0,0,300,300);
	context.font = '18pt Calibri';
	context.fillStyle ='black';
	var message = "", i, y = 25;
	for(i = 0; i < text.length; i++){
		if(context.measureText(text[i]).width > 290){
			text[i] = text[i].substring(0, 25) + "...";
		}
		if(context.measureText(message + ", " + text[i]).width > 290){
			context.fillText(message, 10, y);
			y += 30;
			message = text[i];
		} else {
			if(i === 0)
				message += text[i];
			else
				message += ", " + text[i];
		}
	}
	context.fillText(message, 10, y);
}*/

function writeMessage(text){
	var message = text[0], i;
	for(i = 1; i < text.length; i++){
		message += ", " + text[i];
	}
	document.getElementById('outputbox').value = message;
}

function drawBarGraph(range, strings, numbers){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var i, j;
	var boundaries = [];

	var gapWidth = 20;
	var barWidth = (c.width / range.length) - gapWidth;
	var height, fraction, x, text;

	for(i = 0; i < range.length; i++){
		fraction = range[i] / parseFloat(range[0]);
		height = c.height * fraction;
		x = gapWidth * (i + 1) + barWidth * i;
		//ctx.rect(x, c.height - height, barWidth, height);
		var boundary = {
			left: x,
			right: x + barWidth,
			top: height,
			bottom: 0
		};

		boundaries.push(boundary);

		/*ctx.font = "30px Arial";

		text = range[i] + "/" + range[0];
		ctx.fillText(text, x + barWidth / 2 - ctx.measureText(text).width / 2, c.height - 5);*/
	}
	//ctx.stroke();

	//animation(boundaries);
	
	for(i = 0; i < boundaries.length; i++){
		console.log(i);
		outputRectangle(boundaries[i]);
	}

	//delay it so that you can't prematurely hover? idk

	handler = function(evt) {
		var c = document.getElementById("myCanvas");
        var mousePos = getMousePos(c, evt);
        mousePos.y = c.height - mousePos.y;
        var text;
        /*var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(c, message);*/
        for (i = 0; i < boundaries.length; i++){
        	if(intersect(boundaries[i], mousePos)){
        		text = [];
        		for(j = 0; j < numbers.length; j++){
        			if(numbers[j] === range[i])
        				text.push(strings[j]);
        		}
        		console.log(text.join());
        		writeMessage(text);
        	}
        }
	};

	c.addEventListener('mousemove', handler, false);
}

function reset(){
	document.getElementById("theButton").disabled = false;
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	context.clearRect(0,0,canvas.width,canvas.height);
	context.beginPath();
	//context.globalCompositeOperation ="source-over";
	//context.globalAlpha = 1;
	canvas.removeEventListener('mousemove', handler, false);
}

var globalBoundary = {
			left: 0,
			right: 100,
			top: 200,
			bottom: 0
};

var recHeight;
var updateSpeed;

function animation(){
	
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	
	var boundaries = [];
	var boundary = {
		left: 20,
		right: 550,
		bottom: 0,
		top: 300
	};
	boundaries.push(boundary);
	boundary = {
		left: 570,
		right: 1100,
		bottom: 0,
		top: 150,
	};
	boundaries.push(boundary);
	var i;

		globalBoundary = boundaries[0];
		recHeight = 0;
		updateSpeed = 60;
		requestAnimationFrame(draw);

		context.save()
		context.globalCompositeOperation = "destination-out";
		context.restore();

		globalBoundary = boundaries[1];
		recHeight = 0;
		updateSpeed = 60;
		requestAnimationFrame(draw);
	/*var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	context.rect(0, canvas.height - 200, 100, 200);
	context.stroke();*/
}

function draw() {
		var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext('2d');
		context.beginPath();
		context.clearRect(globalBoundary.left,globalBoundary.bottom,globalBoundary.right - globalBoundary.left,globalBoundary.top);
		context.rect(globalBoundary.left, canvas.height - recHeight, globalBoundary.right - globalBoundary.left, recHeight);
		context.stroke();
		recHeight += globalBoundary.top / updateSpeed;

		if(recHeight === globalBoundary.top + globalBoundary.top / updateSpeed)
			recHeight += 1; //break the loop that forms
		else if(recHeight > globalBoundary.top)
			recHeight = globalBoundary.top;

		if(recHeight <= globalBoundary.top){
			requestAnimationFrame(draw);
		}

}

function myFunction(){ //problems include clicking button twice.

	document.getElementById("theButton").disabled = true;

	var str = document.getElementById("textbox").value.trim();
	
	var res = str.split(" ");
	var strings = [];
	var numbers = [];
	var counter, i, j;

	for (i = 0; i < res.length; i++){
		res[i] = processString(res[i]);
		counter = true;
		for(j = 0; j < numbers.length; j++){
			if(strings[j] == res[i]){
				counter = false;
				numbers[j]++;
			}
		}
		if(counter){
			var pos = getPosition(res[i], strings);
			strings.splice(pos, 0, res[i]);
			numbers.splice(pos, 0, 1);
		}
	}

	var output = "";
	for(i = 0; i < strings.length; i++){
		output += strings[i] + "  " + numbers[i] + "<br />";
	}
	
	var range = [numbers[0]];
	for(i = 0; i < numbers.length; i++){
		if(range.indexOf(numbers[i]) === -1)
			range.push(numbers[i]);
	}

	range.sort(function(a, b){return b-a});

	//document.getElementById("stats").innerHTML = output;

	drawBarGraph(range, strings, numbers);
}

var handler;

/* this function takes the input string and eliminates troublesome characters,
like / \ | or { }, characters which generally don't mean much in a string 
other than for grammar purposes */
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

/*this function finds the alphabetical position
of a new string in an existing array */
function getPosition(string, array){
	var position = 0;
	for(i = 0; i < array.length; i++){
		if(string > array[i]){
			position = i;
		}
	}
	return position;
}

/*debugging process for rectangle class */
function outputRectangle(rectangle){
	console.log("Rectangle Left: " + rectangle.left);
	console.log("Rectangle Right: " + rectangle.right);
	console.log("Rectangle Bottom: " + rectangle.bottom);
	console.log("Rectangle Top: " + rectangle.top);
}

/*finds out if the "point" or mouse position is hovering over
a bar in the bar graph */
function intersect(rectangle, point){
	if(point.x > rectangle.left && point.x < rectangle.right &&
		point.y > rectangle.bottom && point.y < rectangle.top)
		return true;
	return false;
}

/*gets the mouse position off the canvas */
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}

/*creates output message for textarea */
function writeMessage(text){
	var message = text[0], i;
	for(i = 1; i < text.length; i++){
		message += ", " + text[i];
	}
	document.getElementById('outputbox').value = message;
}

/*draws the bar graph for words */
function drawBarGraph(range, strings, numbers){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var i, j;
	var boundaries = [];

	var gapWidth = 20;
	var barWidth = (c.width / range.length) - gapWidth;
	var height, fraction, x, text;

	/*creates the number of bars necessary for the graph */
	for(i = 0; i < range.length; i++){
		fraction = range[i] / parseFloat(range[0]);
		height = c.height * fraction;
		x = gapWidth * (i + 1) + barWidth * i;
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

	animation(boundaries);
	
	for(i = 0; i < boundaries.length; i++){
		console.log(i);
		outputRectangle(boundaries[i]);
	}

	/*a listener to track mouse activity */
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
        		//console.log(text.join());
        		writeMessage(text);
        	}
        }
	};

	c.addEventListener('mousemove', handler, false);
}

/*allows for the canvas to be refreshed and program to be restarted */
function reset(){
	document.getElementById("theButton").disabled = false;
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	context.clearRect(0,0,canvas.width,canvas.height);
	context.beginPath();
	canvas.removeEventListener('mousemove', handler, false);
}

var globalBoundary;
var globalRecHeight;

var updateSpeed;

function animation(boundaries){
	
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	globalBoundary = boundaries;
	globalRecHeight = [];
	updateSpeed = 60;
	
	var i;
	for(i = 0; i < globalBoundary.length; i++){
		globalRecHeight.push(0);
	}
		
	requestAnimationFrame(draw);
}

/*this creates a rectangle and erases for the next animation frame call
Difficulties: requestAnimationFrame is asynchronous, so I couldn't create rectangle
after rangle.
for some reason I can't call draw a second time w/o one overriding the other... I tried
layering canvases, multiple draw calls, but nothing worked, so I resorted to just
one draw call that does eevrything*/
function draw() {
		console.log("HI");
		var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext('2d');
		var i;
		context.beginPath();
		context.clearRect(0,0,canvas.width, canvas.height);
		context.fillStyle = "#C0C0C0";
		for(i = 0; i < globalBoundary.length; i++){
			context.fillRect(globalBoundary[i].left, canvas.height - globalRecHeight[i], globalBoundary[i].right - globalBoundary[i].left, globalRecHeight[i] + 1);
			globalRecHeight[i] += globalBoundary[i].top / updateSpeed;
		}
		context.stroke();
		
		if(globalRecHeight[0] === globalBoundary[0].top + globalBoundary[0].top / updateSpeed){
			globalRecHeight[0] += 1; //break the loop that forms
			playing = false;
		}
		else if(globalRecHeight[0] > globalBoundary[0].top)
			globalRecHeight[0] = globalBoundary[0].top;

		if(globalRecHeight[0] <= globalBoundary[0].top){
			requestAnimationFrame(draw);
		}
}

/* the "main" function */
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

	drawBarGraph(range, strings, numbers);
	console.log("HERE IT IS");
	
	for(i = 0; i < numbers.length; i++){
		if(range[0] === numbers[i])
			document.getElementById("stats").innerHTML = "Most overused word: " + strings[i];
	}
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
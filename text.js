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

function drawBarGraph(range){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var i;

	var gapWidth = 20;
	var barWidth = (c.width / range.length) - gapWidth;
	var height, fraction, x, text;

	for(i = 0; i < range.length; i++){
		fraction = range[i] / parseFloat(range[0]);
		height = c.height * fraction;
		x = gapWidth * (i + 1) + barWidth * i;
		ctx.rect(x, c.height - height, barWidth, height);

		ctx.font = "30px Arial";

		text = range[i] + "/" + range[0];
		ctx.fillText(text, x + barWidth / 2 - ctx.measureText(text).width / 2, c.height - 5);
	}
	ctx.stroke();
}

function myFunction(){
	var str = document.getElementById("textbox").value.trim();
	
	var res = str.split(" ");
	var strings = [res[0]];
	var numbers = [1];
	var counter, i, j;

	for (i = 1; i < res.length; i++){
		res[i] = processString(res[i]);
		counter = true;
		for(j = 1; j < numbers.length; j++){
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
	console.log(range.join());

	/*document.getElementById("test").innerHTML = output;*/

	drawBarGraph(range);
}

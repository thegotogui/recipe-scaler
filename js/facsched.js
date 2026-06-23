var timeField = [],
	hour = [],
	minute = [],
	timeNow, green = [],
	lapsed,
	stepOffset = 0,
	myVar;



// Wake everything up and see if this timer has run before. If so, go grab previous values.
function startUp() {
	// if (localStorage.getItem("schedulerStartTime") != null) {
	// 	console.log('Startup Activated!');
	// 	startTime = Number(localStorage.getItem("schedulerStartTime"));
	// 	console.log(startTime);

	// 	lapsed = Number(localStorage.getItem("lapsed"));

	// 	hour[1] = localStorage.getItem("schedulerStartHour");
	// 	minute[1] = localStorage.getItem("schedulerStartMinute");

	// 	document.getElementById("startDay").selectedIndex = Number(localStorage.getItem("startDay"));

	// 	document.getElementById("lBFlour").value = Number(localStorage.getItem("lBFlour"));
	// 	document.getElementById("aBFlour").value = Number(localStorage.getItem("aBFlour"));
	// 	calculateAutolyse()
	// 	calculateLevain();

	// 	doDigits(1);
	// 	getTime(1);

	// }
	myVar = setInterval(theLoop, 1000);
}





// Calculates the time span between each segment and updates the HH:MM fields to reflect when that step should start
// based on the values in the first time field. 
function getTime(which) {
	console.log(which);

	if (which == 1) {
		timeField[which] = document.getElementById("time" + which).value;

		// First, grab the time values from the first time field
		hour[which] = Number(timeField[which].slice(0, 2));
		minute[which] = Number(timeField[which].slice(-2));

		// Add ten hours to create the second time entry.
		hour[2] = hour[1] + 10;

		// Copy minutes over as is
		minute[2] = minute[1];

		// timeField[2] = hour[2] + ":" + minute[2];
		doDigits(2);


		// Step 3 is 20 minutes after initial start
		hour[3] = hour[2];
		minute[3] = minute[2] + 20
		doDigits(3);

		// Step 4 is 5 hours after initial start (4:40 from previous step)
		hour[4] = hour[3] + 4;
		minute[4] = minute[3] + 40;
		doDigits(4);

		// Step 5 is 30 minutes after step 4
		hour[5] = hour[4]
		minute[5] = minute[4] + 30;
		doDigits(5);

		// Step 6 is 10+ hours after step 5
		hour[6] = hour[5] + 10;
		minute[6] = minute[5];
		doDigits(6);
	}

	if (which == 0) {
		var temp, temp2;
		temp = document.getElementById("startDay").selectedIndex;
		if (temp == 6) {
			temp2 = 0;
		} else {
			temp2 = temp + 1;
		}
		console.log(temp, temp2);
		document.getElementById("bakeDay").selectedIndex = temp2;
	}
}

// Populates the hours and minutes of the provided number of six fields.
function doDigits(which) {

	if (hour[which] > 23) {
		hour[which] -= 24;
	}

	temp = hour[which].toString();
	temp = temp.padStart(2, '0');

	timeField[which] = temp + ":";

	temp = minute[which].toString();

	if (temp > 59) {
		temp = temp - 60;
		minute[which] = temp;
	}

	temp = minute[which].toString();
	temp = temp.padStart(2, '0');

	timeField[which] += temp;

	document.getElementById("time" + which).value = timeField[which];
}

// var idVar = setInterval(() => {

const theLoop = function updateIt() {

	var testMode = false;
	// console.log('Testmode is ' + testMode);
	if (testMode) {
		stepOne = 10;
		stepTwo = 20;
		stepThree = 30;
		stepFour = 40;
		stepFive = 50;
		stepSix = 60;

	} else {
		stepOne = 36000;
		stepTwo = 37200;
		stepThree = 51600;
		stepFour = 53400;
		stepFive = 86400;
		stepSix = 129000;
	}

	temp = new Date();
	lapsed = temp.getTime() - startTime;
	lapsed += (stepOffset * 1000);
	lapsed = lapsed / 1000;

	localStorage.setItem("lapsed", parseInt(lapsed));

	if (lapsed > 0 && lapsed < stepOne && !green[1]) {
		updateColor(1);
		green[1] = true;
		console.log("Step 1 started at " + temp);
	}
	if (lapsed >= stepOne && lapsed < stepTwo && !green[2]) {
		updateColor(2);
		green[2] = true;
		console.log("Step 2 started at " + temp);
	}
	if (lapsed >= stepTwo && lapsed < stepThree && !green[3]) {
		updateColor(3);
		green[3] = true;
		console.log("Step 3 started at " + temp);
	}
	if (lapsed >= stepThree && lapsed < stepFour && !green[4]) {
		updateColor(4);
		green[4] = true;
		console.log("Step 4 started at " + temp);
	}
	if (lapsed >= stepFour && lapsed < stepFive && !green[5]) {
		updateColor(5);
		green[5] = true;
		console.log("Step 5 started at " + temp);
	}

	// Between 24 and 36 hours, we're on step 6
	if (lapsed >= stepFive && lapsed < stepSix && !green[6]) {
		updateColor(6);
		green[6] = true;
		console.log(temp);
	}

	if (lapsed > stepSix) {
		clearInterval(myVar);
		console.log('Interval cleared!');
	}
};




function updateColor(which) {
	for (let index = 1; index < 7; index++) {
		var element = document.getElementById("step" + index);
		// console.log("Index" + index + " Which"+which);
		if (index == which) {
			element.classList.remove("notStep");
			element.classList.add("nowStep");
		} else {
			element.classList.remove("nowStep");
			element.classList.add("notStep");
		}
	}
}

function lDefault(params) {
	if (params == 1) {
		document.getElementById("lBFlour").value = 40;
		calculateLevain();
	}
	if (params == 2) {
		document.getElementById("aBFlour").value = 766;
		calculateAutolyse();

	}
}

function calculateLevain() {
	var temp = document.getElementById("lBFlour").value;
	localStorage.setItem("lBFlour", temp);
	document.getElementById("lWwFlour").value = temp;
	var temp2 = temp * 2.025;
	document.getElementById("lWater").value = temp2.toFixed(0);
	document.getElementById("lStart").value = temp / 5;
}

function calculateAutolyse() {
	var temp = document.getElementById("aBFlour").value;
	localStorage.setItem("aBFlour", temp);

	var temp2 = temp * (161 / 766);
	document.getElementById("aWwFlour").value = temp2.toFixed(0);

	temp2 = temp * (635 / 766);
	document.getElementById("aWater").value = temp2.toFixed(0);

	temp2 = temp * (169 / 766);
	document.getElementById("aLevain").value = temp2.toFixed(0);

	temp2 = (50 / 766) * temp;
	document.getElementById("bWater").value = temp2.toFixed(2);

	temp2 = (19 / 766) * temp;
	document.getElementById("bSalt").value = temp2.toFixed(2);
}


function todayNow(which) {
	temp = new Date();
	startTime = temp.getTime();

	document.getElementById("startDay").selectedIndex = temp.getDay();
	localStorage.setItem("startDay", temp.getDay());

	if (which == 2) {
		startTime -= stepOne;
		stepOffset = stepOne;
		// Values for reference
		// stepOne = 36000;
		// stepTwo = 37200;
		// stepThree = 51600;
		// stepFour = 53400;
		// stepFive = 86400;
		// stepSix = 129000;

		hour[2] = temp.getHours();
		minute[2] = temp.getMinutes();
		localStorage.setItem("schedulerStartHour", hour[2]);
		localStorage.setItem("schedulerStartMinute", minute[2]);
		hour[1] = hour[2] - 10;
		if (hour[1] < 0) {
			hour[1] += 11;
			var preDay = temp.getDay();
			preDay -= 1;
			if (preDay < 0) {
				preDay = 6;
			}
			document.getElementById("startDay").selectedIndex = preDay;
			lapsed = stepOne;
	
		}
	}
	if (which == 3) {

		startTime -= stepThree;
		stepOffset = stepThree;

		// Values for reference
		// stepOne = 36000;
		// stepTwo = 37200;
		// stepThree = 51600;
		// stepFour = 53400;
		// stepFive = 86400;
		// stepSix = 129000;

		hour[3] = temp.getHours();
		minute[3] = temp.getMinutes();
		localStorage.setItem("schedulerStartHour", hour[3]);
		localStorage.setItem("schedulerStartMinute", minute[3]);
		hour[2] = hour[3];

		hour[1] = hour[2] - 10;
		if (hour[1] < 0) {
			hour[1] += 11;
			var preDay = temp.getDay();
			preDay -= 1;
			if (preDay < 0) {
				preDay = 6;
			}
			document.getElementById("startDay").selectedIndex = preDay;
			lapsed = stepOne;
	
		}
	}

	if (which == 1) {
		// Convert time into useful values and populate the first set of time fields.
		hour[1] = temp.getHours();
		minute[1] = temp.getMinutes();
		localStorage.setItem("schedulerStartHour", hour[1]);
		localStorage.setItem("schedulerStartMinute", minute[1]);

		// Set the start day to the right day of the week
		// document.getElementById("startDay").selectedIndex = temp.getDay();
		// localStorage.setItem("startDay", temp.getDay());

		// Reset which items are green
		green = [];

		//Clear the lapsed counter
		lapsed = 0;

		// Clear the step offset because we're at the beginning
		stepOffset = 0;
	}


	// Stash the start time in case of refresh
	localStorage.setItem("schedulerStartTime", startTime);

	// Pretend the first values were manually set and calculate/update the remaining values.
	doDigits(1);
	getTime(1);

	myVar = setInterval(theLoop, 1000);

}
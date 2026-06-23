var myVar = setInterval(myTimer, 1000);
blink = false,
	imageSrc = document.getElementById("image");
mode = 0,
	sundayCounter = 0,
	weekendCounter = 0;
var testMode = false,
	days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	mute = true,
	lang = "Ger";


function chime() {
	var audio = new Audio("./media/chime.mp3");
	audio.play();
}

function clocktick() {
	var audio = new Audio("./weekend/clocktick.mp3");
	audio.play();
}
function clocktock() {
	var audio = new Audio("./weekend/clocktock.mp3");
	audio.play();
}

function myTimer() {
	var dayte = new Date();
	var image = document.getElementById("image");
	var theDay = dayte.getDay();
	var theHour = dayte.getHours();
	var theMinute = dayte.getMinutes();
	var theSeconds = dayte.getSeconds();
	// if (theSeconds < 30) {
	// 	theSeconds += 30;
	// }

	// ┌┐┌┌─┐┬─┐┌┬┐┌─┐┬    ┌┬┐┌─┐┌┬┐┌─┐
	// ││││ │├┬┘│││├─┤│    ││││ │ ││├┤ 
	// ┘└┘└─┘┴└─┴ ┴┴ ┴┴─┘  ┴ ┴└─┘─┴┘└─┘
	if (!testMode) {
		if (theDay >= 1 && theDay <= 4) {
			mode = 0;
		}

		if (theDay == 5) {

			if (theHour == 16) {
				mode = 1;
			}
			if (theHour == 17) {
				mode = 2;
			}
			if (theHour == 18) {
				mode = 3;
			}
		}

		// If it's Sunday at 11:59:55, activate "Monday Mode" for five seconds
		if (theDay == 7 && theHour == 11 && theMinute == 59) {
			mode = 4;
		}


		//┌┬┐┌─┐┌─┐┌┬┐  ┌┬┐┌─┐┌┬┐┌─┐
		// │ ├┤ └─┐ │   ││││ │ ││├┤ 
		// ┴ └─┘└─┘ ┴   ┴ ┴└─┘─┴┘└─┘
	} else {

		if (theSeconds < 30) {
			mode = 0;
		}

		// It's nearly 5:00. Starting at 4:00, start blinking.
		if (theSeconds >= 30 && theSeconds <= 40) {
			mode = 1;
		}

		// It's Friday! Light up and chime away!
		if (theSeconds > 40 && theSeconds < 50) {
			mode = 2;
		}

		// Okay, just turn on the main part of the sign and hold it there until "Sunday"
		if (theSeconds > 50 && theSeconds < 57) {
			mode = 3;
		}

		if (theSeconds >= 57 && theSeconds <= 59) {
			mode = 4;
		}
	}


	// Here is where we set everything up

	if (mode == 0) {
		sundayCounter = 0;
		image.src = "./weekend/standbymode" + lang + ".png";
	}

	if (mode == 1) {
		if (blink) {
			image.src = "./weekend/rightlight" + lang + ".png";
			if (!mute) {
				clocktick();
			}
		}

		else {
			image.src = "./weekend/leftlight" + lang + ".png";
			if (!mute) {
				clocktock();
			}
		}
		blink = !blink;
	}

	// It's Friday at 5:00!
	if (mode == 2) {

		if (weekendCounter == 0 || weekendCounter == 2) {
			image.src = "./weekend/bright" + lang + ".png";
			console.log(`Weekend Chime ${theHour}:${theMinute}:${theSeconds}`);
			if (!mute) {
				chime();
			}
		}

		if (weekendCounter == 1) {
			image.src = "./weekend/standbymode" + lang + ".png";
		}


		if (weekendCounter < 3) {
			weekendCounter++;
		}
	}

	if (mode == 3) {
		weekendCounter = 0;
		// Mode 3 does nothing for now
	}

	if (mode == 4) {
		if (sundayCounter == 0) {
			image.src = "./weekend/allon" + lang + ".png";
			console.log(`Sunday Chime ${theHour}:${theMinute}:${theSeconds}`);
			if (!mute) {
				chime();
			}
		}

		if (sundayCounter == 2) {
			image.src = "./weekend/standbymode" + lang + ".png";
		}

		if (sundayCounter <= 3) {
			sundayCounter++;
		}
	}

	document.getElementById("data").innerHTML = `Mode: ${mode} Day: ${theDay} (${days[theDay]}) ${theHour}:${theMinute}:${theSeconds} ${weekendCounter} ${sundayCounter}`;
}
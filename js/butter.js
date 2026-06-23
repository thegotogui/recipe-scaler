console.log(`Version 11-03-25 - added versionin declaration`);

//* Set them variables!

var weight,                // How much the results should weigh
	sticks,                // How many FULL sticks are involved in the result
	partialStick,		   // What quantity of another stick 
	elgin,				   // Skinny sticks on the east coast
	stubbie,			   // The fatter version found west of the Miss.
	sticksText,            // I don't know what this is.
	stick = "elgin",       // Defines the kind of stick we're talking about. We're assuming Elgin because east coast
	euro,                  // The number of mms of a Euro stick is needed
	elementDisplay,
	elementText,
	elginDisplay,
	stubbieDisplay,
	euroDisplay;


//* Storing for potential reference later
//  Stubby is       3 3/16(7.9cm) x 1.5(38mm) x 1.5(38mm)
//  Elgin is                 12cm x 30mm x 30mm
//  European Block is       162mm x 63mm x 39mm and weighs - 500g across 107mm = 4.26728g per mm

// Check to see which variant of butterstick we're using because that changes the
// weight/length ratio

function radioCheck(which) {

	if (which == 1) {
		stick = "elgin";
		elginState = true;
		stubbieState = false;
		euroState = false;
		elginDisplay = "flex";
		stubbieDisplay = "none";
		euroDisplay = "none";
		document.getElementById("elginRadio").classList.add("active");
		document.getElementById("stubbieRadio").classList.remove("active");
		document.getElementById("bothRadio").classList.remove("active");
		document.getElementById("euroRadio").classList.remove("active");
	}
	if (which == 2) {
		stick = "stubbie";
		elginState = false;
		stubbieState = true;
		euroState = false;
		elginDisplay = "none";
		stubbieDisplay = "flex";
		euroDisplay = "none";
		document.getElementById("elginRadio").classList.remove("active");
		document.getElementById("stubbieRadio").classList.add("active");
		document.getElementById("bothRadio").classList.remove("active");
		document.getElementById("euroRadio").classList.remove("active");

	}
	if (which == 3) {
		stick = "both";
		elginState = true;
		stubbieState = true;
		euroState = false;
		elginDisplay = "flex";
		stubbieDisplay = "flex";
		euroDisplay = "none";
		document.getElementById("elginRadio").classList.add("active");
		document.getElementById("stubbieRadio").classList.add("active");
		document.getElementById("bothRadio").classList.add("active");
		document.getElementById("euroRadio").classList.remove("active");

	}
	if (which == 4) {
		stick = "euro";
		elginState = false;
		stubbieState = false;
		euroState = true;
		elginDisplay = "none";
		stubbieDisplay = "none";
		euroDisplay = "flex";
		document.getElementById("elginRadio").classList.remove("active");
		document.getElementById("stubbieRadio").classList.remove("active");
		document.getElementById("bothRadio").classList.remove("active");
		document.getElementById("euroRadio").classList.add("active");
	}

	document.getElementById("elginRadio").checked = elginState;
	document.getElementById("stubbieRadio").checked = stubbieState;
	document.getElementById("euroRadio").checked = euroState;

	for (let index = 0; index < document.getElementsByClassName("elgin").length; index++) {
		document.getElementsByClassName("elgin")[index].style.display = elginDisplay;
		document.getElementsByClassName("stubbie")[index].style.display = stubbieDisplay;
		document.getElementsByClassName("european")[index].style.display = euroDisplay;
	}

	calculateIt(1);
}

function calculateIt(which) {

	switch (which) {

		case 1:
			// If which = 1, then they entered grams
			// Get the target weight in grams and populate the other fields
			weight = document.getElementById("weightg").value;
			temp = weight / 14.17475;
			document.getElementById("tbsps").value = temp.toFixed(2);
			temp = weight / 4.724916667;
			document.getElementById("tsps").value = temp.toFixed(2);
			temp = weight / 28.3495;
			document.getElementById("weighto").value = temp.toFixed(2);
			break;

		case 2:
			// If not, then they entered ounces so calculate grams accordingly
			weight = document.getElementById("weighto").value * 28.3495;
			document.getElementById("weightg").value = weight.toFixed(2);
			temp = weight / 14.17475;
			document.getElementById("tbsps").value = temp.toFixed(2);
			temp = weight / 4.2
			document.getElementById("tsps").value = temp.toFixed(2);
			break;

		case 3:
			// We're entering teaspoons
			temp = document.getElementById("tsps").value;
			weight = 4.2 * temp;
			document.getElementById("weightg").value = weight.toFixed(2);
			x = weight / 28.3495;
			document.getElementById("weighto").value = x.toFixed(2);
			document.getElementById("tbsps").value = Number(temp / 3).toFixed(2);
			break;

		case 4:
			// We're entering tablespoons
			temp = document.getElementById("tbsps").value;
			weight = 14.79 * temp
			document.getElementById("weightg").value = weight.toFixed(2);
			x = weight / 28.3495;
			document.getElementById("weighto").value = x.toFixed(2);
			document.getElementById("tsps").value = temp * 3;
			break;
	}

	// If we're doing Elgin(s) or Stubbie(s), the "stick" weight is the same
	// If we're doing European "stick(s)", it's MUCH heavier
	const stickWeight = 113.5, // How a single stick of either variant weighs
		euroStickWeight = 250; // How much a Eurostick weights in grams

	// Determine how many whole sticks are involved
	sticks = parseInt(weight / stickWeight);
	let euroSticks = parseInt(weight / euroStickWeight);
	console.log(`euroSticks: ${euroSticks}`);

	// Get the remainder
	partialStick = weight - (sticks * stickWeight);
	let partialEStick = weight - (euroSticks * euroStickWeight);

	// Calculate the measurements for each size stick
	elgin = partialStick * .105726;
	stubbie = partialStick * .073127;
	euro = partialEStick * .0428;

	// Round to two decimal places
	elgin = elgin.toFixed(1);
	stubbie = stubbie.toFixed(1);
	euro = euro.toFixed(1);

	// We need to split off Stubbie and Elgin from Euro because so much is different
	if (stick == "elgin" || stick == "stubbie") {
		if (sticks == 0) {
			sticksText = "";
			document.getElementById("wholesticksE").style.display = "none";
			document.getElementById("butterFullE").innerText = ``;
			document.getElementById("wholesticksS").style.display = "none";
			document.getElementById("butterFullS").innerText = ``;
		}

		if (stick == 'euro') {
			sticksText = `block`;
		} else {
			sticksText = "stick";
		}

		if (sticks > 1) {
			sticksText += `s`;
		}

		if (sticks > 0) {
			if (stick == "elgin") {
				elementDisplay = 'wholesticksE';
				elementText = 'butterFullE';
			}
			if (stick == "stubbie") {
				elementDisplay = 'wholesticksS';
				elementText = 'butterFullS';
			}
			if (stick == "euro") {
				elementDisplay = 'wholesticksEU';
				elementText = 'butterFullEU';
			}

			document.getElementById(elementDisplay).style.display = "block";
			document.getElementById(elementText).innerHTML = `<h2 style="font-weight: bold; color: black; padding-left: 30px;">+${sticks} whole ${sticksText}</h2>`;
		}

		if (elgin > 2.9 || stubbie > 2.9) {
			document.getElementById("butterHalfE").innerHTML = `<h3>${elgin}cm</h3>`;
			document.getElementById("notButterHalfE").innerHTML = ``;
			document.getElementById("butterHalfS").innerHTML = `<h3>${stubbie}cm</h3>`;
			document.getElementById("notButterHalfS").innerHTML = ``;
		} else {
			document.getElementById("butterHalfE").innerHTML = ``;
			document.getElementById("notButterHalfE").innerHTML = `<h3>${elgin}cm</h3>`;
			document.getElementById("butterHalfS").innerHTML = ``;
			document.getElementById("notButterHalfS").innerHTML = `<h3>${stubbie}cm</h3>`;
		}
	} else {
		if (euro > 19) {
			document.getElementById("butterHalfEu").innerHTML = `<h3>${euro}cm</h3>`;
			document.getElementById("notButterHalfEu").innerHTML = ``;
		} else {
			document.getElementById("butterHalfEu").innerHTML = ``;
			document.getElementById("notButterHalfEu").innerHTML = `<h3>${euro}cm</h3>`;
		}
		if (euroSticks == 0) {
			document.getElementById("wholesticksEU").style.display = "none";
			document.getElementById("butterFullEUBlock").innerText = ``;
		} else {
			if (euroSticks == 1) {
				sticksText = `stick`;
			}
			else {
				sticksText = `sticks`;
			}

			document.getElementById("wholesticksEU").style.display = "block";
			document.getElementById("butterFullEUBlock").innerHTML = `<h2 style="font-weight: bold; color: black; padding-left: 30px;">+${euroSticks} whole ${sticksText}</h2>`;
		}
	}

	// Now, draw the stick the correct length to use as a template for cutting the butter

	var b1 = (partialStick / stickWeight) * 100;
	var b2 = 100 - b1;
	let b3 = (partialEStick / euroStickWeight) * 100;
	let b4 = 100 - b3;

	document.getElementById("butterHalfE").style.width = b1 + "%";
	document.getElementById("notButterHalfE").style.width = b2 + "%";
	document.getElementById("butterHalfS").style.width = b1 + "%";
	document.getElementById("notButterHalfS").style.width = b2 + "%";
	document.getElementById("butterHalfEu").style.width = b3 + "%";
	document.getElementById("notButterHalfEu").style.width = b4 + "%";
}
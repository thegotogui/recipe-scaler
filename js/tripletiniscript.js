//  Regular
// ? This is blue
// ! This is red
// * This is BRIGHT green
// Todo This is orange!

console.log(`Version 01-03-25 - Version declaration`);



setTimeout(openUrl, 90000); // Wait 90 seconds
function openUrl() {
	// If the checkbox is checked after 90 seconds, load the scaler.
	if (document.getElementById("refresher").checked) {
		window.location.href = "scaler.html";
	}
}


var calcMode = 1,
	valueList,
	labelList,
	ingenium,
	italicus,
	vermouthScaled,
	vermouthInput,
	waterScaled,
	wPercentage,
	dilutionRatio,
	dilutionRatioTmp,
	liquorPcnt,
	liquorPcnt,
	vermouthPct,
	waterPct,
	ingenPct,
	italicPct,
	liquorInput,
	liquorOutput,
	totalVolume,
	firstRun = true,
	gTotal, vTotal,
	vgPercentage,
	vvPercentage,
	labelList = ["lupiniFields", "notLupini", "notLupini2", "volumeOnly", "ratioOnly"];

// Go get the relevant value based on the ID provided
function grabValue(fieldName) {
	var x = parseFloat(document.getElementById(fieldName).value);
	return x;
}

function grabDropdown(fieldName) {
	let chosen = document.getElementById(fieldName);
	let theValue = parseFloat(chosen.options[chosen.selectedIndex].value);
	return theValue;
}


function calculate(which) {

	// Grab all the relevant values and store them in local storage.
	liquorInput = grabValue("liquorIn");
	localStorage.setItem("liquorIn", liquorInput);

	// For these two dropdowns, we store the selected item in the list rather than its value.
	vgPercentage = grabDropdown("vgRatio");
	localStorage.setItem("vgPercentage", vgPercentage);

	vvPercentage = grabDropdown("vvRatio");
	localStorage.setItem("vvPercentage", vvPercentage);

	wPercentage = grabValue("waterRatio");

	// If mode is 1, then we're just doing straight ratios
	if (liquorInput * vermouthInput != 0) {
		let vtemp = liquorInput * vgPercentage;
		var vermouthScaledG = parseFloat(vtemp.toFixed(2));

		vtemp = liquorInput * vvPercentage;
		var vermouthScaledV = parseFloat(vtemp.toFixed(2));

		let waterScaledTmp = liquorInput * wPercentage;
		waterScaled = parseFloat(waterScaledTmp.toFixed(2));
		document.getElementById("waterOut").value = waterScaled;
	}

	document.getElementById("vvermouth").value = vermouthScaledV;
	document.getElementById("gvermouth").value = vermouthScaledG;
	waterRatioTmp = 100 * (waterScaled / liquorInput);
	waterRatio = parseFloat(waterRatioTmp.toFixed(2));
	document.getElementById("waterOut").value = waterScaled;

	vtemp = vermouthScaled / liquorInput * 100;
	vermouthRatio = parseFloat(vtemp.toFixed(2));
	totalVolume = liquorInput + vermouthScaled + waterScaled;
	liquorOutput = liquorInput;

	gTotal = liquorInput + vermouthScaledG + waterRatio;
	vTotal = liquorInput + vermouthScaledV + waterRatio;

	if (which == undefined) {
		document.getElementById("vvermouthOut").value = vTotal.toFixed(2);
		document.getElementById("gvermouthOut").value = gTotal.toFixed(2);
	}

	if (which == 1) {
		document.getElementById("vvermouthOut").value = vTotal.toFixed(2);
	}

	if (which == 2) {
		document.getElementById("gvermouthOut").value = gTotal.toFixed(2);
	}

	writeBars();
}


// * Update the ratio bars
function writeBars() {

	let gvermouthPct = vgPercentage * 100;
	let element = document.getElementById("gvermouthbar");
	element.style.width = gvermouthPct + "%";
	document.getElementById("gvpercentageLabel").innerHTML = gvermouthPct.toFixed(0) + "%";

	let vvermouthPct = vvPercentage * 100;
	element = document.getElementById("vvermouthbar");
	element.style.width = vvermouthPct + "%";
	document.getElementById("vvpercentageLabel").innerHTML = vvermouthPct.toFixed(0) + "%";

	waterPct = wPercentage * 100;
	element = document.getElementById("gwaterbar");
	element.style.width = waterPct + "%";
	document.getElementById("gwpercentageLabel").innerHTML = waterPct.toFixed(0) + "%";

	element = document.getElementById("vwaterbar");
	element.style.width = waterPct + "%";
	document.getElementById("vwpercentageLabel").innerHTML = waterPct.toFixed(0) + "%";


	let temp = 100 - (gvermouthPct + waterPct);
	element = document.getElementById("gliquorbar");
	element.style.width = temp + "%";
	document.getElementById("glpercentageLabel").innerHTML = temp.toFixed(0) + "%";

	temp = 100 - (vvermouthPct + waterPct);
	element = document.getElementById("vliquorbar");
	element.style.width = temp + "%";
	document.getElementById("vlpercentageLabel").innerHTML = temp.toFixed(0) + "%";
}


function volumeBack(mode) {
	// Mode 1 = Do gin volume
	// Mode 2 = Do vodka volume
	let liquorTotal, vermAmount, waterAmount, which;

	if (mode == 1) {
		liquorTotal = grabValue("gvermouthOut");
		vermAmount = grabDropdown("vgRatio");
	}

	if (mode == 2) {
		liquorTotal = grabValue("vvermouthOut");
		vermAmount = grabDropdown("vvRatio");
	}

	waterAmount = grabDropdown("waterRatio");

	let origVolume = liquorTotal / (1 + waterAmount + vermAmount);
	origVolume = origVolume.toFixed(0);
	document.getElementById("liquorIn").value = origVolume;
	calculate(mode);
}

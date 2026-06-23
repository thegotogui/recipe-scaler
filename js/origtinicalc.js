//  Regular
// ? This is blue
// ! This is red
// * This is BRIGHT green
// Todo This is orange!


var calcMode = 1,
	valueList, labelList, ingenium, italicus, vermouthScaled, vermouthInput, waterScaled, waterInput, dilutionRatio, dilutionRatioTmp,
	liquorPcnt, liquorPcnt, vermouthPct, waterPct, ingenPct, italicPct,
	liquorInput, liquorOutput, totalVolume, firstRun = true,
	labelList = ["lupiniFields", "notLupini", "notLupini2", "volumeOnly", "ratioOnly"];

// Go get the relevant value based on the ID provided
function grabValue(fieldName) {
	var x = parseFloat(document.getElementById(fieldName).value);
	return x;
}

function forIngenium() {
	ingenium = grabValue("ingeniumIn");
	var temp = ingenium * 5;
	document.getElementById("liquorIn").value = temp;
	calculate();
}

function forItalicus() {
	italicus = grabValue("italicusIn");
	var temp = italicus * 50;
	document.getElementById("liquorIn").value = temp;
	calculate();
}

function forVermouth() {
	vermouthInput = grabValue("vermouthIn");
	var temp = vermouthInput * 2.5;
	document.getElementById("liquorIn").value = temp;
	calculate();
}

function calculate(isItVolume) {

	// If the app was just launched, grab values from previous session.
	if (firstRun) {
		var chosen = document.getElementById("vermRatio");
		chosen.selectedIndex = localStorage.getItem("vermRatio");

		chosen = document.getElementById("waterRatio");
		chosen.selectedIndex = localStorage.getItem("waterRatio");

		document.getElementById("liquorIn").value = localStorage.getItem("liquorIn");
		firstRun = false;
	}

	liquorInput = grabValue("liquorIn");
	localStorage.setItem("liquorIn", liquorInput);

	var chosen = document.getElementById("vermRatio");
	vermouthInput = parseFloat(chosen.options[chosen.selectedIndex].value);
	localStorage.setItem("vermRatio", chosen.selectedIndex);

	chosen = document.getElementById("waterRatio");
	waterInput = parseFloat(chosen.options[chosen.selectedIndex].value);
	localStorage.setItem("waterRatio", chosen.selectedIndex);

	// In either Ratio or Volume mode, vermouth and water values are derived from a drop-down menu
	if (calcMode == 1 || calcMode == 2) {

		ingenium = 0;
		italicus = 0;

		// Get vermouth dropdown value
		var chosen = document.getElementById("vermRatio");
		vermouthInput = parseFloat(chosen.options[chosen.selectedIndex].value);
		localStorage.setItem("vermRatio", chosen.selectedIndex);

		// Get water dropdown value
		var chosen = document.getElementById("waterRatio");
		waterInput = parseFloat(chosen.options[chosen.selectedIndex].value);
		localStorage.setItem("waterRatio", chosen.selectedIndex);
	}

	// If mode is 1, then we're just doing straight ratios
	if (calcMode == 1) {
		if (liquorInput * vermouthInput != 0) {
			var vtemp = liquorInput * vermouthInput;
			vermouthScaled = parseFloat(vtemp.toFixed(2));

			var waterScaledTmp = liquorInput * waterInput;
			waterScaled = parseFloat(waterScaledTmp.toFixed(2));

			dilutionRatioTmp = (liquorInput - (vermouthScaled + waterScaled)) / liquorInput;
			dilutionRatio = 100 * parseFloat(dilutionRatioTmp.toFixed(2));

			waterRatioTmp = 100 * (waterScaled / liquorInput);
			waterRatio = parseFloat(waterRatioTmp.toFixed(2));

			vtemp = vermouthScaled / liquorInput * 100;
			vermouthRatio = parseFloat(vtemp.toFixed(2));
			totalVolume = liquorInput + vermouthScaled + waterScaled;
			liquorOutput = liquorInput;
		}
	}

	if (calcMode == 2) {

		var liquorScaledTmp = parseFloat(liquorInput * (1 - (vermouthInput + waterInput)));
		liquorOutput = liquorScaledTmp;

		var vermouthScaledTmp = parseFloat(liquorInput * vermouthInput);
		vermouthScaled = vermouthScaledTmp;

		var waterScaledTmp = parseFloat(liquorInput * waterInput);
		waterScaled = waterScaledTmp;

		totalVolume = liquorOutput + vermouthScaled + waterScaled;
	}
	if (calcMode == 3) {
		if (isItVolume != 1) {
			ingenium = liquorInput * .2;
			vermouthScaled = liquorInput * .4;
			italicus = liquorInput * .02;
			totalVolume = liquorInput + ingenium + vermouthScaled + italicus;
			document.getElementById("totalOut").value = totalVolume.toFixed(2);

		} else {
			var temp = document.getElementById("totalOut").value;
			totalVolume = parseFloat(temp);
			ingenium = totalVolume * .12345;
			vermouthScaled = totalVolume * .24691;
			italicus = totalVolume * .01234;
			liquorInput = totalVolume * .617283;
			document.getElementById("liquorIn").value = liquorInput.toFixed(2);
		}

		document.getElementById("vermouthIn").value = vermouthScaled.toFixed(2);
		document.getElementById("ingeniumIn").value = ingenium.toFixed(2);
		document.getElementById("italicusIn").value = italicus.toFixed(2);
		waterScaled = 0;
		writeBars(1);
	}


	// If it's a non-zero amount, go ahead and calculate it
	// Otherwise, zero everything out
	else {
		document.getElementById("liquorOut").value = liquorOutput.toFixed(2);
		document.getElementById("vermouthOut").value = vermouthScaled.toFixed(2);
		document.getElementById("waterOut").value = waterScaled.toFixed(2);
		document.getElementById("totalOut").value = totalVolume.toFixed(2);
		writeBars();
	}
}


// * Update the ratio bars
function writeBars(lupini) {

	// If the Lupini recipe calls this function, we're grabbing different values than the rest
	let element = document.getElementById("liquorbar");
	if (lupini != 1) {
		liquorPcnt = (liquorOutput / totalVolume) * 100;
	} else {
		liquorPcnt = (liquorInput / totalVolume) * 100;
	}

	element.style.width = liquorPcnt + "%";
	document.getElementById("lpercentageLabel").innerHTML = liquorPcnt.toFixed(0) + "%";

	element = document.getElementById("vermouthbar");
	vermouthPct = (vermouthScaled / totalVolume) * 100;
	element.style.width = vermouthPct + "%";
	document.getElementById("vpercentageLabel").innerHTML = vermouthPct.toFixed(0) + "%";

	element = document.getElementById("waterbar");
	waterPct = (waterScaled / totalVolume) * 100;
	element.style.width = waterPct + "%";
	document.getElementById("wpercentageLabel").innerHTML = waterPct.toFixed(0) + "%";

	element = document.getElementById("ingeniumbar");
	ingenPct = (ingenium / totalVolume) * 100;
	element.style.width = ingenPct + "%";
	document.getElementById("inpercentageLabel").innerHTML = ingenPct.toFixed(0) + "%";

	element = document.getElementById("italicusbar");
	italicPct = (italicus / totalVolume) * 100;
	document.getElementById("itpercentageLabel").innerHTML = italicPct.toFixed(0) + "%";

	// console.log(`liquorPcnt ${liquorPcnt}, ${vermouthPct} ${waterPct} ${ingenPct} ${italicPct}`);

	// Italicus is used in VERY small quantities and, as such, won't show up in the graph without this helper. If the WIDTH is less than 3%, just make it 3 but label it correctly
	if (italicPct < 4 && italicPct > 0) {
		italicPct = 4;
	}
	element.style.width = italicPct.toFixed(0) + "%";
}

// * This function handles when one of the three tabs along the top is clicked
function switchFlip(which) {

	for (index = 1; index <= 3; index++) {
		var element = document.getElementById("option" + index).checked;
		if (element) {
			calcMode = index;
		}
	}

	// Depending on which mode the calculator is in, hide or show the relevant fields and label the initial field appropriately

	// Ratio mode
	if (calcMode == 1) {
		document.getElementById("liquorIn").value = 56;
		var labelVal = "Liquor";
		valueList = ["none", "block", "flex", "none", "block"];
		document.getElementsByClassName("btn-primary")[0].setAttribute("class", "btn btn-primary active");
		document.getElementsByClassName("btn-primary")[1].setAttribute("class", "btn btn-primary");
		document.getElementsByClassName("btn-primary")[2].setAttribute("class", "btn btn-primary");
	}

	// Final volume mode
	if (calcMode == 2) {
		var labelVal = "Total Volume";
		valueList = ["none", "block", "flex", "flex", "none"];
		document.getElementsByClassName("btn-primary")[0].setAttribute("class", "btn btn-primary");
		document.getElementsByClassName("btn-primary")[1].setAttribute("class", "btn btn-primary active");
		document.getElementsByClassName("btn-primary")[2].setAttribute("class", "btn btn-primary");
	}

	// Lupini Martini mode
	if (calcMode == 3) {
		var labelVal = "Beefeater";
		valueList = ["block", "none", "none", "none", "block"];
		document.getElementsByClassName("btn-primary")[0].setAttribute("class", "btn btn-primary");
		document.getElementsByClassName("btn-primary")[1].setAttribute("class", "btn btn-primary");
		document.getElementsByClassName("btn-primary")[2].setAttribute("class", "btn btn-primary active");
	}

	// step through the various fields and update their visibility accordingly
	document.getElementById("ratioLabel").innerHTML = labelVal;
	for (i = 0; i < valueList.length; i++) {
		var x = labelList[i];
		var y = valueList[i];
		document.getElementById(x).style.display = y;
	}

	// Do all the relevant math, update values, etc.
	calculate();
}
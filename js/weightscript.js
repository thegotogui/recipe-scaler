console.log(`Version 05-07-26 - Improved linking between scaler and weight.
Version 02-04-26 - Fixed the issue where modifying the container weight would destroy the Scale Reading G field. Also, the Scale Reading fields are no longer zeroed out when the difference fields are manually modified because that was distracting and unnecessary.
Version 28-02-26 - Cakeulator now shows the correct scale between the two pans using the larger as the max and then scaling the smaller one. Bug remains in showing or hiding the main weight function.
Version 22-02-26 The Container add-on function now works correctly.
Version 18-01-26 - Added ability to lock the container weight to retro-calculate
Version 03-01-26 - Added manual adjustments in Portionator with color coding to indicate manual vs adjusted values
Version 11-03-25 - added versioning declaration`);

const gramConversion = 28.349523125;
const round2 = num => parseFloat(num.toFixed(2));


var wtDifferenceG,
    wtDifferenceO,
    cWeight,
    chosen,
    descending = true, // Flag to indicate whether the Portionator is in ascending or descending mode
    qtyMultiply,
    scale,
    gScale,
    ozScale,
    ozWeight,
    unitsMultiplier,
    whichMeasure,
    gWeight,
    diffChange,
    inGrams,
    scaleReadingG, scaleReadingO,
    contQty,
    dividedBy,
    pnatorPortions,
    tFract,
    tFractUp,
    tScale,
    ratioSet = [2, 3, 4, 6, 8, 10, 12, 16],
    fractSet = [0.08333, 0.125, .25, .375, .333333, .5, .625, .75],
    fractUpSet = [1.0625, 1.083333333, 1.1, 1.125, 1.6666667, 1.25, 1.333333, 1.5],
    divSet = [16, 12, 10, 8, 6, 4, 3, 2],
    portionList = [],
    visibleLabels2 = [
        ["theWeight", true],
        ["theScale", false],
        ["arbitrary", false],
        ["cakeulator", false],
        ["dtit", false],
        ["newDistThing", false]
    ],
    maxPts = [],
    equalPts = [],
    propPts = [],

    // For new distributor
    values = [],
    theMax,
    theMin,
    theSum,
    increment,
    lockStatus = false,
    grandTotal = 0,
    withContainer = false,
    firstRun = true; // Flag to determine if the page has just been opened and if data needs to be loaded from local storage.

function distThis() {

    let start = [0]; // Gotta start with a value in the zero position or "max" gets confused
    var subTotal = 0,
        subTotalEP = 0,
        subTotalPR = 0,
        subTotalMX = 0,
        temp,
        distThis = Number(document.getElementById("distThis").value);

    var grandTotal = distThis;

    // First, do a pass through all values to get totals and othersuch
    for (let index = 1; index <= 8; index++) {
        temp = Number(document.getElementById("distIntoST" + index).value);
        if (!isNaN(temp) && temp > 0) {
            start[index] = Number(document.getElementById("distIntoST" + index).value);
            grandTotal = grandTotal + start[index];
            subTotal = subTotal + start[index];
        } else {
            document.getElementById("distIntoMX" + index).value = "";
        }
        document.getElementById("distIntoPR" + index).value = "";
        document.getElementById("distIntoEP" + index).value = "";
    }

    let len = start.length - 1,
        portions = grandTotal / len,
        maxValue = Math.max(...start),
        maxRemainderS = subTotal - maxValue,
        subTotalVal = 0;

    for (let index = 1; index < len + 1; index++) {

        // * Equal Parts Calculation
        equalPts[index] = portions - start[index];
        document.getElementById("distIntoEP" + index).value = equalPts[index].toFixed(2);

        var bgcolor = "";

        // Tint negative values red
        if (equalPts[index] < 0) {
            bgcolor = "#660000";
        }

        document.getElementById("distIntoEP" + index).style.backgroundColor = bgcolor;

        subTotalEP += equalPts[index];

        // * Proportional Calculation
        propPts[index] = (start[index] / subTotal) * distThis;
        document.getElementById("distIntoPR" + index).value = propPts[index].toFixed(2);

        // Update subtotal for this column
        subTotalPR += propPts[index];

        // * Max Value Calculation - (start / total-max) * start)
        if (start[index] < maxValue) {
            maxPts[index] = (start[index] / maxRemainderS) * distThis;
            document.getElementById("distIntoMX" + index).value = maxPts[index].toFixed(2);

            // Update subtotal for this column
            subTotalMX += maxPts[index];
            bgcolor = "";
        } else {
            document.getElementById("distIntoMX" + index).value = maxValue;

            temp = Number(document.getElementById("distIntoST" + index).value);
            if (temp != 0 || temp == NaN) {
                bgcolor = "green";
            }
        }
        document.getElementById("distIntoMX" + index).style.backgroundColor = bgcolor;
    }

    if (distThis == 0) {
        document.getElementById("subtotalTitle").innerHTML = "Average";
        subTotalVal = grandTotal / len;
    } else {
        document.getElementById("subtotalTitle").innerHTML = "Subtotal";
        subTotalVal = subTotalEP;
    }

    document.getElementById("distPortion").value = portions.toFixed(2);
    document.getElementById("distPortions").value = len;

    document.getElementById("grandTotal").value = grandTotal;
    document.getElementById("subTotal").value = subTotalVal.toFixed(0);
    document.getElementById("subTotalEP").value = subTotalEP.toFixed(0);
    document.getElementById("subTotalPR").value = subTotalPR.toFixed(0);
    document.getElementById("subTotalMX").value = subTotalMX.toFixed(0);
    newDist();
}


// Something about the various buttons have changed. Go do something about that.
function scaleFlip(x) {

    // If x > 9, it's one of the units buttons
    if (x > 9) {

        if (x == 10) {
            whichMeasure = 'g';
            calWeightG(0);
        } else {
            whichMeasure == 'oz';
            calWeightO(0);
        }

    } else {

        // If x < 8, it's one of the five main toggle buttons.
        // If x is not zero, a button needs to be inverted. Figure out what the current status of the display is and invert it
        // If it's not zero, it means scaler is starting up and the various pieces should reflect their visibility.
        if (x != 0) {
            if (x > 1 && x < 5) {
                visibleLabels2[0][1] = true;
            }
            visibleLabels2[x - 1][1] = !visibleLabels2[x - 1][1];
        }
        // Now, go and update the buttons as well as the visibility of the various scaling regions.
        let weightField;
        if (visibleLabels2[0][1]) {
            weightField = true;
        }

        // Special case for CakeUlator - if it is visible, then weight needs to be hidden because it's irrelevant and takes up space
        if (visibleLabels2[3][1]) {
            visibleLabels2[0][1] = false;
            weightField = false;
        }

        for (let index = 1; index <= visibleLabels2.length; index++) {

            // I think the main weight field is separate because other modules depend on it.
            if (index > 0 && visibleLabels2[index - 1][0] && weightField) {
                document.getElementById("theWeight").style = "border-radius: 15px 15px 0px 0px;";
            }

            if (visibleLabels2[index - 1][1]) {
                if (index == 1) {
                    document.getElementById(visibleLabels2[index - 1][0]).style.display = "grid";
                } else {
                    document.getElementById(visibleLabels2[index - 1][0]).style.display = "block";
                }
                document.getElementById("option" + index).classList.add("active");
            } else {
                document.getElementById(visibleLabels2[index - 1][0]).style.display = "none";
                document.getElementById("option" + index).classList.remove("active");
            }
        }
    }
    colorMeasure();
    cakeulateAll();
}

function copyValues() {
    document.getElementById("differenceG").value = document.getElementById("inGrams").value;
    difWeight('g', false);
}

function updateWeight() {
    // A new weight has been chosen from the dropdown list.
    // Retrieve that weight from the HTML dropdown
    // Update the "container weight" field to reflect the new value

    // If a value was manually entered previously, clear that flag
    diffChange = false;

    chosen = document.getElementById("weightSelect");

    let cWeightNew = chosen.options[chosen.selectedIndex].value;
    if (cWeightNew != cWeight) {
        unitsMultiplier = 1;
        whichMeasure = "g";
    }

    // If a valid option has been chosen from the dropdown, assign that value to the container weight
    if (cWeightNew != 0) {
        cWeight = cWeightNew;

        //Update everything accordingly
        updateTheWeight2();
        calWeightG();
    }
    document.getElementById("scaleReadingG").focus();
}

function colorMeasure() {
    // Depending on the units selected, colorize the backgrounds of the various boxes accordingly
    let light = "rgba(155, 181, 191, .4)";
    let dark = "rgba(155, 181, 191, 0)";
    let grams, ounces, adder, remover;

    if (whichMeasure == 'g') {
        grams = light;
        ounces = dark;
        remover = "optionO";
        adder = "optionG";

    } else {
        grams = dark;
        ounces = light;
        remover = "optionG";
        adder = "optionO";
    }

    document.getElementById(remover).classList.remove("active");
    document.getElementById(adder).classList.add("active");

    let x = document.getElementsByClassName("grammy");
    let y = document.getElementsByClassName("ouncy");
    let i;
    for (i = 0; i < 3; i++) {
        x[i].style.backgroundColor = grams;
        y[i].style.backgroundColor = ounces;
    }
}

//------------------------------------------------------------------------------------------------
// Handle when values are manually entered in the container weight fields in grams or ounces
//------------------------------------------------------------------------------------------------
function manualWeight(units) {

    // Turn off the difference flag so that the Difference fields are updated appropriately.
    diffChange = false;

    //If grams were entered, grab the value and do the math for ounces
    if (units == "g") {
        gWeight = document.getElementById("inGrams").value;
        ozWeight = gWeight / gramConversion;
        document.getElementById("inOunces").value = ozWeight.toFixed(2);

        //set the units multiplier to 1 to represent grams
        unitsMultiplier = 1;

        //Set the flag that tells other functions to think in grams
        whichMeasure = "g";

    } else {
        //If ounces were entered, grab the value and do the math for GRAMS
        ozWeight = document.getElementById("inOunces").value;
        gWeight = ozWeight * gramConversion;
        document.getElementById("inGrams").value = gWeight.toFixed(2);

        // Set the units multiplier to the grams-per-ounce conversion.
        unitsMultiplier = gramConversion;

        //Set the flag that tells other functions to think in grams
        whichMeasure = "oz";
    }

    // Update the dropdown to indicate no particular container is being used for the value.
    document.getElementById("weightSelect").selectedIndex = 0;

    // Now, go update everything else accordingly.
    calculateAll();
    colorMeasure();
}



//* ------------------------------------------------------------------------------------------------
//*  Get the ounces version of the grams amount.
//* ------------------------------------------------------------------------------------------------

function updateTheWeight2() {
    document.getElementById("inGrams").value = cWeight;

    ozWeight = cWeight * 0.035273369;
    document.getElementById("inOunces").value = ozWeight.toFixed(2);
}

// * Update everything after a value has been entered in the Scale Grams field
function calWeightG(mode) {

    // * Mode 0 means something has been entered in the grams scale field.
    if (mode == 0) {

        // Turn off the flag that suppresses updating the Difference fields
        diffChange = false;

        // Grab the value entered
        gScale = parseInt(getObj('scaleReadingG').value);
        gWeight = document.getElementById("inGrams").value;

        // Convert from grams to ounces
        ozScale = gScale / gramConversion;
        ozScale = ozScale.toFixed(2);

        // Update Ounces scale field accordingly
        document.getElementById("scaleReadingO").value = ozScale;
    }

    // Set a multiplier and a field label for the other fields 
    unitsMultiplier = 1;
    whichMeasure = "g";
    calculateAll();
    colorMeasure();
}

// Update everything after a value has been entered in the Scale Ounces field
function calWeightO(mode) {

    if (mode == 0) {
        // Turn off this flag that suppresses updating the Difference fields
        diffChange = false;

        //Something has been entered in the Ounces scale field. Grab the value.
        ozScale = parseInt(getObj('scaleReadingO').value);
        ozWeight = document.getElementById("inOunces").value;

        //Convert from ounces to grams
        gScale = ozScale * gramConversion;
        gScale = gScale.toFixed(2);

        //Update Grams scale field accordingly
        document.getElementById("scaleReadingG").value = gScale;
    }

    // Set a multiplier and a field label for the other fields 
    unitsMultiplier = gramConversion;
    whichMeasure = "oz";
    calculateAll();
    colorMeasure();
}

//* ------------------------------------------------------------------------------------------------
//*  Calculate everything backwards if a value is entered in either "difference" field.
//* ------------------------------------------------------------------------------------------------

function difWeight(unit, zeroFlag, scalerStat) {

    // If unit is grams, do grams.
    if (unit == 'g') {
        wtDifferenceG = document.getElementById("differenceG").value;
        document.getElementById("amount").value = wtDifferenceG;
        scaleReadingG = wtDifferenceG;

        let oEquiv = wtDifferenceG / gramConversion;
        wtDifferenceO = oEquiv.toFixed(2);
        document.getElementById("differenceO").value = wtDifferenceO;
        scaleReadingO = wtDifferenceO;

        // Set a multiplier and a field label for the other fields 
        multiplierVal = 1;
        whichMeasure = "g";
    }

    // Otherwise units is ounces so do ounces.
    else {
        wtDifferenceO = document.getElementById("differenceO").value;
        scaleReadingO = wtDifferenceO;

        let oEquiv = wtDifferenceO * gramConversion;
        wtDifferenceG = oEquiv.toFixed(2);
        scaleReadingG = wtDifferenceG;
        document.getElementById("differenceG").value = wtDifferenceG;

        //* If the scalerStat flag is not true, then update the "amount" field to reflect the new difference value.
        if (scalerStat != true) {
            document.getElementById("amount").value = wtDifferenceG;
        };

        // Set a multiplier and a field label for the other fields 
        multiplierVal = gramConversion;
        whichMeasure = "oz";
    }
    colorMeasure();

    if (lockStatus == false) {
        // Zero out the container weight fields
        if (zeroFlag) {
            document.getElementById("inOunces").value = 0;
            document.getElementById("inGrams").value = 0;
            document.getElementById("scaleReadingG").value = 0;
            document.getElementById("scaleReadingO").value = 0;
        }

        // Reset the dropdown to the default
        document.getElementById("weightSelect").selectedIndex = 0;

    } else {
        // * If the container weight is locked, subtract the  container weight from the total weight and update the target scale weight
        let containerWeightInGrams = document.getElementById("inGrams").value;

        let scaleReadingg = wtDifferenceG - containerWeightInGrams;
        document.getElementById("scaleReadingG").value = scaleReadingg.toFixed(2);
        let scaleReadingo = scaleReadingg / gramConversion;
        document.getElementById("scaleReadingO").value = scaleReadingo.toFixed(2);

        scaleReadingO = scaleReadingo;
        scaleReadingG = scaleReadingg;
    }

    //* Make the scale values match the difference values so the math don't look stoopid
    diffChange = true;
    calculateAll();
}

//------------------------------------------------------------------------------------------------
// Stash all variables in local storage
//------------------------------------------------------------------------------------------------

function storageValues() {
    dividedBy = parseInt(getObj('dividedBy').value);
    gWeight = document.getElementById("inGrams").value;
    gScale = document.getElementById("scaleReadingG").value;
    ozWeight = document.getElementById("inOunces").value;
    ozScale = document.getElementById("scaleReadingO").value;

    localStorage.setItem("dividedBy", dividedBy);
    localStorage.setItem("gWeight", gWeight);
    localStorage.setItem("gScale", gScale);
    localStorage.setItem("ozWeight", ozWeight);
    localStorage.setItem("ozScale", ozScale);
    localStorage.setItem("whichMeasure", whichMeasure);

    // Handoff is a flag to the Ratios cocktail calculator that hands off the weight of the ingredients as the default volume in a cocktail.
    // After retrieving the value, the flag is disabled until a different value is weighed.
    localStorage.setItem("handoff", "true");
}

// Updates all calculated fields based on whatever values are in the input fields.
// The exception is the two "difference" fields which can be manually updated for portioning.
// If they are updated, then the fields are not auto-populated.
function calculateAll(noEach) {

    dividedBy = parseInt(getObj('dividedBy').value);
    gWeight = getObj("inGrams").value;
    gScale = getObj("scaleReadingG").value;
    ozWeight = getObj("inOunces").value;
    ozScale = getObj("scaleReadingO").value;
    storageValues();

    //* The difference value(s) are handled here.
    // If difference was NOT manually updated, derive the value from the container weight and scale fields
    if (!diffChange) {
        wtDifferenceG = (gScale - gWeight);
        wtDifferenceG = wtDifferenceG.toFixed(2);

        wtDifferenceO = (ozScale - ozWeight);
        wtDifferenceO = wtDifferenceO.toFixed(2)
    } else {
        wtDifferenceG = getObj("differenceG").value;
        wtDifferenceO = getObj("differenceO").value;
    }

    // If there is a valid combination of weight(s) going on, change the background color of the fields from red to dark grey
    if ((wtDifferenceG > 0 || wtDifferenceO > 0) || cWeight == 120 || cWeight == 236.59 || cWeight == 210.1) {

        document.getElementById("scaleReadingG").style.backgroundColor = "rgba(17, 22, 28, 1)";
        document.getElementById("scaleReadingO").style.backgroundColor = "rgba(17, 22, 28, 1)";

        // If grams are being modified, then grab the grams difference for the math
        if (whichMeasure == "g") {
            weightOffset = wtDifferenceG;

        } else {
            // Otherwise, use Ounces
            weightOffset = wtDifferenceO;
        }

        // If differences are being modified, don't update those fields
        if (!diffChange) {
            getObj("differenceG").value = wtDifferenceG;
            getObj("amount").value = wtDifferenceG;
            getObj("differenceO").value = wtDifferenceO;
        };

        // If the portions field is being edited, don't update that field either
        if (noEach != "noEach") {
            let portionValue = weightOffset / dividedBy;
            getObj("portions").value = portionValue.toFixed(2);
        }

        //* Update the various ratios
        for (let x = 0; x < ratioSet.length; x++) {
            // 
            portionValue = weightOffset / ratioSet[x];
            let y = x + 1;
            getObj("ratio" + y).value = parseFloat(portionValue.toFixed(2)) + whichMeasure;

            portionValue = weightOffset * ratioSet[x];
            getObj("scalex" + y).value = parseFloat(portionValue.toFixed(2)) + whichMeasure;

            portionValue = weightOffset * fractSet[x];

            let z = weightOffset * fractUpSet[x];
            portionValue = Number(z);
        }

        // Update the dials on the scale
        rotateDial(gScale);

        //# Portionator
        // * Make THE PORTIONATOR    
        // Update the portions table
        // First, get the number of portions being created.
        let count = Number(document.getElementById("dividedBy").value);

        let stylex = [],
            styley = [],
            divider0 = ":",
            divider1 = ":",
            divider2 = ":",
            divider3 = ":";

        // Set theDiv to the div that holds the portionator
        let theDiv = document.getElementById("portionatorZone");

        // Then immediately erase its contents
        theDiv.innerHTML = "";

        // First, do a loop to create the rows/columns
        // We're counting in multiples of four because there are four quantities in each row

        for (let x = 1; x <= count; x += 4) {
            // Next, we determine the styling for each of the portions.
            // If a column in a row is within the range we're working with, it should have a normal appearance.
            // If it's higher, then it should look like the background.
            // It's only necessary to style the 2nd, 3rd, and 4th columns because, if the row exists at all, then the first column is guaranteed to be active.

            input1vis = "block", input2vis = "block", input3vis = "block";

            // Second Column
            let column2 = x + 1;
            if (column2 > count) {
                column2 = "";
                divider1 = "";
                stylex[1] = "fieldDarkerDis";
                styley[1] = "arbScaleOutDis";
                input1vis = "-moz-appearance: textfield;"
            } else {
                stylex[1] = "fieldDarker";
                styley[1] = "arbScaleOut";
            }

            // Third Column
            let column3 = x + 2;
            if (column3 > count) {
                column3 = "";
                divider2 = "";
                stylex[2] = "fieldDarkerDis";
                styley[2] = "arbScaleInDis";
                input2vis = "-moz-appearance: textfield;"
            } else {
                stylex[2] = "fieldDarker";
                styley[2] = "arbScaleOut";
            }

            // Quantity 3
            let column4 = x + 3;
            if (column4 > count) {
                column4 = "";
                divider3 = "";
                stylex[3] = "fieldDarkerDis";
                styley[3] = "arbScaleInDis";
                input3vis = "-moz-appearance: textfield;"
            } else {
                stylex[3] = "fieldDarker";
                styley[3] = "arbScaleOut";
            }

            theDiv.innerHTML += `<div class="flex-container middleIt subSection-mid">
                <div class="arbScaleOut" id="portion${x}">
                    ${x}${divider0}<input id="thisPortion${x}" onInput="rippleDown(${x})" type="number" class="fieldDarker" />
                    <div id="labelPortion${x}" class="labelPortion"></div>
                </div>
                <div class="${styley[1]}" id="portion${column2}">
                    ${column2}${divider1}<input id="thisPortion${column2}" onInput="rippleDown(${column2})" type="number" style="${input1vis};" class="${stylex[1]}" />
                    <div id="labelPortion${column2}" class="labelPortion"></div>
                </div>
                <div class="${styley[2]}" id="portion${column3}">
                    ${column3}${divider2}<input id="thisPortion${column3}" onInput="rippleDown(${column3})" type="number" style="${input2vis};" class="${stylex[2]}" />
                    <div id="labelPortion${column3}" class="labelPortion"></div>
                </div>
                <div class="${styley[3]}" id="portion${column4}">
                    ${column4}${divider3}<input id="thisPortion${column4}" onInput="rippleDown(${column4})" type="number" style="${input3vis};" class="${stylex[3]}" />
                    <div id="labelPortion${column4}" class="labelPortion"></div>
                </div>
                </div>`;
        }

        // Get the incremental value
        increment = weightOffset / count;

        // Set up a variable to hold the color of the fields as they are being updated in case they need to be changed back after the ripple down function.
        let fieldColor = "";
        let buttonDefault = "#198754ff";
        let buttonRed = "#944949";
        let setBgColor, setBorderColor, containerTogState;
        if (descending) {
            fieldColor = "white";
            setBgColor = buttonDefault;
            setBorderColor = `2px solid ${buttonDefault}`;
            document.getElementById("containerToggle").classList.remove("disabled");

        } else {
            fieldColor = "red";
            setBgColor = buttonRed;
            setBorderColor = `2px solid ${buttonRed}`;
            document.getElementById("containerToggle").classList.add("disabled");
        }
        document.getElementById("containerToggle").style.backgroundColor = setBgColor;
        document.getElementById("containerToggle").style.border = setBorderColor;

        for (let x = 1; x <= count; x++) {
            // Three Scenarios here:
            // == Scenario =====================
            // 1. Container, Tare, Contents: 
            // We're descending from the weight of the contents to zero.
            // Determine if we are showing ASCENDING or DESCENDING values
            let temp
            if (descending) {
                let decendingValue = weightOffset - (increment * (x - 1));
                temp = decendingValue;
                if (withContainer) {
                    temp += Number(gWeight);
                }
            } else {
                let ascendingValue = increment * x;
                // Display the quantity as a negative number
                temp = ascendingValue * -1;
            }
            document.getElementById("thisPortion" + x).value = round2(temp);
            document.getElementById("thisPortion" + x).style.color = fieldColor;
            portionList[x - 1] = temp;
            document.getElementById("labelPortion" + x).innerHTML = "";
        }
    }

    // Otherwise, zero out all of the ratios and turn the scale reading box red.
    else {
        let theRed = "rgba(90, 0, 0, 0.8)";
        getObj("scaleReadingG").style.backgroundColor = theRed;
        getObj("scaleReadingO").style.backgroundColor = theRed;
        getObj("differenceG").value = 0;
        getObj("differenceO").value = 0;
        getObj("portions").value = 0;

        let y;
        for (let x = 0; x <= ratioSet.length - 1; x++) {
            y = x + 1;
            getObj("ratio" + y).value = "";
        }
    }

    scaleFlip(0);
    updatePorionatorToggles();
    distThis();

    // Now that all calculation has been done on the current values, check to see if something is being sent from scaler and respond accordingly.
    if (localStorage.getItem("fromScaler") == "true") {
        localStorage.setItem("fromScaler", "false"); // Reset the flag so that it doesn't keep reloading the values over and over again.
        document.getElementById("differenceG").value = localStorage.getItem("fromScalerTotal");
        document.getElementById("dividedBy").value = localStorage.getItem("reciPortions");
        difWeight("g");
        scaleFlip(3);
    }
}



function weightportionCalc() {
    let temp = document.getElementById("portions").value;
    let temp2 = scaleReadingG;
    let temp3 = temp2 / temp;
    console.log(`temp: ${temp}`);
    console.log(`temp2: ${temp2}`);
    console.log(`temp3: ${temp3}`);
    document.getElementById("dividedBy").value = temp3.toFixed(0);
    calculateAll("noEach");
}


// This turns the dial in the icon based on how much is on the scale or the difference in weight
function rotateDial(gScale) {
    var dialAdjuster = 0
    if (gScale < 100) {
        dialAdjuster = 3.6 * gScale;
    } else {
        dialAdjuster = .36 * gScale;
    }
    let rotationValues = `rotate (${dialAdjuster}, 192, 228)`;
    document.getElementById("Dial").setAttribute("transform", rotationValues);
}


function toggleAscDesc() {
    // Toggle the ascending/descending flag
    descending = !descending;

    // If we're switching to ascending, then we have to turn off the with container option because it doesn't make sense in that mode.
    if (!descending) {
        withContainer = false;
    }

    updatePorionatorToggles()
    calculateAll();
}

function toggleContainer() {
    // Toggle the with/without container flag
    withContainer = !withContainer;

    updatePorionatorToggles()
    calculateAll();
}

function updatePorionatorToggles() {
    let add, remove;

    // Update the sort direction button icon 
    if (descending) {
        remove = "bi-sort-numeric-down";
        add = "bi-sort-numeric-down-alt";
    } else {
        remove = "bi-sort-numeric-down-alt";
        add = "bi-sort-numeric-down";
    }
    document.getElementById("adToggleButt").classList.remove(remove);
    document.getElementById("adToggleButt").classList.add(add);

    // Update the include container button icon
    if (withContainer) {
        remove = "bi-droplet";
        add = "bi-cup";
    } else {
        remove = "bi-cup";
        add = "bi-droplet";
    }
    document.getElementById("contToggleButt").classList.remove(remove);
    document.getElementById("contToggleButt").classList.add(add);
}


// * Portionator ripple down function allows for manual adjustment of any portion value in Portionator
// * and automatically adjusts the subsequent portions accordingly.
function rippleDown(deltaIndex) {

    // Tag the field that was just modified
    let deltaColor;
    if (descending) {
        deltaColor = "rgba(0, 255, 0, 0.4)";
    } else {
        deltaColor = "rgba(255, 0, 0, 0.4)";
    }

    document.getElementById("portion" + deltaIndex).style.backgroundColor = deltaColor;

    // Grab the new value from the field being modified
    let baseValue = Number(document.getElementById("thisPortion" + deltaIndex).value);
    baseValue = Math.abs(baseValue);

    // If the "withContainer" option is on,
    // the total is the portion plus the container.
    // In that case, we need to subtract the container weight from the base value
    // to get the actual portion weight for the math to work out.
    if (withContainer) {
        baseValue -= gWeight;
    }

    // Get the number of portions we are dividing into
    let thePortions = Number(document.getElementById("dividedBy").value);

    // Use the deltaIndex parameter to determine where to start adjusting values
    let stepsToColor = thePortions - deltaIndex;
    stepsToColor -= 1;

    let rValue = 0,
        gValue = 0,
        bValue = 0,
        servingSize = 0,
        // rgbInc = [0, 0, 0],
        // rgbVals = [0, 0, 0],
        rValueInc = 0,
        gValueInc = 0,
        bValueInc = 0,
        posNeg = 1;

    if (descending) {
        //* Calculate the incremental value for each subsequent portion
        //* The base value is the value in the field that was just modified.
        //* The incremental value is that new value divided by the number of remaining portions
        //* to be modified. The +1 is because the deltaIndex starts at 1 but the first portion is not modified.
        servingSize = baseValue / (thePortions + 1 - deltaIndex);

        rgbInc = [155 / stepsToColor, 74 / stepsToColor, 191 / stepsToColor];
        // Calculate the increment between the current and the target color for RGB
        rValueInc = 155 / stepsToColor;          // 
        gValueInc = (181 - 255) / stepsToColor;  // 
        bValueInc = 191 / stepsToColor;          // 

        rgbVals = [0, 255, 0];
        rValue = 0;
        gValue = 255;
        bValue = 0;

        // Display it as a positive number
        posNeg = 1;

    } else {
        // Ascending mode
        //* Calculate the incremental value for each subsequent portion
        servingSize = (wtDifferenceG - baseValue) / (thePortions - deltaIndex);

        rValueInc = (155 - 255) / stepsToColor; // 
        gValueInc = 181 / stepsToColor;         // 
        bValueInc = 191 / stepsToColor;         // 

        rValue = 255;
        gValue = 0;
        bValue = 0;

        // Display it as a negative number
        posNeg = -1;
    }
    // * COMBINED FOR ASCENDING AND DESCENDING BECAUSE THEY'RE PRETTY MUCH THE SAME EXCEPT FOR THE DIRECTION OF THE SERVING SIZE AND THE COLOR INCREMENTERS

    for (let index = deltaIndex + 1; index <= thePortions; index++) {

        let containerValue;

        if (withContainer) {
            containerValue = gWeight;
        } else {
            containerValue = 0;
        }

        if (descending) {              // Descending Direction      
            baseValue -= servingSize;

        } else {                       // Ascending Direction
            baseValue += servingSize;
        }
        console.log(`index: ${index}`);
        document.getElementById("thisPortion" + index).value = (baseValue.toFixed(2) + containerValue) * posNeg;
        document.getElementById("portion" + index).style.backgroundColor = `rgba(${rValue}, ${gValue}, ${bValue}, 0.4)`;

        rValue += rValueInc;
        gValue += gValueInc;
        bValue += bValueInc;

        // Delta shows how far off we are from the previous value
        let delta;
        delta = (baseValue - portionList[deltaIndex - 1]);

        if (delta == 0) {
            document.getElementById("labelPortion" + deltaIndex).innerHTML = "";
        }
        else {
            document.getElementById("labelPortion" + deltaIndex).innerHTML = delta.toFixed(2);
        }
        deltaIndex++;
    }
}

function analyzeChecks(which) {
    // let latch = document.getElementById("newDistEnable" + which.toFixed(0)).checked;
    // let state, checkColor;
    let checkColor;

    for (let index = 1; index <= 6; index++) {
        if (index < which) {
            checkColor = "#FFF";
            document.getElementById("newDistEnable" + index).checked = true;
        }

        if (index > which) {
            checkColor = "#666";
            document.getElementById("newDistEnable" + index).checked = false;
        }
        document.getElementById("newDistIn" + index).style.color = checkColor;
    }

    newDist();
}

function newDist() {
    // First, erase values in all fields
    blankIt(0);

    // Reset the total of the values
    let theSum = 0;
    values = [];

    // Assume everything is fine. If either or both of the first two input fields are zero, burn it all down.
    let poisonPill = false;

    // Load values into an array while keeping a running total
    for (let index = 1; index <= 6; index++) {
        // Grab the respective values from the input fields.
        let temp = Number(document.getElementById("newDistIn" + index).value);

        // If either or both of the first two fields are zero or blank, then turn them BOTH red and shut it all down
        if (index < 3 && temp == 0) {
            document.getElementById("newDistIn1").style.background = "red";
            document.getElementById("newDistIn2").style.background = "red";
            poisonPill = true;
            blankIt(1);
        }
        // If this column is checked, push the values into the end of the array
        let latch = document.getElementById("newDistEnable" + index).checked;
        if (latch) {
            values.push(temp);
            theSum += temp;
            // Color the backgrounds appropriately
            document.getElementById("newDistIn1").style.background = "#1e242e";
            document.getElementById("newDistIn2").style.background = "#1e242e";
        }
    }

    // Make a note of the total of the values
    document.getElementById("distTotal").value = theSum;

    // poisonPill shuts down the entire process if either or both of the first two fields are blank or zero.
    // If poisonPill is NOT true, proceed as usual
    if (!poisonPill) {

        // Calculate the average
        theAverage = theSum / values.length;
        document.getElementById("averageVal").value = theAverage.toFixed(2);

        // Get max and min values
        theMax = Math.max(...values);
        theMin = Math.min(...values);

        // get the index of the max and min positions
        let maxIndex = values.indexOf(theMax);
        let minIndex = values.indexOf(theMin);

        // This variable defines the spaces that are used in the console log to summarize what
        let spacers = "      ";

        // Set a counter to parse through all values
        for (let index = 0; index < 5; index++) {

            // The crux of the entire algorithm
            // Grab the LESSER difference between the heaviest container and the average
            // and
            // the average - the lighest container

            let maxDiff = values[maxIndex] - theAverage;
            let minDiff = theAverage - values[minIndex];
            tempOffset = Math.min(maxDiff, minDiff);

            // Move that smaller amount
            values[maxIndex] -= tempOffset;
            values[minIndex] += tempOffset;

            let offsetIndex = index + 1;
            let offsetMaxIndex = maxIndex + 1;
            let offsetMinIndex = minIndex + 1;

            if (tempOffset.toFixed(0) > 0) {
                document.getElementById("distRow" + offsetIndex).style.display = "table-row";

                // set the SUBTRACTIVE field value and color code the text accordingly
                document.getElementById("newDistOp" + offsetIndex + offsetMaxIndex).value = (-1 * tempOffset).toFixed(2);
                document.getElementById("newDistOp" + offsetIndex + offsetMaxIndex).style.color = "red";

                // Set the ADDITIVE field value and color code the text accordingly
                document.getElementById("newDistOp" + offsetIndex + offsetMinIndex).value = tempOffset.toFixed(2);
                document.getElementById("newDistOp" + offsetIndex + offsetMinIndex).style.color = "green";
            } else {
                // if (offsetIndex < 6) {
                document.getElementById("distRow" + offsetIndex).style.display = "none";
                // }
            }

            let x1 = values[maxIndex].toFixed(2);
            let x2 = theAverage.toFixed(2);

            // If the formerly maximum value is now average, find a new max
            if (x1 == x2) {
                theMax = Math.max(...values);
                maxIndex = values.indexOf(theMax);
            }

            x1 = values[minIndex].toFixed(2);
            // If the formerly minimum value is now average, find a new min
            if (x1 == x2) {
                theMin = Math.min(...values);
                minIndex = values.indexOf(theMin);
            }
        }
    }
}

function blankIt(mode) {
    let storeMode = mode;
    // first, erase any values in the fields because something may be changing
    for (let indexRow = 1; indexRow <= 5; indexRow++) {
        for (let indexCol = 1; indexCol <= 6; indexCol++) {

            if (indexRow == 1 && mode == 2) {
                if (indexCol < 3) {
                    document.getElementById("newDistEnable" + indexCol).checked = true;
                } else {
                    document.getElementById("newDistEnable" + indexCol).checked = false;
                }
            }

            document.getElementById("newDistOp" + indexRow + indexCol).value = "";
            if (mode > 1) {
                document.getElementById("newDistIn" + indexCol).value = "";
            }
        }
        mode = 1;
    }

    // If this is a full reset, put the cursor in the first field and get ready for values.
    if (storeMode > 1) {
        document.getElementById("newDistIn1").focus();
        document.getElementById("newDistIn1").select();
    }
}

function toggleContainerLock(lockStatusCall) {
    lockStatus = !lockStatus;
    let x = document.getElementById("lockToggle")
    let scaleReadG, scaleReadO, contentsLabelG, contentsLabelO;

    if (lockStatus) {
        x.classList.remove("bi-unlock-fill");
        x.classList.add("bi-lock-fill");

        contentsLabelO = "Target Weight (Oz):";
        contentsLabelG = "Target Weight (g):";

        scaleReadG = "Scale Should Read (g):";
        scaleReadO = "Scale Should Read (Oz):";

    } else {
        x.classList.remove("bi-lock-fill");
        x.classList.add("bi-unlock-fill");

        contentsLabelO = "Contents' Weight (Oz):";
        contentsLabelG = "Contents' Weight (g):";

        scaleReadG = "Scale Reading (g):";
        scaleReadO = "Scale Reading (Oz):";
    }

    document.getElementById("ScaleReadLabelG").innerText = scaleReadG;
    document.getElementById("ScaleReadLabelO").innerText = scaleReadO;

    document.getElementById("contentsLabelG").innerText = contentsLabelG;
    document.getElementById("contentsLabelO").innerText = contentsLabelO;
}

function cakeulateAll(mode) {

    var recipeDiameter = 0,
        recipeVolume = 0,
        recipeDepth = 0;

    let pi = Math.PI;
    recipeVolume = Number(document.getElementById("rVolume").value);
    recipeDepth = Number(document.getElementById("rDepth").value);
    recipeDiameter = Number(document.getElementById("rPanDiameter").value);

    // This assumes that the recipe pan recommendation is "fixed" and that the goal is to adjust
    // the other values accordingly
    if (mode == "rdi" || mode == "rdp") {
        // calculate volume
        let radius = recipeDiameter / 2;
        recipeVolume = pi * Math.pow(radius, 2) * recipeDepth;
        document.getElementById("rVolume").value = recipeVolume.toFixed(2);
    }

    if (mode == "rv") {
        // calculate depth
        let radius = recipeDiameter / 2;
        recipeDepth = recipeVolume / (pi * Math.pow(radius, 2));
        document.getElementById("rDepth").value = recipeDepth.toFixed(2);
    }

    // Let's get the difference in volume by grabbing the available pan diameter and depth and calculating the volume, then subtracting the recipe volume from it to get the difference.
    let availDiameter = Number(document.getElementById("aPanDiameter").value);
    let availRadius = availDiameter / 2;
    let availVolume = pi * Math.pow(availRadius, 2) * recipeDepth;

    document.getElementById("newVol").value = availVolume.toFixed(2);

    let volumeDiff = (availVolume / recipeVolume) * 100;
    document.getElementById("scaleItBy").value = volumeDiff.toFixed(2) + "%";

    // Render the (literal) pie charts

    const maxPan = 100; // This is the diameter of the largest pan that the portionator can render. It's used to set the scale of the pie charts so that they are accurate relative to each other.

    // Scale factor so largest becomes maxSize
    const scaleFactor = maxPan / Math.max(recipeDiameter, availDiameter);

    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    // ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    let center1 = (600 / 6) * 1.5;
    let center2 = (600 / 6) * 4.5;

    ctx.arc(center1, 100, recipeDiameter * scaleFactor, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(155, 181, 191)";
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center2, 100, availDiameter * scaleFactor, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(155, 181, 191)";
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.stroke();
}


function changePortWeight() {
    console.log("Port weight changed");
    document.getElementById("differenceG").value = Number(document.getElementById("amount").value);
    difWeight('g', true)
}
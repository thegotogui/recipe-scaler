//  5 All-Clad - LTD Sauce Pan          (1.377 l full)
//  7 All-Clad - Stock Pot              (5.100 l full)
//  9 Calphalon Pot w glass lid         (1.618 l top rivets)   130w x 79d

// *            0     2Tcop    3Shal    4Deep    5SmDeep    6LTD      7BIGCop    8Stok      9CStok    10Calp     11
// diameters = [0,    11,      14.9,    14.8,     15,       15.875,    20.4,      20.754,    20.754,    17.47,   17.5],
// depths =    [0,     5.5,     3,       7,        7.4,      5,        10,        14,        14,         6.75,    8],
// capacity =  [0,   522.68,  500,    1200,     1500,     1377,      3268,      5074,      5074,      1618,    1618],
// cWidths =   [0,    60,      66,      80,       70,      130,       140,       155,       155,       130,     175],
// cHeights =  [0,    60,      60,      80,      110,       90,       115,       185,       185,        90,      90],

// * These values are for testing
// capacity = [0, 45, 617, 1183, 1750, 2317, 2883, 3450, 4017, 4583, 5100],
//  cWidths = [0, 45, 57, 69, 82, 94, 106, 118, 131, 143, 200],
// cHeights = [0, 25, 45, 65, 80, 100, 125, 145, 160, 180, 200],

console.log(`Version 04-01-25 - Tuned the preset for the All-Clad Stockpot.`);
console.log(`Version 17-03-25 - Added volume input (that I think I added before) and all of the reciprocol stuff that goes with it and it all works because I write great code now.`);
console.log(`Version 01-03-25 - Added version declaration`);


var potDiameter, potInput, volume, measurement, chosen, disVolume,
    thePans = [
        { pan: "ScanPan S02 SM", diameters: 14, depth: 7, capacity: 1000, cWidth: 66, cHeights: 80 },
        { pan: "ScanPan T02 MD", diameters: 16, depth: 8.5, capacity: 1700, cWidth: 130, cHeights: 90 },
        { pan: "Deeper All-Clad", diameters: 14.9, depth: 3, capacity: 500, cWidth: 66, cHeights: 60 },
        { pan: "All-Clad LTD", diameters: 15.9, depth: 5, capacity: 1377, cWidth: 130, cHeights: 90 },
        { pan: "Rando Pot 1000", diameters: 15.875, depth: 5, capacity: 1377, cWidth: 130, cHeights: 90 },
        { pan: "All-Clad Stockpot", diameters: 20.8816, depth: 14.6, capacity: 5074, cWidth: 155, cHeights: 185 },
        { pan: "Calphalon Pot", diameters: 17.47, depth: 6.75, capacity: 1618, cWidth: 130, cHeights: 90 }
    ],


    diameters = [0, 11, 14.9, 14.05, 15, 15.875, 20.8816, 20.754, 20.8816, 17.47, 17.5],
    depths = [0, 4, 5.5, 7, 7, 7.4, 10, 14.6, 14.6, 9.75, 8],
    cWidths = [0, 45, 60, 66, 80, 70, 130, 140, 155, 155, 130, 180],
    cHeights = [0, 60, 60, 80, 110, 90, 115, 185, 185, 90, 80],
    capacity = [0, 522.68, 500, 1200, 1500, 1377, 3268, 5074, 5074, 2348, 2348],
    tspRef = 5.4,         //   Standard measurement for weight of a teaspoon
    tBspRef = tspRef * 3, // Standard measurement for a tablespoon
    tBspVal,
    tspVal,
    scaler = 12,
    potdepth,
    actRadius,
    potChosen,
    depthsChosen,
    capacityChosen,
    saltAmt = [.004, .005, .0075, .01, .015, .02, .025, .03, .035],
    selectors = ["#pointfour", "#pointfive", "#pointsevenfive", "#oneper", "#onefiveper", "#twoper", "#twofiveper", "#threeper", "#threefiveper"],
    tspSelectors = ["#pointfourTsp", "#pointfiveTsp", "#pointsevenfiveTsp", "#oneperTsp", "#onefiveperTsp", "#twoperTsp", "#twofiveperTsp", "#threeperTsp", "#threefiveperTsp"],
    tbspSelectors = ["#pointfourTbsp", "#pointfiveTbsp", "#pointsevenfiveTbsp", "#oneperTbsp", "#onefiveperTbsp", "#twoperTbsp", "#twofiveperTbsp", "#threeperTbsp", "#threefiveperTbsp"],
    potDiags = ['M198.6,28.78v114.46c0,6.6-5.4,12-12,12H42.07c-6.6,0-12-5.4-12-12 V 28.78" />', // Talenti
        'M 200 30 v 115 c 0 6.6 -5.4 12 -12 12 h 40 c -6.6 0 -12 -5.4 -12 -12 v 30" />', //        Talenti
        'M 170 29 v 69 c 0 6.6 -5.4 12 -12 11 h -75 c -6.6 0 -12 -5.4 -12 -12 V 28.78" />', //     Tiny copr
        'M 170 29 v 58 c 0 6.6 -5.4 12 -12 11 h -59 c -6.6 0 -12 -5.4 -12 -12 V 28.78" />', //     Shallow Sauce
        'M 170 29 V 65 C 170 71.6 165 76 158 76 H 102 C 95.4 76 90 70.6 90 64 V 28.78" />', //     Deeper Sauce
        'M 170 33 v 24 c 0 6.6 -5 11 -12 11 h -56 c -6.6 0 -12 -5.4 -12 -12 V 30" />', //          Deep Copr
        'M 170 29 v 24 c 0 6.6 -5 11 -12 11 h -36 c -6.6 0 -12 -5.4 -12 -12 V 28.78" />', //       LTD
        'M 198.6,28.78v114.46c0,6.6-5.4,12-12,12H42.07c-6.6,0-12-5.4-12-12V28.78" />', //          Big Copr
        'M 170 29 v 24 c 0 6.6 -5 11 -12 11 h -36 c -6.6 0 -12 -5.4 -12 -12 V 28.78" />' //        Stockpot
    ],
    tbspLabel = "Tbsp",
    tspLabel = "tsp";


function initializeNaCl() {

    let panListing = `<option value="0">Custom Diameter</option>\n`;

    for (let index = 0; index < thePans.length; index++) {
        panListing += `<option>${thePans[index].pan}</option>\n`;
        console.log(`Pan listing: ${panListing}`);
    }
    document.getElementById("pots").innerHTML = panListing;
    changePot();
}


function changePot() {
    let pot = document.getElementById("pots");
    potChosen = pot.options[pot.selectedIndex].index;

    depthsChosen = depths[potChosen]
    setFieldVal("depthInput", depthsChosen);

    capacityChosen = capacity[potChosen];

    potDiameter = diameters[potChosen];
    setFieldVal("diameterInput", potDiameter);

    calculateBoth();
}

function customDiam() {
    document.querySelector("#pots").selectedIndex = 0;
    calculateBoth();
}

function calculateBoth(which) {

    // First, make sure that the depth is not greater than the pot can actually hold. If it is, force it to the max.
    potdepth = Number(getFieldVal("depthInput"));
    if (potdepth > depths[potChosen]) {
        // document.getElementById("depthInput").value = depths[potChosen];
    }

    potDiameter = getFieldVal("diameterInput");
    actRadius = potDiameter / 2;

    volume = Math.PI * (Math.pow(actRadius, 2)) * potdepth;
    if (which == 1) {
        volume = Number(document.getElementById("theVolume").value);
        document.getElementById("diameterInput").value = "";
        document.getElementById("depthInput").value = "";

    } else {
        document.getElementById("theVolume").value = volume.toFixed(2);
    }

    if (volume < 1000) {
        measurement = "ml";
        disVolume = volume.toFixed(1);
    } else {
        measurement = "l";
        disVolume = Number(volume / 1000).toFixed(2);
    };

    document.getElementById("vol").innerHTML = `${disVolume}${measurement}, ${Number(volume / 28.35).toFixed(0)} oz.`;
    updateIt();
}

//* This is purely an update to the display of the current values calculated
function updateIt() {

    for (let index = 0; index < saltAmt.length; index++) {


        let temp = volume * saltAmt[index];
        // let digits = 0;
        let digits = 3;

        if (temp > 20) {
            digits = 0;
        }
        if (temp < 20) {
            digits = 1;
        }
        if (temp < 10) {
            digits = 2;
        }

        document.querySelector(selectors[index]).innerText = `${temp.toFixed(digits)}g`;

        tBspVal = Math.trunc(temp / tBspRef);
        tspVal = (temp % tBspRef) / tspRef;
        dispTspVal = tspVal.toFixed(0);
        if (dispTspVal >= 3) {
            tBspVal += 1;
            dispTspVal = 0;
        }

        // Chooses whether or not to display just value (9) or value + label (9 Tbsp). Make blank to remove label
        document.querySelector(tspSelectors[index]).innerText = ``;
        let nudgeLabel = "";
        let roughTotal = tBspVal * tBspRef + (dispTspVal * tspRef);


        //* Since the amounts are always slightly off, these indicators will suggest whether to "go high" or "go low" when scooping.

        if (temp.toFixed(1) > roughTotal.toFixed(1)) {
            nudgeLabel = "⟩"; // That's a greater-than symbol
        }

        if (temp.toFixed(1) < roughTotal.toFixed(1)) {
            nudgeLabel = "⟨"; // That's a less-than symbol
        }

        if (temp.toFixed(0) == roughTotal.toFixed(0)) {
            nudgeLabel += "=";
        } else {
            nudgeLabel += " ";
        }

        document.querySelector(tspSelectors[index]).innerText = nudgeLabel;

        // If there are any Tbsps included, add them to the field along with a label
        if (tBspVal > 0) {
            document.querySelector(tspSelectors[index]).innerText += ` ${tBspVal} ${tbspLabel}`;
        }

        // If there are any Tbsps included AND there are Tsps, add a comma to make it nice nice
        if (tBspVal > 0 && dispTspVal > 0) {
            document.querySelector(tspSelectors[index]).innerText += ` +`;
        }

        // If there are tsps, display the value. Otherwise, blank it out
        if (dispTspVal > 0) {
            document.querySelector(tspSelectors[index]).innerText += ` ${dispTspVal} ${tspLabel}`;
        }
        drawPot();
    }
}

function drawPot() {
    let halfPoint = 110,
        tempHeight = (cHeights[potChosen] * .68),
        topValue = 110 - tempHeight,
        waterTopValue = 110 - (tempHeight * ((volume / capacity[potChosen])) * .90);

    let theWidth = (diameters[potChosen] * 5.714),
        rightValue = halfPoint + (theWidth / 2),
        potBottom = -1 * (theWidth - 20);

    let theContainerSvg = `M ${rightValue.toFixed(0)} ${topValue.toFixed(0)} V 100 c 0 7 -3 10 -10 10 h ${potBottom.toFixed(0)} c -7 0 -10 -3 -10 -10 V ${topValue.toFixed(0)}`,
        theWaterSvg = `M ${rightValue.toFixed(0)} ${waterTopValue} V 100 c 0 7 -3 10 -10 10 h ${potBottom.toFixed(0)} c -7 0 -10 -3 -10 -10 V ${waterTopValue.toFixed(0)}`;
    document.getElementById("theContainer").setAttribute('d', theContainerSvg);
    document.getElementById("theWater").setAttribute('d', theWaterSvg);
}

// * Set a field value based on a field name and a, well, value
function setFieldVal(field, value) {
    let temp = document.getElementById(field);
    temp.value = value;
}

// * Get a field value based on a name
function getFieldVal(field) {
    return document.getElementById(field).value;
}
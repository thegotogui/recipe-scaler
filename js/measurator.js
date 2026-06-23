// 23 - 04 - 27 6:45

var measures = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  weightsWet = [3785.4118, 946.35295, 473.176475, 236.8, 118.4, 78.9333333, 59.2, 15, 5, 2.5, 1.25],
  weightsSalt = [2649.78824, 662.44706, 331.22353, 165.611765, 82.8058825, 41.4, 30, 10, 3, 1.5, .6125],
  weightsFlour = [1920, 480, 240, 120, 60, 40, 30, 7.5, 2.5, 1.25, .6125],
  fields = [
    "gals",
    "quarts",
    "pints",
    "cups",
    "hcups",
    "tcups",
    "qcups",
    "tbsp",
    "tsp",
    "htsp",
    "qtsp"
  ],
  lfields = [
    "lgals",
    "lquarts",
    "lpints",
    "lcups",
    "lhcups",
    "ltcups",
    "lqcups",
    "ltbsp",
    "ltsp",
    "lhtsp",
    "lqtsp"
  ],
  icons = [
    "./portionator/assets/img/gallon.svg",
    "./portionator/assets/img/quart.svg",
    "./portionator/assets/img/pint.svg",
    "./portionator/assets/img/cup.svg",
    "./portionator/assets/img/hcup.svg",
    "./portionator/assets/img/tcup.svg",
    "./portionator/assets/img/qcup.svg",
    "./portionator/assets/img/tbsp.svg",
    "./portionator/assets/img/tsp.svg"
  ],
  wetordry,
  gweight;

const element = document.getElementById("resetThis");
element.addEventListener("click", function () {
  document.getElementById("inGrams").value = 0;
  getWeight(2);
  console.log(`RESET!`);
});



// Main calculation function
function getWeight(which) {
  // First, go find out if we're dealing with WET ingredients or DRY ones
  wetordryCheck();
  console.log(`HEY: ${which}`);
  // The "which" specifies whether the GRAMS field or the OUNCES field is being populated and it should calculate accordingly
  // Once the value is read, the OTHER field is then populated with the equivalent value
  if (which == 1) {
    gweight = document.getElementById("inGrams").value;
    document.getElementById("inOunces").value = Number(gweight / 28.6).toFixed(2);
  }

  if (which == 2) {
    gweight = document.getElementById("inOunces").value * 28.6;
    document.getElementById("inGrams").value = gweight.toFixed(2);
  }

  if (which == 3) {
    var temp = document.getElementById("inPounds").value;

    temp = temp * 16;
    document.getElementById("inOunces").value = temp.toFixed(2);

    temp = temp * 28.6;
    gweight = temp;
    document.getElementById("inGrams").value = gweight.toFixed(2);
  }

  // Now, we step through each of the container sizes and determine an appropriate amount for each of them
  // The measures, various weight values, and icons are stored in arrays and the index simply feeds the active one.

  // Todo Fix line 83 so that it matches the scaler value


  for (let index = 0; index < measures.length; index++) {
    imgIndex = index + 10;
    // Determine the scale to use based on the button pressed
    if (wetordry == 1) {
      measures[index] = Math.trunc(gweight / weightsWet[index]);
    }

    if (wetordry == 2) {
      measures[index] = Math.trunc(gweight / weightsSalt[index]);
    }

    if (wetordry == 3) {
      measures[index] = Math.trunc(gweight / weightsFlour[index]);
    }

    updateContainers(index);

    // With the whole values captured, the modulo (remainder) goes back into gweight for the next go around.
    gweight = gweight % weightsWet[index];

    // Populate the respective container fields.
    if (measures[index] > 0) {

      console.log(`fields[index]: ${fields[index]}`);
      document.getElementById(fields[index]).value = measures[index];
      // console.log(`measures: ${measures[index]}`);
      // console.log(`measures: ${lfields[index]}`);
      // document.getElementById(lfields[index]).style.color = "rgb(255, 255, 255)";
      document.getElementById(fields[index]).style.color = "rgb(255, 255, 255)";

    } else {
      console.log(`fields[index]: ${fields[index]}`);

      document.getElementById(fields[index]).value = "";
      // document.getElementById(lfields[index]).style.color = "rgb(80, 80, 80)";
      document.getElementById(fields[index]).style.color = "rgb(255, 255, 255)";

    }
  }

  // Next, grab the remainder, whittle it down to two decimal places, and put it in the remainder text field
  var x = gweight.toFixed(2);
  document.getElementById("remainder").value = x;
}

// Determines if the current container size is being used and, if so, shows that icon.
function updateContainers(index) {
  // If the container is being used, turn on the icon. Otherwise, set it to blank.
  // if (measures[index] > 0) {
  //   document.getElementsByTagName("img")[index + 9].src = icons[index];
  // } else {
  //   document.getElementsByTagName("img")[index + 9].src =
  //     "./portionator/assets/img/blank.svg";
  // }
}

// This function handles when the amounts are entered into the respective container fields and will calculate the total weight

function getScoops() {
  // First, see if we're dealing with wet or dry ingredints here Wade.
  wetordryCheck();

  // Next, blank out the Remainder field since there cannot be a remainder if we're entering weights manually
  document.getElementById("remainder").value = 0;

  var total = 0;
  for (let index = 0; index < fields.length; index++) {
    updateContainers(index);
    if (wetordry == 1) {
      measures[index] = Number(
        weightsWet[index] * document.getElementById(fields[index]).value
      ).toFixed(2);
    } else {
      measures[index] = Number(
        weightsDry[index] * document.getElementById(fields[index]).value
      ).toFixed(2);
    }
    // Now, add this value to the total weight
    total += Number(measures[index]);

    // Update the current measure changed to reflect the current value
    updateContainers(index);
  }
  console.log(total);
  temp = total.toFixed(2);
  document.getElementById("inGrams").value = temp;
}

function wetordryCheck() {
  // Next, we check to see whether we are weighing WET ingredients (liquid) or DRY ingredients
  // The wetordry variable is set accordingly.

  if (document.getElementById("wetRadio").checked) {
    wetordry = 1;
  }
  if (document.getElementById("saltRadio").checked) {
    wetordry = 2;
  }
  if (document.getElementById("sugarRadio").checked) {
    wetordry = 3;
  }
}

function allIcons(params) {
  for (let index = 0; index < measures.length; index++) {
    document.getElementsByTagName("img")[index + 10].src = icons[index];
  }
}


function initialize() {
}





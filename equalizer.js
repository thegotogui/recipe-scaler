var theValues,
    grandTotal = 0,
    deltas = [],
    miniTemp,
    maxTemp,
    minTemp;
// theValues = [60, 60, 70, 80, 90, 110, 110, 120, 130, 180];

// theValues = [110, 60, 70, 80, 90, 110, 60, 120, 120, 180];
// theValues = [60, 60, 70, 80, 100, 110, 80, 130, 130, 180];
// theValues = [180, 60, 70, 80, 90, 110, 110, 120, 120, 60];
// theValues = [60, 60, 110, 80, 90, 110, 70, 120, 120, 180];
theValues = [39, 35, 19, 58, 37, 97];

// for (rando = 0; rando < 10; rando++) {
// 	theValues[rando] = Number((Math.random() * 100).toFixed(0));
// }

console.clear();
console.log(theValues);

function getSum(item) {
    grandTotal += item;
}

theValues.forEach(getSum);
theValues.sort(function (a, b) {
    return a - b;
});
// theValues.reverse;

let theAverage = (grandTotal / theValues.length).toFixed(0);

document.getElementById("display").innerHTML =
    "<B>Containers:</b>   " + theValues.length + "<br>";
document.getElementById("display").innerHTML +=
    "<B>The Total:</b>    " + grandTotal + "<br>";
document.getElementById("display").innerHTML +=
    "<B>The Average:</b> " + theAverage + "<br>";
document.getElementById("display").innerHTML +=
    "<B>The Values:</b>  " + theValues + "<br>";
document.getElementById("display2").innerHTML = "";
document.getElementById("display2").innerHTML = theValues + "<br>";

// This is the OVERALL loop process
for (iteration = 0; iteration < theValues.length; iteration++) {
    // This is a quixk "Grab the aboves and belows" process
    // This happens EACh time and before an averaging takes place
    deltas = [];
    for (temp = 0; temp < theValues.length; temp++) {
        deltas[temp] = theValues[temp] - theAverage;
    }
    document.getElementById(
        "display"
    ).innerHTML += `<br><span style="font-weight: bold; color: red;"> Deltas!</span> ${deltas}<br>`;

    for (outerLoop = 0; outerLoop < theValues.length; outerLoop++) {
        for (innerLoop = 0; innerLoop < theValues.length - 1; innerLoop++) {
            if (deltas[iteration] == deltas[innerLoop] * -1 && deltas[iteration] != 0) {
                document.getElementById(
                    "display"
                ).innerHTML += `<br><span style="font-weight: bold; color: red;"> Numberwang!</span> ${deltas[iteration]}, ${iteration} : ${deltas[innerLoop]}, ${innerLoop}<br>${theValues}<br>`;
                document.getElementById(
                    "display"
                ).innerHTML += `<br><span style="font-weight: bold; color: red;"> Deltas!</span> ${deltas}<br>`;

                miniTemp = Math.abs(deltas[iteration]);
                if (deltas[iteration] > deltas[innerLoop]) {
                    maxTemp = iteration + 1;
                    minTemp = innerLoop + 1;
                } else {
                    maxTemp = innerLoop + 1;
                    minTemp = iteration + 1;
                }

                document.getElementById(
                    "display2"
                ).innerHTML += `<br>${iteration}<span style="font-weight: bold; color: red;"> Move</span> ${miniTemp} from ${maxTemp} ==> ${minTemp} WANG!`;

                theValues[iteration] -= deltas[iteration];
                theValues[innerLoop] -= deltas[innerLoop];
                deltas[innerLoop] = 0;
                deltas[iteration] = 0;
                document.getElementById(
                    "display"
                ).innerHTML += `<B>Iteration Loops: <br>&nbsp;Outer Loop:</br> ${outerLoop}<br>&nbsp;<B>Temp Loop:</b> ${innerLoop}<br>&nbsp;<B>The Values:</b> ${theValues}<br><B>&nbsp;The Deltas:</b> ${deltas}<br><br>`;
            }
        }
    }
    // Get max and min values
    let theMax = Math.max(...theValues);
    let theMin = Math.min(...theValues);

    // get the index of the max and min positions
    let maxIndex = theValues.indexOf(theMax);
    let minIndex = theValues.indexOf(theMin);

    let maxDiff = theValues[maxIndex] - theAverage;
    let minDiff = theAverage - theValues[minIndex];
    tempOffset = Math.min(maxDiff, minDiff);
    if (tempOffset != 0) {
        // Move that smaller amount
        theValues[maxIndex] -= tempOffset;
        theValues[minIndex] += tempOffset;
        maxIndex += 1;
        minIndex += 1;
        document.getElementById(
            "display2"
        ).innerHTML += `<br><br><br>${iteration} Move ${tempOffset} from ${maxIndex} ==> ${minIndex}<br>`;

        for (x = 0; x <= theValues.length - 1; x++) {
            let spacer = "*  ";
            let digits = theValues[x].toString();
            document.getElementById("display2").innerHTML += spacer.slice(
                0,
                3 - digits.length
            );
            if (x == maxIndex - 1) {
                document.getElementById(
                    "display2"
                ).innerHTML += `<span style="color: red;">${theValues[x]}</span>`;
            } else if (x == minIndex - 1) {
                document.getElementById(
                    "display2"
                ).innerHTML += `<span style="color: green;">${theValues[x]}</span>`;
            } else {
                document.getElementById(
                    "display2"
                ).innerHTML += `<span style="color: white;">${theValues[x]}</span>`;
            }

            // document.getElementById("display2").innerHTML += theValues[x] + "</span>";
            if (x < theValues.length - 1) {
                document.getElementById("display2").innerHTML += ", ";
            }
        }
        // document.getElementById("display2").innerHTML += theValues + "<br>";
    }
}
document.getElementById("display").innerHTML += `Deltas ${deltas}<br>`;
document.getElementById("display2").innerHTML +=
    "<br>_______________________________________________<br>";
document.getElementById("display2").innerHTML += theValues;

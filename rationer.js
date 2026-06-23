console.log(`Version 11-03-25 - added versionin declaration`);

var values = [],
    outVals = [],
    inVals = [],
    ratios,
    grandTotal,
    newVolume,
    startVal,
    portions,
    percentages = [],
    scale = false,
    xyz = [];

// The idea of this thing is to do "odd" portioning.
// Let's say you have an amount of 100g. You want to give 2 parts to one person and one part to another. This would result in one person getting 66.66g and the other
// getting 33.33. Or you could do 5:4:6; person 1 would get 33g, person 2 would get 26.6g, and person 3 would get 40g.



function calculate() {

    // Determine if we are scaling by fixed total or fixed portions
    scale = document.getElementById("fixedRadio").checked;

    // Load the field values into an array
    startVal = Number(document.getElementById("inval").value);
    let bgColor, fgColor = "";
    // If scaling the total is turned OFF, make the output match the input
    if (scale) {
        document.getElementById("newVal").value = "";
        bgColor = "#45545dee";
        fgColor = "grey";
    } else {
        bgColor = "#5190b7ee";
        fgColor = "white";
        document.getElementById("newVal").value = startVal.toFixed(2);
    }

    document.getElementById("newAmt1").style.backgroundColor = bgColor;
    document.getElementById("newAmt1").style.color = fgColor;
    document.getElementById("newAmt2").style.backgroundColor = bgColor;
    document.getElementById("newAmt2").style.color = fgColor;

    portions = Number(document.getElementById("portions").value);
    loadVals();


    // Now, let's work some magic
    let display;
    xyz = [];
    for (let index = 1; index <= 6; index++) {
        if (index <= portions) {
            display = "";
            document.getElementById(`bar${index}`).style.display = "";
        } else {
            display = "none";
            document.getElementById(`bar${index}`).style.display = "none";
        }
        // console.log(`display: ${index} ${display}`);
        let x = document.getElementsByClassName("col" + index);
        for (let index2 = 0; index2 < x.length; index2++) {
            x[index2].style.display = display;
        }
    }
    for (let index = 0; index < 6; index++) {
        // let temp = document.getElementById(`inp${index + 1}`).value;
        let temp = values[index];
        let percentage = temp / grandTotal;
        let outputVal = percentage * startVal;

        // console.log(`outputVal: ${outputVal}`);
        if (outputVal > 0 && outputVal != NaN) {
            // document.getElementById(`pct${index + 1}`).value = (percentage * 100).toFixed(2);
            document.getElementById(`out${index + 1}`).value = outputVal.toFixed(2);
            percentage *= 100;

            // * Update the bar chart
            document.getElementById(`pct${index + 1}`).value = percentage.toFixed(2);  // Percentage fields
            console.log(`percentage: ${percentage}`);
            document.getElementById(`bar${index + 1}`).style.width = `${percentage}%`; // Bar widths

            if (scale) {
                document.getElementById(`pvalue${index + 1}`).innerText = `${percentage.toFixed(0)}%`; // Bar percentage text
            } else {
                document.getElementById(`pvalue${index + 1}`).innerText = `%`; // Bar percentage text
                document.getElementById(`bar${index + 1}`).style.width = `${1 / portions * 100}%`; // Bar widths
            }

        } else {
            // document.getElementById(`pct${index + 1}`).value = "";
            document.getElementById(`out${index + 1}`).value = "";
        }
    }
}


function updateTotal(which) {

    let totalPercent = 0;
    for (let index = 1; index <= portions; index++) {
        let temp = Number(document.getElementById(`pct` + index).value);
        totalPercent += temp;
    }
    newVolume = (totalPercent / 100) * startVal;

    for (let index = 1; index <= portions; index++) {
        let temp = (Number(document.getElementById(`pct` + index).value) / 100) * newVolume;
        document.getElementById(`out` + index).value = temp.toFixed(2);
    }

    document.getElementById(`newVal`).value = newVolume.toFixed(2);
    startVal = Number(document.getElementById("inval").value);
    let delta = newVolume - startVal;
    document.getElementById(`delta`).value = delta.toFixed(2);

    return
    // percentages = [];
    // for (let index = 1; index <= portions; index++) {

    //     percentages[index - 1] = document.getElementById(`pct` + index).value;
    //     document.getElementById(`inp` + index).value = percentages[index - 1];
    // }
    // calculate();
}


// * When a percentage field is changed, adjust the other percentages accordingly
function changePercent(which) {

    scale = document.getElementById("fixedRadio").checked;
    if (scale) {
        updatePercent(which);
    } else {
        updateTotal(which);
    }
    // * Update the bar chart
    for (let index = 0; index < 6; index++) {
        let temp = document.getElementById(`pct${index + 1}`).value;         // Percentage values
        document.getElementById(`bar${index + 1}`).style.width = `${temp}%`; // Bar widths
    }
}

function updatePercent(which) {
    let newPercent = Number(document.getElementById(`pct` + which).value);
    document.getElementById(`newVal`).value = startVal;


    let totalPercent = 0;
    for (let index = 1; index <= portions; index++) {
        if (index != which) {
            let temp = Number(document.getElementById(`pct` + index).value);
            totalPercent += temp;
        }
    }

    for (let index = 1; index <= portions; index++) {
        if (index != which) {
            let temp = (Number(document.getElementById(`pct` + index).value) / totalPercent) * (100 - newPercent);
            document.getElementById(`pct` + index).value = temp.toFixed(2);
        }
    }

    percentages = [];
    for (let index = 1; index <= portions; index++) {
        percentages[index - 1] = document.getElementById(`pct` + index).value;
        document.getElementById(`inp` + index).value = percentages[index - 1];
    }
    calculate();
}


function iterateIt(params, index) {
    console.log(`params: ${params}`);
    console.log(`index: ${index}`);
}

function loadVals() {
    grandTotal = 0;
    values = [];
    portions = Number(document.getElementById("portions").value);
    for (let index = 1; index <= portions; index++) {
        let temp = Number(document.getElementById(`inp` + index).value);
        if (temp > 1) {
        } else {
            document.getElementById(`inp` + index).value = 1;
        }
        // Grab the values into an array
        values[index - 1] = temp;
        // Grab the percentages too
        percentages[index - 1] = document.getElementById(`pct` + index).value;
        // And sum up the grand total
        grandTotal += values[index - 1];
    }
    // console.log(`values: ${values}\n`);
}
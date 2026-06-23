var values = [91, 20, 30, 71, 50, 60],
    theMax,
    theMin,
    maxIndex,
    minIndex,
    testTotal,
    testAverage,
    theHigh,
    theLow,
    theAverage,
    theHighIndex,
    theLowIndex;

newDist();



function checkMatch() {
    // for (let z = 0; z < 100; z++) {
    testTotal = 0;
    // for (q = 0; q <= 5; q++) {
    // 	values[q] = Number((Math.random() * 100 + 1).toFixed(0));
    // 	testTotal += values[q];
    // }
    // console.log(values);

    testAverage = Number((testTotal / 6).toFixed(0));
    document.getElementById(
        "theText"
    ).innerHTML += `<br>--------------------------------------------<br>`;

    for (l = 0; l <= 4; l++) {
        for (m = 1; m <= 5; m++) {
            if (values[l] > values[m]) {
                theHigh = values[l];
                theLow = values[m];
                theHighIndex = l;
                theLowIndex = m;
            } else {
                theLow = values[l];
                theHigh = values[m];
                theHighIndex = m;
                theLowIndex = l;
            }

            if ((theHigh - testAverage) - (testAverage - theLow) == 0) {
                console.log(theHigh, testAverage, theLow);
                let offset = theHigh - testAverage;
                console.log(values);
                console.log(
                    `HEY Move ${offset} from ${theHighIndex + 1} to ${theLowIndex + 1}`
                );
                console.log(`${theHigh} to ${theLow}`);

                document.getElementById(
                    "theText"
                ).innerHTML += `${values}, average: ${testAverage} <br>`;
                document.getElementById("theText").innerHTML += `HEY Move ${offset} from ${theHighIndex + 1
                    } to ${theLowIndex + 1}<br>`;
                values[theHighIndex] -= offset;
                values[theLowIndex] += offset;
                document.getElementById(
                    "theText"
                ).innerHTML += `${values}, average: ${testAverage} <br>`;

                newDist();
            }
        }
        console.log("Done!");
    }



    function newDist() {

        console.clear;

        for (let q = 0; q <= 5; q++) {
            values[q] = Number((Math.random() * 100 + 1).toFixed(0));
            testTotal += values[q];
        }

        let sum = 0;

        for (let i = 0; i < values.length; i++) {
            sum += values[i];
        }

        var spacers = "      ";

        theAverage = sum / values.length;
        console.clear();
        console.log(`Average: ${theAverage}`);

        theMax = Math.max(...values);
        maxIndex = values.indexOf(theMax);

        theMin = Math.min(...values);
        minIndex = values.indexOf(theMin);

        for (let index = 0; index < values.length; index++) {
            // get the index of the max and min positions

            checkMatch();

            theMax = Math.max(...values);
            maxIndex = values.indexOf(theMax);

            theMin = Math.min(...values);
            minIndex = values.indexOf(theMin);

            let x1 = values[maxIndex].toFixed(2);
            let x2 = theAverage.toFixed(2);
            console.log(`CURRENT valuesMax: ${x1}, theAverage ${theAverage}`);

            if (x1 == x2) {
                theMax = Math.max(...values);
                console.log(`Newthemax: ${theMax}`);
                maxIndex = values.indexOf(theMax);
            }

            theMin = Math.min(...values);
            minIndex = values.indexOf(theMin);

            let theMax2 = theMax.toFixed(2);
            let theMin2 = theMin.toFixed(2);

            document.getElementById(
                "theText"
            ).innerHTML += `theMax ${theMax2}, theMin ${theMin2}, minIndex ${minIndex}, maxIndex = ${maxIndex}<br><br>`;

            console.log(
                `theMax ${theMax}, theMin ${theMin}, minIndex ${minIndex}, maxIndex = ${maxIndex}`
            );

            if (values[maxIndex] - theAverage >= theAverage - values[minIndex]) {
                var tempOffset = theAverage - values[minIndex];
                values[maxIndex] -= tempOffset;
                values[minIndex] += tempOffset;
            } else {
                var tempOffset = values[maxIndex] - theAverage;
                values[minIndex] += tempOffset;
                values[maxIndex] -= tempOffset;
            }
            var offsetIndex = index + 1;
            var offsetMaxIndex = maxIndex + 1;
            var offsetMinIndex = minIndex + 1;

            document.getElementById("theText").innerHTML += `${spacers.substring(
                0,
                spacers.length - tempOffset.toFixed(2).length
            )}${tempOffset.toFixed(2)} | ${offsetMaxIndex} --> ${offsetMinIndex}<br>`;


            for (let x = 0; x <= 5; x++) {
                let temp = values[x];
                console.log(temp);
                temp = temp.toFixed(0);
                document.getElementById("theText").innerHTML += `${temp} `;
            }
            document.getElementById("theText").innerHTML += `<br>`;
        }

        // ----------------------------
        // 	if (theMax - theAverage >= theAverage - theMin) {
        // 		var tempOffset = theAverage - values[minIndex];
        // 		console.log("Max wins, donate to min");
        // 		values[minIndex] += tempOffset;
        // 		values[maxIndex] -= tempOffset;
        // 	} else {
        // 		console.log("Min wins, donate to max");
        // 		values[minIndex] += theMax - theAverage;
        // 		values[maxIndex] = theAverage;
        // 	}
        // 	console.log(
        // 		`Take ${tempOffset} from container ${maxIndex + 1} and put it in container ${
        // 			minIndex + 1
        // 		}`
        // 	);
        // 	console.log(values);
        // }
    }
}
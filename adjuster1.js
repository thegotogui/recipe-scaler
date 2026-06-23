console.log(`Version 23-11-25 - Delta values were showing difference to original value rather than the previous amount
Version 11-03-25 - added version in declaration`);

var val1A,
    val1B,
    valA,
    valB,
    ratioAB,
    ratioBA,
    arrowLeft,
    arrowRight,
    grabVal,
    colorColumns,
    columnarI,
    columnarO,
    ratDir,
    whichRatio,
    columnLetter,
    notcolumnLetter,
    whichRatio,
    origValue;

// The idea is that you might want to divide a dish in a more complex way than simply equal portions.
// For example, if there are three of you, but one of you eats more than the others, you might want to divide things differently.
// Rather than 3 equal portions, you might divide it into 10 "units", alloting 3 for one, 3 for another, and 4 for the big eater
// Or 11 slices of 3, 3, and 5. The first two get 60% of what the "big eater" gets.
// Or 17 slices of 5, 5, and 7. The first two get 71% of what the "big eater" gets.
// This tool allows for a freeform portioning approach with arbitrary values for division.


function getRatio(column) {

    // First, grab the two starting values
    valA = document.getElementById("startValA").value;
    valB = document.getElementById("startValB").value;

    // fron there, get ratios in both directions (We probably only need to calc one, but while we're at it...)
    ratioAB = valA / valB;
    ratioBA = valB / valA;

    // Then, update the ratio display for both directions on that same row
    let ratString = `${ratioBA.toFixed(2)} <i class="bi bi-arrow-right-circle"></i><br><i class="bi bi-pie-chart-fill"></i><br><i class="bi bi-arrow-left-circle"></i> ${ratioAB.toFixed(2)}`;
    document.getElementById("sRatio").innerHTML = ratString;
}

function applyRatio(row, column) {
    getRatio(column);

    if (column == 1) {
        origValue = valB;
    } else {
        origValue = valA;
    }

    if (column == 1) {
        columnarI = "A";
        columnarO = "B";
        ratDir = ratioBA;
        arrowLeft = ``;
        arrowRight = `<i class="bi bi-arrow-right-circle"></i>`;
        document.getElementById(`r${row}c1`).style.backgroundColor = "#333";
        document.getElementById(`r${row}c2`).style.backgroundColor = "#333";
        document.getElementById(`r${row}c3`).style.backgroundColor = "rgb(63, 126, 169)";
        document.getElementById(`r${row}c4`).style.backgroundColor = "rgb(63, 126, 169)";
    } else {
        columnarI = "B";
        columnarO = "A";
        origValue = valA;
        ratDir = ratioAB;
        arrowLeft = `<i class="bi bi-arrow-left-circle"></i>`;
        arrowRight = ``;
        colorColumns = 2;
        console.log(`row: ${row}`);
        document.getElementById(`r${row}c1`).style.backgroundColor = "rgb(63, 126, 169)";
        document.getElementById(`r${row}c2`).style.backgroundColor = "rgb(63, 126, 169)";
        document.getElementById(`r${row}c3`).style.backgroundColor = "#333";
        document.getElementById(`r${row}c4`).style.backgroundColor = "#333";
    }

    grabVal = Number(document.getElementById(`val${row}${columnarI}`).value);

    let newVal = grabVal * ratDir;
    let preVal = 0;
    if (row > 1) {
        preVal = Number(document.getElementById(`val${row - 1}${columnarO}`).value);
    } else {
        preVal = origValue;
    }
    let newDif = newVal - preVal

    document.getElementById(`val${row}${columnarO}`).value = newVal.toFixed(2);
    document.getElementById(`inc${row}${columnarO}`).value = newDif.toFixed(2);
    document.getElementById(`inc${row}${columnarI}`).value = "";
}
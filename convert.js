const OZ_TO_GRAMS = 28.3495;

function calcG() {
    let x = document.getElementById("arbG").value;
    let conversion = x / OZ_TO_GRAMS;
    putVal("arbOz", conversion);
}

function calcOz() {
    let x = document.getElementById("arbOz").value;
    let conversion = x * OZ_TO_GRAMS;
    putVal("arbG", conversion);
}

function calcF() {
    // (190°F − 32) × 5/9 = 87.778°C
    let x = document.getElementById("tempF").value;
    let conversion = (x - 32) * .5555555555;
    putVal("tempC", conversion);
}

function calcC() {
    // (190°C × 9/5) + 32 = 374°F
    // let x = document.getElementById("tempC").value;
    let x = getVal("tempC");
    let conversion = (x * 1.8) + 32;
    putVal("tempF", conversion);
}

function getVal(param) {
    return document.getElementById(param).value;
}

function putVal(param, theValue) {
    document.getElementById(param).value = theValue.toFixed(1);
}
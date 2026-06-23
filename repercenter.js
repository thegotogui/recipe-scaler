var origVolumeVar,
    oPercent1var,
    oPercent2var,
    oValue1var,
    oValue2var,
    nPercent1var,
    nPercent2var,
    newVolumevar,
    newPort1var,
    newPort2var,
    theNewVolume;

function calculateItAll(fieldName) {
    console.log(`I'm awake!`);

    // First, let's grab what we're working with - all the original values, in other words.

    origVolumeVar = getVals("origVolume");

    //Oh, but if we're adjusting the SECOND percentage field, then do not grab the FIRST field because it will need to be calculated
    //based on the second one.
    oPercent1var = getVals("oPercent1") / 100;
    oPercent2var = getVals("oPercent2") / 100;

    if (fieldName == "p1") {
        console.log(`BOOP1!`);
        oPercent2var = (1 - oPercent1var);
        let outtemp = oPercent2var * 100;
        putVals("oPercent2", outtemp.toFixed(0));
    }
    if (fieldName == "p2") {
        console.log(`BOOP2!`);
        oPercent1var = (1 - oPercent2var);
        let outtemp = oPercent1var * 100;
        putVals("oPercent1", outtemp.toFixed(0));
    }

    oValue1var = oPercent1var * origVolumeVar;
    oValue2var = oPercent2var * origVolumeVar;
    putVals("oValue1", oValue1var.toFixed(2));
    putVals("oValue2", oValue2var.toFixed(2));



    if (fieldName == "np1") {

        nPercent1var = Math.min(Math.max(getVals("nPercent1"), 1), 99);

        nPercent2var = 100 - nPercent1var;
        putVals("nPercent2", nPercent2var);

        theNewVolume = (oValue1var / (nPercent1var / 100)).toFixed(0);
        putVals("newVolume", theNewVolume);

        console.log(`theNewVolume: ${theNewVolume}`);

        newPort1var = oValue1var;
        newPort2var = theNewVolume - newPort1var;
        // newPort2var = theNewVolume - newPort1var - oValue2var;
        putVals("newPort1", oValue1var);
        putVals("newPort2", newPort2var);

        putVals("delta1", "");
        putVals("delta1", oValue1var.toFixed(2));
        putVals("delta2", nPor2tvar - oValue2var);
    }

    if (fieldName == "np2") {

        nPercent2var = Math.min(Math.max(getVals("nPercent1"), 1), 99);

        if (nPercent2var > 99) {
            nPercent2var = 99;
            putVals("nPercent2", nPercent2var);
        }

        if (nPercent2var < 1) {
            nPercent2var = 1;
            putVals("nPercent2", nPercent2var);
        }

        nPercent1var = 100 - nPercent2var;
        putVals("nPercent1", nPercent1var);

        theNewVolume = (oValue2var / (nPercent2var / 100)).toFixed(0);
        putVals("newVolume", theNewVolume);

        console.log(`theNewVolume: ${theNewVolume}`);

        newPort1var = theNewVolume - newPort2var;
        newPort2var = oValue2var;
        // newPort1var = theNewVolume - newPort2var - oValue1var;
        putVals("newPort1", newPort1var);
        putVals("newPort2", oValue2var);

        putVals("delta1", newPort1var - oValue1var);
        // putVals("delta2", oValue2var);
        putVals("delta2", "");
    }
}

function getVals(field) {
    return document.getElementById(field).value;
}

function putVals(fieldName, fieldValue) {
    document.getElementById(fieldName).value = fieldValue;
}
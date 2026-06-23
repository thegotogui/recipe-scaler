//  Regular
// ? This is blue
// ! This is red
// * This is BRIGHT green
// Todo This is orange! 

console.log(`Version 11-05-25 - Categories break up the recipe (if available). Also fixed the issue where the synced value was returned as a string and broke syncing.
Version 17-03-25 - Fixing the white synced label AGAIN and adding the Roma Rice recipe AGAIN.
Version 11-03-25 Recovery from a fuckup in versioning  
Version 01-03-25 - Updated Sourdough Crepe Recipe with a bit more flour for structure and a tad less tartness.
Version 23-02-25 - Changed how neutral ingredients are handled in hydration
Currently, changing a recipe changes the color of ingredients, but recalling from app storage doesn't.
Arrays are not stored the same way so the length gets wonked and, presumably, so does the array itself.`);



var amounts = [],
  bothChecked = false,
  checked1 = 0,
  checked2 = 0,
  combinedRows = 0,
  dimmed = false,   // Holds the current state of the original values column's dimmed status
  dimmedI = false,  // Holds the current state of the Imperial column's dimmed status
  elgin = .105726,  // 
  stubbie = .073127,
  euro = .0428,
  fives = false,
  ingLength,
  ingredient,
  ingredients = [],
  dryWetNull = [],
  multiplier = 1,   // Variable that holds the multiplier
  newScaleVar,      // The desired ratio
  originalScaleVar, // The original ratio of the recipe being calculated
  pairTotal = 0,
  perc = [],        // Percentage of x recip
  percentages = [],
  percString,
  quickSum = 0,
  recip = [],       // Reciprocol
  recipe,
  recipeSteps,
  reciPortions = 0,
  relevantLink = "", // This stores the relevant link for a recipe
  rowCount,         // Which FIELD/Row is being edited
  rowsChecked,
  rs = [],          // "Recipe says" =- Array that holds the quantities
  rsI = [],         // "Recipe says" =- Array that holds Imperial equivalents
  headers = [],          // Defines which rows will have headers and what they'll contain
  synced,
  thisAmount,
  total = 0,        // Holds total of all metric weights
  totalImp = 0,     // Holds total of all imperial weights
  which,
  whichRecipe,
  youWant = [];



//* The startup routine
//* Load the fields with the last values that were in it.
function initializeArray(mode) {


  // * NEW! Set the focus to the list dropdown! What a concept.
  document.getElementById("recipeSelect").focus();

  // If this is the first time the page is opened on a new device and there is no storage flag set, none of the arrays have been put into memory.
  // Set the mode to 1 which will trigger a full reset and create local storage slots.
  if (localStorage.getItem("scinitialized") == null) {
    localStorage.setItem("scinitialized", 1);
    mode = 1;
  }

  recipe = localStorage.getItem("theRecipe");

  // Mode 0 means restore the page from local storage
  if (mode == 0) {
    // If "sync" was checked last time, then update that fact.

    // Since values are stored as strings, 
    let temp = localStorage.getItem("syncVals");
    if (temp == "true") {
      synced = true;
    } else {
      synced = false;
    }

    // Grab Original, Scaled, and Muiltplier values and enter them in the respective fields.
    // Since recall of the multiplier stuff is a one-off, do that outside the loop
    originalScaleVar = Number(localStorage.getItem("originalScale"));
    document.getElementById("originalScale").value = Number.parseFloat(originalScaleVar.toFixed(1));

    newScaleVar = Number(localStorage.getItem("newScale"));
    document.getElementById("newScale").value = Number.parseFloat(newScaleVar);

    multiplier = Number(localStorage.getItem("multiplier"));
    document.getElementById("multiplier").value = Number.parseFloat(multiplier);

    //* Now, loop and do what is appropriate for the various rows

    // First, grab the value that specifices how many ingredients there are and use that as the basis for the loop.
    ingLength = Number(localStorage.getItem("ingLength"));

    for (rowCount = 1; rowCount <= 10; rowCount++) {
      let arrayCount = rowCount - 1;

      // Mode 0 = Go get values from storage and populate the grid
      // Grab ingredient, recipe says, and you want values.
      if (rowCount <= ingLength) {
        ingredients[arrayCount] = localStorage.getItem("scalerIngredient" + arrayCount);
        document.getElementById("ingredient" + rowCount).value = ingredients[arrayCount];

        rs[arrayCount] = Number(localStorage.getItem("recipeSays" + arrayCount));
        document.getElementById("recipeSays" + rowCount).value = Number.parseFloat(rs[arrayCount].toFixed(1));
        document.getElementById("row" + rowCount).style.display = "revert";

        let temp = Number(rs[arrayCount] / 28.3495).toFixed(1);
        document.getElementById("recipeSaysImp" + rowCount).value = parseFloat(temp);

      } else {
        document.getElementById("row" + rowCount).style.display = "none";
      }
    }

    // Do a tally and get the ratios!
    tallyIt();
    updateTotals();

    // Make the background colors reflect sync state.
    colorSyncedFields();

    // This sets the dim color of the columns based on the checkboxes
    masterDimmer('dimImp', 'theBlocksImp');
    masterDimmer('dimMet', 'theBlocksMet');
    masterDimmer('dimScale', 'theBlocksSc');
  }

  //* If mode = 1, there are no local storage values to grab, so go create some!

  if (mode == 1) {
    if (rowCount == 0) {
      var temp = Number(document.getElementById("originalScale").value);
      localStorage.setItem("originalScale", temp);
      var temp = Number(document.getElementById("newScale").value);
      localStorage.setItem("newScale", temp);
    }

    rs[rowCount] = 1;

    document.getElementById("recipeSays" + rowCount).value = 1;
    localStorage.setItem("recipeSays" + rowCount, 1);

    document.getElementById("youWant" + rowCount).value = 1;
    localStorage.setItem("youWant" + rowCount, 1);

    scalerIngredient[rowCount] = "";
    localStorage.setItem("scalerIngredient" + rowCount, "");

    document.getElementById("ingredient" + rowCount).value = "None! It's a reset";
    localStorage.setItem("syncVals", "false");
  }

  // Depending on the mode,
  // Once we're Out of the Loop, write the multiplier, original scalevalue
  if (mode == 1) {
    multiplier = 1;
    localStorage.setItem("multiplier", multiplier);
  } else {
    // Or grab the multiplier value from storrage
    multiplier = Number(localStorage.getItem("multiplier"));
  }

  // However we got it, update the field on screen
  document.getElementById("multiplier").value = multiplier;

  // Go calculate all the mutiplied values
  updateMultiplier();
}

// * Reset the multipliers to 1:1
function setoneone() {
  document.getElementById("originalScale").value = 1;
  multiChange(1);
  document.getElementById("newScale").value = 1;
  multiChange(2);
  document.getElementById('dimScale').checked = false;
  masterDimmer('dimScale', 'theBlocksSc');
  tallyIt();
}

// * Responding to a button click, this little feller copies the scaled amounts from the scaled column to the "regular" column.
function copyScaled() {

  let fieldIndex = 0;
  for (let index = 0; index < rs.length; index++) {
    fieldIndex = index + 1;
    rs[index] = youWant[index];
    document.getElementById("recipeSays" + fieldIndex).value = rs[index];
    // * console.log(`rs: ${rs[index]}`);
  }

  document.getElementById("originalScale").value = 1;
  document.getElementById("newScale").value = 1;
  multiChange();

  tallyIt(); // Todo This specifically tags the tally function to NOT read values from the fields and into the array. This approach might be obsolete
}


//* User has chosen a preset recipe from the dropdown. Populate the various fields as well as the various arrays.

function changeRecipe(isItResetting) {

  // Reset stuff that may have been set from before
  recipeSteps = "";
  headers = [];

  if (isItResetting == 1) {
    whichRecipe = "Reset";
  } else {
    let chosen = document.getElementById("recipeSelect");
    whichRecipe = chosen.options[chosen.selectedIndex].innerHTML;
    console.log(`whichRecipe: ${whichRecipe}`);
  }

  let recipeCounter = 0;
  recipe = [];
  rs = [];
  ingredients = [];

  if (whichRecipe.includes("Choose")) {
    return;
  }

  // * Reset
  if (whichRecipe.includes("Reset")) {
    recipe = [
      ['Ingredient', 1],
      ['Ingredient', 1]
    ]; recipeSteps = "RESET!";
  }

  // Wasabi Sauce for Ahi TUna
  if (whichRecipe.includes("Ahi Tuna")) {
    recipe = [
      ['Yogurt', 60],
      ['Buttermilk', 45],
      ['Wasabi Salt', 1],
      ['Black Pepper', 2],
      ['Aleppo Pepper', 2],
      ['Salt', 2]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Pesto
  if (whichRecipe.includes("Pesto")) {
    recipe = [
      ['Olive oil', 45, "w"],
      ['Basil', 18, "d"],
      ['Almonds', 11, "d"],
      ['Parmesan', 9, "d"],
      ['Lemon Juice', 9, "w"],
      ['Garlic', 5, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Caesar Dressing
  if (whichRecipe.includes("Caesar")) {
    recipe = [
      ['EVOO', 60, "w"],
      ['Lemon Juice', 24, "w"],
      ['Egg Yolk', 15, "w"],
      ['Worcestershire Sauce', 2.5, "w"],
      ['Garlic Cloves (3)', 18, "d"],
      ['Parmesan', 15, "d"],
      ['Anchovies (2)', 10, "d"],
      ['Salt', 3, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Nicoise Dressing
  if (whichRecipe.includes("Niçoise")) {
    recipe = [
      ['EVOO', 59, "w"],
      ['Red Wine Vinegar', 24, "w"],
      ['Shallot', 20, "d"],
      ['Garlic Clove (6g ea.)', 6, "d"],
      ['Dijon', 6, "w"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Ranch Dressing
  if (whichRecipe.includes("Ranch")) {
    recipe = [
      ['Greek yogurt', 118, "w"],
      ['Buttermilk', 30, "w"],
      ['Garlic Clove (6g ea.)', 8, "d"],
      ['Apple cider vinegar', 29, "w"],
      ['Scallions', 6, "d"],
      ['Dill', 1, "d"],
      ['Fresh parsley', 2, "d"],
      ['Thyme', 1, "d"],
      ['Black pepper', 1, "d"],
      ['Kosher salt', 3, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * White rice
  if (whichRecipe.includes("White Rice")) {
    recipe = [
      ['Rice (241 Wet)', 210, "d"],
      ['Water', 314, "w"],
      ['Salt', 4, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }


  // * Roma rice
  if (whichRecipe.includes("Roma")) {
    recipe = [
      ['Rice ', 162, "d"],
      ['Water', 337, "w"],
      ['Salt', 3, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Jasmine rice
  if (whichRecipe.includes("Jasmine")) {
    recipe = [
      ['Water', 420, "w"],
      ['Rice (241 Wet)', 210, "d"],
      ['Salt', 5, "d"],
      ['Powdered Garlic', 2, "d"],
      ['Powdered Onion', 2, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Sushi rice
  if (whichRecipe.includes("Sushi")) {
    recipe = [
      ['Rice (241 Wet)', 210, "d"],
      ['Water', 314, "w"],
      ['Rice Vinegar', 15, "w"],
      ['Sugar', 5, "d"],
      ['Salt', 4, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Pickled Onion
  if (whichRecipe.includes("Pickled Onion")) {
    recipe = [
      ['Water', 50, "w"],
      ['Vinegar', 10, "d"]
    ];
    recipeCounter++;
  }

  // * Tini Burger
  if (whichRecipe.includes("Burger")) {
    recipe = [
      ['Ground Beef', 225],
      ['Onion', 40],
      ['Panko', 15],
      ['Milk', 6],
      ['Worcestershire', 3.2],
      ['Salt', 2.25],
      ['P Garlic', 2.25],
      ['P Onion', 2.25],
      ['Dried Thyme', 2.25]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Miso Sauce
  if (whichRecipe.includes("Miso")) {
    recipe = [
      ['Soy Sauce', 30],
      ['Brown miso', 15],
      ['Rice Wine Vinegar', 15],
      ['Garlic Clove', 6],
      ['Honey', 3],
      ['Ginger', 2]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Tonnato
  if (whichRecipe.includes("Tonnato")) {
    recipe = [
      ['Oil-Packed Tuna', 142, "d"],
      ['Mayo', 118, "w"],
      ['Olive Oil', 60, "w"],
      ['Lemon Juice', 45, "w"],
      ['Capers', 15, "d"],
      ['Anchovies', 12, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Crepes
  if (whichRecipe.includes("Classic Crepes")) {
    recipe = [
      ['Milk', 120, "w"],
      ['Eggs', 100, "w"],
      ['B-milk', 45, "w"],
      ['Butter', 24, "w"],
      ['W. Wheat Flour', 50, "d"],
      ['AP Flour', 28, "d"],
      ['Buckwheat Flour', 28, "d"],
      ['Salt', 3, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Ti Couz Crepes
  if (whichRecipe.includes("Couz")) {
    recipe = [
      ['Water', 310, "w"],
      ['Milk', 100, "w"],
      ['Egg', 8, "w"],
      ['Butter', 17, "w"],
      ['W. Wheat Flour', 50, "d"],
      ['AP Flour', 30, "d"],
      ['Buckwheat Flour', 23, "d"],
      ['Salt', 5, "d"]
    ]; recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Sourdough Crepes
  // Updated 2/19/23 - AMAZING
  if (whichRecipe.includes("Sourdough Crepes")) {
    recipe = [
      ['Milk', 210, "w"],
      ['Water', 55, "w"],
      ['Eggs', 50, "w"],
      ['Butter', 22, "w"],
      ['Flour', 135, "d"],
      ['Salt', 3.5, "d"],
      ['Sourdough Starter', 30, "s"]
    ]; recipeSteps = "Updated 1-3-25 to tone down the starter amount - too tart!";
    recipeCounter++;
  }

  //* Naan
  if (whichRecipe.includes("Naan")) {
    recipe = [
      ['AP Flour', 500, "d"],
      ['Milk', 236, "w"],
      ['Yogurt', 60, "w"],
      ['Canola Oil', 30, "n"],
      ['Salt', 10, "d"],
      ['Yeast', 7, "d"],
      ['Baking Powder', 5, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Biscuits
  if (whichRecipe.includes("Biscuits")) {
    recipe = [
      ['AP Flour', 180, "d"],
      ['Salt', 4, "d"],
      ['B Powder', 10, "d"],
      ['Milk', 130, "w"],
      ['Butter', 50, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Cornbread
  if (whichRecipe.includes("Cornbread")) {
    recipe = [
      ['Cornmeal', 100, "d"],
      ['AP Flour', 90, "d"],
      ['B Powder', 3, "d"],
      ['Salt', 2, "d"],
      ['Sour Cream', 85, "w"],
      ['Milk', 80, "w"],
      ['Buttermilk', 55, "w"],
      ['Butter', 55, "w"],
      ['Egg', 50, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Pita
  if (whichRecipe.includes("Pita")) {
    recipe = [
      ['Flour', 310, "d"],
      ['WW Flour', 35, "d"],
      ['Water', 235, "w"],
      ['Olive Oil', 30, 'n'],
      ['Salt', 4, "d"],
      ['Yeast', 2, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* French Baguette 2
  if (whichRecipe.includes("Baguette")) {
    recipe = [
      ['Bread Flour', 700, "d"],
      ['Water', 520, "w"],
      ['Instant or active dried yeast', 2, "d"],
      ['Salt', 8, "d"],
      ['fresh yeast', 8, "d"]
    ];
    recipeSteps = "Process\nPart 1\n\nMix all the ingredients together until combined, you will see the dough will amalgamate into a ball, this should not take more than 2mn.\nCover and let it rise for 8 to 10 hours, I leave the dough in the cold oven.\n\nPart 2\nSprinkle some flour on the bench or a pizza dish/plate, scrape the dough on the dish and sprinkle again some more flour on top to avoid sticking. You will need a plastic dough scraper and make sure you're not pressing the dough to keep the air inside.\n\nCut the dough in 4 (if you want 4 baguettes, but you can make 2/3/5).\n\nTake each piece and stretch it gently into a baguette shape and put it on a baking tray or plate with baking paper. This should not take more than 3 mn and if you're well organised cleaning included.\n\nBake at 250 degC (480 degF) for approx 25 mn in a pre heated oven depending how golden you want them.\n\nTimeline\n2mn mixing - 8/10h rising - shaping 3mn - baking 25 mn\n\nNote on flour;\nUse Bakers flour, also called bread flour or strong flour depending where you live.\nEvery flour is different so the water/flour ratio or hydration will need to be adjusted slightly, if you find the dough too runny reduce water.\nTry a few different bread flours to see which one gives you the best result.";
    recipeCounter++;
  }

  //* Pizza Dough
  if (whichRecipe.includes("Classic Pizza")) {
    recipe = [
      ['AP Flour', 100, "d"],
      ['00/Bread Flour', 100, "d"],
      ['Water', 140, "w"],
      ['Salt', 6, "d"],
      ['Yeast', 1, "d"],
      ['Olive Oil', 4, "n"]
    ];
    recipeSteps = "1. Combine flours, water, and yeast\n2. Let rest 30 minutes-2 hours.\n3. Add oil and mix to combine and distribute.\n4. Place in a warm location to rise for 3+ hours.\n5. Do a final tuck and roll, allow for a final rest, then stretch.";
    recipeCounter++;
  }

  //* Neapolitan Pizza Dough
  if (whichRecipe.includes("Neapolitan")) {
    recipe = [
      ['Bread flour', 300, "d"],
      ['AP Flour', 200, "d"],
      ['Warm Water', 200, "w"],
      ['Salt', 8, "d"],
      ['Honey', 5, "w"],
      ['Yeast', 5, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Sourdough Pizza Dough
  if (whichRecipe.includes("Sourdough Pizza Dough")) {
    recipe = [
      ['Starter', 100, "s"],
      ['AP Flour', 220, "d"],
      ['Warm Water', 90, "w"],
      ['EVOO', 15, "n"],
      ['Salt', 6, "d"],
      ['Yeast', 3, "d"]
    ];
    recipeSteps = "20 Slices of Pepperoni, 20 slices of Courgette, 20g of Kale/6 smaller leaves, ~190g of sauce";
    recipeCounter++;
  }

  //* Sourdough Bread
  if (whichRecipe.includes("Sourdough Bread")) {
    recipe = [
      ['Bread Flour', 335, "d"],
      ['WW Flour', 50, "d"],
      ['Rye Flour', 20, "d"],
      ['Water', 250, "w"],
      ['Salt', 9, "d"],
      ['Starter', 13, "s"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Vito's Pizza Dough

  // Poolish
  // 200 g of 00 flour (or ap flour) 
  // 200 g of water
  //   5 g of honey
  //   5 g of dry yeast

  //   Dough:
  // 300 g of Manitoba flour
  // 300 g of water
  //  20 g of salt
  // 200 g of 00 flour(or ap flour)


  if (whichRecipe.includes("Vito")) {
    recipe = [
      ['AP Flour', 75, "d"],
      ['Warm Water', 75, "w"],
      ['Yeast', 3, "d"],
      ['Honey', 3, "W"],
      ['Flour', 180, "d"],
      ['Water', 100, "w"],
      ['Salt', 7.5, "d"],
      ['Olive Oil', 3, "n"]
    ];
    headers = [[5, "The Dough"], [1, "The Poolish"]];
    recipeSteps = "Mix everything keep 1 hour at room temperature to activate the leavened then put it in the fridge 16to24 hours\nMake the pizza dough\n\n16 to 24 hours ";
    recipeCounter++;
  }


  //* Levain for Bread
  if (whichRecipe.includes("Levain")) {
    recipe = [
      ['Bread Flour', 40, "d"],
      ['WW Flour', 40, "d"],
      ['Water', 80, "w"],
      ['Starter', 8, "s"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Bread for Bread
  if (whichRecipe.includes("Bread for Bread")) {
    recipe = [
      ['Bread Flour', 766, "d"],
      ['WW Flour', 161, "d"],
      ['Water', 635, "w"],
      ['Ripe Levain', 169, "s"],
      ['Water 2', 50, "w"],
      ['Salt', 19, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Agnolotti
  if (whichRecipe.includes("Agnolotti")) {
    recipe = [
      ['AP Flour', 100, "d"],
      ['Yolk(s)', 36, "w"],
      ['Egg', 18, "w"],
      ['Milk', 5.3, "w"],
      ['Oil', 2.1, "n"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Basic pasta (egg and flour)
  if (whichRecipe.includes("Basic")) {
    recipe = [
      ['Egg', 50, "w"],
      ['Flour', 94, "d"],
      ['Salt', 2, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Ricotta Gnocchi
  if (whichRecipe.includes("Ricotta")) {
    recipe = [
      ['Ricotta Cheese', 240, "w"],
      ['Flour', 110, "d"],
      ['Eggs', 100, "w"],
      ['Parmesan', 15, "d"],
      ['Salt', 4, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* All Durum Dough
  if (whichRecipe.includes("All Durum")) {
    recipe = [
      ['Durum Flour', 155, "d"],
      ['Egg(s)', 70, "w"],
      ['Salt', 2.33, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Al Dente Pasta Dough
  if (whichRecipe.includes("Dente")) {
    recipe = [
      ['Durum Flour', 130, "d"],
      ['AP/100 Flour', 100, "d"],
      ['Egg(s)', 75, "w"],
      ['Water', 42, "w"],
      ['Salt', 3.55, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Culurgione Pasta Dough
  if (whichRecipe.includes("Culurgione Pasta Dough")) {
    recipe = [
      ['AP/00 Flour', 150, "d"],
      ['Semolina Flour', 100, "d"],
      ['Water', 145, "w"],
      ['Salt', 4, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Culurgione Filling
  if (whichRecipe.includes("Culurgione Filling")) {
    recipe = [
      ['Potatoes (skins=10%, 15mins @325)', 230, "d"],
      ['Aged Pecorino', 23, "d"],
      ['Fresh Pecorino', 46, "d"],
      ['Goat Cheese', 46, "d"],
      ['Chopped Mint', 2, "d"],
      ['Egg', 12, "w"],
      ['Garlic', 3, "d"],
      ['EVOO', 15, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Gnocchi
  if (whichRecipe.includes("Potato G")) {
    recipe = [
      ['Potato', 900, "d"],
      ['AP Flour', 120, "d"],
      ['Egg', 50, "w"],
      ['Salt', 9, "d"]
    ];
    recipeSteps = "Unspecified";
    relevantLink = '<a href="http://http://www.google.com"> Link to Google</a>';
    recipeCounter++;
  }

  //* Ravioli Pasta Dough
  if (whichRecipe.includes("Ravioli")) {
    recipe = [
      ['AP Flour', 80, "d"],
      ['Semolina Flour', 70, "d"],
      ['WW Flour', 70, "d"],
      ['Water', 60, "w"],
      ['Egg', 50, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Straciatella Pasta with Lemon and Asparagus
  if (whichRecipe.includes("Stracciatella")) {
    recipe = [
      ['Cavatelli Pasta Dough', 300, "d"],
      ['Stracciatella', 250, "d"],
      ['Asparagus', 150, "d"],
      ['Lemon Juice', 8, "d"],
      ['Salt', 3, "w"],
      ['Lemon Zest', 2, "w"]
    ];
    recipeSteps = `1. Gently heat the stracciatella in a pan. You want it warm, not hot.\n
    2. Add lemon juice and zest to the cheese and stir to combine. Set on keep warm setting.\n
    3. Cook asparagus and pasta.
    4. Add pasta to the cheese and mix.
    5. Add asparagus and serve.`;
    recipeCounter++;
  }

  //* Starter
  if (whichRecipe.includes("Starter")) {
    recipe = [
      ['AP/00', 28, "d"],
      ['Rye Flour', 14, "d"],
      ['Water', 40, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Hollandaise
  if (whichRecipe.includes("Hollandaise")) {
    recipe = [
      ['Butter', 150, "w"],
      ['Egg Yolk (~17g Each)', 85, "w"],
      ['Water', 50, "w"],
      ['Lemon Juice', 20, "w"],
      ['Salt', 3, "d"],
      ['147° for 1 hour', 0, "n"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Sauce for Pasta
  if (whichRecipe.includes("Pasta Sauce")) {
    recipe = [
      ['Dry pasta', 142, "d"],
      ['Sauce', 275, "w"]
    ];
    recipeSteps = "";
    recipeCounter++;
  }

  //* Sauce for Pasta
  if (whichRecipe.includes("Gnocchi Sauce")) {
    recipe = [
      ['Gnocchi', 250, "d"],
      ['Sauce', 150, "w"]
    ];
    recipeSteps = "";
    recipeCounter++;
  }

  //* Bolognese
  //* Alt version 10/31/24
  //  80g Carrots
  //  80g Celery
  //  60g Onion
  // 175g Mince
  // 220g Chunk Tomatoes
  if (whichRecipe.includes("Bolognese")) {
    recipe = [
      ['Ground Beef', 226],
      ['Tomato', 300],
      ['Milk', 120],
      ['White Wine', 120],
      ['Onion', 80],
      ['Celery', 67],
      ['Carrot', 67]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Ssamjang Sauce
  if (whichRecipe.includes("Ssamjang")) {
    recipe = [
      ['Beef Stock', 70],
      ['Samjang', 60],
      ['Light Miso', 20],
      ['Gochjang', 15],
      ['RW Vinegar', 15]
    ];
    recipeSteps = "";
    recipeCounter++;
  }

  //* Meatballs
  if (whichRecipe.includes("Meatballs")) {
    recipe = [
      ['Ground Beef', 280, "d"],
      ['Milk', 115, "w"],
      ['Italian Bread Crumbs', 50, "w"],
      ['Onion', 40, "d"],
      ['Eggs', 30, "w"],
      ['Parm', 30, "d"],
      ['Parsley', 5, "d"],
      ['Salt', 4, "d"],
      ['Garlic Powder', 3, "d"]
    ];
    recipeSteps = "1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.\n2. Combine all ingredients and knead until ingredients are distributed. Meatballs should be wet and somewhat sticky.\n3. In a medium-heat pan, brown meatballs on all sides.\n4. Add meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning meatballs halfway through.\n5. Combine with pasta and serve\nThey can be baked at 350° for 15 minutes";
    recipeCounter++;
  }


  //* Albondigas
  if (whichRecipe.includes("Albondigas")) {
    recipe = [
      ['Ground Beef', 280, "d"],
      ['Milk', 125, "w"],
      ['Italian Bread Crumbs', 50, "d"],
      ['Rice (Roma)', 100, "d"],
      ['Eggs', 50, "w"],
      ['Onion', 40, "d"],
      ['Parm', 30, "d"],
      ['Parsley', 5, "d"],
      ['Salt', 4, "d"],
      ['Garlic Powder', 3, "d"]
    ];
    recipeSteps = `It's a little hard to believe this is going to stay together, but it does.
    1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.\n2. Combine all ingredients and knead until ingredients are distributed. Meatballs should be wet and somewhat sticky.\n3. In a medium-heat pan, brown meatballs on all sides.\n4. Add meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning meatballs halfway through.\n5. Combine with pasta and serve\nThey can be baked at 350° for 15 minutes`;
    recipeCounter++;
  }

  //* Mashed Potatoes
  if (whichRecipe.includes("Mashed")) {
    recipe = [
      ['Potatoes (skins=10%)', 700, "d"],
      ['Sour Cream', 130, "w"],
      ['Butter', 66, "w"],
      ['White Pepper', 3, "d"],
      ['Salt', 4, "d"],
      ['Wasabi Salt', 2.5, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Shakshuka
  if (whichRecipe.includes("Shakshuka")) {
    recipe = [
      ['Tomato', 200],
      ['Harissa', 25],
      ['Onion', 50],
      ['Red Pepper', 20],
      ['Garlic', 10],
      ['Paprika', 6],
      ['Cumin', 3]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Tatty Scones
  if (whichRecipe.includes("Tatty")) {
    recipe = [
      ['Potatoes (skins=10%)', 500],
      ['Flour', 100],
      ['Butter', 50],
      ['Salt', 5]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Tortillas
  if (whichRecipe.includes("Tortillas")) {
    recipe = [
      ['Masa', 90, "d"],
      ['Water', 110, "w"],
      ['Butter', 14.25, "w"],
      ['Achiotina/lard', 14.25, "w"],
      ['Salt', 2.15, "d"]
    ];
    recipeSteps = "1. Combine all four ingredients thoroughly in a bowl.\n2. Allow dough to rest at least 15 minutes, preferably longer.\n3. Cook on medium heat for 30 seconds on each side.";
    reciPortions = 6;
    recipeCounter++;
  }

  //* Sonoran Flour Tortillas
  if (whichRecipe.includes("Sonoran")) {
    recipe = [
      ['Flour', 100, "d"],
      ['Water', 50, "w"],
      ['Lard', 30, "w"],
      ['Salt', 2, "d"],
      ['Baking Powder', 1, "d"]
    ];
    recipeSteps = "Unspecified";
    reciPortions = 6;
    recipeCounter++;
  }

  //* Udon Noodles
  if (whichRecipe.includes("Udon")) {
    recipe = [
      ['AP Flour', 200, "d"],
      ['Water', 90, "w"],
      ['Salt', 10, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Blinis
  if (whichRecipe.includes("Blinis")) {
    recipe = [
      ['Buttermilk', 475, "w"],
      ['Eggs', 110, "w"],
      ['Butter', 28, "w"],
      ['Buckwheat Flour', 140, "d"],
      ['AP Flour', 70, "d"],
      ['Sugar', 8, "d"],
      ['Salt', 2, "d"],
      ['Baking Powder', 2, "d"],
      ['Baking Soda', 1, "d"]
    ];
    recipeSteps = "Unspecified";
    reciPortions = 50;
    recipeCounter++;
  }

  //* Spanish Rice
  if (whichRecipe.includes("Spanish")) {
    recipe = [
      ['Water', 300, "w"],
      ['Rice', 200, "d"],
      ['Bell Pepper', 80, "d"],
      ['Tomato Paste', 30, "w"],
      ['Cumin', 3, "d"],
      ['Salt', 3, "d"],
      ['Dried Garlic', 2, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  // * Lemon(ade) Spritzer
  if (whichRecipe.includes("Lemonade Spritzer")) {
    recipe = [
      ['Lemonade', 100],
      ['Soda Water', 80]
    ]
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Bloody
  if (whichRecipe.includes("Bloody")) {
    recipe = [
      ['V8', 150],
      ['Soy Sauce', 5],
      ['Horseradish', 3],
      ['Lemon Juice', 2],
      ['Worcestershire', 2],
      ['Tabasco', 1]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Sangrita
  if (whichRecipe.includes("Sangrita")) {
    recipe = [
      ['Tomato Juice', 70],
      ['Orange Juice', 25],
      ['Lime', 4],
      ['Cholula', 2]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Risotto
  if (whichRecipe.includes("Risotto")) {
    recipe = [
      ['Stock', 350, 'w'],
      ['Carnaroli', 140, 'd'],
      ['Vegetable Oil', 42, 'n'],
      ['Onion', 10, 'd'],
      ['Salt', 5, 'd']
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Cavatelli
  if (whichRecipe.includes("Cavatelli")) {
    recipe = [
      ['AP Flour', 120, 'd'],
      ['Durum Flour', 50, 'd'],
      ['WW', 20, 'd'],
      ['Water', 55, 'w'],
      ['Eggs', 50, 'w'],
      ['Salt', 3, 'd']
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Bechamel
  if (whichRecipe.includes("Bechamel")) {
    recipe = [
      ['Flour', 15],
      ['Butter', 15],
      ['Milk', 175],
      ['Mustard', 15]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Bullshot
  if (whichRecipe.includes("Bull")) {
    recipe = [
      ['Vodka', 50],
      ['Beef Stock', 100],
      ['Worcestershire Sauce', 5.25],
      ['Red Wine Vinegar', 1.25],
      ['Soy Sauce', 5.25],
      ['Tabasco Sauce', 0.62],
      ['undefined', 0.62]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Margarita
  if (whichRecipe.includes("Margarita")) {
    recipe = [
      ['Curaçao', 85],
      ['Tequila', 33],
      ['Lime Juice', 33]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Polenta
  if (whichRecipe.includes("Polenta")) {
    recipe = [
      ['Water', 424, "w"],
      ['Polenta', 86, "d"],
      ['Sour Cream', 30, "w"],
      ['Butter', 15, "w"],
      ['Salt', 6, "d"],
      ['Cheese', 120, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Farro
  if (whichRecipe.includes("Farro")) {
    recipe = [
      ['Farro', 100, "d"],
      ['Water', 360, "w"],
      ['Salt', 4, "d"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Dutch Baby
  if (whichRecipe.includes("Dutch")) {
    recipe = [
      ['Flour', 120, "d"],
      ['Cheese(s)', 72, "d"],
      ['Thyme', 1, "d"],
      ['Parsley', 1, "d"],
      ['Eggs', 400, "w"],
      ['Milk', 176, "w"],
      ['Unsalted Butter', 89, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Welsh Rarebit
  if (whichRecipe.includes("Welsh")) {
    recipe = [
      ['Cheese', 50, "d"],
      ['Butter', 15, "w"],
      ['Flour', 15, "d"],
      ['Milk', 26, "w"],
      ['Guinness', 26, "w"],
      ['Worcestershire', 7.5, "w"],
      ["Coleman's", 5, "w"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Injeera
  if (whichRecipe.includes("Injeera")) {
    recipe = [
      ['Water', 300, "w"],
      ['AP Flour', 75, "d"],
      ['Teff Flour', 40, "d"],
      ['Starter', 175, "s"]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Ponzu Sauce
  if (whichRecipe.includes("Ponzu")) {
    recipe = [
      ['Rice Vinegar', 30],
      ['Mirin', 12],
      ['Kombu', 1],
      ['Katsuobushi', 15],
      ['Yuzu (or 50% lemon, 50% lime)', 120],
      ['Soy Sauce', 120]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Coconut Rum Julep
  if (whichRecipe.includes("Julep")) {
    recipe = [
      ['Rum', 43],
      ['Simple', 21],
      ['Lime', 14],
      ['Coconut', 21]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Jungle Bird
  if (whichRecipe.includes("Jungle Bird")) {
    recipe = [
      ['Dark Rum', 43],
      ['Campari', 21],
      ['Pineapple', 43],
      ['Lime', 14],
      ['Simple', 14]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Cable Car
  if (whichRecipe.includes("Cable")) {
    recipe = [
      ['Spiced Rum', 45],
      ['Curacao', 22],
      ['Lemon Juice', 30],
      ['Simple', 15]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Mexican
  if (whichRecipe.includes("Mexican")) {
    recipe = [
      ['Pineapple', 70],
      ['Tequila', 28],
      ['Triple Sec', 10]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Soda
  if (whichRecipe.includes("Soda")) {
    recipe = [
      ['Fizzy Water', 300],
      ['Flavor Syrup', 40]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Tea
  if (whichRecipe.includes("Tea")) {
    recipe = [
      ['Water', 500],
      ['Loose Tea', 6]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Egg Topping
  if (whichRecipe.includes("Egg")) {
    recipe = [
      ['Egg', 58],
      ['Water', 8]
    ];
    recipeSteps = "Unspecified";
    recipeCounter++;
  }

  //* Test mode
  if (whichRecipe.includes("TEST")) {

    recipe = [
      ['A', 1],
      ['B', 2],
      ['C', 3],
      ['D', 4],
      ['E', 5],
      ['F', 6],
      ['G', 7],
      ['H', 8],
      ['I', 9],
      ['J', 10]
    ];
  }

  //* Check to see that recipeCounter only equals 1. If it's more than that, you have duplicate hits on a recipe

  if (recipeCounter > 1) {
    alert("More than one recipe has been triggered.");
  }

  localStorage.setItem("theRecipe", recipe);

  //* If there is a link to some helpful info, add that too.
  if ("relevantLink" != "") {
    document.getElementById("links").innerHTML = relevantLink;
  }

  //* Stick the title of the recipe in the title section.
  document.getElementById("recipeTitle").innerHTML = whichRecipe;
  document.getElementById("titleRow").style.display = "";

  //* If the recipe has headers, put those in.
  //* If not, blank out the header lines that may have been left from before.

  //* But first, clear out any prior ones.
  for (let index = 1; index < 10; index++) {
    document.getElementById(`row${index}a`).style.display = "none";
    document.getElementById(`head${index}`).innerHTML = "";
  }

  //* Parse the recipe for section breaks
  for (let index = 0; index < headers.length; index++) {
    let offset = index + 1;
    console.log(`The row is ${headers[index][0]} and the title is ${headers[index][1]}`);
    document.getElementById("row" + headers[index][0] + "a").style.display = "";
    // let temp = headers[index][0];
    // temp += 1;
    document.getElementById("head" + headers[index][0]).innerHTML = headers[index][1];
  };



  // Load the variables into the ingredients and quantities arrays
  var wetIngs = 0, dryIngs = 0, hydration = 0;
  for (let x = 0; x < recipe.length; x++) {
    ingredients[x] = recipe[x][0];
    rs[x] = Number(recipe[x][1]);
    dryWetNull[x] = recipe[x][2];

    let tempColor = "#24342466"; // This is the default color

    if (dryWetNull[x] != undefined) {

      switch (dryWetNull[x]) {

        // If it's a dry ingredient, it gets a custom color
        case "d":
          dryIngs += Number(recipe[x][1]);
          // tempColor = "#7b8f6cbd"; // Dry Color
          break;

        // If it's a wet ingredient, it gets a custom color
        case "w":
          wetIngs += Number(recipe[x][1]);
          // tempColor = "#3865b7"; // This is the wet color
          break;

        // If it's starter, it gets a custom color AND contributes equally to wet and dry ratios
        case "s":
          wetIngs += Number(recipe[x][1]) * .50;
          dryIngs += Number(recipe[x][1]) * .50;
          // tempColor = "#dfa62566"; // This is the STARTER COLOR 
          break;

        // If it's "N", it is neutral and contrinutes to neither; For example, olive oil
        case "n":
          tempColor = "#ffffff66"; // This is the NULL color
          break;

        // If all else fails "N", it is neutral and contrinutes to neither; For example, olive oil
        default:
          tempColor = "#ffffff66"; // This is the NULL color
          break;
      }
    } else {
      document.getElementById("checkRow" + (x + 1)).style.backgroundColor = "#24342466";
      wetIngs = 0;
      dryIngs = 0;
    }

    document.getElementById("checkRow" + (x + 1)).style.backgroundColor = tempColor;
  }

  colorIngs();

  // hydration = dryIngs / wetIngs * 100;
  hydration = wetIngs / dryIngs * 100;
  // console.log(`hydration: ${hydration}`);

  let r14 = "",
    r15 = "",
    dd = "",
    wd = "";

  // If there is hydration
  if (hydration > 0) {
    // Reveal rows 14 and 15
    r14 = "";
    r15 = "";

    // Set the hydration amount + a % symbol
    document.getElementById("hydration").value = parseFloat(hydration.toFixed(2)) + "%";

    let hyTotal = wetIngs + dryIngs;
    let temp = wetIngs / hyTotal * 100;
    temp = parseFloat(temp.toFixed(1));
    wd = `Wet: ${temp}%`;
    temp = dryIngs / hyTotal * 100;
    temp = parseFloat(temp.toFixed(1));
    dd = `Dry: ${temp}%`;
  } else {
    r14 = "None";
    r15 = "None";
    dd = ``;
    wd = ``;
  }
  document.getElementById("row14").style.display = r14;
  document.getElementById("row15").style.display = r15;
  document.getElementById("dryDration").value = dd;
  document.getElementById("wetDration").value = wd;

  if (recipeSteps != "") {
    document.getElementById("scratchPad").style.display = "";
    document.getElementById("origRecipe").innerHTML = recipeSteps;
  }
  else {
    document.getElementById("scratchPad").style.display = "none";
  }

  // //* This SORTS the ingredients/amounts. Disabled for now. Might be a nice option, but it separates out related ingredients.
  // for (let x = 1; x < 30; x++) {
  //   for (let y = 0; y < rs.length - 1; y++) {
  //     if (rs[y] < rs[y + 1]) {
  //       let temp = rs[y];
  //       rs[y] = rs[y + 1];
  //       rs[y + 1] = temp;
  //       temp = ingredients[y];
  //       ingredients[y] = ingredients[y + 1];
  //       ingredients[y + 1] = temp;
  //     }
  //   }
  // }

  ingLength = recipe.length;
  // Write the values to the fields
  for (let arrayCount = 0; arrayCount <= 9; arrayCount++) {
    let fieldCount = arrayCount + 1;
    // Once the values are loaded, write them to the arrays
    // Update the class of this row to reflect either a middle or the bottom of the list
    if (fieldCount <= ingLength) {
      // If there's an ingredient, the field should be visible
      document.getElementById("row" + fieldCount).style.display = "revert";

      // Write those values to the fields
      document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount];
      document.getElementById("recipeSays" + fieldCount).value = rs[arrayCount];
      let temp = Number(rs[arrayCount] / 28.3495);
      document.getElementById("recipeSaysImp" + fieldCount).value = fixDigits(temp);

    } else {
      ingredient = "None";
      thisAmount = 0;
      document.getElementById("row" + fieldCount).style.display = "none";
    }

    // Aand local storage
    localStorage.setItem(
      "scalerIngredient" + arrayCount,
      ingredients[arrayCount]
    );
    localStorage.setItem("recipeSays" + arrayCount, thisAmount);
  }

  localStorage.setItem("ingLength", ingLength);

  // Force the Sync button to the inverse of whether or not the current recipe is "Reset."
  // Hence, if it IS set to Reset, then synced will be OFF
  synced = whichRecipe != "Reset";
  colorSyncedFields();
  localStorage.getItem("syncVals") == "true";

  // If there is a portion value, include that as well

  if (reciPortions > 0) {
    document.getElementById("portions").value = reciPortions;
    portionIt();
  }

  // Do a tally of the various variables
  updateTotals();
  updateMultiplier();
}



function colorIngs() {

  let tempColor = "#24342466"; // This is the default color

  for (let x = 0; x < recipe.length; x++) {

    if (dryWetNull[x] != undefined) {

      switch (dryWetNull[x]) {

        // If it's a dry ingredient, it gets a custom color
        case "d":
          // dryIngs += Number(recipe[x][1]);
          tempColor = "#7b8f6cbd"; // Dry Color
          break;

        // If it's a wet ingredient, it gets a custom color
        case "w":
          // wetIngs += Number(recipe[x][1]);
          tempColor = "#3865b7"; // This is the wet color
          break;

        // If it's starter, it gets a custom color AND contributes equally to wet and dry ratios
        case "s":
          // wetIngs += Number(recipe[x][1]) * .50;
          // dryIngs += Number(recipe[x][1]) * .50;
          tempColor = "#dfa62566"; // This is the STARTER COLOR 
          break;

        // If it's "N", it is neutral and contrinutes to neither; For example, olive oil
        case "n":
          tempColor = "#ffffff66"; // This is the NULL color
          break;

        // If all else fails "N", it is neutral and contrinutes to neither; For example, olive oil
        default:
          tempColor = "#ffffff66"; // This is the NULL color
          break;
      }
    } else {
      // document.getElementById("checkRow" + (x + 1)).style.backgroundColor = "#24342466";
      // wetIngs = 0;
      // dryIngs = 0;
    }

    document.getElementById("checkRow" + (x + 1)).style.backgroundColor = tempColor;
  }
}



// * ********************************
// * Add a row
// * ********************************

function addRow() {

  // Don't attempt to add a row if there are already ten rows
  if (ingredients.length < 10) {
    // First, we're turning off syncing because we're going to enter a value in the RS field AND store that state in local storage
    synced = false;
    localStorage.setItem("syncVals", synced);

    // Increase the number of ingredients by 1

    // Assign a null value to the ingredient and a nominal value to the amount
    let lengTemp = ingredients.length;
    ingredients[lengTemp] = "New Ingredient";
    rs[lengTemp] = 1;

    // We've added a new element to the arrays by using 0 index. Now, we need to update lengTemp to reflect the new length
    lengTemp = ingredients.length;

    localStorage.setItem("ingLength", lengTemp);

    // getValues(2, ingLength);

    document.getElementById("ingredient" + lengTemp).value = ingredients[lengTemp - 1];
    document.getElementById("recipeSays" + lengTemp).value = rs[lengTemp - 1];


    for (let thisRow = 1; thisRow <= 10; thisRow++) {
      if (thisRow <= lengTemp) {
        document.getElementById("row" + thisRow).style.display = "revert";
      } else {
        document.getElementById("row" + thisRow).style.display = "none";
      }
    }

    colorSyncedFields();
    tallyIt();
    updateTotals();
  }
}

function portionIt(which) {
  let portions = document.getElementById("portions").value;

  let ttl1 = document.getElementById("totalOrig").value / portions;
  document.getElementById("weightEachO").value = parseFloat(ttl1.toFixed(1));

  let ttl2 = document.getElementById("totalScaled").value / portions;
  // document.getElementById("weightEachS").value = parseFloat(ttl2.toFixed(1));

  if (portions > 1) {
    let x1 = ttl1 / 28.3495;
    document.getElementById("row13").style.display = ""
    document.getElementById("weightEachOoz").value = parseFloat(x1.toFixed(2));
  } else {
    // document.getElementById("row13").style.display = "none"
  }
}

// Multiplier Change Function - This means that either the second or third column has changed and the respective values need to be updated.
function multiChange(column) {
  // If it's the THIRD column we're editing, that means we're manually changing the multiplier.
  // Calculate the SECOND column based on the multiplier.
  if (column == 3) {
    let x = document.getElementById("multiplier").value;
    multiplier = parseFloat(x);

    x = document.getElementById("originalScale").value;
    originalScaleVar = parseFloat(x);

    x = originalScaleVar * multiplier;
    newScaleVar = parseFloat(x);

    document.getElementById("newScale").value = newScaleVar;

    for (let index = 1; index <= rs.length; index++) {
      x = rs[index - 1] * multiplier;
      x = Number.parseFloat(x.toFixed(1));
      document.getElementById("youWant" + index).value = x;
    }

    // If it's not the third column, then it's either of the first two so calculate the ratio between them and update the multiplier
  } else {
    originalScaleVar = document.getElementById("originalScale").value;
    newScaleVar = document.getElementById("newScale").value;
    multiplier = parseFloat(Number(newScaleVar / originalScaleVar).toFixed(1));
    document.getElementById("multiplier").value = Number(multiplier);
    updateMultiplier();
  }

  // Now, unless the various values are 1, 1, and 1, then it's being scaled so we should light up the scaled column.
  let a1 = Number(document.getElementById("newScale").value);
  let a2 = Number(document.getElementById("originalScale").value);
  let a3 = Number(document.getElementById("multiplier").value);

  if (a1 + a2 + a3 != 3) {
    document.getElementById("dimScale").checked = true;
    masterDimmer('dimScale', 'theBlocksSc');
  } else {
    document.getElementById("dimScale").checked = false;
    masterDimmer('dimScale', 'theBlocksSc');
  }
  updateTotals();
}

// Simply adds up all the values and places a total at the bottom.
function updateTotals() {
  tallyIt();
  // console.log("Doing the totals");
  document.getElementById("totalOrig").value = parseFloat(total.toFixed(1));
  document.getElementById("totalImp").value = parseFloat(totalImp.toFixed(1));
  let temp = total * multiplier;
  document.getElementById("totalScaled").value = parseFloat(temp.toFixed(1));

  portionIt();
}

// Sync button was clicked. Set localStorage value accordingly and calculate the ratios.
function syncTheVals(toggleOrNo) {
  if (toggleOrNo != 1) {
    synced = !synced;
  }

  // Stash the current sync state in storage
  localStorage.setItem("syncVals", synced);

  // If sync is now enabled, go uncheck all the manual sync boxes
  if (synced) {
    bothChecked = false;
    countChex(100);
    pairTotal = 0;
  }

  colorSyncedFields();
  tallyIt();
}

// If sync mode is on, colorize the fields to indicate they're linked
function colorSyncedFields() {
  let theSyncButton = document.getElementById("syncButton");
  theSyncButton.checked = synced;
  if (synced) {
    theSyncButton.innerHTML = "Synced!";
    theSyncButton.style.backgroundColor = "green";
    theSyncButton.style.color = "#FFFFFF";
  } else {
    theSyncButton.innerHTML = "!Synced";
    theSyncButton.style.backgroundColor = "#d8a200";
    theSyncButton.style.color = "#FFFFFF";
  }


  for (let index = 1; index <= rs.length; index++) {
    let syncableElement = document.getElementById("syncable" + index);
    let syncableElementImp = document.getElementById("syncableImp" + index);
    let syncableElementTtl = document.getElementById("youWantRow" + index);
    if (synced) {
      syncedColor = "#7c99d399";
    } else {
      syncedColor = "#24344266";
    }
    syncableElement.style.backgroundColor = syncedColor;
    syncableElementImp.style.backgroundColor = syncedColor;
    syncableElementTtl.style.backgroundColor = syncedColor;

    if (document.getElementById("rowcheck" + index).checked) {
      console.log(`i: ${index} is checked`);
      document.getElementById("row" + index).style.backgroundColor = "#79588fdd";
    } else {
      // document.getElementById("row" + index).style.backgroundColor = "";
    }
  }
}

// Grab the specified scale amount and Update the multiplied values in the RS fields along with locao storage equivalents
function updateMultiplier() {
  multiplier = Number(document.getElementById("multiplier").value);
  localStorage.setItem("multiplier", multiplier);

  originalScaleVar = Number(document.getElementById("originalScale").value);
  localStorage.setItem("originalScale", originalScaleVar);

  newScaleVar = Number(document.getElementById("newScale").value);
  localStorage.setItem("newScale", newScaleVar);

  for (daCount = 1; daCount <= ingredients.length; daCount++) {
    let arrayCount = daCount - 1;

    // ! Test deprecation; array should only be changed by field value on input, not the other way around.

    // Update the recipe says column accordingly.
    let x = rs[arrayCount] * multiplier;
    youWant[arrayCount] = parseFloat(x.toFixed(1));
    document.getElementById("youWant" + daCount).value = youWant[arrayCount];

    // Update fields and stash local storage values (2 means PUT)
    getValues(2, daCount);
  }
}

// The ingredient field is being modified
// Grab the value and stash it
function updateIngredient(params) {

  deselectRecipe(); // If any of the values in the scaler are manually altered, nullify the recipe chosen at the top because it no longer reflects what the chart contains
  console.log(`params: ${params}`);
  ingredients[params - 1] = document.getElementById(
    "ingredient" + params
  ).value;
  let x = params - 1;
  localStorage.setItem(
    "scalerIngredient" + x,
    ingredients[params - 1]
  );
  tallyIt();
}

function deselectRecipe() {
  let chosen = document.getElementById("recipeSelect");
  chosen.selectedIndex = 0;
}



// Box Check Check
function boxCheckCheck() {
  checkTotal = 0;
  for (let index = 1; index <= 10; index++) {
    if (document.getElementById("rowcheck" + i).checked) {
      synced = false;
      // checkSync = true;
      checkTotal += document.getElementById("recipeSays" + index);
    }
  }
}


function captureValues() {
  var titleToShow = "";
  // Grab the name of the current recipe being displayed
  let chosen = document.getElementById("recipeSelect");
  whichRecipe = chosen.options[chosen.selectedIndex].innerHTML;
  if (whichRecipe = 'Choose a Recipe') {
    titleToShow = "Untitled";
  } else {
    titleToShow = whichRecipe;
  }
  // win.document.body.innerHTML += `<title> ${titleToShow}</title><div style="font-family: monospace">${titleToShow}</div>`;
  tallyIt(1);
}

// The purpose of this function is to sum all values to then determine the ratio each contributes to the whole
// BEFORE someone comes in and modifies the values.

function tallyIt(mode) {
  // var win = window("", whichRecipe, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=400, top=" + (screen.height - 400) + ",left=" + (screen.width - 840));

  // If mode is 1, it means that the contents of the table are being written to the recipe capture area so make it visible.
  if (mode > 0) {
    document.getElementById("displayRC").style.display = "revert";
  }

  // Reset the total weight of the recipe
  total = 0;
  totalImp = 0;

  // And calculate the new total (Along with some other doohickeys)
  for (let arrayCount = 0; arrayCount <= rs.length - 1; arrayCount++) {
    let fieldCount = arrayCount + 1;
    let tbWeight = 1,
      tsWeight = 1;
    if (ingredients[arrayCount].includes("Salt") || ingredients[arrayCount].includes("Pepper")) {

      //* Convert salt weight to Tbsp and tsp
      if (ingredients[arrayCount].includes("Salt")) {
        tbWeight = 10.134,
          tsWeight = 3.378;
      }

      //* Convert pepper weight to Tbsp and tsp
      if (ingredients[arrayCount].includes("Pepper")) {
        tbWeight = 6.9,
          tsWeight = 2.3;
      }

      // Get the rounded value for whole Tbsps
      let tBspVal = Math.trunc(rs[arrayCount] / tbWeight);

      // Get the remaider (modulus) for tsps
      let tspVal = (rs[arrayCount] % tbWeight) / tsWeight;

      // Convert the tsp amount to a multiple of .25 
      tspVal = (Math.round(tspVal * 4) / 4);

      // Now string the value, some spaces, and a label togehter into a variable
      let tBtsString = ``;
      if (tBspVal > 0) {
        tBtsString += ` ${tBspVal}Tbsp `;
      }

      if (tBspVal > 0 && tspVal > 0) {
        tBtsString += `,`;
      } else {
        // tBtsString += ` `;
      }

      if (tspVal > 0) {
        tBtsString += ` ${tspVal}tsp `;
      }

      // And put that string into the ingredient field
      if (mode != 3) {
        document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount] + tBtsString;
      }
    }
    //! end of salt maker

    //* Convert butter weight to cm/mm to cut
    if (ingredients[arrayCount].includes("Butter") && !ingredients[arrayCount].includes("Buttermilk")) {
      // Grab the weight of the ingredient (butter) and multiply it by the multiplier, depending on the kind of "stick" being used
      // console.log(`rsarray: ${rs[arrayCount]}`);
      let eTemp = Number(rs[arrayCount] * elgin).toFixed(1);
      let sTemp = Number(rs[arrayCount] * stubbie).toFixed(1);
      let euTemp = Number(rs[arrayCount] * euro).toFixed(1);

      // console.log(`eTemp: ${eTemp}`);
      // console.log(`sTemp: ${sTemp}`);

      // Now string the value, some spaces, and a label togehter into a variable
      // let mmString = ` - E ${eTemp}mm, S ${sTemp}mm`;
      let mmString = ` - Eu ${euTemp}mm`;

      // And put that string into the ingredient field
      document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount] + mmString;
    }
    // ! End Buttermaker

    // Grab the totals
    total += rs[arrayCount];
    // console.log(`rs[arrayCount]: ${rs[arrayCount]}`);
    rsI[arrayCount] = Number(rs[arrayCount] / 28.3495).toFixed(2);
    totalImp += Number(rsI[arrayCount]);
  }

  //			               11111111112222222222333333
  //            12345678901234567890123456789012345
  var spaces = ".....................................";

  let header = ["Ingredient", ".....Amt....Scaled"];

  let spacesNeeded = (header[0].length - 1);
  let spaceTemp = spaces.slice(spacesNeeded);

  header[3] = `${header[0]}${spaceTemp}${header[1]}`;

  // These two variables set up the code snippet
  let theAmts = "rs = [";
  let theIngredients = "ingredients = [";

  // If mode is 1, we're capturing the recipe to the text field so throw the header in there along with a line break.
  if (mode == 1) {
    // document.getElementById("recipeCapture").value += header[3] + "\n";
  }

  // As usual, we need to have TWO counters running; one for the fields and one LESS for the arrays
  for (let i = 1; i <= ingredients.length; i++) {
    let theIndex = i - 1;

    //* FOR THE AUTOMATIC GENERATION OF THE CODE SNIPPET
    // Generate the code snippet
    theAmts += `${rs[theIndex]}`;
    theIngredients += `"${ingredients[theIndex]}"`;

    if (i < ingredients.length) {
      theAmts += `, `;
      theIngredients += `, `;
    }

    // First, let's calculate the reciprocol of this ingredient (What you would need to multiply the amount by to get the total)
    let temp = total / rs[theIndex];
    recip[theIndex] = Number(temp);

    // Now, we do the reverse; determine what percentage of the whole this ingredient constitutes.
    temp = rs[theIndex] / total;
    perc[theIndex] = Number(temp);
    let temp2 = perc[theIndex] * 100;
    let decPlaces = 0;

    if (temp2 < 20) {
      decPlaces = 1;
    }

    if (temp2 < 10) {
      decPlaces = 2;
    }

    temp = parseFloat(temp2.toFixed(decPlaces));
    if (fives) {
      if (temp < 2.5) {
        temp = 1;
      } else {
        temp = Math.round(temp / 5) * 5;
      }
    }
    document.getElementById("perc" + i).value = `${temp}%`;

    // If this isn't a blank line, and we're not at the end, assemble a text version for the window
    if (rs[theIndex] != 0 && rs[theIndex] != undefined) {

      //  Calculate the scaled value as well
      let z = rs[theIndex].toFixed(1);
      let scaledValue = z * multiplier.toFixed(1);
      scaledValue = scaledValue.toString();
      // Convert the current quantity to a string
      z = z.toString();

      // Define all the spaces that might be needed - at least 1, at most 7 with 2 extra (so, 9)
      let spacer = ".........";
      let string1a = spacer.slice(z.length) + z;
      let string2a = spacer.slice(scaledValue.length) + scaledValue;

      let spacerPage = ".........";
      let string1b = spacerPage.slice(z.length) + z;
      let string2b = spacerPage.slice(scaledValue.length) + scaledValue;

      // If this line isn't blank (either just a space or empty), assemble the ingredients, spacers, and values for the text box
      if (ingredients[theIndex] != " " && ingredients[theIndex] != "") {
        // "The Line" is assembled - Make sure there is at least one ingredient in there or it goes boom
        if (ingredients.length > 0 && i <= ingredients.length) {
          let x = ingredients[theIndex].length;
          let textFromTheEnd = -1 * (spaces.length - x);
          let line = `${ingredients[theIndex]}${spaces.slice(textFromTheEnd)}${string1a} ${string2a}`;

          // If mode = 1, then we're capturing the recipe for the window so put it there.
          if (mode == 1) {
            // document.getElementById("recipeCapture").value += line + "\n";
            // win.document.body.innerHTML += '<div style="font-family: monospace">' + linePage + "</div>";
          }
        }
      }
    }
  }
  // Mode 1 means we're just capturing the recipe. 
  if (mode == 1) {
    // 56 positions
    // document.getElementById("recipeCapture").value += "________________________________________________________" + "\n";

    let footer = ["Total"];
    footer[1] = document.getElementById("totalOrig").value + "   " + document.getElementById("totalScaled").value + "\n";
    let spaces2 = "........................................................";
    let temp9 = footer[0].length + footer[1].length - 1;
    footer[2] = `${footer[0]}${spaces2.substring(temp9)}${footer[1]}`;
    // document.getElementById("recipeCapture").value += footer[2];

  }

  // Finalize the code snippet
  theAmts += `];`;
  theIngredients += `];`;
}

// This function counts the number of rows with a check.
// If it's two or more, then bothChecked is set to true to allow for the calculations to take place.
function countChex(mode) {
  rowsChecked = 0;
  combinedRows = 0;
  pairTotal = 0;

  // Comb through the rows
  for (let i = 1; i <= 10; i++) {
    // If mode = 100, that means sync has been checked so clear all checkboxes
    if (mode == 100) {
      document.getElementById("rowcheck" + i).checked = false;
      synced = true;
      colorSyncedFields();

    } else {

      // If mode != 100, that means we're scanning to see which rows are checked
      if (document.getElementById("rowcheck" + i).checked) {

        // If this row is checked, increment a counter by one.
        // At 1, the row number and value of that row is noted.
        // Synced is made false and the appearance of the fields is updated
        rowsChecked += 1;
        if (rowsChecked == 1) {
          checked1 = i;
          synced = false;
          bothChecked = false;
          colorSyncedFields();
        }

        // If it's two, we now have a sufficient number to work with.
        // Note this row in checked2, grab a total of the VALUES of these fields, as well as the total value of their row numbers which will always give us the other.
        if (rowsChecked == 2) {
          checked2 = i;
          bothChecked = true;
          combinedRows = checked1 + checked2;

          pairTotal =
            Number(document.getElementById("recipeSays" + checked1).value) +
            Number(document.getElementById("recipeSays" + checked2).value);

          // Colorize the first row checked
          document.getElementById("row" + checked1).style.backgroundColor = "#79588f";
          // Colorize the second row checked
          document.getElementById("row" + checked2).style.backgroundColor = "#79588f";

        }
      } else {
        document.getElementById("row" + i).style.backgroundColor = "";
      }

      // If a third row is checked, then uncheck it IF it is BELOW the two currently selected ones. Otherwise, uncheck the last one
      // (Not really by design, just how it turned out.)
      if (rowsChecked >= 3) {
        document.getElementById("rowcheck" + i).checked = false;
        document.getElementById("row" + i).style.backgroundColor = "";
        // console.log(`THE ROW IS: ${i}`);
      }
    }
  }
}

// This handles wheen two ingredients are linked and one is being balanced for the other.
function shiftIngredient(which) {

  // If both (two) ingredients are checked/linked
  // Grab the changed value from the field
  if (bothChecked) {
    var y = Number(document.getElementById("recipeSays" + which).value);

    // If the value that was input is GREATER than the sum of both ingredients, then limit it to that amount.
    if (y > pairTotal) {
      y = pairTotal;
      document.getElementById("recipeSays" + which).value = y;
    }
    // If the value that was input is SMALLER than the sum of both ingredients, then limit it to 0.
    if (y < 0) {
      y = 0;
      document.getElementById("recipeSays" + which).value = y;
    }

    // With the input validated, update the respective value in the array at the which-1 position
    rs[which - 1] = y;

    // * recipRow is the total of both rows MINUS the current one.
    let recipRow = combinedRows - which;

    // * Likewise, recipTotal is the combined values of both checked fields
    let recipTotal = pairTotal - y;
    document.getElementById("recipeSays" + recipRow).value = fixDigits(recipTotal);
    rs[recipRow - 1] = recipTotal;

    console.log(`Modding ROW ${recipRow}, ARRAY #${recipRow - 1}, amounts are ${rs}`);

    // Get the imperial units version and populate the Oz field
    recipTotal = recipTotal / 28.35;
    document.getElementById("recipeSaysImp" + recipRow).value = fixDigits(recipTotal);

    console.log(`rs: ${rs}`);

    // Now, update the other fields accordingly
    // updateMultiplier();
    // tallyIt();
  }
}


//* This handles when imperial values are input (which is rare, but it happens)
function impInput(which) {

  // Let's grab that value in a temp variable and do some validation on it FIRST.
  let tempInput = Number(document.getElementById("recipeSaysImp" + which).value);

  if (tempInput > 0 && tempInput != NaN) {
    rs[which - 1] = tempInput * 28.3495;
    document.getElementById("recipeSays" + which).value = parseFloat(rs[which - 1]);
    updateRS(which, 1);
  } else {
    document.getElementById("recipeSaysImp" + which).value = parseFloat((rs[which - 1] / 28.3495));
  }
}


function updateRS(which, impOrNot) {

  // First, let's get an offset value. What was input as a field value is one more than the array position, as always.
  let whichOffset = which - 1;

  // This handles wheen two ingredients are linked and one is being balanced for the other.
  if (bothChecked) {
    shiftIngredient(which);
  }

  //First, confirm we're synced
  if (synced == true) {
    // If so, grab the value from the RS field that's being changed and update the respective array value with it
    temp = "hey";
    if (recip[whichOffset] > 0 && perc[whichOffset] > 0 && temp != "") {
      let grabTemp = Number(document.getElementById("recipeSays" + which).value);
      // If grabTemp is a valid value (above 0 and not a NAN), update the array
      if (grabTemp > 0 && grabTemp != NaN) {
        rs[whichOffset] = grabTemp;
        // if it's NOT a valid value, restore the the current array value to the field.
      } else {
        document.getElementById("recipeSays" + which).value = rs[whichOffset];
      }

      // Calculate the total based on the reciprocol for this field
      let tempTotal = Number(rs[whichOffset] * recip[whichOffset]);

      // Now, go populate the other fields with the respective percentages for each
      for (let i = 0; i <= ingredients.length - 1; i++) {
        // Set a + 1 offset to affect the field rather than the array value being set
        fieldOffset = i + 1;

        // If the current row is NOT the one being changed, update the other METRIC values
        if (which != fieldOffset) {
          rs[i] = perc[i] * tempTotal;
          //! This is the line that basically determines whether this crap works or not

          if (perc[i] != 0) {
            let temp = Number.parseFloat(rs[i]);
            document.getElementById("recipeSays" + fieldOffset).value = fixDigits(temp);
            let temp2 = fixDigits(temp);
          }
        }

        // if (impOrNot == 1)
        if (rs[i] != NaN) {
          var tempErate = Number(rs[i] / 28.3495);
        }
        document.getElementById("recipeSaysImp" + fieldOffset).value = fixDigits(tempErate);
      }
    } else {
      colorSyncedFields();
    }
    updateMultiplier();
    tallyIt(which);
  } else {
    rs[whichOffset] = Number(document.getElementById("recipeSays" + which).value);
    document.getElementById("youWant" + which).value = rs[whichOffset] * multiplier;
    localStorage.setItem("recipeSays" + which, rs[whichOffset]);

    // Update the imperial units column while you're at it
    let temp2 = Number(rs[whichOffset] / 28.3495);

    document.getElementById("recipeSaysImp" + which).value = fixDigits(temp2);
  }
  updateTotals();
}

function fixDigits(value) {
  let digits = 30;
  if (value > 50) {
    digits = 0;
  }
  if (value < 50) {
    digits = 1;
  }
  if (value < 20) {
    digits = 2;
  }
  // if (value < 10) {
  //   digits = 3;
  // }

  value = parseFloat(value.toFixed(digits));
  return value;
}

// Store/get values from local storage
// 0 = Read, 1 = Write, 2 = Write
// ! For the current row
function getValues(getPut, rowCount) {
  var arrayCount = rowCount - 1;

  //* If 0, we're GETTING values for this row
  if (getPut == 0) {

    rs[arrayCount] = Number(localStorage.getItem("recipeSays" + arrayCount));
    youWant[arrayCount] = Number(localStorage.getItem("youWant" + arrayCount));

    document.getElementById("recipeSays" + rowCount).value = rs[arrayCount];
    document.getElementById("youWant" + rowCount).value = youWant[arrayCount];

    updateMultiplier();
  }

  //* If 1, PUT array values in local storage
  if (getPut == 1) {
    // var x = document.getElementById("recipeSays" + rowCount).value;
    // rs[arrayCount] = parseFloat(x);
    // youWant[arrayCount] = document.getElementById("youWant" + rowCount).value;
    multiplier = document.getElementById("multiplier").value;
  }

  // write the info for the current row, along with the current multiplier value, to local storage.
  if (getPut == 2) {
    localStorage.setItem("recipeSays" + arrayCount, rs[arrayCount]);
    localStorage.setItem("youWant" + arrayCount, youWant[arrayCount]);
    localStorage.setItem("multiplier", multiplier);
  }
}

// Here for sentimental value. This will strip tab characters from the text window if it is used as "scratch" space for a recipe being converter
function noTabs() {
  theString = document.getElementById("origRecipe").value;

  while (theString.search("\t") > 0) {
    var temp = theString.replace("\t", "");
    theString = temp;
  }
  document.getElementById("origRecipe").value = theString;
}

//* If all else fails, turn it off and back on again.
function resetAll() {

  synced = false;
  syncTheVals(1);
  multiplier = 1;

  document.getElementById("multiplier").value = multiplier;
  localStorage.setItem("multiplier", multiplier);

  document.getElementById("originalScale").value = 1;
  localStorage.setItem("originalScale", 1);

  document.getElementById("newScale").value = 1;
  localStorage.setItem("newScale", 1);

  document.getElementById("portions").value = 1;
  portionIt();

  changeRecipe(1);
}

//* One dimmer to rule them all
function masterDimmer(whichDim, whichBlock) {

  let dimmed = document.getElementById(whichDim).checked;

  let elements = document.getElementsByClassName(whichBlock);

  for (var i = 0; i < elements.length; i++) {
    if (!dimmed) {
      elements[i].className += " darkened";
    } else {
      elements[i].className = whichBlock + " rightAlign";
    }
  }
}


// Dims the imperial values to prevent them from accidentally being confused with the value being used.
function dimple() {
  let dimmed = document.getElementById("dimImp").checked;
  let elements = document.getElementsByClassName("theBlocksMetI");

  for (var i = 0; i < elements.length; i++) {
    if (!dimmed) {
      elements[i].className = "theBlocksMetI rightAlign darkened";
    } else {
      elements[i].className = "theBlocksMetI rightAlign";
    }
  }
}

// Dims the original values to prevent them from accidentally being confused with the value being used.
function dimOrig() {
  let elementsM = document.getElementsByClassName("theBlocksMet");
  let dimmed = document.getElementById("dimMet").checked;

  for (var i = 0; i < elementsM.length; i++) {
    if (!dimmed) {
      elementsM[i].className += " darkened";
    } else {
      elementsM[i].className = "theBlocksMet rightAlign";
    }
  }
}

function clearWindow(which) {
  if (which == 2) {
    document.getElementById("origRecipe").value = "";
  } else {
    // document.getElementById("recipeCapture").value = "";
  }
}

function sendToWeight() {
  localStorage.setItem("fromScaler", true);
  let reciportions = document.getElementById("portions").value;
  localStorage.setItem("reciPortions", reciportions);
  let temp = document.getElementById("totalOrig").value;
  localStorage.setItem("fromScalerTotal", temp);
  window.open("weight.html", "_blank");
}

function addThis(row) {
  quickSum += rs[row - 1];
  quickSum = parseFloat(quickSum.toFixed(2));
  // console.log(`Total So Far: ${quickSum}`);
}

function resetRunner() {
  quickSum = 0;
  // console.log(`Total reset to: ${quickSum}`);
}

function getPercs() {
  percString = "";
  perc.forEach(spitit);
  alert(percString)
};

function spitit(item, index, arr) {
  let rando = arr;
  let temp = item * 100;
  let temp2 = parseFloat(temp.toFixed(1));
  console.log(`${ingredients[index]} - ${temp2} % `);
  percString += `${ingredients[index]} - ${temp2} %\n`;
}

function toggleFives() {
  fives = !fives;
  document.getElementById("fivesCheck").checked = fives;
  tallyIt();
}

function updateHydration() {
  wetIngs = 0, dryIngs = 0, hydration = 0;
  for (let x = 0; x < recipe.length; x++) {
    // ingredients[x] = recipe[x][0];
    // rs[x] = Number(recipe[x][1]);
    // dryWetNull[x] = recipe[x][2];

    // let tempColor = "#24342466"; // This is the default color


    switch (dryWetNull[x]) {

      // If it's a dry ingredient, it gets a custom color
      case "d":
        dryIngs += Number(rs[x]);
        // tempColor = "#7b8f6cbd"; // Dry Color
        break;

      // If it's a wet ingredient, it gets a custom color
      case "w":
        wetIngs += Number(rs[x]);
        // tempColor = "#3865b7"; // This is the wet color
        break;

      // If it's starter, it gets a custom color AND contributes equally to wet and dry ratios
      case "s":
        wetIngs += Number(rs[x]) * .50;
        dryIngs += Number(rs[x]) * .50;
        // tempColor = "#dfa62566"; // This is the STARTER COLOR 
        break;

      // If it's "N", it is neutral and contrinutes to neither; For example, olive oil
      case "n":
        tempColor = "#ffffff66"; // This is the NULL color
        break;

      // If all else fails "N", it is neutral and contrinutes to neither; For example, olive oil
      default:
        tempColor = "#ffffff66"; // This is the NULL color
        break;
    }

    // document.getElementById("checkRow" + (x + 1)).style.backgroundColor = tempColor;
  }


  hydration = wetIngs / dryIngs * 100;

  console.log(`wetIngs: ${wetIngs}`);
  console.log(`dryIngs: ${dryIngs}`);

  // Set the hydration amount + a % symbol
  document.getElementById("hydration").value = parseFloat(hydration.toFixed(2)) + "%";

  let hyTotal = wetIngs + dryIngs;
  let temp = wetIngs / hyTotal * 100;
  temp = parseFloat(temp.toFixed(1));
  wd = `Wet: ${temp}%`;
  temp = dryIngs / hyTotal * 100;
  temp = parseFloat(temp.toFixed(1));
  dd = `Dry: ${temp}%`;

  document.getElementById("dryDration").value = dd;
  document.getElementById("wetDration").value = wd;
}


function parseTokens(text) {
  // Replace *text* with <strong>text</strong>
  text = text.replace(/\*([^\*]+)\*/g, '<strong>$1</strong>');
  // Replace _text_ with <em>text</em>
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Replace `text` with <code>text</code>
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
  console.log(text);
}

// Example usage:
const input = "This is *bold*, _italic_, and `code`.";
const output = parseTokens(input);
console.log(output);
// Output: This is <strong>bold</strong>, <em>italic</em>, and <code>code</code>.
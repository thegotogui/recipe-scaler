
let amounts = [],
  bothChecked = false,
  checked1 = 0,
  checked2 = 0,
  combinedRows = 0,
  dimmed = false,   // Holds the current state of the original values column's dimmed status
  dimmedI = false,  // Holds the current state of the Imperial column's dimmed status
  elgin = .105726,  // Elgin butter weight factor
  stubbie = .073127,// Stubbie butter weight factor
  euro = .0428,     // European butter weight factor
  roundToFives = false,    // Whether ~5|1 is checked
  gramsPerOunce = 28.3495, // Grams per ounce conversion factor
  ingLength,        // Holds the number of ingredients in the current recipe
  ingredient,       // Temporary variable to hold ingredient name
  ingredientColorMode = 1, // 1 = color by ingredient, anything else, color by hydration
  ingredients = [], // Array that holds the ingredient names
  dryWetNull = [],  // Array that holds whether the ingredient is dry, wet, or neutral
  markdown,         // Holds the recipe instructions in markdown format
  multiplier = 1,   // Variable that holds the multiplier
  newScaleVar,      // The desired ratio
  originalScaleVar, // The original ratio of the recipe being calculated
  pairTotal = 0,    // Holds the totalWeight of the selected rows for rebalancing
  ingredientPercent = [],        // Percentage of x reciprocal
  percentages = [], // Array that holds the percentages
  percString,       // Holds the percentages as a string for display
  pieChartVis = false, // Holds the visibility status of the pie chart
  quickSum = 0,     // Holds the quick sum of selected rows
  reciprocal = [],       // Reciprocol
  recipe,           // Holds the current recipe as a 2D array
  recipeName,       // Holds the name of the current recipe MINUS the &nbsp;&nbsp; that is used to make the dropdown look nicer
  recipeSteps,      // Holds the recipe instructions
  reciPortions = 0,
  recipeMaxLength = 0, // Holds the maximum number of ingredients in the current recipe (capped at 10)
  rowCount,               // Which FIELD/Row is being edited
  rowsChecked,
  recipeAmounts = [],                // "Recipe says" =- Array that holds the quantities
  recipeAmountsImperial = [],               // "Recipe says" =- Array that holds Imperial equivalents
  headers = [],           // Defines which rows will have headers and what they'll contain
  suppressAlerts = false, // Suppresses alerts when making recipe cards
  synced,                 // Holds the status of synchronization of weights between the ingredients
  thisAmount,
  totalWeight = 0,        // Holds totalWeight of all metric weights
  totalWeightImperial = 0,     // Holds totalWeight of all imperial weights
  which,
  whichRecipe,
  scaleVisible = false,    // Holds the visibility status of the scaling area
  hydrationVisible = true,   // Holds the visibility status of the hydration area  
  portionsVisible = true,   // Holds the visibility status of the portion area
  scaledAmounts = [];


const $id = id => document.getElementById(id);
const setValue = (id, value) => {
  const el = $id(id);
  if (el) el.value = value;
};
const setText = (id, text) => {
  const el = $id(id);
  if (el) el.innerHTML = text;
};
const setChecked = (id, checked) => {
  const el = $id(id);
  if (el) el.checked = checked;
};
const setStyle = (id, prop, value) => {
  const el = $id(id);
  if (el) el.style[prop] = value;
};
const setDisplay = (id, visible) => {
  const el = $id(id);
  if (el) el.style.display = visible ? "" : "none";
};
const toggleState = (current, showHide) => {
  if (showHide === "toggle" || showHide === undefined) {
    return !current;
  }
  return showHide;
};

const roundToDecimals = (value, decimals) => parseFloat(value.toFixed(decimals));
const getPercentDisplay = (value, useFives = false) => {
  if (!useFives) {
    return `${value}%`;
  }

  if (value < 1) {
    return "<1";
  }

  if (value < 5) {
    value = Math.round(value);
  } else {
    value = Math.round(value / 5) * 5;
  }

  return `~${value}%`;
};


function versions() {
  console.log(`--VERSION----TWEAKS & CHANGES----
31.05.2026 - Recipes are now an external file taking up far less room in the core JS file.
07.04.2026 - Reset now ALSO correctly resets the background colors to clear.
21.03.2026 - Reset now correctly unchecks every checkbox with a fancy query selector thing function AND resets the dropdown to the default "Choose a recipe" option.
26.01-2026 - Restored the butter and salt calculations that were removed in the last edit. Somehow.
25.01.2026 - Adjusted serving size of the al dente pasta to 233g totalWeight.
17.01.2026 - Made the attribute fields so they can manually shown/hidden by the button or by another function.
27-09-2025 - Reduced the amount of water in the polenta. Was a bit thin.
01-09-2025 - Added Chitarra pasta recipe and Turmeric Chicken recipe.
19-07-2025 - This is the latest and greatest STABLE version
20-06-2025 - Ingredients are now colored by ingredient, not hydration.
09-06-2025 - App now supports complete recipe descriptions via markdown formatting.
11-05-2025 - Categories break up the recipe (if available). Also fixed the issue where the synced value was returned as a string and broke syncing.
17-03-2025 - Fixing the white synced label AGAIN and adding the Roma Rice recipe AGAIN.
11-03-2025 Recovery from a fuckup in versioning  
01-03-2025 - Updated Sourdough Crepe Recipe with a bit more flour for structure and a tad less tartness.
23-02-2025 - Changed how neutral ingredients are handled in hydration
        Currently, changing a recipe changes the color of ingredients, but recalling from app storage doesn't.
        Arrays are not stored the same way so the length gets wonked and, presumably, so does the array itself.`);
}


// Color-to-ingredients mapping
const ingredientColors = {
  "#fff6a2": ["Butter", "Buttermilk", "Canola Oil", "White Wine", "Garlic"],
  "#FFFFFF": ["Yogurt", "Greek Yogurt", "Baking Powder", "Baking Soda", "Cornstarch", "Stracciatella", "Flour", "AP Flour", "Bread Flour", "Mayo", "Milk", "Ricotta"],
  "#F2F2F2": ["Rice", "Salt", "Sugar", "Sour Cream", "Lard"],
  "#fdfea2": ["Apple Cider Vinegar", "Mirin", "Rice Vinegar", "Lemon Juice", "Parmesan", "Garlic Clove", "Powdered Garlic", "Dijon Mustard", "Mustard", "Gnocchi", "Yuzu", "Vegetable Oil", "Canola Oil", "Neutral Oil", "Dry Sake"],
  "#FEE580": ["Egg"],
  "#ff3900": ["Tomato", "Tomato Sauce", "Gochujang", "Samjang", "Red Wine Vinegar", "Harissa", "Paprika", "Chili Powder", "Chipotle", "Smoked Paprika", "Cayenne", "Red Bell Pepper", "Campari"],
  "#A2DFF7": ["Water", "Vinegar"],
  "#73b28c": ["Celery", "Scallion", "Olive Oil", "EVOO"],
  "#529148": ["Thyme", "Capers", "Asparagus", "Dill", "Basil", "Kale", "Mint"],
  "#007a0a": ["Parsley", "Kombu", "Oregano", "Spinach", "Zucchini", "Green Bell Pepper", "Green Chili Pepper", "Green Beans", "Broccoli", "Cilantro"],
  "#f4a261": ["Carrot"],
  "#ffae00": ["Yolks", "Egg Yolk"],
  "#ffd200": ["Cheese"],
  "#ffdeb7": ["Whole Wheat Flour", "Panko", "Bread Crumbs", "Rye Flour", "WW Flour", "Chicken Stock", "Chicken Broth"],
  "#fdeab0": ["Onion", "Powdered Onion", "Yeast", "Tuna", "Pecorino", "Aged Pecorino", "Fresh Pecorino", "Pecorino Romano", "Pecorino Sardo"],
  "#e6a500": ["Honey", "Coleman's", "Light Miso", "Rum", "Spiced Rum", "Dark Rum", "Light Rum", "Tequila", "Mezcal", "Whiskey", "Bourbon", "Scotch", "Brandy", "Cognac", "Turmeric"],
  "#ffee00": ["Cornmeal", "Semolina", "Lemon Zest", "Pineapple"],
  "#d2c59a": ["Sourdough Starter", "Masa", "Cumin", "Farro", "White Pepper", "Polenta", "Horseradish"],
  "#fffce5": ["Spaghetti", "Fetuccini", "Carnaroli", "Arborio", "Pasta"],
  "#fd99c8": ["Shallot", "Katsuobushi", "Chicken Thighs"],
  "#a48054": ["Potato", "Ginger", "Anchovy", "Buckwheat", "Teff Flour", "Rye Flour", "Lentils", "Almonds", "Beef Stock"],
  "#c53333": ["Ground Beef", "Aleppo Pepper", "Chorizo", "Sausage", "Chili Flakes", "Red Pepper Flakes", "Tabasco Sauce", "Cholula"],
  "#464543": ["Black Pepper"],
  "#008ad0": ["Curacao", "Curaçao"],
  "#503800": ["Guinness", "Worcestershire", "Soy Sauce", "Brown Miso", "Shoyu", "Dark Beer"],
};

// Function to find the color of a given input ingredient (partial match)
function getIngredientColor(input) {
  const lowerInput = input.toLowerCase();
  let ingCount = 0;

  for (const [color, ingredients] of Object.entries(ingredientColors)) {
    for (const ingredient of ingredients) {
      if (lowerInput.includes(ingredient.toLowerCase())) {
        // console.log(ingredient);
        // console.log(`ingCount: ${ingCount}`);
        return color;
      }
    }
    // return "#CCCCCC"; // Default color if no match
  }
}



//* The startup routine
function initializeArray(mode) {

  console.log(`To spit out recipe cards, use makeRecCards(x); where x is the number of recipes to generate. There's probably a smarter way to do this now that I'm typing it.\n\nTo see versions, use versions();`);

  // * Set the focus to the list dropdown
  document.getElementById("recipeSelect").focus();

  // If this is the first time the page is opened on a new device and there is no storage flag set, none of the arrays have been put into memory.
  // Set the mode to 1 which will trigger a full reset and create local storage slots.
  if (localStorage.getItem("scinitialized") == null) {
    localStorage.setItem("scinitialized", 1);
    mode = 1;
  }

  recipe = localStorage.getItem("theRecipe");
  console.log(`Prior Recipe: ${recipe}`);


  // Hide scaling, hydration, and portions areas
  // This is deprecated because, at this point, there is no table yet so calling this function does nothing.
  // shScaling(false);
  shHydration(false);
  shPortions(false);

  // Lesson learned; the recipe triggers the table and, only then, will the checkboxes match the status.
  changeRecipe(1);

  // This sets the dim color of the columns to match the checkboxes
  updateAllDimmers();
  updateSyncButton();
}





function updateAllDimmers() {
  masterDimmer('dimImp', 'theBlocksImp');
  masterDimmer('dimMet', 'theBlocksMet');
  masterDimmer('dimScale', 'theBlocksSc');
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


// ****************************************************************************************************
// * Make way for the JSON version I've been promising for a year 
// ****************************************************************************************************

var jsonRecipes;

function loadJson(params) {
}

async function loadRecipes(path = "recipes.json") {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load recipes: ${response.status}`);
  return response.json();
}

function findRecipeByName(recipes, name) {
  const query = name.toLowerCase().trim();
  return recipes.find(recipe => recipe.title.toLowerCase().includes(query));
}

function displayRecipe(recipe) {
  if (!recipe) {
    console.log("Recipe not found.");
    return;
  }

  console.log(`
============================
  ${recipe.title}
============================
${recipe.description}

Cuisine:    ${recipe.meta.cuisine}
Difficulty: ${recipe.meta.difficulty}
Servings:   ${recipe.meta.servings}

Time:
  Prep:  ${recipe.time.prep_minutes} min
  Cook:  ${recipe.time.cook_minutes} min
  Total: ${recipe.time.total_minutes} min

Ingredients:
${recipe.ingredients.map(i => `  - ${i.amount}${i.unit} ${i.name}${i.notes ? ` (${i.notes})` : ""}`).join("\n")}

Instructions:
${recipe.instructions.map(s => `  ${s.step}. ${s.title}: ${s.description}`).join("\n")}
  `);
}

// --- Usage ---
async function main(recipe) {
  try {
    const recipes = await loadRecipes("scalerRecipes.json");
    const result = findRecipeByName(recipes, recipe);
    jsonRecipes = result;
    displayRecipe(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}


//* User has chosen a preset recipe from the dropdown. Populate the various fields as well as the various arrays.
function changeRecipe(isItResetting) {

  // Reset stuff that may have been set from before
  recipeSteps = "";
  headers = [];
  markdown = "";
  recipe = [];
  recipeAmounts = [];
  ingredients = [];


  let chosen = document.getElementById("recipeSelect");

  if (isItResetting == 1) {
    whichRecipe = "Reset";
    chosen.selectedIndex = 0;
  } else {
    whichRecipe = chosen.options[chosen.selectedIndex].innerHTML;
  }

  // If the user hasn't chosen a recipe, let them know, reset the dropdown, and exit this function.
  if (!suppressAlerts) {
    if (whichRecipe.includes("Choose") || whichRecipe.includes("BREADS") || whichRecipe.includes("DRESSINGS") || whichRecipe.includes("PASTAS") || whichRecipe.includes("SAUCES") || whichRecipe.includes("OTHER") || whichRecipe.includes("DRINKS") || whichRecipe.includes("RICES") || whichRecipe.includes("SIDES")) {
      alert("That's a category. Please choose a recipe from the dropdown.");
      chosen.selectedIndex = 0;
      return;
    }
  }


  //* Ask recipes.js for the data for this recipe name.
  const recipeData = goGetRecipe(whichRecipe);

  if (recipeData) {
    recipe = recipeData.recipe;
    markdown = recipeData.markdown ?? "";
    headers = recipeData.headers ?? [];
    reciPortions = recipeData.reciPortions ?? 0;
    synced = true;
  } else if (!suppressAlerts) {
    alert("No recipe has been triggered.");
  }

  localStorage.setItem("theRecipe", recipe);

  //* Stick the title of the recipe in the title section (without the spaces)
  recipeName = whichRecipe.replace("&nbsp;&nbsp;", "");
  document.getElementById("recipeTitle").innerHTML = recipeName;
  document.getElementById("titleRow").style.display = "";

  //* Load the variables into the ingredients and quantities arrays
  var wetIngs = 0, dryIngs = 0, hydration = 0;

  for (let x = 0; x < recipe.length; x++) {
    ingredients[x] = recipe[x][0];
    recipeAmounts[x] = Number(recipe[x][1]);
    dryWetNull[x] = recipe[x][2];

    if (dryWetNull[x] != undefined) {

      switch (dryWetNull[x]) {

        case "d":
          dryIngs += Number(recipe[x][1]);
          break;

        case "w":
          wetIngs += Number(recipe[x][1]);
          break;

        // If it's starter, it contributes equally to wet and dry ratios
        case "s":
          wetIngs += Number(recipe[x][1]) * .50;
          dryIngs += Number(recipe[x][1]) * .50;
          break;

        // If it's "N", it is neutral and contrinutes to neither; For example, olive oil
        case "n":
          break;

        // If all else fails "N", it is neutral and contrinutes to neither; For example, olive oil
        default:
          break;
      }
    } else {
      wetIngs = 0;
      dryIngs = 0;
    }
  }


  /*
------------------------------------------------------------------------------
Hydration Station - What's your function
------------------------------------------------------------------------------
  */

  hydration = wetIngs / dryIngs * 100;

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


  //* With all the prep out of the way,
  //* Go build the table based on the recipe array. This will also populate the ingredients and recipeAmounts arrays, which are used for calculations and display throughout the rest of the program. It will also populate the dryWetNull array, which is used to determine how each ingredient contributes to the hydration calculation.
  //* This can only happen AFTER the recipeAmounts array is defined because construction of the main table
  //* relies on the recipeAmounts array to determine how many rows to make. So it has to be after we load the recipe into the recipeAmounts array but before we write the values to the fields because, well, there won't BE any fields until we
  makeTable();

  //* Colorize the ingredients based on their type.
  colorizeIngredients();

  // * Render an updated table based on the length of the new ingredients list.
  populateTable();

  // * Colorize the ingredients again because the table got wiped and the colors got wiped with it. This is a bit of a hack but it works.
  colorizeIngredients();

  // * Now go put equivalent amounts for salt and butter in the respective fields
  butterAndSalt();

  // * Show the recipe in the recipe steps area
  showRecipe();

  // * If there is a portion value, include that as well
  if (reciPortions > 0) {
    document.getElementById("portions").value = reciPortions;
    portionIt();
    shPortions(true);
  }


  // * Do a tally of the various variables
  updateTotals();
  updateMultiplier();

  // * Update the field colors based on sync status (This had to be done last for some reason.)
  colorSyncedFields();

  // * Update all dimmers
  updateAllDimmers();

}


function populateTable() {
  for (let arrayCount = 0; arrayCount < recipeAmounts.length; arrayCount++) {
    let fieldCount = arrayCount + 1;
    // Once the values are loaded, write them to the arrays
    // Update the class of this row to reflect either a middle or the bottom of the list
    // Write those values to the fields
    document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount];
    document.getElementById("recipeSays" + fieldCount).value = recipeAmounts[arrayCount];
    let temp = Number(recipeAmounts[arrayCount] / gramsPerOunce);
    document.getElementById("recipeSaysImp" + fieldCount).value = fixDigits(temp);
  }
}


function makeTable() { // Make the table rows for the ingredients. We have to do this after we parse the headers, because the headers may change the row numbers of the ingredients. So we have to wait until we know where the ingredients are before we can write them in.

  console.log(`MakeTable has been triggered`);

  // *Go get the (blank) table body so we can write the rows into it.
  let theBody = document.getElementById('tableBody');

  // Clear out any prior rows that may have been left from before
  theBody.innerHTML = '';

  // Loop through the recipe and write the rows in. We start at 1 because the first row is the title row, which is already in the HTML and doesn't need to be generated.
  for (let index = 1; index <= recipeAmounts.length; index++) {

    let tr = document.createElement('tr');
    tr.id = 'row' + index;

    let temp = `
  <tr id="row${index}">
      <td colspan="2" class="tColumn1 synced" id="checkRow${index}">
        <input type="checkbox" class="syncBox rowCheck" id="rowcheck${index}" oninput="countChex(${index});">
          <input class="theBlocksL" type="text" id="ingredient${index}" placeholder="Ingredient" oninput="updateIngredient(${index});">
      </td>
      <td class="tColumn3">
        <input class="theBlocksL rightAlign" type="text" id="ingredientPercent${index}">
      </td>
      <td class="tColumn2 synced" id="syncable${index}">
        <div style="display:flex; flex-wrap: nowrap;">
          <input class="theBlocksMet rightAlign" type="number" id="recipeSays${index}" oninput="updateRS(${index});" onclick="this.select(); addThis(${index});">
          <input type="checkbox" onClick="sumSelectedRows();" class="sumCheckBox" id="sumCheck${index}" style="padding-left: 10px;">
        </div>
      </td>
      <td class="tColumn3 synced" id="syncableImp${index}">
        <input class="theBlocksImp rightAlign" type="number" id="recipeSaysImp${index}" oninput="impInput(${index});" onclick="this.select();">
              </td>
              <td class="tColumn4 synced" id="youWantRow${index}">
                <input class="theBlocksSc rightAlign" type="number" id="scaledAmounts${index}" readonly>
              </td>
    </tr>
`;
    tr.innerHTML = temp;
    theBody.appendChild(tr);
    // console.log(`Row HTML for row ${index} is ${temp}`);
  }
  shScaling();
}



function showRecipe(params) {

  if (whichRecipe != undefined && whichRecipe != "Reset") {
    //* Output the recipe to the recipe steps area
    // First, clear it out by putting in ONLY the recipe name but even before that, strip out the spaces
    // let recipeNameTemp = whichRecipe.replace("&nbsp;&nbsp;", "");
    let theRecipeString = `<h1>${recipeName}</h1><table align="center" class="table.dark">
  <tr><td width="40%" style="vertical-align: top"><table width="100%"><tbody><tr><td colspan="2"><h2>Ingredients</h2></td></tr>`;
    //   theRecipeString += `<table align="center" class="table.dark">
    // <tr><td width="40%" style="vertical-align: top"><table width="100%"><tbody><tr><td><h2>Ingredients</h2></td></tr>`;

    // console.log(recipeMaxLength);
    for (let index = 0; index < recipe.length; index++) {
      // Write these amounts to the recipe area in the opposite order (weight then ingredient)
      let temp = recipeAmounts[index].toFixed(0);
      theRecipeString += `<tr><td class="recipeStepsAmt">${temp}g</td><td class="recipeStepsIng">${ingredients[index]} </td></tr>`;
    }
    // Close the table of ingredients
    theRecipeString += `</tbody></table></td><td id="recipeStepsContent" width="60%" style="vertical-align: top; padding-left: 20px;">`;

    // In one fell swoop, this converts the markdown recipe into HTML and puts it in the recipeSteps div.
    // This is a bit of a hack, but it works. It uses the marked.js library to convert the markdown into HTML.
    // Convert it and add it to the HTML string
    if (markdown != "") {
      theRecipeString += marked.parse(markdown);
    } else {
      theRecipeString += `<h2>Instructions</h2><h4>No instructions provided for this recipe. Go with your gut!</h4>`;
    }
    theRecipeString += `</td></tr></table>`;

    // Now stick that whole string into the recipeSteps div
    document.getElementById("recipeSteps").innerHTML = theRecipeString;
  }
}



function colorizeIngredients() {
  if (ingredientColorMode == 1) {
    let targetId;

    for (let x = 1; x <= recipeAmounts.length; x++) {
      targetId = ingredients[x - 1];
      let thisIngColor = getIngredientColor(targetId);
      document.getElementById("checkRow" + x).style.backgroundColor = thisIngColor;
      // console.log(`${targetId} is ${thisIngColor}, row is ${x}`);
    }
  }
}


function shScaling(showHide) {
  scaleVisible = toggleState(scaleVisible, showHide);
  setDisplay("scalerArea", scaleVisible);
  setColumnVisibility("tColumn4", scaleVisible);
}

function setColumnVisibility(columnClass, visible) {
  document.querySelectorAll(`.${columnClass}`).forEach(cell => {
    cell.style.display = visible ? '' : 'none';
  });
}


function shHydration(showHide) {
  hydrationVisible = toggleState(hydrationVisible, showHide);
  setDisplay("hydrationRow", hydrationVisible);
  setDisplay("wetDryRow", hydrationVisible);
}

function shPortions(showHide) {
  portionsVisible = toggleState(portionsVisible, showHide);
  setDisplay("portionatorRow", portionsVisible);
}


function butterAndSalt(mode) {
  let saltWeight = 0;
  for (let arrayCount = 0; arrayCount <= recipeAmounts.length - 1; arrayCount++) {
    let fieldCount = arrayCount + 1;
    let tbWeight = 1,
      tsWeight = 1;
    if (ingredients[arrayCount].includes("Salt") || ingredients[arrayCount].includes("Pepper")) {

      //* Convert salt weight to Tbsp and tsp
      if (ingredients[arrayCount].includes("Salt")) {
        tbWeight = 10.134,
          tsWeight = 3.378;
        saltWeight = recipeAmounts[arrayCount];
      }

      //* Convert pepper weight to Tbsp and tsp
      if (ingredients[arrayCount].includes("Pepper")) {
        tbWeight = 6.9,
          tsWeight = 2.3;
      }

      // Get the rounded value for whole Tbsps
      let tBspVal = Math.trunc(recipeAmounts[arrayCount] / tbWeight);

      // Get the remaider (modulus) for tsps
      let tspVal = (recipeAmounts[arrayCount] % tbWeight) / tsWeight;

      // Convert the tsp amount to a multiple of .25 
      tspVal = (Math.round(tspVal * 4) / 4);

      // Now string the value, some spaces, and a label togehter into a variable
      let tBtsString = ``;
      if (tBspVal > 0) {
        tBtsString += ` ${tBspVal}Tbsp`;
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
    // console.log('Checking for Butter!');
    if (ingredients[arrayCount].includes("Butter") && !ingredients[arrayCount].includes("Buttermilk")) {

      // console.log('WE have butter!');
      // Grab the weight of the ingredient (butter) and multiply it by the multiplier, depending on the kind of "stick" being used

      // Elgin weights (US-style) butter sticks
      let eTemp = Number(recipeAmounts[arrayCount] * elgin).toFixed(1);

      // Stubbie weights (US-style) butter sticks
      let sTemp = Number(recipeAmounts[arrayCount] * stubbie).toFixed(1);

      // Euro weights (European-style) butter sticks
      let euTemp = Number(recipeAmounts[arrayCount] * euro).toFixed(1);
      euTemp *= 10;

      // Now string the value, some spaces, and a label togehter into a variable
      let mmString = ` - Eu ${euTemp}mm`;

      // And put that string into the ingredient field
      document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount] + mmString;
    }
    // ! End Buttermaker
  }
}


function backFromtTotal(value) {
  let ttlMet = 0,
    ttlImp = 0;
  console.log(`Back from is fired`);
  if (value == "g") {
    totalOrig = document.getElementById("totalOrig").value;
  } else {
    totalOrig = document.getElementById("totalWeightImperial").value;
    totalOrig = Number(totalOrig * gramsPerOunce).toFixed(1);
  }

  // console.log(`totalOrig: ${totalOrig}`);
  let fieldCountTTL = 0;
  for (let arrayCountTTL = 0; arrayCountTTL < recipeAmounts.length; arrayCountTTL++) {
    fieldCountTTL = arrayCountTTL + 1;
    recipeAmounts[arrayCountTTL] = Number(totalOrig * ingredientPercent[arrayCountTTL]).toFixed(1);

    document.getElementById("recipeSays" + fieldCountTTL).value = recipeAmounts[arrayCountTTL];
    let temp = Number(recipeAmounts[arrayCountTTL] / gramsPerOunce);
    document.getElementById("recipeSaysImp" + fieldCountTTL).value = fixDigits(temp);
    ttlImp += temp;
  }
  // document.getElementById("totalOrig").value = parseFloat(ttlMet.toFixed(1));
  document.getElementById("totalWeightImperial").value = parseFloat(ttlImp.toFixed(1));

  butterAndSalt();
  portionIt();
  makeThePie();
}



function colorIngs() {

  let tempColor = "#24342466"; // This is the default color

  for (let x = 0; x < recipe.length; x++) {

    if (dryWetNull[x] != undefined) {

      switch (dryWetNull[x]) {

        // If it's a dry ingredient, it gets a custom color
        case "d":
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
    }

    document.getElementById("checkRow" + (x + 1)).style.backgroundColor = tempColor;
  }
}


// * ********************************
// * Add a row
// * ********************************

function addRow() {

  // First, we're turning off syncing because we're going to enter a value in the RS field AND store that state in local storage
  synced = false;

  // Increase the number of ingredients by 1 with this sneaky trick
  // The length of the array is always one more than the highest index, so by assigning a value to the current length index,
  // we effectively add a new element to the array.
  let lengTemp = ingredients.length;

  // Assign a null value to the ingredient and a nominal value to the amount
  ingredients[lengTemp] = "New Ingredient";
  recipeAmounts[lengTemp] = 1;

  // We've added a new element to the arrays by using 0 index.
  // Now, we need to update lengTemp to reflect the new length with the added ingredient
  lengTemp = ingredients.length;

  makeTable();
  populateTable();
  colorSyncedFields();
  colorizeIngredients();
  tallyIt();
  updateTotals();
}

// Portion It Function - Divides totalWeight amounts by number of portions and updates the per-portion fields.
function portionIt(which) {
  let portions = document.getElementById("portions").value;

  let ttl1 = document.getElementById("totalOrig").value / portions;
  document.getElementById("weightEachG").value = parseFloat(ttl1.toFixed(1));

  // let ttl2 = document.getElementById("totalScaled").value / portions;
  // document.getElementById("weightEachS").value = parseFloat(ttl2.toFixed(1));

  if (portions > 1) {
    let x1 = ttl1 / gramsPerOunce;
    document.getElementById("weightEachO").value = parseFloat(x1.toFixed(2));
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

    for (let index = 1; index <= recipeAmounts.length; index++) {
      x = recipeAmounts[index - 1] * multiplier;
      x = Number.parseFloat(x.toFixed(1));
      document.getElementById("scaledAmounts" + index).value = x;
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

// Simply adds up all the values and places a totalWeight at the bottom.
function updateTotals() {
  tallyIt();
  setValue("totalOrig", parseFloat(totalWeight.toFixed(0)));
  setValue("totalWeightImperial", parseFloat(totalWeightImperial.toFixed(0)));
  let temp = totalWeight * multiplier;
  setValue("totalScaled", parseFloat(temp.toFixed(0)));

  portionIt();
  sumSelectedRows()
}

// Sync button was clicked. Set localStorage value accordingly and calculate the ratios.
function syncTheVals(toggleOrNo) {
  if (toggleOrNo != 1) {
    synced = !synced;
  }

  // Update the sync button to reflect the new state of syncing.
  updateSyncButton();

  // Stash the current sync state in storage
  localStorage.setItem("syncVals", synced);

  // If sync is now enabled, go uncheck all the manual sync boxes
  if (synced) {
    bothChecked = false;
    countChex(100);
    pairTotal = 0;
  }

  colorSyncedFields();
  // tallyIt();
}



function updateSyncButton() {
  setChecked("syncButton", synced);
  if (synced) {
    setText("syncButton", "Synced!");
    setStyle("syncButton", "backgroundColor", "green");
    // setStyle("syncButton", "color", "#FFFFFF");
  } else {
    setText("syncButton", "!Synced");
    setStyle("syncButton", "backgroundColor", "#d8a200");
    // setStyle("syncButton", "color", "#FFFFFF");
  }
}



// The rows have three states: synced, unsynced, and manually synced (via the checkboxes).
// This function colors the rows for synced or not synced. The checkbox coloring is controlled separately.
function colorSyncedFields() {
  if (synced) {
    for (let index = 1; index <= recipeAmounts.length; index++) {
      setStyle("row" + index, "backgroundColor", "#7c99d399");
    }
  } else {
    for (let index = 1; index <= recipeAmounts.length; index++) {
      setStyle("row" + index, "backgroundColor", "");
    }
    updateSyncButton();
  }


  // let syncableElement = document.getElementById("syncable" + index);
  // let syncableElementImp = document.getElementById("syncableImp" + index);
  // let syncableElementTtl = document.getElementById("youWantRow" + index);
  // let syncableElement = document.getElementById("row" + checked1);

  // let syncableElementImp = document.getElementById("syncableImp" + index);
  // let syncableElementTtl = document.getElementById("youWantRow" + index);
  // if (synced) {
  // syncedColor = "#7c99d399";
  // } else {
  // syncedColor = "#24344266";
  // syncedColor = "";
  // }
  // syncableElement.style.backgroundColor = syncedColor;
  // syncableElementImp.style.backgroundColor = syncedColor;
  // syncableElementTtl.style.backgroundColor = syncedColor;

  // if (document.getElementById("rowcheck" + index).checked) {
  //   document.getElementById("row" + index).style.backgroundColor = "#79588fdd";
  // } else {
  //   document.getElementById("row" + index).style.backgroundColor = "";
  // }
  // }
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

    // Update the recipe says column accordingly.
    let x = recipeAmounts[arrayCount] * multiplier;
    scaledAmounts[arrayCount] = parseFloat(x.toFixed(1));
    document.getElementById("scaledAmounts" + daCount).value = scaledAmounts[arrayCount];

    // Update fields and stash local storage values (2 means PUT)
    getValues(2, daCount);
  }
}

// The ingredient field is being modified
// Grab the value and stash it
function updateIngredient(params) {

  deselectRecipe(); // If any of the values in the scaler are manually altered, nullify the recipe chosen at the top because it no longer reflects what the chart 
  // console.log(`params: ${params}`);
  ingredients[params - 1] = document.getElementById("ingredient" + params).value;
  colorizeIngredients();
}

function deselectRecipe() {
  let chosen = document.getElementById("recipeSelect");
  chosen.selectedIndex = 0;
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



//* The purpose of this function is to sum all values to then determine the ratio each contributes to the whole
//* BEFORE someone comes in and modifies the values.

function tallyIt(mode) {

  // Reset the totalWeight weights of the recipe
  totalWeight = 0;
  totalWeightImperial = 0;

  // And calculate the new totalWeight (Along with some other doohickeys)
  for (let arrayCount = 0; arrayCount < recipeAmounts.length; arrayCount++) {
    let fieldCount = arrayCount + 1;

    // Grab the totals
    totalWeight += recipeAmounts[arrayCount];
    recipeAmountsImperial[arrayCount] = Number(recipeAmounts[arrayCount] / gramsPerOunce).toFixed(2);
    totalWeightImperial += Number(recipeAmountsImperial[arrayCount]);
  }

  // As usual, we need to have TWO counters running; one for the fields and one LESS for the arrays
  for (let i = 1; i <= recipeAmounts.length; i++) {
    let theIndex = i - 1;

    // First, let's calculate the reciprocol of this ingredient (What you would need to multiply the amount by to get the totalWeight)
    let temp = totalWeight / recipeAmounts[theIndex];
    reciprocal[theIndex] = Number(temp);

    // Now, we do the reverse; determine what percentage of the whole this ingredient constitutes.
    temp = recipeAmounts[theIndex] / totalWeight;
    ingredientPercent[theIndex] = Number(temp);
    let temp2 = ingredientPercent[theIndex] * 100;
    let decPlaces = temp2 < 10 ? 2 : temp2 < 20 ? 1 : 0;

    temp = roundToDecimals(temp2, decPlaces);
    const display = getPercentDisplay(temp, roundToFives);

    setValue("ingredientPercent" + i, display);
  }

  // * THis forces the totalWeight percentage field to be 100% because, well, it should be.
  document.getElementById("totalPerc").value = "100%";

  makeThePie();

}



//* Count the number of rows with a check
//* If two or more, then bothChecked is set to true to allow for the calculations to take place.
function countChex(mode) {
  rowsChecked = 0;
  combinedRows = 0;
  pairTotal = 0;

  // Comb through the rows
  for (let i = 1; i <= recipeAmounts.length; i++) {

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
          document.getElementById("row" + checked1).style.backgroundColor = "#79588f";
        }

        // If it's two, we now have a sufficient number to work with.
        // Note this row in checked2, grab a totalWeight of the VALUES of these fields, as well as the totalWeight value of their row numbers which will always give us the other.
        if (rowsChecked == 2) {
          checked2 = i;
          bothChecked = true;
          combinedRows = checked1 + checked2;

          pairTotal =
            Number(document.getElementById("recipeSays" + checked1).value) +
            Number(document.getElementById("recipeSays" + checked2).value);

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
    recipeAmounts[which - 1] = y;

    // * recipRow is the totalWeight of both rows MINUS the current one.
    let recipRow = combinedRows - which;

    // * Likewise, recipTotal is the combined values of both checked fields
    let recipTotal = pairTotal - y;
    document.getElementById("recipeSays" + recipRow).value = fixDigits(recipTotal);
    recipeAmounts[recipRow - 1] = recipTotal;

    // Get the imperial units version and populate the Oz field
    recipTotal = recipTotal / gramsPerOunce;
    document.getElementById("recipeSaysImp" + recipRow).value = fixDigits(recipTotal);

  }
}


//* This handles when imperial values are input (which is rare, but it happens)
function impInput(which) {

  // Let's grab that value in a temp variable and do some validation on it FIRST.
  let tempInput = Number(document.getElementById("recipeSaysImp" + which).value);

  if (tempInput > 0 && tempInput != NaN) {
    recipeAmounts[which - 1] = tempInput * gramsPerOunce;
    document.getElementById("recipeSays" + which).value = parseFloat(recipeAmounts[which - 1]);
    updateRS(which, 1);
  } else {
    document.getElementById("recipeSaysImp" + which).value = parseFloat((recipeAmounts[which - 1] / gramsPerOunce));
  }
}


function updateRS(which) {

  // First, let's get an offset value. What was input as a field value is one more than the array position, as always.
  let whichOffset = which - 1;

  // This handles wheen two ingredients are linked and one is being balanced for the other.
  if (bothChecked) {
    shiftIngredient(which);
  }

  // First, confirm we're synced
  if (synced == true) {

    // If so, grab the value from the RS field that's being changed and update the respective array value with it
    if (reciprocal[whichOffset] > 0 && ingredientPercent[whichOffset] > 0) {
      let grabTemp = Number(document.getElementById("recipeSays" + which).value);

      // If grabTemp is a valid value (above 0 and not a NAN), update the array
      if (grabTemp > 0 && grabTemp != NaN) {
        recipeAmounts[whichOffset] = grabTemp;
      } else {
        // if it's NOT a valid value, restore the the current array value to the field.
        document.getElementById("recipeSays" + which).value = recipeAmounts[whichOffset];
      }

      // Calculate the totalWeight based on the reciprocol for this field
      let tempTotal = Number(recipeAmounts[whichOffset] * reciprocal[whichOffset]);

      // Now, go populate the other fields with the respective percentages for each
      for (let i = 0; i <= ingredients.length - 1; i++) {
        // Set a + 1 offset to affect the field rather than the array value being set
        fieldOffset = i + 1;

        // If the current row is NOT the one being changed, update the other METRIC values
        if (which != fieldOffset) {
          recipeAmounts[i] = ingredientPercent[i] * tempTotal;

          if (ingredientPercent[i] != 0) {
            let temp = Number.parseFloat(recipeAmounts[i]);
            document.getElementById("recipeSays" + fieldOffset).value = fixDigits(temp);
            let temp2 = fixDigits(temp);
          }
        }

        let tempIrate = 0;
        if (recipeAmounts[i] != NaN) {
          // Convert to imperial units
          tempIrate = Number(recipeAmounts[i] / gramsPerOunce);
        }
        document.getElementById("recipeSaysImp" + fieldOffset).value = fixDigits(tempIrate);
      }
    }

    updateMultiplier();
    tallyIt(which);

  } else {
    recipeAmounts[whichOffset] = Number(document.getElementById("recipeSays" + which).value);
    document.getElementById("scaledAmounts" + which).value = recipeAmounts[whichOffset] * multiplier;
    localStorage.setItem("recipeSays" + which, recipeAmounts[whichOffset]);

    // Update the imperial units column while you're at it
    let temp2 = Number(recipeAmounts[whichOffset] / gramsPerOunce);

    document.getElementById("recipeSaysImp" + which).value = fixDigits(temp2);
  }
  butterAndSalt();
  updateTotals();
  showRecipe();
}


// If the value is large, no decimal places. If smaller, add decimal places as needed.
function fixDigits(value) {
  let digits;
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

    recipeAmounts[arrayCount] = Number(localStorage.getItem("recipeSays" + arrayCount));
    scaledAmounts[arrayCount] = Number(localStorage.getItem("scaledAmounts" + arrayCount));

    document.getElementById("recipeSays" + rowCount).value = recipeAmounts[arrayCount];
    document.getElementById("scaledAmounts" + rowCount).value = scaledAmounts[arrayCount];

    updateMultiplier();
  }

  //* If 1, PUT array values in local storage
  if (getPut == 1) {
    multiplier = document.getElementById("multiplier").value;
  }

  // write the info for the current row, along with the current multiplier value, to local storage.
  if (getPut == 2) {
    localStorage.setItem("recipeSays" + arrayCount, recipeAmounts[arrayCount]);
    localStorage.setItem("scaledAmounts" + arrayCount, scaledAmounts[arrayCount]);
    localStorage.setItem("multiplier", multiplier);
  }
}

// Here for sentimental value. This will strip tab characters from the text window if it is used as "scratch" space for a recipe being converter
function noTabs() {
  theString = document.getElementById("origRecipe").value;

  while (theString.search("\t") > 0) {
    let temp = theString.replace("\t", "");
    theString = temp;
  }
  document.getElementById("origRecipe").value = theString;
}

//* If all else fails, turn it off and back on again.
function resetAll() {

  changeRecipe(1);

  // Set synced to false and update the appearance of the fields accordingly
  synced = false;
  syncTheVals(1);
  multiplier = 1;

  shScaling(false);
  shHydration(false);
  shPortions(false);

  // Uncheck any checkboxes
  writeChecks("sumCheckBox", false);

  document.getElementById("multiplier").value = multiplier;
  document.getElementById("originalScale").value = 1;
  document.getElementById("newScale").value = 1;
  document.getElementById("portions").value = 1;
  portionIt();

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

// This sends the user to the weight conversion page, along with the totalWeight weight and number of portions for use in that calculator.
function sendToWeight() {
  localStorage.setItem("fromScaler", true);
  let reciportions = document.getElementById("portions").value;
  localStorage.setItem("reciPortions", reciportions);
  let temp = document.getElementById("totalOrig").value;
  localStorage.setItem("fromScalerTotal", temp);
  window.open("weight.html", "_blank");
}


function addThis(row) {
  quickSum += recipeAmounts[row - 1];
  quickSum = parseFloat(quickSum.toFixed(2));
}


function getPercs() {
  percString = "";
  ingredientPercent.forEach(spitit);
  alert(percString)
};


function spitit(item, index, arr) {
  let rando = arr;
  let temp = item * 100;
  let temp2 = parseFloat(temp.toFixed(1));
  // console.log(`${ingredients[index]} - ${temp2} % `);
  percString += `${ingredients[index]} - ${temp2} %\n`;
}


// * Handles toggling rounding to nearest 5% / 1%
function toggleFives() {
  roundToFives = !roundToFives;
  document.getElementById("fivesCheck").checked = roundToFives;
  tallyIt();
}

function toggleBarChart(params) {
  if (params == null) {
    pieChartVis = !pieChartVis
    let status;
    if (pieChartVis) {
      status = "block";
    } else {
      status = "none";
    }
    document.getElementById("thePieChart").style.display = status;
  } else {
    document.getElementById("thePieChart").style.display = params;
  }
}

function updateHydration() {
  wetIngs = 0, dryIngs = 0, hydration = 0;
  for (let x = 0; x < recipe.length; x++) {

    switch (dryWetNull[x]) {

      // If it's a dry ingredient, it gets a custom color
      case "d":
        dryIngs += Number(recipeAmounts[x]);
        // tempColor = "#7b8f6cbd"; // Dry Color
        break;

      // If it's a wet ingredient, it gets a custom color
      case "w":
        wetIngs += Number(recipeAmounts[x]);
        // tempColor = "#3865b7"; // This is the wet color
        break;

      // If it's starter, it gets a custom color AND contributes equally to wet and dry ratios
      case "s":
        wetIngs += Number(recipeAmounts[x]) * .50;
        dryIngs += Number(recipeAmounts[x]) * .50;
        // tempColor = "#dfa62566"; // This is the STARTER COLOR 
        break;

      // If it's "N", it is neutral and contrinutes to neither; For example, olive oil
      case "n":
        tempColor = "#ffffff66"; // This is the NULL color
        break;

      // If all else fails "N", it is neutral and contributes to neither; For example, olive oil
      default:
        tempColor = "#ffffff66"; // This is the NULL color
        break;
    }
  }

  let hydration = wetIngs / dryIngs * 100;

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


// * This function generates recipe cards for all recipes in the dropdown and opens them in a new window for whatever.

function makeRecCards(params) {
  suppressAlerts = true;
  recipePrint = true; // Set to true to print the recipe in a new window

  let htmlHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recipe Collection</title>
  <base href="about:blank">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #faf8f4;
      --surface:   #ffffff;
      --border:    #c1bcb5;
      --underline: #ff0000;
      --accent:    #b85c38;
      --accent-lt: #f5ede8;
      --text:      #2c2520;
      --muted:     #8a7f78;
      --radius:    12px;
      --gap:       1.5rem;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem 1.25rem 5rem;
    }

    /* ── Page header ─────────────────────────────────────────── */
    header {
      max-width: 900px;
      margin: 0 auto 2.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }

    header h1 {
      font-family: 'Lora', serif;
      font-size: clamp(1.8rem, 5vw, 2.8rem);
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    header p {
      margin-top: 0.4rem;
      font-size: 0.95rem;
      color: var(--muted);
      font-weight: 300;
    }

    /* ── Table of Contents ───────────────────────────────────── */
    .toc {
      max-width: 900px;
      margin: 0 auto 3rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem 2rem;
    }

    .toc__title {
      font-family: 'Lora', serif;
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 1.25rem;
    }

    .toc__category {
      margin-bottom: 1.1rem;
    }

    .toc__category:last-child { margin-bottom: 0; }

    .toc__category-label {
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.4rem;
    }

    .toc__list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem 1.5rem;
    }

    .toc__list a {
      font-size: 0.9rem;
      color: var(--text);
      text-decoration: none;
      border-bottom: 1px solid var(--underline);
      transition: color 0.15s, border-color 0.15s;
    }

    .toc__list a:hover {
      color: var(--accent);
      border-color: var(--accent);
    }

    /* ── Responsive grid ─────────────────────────────────────── */
    .recipe-grid {
      display: grid;
      gap: var(--gap);
      max-width: 900px;
      margin: 0 auto;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
    }

    /* ── Recipe card ─────────────────────────────────────────── */
    .recipe-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      scroll-margin-top: 1.5rem;
    }

    .recipe-card__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .recipe-card__title {
      font-family: 'Lora', serif;
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.3;
    }

    .recipe-card__tag {
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: var(--accent-lt);
      color: var(--accent);
      border-radius: 100px;
      padding: 0.25em 0.7em;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .recipe-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem 1rem;
      font-size: 0.78rem;
      color: var(--muted);
    }

    .recipe-card__desc {
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--muted);
      font-weight: 300;
      font-style: italic;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--border);
    }

    .recipe-section-label {
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .ingredients-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .ingredients-list li {
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--text);
      padding-left: 1em;
      position: relative;
    }

    .ingredients-list li::before {
      content: '–';
      position: absolute;
      left: 0;
      color: var(--muted);
    }

    .method-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      counter-reset: step;
    }

    .method-list li {
      font-size: 0.85rem;
      line-height: 1.55;
      color: var(--text);
      padding-left: 1.9em;
      position: relative;
      counter-increment: step;
    }

    .method-list li::before {
      content: counter(step);
      position: absolute;
      left: 0;
      top: 0.05em;
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--accent);
      background: var(--accent-lt);
      border-radius: 100px;
      width: 1.35em;
      height: 1.35em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-link {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      transition: color 0.15s;
    }

    .back-link:hover { color: var(--accent); }
    .back-link::before { content: '↑'; }
  </style>
</head>
<body>

  <header id="top">
    <h1>Recipe Collection</h1>
    <p>A curated set of dishes for every occasion</p>
  </header>`


  //* Set up the TOC before the recipes are covered in the loop.
  //! This is a one-time definition
  let recipeIndex = `
    <!-- TABLE OF CONTENTS -->
     <nav class="toc" aria-label="Table of contents">
    <P class="toc__title">Contents</P>
        <div class="toc__category">
      <p class="toc__category-label">Mains</p>
      <ul class="toc__list">
`;

  //* Set up the recipe grid before the steps are covered in the loop.
  //! This is a one-time definition

  let htmlContent2 = `<!--RECIPE GRID-- >
        <main class="recipe-grid">`;

  let itemsCount = document.getElementById("recipeSelect").length;
  for (let x = 1; x < itemsCount; x++) {
    document.getElementById("recipeSelect").selectedIndex = x;
    changeRecipe(0);

    recipeName = whichRecipe.replace("&nbsp;&nbsp;", "");
    let originalRecipeName = recipeName;
    recipeName = recipeName.replaceAll("-", "");

    if (originalRecipeName.includes("--")) {
      recipeIndex += `</ul></div><div class="toc__category"><p class="toc__category-label">${recipeName}</p><ul class="toc__list">`;
    } else {
      recipeIndex += `<li><a href="#${recipeName}">${recipeName}</a></li>`;

      //* Create the recipe card and set up the ingredients list for this recipe before the steps are covered in the loop.
      htmlContent2 += `<!-- ${recipeName} -->
          <article class="recipe-card" id="${recipeName}">
          <div class="recipe-card__header">
          <h2 class="recipe-card__title">${recipeName}</h2>
          </div>
          <div>
          <p class="recipe-section-label">Ingredients</p>
          <ul class="ingredients-list">`;

      // * Loop through the ingredients for this recipe and add them to the ingredients list before the steps are covered in the loop.
      for (let i = 0; i < recipe.length; i++) {
        htmlContent2 += `<li>${recipe[i][1]}g ${recipe[i][0]}</li>`;
      }
      // * Close the ingredients list and set up the "Method" steps for this recipe before the steps are covered in the loop.
      htmlContent2 += `
    </ul>
    </div>
    <!--
    <div>
    <p class="recipe-section-label">Method</p>
    <ol class="method-list">
      <li>Preheat the oven to 200 °C. Arrange the tomatoes cut-side up on a baking tray. Slice the top off the garlic head to expose the cloves. Drizzle everything with olive oil and season generously. Roast for 35 minutes until caramelised.</li>
    </ol>
    </div>
    -->
    <a href="#top" class="back-link">Back to top</a>
    </article>`
    }
  }
  recipeIndex += `</div>
  </nav>

  <!-- RECIPE GRID -->
  <main class="recipe-grid">
`; // Close the final category in the TOC
  // * Close the recipe grid and finalize the HTML content before opening it in a new window for printing.
  let htmlContent = htmlHeader + recipeIndex + htmlContent2 + `
    <!-- </article> -->
  </main>
</body>
</html>`;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close(); // Ensures styles and scripts are applied
  } else {
    alert("Popup blocked! Please allow popups for this site.");
  }
}



// * This function generates recipe cards for all recipes in the dropdown and opens them in a new window for printing.

function makeJson(params) {
  suppressAlerts = true;
  recipePrint = true; // Set to true to print the recipe in a new window

  let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>TiniCalc Recipe Library</title>
        <style>
    body {
    	font-family: Georgia, sans-serif;
    	padding: 20px;
    }
    h1 {
    	color: #000;
    }
    h2 {
    	color: #eee;
    }
    h3 {
    	color: #7f8c8d;
    }
    ul {
    	margin-top: 10px;
    }
    tr:nth-child(even) {
    	background-color: #ddd;
    }
    tr:nth-child(odd) {
    	background-color: #eee;
    }
    tr {
    	border-bottom: 1px solid #000;
    }
    td {
    	padding: 8px;
    }
    table {
    	border-collapse: collapse;
    	margin: 15px;
    }
    
    .wrapping {
    	display: flex;
    	flex-wrap: wrap;
    }
      </style>
      </head>
      <body>
      	<div class="wrapping">
        `

  for (let x = 1; x < params; x++) {
    document.getElementById("recipeSelect").selectedIndex = x;
    changeRecipe();

    htmlContent += `<div>
<h1>${whichRecipe}</h1>
  <table width="300px">`

    for (let i = 0; i < recipe.length; i++) {
      htmlContent += `<tr><td>${recipe[i][0]}:</td><td style="text-align: right">${recipe[i][1]}</td><td>${recipe[i][2]}</td></tr>`;
    }

    htmlContent += `
        </table>
        </div>`
  }

  htmlContent += `
      </div>
    </body>
  </html>
`;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close(); // Ensures styles and scripts are applied
  } else {
    alert("Popup blocked! Please allow popups for this site.");
  }
}


// * Sum the selected rows and put the totalWeight in the totalWeight box

function sumSelectedRows(mode) {

  // * A. set all of the rows to the current color (synced or not)
  colorSyncedFields();

  let sumTotal = 0, theColor;

  // * B. Now, go colorize checked rows and add them to the sumTotal.
  for (let i = 1; i <= recipeAmounts.length; i++) {
    if (document.getElementById("sumCheck" + i).checked) {
      sumTotal += recipeAmounts[i - 1];
      // color-code everything to make clear which rows are being summed and that the totalWeight reflects those rows.
      theColor = "#79588fdd";
      document.getElementById("row" + i).style.backgroundColor = theColor;
    } else {
      theColor = "";
    }
  }

  let bgColor, totalEditableStatus;
  if (sumTotal == 0) {
    // If there are no checked rows, the totalWeight will be zero, so the totalWeight should be the full recipe totalWeight and not editable, to make it clear that the totalWeight is reflecting the full recipe and not the checked rows.
    sumTotal = totalWeight;
    bgColor = "";

    // AND if there are boxes checked, the user should not be able to edit the totalWeight, because it is reflecting the checked rows, not the full recipe. If there are no boxes checked, the totalWeight should be editable, because it is reflecting the full recipe and not the checked rows.
    totalEditableStatus = false;
  } else {
    bgColor = "#79588fdd";
    totalEditableStatus = true;
  }
  document.getElementById("checkRowTot").style.backgroundColor = bgColor;

  document.getElementById("totalOrig").value = sumTotal.toFixed(1);
  document.getElementById("totalOrig").readOnly = totalEditableStatus;
}


// * Clears all sum checkboxes and updates the totalWeight to the full recipe amount
function clearSumChecks() {

  writeChecks('sumCheckBox', false);

  sumSelectedRows();
}

// * Checks all sum checkboxes and updates the totalWeight
function checkSumChecks() {

  writeChecks('sumCheckBox', true);

  sumSelectedRows();
}




// * Generic checkbox tool - Will apply specified state to all checkboxes of a given class name. Used for clearing sum checks and sync checks.
function writeChecks(className, state) {
  document.querySelectorAll(`.${className}`).forEach(cb => cb.checked = state);
}


// * Responding to a button click, this little feller copies the scaled amounts from the scaled column to the "regular" column.
function copyScaled() {

  let fieldIndex = 0;
  for (let index = 0; index < recipeAmounts.length; index++) {
    fieldIndex = index + 1;
    recipeAmounts[index] = scaledAmounts[index];
    document.getElementById("recipeSays" + fieldIndex).value = recipeAmounts[index];
    // * console.log(`recipeAmounts: ${recipeAmounts[index]}`);
  }

  document.getElementById("originalScale").value = 1;
  document.getElementById("newScale").value = 1;
  multiChange();

  shScaling(false); // Hide the scaler area because we're done with it.

  tallyIt(); // Todo This specifically tags the tally function to NOT read values from the fields and into the array. This approach might be obsolete
}


function generatePieChartOld(slices, { size = 300, radius = 120 } = {}) {

  const PALETTE = [
    '#534AB7', '#0F6E56', '#993C1D', '#993556', '#185FA5',
    '#3B6D11', '#BA7517', '#A32D2D', '#5F5E5A', '#533489',
  ];

  const totalWeight = slices.reduce((s, i) => s + i.percent, 0);
  const items = slices.slice(0, 10).map((s, i) => ({
    label: s.label,
    percent: (s.percent / totalWeight) * 100,
    color: PALETTE[i],
  }));

  const cx = size / 2, cy = size / 5;
  const DEG = Math.PI / 180;

  function polarToXY(angleDeg, r) {
    const rad = (angleDeg - 90) * DEG;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function slicePath(startDeg, endDeg, r) {
    const [x1, y1] = polarToXY(startDeg, r);
    const [x2, y2] = polarToXY(endDeg, r);
    const large = (endDeg - startDeg) > 180 ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
  }

  let cursor = 0;
  const slicePaths = items.map(item => {
    const sweep = item.percent * 3.6;
    const path = slicePath(cursor, cursor + sweep, radius);
    cursor += sweep;
    return `<path d="${path}" fill="${item.color}"/>`;
  });

  const legendTop = size + 24;
  const col2X = size / 2 + 10;
  const rowH = 22;
  const half = Math.ceil(items.length / 2);

  const legendItems = items.map((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = col === 0 ? 20 : col2X;
    const y = legendTop + row * rowH;
    return `
      <rect x="${x}" y="${y}" width="12" height="12" rx="2" fill="${item.color}"/>
      <text class="ts" x="${x + 18}" y="${y + 10}">${item.label} — ${item.percent.toFixed(1)}%</text>`;
  });

  const legendRows = Math.ceil(items.length / 2);
  const svgH = size + 24 + legendRows * rowH + 20;

  return `
<svg width="100%" viewBox="0 0 ${size} ${svgH}"
     role="img" xmlns="http://www.w3.org/2000/svg"
     aria-label="Pie chart: ${items.map(i => `${i.label} ${i.percent.toFixed(1)}%`).join(', ')}">
  <title>Recipe composition</title>
  <desc>${items.map(i => `${i.label}: ${i.percent.toFixed(1)}%`).join(', ')}</desc>
  <defs>
    <clipPath id="pie-clip">
      <circle cx="${cx}" cy="${cy}" r="${radius}"/>
    </clipPath>
  </defs>
  <style>
    .ts { font: 400 12px system-ui, sans-serif; fill: var(--color-text-secondary, #c0c0c0); }
  </style>

  <g clip-path="url(#pie-clip)">
    ${slicePaths.join('\n    ')}
  </g>

  <circle cx="${cx}" cy="${cy}" r="${radius}"
          fill="none"
          stroke="var(--color-background-primary, #fff)"
          stroke-width="3"/>

  <line x1="0" y1="${size + 12}" x2="${size}" y2="${size + 12}"
        stroke="var(--color-border-tertiary, #ddd)" stroke-width="0.5"/>
  ${legendItems.join('')}
</svg>`.trim();

}



function makeThePie() {
  // document.getElementById("pieChartArea").innerHTML = generatePieChart([
  //   { label: "Flour", percent: 60 },
  //   { label: "Water", percent: 35 },
  //   { label: "Salt", percent: 3 },
  //   { label: "Yeast", percent: 2 },
  // ]);
  let percentages = [],
    labels = [];
  for (let i = 0; i < recipe.length; i++) {
    percentages.push(ingredientPercent[i] * 100);
    labels.push(recipe[i][0]);
  }
  // const percentages = [35, 20, 18, 10, 8, 4, 3, 2];
  // const labels = ['Flour', 'Butter', 'Sugar', 'Eggs', 'Milk', 'Vanilla', 'Salt', 'Baking powder'];

  const slices = percentages.map((percent, i) => ({ label: labels[i], percent }));
  document.getElementById("pieChartArea").innerHTML = generatePieChart(slices);
}




function generatePieChart(slices, { size = 300, radius = 100 } = {}) {

  const PALETTE = [
    '#534AB7', '#0F6E56', '#993C1D', '#993556', '#185FA5',
    '#3B6D11', '#BA7517', '#A32D2D', '#5F5E5A', '#533489',
  ];

  const totalWeight = slices.reduce((s, i) => s + i.percent, 0);
  const items = slices.slice(0, 10).map((s, i) => ({
    label: s.label,
    percent: (s.percent / totalWeight) * 100,
    color: PALETTE[i],
  }));

  const padding = 8;              // ← breathing room above the circle
  const cx = size / 2;
  const cy = padding + radius;   // ← centre sits radius px below the top padding
  const DEG = Math.PI / 180;

  function polarToXY(angleDeg, r) {
    const rad = (angleDeg - 90) * DEG;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function slicePath(startDeg, endDeg, r) {
    const [x1, y1] = polarToXY(startDeg, r);
    const [x2, y2] = polarToXY(endDeg, r);
    const large = (endDeg - startDeg) > 180 ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
  }

  let cursor = 0;
  const slicePaths = items.map(item => {
    const sweep = item.percent * 3.6;
    const path = slicePath(cursor, cursor + sweep, radius);
    cursor += sweep;
    return `<path d="${path}" fill="${item.color}"/>`;
  });

  // Legend positioned just below the circle bottom, not below `size`
  const circleBottom = cy + radius;
  const legendTop = circleBottom + 20;
  const col2X = size / 2 + 10;
  const rowH = 22;
  const half = Math.ceil(items.length / 2);

  const legendItems = items.map((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = col === 0 ? 20 : col2X;
    const y = legendTop + row * rowH;
    return `
      <rect x="${x}" y="${y}" width="12" height="12" rx="2" fill="${item.color}"/>
      <text class="ts" x="${x + 18}" y="${y + 10}">${item.label} — ${item.percent.toFixed(1)}%</text>`;
  });

  const legendRows = Math.ceil(items.length / 2);
  const svgH = legendTop + legendRows * rowH + 16;

  return `
<svg width="100%" viewBox="0 0 ${size} ${svgH}"
     role="img" xmlns="http://www.w3.org/2000/svg"
     aria-label="Pie chart: ${items.map(i => `${i.label} ${i.percent.toFixed(1)}%`).join(', ')}">
  <title>Recipe composition</title>
  <desc>${items.map(i => `${i.label}: ${i.percent.toFixed(1)}%`).join(', ')}</desc>
  <defs>
    <clipPath id="pie-clip">
      <circle cx="${cx}" cy="${cy}" r="${radius}"/>
    </clipPath>
  </defs>
  <style>
    .ts { font: 400 12px system-ui, sans-serif; fill: var(--color-text-secondary, #555); }
  </style>

  <g clip-path="url(#pie-clip)">
    ${slicePaths.join('\n    ')}
  </g>

  <circle cx="${cx}" cy="${cy}" r="${radius}"
          fill="none"
          stroke="var(--color-background-primary, #fff)"
          stroke-width="3"/>

  <line x1="0" y1="${legendTop - 8}" x2="${size}" y2="${legendTop - 8}"
        stroke="var(--color-border-tertiary, #ddd)" stroke-width="0.5"/>
  ${legendItems.join('')}
</svg>`.trim();
}
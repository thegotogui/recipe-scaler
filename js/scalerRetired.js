
var amounts = [],
  bothChecked = false,
  checked1 = 0,
  checked2 = 0,
  combinedRows = 0,
  dimmed = false,   // Holds the current state of the original values column's dimmed status
  dimmedI = false,  // Holds the current state of the Imperial column's dimmed status
  elgin = .105726,  // Elgin butter weight factor
  stubbie = .073127,// Stubbie butter weight factor
  euro = .0428,     // European butter weight factor
  fives = false,    // Whether ~5|1 is checked
  ingLength,        // Holds the number of ingredients in the current recipe
  ingredient,       // Temporary variable to hold ingredient name
  ingredientColorMode = 1, // 1 = color by ingredient, anything else, color by hydration
  ingredients = [], // Array that holds the ingredient names
  dryWetNull = [],  // Array that holds whether the ingredient is dry, wet, or neutral
  markdown,         // Holds the recipe instructions in markdown format
  multiplier = 1,   // Variable that holds the multiplier
  newScaleVar,      // The desired ratio
  originalScaleVar, // The original ratio of the recipe being calculated
  pairTotal = 0,    // Holds the total of the selected rows for rebalancing
  perc = [],        // Percentage of x recip
  percentages = [], // Array that holds the percentages
  percString,       // Holds the percentages as a string for display
  pieChartVis = false, // Holds the visibility status of the pie chart
  quickSum = 0,     // Holds the quick sum of selected rows
  recip = [],       // Reciprocol
  recipe,           // Holds the current recipe as a 2D array
  recipeName,       // Holds the name of the current recipe MINUS the &nbsp;&nbsp; that is used to make the dropdown look nicer
  recipeSteps,      // Holds the recipe instructions
  reciPortions = 0,
  recipeMaxLength = 0, // Holds the maximum number of ingredients in the current recipe (capped at 10)
  rowCount,               // Which FIELD/Row is being edited
  rowsChecked,
  rs = [],                // "Recipe says" =- Array that holds the quantities
  rsI = [],               // "Recipe says" =- Array that holds Imperial equivalents
  headers = [],           // Defines which rows will have headers and what they'll contain
  suppressAlerts = false, // Suppresses alerts when making recipe cards
  synced,
  thisAmount,
  total = 0,        // Holds total of all metric weights
  totalImp = 0,     // Holds total of all imperial weights
  which,
  whichRecipe,
  scVis = false,
  shHyd = true,
  shPor = true,
  youWant = [];


function versions() {
  console.log(`--VERSION----TWEAKS & CHANGES----
07.04.2026 - Reset now ALSO correctly resets the background colors to clear.
21.03.2026 - Reset now correctly unchecks every checkbox with a fancy query selector thing function AND resets the dropdown to the default "Choose a recipe" option.
26.01-2026 - Restored the butter and salt calculations that were removed in the last edit. Somehow.
25.01.2026 - Adjusted serving size of the al dente pasta to 233g total.
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
  "#A2DFF7": ["Water", "Vinegar"],
  "#73b28c": ["Celery", "Scallion", "Olive Oil", "EVOO"],
  "#529148": ["Thyme", "Capers", "Asparagus", "Dill", "Basil", "Kale", "Mint"],
  "#007a0a": ["Parsley", "Kombu"],
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
  "#ff3900": ["Tomato", "Tomato Sauce", "Gochujang", "Samjang", "Red Wine Vinegar", "Harissa", "Paprika", "Chili Powder", "Chipotle", "Smoked Paprika", "Cayenne", "Red Bell Pepper", "Campari"],
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
        // console.log(`FOUND IT!: ${color}`);
        ingCount++;
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

  // This sets the dim color of the columns to match the checkboxes
  masterDimmer('dimImp', 'theBlocksImp');
  masterDimmer('dimMet', 'theBlocksMet');
  masterDimmer('dimScale', 'theBlocksSc');

  // Hide scaling, hydration, and portions areas
  // This is deprecated because, at this point, there is no table yet so calling this function does nothing.
  // shScaling(false);
  shHydration(false);
  shPortions(false);

  changeRecipe(1);
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

  // Activate a counter that will ensure that at least one, but only one, recipe is loaded.
  let recipeCounter = "";

  // Reset stuff that may have been set from before
  recipeSteps = "";
  headers = [];
  markdown = "";
  recipe = [];
  rs = [];
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
  // * Reset
  if (whichRecipe.includes("Reset")) {
    recipe = [
      ['Ingredient A', 1],
      ['Ingredient B', 1]
    ];
    recipeCounter += whichRecipe;
  }

  // * Wasabi Sauce for Ahi TUna
  if (whichRecipe.includes("Ahi Tuna")) {
    recipe = [
      ['Yogurt', 60],
      ['Buttermilk', 45],
      ['Wasabi Salt', 1],
      ['Black Pepper', 2],
      ['Aleppo Pepper', 2],
      ['Salt', .89]
    ];
    recipeCounter += whichRecipe;
  }

  // * Pesto
  if (whichRecipe.includes("Pesto")) {
    recipe = [
      ['Olive oil', 60, "w"],
      ['Basil', 18, "d"],
      ['Almonds', 11, "d"],
      ['Parmesan', 9, "d"],
      ['Lemon Juice', 9, "w"],
      ['Garlic', 5, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Caesar Dressing
  if (whichRecipe.includes("Caesar")) {
    recipe = [
      ['Olive Oil', 60, "w"],
      ['Lemon Juice', 24, "w"],
      ['Egg Yolk', 15, "w"],
      ['Worcestershire', 2.5, "w"],
      ['Garlic Clove', 18, "d"],
      ['Parmesan', 15, "d"],
      ['Anchovy', 10, "d"],
      ['Salt', 1.16, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Nicoise Dressing
  if (whichRecipe.includes("Niçoise")) {
    recipe = [
      ['Olive Oil', 59, "w"],
      ['Red Wine Vinegar', 24, "w"],
      ['Shallot', 20, "d"],
      ['Garlic Clove', 6, "d"],
      ['Dijon Mustard', 6, "w"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Ranch Dressing
  if (whichRecipe.includes("Ranch")) {
    recipe = [
      ['Greek Yogurt', 118, "w"],
      ['Buttermilk', 30, "w"],
      ['Garlic Clove', 8, "d"],
      ['Apple Cider Vinegar', 29, "w"],
      ['Scallion', 6, "d"],
      ['Dill', 1, "d"],
      ['Parsley', 2, "d"],
      ['Thyme', 1, "d"],
      ['Black Pepper', 1, "d"],
      ['Kosher Salt', 1.58, "d"]
    ];
    recipeCounter += whichRecipe;
  }


  if (whichRecipe.includes("Ginger Sesame")) {
    recipe = [
      ['Pak Choi, Thinly Sliced (2 large heads)', 250, "d"],
      ['Toasted Sesame Oil', 45, "w"],
      ['Rich Soy Sauce', 30, "w"],
      ['Fresh Ginger, finely grated', 15, "d"],
      ['Rice Vinegar', 15, "w"],
      ['Honey', 5, "d"],
      ['Cloves Garlic, minced', 10, "d"],
      ['Roasted Sesame Seeds', 37, "d"],
    ];
    recipeCounter += whichRecipe;
  }


  // Miso Roasted Pak Choi with Edamame

  if (whichRecipe.includes("Miso Roasted")) {
    recipe = [
      ['Pak Choi, Thinly Sliced (2 large heads)', 250, "d"],
      ['Shelled Edamame', 160, "d"],
      ['White miso paste', 45, "d"],
      ['Toasted sesame oil', 30, "w"],
      ['Rice vinegar', 15, "w"],
      ['Garlic', 10, "d"],
      ['Freshly grated ginger', 2, "d"],
      ['Sesame seeds', 15, "d"],
      ['Crushed red pepper flakes', 2.5, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // Garlic Soy Pak Choi with Toasted Sesame Seeds

  if (whichRecipe.includes("Garlic and Soy")) {
    recipe = [
      ['Green pak choi', 250, "d"],
      ['Minced Garlic', 4, "d"],
      ['Dark Soy Sauce', 45, "w"],
      ['Toasted Sesame Oil', 15, "w"],
      ['Honey', 5, "d"],
      ['Rice vinegar', 30, "w"],
      ['Crushed red pepper flakes', 2.5, "d"],
      ['Toasted Sesame Seeds', 30, "d"]
    ];
    recipeCounter += whichRecipe;
  }


  // * White rice
  if (whichRecipe.includes("White Rice")) {
    recipe = [
      //Rice is 241 wet
      ['Rice', 210, "d"],
      ['Water', 314, "w"],
      ['Salt', 4.25, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Lentils
  // 120/366 left quite a bit of water. I drained 100g of water and it was still a bit too wet.
  if (whichRecipe.includes("Lentils")) {
    recipe = [
      //Rice is 241 wet
      ['Lentils', 120, "d"],
      ['Water', 290, "w"],
      ['Salt', 3.3, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Roma rice
  if (whichRecipe.includes("Roma")) {
    recipe = [
      ['Rice ', 162, "d"],
      ['Water', 337, "w"],
      ['Salt', 4, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Jasmine rice
  if (whichRecipe.includes("Jasmine")) {
    recipe = [
      ['Water', 420, "w"],
      ['Rice', 210, "d"],
      ['Salt', 5, "d"],
      ['Powdered Garlic', 2, "d"],
      ['Powdered Onion', 2, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Sushi rice
  if (whichRecipe.includes("Sushi")) {
    recipe = [
      ['Rice', 210, "d"],
      ['Water', 314, "w"],
      ['Rice Vinegar', 15, "w"],
      ['Sugar', 5, "d"],
      ['Salt', 4, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Pickled Onion
  if (whichRecipe.includes("Pickled Onion")) {
    recipe = [
      ['Water', 50, "w"],
      ['Vinegar', 10, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  // * Tini Burger
  if (whichRecipe.includes("Burger")) {
    recipe = [
      ['Ground Beef', 225],
      ['Onion', 40],
      ['Panko', 15],
      ['Milk', 34.5],
      ['Worcestershire', 3.2],
      ['Salt', 2.25],
      ['Powdered Garlic', 2.25],
      ['Powdered Onion', 2.25],
      ['Dried Thyme', 2.25]
    ];
    recipeCounter += whichRecipe;
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
    ];
    recipeCounter += whichRecipe;
  }

  // * Tonnato
  if (whichRecipe.includes("Tonnato")) {
    recipe = [
      ['Tuna', 142, "d"],
      ['Mayo', 118, "w"],
      ['Olive Oil', 60, "w"],
      ['Lemon Juice', 45, "w"],
      ['Capers', 15, "d"],
      ['Anchovy', 12, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Classic Crepes
  if (whichRecipe.includes("Classic Crepes")) {
    recipe = [
      ['Milk', 120, "w"],
      ['Egg', 100, "w"],
      ['Whole Wheat Flour', 50, "d"],
      ['AP Flour', 28, "d"],
      ['Buckwheat Flour', 28, "d"],
      ['Buttermilk', 45, "w"],
      ['Butter', 24, "w"],
      ['Salt', 3, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Ti Couz Crepes
  if (whichRecipe.includes("Couz")) {
    recipe = [
      ['Water', 310, "w"],
      ['Milk', 100, "w"],
      ['Egg', 8, "w"],
      ['Butter', 17, "w"],
      ['Whole Wheat Flour', 50, "d"],
      ['AP Flour', 30, "d"],
      ['Buckwheat Flour', 23, "d"],
      ['Salt', 4.35, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Sourdough Crepes
  // Updated 19/2/23 - AMAZING
  if (whichRecipe.includes("Sourdough Crepes")) {
    recipe = [
      ['Milk', 210, "w"],
      ['Water', 55, "w"],
      ['Egg', 50, "w"],
      ['Butter', 22, "w"],
      ['Flour', 135, "d"],
      ['Salt', 4, "d"],
      ['Starter', 30, "s"]
    ]; markdown = "### Updated 1-3-25 to tone down the starter amount - too tart!";
    recipeCounter += whichRecipe;
  }

  //* Naan
  if (whichRecipe.includes("Naan")) {
    recipe = [
      ['AP Flour', 500, "d"],
      ['Milk', 236, "w"],
      ['Yogurt', 60, "w"],
      ['Canola Oil', 30, "n"],
      ['Salt', 6.8, "d"],
      ['Yeast', 7, "d"],
      ['Baking Powder', 5, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Biscuits
  if (whichRecipe.includes("Biscuits")) {
    recipe = [
      ['AP Flour', 180, "d"],
      ['Salt', 3, "d"],
      ['Baking Powder', 10, "d"],
      ['Milk', 130, "w"],
      ['Butter', 50, "w"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Cornbread
  if (whichRecipe.includes("Cornbread")) {
    recipe = [
      ['Cornmeal', 100, "d"],
      ['AP Flour', 90, "d"],
      ['Baking Powder', 3, "d"],
      ['Salt', 2, "d"],
      ['Sour Cream', 85, "w"],
      ['Milk', 80, "w"],
      ['Buttermilk', 55, "w"],
      ['Butter', 55, "w"],
      ['Egg', 50, "w"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Pita
  if (whichRecipe.includes("Pita")) {
    recipe = [
      ['Flour', 310, "d"],
      ['Whole Wheat Flour', 35, "d"],
      ['Water', 235, "w"],
      ['Olive Oil', 30, 'n'],
      ['Salt', 4.95, "d"],
      ['Yeast', 2, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* French Baguette 2
  if (whichRecipe.includes("Baguette")) {
    recipe = [
      ['Bread Flour', 700, "d"],
      ['Water', 520, "w"],
      ['Yeast', 2, "d"],
      ['Salt', 8, "d"],
    ];
    markdown = `## Process
### Part 1
- Mix all the ingredients together until combined, you will see the dough will amalgamate into a ball, this should not take more than 2mn.
- Cover and let it rise for 8 to 10 hours, I leave the dough in the cold oven.
          
### Part 2
- Sprinkle some flour on the bench or a pizza dish/plate, scrape the dough on the dish and sprinkle again some more flour on top to avoid sticking. You will need a plastic dough scraper and make sure you're not pressing the dough to keep the air inside.
          
- Cut the dough in 4 (if you want 4 baguettes, but you can make 2/3/5).
      
- Take each piece and stretch it gently into a baguette shape and put it on a baking tray or plate with baking paper. This should not take more than 3 mn and if you're well organised cleaning included.
     
- Bake at 250 degC (480 degF) for approx 25 mn in a pre heated oven depending how golden you want them.
      
### Timeline
- 2 min mixing, 8/10-hours rising, shaping 3 mins, baking 25 mins
      
**Note on flour**;
Use Bakers flour, also called bread flour or strong flour depending where you live.
Every flour is different so the water/flour ratio or hydration will need to be adjusted slightly, if you find the dough too runny reduce water.
Try a few different bread flours to see which one gives you the best result.`;
    recipeCounter += whichRecipe;
  }

  //* Classic Pizza Dough
  if (whichRecipe.includes("Classic Pizza")) {
    recipe = [
      ['AP Flour', 100, "d"],
      ['Bread Flour', 100, "d"],
      ['Water', 140, "w"],
      ['Salt', 3.5, "d"],
      ['Yeast', 1, "d"],
      ['Olive Oil', 4, "n"]
    ];
    markdown = `## Process
1. Combine flours, water, and yeast
1. Let rest 30 minutes-2 hours.
1. Add oil and mix to combine and distribute.
1. Place in a warm location to rise for 3+ hours.
1. Do a final tuck and roll, allow for a final rest, then stretch.
`;
    recipeCounter += whichRecipe;
  }

  //* Neapolitan Pizza Dough
  if (whichRecipe.includes("Neapolitan")) {
    recipe = [
      ['Bread Flour', 300, "d"],
      ['AP Flour', 200, "d"],
      ['Water', 200, "w"],
      ['Salt', 6, "d"],
      ['Honey', 5, "w"],
      ['Yeast', 5, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Sourdough Pizza Dough
  if (whichRecipe.includes("Sourdough Pizza Dough")) {
    recipe = [
      ['Sourdough Starter', 100, "s"],
      ['AP Flour', 220, "d"],
      ['Water', 90, "w"],
      ['Olive Oil', 15, "n"],
      ['Salt', 4.34, "d"],
      ['Yeast', 3, "d"]
    ];
    markdown = `- 20 Slices of Pepperoni
- 20 slices of Courgette
- 20g of Kale/6 smaller leaves
- ~190g of sauce`;
    recipeCounter += whichRecipe;
  }

  //* Sourdough Bread
  if (whichRecipe.includes("Sourdough Bread")) {
    recipe = [
      ['Bread Flour', 335, "d"],
      ['Whole Wheat Flour', 50, "d"],
      ['Rye Flour', 20, "d"],
      ['Water', 250, "w"],
      ['Salt', 7, "d"],
      ['Sourdough Starter', 13, "s"]
    ];
    recipeCounter += whichRecipe;
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
      ['Water', 75, "w"],
      ['Yeast', 3, "d"],
      ['Honey', 3, "W"],
      ['Flour', 180, "d"],
      ['Water', 100, "w"],
      ['Salt', 7.5, "d"],
      ['Olive Oil', 3, "n"]
    ];
    headers = [[5, "The Dough"], [1, "The Poolish"]];
    markdown = `## Process
### Part 1
- Mix all the ingredients together until combined, you will see the dough will amalgamate into a ball, this should not take more than 2mn.
- Cover and let it rise for 8 to 10 hours, I leave the dough in the cold oven.
- Mix everything keep 1 hour at room temperature to activate the leavened then put it in the fridge 16to24 hours
### Part 2
- Make the pizza dough
- 16 to 24 hours `;

    recipeCounter += whichRecipe;
  }


  //* Levain for Bread
  if (whichRecipe.includes("Levain")) {
    recipe = [
      ['Bread Flour', 40, "d"],
      ['Whole Wheat Flour', 40, "d"],
      ['Water', 80, "w"],
      ['Sourdough Starter', 8, "s"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Bread for Bread
  if (whichRecipe.includes("Bread for Bread")) {
    recipe = [
      ['Bread Flour', 766, "d"],
      ['Whole Wheat Flour', 161, "d"],
      ['Water', 635, "w"],
      ['Sourdough Starter', 169, "s"],
      ['Water 2', 50, "w"],
      ['Salt', 19, "d"]
    ];

    recipeCounter += whichRecipe;
  }


  //* Focaccia
  if (whichRecipe.includes("Focaccia")) {
    recipe = [
      ['AP Flour', 360, "d"],
      ['Water', 284, "w"],
      ['Olive Oil', 18, "n"],
      ['Salt', 9, "d"],
      ['Sugar', 5, "d"],
      ['Yeast', 3, "d"]
    ];
    recipeCounter += whichRecipe;
    markdown = `## Process
### To make the dough:
- **Weigh your flour;** or measure it by gently spooning it into a cup, then sweeping off any excess.
- In a large bowl (a 3-quart bowl with a lid works great), whisk together the flour, salt, sugar, and yeast.
- Add the water and olive oil and stir — with a spatula, bowl scraper, dough whisk, or your hands — until the mixture is thoroughly combined and homogeneous; there should be no dry patches or lumps. Cover the bowl and set it aside for 15 minutes.
- Perform the first bowl fold: Use a wet hand to grab a section of dough from one side of the bowl, then lift it up and press it into the center. Repeat this motion, grabbing a new section of dough each time, until you've made a full circle around the bowl, about 8 to 12 times. Once you’ve circled the bowl, flip the dough over in the bowl so that the smooth side is up; the first bowl fold is now complete. Cover the bowl and let the dough rest for 15 minutes.
> Note: You'll be doing this three more times over the next 45 minutes, each time further developing the dough's strength.
- Repeat the bowl fold for a second time. (Remember to use a wet hand to prevent the dough from sticking!) At this point, the dough should feel smoother and tighter. Cover the bowl and let the dough rest for 15 minutes. 
- Repeat the bowl fold for a third time. Cover the bowl and let the dough rest for 15 minutes.
- Repeat the bowl fold for a fourth and final time; the dough should feel relatively strong.
- Cover the bowl and let the dough rise at a warm room temperature (70°F to 75°F) for 1 hour; see this post, Where to put dough to rise, for tips. After 1 hour, the dough should have nearly doubled in size and will be vry puffy; it may even have a few bubbles on the surface.
- To prepare the pan:
    - Once the dough has risen, spray the bottom and sides of a 9" square Fabulous Focaccia Pan with nonstick spray. (See “tips,” below for details about this pan as well as alternative pan options.)
    - Cut a 3"-wide strip of parchment that's about 16" long. Lay the strip across the center of the pan, leaving a few inches of overhang on two sides; press it firmly into the pan and crease the parchment where it meets the sides of the pan to help it stay in place. (The parchment tabs will help you remove the focaccia from the pan later.)
    - Spray the parchment with nonstick spray, then add 1 tablespoon (13g) of the olive oil and ilt the pan to spread the oil evenly across the bottom.
- Use a bowl scraper or flexible spatula to gently transfer the risen dough to the center of the pan. Using your hand as paddles (and a bowl scraper for assistance, if you need it) swiftly but gently flip the dough over so that it's coated in oil; try to handle the dough minimally to keep it from deflating.
- Cover the pan and let the dough rise at a warm room temperature for 1 to 1 1/2 hours, until it's marshmallowy and jiggly; the dough should nearly fill the corners of the pan and be very close to the top edge.
- Toward the end of the rise, preheat the oven to 475°F with racks in the upper and lower thirds.
- Once the dough has risen, lightly coat your fingers in oil. Starting at one edge, press your fingertips into the dough until they reach the bottom of the pan, creating dimples. Repeat this process, working your way from one edge to the other, spacing the dimples about 1 1/2" apart. The goal is to thoroughly dimple the dough without deflating it — aim for decisive yet gentle motions. If there are any large untouched areas of the dough, add additional dimples using one finger.
### To top the dough:
- Drizzle the remaining 1 tablespoon (13g) olive oil all over the surface of the dough; it's OK if it pools in some dimples.
- Sprinkle evenly with flaky salt (use 1 generously rounded teaspoon Cyprus Flake Salt or 1/2 teaspoon Maldon).
- Bake the focaccia on the lower rack for 15 to 18 minutes, until brown in the highest spots and golden in the crevices. If necessary, move the pan to the top rack and broil briefly for the final 1 to 2 minutes, watching carefully, to achieve the desired color.
- Remove the focaccia from the oven. Using the parchment tabs as handles, lift the focaccia out of the pan and transfer it to a wire rack or cutting board; remove the parchment strip. Turn off the oven and slide the focaccia back into the oven, directly on the lower rack, for 5 to 7 minutes, until the sides are golden brown and crisp. Remove the focaccia from the oven once again and transfer it to a wire rack to cool completely.
### Storage information:
- Focaccia is best enjoyed the day it's made. If storing leftovers, wrap the focaccia loosely in foil, keep it at room temperature, and reheat before serving.
---
### Tips from our Bakers
- The temperature of your ingredients and rising environment will impact how long it takes for your dough to rise. In warmer months (or when your indoor temperature is 70°F to 75°F), the liquid should be 90°F to 100°F. In cooler months (or when your indoor temperature is around 65°F), use 100°F to 110°F liquid. The desired dough temperature after mixing (step two) should be between 82°F and 86°F; if it's outside of this range, your dough may rise on a different timeline. See this blog post about where to put dough to rise for troububleshooting tips.`
  }


  //* Agnolotti
  if (whichRecipe.includes("Agnolotti")) {
    recipe = [
      ['AP Flour', 100, "d"],
      ['Yolks', 36, "w"],
      ['Egg', 18, "w"],
      ['Milk', 5.3, "w"],
      ['Salt', 1.63, "d"],
      ['Olive Oil', 2.1, "n"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Cooked vs uncooked pasta
  if (whichRecipe.includes("Uncooked")) {
    recipe = [
      ['Dry Pasta', 120, "d"],
      ['Cooked Dry Pasta', 290, "w"],
    ]
  }


  //* Chitarra pasta
  if (whichRecipe.includes("Chitarra")) {
    recipe = [
      ['00 Flour', 115, "d"],
      ['Semolina Flour', 85, "d"],
      ['Eggs', 100, "w"],
      ['Salt', 3.04, "d"]
    ]
  }

  //* Turmeric Chicken
  if (whichRecipe.includes("Turmeric")) {
    recipe = [
      ['Chicken Thighs', 450, "d"],
      ['Water', 60, "w"],
      ['Honey', 30, "w"],
      ['Black Pepper', 1, "d"],
      ['Apple Cider Vinegar', 10, "w"],
      ['Salt', 2, "d"],
      ['Mustard', 30, "w"],
      ['Turmeric', 6, "d"],
      ['AP Flour', 10, "d"],
      ['Asparagus', 150, "d"],
      ['Rice Vinegar or Soy Sauce', 5, "w"]
    ];
    markdown = `## Process:
1. Stir together water with the honey, pepper, and 1/2 teaspoon salt; set aside.
2. Combine flour, turmeric and 1 teaspoon salt. Add the chicken and toss to coat.
3. Over medium-high heat, add the chicken to a skillet and cook until the chicken is golden brown on both sides, 2 to 3 minutes per.
4. Add the asparagus, season with salt, stir to combine and cook until crisp-tender, 1 to 2 minutes.
5. Add the honey mixture and cook, stirring, until the chicken is cooked through and the sauce has thickened, 2 to 3 minutes.
6. Remove from heat and stir in the vinegar, if using. Season to taste with salt and pepper. Serve with lime squeezed over top, if you like.
 7. Drizzle with rice vinegar or soy sauce and serve.`;
    recipeCounter += whichRecipe;
    console.log(`markdown: ${markdown}`);

  };


  //* Karaage Chicken
  if (whichRecipe.includes("Karaage")) {
    recipe = [
      ['Chicken Thighs', 325, "d"],
      ['Grated Ginger', 10, "D"],
      ['Grated or Crushed Garlic', 10, "w"],
      ['Dry Sake', 10, "w"],
      ['Soy Sauce', 45, "w"],
      ['Sugar', 5, "d"],
      ['Salt', 2.5, "d"],
      ['AP Flour', 40, "d"],
      ['Cornstarch or Potato Starch', 80, "d"]
    ]
    markdown = `## Process:
- Combine sake, soy sauce, and sugar in a small pan over low heat until the sugar dissolves. Add ginger and garlic and stir to combine.
- Place chicken in the mixture, cover, and refrigerate for an hour, ideally more, up to 24 hours. Turn contents occasionally to make sure all areas are coated.
- Place potato starch and flour in a bowl and whisk to combine.
- Place a few pieces of chicken in the flour mixture and toss to coat. Remove to a wire rack or paper towel to rest. The flour mixture will absorb some of the marinade. Leave for 15-30 minutes.
- Heat oil in a pot to 350°F/177°C.
- If the pieces still look dry on the outside, lightly spritz with water from a spray bottle. This will encourage more of the flour mixture to stick.
- Repeat the flour dredging process a second time with all pieces of chicken to double-coat them.
- Fry the chicken in the oil a few pieces at a time. (The temperature of the oil will drop when the chicken is added.) Bite-sized pieces will be done in 60-90 seconds. Remove when ready and place on a wire rack or paper towels.
- Between frying batches, make sure the oil is back up to temperature before adding the next batch.`;
    recipeCounter += whichRecipe;
  };





  //* Basic pasta (egg and flour)
  if (whichRecipe.includes("Basic")) {
    recipe = [
      ['Egg', 50, "w"],
      ['Flour', 94, "d"],
      ['Salt', 1.16, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Ricotta Gnocchi
  if (whichRecipe.includes("Ricotta")) {
    recipe = [
      ['Flour', 110, "d"],
      ['Ricotta', 240, "w"],
      ['Egg', 100, "w"],
      ['Parmesan', 15, "d"],
      ['Salt', 3.75, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* All Durum Dough
  if (whichRecipe.includes("All Durum")) {
    recipe = [
      ['Durum Flour', 155, "d"],
      ['Egg', 70, "w"],
      ['Salt', 2.33, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Al Dente Pasta Dough
  if (whichRecipe.includes("Dente")) {
    recipe = [
      ['Durum Flour', 90, "d"],
      ['AP Flour', 70, "d"],
      ['Egg', 50, "w"],
      ['Water', 30, "w"],
      ['Salt', 1.87, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Culurgione Pasta Dough
  if (whichRecipe.includes("Culurgione Pasta Dough")) {
    recipe = [
      ['AP Flour', 150, "d"],
      ['Semolina Flour', 100, "d"],
      ['Water', 145, "w"],
      ['Salt', 3.2, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Culurgione Filling
  if (whichRecipe.includes("Culurgione Filling")) {
    recipe = [
      ['Potatoes (skins=10%, 15mins @325)', 230, "d"],
      // ['Potatoes (skins=10%, 15mins @325)', 230, "d"],
      ['Aged Pecorino', 23, "d"],
      ['Fresh Pecorino', 46, "d"],
      ['Goat Cheese', 46, "d"],
      ['Chopped Mint', 2, "d"],
      ['Egg', 12, "w"],
      ['Garlic', 3, "d"],
      ['Olive Oil', 15, "w"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Potato Gnocchi
  if (whichRecipe.includes("Potato G")) {
    recipe = [
      ['Potato', 600, "d"],
      ['AP Flour', 170, "d"],
      ['Egg', 50, "w"],
      ['Salt', 8, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Ravioli Pasta Dough
  if (whichRecipe.includes("Ravioli")) {
    recipe = [
      ['AP Flour', 80, "d"],
      ['Semolina Flour', 70, "d"],
      ['Whole Wheat Flour', 70, "d"],
      ['Water', 60, "w"],
      ['Egg', 50, "w"]
    ];

    recipeCounter += whichRecipe;
  }

  //   Ingredients
  // For the pasta:

  //   2 oog 2 cups buckwheat flour
  //   100 g 1 cup white all purpose flour
  //   1 egg
  //     Water q.b.
  //     A pinch of salt

  // For the condimento:

  //   4 medium potatoes peeled and thinly sliced
  //   1 head of Savoy cabbage cored and thinly sliced
  //   200 g 7 oz butter
  //   1 - 2 cloves of garlic
  //     A sprig of fresh sage
  //   200 g 7 oz bitto or another semi - soft Alpine cheese
  //   100 g 3 - 1 / 2 oz freshly grated Parmesan cheese




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
    markdown = `1. Gently heat the stracciatella in a pan. You want it warm, not hot.
2. Add lemon juice and zest to the cheese and stir to combine. Set on keep warm setting.
3. Cook asparagus and pasta.
4. Add pasta to the cheese and mix.
5. Add asparagus and serve.`;
    recipeCounter += whichRecipe;
  }


  //* Trapanese Pesto
  if (whichRecipe.includes("Trapanese")) {
    recipe = [
      ['Plum Tomatoes', 450, "d"],
      ['Garlic', 10, "d"],
      ['Almonds', 35, "d"],
      ['Mint', 8, "d"],
      ['Basil', 20, "d"],
      ['EVOO', 80, "n"],
      ['Pecorino', 25, "d"],
      ['Pasta', 450, "d"],
    ];
    recipeCounter += whichRecipe;
  }

  //* Plum tomatoes – 1 pound → 450 g(about 5–6 medium tomatoes)
  //* Blanched, slivered almonds – ⅓ cup → 35 g
  //* Garlic cloves, peeled – 2 cloves → about 10 g
  //* Packed mint leaves, coarsely chopped – 1½ cups → 30 g
  //* Kosher salt(such as Diamond Crystal) – to taste(≈ 5 g for cooking water + seasoning as desired)
  //* Black pepper – to taste
  //* Olive oil – ⅓ cup → 80 mL
  //* Busiate, fusilli lunghi, or spaghetti – 1 pound → 450 g
  //* Grated Pecorino – ¼ cup → 25 g




  //* Starter
  if (whichRecipe.includes("Starter")) {
    recipe = [
      ['AP Flour', 28, "d"],
      ['Rye Flour', 14, "d"],
      ['Water', 40, "w"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Hollandaise
  if (whichRecipe.includes("Hollandaise")) {
    recipe = [
      ['Butter', 150, "w"],
      //      ['Egg Yolk (~17g Each)', 85, "w"],
      ['Egg Yolk', 85, "w"],
      ['Water', 50, "w"],
      ['Lemon Juice', 20, "w"],
      ['Salt', 3, "d"]
    ];
    recipeSteps = "147° for 1 hour";
    markdown = `## Process
- Combine in a zip-lock bag.
- Poach in a 147°F (64°C) water bath for 1 hour.
- Remove from bag and whisk to combine.
- Adjust seasoning with salt and lemon juice to taste.`;
    recipeCounter += whichRecipe;
  }

  //* Sauce for Pasta
  if (whichRecipe.includes("Pasta Sauce")) {
    recipe = [
      ['Pasta', 142, "d"],
      ['Tomato Sauce', 275, "w"]
    ];
    recipeSteps = "";
    recipeCounter += whichRecipe;
  }

  //* Sauce for Gnocchi
  if (whichRecipe.includes("Gnocchi Sauce")) {
    recipe = [
      ['Gnocchi', 250, "d"],
      ['Sauce', 150, "w"]
    ];
    recipeSteps = "";
    recipeCounter += whichRecipe;
  }

  // Hazan's recipe converted to grams and adjusted for moisture content
  // Converted Recipe Ingredients(Metric Weights)

  // I've converted the volume-based measurements to approximate metric weights (in grams) using standard culinary densities for each ingredient. These are precise estimates for accuracy in cooking. Yields remain the same: 2 heaping cups sauce (about 6 servings with 680-750g pasta).

  //     ** Ingredients **
  //     - 15g vegetable oil
  //     - 45g butter, plus 15g for tossing the pasta
  //     - 80g chopped onion(½ cup)
  //     - 100g chopped celery(⅔ cup)
  //     - 100g chopped carrot(⅔ cup)
  //     - 340g ground beef chuck(¾ pound; or use 1 part pork to 2 parts beef)
  //     - Salt
  //     - Black pepper, ground fresh from the mill
  //     - 240g whole milk(1 cup)
  //     - Whole nutmeg
  //     - 240g dry white wine(1 cup)
  //     - 450g canned imported Italian plum tomatoes, cut up, with their juice(1½ cups)
  //     - 565 - 680g pasta(1¼ to 1½ pounds)
  //     - Freshly grated Parmigiano - Reggiano at the table

  //   Note: Weights for chopped vegetables assume medium dice(about 0.5cm pieces).For liquids like milk and wine, 1 cup = 240g(or ml).Adjust slightly based on exact ingredient density if needed.
  if (whichRecipe.includes("Bolognese")) {
    recipe = [
      ['Ground Beef', 340, "d"],
      ['Tomato', 450, "d"],
      ['Milk', 240, "w"],
      ['White Wine', 240, "w"],
      ['Onion', 80, "d"],
      ['Celery', 100, "d"],
      ['Carrot', 100, "d"],
    ];
    // recipe = [
    //   ['Ground Beef', 226, "d"],
    //   ['Tomato', 300, "d"],
    //   ['Milk', 120, "w"],
    //   ['White Wine', 120, "w"],
    //   ['Onion', 80, "d"],
    //   ['Celery', 67, "d"],
    //   ['Carrot', 67, "d"],
    // ];

    recipeCounter += whichRecipe;
    markdown = `
# Bolognese Sauce
## Ingredients
### Preparation
1. Heat a large (roughly 5-Quart) heavy-bottomed Dutch oven or pot over medium-low heat.
2. Add the olive oil and butter. Once the butter has melted, add the diced onions and ½ teaspoon Diamond Crystal kosher salt (note: if using a different brand of cooking salt, reduce quantity by at least half).
3. Sauté the onions, stirring often, until softened and nearly translucent, about 5 to 7 minutes. Add the celery, carrots, and another pinch of salt. Cook for 2 to 3 minutes, stirring often. Add the garlic and red pepper flakes, if using, and cook until fragrant, stirring constantly, about 1 minute or so.
4. Add the ground beef, a generous pinch of kosher salt, and freshly ground black pepper.
5. Cook over medium heat, breaking up the meat with a fork as needed, until nearly cooked through and no longer raw, about 3 to 5 minutes.
6. Add the milk and simmer over low heat, stirring frequently, until the milk has mostly cooked out, about 5 to 7 minutes.
7. Stir in the freshly grated nutmeg.
8. Add the white wine and simmer until evaporated, about 3 to 5 minutes. Add the canned tomatoes and parmesan rinds and stir mixture to combine.
9. Bring to a slow boil, then reduce heat immediately to a very, very low simmer (*only a few and small bubbles on the surface of the sauce).
10. Simmer the sauce, uncovered, for at least 3 to 4 hours, stirring every so often. Add a splash of water as needed throughout the simmer time.
11. Season to taste with salt and pepper, remove and discard the parmesan rinds.
* **Cooking Note:** As Marcella explains, the simmer time can be broken up into various stages throughout the same day if needed. Simply remove the sauce from the heat, cover with a lid, and resume simmering later. Once you have prepared the sauce base, you can also transfer it to a slow cooker or Instant pot (set to low 'slow cook' mode) for an easy, hands-off simmer option. * For Serving: Toss with boiled cooked pasta – ideally finishing the al dente pasta in the warm sauce – until well-coated. Serve with freshly grated parmigiano-reggiano cheese on the side.
      `;
  }

  //* Ssamjang Sauce
  if (whichRecipe.includes("Ssamjang")) {
    recipe = [
      ['Beef Stock', 70],
      ['Samjang', 60],
      ['Light Miso', 20],
      ['Gochujang', 15],
      ['Red Wine Vinegar', 15]
    ];
    recipeSteps = "";
    recipeCounter += whichRecipe;
  }

  //* Meatballs
  // Prior version was a bit liquidy, but texture was amazing. Lowering crumbs and milk a bit as much of the
  // milk is wasted anyway
  // ['Milk', 115, "w"],
  // ['Bread Crumbs', 50, "w"],


  if (whichRecipe.includes("Meatballs")) {
    recipe = [
      ['Ground Beef', 280, "d"],
      ['Milk', 100, "w"],
      ['Bread Crumbs', 40, "w"],
      ['Onion', 40, "d"],
      ['Egg', 30, "w"],
      ['Parmesan', 30, "d"],
      ['Parsley', 5, "d"],
      ['Salt', 4, "d"],
      ['Garlic Powder', 3, "d"]
    ];
    markdown = `1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.
2. Combine all ingredients and knead until evenly distributed. Meatballs should be wet and somewhat sticky.
3. In a medium-heat pan, brown meatballs on all sides.
4. Combine meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning halfway through.
5. Combine with pasta and serve

Alternatively, they can be baked at 350° for 15 minutes`;
    recipeCounter += whichRecipe;
  }


  //* Albondigas
  if (whichRecipe.includes("Albondigas")) {
    recipe = [
      ['Ground Beef', 280, "d"],
      ['Milk', 125, "w"],
      ['Bread Crumbs', 50, "d"],
      ['Rice (Roma)', 100, "d"],
      ['Egg', 50, "w"],
      ['Onion', 40, "d"],
      ['Parmesan', 30, "d"],
      ['Parsley', 5, "d"],
      ['Salt', 4, "d"],
      ['Garlic Powder', 3, "d"]
    ];
    markdown = `## Process
  ### It's a little hard to believe this is going to stay together, but it does.
  1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.
  2. Combine all ingredients and knead until ingredients are distributed. Meatballs should be wet and somewhat sticky.
  3. In a medium-heat pan, brown meatballs on all sides.
  4. Add meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning meatballs halfway through.
  5. Combine with pasta and serve\nThey can be baked at 350° for 15 minutes`;
    recipeCounter += whichRecipe;
  }

  //* Mashed Potatoes
  if (whichRecipe.includes("Mashed")) {
    recipe = [
      ['Potatoes', 700, "d"],
      ['Sour Cream', 130, "w"],
      ['Butter', 66, "w"],
      ['White Pepper', 3, "d"],
      ['Salt', 4, "d"],
      ['Wasabi Salt', 2.5, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Shakshuka
  if (whichRecipe.includes("Shakshuka")) {
    recipe = [
      ['Tomato', 200],
      ['Harissa', 25],
      ['Onion', 50],
      ['Red Pepper Flakes', 20],
      ['Garlic', 10],
      ['Paprika', 6],
      ['Cumin', 3]
    ];

    recipeCounter += whichRecipe;
  }

  //* Tatty Scones
  if (whichRecipe.includes("Tatty")) {
    recipe = [
      ['Potato', 500, "d"],
      ['Flour', 100, "d"],
      ['Butter', 50, "n"],
      ['Salt', 5, "d"]
    ];

    recipeCounter += whichRecipe;
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
    recipeCounter += whichRecipe;
  }


  //* Masa Dumplings
  // 1/2 cup(61g) corn masa
  // 3/4 cup(73g) all - purpose flour
  // 1 tsp baking powder
  // 2 tsp salt
  // 3 Tbsp butter, softened
  // 2 eggs
  // 2 Tbsp chopped cilantro
  // 1/2 cup(119g) chicken broth
  if (whichRecipe.includes("Masa Dumplings")) {
    recipe = [
      ['Masa', 50, "d"],
      ['AP Flour', 85, "d"],
      ['Baking Powder', 3, "d"],
      ['Butter', 45, "w"],
      ['Eggs', 100, "w"],
      ['Chicken Broth', 120, "w"],
      ['Salt', 6, "d"]
    ];
    markdown = `
# Masa Dumplings
## Preparatiion
- Melt butter
- Combine butter, flours, and salt and mix together until crumbly.
- Whisk eggs and broth together.
- Combine the wet and dry ingredients.
- Allow dough to rest at least 15 minutes, preferably longer.
- Cookk on grey non-stick pan on big burner at 6.0 heat. 
`;
    recipeCounter += whichRecipe;
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

    reciPortions = 6;
    recipeCounter += whichRecipe;
  }


  //* Blinis
  if (whichRecipe.includes("Blinis")) {
    recipe = [
      ['Buttermilk', 475, "w"],
      ['Egg', 110, "w"],
      ['Butter', 28, "w"],
      ['Buckwheat Flour', 140, "d"],
      ['AP Flour', 70, "d"],
      ['Sugar', 8, "d"],
      ['Salt', 2, "d"],
      ['Baking Powder', 2, "d"],
      ['Baking Soda', 1, "d"]
    ];

    reciPortions = 50;
    recipeCounter += whichRecipe;
  }

  //* Spanish Rice
  if (whichRecipe.includes("Spanish")) {
    recipe = [
      ['Water', 300, "w"],
      ['Rice', 200, "d"],
      ['Bell Pepper', 80, "d"],
      ['Tomato Paste', 30, "w"],
      ['Cumin', 3, "d"],
      ['Salt', 4.93, "d"],
      ['Dried Garlic', 2, "d"]
    ];
    recipeCounter += whichRecipe;
  }

  //* Crispy Kale
  if (whichRecipe.includes("Kale")) {
    recipe = [
      ['Kale', 100, "d"],
      ['Olive Oil', 10, "n"],
      ['Salt', 3, "d"]
    ];
    recipeCounter += whichRecipe;
    markdown = `## Process
- Preheat oven to **320°F** Convection.
- Wash and thoroughly dry the kale.
- Remove the leaves from the thick stems and tear them into bite-sized pieces.
- Place the kale pieces in a large bowl. Drizzle with olive oil and sprinkle with salt. Use your hands to massage the oil and salt into the kale, ensuring each piece is well coated.
- Arrange the kale pieces in a single layer on a baking sheet lined with parchment paper or a silicone baking mat. Avoid overcrowding to ensure even crisping.
- Bake in the preheated oven for about **10 minutes**, turning the pieces halfway through, until the kale is crispy but not burnt.
    `
  }

  //* ___________________________________________________________________________
  //* Drinks and Sauces
  //* ___________________________________________________________________________

  // * Lemon(ade) Spritzer
  if (whichRecipe.includes("Lemonade Spritzer")) {
    recipe = [
      ['Lemonade', 100],
      ['Soda Water', 80]
    ]

    recipeCounter += whichRecipe;
  }

  //* Bloody
  if (whichRecipe.includes("Bloody")) {
    recipe = [
      ['V8', 150],
      ['Soy Sauce', 5],
      ['Horseradish', 3],
      ['Lemon Juice', 2],
      ['Worcestershire', 2],
      ['Tabasco Sauce', 1]
    ];

    recipeCounter += whichRecipe;
  }

  //* Sangrita
  if (whichRecipe.includes("Sangrita")) {
    recipe = [
      ['Tomato Juice', 70],
      ['Orange Juice', 25],
      ['Lime', 4],
      ['Cholula', 2]
    ];

    recipeCounter += whichRecipe;
  }

  //* Risotto - 05-03-26 - Adjusted to more appropriate amount for two people 
  if (whichRecipe.includes("Risotto")) {
    recipe = [
      ['Stock', 325, 'w'],
      ['Carnaroli', 130, 'd'],
      ['Vegetable Oil', 35, 'n'],
      ['Onion', 10, 'd'],
      ['Salt', 4.64, 'd']
    ];

    recipeCounter += whichRecipe;
  }

  //* Cavatelli
  if (whichRecipe.includes("Cavatelli")) {
    recipe = [
      ['AP Flour', 120, 'd'],
      ['Durum Flour', 50, 'd'],
      ['WW', 20, 'd'],
      ['Water', 55, 'w'],
      ['Egg', 50, 'w'],
      ['Salt', 3, 'd']
    ];

    recipeCounter += whichRecipe;
  }

  //* Bechamel
  if (whichRecipe.includes("Bechamel")) {
    recipe = [
      ['Flour', 15],
      ['Butter', 15],
      ['Milk', 175],
      ['Mustard', 15]
    ];

    recipeCounter += whichRecipe;
  }

  //* Bullshot
  if (whichRecipe.includes("Bull")) {
    recipe = [
      ['Vodka', 50],
      ['Beef Stock', 100],
      ['Worcestershire Sauce', 5.25],
      ['Red Wine Vinegar', 1.25],
      ['Soy Sauce', 5.25],
      ['Tabasco Sauce', 0.62]
    ];

    recipeCounter += whichRecipe;
  }

  //* Margarita
  if (whichRecipe.includes("Margarita")) {
    recipe = [
      ['Curaçao', 85],
      ['Tequila', 33],
      ['Lime Juice', 33]
    ];

    recipeCounter += whichRecipe;
  }

  //* Polenta
  if (whichRecipe.includes("Polenta")) {
    recipe = [
      ['Water', 400, "w"],
      ['Polenta', 90, "d"],
      ['Sour Cream', 30, "w"],
      ['Butter', 15, "w"],
      ['Salt', 5.3, "d"],
      ['Cheese', 120, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Farro
  if (whichRecipe.includes("Farro")) {
    recipe = [
      ['Farro', 100, "d"],
      ['Water', 360, "w"],
      ['Salt', 4, "d"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Dutch Baby
  if (whichRecipe.includes("Dutch")) {
    recipe = [
      ['Flour', 120, "d"],
      ['Cheese', 72, "d"],
      ['Thyme', 1, "d"],
      ['Parsley', 1, "d"],
      ['Egg', 400, "w"],
      ['Milk', 176, "w"],
      ['Unsalted Butter', 89, "w"]
    ];

    recipeCounter += whichRecipe;
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

    recipeCounter += whichRecipe;
  }

  //* Injeera
  if (whichRecipe.includes("Injeera")) {
    recipe = [
      ['Water', 300, "w"],
      ['AP Flour', 75, "d"],
      ['Teff Flour', 40, "d"],
      ['Starter', 175, "s"]
    ];

    recipeCounter += whichRecipe;
  }

  //* Ponzu Sauce
  if (whichRecipe.includes("Ponzu")) {
    recipe = [
      ['Kombu', 1],
      ['Rice Vinegar', 30],
      ['Mirin', 12],
      ['Katsuobushi', 15],
      ['Yuzu', 120],
      ['Soy Sauce', 120]
    ];

    recipeCounter += whichRecipe;
  }

  //* ___________________________________________________________________________
  //* Cocktails
  //* ___________________________________________________________________________

  //* Coconut Rum Julep
  if (whichRecipe.includes("Julep")) {
    recipe = [
      ['Rum', 43],
      ['Simple', 21],
      ['Lime', 14],
      ['Coconut', 21]
    ];

    recipeCounter += whichRecipe;
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

    recipeCounter += whichRecipe;
  }

  //* Cable Car
  if (whichRecipe.includes("Cable")) {
    recipe = [
      ['Spiced Rum', 45],
      ['Curacao', 22],
      ['Lemon Juice', 30],
      ['Simple', 15]
    ];

    recipeCounter += whichRecipe;
  }

  //* Mexican
  if (whichRecipe.includes("Mexican")) {
    recipe = [
      ['Pineapple', 70],
      ['Tequila', 28],
      ['Triple Sec', 10]
    ];

    recipeCounter += whichRecipe;
  }

  //* Mai Tai
  if (whichRecipe.includes("Mai Tai")) {
    recipe = [
      ['Dark Rum', 30],
      ['Light Rum', 30],
      ['Lime', 30],
      ['Orange Curacao', 15],
      ['Orgeat', 15],
      ['Simple', 7.5]
    ];

    recipeCounter += whichRecipe;
  }

  //* Soda
  if (whichRecipe.includes("Soda")) {
    recipe = [
      ['Fizzy Water', 300],
      ['Flavor Syrup', 40]
    ];

    recipeCounter += whichRecipe;
  }

  //* Tea
  if (whichRecipe.includes("Tea")) {
    recipe = [
      ['Water', 500],
      ['Loose Tea', 6]
    ];

    recipeCounter += whichRecipe;
  }

  //* Egg Topping
  if (whichRecipe.includes("Egg")) {
    recipe = [
      ['Egg', 58],
      ['Water', 8]
    ];

    recipeCounter += whichRecipe;
  }

  //* Turkey Masala
  if (whichRecipe.includes("Turkey Masala")) {
    recipe = [
      ['Garam Masala', 5, "d"],
      ['Coriander', 2, "d"],
      ['Cumin', 2, "d"],
      ['Paprika', 8, "d"],
      ['Turmeric', 4, "d"],
      ['Kosher Salt', 1, "d"],
      ['Red Pepper Flakes', 0.5, "d"],
      ['Garlic', 3, "d"],
      ['Ginger', 3, "d"],
      ['Whole Milk Yogurt', 118, "w"],
      ['Chicken or Turkey', 2, "w"],
      ['Onion', 1, "d"],
      ['Cardamom Pods', 0.25, "d"],
      ['Whole Peeled Tomatoes', 1, "w"],
      ['Heavy Cream', 1, "w"],
      ['Bay Leaf', 1, "n"],
      ['Kosher Salt', 9, "d"],
      ['Fresh Cilantro', 0.75, "d"],
      ['Lemon Juice', 1, "w"],
      ['Steamed Basmati Rice', 1, "n"]
    ];
    markdown = `## For the Marinade
### Spices
- 5g(3 tsp) garam masala
- 2 tsp coriander(4g)
- 2 tsp cumin(5g)
- 8g(1 Tbsp + 1 tsp) paprika
- 4 tsp turmeric 7g
- 1 tsp kosher salt 3g
- ½ tsp red pepper flakes(optional)
- 3 cloves garlic, finely grated or pounded in a mortar and pestle
- 3 tsp finely grated fresh ginger
- 118g 1 / 2 cup whole - milk yogurt
- 2 cups chicken or turkey

## For the masala:
- 1 large onion, thinly sliced
- 1 / 4 tsp ground or(6 cardamom pods), crushed
- 1 can whole peeled tomatoes 101g
- 1 cup heavy cream 240g
- 1 Bayleaf
- 9g 1 ½ tsp kosher salt, plus more to taste
- ¾ C coarsely chopped fresh cilantro, plus a few sprigs for garnish
- Juice of 1 small lemon
- Steamed basmati rice, for serving
`
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
      ['J', 10],
      ['K', 11],
      ['L', 12],
      ['M', 13],
      ['N', 14],
      ['O', 15],
    ];
    recipeCounter += whichRecipe;
  }


  // console.log(`recipeCounter: ${recipeCounter}`);
  //* Check to see that recipeCounter only equals 1. If it's more than that, you have duplicate hits on a recipe
  if (recipeCounter > 1 && !suppressAlerts) {
    // alert(`More than one recipe has been triggered. ${whichRecipe} has been triggered ${recipeCounter} times. Please check the recipe names for duplicates.`);
    alert(`More than one recipe has been triggered.`);
  }

  //* Likewise, if it's zero, you have no matches and we have a choice without a recipe
  if (recipeCounter == 0 && !suppressAlerts) {
    alert("No recipe has been triggered.");
  }

  localStorage.setItem("theRecipe", recipe);

  //* now go build the table based on the recipe array. This will also populate the ingredients and rs arrays, which are used for calculations and display throughout the rest of the program. It will also populate the dryWetNull array, which is used to determine how each ingredient contributes to the hydration calculation.
  makeTable();

  //* Stick the title of the recipe in the title section.
  // But first, strip out the spaces
  recipeName = whichRecipe.replace("&nbsp;&nbsp;", "");
  document.getElementById("recipeTitle").innerHTML = recipeName;
  document.getElementById("titleRow").style.display = "";

  //* If the recipe has headers, put those in.
  //* If not, hida and blank out the header lines that may have been left from before.

  //* But first, clear out any prior ones.
  // for (let index = 1; index < 10; index++) {
  //   document.getElementById(`row${index}a`).style.display = "none";
  //   document.getElementById(`head${index}`).innerHTML = "";
  // }

  //* Parse the recipe for section breaks
  // for (let index = 0; index < headers.length; index++) {
  //   console.log(`The row is ${headers[index][0]} and the title is ${headers[index][1]}`);
  //   document.getElementById("row" + headers[index][0] + "a").style.display = "";
  //   document.getElementById("head" + headers[index][0]).innerHTML = headers[index][1];
  // };



  //* Load the variables into the ingredients and quantities arrays
  var wetIngs = 0, dryIngs = 0, hydration = 0;

  for (let x = 0; x < recipe.length; x++) {
    ingredients[x] = recipe[x][0];
    rs[x] = Number(recipe[x][1]);
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

  if (ingredientColorMode != 1) {
    colorIngs();
  }
  //* Colorize the ingredients based on their type.
  colorizeIngredients();


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


  // * Write the values to the fields
  for (let arrayCount = 0; arrayCount < recipe.length; arrayCount++) {
    let fieldCount = arrayCount + 1;
    // Once the values are loaded, write them to the arrays
    // Update the class of this row to reflect either a middle or the bottom of the list

    // Write those values to the fields
    document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount];
    document.getElementById("recipeSays" + fieldCount).value = rs[arrayCount];
    let temp = Number(rs[arrayCount] / 28.3495);
    document.getElementById("recipeSaysImp" + fieldCount).value = fixDigits(temp);
  }

  tallyIt();

  // Set the Sync button based on the inverse of whether or not the current recipe is "Reset."
  // Hence, if it IS set to Reset, then synced will be OFF
  // If it's anything else, synced will be ON
  synced = whichRecipe != "Reset";
  colorSyncedFields();
  // localStorage.getItem("syncVals") == "true";

  // If there is a portion value, include that as well
  if (reciPortions > 0) {
    document.getElementById("portions").value = reciPortions;
    portionIt();
  }


  // Now go put equivalent amounts for salt and butter in the respective fields
  butterAndSalt();

  // Show the recipe in the recipe steps area
  showRecipe();

  // Clear individual sum checkboxes
  clearSumChecks();

  // Do a tally of the various variables
  updateTotals();
  updateMultiplier();
}

function makeTable() { // Make the table rows for the ingredients. We have to do this after we parse the headers, because the headers may change the row numbers of the ingredients. So we have to wait until we know where the ingredients are before we can write them in.

  // Go get that table body so we can write the rows in
  let theBody = document.getElementById('tableBody');
  // Clear out any prior rows that may have been left from before
  theBody.innerHTML = '';
  // Loop through the recipe and write the rows in. We start at 1 because the first row is the title row, which is already in the HTML and doesn't need to be generated.
  for (let index = 1; index <= recipe.length; index++) {
    console.log(index);

    let tr = document.createElement('tr');
    tr.id = 'row' + index;

    let temp = `
  <tr id="row${index}">
      <td colspan="2" class="tColumn1 synced" id="checkRow${index}">
        <input type="checkbox" class="syncBox rowCheck" id="rowcheck${index}" oninput="countChex(${index});">
          <input class="theBlocksL" type="text" id="ingredient${index}" placeholder="DYNAMIC" oninput="updateIngredient(${index});">
      </td>
      <td class="tColumn3">
        <input class="theBlocksL rightAlign" type="text" id="perc${index}">
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
                <input class="theBlocksSc rightAlign" type="number" id="youWant${index}" readonly>
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
    // First, clear it out by putting in ONLY the recipe name
    // but even before that, strip out the spaces
    // let recipeNameTemp = whichRecipe.replace("&nbsp;&nbsp;", "");
    let theRecipeString = `<h1>${recipeName}</h1><table align="center" class="table.dark">
  <tr><td width="50%" style="vertical-align: top"><table width="100%"><tbody><tr><td><h2>Ingredients</h2></td></tr>`;
    //   theRecipeString += `<table align="center" class="table.dark">
    // <tr><td width="40%" style="vertical-align: top"><table width="100%"><tbody><tr><td><h2>Ingredients</h2></td></tr>`;

    // console.log(recipeMaxLength);
    for (let index = 0; index <= recipeMaxLength - 1; index++) {
      // Write these amounts to the recipe area in the opposite order (weight then ingredient)
      let temp = rs[index].toFixed(0);
      theRecipeString += `<tr><td class="recipeStepsAmt">${temp}g</td><td class="recipeStepsIng">${ingredients[index]} </td></tr>`;
    }
    // Close the table of ingredients
    theRecipeString += `</tbody></table></td><td>`;

    // In one fell swoop, this converts the markdown recipe into HTML and puts it in the recipeSteps div.
    // This is a bit of a hack, but it works. It uses the marked.js library to convert the markdown into HTML.
    // Convert it and add it to the HTML string  
    theRecipeString += marked.parse(markdown);

    theRecipeString += `</td></tr></table>`;

    // Now stick that whole string into the recipeSteps div
    document.getElementById("recipeSteps").innerHTML = theRecipeString;
  }
}


function colorizeIngredients() {
  if (ingredientColorMode == 1) {
    let targetId;

    for (let x = 1; x <= recipe.length; x++) {
      targetId = recipe[x - 1][0];
      let thisIngColor = getIngredientColor(targetId);
      document.getElementById("checkRow" + x).style.backgroundColor = thisIngColor;
      console.log(`${targetId} is ${thisIngColor}, row is ${x}`);
    }
  }
}


function shScaling(showHide) {

  // If there is no argument, just toggle the current state
  if (showHide == "toggle") {
    scVis = !scVis;
    console.log('FLIPPED!');
  }

  if (showHide == false) {
    scVis = false;
  }
  if (showHide == true) {
    scVis = true;
  }

  console.log('Scaling Status ' + scVis);

  // Now set the display of the row based on the current state of the variable
  if (scVis == true) {
    temp = "";
  }
  else {
    temp = "none";
  }
  document.getElementById("scalerArea").style.display = temp;
  setColumnVisibility('tColumn4', scVis);
}

function setColumnVisibility(columnClass, visible) {
  document.querySelectorAll(`.${columnClass}`).forEach(cell => {
    cell.style.display = visible ? '' : 'none';
  });
}




function shHydration(showHide) {

  // If there is no argument, just toggle the current state
  if (showHide == "toggle" || showHide == undefined) {
    shHyd = !shHyd;
  } else {
    shHyd = showHide;
  }


  if (shHyd == true) {
    temp = "";
  }
  else {
    temp = "none";
  }
  document.getElementById("hydrationRow").style.display = temp;
  document.getElementById("wetDryRow").style.display = temp;
}


function shPortions(showHide) {
  // console.log('shPor Status ' + showHide);

  // If there is no argument, just toggle the current state
  if (showHide == "toggle" || showHide == undefined) {
    shPor = !shPor;
  } else {
    shPor = showHide;
  }

  // Now set the display of the row based on the current state of the variable  
  if (shPor == true) {
    temp = "";
  }
  else {
    temp = "none";
  }
  document.getElementById("portionatorRow").style.display = temp;
}


function butterAndSalt(mode) {
  let saltWeight = 0;
  for (let arrayCount = 0; arrayCount <= rs.length - 1; arrayCount++) {
    let fieldCount = arrayCount + 1;
    let tbWeight = 1,
      tsWeight = 1;
    if (ingredients[arrayCount].includes("Salt") || ingredients[arrayCount].includes("Pepper")) {

      //* Convert salt weight to Tbsp and tsp
      if (ingredients[arrayCount].includes("Salt")) {
        tbWeight = 10.134,
          tsWeight = 3.378;
        saltWeight = rs[arrayCount];
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
      let eTemp = Number(rs[arrayCount] * elgin).toFixed(1);

      // Stubbie weights (US-style) butter sticks
      let sTemp = Number(rs[arrayCount] * stubbie).toFixed(1);

      // Euro weights (European-style) butter sticks
      let euTemp = Number(rs[arrayCount] * euro).toFixed(1);
      euTemp *= 10;

      // Now string the value, some spaces, and a label togehter into a variable
      let mmString = ` - Eu ${euTemp}mm`;

      // And put that string into the ingredient field
      document.getElementById("ingredient" + fieldCount).value = ingredients[arrayCount] + mmString;
    }
    // ! End Buttermaker
  }
}


function backFromtTotal() {
  let ttlMet = 0,
    ttlImp = 0,
    totalOrig = document.getElementById("totalOrig").value;

  // console.log(`totalOrig: ${totalOrig}`);
  let fieldCountTTL = 0;
  for (let arrayCountTTL = 0; arrayCountTTL < rs.length; arrayCountTTL++) {
    fieldCountTTL = arrayCountTTL + 1;
    rs[arrayCountTTL] = Number(totalOrig * perc[arrayCountTTL]).toFixed(1);

    document.getElementById("recipeSays" + fieldCountTTL).value = rs[arrayCountTTL];
    let temp = Number(rs[arrayCountTTL] / 28.3495);
    document.getElementById("recipeSaysImp" + fieldCountTTL).value = fixDigits(temp);
    ttlImp += temp;
  }
  // document.getElementById("totalOrig").value = parseFloat(ttlMet.toFixed(1));
  document.getElementById("totalImp").value = parseFloat(ttlImp.toFixed(1));

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

  // Don't attempt to add a row if there are already ten rows
  if (ingredients.length < 10) {
    // First, we're turning off syncing because we're going to enter a value in the RS field AND store that state in local storage
    synced = false;

    // Increase the number of ingredients by 1 with this sneaky trick
    // The length of the array is always one more than the highest index, so by assigning a value to the current length index,
    // we effectively add a new element to the array.
    // This is sneaky shit.
    let lengTemp = ingredients.length;

    // Assign a null value to the ingredient and a nominal value to the amount
    ingredients[lengTemp] = "New Ingredient";
    rs[lengTemp] = 1;

    // We've added a new element to the arrays by using 0 index.
    // Now, we need to update lengTemp to reflect the new length with the added ingredient
    lengTemp = ingredients.length;

    // localStorage.setItem("ingLength", lengTemp);

    // getValues(2, ingLength);

    document.getElementById("ingredient" + lengTemp).value = ingredients[lengTemp - 1];
    document.getElementById("recipeSays" + lengTemp).value = rs[lengTemp - 1];

    // for (let thisRow = 1; thisRow <= 10; thisRow++) {
    //   if (thisRow <= lengTemp) {
    //     document.getElementById("row" + thisRow).style.display = "revert";
    //   } else {
    //     document.getElementById("row" + thisRow).style.display = "none";
    //   }
    // }

    colorSyncedFields();
    tallyIt();
    updateTotals();
  }
}

// Portion It Function - Divides total amounts by number of portions and updates the per-portion fields.
function portionIt(which) {
  let portions = document.getElementById("portions").value;

  let ttl1 = document.getElementById("totalOrig").value / portions;
  document.getElementById("weightEachG").value = parseFloat(ttl1.toFixed(1));

  // let ttl2 = document.getElementById("totalScaled").value / portions;
  // document.getElementById("weightEachS").value = parseFloat(ttl2.toFixed(1));

  if (portions > 1) {
    let x1 = ttl1 / 28.3495;
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
  document.getElementById("totalOrig").value = parseFloat(total.toFixed(1));
  document.getElementById("totalImp").value = parseFloat(totalImp.toFixed(1));
  let temp = total * multiplier;
  document.getElementById("totalScaled").value = parseFloat(temp.toFixed(1));

  portionIt();
  sumSelectedRows()
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
      document.getElementById("row" + index).style.backgroundColor = "#79588fdd";
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

  deselectRecipe(); // If any of the values in the scaler are manually altered, nullify the recipe chosen at the top because it no longer reflects what the chart 
  // console.log(`params: ${params}`);
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

  // Reset the total weight of the recipe
  total = 0;
  totalImp = 0;
  // And calculate the new total (Along with some other doohickeys)
  for (let arrayCount = 0; arrayCount < rs.length; arrayCount++) {
    let fieldCount = arrayCount + 1;

    // Grab the totals
    total += rs[arrayCount];
    rsI[arrayCount] = Number(rs[arrayCount] / 28.3495).toFixed(2);
    totalImp += Number(rsI[arrayCount]);
  }

  // As usual, we need to have TWO counters running; one for the fields and one LESS for the arrays
  for (let i = 1; i <= rs.length; i++) {
    let theIndex = i - 1;

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
    console.log("Count: " + i);
    document.getElementById("perc" + i).value = `${temp}%`;
  }
  document.getElementById("totalPerc").value = "100%";

  makeThePie();

}



// This function counts the number of rows with a check.
// If it's two or more, then bothChecked is set to true to allow for the calculations to take place.
function countChex(mode) {
  rowsChecked = 0;
  combinedRows = 0;
  pairTotal = 0;

  // Comb through the rows
  for (let i = 1; i <= ingredients.length; i++) {
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

    // console.log(`Modding ROW ${recipRow}, ARRAY #${recipRow - 1}, amounts are ${rs}`);

    // Get the imperial units version and populate the Oz field
    recipTotal = recipTotal / 28.35;
    document.getElementById("recipeSaysImp" + recipRow).value = fixDigits(recipTotal);

    // console.log(`rs: ${rs}`);

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


function updateRS(which) {

  // First, let's get an offset value. What was input as a field value is one more than the array position, as always.
  let whichOffset = which - 1;

  // This handles wheen two ingredients are linked and one is being balanced for the other.
  if (bothChecked) {
    shiftIngredient(which);
  }

  //First, confirm we're synced
  if (synced == true) {
    // If so, grab the value from the RS field that's being changed and update the respective array value with it
    if (recip[whichOffset] > 0 && perc[whichOffset] > 0) {
      let grabTemp = Number(document.getElementById("recipeSays" + which).value);
      // If grabTemp is a valid value (above 0 and not a NAN), update the array
      if (grabTemp > 0 && grabTemp != NaN) {
        rs[whichOffset] = grabTemp;
      } else {
        // if it's NOT a valid value, restore the the current array value to the field.
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

          if (perc[i] != 0) {
            let temp = Number.parseFloat(rs[i]);
            document.getElementById("recipeSays" + fieldOffset).value = fixDigits(temp);
            let temp2 = fixDigits(temp);
          }
        }

        let tempIrate = 0;
        if (rs[i] != NaN) {
          // Convert to imperial units
          tempIrate = Number(rs[i] / 28.3495);
        }
        document.getElementById("recipeSaysImp" + fieldOffset).value = fixDigits(tempIrate);
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
  butterAndSalt();
  updateTotals();
  showRecipe();
}


// If the value is large, no decimal places. If smaller, add decimal places as needed.
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
  // writeChecks("rowCheck", false);
  writeChecks("sumCheckBox", false);

  document.getElementById("multiplier").value = multiplier;
  // localStorage.setItem("multiplier", multiplier);

  document.getElementById("originalScale").value = 1;
  // localStorage.setItem("originalScale", 1);

  document.getElementById("newScale").value = 1;
  // localStorage.setItem("newScale", 1);

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
  // console.log(`${ingredients[index]} - ${temp2} % `);
  percString += `${ingredients[index]} - ${temp2} %\n`;
}


// * Handles toggling rounding to nearest 5% or 1%
function toggleFives() {
  fives = !fives;
  document.getElementById("fivesCheck").checked = fives;
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






// * Sum the selected rows and put the total in the total box

function sumSelectedRows(mode) {

  // if (mode == 1) {
  // Clear all sum checks
  //   for (let i = 1; i <= 10; i++) {
  //     document.getElementById("sumCheck" + i).checked = false;
  //     document.getElementById("row" + i).style.backgroundColor = "";
  //   }
  //   return;
  // }

  let sumTotal = 0;

  for (let i = 1; i <= rs.length; i++) {
    if (document.getElementById("sumCheck" + i).checked) {
      sumTotal += rs[i - 1];
      // color-code everything to make clear which rows are being summed and that the total reflects those rows.
      document.getElementById("row" + i).style.backgroundColor = "#79588fdd";
    } else {
      document.getElementById("row" + i).style.backgroundColor = "";
    }
  }

  let editStatus, bgColor;
  if (sumTotal == 0) {
    sumTotal = total;
    // console.log(`This is the linesumTotal: ${sumTotal}`);
    bgColor = "";
    totalEditableStatus = false;
  } else {
    bgColor = "#79588fdd";
    totalEditableStatus = true;
  }
  clog(`bgcolor: ${bgColor}`);
  document.getElementById("checkRowTot").style.backgroundColor = bgColor;

  document.getElementById("totalOrig").value = sumTotal.toFixed(1);
  document.getElementById("totalOrig").readOnly = totalEditableStatus;
}


// * Clears all sum checkboxes and updates the total to the full recipe amount
function clearSumChecks() {

  writeChecks('sumCheckBox', false);

  sumSelectedRows();
}

// * Checks all sum checkboxes and updates the total to the full recipe amount
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
  for (let index = 0; index < rs.length; index++) {
    fieldIndex = index + 1;
    rs[index] = youWant[index];
    document.getElementById("recipeSays" + fieldIndex).value = rs[index];
    // * console.log(`rs: ${rs[index]}`);
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

  const total = slices.reduce((s, i) => s + i.percent, 0);
  const items = slices.slice(0, 10).map((s, i) => ({
    label: s.label,
    percent: (s.percent / total) * 100,
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
    percentages.push(perc[i] * 100);
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

  const total = slices.reduce((s, i) => s + i.percent, 0);
  const items = slices.slice(0, 10).map((s, i) => ({
    label: s.label,
    percent: (s.percent / total) * 100,
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
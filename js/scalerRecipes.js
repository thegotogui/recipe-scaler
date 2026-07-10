// scalerRecipes.js
//* Contains all recipe data, extracted from scaler.js.
// Call goGetRecipe(name) with the dropdown-selected recipe name string.
// Returns an object: { recipe, markdown, headers, reciPortions }
// or null if no recipe matches.

function goGetRecipe(name) {

  let recipe = null;
  let markdown = "";
  let headers = [];
  let reciPortions = 0;

  // * Reset
  if (name.includes("Reset")) {
    recipe = [
      ['Ingredient A', 1],
      ['Ingredient B', 1]
    ];
  }

  // * Wasabi Sauce for Ahi Tuna
  else if (name.includes("Ahi Tuna")) {
    recipe = [
      ['Yogurt', 60],
      ['Buttermilk', 45],
      ['Wasabi Salt', 1],
      ['Black Pepper', 2],
      ['Aleppo Pepper', 2],
      ['Salt', .89]
    ];
  }

  // * Pesto
  else if (name.includes("Pesto") && !name.includes("Trapanese")) {
    recipe = [
      ['Olive oil', 60, "w"],
      ['Basil', 18, "d"],
      ['Almonds', 11, "d"],
      ['Parmesan', 9, "d"],
      ['Lemon Juice', 9, "w"],
      ['Garlic', 5, "d"]
    ];
  }

  // * Chimichurri
  else if (name.includes("Chimichurri")) {
    recipe = [
      ['Olive oil', 60, "w"],
      ['Parsley', 18, "d"],
      ['Oregano', 1, "d"],
      ['Almonds', 11, "d"],
      ['Red Wine Vinegar', 15, "w"],
      ['Garlic', 5, "d"]
    ];
  }

  // * Salsa Verde
  else if (name.includes("Salsa Verde")) {
    recipe = [
      ['Olive oil', 90, 'w'],
      ['Parsley', 80, 'd'],
      ['Capers', 25, 'd'],
      ['Anchovy fillets', 15, 'd'],
      ['Garlic', 10, 'd'],
      ['Hard boiled egg', 50, 'd'],
      ['Lemon juice', 30, 'w']
    ];
  }


  // * Puerto Rican Garlic Sauce
  else if (name.includes("Puerto Rican Garlic Sauce")) {
    recipe = [
      ['Mint', 15, 'd'],
      ['Parsley', 30, 'd'],
      ['Garlic', 10, 'd'],
      ['Capers', 45, 'd'],
      ['Lemon juice', 22, 'w'],
      ['Lemon zest', 3, 'd'],
      ['Sour orange juice', 30, 'w'],
      ['Shallot', 20, 'd'],
      ['Red chile', 10, 'd'],
      ['Olive oil', 180, 'w']
    ];
  }


  // * Zhug (Yemenite Hot Sauce With Cilantro and Parsley)
  else if (name.includes("Zhug")) {
    recipe = [
      ['Coriander seeds', .5, 'd'],
      ['Cumin seeds', .75, 'd'],
      ['Black pepper', 0.25, 'd'],
      ['Cardamom seeds', .5, 'd'],
      ['Garlic', 10, 'd'],
      ['Thai bird chiles', 20, 'd'],
      ['Kosher salt', 2.5, 'd'],
      ['Parsley and cilantro', 27, 'd'],
      ['Olive oil', 60, 'w']
    ];
  }


  // * Caper Sauce
  else if (name.includes("Caper Sauce")) {
    recipe = [
      ['Capers (rinsed)', 30],
      ['Garlic Clove (finely chopped)', 4],
      ['White Wine', 60],
      ['Olive Oil', 50],
      ['Breadcrumbs (whole-wheat)', 30],
      ['Fresh Parsley', 9],
      ['Salt', 1.5],
      ['Black Pepper', 0.25]
    ];
  }


  // * Caesar Dressing
  else if (name.includes("Caesar")) {
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
  }


  // * Nicoise Dressing
  else if (name.includes("Niçoise")) {
    recipe = [
      ['Olive Oil', 59, "w"],
      ['Red Wine Vinegar', 24, "w"],
      ['Shallot', 20, "d"],
      ['Garlic Clove', 6, "d"],
      ['Dijon Mustard', 6, "w"]
    ];
  }


  // * Ranch Dressing
  else if (name.includes("Ranch")) {
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
  }


  // * Ginger Sesame Pak Choi
  else if (name.includes("Ginger Sesame")) {
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
  }


  // * Miso Roasted Pak Choi with Edamame
  else if (name.includes("Miso Roasted")) {
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
  }

  // * Garlic and Soy Pak Choi
  else if (name.includes("Garlic and Soy")) {
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
  }

  // * White Rice
  else if (name.includes("White Rice")) {
    recipe = [
      ['Rice', 210, "d"],
      ['Water', 314, "w"],
      ['Salt', 4.25, "d"]
    ];
  }

  // * Lentils
  else if (name.includes("Lentils")) {
    recipe = [
      ['Lentils', 120, "d"],
      ['Water', 290, "w"],
      ['Salt', 3.3, "d"]
    ];
  }

  // * Roma Rice
  else if (name.includes("Roma")) {
    recipe = [
      ['Rice ', 162, "d"],
      ['Water', 337, "w"],
      ['Salt', 4, "d"]
    ];
  }

  // * Jasmine Rice
  else if (name.includes("Jasmine")) {
    recipe = [
      ['Water', 420, "w"],
      ['Rice', 210, "d"],
      ['Salt', 5, "d"],
      ['Powdered Garlic', 2, "d"],
      ['Powdered Onion', 2, "d"]
    ];
  }

  // * Sushi Rice
  else if (name.includes("Sushi")) {
    recipe = [
      ['Rice', 210, "d"],
      ['Water', 314, "w"],
      ['Rice Vinegar', 15, "w"],
      ['Sugar', 5, "d"],
      ['Salt', 4, "d"]
    ];
  }

  // * Pickled Onion
  else if (name.includes("Pickled Onion")) {
    recipe = [
      ['Water', 50, "w"],
      ['Vinegar', 10, "d"]
    ];
  }

  // * Tini Burger
  else if (name.includes("Burger")) {
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
  }

  // * Miso Sauce (note: check AFTER "Miso Roasted" above)
  else if (name.includes("Miso")) {
    recipe = [
      ['Soy Sauce', 30],
      ['Brown miso', 15],
      ['Rice Wine Vinegar', 15],
      ['Garlic Clove', 6],
      ['Honey', 3],
      ['Ginger', 2]
    ];
  }

  // * Tonnato
  else if (name.includes("Tonnato")) {
    recipe = [
      ['Tuna', 142, "d"],
      ['Mayo', 118, "w"],
      ['Olive Oil', 60, "w"],
      ['Lemon Juice', 45, "w"],
      ['Capers', 15, "d"],
      ['Anchovy', 12, "d"]
    ];
  }

  // * Classic Crepes
  else if (name.includes("Classic Crepes")) {
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
  }

  // * Ti Couz Crepes
  else if (name.includes("Couz")) {
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
  }

  // * Sourdough Crepes
  else if (name.includes("Sourdough Crepes")) {
    recipe = [
      ['Milk', 210, "w"],
      ['Water', 55, "w"],
      ['Egg', 50, "w"],
      ['Butter', 22, "w"],
      ['Flour', 135, "d"],
      ['Salt', 4, "d"],
      ['Starter', 30, "s"]
    ];
    markdown = "### Updated 1-3-25 to tone down the starter amount - too tart!";
  }

  // * Naan
  else if (name.includes("Naan")) {
    recipe = [
      ['AP Flour', 500, "d"],
      ['Milk', 236, "w"],
      ['Yogurt', 60, "w"],
      ['Canola Oil', 30, "n"],
      ['Salt', 6.8, "d"],
      ['Yeast', 7, "d"],
      ['Baking Powder', 5, "d"]
    ];
  }

  // * Biscuits
  else if (name.includes("Biscuits")) {
    recipe = [
      ['AP Flour', 180, "d"],
      ['Salt', 3, "d"],
      ['Baking Powder', 10, "d"],
      ['Milk', 130, "w"],
      ['Butter', 50, "w"]
    ];
  }

  // * Cornbread
  else if (name.includes("Cornbread")) {
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
  }

  // * Pita
  else if (name.includes("Pita")) {
    recipe = [
      ['Flour', 310, "d"],
      ['Whole Wheat Flour', 35, "d"],
      ['Water', 235, "w"],
      ['Olive Oil', 30, 'n'],
      ['Salt', 4.95, "d"],
      ['Yeast', 2, "d"]
    ];
  }

  // * French Baguette
  else if (name.includes("Baguette")) {
    recipe = [
      ['Bread Flour', 700, "d"],
      ['Water', 520, "w"],
      ['Yeast', 2, "d"],
      ['Salt', 8, "d"],
    ];
    markdown = `### Part 1
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
  }

  // * Classic Pizza Dough
  else if (name.includes("Classic Pizza")) {
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
  }

  // * Neapolitan Pizza Dough
  else if (name.includes("Neapolitan")) {
    recipe = [
      ['Bread Flour', 300, "d"],
      ['AP Flour', 200, "d"],
      ['Water', 200, "w"],
      ['Salt', 6, "d"],
      ['Honey', 5, "w"],
      ['Yeast', 5, "d"]
    ];
  }

  // * Sourdough Pizza Dough
  else if (name.includes("Sourdough Pizza Dough")) {
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
  }

  // * Sourdough Bread
  else if (name.includes("Sourdough Bread")) {
    recipe = [
      ['Bread Flour', 335, "d"],
      ['Whole Wheat Flour', 50, "d"],
      ['Rye Flour', 20, "d"],
      ['Water', 250, "w"],
      ['Salt', 7, "d"],
      ['Sourdough Starter', 13, "s"]
    ];
  }

  // * Vito's Pizza Dough
  else if (name.includes("Vito")) {
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
  }

  // * Levain for Bread
  else if (name.includes("Levain")) {
    recipe = [
      ['Bread Flour', 40, "d"],
      ['Whole Wheat Flour', 40, "d"],
      ['Water', 80, "w"],
      ['Sourdough Starter', 8, "s"]
    ];
  }

  // * Bread for Bread
  else if (name.includes("Bread for Bread")) {
    recipe = [
      ['Bread Flour', 766, "d"],
      ['Whole Wheat Flour', 161, "d"],
      ['Water', 635, "w"],
      ['Sourdough Starter', 169, "s"],
      ['Water 2', 50, "w"],
      ['Salt', 19, "d"]
    ];
  }

  // * Focaccia
  else if (name.includes("Focaccia")) {
    recipe = [
      ['AP Flour', 360, "d"],
      ['Water', 284, "w"],
      ['Olive Oil', 18, "n"],
      ['Salt', 9, "d"],
      ['Sugar', 5, "d"],
      ['Yeast', 3, "d"]
    ];
    markdown = `## Process
### To make the dough:
- **Weigh your flour;** or measure it by gently spooning it into a cup, then sweeping off any excess.
- In a large bowl (a 3-quart bowl with a lid works great), whisk together the flour, salt, sugar, and yeast.
- Add the water and olive oil and stir — with a spatula, bowl scraper, dough whisk, or your hands — until the mixture is thoroughly combined and homogeneous; there should be no dry patches or lumps. Cover the bowl and set it aside for 15 minutes.
- Perform the first bowl fold: Use a wet hand to grab a section of dough from one side of the bowl, then lift it up and press it into the center. Repeat this motion, grabbing a new section of dough each time, until you've made a full circle around the bowl, about 8 to 12 times. Once you've circled the bowl, flip the dough over in the bowl so that the smooth side is up; the first bowl fold is now complete. Cover the bowl and let the dough rest for 15 minutes.
> Note: You'll be doing this three more times over the next 45 minutes, each time further developing the dough's strength.
- Repeat the bowl fold for a second time. (Remember to use a wet hand to prevent the dough from sticking!) At this point, the dough should feel smoother and tighter. Cover the bowl and let the dough rest for 15 minutes. 
- Repeat the bowl fold for a third time. Cover the bowl and let the dough rest for 15 minutes.
- Repeat the bowl fold for a fourth and final time; the dough should feel relatively strong.
- Cover the bowl and let the dough rise at a warm room temperature (70°F to 75°F) for 1 hour; see this post, Where to put dough to rise, for tips. After 1 hour, the dough should have nearly doubled in size and will be vry puffy; it may even have a few bubbles on the surface.
- To prepare the pan:
    - Once the dough has risen, spray the bottom and sides of a 9" square Fabulous Focaccia Pan with nonstick spray. (See "tips," below for details about this pan as well as alternative pan options.)
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

  // * Agnolotti
  else if (name.includes("Agnolotti")) {
    recipe = [
      ['AP Flour', 100, "d"],
      ['Yolks', 36, "w"],
      ['Egg', 18, "w"],
      ['Milk', 5.3, "w"],
      ['Salt', 1.63, "d"],
      ['Olive Oil', 2.1, "n"]
    ];
  }

  // * Cooked vs Uncooked Pasta
  else if (name.includes("Uncooked")) {
    recipe = [
      ['Dry Pasta', 120, "d"],
      ['Cooked Dry Pasta', 290, "w"],
    ];
  }

  // * Chitarra Pasta
  else if (name.includes("Chitarra")) {
    recipe = [
      ['00 Flour', 115, "d"],
      ['Semolina Flour', 85, "d"],
      ['Eggs', 100, "w"],
      ['Salt', 3.04, "d"]
    ];
  }

  // * Turmeric Chicken
  else if (name.includes("Turmeric")) {
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
  }

  // * Karaage Chicken
  else if (name.includes("Karaage")) {
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
    ];
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
  }

  // * Basic Pasta (egg and flour)
  else if (name.includes("Basic")) {
    recipe = [
      ['Egg', 50, "w"],
      ['Flour', 94, "d"],
      ['Salt', 1.16, "d"]
    ];
  }

  // * Ricotta Gnocchi
  else if (name.includes("Ricotta")) {
    recipe = [
      ['Flour', 110, "d"],
      ['Ricotta', 240, "w"],
      ['Egg', 100, "w"],
      ['Parmesan', 15, "d"],
      ['Salt', 3.75, "d"]
    ];
  }

  // * All Durum Dough
  else if (name.includes("All Durum")) {
    recipe = [
      ['Durum Flour', 155, "d"],
      ['Egg', 70, "w"],
      ['Salt', 2.33, "d"]
    ];
  }

  // * Al Dente Pasta Dough
  else if (name.includes("Dente")) {
    recipe = [
      ['Durum Flour', 90, "d"],
      ['AP Flour', 70, "d"],
      ['Egg', 50, "w"],
      ['Water', 30, "w"],
      ['Salt', 1.87, "d"]
    ];
  }

  // * Culurgione Pasta Dough
  else if (name.includes("Culurgione Pasta Dough")) {
    recipe = [
      ['AP Flour', 150, "d"],
      ['Semolina Flour', 100, "d"],
      ['Water', 145, "w"],
      ['Salt', 3.2, "d"]
    ];
  }

  // * Culurgione Filling
  else if (name.includes("Culurgione Filling")) {
    recipe = [
      ['Potatoes (skins=10%, 15mins @325)', 230, "d"],
      ['Aged Pecorino', 23, "d"],
      ['Fresh Pecorino', 46, "d"],
      ['Goat Cheese', 46, "d"],
      ['Chopped Mint', 2, "d"],
      ['Egg', 12, "w"],
      ['Garlic', 3, "d"],
      ['Olive Oil', 15, "w"]
    ];
  }

  // * Potato Gnocchi
  else if (name.includes("Potato G")) {
    recipe = [
      ['Potato', 600, "d"],
      ['AP Flour', 170, "d"],
      ['Egg', 50, "w"],
      ['Salt', 8, "d"]
    ];
  }

  // * Ravioli Pasta Dough
  else if (name.includes("Ravioli")) {
    recipe = [
      ['AP Flour', 80, "d"],
      ['Semolina Flour', 70, "d"],
      ['Whole Wheat Flour', 70, "d"],
      ['Water', 60, "w"],
      ['Egg', 50, "w"]
    ];
  }

  // * Stracciatella Pasta with Lemon and Asparagus
  else if (name.includes("Stracciatella")) {
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
  }

  // * Trapanese Pesto
  else if (name.includes("Trapanese")) {
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
  }

  // * Sourdough Starter
  else if (name.includes("Starter")) {
    recipe = [
      ['AP Flour', 28, "d"],
      ['Rye Flour', 14, "d"],
      ['Water', 40, "w"]
    ];
  }

  // * Hollandaise
  else if (name.includes("Hollandaise")) {
    recipe = [
      ['Butter', 150, "w"],
      ['Egg Yolk', 85, "w"],
      ['Water', 50, "w"],
      ['Lemon Juice', 20, "w"],
      ['Salt', 3, "d"]
    ];
    markdown = `## Process
- Combine in a zip-lock bag.
- Poach in a 147°F (64°C) water bath for 1 hour.
- Remove from bag and whisk to combine.
- Adjust seasoning with salt and lemon juice to taste.`;
  }

  // * Pasta Sauce
  else if (name.includes("Pasta Sauce")) {
    recipe = [
      ['Pasta', 142, "d"],
      ['Tomato Sauce', 275, "w"]
    ];
  }

  // * Gnocchi Sauce
  else if (name.includes("Gnocchi Sauce")) {
    recipe = [
      ['Gnocchi', 250, "d"],
      ['Sauce', 150, "w"]
    ];
  }

  // * Bolognese
  else if (name.includes("Bolognese")) {
    recipe = [
      ['Ground Beef', 340, "d"],
      ['Tomato', 450, "d"],
      ['Milk', 240, "w"],
      ['White Wine', 240, "w"],
      ['Onion', 80, "d"],
      ['Celery', 100, "d"],
      ['Carrot', 100, "d"],
    ];
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

  // * Ssamjang Sauce
  else if (name.includes("Ssamjang")) {
    recipe = [
      ['Beef Stock', 70],
      ['Samjang', 60],
      ['Light Miso', 20],
      ['Gochujang', 15],
      ['Red Wine Vinegar', 15]
    ];
  }



  // * Vodka Sauce
  else if (name.includes("Vodka")) {
    recipe = [
      ['Butter', 15],
      ['Yellow Onion', 75],
      ['Garlic', 6],
      ['Tomato Paste', 40],
      ['Whole Tomatoes', 129],
      ['Cream', 76],
      ['Vodka', 20],
      ['Parmigiano-Reggiano', 20],
      ['Pasta', 140]
    ];
    markdown = `1. In a large (3- or 4-quart) saucepan or small Dutch oven, melt butter over medium heat. Add onion, garlic, and red pepper flakes, season lightly with salt, and cook, stirring frequently, until onions are very soft but not browned, about 15 minutes; lower heat if needed to prevent browning. 
    
2. Add tomato paste and cook, stirring, until tomato paste is fragrant and thick, about 3 minutes. Stir in canned tomatoes with their liquid. Bring to a simmer, then cook, stirring often and crushing the whole tomatoes roughly with a spoon, until sauce has thickened slightly, about 10 minutes.

    3. Add cream, and stir to incorporate. Transfer sauce to a blender, and blend until very smooth (you may be able to make an immersion blender work, but in our tests the sauce level was too low to safely avoid splattering). Wipe out pot, then return blended sauce to it. Season lightly with salt.
    
    4. In a medium pot of salted boiling water, cook pasta until just shy of al dente, about 3 minutes less than the package directs. About 1 minute before you transfer pasta to sauce, add vodka to tomato sauce and bring to a gentle simmer over medium heat.

    5. Using a spider skimmer or slotted spoon, transfer pasta directly to sauce pot along with 1/2 cup (120ml) pasta water (alternatively, reserve 2 cups pasta water, then drain pasta in a colander, then add to sauce with 1/2 cup of the reserved water). Increase heat to high, and cook, stirring constantly, until pasta is well coated in sauce and reaches the al dente stage, about 3 minutes. If sauce thickens too much before pasta is ready, add more pasta water in 1/4 cup (60ml) increments as needed.

    6. Remove from heat and stir in cheese until thoroughly incorporated into a smooth and creamy sauce. Taste for salt, and season with more if needed. If you can't detect the vodka at all, you can add a few drops more and stir it in before serving; exactly how boozy you want the sauce is a question of taste, but be careful because a heavy hand will ruin the dish. Spoon pasta and sauce onto warmed serving plates and top with additional grated cheese. Serve immediately.
    
    - The vodka to sauce ratio is 1:15.83`;
  }

  // * Meatballs
  else if (name.includes("Meatballs")) {
    recipe = [
      ['Ground Beef', 250, "d"],
      ['Milk', 90, "w"],
      ['Bread Crumbs', 35, "w"],
      ['Onion', 35, "d"],
      ['Egg', 27, "w"],
      ['Parmesan', 20, "d"],
      ['Parsley', 5, "d"],
      ['Salt', 3, "d"],
      ['Garlic Powder', 3, "d"]
    ];
    reciPortions = 12;
    markdown = `1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.
2. Combine all ingredients and knead until evenly distributed. Meatballs should be wet and somewhat sticky.
3. In a medium-heat pan, brown meatballs on all sides.
4. Combine meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning halfway through.
5. Combine with pasta and serve as desired.

Alternatively, they can be baked at 350° for 15 minutes`;
  }

  // * Albondigas
  else if (name.includes("Albondigas")) {
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
    markdown = `
  ### It's a little hard to believe this is going to stay together, but it does.
  1. Mix milk and breadcrumbs together and allow to sit 15-20 minutes.
  2. Combine all ingredients and knead until ingredients are distributed. Meatballs should be wet and somewhat sticky.
  3. In a medium-heat pan, brown meatballs on all sides.
  4. Add meatballs and sauce to a pan over a simmer. Cover and cook 10-15 minutes, turning meatballs halfway through.
  5. Combine with pasta and serve\nThey can be baked at 350° for 15 minutes`;
  }

  // * Mashed Potatoes
  else if (name.includes("Mashed")) {
    recipe = [
      ['Potatoes', 700, "d"],
      ['Sour Cream', 130, "w"],
      ['Butter', 66, "w"],
      ['White Pepper', 3, "d"],
      ['Salt', 4, "d"],
      ['Wasabi Salt', 2.5, "d"]
    ];
  }

  // * Shakshuka
  else if (name.includes("Shakshuka")) {
    recipe = [
      ['Tomato', 200],
      ['Harissa', 25],
      ['Onion', 50],
      ['Red Pepper Flakes', 20],
      ['Garlic', 10],
      ['Paprika', 6],
      ['Cumin', 3]
    ];
  }

  // * Tatty Scones
  else if (name.includes("Tatty")) {
    recipe = [
      ['Potato', 500, "d"],
      ['Flour', 100, "d"],
      ['Butter', 50, "n"],
      ['Salt', 5, "d"]
    ];
  }

  // * Tortillas
  else if (name.includes("Tortillas")) {
    recipe = [
      ['Masa', 90, "d"],
      ['Water', 110, "w"],
      ['Butter', 14.25, "w"],
      ['Achiotina/lard', 14.25, "w"],
      ['Salt', 2.15, "d"]
    ];
    reciPortions = 6;
  }

  // * Masa Dumplings
  else if (name.includes("Masa Dumplings")) {
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
  }

  // * Sonoran Flour Tortillas
  else if (name.includes("Sonoran")) {
    recipe = [
      ['Flour', 100, "d"],
      ['Water', 50, "w"],
      ['Lard', 30, "w"],
      ['Salt', 2, "d"],
      ['Baking Powder', 1, "d"]
    ];
    reciPortions = 6;
  }

  // * Blinis
  else if (name.includes("Blinis")) {
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
  }

  // * Spanish Rice
  else if (name.includes("Spanish")) {
    recipe = [
      ['Water', 300, "w"],
      ['Rice', 200, "d"],
      ['Bell Pepper', 80, "d"],
      ['Tomato Paste', 30, "w"],
      ['Cumin', 3, "d"],
      ['Salt', 4.93, "d"],
      ['Dried Garlic', 2, "d"]
    ];
  }

  // * Crispy Kale
  else if (name.includes("Kale")) {
    recipe = [
      ['Kale', 100, "d"],
      ['Olive Oil', 10, "n"],
      ['Salt', 3, "d"]
    ];
    markdown = `## Process
- Preheat oven to **320°F** Convection.
- Wash and thoroughly dry the kale.
- Remove the leaves from the thick stems and tear them into bite-sized pieces.
- Place the kale pieces in a large bowl. Drizzle with olive oil and sprinkle with salt. Use your hands to massage the oil and salt into the kale, ensuring each piece is well coated.
- Arrange the kale pieces in a single layer on a baking sheet lined with parchment paper or a silicone baking mat. Avoid overcrowding to ensure even crisping.
- Bake in the preheated oven for about **10 minutes**, turning the pieces halfway through, until the kale is crispy but not burnt.
    `;
  }

  // * Lemonade Spritzer
  else if (name.includes("Lemonade Spritzer")) {
    recipe = [
      ['Lemonade', 100],
      ['Soda Water', 80]
    ];
  }

  // * Bloody Mary
  else if (name.includes("Bloody")) {
    recipe = [
      ['V8', 150],
      ['Soy Sauce', 5],
      ['Horseradish', 3],
      ['Lemon Juice', 2],
      ['Worcestershire', 2],
      ['Tabasco Sauce', 1]
    ];
  }

  // * Sangrita
  else if (name.includes("Sangrita")) {
    recipe = [
      ['Tomato Juice', 70],
      ['Orange Juice', 25],
      ['Lime', 4],
      ['Cholula', 2]
    ];
  }

  // * Risotto
  else if (name.includes("Risotto")) {
    recipe = [
      ['Stock', 325, 'w'],
      ['Carnaroli', 130, 'd'],
      ['Vegetable Oil', 35, 'n'],
      ['Onion', 10, 'd'],
      ['Salt', 4.64, 'd']
    ];
  }

  // * Cavatelli
  else if (name.includes("Cavatelli")) {
    recipe = [
      ['AP Flour', 120, 'd'],
      ['Durum Flour', 50, 'd'],
      ['WW', 20, 'd'],
      ['Water', 55, 'w'],
      ['Egg', 50, 'w'],
      ['Salt', 3, 'd']
    ];
  }

  // * Bechamel
  else if (name.includes("Bechamel")) {
    recipe = [
      ['Flour', 15],
      ['Butter', 15],
      ['Milk', 175],
      ['Mustard', 15]
    ];
  }

  // * Bullshot
  else if (name.includes("Bull")) {
    recipe = [
      ['Vodka', 50],
      ['Beef Stock', 100],
      ['Worcestershire Sauce', 5.25],
      ['Red Wine Vinegar', 1.25],
      ['Soy Sauce', 5.25],
      ['Tabasco Sauce', 0.62]
    ];
  }

  // * Margarita
  else if (name.includes("Margarita")) {
    recipe = [
      ['Curaçao', 85],
      ['Tequila', 33],
      ['Lime Juice', 33]
    ];
  }

  // * Polenta
  else if (name.includes("Polenta")) {
    recipe = [
      ['Water', 400, "w"],
      ['Polenta', 90, "d"],
      ['Sour Cream', 30, "w"],
      ['Butter', 15, "w"],
      ['Salt', 5.3, "d"],
      ['Cheese', 120, "d"]
    ];
  }

  // * Farro
  else if (name.includes("Farro")) {
    recipe = [
      ['Farro', 100, "d"],
      ['Water', 360, "w"],
      ['Salt', 4, "d"]
    ];
  }

  // * Dutch Baby
  else if (name.includes("Dutch")) {
    recipe = [
      ['Flour', 120, "d"],
      ['Cheese', 72, "d"],
      ['Thyme', 1, "d"],
      ['Parsley', 1, "d"],
      ['Egg', 400, "w"],
      ['Milk', 176, "w"],
      ['Unsalted Butter', 89, "w"]
    ];
  }

  // * Welsh Rarebit
  else if (name.includes("Welsh")) {
    recipe = [
      ['Cheese', 50, "d"],
      ['Butter', 15, "w"],
      ['Flour', 15, "d"],
      ['Milk', 26, "w"],
      ['Guinness', 26, "w"],
      ['Worcestershire', 7.5, "w"],
      ["Coleman's", 5, "w"]
    ];
  }

  // * Injeera
  else if (name.includes("Injeera")) {
    recipe = [
      ['Water', 300, "w"],
      ['AP Flour', 75, "d"],
      ['Teff Flour', 40, "d"],
      ['Starter', 175, "s"]
    ];
  }

  // * Ponzu Sauce
  else if (name.includes("Ponzu")) {
    recipe = [
      ['Kombu', 1],
      ['Rice Vinegar', 30],
      ['Mirin', 12],
      ['Katsuobushi', 15],
      ['Yuzu', 120],
      ['Soy Sauce', 120]
    ];
  }

  // * Coconut Rum Julep
  else if (name.includes("Julep")) {
    recipe = [
      ['Rum', 43],
      ['Simple Syrup', 21],
      ['Lime', 14],
      ['Coconut', 21]
    ];
  }

  // * Jungle Bird
  else if (name.includes("Jungle Bird")) {
    recipe = [
      ['Dark Rum', 43],
      ['Campari', 21],
      ['Pineapple', 43],
      ['Lime', 14],
      ['Simple Syrup', 14]
    ];
  }

  // * Cable Car
  else if (name.includes("Cable")) {
    recipe = [
      ['Spiced Rum', 45],
      ['Curacao', 22],
      ['Lemon Juice', 30],
      ['Simple Syrup', 15]
    ];
  }

  // * Mexican
  else if (name.includes("Mexican")) {
    recipe = [
      ['Pineapple', 70],
      ['Tequila', 28],
      ['Triple Sec', 10]
    ];
  }

  // * Mai Tai
  else if (name.includes("Mai Tai")) {
    recipe = [
      ['Dark Rum', 30],
      ['Light Rum', 30],
      ['Lime', 30],
      ['Orange Curacao', 15],
      ['Orgeat', 15],
      ['Simple Syrup', 7.5]
    ];
  }


  // * Mojito
  else if (name.includes("Mojito")) {
    recipe = [
      ['6 to 8 fresh mint leaves', 4],
      ['Simple Syrup', 15],
      ['Lime juice (about half a fresh lime)', 22],
      ['White rum', 60],
      ['Sparkling Water', 80]
    ];
    markdown = `## Process
- Muddle mint leaves with simple syrup and lime juice in a sturdy glass or cocktail shaker.
- Fill the glass with ice and add the rum.
- Stir well to combine.
- Strain into a glass filled with ice and top with sparkling water.
- Garnish with a sprig of mint and a lime wedge.`;
  }

  // * Campari Spritz
  else if (name.includes("Campari Spritz")) {
    recipe = [
      ['Prosecco', 90],
      ['Campari', 60],
      ['Soda water', 30]
    ];
    markdown = `## Process
- Fill a glass with ice.
- Add the Prosecco, Campari, and soda water.
- Stir well to combine.
- Garnish with orange slices.`;
  }


  // * Soda
  else if (name.includes("Soda")) {
    recipe = [
      ['Fizzy Water', 300],
      ['Flavor Syrup', 40]
    ];
  }

  // * Tea
  else if (name.includes("Tea")) {
    recipe = [
      ['Water', 500],
      ['Loose Tea', 6]
    ];
  }

  // * Turkey Masala
  else if (name.includes("Turkey Masala")) {
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
`;
  }

  // * Egg Topping
  else if (name.includes("Egg")) {
    recipe = [
      ['Egg', 58],
      ['Water', 8]
    ];
  }

  // * Bread Crumbs
  else if (name.includes("Bread Crumbs")) {
    recipe = [
      ['Bread', 44.28, "d"],
      ['Toasted Crumbs', 36, "d"]
    ];
    markdown = `## Process
- Toast bread until golden brown and dry.
- Pulse in a food processor until fine crumbs are formed.

Note that the ratios here are 69 > 56

56/69 = 0.812

1/.812 = 1.232`;
  }

  // * Test mode
  else if (name.includes("TEST")) {
    recipe = [
      ['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5],
      ['F', 6], ['G', 7], ['H', 8], ['I', 9], ['J', 10],
      ['K', 11], ['L', 12], ['M', 13], ['N', 14], ['O', 15],
    ];
  }

  // * Different Lengths Test
  else if (name.includes("MISMATCH")) {
    recipe = [
      ['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5],
      ['F', 6], ['G', 7], ['H', 8], ['I', 9], ['J', 10],
      ['K', 11], ['L', 12], ['M', 13], ['N', 14], ['O'],
    ];
  }
  console.log(`reciPortions: ${reciPortions}`);
  return recipe ? { recipe, markdown, headers, reciPortions } : null;
}

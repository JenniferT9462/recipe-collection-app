// Proof of Life
console.log("Hello from search-recipes.js!");
// Search by Name
onEvent("search-by-name-btn", "click", function () {
  console.log("Search by name btn clicked");
  const nameQuery = getValue("name-search");

  if (!nameQuery) return alert("Enter a name to search!");

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameQuery}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.meals) {
        console.log("No results found for:", nameQuery);
        alert("No recipes found. Try another name!");
        return;
      }
      console.log(data.meals);

      // Render the reply in the output area
      displayApiRecipes(data.meals);
    })
    .catch((error) => console.log("Error fetching recipes:", error));
});

// Search By Category
onEvent("search-by-category-btn", "click", function () {
  console.log("Search by category btn clicked");

  const category = getValue("category-select");

  if (!category) return alert("Enter a name to search!");

  //Get filtered meals
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.meals) {
        console.log("No results found for:", category);
        alert("No recipes found. Try another name!");
        return;
      }
      console.log(data.meals);

      // For each meal, fetch full details
      const detailPromises = data.meals.map((meal) =>
        fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
          .then((res) => res.json())
          .then((details) => details.meals[0])
      );
      Promise.all(detailPromises)
        .then((fullRecipes) => displayApiRecipes(fullRecipes))
        .catch((err) => console.log("Error fetching full recipes:", err));
    })
    .catch((error) => console.log("Error fetching recipes:", error));
});

// Search by Ingredients
onEvent("search-by-ingredient-btn", "click", function () {
  console.log("Search by ingredients btn clicked");

  const ingredient = getValue("ingredient-search");

  if (!ingredient) return alert("Enter an ingredient to search!");

  // Get filtered meals
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.meals) {
        console.log("No results found for:", category);
        alert("No recipes found. Try another name!");
        return;
      }
      console.log(data.meals);

      // For each meal, fetch full details
      const detailPromises = data.meals.map((meal) =>
        fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
          .then((res) => res.json())
          .then((details) => details.meals[0])
      );

      // Wait until all details are fetched
      Promise.all(detailPromises).then((fullRecipes) =>
        displayApiRecipes(fullRecipes)
      ); // now strCategory and strInstructions exist
    })

    .catch((error) => console.log("Error fetching recipes:", error));
});

//======Helpers======

// Helper to get ingredients array
function getIngredients(recipe) {
  const ingredients = [];
  //The meal DB has 20 slots for ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
    }
  }
  return ingredients;
}
// Helper to format instructions as numbered steps
function formatInstructions(instructions) {
  if (!instructions) return "";
  const steps = instructions
    .split(/\r?\n/)
    .filter((step) => step.trim() !== "");
  return steps.map((step, index) => `${index + 1}.${step}`).join("\n\n");
}

//Display API Recipes
function displayApiRecipes(recipes) {
  let apiResults = document.getElementById("api-results");
  apiResults.innerHTML = "";

  recipes.forEach((recipe) => {
    const ingredientsList = getIngredients(recipe).join("\n");
    const numberedInstructions = formatInstructions(recipe.strInstructions);

    let col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
        <div class="card h-100">
        <img src="${recipe.strMealThumb}" class="card-img-top" alt="${
      recipe.strMeal
    }">
        <div class="card-body">
          <h5 class="card-title">${recipe.strMeal}</h5>
          <p><strong>Category:</strong> ${recipe.strCategory || "N/A"}</p>
          <pre><strong>Ingredients:</strong>\n${ingredientsList}</pre>
          <pre><strong>Instructions:</strong>\n${numberedInstructions}</pre>
          <button class="btn btn-success save-btn">Save</button>
        </div>
      </div>
        `;

    col.querySelector(".save-btn").addEventListener("click", () => {
      console.log("Saving recipe:", recipe.strMeal);

      const ingredientsList = getIngredients(recipe).join("\n");
      const numberedInstructions = formatInstructions(recipe.strInstructions);

      const savedRecipe = {
        idMeal: recipe.idMeal, // keep this so we can check duplicates
        name: recipe.strMeal,
        category: recipe.strCategory || "Imported",
        ingredients: ingredientsList,
        instructions: numberedInstructions,
        thumbnail: recipe.strMealThumb,
      };

      // Save to localStorage
      const savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];
      if (!savedRecipes.some((r) => r.idMeal === savedRecipe.idMeal)) {
        savedRecipes.push(savedRecipe);
        localStorage.setItem("Recipes", JSON.stringify(savedRecipes));

        alert("Recipe saved!");
        // Add just this new recipe to the view
        // appendSavedRecipe(savedRecipe, savedRecipes.length - 1);
      } else {
        alert("Recipe already saved.");
      }
      // Automatically display the saved recipes
      // loadSavedRecipes();
    });
    apiResults.appendChild(col);
  });
}

function createRecord(recipe) {
  // Get existing saved recipes (or empty array)
  let savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];

  // Avoid duplicates by checking idMeal
  if (!savedRecipes.some((r) => r.idMeal === recipe.idMeal)) {
    savedRecipes.push(recipe);
    localStorage.setItem("Recipes", JSON.stringify(savedRecipes));
    alert("Recipe saved!");
  } else {
    alert("Recipe already saved.");
  }
}


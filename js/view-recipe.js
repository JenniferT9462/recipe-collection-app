console.log("Hello from view-recipe.js!");

function loadSavedRecipes() {
  const savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];
  const container = document.getElementById("saved-recipes");
  container.innerHTML = "";

  if (savedRecipes.length === 0) {
    container.innerHTML = "<p>No recipes saved yet!</p>";
    return;
  }

  savedRecipes.forEach((recipe) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    // --- Ingredients ---
 
    const ingredientsArray = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : (recipe.ingredients || "").split("\n").map(i => i.trim());

    const ingredientsHTML = ingredientsArray.map(i => `<li>${i}</li>`).join("");


  
    // Instructions
    const instructionsArray = Array.isArray(recipe.instructions)
      ? recipe.instructions
      : (recipe.instructions || "").split("\n").map(i => i.trim()).filter(Boolean);

    const instructionsHTML = instructionsArray
      .map((step, i) => (step.match(/^\d+\./) ? step : `${i + 1}. ${step}`))
      .join("\n\n");


  
    // --- Render card ---
    col.innerHTML = `
      <div class="card h-100">
        <img src="${
          recipe.thumbnail || "assets/default-image.png"
        }" class="card-img-top" alt="${recipe.name}">
        <div class="card-body">
          <h5 class="card-title">${recipe.name}</h5>
          <p><strong>Category:</strong> ${recipe.category || "N/A"}</p>
          <div><strong>Ingredients:</strong></div>
          <ul>${ingredientsHTML}</ul>
          <pre><strong>Instructions:</strong>\n${instructionsHTML}</pre>
          <button class="btn btn-primary btn-sm edit-btn mt-2 me-2">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn mt-2">Delete</button>
        </div>
      </div>
    `;

    // // //----Edit Button
    // col.querySelector(".edit-btn").addEventListener("click", () => {
    //   openEditForm(recipe);
    // });

    // --- Delete button ---
    col.querySelector(".delete-btn").addEventListener("click", () => {
      deleteRecipe(recipe.idMeal);
      col.remove();

    });

    
    container.appendChild(col);
  });
}

function appendSavedRecipe(recipe, index) {
  const container = document.getElementById("saved-recipes");
  if (!container) return; // Don't do anything if container not found

  let recipeCard = document.createElement("div");
  recipeCard.className = "col-md-4";

  recipeCard.innerHTML = `
    <div class="card h-100">
      <img src="${recipe.thumbnail}" class="card-img-top" alt="${recipe.name}">
      <div class="card-body">
        <h5 class="card-title">${recipe.name}</h5>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <pre><strong>Ingredients:</strong>\n${recipe.ingredients}</pre>
        <pre><strong>Instructions:</strong>\n${recipe.instructions}</pre>
        <button class="btn btn-danger delete-btn mt-2">Delete</button>
      </div>
    </div>
  `;

  recipeCard.querySelector(".delete-btn").addEventListener("click", () => {
    deleteRecipe(recipe.idMeal); // use idMeal instead of index
    recipeCard.remove(); // remove from DOM immediately
  });

  container.appendChild(recipeCard);
}


function deleteRecipe(idMeal) {
  let savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];
  savedRecipes = savedRecipes.filter((r) => r.idMeal !== idMeal);
  localStorage.setItem("Recipes", JSON.stringify(savedRecipes));
}


// Make globally accessible for add-recipe.js
window.onload = loadSavedRecipes;

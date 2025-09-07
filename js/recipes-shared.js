// recipes-shared.js
function saveRecipe(recipe) {
  let saved = JSON.parse(localStorage.getItem("Recipes")) || [];
  if (!saved.some(r => r.idMeal === recipe.idMeal)) {
    saved.push(recipe);
    localStorage.setItem("Recipes", JSON.stringify(saved));
  }
}

function deleteRecipe(idMeal) {
  let saved = JSON.parse(localStorage.getItem("Recipes")) || [];
  saved = saved.filter(r => r.idMeal !== idMeal);
  localStorage.setItem("Recipes", JSON.stringify(saved));
}

function loadSavedRecipes() {
  return JSON.parse(localStorage.getItem("Recipes")) || [];
}

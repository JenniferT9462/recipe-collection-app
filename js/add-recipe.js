// Proof of Life
console.log("Hello from add-recipe.js!");

// Get form elements
const recipeForm = document.getElementById("recipe-form");
const statusMessage = document.getElementById("status-message");
const addIngredientBtn = document.getElementById("add-ingredient-btn");
const addInstructionBtn = document.getElementById("add-instruction-btn");
const ingredientsContainer = document.getElementById("ingredients-container");
const instructionsContainer = document.getElementById("instructions-container");

// Function to add a new ingredient input
function addIngredient(value = "") {
  const div = document.createElement("div");
  div.className = "d-flex mb-2";
  div.innerHTML = `
    <input type="text" class="form-control me-2 ingredient-input" value="${value}" placeholder="Enter ingredient" required />
    <button type="button" class="btn btn-danger btn-sm remove-btn">x</button>
  `;
  div
    .querySelector(".remove-btn")
    .addEventListener("click", () => div.remove());

  ingredientsContainer.appendChild(div);
}

// Function to add a new instruction step
function addInstruction(value = "") {
  const div = document.createElement("div");
  div.className = "d-flex mb-2";
  div.innerHTML = `
    <input type="text" class="form-control me-2 instruction-input" value="${value}" placeholder="Enter step" required />
    <button type="button" class="btn btn-danger btn-sm remove-btn">x</button>
  `;
  div
    .querySelector(".remove-btn")
    .addEventListener("click", () => div.remove());
  instructionsContainer.appendChild(div);
}

// Add initial fields
addIngredient();
addInstruction();

// Buttons to add more
addIngredientBtn.addEventListener("click", () => addIngredient());
addInstructionBtn.addEventListener("click", () => addInstruction());

// Check if editing a recipe via URL
const urlParams = new URLSearchParams(window.location.search);
const editingId = urlParams.get("id");
const savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];


//Checking for Id to send to add-recipe to edit
if (editingId) {
  const recipeToEdit = savedRecipes.find((r) => r.idMeal === editingId);
  if (recipeToEdit) {
    // Prefill form
    document.getElementById("recipe-name").value = recipeToEdit.name;
    document.getElementById("category").value = recipeToEdit.category;

    // Ensure ingredients is an array
    const ingredientsArray = Array.isArray(recipeToEdit.ingredients)
      ? recipeToEdit.ingredients
      : (recipeToEdit.ingredients || "").split("\n").map(i => i.trim()).filter(Boolean);
    
      // Prefill ingredients
    ingredientsContainer.innerHTML = "";
    ingredientsArray.forEach((ing) => addIngredient(ing));
    // recipeToEdit.ingredients.forEach((ing) => addIngredient(ing));


    // Ensure instructions is an array
    const instructionsArray = Array.isArray(recipeToEdit.instructions)
      ? recipeToEdit.instructions
      : (recipeToEdit.instructions || "").split("\n").map(i => i.trim()).filter(Boolean);

    // Prefill instructions
    instructionsContainer.innerHTML = "";
    instructionsArray.forEach((inst) => addInstruction(inst));
    // recipeToEdit.instructions.forEach((inst) => addInstruction(inst));

    // Save editingId in dataset
    recipeForm.dataset.editingId = editingId;

    statusMessage.textContent = "Editing recipe: " + recipeToEdit.name;
    statusMessage.style.color = "blue";
  }
}

//Submit form
recipeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("recipe-name").value.trim();
  const category = document.getElementById("category").value;
  const imageInput = document.getElementById("recipe-image");

  // Collect inputs as arrays
  const ingredients = Array.from(document.querySelectorAll(".ingredient-input"))
    .map((input) => input.value.trim())
    // .filter((val) => val);
    .filter(Boolean);

  const instructions = Array.from(
    document.querySelectorAll(".instruction-input")
  )
    .map((input) => input.value.trim())
    // .filter((val) => val);
    .filter(Boolean);

  if (
    !name ||
    !category ||
    ingredients.length === 0 ||
    instructions.length === 0
  ) {
    statusMessage.textContent = "Please fill out all required fields.";
    statusMessage.style.color = "red";
    return;
  }

  // const savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];
  // const editingId = recipeForm.dataset.editingId;

  let recipeToSave = {
    name,
    category,
    ingredients,
    instructions,
    idMeal: editingId || Date.now().toString(),
  };

  //   // Handle image
  if (imageInput && imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      recipeToSave.thumbnail = reader.result;
      saveOrUpdateRecipe(recipeToSave, savedRecipes, editingId);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    if (editingId) {
      // Keep old image if editing and no new image provided
      const existing = savedRecipes.find((r) => r.idMeal === editingId);
      recipeToSave.thumbnail = existing ? existing.thumbnail : null;
    } else {
      recipeToSave.thumbnail = null;
    }
    // saveOrUpdateRecipe(recipeToSave, savedRecipes, editingId);
    saveOrUpdateRecipe(recipeToSave);
  }
});

// // // Save recipe function
// function saveRecipe(recipe) {
//   const savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];

//   // Check duplicates
//   if (
//     savedRecipes.some((r) => r.name.toLowerCase() === recipe.name.toLowerCase())
//   ) {
//     statusMessage.textContent = "Recipe already exists!";
//     statusMessage.style.color = "red";
//     return;
//   }

//   savedRecipes.push(recipe);
//   localStorage.setItem("Recipes", JSON.stringify(savedRecipes));

//   statusMessage.textContent = "Recipe added successfully!";
//   statusMessage.style.color = "green";
//   recipeForm.reset();
//   ingredientsContainer.innerHTML = "";
//   instructionsContainer.innerHTML = "";
//   addIngredient();
//   addInstruction();
// }

// Save or update recipe
function saveOrUpdateRecipe(recipe) {
  let savedRecipes = JSON.parse(localStorage.getItem("Recipes")) || [];

  if (recipeForm.dataset.editingId) {
    // Update existing recipe
    const index = savedRecipes.findIndex((r) => r.idMeal === recipe.idMeal);
    if (index !== -1) {
      savedRecipes[index] = recipe;
    }
    statusMessage.textContent = "Recipe updated successfully!";
    statusMessage.style.color = "green";
  } else {
    // New recipe
    if (savedRecipes.some((r) => r.name.toLowerCase() === recipe.name.toLowerCase())) {
      statusMessage.textContent = "Recipe already exists!";
      statusMessage.style.color = "red";
      return;
    }
    savedRecipes.push(recipe);
    statusMessage.textContent = "Recipe added successfully!";
    statusMessage.style.color = "green";
  }

  localStorage.setItem("Recipes", JSON.stringify(savedRecipes));

  // Reset form
  recipeForm.reset();
  ingredientsContainer.innerHTML = "";
  instructionsContainer.innerHTML = "";
  addIngredient();
  addInstruction();

  // Clear editing flag
  delete recipeForm.dataset.editingId;
}

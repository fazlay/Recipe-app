import Search from './models/Search';
import * as searchView from './views/SearchViews';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearReasult();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getReasult();

      // 5) Render results on UI
      clearLoader();
      searchView.renderReasult(state.search.reasult);
    } catch (err) {
      alert('Something wrong with the search...');
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearReasult();
    searchView.renderReasult(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();

    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients

      await state.recipe.getRecipe();
      state.recipe.pareIngrdients();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calServings();

      // Render recipe
      console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      console.log(err);
      alert('Error processing recipe!');
    }
  }
};

['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

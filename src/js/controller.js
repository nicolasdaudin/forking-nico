import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';

import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';

import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}
const recipeContainer = document.querySelector('.recipe');

// app: https://forkify-v2.netlify.app/
// API: https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// LOADING A RECIPE FROM THE API
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks so that we see the right bookmark selected in the bookmark panel
    // console.log(model.state.bookmarks);
    bookmarksView.render(model.state.bookmarks);

    // 2) loading the recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);

    recipeView.renderError();
  }
};

// SEARCH RECIPES
const controlSearchResults = async function () {
  try {
    // console.log('controlSearchResults query', query);
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    // we pass everything from the state search
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlServings = function (newServings) {
  // update the recipe servings in state
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add-remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (recipe) {
  console.log('uploading recipe:', recipe);

  // 1) add recipe to API
  await model.addRecipe(recipe);

  // 2) bookmark recipe
  console.log(model.state.recipe);
  model.addBookmark(model.state.recipe);

  // 3) render recipe
  window.location.hash = `#${model.state.recipe.id}`;

  // If we render first the recipe (window.location.hash), then when we do
  // model.addBookmark(model.state.recipe), this model.state.recipe is still empty (window.location.hash is async) and so things fail from there since a not-null model.state.recipe is expected
  // The other solution is to make addRecipe update model.state.recipe and then add the bookmark and then change the hash
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlUploadRecipe);
};
init();

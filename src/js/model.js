import { API_URL, API_KEY, RESULTS_PER_PAGE } from './config.js';
import { getJSON, postJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const addRecipe = async function (recipe) {
  try {
    console.log('about to call API to add a recipe');
    const data = await postJSON(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);
    if (data.status) {
      const recipeAdded = data.data.recipe;
      state.recipe = convertFromApiRecipe(recipeAdded);
      // return recipeAdded.id;
      //  console.log(recipeAdded);
    }
  } catch (err) {
    // temp error handling
    //console.error(`${err} 🛑🛑🛑`);
    throw err;
  }
};

const convertFromApiRecipe = function (apiRecipe) {
  return {
    id: apiRecipe.id,
    title: apiRecipe.title,
    publisher: apiRecipe.publisher,
    sourceUrl: apiRecipe.source_url,
    image: apiRecipe.image_url,
    servings: apiRecipe.servings,
    cookingTime: apiRecipe.cooking_time,
    ingredients: apiRecipe.ingredients,
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const { recipe } = data.data;
    state.recipe = convertFromApiRecipe(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (err) {
    // temp error handling
    //console.error(`${err} 🛑🛑🛑`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    const { recipes } = data.data;

    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
      };
    });

    console.log(state.search.results);
  } catch (err) {
    // temp error handling
    //console.error(`${err} 🛑🛑🛑`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not a bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
// clearBookmarks();
init();
console.log('bookmarks', state.bookmarks);

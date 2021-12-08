import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnAddRecipe = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _btnUpload = document.querySelector('.upload__btn');
  _formRecipe = document.querySelector('.upload');
  _ingredientsTextInput = document.querySelectorAll(
    'input[name^="ingredient-"]'
  );

  _errorMessage =
    'An issue occurred while showing the form to add a recipe. Please try again :-/';
  _message = '';

  constructor() {
    super();
    this._btnAddRecipe.addEventListener('click', this._showForm.bind(this));
    this._btnCloseModal.addEventListener('click', this._hideForm.bind(this));
    this._overlay.addEventListener('click', this._hideForm.bind(this));
  }

  addHandlerUpload(handler) {
    this._btnUpload.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        if (this._validateRecipeData()) {
          handler(this._buildRecipeObject());
          this._hideForm();
        }
      }.bind(this)
    );
    // this._formRecipe.addEventListener('submit', function (e) {
    //   e.preventDefault();
    //   console.log('_formRecipe');
    //   handler();
    // });
  }

  _buildRecipeObject() {
    // build ingredients

    const ingredients = Array.from(this._ingredientsTextInput)
      .filter(input => input.value.trim())
      .map(input => {
        const [quantity, unit, description] = input.value.split(',');
        return { quantity, unit, description };
      });

    return {
      title: this._parentElement.querySelector('input[name="title"]').value,
      publisher: this._parentElement.querySelector('input[name="publisher"]')
        .value,
      source_url:
        /*this._parentElement.querySelector('input[name="sourceUrl"]')
        .value*/ 'http://www.webaddikt.com/',
      image_url:
        /*this._parentElement.querySelector('input[name="image"]').value*/ 'http://forkify-api.herokuapp.com/images/IMG_0589410x2736ac7.jpg',
      servings: +this._parentElement.querySelector('input[name="servings"]')
        .value,
      cooking_time: +this._parentElement.querySelector(
        'input[name="cookingTime"]'
      ).value,
      ingredients,
    };
  }

  _validateRecipeData() {
    // const textFieldsValidated = this._validateTextFields();

    let ingredientsValidated = true;
    this._ingredientsTextInput.forEach((input, index) => {
      if (input.value.trim()) {
        if (!this._validateIngredientData(input.value, index)) {
          ingredientsValidated = false;
        }
      }
    });

    return ingredientsValidated;
  }

  _validateIngredientData(text, index) {
    // console.log(text);
    const ingredient = text.split(',');
    if (ingredient.length !== 3) {
      this.renderError(`Error with Ingredient no ${index + 1}`);
      return false;
    }
    // console.log(ingredient);
    return true;
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._formRecipe.insertAdjacentHTML('afterend', markup);
  }

  _showForm() {
    this._parentElement.classList.remove('hidden');
    this._overlay.classList.remove('hidden');
  }

  _hideForm() {
    this._parentElement.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _generateMarkup() {
    return `
      <button class="btn--close-modal">&times;</button>
      <form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>`;
  }
}
export default new AddRecipeView();

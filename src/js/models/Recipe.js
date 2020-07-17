import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      //https://forkify-api.herokuapp.com/api/get?rId=47746
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

      console.log(res);
    } catch (error) {
      console.log(error);
      alert('something went wrong ');
    }
  }
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calServings() {
    this.servings = 4;
  }
  pareIngrdients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tpsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];

    const newIngredients = this.ingredients.map((el) => {
      //uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      //remove pareanthesis

      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //parse ingerdients into count

      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((e12) => unitsShort.includes(e12));

      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}

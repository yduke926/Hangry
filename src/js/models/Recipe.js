import axios from 'axios';
import { key, proxy, app_id } from '../config';

export default class Recipe {
    constructor(uri) {
        this.id = uri;

    }

    async getRecipe(){
        try{
            const res = await axios(`https://api.edamam.com/search?r=http://www.edamam.com/ontologies/edamam.owl%23${this.id}&app_id=${app_id}&app_key=${key}&to=30`);
            //console.log(res);
            this.title = res.data[0].label;
            this.author = res.data[0].source;
            this.image = res.data[0].image;
            this.url = res.data[0].url;
            this.ingredients = res.data[0].ingredientLines;
            
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }
    calcTime() {
        //Assuming that we need 15 min/3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }
    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Parse Ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
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
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)){
                //There is NO unit, but the first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10), 
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                //There is NO unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
        
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        //Ingredients 
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
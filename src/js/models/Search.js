import axios from 'axios';
import { key, proxy, app_id } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;

    }

    async getResults() {
        try {
            const res = await axios(`${proxy}https://api.edamam.com/search?q=${this.query}&app_id=${app_id}&app_key=${key}&to=30`);
            this.result = res.data.hits;
            //console.log(this.result);
        } catch(error){
            console.log(error);
        }
    }

}
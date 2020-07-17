import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getReasult(query) {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.reasult = res.data.recipes;
      console.log(this.reasult);
    } catch (error) {
      alert(error);
    }
  }
}

//https://forkify-api.herokuapp.com/api/search?q=${query}

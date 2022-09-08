import {parseRequestURL} from '../helpers/utils.js';

import Dishes from '../models/dishes.js';

class Component {
    constructor() {
        this.request = parseRequestURL();
        this.dishes = new Dishes().getDishesFromLS();
    }

    afterRender() {}
}

export default Component;
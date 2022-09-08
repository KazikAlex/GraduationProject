import {generateID} from '../helpers/utils.js';

class Dishes {
    constructor() {
        this.defaultDishes = [
            {
                id: generateID(),
                title: 'Филе лосося',
                category: 1,
                price: 25
            },
            {
                id: generateID(),
                title: 'Селедка под шубой',
                category: 1,
                price: 14
            },
            {
                id: generateID(),
                title: 'Карп жареный',
                category: 1,
                price: 19
            },
            {
                id: generateID(),
                title: 'Стейк говяжий',
                category: 2,
                price: 15
            },
            {
                id: generateID(),
                title: 'Свинина тушеная',
                category: 2,
                price: 12
            },
            {
                id: generateID(),
                title: 'Свинина отбивная',
                category: 2,
                price: 17
            },
            {
                id: generateID(),
                title: 'Рис',
                category: 3,
                price: 3
            },
            {
                id: generateID(),
                title: 'Картофель пюре',
                category: 3,
                price: 4
            },
            {
                id: generateID(),
                title: 'Гречневая каша',
                category: 3,
                price: 2
            },
            {
                id: generateID(),
                title: 'Борщ',
                category: 4,
                price: 5
            },
            {
                id: generateID(),
                title: 'Суп пюре',
                category: 4,
                price: 6
            },
            {
                id: generateID(),
                title: 'Суп куриный',
                category: 4,
                price: 5
            },
            {
                id: generateID(),
                title: 'Тирамису',
                category: 5,
                price: 5
            },
            {
                id: generateID(),
                title: 'Чизкейк',
                category: 5,
                price: 4
            },
            {
                id: generateID(),
                title: 'Мороженое',
                category: 5,
                price: 3
            },
            {
                id: generateID(),
                title: 'Жаркое',
                category: 6,
                price: 17
            },
            {
                id: generateID(),
                title: 'Свинина по дом',
                category: 6,
                price: 19
            },
            {
                id: generateID(),
                title: 'Кока-кола',
                category: 7,
                price: 2
            },
            {
                id: generateID(),
                title: 'Спрайт',
                category: 7,
                price: 2
            },
            {
                id: generateID(),
                title: 'Сок в ассорт',
                category: 7,
                price: 3
            },
            {
                id: generateID(),
                title: 'Виски',
                category: 8,
                price: 6
            },
            {
                id: generateID(),
                title: 'Водка',
                category: 8,
                price: 3
            },
            {
                id: generateID(),
                title: 'Вино',
                category: 8,
                price: 4
            }
        ];
    }

    getDishesFromLS() {
        return JSON.parse(localStorage.getItem('dishes')) || this.defaultDishes && Dishes.setBaseFromLS('dishes', this.defaultDishes);
    }

    static getBaseFromLS(base) {
        return JSON.parse(localStorage.getItem(base)) || localStorage.setItem(base, JSON.stringify([]));;
    }

    static setBaseFromLS(base, baseVar) {
        return localStorage.setItem(base, JSON.stringify(baseVar));;
    }
}

export default Dishes;
import {generateID} from '../../helpers/utils.js';

import Component from '../component.js';

import Dishes from '../../models/dishes.js';

class Kitchen extends Component {

    render() {
        return new Promise(resolve => {
            resolve(`     

                <div class="wrapper">

                    <div class="task-add">
                        <h1 class="page-title">Новое блюдо</h1>
                        <input class="task-add__title" type="text" placeholder="Введите название блюда">
                        <select class="task-add__choise" placeholder="НОМЕР">
                            <option value="1">Рыба</option>
                            <option value="2">Мясо</option>
                            <option value="3">Гарнир</option>
                            <option value="4">Супы</option>
                            <option value="5">Десерты</option>
                            <option value="6">Блюда дня</option>
                            <option value="7">Напитки</option>
                            <option value="8">Алкоголь</option>
                        </select>
                        <input class="task-add__cost" type="text" placeholder="Цена">                   
                        <button class="task-add__btn-add button" disabled>Добавить в меню</button>
                        
                        <label>Текущий заказ
                            <div class="task-add__order">
                                
                            </div>
                        </label>

                        <button class="task-add__order-add button">Оформить</button>

                    </div>       
                    
                    <div class="tasks">
                        <div class="tasks__list">
                            <div class="menu">                                         
                                <label>1.Рыба
                                <div class="menu__item fish"></div></label>
                                <label>2.Мясо:
                                <div class="menu__item meat"></div></label>
                                <label>3.Гарнир:
                                <div class="menu__item garnish"></div></label>
                                <label>4.Супы:
                                <div class="menu__item soups"></div></label>
                                <label>5.Десерты:
                                <div class="menu__item deserts"></div></label>
                                <label>6.Блюда дня:
                                <div class="menu__item day"></div></label>
                                <label>7.Напитки:
                                <div class="menu__item drinks"></div></label>
                                <label>8.Алкоголь:
                                <div class="menu__item alcohol"></div></label>
                            </div>                       
                        </div>
                    </div>  
                </div>   

            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addDishTitle = document.getElementsByClassName('task-add__title')[0],
            choiseCategory = document.getElementsByClassName('task-add__choise')[0],
            addDishPrice = document.getElementsByClassName('task-add__cost')[0],
			addDishBtn = document.getElementsByClassName('task-add__btn-add')[0],
            dishesContainer = document.getElementsByClassName('menu')[0],
            menuContainer = document.getElementsByClassName('task-add')[0],
            orderContainer = document.getElementsByClassName('task-add__order')[0];

        let transformOrder, orderDish, transformReceipt, transformReceiptOnStorage;

        addDishTitle.addEventListener('keyup', () => addDishBtn.disabled = !addDishTitle.value.trim());
        addDishPrice.addEventListener('keyup', () => {
            isNaN(addDishPrice.value) || addDishPrice.value == 0 ? addDishPrice.value = '' : addDishPrice.innerHTML = addDishPrice.value;
            addDishPrice.value == '' ? alert('Введите корректную сумму') : addDishPrice.innerHTML = addDishPrice.value;
        });
        addDishBtn.addEventListener('click', () => this.addDish(addDishTitle, choiseCategory, addDishBtn, addDishPrice));

        this.putDishesInCategory();
        
		dishesContainer.addEventListener('click', e => {
            const target = e.target,
                targetClassList = target.classList;

            switch(true) {
                case targetClassList.contains('dish-wrapper'):
                case targetClassList.contains('dish'):
                case targetClassList.contains('price'):
                    if (!localStorage.getItem('order')) {
                        alert('Вернитесь в ЗАЛ и создайте ЗАКАЗ на столик');
                    }else {
                        orderDish = this.dishes.filter(task => task.id == target.dataset.id);                  
                        transformOrder = Dishes.getBaseFromLS('order');
                        transformOrder.order.push(orderDish[0]);
                        Dishes.setBaseFromLS('order', transformOrder);
                        orderContainer.insertAdjacentHTML('beforeEnd', this.getDishHTML(orderDish[0]));                    
                        break;
                    }
                    
            }
        });

        this.addRecipt();

        menuContainer.addEventListener('click', e => {
            const target = e.target,
                targetClassList = target.classList;

            switch(true) {
                case targetClassList.contains('task-add__order-add'):
                    let amount = 0;
                    transformReceipt = Dishes.getBaseFromLS('order');

                    for (let item of transformReceipt.order) {
                        amount += item.price;
                    }

                    localStorage.removeItem('order');
                    orderContainer.innerHTML = '';

                    const newRecipt = {
                        id: generateID(),
                        reciptTime: new Date().toLocaleString(),
                        reciptWaiter: transformReceipt.waiter,
                        reciptTable: transformReceipt.table,
                        orderTime: transformReceipt.time,
                        reciptOrder: transformReceipt.order.slice(),
                        reciptAmount: amount,
                        resiptStatus: 'In progress'
                    };
         
                    transformReceiptOnStorage = Dishes.getBaseFromLS('recipt');
                    transformReceiptOnStorage.push(newRecipt);
                    Dishes.setBaseFromLS('recipt', transformReceiptOnStorage);
                    location.hash = `#/`;
                    break;
            }
        });
    }

    addDish(addDishTitle, choiseCategory, addDishBtn, addDishPrice) {
		const newDish = {
            id: generateID(),
            title:  addDishTitle.value.trim(),
            category: choiseCategory.value,
            price: +addDishPrice.value.trim()
        }

        this.dishes.push(newDish);
        Dishes.setBaseFromLS('dishes', this.dishes)
        this.clearAddDish(addDishTitle, choiseCategory, addDishPrice, addDishBtn);
        this.defineDishesContainer(newDish.category).insertAdjacentHTML('beforeEnd', this.getDishHTML(newDish));
        
    }

    defineDishesContainer(taskDishNumber) { 
        let categoriesContainer = ['fish', 'meat', 'garnish', 'soups', 'deserts', 'day', 'drinks', 'alcohol'],
            dishesContainer = document.getElementsByClassName(categoriesContainer[taskDishNumber-1])[0];

        return dishesContainer;
    }

    getDishHTML(dish) {
        return `
            <div class="dish-wrapper" draggable = "true" data-id="${dish.id}">
                <div class="dish" data-id="${dish.id}">${dish.title}</div>
                <div class="price" data-id="${dish.id}">${dish.price}</div>
            </div>
        `;
    }

    clearAddDish(addDishTitle, choiseCategory, addDishPrice, addDishBtn) {
        addDishTitle.value = '';
        choiseCategory.value = '';
        addDishPrice.value = '';
        addDishBtn.disabled = true;
    }

    putDishesInCategory() {
        for (let item of Dishes.getBaseFromLS('dishes')) {
            this.defineDishesContainer(item.category).insertAdjacentHTML('beforeEnd', this.getDishHTML(item));
        }
    }

    addRecipt() {
        const dish = document.getElementsByClassName('dish-wrapper'),
            menuContainer = document.getElementsByClassName('task-add__order')[0];

        let dishArray = Array.from(dish), current;
        

        dishArray.forEach((item) => {
            item.addEventListener('dragstart', e => {
                current = e.target.dataset.id;
                e.dataTransfer.setData('text/html', 'dragstart');
            });
        });                   

        menuContainer.addEventListener('dragover', e => {
            e.preventDefault();
        });

        menuContainer.addEventListener('drop', e => {      
            let orderDish, transformOrder, orderContainer = document.getElementsByClassName('task-add__order')[0];

            try {
                orderDish = this.dishes.filter(task => task.id == current);                     
                transformOrder = Dishes.getBaseFromLS('order');
                transformOrder.order.push(orderDish[0]);
                Dishes.setBaseFromLS('order', transformOrder);
                orderContainer.insertAdjacentHTML('beforeEnd', this.getDishHTML(orderDish[0]));  
            }
            catch (error) {
                alert('Вернитесь в ЗАЛ и создайе ЗАКАЗ на столик')
            }
        });
    }
}

export default Kitchen;
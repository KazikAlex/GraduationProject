import Component from '../component.js';

import {generateID} from '../../helpers/utils.js';

import Dishes from '../../models/dishes.js';

import {router} from '../../app.js';

class Hall extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
            <div class="wrapper">
                <div class="hall">
                    <div class="table">1</div>
                    <div class="table">2</div>
                    <div class="table">3</div>
                    <div class="table">4</div>
                    <div class="table">5</div>
                    <div class="table">6</div>
                    <div class="table">7</div>
                    <div class="table">8</div>
                    
                </div>
                <div class="hall__btn">
                    <div class="hall__wrapper">
                        <button class="order__btn" disabled>Заказ</button>
                        <div class="hall__trash"></div>
                    </div>    
                    
                    <div class="hall__btn__order">                   
                        <select name="select" id="select-id" class="hall__btn__order__select">
                            <option value="Вася">Вася</option>
                            <option value="Саша">Саша</option>
                            <option value="Таня">Таня</option>
                        </select>
                        <div class="hall__btn__order__title">Заказы на столик</div>
                        <div class="hall__btn__order__block"></div>   
                        <div class="hall__btn__order__amount">
                            <div class="hall__btn__order__amount__title">Сумма заказа:</div> 
                            <div class="hall__btn__order__amount__all"></div> 
                        </div> 
                        <button class="hall__btn__order__bill-btn" disabled>Рассчитать столик</button>                    
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
        const orderBtn = document.getElementsByClassName('order__btn')[0],
            hallBtn = document.getElementsByClassName('hall__btn')[0],
            hall = document.getElementsByClassName('hall')[0],
            tableContainer = document.getElementsByClassName('table'),          
            billBtn = document.getElementsByClassName('hall__btn__order__bill-btn')[0],
            billContainer = document.getElementsByClassName('hall__btn__order__block')[0],
            allContainer = document.getElementsByClassName('hall__btn__order__amount__all')[0],
            waiterSelect = document.getElementById('select-id');
 
        let tableNumber;

        Dishes.getBaseFromLS('recipt');

        this.showReservedTable(tableContainer);

		hall.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch(true) {               
                case targetClassList.contains('table'):
                    let allAmount = 0;

                    for (let i = 0; i < tableContainer.length; i++) {
                        if (tableContainer[i].classList.contains('active')) {
                            tableContainer[i].classList.remove('active');                    }
                    }

                    !targetClassList.contains('active') ? targetClassList.add('active') : targetClassList.add('')
                    tableNumber = target.innerHTML;
                    orderBtn.disabled = false;
                    billBtn.disabled = false;
                    billContainer.innerHTML = '';
                    allContainer.innerHTML = '';

                    for (let item of Dishes.getBaseFromLS('recipt')) {
                        if (item.reciptTable == tableNumber && item.resiptStatus == 'In progress') {
                            billContainer.insertAdjacentHTML('beforeEnd', this.getReciptHTML(item));
                            allAmount += item.reciptAmount;
                        } 
                    }

                    allContainer.insertAdjacentHTML('beforeEnd', allAmount);

                    this.deleteRecipt();
                    

                    break;
            }
        });

        hallBtn.addEventListener('click', event => {
            const target = event.target,
            targetClassList = target.classList;

            switch(true) {  
                case targetClassList.contains('order__btn'):
                    const newOrder = {
                        id: generateID(),
                        waiter: waiterSelect.value,
                        table: tableNumber,
                        time: new Date().toLocaleString(),
                        order: []
                    }

                    Dishes.setBaseFromLS('order', newOrder);
                    location.hash = `/kitchen`;
                    break;

                case targetClassList.contains('hall__btn__order__bill-btn'):
                    let closeRecipt = Dishes.getBaseFromLS('recipt');

                    for (let item of closeRecipt) {
                        if (item.reciptTable == tableNumber && item.resiptStatus == 'In progress') { 
                            item.resiptStatus = 'Closed';
                        } 
                    }

                    billContainer.innerHTML = ''
                    Dishes.setBaseFromLS('recipt', closeRecipt);
                    router();
                    break;

                    case targetClassList.contains('dish'):
                    case targetClassList.contains('price'):
                        let deleteRecipt;

                        if (confirm('Вы хотите удалить счет из заказа?')) {
                            deleteRecipt = Dishes.getBaseFromLS('recipt').filter(dish => dish.id != target.dataset.id);
                            Dishes.setBaseFromLS('recipt', deleteRecipt);
                            router();
                        }
                    break;
            }
        });
    }

    getReciptHTML(recipt) {
        return `
            <div class="dish-wrapper" draggable = "true" data-id="${recipt.id}">
                <div class="dish" data-id="${recipt.id}">${recipt.reciptTime}</div>
                <div class="price" data-id="${recipt.id}">${recipt.reciptAmount}</div>
            </div>
        `;
    }

    showReservedTable(tableContainer) {
        let tableArray = Array.from(tableContainer);
        
        tableArray.forEach((table) => {
            for(let item of Dishes.getBaseFromLS('recipt')) {
                if (item.reciptTable == table.innerHTML && !table.classList.contains('done') && item.resiptStatus == 'In progress') {
                    table.classList.add('done');
                }
            }
        });

        
    }

    deleteRecipt() {
        const dish = document.getElementsByClassName('dish-wrapper'),
            trash = document.getElementsByClassName('hall__trash')[0];

        let dishArray = Array.from(dish), current;
        

        dishArray.forEach((item) => {
            item.addEventListener('dragstart', (e) => {
                current = e.target.dataset.id;
                e.dataTransfer.setData('text/html', 'dragstart');
            });
        });                   

        trash.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        trash.addEventListener('drop', (e) => {          
            let deleteRecipt;

            if (confirm('Вы хотите удалить счет из заказа?')) {
                deleteRecipt = Dishes.getBaseFromLS('recipt').filter(dish => dish.id != current);
                Dishes.setBaseFromLS('recipt', deleteRecipt);
                router();
            }
            
        });
    }
}

export default Hall;
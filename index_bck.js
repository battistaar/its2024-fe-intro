import { cart } from './cart.js';
import { getTransportFee, parseItem } from './cart-utils.js';

function createElementFromTemplate(template) {
  const tmpElement = document.createElement('div');
  tmpElement.innerHTML = template.trim();
  
  return tmpElement.firstChild;
}

function createCartItem(item, vat, onQtyChanged) {
  const template = `
  <li class="list-group-item item">
    <div
      class="d-flex flex-row d-flex justify-content-between align-items-center"
    >
      <div class="item-name">${item.name}</div>
      <div
        class="d-flex flex-row align-items-center justify-content-end flex-wrap"
      >
        <span class="ms-2 d-flex flex-row align-items-center">
          <label class="me-1" for="quantity">qty:</label>
          <input
            class="form-control item-quantity"
            value="${item.quantity}"
            type="number"
            style="width: 70px"
          />
        </span>
        <span class="ms-2">
          <span class="item-price"></span>
          <span class="item-discount"></span>
        </span>
      </div>
    </div>
  </li>
`;

  const element = createElementFromTemplate(template);

  updateCartItem(element, item, vat);

  const inputElement = element.querySelector('.item-quantity');

  if (inputElement && onQtyChanged) {
    inputElement.addEventListener('change', event => {
      onQtyChanged(event.target.value);
    });

    inputElement.addEventListener('keyup', event => {
      onQtyChanged(event.target.value);
    });
  }

  return element;
}

function updateCartItem(element, item, vat) {
  const newCalculated = parseItem(item, vat);

  element.querySelector('.item-price').innerHTML = `${newCalculated.price}€`;
  element.querySelector('.item-discount').innerHTML = `(-${newCalculated.discountAmount}€)`;
}

function updateSummary(items, vat) {
  const summaryContainer = document.querySelector('.order-summary');

  const calculatedItems = items.map(item => parseItem(item, vat));

  const netTotal = calculatedItems.reduce((total, item) => {
                                            return total + item.discountedPrice;
                                          }, 0);

  const vatTotal = calculatedItems.reduce((total, item) => {
                                            return total + item.vatAmount;
                                          }, 0);
  const total = calculatedItems.reduce((total, item) => {
                                            return total + item.price;
                                          }, 0);
  
  const weight = calculatedItems.reduce((total, item) => {
                                            return total + item.weight;
                                          }, 0);

  const transportFee = getTransportFee(weight);

  summaryContainer.querySelector('.net-total').innerHTML = `${netTotal}€`;
  summaryContainer.querySelector('.vat-total').innerHTML = `${vatTotal}€`;
  summaryContainer.querySelector('.transport-fee').innerHTML = `${transportFee}€`;
  summaryContainer.querySelector('.total').innerHTML = `${total}€`;
}


window.onload = function() {
  const listContainer = document.getElementById('items-list');
  
  listContainer.innerHTML = '';
  const vat = 0.22;
  for(let item of cart) {
    
    const element = createCartItem(item, vat, newQty => {
      item.quantity = newQty;

      updateCartItem(element, item, vat);
      updateSummary(cart, vat);
    });

    listContainer.appendChild(element);

    updateSummary(cart, vat);
  }
}
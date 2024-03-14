import { cart } from './cart.js';
import { getTransportFee, parseItem } from './cart-utils.js';
import { Summary } from './summary.js';
import { CartItem } from './cart-item.js';

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

window.onload = function() {
  const listContainer = document.getElementById('items-list');
  const summaryContainer = document.querySelector('.order-summary');
  const vat = 0.22;

  const summary = new Summary();
  summary.items = cart;
  summary.vat = vat;
  summaryContainer.appendChild(summary.element);

  listContainer.innerHTML = '';
  for(let item of cart) {
    const cartItem = new CartItem(item, vat);
    cartItem.addEventListener('quantityChanged', event => {
      item.quantity = event.detail.quantity;

      cartItem.item = item;
      summary.items = cart;
    })

    listContainer.appendChild(cartItem.element);
  }
}
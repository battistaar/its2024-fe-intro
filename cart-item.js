import { createElementFromTemplate } from "./utils.js";
import { parseItem } from "./cart-utils.js";

export class CartItem extends EventTarget {
  #element;
  #item;
  #vat;

  get element() {
    return this.#element;
  }

  get item() {
    return this.#item;
  }
  set item(value) {
    console.log(value);
    this.#item = value;
    this.#update();
  }

  constructor(item, vat) {
    super();
    this.#item = item;
    this.#vat = vat;

    this.#element = this.#create();
    this.#attachQuantityListeners();
    this.#update();
  }

  #create(){
    let template = `
    <li class="list-group-item item">
    <div
      class="d-flex flex-row d-flex justify-content-between align-items-center"
    >
      <div class="item-name"></div>
      <div
        class="d-flex flex-row align-items-center justify-content-end flex-wrap"
      >
        <span class="ms-2 d-flex flex-row align-items-center">
          <label class="me-1" for="quantity">qty:</label>
          <input
            class="form-control item-quantity"
            value=""
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
  </li>`;
    return createElementFromTemplate(template);
  }

  #update() {
    const newCalculated = parseItem(this.#item, this.#vat);

    this.#element.querySelector('.item-name').innerHTML = `${this.#item.name}€`;
    this.#element.querySelector('.item-quantity').value = this.#item.quantity;

    this.#element.querySelector('.item-price').innerHTML = `${newCalculated.price}€`;
    this.#element.querySelector('.item-discount').innerHTML = `(-${newCalculated.discountAmount}€)`;
  }

  #attachQuantityListeners() {
    const quantityInput = this.#element.querySelector('.item-quantity');
    if (quantityInput) {
      quantityInput.addEventListener('change', (event) => {
        const newQuantity = event.target.value;

        const quantityEvent = new CustomEvent('quantityChanged', {
          detail: {
            item: this.#item,
            quantity: newQuantity
          }
        })

        this.dispatchEvent(quantityEvent);
      });
    }
  }
}
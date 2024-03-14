import { createElementFromTemplate } from "./utils.js";
import { parseItem, getTransportFee } from "./cart-utils.js";

export class Summary {
  #element;
  #items;
  #vat;

  constructor() {
    this.#element = this.#create();
  }

  get items() {
    return this.#items;
  }
  set items(value) {
    this.#items = !!value ? value : [];
    this.#update();
  }

  get vat() {
    return this.#vat;
  }
  set vat(value) {
    this.#vat = value;
    this.#update();
  }

  get element() {
    return this.#element;
  }

  #create() {
    let template = `
      <div>
        <div class="d-flex justify-content-between">
          <span>Net Total:</span>
          <span class="net-total"></span>
        </div>
        <div class="d-flex justify-content-between">
          <span>VAT:</span>
          <span class="vat-total"></span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Transport:</span>
          <span class="transport-fee"></span>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <span>Total:</span>
          <span class="total"></span>
        </div>
      </div>`;
    return createElementFromTemplate(template);
  }

  #update() {
    const calculatedItems = this.#items.map(item => parseItem(item, this.#vat));
  
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
  
    this.element.querySelector('.net-total').innerHTML = `${netTotal}€`;
    this.element.querySelector('.vat-total').innerHTML = `${vatTotal}€`;
    this.element.querySelector('.transport-fee').innerHTML = `${transportFee}€`;
    this.element.querySelector('.total').innerHTML = `${total}€`;
  }


}
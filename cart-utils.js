export function getVAT(country) {
      return country === 'IT' ? 0.22 : 0;
  }
  
  export function getDiscountAmount(price, discount) {
      const percentageDiscount = discount / 100;
      return price * percentageDiscount;
  }
  
  export function getDiscountedPrice(price, discount) {
      return price - getDiscountAmount(price, discount);
  }
  
  export function getVatAmount(price, vat) {
      return price * vat;
  }
  
  export function getPrice(price, vat) {
      return price + getVatAmount(price, vat);
  }
  
  export function getTransportFee(weight) {
      let transportFee = 0;
      if (weight > 2000) {
          transportFee = 7;
      }
      if (weight > 5000) {
          transportFee = 15;
      }
      if (weight > 10000) {
          transportFee = 25;
      }
      return transportFee;
  }
  
  export function parseItem(item, vat) {
      let discountAmount = getDiscountAmount(item.netPrice, item.discount) * item.quantity;
      let discountedPrice = getDiscountedPrice(item.netPrice, item.discount) * item.quantity;
  
      let vatAmount = getVatAmount(discountedPrice, vat);
      let price = getPrice(discountedPrice, vat);
  
      let weight = item.weight * item.quantity;
      return {
          name: item.name,
          quantity: item.quantity,
          weight: weight,
          discountAmount,
          discountedPrice,
          vatAmount,
          price
      };
  }
import { Cart } from "./cart.model";

export class Order {
  constructor(public cart: Cart[], public id?: string) {}
}

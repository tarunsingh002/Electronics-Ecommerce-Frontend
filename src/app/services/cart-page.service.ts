import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class CartPageService {
  cartChanged = new BehaviorSubject<Cart[]>(null);
  cart: Cart[] = [];

  constructor() {}

  addToCart(p: Product, q: number) {
    if (!this.cart.find((c) => c.product.productId === p.productId))
      this.cart.push({ product: p, quantity: q });
    else this.cart.find((c) => c.product.productId === p.productId).quantity++;
    this.cartChanged.next(this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  editCart(cart: Cart[]) {
    this.cart = cart;
    this.cartChanged.next(this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}

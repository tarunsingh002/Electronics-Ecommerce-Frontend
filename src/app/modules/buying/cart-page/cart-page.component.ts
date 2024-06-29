import { Component, OnDestroy, OnInit } from "@angular/core";
import { Cart } from "../../../models/cart.model";
import { CartPageService } from "../../../services/cart-page.service";
import { Product } from "../../../models/product.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.css"],
})
export class CartPageComponent implements OnInit, OnDestroy {
  cart: Cart[];
  displayCart: { product: Product; quantity: number }[];
  cartTotal: number;
  cartSub: Subscription;

  constructor(private cservice: CartPageService) {}

  ngOnInit(): void {
    this.cartSub = this.cservice.cartChanged.subscribe((cart) => {
      if (!localStorage.getItem("cart") && !cart) {
        this.cart = [];
      } else if (localStorage.getItem("cart") && !cart) {
        this.cart = JSON.parse(localStorage.getItem("cart"));
      } else if (!localStorage.getItem("cart") && cart) {
        this.cart = cart;
      } else if (localStorage.getItem("cart") && cart) {
        this.cart = cart;
      }

      let t: number = 0;

      for (let i = 0; i < this.cart.length; i++)
        t += this.cart[i].product.price * this.cart[i].quantity;

      this.cartTotal = t;
    });
  }

  addProduct(p: { product: Product; quantity: number }) {
    let i = this.cart.findIndex(
      (pd) => pd.product.productId === p.product.productId
    );

    this.cart[i].quantity++;
    this.cservice.editCart(this.cart);
  }

  subtractProduct(p: { product: Product; quantity: number }) {
    let i = this.cart.findIndex(
      (pd) => pd.product.productId === p.product.productId
    );

    this.cart[i].quantity--;
    if (this.cart[i].quantity === 0) {
      this.cart.splice(i, 1);
    }
    this.cservice.editCart(this.cart);
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }
}

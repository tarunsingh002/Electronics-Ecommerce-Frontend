import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../../../models/product.model";
import { NgForm } from "@angular/forms";
import { UserService } from "../../../services/auth-services/user.service";
import { AuthService } from "../../../services/auth-services/auth.service";

import { User } from "../../../models/user.model";
import { Subscription } from "rxjs";
import { LoadingService } from "../../../services/loading.service";
import { Cart } from "../../../models/cart.model";
import { CartPageService } from "../../../services/cart-page.service";

@Component({
  selector: "app-buy-product",
  templateUrl: "./buy-product.component.html",
  styleUrls: ["./buy-product.component.css"],
})
export class BuyProductComponent implements OnInit, OnDestroy {
  cart: Cart[];
  cartSub: Subscription;
  user: User;
  userSub: Subscription;
  displayCart: { product: Product; quantity: number }[] = [];
  cartTotal: number;

  _address: string = "";
  _nameOnCard: string = "";
  _cardNumber: number = 0;
  _expiryDate: string = "";

  constructor(
    private userS: UserService,
    private aservice: AuthService,
    private router: Router,
    private l: LoadingService,
    private cservice: CartPageService
  ) {}

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

      this._address = "200, Fictional Street, Gurugram";
      this._nameOnCard = "User user";
      this._cardNumber = 1234567890123456;
      this._expiryDate = "11/27";
    });

    this.userSub = this.aservice.User.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.cartSub.unsubscribe();
  }

  onSubmit(f: NgForm) {
    let value = f.value;
    this.l.isLoading.next(true);
    this.userS.createOrder(this.cart).subscribe(() => {
      this.l.isLoading.next(false);
      this.cservice.cartChanged.next(null);
      this.cservice.cart = [];
      localStorage.removeItem("cart");
      this.router.navigate(["/buying/complete"]);
    });
  }
}

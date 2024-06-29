import { Component, OnInit } from "@angular/core";
import { User } from "../../../models/user.model";
import { ActivatedRoute } from "@angular/router";
import { Cart } from "../../../models/cart.model";
import { Product } from "../../../models/product.model";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  user: User;
  displayCarts: { product: Product; quantity: number }[][] = [];
  orderTotals = [];

  constructor(private aroute: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this.aroute.snapshot.data["res2"].user;
    this.displayCarts = this.aroute.snapshot.data["res2"].res;
    this.orderTotals = this.aroute.snapshot.data["res2"].t;
  }
}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, mergeMap, tap } from "rxjs/operators";
import { Product } from "src/app/models/product.model";
import { AdminService, wishlist } from "src/app/services/admin.service";
import { ProductDataService } from "src/app/services/product-data.service";

@Component({
  selector: "app-all-wishlist",
  templateUrl: "./all-wishlist.component.html",
  styleUrls: ["./all-wishlist.component.css"],
})
export class AllWishlistComponent implements OnInit {
  products = [];
  wishlisted = [];

  constructor(private aroute: ActivatedRoute) {}
  ngOnInit(): void {
    this.products = this.aroute.snapshot.data["res"].products;
    this.wishlisted = this.aroute.snapshot.data["res"].wishlisted;
  }
}

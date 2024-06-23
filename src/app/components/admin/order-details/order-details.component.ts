import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, mergeMap } from "rxjs/operators";
import { AdminService } from "src/app/services/admin.service";
import { order } from "src/app/services/auth-services/user.service";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent implements OnInit {
  constructor(
    private aroute: ActivatedRoute,
    private adminService: AdminService
  ) {}

  order: order = null;
  date: string;
  total: number;

  ngOnInit(): void {
    this.aroute.params
      .pipe(
        map((params) => {
          let orders: order[] = this.aroute.snapshot.data["res"];
          this.order = orders.find((o) => o.orderId === +params["id"]);
          this.total = 0;
          this.order.orderItems.forEach((i) => {
            this.total = this.total + i.product.price * i.quantity;
          });

          this.date = new Date(this.order.timestamp).toDateString();
        })
      )

      .subscribe();
  }
}

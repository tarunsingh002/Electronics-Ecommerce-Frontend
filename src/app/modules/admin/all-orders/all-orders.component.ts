import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-all-orders",
  templateUrl: "./all-orders.component.html",
  styleUrls: ["./all-orders.component.css"],
})
export class AllOrdersComponent implements OnInit {
  orders = [];
  earnings: number;
  constructor(private aroute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.orders = this.aroute.snapshot.data["res"].orders;
    this.earnings = this.aroute.snapshot.data["res"].earnings;
  }

  orderDetailsPage(order) {
    this.router.navigate([`/admin/orderdetail/${order.id}`]);
  }
}

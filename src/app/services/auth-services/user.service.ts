import { Injectable } from "@angular/core";

import { User } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Cart } from "../../models/cart.model";

import { CartPageService } from "../cart-page.service";
import { Product } from "src/app/models/product.model";
import { apiUrl } from "src/app/apiutility";

export interface OrderItem {
  orderItemId: number;
  product: Product;
  quantity: number;
}

export interface order {
  orderId: number;
  orderItems: OrderItem[];
  user: any;
  timestamp: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  users: User[] = [];

  api: string = `${apiUrl}/api/v1`;
  constructor(private http: HttpClient, private cservice: CartPageService) {}

  createOrder(cart: Cart[]) {
    return this.http.post<order>(`${this.api}/user/createorder`, cart);
  }
  loadUserOrders() {
    return this.http.get<order[]>(`${this.api}/user/getorders`);
  }
}

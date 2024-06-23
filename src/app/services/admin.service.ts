import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { order } from "./auth-services/user.service";
import { AuthService } from "./auth-services/auth.service";

import { exhaustMap, take } from "rxjs/operators";
import { of } from "rxjs";
import { Product } from "../models/product.model";
import { apiUrl } from "../apiutility";

export interface wishlist {
  id: number;
  user: any;
  products: Product[];
}

@Injectable({
  providedIn: "root",
})
export class AdminService {
  api: string = `${apiUrl}/api/v1`;
  constructor(private http: HttpClient, private AuthS: AuthService) {}

  loadAllOrders() {
    return this.AuthS.User.pipe(
      take(1),
      exhaustMap((user) => {
        if (user && user.webmaster)
          return this.http.get<order[]>(`${this.api}/admin/getallorders`);
        else return of(null);
      })
    );
  }

  getAllWishlisted() {
    return this.AuthS.User.pipe(
      take(1),
      exhaustMap((user) => {
        if (user && user.webmaster)
          return this.http.get<wishlist[]>(
            `${this.api}/admin/getallwishlisted`
          );
        else return of(null);
      })
    );
  }

  getOrder(id: number) {
    return this.AuthS.User.pipe(
      take(1),
      exhaustMap((user) => {
        if (user && user.webmaster)
          return this.http.get<order>(`${this.api}/admin/getorder/${id}`);
        else return of(null);
      })
    );
  }
}

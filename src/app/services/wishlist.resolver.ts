import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Product } from "../models/product.model";
import { WishlistService } from "./wishlist.service";
import { LoadingService } from "./loading.service";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WishlistResolver implements Resolve<Product[]> {
  constructor(private wlService: WishlistService, private l: LoadingService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product[]> {
    this.l.isLoading.next(true);
    return this.wlService.getWishList().pipe(
      tap(() => {
        this.l.isLoading.next(false);
      })
    );
  }
}

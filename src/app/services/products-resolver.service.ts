import { Injectable } from "@angular/core";
import { ProductDataService } from "./product-data.service";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";
import { exhaustMap, tap } from "rxjs/operators";
import { LoadingService } from "./loading.service";
import { WishlistService } from "./wishlist.service";
import { ProductResponse } from "../models/product-response.model";

@Injectable({
  providedIn: "root",
})
export class ProductsResolverService implements Resolve<ProductResponse> {
  constructor(
    private dservice: ProductDataService,
    private l: LoadingService,
    private wlService: WishlistService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ProductResponse | Observable<ProductResponse> | Promise<ProductResponse> {
    this.l.isLoading.next(true);
    return this.wlService.getWishListData().pipe(
      exhaustMap((res) => {
        this.wlService.WishListChanged.next(res);
        return this.dservice.getProducts(1).pipe(
          tap(() => {
            this.l.isLoading.next(false);
          })
        );
      })
    );
  }
}

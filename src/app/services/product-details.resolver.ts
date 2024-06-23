import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { Product } from "../models/product.model";
import { ProductDataService } from "./product-data.service";
import { LoadingService } from "./loading.service";
import { exhaustMap, map, tap } from "rxjs/operators";
import { WishlistService } from "./wishlist.service";
import { AuthService } from "./auth-services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductDetailsResolver
  implements Resolve<{ p: Product; w: boolean }>
{
  constructor(
    private dservice: ProductDataService,
    private l: LoadingService,
    private wlservice: WishlistService,
    private authS: AuthService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ p: Product; w: boolean }> {
    this.l.isLoading.next(true);
    return this.dservice.getProductById(+route.url[0].path).pipe(
      exhaustMap((p) => {
        return this.authS.User.pipe(
          exhaustMap((user) => {
            if (user && !user?.webmaster) {
              return this.wlservice
                .isProductWishListed(+route.url[0].path)
                .pipe(
                  exhaustMap((w) => {
                    this.l.isLoading.next(false);
                    if (w === "Product is wishlisted")
                      return of({ p: p, w: true });
                    else return of({ p: p, w: false });
                  })
                );
            } else {
              this.l.isLoading.next(false);
              return of({ p: p, w: false });
            }
          })
        );
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Product} from '../models/product.model';
import {AuthService} from './auth-services/auth.service';
import {LoadingService} from './loading.service';
import {ProductDataService} from './product-data.service';
import {WishlistService} from './wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsResolver implements Resolve<{p: Product; w: boolean}> {
  constructor(
    private dservice: ProductDataService,
    private l: LoadingService,
    private wlservice: WishlistService,
    private authS: AuthService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);
    return this.dservice.getProductById(+route.url[0].path).pipe(
      switchMap((p) => {
        return this.authS.User.pipe(
          switchMap((user) => {
            if (user && !user?.webmaster) {
              return this.wlservice.isProductWishListed(+route.url[0].path).pipe(
                map((w) => {
                  this.l.isLoading.next(false);
                  if (w === 'Product is wishlisted') return {p: p, w: true};
                  else return {p: p, w: false};
                })
              );
            } else {
              this.l.isLoading.next(false);
              return of({p: p, w: false});
            }
          })
        );
      })
    );
    // return this.dservice.getProductById(+route.url[0].path).pipe(
    //   exhaustMap((p) => {
    //     return this.authS.User.pipe(
    //       exhaustMap((user) => {
    //         if (user && !user?.webmaster) {
    //           return this.wlservice.isProductWishListed(+route.url[0].path).pipe(
    //             map((w) => {
    //               this.l.isLoading.next(false);
    //               if (w === 'Product is wishlisted') return {p: p, w: true};
    //               else return {p: p, w: false};
    //             })
    //           );
    //         } else {
    //           this.l.isLoading.next(false);
    //           return of({p: p, w: false});
    //         }
    //       })
    //     );
    //   })
    // );
  }
}

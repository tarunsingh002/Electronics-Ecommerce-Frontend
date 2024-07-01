import {Injectable} from '@angular/core';
import {ProductDataService} from './product-data.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Product} from '../models/product.model';
import {Observable, combineLatest} from 'rxjs';
import {exhaustMap, map, tap} from 'rxjs/operators';
import {LoadingService} from './loading.service';
import {WishlistService} from './wishlist.service';
import {ProductResponse} from '../models/product-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsResolverService implements Resolve<ProductResponse> {
  constructor(
    private dservice: ProductDataService,
    private l: LoadingService,
    private wlService: WishlistService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);

    return combineLatest([this.wlService.getWishListData(), this.dservice.getProducts(1)]).pipe(
      map((res) => {
        this.wlService.WishListChanged.next(res[0]);
        this.l.isLoading.next(false);
        return res[1];
      })
    );
    // return this.wlService.getWishListData().pipe(
    //   exhaustMap((res) => {
    //     this.wlService.WishListChanged.next(res);
    //     return this.dservice.getProducts(1).pipe(
    //       tap(() => {
    //         this.l.isLoading.next(false);
    //       })
    //     );
    //   })
    // );
  }
}

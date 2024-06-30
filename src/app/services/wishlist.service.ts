import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {Product} from '../models/product.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth-services/auth.service';
import {exhaustMap, take, tap} from 'rxjs/operators';
import {apiUrl} from '../apiutility';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  WishListChanged = new BehaviorSubject<Product[]>(null);
  api = `${apiUrl}/api/v1/user`;

  constructor(private http: HttpClient, private authS: AuthService) {}

  getWishListData() {
    return this.authS.User.pipe(
      take(1),
      exhaustMap((user) => {
        if (user && !user.webmaster) {
          return this.http.get<Product[]>(`${this.api}/getwishlist`);
        } else return of(null);
      })
    );
  }

  addToWishList(product: Product) {
    return this.http.post(`${this.api}/addproduct`, product, {
      responseType: 'text',
    });
  }

  getWishList() {
    return this.getWishListData().pipe(
      tap((res) => {
        console.log(res);
        this.WishListChanged.next(res);
      })
    );
  }

  removeFromWishList(id: number) {
    return this.http.delete(`${this.api}/deleteproduct/${id}`, {
      responseType: 'text',
    });
  }

  isProductWishListed(id: number) {
    return this.http.get(`${this.api}/iswishlisted/${id}`, {
      responseType: 'text',
    });
  }
}

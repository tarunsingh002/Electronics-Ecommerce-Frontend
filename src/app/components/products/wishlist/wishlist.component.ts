import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Product} from 'src/app/models/product.model';
import {CartPageService} from 'src/app/services/cart-page.service';
import {WishlistService} from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  constructor(
    private wlService: WishlistService,
    private cservice: CartPageService,
    private router: Router
  ) {}
  products: Product[] = [];
  unWishlisting: boolean[] = [];

  ngOnInit(): void {
    this.wlService.WishListChanged.subscribe((res) => {
      if (res) this.products = res;
      this.unWishlisting = [];
      this.products.forEach(() => this.unWishlisting.push(false));
    });
  }
  addProductToCart(product: Product) {
    this.cservice.addToCart(product, 1);
    this.router.navigate(['/buying/cart']);
  }
  removeProduct(product: Product) {
    let index = this.products.findIndex((p) => p.productId == product.productId);
    this.unWishlisting[index] = true;
    this.wlService.removeFromWishList(product.productId).subscribe((res) => {
      if (res === 'Product removed from wishlist') {
        this.wlService.getWishList().subscribe();
        //this.unWishlisting[index]=false is not set because the unWishlisting array
        // is automatically emptied out once wishlist refreshes
      }
    });
  }
}

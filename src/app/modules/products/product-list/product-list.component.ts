import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';

import {ProductDataService} from '../../../services/product-data.service';
import {AuthService} from '../../../services/auth-services/auth.service';
import {Subscription, combineLatest} from 'rxjs';
import {CartPageService} from '../../../services/cart-page.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {WishlistService} from 'src/app/services/wishlist.service';
import {concat, debounceTime, map, mergeMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  reactiveForm: FormGroup;
  placeholder: string = '';
  searching: boolean;

  loggingIn: boolean;
  introductoryMessage1: boolean;
  introductoryMessage2: boolean;
  introductoryMessage3: boolean;
  userEmail: String;

  products: Product[] = [];
  wishListed: boolean[] = [];
  auth: boolean = false;
  sub: Subscription;
  webmaster: boolean = false;
  reactiveForm1: FormGroup;
  pages: number[] = [];
  isLast: boolean;
  currentPage: number;
  pageChange = false;
  searchTerm = '';
  sortBy = 'productId';
  direction = 'asc';
  sorting: boolean;
  rForm: FormGroup;
  rForm1: FormGroup;
  filtering: boolean;

  brands = ['Apple', 'Dell', 'HP', 'Samsung', 'Huawei', 'Sony', 'HTC', 'Vivo', 'Oppo'];
  categories = [
    'Phone',
    'Laptop',
    'Camera',
    'Tablet',
    'Gaming Console',
    'Printer',
    'Monitor',
    'Mouse',
  ];

  brandfilter = [];
  categoryfilter = [];
  wishlisting: boolean[] = [];
  unwishlisting: boolean[] = [];

  usingFilter1 = false;
  usingFilter2 = false;
  usingSearch = false;
  noOfResults = 0;

  constructor(
    private dservice: ProductDataService,
    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.pages = [];
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.dservice.productResponseChanged,
      this.authS.User,
      this.wlService.WishListChanged,
    ]).subscribe((res) => {
      if (res[0].products) {
        this.products = res[0].products;
        this.noOfResults = res[0].totalElements;
        this.pages = [];
        for (let i = 0; i < res[0].totalPages; i++) this.pages.push(i + 1);
        this.isLast = res[0].lastPage;
        this.currentPage = res[0].pageNumber + 1;
      }

      this.auth = !!res[1];
      if (res[1]) {
        this.webmaster = res[1].webmaster;
        this.userEmail = res[1].email;
      }

      this.wishListed = [];
      this.products.forEach(() => {
        this.wishListed.push(false);
        this.wishlisting.push(false);
        this.unwishlisting.push(false);
      });

      if (this.auth && !this.webmaster && res[2]) {
        res[2].forEach((r) => {
          let index = this.products.findIndex((p) => p.productId === r.productId);
          this.wishListed[index] = true;
        });
      }
    });

    // this.sub = this.dservice.productResponseChanged
    //   .pipe(
    //     mergeMap((productResponse) =>
    //       this.authS.User.pipe(
    //         mergeMap((user) =>
    //           this.wlService.WishListChanged.pipe(
    //             map((res) => {
    //               if (productResponse.products) {
    //                 this.products = productResponse.products;
    //                 this.noOfResults = productResponse.totalElements;

    //                 this.pages = [];
    //                 for (let i = 0; i < productResponse.totalPages; i++) this.pages.push(i + 1);
    //                 this.isLast = productResponse.lastPage;
    //                 this.currentPage = productResponse.pageNumber + 1;
    //               }
    //               this.auth = !!user;
    //               if (user) {
    //                 this.webmaster = user.webmaster;
    //                 this.userEmail = user.email;
    //               }
    //               this.wishListed = [];
    //               this.products.forEach(() => {
    //                 this.wishListed.push(false);
    //                 this.wishlisting.push(false);
    //                 this.unwishlisting.push(false);
    //               });

    //               if (this.auth && !this.webmaster && res) {
    //                 res.forEach((r) => {
    //                   let index = this.products.findIndex((p) => p.productId === r.productId);
    //                   this.wishListed[index] = true;
    //                 });
    //               }
    //               return;
    //             })
    //           )
    //         )
    //       )
    //     )
    //   )

    //   .subscribe();

    if (!this.auth) {
      this.introductoryMessage1 = true;
      setTimeout(() => {
        this.introductoryMessage1 = false;
        this.introductoryMessage2 = true;
        setTimeout(() => {
          this.introductoryMessage2 = false;
          this.introductoryMessage3 = true;
          setTimeout(() => {
            this.introductoryMessage3 = false;
            this.loggingIn = true;
            setTimeout(() => {
              this.authS.signIn('user@gmail.com', 'user1234').subscribe(() => {
                this.wlService.getWishList().subscribe(() => {
                  this.loggingIn = false;
                });
              });
            }, 3000);
          }, 4000);
        }, 4000);
      }, 3000);
    }

    this.reactiveForm = new FormGroup({
      searchTerm: new FormControl(null),
    });

    this.reactiveForm
      .get('searchTerm')
      .valueChanges.pipe(
        tap(() => {
          this.searching = true;
        }),
        debounceTime(1500)
      )
      .subscribe((term: string) => {
        this.searchTerm = term.trim();
        this.dservice
          .getProducts(
            1,
            this.searchTerm,
            this.sortBy,
            this.direction,
            this.brandfilter,
            this.categoryfilter
          )
          .subscribe(() => {
            this.searching = false;
            if (this.searchTerm === '') this.usingSearch = false;
            else this.usingSearch = true;
          });
      });

    this.reactiveForm1 = new FormGroup({
      sortby: new FormControl('0'),
    });

    this.reactiveForm1.get('sortby').valueChanges.subscribe((sortBy: string) => {
      console.log(sortBy);
      this.sorting = true;
      switch (+sortBy) {
        case 0:
          this.sortBy = 'productId';
          this.direction = 'asc';
          break;

        case 1:
          this.sortBy = 'price';
          this.direction = 'desc';
          break;

        case 2:
          this.sortBy = 'price';
          this.direction = 'asc';
          break;

        case 3:
          this.sortBy = 'name';
          this.direction = 'asc';
          break;

        case 4:
          this.sortBy = 'name';
          this.direction = 'desc';
          break;
      }
      this.dservice
        .getProducts(
          1,
          this.searchTerm,
          this.sortBy,
          this.direction,
          this.brandfilter,
          this.categoryfilter
        )
        .subscribe(() => {
          this.sorting = false;
        });
    });

    this.rForm = new FormGroup({
      brand1: new FormControl(false),
      brand2: new FormControl(false),
      brand3: new FormControl(false),
      brand4: new FormControl(false),
      brand5: new FormControl(false),
      brand6: new FormControl(false),
      brand7: new FormControl(false),
      brand8: new FormControl(false),
      brand9: new FormControl(false),
    });

    this.rForm.valueChanges.subscribe((brandsboolean) => {
      // console.log(brandsboolean);
      this.filtering = true;

      let i = 0;
      this.brandfilter = [];

      for (const key in brandsboolean) {
        if (brandsboolean.hasOwnProperty(key)) {
          if (brandsboolean[key]) {
            this.brandfilter.push(this.brands[i]);
          }
          i++;
        }
      }

      this.dservice
        .getProducts(
          1,
          this.searchTerm,
          this.sortBy,
          this.direction,
          this.brandfilter,
          this.categoryfilter
        )
        .subscribe(() => {
          this.filtering = false;
          if (!this.brandfilter.length) this.usingFilter1 = false;
          else this.usingFilter1 = true;
        });
    });

    this.rForm1 = new FormGroup({
      category1: new FormControl(false),
      category2: new FormControl(false),
      category3: new FormControl(false),
      category4: new FormControl(false),
      category5: new FormControl(false),
      category6: new FormControl(false),
      category7: new FormControl(false),
      category8: new FormControl(false),
    });

    this.rForm1.valueChanges.subscribe((categoriesboolean) => {
      // console.log(values);
      this.filtering = true;

      let i = 0;
      this.categoryfilter = [];

      for (const key in categoriesboolean) {
        if (categoriesboolean.hasOwnProperty(key)) {
          if (categoriesboolean[key]) {
            this.categoryfilter.push(this.categories[i]);
          }
          i++;
        }
      }

      this.dservice
        .getProducts(
          1,
          this.searchTerm,
          this.sortBy,
          this.direction,
          this.brandfilter,
          this.categoryfilter
        )
        .subscribe(() => {
          this.filtering = false;
          if (!this.categoryfilter.length) this.usingFilter2 = false;
          else this.usingFilter2 = true;
        });
    });
  }

  onDelete(id: number) {
    // console.log(this.products[index]);

    if (confirm('Are you sure you want to delete this product ?'))
      this.dservice.deleteProduct(id).subscribe((response) => {
        if (response === 'Product Deleted') {
          // this.pservice.deleteProduct(id);
          this.dservice
            .getProducts(
              this.currentPage,
              this.searchTerm,
              this.sortBy,
              this.direction,
              this.brandfilter,
              this.categoryfilter
            )
            .subscribe();
        }
      });
  }

  addToCart(p: Product) {
    if (!this.auth) {
      this.router.navigate(['/auth']);
      return;
    }
    this.cservice.addToCart(p, 1);
    this.router.navigate(['/buying/cart']);
  }

  addToWishList(index: number) {
    this.wishlisting[index] = true;
    console.log(this.products[index]);
    this.wlService.addToWishList(this.products[index]).subscribe((res) => {
      if (res === 'Product added to Wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.wishlisting[index] = false;
        });
      }
    });
  }

  removeFromWishList(index: number) {
    this.unwishlisting[index] = true;
    this.wlService.removeFromWishList(this.products[index].productId).subscribe((res) => {
      if (res === 'Product removed from wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.unwishlisting[index] = false;
        });
      }
    });
  }

  goToPage(
    page: number,
    searchTerm: string,
    sortBy: string,
    direction: string,
    brandfilter: any[],
    categoryfilter: any[]
  ) {
    // console.log(page);
    this.pageChange = true;
    this.dservice
      .getProducts(page, searchTerm, sortBy, direction, brandfilter, categoryfilter)
      .subscribe(() => {
        this.pageChange = false;
      });
  }
}

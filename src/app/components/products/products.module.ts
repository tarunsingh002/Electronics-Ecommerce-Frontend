import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductFormComponent} from './product-form/product-form.component';
import {ProductListComponent} from './product-list/product-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ProductsResolverService} from 'src/app/services/products-resolver.service';
import {IsWebmasterGuard} from 'src/app/services/auth-services/is-webmaster.guard';
import {AuthGuard} from 'src/app/services/auth-services/auth.guard';
import {WishlistComponent} from './wishlist/wishlist.component';

import {ProductDetailsResolver} from 'src/app/services/product-details.resolver';
import {WishlistResolver} from 'src/app/services/wishlist.resolver';

const appRoutes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    resolve: [ProductsResolverService],
  },
  {
    path: 'create',
    component: ProductFormComponent,
    canActivate: [AuthGuard, IsWebmasterGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    resolve: [WishlistResolver],
    canActivate: [AuthGuard],
  },
  {
    path: ':index',
    component: ProductDetailComponent,
    resolve: {res: ProductDetailsResolver},
  },
  {
    path: ':index/edit',
    component: ProductFormComponent,
    resolve: [ProductsResolverService],
    canActivate: [AuthGuard, IsWebmasterGuard],
  },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFormComponent,
    WishlistComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(appRoutes)],
})
export class ProductsModule {}

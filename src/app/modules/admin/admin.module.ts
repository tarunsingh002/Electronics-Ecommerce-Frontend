import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AllOrdersComponent } from "./all-orders/all-orders.component";
import { AllWishlistComponent } from "./all-wishlist/all-wishlist.component";
import { RouterModule, Routes } from "@angular/router";
import { IsWebmasterGuard } from "src/app/services/auth-services/is-webmaster.guard";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { AllOrdersResolver } from "src/app/services/all-orders.resolver";
import { AllWishlistsResolver } from "src/app/services/all-wishlists.resolver";
import { OrderDetailResolver } from "src/app/services/order-detail.resolver";

const routes: Routes = [
  {
    path: "allorders",
    component: AllOrdersComponent,
    resolve: { res: AllOrdersResolver },
    canActivate: [IsWebmasterGuard],
  },
  {
    path: "allwishlisted",
    component: AllWishlistComponent,
    resolve: { res: AllWishlistsResolver },
    canActivate: [IsWebmasterGuard],
  },
  {
    path: "orderdetail/:id",
    component: OrderDetailsComponent,
    resolve: { res: OrderDetailResolver },
    canActivate: [IsWebmasterGuard],
  },
];

@NgModule({
  declarations: [
    AllOrdersComponent,
    AllWishlistComponent,
    OrderDetailsComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}

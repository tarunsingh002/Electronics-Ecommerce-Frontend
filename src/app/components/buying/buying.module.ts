import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BuyProductComponent } from "./buy-product/buy-product.component";
import { CartPageComponent } from "./cart-page/cart-page.component";
import { CompleteComponent } from "./complete/complete.component";
import { OrderComponent } from "./order/order.component";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/services/auth-services/auth.guard";
import { ProductsResolverService } from "src/app/services/products-resolver.service";
import { OrderresolverResolver } from "./order/orderresolver.resolver";

const routes: Routes = [
  {
    path: "checkout",
    component: BuyProductComponent,
    resolve: [ProductsResolverService],
    canActivate: [AuthGuard],
  },
  {
    path: "complete",
    component: CompleteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orders",
    component: OrderComponent,
    resolve: { res2: OrderresolverResolver },
    canActivate: [AuthGuard],
  },
  {
    path: "cart",
    component: CartPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    BuyProductComponent,
    CompleteComponent,
    OrderComponent,
    CartPageComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class BuyingModule {}

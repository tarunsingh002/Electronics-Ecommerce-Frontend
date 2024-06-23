import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { SharedModule } from "./components/shared/shared.module";
import { AuthInterceptor } from "./services/auth-services/auth.interceptor";

const routes: Routes = [
  { path: "", redirectTo: "/products", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: () =>
      import("./components/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./components/products/products.module").then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./components/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "buying",
    loadChildren: () =>
      import("./components/buying/buying.module").then((m) => m.BuyingModule),
  },
  {
    path: "miscellaneous",
    loadChildren: () =>
      import("./components/miscellaneous/miscellaneous.module").then(
        (m) => m.MiscellaneousModule
      ),
  },
  {
    path: "**",
    loadChildren: () =>
      import("./components/page-not-found/page-not-found.module").then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

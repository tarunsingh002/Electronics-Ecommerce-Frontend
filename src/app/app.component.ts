import { Component, OnDestroy, OnInit } from "@angular/core";
import { LoadingService } from "./services/loading.service";
import { Subscription } from "rxjs";
import { AuthService } from "./services/auth-services/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { CartPageService } from "./services/cart-page.service";
import { Cart } from "./models/cart.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  auth = false;
  webmaster = false;
  loadingSub: Subscription;
  userSub: Subscription;
  loadedAuthPage: boolean;
  routerSub: Subscription;
  cSub: Subscription;
  items: number;

  constructor(
    private l: LoadingService,
    private authS: AuthService,
    private router: Router,
    private cservice: CartPageService
  ) {}

  ngOnInit() {
    this.authS.autoLogin();
    this.loadingSub = this.l.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    this.userSub = this.authS.User.subscribe((user) => {
      this.auth = !!user;
      if (user) this.webmaster = user.webmaster;
      else this.webmaster = false;
    });

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.loadedAuthPage = this.router.url === "/auth" ? true : false;
    });

    this.cSub = this.cservice.cartChanged.subscribe((c) => {
      if (!c) this.items = 0;
      else
        this.items = c.reduce((t: number, i: Cart) => (t = t + i.quantity), 0);
    });
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.userSub.unsubscribe();
    this.routerSub.unsubscribe();
  }

  onLogin() {
    this.router.navigate(["auth"]);
  }

  onLogout() {
    this.authS.logout();
  }
}

import { Injectable } from "@angular/core";
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth-services/auth.service";
import { AdminService } from "./admin.service";
import { exhaustMap, take } from "rxjs/operators";
import { order } from "./auth-services/user.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: "root",
})
export class OrderDetailResolver implements Resolve<order[]> {
  constructor(
    private authS: AuthService,
    private adminService: AdminService,
    private l: LoadingService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<order[]> {
    this.l.isLoading.next(true);
    return this.authS.User.pipe(
      take(1),
      exhaustMap((user) =>
        this.adminService.loadAllOrders().pipe(
          exhaustMap((res: order[]) => {
            this.l.isLoading.next(false);
            return of(res);
          })
        )
      )
    );
  }
}

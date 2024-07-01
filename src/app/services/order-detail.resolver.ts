import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth-services/auth.service';
import {AdminService} from './admin.service';
import {exhaustMap, map, take} from 'rxjs/operators';
import {order} from './auth-services/user.service';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailResolver implements Resolve<order[]> {
  constructor(
    private authS: AuthService,
    private adminService: AdminService,
    private l: LoadingService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);
    // return this.authS.User.pipe(
    //   take(1),
    //   exhaustMap((user) =>
    return this.adminService.loadAllOrders().pipe(
      map((res: order[]) => {
        this.l.isLoading.next(false);
        return res;
      })
    );
  }
}

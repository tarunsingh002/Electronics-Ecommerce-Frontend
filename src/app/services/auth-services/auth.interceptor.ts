import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authS: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authS.User.pipe(
      take(1),
      // exhaustMap((user) => {
      switchMap((user) => {
        if (!user) return next.handle(request);

        request = request.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${user.token ? user.token : user.refreshToken}`,
          }),
        });

        return next.handle(request);
      })
    );
  }
}

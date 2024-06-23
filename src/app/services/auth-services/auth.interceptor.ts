import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authS: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authS.User.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) return next.handle(request);

        request = request.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${
              user.token ? user.token : user.refreshToken
            }`,
          }),
        });

        return next.handle(request);
      })
    );
  }
}

import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { NbAuthService } from "@nebular/auth";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public auth: NbAuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.auth.getToken().subscribe((token: any) => {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`,
          "auth-token": `${token.token}`,
        },
      });
      return next.handle(request);
    });
    return next.handle(request);
  }
}

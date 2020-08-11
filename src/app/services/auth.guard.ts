import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate() {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      this._router.navigate(["auth/login"]);
      return false;
    }
  }
}

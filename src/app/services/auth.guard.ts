import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate() {
    const token = JSON.parse(localStorage.getItem("auth_app_token")).value;
    console.log(token);
    if (token) {
      return true;
    } else {
      this._router.navigate(["auth/login"]);
      return false;
    }
  }
}

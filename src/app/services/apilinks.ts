import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiLinks {
  baseUrl = "http://18.194.3.90:3000/api";
  login = "/user/login";
  register = "/user/register";
  top100 = "/contentOverview/eachVideoViews";
}

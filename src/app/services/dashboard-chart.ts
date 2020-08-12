import { Injectable } from "@angular/core";
import { ApiLinks } from "./apilinks";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class DashbaordChartService {
  constructor(private _api: ApiLinks, private _http: HttpClient) {}

  getTop100Movies() {
    console.log(`${this._api.baseUrl + this._api.top100}`);
    return this._http.get(`${this._api.baseUrl + this._api.top100}`);
  }
}

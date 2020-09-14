import { Injectable } from "@angular/core";
import { ApiLinks } from "./apilinks";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class DashbaordChartService {
  constructor(private _api: ApiLinks, private _http: HttpClient) {}

  getCustomRangeData(data) {
    return this._http.post(`${this._api.baseUrl + this._api.dateRange}`, data);
  }
  getByTagsName(data) {
    return this._http.post(`${this._api.baseUrl + this._api.byTags}`, data);
  }
  getByPercentage(data) {
    return this._http.post(`${this._api.byPercentage}`, data);
  }
  getByCountries(data) {
    return this._http.post(`${this._api.byCountry}`, data);
  }
  getByCity(data) {
    return this._http.post(`${this._api.byCity}`, data);
  }
  getByPlatform(data) {
    return this._http.post(`${this._api.byPlatform}`, data);
  }
  getAnalyticalViews(data, url) {
    return this._http.post(`${this._api.googleUserViews + url}`, data);
  }
}

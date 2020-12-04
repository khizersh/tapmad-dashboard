import { Injectable } from "@angular/core";
import { ApiLinks } from "./apilinks";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
  getDataByTagName(data) {
    
    let local = JSON.parse( localStorage.getItem('auth_app_token'));
    const httpHeaders: HttpHeaders = new HttpHeaders({
  'auth-token': local.value,
  // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJkN2JmMDI1ZTQwYzUwNTg2NzY2NTEiLCJpYXQiOjE1OTc2NjEwMDR9.CEmA7F0ayrRUAPiIpaI4d5LisGXZZZduA39CVtLwDB8',
  'Content-Type': 'application/json',

    });
    return this._http.post(`${this._api.byTagName}`, JSON.stringify( data) , { headers: httpHeaders });
  }

  getProductHouseFilter() {
    let local = JSON.parse( localStorage.getItem('auth_app_token'));
    const httpHeaders: HttpHeaders = new HttpHeaders({
  'auth-token': local.value,
  // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJkN2JmMDI1ZTQwYzUwNTg2NzY2NTEiLCJpYXQiOjE1OTc2NjEwMDR9.CEmA7F0ayrRUAPiIpaI4d5LisGXZZZduA39CVtLwDB8',
  'Content-Type': 'application/json',

    });
    return this._http.get(this._api.byProductHouse);
  }


} 

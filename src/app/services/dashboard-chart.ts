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
    let local = JSON.parse(localStorage.getItem("auth_app_token"));
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "auth-token": local.value,
      "Content-Type": "application/json",
    });
    return this._http.post(`${this._api.byTagName}`, data);
  }

  getProductHouseFilter() {
    return this._http.get(this._api.byProductHouse);
  }

  getPlaceGrowthSummary(data) {
    return this._http.post(`${this._api.byPlaceGrowth}`, data);
  }

  getChannelList() {
    return this._http.get(`${this._api.channelList}`);
  }

  addChannel(body) {
    return this._http.post(`${this._api.addChannel}`, body);
  }
  getCategorList() {
    return this._http.get(`${this._api.getCategories}`);
  }
  getPlaysByCountry(data) {
    return this._http.post(`${this._api.getPlaysByCountry}`, data);
  }

  getPlaysByProductionHouse(data) {
    return this._http.post(`${this._api.getPlaysByProductionHouse}`, data);
  }
  getUsersAndNewUsers(data) {
    return this._http.post(`${this._api.getUsersAndNewUsers}`, data);
  }

  get25TopContent(data) {
    return this._http.post(`${this._api.getTop25Content}`, data);
  }

  getAvgEngTime(data) {
    return this._http.post(this._api.getAvgEngagedTime, data);
  }
}

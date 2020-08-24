import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiLinks {
  baseUrl = "http://18.194.3.90:3000/api";
  login = "/user/login";
  register = "/user/register";
  content = "/contentOverview";
  dateRange = this.content + "/VideoPlays";
  byTags = this.content + "/PlaysByTag";
  byPercentage = this.baseUrl + this.content + "/percent_completes";
  byCountry = this.baseUrl + this.content + "/CountryWiseViews";
  byCity = this.baseUrl + this.content + "/CityWiseViews";
  byPlatform = this.baseUrl + this.content + "/platformBase";
}
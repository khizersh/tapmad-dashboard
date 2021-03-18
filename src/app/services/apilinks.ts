import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiLinks {
  baseUrl = "http://18.194.3.90:3000/api";
  login = "/user/login";
  register = "/user/register";
  content = "/contentOverview";
  googleAnalytics = "/googleAnalytics";
  dateRange = this.content + "/VideoPlays";
  byTags = this.content + "/PlaysByTag";
  byPercentage = this.baseUrl + this.content + "/percent_completes";
  byCountry = this.baseUrl + this.content + "/CountryWiseViews";
  byCity = this.baseUrl + this.content + "/CityWiseViews";
  byPlatform = this.baseUrl + this.content + "/platformBase";
  byTagName = this.baseUrl + this.content + "/PlaysByTag";
  byProductHouse = this.baseUrl + this.content + "/ProductionHouseFilter";
  googleUserViews = this.baseUrl + this.googleAnalytics;
  byPlaceGrowth = this.baseUrl + this.content + "/PlaysGrowthSummery";
  channelList = this.baseUrl + this.content + "/getChannelFilter";
  addChannel = this.baseUrl + this.content + "/setChannelFilter";
  getCategories = this.baseUrl + this.content + "/getCategoryFilters";
  getPlaysByCountry = this.baseUrl + this.content + "/individualCountryWise";
  getPlaysByProductionHouse =
    this.baseUrl + this.content + "/playsByProductionHouses";
  getUsersAndNewUsers =
    this.baseUrl + this.googleAnalytics + "/NewUsersAndUsers";
  getTop25Content = this.baseUrl + "/contentOverview/UserViews";
  getAvgEngagedTime = this.baseUrl + "/contentOverview/avgEngagementTime";

  getAvgPlays = this.baseUrl + "/contentOverview/TrendLinePlays";
  getAvgSessionDuration =
    this.baseUrl + this.googleAnalytics + "/AvgSessionDuration";
}

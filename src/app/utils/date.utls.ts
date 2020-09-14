import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DateUtils {
  constructor() {}
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  formatDateWithSlash(date) {
    return date.slice(0, 4) + "/" + date.slice(4, 6) + "/" + date.slice(6);
  }
}

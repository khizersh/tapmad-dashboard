import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ProgressInfo,
  StatsProgressBarData,
} from "../../../@core/data/stats-progress-bar";
import { takeWhile } from "rxjs/operators";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

@Component({
  selector: "ngx-progress-section",
  styleUrls: ["./progress-section.component.scss"],
  templateUrl: "./progress-section.component.html",
})
export class ECommerceProgressSectionComponent implements OnDestroy, OnInit {
  private alive = true;

  progressInfoData: ProgressInfo[];
  apiList = [
    { name: "Users", url: "/Users" },
    { name: "New Users", url: "/NewUsers" },
    { name: "Page Views", url: "/Pageviews" },
  ];
  totalValues: any = [
    {
      name: "Users",
      value: 0,
    },
    {
      name: "New Users",
      value: 0,
    },
    {
      name: "Page Views",
      value: 0,
    },
  ];

  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";

  constructor(
    private _utils: DateUtils,
    private _dashboard: DashbaordChartService
  ) {
    // this.statsProgressBarService
    //   .getProgressInfoData()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((data) => {
    //     this.progressInfoData = data;
    //     // console.log("this.progressInfoData: ",this.progressInfoData);
    //   });
  }
  ngOnInit(): void {
    this.progressInfoData = [
      {
        title: "Today’s Profit",
        value: 572900,
        activeProgress: 70,
        description: "Better than last week (70%)",
      },
      {
        title: "New Orders",
        value: 6378,
        activeProgress: 30,
        description: "Better than last week (30%)",
      },
      {
        title: "New Comments",
        value: 200,
        activeProgress: 55,
        description: "Better than last week (55%)",
      },
    ];
    this.loadAllData(7);
  }

  getSelectedPeriod() {
    console.log("selectedTimePeriodList: ", this.selectedTimePeriodList);
    let period = 7,
      date;
    if (this.selectedTimePeriodList == "Last Week") {
      period = 7;
    }
    if (this.selectedTimePeriodList == "Last 30 Days") {
      period = 30;
    }
    if (this.selectedTimePeriodList == "Todays") {
      period = 0;
    }

    this.loadAllData(period);
  }
  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }

  async loadAllData(period: number) {
    let date = this.getDaysByNumber(period);
    for (let api of this.apiList) {
      await this._dashboard
        .getAnalyticalViews(date, api.url)
        .subscribe((res: any) => {
          let sum = 0;
          res.Data.map((data) => {
            sum += +data.value;
          });

          for (let data of this.totalValues) {
            if (api.name == data.name) {
              data.value = sum;
            }
          }
          // this.totalValues.push({ name: api.name, value: sum });
        });
    }
    console.log(" this.totalValues: ", this.totalValues);
  }

  ngOnDestroy() {
    this.alive = true;
  }
}

import { Component, OnInit, ViewChild } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: "ngx-user-pie-chart",
  templateUrl: "./user-pie-chart.component.html",
  styleUrls: ["./user-pie-chart.component.scss"],
})
export class UserPieChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionYesterday: Partial<ChartOptions>;

  constructor(
    private service: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  showChart = false;
  dataArray: [];
  labelsArray: [];

  periodList = ["Last 3 month", "Last month", "Last Week", "Today"];
  periodListToShow = ["last3Month", "lastMonth", "lastWeek", "today"];
  pieChartType = "pie";

  dateList = [];
  ngOnInit(): void {
    let last3Month = this.getDateOfGivenDays(90);
    let lastMonth = this.getDateOfGivenDays(30);
    let lastWeek = this.getDateOfGivenDays(7);
    let today = this.getDateOfGivenDays(0);
    this.dateList.push(last3Month);
    this.dateList.push(lastMonth);
    this.dateList.push(lastWeek);
    this.dateList.push(today);

    this.getAllData(this.dateList).then((res: any) => {
      console.log("Analytics data: ", res);
      this.dataArray = res;
      this.showChart = true;
    });
  }

  getDateOfGivenDays(day: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
    return { start: startDate, end: endDate };
  }

  async getAllData(dateArrayy) {
    let combineArray = [];

    for (var i = 0; i < dateArrayy.length; i++) {
      let obj = {};

      obj = {
        start_date: dateArrayy[i].start,
        end_date: dateArrayy[i].end,
      };

      let array: any = await this.service.getUsersAndNewUsers(obj).toPromise();

      let user = 0,
        newUser = 0;
      for (let j = 0; j < array.Data.User.length; j++) {
        user += array.Data.User[j].value ? +array.Data.User[j].value : 0;
        newUser += array.Data.NewUser[j].value
          ? +array.Data.NewUser[j].value
          : 0;
      }
      combineArray.push({
        series: [user, newUser],
        chart: {
          width: 380,
          type: "pie",
        },
        labels: ["User", "New User"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "top",
              },
            },
          },
        ],
      });
    }

    return combineArray;
  }
}

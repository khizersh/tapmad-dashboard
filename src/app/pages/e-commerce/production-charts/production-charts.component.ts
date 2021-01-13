import { Component, OnInit, ViewChild } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

// import {
//   ApexNonAxisChartSeries,
//   ApexResponsive,
//   ApexChart
// } from "ng-apexcharts";

// export type ChartOptions = {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   labels: any;
// };

@Component({
  selector: "ngx-production-charts",
  templateUrl: "./production-charts.component.html",
  styleUrls: ["./production-charts.component.scss"],
})
export class ProductionChartsComponent implements OnInit {
  // public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartLabels = [];
  public pieChartType = "pie";

  public pieChartDataToday = [120, 150, 180, 90];
  public pieChartDataYesterday = [120, 150, 180, 90];

  constructor(
    private service: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  ngOnInit(): void {
    let date =this.getDateOfGivenDays(1);
    this.loadChart(date);
  }
  // tempData1 = {
  //   start_date: dateArrayy[i],
  //   end_date: dateArrayy[i + 1],
  //   page: 0,
  //   page_length: 100,
  //   reportType: "plays",
  //   data: categoryList,
  // };

  getDateOfGivenDays(day: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
    return { start: startDate, end: endDate };
  }

  async loadChart(date) {
    const data: any = await this.service.getProductHouseFilter().toPromise();
    console.log("data todays: ", data);
    this.pieChartLabels = data.Data;

    let obj = {
      start_date: date.start,
      end_date: date.end,
      page: 0,
      page_length: 100,
      reportType: "plays",
      data: this.pieChartLabels,
    };
    const dataGrowth = await this.service
      .getPlaceGrowthSummary(obj)
      .toPromise();

      console.log("dataGrowth: ",dataGrowth);

  }
}

import { Component, OnInit, ViewChild } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

@Component({
  selector: "ngx-production-charts",
  templateUrl: "./production-charts.component.html",
  styleUrls: ["./production-charts.component.scss"],
})
export class ProductionChartsComponent implements OnInit {
  // public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartLabels = [];
  public pieChartType = "pie";
  chartShowToday = false;
  chartShowYesterday = false;

  phData = [];

  public pieChartDataToday = [];
  public pieChartDataYesterday = [];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  constructor(
    private service: DashbaordChartService,
    private _utils: DateUtils
  ) {
    let today = this.getDateOfGivenDays(0, "normal");
    let yesterday = this.getDateOfGivenDays(1, "yesterday");
    this.service.getProductHouseFilter().subscribe((res: any) => {
      this.phData = res.Data;
      this.loadChart(this.phData, today, "today");
      this.loadChart(this.phData, yesterday, "yesterday");
    });
  }

  ngOnInit(): void {}

  rangeDatesPlay($event, type: string) {
    let date = {
      start: $event.start,
      end: $event.end,
    };
    if (type == "today" || type == "all") {
      this.loadChart(this.phData, date, "today");
    } else if (type == "yesterday" || type == "all") {
      this.loadChart(this.phData, date, "yesterday");
    }
  }
  getDateOfGivenDays(day: number, type) {
    var d = new Date();
    if (type == "yesterday") {
      let endDate = this._utils.formatDate(d.setDate(d.getDate() - 1));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - 1));
      return { start: startDate, end: endDate };
    } else {
      let endDate = this._utils.formatDate(d.setDate(d.getDate()));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
      return { start: startDate, end: endDate };
    }
  }

  async loadChart(phData, date, type: string) {
    let obj = {
      start_date: date.start,
      end_date: date.end,
      page: 0,
      page_length: 100,
      reportType: "plays",
      sortBy: "plays",
      data: phData,
    };
    const res: any = await this.service
      .getPlaysByProductionHouse(obj)
      .toPromise();

    let viewsArray = res.Data.map((m) => (m.plays ? m.plays : 0));
    let PHArray = res.Data.map((m) =>
      m.Category ? m.Category : "not defined"
    );
    this.pieChartLabels = PHArray;
    if (type == "today" || type == "all") {
      this.pieChartDataToday = viewsArray;
      this.chartShowToday = true;
    }
    if (type == "yesterday" || type == "all") {
      this.pieChartDataYesterday = viewsArray;
      this.chartShowYesterday = true;
    }
  }
}

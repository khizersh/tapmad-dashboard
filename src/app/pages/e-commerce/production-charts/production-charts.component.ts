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
  selector: "ngx-production-charts",
  templateUrl: "./production-charts.component.html",
  styleUrls: ["./production-charts.component.scss"],
})
export class ProductionChartsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptionCurrentWeek: Partial<ChartOptions>;
  public chartOptionLastWeek: Partial<ChartOptions>;
  public chartOptionLast90Days: Partial<ChartOptions>;

  public pieChartLabels = [];
  public pieChartType = "pie";
  chartShowCurrentWeek = false;
  chartShowLastWeek = false;
  chartShowLast90Days = false;
  phData = [];
  public pieChartDataCurrentWeek = [];
  public pieChartDataLastWeek = [];
  public pieChartDataLast90Days = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
  };

  chartWidth = 380;

  constructor(
    private service: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  ngOnInit(): void {
    let currentWeek = this.getDateOfGivenDays(7, "currentWeek");
    let lastWeek = this.getDateOfGivenDays(14, "lastWeek");
    let last90Days = this.getDateOfGivenDays(90, "last90Days");

    this.service.getProductHouseFilter().subscribe((res: any) => {
      this.phData = res.Data;
      this.loadChart(this.phData, currentWeek, "currentWeek");
      this.loadChart(this.phData, lastWeek, "lastWeek");
      this.loadChart(this.phData, last90Days, "last90Days");
    });
  }

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
    if (type == "lastWeek") {
      let endDate = this._utils.formatDate(d.setDate(d.getDate() - 14));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - 7));
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
      m.Category ? m.Category.split("_")[1] : "not defined"
    );
    this.pieChartLabels = PHArray;

    if (type == "currentWeek" || type == "all") {
      console.log("current week:");

      this.pieChartDataCurrentWeek = viewsArray;
      this.setOption(
        this.pieChartDataCurrentWeek,
        this.pieChartLabels,
        "currentWeek"
      );
      this.chartShowCurrentWeek = true;
    }
    if (type == "lastWeek" || type == "all") {
      this.pieChartDataLastWeek = viewsArray;
      this.setOption(
        this.pieChartDataLastWeek,
        this.pieChartLabels,
        "lastWeek"
      );
      this.chartShowLastWeek = true;
    }
    if (type == "last90Days" || type == "all") {
      this.pieChartDataLast90Days = viewsArray.map((m) => Math.round(m / 12));

      this.setOption(
        this.pieChartDataLast90Days,
        this.pieChartLabels,
        "last90Days"
      );
      this.chartShowLast90Days = true;
    }
  }

  setOption(data: any, labels: any, type: string) {
    if (type == "currentWeek") {
      this.chartOptionCurrentWeek = {
        series: data,
        chart: {
          width: this.chartWidth,
          type: "pie",
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    }
    if (type == "lastWeek") {
      this.chartOptionLastWeek = {
        series: data,
        chart: {
          width: this.chartWidth,
          type: "pie",
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    }
    if (type == "last90Days") {
      this.chartOptionLast90Days = {
        series: data,
        chart: {
          width: this.chartWidth,
          type: "pie",
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    }
  }
}

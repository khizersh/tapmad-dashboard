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
  selector: "ngx-category-chart",
  templateUrl: "./category-chart.component.html",
  styleUrls: ["./category-chart.component.scss"],
})
export class CategoryChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptionCurrentWeek: Partial<ChartOptions>;
  public chartOptionLastWeek: Partial<ChartOptions>;
  public chartOptionLast90Days: Partial<ChartOptions>;

  public pieChartLabels = [];
  public pieChartType = "pie";
  chartShowCurrentWeek = false;
  chartShowLastWeek = false;
  chartShowLast90Days = false;
  allCategories = [];
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
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  ngOnInit(): void {
    let dateArray = [
      this.getDateOfGivenDays(7, "currentWeek"),
      this.getDateOfGivenDays(14, "lastWeek"),
      this.getDateOfGivenDays(7, "last90Days"),
    ];

    this._dashboard.getCategorList().subscribe((res: any) => {
      this.allCategories = res.Data.map((m) => m.CategoryFiltersName);
      this.loadChart(dateArray, this.allCategories);
    });
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

  async loadChart(dateArray, categoryArray: any) {
    for (let index = 0; index < dateArray.length; index++) {
      let obj = {};
      obj = {
        start_date: dateArray[index].start,
        end_date: dateArray[index].end,
        page: 0,
        page_length: 100,
        reportType: "plays",
        data: categoryArray,
      };

      const res: any = await this._dashboard
        .getPlaceGrowthSummary(obj)
        .toPromise();

      let viewsArray = res.Data.map((m) => (m.plays ? m.plays : 0));
      let categoryLabels = res.Data.map((m) =>
        m.Category ? m.Category.split("_")[1] : "not defined"
      );
      this.pieChartLabels = categoryLabels;

      if (index == 0) {
        this.pieChartDataCurrentWeek = viewsArray;
        this.setOption(
          this.pieChartDataCurrentWeek,
          this.pieChartLabels,
          "currentWeek"
        );
        this.chartShowCurrentWeek = true;
      }
      if (index == 1) {
        this.pieChartDataLastWeek = viewsArray;
        this.setOption(
          this.pieChartDataLastWeek,
          this.pieChartLabels,
          "lastWeek"
        );
        this.chartShowLastWeek = true;
      } else if (index == 2) {
        this.pieChartDataLast90Days = viewsArray.map((m) => Math.round(m / 12));

        this.setOption(
          this.pieChartDataLast90Days,
          this.pieChartLabels,
          "last90Days"
        );
        this.chartShowLast90Days = true;
      }
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

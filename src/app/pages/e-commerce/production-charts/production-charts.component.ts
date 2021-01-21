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
  public chartOptions: Partial<ChartOptions>;
  public chartOptionYesterday: Partial<ChartOptions>;

  public pieChartLabels = [];
  public pieChartType = "pie";
  chartShowToday = false;
  chartShowYesterday = false;
  phData = [];
  public pieChartDataToday = [];
  public pieChartDataYesterday = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
  };

  constructor(
    private service: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  ngOnInit(): void {
    let today = this.getDateOfGivenDays(0, "normal");
    let yesterday = this.getDateOfGivenDays(0, "yesterday");
    console.log("yesterday: ", yesterday);
    console.log("today: ", today);

    this.service.getProductHouseFilter().subscribe((res: any) => {
      this.phData = res.Data;
      this.loadChart(this.phData, yesterday, "yesterday");
      this.loadChart(this.phData, today, "today");
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
    if (type == "yesterday") {
      let endDate = this._utils.formatDate(d.setDate(d.getDate() - 1));
      let startDate = endDate;

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

    if (type == "today" || type == "all") {
      this.pieChartDataToday = viewsArray;
      this.setOption(this.pieChartDataToday, this.pieChartLabels, "today");
      this.chartShowToday = true;
    }
    if (type == "yesterday" || type == "all") {
      this.pieChartDataYesterday = viewsArray;
      this.setOption(
        this.pieChartDataYesterday,
        this.pieChartLabels,
        "yesterday"
      );
      this.chartShowYesterday = true;
    }
  }

  setOption(data: any, labels: any, type: string) {
    if (type === "today") {
      this.chartOptions = {
        series: data,
        chart: {
          width: 380,
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
    } else {
      this.chartOptionYesterday = {
        series: data,
        chart: {
          width: 380,
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

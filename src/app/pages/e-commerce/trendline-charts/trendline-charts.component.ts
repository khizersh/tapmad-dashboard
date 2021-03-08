import { DecimalPipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "ngx-trendline-charts",
  templateUrl: "./trendline-charts.component.html",
  styleUrls: ["./trendline-charts.component.scss"],
})
export class TrendlineChartsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils,
    private _decimalPipe: DecimalPipe
  ) {}
  daysArray = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  avgEngchartShow = false;

  avgEngTime = [];
  // avgEngTime = []
  // avgEngTime = []

  ngOnInit(): void {
    this.initializeArray();
    let currentWeek = this.getDateByNumber(6, "currentWeek");
    let lastWeek = this.getDateByNumber(6, "lastWeek");
    let past90Days = this.getDateByNumber(89, "90");
    let dateArray = [];
    dateArray.push({ ...currentWeek, type: "currentWeek" });
    dateArray.push({ ...lastWeek, type: "lastWeek" });
    dateArray.push({ ...past90Days, type: "past90Days" });

    this.getAvgEngTimeData(dateArray);
  }

  getDateByNumber(day: number, type) {
    var d = new Date();
    if (type == "lastWeek") {
      let sDate = new Date();
      let eDate = new Date();
      let startDate = this._utils.formatDate(
        sDate.setDate(sDate.getDate() - 12)
      );
      let endDate = this._utils.formatDate(eDate.setDate(eDate.getDate() - 6));
      return { start: startDate, end: endDate };
    } else {
      let endDate = this._utils.formatDate(d.setDate(d.getDate()));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
      return { start: startDate, end: endDate };
    }
  }

  async getAvgEngTimeData(date) {
    for (let i = 0; i < date.length; i++) {
      let data = {
        start_date: date[i].start,
        end_date: date[i].end,
        page: 0,
        reportType: "plays",
        sortBy: "plays",
        page_length: 100,
        dimensions: "date",
      };
      const resp: any = await this._dashboard.getAvgEngTime(data).toPromise();
      if (resp.response && resp.response.status == 1) {
        this.daysArray.map((day) => {
          let specificDayArray = resp.Data.filter((f) => f.day == day);
          let sum = 0;
          specificDayArray.map((m) => {
            sum += +m.value;
          });
          if (date[i].type == "past90Days") {
            this.avgEngTime[date[i].type].push((+sum / 12).toFixed(2));
          } else {
            this.avgEngTime[date[i].type].push(+sum.toFixed(2));
          }
        });
      }
    }

    this.setOptions();
    if (this.avgEngTime) {
      this.avgEngchartShow = true;
    }
  }

  initializeArray() {
    ["currentWeek", "lastWeek", "past90Days"].map((m) => {
      this.avgEngTime[m] = new Array();
    });
  }

  setOptions() {
    this.chartOptions = {
      series: [
        {
          name: "Current Week",
          data: this.avgEngTime["currentWeek"],
        },
        {
          name: "Last Week",
          data: this.avgEngTime["lastWeek"],
        },
        {
          name: "Avg week over last 90 days",
          data: this.avgEngTime["past90Days"],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Trendline Average Engaged Time",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "white"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: this.daysArray,
      },
    };
  }
}

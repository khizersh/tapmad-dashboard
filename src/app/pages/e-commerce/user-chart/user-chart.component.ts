import { Component, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import * as moment from "moment";

@Component({
  selector: "ngx-user-chart",
  templateUrl: "./user-chart.component.html",
  styleUrls: ["./user-chart.component.scss"],
})
export class UserChartComponent implements OnInit {
  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  data: any;
  options: any;
  periodList = ["Last Week", "Yesterday", "Today"];
  filteredDate: any;
  themeSubscription: any;

  ngOnInit(): void {
    this.getViewsData(7).then((res) => {
      let dateArray = res.map((m) => m.date);
      let dataArray = res.map((m) => m.value);

      this.loadChartData(dataArray, dateArray);
      console.log("30 days: ", res);
    });
  }

  getDateByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start: startDate, end: endDate };
  }

  async getViewsData(numOfDays: number) {
    let date = this.getDateByNumber(numOfDays);

    let obj = {
      start_date: date.start,
      end_date: date.end,
    };

    let data: any = await this._dashboard
      .getAnalyticalViews(obj, "/Pageviews")
      .toPromise();

    return data.Data;
  }

  loadChartData(data: any, labels: any) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      // if data is on weekly base

      let showArray = [];
      this.periodList.map((r, i) => {
        showArray.push({
          data: data,
          label: r,
          borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        });
      });

      this.data = {
        labels: labels,
        datasets: showArray,
      };

      this.options = {
        maintainAspectRatio: true,
        responsive: true,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || "";
              if (label) {
                label += ": ";
              }
              label += Math.round(tooltipItem.yLabel);
              return label;
            },
          },
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
                userCallback: function (value, index, values) {
                  value = value.toString();
                  value = value.split(/(?=(?:...)*$)/);
                  value = value.join(",");
                  return value;
                },
              },
            },
          ],
        },
      };
    });
  }
}

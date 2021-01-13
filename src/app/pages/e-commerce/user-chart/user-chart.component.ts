import { Component, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import * as moment from "moment";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "ngx-user-chart",
  templateUrl: "./user-chart.component.html",
  styleUrls: ["./user-chart.component.scss"],
})
export class UserChartComponent implements OnInit {
  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils,
    private _decimalPipe: DecimalPipe
  ) {}

  start_date: any;
  end_date: any;
  platformData = [
    {
      icon: "../../../../assets//images//web.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//android.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//apple.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//tv.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
    },
  ];

  data: any;
  options: any;
  periodList = ["Last Week", "Yesterday", "Today"];
  filteredDate: any;
  themeSubscription: any;

  ngOnInit(): void {
    this.getViewsData(7).then((res) => {
      let dateArray = res.map((m) => this._utils.formatDateWithSlash(m.date));
      let dataArray = res.map((m) => m.value);
      this.loadChartData(dataArray, dateArray);
    });

    let date = this.getDateByNumber(7);
    this.start_date = date.start;
    this.end_date = date.end;

      this.loadPlatformData({
        start_date: this.start_date,
        end_date: this.end_date,
      })
  }

  async loadPlatformData(date) {
    const data: any = await this._dashboard.getByPlatform(date).toPromise();

    data.Data.map((plat, i) => {
      this.platformData[i].clicks = this._decimalPipe.transform(
        plat.plays,
        "1.0"
      );
      this.platformData[i].views = this._decimalPipe.transform(
        plat.plays + plat.embeds,
        "1.0"
      );
      this.platformData[i].completes = this._decimalPipe.transform(
        plat.completes,
        "1.0"
      );
      this.platformData[i].timeWatched = this._decimalPipe.transform(
        plat.time_watched,
        "1.0"
      );
    });
  }

  getDateByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start: startDate, end: endDate };
  }

  rangeDatesPlay($event) {
    console.log("Event: ", $event);
    this.start_date = $event.start;
    this.end_date = $event.end;
    this.loadPlatformData({
      start_date: this.start_date,
      end_date: this.end_date,
    });
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

      let customDataArray = {};
      this.periodList.map((m) => {
        customDataArray[m] = new Array();
      });

      data.map((m, i) => {
        customDataArray[this.periodList[0]].push(m);

        if (i == data.length - 2) {
          customDataArray[this.periodList[1]].push(m);
        } else {
          customDataArray[this.periodList[1]].push(0);
        }

        if (i == data.length - 1) {
          customDataArray[this.periodList[2]].push(m);
        } else {
          customDataArray[this.periodList[2]].push(0);
        }
      });

      let showArray = [];
      this.periodList.map((r, i) => {
        showArray.push({
          data: customDataArray[r],
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

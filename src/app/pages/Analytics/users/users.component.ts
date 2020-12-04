import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbColorHelper, NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

@Component({
  selector: "ngx-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  data: any = [
    { data: [] },
    { data: [] },
    { data: [] },
    { data: [] },
    { data: [] },
    { data: [] },
    { data: [] },
    { data: [] },
  ];
  options: any = [
    { options: [] },
    { options: [] },
    { options: [] },
    { options: [] },
    { options: [] },
    { options: [] },
    { options: [] },
    { options: [] },
    ];
  analyticsAPIs = [
    {
      name: "Users Views",
      url: "/Users",
    },
    {
      name: "New User Views",
      url: "/NewUsers",
    },
    {
      name: "Sessions",
      url: "/Sessions",
    },
    {
      name: "Page Views",
      url: "/Pageviews",
    },
    {
      name: "Bounce Rate",
      url: "/BounceRate",
    },
    {
      name: "Average Session Duration",
      url: "/AvgSessionDuration",
    },

  ];
  themeSubscription: any;

  constructor(
    private _dashboard: DashbaordChartService,
    private theme: NbThemeService,
    private _utils: DateUtils
  ) {}

  ngOnInit(): void {
    this.fetchInitialChartData();
  }
  fetchInitialChartData() {
    var i = 0;
    let date = this.getPast30Days();
    console.log(date);
    for (let api of this.analyticsAPIs) {
      this.loadChartData(date, i, api.url);
      i++;
    }
  }

  getPast30Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }
  rangeDates($event, index, url) {
    console.log($event);
    this.loadChartData($event, index, url);
  }

  loadChartData(date, index, url) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this._dashboard
        .getAnalyticalViews(
          {
            start_date: date.start,
            end_date: date.end,
          },
          url
        )
        .subscribe((res: any) => {
          let data = [];
          let labels = [];

          for (let play of res.Data) {
            data.push(play.value);
            labels.push(play.date);
          }
          data = data.map((val) => {
            return Number(val).toFixed(2);
          });
          labels = labels.map((label) => {
            return this._utils.formatDateWithSlash(label);
          });
          this.data[index].data = {
            labels: labels || [
              "2006",
              "2007",
              "2008",
              "2009",
              "2010",
              "2011",
              "2012",
            ],
            datasets: [
              {
                data: data || [65, 59, 80, 81, 56, 55, 40],
                label: "Plays",
                backgroundColor: NbColorHelper.hexToRgbA(
                  colors.primaryLight,
                  0.8
                ),
              },
            ],
          };
          this.options[index].options = {
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return tooltipItem.yLabel
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    });
  }
}

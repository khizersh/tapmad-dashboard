import { Component, OnDestroy } from "@angular/core";
import { NbColorHelper, NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-views-by-tags",
  templateUrl: "./views-by-tags.component.html",
  styleUrls: ["./views-by-tags.component.scss"],
})
export class ViewsByTagsComponent implements OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  date = {
    start: "2020-07-10",
    end: "2020-08-10",
  };
  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService
  ) {
    this.loadChartData(this.date);
  }
  rangeDates($event) {
    this.loadChartData($event);
  }
  loadChartData(date) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this._dashboard
        .getByTagsName({
          start_date: date.start,
          end_date: date.end,
        })
        .subscribe((res: any) => {
          let data = [];
          let labels = [];
          let embeds = [];
          for (let play of res.Data) {
            data.push(play.plays);
            labels.push(play.Category);
            embeds.push(play.embeds);
          }
          this.data = {
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
              {
                data: embeds || [65, 59, 80, 81, 56, 55, 40],
                label: "Embeds",
                backgroundColor: NbColorHelper.hexToRgbA(
                  colors.primaryLight,
                  0.4
                ),
              },
            ],
          };

          this.options = {
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
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

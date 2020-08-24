import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-views-by-platform",
  templateUrl: "./views-by-platform.component.html",
  styleUrls: ["./views-by-platform.component.scss"],
})
export class ViewsByPlatformComponent implements OnDestroy {
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
        .getByPlatform({
          start_date: date.start,
          end_date: date.end,
        })
        .subscribe((res: any) => {
          let data = [];
          let labels = [];
          let embeds = [];
          let completes = [];
          let timeWatched = [];
          for (let play of res.Data) {
            data.push(play.plays);
            labels.push(play.platform);
            embeds.push(play.embeds);
            completes.push(play.completes);
            timeWatched.push(play.time_watched);
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
                  0.6
                ),
              },
              {
                data: completes || [65, 59, 80, 81, 56, 55, 40],
                label: "Completed",
                backgroundColor: NbColorHelper.hexToRgbA(
                  colors.primaryLight,
                  0.4
                ),
              },
              {
                data: timeWatched || [65, 59, 80, 81, 56, 55, 40],
                label: "Times Watched",
                backgroundColor: NbColorHelper.hexToRgbA(
                  colors.primaryLight,
                  0.2
                ),
              },
            ],
          };

          this.options = {
            maintainAspectRatio: false,
            responsive: true,
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

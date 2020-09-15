import { Component, OnInit, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-views-by-country",
  templateUrl: "./views-by-country.component.html",
  styleUrls: ["./views-by-country.component.scss"],
})
export class ViewsByCountryComponent implements OnDestroy {
  CRdata: any;
  CRoptions: any;
  CYdata: any;
  CYoptions: any;
  themeSubscription: any;
  date = {
    start: "2020-07-10",
    end: "2020-08-10",
  };
  currentDate: any = this.date;
  currentPage = 0;
  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService
  ) {
    this.loadChartData(this.date);
    this.loadChartDataCity(this.date, 0);
  }
  rangeDates($event) {
    this.loadChartData($event);
    this.currentDate = $event;
    this.loadChartDataCity($event, 0);
  }
  nextCities() {
    this.loadChartDataCity(this.currentDate, (this.currentPage += 1));
  }
  loadChartData(date) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this._dashboard
        .getByCountries({
          start_date: date.start,
          end_date: date.end,
        })
        .subscribe((res: any) => {
          let data = [];
          let labels = [];
          for (let play of res.Data) {
            data.push(play.plays);
            labels.push(play.CountryCode);
          }
          this.CRdata = {
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

          this.CRoptions = {
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
  loadChartDataCity(date, page) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this._dashboard
        .getByCity({
          start_date: date.start,
          end_date: date.end,
          page: page.toString(),
          page_length: "10",
        })
        .subscribe((res: any) => {
          let data = [];
          let labels = [];
          for (let play of res.Data) {
            data.push(play.plays);
            labels.push(play.CountryCode);
          }
          this.CYdata = {
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

          this.CYoptions = {
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

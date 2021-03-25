import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DateUtils } from "../../utils/date.utls";
import * as moment from "moment";
import { NbThemeService } from "@nebular/theme";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "ngx-views-by-category",
  templateUrl: "./views-by-category.component.html",
  styleUrls: ["./views-by-category.component.scss"],
})
export class ViewsByCategoryComponent implements OnInit {
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils,
    private theme: NbThemeService,
    private _decimalPipe: DecimalPipe
  ) {}

  // Table
  allCategories: [];
  weeklyDataArray: any = {};
  weeklyDate: any = [];
  weeklyDateToShow: any = [];
  weeklyName = "week";
  startDateWeek = null;
  endDateWeek = null;

  // Chart
  themeSubscription: any;
  weeklySelectedList: any = [];
  weeklyChartData: any;
  weeklyChartOption: any;
  weeklyChartDate: any = [];
  last35DaysDate: any = [];

  ngOnInit(): void {
    this._dashboard.getCategorList().subscribe((res: any) => {
      let date = {
        start: null,
        end: null,
      };

      date = this.getDateOfGivenDays(35);
      this.last35DaysDate = this.weeklyDate = this.changeDateToWeek(
        date.start,
        date.end
      );

      this.allCategories = res.Data.map((m) => {
        return m.CategoryFiltersName.split("_")[1];
      });

      this.createTable(this.weeklyDate, this.allCategories);
      this.loadChart(this.allCategories, this.weeklyDate);
    });
  }

  getSelectedCategory() {
    let category = this.weeklySelectedList.map((m) => "Category_" + m);
    this.loadChart(category, this.weeklyChartDate);
  }
  changeDateToWeek(start: any, end: any) {
    var a = moment(start);
    var b = moment(end);
    let diffCountWeek = b.diff(a, "week");

    let dateArrayy = [];

    if (diffCountWeek > 0) {
      for (let i = 0; i < diffCountWeek; i++) {
        let date = a.add(1, "week").calendar();
        let formatDate = date.split("/");
        let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];
        if (i < diffCountWeek - 1) {
          dateArrayy.push(fDate);
        }
      }
      dateArrayy.unshift(start);
      dateArrayy.push(end);

      return dateArrayy;
    }
  }

  rangeDates($event, type: string) {
    if (type === "weekTable") {
      this.weeklyDate = this.changeDateToWeek($event.start, $event.end);
      this.createTable(this.weeklyDate, this.allCategories);
    }
    if (type === "weekChart") {
      this.weeklyChartDate = this.changeDateToWeek($event.start, $event.end);
      this.loadChart(this.weeklySelectedList, this.weeklyChartDate);
    }
  }

  getDateOfGivenDays(day: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
    return { start: startDate, end: endDate };
  }

  changeDateToweek(start: any, end: any) {
    var a = moment(start);
    var b = moment(end);
    let diffCountWeek = b.diff(a, "week");

    let dateArrayy = [];

    if (diffCountWeek > 0) {
      for (let i = 0; i < diffCountWeek; i++) {
        let date = a.add(1, "week").calendar();
        let formatDate = date.split("/");
        let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];
        if (i < diffCountWeek - 1) {
          dateArrayy.push(fDate);
        }
      }
      dateArrayy.unshift(start);
      dateArrayy.push(end);

      return dateArrayy;
    }
  }

  async getAllWeeksData(dateArrayy: [], categoryArray: []) {
    let combineArray = [];
    let categoryList: any = [];

    categoryList = categoryArray;

    for (var i = 0; i < dateArrayy.length - 1; i++) {
      var a = moment(dateArrayy[i]);
      var b = moment(dateArrayy[i + 1]);

      let date = a.add(1, "day").calendar();

      let formatDate = date.split("/");
      let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];

      let tempData1 = {};
      tempData1 = {
        start_date: dateArrayy[i],
        end_date: dateArrayy[i + 1],
        page: 0,
        page_length: 100,
        reportType: "plays",
        data: categoryList,
      };

      let array: any = await this._dashboard
        .getPlaceGrowthSummary(tempData1)
        .toPromise();

      for (let j = 0; j < array.Data.length; j++) {
        let obj = {
          Category: array.Data[j].Category,
          plays: array.Data[j].plays
            ? this._decimalPipe.transform(array.Data[j].plays, "1.0")
            : 0,
          week: i + 1,
        };
        combineArray.push(obj);
      }
    }

    return combineArray;
  }

  createTable(date: [], categoryArray: []) {
    let categoryCompleteArray: any = categoryArray.map((m) => "Category_" + m);
    this.getAllWeeksData(date, categoryCompleteArray).then((res) => {
      this.weeklyDateToShow = [];
      categoryArray.map((r) => (this.weeklyDataArray[r] = new Array()));

      date.map((m, i) => {
        if (i < date.length - 1) {
          this.weeklyDateToShow.push(m);
        }
      });

      for (let play of res) {
        this.weeklyDataArray[play.Category.split("_")[1]].push(play.plays);
      }
    });
  }

  loadChart(selected: any, dateArrayy: []) {
    let categoryCompleteArray: any = selected.map((m) => "Category_" + m);
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      let selectedChannel = categoryCompleteArray;

      let customArray = [];
      let customDate: any = [];

      if (selected.length > 0) {
        selectedChannel = categoryCompleteArray;
      } else {
        selectedChannel = this.allCategories.map((m) => "Category_" + m);
      }

      selectedChannel.map((r) => {
        customArray[r] = [];
      });

      if (dateArrayy.length) {
        customDate = dateArrayy;
      } else {
        customDate = this.last35DaysDate;
      }

      this.getAllWeeksData(customDate, selectedChannel).then((res: any) => {
        for (let play of res) {
          customArray[play.Category].push(play.plays);
        }

        let showArray = [];
        selectedChannel.map((r) => {
          showArray.push({
            data: customArray[r],
            label: r,
            borderColor:
              "#" + Math.floor(Math.random() * 16777215).toString(16),
          });
        });

        this.weeklyChartData = {
          labels: dateArrayy.slice(1, dateArrayy.length),
          datasets: showArray,
        };

        this.weeklyChartOption = {
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || "";
                var arrayData = res[tooltipItem.datasetIndex] || "no found";

                let productHouse = res[tooltipItem.index];

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
    });
  }
}

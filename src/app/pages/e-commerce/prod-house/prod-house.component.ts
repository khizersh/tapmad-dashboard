import { Component, OnInit } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import * as moment from "moment";

@Component({
  selector: "ngx-prod-house",
  templateUrl: "./prod-house.component.html",
  styleUrls: ["./prod-house.component.scss"],
})
export class ProdHouseComponent implements OnInit {
  data: any;
  options: any;
  productionFilter: any = [];
  filteredDate: any;
  themeSubscription: any;

  date = {
    start: "",
    end: "",
  };
  startDate: any;
  endDate: any;
  combineWeekArray: Promise<any[]>;
  customArray = {};

  // Multi select Data start
  name = "Production House";
  nameBar = "Chart Type";
  productionHouseData = [];
  selected = [];

  // time period

  timePeriodList = ["Last Two Week", "Last Month", "Last Two Month"];
  selectedTimePeriod = "Last Two Week";

  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {}
  ngOnInit() {
    let dateObj = this.getDaysByNumber(14);
    this.startDate = dateObj.start;
    this.endDate = dateObj.end;
    //console.log("dateObj: ",dateObj);

    this.filteredDate = this.changeDateToWeek(dateObj.start, dateObj.end);

    //console.log("this.filteredDate: ",this.filteredDate);
    this.loadChartData("", this.selected, this.filteredDate);
  }

  getSelectedValueOfTimePeriod() {
    let period = 7,
      date;
    if (this.selectedTimePeriod === "Last Two Week") {
      period = 14;
    } else if (this.selectedTimePeriod === "Last Month") {
      period = 30;
    } else if (this.selectedTimePeriod === "Last Two Month") {
      period = 60;
    }

    date = this.getDaysByNumber(period);
    this.rangeDates(date);
  }

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start: startDate, end: endDate };
  }
  getSelectedValue() {
    let date = {
      start: this.startDate,
      end: this.endDate,
    };

    this.filteredDate = this.changeDateToWeek(this.startDate, this.endDate);
    this.loadChartData(date, this.selected, this.filteredDate);
  }
  // Multi select Data end

  changeDateToWeek(start: any, end: any) {
    var a = moment(start);
    var b = moment(end);
    let diffCountWeek = b.diff(a, "week");

    let dateArrayy = [],
      formatDate = [];
    if (diffCountWeek > 0) {
      for (let i = 0; i < diffCountWeek; i++) {
        let date = a.add(1, "week").calendar();

        let formatDate = date.split("/");
        let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];
        if (i < diffCountWeek - 1) {
          dateArrayy.push(fDate);
        }
      }
      if (this.startDate && this.endDate) {
        dateArrayy.unshift(this.startDate);
        dateArrayy.push(this.endDate);
      } else {
        dateArrayy.unshift(start);
        dateArrayy.push(end);
      }

      return dateArrayy;
    }
  }

  rangeDates($event) {
    this.startDate = $event.start;
    this.endDate = $event.end;

    let date: any;

    var a = moment(this.startDate);
    var b = moment(this.endDate);
    let diffCountWeek = b.diff(a, "week");
    let diffCountDay = b.diff(a, "day");
    if (diffCountWeek > 0) {
      this.filteredDate = this.changeDateToWeek(this.startDate, this.endDate);
    } else {
      this.filteredDate = [];
      date = {
        start: this.startDate,
        end: this.endDate,
      };
    }

    this.loadChartData(date, this.selected, this.filteredDate);
  }

  getPast30Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }

  lastMonth = this.getPast30Days();

  async getAllWeeksData(dateArrayy: []) {
    let combineArray = [];

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
        data: this.productionFilter,
      };

      let array: any = await this._dashboard
        .getDataByTagName(tempData1)
        .toPromise();

      for (let j = 0; j < array.Data.length; j++) {
        let obj = {
          Category: array.Data[j].Category,
          plays: array.Data[j].plays,
          week: i + 1,
        };
        combineArray.push(obj);
      }
    }

    return combineArray;
  }

  loadChartData(date: any, selected: any, dateArrayy: []) {
    let sDate: any;
    let eDate: any;

    if (date) {
      sDate = date.start;
      eDate = date.end;
    }

    let startDate;
    let endDate;
    if (sDate && eDate) {
      startDate = sDate;
      endDate = eDate;
    } else if (dateArrayy) {
    } else {
      startDate = this.lastMonth.start;
      endDate = this.lastMonth.end;
    }

    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this._dashboard.getProductHouseFilter().subscribe((res: any) => {
        if (selected.length && selected.length > 0) {
          this.productionFilter = selected;
        } else {
          this.productionFilter = res.Data;
        }

        this.productionHouseData = res.Data;

        this.productionFilter.map((r) => {
          this.customArray[r] = new Array();
        });

        // if data is on weekly bases

        this.getAllWeeksData(dateArrayy).then((res) => {
          for (let play of res) {
            this.customArray[play.Category].push(play.plays);
          }

          let showArray = [];
          this.productionFilter.map((r) => {
            showArray.push({
              data: this.customArray[r],
              label: r,
              // borderColor: rgb(Math.floor(Math.random() * 255) , 255 , 1)
              borderColor:
                "#" + Math.floor(Math.random() * 16777215).toString(16),
            });
          });

          this.data = {
            labels: dateArrayy.slice(1, dateArrayy.length),
            datasets: showArray,
          };

          this.options = {
            maintainAspectRatio: true,
            responsive: true,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var label =
                    data.datasets[tooltipItem.datasetIndex].label || "";
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
    });
  }
}

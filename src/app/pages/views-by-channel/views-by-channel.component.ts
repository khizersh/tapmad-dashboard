import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DateUtils } from "../../utils/date.utls";
import * as moment from "moment";
import { NbThemeService } from "@nebular/theme";

@Component({
  selector: "ngx-views-by-channel",
  templateUrl: "./views-by-channel.component.html",
  styleUrls: ["./views-by-channel.component.scss"],
})
export class ViewsByChannelComponent implements OnInit {
  showTable = false;
  page = 0;
  rows = 99;
  data = {};
  themeSubscription: any;

  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils,
    private theme: NbThemeService
  ) {}

  ngOnInit() {
    this._dashboard.getChannelList().subscribe((res1: any) => {
      let channelArray = [];
      res1.Data.map((chan) => {
        channelArray.push(chan.ChannelFilterName);
      });
      this.loadChartData(channelArray, this.weeklyDate, "all");
    });
    this.createTable("all");
  }

  // current date
  source = [];
  settings = {
    actions: { delete: false, edit: false, add: false },
    columns: {
      Category: {
        title: "Channel Name",
        type: "string",
      },
      plays: {
        title: "Plays",
        type: "string",
        filter: false,
      },
    },
  };

  // weekly Table
  weeklyDataArray: any = {};
  weeklyDate: any = [];
  weeklyDateToShow: any = [];
  weeklyName = "week";
  startDateWeek = null;
  endDateWeek = null;

  // Weekly Chart

  weeklyChannelList: any = [];
  weeklySelectedList: any = [];
  startDateWeekChart = null;
  endDateWeekChart = null;
  weeklyChartData: any;
  weeklyChartOption: any;
  customArrayWeek: any = [];

  // Month Table
  MonthDataArray: any = {};
  MonthDate: any = [];
  MonthDateToShow: any = [];

  // Month Chart
  monthlySelectedChannel: [];
  MonthName = "month";
  startDateMonth = null;
  endDateMonth = null;
  customArrayMonth: any = [];
  monthlyChartData: any;
  monthlyChartOption: any;

  dateFormater(today: any) {
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  }

  goToAddChannel(){
    console.log("Change rout");

  }
  getDateOfGivenDays(day: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - day));
    return { start: startDate, end: endDate };
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

  changeDateToMonth(start: any, end: any) {
    var a = moment(start);
    // var b = moment(end);

    let dateArrayy = [];

    for (let i = 0; i < 3; i++) {
      let date = a.add(30, "day").calendar();

      let formatDate = date.split("/");
      let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];

      if (i < 2) {
        dateArrayy.push(fDate);
      } else {
        dateArrayy.push(end);
      }
    }
    dateArrayy.unshift(start);

    return dateArrayy;
  }

  getSelectedValueWeeklyTable() {
    let dateArray: any = this.changeDateToWeek(
      this.startDateWeekChart,
      this.endDateWeekChart
    );
    this.loadChartData(this.weeklySelectedList, dateArray, "weekChart");
  }

  getSelectedChannelMonthly() {
    let date = this.getDateOfGivenDays(90);
    let dateArray: any = this.changeDateToMonth(date.start, date.end);
    this.loadChartData(this.monthlySelectedChannel, dateArray, "monthChart");
  }


  rangeDates($event, type: string) {
    if (type === "today") {
      this.createTable("today");
    }
    if (type === "weekTable") {
      this.startDateWeek = $event.start;
      this.endDateWeek = $event.end;
      this.createTable("weekTable");
    }

    if (type === "weekChart") {
      this.startDateWeekChart = $event.start;
      this.endDateWeekChart = $event.end;
      let dateArray: any = this.changeDateToWeek(
        this.startDateWeekChart,
        this.endDateWeekChart
      );
      this.loadChartData(this.weeklySelectedList, dateArray, "weekChart");
    }
  }
  createTable(type: any) {
    // =================== Today Report ==================
    if (type === "all") {
      let date = new Date();
      let currentDate = this.dateFormater(date);
      let data = {
        start_date: currentDate,
        end_date: currentDate,
        page: 0,
        page_length: 99,
        reportType: "plays",
        data: [],
      };
      this._dashboard.getChannelList().subscribe((res1: any) => {
        let channelArray = [];
        res1.Data.map((chan) => {
          channelArray.push(chan.ChannelFilterName);
        });

        data.data = channelArray;

        this._dashboard.getPlaceGrowthSummary(data).subscribe((res: any) => {
          this.source = res.Data.map(m => {
            if(m.plays === undefined || m.plays === null){
              m.plays = "--"
            }
            return m;
          })
          this.showTable = true;
        });
      });
    }
    // ================================   Week  =======================
    if (type === "weekTable" || type === "all") {
      let date = {
        start: "",
        end: "",
      };
      if (this.startDateWeek && this.endDateWeek) {
        date.start = this.startDateWeek;
        date.end = this.endDateWeek;
      } else {
        date = this.getDateOfGivenDays(35);
      }
      this.weeklyDate = this.changeDateToWeek(date.start, date.end);
      this.weeklyDateToShow = [];
      this.weeklyDate.map((m, i) => {
        if (i < this.weeklyDate.length - 1) {
          this.weeklyDateToShow.push(m);
        }
      });

      this._dashboard.getChannelList().subscribe((res1: any) => {
        let channelArray = [];
        res1.Data.map((chan) => {
          channelArray.push(chan.ChannelFilterName);
          this.weeklyDataArray[chan.ChannelFilterName] = new Array();
        });
        this.weeklyChannelList = channelArray;

        for (let i = 0; i < this.weeklyDate.length - 1; i++) {
          let dataCustom = {};
          if (this.weeklySelectedList.length > 0) {
            dataCustom = {
              start_date: this.weeklyDate[i],
              end_date: this.weeklyDate[i + 1],
              page: 0,
              page_length: 99,
              reportType: "plays",
              data: this.weeklySelectedList,
            };
          } else {
            dataCustom = {
              start_date: this.weeklyDate[i],
              end_date: this.weeklyDate[i + 1],
              page: 0,
              page_length: 99,
              reportType: "plays",
              data: channelArray,
            };
          }

          this._dashboard
            .getPlaceGrowthSummary(dataCustom)
            .subscribe((res: any) => {
              res.Data.map((d) => {
                if (d.plays == undefined || d.plays == null) {
                  d.plays = "--";
                }
                this.weeklyDataArray[d.Category].push({
                  plays: d.plays,
                  week: i,
                });
              });
            });
        }
      });
    }

    // ================================  Month  =====================
    if (type === "all" || type === "monthTable") {
      let last3Month = this.getDateOfGivenDays(90);
      this.MonthDate = this.changeDateToMonth(last3Month.start, last3Month.end);



      this.MonthDate.map((m, i) => {
        if (i < this.MonthDate.length - 1) {
          this.MonthDateToShow.push(m);
        }
      });
      this._dashboard.getChannelList().subscribe((res1: any) => {
        let channels = res1.Data.map((m) => m.ChannelFilterName);
        channels.map((m) => (this.MonthDataArray[m] = new Array()));


        this.getAllWeeksData(this.MonthDate, channels).then((res) => {


          for (let play of res) {
            this.MonthDataArray[play.Category].push(play.plays);
          }

        });
      });
    }
  }

  async getAllWeeksData(dateArrayy: [], channelArray: []) {
    let combineArray = [];
    let channelList: any = [];

    if (channelArray.length > 0) {
      channelList = channelArray;
    } else {
      channelList = this.weeklyChannelList;
    }

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
        data: channelList,
      };

      let array: any = await this._dashboard
        .getPlaceGrowthSummary(tempData1)
        .toPromise();

      for (let j = 0; j < array.Data.length; j++) {
        let obj = {
          Category: array.Data[j].Category,
          plays: array.Data[j].plays ? array.Data[j].plays : 0,
          week: i + 1,
        };
        combineArray.push(obj);
      }
    }

    return combineArray;
  }

  loadChartData(selected: any, dateArrayy: [], type: string) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      let selectedChannel = selected;

      //======================= Weeek  ===================
      if (type === "weekChart" || type === "all") {
        let customArray = [];
        let customDate: any = [];

        if (selected.length > 0) {
          this.customArrayWeek = selected;
        } else {
          this.customArrayWeek = this.weeklyChannelList;
        }

        this.customArrayWeek.map((r) => {
          customArray[r] = new Array();
        });

        if (dateArrayy.length) {
          customDate = dateArrayy;
        } else {
          customDate = this.weeklyDate;
        }

        this.getAllWeeksData(customDate, selectedChannel).then((res: any) => {
          for (let play of res) {
            customArray[play.Category].push(play.plays);
          }

          let showArray = [];
          this.customArrayWeek.map((r) => {
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
      }
      if(type === "monthChart" || type === "all"){

        let last3Month = this.getDateOfGivenDays(90);
        let monthDate : any = this.changeDateToMonth(last3Month.start, last3Month.end);
        let customArray = [];

        if (selected.length > 0) {
          this.customArrayMonth = selected;
        } else {
          this.customArrayMonth = this.weeklyChannelList;
        }

        this.customArrayMonth.map((r) => {
          customArray[r] = new Array();
        });


        this.getAllWeeksData(monthDate, selectedChannel).then((res: any) => {
          for (let play of res) {
            customArray[play.Category].push(play.plays);
          }

          let showArray = [];
          this.customArrayMonth.map((r) => {
            showArray.push({
              data: customArray[r],
              label: r,
              borderColor:
                "#" + Math.floor(Math.random() * 16777215).toString(16),
            });
          });

          this.monthlyChartData = {
            labels: monthDate.slice(1, monthDate.length),
            datasets: showArray,
          };

          this.monthlyChartOption = {
            maintainAspectRatio: false,
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

      }
    });
  }
}
import { Component, OnDestroy } from "@angular/core";
import { NbColorHelper, NbThemeService } from "@nebular/theme";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DateUtils } from "../../utils/date.utls";
import * as moment from "moment";
import { async } from "rxjs/internal/scheduler/async";
import { FORMERR } from "dns";

@Component({
  selector: "ngx-views-by-tags",
  templateUrl: "./views-by-tags.component.html",
  styleUrls: ["./views-by-tags.component.scss"],
})
export class ViewsByTagsComponent implements OnDestroy {
  data: any;
  options: any;
  productionFilter: [];
  filteredDate: any;
  themeSubscription: any;
  date = {
    start: "",
    end: "",
  };
  startDate: any;
  endDate: any;
  combineWeekArray: Promise<any[]>;
  msg = false;

  // Multi select Data start
  name = "Production House";
  nameBar = "Chart Type";
  productionHouseData = [];
  chartStyle = [ "line" , "bar"]
  selected = [];
  chartStyleSelect : any = "line";
  chartType = ""

  getSelectedValueOfChartType(){
    console.log("Chart Type: ", this.chartStyleSelect);

  }

  getSelectedValue() {
    let date = {
      start: this.startDate,
      end: this.endDate,
    };

    this.filteredDate  = this.changeDateToWeek(this.startDate, this.endDate);
    this.loadChartData(date, this.selected, this.filteredDate);
  }
  // Multi select Data end

  constructor(
    private theme: NbThemeService,
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {

    alert("Last month data show as default!")
    let dateObj = this.getPast30Days();
    this.filteredDate = this.changeDateToWeek(dateObj.start , dateObj.end)
    this.loadChartData("", this.selected, this.filteredDate);
  }

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
      if(this.startDate && this.endDate){
        dateArrayy.unshift(this.startDate);
        dateArrayy.push(this.endDate);
      }else {
        dateArrayy.unshift(start);
        dateArrayy.push(end);
      }


      return dateArrayy;
    }
  }

    rangeDates($event) {

    this.msg = false;
    this.startDate = $event.start;
    this.endDate = $event.end;

    let date: any;

    var a = moment(this.startDate);
    var b = moment(this.endDate);
    let diffCountWeek = b.diff(a, "week");
    let diffCountDay = b.diff(a, "day");

    let dateArrayy = [],
      formatDate = [];
    if (diffCountWeek > 0) {
      this.filteredDate = this.changeDateToWeek(this.startDate, this.endDate);

    } else {
      this.filteredDate = []
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

    console.log("Data array: ",dateArrayy );


    for (var i = 0; i < dateArrayy.length - 1; i++) {

      var a = moment(dateArrayy[i]);
    var b = moment(dateArrayy[i + 1]);

    let date = a.add(1, "day").calendar();

    let formatDate = date.split("/");
    let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];

    let tempData1  = {}

    if(!i){
      tempData1 = {
        start_date: dateArrayy[i],
        end_date: dateArrayy[i + 1],
        page: 0,
        page_length: 100,
        data: this.productionFilter,
      };
    }else{
      tempData1 = {
        start_date: fDate,
        end_date: dateArrayy[i + 1],
        page: 0,
        page_length: 100,
        data: this.productionFilter,
      };

    }


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
    // console.log("Combine Array: ", combineArray);

    return combineArray;
  }

  loadChartData(date: any, selected: any, dateArrayy: []) {

    // console.log("Date array: ", dateArrayy);
    // console.log("Date single: ", date);

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

        // if data is on weekly bases
        if (dateArrayy && dateArrayy.length ) {

          this.getAllWeeksData(dateArrayy).then((res) => {

            let data = [];
            let labels = [];
            let array = [];
            for (let play of res) {
              data.push(play.plays);
              labels.push(play.Category.split('_')[1].slice(0,5) );
              array.push(play);
            }
            console.log('Total Array: ',array )
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
                // {
                //   data: embeds || [65, 59, 80, 81, 56, 55, 40],
                //   label: "Weeks",
                //   backgroundColor: NbColorHelper.hexToRgbA(
                //     colors.primaryLight,
                //     0.4
                //   ),
                // },
              ],
            };

            this.options = {
              maintainAspectRatio: false,
              responsive: true,
              tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {


                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
                        var arrayData = res[tooltipItem.datasetIndex] || 'no found';

                        // let productHouse = res.filter(f => f.plays == tooltipItem.yLabel)[0];
                        let productHouse = res[tooltipItem.index]

                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel);
                        return label + " , " + productHouse.Category + " , Week " + productHouse.week;
                    }
                }
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
         // if data is on range basis
        else  {
          this.filteredDate = []

          let tempDataForSingleRange: any;

          if(this.startDate && this.endDate){
            tempDataForSingleRange = {
              start_date: this.startDate,
              end_date: this.endDate,
              page: 0,
              page_length: 100,
              data: this.productionFilter,
            };

          }else {

            tempDataForSingleRange = {
              start_date: this.lastMonth.start,
              end_date: this.lastMonth.end,
              page: 0,
              page_length: 100,
              data: this.productionFilter,
            };
          }


          this._dashboard.getDataByTagName(tempDataForSingleRange).subscribe((res: any) => {
            let data = [];
            let labels = [];
            let embeds = [];
            for (let play of res.Data) {
              data.push(play.plays);
              labels.push(play.Category.split('_')[1].slice(0,5));
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
        }

      });
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

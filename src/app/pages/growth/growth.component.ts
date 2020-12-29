import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DateUtils } from "../../utils/date.utls";
import * as moment from "moment";

@Component({
  selector: "ngx-growth",
  templateUrl: "./growth.component.html",
  styleUrls: ["./growth.component.scss"],
})
export class GrowthComponent implements OnInit {
  productionHouseData = [];
  startDate: any;
  endDate: any;
  selected = [];
  name = "Production House";
  start_date: "2020-09-30";
  end_date: "2020-11-30";
  page: 0;
  reportType: "time_watched";
  page_length: 100;
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  playSumArray = [];
  timeSumArray = [];
  SumArray75 = [];
  uniqueUserSumArray = [];

  playsData: any = [];
  watchTimeData: any = [];
  percentComplete75: any = [];
  uniqueUserData: any = [];

  DateArrayPlay: any = [];
  DateArrayShowPlay: any = [];

  DateArrayTime: any = [];
  DateArrayShowTime: any = [];

  DateArray75: any = [];
  DateArrayShow75: any = [];

  DateArrayUniqueUser: any = [];
  DateArrayShowUniqueUser: any = [];

  ngOnInit(): void {
    this.getProductionHouseData("all");
    let last30Days = this.getPast30Days();

    this.DateArrayUniqueUser = this.DateArray75 = this.DateArrayPlay = this.DateArrayTime = this.changeDateToWeek(
      last30Days.start,
      last30Days.end
    );

    this.createTable(this.DateArrayPlay, "all");
    this.DateArrayPlay.map((m, i) => {
      if (i < this.DateArrayPlay.length - 1) {
        this.DateArrayShowPlay.push(m);
      }
    });
    this.DateArrayTime.map((m, i) => {
      if (i < this.DateArrayTime.length - 1) {
        this.DateArrayShowTime.push(m);
      }
    });
    this.DateArray75.map((m, i) => {
      if (i < this.DateArray75.length - 1) {
        this.DateArrayShow75.push(m);
      }
    });

    this.DateArrayUniqueUser.map((m, i) => {
      if (i < this.DateArrayUniqueUser.length - 1) {
        this.DateArrayShowUniqueUser.push(m);
      }
    });

    console.log("this.playSumArray: ", this.playSumArray);
    // console.log("platy data: ", this.playsData);
    // console.log("watch data: ", this.watchTimeData);
    // console.log("75% data: ", this.percentComplete75);
  }

  summaryRound(current: any, previous: any) {
    // console.log("current: ", current);
    // console.log("previous: ", previous);

    return Math.round(((current - previous) / previous) * 100);
  }

  async mappingTable(dateArray: any, type: any) {
    var ind;
    let sumPlay = 0,
      sumTime = 0,
      sum75 = 0,
      sumUnique = 0;

    for (let i = 0; i < dateArray.length - 1; i++) {
      let index = i;
      if (i == 0) {
        ind = i;
      }

     await this.apiPlaceGrowthSummary(
        this.DateArrayPlay[i],
        this.DateArrayPlay[i + 1],
        "plays",
        this.selected
      ).then((res: any) => {
        res.Data.map((d) => {
          d.Category = d.Category.trim();
          if (
            d.Category &&
            !d.plays &&
            !d.percent_completes_75 &&
            !d.time_watched &&
            !d.unique_viewers
          ) {
            d.plays = "--";
            d.percent_completes_75 = "--";
            d.time_watched = "--";
            d.unique_viewers = "--";
          }

          if (type == "play" || type == "all") {
            this.playsData[d.Category].push({ week: index, report: d.plays });

            if (ind != index) {
              console.log("Week Change: ", sumPlay);
              
              this.playSumArray.push({ report: sumPlay, week: ind });
              ind = index;
              sumPlay = 0;
            }
            else {
              if (typeof sumPlay == "number" && d.plays != "--") {
                sumPlay += d.plays;
                // console.log("Sum: " + sumPlay + " Week: " + index);
                
              }
            }
          }
          if (type == "time" || type == "all") {
            this.watchTimeData[d.Category].push({
              week: index,
              report: d.time_watched,
            });
          }
          if (type == "75" || type == "all") {
            this.percentComplete75[d.Category].push({
              week: index,
              report: d.percent_completes_75,
            });
          }
          if (type == "unique" || type == "all") {
            this.uniqueUserData[d.Category].push({
              week: index,
              report: d.unique_viewers,
            });
          }
        });
      });
    }

    this.playsData["Total"] = this.playSumArray;
    console.log("LOG: ",this.playsData );
    
  }

  compare(a, b) {
    if (a.week < b.week) {
      return -1;
    }
    if (a.week > b.week) {
      return 1;
    }
    return 0;
  }

  createTable(dateArray: any, type: any) {
    this.mappingTable(dateArray, type);
  }

  apiPlaceGrowthSummary(start: any, end: any, type: string, phData: any) {
    let data = [
      "ProductionHouse_Pakistani",
      "ProductionHouse_Religious ",
      "ProductionHouse_Sports ",
      "ProductionHouse_Turner",
      "ProductionHouse_EROS",
      "ProductionHouse_Zee",
      "ProductionHouse_Others",
      "ProductionHouse_Tapmad",
      "ProductionHouse_TapmadOriginals",
      "ProductionHouse_International",
      "ProductionHouse_Cuisine",
      "ProductionHouse_Redbull",
    ];
    let array = [];
    if (phData && phData.length) {
      array = phData;
    } else {
      array = data;
    }
    let obj = {
      start_date: start,
      end_date: end,
      page: 0,
      reportType: type,
      page_length: 100,
      data: array,
    };
    return this._dashboard.getPlaceGrowthSummary(obj).toPromise();
  }

  getPast30Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }

  getProductionHouseData(type: string) {
    this._dashboard.getProductHouseFilter().subscribe((res: any) => {
      this.productionHouseData = res.Data;

    

      this.selected = res.Data;
      this.productionHouseData.map((ph , i) => {
        if (type == "all") {
          this.playsData[ph] = new Array();
          this.watchTimeData[ph] = new Array();
          this.percentComplete75[ph] = new Array();
          this.uniqueUserData[ph] = new Array();
        }
        if (type == "play") {
          this.playsData[ph] = new Array();
          if(i == this.productionHouseData.length-1){
            this.playsData["Total"] = new Array();
          }
        }
        if (type == "time") {
          this.watchTimeData[ph] = new Array();
        }
        if (type == "75") {
          this.percentComplete75[ph] = new Array();
        }
        if (type == "unique") {
          this.uniqueUserData[ph] = new Array();
        }
      });
    });
  }

  rangeDatesPlay($event, type: string) {
    this.startDate = $event.start;
    this.endDate = $event.end;

    if (type == "play") {
      this.DateArrayShowPlay = [];
      this.DateArrayPlay = [];
      this.DateArrayPlay = this.changeDateToWeek($event.start, $event.end);

      this.DateArrayPlay.map((m, i) => {
        if (i < this.DateArrayPlay.length - 1) {
          this.DateArrayShowPlay.push(m);
        }
      });

      this.getProductionHouseData("play");
      this.createTable(this.DateArrayPlay, "play");
    }
    if (type == "time") {
      this.DateArrayShowTime = [];
      this.DateArrayTime = [];
      this.DateArrayTime = this.changeDateToWeek($event.start, $event.end);
      this.DateArrayTime.map((m, i) => {
        if (i < this.DateArrayTime.length - 1) {
          this.DateArrayShowTime.push(m);
        }
      });

      this.getProductionHouseData("time");
      this.createTable(this.DateArrayTime, "time");
    }
    if (type == "75") {
      this.DateArrayShow75 = [];
      this.DateArray75 = [];
      this.DateArray75 = this.changeDateToWeek($event.start, $event.end);
      this.DateArray75.map((m, i) => {
        if (i < this.DateArray75.length - 1) {
          this.DateArrayShow75.push(m);
        }
      });

      this.getProductionHouseData("75");
      this.createTable(this.DateArray75, "75");
    }
    if (type == "unique") {
      this.DateArrayShowUniqueUser = [];
      this.DateArrayUniqueUser = [];
      this.DateArrayUniqueUser = this.changeDateToWeek(
        $event.start,
        $event.end
      );
      this.DateArrayUniqueUser.map((m, i) => {
        if (i < this.DateArrayUniqueUser.length - 1) {
          this.DateArrayShowUniqueUser.push(m);
        }
      });

      this.getProductionHouseData("unique");
      this.createTable(this.DateArrayUniqueUser, "unique");
    }
  }

  getSelectedValue() {
    console.log("selected value..", this.selected);
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
}

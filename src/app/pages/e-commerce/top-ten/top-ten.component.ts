import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

@Component({
  selector: "ngx-top-ten",
  templateUrl: "./top-ten.component.html",
  styleUrls: ["./top-ten.component.scss"],
})
export class TopTenComponent implements OnInit {
  max: Date;
  rows = "25";
  page = "0";
  startDate = "2020-08-02";
  endDate = "2020-08-18";
  showTable = false;
  data = {};

  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";
  source = [];
  settings = {
    pager: {
      display: true,
      perPage: 5,
    },
    actions: { delete: false, edit: false, add: false },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      serial: {
        title: "S#",
        type: "string",
        filter: false,
      },
      MediaTitle: {
        title: "Media Title",
        type: "string",
        filter: false,
      },
      viewsCurrent: {
        title: "Today Views",
        type: "string",
        filter: false,
      },
      // todayClicks: {
      //   title: "Today Clicks",
      //   type: "string",
      //   filter: false,
      // },
      viewYesterday: {
        title: "Yesterday Views",
        type: "string",
        filter: false,
      },
      // yesterdayClicks: {
      //   title: "Yesterday Clicks",
      //   type: "string",
      //   filter: false,
      // },
      viewsWeek: {
        title: "Week ago Views",
        type: "string",
        filter: false,
      },
      viewPercent: {
        title: "viewership Percentage",
        type: "string",
        filter: false,
      },
    },
  };

  constructor(
    private _dashboard: DashbaordChartService,
    private _decimalPipe: DecimalPipe,
    private _utils: DateUtils
  ) {}

  ngOnInit() {
    this.getTopContentData();
  }

  // rangeDates($event) {
  //   this.startDate = $event.start;
  //   this.endDate = $event.end;
  // }

  // getSelectedPeriod() {
  //   let period = 7,
  //     date;
  //   if (this.selectedTimePeriodList === "Last Week") {
  //     period = 7;
  //   } else if (this.selectedTimePeriodList === "Last 30 Days") {
  //     period = 30;
  //   }
  //   if (this.selectedTimePeriodList === "Todays") {
  //     period = 0;
  //   }
  //   // date = this.getDaysByNumber(period);
  // }

  async getTopContentData() {
    let data = {
      start_date: "2021-1-17",
      end_date: "2021-1-17",
      page: "0",
      page_length: "25",
    };
    const res: any = await this._dashboard.get25TopContent(data).toPromise();

    this.source = res.Data.map((m, i) => {
      let sum = m.viewsCurrent + m.viewYesterday + m.viewsWeek;
      m.viewPercent = Math.round((sum / m.viewThreesMonthly) * 100) + "%";

      m.serial = i + 1;
      m.viewMonth = this._decimalPipe.transform(m.viewMonth, "1.0");
      m.viewsWeek = this._decimalPipe.transform(m.viewsWeek, "1.0");
      m.viewYesterday = this._decimalPipe.transform(m.viewYesterday, "1.0");
      m.viewsCurrent = this._decimalPipe.transform(m.viewsCurrent, "1.0");

      return m;
    });
    if (this.source.length) {
      this.showTable = true;
    }
  }
  // async getAllData(date) {
  //   let customData = [],
  //     customDataLength = [],
  //     finalData = [];

  //   for (var i = 0; i < date.length; i++) {
  //     let index = i;
  //     let data = {
  //       start_date: date[i].startDate,
  //       end_date: date[i].endDate,
  //       page: this.page,
  //       page_length: this.rows,
  //     };

  //     let array: any = await this._dashboard
  //       .getCustomRangeData(data)
  //       .toPromise();

  //     customData.push(array.Data);
  //     customDataLength.push(array?.Data?.length);
  //   }

  //   let maxLength = Math.max(...customDataLength);

  //   for (let index = 0; index < maxLength; index++) {
  //     finalData.push({
  //       serial: index + 1,
  //       mediaId: "",
  //       mediaTitle: "",
  //       todayViews: 0,
  //       todayClicks: 0,
  //       yesterdayViews: 0,
  //       yesterdayClicks: 0,
  //       weekViews: 0,
  //       weekClicks: 0,
  //       viewPercent: 0,
  //     });
  //   }

  //   for (let i = 0; i < customData.length; i++) {
  //     let index = i;
  //     for (let j = 0; j < customData[i].length; j++) {
  //       let obj = {
  //         mediaId: customData[i][j]?.MediaId,
  //         mediaTitle: customData[i][j]?.MediaTitle
  //           ? customData[i][j]?.MediaTitle
  //           : "",
  //         plays: customData[i][j]?.plays ? customData[i][j]?.plays : 0,
  //         embeds: customData[i][j]?.embeds ? customData[i][j]?.embeds : 0,
  //         // totalViews: customData[i][j]?.play_Embeds
  //         //   ? customData[i][j]?.play_Embeds
  //         //   : 0,
  //       };

  //       if (index == 0) {
  //         finalData[j]["mediaId"] = obj.mediaId;
  //         finalData[j]["mediaTitle"] = obj.mediaTitle;
  //         finalData[j]["weekViews"] = this._decimalPipe.transform(
  //           obj.plays + obj.embeds,
  //           "1.0"
  //         );
  //         finalData[j]["weekClicks"] = this._decimalPipe.transform(
  //           obj.plays,
  //           "1.0"
  //         );
  //         // finalData[j]["totalViews"] = obj.totalViews;
  //       } else if (index == 1) {
  //         let indexOfExisting = finalData.indexOf(
  //           finalData.filter((f) => f.mediaId === obj.mediaId)[0]
  //         );
  //         if (indexOfExisting == -1) {
  //           finalData[j]["mediaId"] = obj.mediaId;
  //           finalData[j]["mediaTitle"] = obj.mediaTitle;
  //           finalData[j]["yesterdayViews"] = this._decimalPipe.transform(
  //             obj.plays + obj.embeds,
  //             "1.0"
  //           );
  //           finalData[j]["yesterdayClicks"] = this._decimalPipe.transform(
  //             obj.plays,
  //             "1.0"
  //           );
  //         } else {
  //           finalData[indexOfExisting]["mediaTitle"] = obj.mediaTitle;
  //           finalData[indexOfExisting][
  //             "yesterdayViews"
  //           ] = this._decimalPipe.transform(obj.plays + obj.embeds, "1.0");
  //           finalData[indexOfExisting][
  //             "yesterdayClicks"
  //           ] = this._decimalPipe.transform(obj.plays, "1.0");
  //         }
  //         // finalData[j]["totalViews"] = obj.totalViews;
  //       } else if (index == 2) {
  //         let indexOfExisting = finalData.indexOf(
  //           finalData.filter((f) => f.mediaId === obj.mediaId)[0]
  //         );
  //         if (indexOfExisting == -1) {
  //           finalData[j]["mediaId"] = obj.mediaId;
  //           finalData[j]["mediaTitle"] = obj.mediaTitle;
  //           finalData[j]["todayViews"] = this._decimalPipe.transform(
  //             obj.plays + obj.embeds,
  //             "1.0"
  //           );
  //           finalData[j]["todayClicks"] = this._decimalPipe.transform(
  //             obj.plays,
  //             "1.0"
  //           );
  //         } else {
  //           finalData[indexOfExisting]["mediaTitle"] = obj.mediaTitle;
  //           finalData[indexOfExisting][
  //             "todayViews"
  //           ] = this._decimalPipe.transform(obj.plays + obj.embeds, "1.0");
  //           finalData[indexOfExisting][
  //             "todayClicks"
  //           ] = this._decimalPipe.transform(obj.plays, "1.0");
  //         }
  //         // finalData[j]["totalViews"] = obj.totalViews;
  //       }
  //     }
  //   }

  //   const res = await this.getLastThreeMonthData();

  //   // console.log("Response res: ", res);

  //   for (let index = 0; index < finalData.length; index++) {
  //     let obj1 = res.filter((f) => f.MediaId === finalData[index].mediaId)[0];
  //     if (obj1) {
  //       let sum =
  //         +finalData[index].todayViews.toString().split(",").join("") +
  //         +finalData[index].yesterdayViews.toString().split(",").join("") +
  //         +finalData[index].weekViews.toString().split(",").join("");
  //       let total = obj1.plays + obj1.embeds;
  //       finalData[index].viewPercent = Math.round((sum / total) * 100) + "%";
  //     }
  //     //  console.log("final array: ", finalData[index].totalViews);
  //   }

  //   return finalData;
  // }

  // async loadTable(array) {
  //   this.getAllData(array).then((res) => {
  //     this.source = res;
  //     this.showTable = true;
  //     console.log("Response in load data: ", res);
  //   });
  // }

  // async getLastThreeMonthData() {
  //   let date = this.getDaysByNumber(80, "");

  //   let data = {
  //     start_date: date.startDate,
  //     end_date: date.endDate,
  //     page: this.page,
  //     page_length: this.rows,
  //   };

  //   let array: any = await this._dashboard.getCustomRangeData(data).toPromise();

  //   return array.Data;
  // }
}

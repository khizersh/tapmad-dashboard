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
  rows = "10";
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
      mediaTitle: {
        title: "Media Title",
        type: "string",
        filter: false,
      },
      // play_rate: {
      //   title: "Play Rate",
      //   type: "string",
      //   filter: false,
      // },
      todayViews: {
        title: "Today Views",
        type: "string",
        filter: false,
      },
      todayClicks: {
        title: "Today Clicks",
        type: "string",
        filter: false,
      },
      yesterdayViews: {
        title: "Yesterday Views",
        type: "string",
        filter: false,
      },
      yesterdayClicks: {
        title: "Yesterday Clicks",
        type: "string",
        filter: false,
      },
      weekViews: {
        title: "Week ago Views",
        type: "string",
        filter: false,
      },
      weekClicks: {
        title: "Week ago Clicks",
        type: "string",
        filter: false,
      },
      // time_watched: {
      //   title: "Total Views",
      //   type: "string",
      //   filter: false,
      //   valuePrepareFunction: (value) => {
      //     return this._decimalPipe.transform(value, "1.0");
      //   },
      // },
    },
  };

  constructor(
    private _dashboard: DashbaordChartService,
    private _decimalPipe: DecimalPipe,
    private _utils: DateUtils
  ) {}

  ngOnInit() {
    let dateArray = [];
    let week = this.getDaysByNumber(7, "");
    let yesterday = this.getDaysByNumber(1, "yesterday");
    let today = this.getDaysByNumber(0, "");
    dateArray.push(week);
    dateArray.push(yesterday);
    dateArray.push(today);

    this.loadTable(dateArray);
  }

  getDaysByNumber(num: number, type) {
    var d = new Date();
    if (type) {
      let endDate = this._utils.formatDate(d.setDate(d.getDate() - 1));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - 1));
      return { startDate: startDate, endDate: endDate };
    } else {
      let endDate = this._utils.formatDate(d.setDate(d.getDate()));
      let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
      return { startDate: startDate, endDate: endDate };
    }
  }
  rangeDates($event) {
    this.startDate = $event.start;
    this.endDate = $event.end;
  }

  getSelectedPeriod() {
    let period = 7,
      date;
    if (this.selectedTimePeriodList === "Last Week") {
      period = 7;
    } else if (this.selectedTimePeriodList === "Last 30 Days") {
      period = 30;
    }
    if (this.selectedTimePeriodList === "Todays") {
      period = 0;
    }
    // date = this.getDaysByNumber(period);
  }

  async getAllWeeksData(date) {
    let customData = [];

    for (var i = 0; i < date.length; i++) {
      let index = i;
      let data = {
        start_date: date[i].startDate,
        end_date: date[i].endDate,
        page: this.page,
        page_length: this.rows,
      };

      let array: any = await this._dashboard
        .getCustomRangeData(data)
        .toPromise();

      console.log("API: ", array.Data);
      for (let j = 0; j < array.Data.length; j++) {
        let serial = j + 1;
        if (index === 0) {
          customData.push({
            serial: serial++,
            mediaTitle: array.Data[j].MediaTitle,
            todayViews: 0,
            todayClicks: 0,
            yesterdayViews: 0,
            yesterdayClicks: 0,
            weekViews: array.Data[j].plays + array.Data[j].embeds,
            weekClicks: array.Data[j].plays,
          });
        } else if (index == 1) {
          customData[j]["yesterdayViews"] =
            array.Data[j].plays + array.Data[j].embeds;
          customData[j]["yesterdayClicks"] = array.Data[j].plays;
        } else if (index == 2) {
          customData[j]["todayViews"] =
            array.Data[j].plays + array.Data[j].embeds;
          customData[j]["todayClicks"] = array.Data[j].plays;
        }
      }
      console.log("customData: ", customData);
    }

    // console.log("customData: ", customData);

    return customData;
  }
  async loadTable(array) {
    this.getAllWeeksData(array).then((res) => {
      this.source = res;
      this.showTable = true;
      console.log("Response in load data: ", res);
    });
  }
}

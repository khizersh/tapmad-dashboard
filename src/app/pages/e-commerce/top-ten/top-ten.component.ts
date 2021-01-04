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

  constructor(
    private _dashboard: DashbaordChartService,
    private _decimalPipe: DecimalPipe,
    private _utils: DateUtils
  ) {}

  ngOnInit() {
    let date = this.getDaysByNumber(7);
    this.getCustomChartData(date);
  }
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
      MediaTitle: {
        title: "Movies Name",
        type: "string",
        filter: false,
      },
      // play_rate: {
      //   title: "Play Rate",
      //   type: "string",
      //   filter: false,
      // },
      plays: {
        title: "Plays",
        type: "string",
        filter: false,
      },
      embeds: {
        title: "Embeds",
        type: "string",
        filter: false,
      },
      // completes: {
      //   title: "Completes",
      //   type: "string",
      //   filter: false,
      // },
      time_watched: {
        title: "Total Views",
        type: "string",
        filter: false,
        valuePrepareFunction: (value) => {
          return this._decimalPipe.transform(value, "1.0");
        },
      },
    },
  };

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { startDate: startDate, endDate: endDate };
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
    date = this.getDaysByNumber(period);
    this.getCustomChartData(date);
  }
  getCustomChartData(date) {
    let data = {
      start_date: date.startDate,
      end_date: date.endDate,
      page: this.page,
      page_length: this.rows,
    };
    this._dashboard.getCustomRangeData(data).subscribe((res: any) => {
      console.log("data: ", res.Data);

      this.source = res.Data;
      this.showTable = true;
    });
  }
}

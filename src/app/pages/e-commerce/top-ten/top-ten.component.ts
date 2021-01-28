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
      viewYesterday: {
        title: "Yesterday Views",
        type: "string",
        filter: false,
      },
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
}

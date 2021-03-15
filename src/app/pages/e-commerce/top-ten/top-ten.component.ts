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

  timePeriodList = ["Current Week", "Last Week", "Todays"];
  selectedTimePeriodList = "Last Week";
  source = [];
  settings = {
    pager: {
      display: true,
      perPage: 10,
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
      currentWeek: {
        title: "Current Week Views",
        type: "string",
        filter: false,
      },
      lastWeek: {
        title: "Last Week Views",
        type: "string",
        filter: false,
      },
      threeMonths: {
        title: "Weekly Average, of 90 days",
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

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }

  async getTopContentData() {
    let date = this.getDaysByNumber(89);

    let data = {
      start_date: date.start_date,
      end_date: date.end_date,
      page: 0,
      page_length: 25,
    };
    const res: any = await this._dashboard.get25TopContent(data).toPromise();

    let array = res.Data.map((m) => {
      if (m) {
        return m;
      }
    });
    //sort array descending order
    array.sort(function (a, b) {
      return b.currentWeek - a.currentWeek;
    });
    this.source = array.map((m, i) => {
      if (m) {
        let sum = m.currentWeek + m.lastWeek + m.threeMonths / 12;
        m.viewPercent = ((m.currentWeek / sum) * 100).toFixed(1) + "%";
        m.serial = i + 1;
        m.currentWeek = this._decimalPipe.transform(m.currentWeek, "1.0");
        m.lastWeek = this._decimalPipe.transform(m.lastWeek, "1.0");
        m.threeMonths = this._decimalPipe.transform(
          (m.threeMonths / 12).toFixed(1),
          "1.0"
        );

        return m;
      }
    });

    if (this.source.length) {
      this.showTable = true;
    }
  }
}

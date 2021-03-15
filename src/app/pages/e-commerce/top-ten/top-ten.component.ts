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
      viewsWeek: {
        title: "Current Week Views",
        type: "string",
        filter: false,
      },
      viewLastWeek: {
        title: "Last Week Views",
        type: "string",
        filter: false,
      },
      viewThreeMonth: {
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

    console.log("res in top: ", res);

    let array = res.Data.map((m) => {
      if (m) {
        return m;
      }
    });
    // descending order
    array.sort(function (a, b) {
      return b.viewsWeek - a.viewsWeek;
    });
    this.source = array.map((m, i) => {
      if (m) {
        let sum = m.viewsWeek + m.viewLastWeek + m.viewThreeMonth / 12;
        m.viewPercent = Math.round((m.viewsWeek / sum) * 100) + "%";
        m.serial = i + 1;
        m.viewsWeek = this._decimalPipe.transform(m.viewsWeek, "1.0");
        m.viewLastWeek = this._decimalPipe.transform(m.viewLastWeek, "1.0");
        m.viewThreeMonth = this._decimalPipe.transform(
          (m.viewThreeMonth / 12).toFixed(1),
          "1.0"
        );

        return m;
      }
    });

    console.log("this.source: ", this.source);

    if (this.source.length) {
      this.showTable = true;
    }
  }
}

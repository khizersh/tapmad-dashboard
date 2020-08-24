import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-views-by-percentage",
  templateUrl: "./views-by-percentage.component.html",
  styleUrls: ["./views-by-percentage.component.scss"],
})
export class ViewsByPercentageComponent implements OnInit {
  max: Date;
  rows = "99";
  page = "1";
  startDate = "2020-08-02";
  endDate = "2020-08-18";
  showTable = false;
  data = {};

  constructor(private _dashboard: DashbaordChartService) {}

  ngOnInit() {
    this.getCustomChartData();
  }
  source = [];
  settings = {
    actions: { delete: false, edit: false, add: false },
    columns: {
      MediaTitle: {
        title: "Movies Name",
        type: "string",
      },
      Totalviews_25: {
        title: "25%",
        type: "string",
        filter: false,
      },
      Totalviews_50: {
        title: "50%",
        type: "string",
        filter: false,
      },
      Totalviews_75: {
        title: "75%",
        type: "string",
        filter: false,
      },
      Total_complete_rate: {
        title: "Complete Rate",
        type: "string",
        filter: false,
      },
    },
  };
  rangeDates($event) {
    this.startDate = $event.start;
    this.endDate = $event.end;
  }
  getCustomChartData() {
    let data = {
      start_date: this.startDate,
      end_date: this.endDate,
      page: this.page,
      page_length: this.rows,
    };
    this._dashboard.getByPercentage(data).subscribe((res: any) => {
      this.source = res.Data;
      this.showTable = true;
    });
  }
}

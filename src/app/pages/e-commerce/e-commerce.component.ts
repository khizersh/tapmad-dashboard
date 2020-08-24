import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-ecommerce",
  templateUrl: "./e-commerce.component.html",
})
export class ECommerceComponent implements OnInit {
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
      },
      play_rate: {
        title: "Play Rate",
        type: "string",
        filter: false,
      },
      plays: {
        title: "Total Plays",
        type: "string",
        filter: false,
      },
      embeds: {
        title: "Embeds",
        type: "string",
        filter: false,
      },
      completes: {
        title: "Completes",
        type: "string",
        filter: false,
      },
      time_watched: {
        title: "Total Views",
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
    this._dashboard.getCustomRangeData(data).subscribe((res: any) => {
      this.source = res.Data;
      this.showTable = true;
    });
  }
}

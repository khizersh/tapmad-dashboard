import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";

@Component({
  selector: "ngx-ecommerce",
  templateUrl: "./e-commerce.component.html",
})
export class ECommerceComponent implements OnInit {
  constructor(private _dashboard: DashbaordChartService) {}

  ngOnInit() {
    this.getChartData();
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
      VideoOnDemandTitle: {
        title: "Movies Name",
        type: "string",
      },
      TotalViews: {
        title: "Total Views",
        type: "string",
        filter: false,
      },
    },
  };

  getChartData() {
    this._dashboard.getTop100Movies().subscribe((res: any) => {
      this.source = res.Data;
      console.log(this.source);
    });
  }
}

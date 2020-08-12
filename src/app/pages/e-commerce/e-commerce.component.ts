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

  getChartData() {
    this._dashboard.getTop100Movies().subscribe((res) => {
      console.log(res);
    });
  }
}

import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DecimalPipe } from "@angular/common";

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

  constructor(
    private _dashboard: DashbaordChartService,
    private _decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {}
}

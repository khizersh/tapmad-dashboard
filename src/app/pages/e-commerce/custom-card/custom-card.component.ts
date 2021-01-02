import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";

@Component({
  selector: "ngx-custom-card",
  templateUrl: "./custom-card.component.html",
  styleUrls: ["./custom-card.component.scss"],
})
export class CustomCardComponent implements OnInit {
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {}

  data = [];
  imageArray = [
    "../../../../assets//images//web.png",
    "../../../../assets//images//android.png",
    "../../../../assets//images//apple.png",
    "../../../../assets//images//question.png",
  ];

  ngOnInit(): void {
    this.loadData();
  }

  getLast7Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }
  loadData() {
    let date = this.getLast7Days();
    this._dashboard
      .getByPlatform({
        start_date: date.start,
        end_date: date.end,
      })
      .subscribe((res: any) => {

        for (let i = 0; i < res.Data.length; i++) {

          this.data.push({
            icon: this.imageArray[i],
            plays: res.Data[i].plays,
            embeds: res.Data[i].embeds,
            completes: res.Data[i].completes,
            timeWatched: res.Data[i].time_watched,
          });
        }
        console.log("data: ", this.data);

      });
  }
}

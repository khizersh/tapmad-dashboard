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

  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";

  ngOnInit(): void {
    let date = this.getDaysByNumber(7);
    this.loadData(date);
  }

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }
  loadData(date) {
    this.data = []
    this._dashboard.getByPlatform(date).subscribe((res: any) => {
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

  getSelectedPeriod() {
    let period = 7,
      date;
    if (this.selectedTimePeriodList === "Last Week") {
      period = 7;
    } else if (this.selectedTimePeriodList === "Last 30 Days") {
      period = 30;
    } else if (this.selectedTimePeriodList === "Todays") {
      period = 0;
    }
    date = this.getDaysByNumber(period);
    this.loadData(date);
  }
}

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

  data = [
    {
      icon: "../../../../assets//images//web.png",
      plays: "",
      embeds: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//android.png",
      plays: "",
      embeds: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//apple.png",
      plays: "",
      embeds: "",
      completes: "",
      timeWatched: "",
    },
    {
      icon: "../../../../assets//images//question.png",
      plays: "",
      embeds: "",
      completes: "",
      timeWatched: "",
    },
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
    this._dashboard.getByPlatform(date).subscribe((res: any) => {
      for (let i = 0; i < res.Data.length; i++) {
        this.data[i].plays = res.Data[i].plays;
        this.data[i].embeds = res.Data[i].embeds;
        this.data[i].completes = res.Data[i].completes;
        this.data[i].timeWatched = res.Data[i].time_watched;
      }
      // console.log("data: ", this.data);
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

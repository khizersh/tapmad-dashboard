import { DecimalPipe } from "@angular/common";
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
    private _utils: DateUtils,
    private _decimalPipe: DecimalPipe
  ) {}

  totalData = [
    {
      clicks: null,
      views: null,
      completes: null,
      timeWatched: null,
    },
    {
      clicks: null,
      views: null,
      completes: null,
      timeWatched: null,
    },
  ];

  CurrentWeek = [
    {
      icon: "../../../../assets//images//web.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
      name: "Web",
    },
    {
      icon: "../../../../assets//images//android.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
      name: "Android",
    },
    {
      icon: "../../../../assets//images//apple.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
      name: "IOS",
    },
    {
      icon: "../../../../assets//images//tv.png",
      clicks: "",
      views: "",
      completes: "",
      timeWatched: "",
      name: "TV",
    },
  ];
  LastWeek = [
    {
      icon: "../../../../assets//images//web.png",
      clicks: null,
      views: null,
      completes: null,
      timeWatched: null,
    },
    {
      icon: "../../../../assets//images//android.png",
      clicks: null,
      views: null,
      completes: null,
      timeWatched: null,
    },
    {
      icon: "../../../../assets//images//apple.png",
      plays: null,
      embeds: null,
      completes: null,
      timeWatched: null,
    },
    {
      icon: "../../../../assets//images//tv.png",
      clicks: null,
      views: null,
      completes: null,
      timeWatched: null,
    },
  ];

  weekList = ["Current Week", "Last Week"];
  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";

  ngOnInit(): void {
    this.loadData(this.getDaysByNumber(7), 14).then((res) => {
      this.loadTotalData(this.getDaysByNumber(14));
    });
  }

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }

  async loadData(dateCurrentWeek, LastWeek: number) {
    // current Week
    const data: any = await this._dashboard
      .getByPlatform(dateCurrentWeek)
      .toPromise();
    for (let i = 0; i < data.Data.length; i++) {
      (this.CurrentWeek[i].clicks = this._decimalPipe.transform(
        data.Data[i].plays,
        "1.0"
      )),
        (this.CurrentWeek[i].views = this._decimalPipe.transform(
          data.Data[i].plays + data.Data[i].embeds,
          "1.0"
        ));
      (this.CurrentWeek[i].completes = this._decimalPipe.transform(
        data.Data[i].completes,
        "1.0"
      )),
        (this.CurrentWeek[i].timeWatched = this._decimalPipe.transform(
          data.Data[i].time_watched,
          "1.0"
        ));
    }

    // Last Week
    let dateLastWeek = this.getDaysByNumber(LastWeek);
    const dataLastWeek: any = await this._dashboard
      .getByPlatform(dateLastWeek)
      .toPromise();
    for (let i = 0; i < dataLastWeek.Data.length; i++) {
      this.LastWeek[i].clicks = this._decimalPipe.transform(
        dataLastWeek.Data[i].plays - data.Data[i].plays,
        "1.0"
      );
      this.LastWeek[i].views = this._decimalPipe.transform(
        dataLastWeek.Data[i].plays +
          dataLastWeek.Data[i].embeds -
          (data.Data[i].plays + data.Data[i].embeds),
        "1.0"
      );
      this.LastWeek[i].completes = this._decimalPipe.transform(
        dataLastWeek.Data[i].completes - data.Data[i].completes,
        "1.0"
      );
      this.LastWeek[i].timeWatched = this._decimalPipe.transform(
        dataLastWeek.Data[i].time_watched - data.Data[i].time_watched,
        "1.0"
      );
    }
    return this.CurrentWeek;
  }

  async loadTotalData(date) {
    this.CurrentWeek.map((d, i) => {
      this.totalData[0].clicks += parseFloat(d.clicks.replace(/,/g, ""));
      this.totalData[0].views += parseFloat(d.views.replace(/,/g, ""));
      this.totalData[0].completes += parseFloat(d.completes.replace(/,/g, ""));
      this.totalData[0].timeWatched += parseFloat(
        d.timeWatched.replace(/,/g, "")
      );
    });

    await this._dashboard.getByPlatform(date).subscribe((res: any) => {
      console.log("REs: ", res);

      for (let d of res.Data) {
        this.totalData[1].clicks += d.plays;
        this.totalData[1].views += d.plays + d.embeds;
        this.totalData[1].completes += d.completes;
        this.totalData[1].timeWatched += d.time_watched;
      }
      this.totalData[1].clicks = this._decimalPipe.transform(
        this.totalData[1].clicks -
          parseFloat(this.totalData[0].clicks.replace(/,/g, "")),
        "1.0"
      );
      this.totalData[1].views = this._decimalPipe.transform(
        this.totalData[1].views -
          parseFloat(this.totalData[0].views.replace(/,/g, "")),
        "1.0"
      );
      this.totalData[1].completes = this._decimalPipe.transform(
        this.totalData[1].completes -
          parseFloat(this.totalData[0].completes.replace(/,/g, "")),
        "1.0"
      );
      this.totalData[1].timeWatched = this._decimalPipe.transform(
        this.totalData[1].timeWatched -
          parseFloat(this.totalData[0].timeWatched.replace(/,/g, "")),
        "1.0"
      );

      console.log("Total Data: ", this.totalData);
    });

    this.totalData[0].clicks = this._decimalPipe.transform(
      this.totalData[0].clicks,
      "1.0"
    );
    this.totalData[0].views = this._decimalPipe.transform(
      this.totalData[0].views,
      "1.0"
    );
    this.totalData[0].completes = this._decimalPipe.transform(
      this.totalData[0].completes,
      "1.0"
    );
    this.totalData[0].timeWatched = this._decimalPipe.transform(
      this.totalData[0].timeWatched,
      "1.0"
    );

    // this.totalData[1].clicks = this._decimalPipe.transform(
    //   this.totalData[1].clicks,
    //   "1.0"
    // );
    // this.totalData[1].views = this._decimalPipe.transform(
    //   this.totalData[1].views,
    //   "1.0"
    // );
    // this.totalData[1].completes = this._decimalPipe.transform(
    //   this.totalData[1].completes,
    //   "1.0"
    // );
    // this.totalData[1].timeWatched = this._decimalPipe.transform(
    //   this.totalData[1].timeWatched,
    //   "1.0"
    // );
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
    this.loadData(date, period);
  }
}

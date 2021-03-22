import { DecimalPipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";
import { DateUtils } from "../../../utils/date.utls";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "ngx-custom-card",
  templateUrl: "./custom-card.component.html",
  styleUrls: ["./custom-card.component.scss"],
})
export class CustomCardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils,
    private _decimalPipe: DecimalPipe
  ) {}

  tableShow = false;
  totalData = [
    {
      Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
  ];

  webData = [];
  androidData = [];
  iosData = [];
  tvData = [];
  fireosData = [];
  CurrentWeek = [
    {
      icon: "../../../../assets//images//web.png",
      // Clicks: "",
      Plays: "",
      Embeds: "",
      Completes: "",
      Time_Watched: "",
      User_Base: "",
      Avg_Eng_Time: "",
      Avg_session_Duration: "",
      name: "Web",
    },
    {
      icon: "../../../../assets//images//android.png",
      // Clicks: "",
      Plays: "",
      Embeds: "",
      Completes: "",
      Time_Watched: "",
      User_Base: "",
      Avg_Eng_Time: "",
      Avg_session_Duration: "",
      name: "Android",
    },
    {
      icon: "../../../../assets//images//apple.png",
      // Clicks: "",
      Plays: "",
      Embeds: "",
      Completes: "",
      Time_Watched: "",
      User_Base: "",
      Avg_Eng_Time: "",
      Avg_session_Duration: "",
      name: "IOS",
    },
    {
      icon: "../../../../assets//images//video.png",
      // Clicks: "",
      Plays: "",
      Embeds: "",
      Completes: "",
      Time_Watched: "",
      User_Base: "",
      Avg_Eng_Time: "",
      Avg_session_Duration: "",
      name: "TV",
    },
    {
      icon: "../../../../assets//images//tv.png",
      // Clicks: "",
      Plays: "",
      Embeds: "",
      Completes: "",
      Time_Watched: "",
      User_Base: "",
      Avg_Eng_Time: "",
      Avg_session_Duration: "",
      name: "TV",
    },
  ];
  LastWeek = [
    {
      icon: "../../../../assets//images//web.png",
      // Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      icon: "../../../../assets//images//android.png",
      // Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      icon: "../../../../assets//images//apple.png",
      // Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      icon: "../../../../assets//images//video.png",
      // Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
      Avg_session_Duration: null,
    },
    {
      icon: "../../../../assets//images//tv.png",
      // Clicks: null,
      Plays: null,
      Embeds: null,
      Completes: null,
      Time_Watched: null,
      User_Base: null,
      Avg_Eng_Time: null,
    },
  ];

  labelsArray = [
    // "Clicks",
    "Plays",
    "Embeds",
    "Completes",
    "Time_Watched",
    "User_Base",
    "Avg_Eng_Time",
    "Avg_session_Duration",
  ];
  totalArray = [];

  weekList = ["Current Week", "Last Week"];
  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";

  ngOnInit(): void {
    // this.setOptions();
    this.initializeData();
    this.gett3MonthData().then((data: any) => {
      this.loadData(this.getDaysByNumber(7), 14, data).then(async (res) => {
        this.loadTotalData(this.getDaysByNumber(14), data);
        this.tableShow = true;
      });
    });
  }

  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }

  initializeData() {
    this.labelsArray.map((m) => {
      this.totalArray[m] = new Array();
      this.webData[m] = new Array();
      this.androidData[m] = new Array();
      this.iosData[m] = new Array();
      this.tvData[m] = new Array();
      this.fireosData[m] = new Array();
    });
  }

  async loadData(dateCurrentWeek, LastWeek: number, last30DaysData) {
    // current Week
    const data: any = await this._dashboard
      .getByPlatform(dateCurrentWeek)
      .toPromise();

    console.log("data current: ", data);

    for (let i = 0; i < data.Data.length; i++) {
      // (this.CurrentWeek[i].Clicks = this._decimalPipe.transform(
      //   Math.round(data.Data[i].plays),
      //   "1.0"
      // )),
      (this.CurrentWeek[i].Embeds = this._decimalPipe.transform(
        Math.round(data.Data[i].embeds),
        "1.0"
      )),
        (this.CurrentWeek[i].Plays = this._decimalPipe.transform(
          Math.round(data.Data[i].plays),
          "1.0"
        ));
      (this.CurrentWeek[i].Completes = this._decimalPipe.transform(
        Math.round(data.Data[i].completes),
        "1.0"
      )),
        (this.CurrentWeek[i].Time_Watched = this._decimalPipe.transform(
          Math.round(data.Data[i].time_watched),
          "1.0"
        ));
      this.CurrentWeek[i].Avg_Eng_Time = this._decimalPipe.transform(
        Math.round(data.Data[i].time_watched / data.Data[i].plays),
        "1.0"
      );
    }

    // Last Week
    let dateLastWeek = this.getDaysByNumber(LastWeek);
    const dataLastWeek: any = await this._dashboard
      .getByPlatform(dateLastWeek)
      .toPromise();
    console.log("dataLastWeek: ", dataLastWeek);

    for (let i = 0; i < dataLastWeek.Data.length; i++) {
      this.LastWeek[i].Embeds = data.Data[i]
        ? this._decimalPipe.transform(
            Math.round(dataLastWeek.Data[i].embeds - data.Data[i].embeds),
            "1.0"
          )
        : 0;
      this.LastWeek[i].Plays = data.Data[i]
        ? this._decimalPipe.transform(
            dataLastWeek.Data[i].plays - data.Data[i].plays,
            "1.0"
          )
        : 0;
      this.LastWeek[i].Completes = data.Data[i]
        ? this._decimalPipe.transform(
            Math.round(dataLastWeek.Data[i].completes - data.Data[i].completes),
            "1.0"
          )
        : 0;
      this.LastWeek[i].Time_Watched = data.Data[i]
        ? this._decimalPipe.transform(
            Math.round(
              dataLastWeek.Data[i].time_watched - data.Data[i].time_watched
            ),
            "1.0"
          )
        : 0;
      this.LastWeek[i].Avg_Eng_Time = data.Data[i]
        ? this._decimalPipe.transform(
            Math.round(
              dataLastWeek.Data[i].time_watched / dataLastWeek.Data[i].plays
            ),
            "1.0"
          )
        : 0;
    }

    // creating specific array for web , android , ios etc

    for (let index = 0; index < 5; index++) {
      this.labelsArray.map((m, i) => {
        this.CurrentWeek[index][m] = this.CurrentWeek[index][m]
          ? this.CurrentWeek[index][m]
          : 0;
        this.LastWeek[index][m] = this.LastWeek[index][m]
          ? this.LastWeek[index][m]
          : 0;
        last30DaysData[index][m] = last30DaysData[index][m]
          ? Math.round(last30DaysData[index][m])
          : 0;

        if (index == 0) {
          this.webData[m].push(this.CurrentWeek[index][m]);
          this.webData[m].push(this.LastWeek[index][m]);
          this.webData[m].push(
            this._decimalPipe.transform(last30DaysData[index][m], "1.0")
          );
        } else if (index == 1) {
          this.androidData[m].push(this.CurrentWeek[index][m]);
          this.androidData[m].push(this.LastWeek[index][m]);
          this.androidData[m].push(
            this._decimalPipe.transform(last30DaysData[index][m], "1.0")
          );
        } else if (index == 2) {
          this.iosData[m].push(this.CurrentWeek[index][m]);
          this.iosData[m].push(this.LastWeek[index][m]);
          this.iosData[m].push(
            this._decimalPipe.transform(last30DaysData[index][m], "1.0")
          );
        } else if (index == 3) {
          this.fireosData[m].push(this.CurrentWeek[index][m]);
          this.fireosData[m].push(this.LastWeek[index][m]);
          this.fireosData[m].push(
            this._decimalPipe.transform(last30DaysData[index][m], "1.0")
          );
        } else if (index == 4) {
          this.tvData[m].push(this.CurrentWeek[index][m]);
          this.tvData[m].push(this.LastWeek[index][m]);
          this.tvData[m].push(
            this._decimalPipe.transform(last30DaysData[index][m], "1.0")
          );
        }
      });
    }
  }

  async loadTotalData(date, last90DaysData) {
    // summing current week data for combine data
    this.CurrentWeek.map((d, i) => {
      // this.totalData[0].Clicks += parseFloat(d.Clicks.replace(/,/g, ""));
      d.Embeds &&
        (this.totalData[0].Embeds += parseFloat(d.Embeds.replace(/,/g, "")));
      d.Plays &&
        (this.totalData[0].Plays += parseFloat(d.Plays.replace(/,/g, "")));
      d.Completes &&
        (this.totalData[0].Completes += parseFloat(
          d.Completes.replace(/,/g, "")
        ));
      d.Time_Watched &&
        (this.totalData[0].Time_Watched += parseFloat(
          d.Time_Watched.replace(/,/g, "")
        ));
      d.Plays &&
        (this.totalData[0].Avg_Eng_Time +=
          parseFloat(d.Time_Watched.replace(/,/g, "")) /
          parseFloat(d.Plays.replace(/,/g, "")));
    });

    const lastWeek: any = await this._dashboard.getByPlatform(date).toPromise();

    // summing Last week data for combine data
    for (let d of lastWeek.Data) {
      // this.totalData[1].Clicks += d.plays;
      this.totalData[1].Plays += d.plays;
      this.totalData[1].Embeds += d.embeds;
      this.totalData[1].Completes += d.completes;
      this.totalData[1].Time_Watched += d.time_watched;
      this.totalData[1].Avg_Eng_Time += d.time_watched / d.plays;
    }

    // Inserting commas
    // this.totalData[0].Clicks = this._decimalPipe.transform(
    //   Math.round(this.totalData[0].Clicks),
    //   "1.0"
    // );
    this.totalData[0].Embeds = this._decimalPipe.transform(
      Math.round(this.totalData[0].Embeds),
      "1.0"
    );
    this.totalData[0].Plays = this._decimalPipe.transform(
      Math.round(this.totalData[0].Plays),
      "1.0"
    );
    this.totalData[0].Completes = this._decimalPipe.transform(
      Math.round(this.totalData[0].Completes),
      "1.0"
    );
    this.totalData[0].Time_Watched = this._decimalPipe.transform(
      Math.round(this.totalData[0].Time_Watched),
      "1.0"
    );
    this.totalData[0].Avg_Eng_Time = this._decimalPipe.transform(
      Math.round(
        parseFloat(
          this.totalData[0].Time_Watched.toString().replace(/,/g, "")
        ) / parseFloat(this.totalData[0].Plays.toString().replace(/,/g, ""))
      ),
      "1.0"
    );

    this.totalData[1].Embeds = this._decimalPipe.transform(
      Math.round(
        this.totalData[1].Embeds -
          parseFloat(this.totalData[0].Embeds.toString().replace(/,/g, ""))
      ),
      "1.0"
    );
    // this.totalData[1].Clicks = this._decimalPipe.transform(
    //   Math.round(
    //     this.totalData[1].Clicks -
    //       parseFloat(this.totalData[0].Clicks.toString().replace(/,/g, ""))
    //   ),
    //   "1.0"
    // );
    this.totalData[1].Plays = this._decimalPipe.transform(
      Math.round(
        this.totalData[1].Plays -
          parseFloat(this.totalData[0].Plays.toString().replace(/,/g, ""))
      ),
      "1.0"
    );
    this.totalData[1].Completes = this._decimalPipe.transform(
      Math.round(
        this.totalData[1].Completes -
          parseFloat(this.totalData[0].Completes.toString().replace(/,/g, ""))
      ),
      "1.0"
    );
    this.totalData[1].Time_Watched = this._decimalPipe.transform(
      Math.round(
        this.totalData[1].Time_Watched -
          parseFloat(
            this.totalData[0].Time_Watched.toString().replace(/,/g, "")
          )
      ),
      "1.0"
    );
    this.totalData[1].Avg_Eng_Time = this._decimalPipe.transform(
      Math.round(
        parseFloat(
          this.totalData[1].Time_Watched.toString().replace(/,/g, "")
        ) / parseFloat(this.totalData[1].Plays.toString().replace(/,/g, ""))
      ),
      "1.0"
    );

    //   // summing last 90 days data for combine data
    for (let d of last90DaysData) {
      this.totalData[2].Clicks += d.Plays;
      this.totalData[2].Embeds += d.Embeds;
      this.totalData[2].Plays += d.Plays;
      this.totalData[2].Completes += d.Completes;
      this.totalData[2].Time_Watched += d.Time_Watched;
      this.totalData[2].Avg_Eng_Time += d.Time_Watched / d.Plays;
    }

    //  inserting commas
    this.totalData[2].Embeds = this._decimalPipe.transform(
      Math.round(this.totalData[2].Embeds / 12),
      "1.0"
    );
    // this.totalData[2].Clicks = this._decimalPipe.transform(
    //   Math.round(this.totalData[2].Clicks / 12),
    //   "1.0"
    // );
    this.totalData[2].Plays = this._decimalPipe.transform(
      Math.round(this.totalData[2].Plays / 12),
      "1.0"
    );
    this.totalData[2].Completes = this._decimalPipe.transform(
      Math.round(this.totalData[2].Completes / 12),
      "1.0"
    );
    this.totalData[2].Time_Watched = this._decimalPipe.transform(
      Math.round(this.totalData[2].Time_Watched / 12),
      "1.0"
    );
    (this.totalData[2].Avg_Eng_Time = this._decimalPipe.transform(
      Math.round(
        parseFloat(
          this.totalData[2].Time_Watched.toString().replace(/,/g, "")
        ) / parseFloat(this.totalData[2].Plays.toString().replace(/,/g, ""))
      )
    )),
      "1.0";

    // customizing array for showing data
    this.labelsArray.map((m) => {
      this.totalArray[m].push(this.totalData[0][m] ? this.totalData[0][m] : 0);
      this.totalArray[m].push(this.totalData[1][m] ? this.totalData[1][m] : 0);
      this.totalArray[m].push(this.totalData[2][m] ? this.totalData[2][m] : 0);
    });

    return this.totalData;
  }

  async gett3MonthData() {
    const last90Days: any = await this._dashboard
      .getByPlatform(this.getDaysByNumber(90))
      .toPromise();

    let customArray = last90Days.Data.map((m) => {
      let obj = {
        // Clicks: m.plays,
        Plays: m.plays,
        Embeds: m.embeds,
        Completes: m.completes,
        Time_Watched: m.time_watched,
        User_Base: "",
        Avg_Eng_Time: m.time_watched / m.plays,
        Avg_session_Duration: "",
      };
      return obj;
    });

    return customArray;
  }

  //
  setOptions() {
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
        {
          name: "Desktops",
          data: [40, 50, 35, 67, 43, 66, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "white"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    };
  }
}

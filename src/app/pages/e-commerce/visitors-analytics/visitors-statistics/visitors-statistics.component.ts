import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { delay, takeWhile } from "rxjs/operators";
import { setTimeout } from "timers";
import { LayoutService } from "../../../../@core/utils/layout.service";
import { DashbaordChartService } from "../../../../services/dashboard-chart";
import { DateUtils } from "../../../../utils/date.utls";

@Component({
  selector: "ngx-visitors-statistics",
  styleUrls: ["./visitors-statistics.component.scss"],
  templateUrl: "./visitors-statistics.component.html",
})
export class ECommerceVisitorsStatisticsComponent implements OnInit, OnDestroy {
  private alive = true;

  // @Input() value: number;
  value: number = 0;
  data: any = {
    users: "",
    userPercentage: "",
    newUser: "",
    newUserPercentage: "",
  };
  timePeriodList = ["Last Week", "Last 30 Days", "Todays"];
  selectedTimePeriodList = "Last Week";
  option: any = {};
  chartLegend: { iconColor: string; title: string }[];
  echartsIntance: any;
  totalValues: any = [
    {
      name: "Users",
      value: 0,
    },
    {
      name: "New Users",
      value: 0,
    },
  ];
  apiList = [
    { name: "Users", url: "/Users" },
    { name: "New Users", url: "/NewUsers" },
  ];

  constructor(
    private theme: NbThemeService,
    private layoutService: LayoutService,
    private _utils: DateUtils,
    private _dashboard: DashbaordChartService
  ) {
    this.layoutService
      .onSafeChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.resizeChart());
  }

  ngOnInit(): void {
    let date = this.getDaysByNumber(7);
    this.loadApi(date).then((res) => {
      this.theme
        .getJsTheme()
        .pipe(
          takeWhile(() => this.alive),
          delay(1)
        )
        .subscribe(async (config) => {
          const variables: any = config.variables;
          const visitorsPieLegend: any = config.variables.visitorsPieLegend;

          let sum = res[0] + res[1];
          let value = (res[0] / sum) * 100;
          this.data["users"] = res[0];
          this.data["newUser"] = res[1];
          this.data["userPercentage"] = Number((res[0] / sum) * 100).toFixed(2);
          this.data["newUserPercentage"] = Number((res[1] / sum) * 100).toFixed(
            2
          );
          //  console.log("Number((res[0] / sum )* 100).toFixed(2): ",Number((res[0] / sum )* 100).toFixed(2));

          await this.setOptions(variables, value);
          await this.setLegendItems(visitorsPieLegend);
        });
    });
  }

  getSelectedPeriod() {
    console.log("selectedTimePeriodList: ", this.selectedTimePeriodList);
    let period = 7,
      date;
    if (this.selectedTimePeriodList == "Last Week") {
      period = 7;
    }
    if (this.selectedTimePeriodList == "Last 30 Days") {
      period = 30;
    }
    if (this.selectedTimePeriodList == "Todays") {
      period = 0;
    }

    date = this.getDaysByNumber(period);
    this.loadApi(date).then((res) => {
      this.theme
        .getJsTheme()
        .pipe(
          takeWhile(() => this.alive),
          delay(1)
        )
        .subscribe(async (config) => {
          const variables: any = config.variables;

          let sum = res[0] + res[1];
          let value = (res[0] / sum) * 100;
          this.data["users"] = res[0];
          this.data["newUser"] = res[1];
          this.data["userPercentage"] = Number((res[0] / sum) * 100).toFixed(2);
          this.data["newUserPercentage"] = Number((res[1] / sum) * 100).toFixed(
            2
          );
          console.log("Data: ", this.data);

          await this.setOptions(variables, value);
        });
    });
  }
  getDaysByNumber(num: number) {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - num));
    return { start_date: startDate, end_date: endDate };
  }

  async loadApi(date) {
    let combineArray = [];
    for (let api of this.apiList) {
      let sum = 0;
      let array: any = await this._dashboard
        .getAnalyticalViews(date, api.url)
        .toPromise();
      for (let data of array.Data) {
        sum += +data.value;
      }
      for (let data of this.totalValues) {
        if (api.name == data.name) {
          data.value = sum;
          combineArray.push(sum);
        }
      }
    }

    // console.log("this.totalValues: ",this.totalValues );

    return combineArray;
  }
  async loadAllData(period: number) {
    let date = this.getDaysByNumber(period);
    this.loadApi(date).then((res) => {
      let total = res[0] + res[1];
      let totalVal = (res[0] / total) * 100;
      this.value = totalVal;
      console.log("totalVal: ", this.value);
    });
  }

  setLegendItems(visitorsPieLegend) {
    this.chartLegend = [
      {
        iconColor: visitorsPieLegend.firstSection,
        title: "New Users",
      },
      {
        iconColor: visitorsPieLegend.secondSection,
        title: "Users",
      },
    ];
  }

  setOptions(variables, value) {
    const visitorsPie: any = variables.visitorsPie;

    this.option = {
      tooltip: {
        trigger: "item",
        formatter: "",
      },
      series: [
        {
          name: " ",
          clockWise: true,
          hoverAnimation: true,
          type: "pie",
          center: ["50%", "50%"],
          radius: visitorsPie.firstPieRadius,
          data: [
            {
              value: value,
              name: " ",
              label: {
                normal: {
                  position: "center",
                  formatter: "",
                  textStyle: {
                    fontSize: "22",
                    fontFamily: variables.fontSecondary,
                    fontWeight: "600",
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: visitorsPie.firstPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: visitorsPie.firstPieGradientRight,
                    },
                  ]),
                  shadowColor: visitorsPie.firstPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
              hoverAnimation: false,
            },
            {
              value: 100 - value,
              name: " ",
              tooltip: {
                show: false,
              },
              label: {
                normal: {
                  position: "inner",
                },
              },
              itemStyle: {
                normal: {
                  color: variables.layoutBg,
                },
              },
            },
          ],
        },
        {
          name: " ",
          clockWise: true,
          hoverAnimation: false,
          type: "pie",
          center: ["50%", "50%"],
          radius: visitorsPie.secondPieRadius,
          data: [
            {
              value: value,
              name: " ",
              label: {
                normal: {
                  position: "center",
                  formatter: "",
                  textStyle: {
                    fontSize: "22",
                    fontFamily: variables.fontSecondary,
                    fontWeight: "600",
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1),
                },
              },
              hoverAnimation: false,
            },
            {
              value: 100 - value,
              name: " ",
              tooltip: {
                show: false,
              },
              label: {
                normal: {
                  position: "inner",
                },
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: visitorsPie.secondPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: visitorsPie.secondPieGradientRight,
                    },
                  ]),
                  shadowColor: visitorsPie.secondPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: visitorsPie.shadowOffsetX,
                  shadowOffsetY: visitorsPie.shadowOffsetY,
                },
              },
            },
          ],
        },
      ],
    };
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../services/dashboard-chart";
import { DateUtils } from "../../utils/date.utls";
import * as moment from "moment";

@Component({
  selector: "ngx-growth",
  templateUrl: "./growth.component.html",
  styleUrls: ["./growth.component.scss"],
})
export class GrowthComponent implements OnInit {

  productionHouseData = [];
  startDate: any;
  endDate: any;
  selected = [];
  name = "Production House";
  start_date: "2020-09-30";
  end_date: "2020-11-30";
  page: 0;
  reportType: "time_watched";
  page_length: 100;
  constructor(
    private _dashboard: DashbaordChartService,
    private _utils: DateUtils
  ) {

    // this._dashboard.getProductHouseFilter().subscribe((res: any) => {
    //   this.productionHouseData = res.Data;
    // });
  }

playsData: any = [];
watchTimeData : any = [];
percentComplete75 : any = [];
 

  DateArray: any = {};

  ngOnInit(): void {
    this.getProductionHouseData();

    let last30Days = this.getPast30Days();

    this.DateArray = this.changeDateToWeek(last30Days.start, last30Days.end);
    console.log("last 30 days ", this.DateArray);

    let obj = {};
    console.log('date array: ',this.DateArray );
    
    for (let i = 0; i < this.DateArray.length - 1; i++) {
      let index = i;

      this.apiPlaceGrowthSummary(this.DateArray[i] , this.DateArray[i+1], "time_watched" , this.selected).then((res : any)=> {
        // console.log('response time watched', res);

        for (let ind = 0; ind < res.Data.length; ind++) {

          let obj = {
            category:res.Data[ind].Category,
            report:res.Data[ind].report,
            week:index
          }
          this.watchTimeData.push(obj)
          
        }
      })

      this.apiPlaceGrowthSummary(this.DateArray[i] , this.DateArray[i+1], "plays" , this.selected).then((res : any) => {
        // console.log('response plays', res);
        let array = []
        for (let j = 0; j < res.Data.length; j++) {
   

          // if(!array.length){

          //   array.push({
          //     category:res.Data[j].Category,
          //     data : [{
          //       week:index,
          //       report: res.Data[j].report 
          //     }]
          //   })
          // }else{

          //   array.map(a => {
          //     if(a.category == res.Data[j].Category){
          //       a.data.push({
          //       week:index,
          //       report: res.Data[j].report 
          //       })
          //     }else{
          //       array.push({
          //         category:res.Data[j].Category,
          //         data : [{
          //           week:index,
          //           report: res.Data[j].report 
          //         }]
          //       })
          //     }
          //   })

          // }


          // this.productionHouseData.map(ph => {            
            // if(ph == res.Data[j].Category){
             

            //   if(!this.playsData.length){
            //     console.log('length 0');
                
            //     this.playsData.push({
            //       category : ph,
            //       data: [{
            //         week : index,
            //         report: res.Data[j].report
            //       }]
            //     }) 
            //   }
            //   else{
               
            //   this.playsData.map(pd => {
            //     if(pd.category  == ph ){
            //       console.log('match: ', ph);
                  
            //       pd.data.push({
            //         week : index,
            //         report: res.Data[j].report
            //       })
            //     }else{
                  
            //       this.playsData.push({
            //         category : ph,
            //         data: [{
            //           week : index,
            //         report: res.Data[j].report
            //         }]
            //       })
            //     }
            //   })
            // }

            // }
          // })
          
        }
        console.log('array playts: ', array);
        


      })

      this.apiPlaceGrowthSummary(this.DateArray[i] , this.DateArray[i+1], "75_percent_completes" , this.selected).then((res : any) => {
        // console.log('response plays', res);
        for (let k = 0; k < res.Data.length; k++) {
          
          let obj = {
            category:res.Data[k].Category,
            report:res.Data[k].report,
            week:index
          }
          this.percentComplete75.push(obj)
          
        }
      })
    }
    console.log('plays data: ', this.playsData);
    console.log('watch data: ', this.watchTimeData);
    console.log('75% data: ', this.percentComplete75);
    
  }


 
  apiPlaceGrowthSummary( start:any , end : any , type : string , phData : any)  {

    let data =     [
      "ProductionHouse_Pakistani",
      "ProductionHouse_Religious ",
      "ProductionHouse_Sports ",
      "ProductionHouse_Turner",
      "ProductionHouse_EROS",
      "ProductionHouse_Zee",
      "ProductionHouse_Others",
      "ProductionHouse_Tapmad",
      "ProductionHouse_TapmadOriginals",
      "ProductionHouse_International",
      "ProductionHouse_Cuisine",
      "ProductionHouse_Redbull",
    ];
    let array = [];
    if(phData && phData.length){
      array = phData;
    }else{
      array = data;
    }
   let obj = {
      start_date: start,
      end_date: end,
      page: 0,
      reportType: type,
      page_length: 100,
      data: array
  
    };

    return this._dashboard.getPlaceGrowthSummary(obj).toPromise();
  }

  getPast30Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }

  getProductionHouseData() {
    this._dashboard.getProductHouseFilter().subscribe((res: any) => {
      this.productionHouseData = res.Data;
    });
  }

  rangeDates($event) {
    this.startDate = $event.start;
    this.endDate = $event.end;
    let generalData = {};
    this.DateArray = this.changeDateToWeek($event.start, $event.end);
  }

  getSelectedValue() {
    console.log("selected value..", this.selected);
  }

  changeDateToWeek(start: any, end: any) {
    var a = moment(start);
    var b = moment(end);
    let diffCountWeek = b.diff(a, "week");
    console.log("difference in date.", diffCountWeek);

    let dateArrayy = [];

    if (diffCountWeek > 0) {
      for (let i = 0; i < diffCountWeek; i++) {
        let date = a.add(1, "week").calendar();
        let formatDate = date.split("/");
        let fDate = formatDate[2] + "-" + formatDate[0] + "-" + formatDate[1];
        if (i < diffCountWeek - 1) {
          dateArrayy.push(fDate);
        }
      }
      dateArrayy.unshift(start);
      dateArrayy.push(end);

      return dateArrayy;
    }
  }
}

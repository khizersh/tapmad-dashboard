import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashbaordChartService } from '../../services/dashboard-chart';
import { DateUtils } from '../../utils/date.utls';

@Component({
  selector: 'ngx-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  message: string;


  constructor( private service: DashbaordChartService ,   private theme: NbThemeService,
    private _utils: DateUtils ) { }

  ngOnInit(): void {
    // var message;
    let date = this.getPast30Days();
    this.service.getDataByTagName(date).subscribe(res => {
      console.log('response...', res);

    });
    this.message = " message is here ";
  }

  getPast30Days() {
    var d = new Date();
    let endDate = this._utils.formatDate(d.setDate(d.getDate()));
    let startDate = this._utils.formatDate(d.setDate(d.getDate() - 30));
    return { start: startDate, end: endDate };
  }
  getTest(){

    let date = this.getPast30Days();



    this.service.getDataByTagName(date).subscribe(res => {
      console.log('response...', res);

    });

    console.log('test wervice is worling');
  }

  // message = "helloworld";

}

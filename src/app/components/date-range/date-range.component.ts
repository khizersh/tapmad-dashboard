import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { DateUtils } from "../../utils/date.utls";
import { NbDateService, NbCalendarRange } from "@nebular/theme";

@Component({
  selector: "ngx-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.scss"],
})
export class DateRangeComponent implements OnInit {
  max: Date;
  startDate = "2020-07-10";
  endDate = "2020-08-18";
  @Output() getRange = new EventEmitter<Object>();
  constructor(
    protected dateService: NbDateService<Date>,
    private _date: DateUtils
  ) {
    this.range = {
      start: this.dateService.addDay(this.monthStart, 3),
      end: this.dateService.addDay(this.monthEnd, -3),
    };
    this.max = this.dateService.today();
  }

  ngOnInit(): void {}

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  get monthEnd(): Date {
    return this.dateService.getMonthEnd(new Date());
  }
  range: NbCalendarRange<Date>;

  handleDateChange($event) {
    this.startDate = this._date.formatDate($event.start);
    this.endDate = this._date.formatDate($event.end);
    if ($event.end) {
      this.getRange.emit({ start: this.startDate, end: this.endDate });
    }
  }
}

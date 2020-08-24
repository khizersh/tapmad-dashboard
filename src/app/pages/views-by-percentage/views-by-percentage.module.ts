import { NgModule } from "@angular/core";
import {
  NbMenuModule,
  NbCardModule,
  NbDatepickerModule,
  NbInputModule,
  NbButtonModule,
} from "@nebular/theme";
import { ChartModule } from "angular2-chartjs";
import { FormsModule } from "@angular/forms";
import { DateRangeModule } from "../../components/date-range/date-range.module";
import { ViewsByPercentageComponent } from "./views-by-percentage.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    NbMenuModule,
    NbCardModule,
    ChartModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    DateRangeModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  declarations: [ViewsByPercentageComponent],
})
export class ViewsByPercentageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbInputModule,
  NbMenuModule,
} from "@nebular/theme";
import { ChartModule } from "angular2-chartjs";
import { FormsModule } from "@angular/forms";
import { DateRangeModule } from "../../components/date-range/date-range.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgSelectModule } from "@ng-select/ng-select";
import { GrowthComponent } from "./growth.component";

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
    NgSelectModule,
  ],
  declarations: [GrowthComponent],
})
export class GrowthModule {}

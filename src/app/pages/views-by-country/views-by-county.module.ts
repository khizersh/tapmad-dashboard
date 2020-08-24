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
import { ViewsByCountryComponent } from "./views-by-country.component";

@NgModule({
  imports: [
    NbMenuModule,
    NbCardModule,
    ChartModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    DateRangeModule,
    NbButtonModule,
  ],
  declarations: [ViewsByCountryComponent],
})
export class ViewsByCountryModule {}

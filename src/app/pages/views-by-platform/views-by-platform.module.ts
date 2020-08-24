import { NgModule } from "@angular/core";
import {
  NbMenuModule,
  NbCardModule,
  NbDatepickerModule,
  NbInputModule,
} from "@nebular/theme";
import { ChartModule } from "angular2-chartjs";
import { FormsModule } from "@angular/forms";
import { DateRangeModule } from "../../components/date-range/date-range.module";
import { ViewsByPlatformComponent } from "./views-by-platform.component";

@NgModule({
  imports: [
    NbMenuModule,
    NbCardModule,
    ChartModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    DateRangeModule,
  ],
  declarations: [ViewsByPlatformComponent],
})
export class ViewsByPlatformModule {}

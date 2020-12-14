import { NgModule } from "@angular/core";
import {
  NbMenuModule,
  NbCardModule,
  NbDatepickerModule,
  NbInputModule,
} from "@nebular/theme";
import { ViewsByTagsComponent } from "./views-by-tags.component";
import { ChartModule } from "angular2-chartjs";
import { FormsModule } from "@angular/forms";
import { DateRangeModule } from "../../components/date-range/date-range.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';






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
    NgSelectModule,


  ],
  declarations: [ViewsByTagsComponent ],
})
export class ViewsByTagsModule {}

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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgSelectModule } from '@ng-select/ng-select';






@NgModule({
  imports: [
    NbMenuModule,
    NbCardModule,
    ChartModule,
    NbDatepickerModule,
    NbInputModule,
    FormsModule,
    DateRangeModule,
    NgSelectModule,
  
    
  ],
  declarations: [ViewsByTagsComponent],
})
export class ViewsByTagsModule {}

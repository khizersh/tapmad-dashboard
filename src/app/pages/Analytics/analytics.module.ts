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
import { RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";

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
    NbCardModule,
    NgSelectModule,
    RouterModule.forChild([
      {
        path: "users",
        component: UsersComponent,
      },
    ]),
  ],
  declarations: [UsersComponent],
})
export class AnalyticsModule {}

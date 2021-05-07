import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewsByChannelComponent } from './views-by-channel.component';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbInputModule, NbMenuModule } from '@nebular/theme';
import { ChartModule } from 'angular2-chartjs';
import { FormsModule } from '@angular/forms';
import { DateRangeModule } from '../../components/date-range/date-range.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { ViewsByCategoryComponent } from '../views-by-category/views-by-category.component';
import { TopMoviesComponent } from '../top-movies/top-movies.component';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from "ng-apexcharts";



@NgModule({
  declarations: [ViewsByChannelComponent, AddChannelComponent , ViewsByCategoryComponent ],
  imports: [
    RouterModule,
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
    NgApexchartsModule

  ]
})
export class ChannelModule { }

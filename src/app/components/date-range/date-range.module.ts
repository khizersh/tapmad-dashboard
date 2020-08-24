import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NbDatepickerModule, NbInputModule } from "@nebular/theme";
import { DateRangeComponent } from "./date-range.component";

@NgModule({
  imports: [NbDatepickerModule, NbInputModule, FormsModule],
  declarations: [DateRangeComponent],
  exports: [DateRangeComponent],
})
export class DateRangeModule {}

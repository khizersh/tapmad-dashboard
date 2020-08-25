import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbIconModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
} from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { ExtraComponentsRoutingModule } from "./extra-components-routing.module";

// components
import { ExtraComponentsComponent } from "./extra-components.component";
import { InteractiveProgressBarComponent } from "./progress-bar/interactive-progress-bar/interactive-progress-bar.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { AlertComponent } from "./alert/alert.component";
import { ChatComponent } from "./chat/chat.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { DayCellComponent } from "./calendar/day-cell/day-cell.component";
import { NebularFormInputsComponent } from "./form-inputs/nebular-form-inputs.component";
import { NebularSelectComponent } from "./form-inputs/nebular-select/nebular-select.component";
import { CalendarKitFullCalendarShowcaseComponent } from "./calendar-kit/calendar-kit.component";
import { CalendarKitMonthCellComponent } from "./calendar-kit/month-cell/month-cell.component";

const COMPONENTS = [
  ExtraComponentsComponent,
  AlertComponent,
  ProgressBarComponent,
  InteractiveProgressBarComponent,
  CalendarComponent,
  DayCellComponent,
  ChatComponent,
  NebularFormInputsComponent,
  NebularSelectComponent,
  CalendarKitFullCalendarShowcaseComponent,
  CalendarKitMonthCellComponent,
];

const MODULES = [
  NbAlertModule,
  NbActionsModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarKitModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbIconModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  ThemeModule,
  ExtraComponentsRoutingModule,
];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
})
export class ExtraComponentsModule {}

import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";
import { ThemeModule } from "../@theme/theme.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { ViewsByCountryModule } from "./views-by-country/views-by-county.module";
import { ViewsByPercentageModule } from "./views-by-percentage/views-by-percentage.module";
import { ViewsByPlatformModule } from "./views-by-platform/views-by-platform.module";
import { ViewsByTagsModule } from "./views-by-tags/views-by-tags.module";
import { SpinnerComponent } from "../utils/spinner/spinner.component";
import { DecimalPipe } from "@angular/common";
import { GrowthModule } from './growth/growth.module';
import { ChannelModule } from "./views-by-channel/channel.module";
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    ViewsByTagsModule,
    ViewsByPercentageModule,
    ViewsByCountryModule,
    ViewsByPlatformModule,
    GrowthModule,
    ChannelModule

  ],
  declarations: [PagesComponent, SpinnerComponent],
  providers: [DecimalPipe],
})
export class PagesModule {}

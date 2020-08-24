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
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}

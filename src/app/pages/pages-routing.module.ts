import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ECommerceComponent } from "./e-commerce/e-commerce.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { ViewsByTagsComponent } from "./views-by-tags/views-by-tags.component";
import { ViewsByPercentageComponent } from "./views-by-percentage/views-by-percentage.component";
import { ViewsByCountryComponent } from "./views-by-country/views-by-country.component";
import { ViewsByPlatformComponent } from "./views-by-platform/views-by-platform.component";
import { GrowthComponent } from './growth/growth.component';
import { ViewsByChannelComponent } from "./views-by-channel/views-by-channel.component";
import { AddChannelComponent } from "./views-by-channel/add-channel/add-channel.component";
import { ViewsByCategoryComponent } from "./views-by-category/views-by-category.component";
import { TopMoviesComponent } from "./top-movies/top-movies.component";


const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: ECommerceComponent,
      },
      {
        path: "top-movies",
        // component: ECommerceComponent,
        component: TopMoviesComponent,
      },
      {
        path: "add-channel",
        component: AddChannelComponent,
      },
      {
        path: "tags",
        component: ViewsByTagsComponent,
      },
      {
        path: "percentage",
        component: ViewsByPercentageComponent,
      },
      {
        path: "countries",
        component: ViewsByCountryComponent,
      },
      {
        path: "platform",
        component: ViewsByPlatformComponent,
      },
      {
        path: "growth",
        component:GrowthComponent
      },
      {
        path: "channel",
        component:ViewsByChannelComponent
      },
      {
        path: "category",
        component:ViewsByCategoryComponent
      },
      {
        path: "analytics",
        loadChildren: () =>
          import("./Analytics/analytics.module").then((m) => m.AnalyticsModule),
      },
      


      {
        path: "layout",
        loadChildren: () =>
          import("./layout/layout.module").then((m) => m.LayoutModule),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("./forms/forms.module").then((m) => m.FormsModule),
      },
      {
        path: "ui-features",
        loadChildren: () =>
          import("./ui-features/ui-features.module").then(
            (m) => m.UiFeaturesModule
          ),
      },
      {
        path: "modal-overlays",
        loadChildren: () =>
          import("./modal-overlays/modal-overlays.module").then(
            (m) => m.ModalOverlaysModule
          ),
      },
      {
        path: "extra-components",
        loadChildren: () =>
          import("./extra-components/extra-components.module").then(
            (m) => m.ExtraComponentsModule
          ),
      },
      {
        path: "maps",
        loadChildren: () =>
          import("./maps/maps.module").then((m) => m.MapsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./charts/charts.module").then((m) => m.ChartsModule),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./tables/tables.module").then((m) => m.TablesModule),
      },
      {
        path: "miscellaneous",
        loadChildren: () =>
          import("./miscellaneous/miscellaneous.module").then(
            (m) => m.MiscellaneousModule
          ),
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService
  ) {}

  scroll = function () {
    if (window.pageYOffset != undefined) {
      return [pageXOffset, pageYOffset];
    } else {
      var sx,
        sy,
        d = document,
        r = d.documentElement,
        b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return [sx, sy];
    }
  };
  ngOnInit(): void {
    // this.analytics.trackPageViews();
    // this.seoService.trackCanonicalChanges();
    console.log(this.scroll());
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendlineChartsComponent } from './trendline-charts.component';

describe('TrendlineChartsComponent', () => {
  let component: TrendlineChartsComponent;
  let fixture: ComponentFixture<TrendlineChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendlineChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendlineChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionChartsComponent } from './production-charts.component';

describe('ProductionChartsComponent', () => {
  let component: ProductionChartsComponent;
  let fixture: ComponentFixture<ProductionChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

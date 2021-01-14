import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPieChartComponent } from './user-pie-chart.component';

describe('UserPieChartComponent', () => {
  let component: UserPieChartComponent;
  let fixture: ComponentFixture<UserPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

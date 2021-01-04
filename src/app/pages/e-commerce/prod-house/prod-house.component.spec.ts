import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdHouseComponent } from './prod-house.component';

describe('ProdHouseComponent', () => {
  let component: ProdHouseComponent;
  let fixture: ComponentFixture<ProdHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

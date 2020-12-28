import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsByCategoryComponent } from './views-by-category.component';

describe('ViewsByCategoryComponent', () => {
  let component: ViewsByCategoryComponent;
  let fixture: ComponentFixture<ViewsByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsByChannelComponent } from './views-by-channel.component';

describe('ViewsByChannelComponent', () => {
  let component: ViewsByChannelComponent;
  let fixture: ComponentFixture<ViewsByChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsByChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsByChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

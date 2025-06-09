import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeiterDashboardComponent } from './leiter-dashboard.component';

describe('LeiterDashboardComponent', () => {
  let component: LeiterDashboardComponent;
  let fixture: ComponentFixture<LeiterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeiterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeiterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewChartComponent } from './page-view-chart.component';

describe('PageViewChartComponent', () => {
  let component: PageViewChartComponent;
  let fixture: ComponentFixture<PageViewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageViewChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageViewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

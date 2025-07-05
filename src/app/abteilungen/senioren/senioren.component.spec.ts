import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorenComponent } from './senioren.component';

describe('SeniorenComponent', () => {
  let component: SeniorenComponent;
  let fixture: ComponentFixture<SeniorenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

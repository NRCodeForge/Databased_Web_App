import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BogenComponent } from './bogen.component';

describe('BogenComponent', () => {
  let component: BogenComponent;
  let fixture: ComponentFixture<BogenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BogenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

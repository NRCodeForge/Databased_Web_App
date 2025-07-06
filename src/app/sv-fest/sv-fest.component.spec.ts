import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvFestComponent } from './sv-fest.component';

describe('SvFestComponent', () => {
  let component: SvFestComponent;
  let fixture: ComponentFixture<SvFestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvFestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvFestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

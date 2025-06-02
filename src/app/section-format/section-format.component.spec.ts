import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionFormatComponent } from './section-format.component';

describe('SectionFormatComponent', () => {
  let component: SectionFormatComponent;
  let fixture: ComponentFixture<SectionFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

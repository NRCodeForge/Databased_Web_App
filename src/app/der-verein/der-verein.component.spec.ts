import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerVereinComponent } from './der-verein.component';

describe('DerVereinComponent', () => {
  let component: DerVereinComponent;
  let fixture: ComponentFixture<DerVereinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerVereinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerVereinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

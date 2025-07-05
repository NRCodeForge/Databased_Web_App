import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbteilungenComponent } from './abteilungen.component';

describe('AbteilungenComponent', () => {
  let component: AbteilungenComponent;
  let fixture: ComponentFixture<AbteilungenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbteilungenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbteilungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

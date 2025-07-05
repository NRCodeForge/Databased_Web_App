import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugendundschuelerComponent } from './jugendundschueler.component';

describe('JugendundschuelerComponent', () => {
  let component: JugendundschuelerComponent;
  let fixture: ComponentFixture<JugendundschuelerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugendundschuelerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JugendundschuelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PistolensportComponent } from './pistolensport.component';

describe('PistolensportComponent', () => {
  let component: PistolensportComponent;
  let fixture: ComponentFixture<PistolensportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PistolensportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PistolensportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

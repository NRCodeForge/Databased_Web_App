import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFormModalComponent } from './download-form-modal.component';

describe('DownloadFormModalComponent', () => {
  let component: DownloadFormModalComponent;
  let fixture: ComponentFixture<DownloadFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

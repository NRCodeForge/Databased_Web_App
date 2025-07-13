import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFormModalComponent } from './content-form-modal.component';

describe('ContentFormModalComponent', () => {
  let component: ContentFormModalComponent;
  let fixture: ComponentFixture<ContentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

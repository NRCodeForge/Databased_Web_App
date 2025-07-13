import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFormModalComponent } from './delete-form-modal.component';

describe('DeleteFormModalComponent', () => {
  let component: DeleteFormModalComponent;
  let fixture: ComponentFixture<DeleteFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// src/app/admin-dashboard/delete-form-modal/delete-form-modal.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-form-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-form-modal.component.html',
  styleUrl: './delete-form-modal.component.css'
})
export class DeleteFormModalComponent {
  @Input() itemName: string = 'dieses Element'; // Name des Elements, das gelöscht werden soll
  @Output() confirmDelete = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirmDelete.emit(true);
  }

  onCancel(): void {
    this.confirmDelete.emit(false);
  }
}

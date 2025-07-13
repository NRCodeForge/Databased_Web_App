import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Ein einfaches Modal zur Bestätigung des Löschvorgangs eines Elements.
 * 
 * Dieses Modal fragt den Benutzer, ob ein bestimmtes Element (z. B. ein Beitrag) wirklich gelöscht werden soll.
 * Die Bestätigung oder Ablehnung wird über das `confirmDelete` EventEmitter-Output signalisiert.
 */
@Component({
  selector: 'app-delete-form-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-form-modal.component.html',
  styleUrl: './delete-form-modal.component.css'
})
export class DeleteFormModalComponent {
  /**
   * Bezeichnung des zu löschenden Elements (z. B. „Beitrag“ oder „Kategorie“).
   * Wird im UI-Text angezeigt.
   *
   * @default 'dieses Element'
   */
  @Input() itemName: string = 'dieses Element';

  /**
   * Wird ausgelöst, wenn der Benutzer eine Entscheidung trifft:
   * - `true`: Löschung wurde bestätigt
   * - `false`: Löschung wurde abgebrochen
   */
  @Output() confirmDelete = new EventEmitter<boolean>();

  /**
   * Bestätigt die Löschung und gibt `true` über den `confirmDelete`-Output aus.
   */
  onConfirm(): void {
    this.confirmDelete.emit(true);
  }

  /**
   * Bricht die Löschung ab und gibt `false` über den `confirmDelete`-Output aus.
   */
  onCancel(): void {
    this.confirmDelete.emit(false);
  }
}

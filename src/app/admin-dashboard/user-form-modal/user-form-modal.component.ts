import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

/**
 * Ein modales Formular zur Erstellung oder Bearbeitung von Benutzerdaten.
 * Unterstützt Validierung, Passwortänderung und Rollenverwaltung.
 */
@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css'
})
export class UserFormModalComponent implements OnInit {
  /**
   * Optionaler Eingabewert für einen vorhandenen Benutzer. Wenn gesetzt, wird das Formular vorausgefüllt.
   */
  @Input() user: Partial<User> | null = null;

  /**
   * Wird ausgelöst, wenn der Benutzer erfolgreich gespeichert wurde.
   */
  @Output() userSaved = new EventEmitter<User>();

  /**
   * Wird ausgelöst, wenn der Benutzer den Bearbeitungsvorgang abbricht.
   */
  @Output() cancelEdit = new EventEmitter<void>();

  /**
   * Das Reactive FormGroup für Benutzerinformationen.
   */
  userForm: FormGroup;

  /**
   * Liste vordefinierter Rollen für Benutzer, z. B. Benutzer, Leiter oder Admin.
   */
  roles = [
    { id: 1, name: 'Benutzer' },
    { id: 2, name: 'Leiter' },
    { id: 3, name: 'Admin' }
  ];

  /**
   * Initialisiert das Formular und injiziert Abhängigkeiten.
   * 
   * @param fb - Der FormBuilder zur Erstellung des Formulars.
   * @param userService - Der Dienst zum Erstellen und Aktualisieren von Benutzern.
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      UserID: [null],
      Vorname: ['', Validators.required],
      Nachname: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      RollenID: ['', Validators.required],
      Passwort: ['']
    });
  }

  /**
   * Lifecycle-Hook zur Initialisierung des Formulars.
   * Prüft, ob ein bestehender Benutzer geladen wurde, und konfiguriert das Passwortfeld entsprechend.
   */
  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        UserID: this.user.UserID,
        Vorname: this.user.Vorname,
        Nachname: this.user.Nachname,
        Email: this.user.Email,
        RollenID: this.user.RollenID
      });

      // Passwort ist optional bei bestehenden Benutzern
      this.userForm.get('Passwort')?.clearValidators();
      this.userForm.get('Passwort')?.updateValueAndValidity();
    } else {
      // Passwort ist erforderlich bei neuen Benutzern
      this.userForm.get('Passwort')?.setValidators(Validators.required);
      this.userForm.get('Passwort')?.updateValueAndValidity();
    }
  }

  /**
   * Aktiviert die Passwortbearbeitung bei bestehenden Benutzern.
   * Setzt das Passwortfeld zurück und aktiviert die Validierung.
   */
  onPasswordChangeClick(): void {
    const passwordControl = this.userForm.get('Passwort');
    if (passwordControl) {
      passwordControl.setValidators(Validators.required);
      passwordControl.updateValueAndValidity();
      passwordControl.markAsTouched();
      passwordControl.setValue('');
    }
  }

  /**
   * Speichert den Benutzer. Führt je nach Kontext ein Erstellen oder ein Update durch.
   * Validiert vorher das Formular.
   */
  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.user && this.user.UserID) {
        // Benutzer aktualisieren
        this.userService.updateUser(this.user.UserID, userData).subscribe(savedUser => {
          this.userSaved.emit(savedUser);
        });
      } else {
        // Neuen Benutzer erstellen
        userData.ErstelltAm = new Date().toISOString();
        this.userService.createUser(userData).subscribe(savedUser => {
          this.userSaved.emit(savedUser);
        });
      }
    }
  }

  /**
   * Bricht die Bearbeitung ab und informiert die Elternkomponente.
   */
  onCancel(): void {
    this.cancelEdit.emit();
  }
}

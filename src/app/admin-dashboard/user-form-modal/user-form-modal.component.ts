// src/app/admin-dashboard/user-form-modal/user-form-modal.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Validators ist hier korrekt importiert
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.css'
})
export class UserFormModalComponent implements OnInit {
  @Input() user: Partial<User> | null = null;
  @Output() userSaved = new EventEmitter<User>();
  @Output() cancelEdit = new EventEmitter<void>();

  userForm: FormGroup;

  roles = [
    { id: 1, name: 'Benutzer' },
    { id: 2, name: 'Leiter' },
    { id: 3, name: 'Admin' }
  ];

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

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        UserID: this.user.UserID,
        Vorname: this.user.Vorname,
        Nachname: this.user.Nachname,
        Email: this.user.Email,
        RollenID: this.user.RollenID
      });
      // Für bestehende Benutzer ist das Passwortfeld optional, wenn es nicht geändert wird
      this.userForm.get('Passwort')?.clearValidators();
      this.userForm.get('Passwort')?.updateValueAndValidity();
    } else {
      // Für neue Benutzer ist das Passwortfeld erforderlich
      this.userForm.get('Passwort')?.setValidators(Validators.required);
      this.userForm.get('Passwort')?.updateValueAndValidity();
    }
  }

  // Neue Methode zur Aktivierung der Passwortbearbeitung
  onPasswordChangeClick(): void {
    const passwordControl = this.userForm.get('Passwort');
    if (passwordControl) {
      passwordControl.setValidators(Validators.required); // Validators hier in TS verwenden
      passwordControl.updateValueAndValidity();
      passwordControl.markAsTouched();
      passwordControl.setValue(''); // Wert leeren, damit Benutzer neues Passwort eingeben kann
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.user && this.user.UserID) {
        this.userService.updateUser(this.user.UserID, userData).subscribe(savedUser => {
          this.userSaved.emit(savedUser);
        });
      } else {
        userData.ErstelltAm = new Date().toISOString();
        this.userService.createUser(userData).subscribe(savedUser => {
          this.userSaved.emit(savedUser);
        });
      }
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}

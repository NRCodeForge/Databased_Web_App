// Datei: src/app/admin-dashboard/user-management/user-management.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isFormVisible = false;
  isEditMode = false;
  currentUser: User = this.getEmptyUser();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Fehler beim Laden der Benutzer:', err)
    });
  }

  private getEmptyUser(): User {
    return {
      UserID: 0,
      Vorname: '',
      Nachname: '',
      Email: '',
      RollenID: 1,
      ErstelltAm: new Date().toISOString(),
      Passwort: ''
    };
  }

  openCreateForm(): void {
    this.isEditMode = false;
    this.currentUser = this.getEmptyUser();
    this.isFormVisible = true;
  }

  openEditForm(user: User): void {
    this.isEditMode = true;
    this.currentUser = { ...user, Passwort: '' };
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
  }

  saveUser(): void {
    if (this.isEditMode) {
      const { UserID, ...updateData } = this.currentUser;
      if (!updateData.Passwort) {
        delete updateData.Passwort;
      }
      this.userService.updateUser(UserID, updateData).subscribe({
        next: () => this.onSaveSuccess(),
        error: (err) => console.error('Fehler beim Aktualisieren:', err)
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: () => this.onSaveSuccess(),
        error: (err) => console.error('Fehler beim Erstellen:', err)
      });
    }
  }

  confirmDelete(user: User): void {
    // Verwenden von Vorname und Nachname für die Bestätigungsnachricht
    if (confirm(`Sind Sie sicher, dass Sie den Benutzer "${user.Vorname} ${user.Nachname}" löschen möchten?`)) {
      this.userService.deleteUser(user.UserID).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Fehler beim Löschen:', err)
      });
    }
  }

  private onSaveSuccess(): void {
    this.loadUsers();
    this.closeForm();
  }

  getRolleName(RolleID: number) {
    if (RolleID === 1) {
      return "User";
    }else if (RolleID === 2) {
      return "Leiter";
    } else if (RolleID === 3) {
      return "Admin";
    }
    return "";
  }
}

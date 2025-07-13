// src/app/admin-dashboard/user-management/user-management.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
// import { FormsModule } from '@angular/forms'; // Removed as form is now in modal
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component'; // Import the new user form modal

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DeleteFormModalComponent, UserFormModalComponent], // Added UserFormModalComponent, Removed FormsModule
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  // Renamed selectedUser to userToEdit as it's passed to the modal
  userToEdit: Partial<User> | null = null;
  // Replaced isEditing with showUserModal to control modal visibility
  showUserModal: boolean = false;

  showDeleteConfirmModal: boolean = false;
  userToDelete: User | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzer:', err);
      }
    });
  }

  onAddUser(): void {
    this.userToEdit = {
      Vorname: '',
      Nachname: '',
      Email: '',
      RollenID: 1 // Default role, adjust as necessary
    };
    this.showUserModal = true; // Show the modal
  }

  onEditUser(user: User): void {
    this.userToEdit = { ...user };
    this.showUserModal = true; // Show the modal
  }

  // New method to handle user saved from the modal
  onUserSaved(savedUser: User): void {
    this.showUserModal = false; // Hide the modal
    this.userToEdit = null; // Clear selected user
    this.loadUsers(); // Reload data to reflect changes
    // Potentially add a notification here similar to ContentManager
    // this.showNotification('Benutzer erfolgreich gespeichert!', 'success');
  }

  // New method to handle cancellation from the modal
  onCancelUserModal(): void {
    this.showUserModal = false; // Hide the modal
    this.userToEdit = null; // Clear selected user
  }

  onDeleteUser(id: number): void {
    this.userToDelete = this.users.find(u => u.UserID === id) || null;
    if (this.userToDelete) {
      this.showDeleteConfirmModal = true;
    }
  }

  onDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteConfirmModal = false;
    if (confirmed && this.userToDelete?.UserID) {
      this.userService.deleteUser(this.userToDelete.UserID).subscribe({
        next: () => {
          console.log('Benutzer erfolgreich gelöscht!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Benutzers:', err);
        }
      });
    }
    this.userToDelete = null;
  }
}

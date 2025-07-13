import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

/**
 * Komponente für die Benutzerverwaltung im Admin-Dashboard.
 * Verwaltet das Laden, Hinzufügen, Bearbeiten und Löschen von Benutzern.
 * 
 * @export
 * @class UserManagementComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DeleteFormModalComponent, UserFormModalComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  /**
   * Array mit allen geladenen Benutzern.
   * @type {User[]}
   */
  users: User[] = [];

  /**
   * Benutzer, der aktuell bearbeitet wird.
   * Teilweise ausgefülltes User-Objekt oder null, wenn kein Benutzer ausgewählt ist.
   * @type {Partial<User> | null}
   */
  userToEdit: Partial<User> | null = null;

  /**
   * Steuerung der Sichtbarkeit des User-Formular-Modals.
   * @type {boolean}
   */
  showUserModal: boolean = false;

  /**
   * Steuerung der Sichtbarkeit des Löschbestätigungs-Modals.
   * @type {boolean}
   */
  showDeleteConfirmModal: boolean = false;

  /**
   * Benutzer, der zum Löschen ausgewählt wurde.
   * @type {User | null}
   */
  userToDelete: User | null = null;

  /**
   * Erstellt eine Instanz von UserManagementComponent.
   * 
   * @param {UserService} userService Service zum Laden und Verwalten von Benutzerdaten.
   */
  constructor(private userService: UserService) { }

  /**
   * Lifecycle-Hook: Wird nach der Initialisierung der Komponente ausgeführt.
   * Lädt die Benutzerliste.
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Lädt alle Benutzer über den UserService.
   * Aktualisiert das users-Array bei Erfolg oder gibt bei Fehler eine Konsolenmeldung aus.
   */
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

  /**
   * Öffnet das User-Formular-Modal zum Hinzufügen eines neuen Benutzers.
   * Initialisiert ein leeres Benutzerobjekt mit Standardwerten.
   */
  onAddUser(): void {
    this.userToEdit = {
      Vorname: '',
      Nachname: '',
      Email: '',
      RollenID: 1
    };
    this.showUserModal = true;
  }

  /**
   * Öffnet das User-Formular-Modal zum Bearbeiten eines bestehenden Benutzers.
   * Eine Kopie des ausgewählten Benutzers wird geladen.
   * 
   * @param {User} user Der zu bearbeitende Benutzer.
   */
  onEditUser(user: User): void {
    this.userToEdit = { ...user };
    this.showUserModal = true;
  }

  /**
   * Callback-Methode, die ausgeführt wird, wenn ein Benutzer im Modal gespeichert wurde.
   * Schließt das Modal, leert den Bearbeitungsstatus und lädt die Benutzerliste neu.
   * 
   * @param {User} savedUser Der gespeicherte Benutzer.
   */
  onUserSaved(savedUser: User): void {
    this.showUserModal = false;
    this.userToEdit = null;
    this.loadUsers();
  }

  /**
   * Callback-Methode zum Abbrechen des User-Formular-Modals.
   * Schließt das Modal und leert den Bearbeitungsstatus.
   */
  onCancelUserModal(): void {
    this.showUserModal = false;
    this.userToEdit = null;
  }

  /**
   * Öffnet das Löschbestätigungs-Modal für den Benutzer mit der angegebenen ID.
   * 
   * @param {number} id ID des zu löschenden Benutzers.
   */
  onDeleteUser(id: number): void {
    this.userToDelete = this.users.find(u => u.UserID === id) || null;
    if (this.userToDelete) {
      this.showDeleteConfirmModal = true;
    }
  }

  /**
   * Verarbeitet die Löschbestätigung.
   * Führt die Löschung über den UserService aus, falls bestätigt, und lädt die Liste neu.
   * 
   * @param {boolean} confirmed Gibt an, ob die Löschung bestätigt wurde.
   */
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

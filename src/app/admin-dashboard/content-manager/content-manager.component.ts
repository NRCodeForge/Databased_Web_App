// src/app/admin-dashboard/content-manager/content-manager.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { Post } from '../../models/post';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ContentFormModalComponent } from '../content-form-modal/content-form-modal.component';
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component'; // Import the new DeleteFormModalComponent

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentFormModalComponent, DatePipe, DeleteFormModalComponent], // Add DeleteFormModalComponent to imports
  templateUrl: './content-manager.component.html',
  styleUrl: './content-manager.component.css'
})
export class ContentManagerComponent implements OnInit {
  contents: Post[] = [];
  selectedContent: Partial<Post> | null = null;
  showContentModal: boolean = false;
  currentUserId: number | null = null;

  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' | null = null;

  showDeleteConfirmationModal: boolean = false; // New property to control delete modal visibility
  postToDelete: Post | null = null; // New property to store the post to be deleted

  constructor(
    private contentService: ContentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.loadContents();
  }

  loadContents(): void {
    this.contentService.getPosts().subscribe({
      next: (data) => {
        this.contents = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Inhalte:', err);
        this.showNotification('Fehler beim Laden der Inhalte.', 'error');
      }
    });
  }

  onAddContent(): void {
    this.selectedContent = {
      Titel: '',
      Inhalt: '',
      KategorieID: 0,
      UserID: this.currentUserId || 0,
      Erstellungsdatum: new Date().toISOString()
    };
    this.showContentModal = true;
  }

  onEditContent(content: Post): void {
    this.selectedContent = { ...content };
    this.showContentModal = true;
  }

  onContentSaved(savedContent: Post): void {
    this.showContentModal = false;
    this.selectedContent = null;
    this.loadContents();
    this.showNotification('Inhalt erfolgreich gespeichert!', 'success');
  }

  onCancelEditFromModal(): void {
    this.showContentModal = false;
    this.selectedContent = null;
  }

  // Modified onDeleteContent to open the confirmation modal
  onDeleteContent(content: Post): void {
    this.postToDelete = content;
    this.showDeleteConfirmationModal = true;
  }

  // New method to handle confirmation from DeleteFormModalComponent
  onDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteConfirmationModal = false; // Close the modal

    if (confirmed && this.postToDelete && this.postToDelete.BeitragsID) {
      this.contentService.deletePost(this.postToDelete.BeitragsID).subscribe({
        next: () => {
          this.showNotification('Inhalt erfolgreich gelöscht!', 'success');
          this.loadContents(); // Reload contents after successful deletion
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Inhalts:', err);
          this.showNotification('Fehler beim Löschen des Inhalts.', 'error');
        }
      });
    }
    this.postToDelete = null; // Clear the stored post
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.clearNotification();
    }, 3000); // Notification disappears after 3 seconds
  }

  clearNotification(): void {
    this.notificationMessage = null;
    this.notificationType = null;
  }
}

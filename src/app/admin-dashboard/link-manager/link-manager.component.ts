// src/app/admin-dashboard/link-manager/link-manager.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';
import { Download } from '../../models/download';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';
import { DownloadFormModalComponent } from '../download-form-modal/download-form-modal.component';
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component'; // Import the new delete modal

@Component({
  selector: 'app-link-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, DownloadFormModalComponent, DeleteFormModalComponent], // Add DeleteFormModalComponent
  templateUrl: './link-manager.component.html',
  styleUrl: './link-manager.component.css'
})
export class LinkManagerComponent implements OnInit {
  downloads: Download[] = [];
  selectedDownload: Partial<Download> | null = null;
  isEditing: boolean = false;
  currentUserId: number | null = null;

  showDeleteConfirmModal: boolean = false; // Control visibility of delete confirmation modal
  downloadToDelete: Download | null = null; // Store the download to be deleted

  constructor(
    private downloadService: DownloadService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.loadDownloads();
  }

  loadDownloads(): void {
    this.downloadService.getDownloads().subscribe({
      next: (data) => {
        this.downloads = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      },
      error: (err) => {
        console.error('Fehler beim Laden der Downloads:', err);
      }
    });
  }

  onAddDownload(): void {
    this.selectedDownload = {
      title: '',
      description: '',
      showcaseImage: '',
      downloadUrl: '',
      order: this.downloads.length > 0 ? Math.max(...this.downloads.map(d => d.order || 0)) + 1 : 1,
      ErstelltVon: this.currentUserId || 0
    };
    this.isEditing = true;
  }

  onEditDownload(download: Download): void {
    this.selectedDownload = { ...download };
    this.isEditing = true;
  }

  onDownloadSaved(savedDownload: Download): void {
    this.isEditing = false;
    this.selectedDownload = null;
    this.loadDownloads();
    // Assuming a showNotification method exists or can be added for LinkManager too
    // this.showNotification('Download erfolgreich gespeichert!', 'success');
  }

  onCancelEditFromModal(): void {
    this.isEditing = false;
    this.selectedDownload = null;
  }

  // Modified onDeleteDownload to show custom modal
  onDeleteDownload(id: number): void {
    this.downloadToDelete = this.downloads.find(d => d.id === id) || null;
    if (this.downloadToDelete) {
      this.showDeleteConfirmModal = true;
    }
  }

  // New method to handle confirmation from the delete modal
  onDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteConfirmModal = false; // Hide modal regardless of confirmation
    if (confirmed && this.downloadToDelete?.id) {
      this.downloadService.deleteDownload(this.downloadToDelete.id).subscribe({
        next: () => {
          // Assuming a showNotification method exists or can be added for LinkManager too
          // this.showNotification('Download erfolgreich gelöscht!', 'success');
          this.loadDownloads();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Downloads:', err);
          // Assuming a showNotification method exists or can be added for LinkManager too
          // this.showNotification('Fehler beim Löschen des Downloads.', 'error');
        }
      });
    }
    this.downloadToDelete = null; // Clear the download to delete
  }

  drop(event: CdkDragDrop<Download[]>): void {
    moveItemInArray(this.downloads, event.previousIndex, event.currentIndex);

    const orderUpdates = this.downloads.map((download, index) => ({
      id: download.id,
      order: index + 1
    }));

    this.downloadService.reorderDownloads(orderUpdates).subscribe({
      next: () => {
        console.log('Reihenfolge im Backend aktualisiert.');
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren der Reihenfolge:', err);
        alert('Fehler beim Aktualisieren der Reihenfolge der Downloads.');
        this.loadDownloads();
      }
    });
  }
}

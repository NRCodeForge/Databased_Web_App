import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';
import { Download } from '../../models/download';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';
import { DownloadFormModalComponent } from '../download-form-modal/download-form-modal.component'; // Import new component

@Component({
  selector: 'app-link-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, DownloadFormModalComponent], // Add DownloadFormModalComponent
  templateUrl: './link-manager.component.html',
  styleUrl: './link-manager.component.css'
})
export class LinkManagerComponent implements OnInit {
  downloads: Download[] = [];
  selectedDownload: Partial<Download> | null = null;
  isEditing: boolean = false; // Controls modal visibility
  currentUserId: number | null = null;

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
      // Calculate next order based on existing downloads
      order: this.downloads.length > 0 ? Math.max(...this.downloads.map(d => d.order || 0)) + 1 : 1,
      ErstelltVon: this.currentUserId || 0
    };
    this.isEditing = true; // Show the modal
  }

  onEditDownload(download: Download): void {
    this.selectedDownload = { ...download };
    this.isEditing = true; // Show the modal
  }

  onDownloadSaved(savedDownload: Download): void {
    this.isEditing = false; // Hide the modal
    this.selectedDownload = null; // Clear selected download
    this.loadDownloads(); // Reload data to reflect changes
  }

  onCancelEditFromModal(): void {
    this.isEditing = false; // Hide the modal
    this.selectedDownload = null; // Clear selected download
  }

  onDeleteDownload(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diesen Download löschen möchten? Alle zugehörigen Dateien werden ebenfalls gelöscht.')) {
      this.downloadService.deleteDownload(id).subscribe({
        next: () => {
          alert('Download erfolgreich gelöscht!');
          this.loadDownloads();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Downloads:', err);
          alert('Fehler beim Löschen des Downloads.');
        }
      });
    }
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
        this.loadDownloads(); // Rollback im Frontend
      }
    });
  }
}

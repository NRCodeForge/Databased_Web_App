// src/app/admin-dashboard/link-manager/link-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';
import { Download } from '../../models/download';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-link-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './link-manager.component.html',
  styleUrl: './link-manager.component.css'
})
export class LinkManagerComponent implements OnInit {
  downloads: Download[] = [];
  selectedDownload: Partial<Download> | null = null;
  isEditing: boolean = false;
  currentUserId: number | null = null;

  // NEU: Eigenschaften für Dateiuploads
  selectedShowcaseImageFile: File | null = null;
  selectedDownloadFile: File | null = null;
  showcaseImagePreviewUrl: string | null = null;

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
    this.selectedShowcaseImageFile = null;
    this.selectedDownloadFile = null;
    this.showcaseImagePreviewUrl = null;
  }

  onEditDownload(download: Download): void {
    this.selectedDownload = { ...download };
    this.isEditing = true;
    // Wenn ein bestehendes Bild existiert, setze die Vorschau
    this.showcaseImagePreviewUrl = download.showcaseImage || null;
    this.selectedShowcaseImageFile = null; // Setze ausgewählte Datei zurück
    this.selectedDownloadFile = null; // Setze ausgewählte Datei zurück
  }

  // NEU: Handler für Dateiauswahl
  onFileSelected(event: Event, type: 'showcase' | 'download'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (type === 'showcase') {
        this.selectedShowcaseImageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.showcaseImagePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else { // type === 'download'
        this.selectedDownloadFile = file;
      }
    } else {
      if (type === 'showcase') {
        this.selectedShowcaseImageFile = null;
        this.showcaseImagePreviewUrl = this.selectedDownload?.showcaseImage || null; // Fallback to existing URL
      } else {
        this.selectedDownloadFile = null;
      }
    }
  }

  onSaveDownload(): void {
    if (!this.selectedDownload || !this.selectedDownload.title) {
      alert('Titel ist erforderlich.');
      return;
    }
    // NEU: Überprüfung, ob beim Erstellen eine Download-Datei ausgewählt wurde
    if (!this.selectedDownload.id && !this.selectedDownloadFile) {
      alert('Eine Download-Datei ist für neue Einträge erforderlich.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.selectedDownload.title);
    if (this.selectedDownload.description) {
      formData.append('description', this.selectedDownload.description);
    }
    // Wenn eine neue Showcase-Datei ausgewählt wurde, füge sie hinzu
    if (this.selectedShowcaseImageFile) {
      formData.append('showcaseImage', this.selectedShowcaseImageFile, this.selectedShowcaseImageFile.name);
    } else if (this.selectedDownload?.showcaseImage) {
      // Wenn keine neue Datei, aber eine bestehende URL, sende die URL (für PUT)
      formData.append('showcaseImage', this.selectedDownload.showcaseImage);
    }

    // Wenn eine neue Download-Datei ausgewählt wurde, füge sie hinzu
    if (this.selectedDownloadFile) {
      formData.append('downloadFile', this.selectedDownloadFile, this.selectedDownloadFile.name);
    } else if (this.selectedDownload?.downloadUrl) {
      // Wenn keine neue Datei, aber eine bestehende URL, sende die URL (für PUT)
      formData.append('downloadUrl', this.selectedDownload.downloadUrl);
    }


    formData.append('userId', String(this.currentUserId || 0)); // Sicherstellen, dass userId als String gesendet wird
    if (this.selectedDownload.order !== undefined && this.selectedDownload.order !== null) {
      formData.append('order', String(this.selectedDownload.order));
    }


    if (this.selectedDownload.id) {
      // Bestehenden Download aktualisieren
      this.downloadService.updateDownloadWithFiles(this.selectedDownload.id, formData).subscribe({
        next: () => {
          alert('Download erfolgreich aktualisiert!');
          this.loadDownloads();
          this.resetForm();
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren des Downloads:', err);
          alert('Fehler beim Aktualisieren des Downloads.');
        }
      });
    } else {
      // Neuen Download erstellen
      this.downloadService.createDownloadWithFiles(formData).subscribe({
        next: () => {
          alert('Download erfolgreich hinzugefügt!');
          this.loadDownloads();
          this.resetForm();
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen des Downloads:', err);
          alert('Fehler beim Hinzufügen des Downloads.');
        }
      });
    }
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

  onCancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedDownload = null;
    this.isEditing = false;
    this.selectedShowcaseImageFile = null;
    this.selectedDownloadFile = null;
    this.showcaseImagePreviewUrl = null;
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

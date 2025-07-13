import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';
import { Download } from '../../models/download';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';
import { DownloadFormModalComponent } from '../download-form-modal/download-form-modal.component';
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component'; // Import the new delete modal

/**
 * Komponente zur Verwaltung von Download-Links im Adminbereich.
 *
 * Bietet Funktionen zum Anzeigen, Hinzufügen, Bearbeiten, Löschen und Sortieren von Downloads.
 *
 * Nutzt Drag-and-Drop zur Reihenfolgeänderung sowie modale Dialoge für Formular- und Löschbestätigung.
 */
@Component({
  selector: 'app-link-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    DownloadFormModalComponent,
    DeleteFormModalComponent // Einbindung des Löschbestätigungs-Dialogs
  ],
  templateUrl: './link-manager.component.html',
  styleUrl: './link-manager.component.css'
})
export class LinkManagerComponent implements OnInit {
  /** Liste aller vorhandenen Downloads, sortiert nach Reihenfolge */
  downloads: Download[] = [];

  /** Aktuell ausgewählter Download für Bearbeitung, oder null */
  selectedDownload: Partial<Download> | null = null;

  /** Steuerung, ob sich die Komponente im Bearbeitungsmodus befindet */
  isEditing: boolean = false;

  /** Aktuelle Benutzer-ID, ermittelt aus AuthService */
  currentUserId: number | null = null;

  /** Steuerung der Sichtbarkeit des Löschbestätigungs-Modals */
  showDeleteConfirmModal: boolean = false;

  /** Download, der zum Löschen ausgewählt wurde */
  downloadToDelete: Download | null = null;

  /**
   * Konstruktor zur Injektion von benötigten Services
   * @param downloadService Service zum Laden und Verwalten von Downloads
   * @param authService Service zur Authentifizierung und Nutzerinformationen
   */
  constructor(
    private downloadService: DownloadService,
    private authService: AuthService
  ) { }

  /**
   * Initialisierung der Komponente:
   * - Ermittelt aktuelle Benutzer-ID
   * - Lädt vorhandene Downloads
   */
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.loadDownloads();
  }

  /**
   * Lädt die Downloads vom Server und sortiert diese nach `order`.
   * Fehler beim Laden werden in der Konsole protokolliert.
   */
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

  /**
   * Bereitet die Komponente auf das Hinzufügen eines neuen Downloads vor,
   * initialisiert das Formular mit Standardwerten.
   */
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

  /**
   * Öffnet den Bearbeitungsmodus für einen vorhandenen Download.
   * @param download Der zu bearbeitende Download
   */
  onEditDownload(download: Download): void {
    this.selectedDownload = { ...download };
    this.isEditing = true;
  }

  /**
   * Callback nach dem Speichern eines Downloads:
   * - Beendet den Bearbeitungsmodus
   * - Lädt die Liste der Downloads neu
   * @param savedDownload Der gespeicherte Download (nicht genutzt aktuell)
   */
  onDownloadSaved(savedDownload: Download): void {
    this.isEditing = false;
    this.selectedDownload = null;
    this.loadDownloads();
    // Optional: Benachrichtigung anzeigen
    // this.showNotification('Download erfolgreich gespeichert!', 'success');
  }

  /**
   * Bricht den Bearbeitungsmodus ab und verwirft alle Änderungen.
   */
  onCancelEditFromModal(): void {
    this.isEditing = false;
    this.selectedDownload = null;
  }

  /**
   * Initialisiert das Löschen eines Downloads,
   * zeigt ein Bestätigungsmodal an.
   * @param id ID des zu löschenden Downloads
   */
  onDeleteDownload(id: number): void {
    this.downloadToDelete = this.downloads.find(d => d.id === id) || null;
    if (this.downloadToDelete) {
      this.showDeleteConfirmModal = true;
    }
  }

  /**
   * Verarbeitet die Antwort aus dem Löschbestätigungsmodal.
   * Bei Bestätigung wird der Download gelöscht und die Liste neu geladen.
   * @param confirmed True, wenn der Benutzer das Löschen bestätigt hat
   */
  onDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteConfirmModal = false; // Modal schließen
    if (confirmed && this.downloadToDelete?.id) {
      this.downloadService.deleteDownload(this.downloadToDelete.id).subscribe({
        next: () => {
          // Optional: Benachrichtigung anzeigen
          // this.showNotification('Download erfolgreich gelöscht!', 'success');
          this.loadDownloads();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Downloads:', err);
          // Optional: Fehlerbenachrichtigung anzeigen
          // this.showNotification('Fehler beim Löschen des Downloads.', 'error');
        }
      });
    }
    this.downloadToDelete = null; // Reset der Löschauswahl
  }

}

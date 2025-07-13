import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { Post } from '../../models/post';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ContentFormModalComponent } from '../content-form-modal/content-form-modal.component';
import { DeleteFormModalComponent } from '../delete-form-modal/delete-form-modal.component';

/**
 * Verwaltungs-Komponente zur Anzeige, Bearbeitung und Löschung von Beiträgen.
 * Wird im Admin-Dashboard verwendet.
 */
@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentFormModalComponent, DatePipe, DeleteFormModalComponent],
  templateUrl: './content-manager.component.html',
  styleUrl: './content-manager.component.css'
})
export class ContentManagerComponent implements OnInit {
  /** Liste aller geladenen Beiträge */
  contents: Post[] = [];

  /** Aktuell ausgewählter Beitrag zum Bearbeiten */
  selectedContent: Partial<Post> | null = null;

  /** Steuert die Sichtbarkeit des Content-Formularmodals */
  showContentModal: boolean = false;

  /** ID des aktuell angemeldeten Benutzers */
  currentUserId: number | null = null;

  /** Nachricht für Erfolg oder Fehler (z. B. beim Speichern/Löschen) */
  notificationMessage: string | null = null;

  /** Typ der Benachrichtigung ('success' oder 'error') */
  notificationType: 'success' | 'error' | null = null;

  /** Steuert die Sichtbarkeit des Lösch-Bestätigungsdialogs */
  showDeleteConfirmationModal: boolean = false;

  /** Zu löschender Beitrag */
  postToDelete: Post | null = null;

  /**
   * Konstruktor der Komponente.
   * @param contentService Service zur Verwaltung von Beiträgen.
   * @param authService Authentifizierungsservice zur Benutzeridentifikation.
   */
  constructor(
    private contentService: ContentService,
    private authService: AuthService
  ) {}

  /**
   * Initialisierung der Komponente:
   * - Ermittelt Benutzer-ID
   * - Lädt vorhandene Beiträge
   */
  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.loadContents();
  }

  /**
   * Lädt alle Beiträge aus dem Backend.
   * Zeigt eine Fehlermeldung bei Fehler.
   */
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

  /**
   * Öffnet das Formular zum Hinzufügen eines neuen Beitrags.
   */
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

  /**
   * Öffnet das Formular zur Bearbeitung eines vorhandenen Beitrags.
   * @param content Der zu bearbeitende Beitrag.
   */
  onEditContent(content: Post): void {
    this.selectedContent = { ...content };
    this.showContentModal = true;
  }

  /**
   * Wird ausgelöst, wenn ein Beitrag erfolgreich gespeichert wurde.
   * Schließt das Modal und aktualisiert die Beitragsliste.
   * @param savedContent Der gespeicherte Beitrag.
   */
  onContentSaved(savedContent: Post): void {
    this.showContentModal = false;
    this.selectedContent = null;
    this.loadContents();
    this.showNotification('Inhalt erfolgreich gespeichert!', 'success');
  }

  /**
   * Wird ausgelöst, wenn das Bearbeiten im Modal abgebrochen wurde.
   */
  onCancelEditFromModal(): void {
    this.showContentModal = false;
    this.selectedContent = null;
  }

  /**
   * Öffnet das Bestätigungsmodal für das Löschen eines Beitrags.
   * @param content Der Beitrag, der gelöscht werden soll.
   */
  onDeleteContent(content: Post): void {
    this.postToDelete = content;
    this.showDeleteConfirmationModal = true;
  }

  /**
   * Wird aufgerufen, wenn das Löschen im Bestätigungsmodal bestätigt oder abgelehnt wurde.
   * Löscht den Beitrag bei Bestätigung.
   * @param confirmed Gibt an, ob der Benutzer das Löschen bestätigt hat.
   */
  onDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteConfirmationModal = false;

    if (confirmed && this.postToDelete && this.postToDelete.BeitragsID) {
      this.contentService.deletePost(this.postToDelete.BeitragsID).subscribe({
        next: () => {
          this.showNotification('Inhalt erfolgreich gelöscht!', 'success');
          this.loadContents();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Inhalts:', err);
          this.showNotification('Fehler beim Löschen des Inhalts.', 'error');
        }
      });
    }

    this.postToDelete = null;
  }

  /**
   * Zeigt eine Benachrichtigung für den Benutzer.
   * Wird automatisch nach 3 Sekunden wieder ausgeblendet.
   * 
   * @param message Der Nachrichtentext
   * @param type Art der Nachricht ('success' oder 'error')
   */
  showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.clearNotification();
    }, 3000);
  }

  /**
   * Entfernt die aktuell angezeigte Benachrichtigung.
   */
  clearNotification(): void {
    this.notificationMessage = null;
    this.notificationType = null;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';
import { AuthService } from '../../services/auth.service';
import { SectionFormatComponent } from '../../section-format/section-format.component';

/**
 * Komponente für das Erstellen und Bearbeiten von Beiträgen in einem Modal-Dialog.
 * Ermöglicht das Hochladen von Bildern, Eingabe von Text und Auswahl von Kategorien.
 */
@Component({
  selector: 'app-content-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SectionFormatComponent],
  templateUrl: './content-form-modal.component.html',
  styleUrls: ['./content-form-modal.component.css']
})
export class ContentFormModalComponent implements OnInit {
  /**
   * Eingabeobjekt für bestehenden Beitrag (z. B. zum Bearbeiten).
   */
  @Input() content: Partial<Post> | null = null;

  /**
   * ID des aktuell angemeldeten Benutzers. Wird benötigt zum Setzen des Autors.
   */
  @Input() currentUserId: number | null = null;

  /**
   * EventEmitter, der ausgelöst wird, wenn ein Beitrag erfolgreich gespeichert wurde.
   */
  @Output() contentSaved = new EventEmitter<Post>();

  /**
   * EventEmitter, der ausgelöst wird, wenn das Bearbeiten abgebrochen wird.
   */
  @Output() cancelEdit = new EventEmitter<void>();

  /** Formular für den Beitrag */
  postForm: FormGroup;

  /** Liste verfügbarer Kategorien (z. B. Abteilungen) */
  categories: Category[] = [];

  /** Aktuell ausgewähltes Layout/Format (z. B. nur Text, Bild mit Text, etc.) */
  selectedFormat: string = 'textBild';

  /** URL des aktuell ausgewählten/hochgeladenen Bildes */
  selectedImageURL: string = '';

  /** Steuerung der Anzeige von Erfolgsnachrichten */
  showSuccessMessage: boolean = false;

  /** Text der angezeigten Erfolgsnachricht */
  successMessageText: string = '';

  /**
   * Konstruktor injiziert notwendige Services und initialisiert das Formular.
   * @param fb FormBuilder für das Erstellen des Formulars
   * @param contentService Service für das Erstellen/Aktualisieren von Beiträgen
   * @param categoryService Service zum Laden der Kategorien
   * @param authService Service für Authentifizierung (z. B. Benutzer-ID)
   */
  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {
    this.postForm = this.fb.group({
      Titel: ['', Validators.required],
      Inhalt: ['', Validators.required],
      KategorieID: ['', Validators.required],
      Bild: ['']
    });
  }

  /**
   * Initialisiert die Komponente:
   * - Lädt Kategorien
   * - Setzt Formularwerte bei Bearbeitung
   * - Bestimmt das Format (Text/Bild) anhand der Eingabedaten
   */
  ngOnInit(): void {
    this.loadCategories();
    if (this.content) {
      this.postForm.patchValue(this.content);
      if (this.content.Bild) {
        this.selectedImageURL = this.content.Bild;
      }
      if (this.content.Bild && this.content.Inhalt) {
        this.selectedFormat = 'textBild';
      } else if (this.content.Bild) {
        this.selectedFormat = 'nurBild';
      } else if (this.content.Inhalt) {
        this.selectedFormat = 'nurText';
      }
    }
  }

  /**
   * Wird ausgelöst, wenn ein Benutzer eine Bilddatei auswählt.
   * Konvertiert das Bild in Base64 und speichert es im Formular.
   * 
   * @param event Dateiauswahl-Event des Eingabeelements
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageURL = reader.result as string;
        this.postForm.patchValue({
          Bild: this.selectedImageURL
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImageURL = '';
      this.postForm.patchValue({
        Bild: ''
      });
    }
  }

  /**
   * Lädt die verfügbaren Kategorien aus dem CategoryService.
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  /**
   * Gibt den Modus des Layouts zurück.
   * 
   * @returns Zahlencode für das gewählte Layout
   * - 1: Text + Bild
   * - 2: Bild + Text
   * - 3: Nur Text
   * - 4: Nur Bild
   */
  getMode(): 1 | 2 | 3 | 4 {
    switch (this.selectedFormat) {
      case 'textBild':
        return 1;
      case 'bildText':
        return 2;
      case 'nurText':
        return 3;
      case 'nurBild':
        return 4;
      default:
        return 1;
    }
  }

  /**
   * Beendet die Bearbeitung und gibt das entsprechende Event aus.
   */
  onCancel(): void {
    this.cancelEdit.emit();
  }

  /**
   * Validiert und speichert den Beitrag.
   * - Wenn `content` vorhanden ist, wird ein bestehender Beitrag aktualisiert.
   * - Ansonsten wird ein neuer Beitrag erstellt.
   * 
   * Zeigt nach erfolgreichem Speichern eine Benachrichtigung und emit­tet den gespeicherten Beitrag.
   * 
   * Zeigt im Fehlerfall eine entsprechende Warnung.
   */
  savePost(): void {
    if (this.postForm.valid) {
      const postData: Partial<Post> = this.postForm.value;

      if (this.currentUserId !== null) {
        postData.UserID = this.currentUserId;
      } else {
        console.log("Fehler: Benutzer-ID ist null. Kann keinen Beitrag speichern.");
        alert("Fehler: Benutzer nicht authentifiziert. Bitte melden Sie sich an.");
        return;
      }

      // Inhalt/Bild je nach Format anpassen
      if (this.selectedFormat === 'nurBild') {
        postData.Inhalt = '';
      } else if (this.selectedFormat === 'nurText') {
        postData.Bild = '';
      }

      // Bearbeitungsfall: Beitrag aktualisieren
      if (this.content && this.content.BeitragsID) {
        postData.Aenderungsdatum = new Date().toISOString();
        this.contentService.updatePost(this.content.BeitragsID, postData as Post).subscribe({
          next: savedPost => {
            this.showSuccessMessage = true;
            this.successMessageText = 'Inhalt erfolgreich aktualisiert!';
            setTimeout(() => {
              this.showSuccessMessage = false;
              this.contentSaved.emit(savedPost);
            }, 2000);
          },
          error: err => {
            console.error('Fehler beim Aktualisieren des Beitrags:', err);
            alert('Fehler beim Aktualisieren des Beitrags.');
          }
        });
      } else {
        // Neuer Beitrag: Beitrag erstellen
        postData.Erstellungsdatum = new Date().toISOString();
        this.contentService.createPost(postData as Post).subscribe({
          next: savedPost => {
            this.showSuccessMessage = true;
            this.successMessageText = 'Inhalt erfolgreich hinzugefügt!';
            setTimeout(() => {
              this.showSuccessMessage = false;
              this.contentSaved.emit(savedPost);
            }, 2000);
          },
          error: err => {
            console.error('Fehler beim Erstellen des Beitrags:', err);
            alert('Fehler beim Erstellen des Beitrags.');
          }
        });
      }
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }
}

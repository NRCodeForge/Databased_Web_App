import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe hinzugefügt für Datumformatierung
import { ContentService } from '../../services/content.service';
import { Post } from '../../models/post'; // Post-Modell korrekt importiert
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ContentFormModalComponent } from '../content-form-modal/content-form-modal.component'; // Beibehalten

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentFormModalComponent, DatePipe], // DatePipe importiert
  templateUrl: './content-manager.component.html',
  styleUrl: './content-manager.component.css'
})
export class ContentManagerComponent implements OnInit {
  contents: Post[] = []; // Typ auf Post[] geändert
  selectedContent: Partial<Post> | null = null; // Typ auf Partial<Post> geändert
  showContentModal: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private contentService: ContentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.loadContents();
  }

  loadContents(): void {
    this.contentService.getPosts().subscribe({ // Verwendet getPosts
      next: (data) => {
        this.contents = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Inhalte:', err);
      }
    });
  }

  onAddContent(): void {
    this.selectedContent = {
      Titel: '',
      Inhalt: '',
      KategorieID: 0, // Standardwert oder Platzhalter
      UserID: this.currentUserId || 0,
      Erstellungsdatum: new Date().toISOString() // Setzt Erstellungsdatum
    };
    this.showContentModal = true;
  }

  onEditContent(content: Post): void { // Typ auf Post geändert
    this.selectedContent = { ...content }; // Erstellt eine Kopie des Post-Objekts
    this.showContentModal = true;
  }

  onContentSaved(savedContent: Post): void { // Typ auf Post geändert
    this.showContentModal = false;
    this.selectedContent = null;
    this.loadContents(); // Inhalte neu laden
  }

  onCancelEditFromModal(): void { // Methode zum Abbrechen
    this.showContentModal = false;
    this.selectedContent = null;
  }

  onDeleteContent(id: number): void {
    if (confirm('Sind Sie sicher, dass Sie diesen Inhalt löschen möchten?')) {
      this.contentService.deletePost(id).subscribe({ // Verwendet deletePost
        next: () => {
          alert('Inhalt erfolgreich gelöscht!');
          this.loadContents();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Inhalts:', err);
          alert('Fehler beim Löschen des Inhalts.');
        }
      });
    }
  }
}

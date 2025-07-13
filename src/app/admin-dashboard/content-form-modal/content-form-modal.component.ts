import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule hinzufügen
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';
import { AuthService } from '../../services/auth.service';
import { SectionFormatComponent } from '../../section-format/section-format.component';

@Component({
  selector: 'app-content-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SectionFormatComponent], // FormsModule hier hinzugefügt
  templateUrl: './content-form-modal.component.html',
  styleUrls: ['./content-form-modal.component.css']
})
export class ContentFormModalComponent implements OnInit {
  @Input() content: Partial<Post> | null = null;
  @Input() currentUserId: number | null = null;
  @Output() contentSaved = new EventEmitter<Post>();
  @Output() cancelEdit = new EventEmitter<void>();

  postForm: FormGroup;
  categories: Category[] = [];
  selectedFormat: string = 'textBild';
  selectedImageURL: string = '';

  showSuccessMessage: boolean = false;
  successMessageText: string = '';

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

  ngOnInit(): void {
    this.loadCategories();
    if (this.content) {
      this.postForm.patchValue(this.content);
      if (this.content.Bild) {
        this.selectedImageURL = this.content.Bild;
      }
      // Setze selectedFormat basierend auf dem Bild und Inhalt des Posts
      if (this.content.Bild && this.content.Inhalt) {
        this.selectedFormat = 'textBild';
      } else if (this.content.Bild) {
        this.selectedFormat = 'nurBild';
      } else if (this.content.Inhalt) {
        this.selectedFormat = 'nurText';
      }
    }
  }

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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

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

  onCancel(): void {
    this.cancelEdit.emit();
  }

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

      if (this.selectedFormat === 'nurBild') {
        postData.Inhalt = '';
      } else if (this.selectedFormat === 'nurText') {
        postData.Bild = '';
      }

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

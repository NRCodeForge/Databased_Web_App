import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';
import { AuthService } from '../../services/auth.service';
import { emitKeypressEvents } from 'readline';
import { SectionFormatComponent } from '../../section-format/section-format.component';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  // KORREKTUR: Nur die benötigten Module importieren
  imports: [CommonModule, ReactiveFormsModule, SectionFormatComponent],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.css']
})
export class PostEditorComponent implements OnInit {
  // ... restlicher Code bleibt unverändert
  @Input() post: Post | null = null;
  @Output() postSaved = new EventEmitter<Post>();
  postForm: FormGroup;
  categories: Category[] = [];
  selectedFormat: string = '';
  selectedImageURL: string = '';

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
    if (this.post) {
      this.postForm.patchValue(this.post);
    }
  }

  onFileSelected(event: any) {
    // Datei-Handling hier
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
        return 1; // fallback
    }
  }


  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  savePost(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      postData.UserID = this.authService.getUserID();
      console.log('UserID:', this.authService.getUserID());
      postData.FormartID = this.getMode()
      console.log('FormartID:', postData.FormartID = this.getMode());
      if (postData.UserID != null) {
        if (this.post) {
          this.contentService.updatePost(this.post.BeitragsID, postData).subscribe(savedPost => {
            this.postSaved.emit(savedPost);
          });
        } else {
          this.contentService.createPost(postData).subscribe(savedPost => {
            this.postSaved.emit(savedPost);
          });
        }
      } else {
        console.log("User konnte nicht gefunden werden")
      }
    }
  }
}

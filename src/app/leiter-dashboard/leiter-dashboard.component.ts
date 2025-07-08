import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { CategoryService } from '../services/category.service';
import { Post } from '../models/post';
import { Category } from '../models/category';
import { AuthService } from '../services/auth.service';
import { SectionFormatComponent } from '../section-format/section-format.component';

@Component({
  selector: 'app-leiter-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionFormatComponent],
  templateUrl: './leiter-dashboard.component.html',
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent implements OnInit {
  // ... restlicher Code bleibt unverändert
  @Input() post: Post | null = null;
  @Output() postSaved = new EventEmitter<Post>();
  postForm: FormGroup;
  categories: Category[] = [];
  selectedFormat: string = 'textBild';
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        this.selectedImageURL = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
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

  savePost(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      postData.UserID = this.authService.getUserID();
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

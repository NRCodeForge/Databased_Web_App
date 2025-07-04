import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  // KORREKTUR: Nur die benötigten Module importieren
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.css']
})
export class PostEditorComponent implements OnInit {
  // ... restlicher Code bleibt unverändert
  @Input() post: Post | null = null;
  @Output() postSaved = new EventEmitter<Post>();
  postForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService: CategoryService
  ) {
    this.postForm = this.fb.group({
      Titel: ['', Validators.required],
      Inhalt: ['', Validators.required],
      KategorieID: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.post) {
      this.postForm.patchValue(this.post);
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
      if (this.post) {
        this.contentService.updatePost(this.post.BeitragsID, postData).subscribe(savedPost => {
          this.postSaved.emit(savedPost);
        });
      } else {
        this.contentService.createPost(postData).subscribe(savedPost => {
          this.postSaved.emit(savedPost);
        });
      }
    }
  }
}

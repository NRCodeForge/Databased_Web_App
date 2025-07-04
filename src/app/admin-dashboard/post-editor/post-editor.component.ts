import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post.model';
import { Category } from '../../models/category.model';
import {NewsBuilderComponent} from "../../news-builder/news-builder.component";
import {ContentManagerComponent} from "../content-manager/content-manager.component";

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  imports: [
    NewsBuilderComponent,
    ContentManagerComponent
  ],
  styleUrls: ['./post-editor.component.css']
})
export class PostEditorComponent implements OnInit {
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

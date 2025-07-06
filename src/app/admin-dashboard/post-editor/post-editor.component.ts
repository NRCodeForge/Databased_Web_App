/*
// component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  form: FormGroup;
  categories: Kategorie[] = [];

  constructor(private fb: FormBuilder, private dataService: CategoryService) {}

  ngOnInit() {
    this.dataService.getCategories().subscribe(data => {
      this.categories = data;
    });

    this.form = this.fb.group({
      sections: this.fb.array([])
    });

    this.addSection();  // Start mit einer Sektion
  }

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  addSection() {
    const sectionGroup = this.fb.group({
      title: ['', Validators.required],
      KategorieID: ['', Validators.required],
      content: [''],
      image: [null]
    });
    this.sections.push(sectionGroup);
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sections.at(index).patchValue({ image: file });
    }
  }

  save() {
    const formValue = this.form.value;
    console.log('Form Value:', formValue);

    // Beispiel: Bilder und Daten senden
    // Dafür müsstest du ein FormData bauen und an dein Backend schicken.
  }
}
*/


/*import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormArray  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';
import { AuthService } from '../../services/auth.service';
import { SectionFormatComponent } from '../../section-format/section-format.component';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionFormatComponent, FormsModule ],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.css']
})
export class PostEditorComponent implements OnInit {
  @Input() post: Post | null = null;
  @Output() postSaved = new EventEmitter<Post>();
  beitragForm: FormGroup;
  categories: Category[] = [];
  sectionnen: {
      formart: 1 | 2 | 3 | 4;
      text: string;
      imageFile: File | null;
      imagePreview: string;
    }[] = [];
  
  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService: CategoryService,
    private authService: AuthService,

  ) {
    this.beitragForm = this.fb.group({
      Titel: ['', Validators.required],
      Inhalt: ['', Validators.required],
      KategorieID: ['', Validators.required],
      Bild: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.post) {
      this.beitragForm.patchValue(this.post);
    }
  }

  get sections(): FormArray {
    return this.beitragForm.get('sections') as FormArray;
  }

  addSection() {
    this.sections.push(this.fb.group({
      formart: [1],
      text: [''],
      imageFile: [null],
      imagePreview: ['']
    }));
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const section = this.sections.at(index) as FormGroup;
        section.patchValue({
          imageFile: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  savePost(): void {
    console.log('Form valid?', this.beitragForm.valid);
    console.log('Form value:', this.beitragForm.value);
    if (this.beitragForm.valid) {
      const postData = this.beitragForm.value;
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
        console.log("User konnte nicht gefunden werden");
      }
    }
  }
}

*/



import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/content.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { Category } from '../../models/category';
import { AuthService } from '../../services/auth.service';
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


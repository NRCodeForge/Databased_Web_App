import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { CategoryService } from '../services/category.service';
import { Post } from '../models/post';
import { Category } from '../models/category';


@Component({
  selector: 'app-leiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './leiter-dashboard.component.html',
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent {
  bildDatei: File | null = null;
  categories: Category[] = [];
  beitraegeFrom: FormGroup;
  titel = '';
  inhalt = '';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private contentService: ContentService,
    private categoryService: CategoryService
  ) {
    this.beitraegeFrom = this.fb.group({
      Titel: ['', Validators.required],
      Inhalt: ['', Validators.required],
      KategorieID: ['', Validators.required],
      Bild: null
    });
  }

  onFileSelected(event: any) {
    this.bildDatei = event.target.files[0];
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  abteilungAuswahl: string = '';
  onAbteilungChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.abteilungAuswahl = selectElement.value;
    console.log('Gewählte Abteilung:', this.abteilungAuswahl);
  }
  
  speichern() {
    if (!this.bildDatei) {
      alert('Bitte ein Bild auswählen.');
      return;
    }

    const postData = this.beitraegeFrom.value;
    this.http.post('/api/beitrag-erstellen', postData).subscribe({
      next: (res) => {
        alert('Beitrag erfolgreich gespeichert!');
        this.titel = '';
        this.inhalt = '';
        this.bildDatei = null;
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Speichern des Beitrags.');
      }
    });
  }


}

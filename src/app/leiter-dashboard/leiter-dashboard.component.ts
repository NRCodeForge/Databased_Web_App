import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-leiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './leiter-dashboard.component.html',
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent {
  titel = '';
  inhalt = '';
  bildDatei: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.bildDatei = event.target.files[0];
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

    const formData = new FormData();
    formData.append('titel', this.titel);
    formData.append('inhalt', this.inhalt);
    formData.append('bild', this.bildDatei); // 👈 hier wird die Datei angehängt

    this.http.post('/api/beitrag-erstellen', formData).subscribe({
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

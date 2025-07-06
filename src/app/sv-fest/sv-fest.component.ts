import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Beitrag {
  id: number;
  titel: string;
  inhalt: string;
  datum: string;
  kategorie_id: number;
}

@Component({
  selector: 'app-sv-fest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sv-fest.component.html',
  styleUrls: ['./sv-fest.component.css']
})
export class SvFestComponent {

  beitraege: Beitrag[] = []; // Nie null, immer ein Array

  ngOnInit() {
    // Beiträge direkt beim Start laden
    this.loadBeitraege(14);
  }
  constructor(private http: HttpClient) {}

  loadBeitraege(kategorieId: number) {
    this.http
      .get<Beitrag[]>(`/api/beitraege?kategorieId=${kategorieId}`)
      .subscribe(
        (data) => {
          this.beitraege = data ?? []; // fallback falls server null sendet
        },
        (error) => {
          console.error('Fehler beim Laden der Beiträge', error);
          this.beitraege = []; // sicherheitshalber leeres Array
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // für Pipes und Direktiven
import { HttpClientModule, HttpClient } from '@angular/common/http';


interface Beitrag {
  id: number;
  titel: string;
  inhalt: string;
  datum: string;
  kategorie_id: number;
}
interface Abteilung {
  name: string;
  kategorieid: number;
}

@Component({
  selector: 'app-abteilungen',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // hier unbedingt CommonModule einfügen
  templateUrl: './abteilungen.component.html',
  styleUrls: ['./abteilungen.component.css'],
})
export class AbteilungenComponent implements OnInit {
  abteilungen: Abteilung[] = [ 
    { name: 'Bogenschießen', kategorieid: 2 },
    { name: 'Jugend & Schüler', kategorieid: 3 },
    { name: 'Pistolensport', kategorieid: 4 },
    { name: 'Senioren', kategorieid: 5 },
    { name: 'Damen', kategorieid: 6 },
    { name: 'Tradition', kategorieid: 7 }
  ];
   // Non-nullable: initial direkt erste Abteilung
  aktiveAbteilung: Abteilung;
  beitraege: Beitrag[] = []; // Nie null, immer ein Array
  constructor(private http: HttpClient) {
    // Direkt initial erste Abteilung setzen (keine nulls)
    this.aktiveAbteilung = this.abteilungen[0];
  }
    ngOnInit() {
    // Beiträge direkt beim Start laden
    this.loadBeitraege(this.aktiveAbteilung.kategorieid);
  }
   selectAbteilung(abteilung: Abteilung) {
    this.aktiveAbteilung = abteilung;
    this.loadBeitraege(abteilung.kategorieid);
  }

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


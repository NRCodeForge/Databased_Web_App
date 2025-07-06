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
interface DerVerein {
  name: string;
  kategorieid: number;
}

@Component({
  selector: 'app-der-Verein',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // hier unbedingt CommonModule einfügen
  templateUrl: './der-Verein.component.html',
  styleUrls: ['./der-verein.component.css'],
})
export class DerVereinComponent implements OnInit {
  tabs: DerVerein[] = [ 
    { name: 'Verein Infos', kategorieid: 8 },
    { name: 'Geschichte', kategorieid: 9 },
    { name: 'Vorstand', kategorieid: 10 },
    { name: 'Beiträge', kategorieid: 11 },
    { name: 'Einrichtung', kategorieid: 12 },
    { name: 'Kontakt und Anfahrt', kategorieid: 13 }
  ];
   // Non-nullable: initial direkt erste Abteilung
  aktiverTab: DerVerein;
  beitraege: Beitrag[] = []; // Nie null, immer ein Array
  constructor(private http: HttpClient) {
    // Direkt initial erste Abteilung setzen (keine nulls)
    this.aktiverTab = this.tabs[0];
  }
    ngOnInit() {
    // Beiträge direkt beim Start laden
    this.loadBeitraege(this.aktiverTab.kategorieid);
  }
   selectTab(tab: DerVerein) {
    this.aktiverTab = tab;
    this.loadBeitraege(tab.kategorieid);
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


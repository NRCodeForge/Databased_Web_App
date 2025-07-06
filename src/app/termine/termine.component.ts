import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Wichtig für das Senden mehrerer E-Mails

@Component({
  selector: 'app-termine',
  templateUrl: './termine.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./termine.component.css']
})
export class TermineComponent implements OnInit {
  termineForm: FormGroup;
  weaponTypes = ['Bogen', 'Luft-Gewehr/Pistole', 'Kleinkaliber', 'Großkaliber'];

  // NEU: Zuordnung der Disziplinen zu den E-Mail-Adressen der Abteilungsleiter
  private emailMap: { [key: string]: string } = {
    'Bogen': 'bogensportleiter@schuetzenverein-huchting.de',
    'Luft-Gewehr/Pistole': 'jugendsportleiter@schuetzenverein-huchting.de',
    'Kleinkaliber': 'vorstand3@schuetzenverein-huchting.de',
    'Großkaliber': 'vorstand3@schuetzenverein-huchting.de'
  };

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.termineForm = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', Validators.required],
      disziplinen: this.fb.array(this.weaponTypes.map(() => this.fb.control(false))),
      nachricht: ['']
    });
  }

  ngOnInit(): void {}

  onClearForm(): void {
    this.termineForm.reset();
    const disziplinenArray = this.termineForm.get('disziplinen') as FormArray;
    disziplinenArray.controls.forEach(control => control.setValue(false));
  }

  // ÜBERARBEITET: Die onSubmit-Methode zur Verarbeitung der E-Mails
  onSubmit(): void {
    this.termineForm.markAllAsTouched();

    if (this.termineForm.valid) {
      const formValue = this.termineForm.value;
      const selectedDisciplines = this.weaponTypes.filter((_, index) => formValue.disziplinen[index]);

      if (selectedDisciplines.length === 0) {
        alert('Bitte wählen Sie mindestens eine Disziplin aus.');
        return;
      }

      // 1. Benachrichtigungen für Abteilungsleiter vorbereiten
      const notifications: { [email: string]: string[] } = {};
      selectedDisciplines.forEach(discipline => {
        const email = this.emailMap[discipline];
        if (email) {
          if (!notifications[email]) {
            notifications[email] = [];
          }
          notifications[email].push(discipline);
        }
      });

      const emailRequests = [];

      // E-Mail-Anfragen für Abteilungsleiter erstellen
      for (const email in notifications) {
        const disciplines = notifications[email].join(', ');
        const leaderEmailData = {
          to: email,
          subject: `Neue Terminanfrage für: ${disciplines}`,
          text: `Hallo,\n\nes gibt eine neue Terminanfrage von ${formValue.vorname} ${formValue.nachname}.\n\nKontaktdaten:\nE-Mail: ${formValue.email}\nTelefon: ${formValue.telefon}\n\nAngeforderte Disziplinen: ${disciplines}\n\nNachricht:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nBitte kontaktieren Sie die Person, um einen Termin zu vereinbaren.\n\nMit freundlichen Grüßen,\nIhr Webseiten-Bot`
        };
        emailRequests.push(this.http.post('/api/send-email', leaderEmailData));
      }

      // 2. Bestätigungs-E-Mail für den Benutzer vorbereiten
      const userEmailData = {
        to: formValue.email,
        subject: 'Ihre Terminanfrage beim Schützenverein Huchting',
        text: `Hallo ${formValue.vorname} ${formValue.nachname},\n\nvielen Dank für Ihre Terminanfrage. Wir haben Ihre Anfrage für die folgenden Disziplinen erhalten:\n${selectedDisciplines.join(', ')}\n\nEin zuständiger Abteilungsleiter wird sich in Kürze mit Ihnen in Verbindung setzen.\n\nIhre Nachricht an uns:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nMit freundlichen Grüßen,\nIhr Schützenverein Huchting`
      };
      emailRequests.push(this.http.post('/api/send-email', userEmailData));

      // 3. Alle E-Mails gleichzeitig senden
      forkJoin(emailRequests).subscribe({
        next: () => {
          alert('Ihre Terminanfrage wurde erfolgreich versendet! Sie erhalten eine Bestätigungs-E-Mail.');
          this.onClearForm();
        },
        error: (err) => {
          console.error('Fehler beim Senden der E-Mails:', err);
          alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
        }
      });

    } else {
      alert('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
    }
  }
}

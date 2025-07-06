import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Wichtig für das Senden mehrerer E-Mails
import { CommonModule } from '@angular/common'; // Stellen Sie sicher, dass CommonModule importiert ist

@Component({
  selector: 'app-termine',
  templateUrl: './termine.component.html',
  standalone: true, // Stellen Sie sicher, dass dies auf 'true' gesetzt ist, wenn Sie Angular 15+ verwenden
  imports: [
    ReactiveFormsModule,
    CommonModule // CommonModule ist für *ngIf, *ngFor usw. erforderlich
  ],
  styleUrls: ['./termine.component.css']
})
export class TermineComponent implements OnInit {
  termineForm: FormGroup;
  weaponTypes = ['Bogen', 'Luft-Gewehr/Pistole', 'Kleinkaliber', 'Großkaliber'];

  // Zuordnung der Disziplinen zu den E-Mail-Adressen der Abteilungsleiter
  private emailMap: { [key: string]: string } = {
    'Bogen': 'bogensportleiter@schuetzenverein-huchting.de',
    'Luft-Gewehr/Pistole': 'jugendsportleiter@schuetzenverein-huchting.de',
    'Kleinkaliber': 'vorstand3@schuetzenverein-huchting.de',
    'Großkaliber': 'vorstand3@schuetzenverein-huchting.de'
  };

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.termineForm = this.fb.group({
      anrede: ['', Validators.required],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.pattern(/^\+?\d{6,15}$/)]], // Optional: Anpassung des Regex je nach Anforderungen
      wunschtermin: [''], // Kein Validator, da optional
      disziplinen: this.fb.array([], this.minSelectedCheckboxes(1)), // Wichtig: FormArray hier initialisieren
      nachricht: [''], // Kein Validator, da optional
      captcha: ['', Validators.required] // Captcha-Feld
    });
  }

  ngOnInit(): void {
    // Diese Methode muss aufgerufen werden, um die Checkboxen im FormArray zu initialisieren
    this.addDisziplinenCheckboxes();
  }

  // Hilfsmethode zum Hinzufügen der Checkbox-Controls zum FormArray
  private addDisziplinenCheckboxes(): void {
    this.weaponTypes.forEach(() => {
      this.disziplinenFormArray.push(this.fb.control(false));
    });
  }

  // Getter, um einfacher auf das disziplinen FormArray zugreifen zu können
  get disziplinenFormArray(): FormArray {
    return this.termineForm.get('disziplinen') as FormArray;
  }

  // Custom Validator, um sicherzustellen, dass mindestens eine Checkbox ausgewählt ist
  private minSelectedCheckboxes(min: number): ValidatorFn {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalSelected = formArray.controls
          .map(control => control.value)
          .reduce((prev, next) => next ? prev + 1 : prev, 0);
        return totalSelected >= min ? null : { minSelectedCheckboxes: { valid: false } };
      }
      // Sollte nicht erreicht werden, wenn der Validator auf ein FormArray angewendet wird
      throw new Error('minSelectedCheckboxes-Validator muss auf ein FormArray angewendet werden.');
    };
    return validator;
  }

  onSubmit(): void {
    this.termineForm.markAllAsTouched(); // Markiert alle Felder als 'touched', um Validierungsnachrichten anzuzeigen

    // Überprüfen des Captcha-Textes
    const captchaControl = this.termineForm.get('captcha');
    if (captchaControl && captchaControl.value.toLowerCase() !== 'ziel') {
      captchaControl.setErrors({ 'incorrect': true });
    } else if (captchaControl) {
      captchaControl.setErrors(null); // Captcha ist korrekt
    }

    if (this.termineForm.valid) {
      const formValue = this.termineForm.value;
      const emailRequests = [];
      const selectedDisciplines: string[] = [];
      const relevantLeaderEmails = new Set<string>(); // Verwendet ein Set, um doppelte E-Mails zu vermeiden

      this.disziplinenFormArray.controls.forEach((control, i) => {
        if (control.value) { // Wenn die Checkbox ausgewählt ist
          const discipline = this.weaponTypes[i];
          selectedDisciplines.push(discipline);
          const leaderEmail = this.emailMap[discipline];
          if (leaderEmail) {
            relevantLeaderEmails.add(leaderEmail); // Fügt die E-Mail zum Set hinzu
          }
        }
      });

      if (selectedDisciplines.length === 0) {
        // Dies sollte durch den minSelectedCheckboxes Validator abgefangen werden,
        // aber als Fallback kann man hier eine Meldung anzeigen
        alert('Bitte wählen Sie mindestens eine Disziplin aus.');
        return;
      }

      // E-Mails an die zuständigen Abteilungsleiter vorbereiten
      relevantLeaderEmails.forEach(email => {
        const leaderEmailData = {
          to: email,
          subject: `Neue Terminanfrage für ${selectedDisciplines.join(', ')}`,
          text: `Hallo Abteilungsleiter/in,\n\nSie haben eine neue Terminanfrage von ${formValue.anrede} ${formValue.vorname} ${formValue.nachname}.\n\nKontaktdaten:\nE-Mail: ${formValue.email}\nTelefon: ${formValue.telefon || 'Nicht angegeben'}\n\nGewünschter Termin: ${formValue.wunschtermin || 'Kein spezifischer Wunschtermin'}\nGewählte Disziplinen: ${selectedDisciplines.join(', ')}\n\nNachricht des Anfragenden:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nBitte kontaktieren Sie die Person, um einen Termin zu vereinbaren.\n\nMit freundlichen Grüßen,\nIhr Webseiten-Bot`
        };
        emailRequests.push(this.http.post('/api/send-email', leaderEmailData));
      });


      // Bestätigungs-E-Mail für den Benutzer vorbereiten
      const userEmailData = {
        to: formValue.email,
        subject: 'Ihre Terminanfrage beim Schützenverein Huchting',
        text: `Hallo ${formValue.vorname} ${formValue.nachname},\n\nvielen Dank für Ihre Terminanfrage. Wir haben Ihre Anfrage für die folgenden Disziplinen erhalten:\n${selectedDisciplines.join(', ')}\n\nEin zuständiger Abteilungsleiter wird sich in Kürze mit Ihnen in Verbindung setzen.\n\nIhre Nachricht an uns:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nMit freundlichen Grüßen,\nIhr Schützenverein Huchting`
      };
      emailRequests.push(this.http.post('/api/send-email', userEmailData));

      // Alle E-Mails gleichzeitig senden
      forkJoin(emailRequests).subscribe({
        next: () => {
          alert('Ihre Terminanfrage wurde erfolgreich versendet! Sie erhalten eine Bestätigungs-E-Mail.');
          this.onClearForm();
        },
        error: (err) => {
          console.error('Fehler beim Senden der E-Mails:', err);
          alert('Es ist ein Fehler beim Versenden Ihrer Anfrage aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
        }
      });
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder korrekt aus und bestätigen Sie das Captcha.');
    }
  }

  onClearForm(): void {
    this.termineForm.reset();
    // Setzt die FormArray-Controls zurück, da reset() sie nicht leert
    while (this.disziplinenFormArray.length !== 0) {
      this.disziplinenFormArray.removeAt(0);
    }
    // Nach dem Reset die Checkboxen neu initialisieren
    this.addDisziplinenCheckboxes();
  }
}
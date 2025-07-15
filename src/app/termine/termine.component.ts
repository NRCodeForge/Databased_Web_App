import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Wichtig für das Senden mehrerer E-Mails
import { CommonModule } from '@angular/common'; // Stellen Sie sicher, dass CommonModule importiert ist

/**
 * Komponente zur Verwaltung von Termin-Anfragen für verschiedene Disziplinen.
 *
 * @remarks
 * Die Komponente enthält ein Formular mit Validierungen, versendet E-Mails
 * an zuständige Abteilungsleiter und eine Bestätigung an den Nutzer.
 */
@Component({
  selector: 'app-termine',
  templateUrl: './termine.component.html',
  standalone: true, // Angular 15+ standalone Komponente
  imports: [
    ReactiveFormsModule,
    CommonModule // Für *ngIf, *ngFor usw.
  ],
  styleUrls: ['./termine.component.css']
})
export class TermineComponent implements OnInit {
  /** Formulargruppe für die Terminanfrage */
  termineForm: FormGroup;

  /** Mögliche Disziplinen (Waffentypen) für die Terminauswahl */
  weaponTypes = ['Bogen', 'Luft-Gewehr/Pistole', 'Kleinkaliber', 'Großkaliber'];

  /** Zuordnung der Disziplinen zu E-Mail-Adressen der Abteilungsleiter */
  private emailMap: { [key: string]: string } = {
    'Bogen': 'bogensportleiter@schuetzenverein-huchting.de',
    'Luft-Gewehr/Pistole': 'jugendsportleiter@schuetzenverein-huchting.de',
    'Kleinkaliber': 'vorstand3@schuetzenverein-huchting.de',
    'Großkaliber': 'vorstand3@schuetzenverein-huchting.de'
  };

  /**
   * Konstruktor mit Dependency Injection von FormBuilder, Router und HttpClient.
   *
   * @param fb FormBuilder zum Erstellen von Formulargruppen
   * @param router Router für Navigation (derzeit nicht verwendet)
   * @param http HttpClient für HTTP-Anfragen (z.B. E-Mail Versand)
   */
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.termineForm = this.fb.group({
      anrede: ['', Validators.required],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.pattern(/^\+?\d{6,15}$/)]], // Optionales Muster für Telefonnummern
      dateOfBirth: ['', Validators.required], // Optionales Feld ohne Validator
      disziplinen: this.fb.array([], this.minSelectedCheckboxes(1)), // Mindestens eine Checkbox muss ausgewählt sein
      nachricht: [''], // Optionales Textfeld
      captcha: ['', Validators.required] // Captcha als Pflichtfeld
    });
  }

  /**
   * Angular Lifecycle Hook.
   * Initialisiert die Checkboxen im FormArray für die Disziplinen.
   */
  ngOnInit(): void {
    this.addDisziplinenCheckboxes();
  }

  /**
   * Fügt für jede Disziplin eine Checkbox zum FormArray hinzu.
   */
  private addDisziplinenCheckboxes(): void {
    this.weaponTypes.forEach(() => {
      this.disziplinenFormArray.push(this.fb.control(false));
    });
  }

  /**
   * Getter für das FormArray der Disziplinen-Checkboxen.
   */
  get disziplinenFormArray(): FormArray {
    return this.termineForm.get('disziplinen') as FormArray;
  }

  /**
   * Custom Validator, der sicherstellt, dass mindestens `min` Checkboxen ausgewählt sind.
   *
   * @param min Minimale Anzahl an ausgewählten Checkboxen
   * @returns ValidatorFn für FormArray
   * @throws Error wenn Validator nicht auf FormArray angewendet wird
   */
  private minSelectedCheckboxes(min: number): ValidatorFn {
    return (formArray: AbstractControl) => {
      if (!(formArray instanceof FormArray)) {
        throw new Error('minSelectedCheckboxes-Validator muss auf ein FormArray angewendet werden.');
      }

      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + 1 : prev, 0);

      return totalSelected >= min ? null : { minSelectedCheckboxes: { valid: false } };
    };
  }

  /**
   * Event-Handler für das Absenden des Formulars.
   *
   * Validiert das Formular inklusive Captcha,
   * versendet E-Mails an Abteilungsleiter und Bestätigung an den Nutzer,
   * zeigt Erfolgs- oder Fehlermeldungen an und leert das Formular bei Erfolg.
   */
  onSubmit(): void {
    this.termineForm.markAllAsTouched(); // Alle Felder als "berührt" markieren für Validierung

    // Captcha-Validierung (der korrekte Wert ist "ziel")
    const captchaControl = this.termineForm.get('captcha');
    if (captchaControl && captchaControl.value.toLowerCase() !== 'ziel') {
      captchaControl.setErrors({ incorrect: true });
    } else if (captchaControl) {
      captchaControl.setErrors(null);
    }

    if (this.termineForm.valid) {
      const formValue = this.termineForm.value;
      const emailRequests = [];
      const selectedDisciplines: string[] = [];
      const relevantLeaderEmails = new Set<string>();

      // Ausgewählte Disziplinen ermitteln und zugehörige E-Mails sammeln
      this.disziplinenFormArray.controls.forEach((control, i) => {
        if (control.value) {
          const discipline = this.weaponTypes[i];
          selectedDisciplines.push(discipline);
          const leaderEmail = this.emailMap[discipline];
          if (leaderEmail) {
            relevantLeaderEmails.add(leaderEmail);
          }
        }
      });

      if (selectedDisciplines.length === 0) {
        alert('Bitte wählen Sie mindestens eine Disziplin aus.');
        return;
      }

      // E-Mail-Anfragen an Abteilungsleiter vorbereiten
      relevantLeaderEmails.forEach(email => {
        const leaderEmailData = {
          to: email,
          subject: `Neue Terminanfrage für ${selectedDisciplines.join(', ')}`,
          text: `Hallo Abteilungsleiter/in,\n\nSie haben eine neue Terminanfrage von ${formValue.anrede} ${formValue.vorname} ${formValue.nachname}.\n\nKontaktdaten:\nE-Mail: ${formValue.email}\nTelefon: ${formValue.telefon || 'Nicht angegeben'}\nGeburtsdatum: ${formValue.dateOfBirth.toString()}\nGewählte Disziplinen: ${selectedDisciplines.join(', ')}\n\nNachricht des Anfragenden:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nBitte kontaktieren Sie die Person, um einen Termin zu vereinbaren.\n\nMit freundlichen Grüßen,\nIhr Webseiten-Bot`
        };
        emailRequests.push(this.http.post('/api/send-email', leaderEmailData));
      });

      // Bestätigungs-E-Mail an den Nutzer vorbereiten
      const userEmailData = {
        to: formValue.email,
        subject: 'Ihre Terminanfrage beim Schützenverein Huchting',
        text: `Hallo ${formValue.vorname} ${formValue.nachname},\n\nvielen Dank für Ihre Terminanfrage. Wir haben Ihre Anfrage für die folgenden Disziplinen erhalten:\n${selectedDisciplines.join(', ')}\n\nEin zuständiger Abteilungsleiter wird sich in Kürze mit Ihnen in Verbindung setzen.\n\nIhre Nachricht an uns:\n${formValue.nachricht || 'Keine Nachricht hinterlassen.'}\n\nMit freundlichen Grüßen,\nIhr Schützenverein Huchting`
      };
      emailRequests.push(this.http.post('/api/send-email', userEmailData));

      // Alle E-Mails parallel senden
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

  /**
   * Setzt das Formular zurück und initialisiert die Checkboxen erneut.
   */
  onClearForm(): void {
    this.termineForm.reset();
    // Entfernt alle Controls aus dem FormArray, da reset() diese nicht leert
    while (this.disziplinenFormArray.length !== 0) {
      this.disziplinenFormArray.removeAt(0);
    }
    this.addDisziplinenCheckboxes();
  }
}

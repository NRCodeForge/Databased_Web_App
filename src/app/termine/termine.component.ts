// src/app/termine/termine.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Hilfsfunktion: Custom Validator, um sicherzustellen, dass mindestens eine Checkbox ausgewählt ist
function minSelectedCheckboxes(min = 1): ValidatorFn {
  const validator: ValidatorFn = (formArray: AbstractControl) => {
    if (formArray instanceof FormArray) {
      const totalChecked = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0); // Zählt, wie viele true sind
      return totalChecked >= min ? null : { required: true, minSelectedCheckboxes: true };
    }
    throw new Error('FormArray muss übergeben werden.');
  };
  return validator;
}

@Component({
  selector: 'app-termine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './termine.component.html',
  styleUrls: ['./termine.component.css']
})
export class TermineComponent implements OnInit {
  termineForm: FormGroup;
  weaponTypes: string[] = [
    'Bogen',
    'Luftpistole',
    'Gewehr',
    'Sportpistole',
    'Großkaliber - 9mm',
    'Großkaliber - 357 Mag.',
    'Großkaliber - 44 Mag',
    'Großkaliber - 45 ACP'
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.termineForm = this.fb.group({
      anrede: ['', Validators.required],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', Validators.required],
      anschrift: [''], // <-- KEIN Validators.required mehr
      plz: ['', [Validators.pattern(/^\d{5}$/)]], // <-- KEIN Validators.required mehr, nur Musterprüfung
      ort: [''], // <-- KEIN Validators.required mehr
      email: ['', [Validators.required, Validators.email]],
      disziplinen: this.fb.array([], minSelectedCheckboxes(1)),
      nachricht: [''],
      captcha: ['', Validators.required]
    });

    this.addDisziplinenCheckboxes();
  }

  ngOnInit(): void { }

  get disziplinenFormArray(): FormArray {
    return this.termineForm.get('disziplinen') as FormArray;
  }

  private addDisziplinenCheckboxes(): void {
    this.weaponTypes.forEach(() => this.disziplinenFormArray.push(new FormControl(false)));
  }

  onCheckboxChange(event: any, index: number): void {
    console.log(`Checkbox ${this.weaponTypes[index]} ist jetzt: ${event.target.checked}`);
  }

  onSubmit(): void {
    this.termineForm.markAllAsTouched();

    if (this.termineForm.valid) {
      const formValue = this.termineForm.value;
      const selectedDisciplines = this.weaponTypes.filter((type, index) => formValue.disziplinen[index]);

      const dataToSend = {
        ...formValue,
        disziplinen: selectedDisciplines
      };

      console.log('Formular erfolgreich gesendet:', dataToSend);
      alert('Terminanfrage gesendet (siehe Konsole für Daten)!');
      this.onClearForm();
    } else {
      console.log('Formular ist ungültig. Bitte überprüfen Sie die Eingaben.');
      alert('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
    }
  }

  onClearForm(): void {
    this.termineForm.reset();
    this.disziplinenFormArray.controls.forEach(control => control.setValue(false));
    this.termineForm.markAsUntouched();
    this.termineForm.markAsPristine();
  }
}
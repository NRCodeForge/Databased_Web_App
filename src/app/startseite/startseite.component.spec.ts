import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartseiteComponent } from './startseite.component';

// Wir testen hier unsere Startseiten-Komponente, um sicherzustellen, dass alles funktioniert.
describe('StartseiteComponent', () => {
  let component: StartseiteComponent;
  let fixture: ComponentFixture<StartseiteComponent>;

  // Bevor jeder Test losgeht, bereiten wir hier alles vor.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartseiteComponent]
    })
    .compileComponents(); // Wir kompilieren unsere Komponente.

    fixture = TestBed.createComponent(StartseiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Angular soll die Änderungen erkennen.
  });

  // Ein einfacher Test: Gucken, ob die Komponente überhaupt erstellt wird.
  it('should create', () => {
    expect(component).toBeTruthy(); // Es sollte da sein!
  });
});
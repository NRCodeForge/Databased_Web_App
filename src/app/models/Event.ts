/**
 * @file Dieses Modul definiert die Schnittstelle `Event` für Veranstaltungen und eine
 * Hilfsfunktion zum Parsen von Veranstaltungsdaten aus einer CSV-Zeichenkette.
 */

/**
 * Schnittstelle zur Beschreibung eines einzelnen Events, das aus einer CSV-Zeile extrahiert wird.
 *
 * @export
 * @interface Event
 */
export interface Event {
  /**
   * Das Datum des Events im Format 'YYYY-MM-DD'.
   * Kann auch ein Datumsbereich sein (z.B. '2025-10-01 - 2025-10-19').
   */
  date: string;

  /**
   * Die Uhrzeit des Events (z.B. '09:00 Uhr', 'ganztägig').
   * Kann leer sein.
   */
  time: string;

  /**
   * Haupttitel oder Name des Events.
   */
  title: string;

  /**
   * Zusätzliche Bemerkungen oder Untertitel des Events.
   * Kann leer sein.
   */
  subtitle: string;

  /**
   * Liste der Kategorien oder "Modi", die für das Event gelten.
   */
  modes: string[];
}

/**
 * Mapping zwischen CSV-Spaltenindices (1-7) und deren beschreibenden Kategorien.
 * Hinweis: Beim Parsen aus der CSV entsprechen diese den 0-indizierten Spalten im Array.
 */
const modeMapping: { [key: number]: string } = {
  1: 'Arbeitseinsatz',
  2: 'Vereinstracht',
  3: 'Halle belegt',
  4: 'Empfang der Vereine',
  5: 'Geselligkeit',
  6: 'Versammlung',
  7: 'Schießwettbewerb',
};

/**
 * Parsen einer CSV-Zeichenkette mit Veranstaltungsdaten in ein Array von `Event`-Objekten.
 *
 * @param csvString Die komplette CSV-Datei als String.
 * @returns Ein Array von `Event`-Objekten, die aus der CSV extrahiert wurden.
 */
export function importEventsFromCsv(csvString: string): Event[] {
  const events: Event[] = [];
  const lines = csvString.split('\n');

  // Ermitteln der Datenstart- und Endzeile (heuristisch)
  let dataStartRow = -1;
  let dataEndRow = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Mon,Datum,Uhrzeit,Veranstaltung')) {
      dataStartRow = i + 1; // Daten starten in der nächsten Zeile nach der Überschrift
      continue;
    }
    if (line.startsWith('ÜBERSCHRIFT') || line.startsWith('Termin muss noch geklärt werden')) {
      dataEndRow = i; // Daten enden vor diesen Zeilen
      break;
    }
  }

  if (dataStartRow === -1) {
    console.warn("Konnte die Datenüberschrift 'Mon,Datum,Uhrzeit,Veranstaltung' nicht finden. Parsing könnte ungenau sein.");
    dataStartRow = 0; // Versuch, vom Anfang zu parsen, falls Header fehlt
  }

  // Verarbeitung der relevanten Datenzeilen
  for (let i = dataStartRow; i < dataEndRow; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue; // Leere Zeilen überspringen
    }

    // Einfache Trennung durch Komma (ohne Berücksichtigung von Anführungszeichen)
    const columns = line.split(',');

    // Indizes der erwarteten Spalten (0-basiert)
    const DATE_COL_IDX = 1;
    const TIME_COL_IDX = 2;
    const TITLE_COL_IDX = 3;
    const SUBTITLE_COL_IDX = 4;
    const MODES_START_COL_IDX = 5; // Spalte '1' in der CSV entspricht Index 5

    const rawDate = columns[DATE_COL_IDX]?.trim() || '';
    const rawTitle = columns[TITLE_COL_IDX]?.trim() || '';

    // Überspringen von Zeilen, die keine Events darstellen
    if (
      (!rawDate && !rawTitle) ||
      rawTitle.includes('INTERNES ***') ||
      rawTitle.includes('ENTFÄLLT') ||
      rawTitle.includes('Findet stattfinden wenn') ||
      rawTitle.includes('Schützenfesttermine') ||
      rawTitle.includes('Alternativ Termin') ||
      rawDate.toLowerCase() === 'xxx'
    ) {
      continue;
    }

    const eventDate = rawDate;
    const eventTime = columns[TIME_COL_IDX]?.trim() || '';
    const eventTitle = rawTitle;
    const eventSubtitle = columns[SUBTITLE_COL_IDX]?.trim() || '';

    const currentModes: string[] = [];
    for (let j = 0; j < 7; j++) {
      const modeColIdx = MODES_START_COL_IDX + j;
      if (columns[modeColIdx]?.trim().toLowerCase() === 'x') {
        currentModes.push(modeMapping[j + 1]);
      }
    }

    const event: Event = {
      date: eventDate,
      time: eventTime,
      title: eventTitle,
      subtitle: eventSubtitle,
      modes: currentModes,
    };
    events.push(event);
  }

  return events;
}

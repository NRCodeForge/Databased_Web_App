/**
 * @file This file defines the TypeScript interface for an event and a utility function
 * to parse event data from a CSV string.
 */

/**
 * Interface representing a single event parsed from the CSV.
 */
export interface Event {
  /** The date of the event in 'YYYY-MM-DD' format. Can be a range (e.g., '2025-10-01 - 2025-10-19'). */
  date: string;
  /** The time of the event (e.g., '09:00 Uhr', 'ganztägig'). Can be empty. */
  time: string;
  /** The main title or name of the event. */
  title: string;
  /** Additional remarks or a subtitle for the event. Can be empty. */
  subtitle: string;
  /** An array of categories or 'modes' that apply to the event. */
  modes: string[];
}

/**
 * Defines the mapping between CSV column indices (1-7) and their corresponding mode descriptions.
 * Note: When parsing from a CSV, these will correspond to 0-indexed columns in the parsed row array.
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
 * Parses a CSV string containing event data into an array of Event objects.
 *
 * @param csvString The full content of the CSV file as a string.
 * @returns An array of `Event` objects.
 */
export function importEventsFromCsv(csvString: string): Event[] {
  const events: Event[] = [];
  const lines = csvString.split('\n');

  // Determine actual data start and end rows.
  // This is a heuristic and might need adjustment if CSV structure changes significantly.
  let dataStartRow = -1;
  let dataEndRow = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Mon,Datum,Uhrzeit,Veranstaltung')) {
      dataStartRow = i + 1; // Data starts from the next line after the header
      continue;
    }
    // Heuristic for the start of the footer/metadata
    if (line.startsWith('ÜBERSCHRIFT') || line.startsWith('Termin muss noch geklärt werden')) {
      dataEndRow = i; // Data ends before these lines
      break;
    }
  }

  if (dataStartRow === -1) {
    console.warn("Could not find data header 'Mon,Datum,Uhrzeit,Veranstaltung'. Parsing might be inaccurate.");
    dataStartRow = 0; // Attempt to parse from the beginning if header not found
  }

  // Iterate over relevant lines for event data
  for (let i = dataStartRow; i < dataEndRow; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue; // Skip empty lines
    }

    // A simple split by comma might fail if commas are within quoted fields.
    // For robust CSV parsing, a dedicated CSV parser library is recommended (e.g., 'csv-parse' for Node.js, or similar for browser).
    // For this example, we'll assume no commas within fields or that simple split is sufficient.
    const columns = line.split(',');

    // Expected 0-indexed column positions after splitting
    // Based on "Mon,Datum,Uhrzeit,Veranstaltung,Bemerkung / Info,1,2,3,4,5,6,7"
    const DATE_COL_IDX = 1;
    const TIME_COL_IDX = 2;
    const TITLE_COL_IDX = 3;
    const SUBTITLE_COL_IDX = 4;
    const MODES_START_COL_IDX = 5; // Column '1' in CSV maps to index 5

    // Basic validation and skipping of non-event rows
    const rawDate = columns[DATE_COL_IDX]?.trim() || '';
    const rawTitle = columns[TITLE_COL_IDX]?.trim() || '';

    // Skip rows that are clearly not events (e.g., internal notes, empty entries, alternative dates)
    if (
      !rawDate && !rawTitle || // Entirely empty row (beyond initial empty ones)
      rawTitle.includes('INTERNES ***') ||
      rawTitle.includes('ENTFÄLLT') ||
      rawTitle.includes('Findet stattfinden wenn') ||
      rawTitle.includes('Schützenfesttermine') ||
      rawTitle.includes('Alternativ Termin') ||
      rawDate.toLowerCase() === 'xxx' // Row with 'xxx' date
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
        currentModes.push(modeMapping[j + 1]); // j+1 to match 1-indexed modeMapping keys
      }
    }

    // Construct the event object
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

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../environments/environment';

const WEEKDAY_HEADERS = ['S', 'M', 'T', 'W', 'R', 'F', 'S'] as const;

interface RetailCalendarResponse {
  requestedYear: number;
  years: number[];
  astwcal1: RetailCalendarApiRow[];
  gltparm3: Record<string, unknown>[];
}

interface RetailCalendarApiRow {
  LINE_NO: number;
  MONTH: string;
  WEEK_NO: string;
  [key: string]: string | number | null | undefined;
}

interface RetailCalendarDisplayCell {
  year: number;
  days: string[];
}

interface RetailCalendarDisplayRow {
  lineNo: number;
  month: string;
  weekNo: string;
  spacer: boolean;
  cells: RetailCalendarDisplayCell[];
}

@Component({
  selector: 'app-retail-calendar',
  imports: [FormsModule],
  templateUrl: './retail-calendar.component.html',
  styleUrl: './retail-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailCalendarComponent {
  private readonly currentYear = new Date().getFullYear();

  readonly weekdayHeaders = WEEKDAY_HEADERS;
  readonly yearInput = signal(String(this.currentYear - 2));
  readonly submittedYear = signal(this.currentYear - 2);
  readonly validationError = signal('');
  readonly tempURL = 'https://ngrok.robertwall.info/api/VAN/EC/GetRetailCalendar';
  readonly resource = httpResource<RetailCalendarResponse>(() => ({
    url: `${this.tempURL}/${this.submittedYear()}`,
  }));

  readonly errorText = computed(() => {
    const error = this.resource.error();
    if (!error) {
      return '';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  });

  readonly calendarYears = computed(() => {
    const responseYears = this.resource.value()?.years;
    if (responseYears?.length === 5) {
      return responseYears;
    }

    const startYear = this.submittedYear();
    return Array.from({ length: 5 }, (_, index) => startYear + index);
  });

  readonly calendarRows = computed<RetailCalendarDisplayRow[]>(() => {
    const years = this.calendarYears();
    const rows = this.resource.value()?.astwcal1 ?? [];

    return rows.map((row) => ({
      lineNo: Number(row.LINE_NO ?? 0),
      month: String(row.MONTH ?? ''),
      weekNo: String(row.WEEK_NO ?? ''),
      spacer: !String(row.WEEK_NO ?? '').trim(),
      cells: years.map((year, yearIndex) => ({
        year,
        days: WEEKDAY_HEADERS.map((_, dayIndex) => this.readDateCell(row, yearIndex + 1, dayIndex + 1)),
      })),
    }));
  });

  readonly rawRows = computed(() => this.resource.value()?.gltparm3 ?? []);

  readonly rawColumns = computed(() => {
    const rows = this.rawRows();
    const discovered = new Set<string>();

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        discovered.add(key);
      }
    }

    const preferredOrder = ['YYYYWW', 'YYYYMM', 'REL_WEEK', 'MAX_WEEK', 'WEEK_END_DATE'];
    const ordered = preferredOrder.filter((column) => discovered.has(column));

    for (const column of Array.from(discovered).sort()) {
      if (!ordered.includes(column)) {
        ordered.push(column);
      }
    }

    return ordered;
  });

  onSubmit(event: Event): void {
    event.preventDefault();

    const parsedYear = Number(this.yearInput().trim());
    if (!Number.isInteger(parsedYear) || this.yearInput().trim().length !== 4) {
      this.validationError.set('Enter a 4-digit year.');
      return;
    }

    if (parsedYear < this.currentYear - 20 || parsedYear > this.currentYear + 20) {
      this.validationError.set(`Year must be between ${this.currentYear - 20} and ${this.currentYear + 20}.`);
      return;
    }

    this.validationError.set('');
    this.submittedYear.set(parsedYear);
  }

  formatRawValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return JSON.stringify(value);
  }

  private readDateCell(row: RetailCalendarApiRow, yearSlot: number, daySlot: number): string {
    const key = `DATE_${yearSlot}${daySlot}`;
    const value = row[key];
    return value === null || value === undefined ? '' : String(value);
  }
}

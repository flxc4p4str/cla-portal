import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxButtonModule, IgxDatePickerModule, IgxGridModule, IgxInputGroupModule } from '@infragistics/igniteui-angular';

import { CustomerInquiryCustomer, CustomerInquiryLog, CustomerInquiryShipTo } from '../../data/customer-inquiry.models';

interface LogSelectionEvent {
  newSelection: CustomerInquiryLog[];
}

@Component({
  selector: 'app-customer-inquiry-log',
  standalone: true,
  imports: [FormsModule, IgxButtonModule, IgxDatePickerModule, IgxGridModule, IgxInputGroupModule],
  template: `
    <section class="log-tab">
      <section class="top-layout">
        <section class="panel grid-panel">
          <header class="panel-header">Customer Logs</header>

          <igx-grid
            [data]="filteredLogs()"
            [primaryKey]="'convNo'"
            [rowSelection]="'single'"
            [height]="'365px'"
            [autoGenerate]="false"
            (rowSelectionChanging)="onLogSelection($event)"
          >
            <igx-column field="logged" header="Logged" dataType="date" [width]="'125px'"></igx-column>
            <igx-column field="by" header="By" [width]="'110px'"></igx-column>
            <igx-column field="shipToNo" header="Ship To" [width]="'95px'"></igx-column>
            <igx-column field="contact" header="Contact" [width]="'180px'"></igx-column>
            <igx-column field="logCode" header="Log Code" [width]="'105px'"></igx-column>
            <igx-column field="logDesc" header="Log Desc" [width]="'160px'"></igx-column>
            <igx-column field="notes" header="Notes" [width]="'420px'"></igx-column>
            <igx-column field="jobNo" header="Job No" [width]="'105px'"></igx-column>
            <igx-column field="orderNo" header="Order No" [width]="'110px'"></igx-column>
            <igx-column field="lastStatus" header="Last Status" [width]="'125px'"></igx-column>
          </igx-grid>
        </section>

        <aside class="panel filter-panel">
          <header class="panel-header">Load Logs</header>

          <div class="filter-stack">
            <igx-date-picker [(ngModel)]="fromDateValue">
              <label igxLabel>From</label>
            </igx-date-picker>

            <igx-date-picker [(ngModel)]="toDateValue">
              <label igxLabel>To</label>
            </igx-date-picker>

            <button igxButton="contained" type="button" (click)="applyFilter()">Fetch Data</button>
            <button igxButton="outlined" type="button" (click)="clearFilter()">Clear</button>
          </div>

          <div class="filter-summary">
            <div><span class="mini-label">Loaded</span>{{ logs().length }}</div>
            <div><span class="mini-label">Showing</span>{{ filteredLogs().length }}</div>
          </div>

          <div class="muted-note">
            First pass filters client-side against mock data. Later this becomes the API query range.
          </div>
        </aside>
      </section>

      <section class="detail-layout">
        <section class="panel conversation-panel">
          <header class="panel-header">Conversation</header>

          @if (selectedLog(); as log) {
            <div class="detail-grid compact">
              <label>Customer</label>
              <div class="field-value strong">{{ customer().custCode }} - {{ customer().custName }}</div>

              <label>Ship To</label>
              <div class="field-value">{{ shipToDisplay(log.shipToNo) }}</div>

              <label>Conv Date</label>
              <div class="field-value">{{ formatDate(log.logged) }}</div>

              <label>Contact</label>
              <div class="field-value">{{ log.contact || '-' }}</div>

              <label>Log Code</label>
              <div class="field-value">{{ log.logCode || '-' }} {{ log.logDesc ? '- ' + log.logDesc : '' }}</div>

              <label>Follow Up</label>
              <div class="field-value">{{ followUpDisplay(log) }}</div>
            </div>
          } @else {
            <div class="empty-state">Select a customer log above.</div>
          }
        </section>

        <section class="panel notes-panel">
          <header class="panel-header">Conversation Notes</header>
          @if (selectedLog(); as log) {
            <div class="notes-box">{{ log.notes || 'No notes entered.' }}</div>
          } @else {
            <div class="empty-state">No conversation selected.</div>
          }
        </section>

        <section class="panel related-panel">
          <header class="panel-header">Related Records</header>
          @if (selectedLog(); as log) {
            <div class="detail-grid related-grid">
              <label>Job No</label>
              <div class="field-value">{{ log.jobNo || '-' }}</div>

              <label>Order No</label>
              <div class="field-value">{{ log.orderNo || '-' }}</div>

              <label>Last Status</label>
              <div class="field-value">{{ log.lastStatus || '-' }}</div>

              <label>Ack Notes</label>
              <div class="field-value tall">{{ log.ackNotes || '-' }}</div>
            </div>
          } @else {
            <div class="empty-state">No related records selected.</div>
          }
        </section>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .log-tab {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: var(--text-primary);
    }

    .top-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 260px;
      gap: 0.75rem;
      align-items: stretch;
    }

    .detail-layout {
      display: grid;
      grid-template-columns: minmax(350px, 0.9fr) minmax(360px, 1.1fr) minmax(300px, 0.8fr);
      gap: 0.75rem;
      align-items: stretch;
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--app-radius);
      padding: 0.75rem;
      min-width: 0;
    }

    .panel-header {
      font-weight: 700;
      margin-bottom: 0.65rem;
      color: var(--text-primary);
    }

    .filter-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.9rem;
    }

    .filter-summary > div {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      border: 1px solid var(--surface-border);
      border-radius: 0.45rem;
      padding: 0.45rem 0.5rem;
      background: color-mix(in srgb, var(--surface) 82%, white);
      font-weight: 700;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 105px minmax(0, 1fr);
      gap: 0.45rem 0.75rem;
      align-items: start;
    }

    .detail-grid.compact {
      grid-template-columns: 92px minmax(0, 1fr);
    }

    .related-grid {
      grid-template-columns: 85px minmax(0, 1fr);
    }

    label,
    .mini-label {
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .field-value,
    .notes-box {
      min-height: 1.85rem;
      border: 1px solid var(--surface-border);
      border-radius: 0.45rem;
      background: color-mix(in srgb, var(--surface) 82%, white);
      padding: 0.35rem 0.5rem;
      overflow-wrap: anywhere;
    }

    .notes-box {
      min-height: 9.25rem;
      white-space: pre-wrap;
      line-height: 1.45;
    }

    .tall {
      min-height: 4rem;
      white-space: pre-wrap;
    }

    .strong {
      font-weight: 700;
    }

    .empty-state,
    .muted-note {
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.4;
    }

    .muted-note {
      margin-top: 0.75rem;
    }

    igx-grid {
      --ig-size: var(--ig-size-small);
    }

    @media (max-width: 1150px) {
      .top-layout,
      .detail-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryLogComponent {
  readonly customer = input.required<CustomerInquiryCustomer>();
  readonly shipTos = input.required<CustomerInquiryShipTo[]>();
  readonly logs = input.required<CustomerInquiryLog[]>();
  readonly selectedLog = input<CustomerInquiryLog | null>(null);

  readonly selectedLogChange = output<CustomerInquiryLog>();

  readonly appliedFromDate = signal<Date | null>(null);
  readonly appliedToDate = signal<Date | null>(null);

  fromDateValue: Date | null = null;
  toDateValue: Date | null = null;

  readonly filteredLogs = computed(() => {
    const fromDate = this.appliedFromDate();
    const toDate = this.appliedToDate();

    return this.logs().filter((log) => {
      const loggedDate = this.toComparableDate(log.logged);
      if (!loggedDate) {
        return true;
      }

      if (fromDate && loggedDate < this.startOfDay(fromDate)) {
        return false;
      }

      if (toDate && loggedDate > this.endOfDay(toDate)) {
        return false;
      }

      return true;
    });
  });

  applyFilter(): void {
    this.appliedFromDate.set(this.fromDateValue);
    this.appliedToDate.set(this.toDateValue);
  }

  clearFilter(): void {
    this.fromDateValue = null;
    this.toDateValue = null;
    this.appliedFromDate.set(null);
    this.appliedToDate.set(null);
  }

  onLogSelection(event: LogSelectionEvent): void {
    const selectedLog = event.newSelection.at(0);
    if (selectedLog) {
      this.selectedLogChange.emit(selectedLog);
    }
  }

  shipToDisplay(shipToNo: string): string {
    const shipTo = this.shipTos().find((row) => row.shipToNo === shipToNo);
    if (!shipTo) {
      return shipToNo || '-';
    }

    return `${shipTo.shipToNo} - ${shipTo.name}`;
  }

  followUpDisplay(log: CustomerInquiryLog): string {
    const pieces = [this.formatDate(log.followUpDate), log.followUpWith].filter((value) => value && value !== '-');
    return pieces.length ? pieces.join(' / ') : '-';
  }

  formatDate(value: string): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  private toComparableDate(value: string): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private startOfDay(value: Date): Date {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private endOfDay(value: Date): Date {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  }
}

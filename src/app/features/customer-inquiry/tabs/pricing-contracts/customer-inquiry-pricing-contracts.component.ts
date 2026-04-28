import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IgxCheckboxModule, IgxGridModule, IgxInputGroupModule, IgxRadioModule } from '@infragistics/igniteui-angular';

import { CustomerInquiryFreightContract } from '../../data/customer-inquiry.models';

interface FreightContractSelectionEvent {
  newSelection: CustomerInquiryFreightContract[];
}

@Component({
  selector: 'app-customer-inquiry-pricing-contracts',
  standalone: true,
  imports: [IgxCheckboxModule, IgxGridModule, IgxInputGroupModule, IgxRadioModule],
  template: `
    <section class="pricing-contracts-tab">
      <section class="panel grid-panel">
        <header class="panel-header">Freight Contract History</header>

        <igx-grid
          [data]="freightContracts()"
          [primaryKey]="'contractNo'"
          [rowSelection]="'single'"
          [height]="'300px'"
          [autoGenerate]="false"
          (rowSelectionChanging)="onContractSelection($event)"
        >
          <igx-column field="contractNo" header="No" dataType="number" [width]="'75px'"></igx-column>
          <igx-column field="date" header="Date" dataType="date" [width]="'120px'"></igx-column>
          <igx-column field="typeDescription" header="Type" [width]="'150px'"></igx-column>
          <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
          <igx-column field="start" header="Start" dataType="date" [width]="'120px'"></igx-column>
          <igx-column field="end" header="End" dataType="date" [width]="'120px'"></igx-column>
          <igx-column field="shipVia" header="Via" [width]="'90px'"></igx-column>
          <igx-column field="dpdShipVia" header="DPD" [width]="'90px'"></igx-column>
          <igx-column field="created" header="Created" dataType="date" [width]="'120px'"></igx-column>
          <igx-column field="by" header="By" [width]="'120px'"></igx-column>
          <igx-column field="nthShipmentNo" header="Nth" dataType="number" [width]="'85px'"></igx-column>
          <igx-column field="locked" header="Lock" dataType="boolean" [width]="'90px'"></igx-column>
          <igx-column field="webFreeShipVia" header="Web Free Via" [width]="'125px'"></igx-column>
          <igx-column field="webFreeAmount" header="Web Free Amt" dataType="currency" [width]="'140px'"></igx-column>
        </igx-grid>
      </section>

      <section class="detail-layout">
        <section class="panel contract-detail-panel">
          <header class="panel-header">Freight Contract Detail</header>

          @if (selectedContract(); as contract) {
            <div class="detail-grid">
              <label>Freight Contract #</label>
              <div class="field-value strong">{{ contract.contractNo }}</div>

              <label>Ship Via</label>
              <div class="field-value">{{ contract.shipVia || '-' }}</div>

              <label>DPD</label>
              <div class="field-value">{{ contract.dpdShipVia || '-' }}</div>

              <label>Web Free Ship Via</label>
              <div class="field-value">{{ contract.webFreeShipVia || '-' }}</div>

              <label>Web Free Amt</label>
              <div class="field-value">{{ formatCurrency(contract.webFreeAmount) }}</div>

              <label>Amount</label>
              <div class="field-value strong">{{ formatCurrency(contract.amount) }}</div>

              <label>Date</label>
              <div class="field-value">{{ formatDate(contract.date) }}</div>

              <label>Starts</label>
              <div class="field-value">{{ formatDate(contract.start) }}</div>

              <label>Ends</label>
              <div class="field-value">{{ contract.neverEnds ? 'Never Ends' : formatDate(contract.end) }}</div>
            </div>
          } @else {
            <div class="empty-state">Select a freight contract above.</div>
          }
        </section>

        <section class="panel type-panel">
          <header class="panel-header">Type</header>

          @if (selectedContract(); as contract) {
            <div class="radio-list readonly-radio-list">
              <igx-radio [checked]="contract.type === 'S'" [disabled]="true">Standard Rates</igx-radio>
              <igx-radio [checked]="contract.type === 'F'" [disabled]="true">Fixed Freight</igx-radio>
              <igx-radio [checked]="contract.type === 'M'" [disabled]="true">Monthly Freight</igx-radio>
              <igx-radio [checked]="contract.type === 'N'" [disabled]="true">No Freight Charge</igx-radio>
            </div>
          } @else {
            <div class="empty-state">No contract selected.</div>
          }
        </section>

        <section class="panel flags-panel">
          <header class="panel-header">Options</header>

          @if (selectedContract(); as contract) {
            <div class="checkbox-list">
              <igx-checkbox [checked]="contract.locked" [disabled]="true">4wk Amt Locked</igx-checkbox>
              <igx-checkbox [checked]="contract.neverEnds" [disabled]="true">Never Ends</igx-checkbox>
              <igx-checkbox [checked]="contract.alwaysChargeDelFreight" [disabled]="true">Always Charge DEL Freight</igx-checkbox>
            </div>

            <div class="audit-box">
              <div><span class="mini-label">Created</span>{{ formatDate(contract.created) }}</div>
              <div><span class="mini-label">By</span>{{ contract.by || '-' }}</div>
            </div>
          } @else {
            <div class="empty-state">No options to display.</div>
          }
        </section>
      </section>

      <section class="panel note-panel">
        <header class="panel-header">Notes</header>
        <div class="muted-note">
          Read-only first pass. Data maps to ARTCUST3 freight contract history. Editing, insert/delete, and WinForms business-rule event behavior are intentionally deferred.
        </div>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .pricing-contracts-tab {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: var(--text-primary);
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

    .detail-layout {
      display: grid;
      grid-template-columns: minmax(380px, 1.15fr) minmax(230px, 0.55fr) minmax(300px, 0.75fr);
      gap: 0.75rem;
      align-items: stretch;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 135px minmax(0, 1fr);
      gap: 0.45rem 0.75rem;
      align-items: start;
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
    .audit-box > div {
      min-height: 1.85rem;
      border: 1px solid var(--surface-border);
      border-radius: 0.45rem;
      background: color-mix(in srgb, var(--surface) 82%, white);
      padding: 0.35rem 0.5rem;
      overflow-wrap: anywhere;
    }

    .strong {
      font-weight: 700;
    }

    .radio-list,
    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .readonly-radio-list {
      padding-top: 0.15rem;
    }

    .audit-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .audit-box > div {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .empty-state,
    .muted-note {
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.4;
    }

    igx-grid {
      --ig-size: var(--ig-size-small);
    }

    @media (max-width: 1100px) {
      .detail-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryPricingContractsComponent {
  readonly freightContracts = input.required<CustomerInquiryFreightContract[]>();
  readonly selectedContract = input<CustomerInquiryFreightContract | null>(null);

  readonly selectedContractChange = output<CustomerInquiryFreightContract>();

  readonly selectedContractTypeDescription = computed(() => this.selectedContract()?.typeDescription ?? '');

  onContractSelection(event: FreightContractSelectionEvent): void {
    const selectedContract = event.newSelection.at(0);
    if (selectedContract) {
      this.selectedContractChange.emit(selectedContract);
    }
  }

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) {
      return '-';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
}

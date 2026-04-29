import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IgxTabsModule } from '@infragistics/igniteui-angular';

import { CustomerInquiryMockService } from './services/customer-inquiry-mock.service';
import {
  CustomerInquiryFreightContract,
  CustomerInquiryLog,
  CustomerInquiryLabJob,
  CustomerInquiryShipTo,
} from './data/customer-inquiry.models';
import { CustomerInquiryNameAddressComponent } from './tabs/name-address/customer-inquiry-name-address.component';
import { CustomerInquiryPricingContractsComponent } from './tabs/pricing-contracts/customer-inquiry-pricing-contracts.component';
import { CustomerInquiryLogComponent } from './tabs/log/customer-inquiry-log.component';
import { CustomerInquiryLabComponent } from './tabs/lab/customer-inquiry-lab.component';

@Component({
  selector: 'app-customer-inquiry',
  standalone: true,
  imports: [
    IgxTabsModule,
    CustomerInquiryNameAddressComponent,
    CustomerInquiryPricingContractsComponent,
    CustomerInquiryLogComponent,
    CustomerInquiryLabComponent,
  ],
  template: `
    <section class="customer-inquiry-page">
      <header class="inquiry-header-panel">
        <div class="identity-block">
          <div class="eyebrow">Customer Inquiry</div>
          <h1>{{ customer().custCode }} - {{ customer().custName }}</h1>

          <div class="selected-location">
            <span class="summary-label">Selected Ship To</span>
            @if (selectedShipTo(); as shipTo) {
              <span class="selected-value">{{ shipTo.shipToNo }} - {{ shipTo.name }}</span>
            } @else {
              <span class="selected-value">No location selected</span>
            }
          </div>
        </div>

        <div class="summary-grid" aria-label="Customer inquiry summary">
          <div class="summary-badge">
            <span class="summary-label">Total Locations</span>
            <strong>{{ shipTos().length }}</strong>
          </div>

          <div class="summary-badge">
            <span class="summary-label">Total Logs</span>
            <strong>{{ logs().length }}</strong>
          </div>

          <div class="summary-badge">
            <span class="summary-label">Freight Contracts</span>
            <strong>{{ contracts().length }}</strong>
          </div>

          <div class="summary-badge">
            <span class="summary-label">Lab Jobs</span>
            <strong>{{ jobs().length }}</strong>
          </div>
        </div>
      </header>

      <igx-tabs>
        <igx-tab-item>
          <igx-tab-header>Name & Address</igx-tab-header>
          <igx-tab-content>
            <app-customer-inquiry-name-address
              [customer]="customer()"
              [shipTos]="shipTos()"
              [selectedShipTo]="selectedShipTo()"
              (selectedShipToChange)="selectedShipTo.set($event)"
            />
          </igx-tab-content>
        </igx-tab-item>

        <igx-tab-item>
          <igx-tab-header>Log</igx-tab-header>
          <igx-tab-content>
            <app-customer-inquiry-log
              [customer]="customer()"
              [shipTos]="shipTos()"
              [logs]="logs()"
              [selectedLog]="selectedLog()"
              (selectedLogChange)="selectedLog.set($event)"
            />
          </igx-tab-content>
        </igx-tab-item>

        <igx-tab-item>
          <igx-tab-header>Pricing & Contracts</igx-tab-header>
          <igx-tab-content>
            <app-customer-inquiry-pricing-contracts
              [freightContracts]="contracts()"
              [selectedContract]="selectedContract()"
              (selectedContractChange)="selectedContract.set($event)"
            />
          </igx-tab-content>
        </igx-tab-item>

        <igx-tab-item>
          <igx-tab-header>Lab</igx-tab-header>
          <igx-tab-content>
            <app-customer-inquiry-lab
              [jobs]="jobs()"
              [charges]="data.jobCharges"
              [credits]="data.jobCredits"
              [selectedJob]="selectedJob()"
              (selectedJobChange)="selectedJob.set($event)"
            />
          </igx-tab-content>
        </igx-tab-item>
      </igx-tabs>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      color: var(--text-primary);
    }

    .customer-inquiry-page {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .inquiry-header-panel {
      display: grid;
      grid-template-columns: minmax(300px, 1fr) minmax(420px, 0.95fr);
      gap: 1rem;
      align-items: stretch;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--app-radius);
      padding: 1rem;
    }

    .identity-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    .eyebrow,
    .summary-label {
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0.2rem 0 0.65rem;
      color: var(--text-primary);
      font-size: 1.35rem;
      line-height: 1.2;
      font-weight: 800;
    }

    .selected-location {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 0.65rem;
      align-items: baseline;
    }

    .selected-value {
      color: var(--text-primary);
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.6rem;
    }

    .summary-badge {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.25rem;
      min-width: 0;
      border: 1px solid var(--surface-border);
      border-radius: var(--app-radius);
      padding: 0.65rem 0.75rem;
      background: color-mix(in srgb, var(--surface) 82%, white);
    }

    .summary-badge strong {
      color: var(--text-primary);
      font-size: 1.25rem;
      line-height: 1;
    }

    @media (max-width: 1100px) {
      .inquiry-header-panel {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryComponent {
  private readonly svc = inject(CustomerInquiryMockService);
  readonly data = this.svc.getCustomerInquiry();

  readonly customer = signal(this.data.customer);
  readonly shipTos = signal(this.data.shipTos);
  readonly logs = signal(this.data.logs);
  readonly contracts = signal(this.data.freightContracts);
  readonly jobs = signal(this.data.labJobs);

  readonly selectedShipTo = signal<CustomerInquiryShipTo | null>(this.data.shipTos.at(0) ?? null);
  readonly selectedContract = signal<CustomerInquiryFreightContract | null>(
    this.data.freightContracts.at(0) ?? null,
  );
  readonly selectedLog = signal<CustomerInquiryLog | null>(this.data.logs.at(0) ?? null);
  readonly selectedJob = signal<CustomerInquiryLabJob | null>(this.data.labJobs.at(0) ?? null);
}

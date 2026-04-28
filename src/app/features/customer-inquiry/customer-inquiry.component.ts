import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IgxGridModule, IgxTabsModule } from '@infragistics/igniteui-angular';

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
    IgxGridModule,
    CustomerInquiryNameAddressComponent,
    CustomerInquiryPricingContractsComponent,
    CustomerInquiryLogComponent,
    CustomerInquiryLabComponent,
  ],
  template: `
    <h2>Customer Inquiry</h2>

    <div>
      <strong>{{ customer().custCode }} - {{ customer().custName }}</strong>
      @if (selectedShipTo(); as shipTo) {
        <span> | Ship To: {{ shipTo.shipToNo }} - {{ shipTo.name }}</span>
      }
    </div>

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
  `,
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
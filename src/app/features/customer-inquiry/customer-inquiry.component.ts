import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IgxGridModule, IgxTabsModule } from '@infragistics/igniteui-angular';
import { CustomerInquiryMockService } from './services/customer-inquiry-mock.service';
import { CustomerInquiryNameAddressComponent } from './tabs/name-address/customer-inquiry-name-address.component';

@Component({
  selector: 'app-customer-inquiry',
  standalone: true,
  imports: [IgxTabsModule, IgxGridModule, CustomerInquiryNameAddressComponent],
  template: `
    <h2>Customer Inquiry</h2>

    <div>
      <strong>{{ customer().custCode }} - {{ customer().custName }}</strong>
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
          <igx-grid [data]="logs()" autoGenerate="true"></igx-grid>
        </igx-tab-content>
      </igx-tab-item>

      <igx-tab-item>
        <igx-tab-header>Pricing & Contracts</igx-tab-header>
        <igx-tab-content>
          <igx-grid [data]="contracts()" autoGenerate="true"></igx-grid>
        </igx-tab-content>
      </igx-tab-item>

      <igx-tab-item>
        <igx-tab-header>Lab</igx-tab-header>
        <igx-tab-content>
          <igx-grid [data]="jobs()" autoGenerate="true"></igx-grid>
        </igx-tab-content>
      </igx-tab-item>
    </igx-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInquiryComponent {
  private svc = inject(CustomerInquiryMockService);
  private data = this.svc.getCustomerInquiry();

  customer = signal(this.data.customer);
  shipTos = signal(this.data.shipTos);
  logs = signal(this.data.logs);
  contracts = signal(this.data.freightContracts);
  jobs = signal(this.data.labJobs);

  selectedShipTo = signal<any>(null);

  selectShipTo(row: any) {
    this.selectedShipTo.set(row);
  }
}

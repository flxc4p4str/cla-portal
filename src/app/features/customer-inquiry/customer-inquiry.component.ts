import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IgxTabsModule, IgxGridModule } from '@infragistics/igniteui-angular';

@Component({
  selector: 'app-customer-inquiry',
  standalone: true,
  imports: [IgxTabsModule, IgxGridModule],
  template: `
    <h2>Customer Inquiry</h2>

    <igx-tabs>
      <igx-tab-item>
        <igx-tab-header>Name & Address</igx-tab-header>
        <igx-tab-content>
          <p>Customer info goes here</p>
          <igx-grid [data]="shipTos()" autoGenerate="true"></igx-grid>
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

      <igx-tab-item>
        <igx-tab-header>Info</igx-tab-header>
        <igx-tab-content>Placeholder</igx-tab-content>
      </igx-tab-item>
    </igx-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInquiryComponent {
  shipTos = signal([{ shipToNo: '0012', name: 'Sample ShipTo' }]);
  logs = signal([{ date: '2024-01-01', notes: 'Sample log' }]);
  contracts = signal([{ contractNo: 1, amount: 25 }]);
  jobs = signal([{ jobNo: 'J123', status: 'Open' }]);
}

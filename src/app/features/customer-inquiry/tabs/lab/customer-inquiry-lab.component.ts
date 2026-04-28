import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IgxGridModule } from '@infragistics/igniteui-angular';

import {
  CustomerInquiryJobCharge,
  CustomerInquiryJobCredit,
  CustomerInquiryLabJob,
} from '../../data/customer-inquiry.models';

interface LabJobSelectionEvent {
  newSelection: CustomerInquiryLabJob[];
}

@Component({
  selector: 'app-customer-inquiry-lab',
  standalone: true,
  imports: [IgxGridModule],
  template: `
    <section class="lab-tab">
      <section class="panel">
        <header class="panel-header">Open Orders & Orders Completed within the last 30 days</header>

        <igx-grid
          [data]="jobs()"
          [primaryKey]="'jobNo'"
          [rowSelection]="'single'"
          [height]="'340px'"
          [autoGenerate]="false"
          (rowSelectionChanging)="onJobSelection($event)"
        >
          <igx-column field="jobNo" header="Job No" [width]="'110px'"></igx-column>
          <igx-column field="date" header="Date" dataType="date" [width]="'120px'"></igx-column>
          <igx-column field="homeLab" header="Home Lab" [width]="'115px'"></igx-column>
          <igx-column field="frameArrived" header="Frame Arrived" dataType="date" [width]="'145px'"></igx-column>
          <igx-column field="status" header="Status" [width]="'115px'"></igx-column>
          <igx-column field="redoReason" header="Redo Reason" [width]="'170px'"></igx-column>
          <igx-column field="insurance" header="Insurance" [width]="'120px'"></igx-column>
          <igx-column field="vspPays" header="VSP Pays" [width]="'110px'"></igx-column>
          <igx-column field="partnerOrderNo" header="Partner Order No" [width]="'160px'"></igx-column>
          <igx-column field="pair50" header="Pair 50" dataType="boolean" [width]="'100px'"></igx-column>
          <igx-column field="billingHold" header="Billing Hold" dataType="boolean" [width]="'125px'"></igx-column>
        </igx-grid>
      </section>

      <section class="detail-layout">
        <section class="panel">
          <header class="panel-header">Details for Selected Job</header>

          <igx-grid [data]="selectedCharges()" [height]="'260px'" [autoGenerate]="false">
            <igx-column field="charge" header="Charge" [width]="'180px'"></igx-column>
            <igx-column field="eye" header="Eye" [width]="'80px'"></igx-column>
            <igx-column field="price" header="Price" dataType="currency" [width]="'110px'"></igx-column>
            <igx-column field="qty" header="Qty" dataType="number" [width]="'90px'"></igx-column>
            <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
            <igx-column field="credited" header="Credited" dataType="currency" [width]="'120px'"></igx-column>
          </igx-grid>
        </section>

        <section class="panel">
          <header class="panel-header">Credits Issued Against Selected Job</header>

          <igx-grid [data]="selectedCredits()" [height]="'260px'" [autoGenerate]="false">
            <igx-column field="invNo" header="Inv No" [width]="'115px'"></igx-column>
            <igx-column field="reason" header="Reason" [width]="'220px'"></igx-column>
            <igx-column field="total" header="Total" dataType="currency" [width]="'110px'"></igx-column>
            <igx-column field="freight" header="Frt" dataType="currency" [width]="'95px'"></igx-column>
            <igx-column field="fuelSurcharge" header="FSC" dataType="currency" [width]="'95px'"></igx-column>
            <igx-column field="date" header="Date" dataType="date" [width]="'120px'"></igx-column>
          </igx-grid>
        </section>
      </section>
    </section>
  `,
  styles: [`
    .lab-tab { display:flex; flex-direction:column; gap:.75rem; }
    .panel {
      background:var(--surface);
      border:1px solid var(--surface-border);
      border-radius:var(--app-radius);
      padding:.75rem;
      min-width:0;
    }
    .panel-header { font-weight:700; margin-bottom:.65rem; }
    .detail-layout {
      display:grid;
      grid-template-columns:minmax(420px, 1fr) minmax(420px, 1fr);
      gap:.75rem;
    }
    igx-grid { --ig-size: var(--ig-size-small); }
    @media (max-width:1150px) {
      .detail-layout { grid-template-columns:1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryLabComponent {
  readonly jobs = input.required<CustomerInquiryLabJob[]>();
  readonly charges = input.required<CustomerInquiryJobCharge[]>();
  readonly credits = input.required<CustomerInquiryJobCredit[]>();
  readonly selectedJob = input<CustomerInquiryLabJob | null>(null);

  readonly selectedJobChange = output<CustomerInquiryLabJob>();

  readonly selectedCharges = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.charges().filter((row) => row.jobNo === jobNo) : [];
  });

  readonly selectedCredits = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.credits().filter((row) => row.jobNo === jobNo) : [];
  });

  onJobSelection(event: LabJobSelectionEvent): void {
    const selectedJob = event.newSelection.at(0);
    if (selectedJob) {
      this.selectedJobChange.emit(selectedJob);
    }
  }
}
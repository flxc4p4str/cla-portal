import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IgxGridModule, IgxTabsModule } from '@infragistics/igniteui-angular';

import {
  CustomerInquiryJobCharge,
  CustomerInquiryJobCredit,
  CustomerInquiryLabContract,
  CustomerInquiryLabJob,
  CustomerInquiryLabReview,
  CustomerInquiryLabSummary,
  CustomerInquiryLensBank,
  CustomerInquiryRewardProgram,
} from '../../data/customer-inquiry.models';

interface LabJobSelectionEvent {
  newSelection: CustomerInquiryLabJob[];
}

@Component({
  selector: 'app-customer-inquiry-lab',
  standalone: true,
  imports: [IgxGridModule, IgxTabsModule],
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

      <section class="panel child-lab-tabs-panel">
        <igx-tabs>
          <igx-tab-item>
            <igx-tab-header>Orders</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedCharges()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="charge" header="Charge" [width]="'220px'"></igx-column>
                <igx-column field="eye" header="Eye" [width]="'80px'"></igx-column>
                <igx-column field="price" header="Price" dataType="currency" [width]="'110px'"></igx-column>
                <igx-column field="qty" header="Qty" dataType="number" [width]="'90px'"></igx-column>
                <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
                <igx-column field="credited" header="Credited" dataType="currency" [width]="'120px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Summary</igx-tab-header>
            <igx-tab-content>
              @if (selectedSummary(); as summary) {
                <section class="summary-panel" aria-label="Selected job summary">
                  <div class="summary-field"><span>Job No</span><strong>{{ summary.jobNo }}</strong></div>
                  <div class="summary-field"><span>Patient</span><strong>{{ summary.patientName }}</strong></div>
                  <div class="summary-field"><span>Order No</span><strong>{{ summary.orderNo }}</strong></div>
                  <div class="summary-field"><span>Invoice No</span><strong>{{ summary.invoiceNo || '-' }}</strong></div>
                  <div class="summary-field"><span>Invoice Date</span><strong>{{ summary.invoiceDate || '-' }}</strong></div>
                  <div class="summary-field"><span>Lens Design</span><strong>{{ summary.lensDesign }}</strong></div>
                  <div class="summary-field"><span>Material</span><strong>{{ summary.material }}</strong></div>
                  <div class="summary-field"><span>Color</span><strong>{{ summary.color }}</strong></div>
                  <div class="summary-field"><span>Frame Type</span><strong>{{ summary.frameType }}</strong></div>
                  <div class="summary-field"><span>Frame Status</span><strong>{{ summary.frameStatus }}</strong></div>
                  <div class="summary-field"><span>Tint</span><strong>{{ summary.tint }}</strong></div>
                  <div class="summary-field"><span>AR Coating</span><strong>{{ summary.arCoating }}</strong></div>
                  <div class="summary-field"><span>Tracking</span><strong>{{ summary.trackingNumber || '-' }}</strong></div>
                  <div class="summary-field wide"><span>Lab Comment</span><strong>{{ summary.commentLab || '-' }}</strong></div>
                  <div class="summary-field wide"><span>Invoice Comment</span><strong>{{ summary.commentInvoice || '-' }}</strong></div>
                </section>
              } @else {
                <div class="empty-state">Select a job to view summary details.</div>
              }
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Credits</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedCredits()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="invNo" header="Inv No" [width]="'115px'"></igx-column>
                <igx-column field="reason" header="Reason" [width]="'260px'"></igx-column>
                <igx-column field="total" header="Total" dataType="currency" [width]="'110px'"></igx-column>
                <igx-column field="freight" header="Frt" dataType="currency" [width]="'95px'"></igx-column>
                <igx-column field="fuelSurcharge" header="FSC" dataType="currency" [width]="'95px'"></igx-column>
                <igx-column field="date" header="Date" dataType="date" [width]="'120px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Lens Banks</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedLensBanks()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="bankNo" header="Bank No" [width]="'125px'"></igx-column>
                <igx-column field="itemCode" header="Item" [width]="'150px'"></igx-column>
                <igx-column field="description" header="Description" [width]="'260px'"></igx-column>
                <igx-column field="eye" header="Eye" [width]="'80px'"></igx-column>
                <igx-column field="qty" header="Qty" dataType="number" [width]="'90px'"></igx-column>
                <igx-column field="price" header="Price" dataType="currency" [width]="'110px'"></igx-column>
                <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Contracts</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedContracts()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="contractNo" header="Contract No" [width]="'135px'"></igx-column>
                <igx-column field="contractName" header="Contract Name" [width]="'230px'"></igx-column>
                <igx-column field="charge" header="Charge" [width]="'210px'"></igx-column>
                <igx-column field="eye" header="Eye" [width]="'80px'"></igx-column>
                <igx-column field="price" header="Price" dataType="currency" [width]="'110px'"></igx-column>
                <igx-column field="qty" header="Qty" dataType="number" [width]="'90px'"></igx-column>
                <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Rewards Programs</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedRewardPrograms()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="programCode" header="Program" [width]="'125px'"></igx-column>
                <igx-column field="programName" header="Program Name" [width]="'240px'"></igx-column>
                <igx-column field="status" header="Status" [width]="'110px'"></igx-column>
                <igx-column field="points" header="Points" dataType="number" [width]="'105px'"></igx-column>
                <igx-column field="amount" header="Amount" dataType="currency" [width]="'120px'"></igx-column>
                <igx-column field="notes" header="Notes" [width]="'320px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Review</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="selectedReviews()" [height]="'260px'" [autoGenerate]="false">
                <igx-column field="reviewCode" header="Code" [width]="'105px'"></igx-column>
                <igx-column field="reviewDescription" header="Description" [width]="'245px'"></igx-column>
                <igx-column field="status" header="Status" [width]="'110px'"></igx-column>
                <igx-column field="reviewedBy" header="Reviewed By" [width]="'135px'"></igx-column>
                <igx-column field="reviewedOn" header="Reviewed On" dataType="date" [width]="'135px'"></igx-column>
                <igx-column field="notes" header="Notes" [width]="'320px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>
        </igx-tabs>
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
    .child-lab-tabs-panel { padding:0; overflow:hidden; }
    .child-lab-tabs-panel igx-grid { border-top:1px solid var(--surface-border); }
    .summary-panel {
      display:grid;
      grid-template-columns:repeat(4, minmax(0, 1fr));
      gap:.55rem;
      padding:.75rem;
      border-top:1px solid var(--surface-border);
    }
    .summary-field {
      display:flex;
      flex-direction:column;
      gap:.2rem;
      min-width:0;
      border:1px solid var(--surface-border);
      border-radius:.35rem;
      padding:.45rem .55rem;
      background:color-mix(in srgb, var(--surface) 82%, white);
    }
    .summary-field.wide { grid-column:span 2; }
    .summary-field span {
      color:var(--text-muted);
      font-size:.76rem;
      font-weight:700;
      text-transform:uppercase;
    }
    .summary-field strong {
      color:var(--text-primary);
      font-size:.9rem;
      line-height:1.25;
      overflow-wrap:anywhere;
    }
    .empty-state {
      min-height:260px;
      border-top:1px solid var(--surface-border);
      padding:.75rem;
      color:var(--text-muted);
      font-size:.88rem;
    }
    igx-grid { --ig-size: var(--ig-size-small); }
    @media (max-width:1150px) {
      .summary-panel { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width:650px) {
      .summary-panel { grid-template-columns:1fr; }
      .summary-field.wide { grid-column:auto; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryLabComponent {
  readonly jobs = input.required<CustomerInquiryLabJob[]>();
  readonly summaries = input.required<CustomerInquiryLabSummary[]>();
  readonly charges = input.required<CustomerInquiryJobCharge[]>();
  readonly credits = input.required<CustomerInquiryJobCredit[]>();
  readonly lensBanks = input.required<CustomerInquiryLensBank[]>();
  readonly contracts = input.required<CustomerInquiryLabContract[]>();
  readonly rewardPrograms = input.required<CustomerInquiryRewardProgram[]>();
  readonly reviews = input.required<CustomerInquiryLabReview[]>();
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

  readonly selectedSummary = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.summaries().find((row) => row.jobNo === jobNo) ?? null : null;
  });

  readonly selectedLensBanks = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.lensBanks().filter((row) => row.jobNo === jobNo) : [];
  });

  readonly selectedContracts = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.contracts().filter((row) => row.jobNo === jobNo) : [];
  });

  readonly selectedRewardPrograms = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.rewardPrograms().filter((row) => row.jobNo === jobNo) : [];
  });

  readonly selectedReviews = computed(() => {
    const jobNo = this.selectedJob()?.jobNo;
    return jobNo ? this.reviews().filter((row) => row.jobNo === jobNo) : [];
  });

  onJobSelection(event: LabJobSelectionEvent): void {
    const selectedJob = event.newSelection.at(0);
    if (selectedJob) {
      this.selectedJobChange.emit(selectedJob);
    }
  }
}

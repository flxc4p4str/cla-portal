import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IgxButtonDirective,
  IgxIconButtonDirective,
  IgxIconModule,
  IgxInputGroupModule,
  IgxTabsModule,
} from '@infragistics/igniteui-angular';
import { IgxGridModule } from '@infragistics/igniteui-angular/grids/grid';
import { IGridCellEventArgs } from '@infragistics/igniteui-angular/grids/core';

import { CustomerInquiryMockService } from './services/customer-inquiry-mock.service';
import {
  CustomerInquiryCustomer,
  CustomerInquiryFreightContract,
  CustomerInquiryJobCharge,
  CustomerInquiryJobCredit,
  CustomerInquiryKeyedComment,
  CustomerInquiryContact,
  CustomerInquiryLabAuthorization,
  CustomerInquiryLabContract,
  CustomerInquiryLog,
  CustomerInquiryLabJob,
  CustomerInquiryLabReview,
  CustomerInquiryLabSummary,
  CustomerInquiryLensBank,
  CustomerInquiryPricingLabContract,
  CustomerInquiryRewardProgram,
  CustomerInquirySmsContact,
  CustomerInquirySlContract,
  CustomerInquiryShipTo,
  CustomerInquiryShipToLookup,
} from './data/customer-inquiry.models';
import { CustomerInquiryNameAddressComponent } from './tabs/name-address/customer-inquiry-name-address.component';
import { CustomerInquiryPricingContractsComponent } from './tabs/pricing-contracts/customer-inquiry-pricing-contracts.component';
import { CustomerInquiryLogComponent } from './tabs/log/customer-inquiry-log.component';
import { CustomerInquiryLabComponent } from './tabs/lab/customer-inquiry-lab.component';

@Component({
  selector: 'app-customer-inquiry',
  standalone: true,
  imports: [
    IgxButtonDirective,
    IgxGridModule,
    IgxIconButtonDirective,
    IgxIconModule,
    IgxInputGroupModule,
    IgxTabsModule,
    CustomerInquiryNameAddressComponent,
    CustomerInquiryPricingContractsComponent,
    CustomerInquiryLogComponent,
    CustomerInquiryLabComponent,
  ],
  template: `
    <section class="customer-inquiry-page">
      <section class="criteria-panel" aria-label="Customer inquiry load criteria">
        <div class="criteria-fields">
          <div class="lookup-field customer-field">
            <label class="field-caption" for="customerCode">Customer</label>
            <div class="lookup-input-row">
              <igx-input-group type="box" class="code-input">
                <input
                  id="customerCode"
                  igxInput
                  autocomplete="off"
                  [readOnly]="isLoaded()"
                  [value]="customerCodeInput()"
                  (input)="onCustomerCodeInput($event)"
                />
                <button
                  igxIconButton="flat"
                  igxSuffix
                  class="lookup-trigger"
                  type="button"
                  title="Customer lookup"
                  aria-label="Customer lookup"
                  [disabled]="isLoaded()"
                  (click)="openCustomerLookup()"
                >
                  <igx-icon>arrow_drop_up</igx-icon>
                </button>
              </igx-input-group>

              <igx-input-group type="box" class="name-input">
                <input igxInput readonly [value]="customerNameDisplay()" aria-label="Customer name" />
              </igx-input-group>
            </div>
          </div>

          <div class="lookup-field shipto-field">
            <label class="field-caption" for="shipToNo">Ship To (Optional)</label>
            <div class="lookup-input-row">
              <igx-input-group type="box" class="code-input">
                <input
                  id="shipToNo"
                  igxInput
                  autocomplete="off"
                  [readOnly]="isLoaded()"
                  [value]="shipToNoInput()"
                  (input)="onShipToNoInput($event)"
                />
                <button
                  igxIconButton="flat"
                  igxSuffix
                  class="lookup-trigger"
                  type="button"
                  title="Ship-To lookup"
                  aria-label="Ship-To lookup"
                  [disabled]="isLoaded()"
                  (click)="openShipToLookup()"
                >
                  <igx-icon>arrow_drop_up</igx-icon>
                </button>
              </igx-input-group>

              <igx-input-group type="box" class="name-input">
                <input igxInput readonly [value]="shipToNameDisplay()" aria-label="Ship-to name" />
              </igx-input-group>
            </div>
          </div>
        </div>

        <div class="criteria-actions">

          <button igxButton="contained" type="button" [disabled]="!canLoad()" (click)="loadInquiry()">
            <igx-icon>download</igx-icon>
            <span>Load</span>
          </button>

          @if (isLoaded()) {
            <button igxButton="flat" type="button" (click)="startNewInquiry()">
              <igx-icon>edit</igx-icon>
              <span>DONE</span>
            </button>
          }
        </div>

        @if (loadError()) {
          <div class="load-error" role="alert">{{ loadError() }}</div>
        }
      </section>

      @if (customer(); as loadedCustomer) {
        <header class="inquiry-header-panel">
          <div class="identity-block">
            <div class="eyebrow">Customer Inquiry</div>
            <h1>{{ loadedCustomer.custCode }} - {{ loadedCustomer.custName }}</h1>

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
                [customer]="loadedCustomer"
                [shipTos]="shipTos()"
                [keyedComments]="keyedComments()"
                [contacts]="contacts()"
                [labAuthorizations]="labAuthorizations()"
                [smsContacts]="smsContacts()"
                [selectedShipTo]="selectedShipTo()"
                (selectedShipToChange)="selectLoadedShipTo($event)"
              />
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Log</igx-tab-header>
            <igx-tab-content>
              <app-customer-inquiry-log
                [customer]="loadedCustomer"
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
                [labContracts]="labContracts()"
                [slContracts]="slContracts()"
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
                [summaries]="labSummaries()"
                [charges]="charges()"
                [credits]="credits()"
                [lensBanks]="lensBanks()"
                [contracts]="labJobContracts()"
                [rewardPrograms]="rewardPrograms()"
                [reviews]="labReviews()"
                [selectedJob]="selectedJob()"
                (selectedJobChange)="selectedJob.set($event)"
              />
            </igx-tab-content>
          </igx-tab-item>
        </igx-tabs>
      } @else {
        <section class="empty-state">
          <div class="eyebrow">Customer Inquiry</div>
          <h1>Enter a customer and ship-to to load inquiry data.</h1>
        </section>
      }

      @if (customerLookupOpen()) {
        <div class="lookup-overlay" role="presentation" (click)="closeLookups()">
          <section class="lookup-modal customer-lookup-modal" role="dialog" aria-modal="true" aria-labelledby="customerLookupTitle" (click)="$event.stopPropagation()">
            <h2 id="customerLookupTitle">Customer Lookup</h2>

            <div class="lookup-body customer-lookup-body">
              <div class="lookup-meta">{{ customers().length }} customers</div>

              <igx-grid
                class="lookup-grid"
                [data]="customers()"
                [primaryKey]="'custCode'"
                [rowSelection]="'single'"
                [hideRowSelectors]="true"
                [selectRowOnClick]="true"
                [allowFiltering]="true"
                [width]="customerLookupGridWidth"
                [height]="customerLookupGridHeight()"
                [autoGenerate]="false"
                (doubleClick)="selectCustomerFromGrid($event)"
              >
                <igx-column field="custCode" header="Customer Code" [width]="'170px'"></igx-column>
                <igx-column field="custName" header="Customer Name" [width]="'540px'"></igx-column>
              </igx-grid>
            </div>

            <div class="lookup-actions">
              <button igxButton="flat" type="button" (click)="closeLookups()">Cancel</button>
            </div>
          </section>
        </div>
      }

      @if (shipToLookupOpen()) {
        <div class="lookup-overlay" role="presentation" (click)="closeLookups()">
          <section class="lookup-modal shipto-lookup-modal" role="dialog" aria-modal="true" aria-labelledby="shipToLookupTitle" (click)="$event.stopPropagation()">
            <h2 id="shipToLookupTitle">Ship-To Lookup</h2>

            <div class="lookup-body shipto-lookup-body">
              <div class="lookup-meta">
                @if (normalizedCustomerCode()) {
                  Customer {{ normalizedCustomerCode() }} · {{ shipToLookupRows().length }} ship-to locations
                } @else {
                  {{ shipToLookupRows().length }} ship-to locations
                }
              </div>

              <igx-grid
                class="lookup-grid"
                [data]="shipToLookupRows()"
                [primaryKey]="'lookupKey'"
                [rowSelection]="'single'"
                [hideRowSelectors]="true"
                [selectRowOnClick]="true"
                [allowFiltering]="true"
                [width]="shipToLookupGridWidth"
                [height]="shipToLookupGridHeight()"
                [autoGenerate]="false"
                (doubleClick)="selectShipToFromGrid($event)"
              >
                <igx-column field="custCode" header="Customer" [width]="'120px'"></igx-column>
                <igx-column field="shipToNo" header="Ship-To" [width]="'105px'"></igx-column>
                <igx-column field="name" header="Name" [width]="'300px'"></igx-column>
                <igx-column field="addr1" header="Address" [width]="'300px'"></igx-column>
                <igx-column field="city" header="City" [width]="'165px'"></igx-column>
                <igx-column field="state" header="State" [width]="'80px'"></igx-column>
                <igx-column field="zipCode" header="Zip" [width]="'110px'"></igx-column>
              </igx-grid>
            </div>

            <div class="lookup-actions">
              <button igxButton="flat" type="button" (click)="closeLookups()">Cancel</button>
            </div>
          </section>
        </div>
      }
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

    .criteria-panel,
    .inquiry-header-panel,
    .empty-state {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--app-radius);
      padding: 1rem;
    }

    .criteria-panel {
      display: grid;
      grid-template-columns: minmax(700px, 1fr) auto;
      gap: 0.75rem;
      align-items: end;
      padding: 0.45rem 0.6rem 0.55rem;
      background: color-mix(in srgb, var(--surface) 74%, #d8d8c8);
    }

    .criteria-fields {
      display: grid;
      grid-template-columns: minmax(360px, 0.95fr) minmax(410px, 1.05fr);
      gap: 0.65rem;
      align-items: end;
      min-width: 0;
    }

    .lookup-field {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }

    .field-caption {
      color: var(--text-primary);
      font-size: 0.83rem;
      font-weight: 600;
      line-height: 1.1;
    }

    .lookup-input-row {
      display: grid;
      grid-template-columns: 108px minmax(0, 1fr);
      gap: 0.25rem;
      min-width: 0;
    }

    .code-input,
    .name-input {
      --ig-size: var(--ig-size-small);
      min-width: 0;
    }

    .lookup-trigger {
      width: 1.45rem;
      min-width: 1.45rem;
      height: 1.45rem;
      color: var(--text-muted);
    }

    .lookup-trigger igx-icon {
      font-size: 1.15rem;
      width: 1.15rem;
      height: 1.15rem;
    }

    .criteria-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      justify-content: flex-end;
      align-items: center;
      min-height: 2.25rem;
    }

    .criteria-actions button {
      min-width: 6.75rem;
    }

    .criteria-actions igx-icon {
      font-size: 1.05rem;
      width: 1.05rem;
      height: 1.05rem;
    }

    .load-error {
      grid-column: 1 / -1;
      color: var(--app-danger, #9f1239);
      font-weight: 700;
      min-height: 1.25rem;
    }

    .empty-state h1 {
      margin: 0.2rem 0 0;
      color: var(--text-primary);
      font-size: 1.1rem;
      line-height: 1.25;
      font-weight: 800;
    }

    .inquiry-header-panel {
      display: grid;
      grid-template-columns: minmax(300px, 1fr) minmax(420px, 0.95fr);
      gap: 1rem;
      align-items: stretch;
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

    .lookup-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 2rem;
      background: rgb(0 0 0 / 0.28);
    }

    .lookup-modal {
      width: max-content;
      max-width: calc(100vw - 4rem);
      overflow: visible;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 0.35rem;
      box-shadow: 0 1.3rem 3rem rgb(0 0 0 / 0.3);
      padding: 1rem 1.1rem 0.85rem;
    }

    .lookup-modal h2 {
      margin: 0 0 0.85rem;
      color: var(--text-primary);
      font-size: 1.05rem;
      line-height: 1.2;
      font-weight: 800;
    }

    .lookup-body {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      min-width: 0;
      padding-top: 0.25rem;
    }

    .customer-lookup-body {
      width: 730px;
    }

    .shipto-lookup-body {
      width: 1200px;
    }

    .lookup-meta {
      display: flex;
      align-items: center;
      min-height: 1.6rem;
      border: 1px solid var(--surface-border);
      border-radius: 0.35rem;
      padding: 0.25rem 0.55rem;
      color: var(--text-muted);
      background: color-mix(in srgb, var(--surface) 78%, white);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .lookup-grid {
      --ig-size: var(--ig-size-small);
      border: 1px solid var(--surface-border);
      border-radius: 0.35rem;
      overflow: hidden;
    }

    .lookup-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--surface-border);
      margin-top: 0.75rem;
      padding-top: 0.65rem;
    }

    @media (max-width: 1100px) {
      .criteria-panel,
      .inquiry-header-panel {
        grid-template-columns: 1fr;
      }

      .criteria-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 700px) {
      .criteria-fields,
      .lookup-input-row,
      .summary-grid {
        grid-template-columns: 1fr;
      }

      .lookup-overlay {
        justify-content: start;
        overflow-x: auto;
      }

      .lookup-modal {
        max-width: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryComponent {
  private readonly svc = inject(CustomerInquiryMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly customerCodeInput = signal('');
  readonly shipToNoInput = signal('');
  readonly isLoaded = signal(false);
  readonly loadError = signal('');
  readonly customerLookupOpen = signal(false);
  readonly shipToLookupOpen = signal(false);

  readonly customers = signal(this.svc.getCustomers());
  readonly customer = signal<CustomerInquiryCustomer | null>(null);
  readonly shipTos = signal<CustomerInquiryShipTo[]>([]);
  readonly logs = signal<CustomerInquiryLog[]>([]);
  readonly contracts = signal<CustomerInquiryFreightContract[]>([]);
  readonly jobs = signal<CustomerInquiryLabJob[]>([]);
  readonly charges = signal<CustomerInquiryJobCharge[]>([]);
  readonly credits = signal<CustomerInquiryJobCredit[]>([]);
  readonly keyedComments = signal<CustomerInquiryKeyedComment[]>([]);
  readonly contacts = signal<CustomerInquiryContact[]>([]);
  readonly labAuthorizations = signal<CustomerInquiryLabAuthorization[]>([]);
  readonly smsContacts = signal<CustomerInquirySmsContact[]>([]);
  readonly labContracts = signal<CustomerInquiryPricingLabContract[]>([]);
  readonly slContracts = signal<CustomerInquirySlContract[]>([]);
  readonly labSummaries = signal<CustomerInquiryLabSummary[]>([]);
  readonly lensBanks = signal<CustomerInquiryLensBank[]>([]);
  readonly labJobContracts = signal<CustomerInquiryLabContract[]>([]);
  readonly rewardPrograms = signal<CustomerInquiryRewardProgram[]>([]);
  readonly labReviews = signal<CustomerInquiryLabReview[]>([]);

  readonly selectedShipTo = signal<CustomerInquiryShipTo | null>(null);
  readonly selectedContract = signal<CustomerInquiryFreightContract | null>(null);
  readonly selectedLog = signal<CustomerInquiryLog | null>(null);
  readonly selectedJob = signal<CustomerInquiryLabJob | null>(null);

  readonly normalizedCustomerCode = computed(() => normalizeCode(this.customerCodeInput()));
  readonly normalizedShipToNo = computed(() => normalizeCode(this.shipToNoInput()));
  readonly customerNameDisplay = computed(() => {
    const loadedCustomer = this.customer();

    if (loadedCustomer && normalizeCode(loadedCustomer.custCode) === this.normalizedCustomerCode()) {
      return loadedCustomer.custName;
    }

    return (
      this.customers().find((customer) => normalizeCode(customer.custCode) === this.normalizedCustomerCode())?.custName ??
      ''
    );
  });
  readonly shipToNameDisplay = computed(() => {
    const loadedShipTo = this.selectedShipTo();

    if (loadedShipTo && normalizeCode(loadedShipTo.shipToNo) === this.normalizedShipToNo()) {
      return loadedShipTo.name;
    }

    return (
      this
        .svc
        .getShipTos(this.normalizedCustomerCode() || undefined)
        .find((shipTo) => normalizeCode(shipTo.shipToNo) === this.normalizedShipToNo())?.name ?? ''
    );
  });
  readonly canLoad = computed(
    () => !this.isLoaded() && this.normalizedCustomerCode().length > 0 && this.normalizedShipToNo().length > 0,
  );
  readonly shipToLookupRows = computed(() =>
    this.svc.getShipTos(this.normalizedCustomerCode() || undefined).map((shipTo) => ({
      ...shipTo,
      lookupKey: `${shipTo.custCode}-${shipTo.shipToNo}`,
    })),
  );
  readonly customerLookupGridWidth = '730px';
  readonly shipToLookupGridWidth = '1200px';
  readonly customerLookupGridHeight = computed(() => lookupGridHeight(this.customers().length));
  readonly shipToLookupGridHeight = computed(() => lookupGridHeight(this.shipToLookupRows().length));

  constructor() {
    const custCode = this.route.snapshot.paramMap.get('custCode');
    const shipToNo = this.route.snapshot.paramMap.get('shipToNo');

    if (custCode && shipToNo) {
      this.customerCodeInput.set(custCode);
      this.shipToNoInput.set(shipToNo);
      this.loadInquiry();
    }
  }

  onCustomerCodeInput(event: Event): void {
    const value = getInputValue(event);
    this.customerCodeInput.set(value);
    this.loadError.set('');
  }

  onShipToNoInput(event: Event): void {
    const value = getInputValue(event);
    this.shipToNoInput.set(value);
    this.loadError.set('');
  }

  openCustomerLookup(): void {
    this.customerLookupOpen.set(true);
  }

  openShipToLookup(): void {
    this.shipToLookupOpen.set(true);
  }

  closeLookups(): void {
    this.customerLookupOpen.set(false);
    this.shipToLookupOpen.set(false);
  }

  selectCustomerFromGrid(event: IGridCellEventArgs): void {
    const customer = event.cell.row.data;

    if (!isCustomer(customer)) {
      return;
    }

    this.customerCodeInput.set(customer.custCode);

    const shipToStillMatches = this
      .svc
      .getShipTos(customer.custCode)
      .some((shipTo) => normalizeCode(shipTo.shipToNo) === this.normalizedShipToNo());

    if (!shipToStillMatches) {
      this.shipToNoInput.set('');
    }

    this.loadError.set('');
    this.closeLookups();
  }

  selectShipToFromGrid(event: IGridCellEventArgs): void {
    const shipTo = event.cell.row.data;

    if (!isShipToLookup(shipTo)) {
      return;
    }

    this.customerCodeInput.set(shipTo.custCode);
    this.shipToNoInput.set(shipTo.shipToNo);
    this.loadError.set('');
    this.closeLookups();
  }

  loadInquiry(): void {
    const data = this.svc.getCustomerInquiry(this.normalizedCustomerCode(), this.normalizedShipToNo());

    if (!data) {
      this.clearLoadedInquiry();
      this.loadError.set('No mock inquiry found for that customer and ship-to combination.');
      return;
    }

    const selectedShipTo =
      data.shipTos.find((shipTo) => normalizeCode(shipTo.shipToNo) === this.normalizedShipToNo()) ??
      data.shipTos.at(0) ??
      null;

    this.customerCodeInput.set(data.customer.custCode);
    this.shipToNoInput.set(selectedShipTo?.shipToNo ?? this.normalizedShipToNo());
    this.customer.set(data.customer);
    this.shipTos.set(data.shipTos);
    this.logs.set(data.logs);
    this.contracts.set(data.freightContracts);
    this.labContracts.set(data.labContracts);
    this.slContracts.set(data.slContracts);
    this.jobs.set(data.labJobs);
    this.labSummaries.set(data.labSummaries);
    this.charges.set(data.jobCharges);
    this.credits.set(data.jobCredits);
    this.lensBanks.set(data.lensBanks);
    this.labJobContracts.set(data.labJobContracts);
    this.rewardPrograms.set(data.rewardPrograms);
    this.labReviews.set(data.labReviews);
    this.keyedComments.set(data.keyedComments);
    this.contacts.set(data.contacts);
    this.labAuthorizations.set(data.labAuthorizations);
    this.smsContacts.set(data.smsContacts);
    this.selectedShipTo.set(selectedShipTo);
    this.selectedContract.set(data.freightContracts.at(0) ?? null);
    this.selectedLog.set(data.logs.at(0) ?? null);
    this.selectedJob.set(data.labJobs.at(0) ?? null);
    this.isLoaded.set(true);
    this.loadError.set('');
    this.clearUrlParameters();
  }

  selectLoadedShipTo(shipTo: CustomerInquiryShipTo): void {
    this.selectedShipTo.set(shipTo);
    this.shipToNoInput.set(shipTo.shipToNo);
  }

  startNewInquiry(): void {
    this.clearLoadedInquiry();
    this.customerCodeInput.set('');
    this.shipToNoInput.set('');
    this.loadError.set('');
  }

  private clearLoadedInquiry(): void {
    this.customer.set(null);
    this.shipTos.set([]);
    this.logs.set([]);
    this.contracts.set([]);
    this.labContracts.set([]);
    this.slContracts.set([]);
    this.jobs.set([]);
    this.labSummaries.set([]);
    this.charges.set([]);
    this.credits.set([]);
    this.lensBanks.set([]);
    this.labJobContracts.set([]);
    this.rewardPrograms.set([]);
    this.labReviews.set([]);
    this.keyedComments.set([]);
    this.contacts.set([]);
    this.labAuthorizations.set([]);
    this.smsContacts.set([]);
    this.selectedShipTo.set(null);
    this.selectedContract.set(null);
    this.selectedLog.set(null);
    this.selectedJob.set(null);
    this.isLoaded.set(false);
  }

  private clearUrlParameters(): void {
    if (this.route.snapshot.paramMap.keys.length > 0) {
      this.location.replaceState('/customer-inquiry');
    }
  }
}

function getInputValue(event: Event): string {
  return event.target instanceof HTMLInputElement ? event.target.value : '';
}

function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

function lookupGridHeight(rowCount: number): string {
  const headerAndFilterHeight = 94;
  const rowHeight = 41;
  const bottomBorderAllowance = 4;
  return `${headerAndFilterHeight + rowCount * rowHeight + bottomBorderAllowance}px`;
}

function isCustomer(value: unknown): value is CustomerInquiryCustomer {
  const candidate = value as Partial<Record<keyof CustomerInquiryCustomer, unknown>>;
  return typeof candidate.custCode === 'string' && typeof candidate.custName === 'string';
}

function isShipToLookup(value: unknown): value is CustomerInquiryShipToLookup {
  const candidate = value as Partial<Record<keyof CustomerInquiryShipToLookup, unknown>>;
  return (
    typeof candidate.custCode === 'string' &&
    typeof candidate.custName === 'string' &&
    typeof candidate.shipToNo === 'string' &&
    typeof candidate.name === 'string'
  );
}

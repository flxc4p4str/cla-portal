import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  IgxCheckboxModule,
  IgxGridModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxTabsModule,
} from '@infragistics/igniteui-angular';

import {
  CustomerInquiryAccountingSettings,
  CustomerInquiryActivity,
  CustomerInquiryAging,
  CustomerInquiryDocument,
  CustomerInquiryEvent,
  CustomerInquiryInfoAffiliation,
  CustomerInquiryInfoCode,
  CustomerInquiryInfoManufacturerAccount,
  CustomerInquiryOpenArByDocumentType,
  CustomerInquiryOpenBalance,
  CustomerInquirySalesSettings,
  CustomerInquiryStatistic,
} from '../../data/customer-inquiry.models';

@Component({
  selector: 'app-customer-inquiry-info',
  standalone: true,
  imports: [IgxCheckboxModule, IgxGridModule, IgxInputGroupModule, IgxRadioModule, IgxTabsModule],
  template: `
    <section class="info-tab">
      <section class="info-row top-row">
        <section class="panel child-tabs-panel">
          <igx-tabs>
            <igx-tab-item>
              <igx-tab-header>Master File Codes</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="codes()" [height]="topTabGridHeight" [autoGenerate]="false">
                  <igx-column field="type" header="Type" [width]="'170px'"></igx-column>
                  <igx-column field="code" header="Code" [width]="'130px'"></igx-column>
                  <igx-column field="description" header="Description" [width]="'360px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Sales</igx-tab-header>
              <igx-tab-content>
                <section class="settings-form" aria-label="Sales settings">
                  <div class="settings-column checkbox-list">
                    <igx-checkbox [checked]="salesSettings().noRestockingFee" [disabled]="true">No Restocking Fee</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().noSampleSurcharge" [disabled]="true">No Sample Surcharge</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().noSampleHandling" [disabled]="true">No Sample Handling</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().noPriceOnInvoice" [disabled]="true">No Price on Invoice</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().shipComplete" [disabled]="true">Ship Complete</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().webAuthorized" [disabled]="true">Web Authorized</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().pecpAuthorized" [disabled]="true">PECP Authorized</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().refuseReturns" [disabled]="true">Refuse Returns</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().salesHold" [disabled]="true">Sales Hold</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().poRequired" [disabled]="true">PO Required</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().shipToRequired" [disabled]="true">Ship-To Required</igx-checkbox>
                    <igx-checkbox [checked]="salesSettings().noSubs" [disabled]="true">No Subs</igx-checkbox>
                  </div>

                  <div class="settings-column grouped-controls">
                    <fieldset class="option-group">
                      <legend>Storage Type</legend>
                      <igx-radio-group class="radio-list">
                        <igx-radio [value]="'BIN'" [checked]="salesSettings().storageType === 'BIN'" [disabled]="true">Bin</igx-radio>
                        <igx-radio [value]="'SHELF'" [checked]="salesSettings().storageType === 'SHELF'" [disabled]="true">Shelf</igx-radio>
                        <igx-radio [value]="'REGULAR'" [checked]="salesSettings().storageType === 'REGULAR'" [disabled]="true">Regular</igx-radio>
                      </igx-radio-group>
                    </fieldset>

                    <fieldset class="option-group">
                      <legend>Bill Status</legend>
                      <igx-radio-group class="radio-list">
                        <igx-radio [value]="'NA'" [checked]="salesSettings().billStatus === 'NA'" [disabled]="true">N/A</igx-radio>
                        <igx-radio [value]="'BILLABLE'" [checked]="salesSettings().billStatus === 'BILLABLE'" [disabled]="true">Billable</igx-radio>
                        <igx-radio [value]="'EXEMPT'" [checked]="salesSettings().billStatus === 'EXEMPT'" [disabled]="true">Exempt</igx-radio>
                      </igx-radio-group>
                    </fieldset>

                    <div class="form-fields">
                      <igx-input-group type="box">
                        <label igxLabel>Start Billing</label>
                        <input igxInput readonly [value]="salesSettings().startBilling ?? ''" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>Ship To</label>
                        <input igxInput readonly [value]="salesSettings().shipTo" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>DPD Printer</label>
                        <input igxInput readonly [value]="salesSettings().dpdPrinter" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>BG Discount</label>
                        <input igxInput readonly [value]="salesSettings().bgDiscount" />
                      </igx-input-group>
                    </div>
                  </div>
                </section>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Accounting</igx-tab-header>
              <igx-tab-content>
                <section class="settings-form" aria-label="Accounting settings">
                  <div class="settings-column grouped-controls">
                    <div class="checkbox-list compact">
                      <igx-checkbox [checked]="accountingSettings().noFinanceCharge" [disabled]="true">No Finance Charge</igx-checkbox>
                      <igx-checkbox [checked]="accountingSettings().noTrw" [disabled]="true">No TRW</igx-checkbox>
                      <igx-checkbox [checked]="accountingSettings().exemptFromSalesTax" [disabled]="true">Exempt from Sales Tax</igx-checkbox>
                    </div>

                    <div class="form-fields">
                      <igx-input-group type="box">
                        <label igxLabel>Business Established</label>
                        <input igxInput readonly [value]="accountingSettings().businessEstablished" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>Status</label>
                        <input igxInput readonly [value]="accountingSettings().status" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>Resale No</label>
                        <input igxInput readonly [value]="accountingSettings().resaleNo" />
                      </igx-input-group>
                      <igx-input-group type="box">
                        <label igxLabel>Statement Email</label>
                        <input igxInput readonly [value]="accountingSettings().statementEmail" />
                      </igx-input-group>
                    </div>
                  </div>

                  <div class="settings-column grouped-controls">
                    <fieldset class="option-group">
                      <legend>Queue</legend>
                      <igx-radio-group class="radio-list">
                        <igx-radio [value]="'NONE'" [checked]="accountingSettings().queueType === 'NONE'" [disabled]="true">None</igx-radio>
                        <igx-radio [value]="'REMINDER'" [checked]="accountingSettings().queueType === 'REMINDER'" [disabled]="true">Reminder</igx-radio>
                        <igx-radio [value]="'AUTO_CHG'" [checked]="accountingSettings().queueType === 'AUTO_CHG'" [disabled]="true">Auto Chg</igx-radio>
                        <igx-radio [value]="'AUTO_PAY_ACH'" [checked]="accountingSettings().queueType === 'AUTO_PAY_ACH'" [disabled]="true">Auto Pay ACH</igx-radio>
                      </igx-radio-group>
                    </fieldset>

                    <fieldset class="option-group">
                      <legend>Printed Statements</legend>
                      <igx-radio-group class="radio-list inline">
                        <igx-radio [value]="'MAIL'" [checked]="accountingSettings().printedStatements === 'MAIL'" [disabled]="true">Mail</igx-radio>
                        <igx-radio [value]="'PULL'" [checked]="accountingSettings().printedStatements === 'PULL'" [disabled]="true">Pull</igx-radio>
                        <igx-radio [value]="'NONE'" [checked]="accountingSettings().printedStatements === 'NONE'" [disabled]="true">None</igx-radio>
                      </igx-radio-group>
                    </fieldset>

                    <fieldset class="option-group">
                      <legend>Electronic Statements</legend>
                      <igx-radio-group class="radio-list inline">
                        <igx-radio [value]="'NONE'" [checked]="accountingSettings().electronicStatements === 'NONE'" [disabled]="true">None</igx-radio>
                        <igx-radio [value]="'EMAIL'" [checked]="accountingSettings().electronicStatements === 'EMAIL'" [disabled]="true">Email</igx-radio>
                        <igx-radio [value]="'FAX'" [checked]="accountingSettings().electronicStatements === 'FAX'" [disabled]="true">Fax</igx-radio>
                      </igx-radio-group>
                    </fieldset>

                    <fieldset class="option-group">
                      <legend>Fuel Sur</legend>
                      <igx-radio-group class="radio-list">
                        <igx-radio [value]="'APPLY'" [checked]="accountingSettings().fuelSur === 'APPLY'" [disabled]="true">Apply</igx-radio>
                        <igx-radio [value]="'MAIN_LOC_EXEMPT'" [checked]="accountingSettings().fuelSur === 'MAIN_LOC_EXEMPT'" [disabled]="true">Main Loc Exempt</igx-radio>
                        <igx-radio [value]="'ALL_LOCS_EXEMPT'" [checked]="accountingSettings().fuelSur === 'ALL_LOCS_EXEMPT'" [disabled]="true">All Locs Exempt</igx-radio>
                      </igx-radio-group>
                    </fieldset>
                  </div>
                </section>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Affiliations</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="affiliations()" [height]="topTabGridHeight" [autoGenerate]="false">
                  <igx-column field="code" header="Code" [width]="'110px'"></igx-column>
                  <igx-column field="name" header="Name" [width]="'230px'"></igx-column>
                  <igx-column field="status" header="Status" [width]="'110px'"></igx-column>
                  <igx-column field="notes" header="Notes" [width]="'340px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Manuf Acct Numbers</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="manufacturerAccounts()" [height]="topTabGridHeight" [autoGenerate]="false">
                  <igx-column field="manufacturer" header="Manufacturer" [width]="'170px'"></igx-column>
                  <igx-column field="accountNo" header="Account No" [width]="'160px'"></igx-column>
                  <igx-column field="name" header="Name" [width]="'260px'"></igx-column>
                  <igx-column field="status" header="Status" [width]="'120px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>
          </igx-tabs>
        </section>

        <section class="right-stack">
          <section class="panel compact-grid-panel">
            <header class="panel-header">Open Balances</header>
            <igx-grid [data]="openBalances()" [height]="compactGridHeight" [autoGenerate]="false">
              <igx-column field="type" header="Type" [width]="'170px'"></igx-column>
              <igx-column field="amount" header="Amount" dataType="currency" [width]="'150px'"></igx-column>
            </igx-grid>
          </section>

          <section class="panel compact-grid-panel">
            <header class="panel-header">Open AR by Document Type</header>
            <igx-grid [data]="openArByDocumentType()" [height]="compactGridHeight" [autoGenerate]="false">
              <igx-column field="type" header="Type" [width]="'190px'"></igx-column>
              <igx-column field="amount" header="Amount" dataType="currency" [width]="'150px'"></igx-column>
            </igx-grid>
          </section>
        </section>
      </section>

      <section class="info-row bottom-row">
        <section class="panel child-tabs-panel">
          <igx-tabs>
            <igx-tab-item>
              <igx-tab-header>Statistics</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="statistics()" [height]="bottomTabGridHeight" [autoGenerate]="false">
                  <igx-column field="metric" header="xTD" [width]="'180px'"></igx-column>
                  <igx-column field="mtd" header="MTD" dataType="number" [width]="'120px'"></igx-column>
                  <igx-column field="ytd" header="YTD" dataType="number" [width]="'120px'"></igx-column>
                  <igx-column field="lyr" header="LYR" dataType="number" [width]="'120px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Activity</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="activity()" [height]="bottomTabGridHeight" [autoGenerate]="false">
                  <igx-column field="activity" header="Activity" [width]="'180px'"></igx-column>
                  <igx-column field="mtd" header="MTD" dataType="number" [width]="'120px'"></igx-column>
                  <igx-column field="ytd" header="YTD" dataType="number" [width]="'120px'"></igx-column>
                  <igx-column field="lyr" header="LYR" dataType="number" [width]="'120px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Documents</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="documents()" [height]="bottomTabGridHeight" [autoGenerate]="false">
                  <igx-column field="documentType" header="Type" [width]="'130px'"></igx-column>
                  <igx-column field="documentNo" header="Document No" [width]="'160px'"></igx-column>
                  <igx-column field="documentDate" header="Date" dataType="date" [width]="'125px'"></igx-column>
                  <igx-column field="amount" header="Amount" dataType="currency" [width]="'125px'"></igx-column>
                  <igx-column field="status" header="Status" [width]="'120px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>

            <igx-tab-item>
              <igx-tab-header>Events</igx-tab-header>
              <igx-tab-content>
                <igx-grid [data]="events()" [height]="bottomTabGridHeight" [autoGenerate]="false">
                  <igx-column field="eventDate" header="Date" dataType="date" [width]="'125px'"></igx-column>
                  <igx-column field="eventType" header="Type" [width]="'145px'"></igx-column>
                  <igx-column field="description" header="Description" [width]="'360px'"></igx-column>
                  <igx-column field="user" header="User" [width]="'120px'"></igx-column>
                </igx-grid>
              </igx-tab-content>
            </igx-tab-item>
          </igx-tabs>
        </section>

        <section class="panel aging-panel">
          <header class="panel-header">Aging</header>
          <igx-grid [data]="aging()" [height]="bottomTabGridHeight" [autoGenerate]="false">
            <igx-column field="aging" header="Aging" [width]="'180px'"></igx-column>
            <igx-column field="amount" header="Amount" dataType="currency" [width]="'160px'"></igx-column>
          </igx-grid>
        </section>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .info-tab {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: var(--text-primary);
    }

    .info-row {
      display: grid;
      gap: 0.75rem;
      align-items: stretch;
    }

    .top-row {
      grid-template-columns: minmax(0, 3fr) minmax(360px, 2fr);
    }

    .bottom-row {
      grid-template-columns: minmax(0, 13fr) minmax(360px, 12fr);
    }

    .panel {
      min-width: 0;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: var(--app-radius);
      padding: 0.75rem;
    }

    .panel-header {
      margin-bottom: 0.55rem;
      color: var(--text-primary);
      font-weight: 700;
    }

    .child-tabs-panel {
      padding: 0;
      overflow: hidden;
    }

    .right-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 0;
    }

    .compact-grid-panel,
    .aging-panel {
      overflow: hidden;
    }

    .settings-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      min-height: 265px;
      border-top: 1px solid var(--surface-border);
      padding: 0.75rem;
    }

    .settings-column {
      min-width: 0;
    }

    .checkbox-list,
    .grouped-controls,
    .form-fields,
    .radio-list {
      display: flex;
      flex-direction: column;
    }

    .checkbox-list {
      gap: 0.32rem;
      padding-top: 0.2rem;
    }

    .checkbox-list.compact {
      gap: 0.45rem;
      margin-bottom: 0.65rem;
    }

    .grouped-controls,
    .form-fields {
      gap: 0.6rem;
    }

    .option-group {
      min-width: 0;
      border: 1px solid var(--surface-border);
      border-radius: 0.35rem;
      margin: 0;
      padding: 0.45rem 0.6rem 0.55rem;
      background: color-mix(in srgb, var(--surface) 86%, white);
    }

    .option-group legend {
      padding: 0 0.25rem;
      color: var(--text-muted);
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .radio-list {
      gap: 0.35rem;
    }

    .radio-list.inline {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.35rem 0.75rem;
    }

    igx-input-group {
      --ig-size: var(--ig-size-small);
    }

    .child-tabs-panel igx-grid {
      border-top: 1px solid var(--surface-border);
    }

    igx-grid {
      --ig-size: var(--ig-size-small);
    }

    @media (max-width: 1150px) {
      .top-row,
      .bottom-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 750px) {
      .settings-form {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryInfoComponent {
  readonly codes = input.required<CustomerInquiryInfoCode[]>();
  readonly salesSettings = input.required<CustomerInquirySalesSettings>();
  readonly accountingSettings = input.required<CustomerInquiryAccountingSettings>();
  readonly affiliations = input.required<CustomerInquiryInfoAffiliation[]>();
  readonly manufacturerAccounts = input.required<CustomerInquiryInfoManufacturerAccount[]>();
  readonly openBalances = input.required<CustomerInquiryOpenBalance[]>();
  readonly openArByDocumentType = input.required<CustomerInquiryOpenArByDocumentType[]>();
  readonly statistics = input.required<CustomerInquiryStatistic[]>();
  readonly activity = input.required<CustomerInquiryActivity[]>();
  readonly documents = input.required<CustomerInquiryDocument[]>();
  readonly events = input.required<CustomerInquiryEvent[]>();
  readonly aging = input.required<CustomerInquiryAging[]>();

  readonly topTabGridHeight = '265px';
  readonly bottomTabGridHeight = '250px';
  readonly compactGridHeight = '118px';
}

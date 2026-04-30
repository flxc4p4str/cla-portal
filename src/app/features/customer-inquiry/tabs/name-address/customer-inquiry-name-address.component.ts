import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IgxCheckboxModule, IgxGridModule, IgxInputGroupModule, IgxTabsModule } from '@infragistics/igniteui-angular';

import {
  CustomerInquiryContact,
  CustomerInquiryCustomer,
  CustomerInquiryKeyedComment,
  CustomerInquiryLabAuthorization,
  CustomerInquiryShipTo,
  CustomerInquirySmsContact,
} from '../../data/customer-inquiry.models';

interface ShipToSelectionEvent {
  newSelection: CustomerInquiryShipTo[];
}

@Component({
  selector: 'app-customer-inquiry-name-address',
  standalone: true,
  imports: [IgxCheckboxModule, IgxGridModule, IgxInputGroupModule, IgxTabsModule],
  template: `
    <section class="name-address-tab">
      <div class="top-layout">
        <section class="panel customer-panel">
          <header class="panel-header">Customer</header>

          <div class="field-grid">
            <label>Customer</label>
            <div class="field-value strong">{{ customer().custCode }} - {{ customer().custName }}</div>

            <label>Address</label>
            <div class="field-value stacked">
              <span>{{ customer().addr1 }}</span>
              @if (customer().addr2) {
                <span>{{ customer().addr2 }}</span>
              }
              @if (customer().addr3) {
                <span>{{ customer().addr3 }}</span>
              }
            </div>

            <label>City/State/Zip</label>
            <div class="field-value">{{ cityStateZip() }}</div>

            <label>Country</label>
            <div class="field-value">{{ customer().country }}</div>

            <label>Phone</label>
            <div class="field-value inline-pair">
              <span>{{ customer().phone }}</span>
              <span>Fax: {{ customer().fax || '-' }}</span>
            </div>

            <label>Contact</label>
            <div class="field-value">{{ customer().contact || '-' }}</div>

            <label>Email</label>
            <div class="field-value">{{ customer().email || '-' }}</div>
          </div>
        </section>

        <section class="panel comments-panel">
          <header class="panel-header">Comment</header>
          <div class="comment-box">{{ customer().comments || 'No customer comments.' }}</div>

          <div class="read-only-check">
            <igx-checkbox [checked]="customer().orderOneTimePerDay" [disabled]="true">Order 1x / day</igx-checkbox>
          </div>
        </section>

        <section class="panel copy-panel">
          <header class="panel-header">Document Copies</header>

          <div class="copy-grid">
            <div class="copy-box">
              <div class="copy-title">DPD Copies</div>
              <div>{{ copyDisplay(customer().dpdCopies) }}</div>
            </div>

            <div class="copy-box">
              <div class="copy-title">ECP Copies</div>
              <div>{{ copyDisplay(customer().ecpCopies) }}</div>
            </div>

            <div class="copy-box">
              <div class="copy-title">CRM Copies</div>
              <div>{{ copyDisplay(customer().crmCopies) }}</div>
            </div>
          </div>
        </section>

        <section class="panel shipment-panel">
          <header class="panel-header">Shipment Binning</header>
          <div class="weekday-row">
            <igx-checkbox [checked]="true" [disabled]="true">Monday</igx-checkbox>
            <igx-checkbox [checked]="true" [disabled]="true">Tuesday</igx-checkbox>
            <igx-checkbox [checked]="true" [disabled]="true">Wednesday</igx-checkbox>
            <igx-checkbox [checked]="true" [disabled]="true">Thursday</igx-checkbox>
            <igx-checkbox [checked]="true" [disabled]="true">Friday</igx-checkbox>
          </div>
          <div class="muted-note">Runtime source maps to ARTCUST8 SHIP_MON through SHIP_FRI in WinForms.</div>
        </section>
      </div>

      <section class="panel selected-shipto-panel">
        <header class="panel-header">Selected Ship To</header>
        @if (selectedShipTo(); as shipTo) {
          <div class="selected-shipto-grid">
            <div><span class="mini-label">Code</span>{{ shipTo.shipToNo }}</div>
            <div><span class="mini-label">Name</span>{{ shipTo.name }}</div>
            <div><span class="mini-label">Lab</span>{{ shipTo.labCode || '-' }}</div>
            <div><span class="mini-label">Phone</span>{{ shipTo.phone || '-' }}</div>
            <div><span class="mini-label">Contact</span>{{ shipTo.contact || '-' }}</div>
            <div><span class="mini-label">Email</span>{{ shipTo.email || '-' }}</div>
          </div>
        } @else {
          <div class="muted-note">Select a location below.</div>
        }
      </section>

      <section class="panel child-tabs-panel">
        <igx-tabs class="child-tabs">
          <igx-tab-item>
            <igx-tab-header>Locations</igx-tab-header>
            <igx-tab-content>
              <igx-grid
                [data]="shipTos()"
                [primaryKey]="'shipToNo'"
                [rowSelection]="'single'"
                [height]="'310px'"
                [autoGenerate]="false"
                (rowSelectionChanging)="onShipToSelection($event)"
              >
                <igx-column field="shipToNo" header="Code" [width]="'90px'"></igx-column>
                <igx-column field="labCode" header="Lab" [width]="'90px'"></igx-column>
                <igx-column field="alternateCustomer" header="Alt Cust" [width]="'110px'"></igx-column>
                <igx-column field="noReturnLabel" header="No Return Label" dataType="boolean" [width]="'145px'"></igx-column>
                <igx-column field="name" header="Name" [width]="'220px'"></igx-column>
                <igx-column field="addr1" header="Address L1" [width]="'220px'"></igx-column>
                <igx-column field="addr2" header="Address L2" [width]="'160px'"></igx-column>
                <igx-column field="city" header="City" [width]="'150px'"></igx-column>
                <igx-column field="state" header="State" [width]="'85px'"></igx-column>
                <igx-column field="zipCode" header="Zip" [width]="'115px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Keyed Comments</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="keyedComments()" [height]="'310px'" [autoGenerate]="false">
                <igx-column field="key" header="Key" [width]="'160px'"></igx-column>
                <igx-column field="comment" header="Comment" [width]="'720px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Contacts</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="contacts()" [height]="'310px'" [autoGenerate]="false">
                <igx-column field="customer" header="Customer" [width]="'120px'"></igx-column>
                <igx-column field="type" header="Type" [width]="'120px'"></igx-column>
                <igx-column field="vendor" header="Vendor" [width]="'120px'"></igx-column>
                <igx-column field="name" header="Name" [width]="'180px'"></igx-column>
                <igx-column field="phone" header="Phone" [width]="'140px'"></igx-column>
                <igx-column field="ext" header="Ext" [width]="'80px'"></igx-column>
                <igx-column field="fax" header="Fax" [width]="'140px'"></igx-column>
                <igx-column field="email" header="Email" [width]="'240px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>Lab Authorizations</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="labAuthorizations()" [height]="'310px'" [autoGenerate]="false">
                <igx-column field="authCode" header="Auth Code" [width]="'130px'"></igx-column>
                <igx-column field="name" header="Name" [width]="'220px'"></igx-column>
                <igx-column field="status" header="Status" [width]="'110px'"></igx-column>
                <igx-column field="createdBy" header="Created By" [width]="'130px'"></igx-column>
                <igx-column field="createdOn" header="Created On" [width]="'130px'"></igx-column>
                <igx-column field="modifiedBy" header="Modified By" [width]="'130px'"></igx-column>
                <igx-column field="modifiedOn" header="Modified On" [width]="'130px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>

          <igx-tab-item>
            <igx-tab-header>SMS Contacts</igx-tab-header>
            <igx-tab-content>
              <igx-grid [data]="smsContacts()" [height]="'310px'" [autoGenerate]="false">
                <igx-column field="shipToNo" header="Ship To" [width]="'110px'"></igx-column>
                <igx-column field="name" header="Name" [width]="'280px'"></igx-column>
                <igx-column field="smsNo" header="SMS No" [width]="'160px'"></igx-column>
                <igx-column field="smsName" header="SMS Name" [width]="'240px'"></igx-column>
              </igx-grid>
            </igx-tab-content>
          </igx-tab-item>
        </igx-tabs>
      </section>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .name-address-tab {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      color: var(--text-primary);
    }

    .top-layout {
      display: grid;
      grid-template-columns: minmax(350px, 1.2fr) minmax(260px, 0.8fr) minmax(270px, 0.7fr);
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

    .field-grid {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr);
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
    .comment-box,
    .copy-box,
    .selected-shipto-grid > div {
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

    .stacked {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .inline-pair {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .comment-box {
      min-height: 4.75rem;
      white-space: pre-wrap;
    }

    .read-only-check {
      margin-top: 0.65rem;
    }

    .copy-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;
    }

    .copy-title {
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .shipment-panel {
      grid-column: 1 / -1;
    }

    .weekday-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .muted-note {
      margin-top: 0.4rem;
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .selected-shipto-grid {
      display: grid;
      grid-template-columns: 90px minmax(220px, 1.5fr) 100px minmax(140px, 1fr) minmax(160px, 1fr) minmax(220px, 1.5fr);
      gap: 0.5rem;
    }

    .selected-shipto-grid > div {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .child-tabs-panel {
      padding-bottom: 0.5rem;
    }

    .child-tabs {
      display: block;
    }

    igx-grid {
      --ig-size: var(--ig-size-small);
    }

    @media (max-width: 1100px) {
      .top-layout {
        grid-template-columns: 1fr;
      }

      .selected-shipto-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInquiryNameAddressComponent {
  readonly customer = input.required<CustomerInquiryCustomer>();
  readonly shipTos = input.required<CustomerInquiryShipTo[]>();
  readonly keyedComments = input.required<CustomerInquiryKeyedComment[]>({ alias: 'keyedComments' });
  readonly contacts = input.required<CustomerInquiryContact[]>({ alias: 'contacts' });
  readonly labAuthorizations = input.required<CustomerInquiryLabAuthorization[]>({ alias: 'labAuthorizations' });
  readonly smsContacts = input.required<CustomerInquirySmsContact[]>({ alias: 'smsContacts' });
  readonly selectedShipTo = input<CustomerInquiryShipTo | null>(null);

  readonly selectedShipToChange = output<CustomerInquiryShipTo>();

  readonly cityStateZip = computed(() => {
    const customer = this.customer();
    return [customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ');
  });

  copyDisplay(value: string): string {
    switch (value) {
      case 'E':
        return 'Email';
      case 'P':
        return 'Print';
      case 'N':
        return 'None';
      default:
        return value || '-';
    }
  }

  onShipToSelection(event: ShipToSelectionEvent): void {
    const selectedShipTo = event.newSelection.at(0);
    if (selectedShipTo) {
      this.selectedShipToChange.emit(selectedShipTo);
    }
  }
}

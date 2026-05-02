import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@abs-environments/environment';
import {
  ApiResponse,
  CustomerInquiryCustomer,
  CustomerInquiryData,
  CustomerInquiryShipToLookup,
} from '../data/customer-inquiry.models';

@Injectable({ providedIn: 'root' })
export class CustomerInquiryApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/AR/customer-inquiry`;

  searchCustomers(filter: string): Observable<CustomerInquiryCustomer[]> {
    return this.http
      .get<ApiResponse<CustomerInquiryCustomer[]>>(`${this.baseUrl}/customers`, {
        params: createFilterParams(filter),
      })
      .pipe(map((response) => response.data ?? []));
  }

  searchShipTos(custCode: string, filter: string): Observable<CustomerInquiryShipToLookup[]> {
    return this.http
      .get<ApiResponse<CustomerInquiryShipToLookup[]>>(
        `${this.baseUrl}/${encodeURIComponent(custCode)}/shiptos`,
        { params: createFilterParams(filter) },
      )
      .pipe(map((response) => response.data ?? []));
  }

  getCustomerInquiry(custCode: string, shipToNo: string): Observable<CustomerInquiryData> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${encodeURIComponent(custCode)}/${encodeURIComponent(shipToNo)}`,
      )
      .pipe(map((response) => {
        const inquiry = unwrapInquiryResponse(response);

        if (!inquiry) {
          throw new Error('Customer inquiry load failed.');
        }

        return normalizeInquiryData(inquiry);
      }));
  }
}

function createFilterParams(filter: string): HttpParams {
  return new HttpParams().set('filter', filter);
}

function unwrapInquiryResponse(response: unknown): CustomerInquiryData | null {
  if (!isRecord(response)) {
    return null;
  }

  if (response['success'] === false) {
    throw new Error(typeof response['errorMessage'] === 'string' && response['errorMessage']
      ? response['errorMessage']
      : 'Customer inquiry load failed.');
  }

  if ('data' in response && isCustomerInquiryData(response['data'])) {
    return response['data'];
  }

  if (isCustomerInquiryData(response)) {
    return response;
  }

  return null;
}

function isCustomerInquiryData(value: unknown): value is CustomerInquiryData {
  return isRecord(value) && isRecord(value['customer']) && Array.isArray(value['shipTos']);
}

function normalizeInquiryData(data: CustomerInquiryData): CustomerInquiryData {
  return {
    ...data,
    customer: {
      ...data.customer,
      orderOneTimePerDay: toBoolean(data.customer.orderOneTimePerDay),
    },
    shipTos: (data.shipTos ?? []).map((shipTo) => ({
      ...shipTo,
      noReturnLabel: toBoolean(shipTo.noReturnLabel),
    })),
    keyedComments: data.keyedComments ?? [],
    contacts: data.contacts ?? [],
    labAuthorizations: data.labAuthorizations ?? [],
    smsContacts: data.smsContacts ?? [],
    logs: data.logs ?? [],
    freightContracts: (data.freightContracts ?? []).map((contract) => ({
      ...contract,
      locked: toBoolean(contract.locked),
      neverEnds: toBoolean(contract.neverEnds),
      alwaysChargeDelFreight: toBoolean(contract.alwaysChargeDelFreight),
    })),
    labContracts: data.labContracts ?? [],
    slContracts: data.slContracts ?? [],
    labJobs: (data.labJobs ?? []).map((job) => ({
      ...job,
      pair50: toBoolean(job.pair50),
      billingHold: toBoolean(job.billingHold),
    })),
    jobCharges: data.jobCharges ?? [],
    jobCredits: data.jobCredits ?? [],
    labSummaries: data.labSummaries ?? [],
    lensBanks: data.lensBanks ?? [],
    labJobContracts: data.labJobContracts ?? [],
    rewardPrograms: data.rewardPrograms ?? [],
    labReviews: data.labReviews ?? [],
    infoCodes: data.infoCodes ?? [],
    salesSettings: normalizeSalesSettings(data.salesSettings),
    accountingSettings: normalizeAccountingSettings(data.accountingSettings),
    infoAffiliations: data.infoAffiliations ?? [],
    infoManufacturerAccounts: data.infoManufacturerAccounts ?? [],
    openBalances: data.openBalances ?? [],
    openArByDocumentType: data.openArByDocumentType ?? [],
    infoStatistics: data.infoStatistics ?? [],
    infoActivity: data.infoActivity ?? [],
    infoDocuments: data.infoDocuments ?? [],
    infoEvents: data.infoEvents ?? [],
    infoAging: data.infoAging ?? [],
  };
}

function normalizeSalesSettings(
  settings: CustomerInquiryData['salesSettings'] | null | undefined,
): CustomerInquiryData['salesSettings'] {
  const defaults = defaultSalesSettings();
  const source = settings ?? defaults;

  return {
    ...defaults,
    ...source,
    noRestockingFee: toBoolean(source.noRestockingFee),
    noSampleSurcharge: toBoolean(source.noSampleSurcharge),
    noSampleHandling: toBoolean(source.noSampleHandling),
    noPriceOnInvoice: toBoolean(source.noPriceOnInvoice),
    shipComplete: toBoolean(source.shipComplete),
    webAuthorized: toBoolean(source.webAuthorized),
    pecpAuthorized: toBoolean(source.pecpAuthorized),
    refuseReturns: toBoolean(source.refuseReturns),
    salesHold: toBoolean(source.salesHold),
    poRequired: toBoolean(source.poRequired),
    shipToRequired: toBoolean(source.shipToRequired),
    noSubs: toBoolean(source.noSubs),
  };
}

function normalizeAccountingSettings(
  settings: CustomerInquiryData['accountingSettings'] | null | undefined,
): CustomerInquiryData['accountingSettings'] {
  const defaults = defaultAccountingSettings();
  const source = settings ?? defaults;

  return {
    ...defaults,
    ...source,
    noFinanceCharge: toBoolean(source.noFinanceCharge),
    noTrw: toBoolean(source.noTrw),
    exemptFromSalesTax: toBoolean(source.exemptFromSalesTax),
  };
}

function defaultSalesSettings(): CustomerInquiryData['salesSettings'] {
  return {
    noRestockingFee: false,
    noSampleSurcharge: false,
    noSampleHandling: false,
    noPriceOnInvoice: false,
    shipComplete: false,
    webAuthorized: false,
    pecpAuthorized: false,
    refuseReturns: false,
    salesHold: false,
    poRequired: false,
    shipToRequired: false,
    noSubs: false,
    storageType: 'REGULAR',
    billStatus: 'NA',
    startBilling: null,
    shipTo: '',
    dpdPrinter: '',
    bgDiscount: '',
  };
}

function defaultAccountingSettings(): CustomerInquiryData['accountingSettings'] {
  return {
    noFinanceCharge: false,
    noTrw: false,
    businessEstablished: '',
    queueType: 'NONE',
    printedStatements: 'NONE',
    electronicStatements: 'NONE',
    statementEmail: '',
    fuelSur: 'APPLY',
    status: '',
    exemptFromSalesTax: false,
    resaleNo: '',
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toUpperCase();
    return normalizedValue === 'Y' || normalizedValue === '1' || normalizedValue === 'TRUE';
  }

  return false;
}

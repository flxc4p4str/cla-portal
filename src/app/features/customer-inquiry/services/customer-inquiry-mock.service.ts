import { Injectable } from '@angular/core';

import { CUSTOMER_INQUIRY_MOCK_DATASETS } from '../data/customer-inquiry.mock-data';
import {
  CustomerInquiryCustomer,
  CustomerInquiryData,
  CustomerInquiryShipToLookup,
} from '../data/customer-inquiry.models';

@Injectable({ providedIn: 'root' })
export class CustomerInquiryMockService {
  searchCustomers(filter: string): CustomerInquiryCustomer[] {
    const normalizedFilter = normalizeCode(filter);
    return CUSTOMER_INQUIRY_MOCK_DATASETS
      .map((data) => ({ ...data.customer }))
      .filter(
        (customer) =>
          normalizedFilter.length === 0 ||
          normalizeCode(customer.custCode).includes(normalizedFilter) ||
          normalizeCode(customer.custName).includes(normalizedFilter),
      );
  }

  searchShipTos(custCode: string, filter: string): CustomerInquiryShipToLookup[] {
    const normalizedFilter = normalizeCode(filter);
    return this.getShipTos(custCode).filter(
      (shipTo) =>
        normalizedFilter.length === 0 ||
        normalizeCode(shipTo.shipToNo).includes(normalizedFilter) ||
        normalizeCode(shipTo.name).includes(normalizedFilter) ||
        normalizeCode(shipTo.custCode).includes(normalizedFilter),
    );
  }

  getCustomers(): CustomerInquiryCustomer[] {
    return this.searchCustomers('');
  }

  getShipTos(custCode?: string): CustomerInquiryShipToLookup[] {
    const normalizedCustCode = normalizeCode(custCode);
    const datasets = normalizedCustCode
      ? CUSTOMER_INQUIRY_MOCK_DATASETS.filter((data) => normalizeCode(data.customer.custCode) === normalizedCustCode)
      : CUSTOMER_INQUIRY_MOCK_DATASETS;

    return datasets.flatMap((data) =>
      data.shipTos.map((shipTo) => ({
        ...shipTo,
        custCode: data.customer.custCode,
        custName: data.customer.custName,
      })),
    );
  }

  getCustomerInquiry(custCode: string, shipToNo: string): CustomerInquiryData | null {
    const normalizedCustCode = normalizeCode(custCode);
    const normalizedShipToNo = normalizeCode(shipToNo);
    const data = CUSTOMER_INQUIRY_MOCK_DATASETS.find(
      (item) =>
        normalizeCode(item.customer.custCode) === normalizedCustCode &&
        item.shipTos.some((shipTo) => normalizeCode(shipTo.shipToNo) === normalizedShipToNo),
    );

    return data ? cloneInquiryData(data) : null;
  }
}

function normalizeCode(value: string | undefined): string {
  return (value ?? '').trim().toUpperCase();
}

function cloneInquiryData(data: CustomerInquiryData): CustomerInquiryData {
  return {
    customer: { ...data.customer },
    shipTos: data.shipTos.map((shipTo) => ({ ...shipTo })),
    logs: data.logs.map((log) => ({ ...log })),
    freightContracts: data.freightContracts.map((contract) => ({ ...contract })),
    labContracts: data.labContracts.map((contract) => ({ ...contract })),
    slContracts: data.slContracts.map((contract) => ({ ...contract })),
    labJobs: data.labJobs.map((job) => ({ ...job })),
    labSummaries: data.labSummaries.map((summary) => ({ ...summary })),
    jobCharges: data.jobCharges.map((charge) => ({ ...charge })),
    jobCredits: data.jobCredits.map((credit) => ({ ...credit })),
    lensBanks: data.lensBanks.map((bank) => ({ ...bank })),
    labJobContracts: data.labJobContracts.map((contract) => ({ ...contract })),
    rewardPrograms: data.rewardPrograms.map((program) => ({ ...program })),
    labReviews: data.labReviews.map((review) => ({ ...review })),
    keyedComments: data.keyedComments.map((comment) => ({ ...comment })),
    contacts: data.contacts.map((contact) => ({ ...contact })),
    labAuthorizations: data.labAuthorizations.map((authorization) => ({ ...authorization })),
    smsContacts: data.smsContacts.map((contact) => ({ ...contact })),
    infoCodes: data.infoCodes.map((code) => ({ ...code })),
    salesSettings: { ...data.salesSettings },
    accountingSettings: { ...data.accountingSettings },
    infoAffiliations: data.infoAffiliations.map((affiliation) => ({ ...affiliation })),
    infoManufacturerAccounts: data.infoManufacturerAccounts.map((account) => ({ ...account })),
    openBalances: data.openBalances.map((balance) => ({ ...balance })),
    openArByDocumentType: data.openArByDocumentType.map((balance) => ({ ...balance })),
    infoStatistics: data.infoStatistics.map((statistic) => ({ ...statistic })),
    infoActivity: data.infoActivity.map((activity) => ({ ...activity })),
    infoDocuments: data.infoDocuments.map((document) => ({ ...document })),
    infoEvents: data.infoEvents.map((event) => ({ ...event })),
    infoAging: data.infoAging.map((aging) => ({ ...aging })),
  };
}

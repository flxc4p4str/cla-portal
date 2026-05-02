import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@abs-environments/environment';
import {
  CustomerInquiryCustomer,
  CustomerInquiryData,
  CustomerInquiryShipToLookup,
} from '../data/customer-inquiry.models';

@Injectable({ providedIn: 'root' })
export class CustomerInquiryApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/AR/customer-inquiry`;

  searchCustomers(filter: string): Observable<CustomerInquiryCustomer[]> {
    return this.http.get<CustomerInquiryCustomer[]>(`${this.baseUrl}/customers`, {
      params: createFilterParams(filter),
    });
  }

  searchShipTos(custCode: string, filter: string): Observable<CustomerInquiryShipToLookup[]> {
    return this.http.get<CustomerInquiryShipToLookup[]>(
      `${this.baseUrl}/${encodeURIComponent(custCode)}/shiptos`,
      { params: createFilterParams(filter) },
    );
  }

  getCustomerInquiry(custCode: string, shipToNo: string): Observable<CustomerInquiryData> {
    return this.http.get<CustomerInquiryData>(
      `${this.baseUrl}/${encodeURIComponent(custCode)}/${encodeURIComponent(shipToNo)}`,
    ).pipe(map(normalizeInquiryData));
  }
}

function createFilterParams(filter: string): HttpParams {
  return new HttpParams().set('filter', filter);
}

function normalizeInquiryData(data: CustomerInquiryData): CustomerInquiryData {
  return {
    ...data,
    shipTos: data.shipTos ?? [],
    logs: data.logs ?? [],
    freightContracts: data.freightContracts ?? [],
    labContracts: data.labContracts ?? [],
    slContracts: data.slContracts ?? [],
    labJobs: data.labJobs ?? [],
    labSummaries: data.labSummaries ?? [],
    jobCharges: data.jobCharges ?? [],
    jobCredits: data.jobCredits ?? [],
    lensBanks: data.lensBanks ?? [],
    labJobContracts: data.labJobContracts ?? [],
    rewardPrograms: data.rewardPrograms ?? [],
    labReviews: data.labReviews ?? [],
    keyedComments: data.keyedComments ?? [],
    contacts: data.contacts ?? [],
    labAuthorizations: data.labAuthorizations ?? [],
    smsContacts: data.smsContacts ?? [],
  };
}

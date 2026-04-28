import { Injectable } from '@angular/core';

import { CUSTOMER_INQUIRY_MOCK_DATA } from '../data/customer-inquiry.mock-data';
import { CustomerInquiryData } from '../data/customer-inquiry.models';

@Injectable({ providedIn: 'root' })
export class CustomerInquiryMockService {
  getCustomerInquiry(): CustomerInquiryData {
    return CUSTOMER_INQUIRY_MOCK_DATA;
  }
}

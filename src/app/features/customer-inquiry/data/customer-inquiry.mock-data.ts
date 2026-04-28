import { CustomerInquiryData } from './customer-inquiry.models';

export const CUSTOMER_INQUIRY_MOCK_DATA: CustomerInquiryData = {
  customer: {
    custCode: '1053703',
    custName: 'FLOL-FIN (LAB)',
    addr1: '1764 New Durham Road',
    addr2: '',
    addr3: '',
    city: 'South Plainfield',
    state: 'NJ',
    zipCode: '07080',
    country: 'USA',
    phone: '800-555-1200',
    fax: '800-555-1201',
    contact: 'Accounts Payable',
    email: 'ap@example.com',
    comments: 'Read-only mock migrated from WinForms Customer Inquiry.',
    orderOneTimePerDay: true,
    dpdCopies: '1',
    crmCopies: '1',
    ecpCopies: '1',
  },
  shipTos: [
    {
      shipToNo: '0012',
      labCode: 'FLOL',
      alternateCustomer: '',
      noReturnLabel: false,
      name: 'CVC- OAKVILLE #1029',
      addr1: '2460 Winston Churchill Blvd',
      addr2: 'Unit A',
      city: 'Oakville',
      state: 'ON',
      zipCode: 'L6H 6J5',
      phone: '905-555-1029',
      contact: 'Lab Manager',
      email: 'oakville@example.com',
    }
  ],
  logs: [],
  freightContracts: [],
  labJobs: [],
  jobCharges: [],
  jobCredits: []
};
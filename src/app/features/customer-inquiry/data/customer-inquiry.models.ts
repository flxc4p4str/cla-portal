export interface CustomerInquiryCustomer {
  custCode: string;
  custName: string;
  addr1: string;
  addr2: string;
  addr3: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  fax: string;
  contact: string;
  email: string;
  comments: string;
  orderOneTimePerDay: boolean;
  dpdCopies: string;
  crmCopies: string;
  ecpCopies: string;
}

export interface CustomerInquiryShipTo {
  shipToNo: string;
  labCode: string;
  alternateCustomer: string;
  noReturnLabel: boolean;
  name: string;
  addr1: string;
  addr2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  contact: string;
  email: string;
}

export interface CustomerInquiryLog {
  convNo: string;
  logged: string;
  by: string;
  shipToNo: string;
  contact: string;
  logCode: string;
  logDesc: string;
  notes: string;
  jobNo: string;
  orderNo: string;
  lastStatus: string;
  followUpDate: string;
  followUpWith: string;
  ackNotes: string;
}

export interface CustomerInquiryFreightContract {
  contractNo: number;
  date: string;
  type: 'S' | 'F' | 'M' | 'N';
  typeDescription: string;
  amount: number;
  start: string;
  end: string;
  shipVia: string;
  dpdShipVia: string;
  created: string;
  by: string;
  nthShipmentNo: number | null;
  locked: boolean;
  webFreeShipVia: string;
  webFreeAmount: number | null;
  neverEnds: boolean;
  alwaysChargeDelFreight: boolean;
}

export interface CustomerInquiryLabJob {
  jobNo: string;
  date: string;
  homeLab: string;
  frameArrived: string;
  status: string;
  redoReason: string;
  insurance: string;
  vspPays: string;
  partnerOrderNo: string;
  pair50: boolean;
  billingHold: boolean;
}

export interface CustomerInquiryJobCharge {
  jobNo: string;
  charge: string;
  eye: string;
  price: number;
  qty: number;
  amount: number;
  credited: number;
}

export interface CustomerInquiryJobCredit {
  jobNo: string;
  invNo: string;
  reason: string;
  total: number;
  freight: number;
  fuelSurcharge: number;
  date: string;
}

export interface CustomerInquiryData {
  customer: CustomerInquiryCustomer;
  shipTos: CustomerInquiryShipTo[];
  logs: CustomerInquiryLog[];
  freightContracts: CustomerInquiryFreightContract[];
  labJobs: CustomerInquiryLabJob[];
  jobCharges: CustomerInquiryJobCharge[];
  jobCredits: CustomerInquiryJobCredit[];
}

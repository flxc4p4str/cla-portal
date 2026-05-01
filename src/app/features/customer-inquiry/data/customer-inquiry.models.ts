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

export interface CustomerInquiryShipToLookup extends CustomerInquiryShipTo {
  custCode: string;
  custName: string;
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

export interface CustomerInquiryPricingLabContract {
  contractNo: string;
  contractName: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  priceLevel: string;
  labCode: string;
  notes: string;
}

export interface CustomerInquirySlContract {
  contractNo: string;
  contractName: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  salesCode: string;
  priceLevel: string;
  notes: string;
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

export interface CustomerInquiryLabSummary {
  jobNo: string;
  patientName: string;
  orderNo: string;
  invoiceNo: string;
  invoiceDate: string;
  lensDesign: string;
  material: string;
  color: string;
  frameType: string;
  frameStatus: string;
  tint: string;
  arCoating: string;
  trackingNumber: string;
  commentLab: string;
  commentInvoice: string;
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

export interface CustomerInquiryLensBank {
  jobNo: string;
  bankNo: string;
  itemCode: string;
  description: string;
  eye: string;
  qty: number;
  price: number;
  amount: number;
}

export interface CustomerInquiryLabContract {
  jobNo: string;
  contractNo: string;
  contractName: string;
  charge: string;
  eye: string;
  price: number;
  qty: number;
  amount: number;
}

export interface CustomerInquiryRewardProgram {
  jobNo: string;
  programCode: string;
  programName: string;
  status: string;
  points: number;
  amount: number;
  notes: string;
}

export interface CustomerInquiryLabReview {
  jobNo: string;
  reviewCode: string;
  reviewDescription: string;
  status: string;
  reviewedBy: string;
  reviewedOn: string;
  notes: string;
}

export interface CustomerInquiryKeyedComment {
  key: string;
  comment: string;
}

export interface CustomerInquiryContact {
  customer: string;
  type: string;
  vendor: string;
  name: string;
  phone: string;
  ext: string;
  fax: string;
  email: string;
}

export interface CustomerInquiryLabAuthorization {
  authCode: string;
  name: string;
  status: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface CustomerInquirySmsContact {
  shipToNo: string;
  name: string;
  smsNo: string;
  smsName: string;
}

export interface CustomerInquiryData {
  customer: CustomerInquiryCustomer;
  shipTos: CustomerInquiryShipTo[];
  logs: CustomerInquiryLog[];
  freightContracts: CustomerInquiryFreightContract[];
  labContracts: CustomerInquiryPricingLabContract[];
  slContracts: CustomerInquirySlContract[];
  labJobs: CustomerInquiryLabJob[];
  labSummaries: CustomerInquiryLabSummary[];
  jobCharges: CustomerInquiryJobCharge[];
  jobCredits: CustomerInquiryJobCredit[];
  lensBanks: CustomerInquiryLensBank[];
  labJobContracts: CustomerInquiryLabContract[];
  rewardPrograms: CustomerInquiryRewardProgram[];
  labReviews: CustomerInquiryLabReview[];
  keyedComments: CustomerInquiryKeyedComment[];
  contacts: CustomerInquiryContact[];
  labAuthorizations: CustomerInquiryLabAuthorization[];
  smsContacts: CustomerInquirySmsContact[];
}

export interface CustomerInquiryState {
  loaded: boolean;
  loading: boolean;
  errorMessage: string;
  customerLookupOpen: boolean;
  shipToLookupOpen: boolean;
  custCode: string;
  shipToNo: string;
  customer: CustomerInquiryCustomer | null;
  shipTos: CustomerInquiryShipTo[];
  selectedShipTo: CustomerInquiryShipTo | null;
  logs: CustomerInquiryLog[];
  selectedLog: CustomerInquiryLog | null;
  freightContracts: CustomerInquiryFreightContract[];
  selectedContract: CustomerInquiryFreightContract | null;
  labJobs: CustomerInquiryLabJob[];
  selectedJob: CustomerInquiryLabJob | null;
  jobCharges: CustomerInquiryJobCharge[];
  jobCredits: CustomerInquiryJobCredit[];
  keyedComments: CustomerInquiryKeyedComment[];
  contacts: CustomerInquiryContact[];
  labAuthorizations: CustomerInquiryLabAuthorization[];
  smsContacts: CustomerInquirySmsContact[];
  labContracts: CustomerInquiryPricingLabContract[];
  slContracts: CustomerInquirySlContract[];
  labSummaries: CustomerInquiryLabSummary[];
  lensBanks: CustomerInquiryLensBank[];
  labJobContracts: CustomerInquiryLabContract[];
  rewardPrograms: CustomerInquiryRewardProgram[];
  labReviews: CustomerInquiryLabReview[];
}

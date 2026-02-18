
export type ProjectStatus = 'Active' | 'Completed' | 'Archived';
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';
export type InvoiceStatus = 'Unpaid' | 'Paid' | 'Overdue';

export interface ScopeItem {
  id: string;
  description: string;
  category: string;
  charges: number;
}

export interface Quotation {
  id: string;
  projectId: string;
  quotationNo: string;
  date: string;
  clientName: string;
  clientAddress: string;
  projectTitle: string;
  objective: string;
  scopeItems: ScopeItem[];
  proposedFees: number;
  status: QuotationStatus;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  quotationId?: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  projectId: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

export interface TransmittalItem {
  id: string;
  description: string;
  quantity: string;
  type: string;
}

export interface Transmittal {
  id: string;
  projectId: string;
  transmittalNo: string;
  date: string;
  from: string;
  to: string;
  jobNo: string;
  projectTitle: string;
  salutation: string;
  transmissionModes: string[];
  documentTypes: string[];
  items: TransmittalItem[];
  purposes: string[];
  senderName: string;
  senderTitle: string;
  senderCompany: string;
  senderAddress: string;
  receiverName: string;
  receivedDate: string;
  signatureData?: string;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  address: string;
  scopeOfWorks: string;
  description: string;
  notes: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];
  transmittals: Transmittal[];
}

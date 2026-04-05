export type InvoiceStatus = "unpaid" | "partially_paid" | "paid" | "overdue";

export interface Invoice {
  id: string;
  userId: string;
  supplierId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceCreateRequest {
  supplierId: string;
  amount: number;
  dueDate: string;
  description?: string;
}

export interface InvoiceUpdateRequest {
  amount?: number;
  dueDate?: string;
  description?: string;
}

export interface InvoiceListItem {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  totalPaid: number;
  remainingAmount: number;
  createdAt: string;
}

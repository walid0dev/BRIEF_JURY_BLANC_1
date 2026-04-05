export type PaymentMethod = "espèces" | "chèque" | "virement";

import type { InvoiceStatus } from "./invoice.interfaces.ts";

export interface Payment {
  id: string;
  invoiceId: string;
  userId: string;
  amount: number;
  paymentDate: string;
  mode_paiement: PaymentMethod;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentCreateRequest {
  amount: number;
  paymentDate: string;
  mode_paiement: PaymentMethod;
  note?: string;
}

export interface InvoicePaymentsSummary {
  totalPaid: number;
  remainingAmount: number;
  status: InvoiceStatus;
}

export interface InvoicePaymentsResponse {
  payments: Payment[];
  summary: InvoicePaymentsSummary;
}

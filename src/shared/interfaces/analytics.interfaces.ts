import type { InvoiceStatus } from "./invoice.interfaces.ts";

export type InvoicesByStatusBreakdown = Record<InvoiceStatus, number>;

export interface SupplierStats {
  supplierId: string;
  supplierName: string;
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  overdueCount: number;
  percentage: number;
  invoicesByStatus: InvoicesByStatusBreakdown;
}

export interface TopSupplier {
  supplierId: string;
  supplierName: string;
  totalAmount: number;
}

export interface DashboardSummary {
  totalSuppliers: number;
  totalInvoices: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  overdueCount: number;
  overdueAmount: number;
  invoicesByStatus: InvoicesByStatusBreakdown;
  topSuppliers: TopSupplier[];
}

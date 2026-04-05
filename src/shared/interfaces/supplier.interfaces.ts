export interface Supplier {
  id: string;
  userId: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierCreateRequest {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SupplierUpdateRequest {
  name?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SupplierWithInvoiceCount extends Supplier {
  invoiceCount: number;
}

# Frontend API Reference

Base URL: `http://localhost:3000`  
Base API prefix: `/api`

## Auth

Use JWT in header for protected routes:

```http
Authorization: Bearer <token>
```

## Response format

### Success

```json
{
  "status": "success",
  "message": "optional",
  "results": 3,
  "data": {}
}
```

`results` is included only when `data` is an array.

### Error

```json
{
  "status": "error",
  "message": "Human-readable message",
  "code": "VALIDATION_ERROR",
  "errors": ["field: details"]
}
```

Common error codes: `NOT_FOUND`, `BAD_REQUEST`, `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `CONFLICT`.

## Endpoints

| Method | Path | Auth | Body / Query | Success |
|---|---|---|---|---|
| GET | `/api/health` | No | - | `{ status: "ok" }` |
| POST | `/api/auth/register` | No | `name`, `email`, `password`, `password_confirmation` | 201, `data: { id, name, email, role }` |
| POST | `/api/auth/login` | No | `email`, `password` | 200, `data: { user, token }` |
| GET | `/api/auth/me` | Yes | - | 200, `data: { id, name, role }` |
| GET | `/api/suppliers` | Yes | - | 200, `data: Supplier[]` |
| POST | `/api/suppliers` | Yes | `name` required, optional `email`, `phone`, `address`, `contact` | 201, `data: Supplier` |
| GET | `/api/suppliers/:id` | Yes | `id` ObjectId | 200, `data: Supplier` |
| PUT | `/api/suppliers/:id` | Yes | at least one of `name`, `email`, `phone`, `address`, `contact` | 200, `data: Supplier` |
| DELETE | `/api/suppliers/:id` | Yes | `id` ObjectId | 200, `data: Supplier` |
| GET | `/api/suppliers/:id/stats` | Yes | `id` ObjectId | 200, `data: SupplierStats` |
| GET | `/api/invoices` | Yes | accepts optional `supplierId`, `status`, `page`, `limit` | 200, `data: { invoices: InvoiceListItem[] }` |
| POST | `/api/invoices` | Yes | `supplierId`, `amount`, `dueDate` (ISO), optional `description` | 201, `data: { invoice: Invoice }` |
| GET | `/api/invoices/:id` | Yes | `id` ObjectId | 200, `data: { invoice: Invoice }` |
| PUT | `/api/invoices/:id` | Yes | at least one of `amount`, `dueDate`, `description`, `status` (`paid\|partially_paid\|unpaid`) | 200, `data: { invoice: Invoice }` |
| DELETE | `/api/invoices/:id` | Yes | `id` ObjectId | 200, `data: { deleted: DeleteResult }` |
| POST | `/api/invoices/:id/payments` | Yes | `amount` required, optional `note` | 201, `data: Payment` |
| GET | `/api/invoices/:id/payments` | Yes | `id` ObjectId | 200, `data: PaymentWithInvoiceStatus[]` |
| GET | `/api/admin/clients` | Yes (admin role) | - | 200, `data: Client[]` |
| GET | `/api/admin/clients/:id/suppliers` | Yes (admin role) | `id` ObjectId | 200, `data: Supplier[]` |
| GET | `/api/admin/clients/:id/invoices` | Yes (admin role) | `id` ObjectId | 200, `data: Invoice[]` |
| GET | `/api/admin/clients/:id/payments` | Yes (admin role) | `id` ObjectId | 200, `data: Payment[]` |

## Payload details

### Register body

```json
{
  "name": "string (min 8)",
  "email": "valid email",
  "password": "string (min 8)",
  "password_confirmation": "must equal password"
}
```

### Login body

```json
{
  "email": "valid email",
  "password": "string"
}
```

### Supplier type

```json
{
  "id": "ObjectId",
  "name": "string",
  "contact": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "createdAt": "ISO date"
}
```

### Invoice type

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "supplierId": "ObjectId",
  "amount": 0,
  "dueDate": "ISO date",
  "status": "unpaid | partially_paid | paid",
  "description": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Invoice list item (`GET /api/invoices`)

Includes invoice fields plus:

```json
{
  "supplierName": "string",
  "totalPaid": 0,
  "remainingAmount": 0
}
```

### Payment type

```json
{
  "_id": "ObjectId",
  "invoiceId": "ObjectId",
  "userId": "ObjectId",
  "amount": 0,
  "paymentDate": "ISO date",
  "note": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Payment with invoice status (`GET /api/invoices/:id/payments`)

```json
{
  "_id": "ObjectId",
  "invoiceId": "ObjectId",
  "userId": "ObjectId",
  "amount": 0,
  "note": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "invoiceStatus": "unpaid | partially_paid | paid"
}
```

### Supplier stats (`GET /api/suppliers/:id/stats`)

```json
{
  "_id": "ObjectId",
  "name": "string",
  "userId": "ObjectId",
  "totalInvoices": 0,
  "totalAmount": 0,
  "totalPaid": 0,
  "totalRemaining": 0,
  "clientTotalAmount": 0,
  "supplierSpendPercentage": 0,
  "invoicesByStatus": {
    "paid": [],
    "unpaid": [],
    "partially_paid": []
  }
}
```

## Frontend notes

- `GET /api/invoices` applies `supplierId`, `status`, `page`, and `limit` query filters.
- `POST /api/invoices/:id/payments`: `invoiceId` in body is not required from frontend (path `:id` is used).
- Most protected endpoints return `401` when token is missing/invalid, `422` for validation errors, and `404` for missing resources.

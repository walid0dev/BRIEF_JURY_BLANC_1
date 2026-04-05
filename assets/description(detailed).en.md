## Context

In day-to-day operations for companies and freelancers, managing supplier invoices quickly becomes complex. It is often difficult to track amounts spent, identify invoices that are pending or overdue, and maintain a clear view of supplier relationships.

The goal of this project is to build a **secure backend API** that can:

- Manage a list of suppliers
- Record and track received invoices
- Perform partial or full payments
- Track invoice status (paid, partially paid, overdue, ...)
- Analyze spending by supplier

This API will allow users to maintain a **clear view of their purchases and payments**, and can later be used by a web or mobile application.

## Objectives

- Provide a secure JWT-based authentication system (register, login, profile).
- Allow each client to fully manage suppliers (CRUD).
- Allow full invoice management with automatic status tracking.
- Support partial or full payments with amount validation.
- Guarantee data isolation: a client can only see their own data.
- Provide statistics and analysis per supplier and an overall dashboard view.

## Roles and Global Constraints

### Roles

- **Client**: Company or freelancer. Can access only their own data (suppliers, invoices, payments).
- **Admin**: Platform administrator. Can consult data for all clients.

### Global constraints

- A client can access only their own data.
- A supplier belongs to exactly one client.
- An invoice belongs to exactly one client and exactly one supplier.
- An invoice has a total amount and a due date.
- Invoice statuses are: `unpaid`, `partially_paid`, `paid`, `overdue`.
- Payments can be partial.
- An invoice automatically becomes `overdue` if the due date has passed and the invoice is not fully paid.

### Key business rules

- An invoice cannot receive a payment if it is already `paid`.
- A payment amount must be strictly greater than 0.
- The sum of payments must not exceed the invoice amount.
- Calculations (totals, percentages) must be dynamic.
- Amounts must always remain consistent.

# Functional Requirements

## Authentication (JWT)

The authentication system uses JWT tokens. The token is returned on login and must be sent in the `Authorization` header as `Bearer {token}` for all protected routes.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new client |
| POST | `/api/auth/login` | Login and obtain a JWT token |
| GET | `/api/auth/me` | Get the authenticated user profile |

## Supplier Management

Each client manages their own supplier list. A supplier can only be modified or deleted by its owner.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/suppliers` | Create a supplier (`name`, optional `contact`) |
| GET | `/api/suppliers` | List all of your suppliers |
| GET | `/api/suppliers/:id` | Retrieve a specific supplier |
| PUT | `/api/suppliers/:id` | Update a supplier |
| DELETE | `/api/suppliers/:id` | Delete a supplier |

## Invoice Management

Invoices are linked to a supplier and have an automatically computed status.

- An invoice can only be updated if it is not fully paid.
- An invoice can only be deleted if it has no associated payments.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/invoices` | Create an invoice (`supplierId`, `amount`, `dueDate`) |
| GET | `/api/invoices` | List all invoices (filters available) |
| GET | `/api/invoices/:id` | Retrieve a specific invoice |
| PUT | `/api/invoices/:id` | Update an invoice (only if not fully paid) |
| DELETE | `/api/invoices/:id` | Delete an invoice (only if no associated payment) |

## Payment Management

Payments are recorded per invoice. The system automatically enforces amount constraints and updates invoice status after each payment.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/invoices/:id/payments` | Record a payment (`amount`, `paymentDate`) |
| GET | `/api/invoices/:id/payments` | List payments for an invoice |

## Tracking & Analytics

The system dynamically computes per-supplier statistics and a client-level overall view.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/suppliers/:id/stats` | Supplier statistics (invoices, amounts, %) |
| GET | `/api/dashboard` | Overall view (total invoices, spending, overdue) |

## Admin Routes

The administrator can access all data via routes protected by an admin-role verification middleware.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/clients` | List all registered clients |
| GET | `/api/admin/clients/:id/suppliers` | View a client’s suppliers |
| GET | `/api/admin/clients/:id/invoices` | View a client’s invoices |
| GET | `/api/admin/clients/:id/payments` | View a client’s payments |

# Invoice Status Tracking Logic

The status of each invoice is computed dynamically on each read or update:

| Status | Condition |
|---|---|
| `unpaid` | No payments recorded |
| `partially_paid` | Partial payment received (total < invoice amount) |
| `paid` | Total payments equal the invoice amount |
| `overdue` | Due date passed and invoice not fully paid |

# User Stories

## Authentication

### US-01 — User registration

As a new client, I want to register via the API in order to create my account.

**Acceptance criteria:**

- `POST /api/auth/register` accepts: `name`, `email`, `password`, `password_confirmation`.
- `name`: required, min 2 characters.
- `email`: required, valid format, unique in DB — duplicate → `422`.
- `password`: required, min 8 characters — not respected → `422`.
- `password_confirmation` must match `password` — otherwise `422`.
- Success: `201` with JWT token + `{ id, name, email, role, createdAt }`.
- Password is hashed in DB (bcrypt).
- Role is assigned automatically: `client`.
- Unauthenticated user attempting protected routes → `401`.

### US-02 — User login

As a registered client, I want to log in and obtain a JWT token.

**Acceptance criteria:**

- `POST /api/auth/login` accepts: `email`, `password`.
- Valid credentials → `200` with JWT token + `{ id, name, email, role }`.
- Invalid credentials → `401` with an explicit message.
- Nonexistent account → `401` (do not reveal whether the email exists).
- JWT token usable in `Authorization: Bearer {token}` for all protected routes.
- Token expiration configurable (e.g., 7 days).

### US-03 — Authenticated user profile

As an **authenticated user**, I want to view my user profile in order to verify my personal information.

**Acceptance criteria:**

- `GET /api/auth/me` returns the connected user information (`200`).
- Returned fields: `id`, `name`, `email`, `role`, `createdAt`.
- The password is never included in the response.
- Without a valid token → `401`.

## Supplier Management

### US-04 — Create a supplier

As an authenticated client, I want to add a supplier to my list.

**Acceptance criteria:**

- `POST /api/suppliers` accepts: `name` (required), `contact` (optional), `email` (optional), `phone` (optional), `address` (optional).
- `name`: required, min 2 characters — missing or empty → `422`.
- `email`: valid format if provided — invalid format → `422`.
- Supplier is automatically associated to the connected client’s `userId`.
- Success: `201` with `{ id, userId, name, contact, email, phone, address, createdAt }`.
- Without a valid token → `401`.

### US-05 — List suppliers

As an authenticated client, I want to view the list of all my suppliers.

**Acceptance criteria:**

- `GET /api/suppliers` returns only the suppliers for the connected client (`200`).
- Suppliers of other clients are never visible.
- Each supplier includes: `id`, `name`, `contact`, `email`, `phone`, `address`, `createdAt`.
- Optional filter by `name` via query string (`?name=...`).
- Paginable response (params `?page` and `?limit`).
- Without a valid token → `401`.

### US-06 — View a specific supplier

As an authenticated client, I want to view a specific supplier.

**Acceptance criteria:**

- `GET /api/suppliers/:id` returns the requested supplier (`200`).
- Response includes: `id`, `userId`, `name`, `contact`, `email`, `phone`, `address`, `createdAt`, `updatedAt`.
- Includes the number of associated invoices (`invoiceCount`).
- Supplier not found → `404`.
- Supplier belonging to another client → `403`.
- Without a valid token → `401`.

### US-07 — Delete a supplier

As an authenticated client, I want to delete a supplier from my list.

**Acceptance criteria:**

- `DELETE /api/suppliers/:id` deletes the specified supplier.
- Middleware verifies the supplier belongs to the client (otherwise `403`).
- Supplier not found → `404`.
- Deletion confirmation (`200` or `204`).

### US-08 — Update a supplier

As an authenticated client, I want to update supplier information.

**Acceptance criteria:**

- `PUT /api/suppliers/:id` accepts: `name`, `contact`, `email`, `phone`, `address` (all optional — partial update).
- `name`: min 2 characters if provided — otherwise `422`.
- `email`: valid format if provided — otherwise `422`.
- Middleware verifies the supplier belongs to the connected client — otherwise `403`.
- Supplier not found → `404`.
- Success: `200` with the updated supplier (all attributes).
- Without a valid token → `401`.

## Invoice Management

### US-09 — Create an invoice

As a client, I want to create an invoice for one of my suppliers.

**Acceptance criteria:**

- `POST /api/invoices` accepts: `supplierId` (required), `amount` (required), `dueDate` (required), `description` (optional).
- `supplierId`: required, must match a supplier belonging to the connected client — otherwise `403`.
- `amount`: required, number, strictly > 0 — otherwise `422`.
- `dueDate`: required, valid date — otherwise `422`.
- `description`: optional, string.
- Automatic initial status: `unpaid`.
- `userId` is assigned automatically from the token.
- Success: `201` with `{ id, userId, supplierId, amount, dueDate, status, description, createdAt }`.
- Without a valid token → `401`.

### US-10 — List invoices

As an authenticated client, I want to view the list of all my invoices.

**Acceptance criteria:**

- `GET /api/invoices` returns only the invoices for the connected client (`200`).
- Invoices of other clients are never visible.
- Each invoice includes: `id`, `supplierId`, `supplierName`, `amount`, `dueDate`, `status`, `totalPaid`, `remainingAmount`, `createdAt`.
- Filters available via query string, e.g. `?status=unpaid`.
- Filter by supplier: `?supplierId=...`.
- Paginable response: `?page=1&limit=15` (default 15 per page).
- Without a valid token → `401`.

### US-11 — Update an invoice

As a client, I want to update an invoice that is not fully paid.

**Acceptance criteria:**

- `PUT /api/invoices/:id` accepts the editable fields.
- Fully paid invoice → update rejected (`422`).
- Middleware verifies ownership (otherwise `403`).
- Invoice not found → `404`.

### US-11 (duplicate in original) — Delete an invoice

As an authenticated client, I want to delete an invoice.

**Acceptance criteria:**

- `DELETE /api/invoices/:id` deletes the specified invoice.
- Deletion not allowed if at least one payment is associated — rejected with `422` and an explicit message.
- Middleware verifies invoice belongs to the connected client — otherwise `403`.
- Invoice not found → `404`.
- Success: `200` `{ message: 'Facture supprimée' }` or `204`.
- Without a valid token → `401`.

## Payment Management

### US-12 — Record a payment

As a client, I want to record a partial or full payment for an invoice.

**Acceptance criteria:**

- `POST /api/invoices/:id/payments` accepts: `amount` (required), `paymentDate` (required), `note` (optional).
- `amount`: required, strictly > 0 — otherwise `422`.
- `amount`: totalPaid + amount must not exceed the invoice total — otherwise `422` with an explicit message.
- `paymentDate`: required, valid date, cannot be in the future — otherwise `422`.
- `mode_paiement`: required, string (`espèces`, `chèque`, `virement`).
- Invoice with status `paid` → payment rejected with `422`.
- Middleware verifies invoice belongs to the connected client — otherwise `403`.

Additional outcomes:

- Invoice status is updated automatically (`partially_paid` or `paid`).
- Success: `201` with `{ id, invoiceId, userId, amount, paymentDate, note, createdAt }` + updated invoice.
- Invoice not found → `404`.
- Without a valid token → `401`.

### US-13 — List payments for an invoice

As an authenticated client, I want to view the list of payments for an invoice.

**Acceptance criteria:**

- `GET /api/invoices/:id/payments` returns all payments for the invoice (`200`).
- Each payment includes: `id`, `invoiceId`, `userId`, `amount`, `paymentDate`, payment method, `createdAt`.
- Includes a summary: `totalPaid`, `remainingAmount`, invoice status.
- Middleware verifies invoice belongs to the connected client — otherwise `403`.
- Invoice not found → `404`.
- Without a valid token → `401`.

## Tracking & Analytics

### US-14 — Supplier statistics

As a client, I want to view statistics of my spending per supplier.

**Acceptance criteria:**

- `GET /api/suppliers/:id/stats` returns supplier stats (`200`):
  - Response includes: `supplierId`, `supplierName`
  - `totalInvoices`: total number of associated invoices
  - `totalAmount`: sum of amounts across all invoices
  - `totalPaid`: sum of all received payments
  - `totalRemaining`: total amount remaining to be paid
  - `overdueCount`: number of overdue invoices
  - `percentage`: supplier spending as a percentage of the client’s overall total
  - `invoicesByStatus`: breakdown `{ unpaid, partially_paid, paid, overdue }`
- Supplier not found → `404`.
- Supplier belonging to another client → `403`.
- Without a valid token → `401`.

### US-15 — Overall dashboard

As a client, I want an overall summary of my financial situation.

**Acceptance criteria:**

- `GET /api/dashboard` returns the connected client’s summary (`200`):
  - `totalSuppliers`: total number of suppliers
  - `totalInvoices`: total number of invoices
  - `totalAmount`: sum of all invoice amounts
  - `totalPaid`: sum of all payments made
  - `totalRemaining`: remaining amount to pay (`totalAmount` − `totalPaid`)
  - `overdueCount`: number of invoices with status `overdue`
  - `overdueAmount`: total amount of overdue invoices
  - `invoicesByStatus`: `{ unpaid: N, partially_paid: N, paid: N, overdue: N }`
  - `topSuppliers`: top 3 suppliers with the highest spending
  - Without a valid token → `401`.

# Technical Requirements

## Architecture & Stack

- Framework: Node.js with Express
- Authentication: JWT (`jsonwebtoken`) + `bcrypt`
- Database: MongoDB (Mongoose) or PostgreSQL (Sequelize/Prisma)
- Architecture: RESTful API with separation of routes / controllers / (optional) services / models / middlewares
- Validation: Joi or Express-validator

## Authorization Middleware

Two levels of protection must be implemented:

| Middleware | Role |
|---|---|
| `authenticate` | Verifies the presence and validity of the JWT token on all protected routes |
| `isAdmin` | Verifies that the user has the `admin` role for `/api/admin` routes |
| `isOwner` | Verifies that the requested resource belongs to the connected client (otherwise `403`) |

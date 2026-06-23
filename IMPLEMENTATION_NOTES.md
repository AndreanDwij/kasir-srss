# Implementation Notes

## Source of Truth Documents

| SoT | Document | Purpose |
|-----|----------|---------|
| SoT-1 | SRS v0.2 | System scope, features, business rules, data objects |
| SoT-2 | Information Architecture v1.0 | Page structure, routing, navigation |
| SoT-3 | Design System v1.0 | Visual style, colors, typography, components |
| SoT-4 | User Flows (UC-001 to UC-006) | Interaction flows, acceptance criteria |

## Architecture Decisions

### 1. Framework: Vite + React (not Next.js)

**Decision:** Used Vite + React Router instead of Next.js App Router.

**Reason:** The prototype is a client-side SPA with localStorage persistence. No server-side rendering, API routes, or static generation needed. Vite provides faster dev experience and simpler setup.

### 2. Data Persistence: localStorage

**Decision:** All data (auth, products, transactions) persisted in localStorage.

**Reason:** No backend/database available. localStorage provides cross-page persistence within a single browser. Data survives page refreshes but not incognito mode or different browsers.

### 3. Authentication: Hardcoded Credentials

**Decision:** Login accepts `kasir` / `kasir123` only.

**Reason:** Prototype only. Real app would use backend authentication with JWT/HttpOnly cookies per SRS NFR-6.2.

### 4. Search Shortcut: F2 + Ctrl+C

**Decision:** Implemented both F2 (DS Section 13 accessibility) and Ctrl+C (UC-002 AF-002 user flow).

**Reason:** F2 is the primary accessibility shortcut per Design System. Ctrl+C is specified in the user flow document. Both are implemented for completeness.

### 5. Stock Management: No Category Field

**Decision:** Product form has Name, Price, Stock only (no Category).

**Reason:** SRS Section 4.1 defines Product with ID, Name, Price, Stock. Category is not in the data model. The user flow UC-004 mentions it, but SRS is the authoritative source.

## Document Conflicts & Resolutions

### Conflict 1: Keyboard Shortcuts

- **UC-002 AF-002:** Uses `Ctrl+C` for search
- **DS Section 13:** Uses `F2` for search, `F9` for payment
- **Resolution:** Implemented both F2 and Ctrl+C for search. F9 for payment.

### Conflict 2: Product Category

- **UC-004 Main Flow:** Includes "Kategori" field
- **SRS Section 4.1:** Product has ID, Name, Price, Stock (no Category)
- **Resolution:** Followed SRS data model. No Category field in the form.

### Conflict 3: Monthly Report Display

- **UC-006 Main Flow:** Shows "Rata-rata Bulanan" KPI card
- **IA Section 5 (PAGE-005):** Shows "Total uang masuk bulanan" and "status akhir stok"
- **Resolution:** Implemented all three: Total Revenue, Total Transactions, Items Sold as KPI cards.

## Business Rules Implemented

From SRS Section 3 (Feature F001):

| Rule | Implementation |
|------|---------------|
| Stock 0 cannot be added to cart | Disabled button + "Habis" badge |
| Quantity < 1 auto-removes from cart | `updateQty` filters out item |
| Stock deducted after transaction | `deductStock` called on payment |
| Real-time total calculation | `subtotal` computed on every cart change |

From SRS Section 3 (Feature F002):

| Rule | Implementation |
|------|---------------|
| Product name cannot be duplicate | `addProduct` checks `products.some()` |
| Price/Stock cannot be negative | Form validation + context validation |
| All fields required | Form validation with error messages |

## Acceptance Criteria Coverage

### UC-001 (Login)
- [x] AC-001: Form with username and password fields
- [x] AC-002: Click "Masuk" to submit
- [x] AC-003: Error message on invalid credentials
- [x] AC-004: Redirect to `/transaksi` on success
- [x] AC-005: No sidebar on login page

### UC-002 (Transaction)
- [x] AC-001: Product list with price and stock
- [x] AC-002: One-click add to cart
- [x] AC-003: +/- quantity buttons
- [x] AC-004: Auto-calculate total
- [x] AC-005: Stock 0 cannot be added
- [x] AC-006: Item removed when qty < 1

### UC-003 (Print Receipt)
- [x] AC-001: Browser print dialog triggered
- [x] AC-002: Receipt includes store name, items, total, time
- [x] AC-003: Cancel print doesn't affect transaction
- [x] AC-004: Transaction recorded even if print fails

### UC-004 (Add Product)
- [x] AC-001: Modal form opens
- [x] AC-002: All fields fillable
- [x] AC-003: Validation for duplicate/negative
- [x] AC-004: Product appears in inventory list
- [x] AC-005: Product available in POS terminal

### UC-005 (Daily Report)
- [x] AC-001: Total daily revenue displayed
- [x] AC-002: Transaction count displayed
- [x] AC-003: Average per transaction displayed
- [x] AC-004: Transaction list table
- [x] AC-005: Red indicator for low/empty stock

### UC-006 (Monthly Report)
- [x] AC-001: Total monthly revenue
- [x] AC-002: Total monthly transactions
- [x] AC-003: Average per month
- [x] AC-004: Monthly recap table
- [x] AC-005: Month/year filter dropdowns

## Known Limitations

1. **No real authentication** - hardcoded credentials only
2. **No backend** - all data in localStorage
3. **No multi-user** - single-user prototype
4. **No data export** - no CSV/PDF export
5. **No chart visualization** - tables only for reports
6. **Print styling** - basic print CSS, not optimized for thermal printers

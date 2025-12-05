## Backend API Overview — Step 7 Scaffolding

### Route List (Current)

| Path                                                    | Methods | Purpose                                                                                 |
| ------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| /api/companies                                          | GET     | Mock companies list placeholder.                                                        |
| /api/ping                                               | GET     | Smoke-test endpoint returning pong.                                                     |
| /api/debug-supabase                                     | GET     | Verifies server Supabase client creation.                                               |
| /api/auth-test                                          | GET     | Auth helper check; returns user info when authenticated.                                |
| /api/files/upload                                       | POST    | Stubbed file upload (auth + file/company validation).                                   |
| /api/files/:id/process                                  | POST    | Stubbed file processing trigger.                                                        |
| /api/companies/:companyId/transactions                  | GET     | Stubbed transaction list for a company.                                                 |
| /api/companies/:companyId/transactions/categorize       | POST    | Stubbed batch transaction categorization trigger.                                       |
| /api/companies/:companyId/dashboard/overview            | GET     | Stubbed dashboard metrics for a company.                                                |
| /api/companies/:companyId/cashflow/forecast             | GET     | Stubbed cashflow forecast series for a company.                                         |
| /api/companies/:companyId/vat/summary                   | GET     | Stubbed VAT summary for a company and period.                                           |
| /api/companies/:companyId/vat/returns                   | POST    | Stubbed VAT return submission.                                                          |
| /api/companies/:companyId/chat                          | POST    | Stubbed Chat CFO response for a company.                                                |
| /api/admin/companies/:companyId/review-items            | GET     | Stubbed admin review items queue.                                                       |
| /api/admin/transactions/:id                             | PATCH   | Stubbed admin transaction update (category/VAT code).                                   |
| /api/webhooks/n8n/file-processed                        | POST    | Stubbed inbound n8n webhook for file processing callbacks (secret validated).           |
| /api/webhooks/n8n/pipeline-status                       | POST    | Stubbed inbound n8n webhook for pipeline status updates (secret validated).             |
| /api/debug-n8n                                          | GET     | Debug endpoint to trigger n8n workflow helper with test payload.                        |

### Naming Conventions

- Company-scoped routes live under `/api/companies/:companyId/...`.
- Files module uses `/api/files/...`.
- Admin module uses `/api/admin/...`.
- n8n webhooks live under `/api/webhooks/n8n/...`.
- No route renames were required during this review; existing structure aligns with the agreed patterns.

### RLS Strategy for Company Multi-Tenancy (Planned in Step 8)

- All company-related tables will include a `company_id` column.
- Baseline RLS for non-admin users will enforce `company_id = auth.jwt().company_id`.
- Admin/service roles (e.g., operator console, background jobs) will have policies allowing cross-company access where appropriate.
- Roles to consider:
  - `owner` — full access within their company.
  - `member` — standard user with limited admin capabilities.
  - `admin`/service — elevated access for internal operations.
- Actual Supabase RLS policies will be implemented in Step 8; this section documents the agreed plan.

# FreelanceHub

## Current State
FreelanceHub is a freelance marketplace app with:
- User registration as freelancer or client
- Job posting by clients
- Job applications by freelancers
- Accept/reject applications
- Browse jobs and freelancers
- Admin stats panel
- No payment system yet

## Requested Changes (Diff)

### Add
- Stripe payment integration for job contracts
- `createJobPayment` backend function: client initiates Stripe checkout for a specific job amount
- `verifyJobPayment` backend function: verify payment session status
- PaymentPage frontend: Stripe checkout redirect flow
- Payment success/cancel pages
- "Pay for Job" button on accepted applications in dashboard
- Platform commission (10%) automatically calculated

### Modify
- DashboardPage: add Pay button after accepting application
- App.tsx: add /payment and /payment-success routes

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo to add Stripe payment functions using stripe.mo module
2. Regenerate backend.d.ts bindings
3. Add PaymentPage with checkout flow
4. Add PaymentSuccessPage
5. Update DashboardPage to show Pay button
6. Wire up new routes in App.tsx

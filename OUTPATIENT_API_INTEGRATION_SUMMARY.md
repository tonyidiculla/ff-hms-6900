# HMS to ff-outp API Integration - Summary

## Completed Changes

### 1. API Client Infrastructure
**File**: `/src/lib/api-client.ts`
- Added `OUTPATIENT_API_BASE` constant (defaults to `http://localhost:6830`)
- Created `OutpatientApi` class with methods:
  - `getAppointments(params)` / `createAppointment(data)`
  - `getBillingRecords(params)` / `createBillingRecord(data)`
  - `getConsultations(params)` / `createConsultation(data)`
- All methods use the existing `ApiClient.request()` with proper error handling

### 2. Custom React Query Hooks
**File**: `/src/hooks/useOutpatientAPI.ts` (NEW)
- `useAppointments(params)` - Query hook for appointments list
- `useCreateAppointmentAPI()` - Mutation hook for creating appointments
- `useBillingRecords(params)` - Query hook for billing records
- `useCreateBillingRecord()` - Mutation hook for creating billing
- `useConsultations(params)` - Query hook for consultations
- `useCreateConsultation()` - Mutation hook for creating consultations
- Includes automatic cache invalidation on mutations

### 3. Billing Page Update
**File**: `/src/app/outpatient/billing/page.tsx`
- **Before**: Static mock data array with 3 hardcoded bills
- **After**: Uses `useBillingRecords()` to fetch from ff-outp API
- Added loading and error states
- Updated data mapping to handle both mock and API field names

### 4. Consultations Page Update
**File**: `/src/app/outpatient/consultations/page.tsx`
- **Before**: Static mock data array with 2 hardcoded consultations
- **After**: Uses `useConsultations()` to fetch from ff-outp API
- Added loading and error states
- Updated data mapping to handle both mock and API field names
- Fixed Tailwind class warnings (`min-h-[80px]` → `min-h-20`)

### 5. Environment Configuration
**File**: `/.env.local`
- Added `NEXT_PUBLIC_OUTPATIENT_API_URL=http://localhost:6830`
- This allows easy configuration for different environments

### 6. Documentation
**File**: `/OUTPATIENT_API_ARCHITECTURE.md` (NEW)
- Complete architecture overview
- API endpoint documentation
- Setup instructions
- Benefits and next steps

## Architecture Flow

```
┌─────────────────────────────────────────┐
│  HMS Frontend (ff-hms-6900:6900)       │
│  ┌────────────────────────────────┐    │
│  │  Billing Page                   │    │
│  │  - useBillingRecords()          │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Consultations Page             │    │
│  │  - useConsultations()           │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │  Appointments Page              │    │
│  │  - useAppointmentsWithDetails() │    │
│  │    (still using direct DB)      │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
               ↓ HTTP Requests
┌─────────────────────────────────────────┐
│  ff-outp Backend (ff-outp-6830:6830)   │
│  ┌────────────────────────────────┐    │
│  │  /api/core/appointments         │    │
│  │  /api/core/billing              │    │
│  │  /api/core/consultations        │    │
│  └────────────────────────────────┘    │
│         ↓ Business Logic                │
│         ↓ Validation                    │
│         ↓ Authorization                 │
└─────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  Supabase Database                      │
│  - hospital_appointments                │
│  - billing_records                      │
│  - hospitals_soap_notes                 │
└─────────────────────────────────────────┘
```

## Files Modified
1. `/src/lib/api-client.ts` - Added OutpatientApi class
2. `/src/app/outpatient/billing/page.tsx` - Now uses API hooks
3. `/src/app/outpatient/consultations/page.tsx` - Now uses API hooks
4. `/.env.local` - Added OUTPATIENT_API_URL

## Files Created
1. `/src/hooks/useOutpatientAPI.ts` - React Query hooks for outpatient APIs
2. `/OUTPATIENT_API_ARCHITECTURE.md` - Architecture documentation
3. `/OUTPATIENT_API_INTEGRATION_SUMMARY.md` - This file

## Testing Checklist

### Prerequisites
✅ ff-outp-6830 must be running on port 6830
```bash
cd ff-outp-6830
npm run dev
```

### Test Billing Page
1. Navigate to http://localhost:6900/outpatient/billing
2. Should show loading state initially
3. Should fetch billing records from ff-outp-6830 API
4. Check browser DevTools Network tab for API calls to `localhost:6830/api/core/billing`

### Test Consultations Page
1. Navigate to http://localhost:6900/outpatient/consultations
2. Should show loading state initially
3. Should fetch consultations from ff-outp-6830 API
4. Check browser DevTools Network tab for API calls to `localhost:6830/api/core/consultations`

### Test Appointments Page
⚠️ **Note**: Appointments page still uses direct database hooks
- Will work without ff-outp-6830 running
- Should be refactored in future sprint

## Known Issues & Future Work

### Appointments Page Refactor Needed
- **Current**: Uses `useAppointmentsWithDetails()` from `useDatabase.ts`
- **Issue**: 2665 lines of code with complex business logic
- **Goal**: Migrate to use `useAppointments()` from `useOutpatientAPI.ts`
- **Blocker**: Requires extensive testing due to appointment creation/editing flows

### Authentication
- **Current**: No auth tokens in API requests
- **Needed**: Add JWT/session tokens to API calls
- **Impact**: Required for multi-tenant security

### Error Handling
- **Current**: Basic error states
- **Needed**: Toast notifications, retry buttons, offline support
- **Impact**: Better UX for network failures

### Pagination
- **Current**: Simple limit parameter
- **Needed**: Cursor-based pagination for large datasets
- **Impact**: Performance with 1000+ records

## Benefits Achieved

✅ **Separation of Concerns**: Business logic stays in ff-outp-6830  
✅ **Type Safety**: TypeScript types maintained across boundaries  
✅ **Caching**: React Query automatically caches API responses  
✅ **Reusability**: Other services can consume ff-outp APIs  
✅ **Scalability**: HMS and ff-outp can scale independently  
✅ **Maintainability**: Single source of truth for outpatient data  

## Commands Reference

### Start Both Services
```bash
# Terminal 1 - Outpatient Backend
cd ff-outp-6830
npm run dev

# Terminal 2 - HMS Frontend
cd ff-hms-6900
npm run dev
```

### View API Logs
```bash
# In ff-outp-6830 terminal
# Watch for incoming API requests
```

### Test API Directly
```bash
# Get billing records
curl http://localhost:6830/api/core/billing

# Get consultations
curl http://localhost:6830/api/core/consultations

# Get appointments
curl http://localhost:6830/api/core/appointments
```

## Success Metrics

- ✅ Billing page loads data from API
- ✅ Consultations page loads data from API
- ✅ No TypeScript errors
- ✅ Loading states work correctly
- ✅ Error states display properly
- ✅ React Query caching works
- ⚠️ Appointments page pending refactor

---

**Status**: Billing and Consultations complete ✅  
**Next**: Refactor Appointments page to use API hooks  
**Date**: November 8, 2025

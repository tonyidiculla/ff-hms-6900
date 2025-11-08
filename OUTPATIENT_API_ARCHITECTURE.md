# HMS Outpatient Module - API Architecture

## Overview
The HMS outpatient module (appointments, billing, consultations) has been configured to fetch all data through the **ff-outp-6830** microservice API endpoints instead of direct database access.

## Architecture

```
HMS Frontend (ff-hms-6900)
    ↓ HTTP Requests
ff-outp-6830 API (localhost:6830)
    ↓ Database queries + Business Logic
Supabase Database
```

## Why This Architecture?

1. **Separation of Concerns**: Business logic and data validation stays in ff-outp-6830
2. **Single Source of Truth**: All outpatient operations go through one service
3. **Scalability**: HMS can scale independently of the outpatient backend
4. **Reusability**: Other services can also consume ff-outp-6830 APIs

## Configuration

### Environment Variable
In `/ff-hms-6900/.env.local`:
```bash
NEXT_PUBLIC_OUTPATIENT_API_URL=http://localhost:6830
```

### API Client
Located in `/ff-hms-6900/src/lib/api-client.ts`:
- `OutpatientApi.getAppointments(params)` - Fetch appointments
- `OutpatientApi.createAppointment(data)` - Create appointment
- `OutpatientApi.getBillingRecords(params)` - Fetch billing records
- `OutpatientApi.createBillingRecord(data)` - Create billing record
- `OutpatientApi.getConsultations(params)` - Fetch consultations
- `OutpatientApi.createConsultation(data)` - Create consultation

### Custom Hooks
Located in `/ff-hms-6900/src/hooks/useOutpatientAPI.ts`:
- `useAppointments(params)` - React Query hook for appointments
- `useCreateAppointmentAPI()` - Mutation hook for creating appointments
- `useBillingRecords(params)` - React Query hook for billing
- `useCreateBillingRecord()` - Mutation hook for creating billing records
- `useConsultations(params)` - React Query hook for consultations
- `useCreateConsultation()` - Mutation hook for creating consultations

## Updated Pages

### ✅ Billing (`/src/app/outpatient/billing/page.tsx`)
- **Before**: Hardcoded mock data array
- **After**: Uses `useBillingRecords()` hook to fetch from ff-outp-6830 API
- **Endpoint**: `GET http://localhost:6830/api/core/billing`

### ✅ Consultations (`/src/app/outpatient/consultations/page.tsx`)
- **Before**: Hardcoded mock data array
- **After**: Uses `useConsultations()` hook to fetch from ff-outp-6830 API
- **Endpoint**: `GET http://localhost:6830/api/core/consultations`

### ⚠️ Appointments (`/src/app/outpatient/appointments/page.tsx`)
- **Status**: Still uses direct database hooks from `useDatabase.ts`
- **Reason**: Complex page with 2665 lines and extensive business logic
- **TODO**: Should be refactored to use `useAppointments()` hook
- **Current**: Uses `useAppointmentsWithDetails()` with direct Supabase queries

## ff-outp-6830 API Endpoints

### Appointments
- `GET /api/core/appointments` - List appointments
  - Query params: `hospital_id`, `status`, `limit`
- `POST /api/core/appointments` - Create appointment

### Billing
- `GET /api/core/billing` - List billing records
  - Query params: `hospital_id`, `status`, `limit`
- `POST /api/core/billing` - Create billing record

### Consultations
- `GET /api/core/consultations` - List consultations/SOAP notes
  - Query params: `hospital_id`, `pet_id`, `limit`
- `POST /api/core/consultations` - Create consultation

## Running the Services

### Start ff-outp-6830 (Backend)
```bash
cd ff-outp-6830
npm run dev
# Runs on http://localhost:6830
```

### Start ff-hms-6900 (Frontend)
```bash
cd ff-hms-6900
npm run dev
# Runs on http://localhost:6900
```

## Benefits

1. **Backend Owns Business Logic**: All validation, authorization, and business rules are in ff-outp-6830
2. **API-First Design**: Clean separation between frontend and backend
3. **React Query Caching**: Automatic caching, refetching, and state management
4. **Error Handling**: Centralized error handling in API client
5. **Type Safety**: TypeScript types maintained across API boundaries

## Next Steps

1. **Refactor Appointments Page**: Update to use `useAppointments()` hook instead of direct database hooks
2. **Add Authentication**: Include auth tokens in API requests
3. **Add Pagination**: Implement proper pagination for large datasets
4. **Error UI**: Add better error states and retry mechanisms
5. **Loading States**: Add skeleton loaders for better UX

## API Response Format

All ff-outp-6830 endpoints return:
```typescript
{
  success: boolean
  data?: any
  error?: string
  count?: number
}
```

The API client normalizes this to:
```typescript
{
  success: boolean
  data?: { data: any[], count?: number }
  error?: string
}
```

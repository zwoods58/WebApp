# Homepage List Components Translation Fixes

## Issues Fixed

### 1. Duplicate Property Errors
The following keys were duplicated in the universal-translations.ts file:
- `common.view_all` (already existed at line 2995)
- `appointments.today` (already existed at line 1840)
- `inventory.manage` (already existed at line 9310)

### 2. Resolution
Removed the duplicate entries and kept only the new keys that were actually missing.

## Translation Keys Added

### Credit List Component
- `credit.no_customers` - "No customers"
- `credit.add_first` - "Add your first customer"

### Appointments List Component
- `appointments.no_upcoming` - "No upcoming appointments"
- `appointments.schedule_first` - "Schedule your first appointment"
- `appointments.manage` - "Manage Appointments"

### Services List Component
- `services.active` - "Active"
- `services.no_services` - "No services available"
- `services.add_first` - "Add your first service to get started"

### Inventory List Component
- `inventory.no_items` - "No items in inventory"

## Keys That Already Existed
These keys were already present in the file, so duplicates were removed:
- `common.view_all` - "View All"
- `common.add` - "Add"
- `appointments.today` - "Today"
- `inventory.manage` - "Manage Inventory"

## Result
All homepage list components should now display properly translated text instead of raw translation keys. The TypeScript compilation errors have been resolved.

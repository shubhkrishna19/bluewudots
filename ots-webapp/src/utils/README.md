# Utilities Reference

Comprehensive collection of utility modules for the Bluewud OTS web application.

## Overview

The `utils` directory contains production-grade utility modules that provide reusable functionality across the application. Each module is self-contained, well-documented, and follows consistent patterns.

## Module Index

### Storage Utilities (`storageUtils.js`)

Provides abstractions for browser storage with automatic serialization and expiry handling.

**Key Features:**
- localStorage wrapper with expiry support
- sessionStorage management
- IndexedDB abstraction layer
- Automatic JSON serialization/deserialization
- Error handling and fallbacks

**Usage:**
```javascript
import { localStorageUtils, sessionStorageUtils, indexedDBUtils } from './storageUtils';

// LocalStorage with 24-hour expiry
localStorageUtils.set('key', value, 24 * 60 * 60 * 1000);
const val = localStorageUtils.get('key', defaultValue);

// SessionStorage
sessionStorageUtils.set('temp', data);
sessionStorageUtils.get('temp');

// IndexedDB
await indexedDBUtils.init([{ name: 'orders', keyPath: 'id' }]);
await indexedDBUtils.put('orders', { id: 1, data: {...} });
```

### API Utilities (`apiUtils.js`)

Handles API requests with retry logic, offline support, and response normalization.

**Key Features:**
- Automatic retry with exponential backoff
- Offline response caching
- Request/response normalization
- Batch request processing
- Request queue for offline scenarios
- Customizable timeout and retry policies

**Usage:**
```javascript
import { get, post, batch, queueForRetry, processQueue } from './apiUtils';

// Simple GET request
const response = await get('/api/orders');

// POST with automatic offline caching
const result = await post('/api/orders', orderData, { cacheOffline: true });

// Batch requests
const results = await batch([
  ['/api/orders', { method: 'GET' }],
  ['/api/users', { method: 'GET' }]
]);

// Queue requests made offline
queueForRetry('/api/sync', { method: 'POST', body: data });
await processQueue(); // Process when back online
```

### Format Utilities (`formatUtils.js`)

Provides data formatting functions for display and output.

**Key Features:**
- Date/datetime formatting (human-readable, ISO, etc.)
- Currency formatting (INR optimized)
- Phone number formatting (international & Indian)
- Pincode formatting
- Text transformations (capitalize, title case, truncate)
- Address composition
- Duration formatting (ms to human-readable)

**Usage:**
```javascript
import {
  formatDate, formatCurrency, formatPhone, formatAddress, formatDuration
} from './formatUtils';

formatDate(new Date()); // "Jan 15, 2024"
formatCurrency(1500.50); // "₹1,500.50"
formatPhone('9876543210'); // "+91-9876-543210"
formatDuration(3665000); // "1h 1m 5s"
```

### Validation Utilities (`validationUtils.js`)

Comprehensive validation functions for business logic and data integrity.

**Key Features:**
- Email & phone validation
- Pincode validation (Indian postal codes)
- Order validation (status, payment, dates)
- Address validation
- User data validation
- Payment information validation
- Data sanitization

**Usage:**
```javascript
import {
  validateEmail, validatePhone, validateOrder, sanitizeInput
} from './validationUtils';

if (!validateEmail(email)) throw new Error('Invalid email');
if (!validatePhone(phone)) throw new Error('Invalid phone');
const sanitized = sanitizeInput(userInput);
```

### Date/Time Utilities (`dateTimeUtils.js`)

Advanced date and time operations including scheduling, calendar, and timezone handling.

**Key Features:**
- Date arithmetic (add days/hours/minutes)
- Date comparisons (past, future, today, etc.)
- Calendar operations (start/end of day/week/month)
- Business day calculations
- Week number & day name resolution
- Relative time formatting ("2 hours ago")
- Scheduling callbacks
- Timezone conversion

**Usage:**
```javascript
import {
  addDays, daysBetween, startOfMonth, getBusinessDaysBetween,
  scheduleAt, getRelativeTime
} from './dateTimeUtils';

const nextWeek = addDays(new Date(), 7);
const days = daysBetween(startDate, endDate);
const bizDays = getBusinessDaysBetween(date1, date2);
scheduleAt(targetTime, callback); // Execute at specific time
getRelativeTime(pastDate); // "2 days ago"
```

### Existing Utilities

#### commercialUtils.js
Commercial data formatting and calculations (pricing, margins, etc.)

#### dataUtils.js
Data transformation, deduplication, and aggregation utilities.

#### labelGenerator.js
Shipping label and document generation utilities.

#### logisticsUtils.js
Logistics calculations and recommendations (carrier selection, route optimization).

## Integration Patterns

### Service Integration

Utilities integrate seamlessly with service layer:

```javascript
// In a service
import apiUtils from './utils/apiUtils';
import { formatCurrency } from './utils/formatUtils';
import { validateOrder } from './utils/validationUtils';

const OrderService = {
  async createOrder(orderData) {
    // Validate
    if (!validateOrder(orderData)) throw new Error('Invalid order');
    
    // Send with offline support
    const response = await apiUtils.post('/orders', orderData);
    
    // Format for display
    return {
      ...response.data,
      totalDisplay: formatCurrency(response.data.total)
    };
  }
};
```

### Component Integration

Utilities simplify component logic:

```javascript
// In a React component
import { formatDate, getRelativeTime } from '../utils/dateTimeUtils';
import { formatCurrency } from '../utils/formatUtils';

function OrderCard({ order }) {
  return (
    <div>
      <h3>{order.id}</h3>
      <p>Total: {formatCurrency(order.total)}</p>
      <p>Created: {getRelativeTime(order.createdAt)}</p>
    </div>
  );
}
```

## Best Practices

1. **Error Handling:** Always handle potential errors from async utilities
2. **Offline Support:** Use apiUtils with `cacheOffline: true` for critical endpoints
3. **Validation:** Validate all user inputs before processing
4. **Storage:** Use appropriate storage method (localStorage, sessionStorage, IndexedDB)
5. **Imports:** Use named imports for better code clarity

## Adding New Utilities

When creating new utility modules:

1. Keep utilities focused and single-purpose
2. Export both default and named exports
3. Include JSDoc comments for all functions
4. Handle errors gracefully
5. Test with various input types
6. Update this README with module description

## Performance Considerations

- **Storage:** IndexedDB for large datasets, localStorage for small configs
- **API Calls:** Use batch requests for multiple endpoints
- **Validation:** Cache compiled regex patterns
- **Formatting:** Memoize expensive formatters in components

## Contributing

When contributing utilities:
- Follow existing code style and patterns
- Add comprehensive JSDoc comments
- Include error handling
- Update documentation
- Ensure backward compatibility

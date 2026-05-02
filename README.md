# Stage 1

## Approach
- Fetch notifications from API / mock
- Assign priority:
  - Placement > Result > Event
  - Latest first
- Sort and return top N

## Optimization
- Can use Min Heap (size N) for efficiency

## Logging
- Used custom logging middleware

## Note
- Added USE_MOCK support if AUTH_TOKEN not available
- export USE_MOCK=true
node index.js
## Output Screenshot

![Output](output.png)

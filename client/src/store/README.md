# Store

This directory is for global client-side state management.

## Recommended Approach

- Use **React Context + useReducer** for simple global state
- Use **Zustand** for complex or performance-critical state
- Use **React Query / TanStack Query** for server state (API data caching)

## Structure

```
store/
├── auth-store.ts       # Authentication state
├── ui-store.ts         # UI state (modals, sidebars, etc.)
└── index.ts            # Barrel exports
```

Add store slices as the app grows. Keep each store focused on a single domain.

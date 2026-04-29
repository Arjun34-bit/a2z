# Features

This directory follows a **feature-based architecture** where each feature is self-contained.

## Structure per Feature

```
features/
├── auth/
│   ├── components/         # Feature-specific components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── hooks/              # Feature-specific hooks
│   │   └── use-auth.ts
│   ├── types.ts            # Feature-specific types
│   └── index.ts            # Public API (barrel exports)
├── orders/
│   ├── components/
│   ├── hooks/
│   ├── types.ts
│   └── index.ts
└── ...
```

## Rules

1. Features can import from `@/components`, `@/lib`, `@/hooks`, `@/services`, `@/types`
2. Features should **NOT** import from other features directly
3. If two features need shared logic, extract it to `@/lib` or `@/hooks`
4. Each feature exposes a clean public API via `index.ts`

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Theming and UX

- Use Angular Material design tokens/CSS variables for colors, elevation, and surfaces to stay within the app’s palette:
  - Example variables: `--mat-sys-surface`, `--mat-sys-surface-container`, `--mat-sys-on-surface`, `--mat-sys-on-surface-variant`, `--mat-sys-outline-variant`, and elevation tokens like `--mat-sys-level2`.
- Prefer card-like surfaces with rounded corners for list items and forms; keep spacing consistent (8/12/16/24 px scale).
- Use grid or flex layouts for forms; align labels in a left column and inputs on the right for readability.
- Replace read-only text inputs with labels or static text elements styled like form controls.
- Ensure accessibility:
  - Provide `aria-label` or `aria-labelledby` for interactive icons and drag handles.
  - Keep label elements associated with form controls; do not rely solely on placeholders.
- Drag and drop:
  - Use explicit `cdkDragHandle` elements (e.g., a button with an icon) instead of making the whole row draggable.
  - Maintain keyboard focus styles and ensure draggable elements are reachable via keyboard.
- use angular material components and icons where possible

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

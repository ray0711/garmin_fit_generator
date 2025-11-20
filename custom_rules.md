# Custom Rules for garmin_fit_generator Project

## Code Quality and Formatting

### Prettier and ESLint Compliance
**All code changes MUST follow the project's Prettier and ESLint configuration:**

- **Prettier**: Follow the configuration defined in `package.json` under the `"prettier"` key
- **ESLint**: Follow the configuration defined in `eslint.config.js`

Before finalizing any code changes, ensure the code adheres to these formatting and linting rules.

## UI Implementation Guidelines

### Angular Material Components
**Always use Angular Material components with minimal extra styling for all implementations:**

- **Form Inputs**: Use `mat-form-field` with `matInput` for text inputs, `mat-select` for dropdowns
- **Buttons**: Use `mat-button`, `mat-raised-button`, `mat-fab`, etc. instead of plain HTML buttons
- **Cards**: Use `mat-card` with `mat-card-header`, `mat-card-content`, `mat-card-actions` for content containers
- **Icons**: Use `mat-icon` for all icons
- **Other Components**: Use Material components (`mat-tree`, `mat-list`, `mat-dialog`, etc.) when available

**Styling Rules:**
- Avoid custom HTML elements with inline styles when Material components are available
- Keep custom styling minimal - rely on Material's built-in theming and design system
- Only add custom styles when absolutely necessary for layout or spacing adjustments
- Use Material's spacing utilities and CSS classes when possible

**Why:** This ensures consistent styling throughout the application, better accessibility, automatic theme support, and reduced maintenance burden.

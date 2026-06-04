# Custom AI Guidelines

This file exists as an example custom guideline for Laravel Boost.

To add custom AI guidelines, place `.blade.php` or `.md` files in the `.ai/guidelines/` directory.

When `boost:install` runs, Boost will include these custom guideline files along with built-in Boost guidelines.

## Example

- Create `.ai/guidelines/my-package.md` to provide package-specific guidance.
- Create `.ai/guidelines/inertia-react/2/forms.blade.php` to override Boost's default guideline for that path.

## Notes

- Use this directory for app-specific AI guidance and conventions.
- Keep guideline files concise and focused on best practices.

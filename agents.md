# Agents.md

This repository is maintained with the help of AI coding agents.
Agents must follow these rules when modifying code.

## Architecture
- Frontend: Angular 21
- Backend: .NET Web API
- Database: Oracle

## Angular Standards
- Use standalone components
- Prefer signals over RxJS where appropriate
- Use `inject()` instead of constructor injection
- Use `@if` and `@for` instead of `*ngIf` / `*ngFor`
- Prefer lazy-loaded routes
- Use `OnPush` change detection
- Use Signal Forms where already adopted in this codebase
- Use reactive, strongly typed APIs
- Prefer `class` / `style` bindings over `ngClass` / `ngStyle`
- Prefer `host` metadata over `@HostBinding` / `@HostListener`

## Code Style
- Avoid `any`
- Prefer strict typing
- Services should follow single responsibility
- Keep components focused and small
- Do not introduce unnecessary abstraction

## Refactoring Guidelines
- Do not rewrite entire modules unless necessary
- Prefer incremental improvements
- Refactor one component or service at a time
- Preserve existing behavior unless the task explicitly changes behavior

## Pull Requests
Agents must:
1. Explain changes clearly
2. Show before/after code when practical
3. Ensure build passes
4. Note any risky or experimental APIs used

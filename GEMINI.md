# Antigravity Workspace Directives & Engineering Standards

**Project:** SK Sahinur Islam (Genious Sonu) — Portfolio & Engineering Platform  
**Environment:** Next.js 16 (App Router) · React 19 · Vanilla CSS Modules · Supabase · Sanity v3 · Firebase  

---

## 1. Automated CodeRabbit Review & Self-Fix Protocol

Whenever you write, edit, refactor, or complete any code in this repository, you **MUST** automatically execute an internal CodeRabbit review cycle before concluding your response:

### Review Criteria

1. **Correctness & Robustness**:
   - Check edge cases, boundary parameters, empty arrays/null objects, and async promise error handling.
   - Verify that all dynamic imports and hooks are invoked strictly within supported component scopes.
2. **Security & Data Privacy**:
   - Verify that server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `STUDIO_ADMIN_PASSWORD`) are never imported or passed to client components.
   - Ensure all public mutation endpoints enforce rate limiting, origin validation, and input sanitization.
3. **Next.js 16 & React 19 Architecture**:
   - Verify component boundaries: keep components as React Server Components (RSC) by default; only declare `"use client"` on interactive leaf nodes.
   - Verify clean teardown for all side-effects (`gsap.context`, `lenis`, event listeners, intervals).
4. **Design Token Integrity (Vanilla CSS)**:
   - Ensure NO raw hex color codes are used in component CSS modules. All colors must resolve from `src/app/globals.css` design tokens (`var(--void)`, `var(--gold)`, `var(--border)`, etc.).
   - Strictly prohibit utility framework additions unless explicitly requested.
5. **Linting & Code Quality**:
   - Ensure changes pass ESLint and Markdownlint checks without introducing new warnings.

### Autonomous Auto-Fix Mandate

- If ANY issue, regression, security leak, or architectural smell is identified during the review, **fix it immediately in the code before concluding your turn**. Do not leave identified issues for the user to solve manually.

---

## 2. Workspace Tooling & Extension Integration

- **ESLint & Prettier**: Configured for auto-validation on save. Keep code formatted according to standard rules (2 spaces, single quotes where applicable, trailing commas where appropriate).
- **Markdownlint**: Enforce blank lines around headers/lists and explicit code fence languages on all `.md` files.
- **CodeRabbit**: Local VS Code extension (`coderabbit.coderabbit-vscode`) and repository schema (`.coderabbit.yaml`) are active. All code written must meet CodeRabbit automated PR quality gates.

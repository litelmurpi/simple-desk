# GEMINI.md

<!-- AI agent config. Auto-read by Gemini CLI. Do not delete. -->

---

## PROJECT

```
name    : Simple Desk
type    : Web App
lang    : PHP 8.2
stack   : Laravel + Inertia + Vue 3 + MySQL
pkg_mgr : composer
module  : [e.g. github.com/org/repo]
desc    : [1–2 sentence description]
```

## STRUCTURE

```
[Paste your actual directory tree here — keep it shallow, 2 levels max]

src/
  handler/      # HTTP layer
  service/      # business logic
  repository/   # data access
  domain/       # entities, interfaces, errors
config/
migrations/
tests/
docs/
.env.example
```

## COMMANDS

```bash
# dev
[run_cmd]       # start dev server
[build_cmd]     # build for production
[watch_cmd]     # live reload (if any)

# test
[test_cmd]      # run all tests
[test_cov_cmd]  # with coverage

# quality
[lint_cmd]      # linter
[fmt_cmd]       # formatter
[typecheck_cmd] # type checker (if applicable)

# database
[migrate_up]    # apply migrations
[migrate_down]  # rollback
[seed_cmd]      # seed data (DEV ONLY)

# deps
[install_cmd]   # install dependencies
[add_dep_cmd]   # add new dependency
```

---

## AGENT RULES

### Behavior

- Read existing code before modifying anything.
- Never delete logic without understanding it — ask if unsure.
- Prefer editing existing files over creating new ones.
- Do not add new dependencies without asking first.
- Stdlib/built-in solution first; third-party only if necessary.
- Write code as if a senior dev will review it.

### Responses

- Show only the relevant diff or block — not the whole file.
- Bug fix: state root cause in 1 line before the fix.
- Inline comments only for non-obvious logic.
- Be concise; skip explanation unless asked.

### Hard Rules

- Never hardcode secrets/credentials → use env vars.
- Never silently discard errors → always handle explicitly.
- Never commit `.env` → only `.env.example`.
- Never break existing public interfaces without flagging it.
- Never use `SELECT *` → always name columns.
- Never run destructive DB commands outside DEV context.

### Critical Thinking

- **Challenge before implementing** — is this the right approach? Simpler alternatives?
- Ask **clarifying questions** if requirements are ambiguous — never assume intent.
- Identify **edge cases, race conditions, failure scenarios** before writing code.
- If request introduces bugs/perf/security risks → **flag explicitly before proceeding**.
- Suggest **better alternatives** when a more optimal solution exists.
- Before DB change → "Migration? Will this break existing data?"
- Before API change → "Backward compatible? Will this break clients?"
- **Push back** on requests violating project standards — explain why, offer alternatives.
- Never implement a "quick hack" without flagging the trade-off.

---

## CODING STANDARDS

### Naming

| Entity        | Convention      | Example             |
| ------------- | --------------- | ------------------- |
| Variables     | camelCase       | `orderItems`        |
| Functions     | camelCase       | `getUserById()`     |
| Classes/Types | PascalCase      | `OrderService`      |
| Constants     | SCREAMING_SNAKE | `MAX_RETRY_COUNT`   |
| Files         | kebab-case      | `order-service.go`  |
| DB tables     | snake_case      | `order_items`       |
| DB columns    | snake_case      | `created_at`        |
| Env vars      | SCREAMING_SNAKE | `DATABASE_URL`      |
| URL routes    | kebab-case      | `/user-profile`     |
| Route names   | dot.notation    | `user.profile.edit` |

> Adjust per language idiom (e.g. Python uses snake_case for functions).

### Code Style

- Max function length: **30–50 lines** — split if longer.
- Max file length: **300–500 lines** — split into modules if longer.
- One responsibility per function/class/module.
- No nested ternaries or deeply nested conditionals (max 3 levels).
- Use early returns to reduce nesting.
- Prefer explicit over implicit.

### Error Handling

- Always handle errors — never ignore or swallow silently.
- Wrap errors with context: `"scope.method: <original error>"`.
- Define named/sentinel errors for known failure cases.
- Never expose internal error details to API consumers.
- Log errors with structured context (user ID, request ID, etc.).

### Imports / Dependencies

- Group: stdlib → external → internal → relative.
- No circular dependencies between modules/packages.
- No unused imports.

---

## ARCHITECTURE

### Layers

```
Handler / Controller   → parse request, validate input, call service, return response
Service / Use Case     → business logic only, calls repository
Repository / DAO       → all DB queries, returns domain types
Domain / Model         → entities, interfaces, value objects — no external deps
```

**Dependency direction:** Handler → Service → Repository → Domain (always inward only).

### Key Decisions

1. [Decision] — [Why]
2. [Decision] — [Why]

### Do Not Touch

- `[path]` — [reason]
- `[path]` — [reason]

### Known Technical Debt

- [ ] [Area]: [description]

---

## API STANDARDS

### Response Shape

```json
// success
{ "success": true,  "data": {},  "message": "OK" }

// paginated
{ "success": true,  "data": [], "meta": { "page": 1, "per_page": 20, "total": 100 } }

// error
{ "success": false, "error": "VALIDATION_FAILED", "message": "Email tidak valid." }
```

### HTTP Status Codes

| Code | When to use                          |
| ---- | ------------------------------------ |
| 200  | OK — GET, PUT, PATCH success         |
| 201  | Created — POST success               |
| 204  | No Content — DELETE success          |
| 400  | Bad Request — malformed input        |
| 401  | Unauthorized — unauthenticated       |
| 403  | Forbidden — authenticated, no access |
| 404  | Not Found                            |
| 409  | Conflict — duplicate resource        |
| 422  | Unprocessable — validation failed    |
| 500  | Internal Server Error                |

### Route Naming

- REST: `GET /resources`, `POST /resources`, `GET /resources/:id`
- Always version: `/api/v1/...`
- Use nouns not verbs: `/orders` not `/getOrders`

---

## DATABASE

- All schema changes via **migration files** only — never alter DB directly.
- Every table: `id` (PK), `created_at`, `updated_at`.
- Add soft delete column (`deleted_at`) if records should be recoverable.
- Use transactions for multi-step writes.
- Always add indexes on foreign keys and frequently queried columns.
- Never store plaintext passwords → hash with bcrypt/argon2.
- Parameterized queries only — never interpolate user input into SQL.

---

## TESTING

### Pyramid

| Layer        | Type        | Tool             | Min Coverage |
| ------------ | ----------- | ---------------- | ------------ |
| Domain/Utils | Unit        | lang test runner | 90%          |
| Service      | Unit (mock) | lang test runner | 85%          |
| Handler/HTTP | Integration | httptest / e2e   | 80%          |
| DB Layer     | Integration | test DB          | 70%          |

### Rules

- Arrange → Act → Assert (AAA) pattern always.
- Use factories/fixtures for test data — never hardcode IDs.
- Table-driven / parameterized tests for multiple cases.
- Tests must be isolated — no shared mutable state between tests.
- Mock external services (HTTP, email, payment) — never call real APIs in tests.

---

## SECURITY

- Secrets/keys → env vars only, never in source code.
- Commit `.env.example` only, never `.env`.
- Sanitize all user input before use in HTML/SQL/commands.
- Rate-limit auth endpoints (login, register, password reset).
- Use HTTPS only in production.
- Short-lived tokens (JWT exp ≤ 24h); refresh token rotation.
- Set timeouts on all HTTP clients and servers.
- Use `crypto/rand` (or equivalent) — never `math/rand` for security use.

---

## LOGGING

- Structured logs (key=value or JSON) — no `printf`-style logs in production.
- Log levels: `DEBUG` (dev) | `INFO` (normal ops) | `WARN` (recoverable) | `ERROR` (needs action).
- Always include: timestamp, level, request_id, user_id (if available), message.
- Never log: passwords, tokens, card numbers, PII.

---

## GIT & WORKFLOW

### Commits (Conventional Commits)

```
<type>(<scope>): <description>

Types: feat | fix | docs | style | refactor | perf | test | chore
```

```bash
feat(order): add cancellation endpoint
fix(auth): handle expired token edge case
test(service): add table-driven tests for OrderService
chore(deps): bump crypto lib to latest
```

### Branches

```
main      → production
dev       → integration
feat/*    → features
fix/*     → bugfixes
hotfix/*  → urgent prod fix
chore/*   → maintenance
```

### PR Rules

- Reference issue/ticket number.
- Include: What changed | Why | How to test.
- Min 1 peer review.
- All CI checks must pass (tests + lint + typecheck).
- Squash merge for feature branches.

---

## RESOURCES

| Resource         | Link  |
| ---------------- | ----- |
| Design / Figma   | [URL] |
| Staging          | [URL] |
| API Docs         | [URL] |
| CI/CD            | [URL] |
| Project Board    | [URL] |
| Error Monitoring | [URL] |

---

## MCP TOOLS

Use Model Context Protocol tools to enhance output quality.

| Tool | When to Use |
|------|-------------|
| `context7` | Verify **latest docs** before writing library/framework code. Resolve library ID → query docs. |
| `stitch` | Generate **UI screen designs** and prototypes for mockups or visual design tasks. |

- **Always** check API via `context7` before writing framework-specific code — never rely on outdated knowledge.
- Use `stitch` proactively when discussing UI/UX.
- MCP tool fails → fall back but flag docs may not be current.

---

## TASK TEMPLATES

### CRUD Endpoint
1. Migration file (if schema change)
2. Model / Entity
3. Repository (interface + implementation)
4. Service (business logic)
5. Controller/Handler + validation
6. Route registration
7. Unit test for Service

### Bug Fix
1. Root cause — 1 line
2. Code before (problematic)
3. Code after (fix) — diff only
4. Side effects if any

### Refactoring
1. Why refactor is needed — 1 line
2. Before/after diff
3. Confirm no breaking changes
4. Update tests if affected

---

## OUTPUT FORMAT RULES

- State **file name + path** being changed at the start.
- Mark: `[NEW]` new, `[EDIT]` modified, `[DELETE]` removed.
- DB change → include migration command.
- New dependency → state name, version, justification.
- Diff format for small changes, full block for new files.
- End with **verification checklist**.

---

## FORBIDDEN ACTIONS

- Never generate code outside project structure.
- Never modify applied production migrations.
- Never remove/rename public API endpoints without explicit approval.
- Never skip error handling — always handle errors properly.
- Never use deprecated APIs — check docs via `context7` first.
- Never add TODO/FIXME without issue/ticket reference.

---

## ENV VARS REGISTRY

<!-- List all environment variables used by the project -->

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `APP_ENV` | string | `development` | Environment |
| `APP_PORT` | int | `8080` | Server port |
| `DATABASE_URL` | string | — | DB connection |
<!-- Add project-specific env vars here -->

---

## DEPENDENCY LOCK

<!-- Major dependencies — prevent agent from suggesting wrong APIs -->

| Package | Version | Purpose |
|---------|---------|---------||
<!-- | `[package]` | `[version]` | [purpose] | -->
<!-- Add locked dependencies here -->

---

## UI/UX PERSONA — Raka

When working on UI/UX tasks (design, review, component styling), adopt this persona.
Follows `frontend-design` skill methodology — read `SKILL.md` for full creative guidelines.

### Identity

| Atribut | Detail |
|---------|--------|
| Nama | Raka — Senior UI/UX Designer |
| Pengalaman | 8 tahun — productivity apps, developer tools, SaaS |
| Spesialisasi | Dark UI, design systems, micro-interactions |
| Tone | Langsung, jujur, opinionated, selalu actionable |
| Referensi | Linear, Raycast, Vercel Dashboard, Arc Browser |
| Anti-pattern | Desain "AI-generated", generic, tanpa intensi |

### Design Thinking (dari `SKILL.md`)

Sebelum coding UI, Raka selalu jawab 4 pertanyaan ini:

1. **Purpose** — masalah apa yang diselesaikan interface ini? Siapa yang pakai?
2. **Tone** — arah estetika yang dipilih. SimpleDesk: **refined dark productivity** — clean, layered, presisi. Bukan minimalis yang kosong, bukan maximalis yang berisik
3. **Constraints** — React 19 + TypeScript + Tailwind v4 + shadcn/ui. Harus accessible, performant
4. **Differentiation** — apa yang membuat halaman ini **diingat**? Satu elemen yang standout

> **CRITICAL**: Pilih arah konseptual yang jelas, eksekusi dengan presisi. Setiap halaman punya "satu hal yang diingat".

### Prinsip

| # | Prinsip | Penjelasan |
|---|---------|------------|
| 1 | **Hierarchy first** | Mata harus langsung tahu apa yang paling penting. Kalau semuanya sama → tidak ada yang penting |
| 2 | **Konsistensi = kepercayaan** | Inkonsistensi UI mengikis kepercayaan user. Spacing, warna, tipografi harus satu bahasa |
| 3 | **Spacing adalah napas** | White space bukan ruang terbuang → membuat konten mudah di-scan |
| 4 | **Setiap piksel punya alasan** | Setiap warna, shadow, border, animasi harus menjawab: "ini membantu user melakukan apa?" |
| 5 | **Dark UI yang proper** | Bukan background hitam + teks putih. Layer jelas, contrast terukur, tidak melelahkan mata |
| 6 | **Anti AI-slop** | Hindari estetika generik: overused fonts, gradient ungu di white bg, layout cookie-cutter. Setiap desain harus terasa **intentional dan crafted** |

### Aesthetics Guidelines (dari `SKILL.md`)

- **Typography** — pilih font yang distinctive dan characterful. Pair display font yang unik dengan body font yang refined. Hindari pilihan generik (Arial, system fonts). Untuk SimpleDesk: gunakan display/heading font yang punya karakter, body tetap readable
- **Color & Theme** — commit ke satu aesthetic yang kohesif. Gunakan CSS variables (lihat Design System Tokens). Dominant colors dengan sharp accents → lebih baik dari palette yang tersebar merata
- **Motion** — prioritaskan CSS-only solutions. Fokus pada high-impact moments: satu page load yang well-orchestrated dengan staggered reveals (animation-delay) lebih delightful dari micro-interactions yang tersebar. Scroll-trigger dan hover states yang surprising
- **Spatial Composition** — jangan takut layout yang unexpected: asymmetry, overlap, diagonal flow, grid-breaking. Generous negative space ATAU controlled density — pilih salah satu, commit
- **Backgrounds & Depth** — buat atmosphere, bukan flat solid colors. Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows — sesuaikan dengan aesthetic SimpleDesk yang refined dark

> Match implementation complexity ke aesthetic vision. SimpleDesk = refined productivity → restraint, precision, spacing sempurna, tipografi detail, subtle details yang rewarding.

### Cara Kerja

1. **Tanyakan konteks** — "User sedang melakukan apa? Action utamanya apa?" Tidak mulai tanpa memahami *why*
2. **Opinionated** — bukan "bisa ini bisa itu", tapi "pakai `accent-blue` karena ini primary action"
3. **Alasan di balik rekomendasi** — reasoning, bukan preferensi
4. **Benchmark nyata** — "Linear menangani ini dengan..." atau "Raycast pakai pendekatan ini"
5. **Review 3 layer** — ✅ berhasil | ⚠️ perlu diperbaiki | 🔧 cara memperbaikinya

### Red Flags

- ❌ Contrast ratio < 4.5:1 (teks abu di bg abu)
- ❌ Tombol tanpa visual hierarchy → semua terlihat sama
- ❌ Spacing tidak konsisten antar section
- ❌ Animasi tanpa tujuan ("bergerak demi bergerak")
- ❌ > 3 warna aksen di satu halaman
- ❌ Icon tanpa label di navigasi utama
- ❌ Font size terlalu seragam → heading ≈ body ≈ caption
- ❌ Generic AI aesthetics — overused fonts, cliché color schemes, predictable layouts
- ❌ Desain yang terasa copy-paste tanpa konteks → setiap halaman harus punya identitas

---

## DESIGN SYSTEM TOKENS

**Tidak boleh ada warna, ukuran, atau spacing yang hardcoded di luar sistem ini.**

### Colors — Background Layers

| Token | Hex | Fungsi |
|-------|-----|--------|
| `--bg-base-dark` | `#000000` | Background utama dark section (immersive) |
| `--bg-base-light`| `#f5f5f7` | Background utama light section (informational) |
| `--bg-surface-dark-1` | `#272729` | Card background di dark section |
| `--bg-surface-dark-2` | `#262628` | Subtle surface di dark section |
| `--bg-surface-dark-3` | `#28282a` | Elevated card di dark section |
| `--bg-surface-light`  | `#fafafc` | Background button light/search/filter |
| `--bg-overlay` | `rgba(210, 210, 215, 0.64)` | Overlay media control |
| `--bg-nav-glass`| `rgba(0, 0, 0, 0.8)` | Sticky nav background (with blur) |

### Colors — Text

| Token | Hex | Fungsi |
|-------|-----|--------|
| `--text-primary-dark` | `#ffffff` | Teks utama di background dark |
| `--text-primary-light`| `#1d1d1f` | Teks utama di background light |
| `--text-secondary-light`| `rgba(0, 0, 0, 0.8)` | Teks sekunder/nav di background light |
| `--text-tertiary` | `rgba(0, 0, 0, 0.48)` | Teks disable, icon carousel |

### Colors — Accent (Semantic)

| Token | Hex | Fungsi |
|-------|-----|--------|
| `--accent-blue` | `#0071e3` | Primary CTA, focus ring (SATU-SATUNYA aksen warna solid) |
| `--accent-link-light` | `#0066cc` | Link text di background light ("Learn more") |
| `--accent-link-dark` | `#2997ff` | Link text di background dark ("Learn more") |
| `--btn-active-light` | `#ededf2` | State active untuk button light |
| `--btn-hover-dark-close` | `rgba(255, 255, 255, 0.32)` | Hover modal close button di dark |

### Typography

Font: **SF Pro Display** (Display/Hero) dan **SF Pro Text** (Body). Fallbacks `SF Pro Icons`, `Helvetica Neue`, `Arial`.
*Wajib mengaplikasikan negative letter spacing (tracking).*

| Token | Size | Weight | LH | Tracking | Fungsi |
|-------|------|--------|----|----------|--------|
| `--text-display-hero` | 56px | 600 | 1.07 | -0.28px | Headline utama produk |
| `--text-section-hd` | 40px | 600 | 1.10 | normal | Section title |
| `--text-tile-hd` | 28px | 400 | 1.14 | 0.196px| Judul tile produk |
| `--text-card-bold` | 21px | 700 | 1.19 | 0.231px| Headings card (bold) |
| `--text-card` | 21px | 400 | 1.19 | 0.231px| Headings card (reguler) |
| `--text-nav` | 34px | 600 | 1.47 | -0.374px| Large nav |
| `--text-body` | 17px | 400 | 1.47 | -0.374px| Reading text utama |
| `--text-body-strong` | 17px | 600 | 1.24 | -0.374px| Emphasized teks, label |
| `--text-btn-lg` | 18px | 300 | 1.00 | normal | Button text besar |
| `--text-btn` | 17px | 400 | 2.41 | normal | Button standard |
| `--text-link` | 14px | 400 | 1.43 | -0.224px| Link inline, "Learn more" |
| `--text-caption` | 14px | 400 | 1.29 | -0.224px| Deskripsi, caption |
| `--text-micro` | 12px | 400 | 1.33 | -0.120px| Fine print, footer |

### Spacing (Base unit: 8px)

| Token | Value | Token | Value |
|-------|-------|-------|-------|
| `--space-micro-1` | 2px | `--space-1` | 8px |
| `--space-micro-2` | 4px | `--space-2` | 14px |
| `--space-micro-3` | 5px | `--space-3` | 15px |
| `--space-micro-4` | 6px | `--space-4` | 17px |
| `--space-micro-5` | 7px | `--space-5` | 20px |
| `--space-micro-6` | 9px | `--space-md` | 24px |
| `--space-micro-7` | 10px | `--space-lg` | 32px |
| `--space-micro-8` | 11px | `--space-xl` | 48px |

### Border Radius

| Token | Value | Penggunaan |
|-------|-------|------------|
| `--radius-micro` | 5px | Container kecil, link tags |
| `--radius-md` | 8px | Button CTA, product card, image box |
| `--radius-lg` | 11px | Search input, filter |
| `--radius-xl` | 12px | Feature panel, container foto |
| `--radius-pill` | 980px | CTA Links ("Learn more", "Shop") |
| `--radius-full` | 50% | Media control (play, arrow) |

### Shadows & Elevation

| Token | Value | Penggunaan |
|-------|-------|------------|
| `--shadow-soft` | `0px 5px 30px 3px rgba(0,0,0,0.22)` | Elevated elements, diffuse lift |
| `--nav-glass` | `saturate(180%) blur(20px)` | Backdrop-filter untuk sticky nav |
| `--focus-ring` | `0 0 0 2px var(--accent-blue)` | Focus tab outline |

### Motion

| Token | Value | Penggunaan |
|-------|-------|------------|
| `--duration-fast` | `100ms` | Hover instan untuk interactive elements |
| `--easing-default`| `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard |

### Component Patterns

**Button Hierarchy:**

| Variant | BG | Text | Border | Radius | Kapan |
|---------|-----|------|--------|--------|-------|
| Primary CTA | `--accent-blue` | `#ffffff` | — | 8px | CTA utama (Buy, Shop) |
| Pill CTA | transparan | `--accent-link-*` | solid link color | 980px | "Learn more" links inline |
| Dark CTA | `#1d1d1f` | `#ffffff` | — | 8px | Secondary di bg light |
| Filter/Search | `--bg-surface-light`| `rgba(0,0,0,0.8)`| `rgba(0,0,0,0.04)`| 11px | Input/filter |

### Breakpoints & Layout

Apple design berfokus pada "Cinematic rhythm". Tidak ada border, hanya warna solid.
Max content width ≈980px untuk section terpusat.

| Token | Width | Target |
|-------|-------|--------|
| `--bp-sm` | 640px | Mobile Large |
| `--bp-md` | 834px | Tablet |
| `--bp-lg` | 1024px | Desktop Small |
| `--bp-xl` | 1440px | Large Desktop |

---

## TOKEN OPTIMIZATION NOTES

<!-- Why this file is written this way -->
<!--
  This file is intentionally compact to minimize token consumption
  when read by the AI agent on every invocation.

  Guidelines for keeping this file efficient:
  - Use tables instead of repeated bullet blocks.
  - Use code blocks only for commands and schemas — not explanations.
  - No prose paragraphs — use short imperative sentences.
  - No duplicate information — cross-reference sections instead.
  - Remove examples that restate the rule (keep only non-obvious ones).
  - Prefer symbols: → | ≤ ≥ instead of words where clear.
  - Sections you never use → delete them, don't leave them empty.
  - Update [placeholders] with real values to avoid AI guesswork.
-->

---

_Updated: 2026-03-22 | Owner: [team/person]_

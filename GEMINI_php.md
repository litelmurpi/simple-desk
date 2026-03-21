# GEMINI.md — Project AI Agent Configuration

> This file is automatically read by Gemini CLI when running inside this project directory.
> It provides context, coding standards, and behavioral rules for the AI agent.
> **Do not delete this file.** Keep it updated as the project evolves.

---

## 🗂️ Project Overview

```
Project Name : [Your Project Name]
Type         : [Web App / REST API / Full-stack / CMS]
Stack        : PHP (Laravel) + JavaScript (Vanilla / Alpine.js / jQuery)
PHP Version  : >= 8.2
Node Version : >= 20.x (for asset bundling)
Package Mgr  : composer (PHP) + npm (JS)
```

**Short Description:**

<!-- Write 2–3 sentences describing what this project does and who it's for. -->

[Describe your project here.]

**Repository Structure:**

```
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Request handlers
│   │   ├── Middleware/       # HTTP middleware
│   │   └── Requests/         # Form Request validation
│   ├── Models/               # Eloquent models
│   ├── Services/             # Business logic layer
│   └── Helpers/              # Global helper functions
├── resources/
│   ├── views/                # Blade templates
│   ├── js/                   # JavaScript source files
│   └── css/                  # CSS / SCSS source files
├── routes/
│   ├── web.php               # Web routes
│   └── api.php               # API routes
├── database/
│   ├── migrations/           # Database migration files
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── public/                   # Web root (compiled assets)
├── tests/
│   ├── Feature/              # Feature/integration tests
│   └── Unit/                 # Unit tests
├── config/                   # App configuration files
├── storage/                  # Logs, cache, uploads
├── .env.example              # Environment variable template
└── GEMINI.md                 # This file
```

---

## ⚡ Quick Commands

```bash
# Development
php artisan serve              # Start local dev server
npm run dev                    # Watch and compile assets (Vite)
npm run build                  # Compile assets for production

# Artisan
php artisan make:controller    # Generate a controller
php artisan make:model         # Generate a model
php artisan make:migration     # Generate a migration
php artisan make:request       # Generate a Form Request
php artisan route:list         # List all registered routes
php artisan config:clear       # Clear config cache
php artisan cache:clear        # Clear application cache

# Database
php artisan migrate            # Run pending migrations
php artisan migrate:fresh      # Drop all + re-migrate (DEV ONLY)
php artisan db:seed            # Run seeders
php artisan migrate:fresh --seed  # Reset + seed (DEV ONLY)

# Testing
php artisan test               # Run all tests
php artisan test --filter=...  # Run specific test
./vendor/bin/phpunit           # Run via PHPUnit directly

# Code Quality
./vendor/bin/pint              # Auto-fix code style (Laravel Pint)
./vendor/bin/phpstan analyse   # Static analysis (PHPStan)
npm run lint                   # ESLint for JavaScript
npm run format                 # Prettier for JavaScript
```

---

## 🤖 Agent Behavior Rules

### General Instructions

- **Always** read the existing file or class before modifying it.
- **Never** delete logic without understanding its purpose — ask first if unsure.
- Follow existing patterns in the codebase; do not introduce new patterns without flagging it.
- Prefer **editing existing files** over creating new ones unless explicitly asked.
- Do not introduce new `composer` or `npm` packages without asking first.
- Write code as if a **senior developer** will review it.

### Response Style

- Be **concise** — skip lengthy explanations unless asked.
- Show only the **relevant code block or diff**, not the full file, unless requested.
- When fixing a bug, state the **root cause in one line** before showing the fix.
- Use inline comments only for **non-obvious logic**.

### When Making Changes

1. Check if a helper, service, or utility already exists for the task before writing new code.
2. Validate that any new route follows the existing naming convention in `web.php` / `api.php`.
3. Never hardcode credentials, API keys, or environment-specific values — always use `.env`.
4. Always check `php artisan route:list` output mentally to avoid duplicate or conflicting routes.
5. Never suggest destructive artisan commands (`migrate:fresh`, `db:seed`) in a production context.

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

## 🐘 PHP / Laravel Standards

### General PHP Rules

- Use **PHP 8.2+ features**: constructor property promotion, readonly properties, named arguments, match expressions, enums.
- Always declare `strict_types=1` at the top of every PHP file.
- Use **type hints** for all function parameters and return types.
- Never use `var_dump()` or `dd()` in committed code — use logging instead.

```php
<?php

declare(strict_types=1);

// ✅ Good — typed, strict
function calculateTotal(int $quantity, float $price): float
{
    return $quantity * $price;
}

// ❌ Bad — no types
function calculateTotal($quantity, $price)
{
    return $quantity * $price;
}
```

### Naming Conventions

| Entity              | Convention        | Example                  |
| ------------------- | ----------------- | ------------------------ |
| Classes             | `PascalCase`      | `OrderService`           |
| Methods / Functions | `camelCase`       | `getUserById()`          |
| Variables           | `camelCase`       | `$orderItems`            |
| Constants           | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT`        |
| Database tables     | `snake_case`      | `order_items`            |
| Database columns    | `snake_case`      | `created_at`, `user_id`  |
| Routes (web)        | `kebab-case`      | `/user-profile`          |
| Route names         | `dot.notation`    | `user.profile.edit`      |
| Blade views         | `kebab-case`      | `user-profile.blade.php` |
| Config keys         | `snake_case`      | `config('app.debug')`    |

### Controllers

- Keep controllers **thin** — delegate business logic to Service classes.
- Use **Form Requests** for all validation — never validate inline inside controllers.
- Use **Resource Controllers** (`--resource`) for CRUD operations.

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $order = $this->orderService->create($request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order berhasil dibuat.');
    }
}
```

### Models (Eloquent)

- Always define `$fillable`.
- Define **relationships** as methods with explicit return types.
- Use **scopes** for reusable query conditions.
- Do not put business logic inside models — use Services.

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    protected $fillable = ['name', 'email', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
```

### Services

- All business logic lives in `app/Services/`.
- Services are plain PHP classes — inject dependencies via constructor.

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;

class OrderService
{
    public function create(array $data): Order
    {
        // Business logic here
        return Order::create($data);
    }
}
```

### Validation (Form Requests)

- All input validation must use **Form Request** classes.
- Always return user-friendly messages in the `messages()` method.

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
            'note'       => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists'   => 'Produk tidak ditemukan.',
            'quantity.min'        => 'Jumlah minimal 1.',
        ];
    }
}
```

### Routes

- Group related routes using `Route::prefix()` and `Route::name()`.
- Apply middleware at the group level, not per-route.
- Always name every route.

```php
// routes/web.php
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::post('/', [OrderController::class, 'store'])->name('store');
    });
});
```

---

## 🌐 JavaScript Standards

### General Rules

- Use **ES2020+** syntax: `const`/`let`, arrow functions, destructuring, optional chaining (`?.`), nullish coalescing (`??`), `async/await`.
- Never use `var` — use `const` by default, `let` only when reassignment is needed.
- Never use `==` — always use `===` for comparison.
- Avoid inline `<script>` in Blade files — keep JS in `/resources/js/`.

```javascript
// ✅ Good
const getUserName = (user) => user?.profile?.name ?? "Anonymous";

const response = await fetch("/api/orders");
const { data, success } = await response.json();

// ❌ Bad
var name = user && user.profile ? user.profile.name : "Anonymous";
```

### Naming Conventions

| Entity          | Convention        | Example            |
| --------------- | ----------------- | ------------------ |
| Variables       | `camelCase`       | `orderItems`       |
| Functions       | `camelCase`       | `fetchOrders()`    |
| Classes         | `PascalCase`      | `OrderManager`     |
| Constants       | `SCREAMING_SNAKE` | `MAX_RETRY`        |
| Files           | `kebab-case.js`   | `order-manager.js` |
| CSS classes     | `kebab-case`      | `order-card`       |
| Data attributes | `kebab-case`      | `data-order-id`    |

### File Organization

```
resources/js/
├── app.js               # Main entry point
├── bootstrap.js         # Axios, CSRF, global setup
├── pages/               # Page-specific scripts
│   ├── orders.js
│   └── dashboard.js
├── components/          # Reusable UI logic
│   ├── modal.js
│   └── datatable.js
└── utils/               # Helper functions
    ├── format.js
    └── api.js
```

### AJAX / Fetch

- Always include the **CSRF token** in non-GET requests.
- Use a shared `api.js` utility for all fetch calls — avoid raw `fetch()` scattered in files.
- Always handle both success and error states.

```javascript
// resources/js/utils/api.js
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

// Usage
import { apiFetch } from "../utils/api.js";

try {
  const { data } = await apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({ product_id: 1, quantity: 2 }),
  });
  console.log("Order created:", data);
} catch (error) {
  console.error("Failed:", error.message);
}
```

### DOM Manipulation

- Prefer `addEventListener` over inline `onclick=""` attributes in HTML.
- Use `data-*` attributes to pass server-side data to JS — never echo PHP variables directly into JS.
- Cache DOM queries — don't query the same element multiple times.

```javascript
// ✅ Good
const deleteBtn = document.getElementById("delete-btn");
const orderId = deleteBtn?.dataset.orderId;

deleteBtn?.addEventListener("click", async () => {
  await apiFetch(`/api/orders/${orderId}`, { method: "DELETE" });
});

// ❌ Bad
document.getElementById("delete-btn").onclick = function () {
  fetch("/api/orders/<?= $order->id ?>", { method: "DELETE" }); // Never echo PHP into JS
};
```

---

## 🎨 Blade / Frontend Standards

### Blade Templates

- Use **Blade components** (`<x-component />`) for reusable UI pieces.
- Never put business logic in Blade — only presentation logic.
- Use `@isset`, `@empty`, `@auth`, `@can` directives instead of raw PHP `if`.
- Always escape output with `{{ }}` — only use `{!! !!}` for trusted, sanitized HTML.

```blade
{{-- ✅ Good --}}
{{ $user->name }}
@isset($order)
    <p>Order #{{ $order->id }}</p>
@endisset

{{-- ❌ Bad --}}
{!! $user->name !!}    {{-- XSS risk --}}
<?php if ($order): ?>  {{-- Raw PHP in Blade --}}
```

### CSS / Styling

- Use **Tailwind CSS** utility classes (or define your convention here).
- Extract repeated Blade+Tailwind patterns into **Blade components**.
- Avoid inline `style=""` attributes except for dynamic values.
- Keep global CSS in `resources/css/app.css` — avoid scattered `<style>` tags in Blade.

---

## 🗄️ Database Standards

- Define all schema changes via **migration files** — never alter the database directly.
- Use `snake_case` for all table and column names.
- Every table must have `id`, `created_at`, and `updated_at` columns.
- Add **foreign key constraints** in migrations for data integrity.
- Use **transactions** for multi-step writes.
- Never store plaintext passwords — always use `bcrypt()` or `Hash::make()`.
- Do not `SELECT *` — always specify the columns you need.

```php
// ✅ Good — migration with foreign key constraints
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained()->restrictOnDelete();
    $table->unsignedInteger('quantity');
    $table->decimal('total_price', 12, 2);
    $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
    $table->timestamps();
    $table->softDeletes();
});
```

---

## 🧪 Testing Standards

### Stack: PHPUnit + Laravel Testing Helpers

- **Unit tests** for Services and isolated logic.
- **Feature tests** for HTTP routes and full request-response cycles.
- Use `RefreshDatabase` trait for tests that touch the database.
- Use **factories** for test data — never hardcode IDs.
- Follow the **Arrange–Act–Assert (AAA)** pattern.

```php
<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_an_order(): void
    {
        // Arrange
        $user = User::factory()->create();
        $payload = ['product_id' => 1, 'quantity' => 2];

        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/orders', $payload);

        // Assert
        $response->assertCreated()
            ->assertJsonStructure(['success', 'data' => ['id', 'status']]);

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'quantity' => 2]);
    }

    public function test_guest_cannot_create_an_order(): void
    {
        $this->postJson('/api/orders', [])->assertUnauthorized();
    }
}
```

---

## 🔌 API Standards

### Response Format

All API responses must follow this consistent shape:

```json
// Success
{ "success": true, "data": {}, "message": "OK" }

// Paginated
{ "success": true, "data": [], "meta": { "current_page": 1, "last_page": 5, "total": 48 } }

// Error
{ "success": false, "message": "Validasi gagal.", "errors": { "email": ["Email tidak valid."] } }
```

### HTTP Status Codes

| Code | Usage                                        |
| ---- | -------------------------------------------- |
| 200  | OK — successful GET, PUT, PATCH              |
| 201  | Created — successful POST                    |
| 204  | No Content — successful DELETE               |
| 400  | Bad Request — malformed request              |
| 401  | Unauthorized — not logged in                 |
| 403  | Forbidden — logged in but no permission      |
| 404  | Not Found — resource doesn't exist           |
| 422  | Unprocessable — validation failed            |
| 500  | Internal Server Error — unexpected exception |

### API Routes

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);
});
```

---

## 🔐 Security Rules

- **Never** hardcode secrets, API keys, or DB credentials — use `.env`.
- Commit only `.env.example` to Git — never `.env`.
- Always use `{{ }}` in Blade (auto-escaped) — avoid `{!! !!}` unless content is trusted.
- Use **Laravel Sanctum** for API authentication.
- Validate and authorize every request — use **Policies** for model-level authorization.
- Rate-limit sensitive endpoints (login, register, password reset) using `throttle` middleware.
- Never log sensitive data (passwords, tokens, payment info).

---

## ♿ Accessibility (a11y) Standards

- All `<img>` must have `alt` attributes (empty `alt=""` for decorative images).
- All form `<input>` must have an associated `<label>`.
- Interactive elements must be reachable via keyboard (`Tab`, `Enter`, `Space`).
- Use semantic HTML: `<button>` for actions, `<a>` for navigation.
- Aim for **WCAG 2.1 AA** compliance.

---

## 🚀 Git & Workflow Standards

### Commit Message Format (Conventional Commits)

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

```bash
feat(orders): add order cancellation endpoint
fix(auth): redirect to login on expired session
refactor(services): extract payment logic into PaymentService
test(orders): add feature test for order creation
chore(deps): update laravel/framework to 11.x
```

### Branch Strategy

```
main          → production-ready code
dev           → integration / staging branch
feat/*        → new features
fix/*         → bug fixes
hotfix/*      → urgent production fixes
chore/*       → maintenance, deps, config
```

### Pull Request Rules

- Every PR must reference an issue or ticket number.
- PR description must include: **What**, **Why**, and **How to test**.
- At least **1 peer review** required before merging.
- All CI checks (tests, Pint, PHPStan) must pass before merge.
- Squash and merge feature branches.

---

## 🏗️ Architecture Notes

### Key Design Decisions

1. **Service Layer** — Business logic is isolated in `app/Services/`. Controllers only handle HTTP concerns.
2. **Form Requests** — All validation is handled via dedicated Request classes, not inline in controllers.
3. **API Resources** — All API responses go through Laravel API Resources for consistent transformation.

### Known Technical Debt

- [ ] [Area 1]: [Description and reason it was accepted]
- [ ] [Area 2]: [Description and reason it was accepted]

### Out of Scope (Do Not Touch)

- `app/Legacy/` — deprecated code kept for reference, do not modify.
- `database/migrations/2020_*` — old migrations, do not alter.

---

## 🔗 Key Resources

| Resource                  | Link  |
| ------------------------- | ----- |
| Design / Figma            | [URL] |
| Staging Environment       | [URL] |
| API Documentation         | [URL] |
| CI/CD Pipeline            | [URL] |
| Project Board             | [URL] |
| Error Monitoring (Sentry) | [URL] |

---

## 🎯 MCP TOOLS

Use Model Context Protocol tools to enhance output quality.

| Tool | When to Use |
|------|-------------|
| `context7` | Verify **latest docs** before writing library/framework code. Resolve library ID → query docs. |
| `stitch` | Generate **UI screen designs** and prototypes for mockups or visual design tasks. |

- **Always** check API via `context7` before writing framework-specific code — never rely on outdated knowledge.
- Use `stitch` proactively when discussing UI/UX.
- MCP tool fails → fall back but flag docs may not be current.

---

## 📋 TASK TEMPLATES

### CRUD (Laravel)
1. Migration file (`php artisan make:migration`)
2. Model (`app/Models/`) + fillable, relationships, casts
3. Form Request (`app/Http/Requests/`) + rules, messages
4. Service (`app/Services/`)
5. Controller (`app/Http/Controllers/`) — thin, calls service
6. Routes (`web.php` / `api.php`)
7. API Resource (jika API endpoint)
8. Feature test (`tests/Feature/`)

### Blade Component
1. Component class (`app/View/Components/`)
2. Blade template (`resources/views/components/`)

### Bug Fix
1. Root cause — 1 line
2. Code before → after (diff only)
3. Side effects jika ada

---

## 📐 OUTPUT FORMAT RULES

- State **file name + path** being changed at the start.
- Mark: `[NEW]` new, `[EDIT]` modified, `[DELETE]` removed.
- DB change → include `php artisan migrate` command.
- New dependency → state package name, version, justification.
- Diff format for small changes, full block for new files.
- End with **verification checklist**.

---

## 🚫 FORBIDDEN ACTIONS

- Never generate code outside project structure.
- Never modify applied production migrations.
- Never remove/rename public routes without explicit approval.
- Never skip error handling — always handle errors properly.
- Never use deprecated Laravel APIs — check docs via `context7` first.
- Never add TODO/FIXME without issue/ticket reference.
- Never use `{!! !!}` in Blade without confirming content is sanitized.

---

## 📦 ENV VARS REGISTRY

<!-- List all environment variables used by the project -->

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `APP_KEY` | string | — | Laravel app encryption key |
| `DB_CONNECTION` | string | `mysql` | DB driver |
| `DB_HOST` | string | `127.0.0.1` | DB host |
| `DB_DATABASE` | string | — | DB name |
| `MAIL_MAILER` | string | `smtp` | Mail driver |
<!-- Add project-specific env vars here -->

---

## 🔒 DEPENDENCY LOCK

<!-- Major dependencies — prevent agent from suggesting wrong APIs -->

| Package | Version | Purpose |
|---------|---------|---------||
<!-- | `laravel/framework` | `11.x` | Core framework | -->
<!-- | `laravel/sanctum` | `4.x` | API auth | -->
<!-- Add locked dependencies here -->

---

## 🔄 Updating This File

- Update `GEMINI.md` whenever a major architectural or stack decision changes.
- Keep **Quick Commands** in sync with `composer.json` and `package.json` scripts.
- Review at the start of every sprint or major milestone.

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

_Last updated: 2026-03-21 | Maintained by: [Team / Person]_

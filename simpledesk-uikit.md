# SimpleDesk UI/UX Design System Brief
## Persona & Aesthetic Direction: "Refined Dark Productivity"

You are tasked with designing and implementing UI components for **SimpleDesk**, a productivity/issue-tracking application. You must strictly adhere to the following aesthetic direction, which avoids generic "AI-slop" design and focuses on extreme precision, hierarchy, and intentionality.

### 1. Conceptual Direction & Tone
- **Aesthetic**: Refined Dark Productivity.
- **Vibe**: Clean, layered, precise, highly intentional. It is NOT empty minimalism, nor noisy maximalism. It feels like a premium developer tool (think Linear, Raycast, Vercel Dashboard, Arc Browser).
- **Core Principle**: Hierarchy is everything. Spacing is breathing room. Every pixel, shadow, border, and animation must answer: "How does this help the user?"

### 2. Typography
- **Display/Headings**: Inter (Bold/Semibold) - Distinctive and characterful.
- **Body**: Inter (Regular) - Highly readable.
- **Monospace/Numbers/Badges**: JetBrains Mono (13px) - Gives that technical, precise feel.
- **Avoid**: Generic system fonts or unpredictable sizing. Stick to a strict geometric scale (Display 28px, Title 20px, Heading 16px, Body 14px, Label 13px, Caption/Tiny 11-12px).

### 3. Dark UI Layering (Strict Palette)
Do not just use black backgrounds with white text. Use layered depth:
- `Base/App Background`: `#0A0A0B`
- `Raised (Cards, Sidebar, Panels)`: `#111113`
- `Overlay (Modals, Dropdowns)`: `#1A1A1F`
- `Surface (Inputs, Hover states)`: `#222228`
- `Subtle (Selected rows)`: `#2A2A32`

**Borders & Dividers:**
- `Default`: `#2A2A32`
- `Subtle`: `#1F1F25`
- `Strong/Focus Ring`: `#3E3E45`

**Text Colors (Contrast matters):**
- `Primary (Headings)`: `#EDEDEF`
- `Secondary (Body)`: `#A0A0AB`
- `Tertiary (Hints/Placeholders)`: `#62626B`

### 4. Semantic Accents & Badges
Accents must be sharp and paired with their 12% opacity soft-background equivalents for badges and highlight states.
- **Blue (Primary Action)**: `#3B82F6` (Soft: `rgba(59,130,246,0.12)`)
- **Green (Done/Success)**: `#22C55E` (Soft: `rgba(34,197,94,0.12)`)
- **Yellow (Open/Warning)**: `#EAB308` (Soft: `rgba(234,179,8,0.12)`)
- **Red (Urgent/Destructive)**: `#EF4444` (Soft: `rgba(239,68,68,0.12)`)
- **Purple (In Progress)**: `#8B5CF6` (Soft: `rgba(139,92,246,0.12)`)
- **Orange (High Priority)**: `#F97316` (Soft: `rgba(249,115,22,0.12)`)
- **Gray (Neutral/Archived)**: `#71717A` (Background: `#222228`)

### 5. Layout & Spatial Composition
- **Grid**: Strict 4px spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64).
- **Structure**: 240px Sidebar (collapsible on smaller screens `< 1024px`) + Fluid Main Content area.
- **Radii**: Small (`4px` for badges), Medium (`6px` for buttons/inputs), Large (`8px` for cards). Never use fully rounded pills unless it's an avatar (`9999px`).

### 6. Motion, Depth, & Micro-interactions
- **Shadows**: Rely mostly on border + background-color separation. Use extremely subtle shadows:
  - Focus Ring (Glow): `0 0 0 1px #3B82F6, 0 0 0 4px rgba(59,130,246,0.12)`
- **Motion**: Prioritize CSS-only. Keep it snappy and purposeful.
  - Hover/Toggle: `100ms cubic-bezier(0.25, 0.1, 0.25, 1)`
  - Dropdowns/Tabs: `200ms cubic-bezier(0.25, 0.1, 0.25, 1)`
  - Reveal/Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### 7. Red Flags (DO NOT DO THESE)
- ❌ Contrast ratio `< 4.5:1`.
- ❌ Buttons lacking visual hierarchy (only one primary CTA per page).
- ❌ Animations without purpose "just to move".
- ❌ Using more than 3 accent colors simultaneously on one layout.
- ❌ "AI-Slop" generic aesthetics (purple gradients on white background, typical overused SaaS layouts without character).

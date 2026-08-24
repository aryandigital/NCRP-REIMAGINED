# Design Integration Plan — Blue City Containment Theme

> This document outlines the integration of Stitch-generated UI mockups into the NCRP Reimagined codebase. It is **separate from PHASE1.md** to keep that file focused on technical/engineering deliverables.

---

## Overview

- **Theme Selected**: Blue City Containment (authority, structured, high-contrast)
- **Approach**: Extract reusable component library in `src/components/ui/`
- **Priority**: Homepage & Landing → Check/Evidence Intake pages → Phase 2 preview
- **Light Theme Only**: Keeping dark mode for future polish
- **Non-breaking Integration**: All existing functionality preserved

---

## Design System Tokens

### Colors (Light Mode)
**Primary (Copper/Brown)**
- `primary`: `#94460d` — Main CTA, authority color
- `primary-container`: `#b35e25` — Background variant
- `primary-fixed`: `#ffdbc9` — Light background
- `primary-fixed-dim`: `#ffb68d` — Mid variant

**Secondary (Blue)**
- `secondary`: `#415d99` — Informational
- `secondary-container`: `#9fbbfd` — Softer background
- `secondary-fixed`: `#d9e2ff` — Very light
- `secondary-fixed-dim`: `#afc6ff` — Mid variant

**Tertiary (Accent Blue)**
- `tertiary`: `#0056c3` — Deep accent
- `tertiary-container`: `#2f70e1` — Lighter accent
- `tertiary-fixed`: `#d9e2ff` — Light background

**Surfaces & Containers**
- `background`: `#fbf8ff` — Page background
- `surface`: `#fbf8ff` — Card/container surface
- `surface-container`: `#ececff` — Slightly darker container
- `surface-container-low`: `#f3f2ff` — Even lighter variant
- `surface-container-high`: `#e4e7ff` — Darker variant
- `surface-container-highest`: `#dde1ff` — Darkest variant
- `surface-bright`: `#fbf8ff` — Brightest variant
- `surface-container-lowest`: `#ffffff` — Pure white

**Text & Borders**
- `on-surface`: `#111939` — Primary text
- `on-surface-variant`: `#55433a` — Secondary text
- `outline`: `#887368` — Borders
- `outline-variant`: `#dbc1b5` — Light borders

**Status Colors**
- `error`: `#ba1a1a` — High risk / alert
- `error-container`: `#ffdad6` — Error background

### Typography
**Font Families**
- `display-lg`: Bricolage Grotesque (64px, weight 800, line-height 1.1, letter-spacing -0.03em)
- `display-lg-mobile`: Bricolage Grotesque (40px, weight 800)
- `headline-md`: Bricolage Grotesque (32px, weight 700, line-height 1.2)
- `body-main`: Lexend (18px, weight 400, line-height 28px)
- `body-sm`: Lexend (16px, weight 400, line-height 24px)
- `label-mono`: IBM Plex Mono (14px, weight 500, letter-spacing 0.05em)

### Spacing & Sizing
- `unit`: `8px` — Base spacing unit
- `margin-mobile`: `20px` — Mobile margins
- `margin-desktop`: `64px` — Desktop margins
- `gutter`: `24px` — Gap between grid items
- `container-max`: `1280px` — Max container width

### Border Radius
- `DEFAULT`: `0.25rem` (2px)
- `lg`: `0.5rem` (4px)
- `xl`: `0.75rem` (6px)
- `full`: `9999px` (fully rounded)

### Shadows
- `shadow-copper`: `0 12px 40px rgba(196,107,50,0.12)` — Soft copper shadow

---

## Component Library Structure

All reusable components go in `src/components/ui/`. Each component is:
- **Headless** (no hard-coded colors in component logic)
- **Composable** (works with `className` prop for extension)
- **Documented** (examples in comments)
- **Tested** (visually testable via Storybook-style preview)

### Phase 1 — Core Components (Priority)

| Component | Purpose | Status | Design File |
|---|---|---|---|
| `Button` | Primary, secondary, alert CTAs | 🔄 Building | component_sheet_blue_city |
| `Badge` | Status stamps (Verified, Processing, Action Required) | 🔄 Building | component_sheet_blue_city |
| `Card` | Journey cards, content containers | 🔄 Building | component_sheet_blue_city |
| `Input` | Text fields, with labels & errors | ⏳ Pending | component_sheet_blue_city |
| `Header` | Sticky header with Quick Exit | ⏳ Pending | component_sheet_blue_city |
| `Footer` | Disclaimer footer | ⏳ Pending | globals.css (existing) |
| `Dialog` | Modal / overlay for confirmations | ⏳ Pending | TBD |

### Phase 2 — Layout & Page Components

| Component | Purpose | Status | Design File |
|---|---|---|---|
| `PageContainer` | Max-width container with desktop/mobile padding | ⏳ Pending | component_sheet_blue_city |
| `Section` | Labeled section with divider | ⏳ Pending | component_sheet_blue_city |
| `FormField` | Label + Input + Error message wrapper | ⏳ Pending | TBD |
| `StageTimeline` | Check → Act → Report → Recover stepper | ✅ Existing | (refactor into ui/) |

---

## Pages to Integrate (Priority Order)

### Priority 1: Homepage & Landing
**Files**:
- `stitch_cybercrime_relief_design_system/homepage_blue_city/code.html`
- `src/app/page.tsx` (current)

**What to Update**:
- Hero section layout & typography
- 4 Doors card layout (Blue City variant)
- Stats ticker styling
- Atlas preview grid

**Existing Functionality to Preserve**:
- All links work (`/check`, `/atlas`, etc.)
- Stats data drives display
- No backend changes

---

### Priority 2: Check / Evidence Intake
**Files**:
- `stitch_cybercrime_relief_design_system/check_intake_blue_city/code.html`
- `src/app/check/page.tsx` (current)

**What to Update**:
- Evidence drop zone styling (Blue City treatment)
- Form inputs with blue theme
- CTA buttons (Report Incident instead of Submit)
- Error states and validation messages

**Existing Functionality to Preserve**:
- 5-mode EvidenceDrop component logic
- API calls to `/api/ingest`
- PII redaction
- All business logic

---

### Priority 3: Scam DNA Verdict
**Files**:
- `stitch_cybercrime_relief_design_system/scam_dna_verdict_blue_city/code.html`
- `src/app/check/[id]/page.tsx` (current)

**What to Update**:
- RiskVerdict card layout with Blue City styling
- Risk badge colors and typography
- Stage timeline positioning
- CTA styling (next stage navigation)

**Existing Functionality to Preserve**:
- DNA verdict data structure
- All 8 output fields
- Navigation to `/triage/[id]`

---

## Integration Workflow

### Step 1: Build Component Library (`src/components/ui/`)
- [ ] Extract `Button.tsx` component (primary, secondary, alert variants)
- [ ] Extract `Badge.tsx` component (status stamps)
- [ ] Extract `Card.tsx` component (journey cards, wrappers)
- [ ] Extract `Input.tsx` component (text fields)
- [ ] Extract `Header.tsx` component (sticky, with Quick Exit)
- [ ] Create `PageContainer.tsx` and `Section.tsx` helpers

### Step 2: Update Global Design Tokens
- [ ] Update `src/app/globals.css` with Blue City color palette
- [ ] Ensure light mode colors are primary (dark mode TBD)
- [ ] Load Bricolage Grotesque & IBM Plex Mono fonts
- [ ] Import Material Symbols for icons

### Step 3: Integrate Priority 1 Pages
- [ ] Update Homepage (`src/app/page.tsx`)
- [ ] Verify all links still work
- [ ] Test responsive behavior

### Step 4: Integrate Priority 2 Pages
- [ ] Update Evidence Intake (`src/app/check/page.tsx`)
- [ ] Ensure form submission still works
- [ ] Verify API integration

### Step 5: Integrate Priority 3 Pages
- [ ] Update Scam DNA Result (`src/app/check/[id]/page.tsx`)
- [ ] Verify navigation to next stage

### Step 6: Documentation & Handoff
- [ ] Update this file with completion status
- [ ] Add component usage examples to `DESIGN_SYSTEM.md`
- [ ] Update PHASE1.md if any major structural changes

---

## Known Constraints & Decisions

1. **Light Theme Only (for now)**
   - Dark mode can be added in Phase 4 polish
   - Tailwind `darkMode: "class"` already configured but not actively used

2. **Icon System**
   - Using Material Symbols (already loaded)
   - Maps to existing `<span class="material-symbols-outlined">...</span>` usage

3. **Responsive Breakpoints**
   - Mobile: 360px–430px (Tailwind `sm:`)
   - Tablet: 768px (Tailwind `md:`)
   - Desktop: 1024px+ (Tailwind `lg:`, `xl:`)

4. **No Major Refactoring**
   - Keep existing `QuickExit`, `StageTimeline`, `RiskVerdict` logic
   - Wrap with new UI library components, don't replace wholesale

5. **CSS Classes**
   - Use Tailwind utilities where possible
   - Extract custom styles to `src/app/globals.css` for reuse
   - No inline `style=` props (except in generated content)

---

## Testing Checklist (Per Page)

- [ ] Page renders without errors
- [ ] All existing links and buttons work
- [ ] Form submissions succeed
- [ ] API calls complete as before
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Quick Exit button present and functional
- [ ] Disclaimer footer present

---

## Files Modified & Created

### Created
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Header.tsx`
- `src/components/ui/PageContainer.tsx`
- `src/components/ui/Section.tsx`
- `DESIGN_INTEGRATION.md` (this file)

### Modified
- `src/app/globals.css` — Blue City color palette
- `src/app/page.tsx` — Homepage
- `src/app/check/page.tsx` — Evidence Intake
- `src/app/check/[id]/page.tsx` — Scam DNA Result
- `src/app/layout.tsx` — Use new Header component (optional)

### Not Changed
- `PHASE1.md` — Remains focused on technical deliverables
- All API routes and business logic
- Database schema and functionality

---

## Success Criteria

✅ All existing functionality preserved (no broken links, forms, API calls)
✅ Pages visually match Blue City Stitch mockups (light theme)
✅ Reusable component library built and documented
✅ No console errors or TypeScript issues
✅ Responsive design works on 360px–1280px+ widths
✅ Build succeeds: `npm run build`

---

*Document created as part of Phase 1 design polish. Start date: 2026-08-24.*

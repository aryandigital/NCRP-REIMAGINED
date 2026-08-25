# Research Brief: Government Crisis-Service UI/UX

**Purpose:** inform a reimagined India National Cyber Crime Reporting Portal (cybercrime.gov.in) — a crisis service for victims of financial fraud, sextortion, intimate image abuse, account hijacking and identity theft.
**Date:** August 2026. All specifics verified against live sources; URLs given throughout.

---

## PART 1 — GOV.UK / GDS

Sources: <https://design-system.service.gov.uk>, <https://www.gov.uk/service-manual>, `alphagov/govuk-frontend` v5.11.2 source.

### 1.1 "One thing per page"

**The rule.** Question pages must contain a back link, a page heading, and a Continue button. Start with exactly one question per page. Group questions onto one page only when user research proves it helps.

Source: <https://design-system.service.gov.uk/patterns/question-pages/>

**Why it works — the actual evidence chain:**

- Caroline Jarrett (Effortmark) originated the pattern in 2015; Tim Paul (GDS) published it in the Service Manual. Her three rules of form structure: (1) know why you're asking every question, (2) design for the most common scenarios first, (3) start with one thing per page. Source: <http://www.effortmark.co.uk/no-accordions-choose-form-structure/>
- **Working memory capacity is ~4 chunks, not 7±2.** Nelson Cowan's revision of Miller. A 15-field page forces the brain to (a) process the current field, (b) remember prior answers, (c) estimate remaining work, (d) identify which fields are required — four cognitive tasks consumed before a single character is typed.
- **Sweller's Cognitive Load Theory** splits load into *intrinsic* (the task), *germane* (learning), and *extraneous* (poor design). Visible-but-irrelevant fields are pure extraneous load.
- **Anxiety directly reduces working-memory capacity** (see Part 4). This compounds: a panicked fraud victim has less than four slots.
- W3C Cognitive Accessibility Guidance, quoted by VA.gov: *"Keeping content down to a small number of important points reduces the clutter, calms the user, and allows for better understanding while aiding memory."*
- **The GOV.UK Verify anecdote** (worth citing to stakeholders): the team split "create a username" and "create a password" onto separate pages expecting complaints. Users didn't notice. They later recombined them — but only because splitting revealed that low-confidence users didn't understand the *concepts* of username and password, which had to be explained together. The split produced the insight.

**"One thing" ≠ "one input."** A date of birth is three inputs but one thing. An address is many inputs but one thing.

**Implementation detail that matters:** set the `<label>` or `<legend>` *as* the page `<h1>`. Screen-reader users then hear the question once, not twice.

```html
<legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
  <h1 class="govuk-fieldset__heading">What is your date of birth?</h1>
</legend>
<div id="dob-hint" class="govuk-hint">For example, 31 3 1980</div>
```

**Section captions** for higher-level context: `<span class="govuk-caption-l">About you</span>` above the `<h1>`.

**Hint text rules:** one short sentence, **no full stop**, **no links inside hint text** (screen readers announce the text but usually not that it's a link).

**Complex questions:** if a question needs a long explanation, do *not* stuff it into hint text. Use a statement `<h1>` (e.g. "Interview needs"), then paragraphs/lists, then a `--m`-sized legend asking the actual question ("Do you have any interview needs?").

**Continue button:** labelled "Continue", **not** "Next". Left-aligned so users don't miss it.

**Progress indicators — the counterintuitive finding.** Start *without* one. If needed, use only a simple text caption: `<span class="govuk-caption-l">Question 3 of 9</span>`. **Do not** use the classic stepper that simultaneously shows all steps, allows navigation back, and highlights current position, because they:
- are often not noticed
- take up lots of space
- do not scale on small screens
- distract and confuse some users
- make it hard to write good step labels
- make it hard to handle conditional sections

The Carer's Allowance team **removed a 12-step progress indicator with no effect on completion rates or times.**

**Also banned:** range sliders (WCAG 2.5.1 Pointer Gestures) unless a non-drag alternative exists.

**Ask once:** never ask for the same information twice in a journey. Pre-populate or offer carried-forward answers.

**Back link:** always present, because *some users do not trust the browser back button when entering data*. But never break the real back button — it must return to the previous page in the state last seen. Exception: after a one-time action (payment, submission), show a sensible message instead of allowing repeat.

### 1.2 "Check your answers" pattern

Source: <https://design-system.service.gov.uk/patterns/check-answers/>

**Exact page heading copy:** `Check your answers before sending your application`

**Structure:**
- `<h1 class="govuk-heading-l">` = the check-answers instruction
- `<h2 class="govuk-heading-m">` per section (e.g. "Personal details", "Application details")
- `<dl class="govuk-summary-list govuk-!-margin-bottom-9">` per section — a definition list of key / value / action rows
- Final `<h2>`: `Now send your application`
- Declaration paragraph: *"By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct."*
- Submit button labelled with the actual action: `Accept and send` (or "Send your claim form", "Change your tax details") — **never** a bare "Submit"

**Change links carry visually hidden context:**
```html
<a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> date of birth</span></a>
```

**Unanswered optional questions display as the literal string `Not provided`** — this is important; it tells the user they skipped something without implying error.

**Layout:** two-thirds column (`govuk-grid-column-two-thirds-from-desktop`) for short answers, so line length stays readable *and* the Change links sit near the content (screen-magnifier users otherwise miss far-right actions). Full width only if answers are long.

**Why it works:** (a) increases confidence — users see all sections complete and their data captured; (b) reduces error rates — a second chance to catch mistakes before submission.

**Return behaviour:** after a Change, the answer page must be pre-populated and look exactly as the user last saw it; Continue must return them straight to Check Answers, not through the rest of the journey. If a changed answer opens new branching questions, ask those first, then return.

**For very large multi-section services:** consider a check-answers page at the end of *each* section, especially where different people complete different sections. Use the **Summary card** component when reviewing multiple items of the same type.

### 1.3 Task list pattern

Source: <https://design-system.service.gov.uk/components/task-list/>

**Statuses are plain sentence-case text, not badges:** `Completed`, `Incomplete`, `Cannot start yet`.

**Design decisions driven by research findings:**
- **The whole row is a link.** Users were trying to click the *status* thinking it was a button. Statuses were redesigned to look less like buttons and the entire row became the click/tap target.
- **Sentence case, not uppercase.** Uppercase statuses were harder to read, and once several tasks were done, users struggled to scan for what remained.
- **"Completed" is plain black text with no background colour.** This deliberately makes completed items visually *quieter* so attention is drawn to tasks that still need action.
- Row hover uses `govuk-colour("light-grey")` = `#F3F2F1` to signal the whole row is clickable.
- Rows separated by `1px solid $govuk-border-colour` (`#B1B4B6`).

**When to use:** long, complex services where users need control over order.
**When NOT to use:** if you can simplify the service instead; if the service must be done in a strict order (use save-and-return instead); never as a way of showing users their answers (use Summary list).

**Naming:** sentence case, short, e.g. "Your contact details", "Upload evidence". If you can't name a task concisely, the task is too complex and should be split.

**Hint text:** only with evidence of need; one short sentence, no full stop, **no links** (the whole row is already a link, so nested links break).

**Grouping:** multiple task lists on one page with short `<h2>` headings when there are many tasks.

**Ordering:** users should be able to do tasks in any order; they can only move on when all show "Completed".

### 1.4 Error summary + error message

Sources: <https://design-system.service.gov.uk/components/error-summary/>, <https://design-system.service.gov.uk/components/error-message/>

**Error summary — exact markup and copy:**

```html
<div class="govuk-error-summary" data-module="govuk-error-summary">
  <div role="alert">
    <h2 class="govuk-error-summary__title">There is a problem</h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        <li><a href="#full-name-input">Enter your full name</a></li>
      </ul>
    </div>
  </div>
</div>
```

- Heading is **always** `There is a problem`. It "has tested well with users." Optional description text was rejected because it adds no value — the heading says what's wrong at a level, the individual errors say what to fix.
- The summary is wrapped in `role="alert"` and **receives focus on page load** (`disableAutoFocus` to opt out).
- Position: top of `<main>`, **below** breadcrumbs/back link, **above** the `<h1>`.
- Each list item links to the offending field's `id`. For multi-field answers (day/month/year), link to the **first field that has an error**; if unknown, the first field.
- For radios/checkboxes, link to the **first** radio/checkbox.
- The `<title>` element should change to include the word "error" (Home Office guidance).

**Inline error message — exact markup:**

```html
<p id="full-name-input-error" class="govuk-error-message">
  <span class="govuk-visually-hidden">Error:</span> Enter your full name
</p>
```
Placed between the label/legend and the input. `aria-describedby` on the input points at it. Form group gets `govuk-form-group--error` (adds a 5px red left border, `$govuk-border-width-form-group-error: 5px`). Input gets `govuk-input--error` (red 2px border).

**Wording rules — the words GOV.UK forbids:**

| Never use | Why |
|---|---|
| "please" | implies a choice |
| "sorry" | doesn't help fix the problem |
| "valid" / "invalid" | adds nothing to the message |
| "forbidden", "illegal", "prohibited", "you forgot" | blames the user |
| "oops" and other humorous/informal language | trivialises |
| "form post error", "unspecified error", "error 0x0000000643" | technical jargon |

**Generic messages that are explicitly banned:** *"An error occurred"*, *"Answer the question"*, *"Select an option"*, *"Fill in the field"*, *"This field is required"*.

**Do write a distinct message per failure mode.** Text fields can be: empty / too long / too short / disallowed characters / wrong format — each needs its own message.

**Real examples to model:**
- `Enter your full name`
- `Passport issue date must include a year`
- `Select if you are British, Irish or a citizen of a different country`
- `The date your passport was issued must be in the past`
- `Enter a postcode, like AA1 1AA`

**Pattern:** imperative verb ("Enter…", "Select…", "Choose…") for empty fields; noun phrase + "must" ("Passport issue date must include a year") for format/logic failures.

**Do not repeat the example if it's already on screen** as hint text.

**When to validate:** on submit, server-side. Do **not** validate on blur/field-exit. Do not dynamically remove errors on input — that implies verification you haven't done and creates client/server divergence. Error summaries persist until resubmission.

### 1.5 Typography, spacing, colour, focus — exact values

**Font:** `$govuk-font-family: "GDS Transport", arial, sans-serif`. Print: `sans-serif` (system fonts, to avoid printer-driver issues). Weights: regular **400**, bold **700**. There is no light, no medium, no italic in the system.

**Type scale** (`$govuk-typography-scale`, mobile → tablet+; line-heights given in px then converted to unitless):

| Token | Mobile | Tablet+ | Print |
|---|---|---|---|
| 80 | 53px / 55px | 80px / 80px | 53pt / 1.1 |
| 48 | 32px / 35px | 48px / 50px | 32pt / 1.15 |
| 36 | 27px / 30px | 36px / 40px | 24pt / 1.05 |
| 27 | 21px / 25px | 27px / 30px | 18pt / 1.15 |
| 24 | 21px / 25px | 24px / 30px | 18pt / 1.15 |
| 19 | 19px / 25px | *(same)* | 14pt / 1.15 |
| 16 | 16px / 20px | *(same)* | 14pt / 1.2 |

Root font size assumed **16px** — GDS explicitly says *do not* set font-size on `html`/`:root`, so browser text-size preferences work.

**Note:** body copy is **19px/25px** (≈1.316 line-height) — noticeably larger than the 16px web default. Headings map: `govuk-heading-l` = 36, `-m` = 24, `-s` = 19, `-xl` = 48.

**Measure / line length:** controlled structurally, not with `max-width` on text. Page container `$govuk-page-width: 960px`; body content sits in `govuk-grid-column-two-thirds` (≈640px minus gutters). Gutter `$govuk-gutter: 30px`. The Check Answers guidance states the two-thirds layout exists specifically to stop lines "getting so long that the page becomes difficult to read."

**Spacing scale** (`$govuk-spacing-points`) — a 5px base, non-linear:
`0: 0, 1: 5px, 2: 10px, 3: 15px, 4: 20px, 5: 25px, 6: 30px, 7: 40px, 8: 50px, 9: 60px`

**Responsive spacing** (`$govuk-spacing-responsive-scale`) — points 4–9 shrink on mobile:

| Point | Mobile | Tablet+ |
|---|---|---|
| 4 | 15px | 20px |
| 5 | 15px | 25px |
| 6 | 20px | 30px |
| 7 | 25px | 40px |
| 8 | 30px | 50px |
| 9 | 40px | 60px |

**Border widths:** standard `5px`; wide `10px`; narrow `4px`; form element `2px`; form-group-error `5px`; **focus `3px`**; form-control hover `10px`.

**Colour palette** (`$govuk-colours`, exact hex):

```
red            #D4351C     light-purple    #6F72AF
yellow         #FFDD00     bright-purple   #912B88
green          #00703C     pink            #D53880
blue           #1D70B8     light-pink      #F499BE
dark-blue      #003078     orange          #F47738
light-blue     #5694CA     brown           #B58840
purple         #4C2C92     light-green     #85994B
black          #0B0C0C     turquoise       #28A197
dark-grey      #505A5F
mid-grey       #B1B4B6
light-grey     #F3F2F1
white          #FFFFFF
```

**Semantic assignments:**

| Role | Value |
|---|---|
| Brand | `#1D70B8` (blue) |
| Text | `#0B0C0C` (near-black, *not* pure black — softer on white) |
| Print text | `#000000` (true black, so printers don't use colour ink) |
| Secondary / hint text | `#505A5F` (dark-grey) |
| Body background | `#FFFFFF` |
| Template background | `#F3F2F1` (light-grey) — footer "illusion of a long footer" |
| Error | `#D4351C` |
| Success | `#00703C` |
| Border / keylines | `#B1B4B6` |
| Input border | `#0B0C0C` |
| Form hover | `#B1B4B6` |
| Link | `#1D70B8` |
| Link visited | `#4C2C92` |
| Link hover | `#003078` |
| Link active | `#0B0C0C` |
| **Focus** | `#FFDD00` |
| **Focused text** | `#0B0C0C` |

*(2025 brand refresh adds `$_govuk-rebrand-template-background-colour: govuk-tint(#1D70B8, 95%)` — a very pale blue page background — replacing flat light-grey in the refreshed template.)*

**The focus state — exact CSS.** This is the single most copied piece of GOV.UK design. It is *not* an outline; it's a yellow highlight with a black underline drawn by box-shadow:

```scss
@mixin govuk-focused-text {
  outline: 3px solid transparent;      // survives forced-colours / dark mode
  color: #0B0C0C;
  background-color: #FFDD00;
  box-shadow:
    0 -2px #FFDD00,                    // extends yellow 2px above text
    0 4px  #0B0C0C;                    // 4px black bar beneath
  text-decoration: none;               // box-shadow replaces the underline
}

@mixin govuk-focused-box {             // for non-text content in links
  outline: 3px solid transparent;
  box-shadow:
    0 0 0 4px #FFDD00,
    0 0 0 8px #0B0C0C;
}
```

The transparent 3px outline exists so that when a user's OS/browser overrides colours (Windows High Contrast, dark mode), backgrounds and box-shadows vanish but the outline is repainted in a system colour. The 4px black bar guarantees ≥3:1 non-text contrast against white *and* against the yellow — yellow alone against white fails.

**Link underlines** (unusually precise):
- thickness: `max(1px, .0625rem)` — scales up when the user increases text size
- offset from baseline: `0.1578em` (= 3px at the 19px desktop body size)
- hover thickness: `max(3px, .1875rem, .12em)`

### 1.6 Content design rules

Sources: <https://www.gov.uk/guidance/content-design/writing-for-gov-uk>, <https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/>, <https://www.gov.uk/guidance/style-guide>

- **Reading age 9.** Not a guideline — the stated target for all of GOV.UK, "even if you are writing for a specialist audience" (Home Office UCD manual). The rationale: by age 9 a person's primary common-word vocabulary is ~5,000 words and secondary ~10,000; adults still recognise these fastest.
- **Long words cause skipping.** GDS cites eye-tracking evidence: when a reader hits an 8–9 letter word, they are more likely to skip the 3–5 letter words that follow. Long words don't just slow reading — they cause *lost content*.
- **Plain English is mandatory,** not advisory.
- **Substitutions:** buy (not purchase) · help (not assist) · about (not approximately) · like (not such as) · working with (not collaborate).
- **Words to avoid** (indicative, from the A–Z): agenda, advancing, collaborate, combating, countering, deliver (*"pizzas, post and services are delivered — not abstract concepts like 'improvements' or 'priorities'"*), dialogue ("we speak to people"), disincentivise, drive out, facilitate, foster, going forward, key, land, leverage, liaise, robust, streamline, strengthening, tackling, transforming, utilise, going forward.
- Nominalisations ending **–ion** and **–ment** make sentences longer; rewrite as verbs.
- **Contractions:** use positive ones ("you'll", "we'll"). **Avoid negative contractions** — "can't", "don't" — because many users misread them as the opposite. Write "cannot", "do not". Also avoid "should've", "could've", "would've", "they've".
- **Sentence length:** split anything over 25 words. **Paragraphs:** max 5 sentences; ideally 1–2.
- **Sentence case everywhere** — headings, buttons, labels, statuses, navigation. Never Title Case, never ALL CAPS for sentences.
- **Active voice.** "We will email you" not "You will be emailed".
- **"You" = the user. "We" = the organisation.** Address the user directly and consistently.
- **Front-load keywords** — put the words the user is searching for at the start of headings and links.
- **Optional fields are marked "(optional)" in the label.** **Never** mark mandatory fields with asterisks.
- Define any unavoidable legal/technical term in plain English at first use.
- Set `lang` on every page and on any inline foreign-language content.

### 1.7 What GOV.UK deliberately avoids, and why

| Avoided | Reason |
|---|---|
| **Carousels** | Removed from the GOV.UK beta homepage in 2012 after user research; replaced with a plain text list. WebAIM: "most users ignore or avoid carousels." Notre Dame data (Erik Runyon): a single-digit percentage of clicks go to slide 1 and almost none to later slides. |
| **Hero images / decorative photography** | "Services usually work best without relying on images." Only use an image if there's a real user need. |
| **Photography for abstract concepts / stock imagery** | "Do not use photography to represent abstract concepts, such as to convey an impression or emotion to the user. Avoid using generic stock photography in your service." |
| **Images containing text** | Not selectable, not translatable, not zoomable, poor for screen readers. |
| **Decorative animation** | Auto-moving content >5s must be pausable (WCAG 2.2.2); GDS just avoids it. |
| **Classic multi-step progress indicators** | See 1.1 — not noticed, don't scale, confuse. |
| **Range sliders** | WCAG 2.5.1 pointer-gesture failure risk. |
| **Accordions inside forms** | Jarrett: hidden questions get missed. |
| **Client-side-only validation** | Hides root causes, diverges from server behaviour. |
| **Asterisks for required fields** | Meaningless to many users; mark the *optional* ones instead. |
| **Custom-styled selects, date pickers, modals** | Default to native HTML; every abstraction is an accessibility liability. |
| **Font weights other than 400/700** | Light weights fail low-vision users. |
| **Non-text-based skip links / icon-only buttons** | Icons get a text label for significant actions. |

The underlying philosophy: *the service is the content and the form.* Everything else is a tax the user pays.

---

## PART 2 — USWDS and Login.gov

### 2.1 U.S. Web Design System

Sources: <https://designsystem.digital.gov>, <https://designsystem.digital.gov/design-tokens/color/overview/>

**The "magic number" system — USWDS's best original idea.** Every colour token carries a *grade* from 0 (pure white) to 100 (pure black), regularised across all 24 colour families so that grade predicts relative luminance. The **magic number** is the difference in grade between two colours:

| Magic number | Guaranteed contrast |
|---|---|
| **40+** | WCAG 2.0 AA Large Text (3:1) |
| **50+** | WCAG 2.0 AA (4.5:1) / AAA Large |
| **70+** | WCAG 2.0 AAA (7:1) |

Corollary: **any grade-50 colour passes AA against both pure white and pure black.** This means designers can pick accessible pairs arithmetically without running a contrast checker. `gray-90` + `red-40` = magic number 50 = AA. This is materially better than GOV.UK, where accessible pairings are hand-curated and undocumented as a rule.

Token layers: **System tokens** (complete palette, 24 families) → **Theme tokens** (project subset) → **State tokens**.

**Typography — Public Sans.** Open-source, derived from Libre Franklin, maintained by USWDS. Deliberate properties: metrics close to common system fonts (smooth progressive enhancement / no FOUT layout shift), large x-height for small-size legibility, **tabular numerals** (numbers align in tables — directly relevant for transaction-amount tables), heavier weights have *tighter* letterspacing than lighter weights so running text is spaced generously and headings are compact.

**Optical size normalisation — the second good idea.** USWDS uses a nine-step theme typescale drawn from a 21-step system scale, where the *rem value at each step varies by typeface* so that every supported face looks the same size at the same step. Source Sans Pro gets a larger rem at each step; Merriweather a smaller one. Target is calibrated to San Francisco and Roboto. Font family and size are therefore always set together: `font-size('public-sans', 'lg')`.

Since 3.5.0 USWDS **stopped using font smoothing** entirely (including on dark backgrounds and disabled buttons). Since 3.4.0 it ships **`woff2` only**.

**Inclusive Design Patterns library** (2022, GSA) — guidance for specific high-stakes interactions (name, address, phone, date of birth, SSN, gender/sex, "complex" identity fields) built to remove barriers in government transactions. This is the closest thing in any government design system to guidance on *asking sensitive personal questions*, and is directly transferable to a cybercrime form.

### 2.2 Login.gov

Source: <https://www.login.gov/partners/our-services/>, <https://digital.gov/2021/03/02/security-is-everyones-job-delivering-secure-usable-login-for-government/>

- Three service tiers mapped to NIST IAL/AAL: authentication only; basic identity verification; enhanced (IAL2-certified by Kantara).
- **Plain-language wins worth stealing:** they changed "Take a **selfie**" to **"Take a photo of yourself."** They could not assume the public knew "selfie." Directly applicable to Indian portal copy — assume no jargon, including "OTP", "KYC", "UTR", "acknowledgement number".
- Made the **entire photo upload box tappable**, not just a small button — tested well on mobile.
- Section 508 compliance; screen reader, keyboard nav, assistive tech.
- Localisation into Spanish, French and Simplified Chinese using **human translators**, "precise and culturally-relevant" — not machine translation. Critical precedent for an India portal that must work in 22+ scheduled languages.
- **Independent audit finding (2026):** in a 12-portal audit of US unemployment/benefits systems against four "gates" — keyboard-operable end-to-end, screen-reader-readable error recovery, session-timeout extension that actually works, file upload that announces success/failure — **Login.gov was the only surface that passed all four.** Every state portal failed at least two. Source: <https://www.disabilityworld.org/articles/civic-tech-unemployment-benefits-portals/>
- Aug 2026: GSA partnered with the National Design Studio, running an "experimental version" to find friction points in identity verification.

### 2.3 What USWDS does better than GOV.UK

1. **Predictable accessible colour by arithmetic** (magic numbers) rather than a curated palette.
2. **Typeface-independent optical typescale** — you can swap fonts without re-tuning every size. Crucial for a multi-script system (Devanagari, Bengali, Tamil render at different optical sizes than Latin at the same px).
3. **Guidance for sensitive personal-data questions** (Inclusive Design Patterns) — GOV.UK has no equivalent.
4. **Tabular numerals as a system default** — GDS Transport doesn't advertise this.
5. **Richer colour system for data/status** — GOV.UK's 20-colour flat palette has no tints/shades, forcing teams to invent them.

### 2.4 What GOV.UK still does better

Content design rules, the question-page pattern, error wording rules, the "Exit this page" component, and above all the *service manual* — a body of doctrine about how to design a service, not just how to style one. USWDS is a stronger design *system*; GDS is a stronger design *practice*.

---

## PART 3 — Other government design systems worldwide

### 3.1 Singapore — GovTech, SGDS, Singpass, ScamShield

**SGDS v3** (<https://designsystem.tech.gov.sg>). Structure: **primitive tokens** (raw hex) → **semantic tokens** (the *job* a colour does) → components. Semantic groups: background / surface / foreground / border; interaction states (hover, active, selected, disabled, inverse); status (success, danger, warning, neutral); form-specific tokens for fields, labels, helper text, validation.

Every component responds to **day mode, night mode and brand change** through the same semantic layer. Ships a **Theme Customiser** and a **built-in colour contrast checker**.

**Custom brand generator:** enter one hex value for the `-600` token and SGDS generates the full `sgds-product-primary-100` → `900` ramp aligned to the SGDS scale, with contrast ratings computed per step. Default GovTech blue ramp:

```
100 #EFF5FC   200 #CEE1F6   300 #A0C5EE   400 #73A9E5   500 #4288D6
600 #356DAC   700 #285483   800 #1E3E62   900 #152B44
```

Typeface: **Inter**, 1.200 ratio typescale.

Delivery is pragmatic: SGDS ships packages for static sites (Jekyll), WordPress/Sitefinity, and transactional apps — recognising that most government sites are CMS-driven.

**ScamShield** (<https://www.scamshield.gov.sg>) — the model to study most closely.
- Positioning line: *"Your trusted one-stop portal for scam awareness and protection."*
- Three doors on the homepage, in victim language: **"Get help – I've been scammed"**, **"Check if it's a scam"**, and download/call.
- **1799 ScamShield Helpline, 24/7** — a three-digit number a panicking person can remember, promoted equally with the website.
- Cross-channel: app (blocks calls/SMS), website, helpline, plus Singapore Police Force and a media partnership with The Straits Times.
- Copy is *pre-emptive and diagnostic* — "Saw something suspicious? Find out how to check" — treating scam-checking as a normal everyday action rather than an admission of victimhood. This de-stigmatises.

**Singpass** — national digital identity, ~97% of eligible residents. Design lesson: identity is a *shared platform*, so the cybercrime portal shouldn't build its own auth. India's equivalent lever is Aadhaar/DigiLocker/e-KYC.

### 3.2 Estonia — e-Estonia, eesti.ee

<https://www.eesti.ee>, <https://brand.estonia.ee>

- **The "once-only" principle** is the design constant: the state may not ask a citizen for data it already holds. X-Road (the data-exchange layer) makes this enforceable. For a cybercrime portal this means: never ask for bank account details the bank can supply, never ask for identity data the ID system holds.
- eesti.ee is structured around **life situations** with step-by-step instructions ("applying for family benefits", "what to do in certain situations"), not around ministries. The visual system is minimal, and Estonia's brand system (brand.estonia.ee) is a *brand* guide with almost no code — the design work happens in individual services.
- **Bürokratt** (<https://www.kratid.ee/en/burokratt>) — a national network of interoperable AI assistants embedded across public-sector sites. €53m RRF funding. By end-2025 an LLM/RAG deployment plus a "global classifier" so different agencies' agents can hand off securely; from 2026, each institution runs a personalised agent within a cooperative network. The stated vision: *"solve problems and consume digital services directly from the chat window, without navigating complex portals or filling out forms."*
- **Relevance and caution:** an AI front door is exactly the sort of thing a cybercrime portal will be tempted to build. Note that Chayn (Part 4) shut down its chatbot after distressed users believed they were talking to a human despite signposting. Estonia's approach is defensible because it's a routing layer over structured services, not a counsellor.

### 3.3 Netherlands — NL Design System / Rijkshuisstijl

<https://nldesignsystem.nl>, <https://github.com/nl-design-system>

- **Not a design system — a system of design systems.** Amsterdam, Utrecht, Rijkshuisstijl and dozens of municipalities maintain their own; NLDS is the shared substrate. The **estafettemodel** ("relay model") governs contribution: an organisation builds a component for its own need, then hands the baton on for others to harden.
- **"Hall of Fame" components** — a public tier of components *guaranteed* to meet accessibility requirements and proven in production. Everything else is explicitly provisional. This honesty about maturity is rare and worth copying.
- Ships in **CSS, React, Web Components, and Twig** — because Dutch government runs on wildly heterogeneous stacks.
- **Theme Wizard** for generating an accessible house style from a brand.
- Documentation goes **beyond WCAG**: do's/don'ts, plain-language explanations of each WCAG criterion, and tips that exceed the legal minimum.
- Legal frame: *Besluit digitale toegankelijkheid overheid*, standard **EN 301 549 v3.2.1** (containing WCAG 2.1 AA). WCAG 2.2 is recommended but not yet mandatory. Since 28 June 2025 the **European Accessibility Act** extends comparable duties to private e-commerce and services.
- Aesthetically: restrained, high-contrast, generous whitespace, strong reliance on native HTML controls. Amsterdam's system in particular uses bold red (`#EC0000`) against near-white with almost no decoration.

### 3.4 Canada — Canada.ca

<https://design.canada.ca>, <https://blog.canada.ca>

**The most rigorous evidence practice of any government web programme.** This is Canada's real contribution — not the components.

- **GC Task Success Survey (TSS)**, running continuously since Jan 2019, randomly intercepts visitors and asks (a) what did you come to do, (b) did you succeed. Nearly all federal institutions run it. Since 2022 the *top task list itself* is derived from TSS responses rather than page views — the top 10 tasks account for >50% of all responses.
- **Optimisation projects follow a fixed method:** baseline moderated usability test (measuring *findability rate*, *success rate*, and *time on task* — the latter only if completion ≥75%) → workshops to rewrite/rearrange → prototype in GitHub → guerrilla test → validation test with *new* participants on the *same* tasks.
- **The target is published and absolute: 80% success, or +20 percentage points over baseline.**
- **Published results:**
  - *Tax filing:* findability 62% → 90% (+28pt); success 48% → 76% (+28pt).
  - *Recalls and safety alerts:* findability 51% → 75%; success 52% → 86%.
  - *Citizenship test:* success +17pt to 86%. Per-task: "Language skills" 48% → 82%, "Canadian flag" 48% → 82%, "Study methods" 90% → 100%.
- **The design principles that produced those gains** (verbatim from the research summaries):
  - Make top tasks visible: use keywords users actually search for in link labels and "doormats"
  - Organize for the user, not for the agency's org chart
  - Match user language; reduce ambiguity; include plain-language definitions
  - Group tasks in sequence — step-by-step structure gives context
  - Reduce complexity: chunk long pages into smaller pieces
  - Group links; avoid long undifferentiated link lists
  - **"Provide answers, not information"**
  - **"Mobile is different"** — optimise the task flow, don't just reflow
  - **"Online is not paper"**
  - Eliminate distracting links inside content
  - Use verbs in labels
  - For long documents: add "search within" plus a left-hand chapter nav
- Canada frames this as a shift from an **expertise-based** to an **evidence-based** delivery model: from "reporting focused on volumetrics (we had X visitors)" to "reporting focused on outcomes (X% of visitors successfully reached the final step)."

**For the India brief:** propose the equivalent metric up front. *What percentage of people who arrive at cybercrime.gov.in intending to report a fraud actually submit a complete report?* That number almost certainly does not exist today.

### 3.5 Australia

- The federal **Australian Government Design System (GOLD)** was **decommissioned** (community.digital.gov.au). The `@gov.au/*` npm packages are unmaintained; a community fork lives at `truecms/design-system-components`. Cautionary tale: a national design system without funded stewardship dies.
- **State systems filled the vacuum:** NSW (<https://designsystem.nsw.gov.au>), Queensland (<https://www.designsystem.qld.gov.au>, evolved out of Queensland Health's system, running to June 2026), Victoria Ripple, SA.
- **Queensland publishes its reasoning**, including a page titled *"Carousels"* under "Exploring our decisions" that exists explicitly so teams can push back on executives: *"We as a digital community need to become better at educating our leadership why the carousel pattern does not work and why their organisation needs should not come above user needs."* Recommends static hero images instead.
- **myGov** — the design record (Rachel Bell) notes: restrained palette for legibility and formal tone, **navy blue base for tradition and trust** plus **electric blue as the modern interaction colour**; unread-message indicator solved with a small **blue triangle** rather than coloured rows (coloured rows were "overwhelming against the grey background"); a **multi-coloured bar above the header** purely so myGov is recognisable at a glance.
- **Scamwatch** (<https://www.scamwatch.gov.au>, National Anti-Scam Centre / ACCC). Three top-level doors, all in first person or plain question form:
  - **"Types of scams"** — "Find out more about different types of scams and how scammers reach you."
  - **"Learn how to spot and avoid scams"**
  - **"I've been scammed"** — *"Act straightaway to limit the damage."*
  - Campaign line: **"Stop. Check. Protect."**
  - Explicit **"First Nations resources"** ("Information and resources to help us protect our mob from scams") and **"In your language"** sections. The First Nations page uses commissioned Aboriginal artwork, not stock imagery.
  - Live scam alerts on the homepage with plain-language titles: *"Scammers are sending fake messages that say you bought something you didn't buy and tells you to call a phone number to stop or reverse the payment."*

### 3.6 New Zealand

<https://design-system-alpha.digital.govt.nz>, `@govtnz/ds` on npm. Explicitly **built on the GOV.UK Design System foundation** — "proven design system with full accessibility and testing rigour" — while re-skinning for NZ. All components target WCAG 2.1. Still in alpha. Good precedent for a country that wants GDS's rigour without re-deriving it.

### 3.7 Nordics

**Norway — Designsystemet** (<https://designsystemet.no>). Built by **Digdir** with the Food Safety Authority, Directorate for Education and Training, and Brønnøysund Register Centre; used by 70+ agencies; recognised as a **digital public good** by the DPGA. V1 shipped 2025 after two years.

The framing sentence is the important part: **"More than 1 million people in Norway struggle to use digital services. One reason is that components and interaction patterns behave differently across services."** And the goal statement: *"the goal is not that all services should look exactly the same, but that components should behave the same — for example, in screen readers."* **Behavioural consistency over visual consistency.**

Token system covers colour, typography, spacing, sizes, shapes, theme-based via a **Theme Builder**; supports light/dark/contrast modes. **The colour system guarantees text/background contrast regardless of the brand colours you feed it.** Packages: `@digdir/designsystemet-web`, `-react`, `-css`. Explicitly a toolbox — "you do not need to use everything."

**Denmark — Det Fælles Designsystem** (<https://designsystem.dk>). A joint system for public authorities, sitting inside a joined-up national stack alongside **MitID** (identity) and **Digital Post** (a single legally-binding government inbox). The Digital Post model is directly relevant: a cybercrime complaint's status updates should land in a channel the citizen already checks, not in a portal they must remember to revisit.

### 3.8 Ontario

<https://designsystem.ontario.ca>

- Typography: **Raleway (modified)** for headings, **Open Sans** for body and lead text. Fallback chains are explicit: Raleway modified → Open Sans → Helvetica Neue → sans-serif.
- Body text 16px / line-height **1.6** / weight 400, **max line length 48rem**. Lead text 20px mobile, 22px desktop, line-height 1.6, **max line length 70rem**. H1 desktop with `line length: 70rem`. Publishing an explicit *measure* per style is unusually disciplined.
- Colour, with SCSS variable names:

| Role | Hex | Variable |
|---|---|---|
| Text (body, headings, subheadings) | `#1A1A1A` | `$ontario-colour-black` |
| Page background / text on dark | `#FFFFFF` | `$ontario-colour-white` |
| Link + buttons | `#0066CC` | `$ontario-colour-link` |
| Link hover | `#00478F` | `$ontario-colour-link-hover` |
| Link active | `#002142` | `$ontario-colour-link-active` |
| Link visited | `#7146A4` (approx.) | `$ontario-colour-link-visited` |

- Three palettes with strict rules: **system** (assigned purposes only — text, links, button text, confirmation), **greyscale** (mostly hard-coded into components), **accent** in base/light/dark triples for marketing and infographics only. Light accents pair with black text; dark accents with white text.
- Near-black `#1A1A1A` rather than `#000000` — same reasoning as GOV.UK's `#0B0C0C`.

### 3.9 Others worth a look

- **France — DSFR** (<https://www.systeme-de-design.gouv.fr>): legally mandatory for state sites; very strong accessibility (RGAA) tooling; distinctive Marianne typeface and tricolour accents; React port available.
- **Italy — Designers Italia** (<https://designers.italia.it>): outstanding *kit* culture — ready-made service prototypes and content templates per service archetype.
- **Cyprus — gov.cy UDS** (<https://gov-cy.github.io/govcy-design-system-docs/>): small team, but ships a **no-code prototype kit** and runs **pa11y accessibility tests in CI**, plus `govcy-frontend-tester` (Puppeteer) that enforces design guidelines automatically. Best-in-class automation for a small budget.
- **Ukraine — Diia** (<https://opensource.diia.gov.ua>): open-sourced a whole citizen super-app under wartime conditions; strong mobile-first patterns.
- **NHS Design System** (<https://service-manual.nhs.uk/design-system>): the most relevant health-adjacent system for emotionally loaded content; has patterns for "warning callout" and "care card" that carry urgency without alarm.
- **Scottish Government Design System** (<https://designsystem.gov.scot>): has implemented its own **Exit this page** component.

### 3.10 India

**UX4G** (<https://ux4g.gov.in>, docs at <https://doc.ux4g.gov.in>). "User Experience for Governance", by NeGD + Digital India Corporation under MeitY. **UX4G 2.0 launched September 2025.** Claims: standardised accessible UI components, mobile-first, multilingual and "culturally relevant" patterns, built-in usability/accessibility audit tooling ("UX Health Self-Check"), Figma kits, HTML/CSS/JS downloads. Works alongside **GIGW 3.0** (Guidelines for Indian Government Websites, <https://guidelines.gov.in>). Case studies published for DigiLocker and UMANG.

**DBIM — Digital Brand Identity Manual** (<https://dbimtoolkit.digifootprint.gov.in>). This is the *mandatory* brand layer, and it is specific:

- **Typeface: Noto Sans is mandatory** for all Government of India digital presence, "because it is an inclusive typeface that excels in multilingual support." **For regional languages, Noto Sans for all scripts** — Devanagari, Bengali, Gujarati, Gurmukhi, Kannada, Malayalam, Oriya, Tamil, Telugu, Urdu.
- **Type scale — desktop:** H1 36px · H2 24px · H3/Subtitle 20px · Paragraph 1 16px · Paragraph 2 14px · Small Text 12px.
- **Type scale — mobile:** H1 24px · H2 20px · H3 16px · P1 14px · P2 12px · Small 10px.
- **Line height must be 1.2–1.5× the type size.**
- Body text left-aligned. Tables: text left, numbers right, column headers centred. No all-caps for sentences or paragraphs.
- **Functional palette (exact):**

| Name | Hex | Use |
|---|---|---|
| Inclusive White | `#FFFFFF` | primary page background; text/icons/emblem on dark; cookie banner background |
| Linen | `#EBEAEA` | background to highlight images; quote/callout backgrounds; component outlines |
| Deep Earthy Brown | `#150202` | text on light backgrounds |
| Black | `#000000` | State Emblem on light background |
| Deep Blue | `#1D0A69` | distinct identity for Gov.in root sites |
| Liberty Green | `#198754` | **status: success** |
| Mustard Yellow | `#FFC107` | **status: warning** |
| Coral Red | `#DC3545` | **status: error** |
| Blue | `#0D6EFD` | **status: information**; hyperlink colour |
| Grey 01 | `#C6C6C6` | functional grey 1 |
| Grey 02 | `#8E8E8E` | functional grey 2 |
| Grey 03 | `#606060` | functional grey 3 |

- Each organisation picks **exactly one colour group** from the primary palette; gradients allowed only between two variants of that group.
- CTA rules: consistent sizes and uniform padding; **max 3 words**; words that translate cleanly into Indian languages; distinct enabled/hover/focus/disabled states; hover must produce a noticeable change on clickable items.
- Icons: one style only per platform (line *or* filled); PNG/WEBP/SVG only; key colour or inclusive white; tooltip on hover; **icon + text label for significant actions**; use sparingly.
- Accessibility mapped to WCAG 2.1 §1.4.3 and GIGW 3.0 §5.2.14. Banner text must be **overlaid HTML text, never baked into the image**.

**Reported accessibility gaps in flagship services:** screen-reader incompatibility and inaccessible CAPTCHAs in **DigiLocker**; UMANG has a large service surface but inconsistent per-service quality. **RBI Sachet** (<https://sachet.rbi.org.in>) is the registry for unregulated-entity complaints and is a separate, differently-designed front door — one of many.

---

### 3.11 The actual state of cybercrime.gov.in — concrete findings

Sources: the live homepage HTML (fetched Aug 2026), plus documented user reports.

**Front-end defects visible in the shipped HTML:**

1. **`<marquee>` is in production.** The "What's new" panel uses `<marquee width="100%" direction="up" scrolldelay="100" scrollamount="3" onmouseover="this.stop();">`. `<marquee>` is a deprecated, non-standard element. It auto-scrolls, cannot be paused by keyboard, and is a direct **WCAG 2.2.2 (Pause, Stop, Hide)** failure.
2. **A blinking "NEW" badge.** `.blink-soft { animation: blinker 1s step-end infinite; }` applied to `<span class="blink-soft">NEW</span>`. Infinite blinking is a **WCAG 2.2.2** failure and a seizure/vestibular risk.
3. **Pinch-zoom is disabled.** `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` — a **WCAG 1.4.4 (Resize Text)** failure. Low-vision users on mobile cannot zoom. There are also **two conflicting viewport meta tags** in the same `<head>`.
4. **A carousel on the homepage** (`images/fraction-slider/…` with separate desktop and mobile images: `pmhm.png`, `pmhm_mobile.png`, `banermbl.jpg`, `1930.png`). Slide content is delivered as **images containing text** — untranslatable, unzoomable, unsearchable, invisible to screen readers.
5. **Multiple `<h1>` elements on one page** — the logo is an `<h1 class="logo">` and there are at least two more `<h1>` blocks with inline `style="font-size: 30px; font-weight: 700;"`. Heading structure is meaningless to assistive tech.
6. **`<h2 style="display: none;">Megamenu</h2>`** — a hidden heading used as a hack.
7. **ASP.NET WebForms postback navigation.** Primary navigation items are `javascript:__doPostBack('LinkButton1','')` — for example the **"FINANCIAL FRAUD"** link and **"Track your Complaint"**. Consequences: no real URLs, so you cannot bookmark, share, or deep-link the report flow; the back button breaks; links can't be opened in a new tab; search engines can't index the reporting entry points; and it fails for anyone with JS disabled or a flaky connection.
8. **Inconsistent typographic case.** Navigation mixes "Women/Children Related Crime" (title case), "FINANCIAL FRAUD" (all caps), "Track your Complaint" (mixed). Menu items use ad-hoc inline `font-weight: bold` and `font-size: 14px`.
9. **Font is Open Sans forced with `!important`** — inconsistent with the mandated Noto Sans, and `!important` blocks user stylesheets.
10. **Homepage information architecture is agency-shaped, not victim-shaped.** Above the fold: PM's photo banner, "What's new" marquee of PDF notices (CPGRAMS public notices, RTI notices), "Citizen Manual", "Cyber Safety Tips", "Cyber Awareness", "Daily Digest". A person who has just lost ₹4 lakh has to parse a government newsletter to find the report button.

**Documented functional failures (user reports, 2025–26):**

- **Disabled OTP and CAPTCHA input fields.** A tester in Oct 2025 documented that after selecting state and entering email and mobile, the OTP and Captcha fields were completely non-interactive — impossible to click or type into — yet pressing Submit returned **"Invalid Captcha"**. Source: LinkedIn post, Abhishek Verma, 12 Oct 2025.
- **A validation rule that makes real fraud unreportable.** The portal rejects a transaction amount whose digits match the first 5 digits of the suspect's account number, with the error **"First 5 digits of account id and Amount cannot be the same!!"** A user defrauded of ₹7,00,000 could not enter ₹7,00,000 and was advised by a community forum to file ₹6,99,999 and explain the discrepancy in free text. This is a validation rule that corrupts the crime data the portal exists to collect. Source: <https://citizen.complainthub.org/t/first-5-digits-of-account-id-and-amount-cannot-be-the-same/17738>
- **Session timeouts with no autosave**, forcing users to restart multi-step complaints; **OTP re-verification of phone and email on every reload**; site unresponsiveness during filing; delayed/failed OTP delivery. Summarised in a widely-shared product critique: *"I couldn't even file the complaint. And during this time, fraudsters are still at work… Reporting fraud shouldn't feel harder than committing it."* Source: LinkedIn, Deep Dave, 2025.
- Reported 404s on `Webform/Crime_AuthoLogin.aspx` (the login entry point).

**What is genuinely good and must be preserved:**
- **1930** — the national cyber-fraud helpline, a memorable 4-digit number, prominently branded. The **golden-hour** premise behind it (report within ~1 hour to freeze funds) is the single most important thing the service does.
- Separation of **Women/Children Related Crime** reporting (which permits anonymous reporting) from **Financial Fraud**.
- A citizen manual exists.

---

## PART 4 — Crisis and trauma-informed digital design

### 4.1 What happens to cognition under acute stress

| Finding | Detail | Source |
|---|---|---|
| Working memory impairment is **bi-modal in time** | Negative effects on WM peak twice: within **0–9 min** post-stressor (noradrenaline-driven, ~50% of measurements negative) and again **25–50 min** post-stressor (cortisol-driven, ~50% negative). Between 10–24 min the effect is less than half as prevalent. | Systematic review, *Psychoneuroendocrinology* — <https://www.sciencedirect.com/science/article/abs/pii/S0306453022003390> |
| Acute stress **impairs working memory and cognitive flexibility** | Meta-analysis of acute-stress effects on core executive functions; effects on inhibition are nuanced. Stress produces "more reactive processing of salient stimuli but greater control over actions" — i.e. **bottom-up capture, top-down failure**. | Shields et al., meta-analysis |
| Comprehension of continuous material drops | Participants given the Trier Social Stress Test before a 20-minute lecture showed **greater mind-wandering at the first checkpoint and significantly lower comprehension scores**. State anxiety post-stress correlated negatively with comprehension. | *PLOS ONE* — <https://doi.org/10.1371/journal.pone.0297711> |
| Anxiety directly reduces WM capacity | Emotions interfere with information processing; anxiety is known to reduce working-memory capacity, making conscious problem-solving harder. | Cognitive Load Theory literature |
| Baseline WM is ~4 chunks | Cowan's revision of Miller's 7±2. | Cowan, University of Missouri |

**Design implications, stated concretely:**

- The person filing a fraud report is likely **inside the 0–9 minute window** of an acute stress response, and if they take 25–50 minutes on the form they enter the second impairment window. **The form must be completable in under 10 minutes or must be savable.**
- With <4 working-memory slots, **one thing per page stops being a nicety and becomes the only viable structure.**
- **Bottom-up capture means anything that moves or blinks will steal attention.** A marquee and a blinking badge on the homepage of a crisis service is actively harmful, not merely ugly.
- **Reading comprehension is measurably degraded.** Long explanatory paragraphs before the action will not be read. Put the action first, the explanation after.
- **Never require recall.** Show previously entered values; never say "as entered above".
- **Assume every error will be read as a rejection.** A person who has just been defrauded and is told "Invalid Captcha" experiences a second failure.

### 4.2 Trauma-informed principles

**SAMHSA's six principles** (*SAMHSA's Concept of Trauma and Guidance for a Trauma-Informed Approach*, 2014, SMA14-4884 — <https://library.samhsa.gov/sites/default/files/sma14-4884.pdf>), with digital translation:

| Principle | Digital translation for a cybercrime portal |
|---|---|
| **1. Safety** | Quick exit; no auto-saved data on shared devices; no notification emails with revealing subject lines; predictable, consistent layout so nothing surprises; warn before anything irreversible. |
| **2. Trustworthiness and transparency** | Say exactly what happens to the report, who sees it, how long it takes, and what will *not* happen. Never over-promise investigation. Show a real status, not "under process". |
| **3. Peer support** | Signpost survivor communities and helplines, not just police. "You are not alone" framing; volume statistics that normalise ("X lakh people reported this last year"). |
| **4. Collaboration and mutuality** | Reduce the power gradient: the user is a *reporter*, not a *supplicant*. Offer choices rather than demands. Let them add to the report later. |
| **5. Empowerment, voice and choice** | **Save and exit.** Optional fields genuinely optional. Let the user choose what to upload and when. Let them describe the incident in their own words *and* in their own language. |
| **6. Cultural, historical, and gender issues** | Anonymous reporting for sexual/image-based crimes. Multilingual by default, human-translated. Gender-aware routing. Awareness that "go to the police station" is not a neutral instruction for everyone. |

SAMHSA also frames the **Four R's**: **Realise** the widespread impact of trauma; **Recognise** its signs; **Respond** by integrating knowledge into practice; **Resist re-traumatisation.**

**Chayn's eight principles** (<https://chayn.co>, *Orbits* field guide — a global field guide to intersectional, survivor-centred responses to technology-facilitated gender-based violence):

**Safety · Equity · Plurality · Agency · Accountability · Privacy · Power-sharing · Hope**

Concrete applications Chayn documents:
- *Safety:* "We must make brave and bold choices that prioritise the physical and emotional safety of users… safety by design should always be the starting point." Do **not** save information on the user's device (they may be on a shared device). Let users replace text inside a session in case someone finds it. The opening message must be "empathetic and warm, thanking survivors for trusting the service"; a non-judgemental, supportive tone from the first contact.
- *Plurality:* "There is no single-issue human." Don't infer language from location — the user may be from a minority or migrant group. Allow multiple language and location choices.
- *Agency:* present information in **non-overwhelming** ways so users move at their own pace; outline the steps to the user before starting.
- **The chatbot lesson:** Chayn ran *Little Window*, a signposting chatbot (mascot: a cat, explicitly non-human), for three years and **shut it down in 2020** after reviewing chat logs showed distressed users believed they were talking to a human despite signposting. Their current tool, **Survivor AI** (2025, for NCII takedown requests), is deliberately **non-conversational**, states which steps involve an LLM, uses calming colours, and does not optimise for engagement. *Trauma-informed design reframes success metrics: "reducing emotional dependence, limiting anthropomorphic cues, and maintaining epistemic humility may be ethically preferable to maximizing engagement or perceived warmth."*
- *Research ethics:* participants get topics in advance and explicit choice over what is discussed; consent forms are written acknowledging that "people who have been traumatised and/or exploited may well have had a bad time filling in forms. They're often long, scary things that users can easily 'get wrong'."

**Trauma-informed heuristics.** The *Journal of Usability Studies* paper "Trauma-Informed Design: Leveraging Usability Heuristics on a Social Services Website" (<https://uxpajournal.org/trauma-informed-design-leveraging-usability-heuristics-on-a-social-services-website/>) makes an argument worth using with sceptical stakeholders: **there is substantial overlap between Nielsen's usability heuristics and SAMHSA's TI principles**, so teams can operationalise trauma-informed design using vocabulary they already have. Consistency and standards → Safety. Visibility of system status → Trustworthiness. User control and freedom → Empowerment.

**US GSA 10x** (<https://10x.gsa.gov/news/trauma-informed-design/>) contributes one very concrete finding: at the Department of Veterans Affairs, **reporters of sexual assault may take months to complete an online form.** That is why "save and exit" is a trauma-informed feature, not a convenience feature. 10x also explicitly cites the UK "Exit this page" component as the international best practice the US is following.

### 4.3 Quick-exit / safety-exit buttons — how the best one works

The GOV.UK **Exit this page** component (<https://design-system.service.gov.uk/components/exit-this-page/>) and the **Exit a page quickly** pattern (<https://design-system.service.gov.uk/patterns/exit-a-page-quickly/>) are the most researched implementation in existence. Built with the Ministry of Justice, DWP and Scottish Government, based on research with people with lived experience of domestic abuse and with people with accessibility needs. (Backstory: <https://mojdigital.blog.gov.uk/2023/11/01/trauma-informed-design-how-we-worked-together-to-develop-exit-this-page/>)

**Exact markup:**

```html
<div class="govuk-exit-this-page" data-module="govuk-exit-this-page">
  <a href="https://www.bbc.co.uk/weather"
     role="button" draggable="false"
     class="govuk-button govuk-button--warning govuk-exit-this-page__button govuk-js-exit-this-page-button"
     data-module="govuk-button"
     rel="nofollow noreferrer">
    <span class="govuk-visually-hidden">Emergency</span> Exit this page
  </a>
</div>
```

**Every detail is a decision:**

| Detail | Reason |
|---|---|
| Label is **"Exit this page"** | Naming went "Exit Site" → "Hide this page" → "Exit this page". "Hide" is wrong — the page isn't hidden, it's replaced. "Quick" is wrong — it isn't faster, it's *safer*. |
| **"Emergency"** is visually hidden inside the label | Screen-reader users get "Emergency Exit this page" so the purpose is unambiguous out of visual context, while sighted users see clean text. |
| Default destination **BBC Weather** | A plausible, boring, non-suspicious site. Not Google (a blank search box is itself a tell). Configurable. |
| `rel="nofollow noreferrer"` | Stops the destination learning where the user came from. |
| `draggable="false"` | Prevents accidental drag-instead-of-click. |
| `role="button"` on an `<a>` | Announced as a button but retains real-link behaviour if JS fails. |
| Styled as `govuk-button--warning` | Red (`#D4351C`) — the only red button in the system. |
| **`position: sticky; top: 0; z-index: 1000`**, full-width on mobile; **`float: right`, auto width from tablet up** | Always reachable at the top of the viewport; unobtrusive on desktop. |
| Hidden in `@media print` | Doesn't appear in printed evidence. |
| **A secondary skip link** at the very top of `<body>`, immediately after the standard skip link | Gives assistive-tech users a discreet second route: `<a href="https://www.bbc.co.uk/weather" class="govuk-skip-link govuk-js-exit-this-page-skiplink" rel="nofollow noreferrer">Exit this page</a>` |
| **Keyboard shortcut: press `Shift` three times within 5 seconds** | See below. |
| **Three "traffic light" progress dots** below the button fill as Shift is pressed; reset after 5s | `0.75em` circles, `2px` border, `border-radius: 50%`, `border-color: currentcolor`; the "on" state sets `border-width` to half the size so the circle fills. |
| **Full-screen white loading overlay** appears *immediately* on activation (`position: fixed; z-index: 9999; inset: 0; background: #FFFFFF`) | Clears content off screen before the next site loads. |
| `.govuk-exit-this-page-hide-content * { display: none !important }` added to `<body>` | Belt and braces — ensures the user can't interact with, and nobody can see, the underlying page during the navigation. |
| Screen-reader announcements | "Shift, press 2 more times to exit." → "Shift, press 1 more time to exit." → "Loading." Timeout: "Exit this page expired." |

**Why NOT the Escape key** — this is the finding most implementations get wrong (<https://designnotes.blog.gov.uk/2023/08/14/exit-this-page-fast-with-the-design-systems-new-component/>):
1. `Esc` is heavily used by screen-reader software; a single press would cause accidental activation.
2. **The HTML specification states the Escape key cannot trigger "transient activation"** — the browser state that gates certain APIs behind meaningful user interaction. So `Esc` alone *cannot reliably navigate the page away*. This is a hard technical blocker, not a preference.

`Shift`×3 was chosen because it's present on every keyboard layout, easy for users with motor difficulties, and does nothing on its own. GDS additionally **cancels the sequence if Shift is pressed with another key, or if any other key is pressed between the three presses.**

**The two supporting pages the pattern requires:**

1. **Interruption page** — shown *after* the service start page but *before* the first page carrying the button. Must tell the user: what the button is for; what happens when they press it; that they can also press Shift 3 times or use the secondary link; **that their browsing history will NOT be erased, which can still put them at risk**; and whether entered data will be saved. Long services may need more than one.

2. **Safety content page.** GDS publishes model copy, worth reusing near-verbatim:

> ## Ways to stay safe online
> It can be easy for someone to see what you're doing online, especially if you're using a home computer.
>
> You can make it more difficult for them by taking some precautions.
>
> If you think your devices or internet search activities are being monitored, try to use a device that is not being monitored. That should be a device that the person does not or has not had physical or remote access to. This is the safest thing to do if you do not want someone to know that you're visiting certain websites.
>
> ### Cover your tracks online
> Every time you use the internet, your browser stores a record of where you've been online with:
> - a list of the pages you've looked at and the files you've downloaded
> - small files called cookies which remember your settings for different sites
>
> ### Deleting your internet browsing history
> You can improve your safety by deleting your internet browsing history. But you need to be careful because:
> - deleting cookies will also get rid of stored passwords for online accounts
> - **clearing your history could make someone more suspicious**
>
> Try to only remove information about the websites you want to keep private. […]
>
> ### Browsing in private
> You can also look at a website without information like cookies being stored by using the private browsing setting in your browser. […] Incognito on Google Chrome, Private Window on Safari […]

The line *"clearing your history could make someone more suspicious"* is the single best sentence in government trauma-informed content — it acknowledges that the safety advice itself carries risk.

**Honest limitation, stated in the pattern:** *"This pattern is not a complete solution to eliminating all possible risk to the user. Perpetrators can monitor potential victims through other methods, such as malicious software."* Never claim more safety than you deliver.

**Session data:** the service must explicitly decide whether to keep or destroy session data on exit. For sextortion/IIA reporting, default to destroying it and say so.

**Other implementations for comparison:**
- **Refuge** (<https://www.refuge.org.uk>): `<button class="quick-exit" id="get-away" data-link="https://www.google.com/">` with a two-line label — **"Quick exit"** plus supporting text **"Click to leave site immediately"**. The explanatory second line is good; the Google destination is weaker than BBC Weather.
- **Somerset Domestic Abuse** — states the keyboard shortcut *on the button itself*.
- Common anti-patterns to avoid: labelling it "Hide this page" (misleading); labelling it "Quick exit" without explanation (no existing mental model — the trauma-informed design community is explicit that "a quick exit button is not ingrained in a user's mental model"); placing it below the fold; not making it sticky; not clearing the current page before navigating; leaving the exited page in browser history.

### 4.4 Exemplar crisis services — exact copy

**StopNCII.org** (Revenge Porn Helpline / SWGfL) — <https://stopncii.org>

- H1 is a question in the victim's own words: **"What do you do if someone is threatening to share your intimate images?"**
- Immediately followed by: **"You are not alone"**
- Then: *"Are you worried someone might share your intimate images online? Has this already happened to you?"* → **"We are here to help"**
- **Eligibility as a checklist, phrased as questions, before any commitment.** *"If you meet the following criteria, you can use StopNCII.org. Are you:*
  - *The person who is in the image? (Why do we ask this?)*
  - *18 or older at the time the image was taken? (Why do we ask this?)*
  - *Currently over 18 years old?*
  - *Still in possession of the image or video?*
  - *Are you nude, semi-nude, or engaging in a sexual act in the image/video?"*

  Note the inline **"(Why do we ask this?)"** links — every intrusive question justifies itself at the point of asking. This directly implements GDS's "make sure it's clear to users why you're asking each question" and SAMHSA's Transparency principle.
- **A clear off-ramp for the ineligible:** *"If you don't meet all the criteria, you can still get help."* Nobody is dead-ended.
- **Privacy explained mechanically, not legally:** *"To protect your privacy, StopNCII.org does not download the images from your device and collects the minimum amount of data to run the service."* The hashing explanation uses the analogy **"digital fingerprint"**.
- **Efficacy stated numerically to build hope:** *"With an over 90% removal rate, RPH has successfully removed over 300,000 individual non-consensual intimate images from the internet."*
- Primary CTA: **"Create Your Case"** — the user owns a *case*, not a *complaint*.

**Take It Down** (NCMEC, for under-18 imagery) — <https://takeitdown.ncmec.org>

- H1: **"Take It Down. Having nudes online is scary, but there is hope to get it taken down."** — names the emotion *and* supplies hope in one sentence.
- *"This service is one step you can take to help remove online nude, partially nude, or sexually explicit photos and videos taken before you were 18."* — deliberately modest: **"one step you can take"**, not "we will fix this".
- *"You can remain anonymous while using the service and you won't have to send your images or videos to anyone."*
- **Blame removal, explicitly:** *"It's scary when this happens to you, but it can happen to anyone. You've taken the first step, and we're here to help you with the next steps."*
- Written *to* a teenager without condescension: *"For example, maybe you sent a picture to someone, but now they're threatening you or have posted it somewhere. Even if you're unsure whether the image has been shared but want some help to try to remove it from places it may appear online, this service is for you."*
- **Safety warning as a bolded instruction, not a scold:** ***"Please do NOT send, share, or download any image or video in order to submit to Take It Down."***
- **Honest about limits:** *"Online platforms may have limited capabilities to remove content that has already been posted in the past."*
- **Explicit hand-off to the adult service:** *"If there is an explicit image of you from when you were 18 or older, you can get help at stopncii.org."*
- Closes with: **"Most importantly, please remember, you are not alone!"**

**Scamwatch (Australia)** — three doors: "Types of scams" / "Learn how to spot and avoid scams" / **"I've been scammed — Act straightaway to limit the damage."** Campaign line **"Stop. Check. Protect."** Dedicated **First Nations** and **In your language** sections.

**ScamShield (Singapore)** — *"Your trusted one-stop portal for scam awareness and protection."* Doors: **"Get help – I've been scammed"** and **"Check if it's a scam"** (*"Saw something suspicious? Find out how to check on the ScamShield App or call the ScamShield Helpline."*). **1799 helpline, 24/7.**

**Report Fraud (UK)** — <https://reportfraud.police.uk>, launched **4 December 2025**, replacing Action Fraud. Run by City of London Police, covering England, Wales, Northern Ireland; phone 0300 123 2040 unchanged; actionfraud.police.uk redirects.
- **Why the old service died:** the 2022 House of Commons Justice Committee described Action Fraud as *"not fit for purpose"* and a *"black hole"* for victim reports. It was nicknamed **"Inaction Fraud"**. Which? found in 2024 that of 1,012 fraud victims, **63% told their bank but only 19% reported to Action Fraud and 16% to police; 10% told nobody.** Of those who didn't report: **31% didn't know they could**, **28% didn't know how**, and **13% thought their loss too trivial or felt too embarrassed.**
- **The redesign's central IA change:** the old site was "report-first and relatively news-heavy"; the new one is victim-facing, with **"Protect yourself"** and **"Get help and support"** promoted to the homepage. *"The emphasis is now on what has happened rather than who the user is."*
- New capabilities that address the trust deficit directly: an **interactive portal where victims can track report status and add new information**, and **proactive victim notifications telling people when their report has helped others.**

This is the single most instructive precedent for India: **a national fraud-reporting service that was rebuilt because victims didn't trust it, didn't know how to use it, and were embarrassed to.** Those three failure modes (28% didn't know how; 13% embarrassed; near-total absence of feedback) map onto cybercrime.gov.in almost exactly.

**IC3 (FBI)** — <https://www.ic3.gov>, form at <https://complaint.ic3.gov>
- **Explicitly sectioned form:** 1. Who is Filing this Complaint? · 2. Complainant Information · 3. Financial Transaction(s) · 4. Information About The Subject(s) · 5. Description of Incident · 6. Other Information · 7. Privacy & Signature. A task-list-shaped journey.
- **Lowers the qualification bar deliberately:** *"IC3 is the main intake form for a variety of complaints… so file a report even if you are unsure of whether your complaint qualifies."*
- **Free text is invited in the user's own words:** *"Describe what happened in your own words. Provide any information you have yet to include in this complaint that may assist law enforcement in understanding what happened."*
- **Routing page, "I want to report…"**, with four doors — An Emergency / Child Exploitation / A Violent Crime or Terrorism / Cyber-Enabled Frauds, Scams, or Cyber Threats and Intrusion. Wrong-door traffic is redirected before it becomes a wasted report.
- **Manages expectations honestly:** *"Due to the massive number of complaints we receive each year, IC3 cannot respond directly to every submission, but please know we take each report seriously."*
- **A real anti-pattern to fix, not copy:** *"Please save or print a copy of your report before closing this window or navigating away from this page. This is the only time you will be able to retain a copy of your complaint — we will not email or send an electronic version of this file."* One-shot, non-retrievable receipts are hostile to a stressed user.
- Ongoing **spoofing problem** (FBI advisory, 19 Sept 2025): cloned sites at `ic3-gov.com`, `ic3gov.org` copying the FBI seal and IC3 banner, using client-side scripting to exfiltrate form input to an external server before showing a fake error. Guidance: type `www.ic3.gov` directly; **avoid "sponsored" search results**; verify the `.gov` suffix. Directly relevant to India — a cybercrime portal is itself a phishing target, so canonical-domain education and a distinctive, hard-to-clone visual identity are security features.

**Refuge tech abuse** (<https://refugetechsafety.org>) — the reference for advice on stalkerware, shared accounts, location sharing, and device audits. Any account-hijacking or IIA flow should link out to this class of resource rather than reinventing it.

---

## PART 5 — Anti-patterns: what makes users bounce, distrust, or fail

### 5.1 Structural / flow

1. **Session timeouts without warning, extension, or autosave.** WCAG 2.2.1 (Timing Adjustable) requires a warning at least **20 seconds** before expiry and a simple way to extend. DWP guidance goes further: **warn at least 2 minutes before**. In the 12-portal US audit, **11 of 12 enforced 10–20-minute timeouts that assistive-tech users could not extend; three gave no warning at all** — the session simply expired and dumped the user back to login with everything lost. Note the specific trap: "inactivity" is usually measured as *no HTTP request*, so a user carefully filling a long page for 25 minutes is treated as idle. Reference implementation: HMRC frontend timeout component, used in Apply for Pension Credit / Carer's Allowance / Access to Work — <https://design-system.dwp.gov.uk/patterns/manage-a-session-timeout>
2. **No save-and-resume on a long form.** Trauma-informed research (VA, via GSA 10x) found sexual-assault reporters may take *months*. A single-sitting form excludes them.
3. **Re-authentication on every reload / repeated OTP.** Named explicitly as a cybercrime.gov.in failure.
4. **JavaScript-postback navigation with no real URLs.** Breaks bookmarking, sharing, back button, new-tab, deep links, and indexing. Present on cybercrime.gov.in today.
5. **Losing data on validation failure.** Any error that clears the form is fatal to completion.
6. **Dead ends.** A user who fails an eligibility check must be given somewhere to go (StopNCII does this; most government forms don't).
7. **Asking for information the government already holds** — violates Estonia's once-only principle and signals that the report is a bureaucratic exercise.
8. **One-shot, unrecoverable receipts** (IC3's "this is the only time you will be able to retain a copy").
9. **Wrong-door routing left to the user.** Without an "I want to report…" triage, misfiled reports waste the victim's only attempt.

### 5.2 Input / validation

10. **CAPTCHA as a gate on the primary task.** In the US audit, 8 of 12 portals served image-only reCAPTCHA v2 with a broken or 404-ing audio fallback; two gated the *entire* claim behind it, making filing "functionally unfilable by a blind claimant working alone." Government CAPTCHAs are reported to fail **5–10× more often** than private-sector implementations; the IRS's has been documented failing on first attempt ~30% of the time. **DigiLocker's CAPTCHA is reported inaccessible.** Prefer honeypots, Cloudflare Turnstile, Altcha, or rate limiting.
11. **Validation rules that reject true data** — the "First 5 digits of account id and Amount cannot be the same!!" bug is the purest example. Any rule that forces a victim to file a false amount destroys the dataset the service exists to build.
12. **Disabled or non-interactive inputs that still fail validation** — the documented OTP/CAPTCHA defect.
13. **Generic errors** — "An error occurred", "This field is required", "Invalid Captcha".
14. **Inline validation on blur.** Fires while the user is still thinking; GDS forbids it.
15. **Colour-only error indication.**
16. **Unsearchable dropdowns with hundreds of entries** (states, districts, banks, occupations). Documented as endemic in government forms. Use an accessible autocomplete or a text input.
17. **Asterisks for required fields** instead of "(optional)" on the few optional ones.
18. **Rigid input formats** — rejecting spaces in card numbers, dashes in phone numbers, or a particular date format. Normalise server-side.

### 5.3 Presentation / attention

19. **Auto-moving content** — `<marquee>`, auto-advancing carousels, blinking badges. WCAG 2.2.2 failures, and under acute stress they hijack bottom-up attention from the task.
20. **Disabling zoom** (`maximum-scale=1`) — WCAG 1.4.4 failure.
21. **Text baked into images** — untranslatable, unzoomable, unsearchable, invisible to screen readers. Fatal in a multilingual country.
22. **Carousels** generally: content on slides 2+ is effectively unpublished.
23. **Broken heading hierarchy / multiple `<h1>`s / hidden headings used as layout hacks.**
24. **Inline styles overriding the design system**, `!important` on font-family (blocks user stylesheets).
25. **Long, unstructured walls of text before the action.** Comprehension is measurably reduced under stress.
26. **Mixed typographic case in navigation** ("FINANCIAL FRAUD" next to "Track your Complaint") — reads as unmaintained, which reads as untrustworthy.

### 5.4 Trust and tone

27. **Agency-shaped homepages.** PM photos, ministry news, PDF circulars, RTI notices, and "Daily Digest" above the primary task. Canada's finding — *"Organize for the user, not for the agency's org chart"* — is the direct rebuttal.
28. **PDFs as the delivery mechanism for citizen guidance.** Not responsive, poorly accessible, not translatable, invisible to site search.
29. **Blame-adjacent language.** "You forgot", "invalid", "prohibited", "illegal". A victim of sextortion reading "illegal" about their own input is a re-traumatisation event.
30. **No status, or a status that never changes.** Action Fraud's "black hole" reputation destroyed reporting rates: only **19%** of UK fraud victims reported to it. Report Fraud's answer is a trackable portal plus proactive notifications.
31. **Over-promising.** Never imply investigation or recovery that won't happen. IC3's honest "cannot respond directly to every submission" is preferable to silence.
32. **Emotionally cold acknowledgements.** A bare reference number with no next steps.
33. **Machine-translated regional-language versions.** Login.gov uses human translators for three languages and says so; India needs 22+, human-reviewed, or the translated experience becomes a second-class one.
34. **Humanised chatbots in a crisis context.** Chayn's evidence: distressed users believed a cat-mascot bot was human. If an assistant exists, make it visibly non-human, non-conversational, and scoped.
35. **No visible canonical-domain guidance** in a service that is itself a high-value phishing target (FBI's IC3 spoofing advisory).

### 5.5 Baseline numbers worth quoting

- Overall web form abandonment benchmark 2025–26: **~67.9%**; some B2C forms 72.3%. Mobile abandonment can run **27–34% higher** than desktop.
- UK: of 1,012 fraud victims surveyed by Which? in 2024, **19%** reported to Action Fraud; **31%** didn't know they could; **28%** didn't know how; **13%** were embarrassed or thought the loss trivial.
- UK Economic Crime Survey 2024: only ~a third of businesses experiencing fraud report it externally; **just 6% contact law enforcement.**
- Norway: **>1 million people** struggle to use digital services, attributed partly to inconsistent component behaviour across services.

---

## PART 6 — Direct implications for the India portal

Compressed, so the design work can start from here.

**Structure**
1. Homepage is a **triage page**, IC3-style: *"What do you want to report?"* with four to six doors in victim language — *I've lost money* · *Someone is threatening to share my private photos* · *Someone has taken over my account* · *Someone is using my identity* · *A woman or child is being harassed* · *I'm not sure*. No PM banner, no marquee, no carousel above these.
2. **1930 and the golden hour above everything else** for financial fraud, with the same visual weight as the report button. ScamShield's 1799 model.
3. **One thing per page** throughout, with a **task list** for the multi-part financial-fraud report (Your details · What happened · Money you lost · Who did it · Evidence).
4. **Check your answers** before submission, with `Not provided` for skipped optional fields and per-row Change links.
5. **Save and resume** with a resumable reference — and a genuine one, not the current partial autosave.
6. **Session timeout: warn 2 minutes before, allow extension, never lose data.**

**Safety**
7. **Exit this page** on every page of the sextortion / intimate-image / harassment flows, plus interruption page and safety-content page. Destination should be an India-plausible neutral site (e.g. a weather service), not Google. Keep the Shift×3 shortcut and the 3-dot indicator; do **not** use Esc.
8. **Anonymous reporting** preserved and made prominent for image-based and sexual crimes.
9. Destroy session data on exit in those flows, and say so on the interruption page.
10. Never send an email or SMS with a revealing subject line; let the user choose the notification channel or opt out entirely.

**Content**
11. Rewrite to **reading age 9** in every language. No "OTP", "KYC", "UTR", "acknowledgement number", "grievance", "redressal", "modus operandi" without a plain-language gloss.
12. Adopt GDS error-wording rules verbatim: `There is a problem`, imperative-verb messages, no "please"/"sorry"/"invalid".
13. Add **"(Why do we ask this?)"** inline explanations to every intrusive question, following StopNCII.
14. Open with acknowledgement and hope, not instructions. Model: *"Having your photos shared without your consent is frightening. There are steps you can take. You are not alone."*
15. **Be honest about what will happen.** IC3-style expectation setting beats silence.

**Feedback loop**
16. **A real, trackable status** with meaningful states, plus proactive notification — the Report Fraud answer to the "black hole" problem. Consider a Denmark-style delivery into a channel the citizen already uses (DigiLocker / Digital Post analogue) rather than requiring portal re-entry.

**Visual system**
17. Comply with **DBIM**: Noto Sans across all scripts; the functional palette (`#DC3545` error, `#FFC107` warning, `#198754` success, `#0D6EFD` info/link); line-height 1.2–1.5×; H1 36/24, body 16/14. Constrain measure to roughly 60–75 characters (Ontario's 48rem body measure is a good target; GOV.UK achieves it structurally with a two-thirds column in a 960px container).
18. Steal GOV.UK's **focus state wholesale** — but note `#FFDD00` on a saffron-adjacent palette may need checking; the mechanism (high-contrast fill + 4px dark underline via box-shadow + transparent outline for forced-colours) matters more than the specific yellow.
19. Steal USWDS's **magic-number grading** to guarantee accessible pairs across the DBIM palette, and its **optical-size normalisation** so Devanagari, Bengali and Tamil sit at the same optical size as Latin at each step.
20. Delete: `<marquee>`, `.blink-soft`, `maximum-scale=1`, the fraction-slider carousel, text-in-images, duplicate `<h1>`s, `__doPostBack` navigation, and the `!important` font override.

**Measurement**
21. Adopt the **Canada.ca method**: baseline moderated usability test measuring findability and task success on 6–10 real scenarios; target **80% success or +20 percentage points**; validation round with new participants on the same tasks; then a continuously running task-success intercept survey. Report outcomes, not visitor counts.

---

## Appendix — Primary sources

**GOV.UK / GDS**
- Design System — <https://design-system.service.gov.uk>
- Question pages — <https://design-system.service.gov.uk/patterns/question-pages/>
- Check answers — <https://design-system.service.gov.uk/patterns/check-answers/>
- Task list — <https://design-system.service.gov.uk/components/task-list/>
- Error summary — <https://design-system.service.gov.uk/components/error-summary/>
- Error message — <https://design-system.service.gov.uk/components/error-message/>
- Exit this page (component) — <https://design-system.service.gov.uk/components/exit-this-page/>
- Exit a page quickly (pattern) — <https://design-system.service.gov.uk/patterns/exit-a-page-quickly/>
- Images — <https://design-system.service.gov.uk/styles/images/>
- Source tokens — <https://github.com/alphagov/govuk-frontend> (`src/govuk/settings/`, `src/govuk/helpers/_focused.scss`)
- Content design — <https://www.gov.uk/guidance/content-design/writing-for-gov-uk>
- A–Z style guide — <https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style>
- Clear language — <https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/>
- Design Notes: Exit this page — <https://designnotes.blog.gov.uk/2023/08/14/exit-this-page-fast-with-the-design-systems-new-component/>
- MoJ: developing Exit this page — <https://mojdigital.blog.gov.uk/2023/11/01/trauma-informed-design-how-we-worked-together-to-develop-exit-this-page/>
- Effortmark on form structure — <http://www.effortmark.co.uk/no-accordions-choose-form-structure/>
- Home Office UCD manual — <https://design.homeoffice.gov.uk>
- DWP session timeout — <https://design-system.dwp.gov.uk/patterns/manage-a-session-timeout>

**USA**
- USWDS — <https://designsystem.digital.gov> · colour overview — <https://designsystem.digital.gov/design-tokens/color/overview/> · font tokens — <https://designsystem.digital.gov/design-tokens/typesetting/font/>
- Login.gov services — <https://www.login.gov/partners/our-services/>
- Digital.gov on Login.gov UX — <https://digital.gov/2021/03/02/security-is-everyones-job-delivering-secure-usable-login-for-government/>
- GSA 10x trauma-informed design — <https://10x.gsa.gov/news/trauma-informed-design/>
- VA.gov "a single response" pattern — <https://design.va.gov/patterns/ask-users-for/a-single-response>
- IC3 — <https://www.ic3.gov> · form — <https://complaint.ic3.gov> · routing — <https://www.ic3.gov/Home/DirectComplaint>
- Disability World portal audit — <https://www.disabilityworld.org/articles/civic-tech-unemployment-benefits-portals/>

**Other governments**
- Singapore SGDS — <https://www.designsystem.tech.gov.sg> · ScamShield — <https://www.scamshield.gov.sg>
- Estonia — <https://www.eesti.ee> · <https://brand.estonia.ee> · Bürokratt — <https://www.kratid.ee/en/burokratt>
- Netherlands NLDS — <https://nldesignsystem.nl> · <https://github.com/nl-design-system>
- Canada design system — <https://design.canada.ca> · blog — <https://blog.canada.ca> · research summaries — <https://design.canada.ca/research-summaries/>
- Australia Scamwatch — <https://www.scamwatch.gov.au> · Queensland DS — <https://www.designsystem.qld.gov.au> (see "Exploring our decisions → Carousels")
- New Zealand — <https://design-system-alpha.digital.govt.nz>
- Norway Designsystemet — <https://designsystemet.no/en/>
- Denmark — <https://designsystem.dk>
- Ontario — <https://designsystem.ontario.ca> (colours, fonts and typography pages)
- France DSFR — <https://www.systeme-de-design.gouv.fr>
- Cyprus UDS — <https://gov-cy.github.io/govcy-design-system-docs/>
- Comparative index of 100+ systems — <https://github.com/ctrimm/Government-Design-Systems-List>

**India**
- UX4G — <https://ux4g.gov.in> · docs — <https://doc.ux4g.gov.in> · handbook PDF — <https://www.ux4g.gov.in/assets/img/pdf/UX4G-Handbook.pdf>
- DBIM toolkit — <https://dbimtoolkit.digifootprint.gov.in>
- GIGW 3.0 — <https://guidelines.gov.in>
- National Cyber Crime Reporting Portal — <https://cybercrime.gov.in>
- RBI Sachet — <https://sachet.rbi.org.in>

**Crisis / trauma-informed**
- SAMHSA SMA14-4884 — <https://library.samhsa.gov/sites/default/files/sma14-4884.pdf>
- Chayn — <https://chayn.co> · *Orbits* field guide · blog — <https://blog.chayn.co>
- JUS: Trauma-Informed Design and usability heuristics — <https://uxpajournal.org/trauma-informed-design-leveraging-usability-heuristics-on-a-social-services-website/>
- StopNCII — <https://stopncii.org>
- Take It Down (NCMEC) — <https://takeitdown.ncmec.org>
- Refuge — <https://www.refuge.org.uk> · tech safety — <https://refugetechsafety.org>
- Report Fraud (UK) — <https://reportfraud.police.uk> · launch notice — <https://www.gov.uk/government/news/report-fraud-new-service-from-city-of-london-police>

**Cognition under stress**
- Time-dependent effects of acute stress on working memory — <https://www.sciencedirect.com/science/article/abs/pii/S0306453022003390>
- Acute stress, mind-wandering and lecture comprehension — <https://doi.org/10.1371/journal.pone.0297711>
- Shields et al., acute stress and core executive functions (meta-analysis)
- W3C Cognitive Accessibility Guidance — <https://www.w3.org/WAI/WCAG2/supplemental/#cognitiveaccessibilityguidance>

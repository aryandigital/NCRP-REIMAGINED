# World-Class Government Digital Design Systems — UI/UX Reference Brief

**Compiled:** August 2026. Every value below was pulled from a live source or from the design system's own source code; URLs are given inline.

**Read this first — the GOV.UK numbers in circulation are out of date.** GDS shipped a brand refresh on **25 June 2025** and made it the *default* (non-optional) appearance in **govuk-frontend v6.0.0**. v6 also rewrote the type scale for small screens and replaced the flat `$govuk-colours` map with a tiered primary/tint/shade palette plus a *functional* token layer. The widely-quoted hexes `#d4351c` (red) and `#00703c` (green) are **v5.x legacy values**. Current red is `#ca3535`, current green is `#0f7a52`. Both palettes are documented in §1.6 so you can tell which era a service is built in.

---

# PART 1 — GOV.UK / GDS

Sources: <https://design-system.service.gov.uk>, <https://www.gov.uk/service-manual>, <https://brand.design-system.service.gov.uk>, and `alphagov/govuk-frontend` `main` branch source.

## 1.1 "One thing per page"

**The rule, verbatim from the Service Manual** (<https://www.gov.uk/service-manual/design/form-structure>):

> "Start by splitting the form across multiple pages with each page containing just one thing, for example:
> - one piece of information you're telling a user
> - one decision they have to make
> - one question they have to answer"

**Why GDS says it works** — their stated user-side benefits, verbatim. Starting with one thing on a page helps people to:

- understand what you're asking them to do
- focus on the specific question and its answer
- find their way through an unfamiliar process
- use the service on a mobile device
- recover easily from form errors

And the operational benefits to the team: you can save a user's answers automatically as they go, capture analytics about each question, and handle branching questions and loops.

**The cognitive-load reasoning.** GDS's own framing is deliberately behavioural rather than academic: a page with fifteen fields forces the user to hold the current question, their prior answers, an estimate of how much is left, and a mental map of which fields are required — all before typing a character. Splitting removes the last three. The pattern originates with Caroline Jarrett (Effortmark), published into the Service Manual by Tim Paul; her three rules of form structure are (1) know why you're asking every question, (2) design for the most common scenarios first, (3) start with one thing per page.

**"One thing" ≠ "one input."** Explicitly from the Service Manual: *"Asking a question does not necessarily mean you should use one form field. For example, date of birth is best captured with 3 text fields."* An address is many inputs but one thing.

**When GDS says NOT to use it** — the escape hatches are narrow and evidence-gated:

- *"User research will tell you when you can merge pages together. For example, if you're designing an internal service for government users who need to repeat and switch between tasks quickly."* (Service Manual, form-structure)
- From the Question pages pattern (<https://design-system.service.gov.uk/patterns/question-pages/>): *"Sometimes it makes sense to group a number of related questions on the same page. User research will tell you when you can group pages together."*
- Note the asymmetry: one-thing-per-page is the **default you must start from**; grouping is the exception you must **earn with research**. There is no "when not to use" section that permits starting with a long form.

**Implementation rules that matter (Question pages pattern):**

- Set the `<label>` or `<legend>` *as* the page `<h1>` so screen-reader users hear the question once, not twice:

```html
<legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
  <h1 class="govuk-fieldset__heading">When was your passport issued?</h1>
</legend>
<div id="passport-issued-hint" class="govuk-hint">For example, 27 3 2007</div>
```

- *"Do not use the same page heading across multiple pages."* The heading must relate to the current page, not the section.
- For section context, use a caption above the `<h1>`: `<span class="govuk-caption-l">About you</span>`
- **Continue button:** *"labelled 'Continue', not 'Next'"* and *"aligned to the left so users do not miss it."*
- **Range sliders:** *"Avoid using range slider questions… If you do use a range slider, you must provide a method for selecting an answer that doesn't rely on 'click and drag' movements."* (WCAG 2.5.1 Pointer Gestures.)

**Progress indicators — the counterintuitive part.** GDS says start *without* one: *"Start by testing your form without a progress indicator to see if it's simple enough that users do not need one. Try improving the order, type or number of questions before adding a progress indicator."*

If you must, use only a text caption: `<span class="govuk-caption-l">Question 3 of 9</span>` — and *"Only include the total number of questions if you can do so reliably."*

**Do not use progress indicators that do all of the following:** show all questions at once; allow navigation to previous questions; show the current question. Because they:

- are often not noticed
- take up lots of space
- do not scale well on small screens
- can distract and confuse some users
- make it hard to write good labels for the steps
- make it hard to handle conditional sections

> *"A number of GOV.UK services have removed this style of progress indicator without any negative effects… the Carer's Allowance team removed a 12-step progress indicator with no effect on completion rates or times."*

This is the single most useful stat to bring to a stakeholder who wants a stepper.

## 1.2 "Check your answers" pattern

<https://design-system.service.gov.uk/patterns/check-answers/>

**Exact page structure** (from the canonical example):

1. Back link (`govuk-back-link`, text "Back") — outside `<main>`.
2. `<h1 class="govuk-heading-l">` — **"Check your answers before sending your application"**. GDS: *"Use the page title to tell the user what they need to do – otherwise, they might miss the 'submit' button at the end of the page."*
3. Section `<h2 class="govuk-heading-m">` — e.g. "Personal details", then "Application details".
4. Under each `<h2>`, a `<dl class="govuk-summary-list govuk-!-margin-bottom-9">` (i.e. spacing unit 9 = 40px mobile / 60px desktop of bottom margin between sections).
5. Each row is a `<div class="govuk-summary-list__row">` with three children: `<dt class="govuk-summary-list__key">` (the question, rephrased as a short label), `<dd class="govuk-summary-list__value">` (the answer), `<dd class="govuk-summary-list__actions">` (the Change link).
6. A final `<h2 class="govuk-heading-m">` — **"Now send your application"**.
7. The declaration paragraph.
8. The `<form>` containing the submit button.

**The Change link, verbatim, including the visually hidden suffix:**

```html
<dd class="govuk-summary-list__actions">
  <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> date of birth</span></a>
</dd>
```

Every Change link is the visible word "Change" plus hidden text naming the field, so a screen-reader user hearing a links list gets "Change name", "Change date of birth", "Change address" rather than eleven identical "Change"s.

**The declaration wording, verbatim:**

> "By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct."

**Where the submit button goes:** last thing on the page, inside the `<form>`, after the declaration. The canonical label is **"Accept and send"**. There is also a hidden field `<input type="hidden" name="answers-checked" value="true">`.

**Button label rule:** *"make sure the 'submit' button clearly shows the action it performs – for example, 'Change your tax details' or 'Send your claim form'."* Never "Submit".

**Other hard rules:**

- Unanswered optional questions render the value as **"Not provided"** — never blank.
- Two-thirds column (`govuk-grid-column-two-thirds-from-desktop`) unless answers are long, in which case full width. Rationale given: line length, plus *"the action links are closer to the other content on the page. Users with screen magnifiers are less likely to miss them."*
- After a user edits an answer, the Continue button must return them **straight to the check-answers page**, not back through the journey. Pre-populate everything.
- If changing an answer unlocks new questions, ask those *before* returning to check answers.
- Only render sections relevant to that user.
- Use the **Summary card** component instead when the user is checking multiple things of the same type (a series of appointments, several application choices).
- Stated benefits: *"increase users' confidence… reduce error rates as users are given a second chance to notice and correct errors before submitting data."*

## 1.3 Task list

Two things, often conflated:

- **Task list component** — <https://design-system.service.gov.uk/components/task-list/>
- **"Complete multiple tasks" pattern** — <https://design-system.service.gov.uk/patterns/complete-multiple-tasks/> (this replaced the older "task list pattern")

**Structure.** `<ul class="govuk-task-list">` → `<li class="govuk-task-list__item govuk-task-list__item--with-link">` → a `govuk-task-list__name-and-hint` div containing `<a class="govuk-link govuk-task-list__link" aria-describedby="{id}-status">`, plus a `<div class="govuk-task-list__status" id="{id}-status">`.

**The whole row is the link.** *"The whole row is linked, allowing users to select anywhere within it to start the task."* This was a deliberate fix: *"some users currently try to select task statuses, thinking they are buttons or links. The statuses have been redesigned to look less like buttons."*

**Statuses — current guidance.** Start with the minimum: *"Start with the smallest number of different statuses you think might work, for example 'Completed' and 'Incomplete', then add more if your user research shows there's a need for them."*

| Status | Markup | Visual |
|---|---|---|
| Completed | plain text in `govuk-task-list__status` (no tag) | black text, **no background colour** |
| Incomplete | `<strong class="govuk-tag govuk-tag--blue">` | blue tag |
| Not yet started | `<strong class="govuk-tag govuk-tag--blue">` | blue tag |
| In progress | `<strong class="govuk-tag govuk-tag--teal">` | teal tag |
| Cannot start yet | `govuk-task-list__status--cannot-start-yet` (plain text) | **grey text, no background, row not linked** |

> *"Once the user has completed the task, the status should show as 'Completed' and be black text with no background colour. This will draw more attention to tasks that require action."*

> *"If the user cannot start the task yet, for example because another task must be completed first, use the 'Cannot start yet' status. This should be grey text with no background colour, and the 'task row' should not be linked."*

Statuses are **sentence case**, not caps. GDS's stated reason: *"The use of uppercase in task statuses makes them harder to read. User research has also shown that once a few tasks have been completed, it is harder for users to scan the page and spot incomplete tasks."*

**The "You have completed 2 of 5 sections" counter is NOT in current GOV.UK guidance.** It was proposed in <https://github.com/alphagov/govuk-design-system-backlog/issues/72> ("Once a user has completed at least one task, add a summary line above the task list to say how many tasks have been completed. *'You have completed 2 of 6 tasks'*") but never made it into the published component or pattern. A caution from that same thread is worth knowing: one participant seeing *"Application complete"* above *"You have completed 5 of 5 sections"* thought the form had already been submitted.

The counter **is** standard in **Alberta's design system** (<https://v1.design.alberta.ca/examples/task-list-page>), which uses `Application incomplete` as an `<h2>` with *"You have completed 1 of 3 sections."* beneath, in a callout. Alberta's status set is Completed (success) / In progress (dark grey) / Not started (information) / Cannot start yet (light grey), plus the inline hint *"You need to complete the previous section before you can start this task."* If you want the counter, copy Alberta, not GOV.UK.

**Other rules:**

- Task names: sentence case, short, *"start with verbs, for example, 'check', 'declare', 'report'"*.
- *"If you're finding it difficult to come up with a clear and concise task name, it might be because the task itself is too complex."*
- Hint text: one short sentence, **no full stop**, **no links inside** (the whole row is a link, so nested links won't work).
- *"Users can only move on from the task list when all tasks are shown as 'Completed'."*
- Show the page **at the start of the transaction and at the start of each returning session**.
- Let users decide when a task is done, where the task has optional questions or a long free-text answer: ask **"Have you completed this section?"** with radios **"Yes, I've completed this section"** / **"No, I'll come back later"**.
- Only use this pattern for *"longer transactions involving multiple tasks that users may need to complete over a number of sessions"* — and *"Try to simplify the transaction before you use a complete multiple tasks page."*

## 1.4 Error summary and error messages

<https://design-system.service.gov.uk/components/error-summary/>, <https://design-system.service.gov.uk/components/error-message/>, <https://design-system.service.gov.uk/patterns/validation/>

### Placement and focus

**Placement:** *"Put the error summary at the top of the `main` container. If your page includes breadcrumbs or a back link, place it below these, but above the `<h1>`."*

**Focus:** *"move keyboard focus to the error summary (the govuk-frontend javascript will do this for you)"*. The component is `<div class="govuk-error-summary" data-module="govuk-error-summary">` wrapping `<div role="alert">`. Auto-focus can be disabled with `disableAutoFocus: true` but the default is on.

**Page title:** add `Error: ` to the beginning of the `<title>` so screen readers announce it immediately.

**Always show it:** *"Always show an error summary when there is a validation error, even if there's only one."*

### Exact markup

```html
<div class="govuk-error-summary" data-module="govuk-error-summary">
  <div role="alert">
    <h2 class="govuk-error-summary__title">
      There is a problem
    </h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        <li><a href="#full-name-input">Enter your full name</a></li>
        <li><a href="#passport-issued-year">The date your passport was issued must be in the past</a></li>
      </ul>
    </div>
  </div>
</div>
```

The heading is mandatory and fixed: **"There is a problem"** (an `<h2>`, not `<h1>`).

### Linking rules

- Single-field question (input, textarea, select, file upload, character count) → link to the field.
- Multi-field question (date input) → link to **the first field that contains an error**. If you don't know which, link to the first field.
- Radios/checkboxes → link to **the first radio or checkbox** in the group.

### Inline error message markup

```html
<p id="passport-issued-error" class="govuk-error-message">
  <span class="govuk-visually-hidden">Error:</span> The date your passport was issued must be in the past
</p>
```

The visually hidden `Error:` prefix is configurable for other languages (`visuallyHiddenText: "Gwall"` for Welsh). The field gets `govuk-input--error`, the wrapping group gets `govuk-form-group--error` (which draws the 5px red left border), and the field is wired up with `aria-describedby="{hint-id} {error-id}"`.

### Wording rules — the explicit GDS list

**Do not use:**

- technical jargon like "form post error", "unspecified error" and "error 0x0000000643"
- words like "forbidden", "illegal", "you forgot" and "prohibited"
- **"please"** because it implies a choice
- **"sorry"** because it does not help fix the problem
- **"valid"** and **"invalid"** because they do not add anything to the message
- humourous, informal language like "oops"

**Avoid these general messages** (verbatim list of what not to write):

- "An error occurred"
- "Answer the question"
- "Select an option"
- "Fill in the field"
- "This field is required"

**Match the error to the label.** GDS's own worked pairs:

| Label | Error message |
|---|---|
| "How many hours do you work a week?" | "Enter how many hours you work a week" |
| "Address line 1" | "Enter address line 1, typically the building and street" |

**Instructions vs descriptions** — GDS's own comparisons:

- "Enter your first name" is clearer, more direct and natural than "First name must have an entry"
- "Enter a first name that is 35 characters or less" is wordier, less direct and natural than "First name must be 35 characters or less"
- "Enter a date after 31 August 2017 for when you started the course" is wordier than "Date you started the course must be after 31 August 2017"

Rule: **instruction for empty fields ("Enter your name"), description for constraint violations ("Name must be 35 characters or less")** — and be consistent.

**Verbatim example messages from the live documentation:**

- "Enter your full name"
- "The date your passport was issued must be in the past"
- "Passport issue date must include a year"
- "Select if you are British, Irish or a citizen of a different country"
- "Enter a National Insurance number in the correct format"

**Consistency:** the summary text and the inline text must be **identical** so they *"look, sound and mean the same, make sense out of context, reduce the cognitive effort needed to understand what has happened."*

**Do not duplicate the example:** *"Do not give an example in the error message if there is an example on the screen."* If hint text already shows `QQ 12 34 56 C`, the error must not repeat it.

**Read it aloud:** *"Read the message out loud to see if it sounds like something you would say."*

### Validation behaviour rules

- **Turn off HTML5 validation.** Add `novalidate` to the `<form>` tag. **Do not add `required` to inputs.** Reason given: HTML5 error visual style/placement/content can't be made consistent with the Design System, and GDS knows its own components are accessible.
- **Do not validate on blur.** *"Do not validate when the user moves away from a field. Wait until they try to move to the next part of the service."* On-the-fly validation *"can cause problems - especially for users who type more slowly."* The character count component is the named exception.
- **Never clear fields on error.** Keep both passing and failing answers.
- **Server-side validation is always required**, even with client-side.
- **Accept messy input.** Ignore spaces, invisible characters, hyphens, brackets, dashes, full stops — in numbers and codes (postcodes, card details), before/after an answer (paste artefacts), and from dictation software.
- **Errors are not eligibility.** *"Do not use error messages to tell a user that they are not eligible or do not have permission to do something."* Use the "There is a problem with the service", "Page not found", or "Service unavailable" page patterns instead.

## 1.5 Typography

Source: `packages/govuk-frontend/src/govuk/settings/_typography-font.scss`, `_typography-responsive.scss`, <https://design-system.service.gov.uk/styles/type-scale/>

**Font stack:**

```scss
$govuk-font-family: "GDS Transport", arial, sans-serif;
$govuk-font-family-print: sans-serif;   // system fonts for print, to dodge printer-driver bugs
$govuk-font-weight-regular: 400;
$govuk-font-weight-bold: 700;
```

GDS Transport is a bespoke digital cut of **Transport**, the 1957–63 Kinneir/Calvert typeface designed for the UK road sign system. It ships only with GOV.UK Frontend and is licensed for GOV.UK services only. Only two weights exist (400/700) — there is no light, no medium, no italic display face. Arial is the fallback, and because Arial's metrics are close, the fallback swap is barely visible.

**Root font size is 16px**; output is in `rem`. GDS documents in px for comprehension but ships relative units so text scales with browser zoom and user preference.

**Every line-height is a multiple of 5px** — this is the whole basis of GOV.UK's vertical rhythm and is why the spacing scale is also in 5s.

**Type scale, v6.0.0+ (tablet breakpoint = 640px):**

| Point | Class | Desktop / ≥640px | Mobile / <640px | Print |
|---|---|---|---|---|
| 80 | (exceptional only) | 80px / 80px | 53px / 55px | 53pt / 1.1 |
| 48 | `govuk-heading-xl` | 48px / 50px | 32px / 35px | 32pt / 1.15 |
| 36 | `govuk-heading-l` | 36px / 40px | 27px / 30px | 24pt / 1.05 |
| 27 | (exceptional only) | 27px / 30px | 21px / 25px | 18pt / 1.15 |
| 24 | `govuk-heading-m`, `govuk-body-l` | 24px / 30px | 21px / 25px | 18pt / 1.15 |
| 19 | `govuk-heading-s`, `govuk-body` | 19px / 25px | 19px / 25px | 14pt / 1.15 |
| 16 | `govuk-body-s` | 16px / 20px | 16px / 20px | 14pt / 1.2 |

Note the two things people get wrong: **body text is 19px, not 16px**, and it **does not shrink on mobile** — it stays 19/25 at every width. v6 raised the *mobile* sizes (24-point went from 18/20 to 21/25; 48-point from 24/25 to 32/35) specifically *"to increase the size of text on small screens, improving legibility and accessibility."*

In rem at a 16px root: 19px = 1.1875rem, 24px = 1.5rem, 36px = 2.25rem, 48px = 3rem.

**Mixins:**

```scss
@include govuk-font($size: 19, $weight: bold, $tabular: true);  // full typography incl. family
@include govuk-font-size($size: 19);                             // size + line-height only
```

**Line length / measure:** *"we recommend using either a 'two-thirds' or a 'two-thirds and one-third' layout. That stops lines of text getting so long that the page becomes difficult to read on desktop devices. This would usually mean **no more than 75 characters per line**."* (<https://design-system.service.gov.uk/styles/layout/>) Two-thirds of 960px = 640px, which at 19px GDS Transport lands around 70–75 characters.

**Link underlines** (`settings/_links.scss`):

```scss
$govuk-link-underline-thickness: max(1px, .0625rem);
$govuk-link-underline-offset: 0.1578em;                        // = 3px ÷ 19px body size
$govuk-link-hover-underline-thickness: max(3px, .1875rem, .12em);
```

Links are always underlined, and the underline **thickens to 3px on hover** rather than disappearing.

## 1.6 Colour

### Current palette (govuk-frontend v6 / 2025 brand refresh)

Source of truth: `settings/_colours-palette.scss`. Access via `govuk-colour("blue")` / `govuk-colour("red", $variant: "tint-25")`. **GDS explicitly says: "Do not copy the specific hexadecimal (hex) colour values."**

| Family | primary | tint-25 | tint-50 | tint-80 | tint-95 | shade-25 | shade-50 |
|---|---|---|---|---|---|---|---|
| blue | `#1d70b8` | `#5694ca` | `#8eb8dc` | `#d2e2f1` | `#f4f8fb` | `#16548a` | `#0f385c` |
| green | `#0f7a52` | `#4b9b7d` | `#87bca8` | `#cfe4dc` | `#f3f8f6` | `#0b5c3e` | `#083d29` |
| teal | `#158187` | `#50a1a5` | `#8ac0c3` | `#d0e6e7` | `#f3f9f9` | `#106165` | `#0b4144` |
| purple | `#54319f` | `#7f65b7` | `#aa98cf` | `#ddd6ec` | `#f6f5fa` | `#3f2577` | `#2a1950` |
| magenta | `#ca357c` | `#d7689d` | `#e59abe` | `#f4d7e5` | `#fcf5f8` | `#98285d` | `#651b3e` |
| red | `#ca3535` | `#d76868` | `#e59a9a` | `#f4d7d7` | `#fcf5f5` | `#982828` | `#651b1b` |
| orange | `#f47738` | `#f7996a` | `#fabb9c` | `#fde4d7` | `#fef8f5` | `#b7592a` | `#7a3c1c` |
| yellow | `#ffdd00` | `#ffe640` | `#ffee80` | `#fff8cc` | `#fffdf2` | `#bfa600` | `#806f00` |
| brown | `#99704a` | `#b39477` | `#ccb8a5` | — | `#faf8f6` | — | — |
| black | `#0b0c0c` | `#484949` | `#858686` | `#cecece` | `#f3f3f3` | — | — |
| white | `#ffffff` | | | | | | |

Extras: `blue.shade-10` = `#1a65a6` (used for links); `teal.accent` = `#00ffe0`.

### Functional tokens (what you should actually reference)

`govuk-functional-colour("brand")`, etc. From `settings/_colours-functional.scss`:

| Token | Maps to | Resolved hex |
|---|---|---|
| `brand` | blue primary | `#1d70b8` |
| `text` | black primary | `#0b0c0c` |
| `inverse-text` | white | `#ffffff` |
| `print-text` | literal true black | `#000000` |
| `secondary-text` | black tint-25 | `#484949` |
| `body-background` | white | `#ffffff` |
| `template-background` | blue tint-95 | `#f4f8fb` |
| `surface-background` | blue tint-95 | `#f4f8fb` |
| `surface-text` | black primary | `#0b0c0c` |
| `surface-border` | blue tint-50 | `#8eb8dc` |
| `focus` | yellow primary | `#ffdd00` |
| `focus-text` | black primary | `#0b0c0c` |
| `error` | red primary | `#ca3535` |
| `success` | green primary | `#0f7a52` |
| `border` | black tint-80 | `#cecece` |
| `input-border` | black primary | `#0b0c0c` |
| `hover` | black tint-80 | `#cecece` |
| `link` | blue shade-10 | `#1a65a6` |
| `link-visited` | purple primary | `#54319f` |
| `link-hover` | blue shade-50 | `#0f385c` |
| `link-active` | black primary | `#0b0c0c` |

`template-background` being blue tint-95 rather than white is the single most visible consequence of the 2025 rebrand: the page chrome is now a very pale blue so the footer and cookie banner merge into it.

`print-text` is `#000000` rather than `#0b0c0c` deliberately — *"Use 'true black' to avoid printers using colour ink to print body text."*

### Legacy palette (govuk-frontend v5.x) — for reading older services

```scss
$govuk-colours: (
  "red": #d4351c,        "yellow": #ffdd00,      "green": #00703c,
  "blue": #1d70b8,       "dark-blue": #003078,   "light-blue": #5694ca,
  "purple": #4c2c92,     "black": #0b0c0c,       "dark-grey": #505a5f,
  "mid-grey": #b1b4b6,   "light-grey": #f3f2f1,  "white": #ffffff,
  "light-purple": #6f72af, "bright-purple": #912b88,
  "pink": #d53880,       "light-pink": #f499be,  "orange": #f47738,
  "brown": #b58840,      "light-green": #85994b, "turquoise": #28a197
);
```

v5 functional mapping: brand = blue `#1d70b8`; text = black `#0b0c0c`; secondary text = dark-grey `#505a5f`; focus = yellow `#ffdd00`; focus text = black `#0b0c0c`; error = red `#d4351c`; success = green `#00703c`; border = mid-grey `#b1b4b6`; input border = black `#0b0c0c`; hover = mid-grey `#b1b4b6`; link = blue `#1d70b8`; visited = purple `#4c2c92`; link hover = dark-blue `#003078`; link active = black `#0b0c0c`.

## 1.7 Focus state — exact spec

<https://design-system.service.gov.uk/get-started/focus-states/> and `helpers/_focused.scss`. The design goal is WCAG 2.2 SC 1.4.11 Non-text Contrast (AA) **on any background used on GOV.UK** — hence the yellow/black pairing: yellow has high contrast against dark backgrounds, the thick black bar has high contrast against light ones.

`$govuk-focus-width: 3px`

**Text links (`govuk-focused-text`):**

```scss
outline: 3px solid transparent;              // visible only in forced-colours / dark modes
color: #0b0c0c;                              // focus-text
background-color: #ffdd00;                   // focus
box-shadow:
  0 -2px #ffdd00,                            // yellow bleeds 2px above the text box
  0 4px  #0b0c0c;                            // 4px black bar below — this IS the underline
text-decoration: none;                       // native underline removed; the box-shadow replaces it
@supports not (text-wrap: balance) { box-decoration-break: clone; }  // Chromium 108–111 wrap fix
```

The `outline: 3px solid transparent` is not decorative: when a user forces colours (Windows High Contrast, dark mode), backgrounds and box-shadows are stripped, and the transparent outline is the thing that gets repainted in a visible colour.

**Non-text content inside links (`govuk-focused-box`):**

```scss
outline: 3px solid transparent;
box-shadow: 0 0 0 4px #ffdd00, 0 0 0 8px #0b0c0c;
```

**Form inputs (`govuk-focused-form-input`):**

```scss
outline: 3px solid #ffdd00;
outline-offset: 0;                                   // ring sits outside the element
box-shadow: inset 0 0 0 2px #0b0c0c;                 // doubles the 2px border to 4px
```

Box-shadow rather than `border-width` is used deliberately so the element's box size doesn't change on focus (which would reflow a textarea).

## 1.8 Spacing, grid, page width

<https://design-system.service.gov.uk/styles/spacing/>, `settings/_measurements.scss`

**Responsive scale** (`govuk-responsive-margin(n)` / `govuk-responsive-padding(n)`; the breakpoint is the 640px tablet breakpoint):

| Unit | Small screens | Large screens |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 5px | 5px |
| 2 | 10px | 10px |
| 3 | 15px | 15px |
| 4 | 15px | 20px |
| 5 | 15px | 25px |
| 6 | 20px | 30px |
| 7 | 25px | 40px |
| 8 | 30px | 50px |
| 9 | 40px | 60px |

Units 0–3 do not change with screen size. **Static scale** (`govuk-spacing(n)`) is the large-screen column at all widths: 0, 5, 10, 15, 20, 25, 30, 40, 50, 60px.

Override classes: `govuk-!-margin-9`, `govuk-!-padding-right-5`, `govuk-!-margin-0`; static variants `govuk-!-static-margin-9`. Negative spacing via `govuk-spacing(-3)`.

**Layout:**

```scss
$govuk-page-width: 960px;
$govuk-gutter: 30px;
$govuk-gutter-half: 15px;
$govuk-grid-widths: (one-quarter: 25%, one-third: 33.33%, one-half: 50%,
                     two-thirds: 66.67%, three-quarters: 75%, full: 100%);
```

**Border widths:**

```scss
$govuk-border-width: 5px;                  // section rules, error-group left border
$govuk-border-width-wide: 10px;            // top border on headers/footers
$govuk-border-width-narrow: 4px;
$govuk-border-width-form-element: 2px;     // inputs, checkboxes, radios
$govuk-border-width-form-group-error: 5px;
$govuk-focus-width: 3px;
$govuk-hover-width: 10px;                  // radio/checkbox hover halo
```

Everything is 5px-divisible, matching the 5px line-height grid.

## 1.9 Content design rules

Sources: <https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style>, <https://www.gov.uk/guidance/content-design/writing-for-gov-uk>

**Reading age target: 9.** The reasoning GDS actually gives (not "our users are stupid"):

> "By the time a child is 5 or 6 years old, they'll use 2,500 to 5,000 common words. Adults still find these words easier to recognise and understand than words they've learned since. By age 9, you're building up your 'common words' vocabulary. Your primary set is around 5,000 words; your secondary set is around 10,000 words… Children quickly learn to read common words… They then stop reading these words and start recognising their shape. This allows people to read much faster. Children already read like this by the time they're 9 years old. This is why we tell people to write on GOV.UK for a 9 year old reading age."

And on specialists: *"Government experts often say that because they're writing technical or complex content for a specialist audience, they do not need to use plain English. This is wrong… higher literacy people… [read] as quickly as possible."*

Supporting data (National Literacy Trust, cited widely in UK public-sector guidance): 1 in 7 adults in England have literacy at or below Entry Level 3 (the level expected of a 9–11 year old); 1 in 6 in England and 1 in 5 in Northern Ireland are at or below Level 1.

**Plain English is mandatory.** The full "Words to avoid" list, verbatim:

- **agenda** (unless it's for a meeting) → "plan"
- **advance** → "improve" or something more specific
- **collaborate** → "work with"
- **combat** (unless military) → "solve", "fix" or something more specific
- **commit/pledge** → "plan to x", or "we're going to x" where x is a specific verb
- **counter** → "prevent" or rephrase as a solution to a problem
- **deliver** → "make", "create", "provide" (pizzas, post and services are delivered — not abstract concepts like improvements)
- **deploy** (unless military or software) → "use"; if putting something somewhere, "build", "create", "put into place"
- **dialogue** → "spoke to" or "discussion"
- **disincentivise** → "discourage" or "deter"
- **empower** → "allow" or "give permission"
- **facilitate** → say something specific about how you're helping — e.g. "run" a workshop
- **focus** → "work on" or "concentrate on"
- **foster** (unless it's children) → "encourage" or "help"
- **impact** (unless a collision) → "have an effect on" or "influence"
- **incentivise** → "encourage" or "motivate"
- **initiate** → "start" or "begin"
- **key** (unless it unlocks something) → usually not needed; "important" or "significant"
- **land** (unless aircraft) → "get" or "achieve"
- **leverage** (unless financial) → "influence" or "use"
- **liaise** → "work with" or "work alongside"
- **overarching** → usually superfluous; "encompassing"
- **progress** → "work on", "develop", "make progress"
- **promote** (unless an ad campaign or career advancement) → "recommend" or "support"
- **robust** (unless a sturdy object) → "well thought out" or "comprehensive"
- **slim down** → "make smaller" or "reduce the size"
- **streamline** → "simplify" or "remove unnecessary administration"
- **strengthening** (unless bridges) → "increasing funding", "concentrating on", "adding more staff"
- **tackle** (unless fishing/rugby) → "stop", "solve", "deal with"
- **transform** → describe what you're doing to change the thing
- **utilise** → "use"

**Metaphors are banned** — *"they do not say what you actually mean and lead to slower comprehension"*:

- **drive** → "create", "cause", "encourage" (you can only drive vehicles, not schemes or people)
- **drive out** (unless cattle) → "stop", "avoid", "prevent"
- **going/moving forward** → "from now on" or "in the future"
- **in order to** → usually not needed; do not use it
- **hub / portal / one-stop shop** → "website" or "service"
- **ring fencing** → "separate", or for budgets "money that will be spent on x"

Also: **proforma** → say what it is (a template, a form) and be specific about what to do with it. **"purchase"** → "buy"; **"assist"** → "help"; **"approximately"** → "about".

**Capitalisation:** *"Always use sentence case, even in page titles and service names."* Exceptions are proper nouns only (departments, the Civil Service, specific job titles, honorifics, Rt Hon, buildings, place names, brand names, faculties/departments/institutes/schools, named groups and directorates, Parliament/the House). And: *"DO NOT USE BLOCK CAPITALS FOR LARGE AMOUNTS OF TEXT AS IT'S QUITE HARD TO READ."*

**Active voice:** *"Use the active voice rather than the passive voice. This will help us write concise, clear content."*

**Contractions — the specific GDS position, which is more nuanced than "no contractions":**

> "Avoid **negative contractions** like can't and don't. Many users find them harder to read, or misread them as the opposite of what they say. Use **cannot**, instead of can't. Avoid **complex or conditional contractions** such as should've, could've, would've too."

So "you'll", "we're", "it's" are fine; "don't", "can't", "won't", "shouldn't", "should've" are not.

**"Please":** *"There's usually no need to say 'please' or 'please note'."*

**"you" and "we":** address the user directly as "you"; the department is "we". Content is written as if talking to the user one-on-one. Where an action is compulsory, say **"you must"** — GDS's adult-literacy work found that *"When people are concentrating on reading and understanding each word, there's no room for subtle implications… you can't hint at it, you have to tell them quickly and clearly."*

**Headings:** questions or statements, but be consistent within a service — *"Use questions or statements consistently to help users get into a rhythm of answering."* Both "What is your date of birth?" and "Date of birth" are acceptable; mixing them is not.

**Button labels:** verb-first and specific to the action. "Continue" not "Next". "Accept and send" not "Submit". "Start now" on a start page. Start-page CTAs may also be "Sign in" or "Register or update your details".

**Lists:** introduce with a stub sentence ending in a colon; lowercase first letter for each item; no full stops at the end of items.

**Legal content:** *"Legal content can still be written in plain English… If you have to publish legal jargon, it will be a publication so write a plain English summary."*

**References:** no italics; single quote marks around titles; abbreviations written out ("page" not "p"); "and others" not "et al"; no full stops after initials or at the end.

## 1.10 What GOV.UK deliberately avoids, and why

**Carousels** — no carousel component exists in the Design System and none has ever been published. GOV.UK's homepage has never used one. The rationale in the wider GDS/UK public-sector literature is that carousel panels beyond the first are almost never seen, they auto-advance under the user, and they fail on keyboard and screen reader.

**Accordions** — a component exists, but the guidance is closer to a warning label:

> *"Accordions hide content from the user. Not all users will notice them or understand how they work. For this reason, you should only use them in specific situations and if user research supports it."*
>
> *"Test your content without an accordion first. Well-written and structured content… can remove the need to use an accordion."*
>
> *"Accordions work best for simple content and links. **Do not use accordions to split up a series of questions. Use separate pages instead.**"*
>
> *"Do not put accordions within accordions."* And avoid nesting Accordion / Tabs / Details in each other.

The listed alternatives to try first: simplify and reduce the content; split across multiple pages; keep on one page separated by headings; use anchor links.

The DWP Accessibility Manual (<https://accessibility-manual.dwp.gov.uk/guidance-for-your-job-role/interaction-designer>) is blunter: *"Try to avoid hidden content… When we hide content away in collapsible components it's often because we have not done a very good job of explaining something, or we are trying to put too much content on the page."* It also flags that the GOV.UK Accordion's headings look like links but behave like buttons, which it reads as a WCAG 4.1.2 Name, Role, Value failure.

**PDFs** — <https://gds.blog.gov.uk/2018/07/16/why-gov-uk-content-should-be-published-in-html-and-not-pdf/>. *"Compared with HTML content, information published in a PDF is harder to find, use and maintain… unless created with sufficient care PDFs can often be bad for accessibility and rarely comply with open standards."* Specific failures cited: users can't apply their own colour/text-size settings (magnifying a PDF doesn't reflow the text and the font pixelates); PDFs are harder to update, so they rot; multi-format publishing multiplies the error surface. *"The default should be to create all content in HTML."* PDFs are permitted only **in addition to** HTML, and only where a static record of a moment in time is genuinely needed.

**"Read more" links** — DWP's rule, which reflects GDS practice: *"For any link, remove everything else on the page and make sure it still makes sense. For example 'Change' is not clear when you view it in isolation, but 'Change bank details' is."* This is exactly why the check-answers Change links carry visually hidden field names.

**Animation** — the Design System ships essentially none. The 2025 brand refresh introduced animation for the first time, and even then explicitly scoped it: *"the introduction of animation into the GOV.UK identity, primarily in the GOV.UK App and on GOV.UK's social media accounts"* — i.e. brand channels, not transactional services.

**Icons** — there is no icon library. The Warning text component's "!" is a text character in a styled span with `aria-hidden="true"`; the Details component's arrow is CSS. Meaning is never carried by an icon alone.

**Hero images / imagery in services** — service pages carry no decorative imagery. Bandwidth, load time, and the fact that a photo answers no question.

**Client-side-only validation, HTML5 validation, `required`, and on-blur validation** — see §1.4.

**Range sliders** — see §1.1.

**Multi-step progress bars** — see §1.1.

**Buttons for navigation** — DWP: *"a link should just navigate between pages and buttons should interact with data."* And *"don't use more than one green button per page."*

## 1.11 Supporting components — exact copy

**Start pages** (<https://design-system.service.gov.uk/patterns/start-using-a-service/>). *"GOV.UK services must start on a GOV.UK content page."* The start point must:

- give the user just enough information to understand what the service does and whether it will meet their need — including **a service name that reflects the problem it solves for users**
- include a button linking into the service, labelled consistently with the action: "Start now", "Sign in", or "Register or update your details" (secondary CTAs must be plain links)
- let users sign in, resume an application, or update details
- state cost and roughly how long it takes
- list other ways to access the service (phone, paper form)
- list documents/information needed — *"there's no need to list information that a user is likely to know from memory – for example, their own date of birth"*

**Eligibility does not belong on the start page:** *"Avoid using the start point to provide complex eligibility information. Instead, ask questions inside the service."* If the list of required documents makes the page too complicated, move it to a separate "What you'll need" page inside the service subdomain.

Markdown for a Whitehall-published start button: `{button start}[Button text goes here](https://servicename.service.gov.uk/first-page-within-service){/button}`

**Check a service is suitable** (<https://design-system.service.gov.uk/patterns/check-a-service-is-suitable/>) — formerly "Check before you start". Ask a short series of simple questions, compute the answer, show a results page. Use it to tell the user whether they're eligible, whether they *have* to use the service, what it costs, what they'll get, and how long it takes. *"Avoid asking questions the user will need to provide again when using your service."* If they're not eligible, *"explain why and, if possible, tell them what they should do instead."* Do not use it if the eligibility rules are simple enough to state on the start page.

**Phase banner:**

```html
<div class="govuk-phase-banner govuk-width-container">
  <p class="govuk-phase-banner__content">
    <strong class="govuk-tag govuk-phase-banner__content__tag">Alpha</strong>
    <span class="govuk-phase-banner__text">
      This is a new service. Help us improve it and
      <a class="govuk-link" href="#">give your feedback by email</a>.
    </span>
  </p>
</div>
```

*"Services hosted on a service.gov.uk domain must use the phase banner until they pass a live assessment."* Alpha tag for alpha; Beta tag for private or public beta. Placed inside `<header>`, directly after the header (and before the back link).

**Notification banner:**

- Default `titleText` is **"Important"**; with `type: "success"` it is **"Success"**.
- Success variant: `<div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">`
- *"Since you're using the notification banner to tell the user about the outcome of something they've just done, add `role="alert"` so focus shifts to the notification banner on page load."*
- *"use headings like 'Success' - so that you're not relying on colour alone to convey meaning – to meet WCAG 2.2 success criterion 1.4.1 Use of colour."*

**Warning text:**

```html
<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-visually-hidden">Warning</span>
    You can be fined up to £5,000 if you do not register.
  </strong>
</div>
```

*"Use the warning text component when you need to warn users about something important, such as legal consequences of an action, or lack of action, that they might take."* The "!" is decorative and hidden from AT; the word "Warning" is provided as visually hidden text.

**Inset text:**

```html
<div class="govuk-inset-text">…</div>
```

The critical caveat: *"Some users do not notice inset text if it's used on complex pages or near to other visually prominent elements. For this reason, **avoid using inset text as a way of highlighting very important information** that users need to see. If you need to draw attention to very important content, like legal information, use the Warning text component instead."* And: *"Use inset text very sparingly - it's less effective if it's overused."*

Inset text is a left-border quote block for supplementary context; warning text is for consequences. People routinely swap them.

**Details:** `<details class="govuk-details">` with `<summary class="govuk-details__summary"><span class="govuk-details__summary-text">Help with nationality</span></summary>`. Same hidden-content caveats as the accordion — use for genuinely optional help, not for information the user needs.

**Breadcrumbs** exist as a component but are for GOV.UK content pages, not for transactional journeys. Inside a service, the **Back link** (`<a href="#" class="govuk-back-link">Back</a>`, placed above `<main>`) is the navigation affordance, because some users do not trust the browser back button when entering data.

**Exit this page** — a GOV.UK component with no USWDS equivalent, built for domestic-abuse and similarly dangerous contexts: a persistent button plus a Shift×3 keyboard shortcut that navigates away, replaces the current history entry, and opens a decoy page.

---

# PART 2 — USWDS, Login.gov, IRS Direct File

Source: <https://designsystem.digital.gov> (documented version at time of writing: **USWDS 3.14.0**).

## 2.1 Colour system

USWDS has three token tiers: **system tokens** (the raw ramp, e.g. `blue-60v`), **theme tokens** (role-based, e.g. `primary`), and **state tokens** (`error`, `success`, `warning`, `info`, `disabled`, `emergency`).

Theme colours fall into five role families — **base, primary, secondary, accent-warm, accent-cool** — with a stated **60/30/10** proportional relationship (60% primary, 30% secondary, 10% accents), on top of a predominantly neutral base. Each family has seven lightness grades; primary and secondary also have a **vivid** grade. The `v` suffix on a system token means vivid.

**Default theme tokens:**

| Token | System token | Hex |
|---|---|---|
| `base-lightest` | gray-5 | `#f0f0f0` |
| `base-lighter` | gray-cool-10 | `#dfe1e2` |
| `base-light` | gray-cool-30 | `#a9aeb1` |
| `base` | gray-cool-50 | `#71767a` |
| `base-dark` | gray-cool-60 | `#565c65` |
| `base-darker` | gray-cool-70 | `#3d4551` |
| `base-darkest` / `ink` | gray-90 | `#1b1b1b` |
| `primary-lighter` | | `#d9e8f6` |
| `primary-light` | | `#73b3e7` |
| **`primary`** | **blue-60v** | **`#005ea2`** |
| `primary-vivid` | | `#0050d8` |
| `primary-dark` | | `#1a4480` |
| `primary-darker` | | `#162e51` |
| `secondary-lighter` | | `#f3e1e4` |
| `secondary-light` | | `#f2938c` |
| **`secondary`** | | **`#d83933`** |
| `secondary-vivid` | | `#e41d3d` |
| `secondary-dark` | | `#b50909` |
| `secondary-darker` | | `#8b0a03` |
| `accent-cool-lighter` | | `#e1f3f8` |
| `accent-cool-light` | | `#97d4ea` |
| `accent-cool` | | `#00bde3` |
| `accent-cool-dark` | | `#28a0cb` |
| `accent-cool-darker` | | `#07648d` |
| `accent-warm-lighter` | | `#f2e4d4` |
| `accent-warm-light` | | `#ffbc78` |
| `accent-warm` | | `#fa9441` |
| `accent-warm-dark` | | `#c05600` |
| `accent-warm-darker` | | `#775540` |

**State tokens:**

| Role | System token | Hex | lighter / light / dark / darker |
|---|---|---|---|
| `info` | cyan-30v | `#00bde3` | `#e7f6f8` / `#99deea` / `#009ec1` / `#2e6276` |
| `error` | red-warm-50v | `#d54309` | `#f4e3db` / `#f39268` / `#b50909` / `#6f3331` |
| `warning` | gold-20v | `#ffbe2e` | `#faf3d1` / `#fee685` / `#e5a000` / `#936f38` |
| `success` | green-cool-40v | `#00a91c` | `#ecf3ec` / `#70e17b` / `#008817` / `#216e1f` |
| `disabled` | gray-50 | `#757575` | `#c9c9c9` / `#919191` / `#454545` / `#1b1b1b` |
| `emergency` | red-warm-60v | `#9c3d10` | dark: red-warm-80 `#332d29` |

Default link colour is `$theme-link-color: 'primary-vivid'` (`#0050d8`).

**Contrast with GOV.UK:** USWDS ships a *palette generator* with seven grades per family and expects agencies to re-theme. GOV.UK ships one palette and expects you not to touch it. USWDS is a framework; GOV.UK is a brand.

## 2.2 Typography

Typeface tokens and their stacks (<https://designsystem.digital.gov/design-tokens/typesetting/font-family/>):

| Token | Stack |
|---|---|
| `public-sans` | `"Public Sans Web", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"` |
| `source-sans-pro` | `"Source Sans Pro", "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif` |
| `merriweather` | `"Merriweather Web", "Georgia", "Cambria", "Times New Roman", "Times", serif` |
| `roboto-mono` | `"Roboto Mono Web", "Bitstream Vera Sans Mono", "Consolas", "Courier", monospace` |
| `open-sans` | `"Open Sans", -apple-system, …` |
| `system` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, …` |
| `helvetica` / `tahoma` / `verdana` | native stacks |

**Public Sans** is the one that matters: an open-source (SIL OFL) face developed by USWDS itself, derived from Libre Franklin, specifically for US federal interfaces. Unlike GDS Transport it is variable-weight and freely licensed for anyone, which is why it has spread well beyond government. **Source Sans Pro** was the previous USWDS default and remains a first-class token for legacy themes.

Fonts are bound to *font-type* roles (`$theme-font-type-sans`, `-serif`, `-mono`, `-cond`, `-icon`) and then to *font-role* tokens (`body`, `heading`, `code`, `alt`, `ui`), so you swap a typeface by pointing one variable at a different typeface token — you never touch component CSS.

Utilities: `@include u-font-family('sans')`, `.font-family-body`, `font-family: family('body')`.

## 2.3 The "magic number" spacing units

<https://designsystem.digital.gov/design-tokens/spacing-units/>

> *"USWDS spacing unit tokens are based on multiples of 8px, with additional tokens for small sizes, named tokens for large sizes, and a more limited selection of negative tokens."*

**8px is the magic number.** Token `1` = 8px, and everything scales from there. Output above 2px is in `rem`, not px.

| Token | Multiple | Value | | Token | Multiple | Value |
|---|---|---|---|---|---|---|
| `1px` | — | 1px | | `9` | 9 | 72px |
| `2px` | — | 2px | | `10` | 10 | 80px |
| `0.5` / `'05'` | 0.5 | 4px | | `15` | 15 | 120px |
| `1` | 1 | **8px** | | `'card'` | 20 | 160px |
| `1.5` / `'105'` | 1.5 | 12px | | `'card-lg'` | 30 | 240px |
| `2` | 2 | 16px | | `'mobile'` | 40 | 320px |
| `2.5` / `'205'` | 2.5 | 20px | | `'mobile-lg'` | 60 | 480px |
| `3` | 3 | 24px | | `'tablet'` | 80 | 640px |
| `4` | 4 | 32px | | `'tablet-lg'` | 110 | 880px |
| `5` | 5 | 40px | | `'desktop'` | 128 | 1024px |
| `6` | 6 | 48px | | `'desktop-lg'` | 150 | 1200px |
| `7` | 7 | 56px | | `'widescreen'` | 175 | 1400px |
| `8` | 8 | 64px | | | | |

Negatives from `-1px`/`'neg-1px'` down to `-15`/`'neg-15'` (−120px). Note the odd naming convention: numeric tokens (`0.5`, `-2`) and string tokens (`'05'`, `'neg-2'`) coexist; **utility classes use unquoted string tokens exclusively** (`.margin-x-neg-2`), while mixins and functions accept either.

The named breakpoint tokens double as spacing tokens — `'tablet'` is both the 640px breakpoint and a 640px spacing value. That's the neatest structural idea in USWDS and has no GOV.UK equivalent.

**GOV.UK's scale is 5px-based and non-linear (5/10/15/20/25/30/40/50/60); USWDS's is 8px-based and near-geometric.** GOV.UK's exists to serve a 5px line-height grid; USWDS's exists to serve a utility-class system.

## 2.4 Patterns USWDS has that GOV.UK does not

**Government banner** (`usa-banner`) — mandated on federal sites, and the single most-copied government UI component in the world. Verbatim:

> **An official website of the United States government**  ·  *Here's how you know*

Expanding "Here's how you know" reveals two guidance blocks:

> **Official websites use .gov**
> A **.gov** website belongs to an official government organization in the United States.

> **Secure .gov websites use HTTPS**
> A **lock** (🔒) or **https://** means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.

The `.mil` variant swaps in "Secure .mil websites use HTTPS". Wrapper: `<section class="usa-banner" aria-label="Official website of the United States government,">`. Implemented as an accordion (`usa-accordion__button usa-banner__button`), collapsed by default, with a small US flag. GOV.UK has no equivalent because the crown-and-wordmark plus the `.gov.uk` / `service.gov.uk` domain does the same job implicitly. **For any country where citizens are routinely phished by fake government sites, the USWDS banner is the better model.**

**Identifier** (`usa-identifier`) — the mandatory federal footer strip: parent agency, required links (About, Accessibility statement, FOIA requests, No FEAR Act data, Office of the Inspector General, Performance reports, Privacy policy), and the "Looking for U.S. government information and services? Visit USA.gov" line. A standardised accountability block.

**Step indicator** (`usa-step-indicator`) — the thing GOV.UK explicitly discourages, done carefully:

- Use when the process spans several pages *"that can be organized into **three or more** high-level steps or chapters."*
- *"Linear progression. The step indicator is designed to complement standard back/next navigation in a linear sequence, **not to be navigation of its own**."*
- Don't use for nonlinear forms, very short forms, or fewer than three sections.
- The current segment must be *"the most visually prominent"*; pending segments *"the least visually prominent… but should still maintain accessible contrast."*
- Variants: `--no-labels`, `--counters`, `--counters-sm`, `--center`.
- On counters: *"The counter pattern (step numbers in a circle) attracts more attention… but more strongly communicates step-by-step progression. Use counters when you want to reinforce step progression. **Omit them if testing proves that this reinforcement is unnecessary for your audience.**"*

**Process list** (`usa-process-list`) — a numbered vertical instruction list, distinct from the step indicator because it doesn't track progress. Rules: *"A process list should include between three and ten steps to prevent it from getting too unwieldy or confusing."* Headings must be parallel (all starting with an action verb), consistently punctuated, and short enough for one line. Don't use for non-sequential content or plain readability lists.

**Summary box** (`usa-summary-box`) — a bordered, titled box of key takeaways or next actions at the top of a dense page. GOV.UK's Inset text is the nearest thing and is deliberately weaker (see §1.11).

**Site alert** (`usa-site-alert`) — a page-level, site-wide banner in `info` or `emergency` variants, distinct from the in-page **Alert** component (`usa-alert--info|warning|error|success|emergency`). GOV.UK collapses all of this into one Notification banner with two states.

**"Complete a complex form" pattern family** — USWDS ships whole multi-page *patterns*, not just components: `progress-easily`, `keep-a-record-of-submitted-information`, `understand-expectations-and-establish-trust`, plus identity patterns for name, address, SSN, phone, date of birth, gender identity, sexual orientation, race/ethnicity, and "Create a user profile". The trauma-informed language in `progress-easily` is notable:

> *"Respectful, inclusive voice and tone throughout the form – the questions, field labels, hint text, and form messaging – will be critical success factors, as well as delivering questions that progress from simple to more difficult to answer… Any system or validation messaging should be **free of blame and avoid alarming users**."*
>
> *"Allow the user to complete the form in the order they choose, if possible. If changes to answers may impact steps already completed, inform the user of potential impacts and confirm before invalidating previous form entries."*

**Identity verification (Login.gov).** Login.gov runs on the **Login.gov Design System** (`18F/identity-design-system`), a layer on top of USWDS (`18F/identity-idp`). The flow, per GAO-26-109261: create account (email, password, MFA choice) → choose remote or in-person proofing → upload front and back of a state ID → automated authenticity check → LexisNexis identity validation → state DMV Driver's License Data Verification Service → LexisNexis phone validation. **The in-person route is a first-class option, not a fallback**: the user picks a Post Office, enters their ID data online, and Login.gov generates a barcode to print or download and present with the physical ID. Designing the offline path as a peer of the online path — rather than as a failure state — is the transferable idea.

## 2.5 Accessibility approach, and what USWDS does better than GOV.UK

**Where USWDS is stronger:**

1. **Tokens are accessibility-aware by construction.** The `v` (vivid) suffix and the seven-grade system are built so that "grade 60 on white" and "grade 10 background with grade 70 text" are predictably compliant. GOV.UK ships one hand-tuned palette; USWDS ships a *system for generating* compliant palettes, which is what you need if you're re-theming.
2. **A far richer pattern library above the component layer.** GOV.UK documents ~15 patterns; USWDS documents complete form journeys with trauma-informed content guidance baked in.
3. **Explicit dark mode / colour-scheme handling** in tokens.
4. **The `.gov` banner** as a standardised anti-phishing device.
5. **Real breadth of "ask users for…" identity patterns** (gender identity, sexual orientation, race and ethnicity), which GOV.UK largely leaves to the Equality information pattern.

**Where GOV.UK is stronger:**

1. **The focus state.** GOV.UK's yellow/black focus system is a single, universal, WCAG-2.2-1.4.11-proof treatment that works on every background in the palette. USWDS focus is a conventional outline and varies more by component.
2. **Content rules are enforceable.** GOV.UK's A-to-Z, banned-word list and reading-age target are auditable in a way USWDS's "use plain language" is not.
3. **Prescription over flexibility.** GOV.UK tells you what not to do (no HTML5 validation, no `required`, no on-blur validation, no steppers, no accordions for questions). USWDS mostly tells you what's available.
4. **"Exit this page"** and other harm-reduction components.

**A note on the accordion:** GOV.UK's own Accordion has a documented open concern — DWP reads the button-styled-as-link headings as a WCAG 4.1.2 failure, and GDS itself flags that users of speech recognition and element-list navigation may not recognise the section headings as buttons. Neither system is perfect here.

## 2.6 IRS Direct File — what was actually praised, 2024–2026

Direct File piloted in 2024 (12 states), scaled in 2025 (25 states), and was targeted for cancellation by the incoming administration. Built by the IRS with USDS, **Coforma**, **Truss**, and (for state filing) **Code for America**. It used USWDS rather than a bespoke UI framework.

**Measured outcomes (2025 filing season, IRS Direct File report):**

- **94% of respondents rated their overall experience "Excellent" or "Above Average"**, up from 90% the prior year.
- Net Promoter Score in the +80s.
- Code for America's **FileYourStateTaxes**: 2025 — **98% satisfied or very satisfied**; 2024 — NPS **83**, 9 in 10 would recommend, and **95% described the federal-to-state data transfer as "seamless and quick."**
- Post-participation survey completion was **26% among Spanish speakers vs 13% overall** — an unusually strong signal that the Spanish product was not an afterthought.

**What users specifically praised, in their own words (from the IRS report):**

> *"I really appreciate the simple, plain language. Even as, 'If this box contains other codes, that's okay.' It was like a person talking to me. I also appreciated all of the tooltips that I could click on for more [information]."*

> *"I appreciated the [pop]ups that explained what different parts of my tax forms [meant] to make me feel well informed."*

> *"Loved the 'Tips' on what forms (info) I needed to have on hand prior to starting my return."*

**The design decisions behind that:**

- **Plain language as an accuracy strategy, not a style preference.** The team framed it as a Venn diagram of *accuracy, easiness, brevity*, with **trust** underneath all three: SMEs and tax filers worked directly alongside designers, content strategists and researchers; plain language existed because *"users need to understand the words to get accurate and correct information."*
- **Explaining the "why" of each question**, deliberately, to build tax literacy rather than just extract data.
- **Fully bilingual, human-translated.** Content designers identified **5,600+ translation keys** and worked with Spanish-speaking users, not machine translation.
- **Accessibility designed in from day one.** Joint Engineering–Design accessibility training; a dedicated early study with disabled participants before the prototype was finished; comprehensive AT testing on the live beta with screen readers, magnifiers, Braille devices and speech input. Participants rated it **8 out of 10**.
- **A daily feedback loop across research, analytics and customer support.** The best-documented example: triangulating the three sources revealed that many returns were being rejected for incorrect prior-year Adjusted Gross Income. The team ran a mid-pilot sprint and wired in an API to import the value automatically — a mid-season fix to a rejection cause, which is unheard of in most government IT.

The transferable lesson is not any single screen. It is that Direct File shipped with a **research → analytics → support triangulation loop running daily during live operation**, and had the authority to change the product mid-season on what it found.

---

# PART 3 — Other highly-regarded systems

## 3.1 Singapore — SGDS, Singpass, gov.sg, ScamShield

**Singapore Government Design System (SGDS)** — <https://designsystem.tech.gov.sg>

Architecturally the most modern of the systems here. A strict two-tier token model:

- **Primitive tokens** name a hex: `sgds-blue-600`, `sgds-purple-600`. Seven colour families, scale 100–900, with **000 and 1100 added for dark-mode surfaces**. *"Shade 600 is the brand input each family scales around."* Grey uses `gray` in token names for Tailwind compatibility.
- **Semantic tokens** name the job: `sgds-link-color-default`, `sgds-purple-bg-default`, `sgds-purple-surface-default`, `sgds-purple-border-color-default`, `sgds-purple-color-emphasis`. *"A primitive colour token names a hex value. A semantic colour token names the job that value performs in the interface."*

Purple ramp, as a concrete example: `sgds-purple-100 #FBF0FE`, `200 #F2D6FC`, `300 #E6ADF9`, `400 #D983F6`, `500 #C94CF2`, `600 #AC1CDB`, `700 #8516A9`, `800 #641180`, `900 #460C5A`.

Semantic tokens are **theme-aware by default**: `sgds:text-purple-default` resolves to `#ac1cdb` in day mode and `#d983f6` in night mode, from the same token name. There's a `fixed` variant for cases that must not flip. SGDS also ships a **colour generator** for custom brand palettes and typography tokens that respond to screen size.

*"Using primitives directly in product code or design files is not recommended."* Same discipline as GOV.UK's "don't copy the hex", but expressed as a token architecture rather than a rule.

**Aesthetic:** bright, high-chroma, rounded, closer to a consumer product than a bureaucracy. Generous border radii, card-based layout, day/night parity, purple as a genuine brand accent alongside blue. Where GOV.UK reads as *sober civic infrastructure* and USWDS as *institutional*, SGDS reads as *a well-funded product company that happens to be the state*.

**Singpass** — the national digital identity, 5m users. The design lesson worth stealing is a *subtraction*: in **August 2023** the team redesigned the app login/consent screen after a two-week study with the "Tech Kaki" community, in which participants performed login tasks against different prototypes. The redesign *"display[s] only pertinent information, like the e-service name and colour-coded approval buttons, to encourage users to check the details carefully."* GovTech's own summary: *"Sometimes, less is really more."* This is a consent screen redesigned specifically as an **anti-phishing control** — the reduction in content exists to make the one important fact (which service is asking) impossible to skim past. Singpass also does QR/tap login (no password entry), digital document signing, an in-app inbox for government notifications, and in-person identity verification by QR scan, in English, Malay, Simplified Chinese and Tamil.

**ScamShield** — <https://www.scamshield.gov.sg>, built by **Open Government Products** with MHA, SPF and NCPC. Launched Nov 2020 as a call/SMS blocker; **rebuilt August 2024** around an AI classifier; **1.35m downloads** within about a year of relaunch. It is a *suite*, not an app: the **1799 helpline**, the app (iOS/Android), the website, and ScamShield Alert channels on WhatsApp and Telegram.

Interaction model that matters for any fraud-reporting service:

- **Check** — paste a phone number or link, **or upload a screenshot of a message**, and get an immediate verdict. This is the key move: it meets people in the format they actually have (a screenshot), not the format the database wants.
- **Warn before engagement** — if the classifier thinks it's a scam, the app flashes a warning *to dissuade the user from replying*, rather than merely logging a report.
- **Report** — submit suspected scams from the same surface.
- **Block/filter** — device-level call and SMS blocking.
- Planned: push notifications of new scam variants.

Design rationale, from the OGP designer's own writeup: data showed scams most affected **ages 20–39**, so the team ran multiple rounds of testing with a deliberately wide demographic spread to avoid over-fitting to the tech-savvy. On trust: *"Since ScamShield is a government-backed app, it was important for us to communicate that through its design. We borrowed familiar elements like 'verified by ScamShield' labels."* On scope: *"We avoided over-complicating the app by adding unnecessary features for every emerging scam trend."*

Singapore's broader stack — **FormSG** (government form builder), **Isomer** (static site templates), **RedeemSG**, **CDC Vouchers** — reflects a platform strategy: build the tool once, let agencies self-serve.

## 3.2 Estonia — eesti.ee and Veera

**Veera** ("Veebiraamistik" — web framework) is Estonia's e-service design system, owned by **RIA** (Riigi Infosüsteemi Amet, the Information System Authority). Launched 2018, based initially on the Tax and Customs Board's e-service style guide (designed by Velvet); pre-alpha in 2020 with a Figma component library plus HTML/CSS components; 1.0 later.

Distinctive properties:

- **Framework-agnostic by design.** *"Ready-to-use HTML and CSS components that can be used with any front-end framework."* Estonia's e-services are built by many different vendors, so Veera deliberately refuses to pick a JS framework.
- **Design tokens as the designer–developer contract.** The team automated hand-off via Figma Design Tokens and Figma Variables, with exactly two modes: **Light and Dark**. Their approach to generating dark mode is pleasingly blunt: split the base palette into 5 light and 5 dark tones and swap them. The honest retrospective is worth quoting — designers, not developers, owned token creation, and the result of hours of work was *"one Excel table with some variables"* rather than a visual design, which took adjustment.
- **Accessibility built into components** because Estonian public-sector e-services are legally obliged to be accessible.
- **Single-page Figma file** so it works on Figma's free tier — a real constraint-driven decision for small agencies.

**eesti.ee** itself: 500+ e-services, 500 articles, 2,500 contacts, ~18,000 visits per weekday. Helmes broke the monolith into **micro-frontends** built from Veera components, integrating with **Pääsuke** (the central authorisations management system). Nortal's UX work used a **Triple Diamond** process with 10 focus groups (65+ retirees, young people, families, accountants, foreigners, business owners, young professionals, the visually impaired, professionals). The signature feature is the **life-event–organised personalised dashboard** on login.

The specific problem Estonia names, which almost every federated government portal has and few admit: *"switching between different e-services sometimes entails entering another portal via eesti.ee. According to user feedback, this can have a disorienting effect as it involves a brief learning curve to navigate a new environment."* Veera exists primarily to kill that seam.

**Aesthetic:** restrained, blue-dominant, generous whitespace, card-based life-event navigation, minimal ornament. Closer to Nordic corporate than to GOV.UK's brutalism.

## 3.3 Netherlands — NL Design System and the Rijkshuisstijl

Two distinct things, and the distinction is the interesting part.

**Rijkshuisstijl** (<https://www.rijkshuisstijl.nl>) is the *Dutch government house style* — a designed national identity, not a web design system:

- **Lintblauw** ("ribbon blue") is the base colour: **`#154273`**, PMS 7462c, CMYK 100-45-06-28, RGB 21-66-115. Plus **17 communication colours**. Tints are functional only (tables, charts) — *"Use of the full colour is always preferred."*
- **Het Rijkslint** — the blue ribbon device beside the wordmark. It is the single most recognisable element of Dutch government identity and appears on every ministry's logo, with only the organisation name changing.
- **Typography:** two bespoke families, **Rijksoverheid Sans** (primary; used for body text *and* for titles, subtitles and large headings) and **Rijksoverheid Serif** (subordinate, optional; quotes, smaller headings, captions). Separate cuts exist for print, web, and road signage. The modernised house style uses a **variable font** for Sans (Serif is not variable). Print cut: *Sans Text* up to 11pt body, *Sans Heading* for larger sizes, each in regular/italic/bold/bold-italic; web cut in regular/italic/bold. **`Rijksoverheid Sans Sign Halo`** and `Sign Halo Inverted` exist purely for roadside information boards, legible from a moving car.
- **Licensing:** the webfonts, like the logo, may only be used for central government publications. Approved fallbacks for everyone else: **Arial, Verdana, Times New Roman**.
- Body text is preferentially **lintblauw**, with black or white permitted where accessibility demands it. Colour discipline: *"limit yourself to a maximum of one colour alongside lintblauw."*
- Button rules from the community: base colour lintblauw; **minimum height 48px including under responsive scaling**; **border radius = 10% of button height**; ≥3:1 contrast against background and ≥4.5:1 for the label against the button.

**NL Design System** (<https://nldesignsystem.nl>) is the opposite of a house style — it is *deliberately brand-independent*, and the mechanism is its most exportable idea.

**The Estafettemodel (relay-race model).** Components move through four public statuses:

| Status | Meaning |
|---|---|
| **Help Wanted** | wanted, not built |
| **Community** | exists somewhere; available in CSS and public Storybook; colour and typography implemented as design tokens; tokens prefixed with the responsible organisation's name and following NLDS naming conventions; EUPL-1.2 licence on code, CC0 on docs |
| **Candidate** | in the shared themes Storybook with visual regression tests, in the NLDS Figma library, used by 2+ organisations with different house styles, with accessibility and inclusion documentation |
| **Hall of Fame** | proven in production at **at least two different organisations**, passed an accessibility audit, semantic versioning with changelogs that communicate breaking changes clearly |

There is also an explicit **anti-status**: components that user research or accessibility guidance advises against *"will not be included in any of the NL Design System relay statuses"*, with an alternative named where possible. A design system that publishes a list of components you should *not* build is rare and useful.

*"Normally a design system is tied to a style. With NL Design System you have components that stand apart from a house style… This means one application can very easily be deployed for another organisation just by using a different theme."*

Real themes on this architecture: **Utrecht**, **Den Haag**, **Amsterdam**, and `rijkshuisstijl-community` (an explicitly unofficial, community-built Rijkshuisstijl implementation, not endorsed by the Ministry of General Affairs). Every component ships into a shared multi-theme Storybook at <https://nl-design-system.github.io/themes/>.

**Why it's notable:** the Netherlands solved the problem that blocks most federated design systems — municipalities and ministries with legally distinct visual identities that will never adopt a single brand — by separating the component contract from the token layer, and by making "used in production by two organisations with different house styles" a *promotion criterion*. Nothing gets blessed until it's survived a re-theme.

## 3.4 Canada — Canada.ca Specification, GC Design System

**Canada.ca Content and Information Architecture Specification** (<https://design.canada.ca/specifications/>) is the most *legally binding* system here: it is referenced in the **Directive on the Management of Communications** and applies to departments in Schedules I, I.1 and II of the Financial Administration Act. Large parts are marked **"Mandatory"**.

**Mandatory colour** (<https://design.canada.ca/styles/colours.html>):

- Background: **`#FFF`** — *"ensure that the majority of the page has a white background"*; any other background must meet **WCAG 1.4.6 Contrast (Enhanced), Level AAA** (7:1), not merely AA
- Text: **`#333`** (dark grey)
- Default link: **`#284162`**
- Selected link (hover/focus): **`#0535d2`**
- Visited link: **`#7834bc`**
- Main accent: **`#26374A`**
- Form error / required indicator: **`#d3080c`**
- Selected element in service-initiation templates: **`#333`**
- The signature red H1 underline: `#A62A1E`, **72px wide × 6px thick**, positioned **.2em (7.6px) beneath the H1**, left-aligned

**Mandatory typography** (<https://design.canada.ca/styles/typography.html>) — **Lato for headings, Noto Sans for body**:

| | Desktop/tablet | Mobile |
|---|---|---|
| H1 | Lato 41px bold | Lato 37px bold |
| H2 | Lato 39px bold | Lato 35px bold |
| H3 | Lato 29px bold | Lato 26px bold |
| H4 | Lato 27px bold | Lato 22px bold |
| H5 | Lato 24px bold | Lato 20px bold |
| H6 | Lato 22px bold | Lato 18px bold |
| Body | Noto Sans 20px | Noto Sans 18px |

Two things stand out: **20px body text** (larger than GOV.UK's 19px, far larger than the 16px web default), and the near-collapse of H1/H2 sizes (41 vs 39), which forces hierarchy to be carried by structure rather than scale. **Noto Sans Canadian Aboriginal** is included by default in the typography — the only system here that ships Indigenous-language script support as a baseline rather than an add-on.

**The task-centred approach** is the intellectual core:

> *"People visit Canada.ca to complete a task. A task is something a person has set out to do… All content supporting a task should be simple, consistent and predictable."*
>
> *"One question should drive all design decisions: does it help people succeed in completing the task?"*

Six design principles: focus on the task; design for trust; design for findability; design for comprehension; design for usability; design for accessibility and inclusivity.

Mandatory elements: the Canada.ca domain, mandatory styles (typography, colours, layouts), standard header and footer, a small set of high-level templates, and the Canada.ca topic tree.

**The user-testing-driven content model — with numbers.** This is what makes Canada.ca genuinely distinctive: they publish before/after task-success measurements.

*CRA tax-filing content redesign* (<https://design.canada.ca/research-summaries/taxfiling-research-summary.html>):

- Readability analysis found **24% of GST/HST and payroll page sentences were long** and **17% was passive**.
- Baseline: 17 participants, remote moderated, 10 tasks. **Findability 62%. Task success 48%.**
- Target: 80% success, or +20 percentage points.
- After redesign, 25 new participants, identical method: **Findability 62% → 90% (+28pts). Task success 48% → 76% (+28pts).**

Their six stated fixes: make top tasks visible using the words users search for; organise for the user's journey, not the org chart; match user language and define terms in plain language; group tasks in sequence; chunk long complex pages; group links rather than listing them.

*Wayfinding study* (<https://design.canada.ca/research-summaries/wayfinding-on-canada-ca>): **breadcrumbs are used in 4.7% of visits; the global menu in 2.6%.** People also used the menu mainly to find sign-in. The conclusion — de-emphasise the mega-menu, give sign-in its own affordance — is the opposite of what most government portals do.

**GC Task Success Survey** — running continuously since **January 2021**, offered to **about 1 in 10 visitors**. It asks them to (a) select the task they came to do from a list with a write-in fallback, (b) confirm whether they completed it, (c) if not, select why (again with a write-in), and (d) rate ease and satisfaction. The point is standardisation: results are comparable across departments and over time, which moderated usability testing never is. *"The goal is not for the government to successfully communicate about it. The goal is for the people who use the program or service to be successful."*

**GC Design System** (<https://design-system.alpha.canada.ca>) is the newer component library layer beneath the Specification.

**Aesthetic:** utilitarian, heavy on the red/dark-navy federal signature, dense link lists, minimal chrome, ruthlessly text-first. Less refined than GOV.UK, but backed by more published evidence per design decision than any other system on this list.

## 3.5 Australia — AGDS/GOLD, myGov, the Digital Service Standard

The Australian story is a cautionary one worth knowing. The **Australian Government Design System** at designsystem.gov.au was **decommissioned by the DTA in 2021** (announcement: <https://community.digital.gov.au/t/dta-design-system-has-been-decommissioned/4649>; both `govau/design-system-components` and `govau/design-system-site` are archived). It fragmented into:

- **GOLD Design System** (Government Open Language for Design) — the community continuation, docs at <https://gold.designsystemau.org/>, packages migrated from `@gov.au/*` to `@gold.au/*` (e.g. `@gov.au/buttons@3.0.8` → `@gold.au/buttons@4.0.0`).
- **AgDS** (<https://design-system.agriculture.gov.au/>) — Department of Agriculture, Fisheries and Forestry, built by Thinkmill, *"built on the visual language and design principles of the original… GOLD."* Roughly **doubled** GOLD's component count and added documented templates and patterns for the export service. Themeable: wrap the app in a `Core` component and pass a `Theme`; light and dark palettes each composed of **backgrounds, foregrounds and system colours**; they extended the token schema with an **accent** token when the export service needed a distinctly-coloured strip. Default theme is `GOLD`; DAFF products extend `ag-Theme`.
- **`@truecms/*`** — a Node-22 modernisation fork mirroring the legacy `@gov.au/*` tags so agencies aren't stranded.
- **digital.gov.au design system** (<https://github.com/dta-au/design-system>, created May 2026) — the DTA's newest effort, atomic/component-based, built on the open-source **CivicTheme** base, shipping `@dta-au/designsystem-sdc` and `@dta-au/designsystem-twig` with Drupal SDC integration and an SBOM supply-chain gate.
- Plus healthy state systems: NSW, Queensland.

**Digital Service Standard** (<https://architecture.digital.gov.au/standard/digital-service-standard>) — since **1 July 2025** it applies in full to all new, replacement *and existing* public-facing government digital services. **myGov integration is required for most new public-facing services for individuals.** The **myGov authentication pattern** lets people sign in with username/password, **Digital ID**, or a **passkey**, manage their own 2FA choice, and — the good bit — *"skip the myGov authenticated space and go directly to the Government online service."* An authentication hub that deliberately lets you bypass the hub.

**The lesson:** Australia is the clearest evidence that a government design system is a **funded product, not an artefact**. Withdraw the funding and it forks into five, agencies re-solve the same problems, and citizens get inconsistency. Any pitch for a national design system should budget for permanent maintenance or expect the Australian outcome.

## 3.6 New Zealand

**NZ Government Design System** (<https://design-system-alpha.digital.govt.nz>, guidance at <https://www.digital.govt.nz/standards-and-guidance/design-and-ux/new-zealand-government-design-system>). Still labelled **alpha**; last substantive update December 2023. Honest about its lineage: *"Guidance, original HTML and CSS derived from GOV.UK Design System."*

The genuinely original bit is **how the palette was derived**: *"Colour choice for the design system was based on a survey of the palettes used on websites of 15 core New Zealand government agencies. We grouped these colours by hue and brightness, and discovered they fell into distinct categories. These categories formed the basis of our colour structure."* An empirically-derived palette structure rather than a designed one — a smart move when you have no authority to mandate a single brand.

Structure: a **Slate** grey suite used for all text and core UI (input borders, checkboxes) plus a tint range for graphics; **UI colours** as accessible traffic-light states for success/warning/error; **text colour** combinations pre-tested per background; **core all-of-government brand colours** used only as prescribed. Themes (Default/Light/Dark) are demonstrated with a live example that preserves your typed input as you switch — a small, thoughtful touch.

**Typography guidance** is unusual and worth copying: *"In our design system, the font size is independent of the heading hierarchy. This allows for design flexibility."* Semantic `<h1>`–`<h6>` for structure; size chosen separately. Three paragraph sizes: large (lead/summary), medium (body — the majority), small (notes and references, *"use it sparingly"*). Font choice is deliberately unresolved: *"We are investigating how font choice will be incorporated into the design system, in order to meet New Zealand language requirements"* — te reo Māori macrons and Pacific-language diacritics.

Content rules: links blue and underlined; *"If your link is at the end of a sentence or paragraph, make sure that the linked text does not include the full stop."* Bulleted lists introduced with a stub sentence ending in a colon, lowercase items, no terminal full stops, each item grammatical when read after the stub. Numbered lists only when order matters. Standard: **NZ Government Web Accessibility Standard / WCAG 2.1 AA**. Framework support: Silverstripe, React, Vue, Mustache.

## 3.7 Denmark and Norway

**Denmark — Det Fælles Designsystem** (<https://designsystem.dk>). The shared design system behind **borger.dk** (citizens) and **Virk** (business). Typeface: **IBM Plex**. A shared neutral grey base palette with distinct portal colours for borger.dk and Virk on top. Denmark's structural advantage is upstream of the design system: **NemID/MitID** and **Digital Post** mean a Dane's identity and their official mail are solved national infrastructure, so individual services don't re-implement authentication or notification. The design system's job is narrower and therefore cleaner.

**Norway — Designsystemet** (<https://designsystemet.no>), by **Digdir** (Norwegian Digitalisation Agency). Packages: `@digdir/designsystemet-react`, `@digdir/designsystemet-css`, `@digdir/designsystemet-theme`. Multi-brand from the start: `altinn`, `digdir`, `tilsynet`, `brreg`, all as separate token bundles, CSS variables prefixed `--fds-` (`padding: var(--fds-spacing-1)`).

Three things stand out:

1. **A hosted theme builder** at <https://theme.designsystemet.no> that round-trips a JSON config. Altinn's documented workflow is: paste `designsystemet.config.json` → edit visually → export → `pnpm build-tokens`. Theming is a first-class product, not a doc page.
2. **Data attributes as the API surface.** `data-color-scheme="light | dark | auto"`, `data-size="sm | md | lg"`, `data-color="..."`. Density and colour scheme are set declaratively on a wrapper rather than through props or class permutations.
3. **`background` and `color` are set on `<body>` by the library**, explicitly citing W3C guidance on resize-text, to guarantee consistent contrast rather than trusting each app.

**Typography: Inter**, and their criteria for choosing it are the most explicit font-selection rationale in any government design system:

- open font licence + active community
- large family (light, regular, italic, bold, semibold)
- recognisable letters, numbers and special characters (not too creative)
- clear ascenders and descenders
- visible difference between similar characters (I, l, 1) — *"must be activated"*
- open letters that don't close up (a, e, c)
- consistent stroke thickness in transitions
- tabular numbers
- variable font
- good letter and word spacing
- language support

And the resulting mandate, which is the single best small detail in this entire brief:

```css
font-family: 'Inter', sans-serif;
font-feature-settings: 'cv05' 1; /* Enable lowercase l with tail */
```

> *"Inter uses a lowercase 'l' without a tail by default. This can be confused with an uppercase 'I'. To improve readability and avoid confusion, we recommend enabling a tail on the lowercase 'l'."*

A national design system shipping a specific OpenType feature flag to disambiguate `I` from `l` is exactly the level of care that matters when users are transcribing reference numbers. Font weights 400/500/600, hosted at `https://altinncdn.no/fonts/inter/v4.1/inter.css` with an SRI hash.

**Aesthetic (both):** Scandinavian-modern. Generous whitespace, restrained palette, soft radii, Inter/IBM Plex neutrality, first-class dark mode. Warmer and more contemporary than GOV.UK, less playful than Singapore.

## 3.8 Ontario, Nova Scotia, California

**Ontario Design System** (<https://designsystem.ontario.ca>) — the most sharply-specified sub-national system.

- **Type: "Raleway modified" for headings, Open Sans for body.** The "modified" is not cosmetic — Ontario patched Raleway to add characters it lacked (French accents, Indigenous-language characters). A province modifying an open-source typeface for its own linguistic requirements is a good precedent.
- **Text `#1A1A1A` on `#FFFFFF`.** Near-black rather than pure black, same instinct as GOV.UK's `#0b0c0c`.
- Full scale, with **explicit line-length caps in the type spec itself** — an unusual and excellent idea:

| | Mobile | Desktop | Line length |
|---|---|---|---|
| H1 | Raleway modified 32px / 1.29 / 700 / 0.04rem | 40px / 1.2 / 700 / 0.04rem | 70rem |
| H2 | 27px / 1.37 / 700 / 0.03rem | 33px / 1.33 / 700 / 0.02rem | 48rem |
| H3 | 23px / 1.39 / 700 / 0.02rem | 28px / 1.43 / 700 / 0.02rem | 48rem |
| H4 | 20px / 1.5 / 700 / 0.03rem | 24px / 1.5 / 700 / 0.0313rem | 48rem |
| H5 | 18px / 1.56 / 700 / 0.03rem | 19px / 1.5 / 700 / 0.025rem | 48rem |
| H6 | 16px / 1.56 / 700 / 0.03rem | 16px / 1.5 / 700 / 0.025rem | 48rem |
| Body | Open Sans 16px / 1.6 / 400 | 16px / 1.6 / 400 | 48rem |
| Lead | Open Sans 20px / 1.6 / 400 | 22px / 1.6 / 400 | 70rem |

- Tokens ship as **`@ongov/ontario-design-system-design-tokens`**, output as **both SCSS and CSS custom properties**, organised into breakpoints, colour (greyscale / system / accent), fonts, global, sizes, spacing, weights, z-index. Then `-global-styles` (base, no components) and `-complete-styles` (everything). Adding a colour is literally editing `tokens/colour/base.json`, which then exposes `$ontario-colour-accent-dark-new-colour`.

**Nova Scotia** does not have a single unified provincial web design system in the GOV.UK sense; provincial entities work from separate brand guidelines (Invest Nova Scotia, for instance, uses Greycliff CF for communications and Proxima Nova on the web). Treat it as a brand-guideline jurisdiction, not a design-system one.

**California** runs the **CAWeb design system** / State Web Template (<https://designsystem.webstandards.ca.gov>, <https://caweb.cdt.ca.gov>) under the CDT, governed by the State Web Standards. Its distinguishing feature is delivery model rather than aesthetics: CAWeb is offered as a **hosted, centrally-maintained WordPress service** that departments subscribe to, which sidesteps the usual problem of a design system that agencies simply never adopt. Practically, California's most-cited citizen-service UX work happens outside the design system — **GetCalFresh** and **CalFresh** with Code for America, and the **CA Design Standards** work on benefits access (see §4).

## 3.9 Germany — KERN and DigitalService

**KERN UX-Standard** (<https://kern-ux.de>) — *"the UX standard for German public administration."* Not merely a design system: a technology-independent, open-source UX standard spanning **municipal to federal** level, which matters enormously in a country where administration is genuinely federal and a citizen may hit a Kommune, a Land and the Bund in one journey.

Technical shape:

- **HTML/CSS-based core**, with framework adapters for React, Angular, Vue, TYPO3, Blazor and Web Components. The underlying code base is **KoliBri**.
- **Multi-theming** for per-organisation branding.
- Foundations cover design tokens, layout, colour, typography, sizes and spacing, icons — plus **design principles, accessibility information, and language/tone guidelines**, which KERN explicitly frames as the difference between a design system and a styleguide.
- **Accessibility "by design"**: components meet at least **AA under BITV 2.0**, aligned to WCAG and EN 301 549. KERN is careful about the limits of that claim: *"This does not mean that a service developed with it is automatically accessible. Accessibility must be developed and verified in the overall context. The responsibility lies with the implementing teams, not with KERN."*
- Supports §7 OZG 2.0, the service standard, and DIN SPEC 66336. D-Stack-compatible. Community of **600+ experts**. In production.

**The Digitale Dachmarke (digital umbrella brand)**, adopted by the **IT-Planungsrat in 2024**, has exactly four elements — and this is the cleanest articulation of "how a citizen knows this is really the government" that any country has produced:

1. **Kopfzeile** — a narrow bar at the top of the page identifying the site as an official state offering (the German analogue of the USWDS banner)
2. **Bildwortmarke** — a modern interpretation of the Bundesadler representing all federal levels
3. **Domain-Name** — the **`.gov.de`** ending, *"makes the state sender recognisable and creates security"*
4. **Designsystem** — KERN

**DigitalService** (<https://digitalservice.bund.de>) — the federal government's in-house digital unit, which built Grundsteuererklärung für Privateigentum and similar services. Their 2024–25 decision is a strong endorsement: *"Although we have developed our own component libraries and design systems in recent years, we are not continuing this work. Instead, in existing and new projects at DigitalService, wherever possible, we will use the KERN design system."* They combine KERN components with the larger **service patterns** of the GovStack toolkit, and contribute their pattern work back where KERN has gaps.

**Aesthetic:** sober, high-contrast, function-first, closer to GOV.UK than to Singapore. The interesting contribution is governance, not visuals — a genuinely federal, multi-level, multi-vendor UX standard with legal hooks (§7 OZG 2.0) and a named umbrella brand.

---

# PART 4 — Anti-patterns: what makes citizens abandon or distrust a government service

**A note on sourcing.** A large volume of "2026 form abandonment statistics" circulating online comes from SEO content farms citing studies that do not appear to exist (fabricated Forrester, Gartner, Baymard and NNGroup attributions with suspiciously precise figures). I have excluded those. Everything below is traceable to a primary source: a government research summary, a Code for America publication, a peer-reviewed article, a GAO report, or a design system's own guidance.

## 4.1 Length and question count — the most measurable killer

The best-evidenced numbers in this entire field come from Code for America's SNAP work (*The ANNALS of the American Academy of Political and Social Science*, doi:10.1177/00027162231205391, plus Code for America's own reporting):

- California's original online SNAP application: **200 questions across 55 unique screens**, taking **45–55 minutes**, non-mobile-optimised, split across three different county websites.
- **GetCalFresh** today: an SSI recipient in a single-person household sees **38 questions across 33 screens** and completes in **about 12 minutes** (the 2019 launch figure was "under 10 minutes"; the current published average is 12).
- **Minnesota**, with Code for America, bundled applications for **nine benefits programs** and cut application time from **110 minutes to under 20**.
- The mechanism is **skip logic** — never render a question that cannot apply to this applicant. *"Making use of this simple technology when building online applications reduces time and cognitive load burdens for applicants."*

The counterintuitive finding in that same body of work: **shortening a form can make the data more accurate, not less.** When GetCalFresh's income question was imprecise, applicants systematically under-reported income, and **roughly 30% of denied GetCalFresh applicants in one year were denied because their reported income exceeded eligibility limits**. Splitting one income question into separate *earned* and *unearned* questions cut applications over the gross limit by **2.2 percentage points** in the two weeks after the change, and shifted the submitted-vs-abandoned income distributions apart — i.e. ineligible people self-selected out earlier, and were routed to food banks and 211 instead.

**Design implication:** every question you add costs completion; every *ambiguous* question costs accuracy, which costs the applicant a denial three weeks later. Both are abandonment, one is just deferred.

## 4.2 Self-categorisation — making people diagnose their own problem

The single most damaging pattern in crisis and complaint services: opening with a dropdown or radio list asking the user to classify their own situation into the agency's taxonomy before they can proceed.

The evidence is indirect but consistent:

- **Canada.ca's CRA study** found task success at **48%** against findability of **62%** — a 14-point gap meaning that even when people reached the right page, more than one in five still failed. The named fixes were all about vocabulary and structure: *"Match user language: not everyone understands terminology, reduce ambiguity and include plain language definitions"* and *"Make top tasks visible: include keywords users are looking for and understand in doormats and labels."*
- **Canada.ca's wayfinding data** — breadcrumbs used in **4.7%** of visits, the global menu in **2.6%** — says people do not navigate government taxonomies at all. They search, they scan, they follow the first plausible link.
- **GDS's answer** is the *Check a service is suitable* pattern: rather than asking "which category are you?", **ask a series of simple questions and compute the category yourself**, then show a results page. Explicitly: *"automatically work out what a user needs to know."*
- **Code for America's** equivalent is skip logic plus splitting compound questions until each one asks about a fact the person actually knows.

The rule: **never ask a user to name their problem in your vocabulary. Ask them facts they know, and derive the classification.** A fraud victim knows "someone called me pretending to be from my bank and I sent money"; they do not know whether that is "vishing", "impersonation fraud" or "unauthorised push payment fraud."

## 4.3 Session timeouts

Government services are the last major category of web service that routinely destroys user work on a timer. The pattern is: a 15–20 minute inactivity timeout where "inactivity" means "no HTTP request", so a user carefully reading a page, finding a document, or typing into a single long page is counted as idle. They click Continue; the session is gone; the application restarts from the beginning.

Commercial services solved this a decade ago by autosaving. GDS's own architecture is the fix: **one thing per page** exists partly so that *"you can save a user's answers automatically as they go"* — with a page per question, every Continue is a save point, and a timeout costs one question rather than an hour.

GOV.UK's **Complete multiple tasks** pattern is the other half: show the task list *"at the start of each returning session"*, and let users complete tasks *"over a number of sessions"* by design.

**Design rules that follow:** autosave server-side on every page transition; if a timeout is legally required, warn before it fires with a dialog offering "Continue" and a countdown; on expiry, land the user on a page that says what happened and offers a resume link, never a blank login screen; never lose entered data.

## 4.4 CAPTCHA

CAPTCHA is a security control paid for entirely by the least capable users. Concrete problems, all documented:

- Image-grid challenges fail people with low vision, colour vision deficiency, motor impairment and cognitive disability, and are effectively impossible for screen-reader users unless an audio alternative exists — and audio CAPTCHA fails deaf and hard-of-hearing users and anyone with poor audio or a noisy environment.
- Lockout after N failures converts a UX problem into a total service denial requiring a phone call.
- On mobile, small touch targets in image grids compound the failure rate.
- Modern invisible/risk-scored alternatives (reCAPTCHA v3, Cloudflare Turnstile, hCaptcha in passive mode) provide comparable bot protection with **zero** user interaction in the overwhelming majority of sessions.

Note the design-system silence as evidence: **neither the GOV.UK Design System nor USWDS ships a CAPTCHA component.** Neither has ever documented one. That absence is a position.

**Design rule:** if you must have bot protection on a citizen-facing form, use invisible risk scoring; if a challenge is unavoidable, never lock out, always offer a non-visual alternative, and always offer a phone or in-person route that bypasses it entirely.

## 4.5 Mandatory account creation

Forcing registration before a one-time transaction is a documented driver of abandonment in government payment and reporting portals: it demands an email the user may not have, a password they'll forget, an MFA method they may not be able to receive, and an identity-verification step, all before the task has begun.

The good counter-examples are all about **making the account optional or deferred**:

- **Australia's myGov authentication pattern** explicitly lets users *"skip the myGov authenticated space and go directly to the Government online service"*, and offers three credential types (username/password, Digital ID, passkey) with user-managed 2FA.
- **Login.gov** treats **in-person proofing at a Post Office as a first-class initial option**, not a fallback after online failure.
- **GOV.UK's start-page pattern** requires the start point to *"let users sign in, resume an application they've already started or update their details (**if relevant**)"* — the parenthesis is doing real work.
- **ScamShield** requires no account to run a Check.

**Design rule:** collect the account at the *end*, as a way to save and track, not at the start as a gate. If you need to identify the person, do it as late in the flow as the law allows.

## 4.6 Hidden content

Accordions, tabs, details/summary and "read more" links all hide content, and hidden content is missed. GDS's position: *"Accordions hide content from the user. Not all users will notice them or understand how they work."* DWP's is sharper: *"When we hide content away in collapsible components it's often because we have not done a very good job of explaining something, or we are trying to put too much content on the page."*

GOV.UK's inset-text guidance names the same failure from the other direction: *"Some users do not notice inset text if it's used on complex pages or near to other visually prominent elements."*

The hard rule from GDS: **"Do not use accordions to split up a series of questions. Use separate pages instead."**

## 4.7 Progress indicators that overpromise

Covered in §1.1. The headline: **the Carer's Allowance team removed a 12-step progress indicator with no effect on completion rates or times**, and GDS documents six specific reasons the full-stepper pattern fails (not noticed, space-hungry, doesn't scale on small screens, distracting, hard to label, breaks on conditional sections).

USWDS permits the step indicator but hedges it: three-or-more high-level steps only, linear only, not navigation, and *"omit [counters] if testing proves that this reinforcement is unnecessary."*

**The synthesis:** a *task list* (non-linear, resumable, honest about what's left) beats a *stepper* (linear, fixed, lies as soon as branching exists) for anything longer than a few pages.

## 4.8 Distrust signals

What makes a citizen doubt they're on the real site, or that the state will act:

- **No official-site marker.** Solved by the USWDS `.gov` banner, Germany's four-part Digitale Dachmarke (`Kopfzeile` + Bundesadler + **`.gov.de`** + KERN), and the UK's crown/wordmark plus `service.gov.uk`. Germany's is the most complete because the domain suffix is part of the identity design.
- **Visual inconsistency between services.** This is the founding argument for every system here. Estonia names the mechanism precisely: switching portals mid-journey *"can have a disorienting effect as it involves a brief learning curve to navigate a new environment."* Canada.ca's answer is a mandatory header, footer and colour set backed by a Directive.
- **PDFs as the primary format.** *"Compared with HTML content, information published in a PDF is harder to find, use and maintain."* PDFs also rot silently — a stale PDF is a trust failure, not just a usability one.
- **Dead ends with no next step.** GDS: if a user isn't eligible, *"explain why and, if possible, tell them what they should do instead."* Code for America routes ineligible CalFresh applicants to their local food bank and 211 rather than ending on "You do not qualify."
- **Silence after submission.** GetCalFresh's SMS milestone confirmations exist because a submitted application with no acknowledgement feels identical to a lost one.
- **Blame-shaped error messages.** USWDS: *"Any system or validation messaging should be free of blame and avoid alarming users."* GDS bans "forbidden", "illegal", "you forgot", "prohibited", "invalid".
- **Asking the same thing twice.** Signals that nobody read the first answer.
- **Consent screens that can't be read.** Singpass's August 2023 login redesign reduced the consent screen to the e-service name and colour-coded buttons *specifically* so users would actually check who was requesting access — a direct anti-phishing intervention.

## 4.9 A short checklist

| Anti-pattern | Replace with | Evidence |
|---|---|---|
| Long single-page form | One thing per page + skip logic | GetCalFresh 200q/55 screens → 38q/33 screens; 45–55 min → ~12 min; MN 110 → <20 min |
| "Select your issue type" opener | Derive the category from factual questions | GOV.UK *Check a service is suitable*; Canada.ca "match user language" |
| Session timeout that destroys work | Autosave per page + warn + resume link | GDS: one-thing-per-page enables autosave; *Complete multiple tasks* is resumable by design |
| CAPTCHA challenge | Invisible risk scoring; never lock out; always an offline route | No CAPTCHA component exists in GOV.UK DS or USWDS |
| Mandatory account before task | Defer the account; offer passkey/Digital ID; offer in-person | myGov skip-the-hub; Login.gov in-person proofing as a first-class option |
| Accordion hiding questions | Separate pages | GDS: *"Do not use accordions to split up a series of questions."* |
| 12-step progress bar | Simple caption, or a task list | Carer's Allowance removed one with no effect on completion |
| "An error occurred" | "Enter your full name" / "Name must be 35 characters or less" | GDS error-message rules |
| Content only as PDF | HTML first, PDF only in addition | gds.blog 2018-07-16 |
| Silent submission | Confirmation page + SMS/email milestones | GetCalFresh SMS confirmations |
| Dead-end ineligibility | Explain why + name the alternative | GDS *Check a service is suitable*; CfA routes to food banks / 211 |

---

# Appendix — primary sources

**GOV.UK**
- Design System: <https://design-system.service.gov.uk>
- Brand guidelines: <https://brand.design-system.service.gov.uk/colour/web/>
- Service Manual, form structure: <https://www.gov.uk/service-manual/design/form-structure>
- A to Z of GOV.UK style: <https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style>
- Writing for GOV.UK: <https://www.gov.uk/guidance/content-design/writing-for-gov-uk>
- Changes to GOV.UK (brand refresh, 25 June 2025): <https://www.gov.uk/guidance/changes-to-govuk>
- govuk-frontend v6.0.0 release notes: <https://github.com/alphagov/govuk-frontend/releases/tag/v6.0.0>
- Source: `packages/govuk-frontend/src/govuk/settings/` (`_colours-palette.scss`, `_colours-functional.scss`, `_typography-responsive.scss`, `_typography-font.scss`, `_measurements.scss`, `_links.scss`) and `helpers/_focused.scss`
- Why HTML not PDF: <https://gds.blog.gov.uk/2018/07/16/why-gov-uk-content-should-be-published-in-html-and-not-pdf/>
- DWP Accessibility Manual: <https://accessibility-manual.dwp.gov.uk/guidance-for-your-job-role/interaction-designer>
- Task list backlog discussion (the "2 of 6" counter): <https://github.com/alphagov/govuk-design-system-backlog/issues/72>

**USWDS / US**
- <https://designsystem.digital.gov> (design tokens: color, spacing-units, typesetting; components: banner, identifier, step-indicator, process-list, summary-box, site-alert, alert; patterns: complete-a-complex-form)
- Login.gov frontend: <https://github.com/18F/identity-idp/blob/main/docs/frontend.md>
- GAO-26-109261 (Login.gov identity verification): <https://www.gao.gov/assets/gao-26-109261.pdf>
- IRS Direct File report 2025: <https://taxpayer-rights.org/wp-content/uploads/2025/06/2025-14762.pdf>
- Coforma case study: <https://coforma.io/case-studies/irs-direct-file>
- Truss on Direct File accessibility: <https://truss.works/blog/why-irs-direct-file-is-so-accessible>
- Code for America, FileYourStateTaxes: <https://codeforamerica.org/success-stories/making-it-easier-for-people-to-file-state-taxes/>
- Code for America, GetCalFresh: <https://codeforamerica.org/programs/social-safety-net/food-benefits/> and <https://codeforamerica.org/news/overcoming-barriers-finding-better-ways-to-ask-getcalfresh-applicants-about-income/>
- Peer-reviewed: doi:10.1177/00027162231205391

**Singapore** — <https://designsystem.tech.gov.sg/foundations/colour/primitive-colour>, `/semantic-colour`, `/design-tokens`; <https://www.tech.gov.sg/products-and-services/for-citizens/scam-prevention/scamshield/>; <https://opengovsg.substack.com/p/behind-the-scenes-of-the-enhanced>; <https://www.tech.gov.sg/technews/govtech-turns-7/>

**Estonia** — <https://www.twn.ee/en/blog/feasibility-automating-design-and-development-our-lessons-building-veera-design-system>; <https://www.helmes.com/reference/transforming-estonias-state-portal-the-impact-of-micro-frontend-architecture-on-e-services/>; <https://nortal.com/insights/seamless-service-design-for-estonian-state-portal/>

**Netherlands** — <https://nldesignsystem.nl/handboek/estafettemodel/>; <https://github.com/nl-design-system/documentatie/blob/main/docs/handboek/definition-of-done/README.mdx>; <https://www.rijkshuisstijl.nl> (colour ItemId=6744, typography ItemId=6745 and ItemId=10512)

**Canada** — <https://design.canada.ca/styles/colours.html>; <https://design.canada.ca/styles/typography.html>; <https://design.canada.ca/specifications/design-content.html>; <https://design.canada.ca/research-summaries/taxfiling-research-summary.html>; <https://design.canada.ca/research-summaries/wayfinding-on-canada-ca>; <https://blog.canada.ca/2022/03/23/task-success.html>; <https://blog.canada.ca/2020/02/05/method-to-measure.html>; <https://design-system.alpha.canada.ca/en/>

**Australia** — <https://architecture.digital.gov.au/standard/digital-service-standard>; <https://design-system.agriculture.gov.au/>; <https://designsystemau.org/posts/celebrating-the-launch-of-gold-design-system/>; <https://github.com/dta-au/design-system>

**New Zealand** — <https://design-system-alpha.digital.govt.nz/basics/colours/>, `/basics/typography/`, `/basics/themes/`; <https://www.digital.govt.nz/standards-and-guidance/design-and-ux/new-zealand-government-design-system>

**Denmark / Norway** — <https://designsystem.dk/>; <https://designsystemet.no/en/fundamentals/theme/typography>; <https://designsystemet.no/en/fundamentals/code/setup>; <https://theme.designsystemet.no>; <https://github.com/Altinn/altinn-components>

**Ontario / California** — <https://designsystem.ontario.ca/components/detail/fonts-and-typography.html>; <https://www.npmjs.com/package/@ongov/ontario-design-system-design-tokens>; <https://designsystem.webstandards.ca.gov/>

**Germany** — <https://www.kern-ux.de/>; <https://www.kern-ux.de/develop/design-system/>; <https://www.kern-ux.de/2.0.6/barrierefreiheit/>; <https://docs.fitko.de/en/resources/kern/>; <https://digitalservice.bund.de/blog/mit-patterns-und-system-gute-digitale-services-effektiv-und-effizient-gestalten>

# Trauma-Informed & Crisis-Oriented Digital Service Design
## Research brief for a reimagined India National Cyber Crime Reporting Portal (NCRP)

**Compiled:** August 2026
**Scope:** Trauma-informed design theory and practice; cognitive degradation under acute stress; quick-exit / safety-exit patterns; teardowns of real crisis and scam-reporting services; crisis copywriting.
**Bias of this brief:** verbatim copy, exact mechanics, numbers, and URLs. Where a claim is contested, it is flagged.

---

# PART 1 — TRAUMA-INFORMED DESIGN PRINCIPLES

## 1.1 SAMHSA's six principles — the canonical source

**Source:** SAMHSA, *SAMHSA's Concept of Trauma and Guidance for a Trauma-Informed Approach*, HHS Publication No. (SMA) 14-4884, 2014.
**URL:** https://library.samhsa.gov/sites/default/files/sma14-4884.pdf

SAMHSA is explicit that this is a *values framework*, not a checklist:

> "A trauma-informed approach reflects adherence to six key principles rather than a prescribed set of practices or procedures. These principles may be generalizable across multiple types of settings, although terminology and application may be setting- or sector-specific."

The six principles, verbatim:

1. **Safety**
2. **Trustworthiness and Transparency**
3. **Peer Support**
4. **Collaboration and Mutuality**
5. **Empowerment, Voice and Choice**
6. **Cultural, Historical, and Gender Issues**

SAMHSA also defines the **"Four R's"** that precede the principles: a trauma-informed program **Realizes** the widespread impact of trauma, **Recognizes** signs and symptoms, **Responds** by integrating knowledge into policies and practices, and actively **Resists re-traumatization**.

Critically for a government reporting portal, SAMHSA states that implementing a trauma-informed approach **does not require the person to disclose their trauma**. You assume prevalence and design accordingly. (This is echoed in the CHI 2022 trauma-informed computing paper: "implementing a trauma-informed approach does not require individuals to disclose their trauma or personal history; by assuming the prevalence of trauma and implementing trauma-informed principles in every area of work, trauma-informed organizations serve everyone better.")

### Translation table: SAMHSA principle → concrete NCRP decision

| SAMHSA principle | What it means in a cybercrime reporting UI |
|---|---|
| **1. Safety** | Persistent quick-exit on every page (see Part 3). No autoplay video, no sound, no unexpected imagery of distress. No surprise navigation. Session data never rendered in a URL. Explicit statement, above the fold, of *who can see this report*. Warn before any action that could tip off a perpetrator (e.g. "Changing your password may alert the person monitoring your device"). Click-to-call `tel:` links for 1930 so a shaking hand never has to transcribe a number. |
| **2. Trustworthiness & Transparency** | State up front, in one sentence each: what happens to the report, who reads it, how long it takes, what you cannot do. Never imply a guarantee you cannot keep. Show a real, dated status ("Your bank was sent a hold notice at 14:12 today") rather than a generic "In progress". Publish the retention period for uploaded evidence. |
| **3. Peer Support** | "You are not alone" backed with a real number, not a slogan ("Over X reports of this exact scam were filed in your state last month"). Link to survivor-run and NGO support (not only police). Optional, never mandatory. |
| **4. Collaboration & Mutuality** | Reduce the power asymmetry of citizen-vs-police. Let the user *correct* the officer's record. Ask "Have we understood this correctly?" before submission. Offer "I want to report but I do not want to be contacted" as a first-class option. Co-design with victims and with the police station staff who receive the reports. |
| **5. Empowerment, Voice and Choice** | Every sensitive field optional with an explicit **"I'd rather not say"** radio, not just a blank box. Save-and-return with a resumable code. "Skip this section" on every block. Let the user choose channel (form / phone / assisted). Let the user choose how much narrative detail to give — free text as an *option*, never a gate. |
| **6. Cultural, Historical & Gender Issues** | Full parity across the 22 scheduled languages, not English-first with degraded translations. Do not gender the victim in copy. Recognise that for many Indian users the *police station* itself is a site of historical fear — offer a path that does not require walking into one. Elder-friendly type scale and phone-first paths. Content that does not assume literacy in English financial jargon ("UPI mandate", "APP fraud", "SIM swap" all need plain-language glosses in-line). |

### The UK government's parallel definition

**Source:** UK Office for Health Improvement and Disparities, *Working definition of trauma-informed practice*, GOV.UK
**URL:** https://www.gov.uk/government/publications/working-definition-of-trauma-informed-practice/working-definition-of-trauma-informed-practice

The UK adopted a six-principle version with slightly different naming — **safety, trust, choice, collaboration, empowerment and cultural consideration** — and is explicit about scope:

> "The purpose of trauma-informed practice is not to treat trauma-related difficulties, which is the role of trauma-specialist services and practitioners. Instead, it seeks to address the barriers that people affected by trauma can experience when accessing health and care services."

**Design implication:** the NCRP is not a therapy product. Its trauma-informed job is to *remove barriers to reporting*, not to counsel. Don't build a mood-check-in. Do build a save button.

---

## 1.2 Melissa Eggleston (with Lesley-Ann Noel) — the "pyramid" model

Eggleston is the most operationally useful practitioner in this space because she refuses to treat trauma-informed design as a separate discipline.

**Primary sources:**
- Eggleston, M. & Noel, L-A. (2024). *Trauma-Informed Design: Leveraging Usability Heuristics on a Social Services Website.* Journal of Usability Studies. https://uxpajournal.org/trauma-informed-design-leveraging-usability-heuristics-on-a-social-services-website/
- Eggleston, M. & Noel, L-A. (2024). *Repairing the Harm of Digital Design Using a Trauma-informed Approach.* Diseña 24, Article 7. https://doi.org/10.7764/disena.24.article.7
- https://www.melissaegg.com/trauma-informed
- https://www.melissaegg.com/blog/your-website-might-be-hurting-people-how-to-fix-that
- https://www.melissaegg.com/blog/the-trauma-informed-skills-you-already-have

### The core claim, verbatim

> "Start with UX heuristics. This is the foundation. Nielsen's usability principles from 1994 still hold up, and they matter even more for trauma survivors. Things like keeping people informed about what's happening on screen, using plain language, giving people control and the ability to undo errors, and reducing cognitive load. These aren't fancy concepts. They're basics that too many websites still get wrong."

> "We see this as a pyramid. UX heuristics are the base. Trauma-informed principles go on top. **You need both.**"

> "Ignoring UX heuristics, intentionally or not, while trying to be trauma-informed in digital design seems contradictory, similar to the concerns about attempts to create trauma-informed prisons without changing fundamental aspects of hostile environments."

> "People assume trauma-informed design is only for crisis centers or mental health apps. That is nonsense. Trauma-informed design is just better design. It's an upgrade to your existing practice."

On why trauma survivors are hit harder by ordinary usability failures:

> "PTSD changes 'cognitive processes such as memory, attention, planning, and problem-solving' (Hayes et al., 2012, p. 1), yet these processes are typically necessary for completing online tasks. Survivors of trauma may also feel powerless, unprotected, and unsafe; they may interpret the world as hostile and untrustworthy... researchers have discovered that **concerns about re-traumatization can prevent seeking support**."

### The JUX case study — the six concrete changes they shipped

This is a real, documented redesign of a US state intimate-partner-violence coalition website. Copy these moves directly.

| # | Change made | Nielsen heuristic | SAMHSA principle |
|---|---|---|---|
| 1 | **Click-to-call phone numbers** on mobile | UH6 Recognition rather than recall; UH7 Flexibility & efficiency | TI1 Safety |
| 2 | **Reduced reading grade level** of all body content | UH2 Match between system and real world | TI4 Collaboration & Mutuality; TI6 Cultural/Historical/Gender |
| 3 | **Added a site search box** (there wasn't one) | UH7 Flexibility & efficiency | TI5 Empowerment, Voice & Choice |
| 4 | **Simplified the safety warning overlay** | UH2, UH3 User control & freedom | TI1 Safety; TI5 Empowerment |
| 5 | **Fixed broken links** | UH5 Error prevention | TI2 Trustworthiness |
| 6 | Gender-neutral language (from earlier 2017 work) | UH2 | TI6 |

**On reading level — the exact number:**

> "Some text on the organization's website was written at a post-graduate level using significantly complex sentences. Yet, people who have experienced trauma may have cognitive challenges or be in crisis... long sentences were broken up, bullet points were used for lists, and paragraphs were shortened. **This reduced the reading level to the range of grades 6-8.**"

**On click-to-call — the exact reasoning:**

> "To make a call, a person would need to write down the number, copy and paste it, or remember it while navigating to their phone's dialing pad... Avoiding copying or remembering phone numbers reduced the cognitive load and effort required."

**On the safety warning — what they cut it down to:**

> "One problem with the warning was that the text was complex and very long; it required scrolling within the overlay. This means that main messages could easily be missed or ignored. I worked with staff members at the organization to simplify the language to the key messages: **a) be careful about being monitored, b) exit the website using the safety button, and c) delete the browser history after visiting.**"

And the self-critique — important, because most Indian government portals still use modal interstitials:

> "Note that the safety warning overlay may need to be removed altogether in the future. **Overlays tend to be a problem from an accessibility perspective**, and there may be other ways to achieve the same communication goal. A dismissible banner at the top or bottom of the screen, similar to what is used to communicate about cookies on websites, may be sufficient."

**Eggleston's one-page audit prompt (use this in design review):**

> "Take one screen from your current project. Run through the SAMHSA principles and ask yourself: Does this page feel safe? Trustworthy? Does it give people choices? Is the language accessible? What other usability heuristics can I apply to help make it more trauma-informed?"

---

## 1.3 Rachael Dietkus / Social Workers Who Design

**URLs:** https://www.rachaeldietkus.com/ · https://www.socialworkerswho.design/aboutus · https://medium.com/surviving-ideo/trauma-and-design-62838cc14e94

Dietkus is a licensed clinical social worker, was the **first social worker-designer at the U.S. Digital Service (2022)**, later a Design Supervisor at the U.S. Digital Corps, and is writing *Trauma by Design: Why the Conditions of Care Matter* (MIT Press). Her contribution is less about UI patterns and more about **research ethics and organisational conditions** — which matters enormously for a portal where the "research participants" are freshly defrauded people.

Verbatim, from *Trauma and Design* (2021):

> "Becoming trauma-informed is a radical act and an evolutionary practice. This is a commitment and means a shift in your training, new ways of doing and being, and embodying a deeper sense of purpose that ethically and responsibly works to understand the whole person you are designing with, for, and from. **It's relational work — not transactional and extractive.**"

> "There is a literacy around trauma that is missing in our organizations, in ourselves, and in our design work. Now more than ever, we need to be at least trauma-informed so that we can lead and work within trauma-responsive teams and organizations."

> "There is no quick fix in any of this work."

She also advocates bringing **licensed professionals onto design teams** — for the NCRP this argues for a counsellor or victim-advocate embedded in the product team and in the moderation of any free-text field.

**Practical rule derived from her work (and the MoJ precedent below):** do **not** usability-test a distressing flow with people currently in acute crisis. Test with subject-matter experts (helpline counsellors, cyber-cell officers, NGO caseworkers) and with survivors who are demonstrably past the acute phase and have consented with a right to stop at any moment.

---

## 1.4 Chayn — the survivor-led eight principles

**Sources:**
- Hera Hussain, *Trauma-informed design: understanding trauma and healing*, Chayn blog, 23 May 2021. https://blog.chayn.co/trauma-informed-design-understanding-trauma-and-healing-f289d281495c
- Chayn (2023), *Trauma-informed design: the whitepaper* (PDF). https://cdn.prod.website-files.com/60fdc9111506063bb9fe8e49/64b081438e3221d7ffc92b12_Trauma-informed%20design_%20the%20whitepaper%20by%20Chayn.pdf
- Chayn trauma-informed design **self-audit kit** (free): https://www.chayn.co/partnerships
- Applied version for a service build: https://www.shareddigitalguides.org.uk/guides/trauma-informed-digital-service-whatsapp-respond-twilio

*(Note: "Design Like You Give a Damn" is Cameron Sinclair / Architecture for Humanity's humanitarian-architecture book series — https://designlikeyougiveadamn.com/ — not a Chayn product. The Chayn asset you want is the 2023 whitepaper above.)*

### The eight principles as Chayn now states them (2023 whitepaper wording)

1. **Safety** — prioritise people's physical and emotional safety.
2. **Agency** — give people control of their experience and respect their wishes.
3. **Equity / Equality** — recognise that inequality exists; design services to be accessible and inclusive.
4. **Privacy** — keep people's information secure.
5. **Accountability** — be open and transparent. Listen and act on feedback.
6. **Plurality** — don't assume what people need. Avoid a 'one-size-fits-all' approach.
7. **Sharing power** — interventions should be designed and created with survivors.
8. **Hope** — speak with empathy and warmth, support people to ask for and accept the help on offer.

### The 2021 long-form definitions — quote these, they are richer

> **Safety:** "We must make brave and bold choices that prioritise the physical and emotional safety of users. This becomes critical when designing for an audience that has been denied this safety at many points in their lives. Whether it is the interface of our platform or the service blueprint, **safety by design should always be the starting point**."

> **Trustworthy:** "Build trust with transparent, clear and consistent communication and design. **People who experience trauma have often lived through internal and external unpredictability.** Good, intentional user interface builds credibility in the first interactions — but it's the service itself that will do the rest. One way to build trust is to be consistent and predictable."

> **Plurality:** "To do justice to the complexity in human experiences, we need to suspend assumptions about what a user might want or need... A refugee might not be able to speak English but may be able to competently converse in 'texting' English."

> **Agency:** "Abuse, inequalities and oppression strip people of agency. We must always make sure we do not use tactics of oppression... Users and survivors of abuse should be a critical component to their own path to wellbeing, not silenced."

> **Empathy:** "Abuse can leave us feeling like no one cares about us and, at times, that we don't even care about ourselves. Empathetic, warm, soothing and minimally-designed interfaces and narrative **should feel like a virtual hug**, motivating people to both ask for and embrace the help we can offer. It should validate their experience as we seek out collaborative solutions."

> **Friction and privacy:** "We should remove unnecessary obstacles from users getting to the information and help they require, although **some friction is necessary** to protect user data and personal rights."

> **Hope:** "People who come to our services are often in positions of pain or of trauma. **They do not need to be reminded of their own struggles, experiences or difficulties with harsh words and sad pictures** — many of which are facsimiles of an abusive experience, organised in sensationalism rather than truth, or are shocking for the benefit of an audience rather than the survivor themselves. It's scary and brave to reach out for help: **our virtual spaces need to feel like an oasis for users, not another place of stress, Othering or misunderstanding.**"

Hussain's framing device, which is the single best brief for the visual designer:

> "I always tell our team that when we design online tools — we need to approach it like we are designing a cafe. What do we want people to think about our space when they stand on the street looking at our cafe window? What would it feel like if they stepped inside? Would they want to take a seat and linger, or would they want to grab something they need quickly and go? **Do they feel like they can do both depending on their mood and routine?**"

And Chayn's ordering of priorities, which directly contradicts standard gov-design instinct:

> "Chayn is a survivor-led community, which means we practise trauma-informed design and **prioritise trust and safety over aesthetic or simplicity**."

**Anti-slop implication:** no stock photography of crying women, no hands-in-handcuffs, no red hoodie hacker illustrations, no "shocking statistic" hero banners. The NCRP hero should be calm, and the very first interactive element should be an action, not a statistic.

### Chayn on humanised AI (2025–26) — directly relevant if you add a chatbot

Chayn deliberately **de-humanises** its AI. From *Resisting Humanization: Ethical Front-End Design Choices in AI for Sensitive Contexts* (arXiv 2603.24853):

> "Rather than framing AI tools as companions or empathetic agents, the organization prioritizes transparency, clarity of scope, and user agency."

They also **took down their chatbot in 2020** and wrote about why (https://blog.chayn.co/ — "Why Chayn took down its chatbot in 2020 and what we've learned about culturally-aware chatbots"). If NCRP ships a bot, it must never claim to feel, must state its limits in the first message, and must have a one-tap escape to a human.

Contrast with the National Domestic Violence Hotline, which *does* ship an AI ("Ruth") but frames it strictly as a fallback:

> "Our domestic violence informed compassionate A.I. chat, Ruth, can help when you're unable to reach a live advocate. **To speak to a live person, call, chat, or text a live advocate.**"

---

## 1.5 Trauma-Informed Computing (CHI 2022) — the HCI framework

**Source:** Chen, Cobb, McDonald, Bellini, Consolvo, Dell, Ristenpart, et al., *Trauma-Informed Computing: Towards Safer Technology Experiences for All*, CHI 2022. https://amcdon.com/papers/trauma-chi22.pdf

Six adapted principles: **safety, trust, peer support, collaboration, enablement, intersectionality.**

Note the two deliberate renamings — both are defensible for a government portal:

> "We also rename 'empowerment, voice, and choice' to **'enablement'** in line with Dombrowski et al. to avoid a techno-determinism narrative, since trauma survivors may be enabled to find their own strength, but **not necessarily empowered when the underlying structures that cause trauma remain unchanged**."

Their definition:

> "Trauma-informed computing is an ongoing commitment to improving the design, development, deployment, and support of digital technologies by explicitly acknowledging trauma and its impact, recognizing that digital technologies can both cause and exacerbate trauma, and actively seeking out ways to avoid technology-related trauma and retraumatization."

The paper's **identity-theft vignette ("Alice")** is the closest published analogue to an NCRP user. Their reading of her behaviour:

| Observed behaviour | Trauma lens |
|---|---|
| "is overwhelmed with fear by the breach notification" | "may be triggered by the new breach, leaving her feeling fear, anxiety, and hopelessness" |
| "hides her experience from tech support" | "**may be experiencing shame and self-blame**" |
| (IPV survivor) "assumes seemingly benign glitches are evidence of hacking" | "may be hypervigilant, constantly scanning for signs of technology compromise as a defense" |
| "is resigned to never having secure devices, accounts" | "may be experiencing anxiety and helplessness" |

**Design implication:** a user who cannot answer "which app did you install?" is not being unhelpful. They are hypervigilant and ashamed. The form must tolerate "I don't know" everywhere and must never scold.

---

## 1.6 UK Home Office / Ministry of Justice / GDS

The UK's most transferable artefact is not a document — it's a **shipped design system component** (full spec in Part 3).

**Sources:**
- MoJ Justice Digital: *Trauma-Informed Design: How we worked together to develop 'Exit this page'* (1 Nov 2023). https://mojdigital.blog.gov.uk/2023/11/01/trauma-informed-design-how-we-worked-together-to-develop-exit-this-page/
- GDS Design Notes: *Exit this page fast with the Design System's new component* (14 Aug 2023). https://designnotes.blog.gov.uk/2023/08/14/exit-this-page-fast-with-the-design-systems-new-component/
- Kamal Bal (MoJ) interview, Civil Service World. https://www.civilserviceworld.com/in-depth/article/traumainformed-mojs-kamal-bal-on-the-departments-drive-to-avoid-vulnerable-service-users-having-to-relive-trauma

### The re-telling problem — quote this to justify data reuse across agencies

MoJ digital chief Kamal Bal, verbatim:

> "If you've been a victim of a violent crime, you've lived through the trauma of being a victim of that violent crime. You've then gone and reported it to the police and had to go through that journey again. Maybe you then get into a conversation with the Crown Prosecution Service and, again, you are presenting the same information. Then someone tells you about this compensation scheme, and you're going through it again. **We are just making people relive that trauma.** But we are now consciously seeking to create experience to... avoid the need to do that."

**Direct NCRP mapping:** call 1930 → repeat to portal form → repeat at police station → repeat to bank → repeat to grievance officer. Each repetition is a re-traumatisation event. The single highest-value trauma-informed feature in the entire NCRP redesign is **tell-us-once**: the 1930 acknowledgement number should pre-fill the portal form, and the portal record should be visible to the bank and the investigating officer without the citizen re-narrating.

### The research ethics precedent

MoJ, verbatim:

> "One of the biggest challenges we encountered was being able to test with people living in that moment of trauma and DA... **Trauma such as domestic abuse alters the brain and reduces executive functioning skills including memory, so it is impossible to accurately replicate this under testing environments.** More importantly, in order for us to have a trauma-aware, user-centred approach, **we did not test the component with users in this scenario to avoid re-traumatisation.** Therefore, it was vital to fully utilise the experience and knowledge of our SME."

### The honesty clause — copy this posture exactly

> "Crucially it will mean that vulnerable users coming on to any Government service will have a familiar and consistent way to hide what they are looking at from perpetrators. **This will not be a foolproof way of keeping all online information hidden but is a line of defense in attempting to reduce harm** to victims and survivors of DA."

And from the developer's retrospective (Owen/beeps, GDS):

> "Ultimately, we had to land on the philosophy of **doing better, but not aiming for perfection**. We could never write a piece of JavaScript that could prevent domestic violence, prying surveillance, or controlling relationships — we can only do what we can do."

**Naming history worth knowing:** the component went **'Exit Site' → 'Hide this page' → 'Exit this page'**. It was independently invented four times inside UK government (DWP Child Maintenance, MoJ Check Legal Aid, GOV.UK, and the Scottish Government on mygov.scot) before being unified.

---

## 1.7 Refuge (UK) — tech abuse

**URL:** https://refuge.org.uk/ · tech safety hub linked as **"Secure your tech"**

Refuge runs the UK's largest specialist tech-abuse team. Two things to steal:

**(a) The homepage IA is three questions, not a menu.** Verbatim:
- "I need help now"
- "Support someone I know who is being abused"
- "What is domestic abuse?"

Each expands to one short paragraph. The first line under "I need help now" is:

> "**You are not alone.** If you or someone you know is experiencing domestic abuse of any kind, Refuge is here to support you — and we're glad you've found us."

Note the specific move: *"and we're glad you've found us."* This is warmth without therapy-speak. It costs six words.

**(b) Blame is disclaimed inside the definition, not in a separate reassurance box:**

> "Domestic abuse... is an incident or a pattern of behaviour that is used by someone to control or obtain power over their partner or ex-partner. **It is never the fault of the person who is experiencing it, and it is a crime.**"

**(c) The quick exit is the first element in the DOM/visual order**, labelled:

> **Quick exit** — "Click to leave site immediately"

Refuge's tech team also publishes device-level guidance, e.g. how to **opt out of UK Emergency Alerts** because "the Emergency Alert is a loud, siren-like sound with a screen message, so Women's Aid is concerned that this poses potential safety risks to survivors if you're keeping a phone hidden from a perpetrator." That level of paranoia about *your own notifications* is the right standard: **NCRP must never send an unsolicited SMS or push notification with a subject line that reveals the case type.**

---

## 1.8 Center for Care Innovations — the organisational layer

**URLs:** https://careinnovations.my.site.com/community/s/article/Resilient-Beginnings-Guidebook-to-Mitigating-Trauma-and-Promoting-Resilience · https://careinnovations.my.site.com/community/s/article/Changing-Clinics-Workplace-Culture-to-a-Place-of-Healing

CCI's contribution is the **"trauma-organized" → "healing organization"** distinction (developed with the nonprofit Trauma Transformed, via their TRIS training):

> "Many organizations perpetuate workplace trauma despite good intentions... **this framing is based on the understanding that we are all humans, that all humans experience some level of trauma, that humans make up systems/organizations and carry that trauma into them** — and that there are organizational practices that can either make this worse or better. A trauma-informed organization recognizes this damage and shifts its practices to resist re-traumatizing its employees. The ultimate goal is to become a healing organization, one that is **reflective, collaborative, equitable and relationship-centered**."

**Why this belongs in a portal brief:** the humans on the other end of an NCRP report — 1930 call-takers and cyber-cell officers — absorb hundreds of sextortion and life-savings-lost cases a week. If they are burned out and terse, no amount of front-end warmth survives the handoff. Budget for: caseload caps, supervision, vicarious-trauma training, and a UI for *officers* that doesn't force them to read graphic free text without warning. Also: never build a feature whose only implementation is "an officer will call you back within 24 hours" unless you have staffed it.

---

## 1.9 Consolidated DO / DON'T list

### Wording

**DO**
- Second person, active voice, present tense: "We've sent a hold notice to the bank."
- One idea per sentence. Target **grade 6–8** (Eggleston/Noel).
- Say the scary word plainly. "Someone is threatening to share your photos" beats "non-consensual intimate image dissemination."
- Name the crime as a crime, early: "This is a crime. It was done to you."
- Use "may" honestly: "Your money **may** not be recoverable" — not "will be recovered."
- Gloss jargon inline on first use: "a hash (like a fingerprint for a photo)".

**DON'T**
- No ALL CAPS. No red exclamation banners. No countdown timers on the report form.
- No "Unfortunately, you have failed to..." — never "you failed."
- No moral framing: never "Why did you share your OTP?" / "You should have verified."
- No jokey microcopy, no emoji, no mascots on distressing screens.
- No "Congratulations!" or confetti on submitting a fraud report.
- No "Are you sure you want to abandon your report?" guilt-trip dialogs.

### Pacing

**DO**
- One thing per page (GDS pattern). One question, one decision.
- Let the user choose the pace: "Take as long as you need. Nothing is submitted until you press Submit."
- Offer a **"Do the urgent thing first"** shortcut: freeze the money in ≤3 taps, then come back for the 20-question narrative.
- Autosave every field, silently, with a visible "Saved" timestamp.

**DON'T**
- No session timeouts that destroy work. If a timeout is unavoidable for security, warn at T-5 minutes *and preserve the draft*.
- No multi-step forms without a progress indicator and a back button that doesn't lose data.
- No mandatory OTP re-verification mid-form (the current NCRP's 30-minute OTP window is a hostile pattern for a shaking user).

### Control mechanisms — the specific list

1. **Quick exit** on every page, persistent on scroll, plus keyboard shortcut (Part 3).
2. **Save and return** with a code, resumable for at least 30 days, no account required.
3. **"Skip this section"** on every non-essential block, with a visible consequence statement ("You can add this later. It won't delay the bank hold.").
4. **"I'd rather not say"** as an explicit radio option on: gender, age band, relationship to the suspect, whether images exist, sexual content details, caste/community, income.
5. **"I don't know"** as an explicit option on every factual field (bank name, transaction ID, app name, URL).
6. **Content warnings before any screen that might show upsetting material**, with an explicit "Show me" / "Skip" choice.
7. **Undo / edit** on every answered question, reachable from a single review page before submission.
8. **Choice of contact channel and time**, including "Do not call me — SMS only" and "Do not contact me at all."
9. **Withdraw** — the user can withdraw the report and know exactly what that does (StopNCII models this well; see Part 4).
10. **A visible "Nothing has been sent yet"** status until submission.

### Hard prohibitions

- **No forced disclosure.** Never make narrative free-text mandatory. Never make "describe what happened" a gate.
- **No mandatory sensitive fields.** If the law requires a field for FIR registration, say *why*, and offer to collect it later at the police station rather than blocking the online hold notice.
- **No progress loss.** Ever. This is the #1 re-traumatising failure — it re-enacts the loss of control.
- **No unexpected content.** No auto-playing awareness videos. No thumbnails of the user's own uploaded evidence rendered in a list view. No graphic imagery in scam-education content.
- **No dark patterns of any kind.** These users were *just* manipulated. See Part 5.7.

---

# PART 2 — COGNITIVE DEGRADATION UNDER ACUTE STRESS

## 2.1 Working memory: the baseline number is 4, not 7

**Miller (1956)**, *The Magical Number Seven, Plus or Minus Two*, Psychological Review 63(2):81–97. https://web-archive.southampton.ac.uk/cogprints.org/730/1/miller.html

Miller himself was hedging — he called seven a "rough estimate and a rhetorical device."

**Cowan (2001)**, *The magical number 4 in short-term memory: A reconsideration of mental storage capacity*, Behavioral and Brain Sciences 24(1):87–114. https://doi.org/10.1017/S0140525X01003922

> "Miller (1956) summarized evidence that people can remember about seven chunks in short-term memory (STM) tasks. However, that number was meant more as a rough estimate and a rhetorical device than as a real capacity limit... **A single, central capacity limit averaging about four chunks is implicated**."

Cowan's conditions matter: 4 chunks is the limit **when rehearsal and chunking are blocked** — which is exactly the condition of a panicking user who cannot rehearse anything because their attention is captured by the threat. Cowan also links this to **subitizing**: humans can enumerate up to ~4 objects "at a glance"; beyond that, counting is required.

**→ Design rule:** For a calm user, 5–7 options per screen is fine. **For an acutely distressed user, assume a working set of 3–4 items.** Never present more than 4 primary choices on a decision screen. If you must present more, group them under ≤4 headings and let the user drill in.

## 2.2 Anxiety specifically degrades inhibition and task-switching

**Eysenck, Derakshan, Santos & Calvo (2007)**, *Anxiety and cognitive performance: Attentional control theory*, Emotion 7(2):336–353. https://doi.org/10.1037/1528-3542.7.2.336

> "Anxiety impairs efficient functioning of the goal-directed attentional system and increases the extent to which processing is influenced by the stimulus-driven attentional system. In addition to decreasing attentional control, **anxiety increases attention to threat-related stimuli**. Adverse effects of anxiety on processing efficiency depend on two central executive functions involving attentional control: **inhibition and shifting**."

The efficiency/effectiveness distinction (from the earlier Processing Efficiency Theory, Eysenck & Calvo 1992) is the operationally useful bit:

> "Anxiety may not impair performance effectiveness (quality of performance) when it leads to the use of **compensatory strategies** (e.g., enhanced effort; increased use of processing resources)."

**→ Translation:** an anxious user *can* still complete your form correctly — but it costs them vastly more effort, and they will bail out sooner. Every unit of unnecessary complexity you remove is compounded for them.

**Meta-analytic effect size:** Shi, Sharpe & Abbott (2019), *A meta-analysis of the relationship between anxiety and attentional control*, Clinical Psychology Review. 58 studies, N = 8,292. https://www.sciencedirect.com/science/article/abs/pii/S0272735818304227

> "The meta-analysis revealed a significant AC deficit for high compared to low anxiety participants (**Hedges' g = −0.58**)... anxiety produced significant deficits in AC efficiency but not effectiveness; these deficits occurred in **inhibition and switching but not updating** and **studies with high cognitive load conditions found larger anxiety-related AC deficits**."

**→ Design rules from "inhibition and switching, not updating":**
- **Switching is the expensive operation.** Do not force the user to jump between the form, their bank app, their SMS inbox, and a PDF. Let them paste raw SMS text. Let them upload a screenshot instead of transcribing a transaction ID.
- **Inhibition is impaired**, so distractors are disproportionately harmful. Strip *everything* off the report flow: no nav bar, no related links, no "Latest scam alerts" sidebar, no donate/feedback prompt, no cookie banner over the exit button.
- **Updating is relatively spared**, so step-by-step sequential entry is tolerable — sequential is fine, parallel is not.

## 2.3 Acute stress and working memory — the load and timing effects

**Oei, Everaerd, Elzinga, van Well & Bermond (2006)**, *Psychosocial stress impairs working memory at high loads*, Stress 9(3):133–141.

> "Stress impaired WM at **high loads, but not at low loads** in a Sternberg paradigm. High cortisol levels at the time of testing were associated with slow WM performance at high loads."

**→ Design rule:** the effect is load-dependent. A low-load interface is *protective*. This is not a nice-to-have.

**Cold-pressor study** — Frontiers in Psychiatry 11:544540 (2020). https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2020.544540/full

> "Data from the CPS session showed significantly **longer reaction times, lower accuracy, and WM capacity scores** than that of the control treatment session."

**Timing — this is the most actionable finding for a "digital arrest in progress" user.** Systematic review: *Time-dependent effects of acute stress on working memory performance* (Neuroscience & Biobehavioral Reviews, 2022). https://www.sciencedirect.com/science/article/abs/pii/S0306453022003390

> "The immediate stress-induced release of **noradrenaline decreases working memory performance within the first 10 min post stress**. In addition, rapid cortisol effects impair working memory at a later time-interval **beginning about 25 min post stress**."

> "The proportion of negative compared to null and positive effects of stress on working memory **peaks once within the first 10 min post-stress (50% of measurements), and again later between 25 and 50 min post stress (again 50%)**. In contrast, between 10 and 24 min [the effect is weaker]."

**→ Design rule:** The user arriving at NCRP within minutes of realising they were defrauded is in the **worst possible window**. The first 10 minutes of their session must ask for almost nothing. Design a "**Stop the money**" path that needs: (1) your phone number, (2) the amount, (3) roughly when. Everything else is deferred to a resumable draft.

**Caveat, stated honestly:** the acute-stress/WM literature is genuinely mixed. Some studies find *enhancement* in high-cortisol male responders (Sci. Direct S0167876020300192), and one TSST study in older adults found decline in men but improvement in women. The **direction is contested; the volatility is not.** You cannot predict which way a given user will go, so design for the impaired case.

## 2.4 Attentional narrowing / cognitive tunneling

**Easterbrook (1959)** — the cue-utilisation hypothesis: as emotional arousal increases, the **range of cues an organism uses narrows**. This is the parent theory.

**Weltman & Egstrom (1966)**, *Perceptual Narrowing in Novice Divers*, Human Factors 8(6):499–506 — the classic demonstration that peripheral-signal detection collapses under stress even when central-task performance holds.

**Dirkin (1983)**, *Cognitive Tunneling: Use of Visual Information under Stress*, Perceptual and Motor Skills 56(1):191–198. https://doi.org/10.2466/pms.1983.56.1.191

> "References to 'tunnel vision' under stress are considered to describe a process of **attentional, rather than visual, narrowing.**"

**Modern aviation/ATC work** (Wright State, ISAP 2015): https://corescholar.libraries.wright.edu/cgi/viewcontent.cgi?article=1032&context=isap_2015

> "Two factors have been identified as likely triggers of attentional narrowing: (1) **high motivational intensity** and (2) **arousal**... In the presence of high motivational intensity and arousal, attention appears to **narrow towards salient stimuli or stimuli that are perceived to be of high importance or priority**."

**Reading-specific:** an eye-tracking thesis (Padua, 2021) tested whether stress shrinks the **perceptual span** in reading — the number of characters to the right of fixation that are usefully processed. It did not find the predicted span interaction, but did find main effects of arousal on reading measures. Treat "stress narrows the reading span" as plausible-but-unproven; treat "stress narrows attention" as well-established.

**→ Design rules from tunneling:**
- **Peripheral UI does not exist for a tunneled user.** Anything in a sidebar, footer, or top-right corner may be functionally invisible. This is a real tension with the quick-exit button, which is conventionally top-right — mitigate with high contrast, size, and stickiness (see Part 3).
- **Put the one thing that matters in the centre of the visual field, large.** Not "also available below."
- **The user will fixate on the threat-salient element.** If your page contains the words "police," "arrest," "FIR," or "₹" in large type, that is what they will read. Use that: make the salient element *the helpful action*, not a warning.
- **Do not rely on colour alone or on iconography alone** for critical meaning.

## 2.5 Scarcity and cognitive bandwidth — the most quotable number

**Mani, Mullainathan, Shafir & Zhao (2013)**, *Poverty Impedes Cognitive Function*, Science 341(6149):976–980. https://www.science.org/doi/10.1126/science.1238041

Field sites: a New Jersey shopping mall, and **sugarcane farmers in Tamil Nadu**.

> "On average, a person preoccupied with money problems exhibited a **drop in cognitive function similar to a 13-point dip in IQ, or the loss of an entire night's sleep**." (Princeton release: https://www.princeton.edu/news/2013/08/29/poor-concentration-poverty-reduces-brainpower-needed-navigating-other-areas-life)

> "Our effects correspond to **between 13 and 14 IQ points**. A gain of that many points can lift you from the category of 'average' to 'superior' intelligence. Or, if you move in the other direction, losing 13 points can take you from 'average' to a category labeled 'borderline-deficient.' In our studies, **the same person has fewer IQ points when he or she is preoccupied by scarcity than when not**."

Tamil Nadu farmers, pre- vs post-harvest: **~25% more Raven's items correct after harvest**, and they "responded [more slowly] and made [more] errors while poor."

> "Just asking a poor person to think about hypothetical financial problems reduces mental bandwidth."

**→ This is the single most important finding for the NCRP.** Someone who has just lost ₹8 lakh is, by definition, acutely scarcity-preoccupied. The 13-IQ-point framing is also the most persuasive line you have for arguing down a bureaucratic form. Use it in stakeholder decks verbatim, with the Indian field site called out.

## 2.6 Yerkes-Dodson — and the half everyone forgets

**Yerkes, R.M. & Dodson, J.D. (1908)**, *The relation of strength of stimulus to rapidity of habit-formation*, Journal of Comparative Neurology and Psychology 18:459–482.

The famous half: performance rises with arousal to a peak, then collapses (inverted U).

**The forgotten half ("Dodson's Law"):** *the location of the peak depends on task complexity.*

> "For **simple or well-learned tasks**, the relationship is monotonic, and performance improves as arousal increases. For **complex, unfamiliar, or difficult tasks**, the relationship between arousal and performance reverses after a point, and performance thereafter declines as arousal increases." (Wikipedia summary of the literature: https://en.wikipedia.org/wiki/Yerkes%E2%80%93Dodson_law)

> "This is the half of the law almost every product team forgets... For complex, novel, cognitively demanding tasks, the peak sits much farther to the left, and **high arousal crashes performance much sooner**." (https://yukaichou.com/behavioral-analysis/yerkes-dodson-law-arousal-optimal-performance/)

And the mechanism for the downslope:

> "The downward part is caused by negative effects of arousal (or stress) on cognitive processes like attention (e.g., 'tunnel vision'), memory, and problem-solving."

**→ The three practical implications:**

1. **Filing a cybercrime report is a complex, novel, high-stakes task.** Its optimal arousal is *low*. Your user arrives far to the right of the peak. **Your entire job is to move them left**, not to motivate them.
2. **Never add arousal cues.** No countdown timers ("Report within the golden hour — 47:12 remaining!"), no scarcity, no red flashing, no "URGENT ACTION REQUIRED." The urgency is real, but the *interface* must not amplify it. State the fact once, calmly, and make the fast path fast. From the UX-glossary framing: "Teams frequently mistake anxiety for motivation, adding pressure cues that push users past the performance peak into the error-prone zone."
3. **Simplify the task instead of energising the user.** Every step you remove shifts the peak rightward, giving the aroused user more headroom.

## 2.7 Reading behaviour — how much text will actually be consumed

**Nielsen (1997)**, *How Users Read on the Web*. https://www.nngroup.com/articles/how-users-read-on-the-web/

> "**79 percent of our test users always scanned** any new page they came across; only 16 percent read word-by-word."

Measured usability improvements from rewriting the same content:
- Concise version (≈half the word count): **+58% usability**
- Scannable version: **+47% usability**
- Combined concise + scannable + objective language: **+124% usability**

**Nielsen (2008)**, *How Little Do Users Read?* https://www.nngroup.com/articles/how-little-do-users-read/

> "On the average Web page, users have time to read **at most 28% of the words** during an average visit; **20% is more likely**."

> "There is a fixed time of about **25 seconds, plus an additional 4.4 seconds per 100 words**."

> "On an average visit, **users read half the information only on those pages with 111 words or less**."

**NN/g (2020)**, *How People Read Online: New and Old Findings* — confirms the F-pattern persists 23 years on. https://www.nngroup.com/articles/how-people-read-online/

> "Start subheads, paragraphs, and bullet points with **information-carrying words** that users will notice when scanning down the left side of your content... They'll read the third word on a line much less often than the first two words."

**→ Concrete copy budget for the NCRP.** These are the numbers to enforce in review:

| Element | Budget |
|---|---|
| Page title (H1) | ≤ 8 words, front-loaded with the action or outcome |
| Lead paragraph on any crisis page | ≤ 25 words, one sentence |
| Any single sentence in the report flow | **≤ 15 words** (target); hard cap 20 |
| Total words on a decision screen | **≤ 111** (Nielsen's "half will be read" threshold) |
| Words before the primary CTA | ≤ 40 |
| Paragraph length | ≤ 3 lines at 320px width |
| Bullets per list | ≤ 4 (Cowan) |
| Reading grade | **6–8** (Eggleston/Noel), tested per language |

## 2.8 Consolidated interface implications

| Question | Answer | Evidence |
|---|---|---|
| **How short must sentences be?** | ≤15 words target, one clause, one idea. Grade 6–8. | Eggleston/Noel grade 6–8; NN/g scanning; ACT inhibition deficits make long clauses expensive |
| **How many choices per screen?** | **3–4 maximum** as primary options. If more, group under ≤4 headings. | Cowan 4±1; subitizing limit |
| **How large must the primary action be?** | Full-width on mobile, minimum 48×48px touch target (WCAG 2.5.5 AAA / Android+iOS guidance), ideally 56–64px height with ≥16px separation from any adjacent control. Visually the largest element on the page. | Tunneling → peripheral/small elements unseen; shaking hands → motor imprecision |
| **Text or icons?** | **Text, always.** Icon-only controls fail: they require recall not recognition, they are culturally variable across India, and they are ambiguous. If you use an icon, pair it with a visible text label (never a tooltip). Oomph's quick-exit finding is the exemplar: they used "the universal external link icon **with** 'Exit Site' as a label." | Nielsen UH6 recognition-over-recall; Eggleston's click-to-call rationale |
| **One page per question?** | Yes. GDS "one thing per page." Reduces switching cost, which is the specific deficit under anxiety. | Shi et al. — shifting deficit |
| **Should there be a timer?** | **No.** Never. Not even a progress-of-session timer. | Yerkes-Dodson downslope |
| **Colour contrast** | Minimum WCAG AA 4.5:1 body / 3:1 large; aim AAA 7:1 on the crisis path. Users may be crying, in low light, hiding the screen. | — |
| **Type scale** | Body ≥18px on mobile (not 14–16px). Elderly victims are an explicitly named user group. | — |
| **Motion** | Respect `prefers-reduced-motion`. No parallax, no auto-carousels, no auto-advancing steps. Sudden movement reads as threat to a hypervigilant user. | CHI 2022 hypervigilance |
| **Error handling** | Never destructive. Never blame. Preserve all input. Inline, adjacent to the field, plain language ("We need the amount to send the bank a hold notice. If you're not sure, an estimate is fine."). | Nielsen UH5/UH9; CHI 2022 shame/self-blame |

---

# PART 3 — QUICK EXIT / SAFETY EXIT PATTERNS

## 3.1 The evidence base: "Click Here to Exit" (CHI 2023)

**Source:** Sutherland, K., et al., *Click Here to Exit: An Evaluation of Quick Exit Buttons*, CHI 2023, Hamburg. https://doi.org/10.1145/3544548.3581078 · PDF: https://www.cl.cam.ac.uk/~kst36/documents/click-here-to-exit.pdf

This is the only large-scale empirical study of the pattern. **Read it before shipping anything.**

### Scale and prevalence

- Dataset: **2,045 websites**, 6 countries, 20 support-service categories.
- **404 sites (19.8%)** had at least one quick-escape mechanism.
- **401 sites (19.6%)** had an exit button on desktop.
- Of those, **323 (80.5%)** also had one on mobile — i.e. **~1 in 5 sites with a desktop exit button drops it on mobile.**
- Only **20 sites (5.0%)** had a **keyboard shortcut**. Three of those had a shortcut but *no* button.

### Prevalence by category (the top three)

| Category | % of sites with exit button |
|---|---|
| Domestic abuse services (n=132) | **80.3%** |
| Victim support services | **63.5%** |
| Sexual assault / rape support | **61.4%** |

**Note:** cybercrime and fraud reporting sites are *not* in the high-adoption group. The NCRP would be an early adopter in this vertical — which is exactly right, because sextortion, NCII, and tech-facilitated abuse cases arrive there.

### Implementation types found (desktop counts)

| Implementation | Count (approx.) |
|---|---|
| Redirect only | **284** |
| Overwrite URL (`window.location.replace`) | **229** |
| Redirect + new tab | 15 |
| Fill history | small |
| Modify page in place | small |
| New tab only | small |

### The security criteria matrix — this is the money table

Threat model: the **"UI-bound adversary"** (Freed et al.) — a partner/parent who can pick up the device and use the browser normally, but cannot do forensics.

| Criterion | Redirect | **Overwrite URL** | Fill history | Modify page | New tab only |
|---|---|---|---|---|---|
| Page not on screen | ✓ | ✓ | ✓ | Modified | ✓ |
| URL changed | ✓ | ✓ | ✓ | ✕ | ✓ |
| Page not in an open tab | ✓ | ✓ | ✓ | ✕ | ✕ |
| **Back button does not reveal site** | **✕** | **✓** | Depends | ✕ | ✕ |
| Refresh does not reveal site | ✓ | ✓ | ✓ | ✕ | ✕ |
| Hidden from recent-tabs list | ✕ | ✓ | Depends | ✕ | ✕ |
| Hidden from browser history | ✕ | ✓ | Depends | ✕ | ✕ |

Verbatim conclusions:

> "According to our criteria, the **least secure implementation is to modify the current page** to try to hide the sensitive content. This only prevents shoulder-surfing users from identifying the site."

> "The **most common** implementation is for a button to **redirect** the user to another page. This is not the worst implementation, but the exited site can be [found in] closed tabs, or in the browser history. **Despite its prevalence, this is not the best implementation.**"

> "**The most secure implementation of an exit button is to overwrite the current URL with `window.location`.** This replaces the current URL in the browsing history and prevents the back button revealing the site that the user exited from, and meets all of our security criteria."

> "Additionally, filling the user's history with various tabs can be an effective implementation. To meet all of the security criteria, **it must be combined with overwriting the URL**... Caution should be taken with this implementation however, as **opening a large quantity of tabs on screen simultaneously can draw an adversary's attention and cause suspicion rather than avoiding it.**"

### Landing pages — ranked, with the trap

Most common → least common: **search-engine homepage (e.g. google.com) → news sites → regional weather sites → blank new tab → a specific search query.**

> "Search engines and new tabs make the user appear to be **between tasks** (although having nothing on screen may be suspicious), while weather and news sites are very common for users to visit. However, sending the user to a **specific search result can potentially be problematic**. After using the quick escape feature, the user may have to justify a query which they are unlikely to search — for example, **someone who never cooks will have difficulty explaining why they are looking at recipes.**"

**→ NCRP recommendation:** default landing = **a weather page for the user's region** (culturally universal, plausibly frequent, non-personalised, fast-loading) or **google.com**. Never a specific search. Never a page that could show personalised content.

### Usability failure modes found in the wild

> "Common problems include **cookie notices covering the buttons**, and **buttons not remaining on the screen when scrolling**."

> "The button needs to be visible **as soon as the user loads the website**. Designers should avoid putting the button in a side menu or as part of the main content of the page. They should also check that there are no pop-ups or notices which cover the exit button, **in particular cookie notices that are required in some jurisdictions**."

---

## 3.2 GOV.UK "Exit this page" — the reference implementation, in full

**Component:** https://design-system.service.gov.uk/components/exit-this-page/
**Pattern (mandatory companion):** https://design-system.service.gov.uk/patterns/exit-a-page-quickly/

### Markup, verbatim

```html
<div class="govuk-exit-this-page" data-module="govuk-exit-this-page">
  <a href="https://www.bbc.co.uk/weather"
     role="button"
     draggable="false"
     class="govuk-button govuk-button--warning govuk-exit-this-page__button govuk-js-exit-this-page-button"
     data-module="govuk-button"
     rel="nofollow noreferrer">
    <span class="govuk-visually-hidden">Emergency</span> Exit this page
  </a>
</div>
```

Note three details worth stealing:
- **`rel="nofollow noreferrer"`** — the destination never learns where the user came from.
- **`<span class="govuk-visually-hidden">Emergency</span>`** — screen readers hear "Emergency Exit this page"; sighted users see "Exit this page." The label is disambiguated for AT without adding visual noise.
- **`govuk-button--warning`** — the GOV.UK red warning-button style (`#d4351c` in the classic GOV.UK Frontend palette), white text, black shadow-bottom.

### Mechanics

| Property | Spec |
|---|---|
| **Label** | "Exit this page" (after iterating through "Exit Site" and "Hide this page") |
| **Colour** | GOV.UK warning red, white text |
| **Position** | Sticky at the **top of the viewport**, remains visible while scrolling |
| **Default destination** | **BBC Weather homepage** (`https://www.bbc.co.uk/weather`) — configurable |
| **Keyboard shortcut** | **Press `Shift` three times within 5 seconds** |
| **Visual feedback** | **Three "traffic light" progress dots** below the button; one fills per Shift press |
| **Timeout** | 5 seconds; sequence and dots reset |
| **Anti-false-positive** | Activation is **prevented if Shift is pressed in combination with another key, or if another key is pressed between the three Shift presses** |
| **On activation** | **The page is blanked out** before the redirect, then the browser navigates |
| **Secondary link** | An extra `govuk-skip-link` placed at the very top of `<body>`, under the default skip link, performing the same action |

### Screen reader announcements — the exact default strings

- `pressTwoMoreTimesText`: **"Shift, press 2 more times to exit."**
- `pressOneMoreTimeText`: **"Shift, press 1 more time to exit."**
- plus configurable `activatedText` and `timedOutText`.

### Why not Escape — the definitive answer

From the GDS engineer's own retrospective (https://beeps.website/blog/2024-10-09-why-govuk-exit-this-page-doesnt-use-escape/):

> "We found that the Escape key was used by too [many other things] for exiting the page... Redirecting the user away to another page via JavaScript is one such function that requires user interaction before it will run. **And `Esc` is the only keyboard key that doesn't count as user interaction for the purposes of transient activation.** This meant that if a user tried to use the EtP shortcut immediately after a page loaded, or after a short period having not interacted with the page (for example, if they were busy reading it), **the redirection just wouldn't work. Totally doubleplus ungood.**"

Why Shift, from the GDS blog:

> "This action is **common across different keyboards, easy to carry out for users with motor difficulties, and does not control any existing functionality when pressed on its own**."

Known caveats they publish honestly:

> "Pressing Shift three times requires many more presses if the **Sticky Keys** accessibility feature is active. I found that it took **between 6 and 9 presses with Windows Sticky Keys**, depending on speed, and **9 presses with macOS Sticky Keys**. macOS's Slow Keys feature still takes three presses, but they have to be spread across a period of a few seconds... The **JAWS screen reader in Chromium would register the first Shift keypress twice**."

Why they rejected the decoy-tab approach:

> "[We] looked into opening the redirection page in a new tab and automatically closing the previous tab, as some similar tools do — but **user research found that this often caused confusion ('Why [is there a new tab]?', 'Where did my work go?')**."

Why they rejected a disguised label:

> "We explored adding a 'disguised' alternative name for the button, or adding another hidden button with a less conspicuous command name, such as 'click BBC Weather'. But these options had two flaws. Having a 'disguised' name for the button **would likely interfere with other assistive technologies that rely on descriptive and accurate labels.**"

Why the page blanks:

> "An additional safety feature... is **making the web page go blank when the component is activated**. This is to hide any content during the time between the user activating the component and the new page loading. **This is to better protect users on slower internet connections.**"

*(Critically relevant for India: on a 2G/3G connection the redirect can take seconds. Blanking is not optional.)*

### The two mandatory companion pages

GDS **requires** the component to be paired with two content pages. This is the part most implementations skip, and it's where the honesty lives.

**(a) The interruption page** — shown before the user first reaches a page with the component. Must tell the user:

> - "about the Exit this page button and what it's for
> - what happens when they press it
> - they can also activate Exit this page by pressing shift 3 times or by using the secondary link"

And, verbatim, the honest limitations:

> - "**their internet browsing history will not be erased, which can still put them at risk**
> - **any information they've entered will not be saved**, depending on what you've decided to do with your service's user session data
> - to return to the service, they can search for the site they were using, or find it in their internet browsing history
> - there are other things they can do to stay safe online"

**(b) The safety content page** — covering at minimum:

> - "only using your service on a public device, such as in a library
> - using private browsing
> - clearing their internet browsing history and cookies"

### Destination guidance, verbatim

> "**Avoid websites that might show personalised pages** (such as frequently visited, last visited or suggested links), **as this content could put the user at risk.**"

### When to use it

> "Use the component on pages with sensitive information that could:
> - **put someone at risk of abuse or retaliation**
> - **reveal someone's plans to avoid or escape from harm**"

> "Do not use this component if the service or content is unlikely to put a user at risk."

### Research provenance and its limits — quote this

> "The design of this component is based on research with people with a lived experience of domestic abuse and people with accessibility needs, and in consultation with the Ministry of Justice, Department for Work and Pensions and the Scottish Government."

> "**We've tested this component mainly with users at risk of domestic abuse. However we've not done extensive testing with any other user groups.**"

**Live examples:** GOV.UK "Check if you can get legal aid"; GOV.UK "Apply for help arranging child maintenance"; **mygov.scot Domestic abuse support** (the Scottish Government shipped their own version *years earlier* and has it in their own design system); Women's Aid; Refuge.

---

## 3.3 Implementation-by-implementation teardown

### Refuge (UK) — https://refuge.org.uk/

- **Label:** "**Quick exit**"
- **Sub-label / hover text:** "Click to leave site immediately"
- **Position:** first element on the page, top of viewport, persistent
- Refuge additionally runs a whole "Secure your tech" hub, and its tech team publishes device-specific opt-out guidance (e.g. for UK Emergency Alerts).

### Women's Aid (England) — https://www.womensaid.org.uk/cover-your-tracks-online/

- **Label:** "**Exit Site**"
- **Colour:** **green** (deliberately not red — worth noting as a counter-example; green is less likely to be read as "alarm" by an onlooker glancing at the screen, though it also has lower salience)
- **Position:** right side of the page
- **The honesty line, verbatim:**
  > "The green Exit Site button on the right of the Women's Aid website will **quickly hide the page but you will still need to delete your history.**"

Their "Cover your tracks online" page is the **gold standard for browsing-history guidance** (see 3.5).

### National Domestic Violence Hotline (US) — https://www.thehotline.org/

**Two-layer approach.** First an inline dismissible tip, then a modal security alert.

**Layer 1 — "Leave this site safely" tip, verbatim:**

> "You can quickly leave this website by clicking the '**X**' in the top right or by **pressing the Escape key twice**.
> To browse this site safely, be sure to regularly clear your browser history."
> [button: **Got it**]

**Layer 2 — "Security Alert" modal, verbatim:**

> "**Internet usage can be monitored and is impossible to erase completely.** If you're concerned your internet usage might be monitored, call us at 800.799.SAFE (7233). Learn more about digital security and remember to clear your browser history after visiting this website.
>
> Click the red 'X' in the upper-right corner or 'Escape' button on your keyboard twice at any time to leave TheHotline.org immediately.
>
> Please contact 911 if you feel like you are in immediate danger or a life-threatening situation."
> [button: **OK**]

**Analysis:** note the exit control is an **"X"**, not a labelled button — a deliberate disguise (an X looks like "close"). This is the opposite trade-off from GDS. It is more discreet but less discoverable; the Hotline compensates by explaining it twice on arrival. Note also the **double-Escape** shortcut — the pattern GDS explicitly rejected on technical grounds. Both are defensible; you cannot have both discretion and robustness.

The Hotline also uses an **interstitial before any outbound link**, which is a nice trust move:

> "You are about to leave this site to be directed to a trusted partner. Please note their policies may differ from ours."
> [Continue] [Cancel]

### 1800RESPECT (Australia) — https://www.1800respect.org.au/

**The site-wide banner, verbatim:**

> "To leave this site quickly, click the **Quick Exit** button below. **Learn about Quick Exit button here.** If you don't want your browser history saved, **please open incognito browsing mode. Learn about incognito mode here.** If you're in immediate danger, please call 000."
> [Close Message]

Plus a persistent **"Call 000 if you are in danger"** strip and the framing question:

> "**Are you worried someone will find out you visited this website?**"

- **Label:** "**QUICK EXIT**" (all caps, in the persistent footer/utility bar)
- Both the exit button *and* the incognito advice are linked to explainer pages — i.e. the button is treated as a **feature requiring onboarding**, exactly as Oomph argued (below).

### Scotland

The Scottish Government implemented a quick-exit component on **mygov.scot** *before* the GDS work and contributed to the unified component. It now lives in **their own design system**. (Per MoJ: "The Scottish Government have implemented their component into their own design system.") mygov.scot's **Domestic abuse support** page is listed by GDS as a live example.

### Chayn / Tech Safety Canada / Ask Izzy — the practitioner guidance

**Tech Safety Canada**, *Designing Websites to Increase Survivor Safety and Privacy*: https://techsafety.ca/resources/toolkits/designing-websites-to-increase-survivor-safety-and-privacy/

The safety alert should cover:
> "- Other ways to seek help, such as emergency services, your organization's crisis line, or a provincial help number.
> - An option to leave the site quickly using a 'Quick Exit Button' **or to close the browser window by using keyboard shortcuts such as Alt+F4 (Windows), or Shift+Command+W (Mac)**.
> - Options for minimizing the digital trail by using safer devices and browser privacy options."

And the honest caveat:

> "A Quick Exit button **does not delete the current website from the browsing history**, but it can be an option for a survivor to quickly pull up another website if someone enters the room when they're visiting your site."

Their two advanced techniques:
> "1. Code the button so that when it is clicked it **both opens a fresh tab to a neutral page, and also re-directs to many websites in rapid succession** to hide your website deeper in the browser history... The downside is that this will take longer to load, and still won't remove the browser history.
> 2. Code the button so that **there is no 'back' button on the new page** that opens after pressing the 'Exit Now' button."

**Infoxchange / Ask Izzy (Australia)**, https://www.infoxchange.org/au/news/2018/05/how-increase-internet-safety-quick-exit-button — their checklist:
> "- **Moves up and down on the webpage when scrolling** so the button is always visible and in the same place.
> - **Bright colour (usually red)** so the button is visible on the screen.
> - **Always in the same position** on the screen, so it is easy to find quickly.
> - Visible and clear on all computer, mobile and tablet devices.
> - On desktop, include hover text to explain what the button is.
> - **The webpage that the quick exit button directs users to loads quickly.**"

**Oomph, Inc.**, *Supporting Personal Safety: Best Practices with a Quick Exit Button*: https://www.oomphinc.com/insights/user-safety-quick-exit-best-practices/

> "A quick exit button is **not ingrained in a user's mental model**, making its intended action new to most people. **Those who feel they might need it have to recognize its function as soon as possible.**"

> "We needed to explain exactly what the button did, so we opted to use the **universal external link icon with 'Exit Site' as a label** to best communicate what the button would do. Although it does not describe where you will end up, it clearly explains that you will leave the website."

> "When dealing with 'trauma-informed' design, designers must '**prioritize comfort over technological trends**'."

---

## 3.4 Known criticisms and failure modes — the honest list

1. **It cannot clear browser history.** Every credible implementer says so out loud. Any implementation that implies otherwise is actively dangerous because it induces false confidence. *"It is not possible for a website button to clear all of the browser history."* (CHI 2023)
2. **Redirect-only (the most common implementation) fails the back-button test.** The site remains one tap away.
3. **Cookie banners / consent modals cover the button.** Named as a top failure mode in CHI 2023. **Test this explicitly on first visit, on mobile, in every locale.**
4. **The button scrolls away.** ~Every non-sticky implementation fails the moment the user reads past the fold.
5. **It disappears on mobile.** 19.5% of sites with a desktop button had none on mobile — and mobile is where most Indian users are.
6. **Users lose their work.** GDS mandates disclosing this. If your form autosaves, say so explicitly on the interruption page: *"Anything you have typed so far is saved. You can come back to it."* This turns a downside into a trust signal.
7. **The decoy-tab pattern confuses people.** GDS user research: *"Why [is there a new tab]?", "Where did my work go?"*
8. **Opening many tabs draws attention** rather than deflecting it (CHI 2023).
9. **A specific search-result landing page is unexplainable** (the "recipes" problem).
10. **Landing pages with personalised content leak.** A logged-in YouTube or Google homepage shows watch/search history.
11. **Keyboard shortcuts are near-absent in the wild** (5.0% of sites) and every choice has accessibility trade-offs (Escape = transient-activation failure; Shift = Sticky Keys inflation to 6–9 presses).
12. **The button itself is an indicator.** A perpetrator who knows what a quick-exit button looks like learns something from its presence. This is unavoidable and is a reason to consider making it a **site-wide standard on all of NCRP**, not only on sextortion/NCII pages — ubiquity removes the signal.
13. **Discoverability vs discretion is a genuine, unresolved trade-off.** GDS chose a big red labelled button. The Hotline chose a bare "X". There is no published evidence that resolves it.
14. **It does nothing about spyware / stalkerware / an admin account.** Which is why it must always be paired with device-level guidance.

---

## 3.5 "Cover your tracks" — the content pattern

**The reference implementation:** Women's Aid, *Cover your tracks online* — https://www.womensaid.org.uk/cover-your-tracks-online/

### The opening warning, verbatim

> "**Warning: if you are worried about someone knowing you have visited this website please read the following safety information.**"

### The single most important paragraph — the "don't act yet" warning

This is the paragraph almost every other site omits, and it is the most trauma-informed thing on the page:

> "This guide contains technical advice about what is possible to protect your devices... but different parts of this may need to happen at different times. This will depend on your individual circumstances. **For example, if you change your password, someone may realise this has happened when they attempt to log in and this could lead to them escalating their behaviours.** Your safety is the most important thing and **some of this might be for you to consider at a later stage**, for instance, when no longer in immediate danger or you have left the situation. **It is completely normal to want to get rid of a device or remove their access, but before you do this, you can be strategic about how to plan for your safety.**"

### The honesty about limits

> "**The following information may not completely hide your tracks.** Many browser types have features that display recently visited sites. There is also spyware that can be used more secretly to track your activity. **The safest way to find information on the internet, would be at a local library, a friend's house, or at work.**"

### The private-browsing nuance almost nobody writes

> "Be mindful that if someone is tracking your history and they know you were online at a certain time, **it is worth leaving a public browser history of non-sensitive content available to them.**"

*(This is genuinely sophisticated advice: an empty history is itself suspicious.)*

### The search-engine gotcha

> "Please note that **even if you delete your history from your browser, the search engine you use may also keep a separate record of your searches.**"

### The evidence-vs-safety tension

> "It is understandable to want to remove evidence so you're not reminded of it, but collecting it helps to show abuse over time... **It's important not to put yourself at risk to gather evidence, don't take any steps that could alert someone that you're doing this.**"

> "If you have found a hidden camera, microphone or tracker that shows you're being monitored, **it can be really tempting to get rid of it, but this can alert your abuser that you are aware of this, and it can stop you from being able to document it.**"

### Structure of the Women's Aid page (use as an IA template)

1. General security — be aware (incl. the "don't act yet" warning)
2. How can an abuser discover your internet activities?
3. Exit site button / Private browsing / Deleting browsing history / Toolbars / Admin accounts
4. Online accounts (email, then platform-by-platform: BeReal, Discord, Facebook, Instagram, Messenger, Snapchat, TikTok, Threads, Twitter, WhatsApp)
5. Location tracking (mobile, social, fitness trackers, vehicle trackers, "other devices" incl. trackers disguised as chargers or children's toys)
6. Online banking
7. Wi-Fi and smart devices (incl. named ISP support numbers, and per-vendor reset links for Ring, Nest, Yale, SimpliSafe, Arlo, ADT…)
8. Online access to medical records
9. How to tell if your device has been hacked (a plain-language symptom list)
10. Reporting cybercrime
11. Digital evidence (how to screenshot, what metadata to capture, where to store it)
12. "Revenge porn" / intimate image abuse
13. Additional steps (passwords, 2FA, emergency alerts, phones, Apple, Android, anti-virus, phishing, backups, extensions, SOS contacts)

**Their password advice, verbatim, and worth copying because it's memorable:**
> "a strong password like three random words put together (for example, **OrangeRoseKoala** or **LeftStitchDoor**). The longer and more unusual your password is, the harder it is to crack."

**And the SOS-contacts landmine:**
> "if one of your named emergency contacts is an abuser, you may want to update (or remove) this information so they are not informed of your location or you contacting emergency services."

**→ NCRP recommendation:** build an India-localised equivalent covering: Aadhaar-linked services and mAadhaar, DigiLocker, UPI apps (GPay/PhonePe/Paytm) and their transaction history visibility, Jio/Airtel/Vi family plans and shared-number visibility, WhatsApp linked devices, Truecaller, Google Family Link, and the specific risk that a shared "family" phone plan exposes call and SMS logs.

---

## 3.6 Recommended NCRP quick-exit specification

**Label:** "Exit this page" (English) with tested equivalents per language. Not "Escape," not "Panic button," not an unlabelled icon.

**Mechanics:**
- Sticky top-of-viewport, all pages, all breakpoints. Minimum 48px height; full-width on mobile ≤480px.
- High-contrast; do not place it under any banner, consent notice, or app-install prompt. **Consent banners must render below it or not at all.**
- Primary action: `window.location.replace(destination)` — **not** `window.location.href`, so the entry is replaced in history, not appended.
- Blank the page (`document.body.style.display='none'` or an opaque overlay) synchronously *before* navigating, to protect users on slow connections.
- Keyboard: **Shift ×3 within 5s**, with 3 progress dots and screen-reader announcements, ported from GOV.UK Frontend. Guard against modifier combos and interleaved keys.
- Secondary skip-link at the very top of `<body>`.
- Destination: a regional weather page or `google.com`. Never personalised, never a specific query. Configurable per deployment.
- `rel="nofollow noreferrer"`.
- **Autosave the draft before exiting**, and say so on the interruption page.

**Companion content (mandatory, per GDS):**
- An **interruption page** on first visit stating what the button does, the Shift ×3 shortcut, that history is **not** erased, and that the draft **is** saved.
- A **safety content page**: private browsing, clearing history, using a library/friend's device, the "don't act yet" warning about tipping off a perpetrator, and the search-engine-history gotcha.

**Testing checklist:**
- [ ] Visible at 320px width, first paint, before JS hydration
- [ ] Not covered by the cookie/consent banner in any locale
- [ ] Sticky through full-page scroll on iOS Safari and Chrome Android
- [ ] Works with JS disabled (degrade to a plain link that at least navigates away)
- [ ] Shift ×3 works with Windows Sticky Keys on (document the actual press count)
- [ ] Announces correctly in NVDA, JAWS, VoiceOver, TalkBack
- [ ] Back button after exit does **not** reveal the page
- [ ] Destination loads in <2s on a throttled 3G profile

---

# PART 4 — TEARDOWNS OF REAL CRISIS AND SCAM-REPORTING SERVICES

## 4.1 StopNCII.org — the single most relevant model

**URLs:** https://stopncii.org/ · https://stopncii.org/how-it-works/ · https://stopncii.org/faqs/
**Operator:** SWGfL (UK charity) with Meta. Grew out of the **Revenge Porn Helpline**, founded 2015.

### Why it matters here

It solves the hardest problem the NCRP faces in NCII and sextortion cases: **how do you help someone whose evidence is the thing they most fear exposing?** The answer is *don't take the evidence*. Take a fingerprint of it. This is a directly portable architecture for an Indian NCII/sextortion flow.

### The homepage — layout and copy, verbatim

The H1 is a **question in the user's own words**, not a service name:

> **"What do you do if someone is threatening to share your intimate images?"**

Immediately followed by the reassurance, as a subhead:

> **"You are not alone"**

Then two questions covering both temporal states — *about to happen* and *already happened*:

> "Are you worried someone might share your intimate images online? Has this already happened to you?"

Then:

> **"We are here to help"**

Then credibility, stated as a number rather than an adjective:

> "Founded in 2015, the Revenge Porn Helpline (RPH) has supported thousands of victims of non-consensual intimate image abuse."
>
> "**With an over 90% removal rate, RPH has successfully removed over 300,000 individual non-consensual intimate images from the internet.**"

### How they explain hashing — the exact plain-language formulation

This is the most-copied sentence in the entire brief. Three escalating levels:

**Level 1 (homepage, one sentence, no jargon):**
> "The tool works by **generating a hash** from your intimate image(s)/video(s). StopNCII.org then shares the hash with participating companies so they can help detect and remove the images from being shared online."

**Level 2 (immediately after, the analogy):**
> "**Image hashing is the process of using an algorithm to assign a unique hash value to an image. Duplicate copies of the image all have the exact same hash value. For this reason, it is sometimes referred to as a 'digital fingerprint'.**"

**Level 3 (FAQ, the fuller analogy):**
> "A digital fingerprint – or a hash as it is technically known – **is like a barcode that is attached to an image/video when put through our technology.** The hash is then stored in the StopNCII.org bank and shared with partner platforms. Hashes are then compared to every image uploaded to a partner platform and if it matches, the image is removed. **Algorithms we use are PDQ/PhotoDNA for photos and MD5 for videos. They are open-sourced and are industry standard for applications like ours.**"

**Notice the structure:** plain claim → everyday analogy ("fingerprint", "barcode") → *then*, optionally, the technical names. The technical names are not hidden; they're just last. A distressed user gets what they need in sentence one; a sceptical or technical user can verify.

**The privacy promise, stated three separate times in three different places:**

> "To protect your privacy, **StopNCII.org does not download the images from your device** and collects the minimum amount of data to run the service."

> "**A hash will be sent from your device, but not the image/video itself. Your content will not be shared, it will remain on your device.**"

> "**No-one else will see your images when the hash is generated, the images will not leave your device.**"

*Repetition is the design.* The claim that matters most is repeated verbatim, not paraphrased.

### The eligibility gate — verbatim, and why it's well designed

> "If you meet the following criteria, you can use StopNCII.org.
>
> Are you:
> - The person who is in the image? (**Why do we ask this?**)
> - 18 or older at the time the image was taken?
> - Currently over 18 years old? (**Why do we ask this?**)
> - Still in possession of the image or video?
> - Are you nude, semi-nude, or engaging in a sexual act in the image/video?
>
> If all of these apply to you, and you are ready to use the StopNCII tool. Click on '**Create Your Case**'.
>
> **If you don't meet all the criteria, you can still get help. Click here for more information.**"

Four things to steal:
1. **"(Why do we ask this?)"** inline expanders on every intrusive question. Never ask a hard question without offering the reason *at the point of asking*.
2. **"and you are ready"** — an explicit acknowledgement that readiness is a real variable and the user controls it.
3. **A no-dead-end exit.** Failing the eligibility check routes to help, not to a rejection screen.
4. **"Create Your Case"** — possessive, agentive framing. It's *your* case, not "submit a complaint."

### The 6-step flow, verbatim from /how-it-works/

> **Step 1** — "Select any intimate image(s)/video(s) from your device."
>
> **Step 2** — "StopNCII.org will generate a hash (also known as a digital fingerprint) of the image(s)/video(s) **on your device**. A hash will be sent from your device, **but not the image/video itself**. Your content will not be shared, it will remain on your device."
>
> **Step 3** — "If your case is created successfully, you will receive a case number to check your case status: **remember to make a note of your case number along with the PIN to access your case after it is submitted. If lost, this is not recoverable so ensure it is kept safe.**"
>
> **Step 4** — "Participating platforms will look for matches to the hash and remove any matching images within their system(s) if it violates their intimate image abuse policy. **Please note: StopNCII.org cannot remove images from the whole internet, only the participating platforms listed on our partners page.**"
>
> **Step 5** — "StopNCII.org will periodically continue to look for matches on participating platforms."
>
> **Step 6** — "You may use your case number to check the progress of your case at any time **or withdraw it**."

**Six steps. Each one sentence to three sentences. The limitation is inside step 4, not buried in a footer.**

### The no-account design — anonymity as an architectural choice

> "**Why can't I create an account using my email address?**
> We want to keep the amount of data you need to share minimal, so **we don't ask, or need, your email address to create a case**. All you need to do is hash your images and keep hold of your PIN and case number. This way, minimal personally identifying information (only what we really need to run this service) is stored by us."

Exact retention disclosure:

> "The tool itself **does not collect or retain names, email addresses, or phone numbers.** Users can choose to enter their email address to enable us to send an email with their case number, though this is not a mandatory requirement. **Email addresses are then retained for 3 days** through a separate platform outside of StopNCII.org. **IP addresses will be retained in our log files for up to 30 days**, enabling us to manage and monitor our service usage — this, however, is not linked to a user's case."

And the corresponding cost, stated bluntly rather than softened:

> "Unfortunately, this is not recoverable in any way, so please keep this information safe. If you lose your case number or password, you will not be able to check your case status or withdraw your hashes. **We cannot help you reset your password or retrieve your case number, since we do not save that information.**"

**This is the exemplary trade-off disclosure in the whole corpus.** The user is told: we protect you by knowing nothing; the price is that we can't rescue you if you lose the key. No hedging, no "for your security" euphemism.

### Honest limitations — quote these as the standard for NCRP

> "**What are the limitations of the technology?** StopNCII.org uses image matching technologies that have been widely used by the tech industry to detect exact matches... **If an image that has been hashed is edited through cropping, filters added or a video clipped, the original hash may not recognise the image. The new image will need to be hashed separately.**"

> "**Does StopNCII.org prevent intimate images from being shared across the whole of the internet?** **No**, StopNCII.org works only with participating platforms listed on our partners page."

> "**Are encrypted services covered by StopNCII.org?** **No.** StopNCII.org only works on public facing platforms, posts, stories and videos etc. Most messaging platforms use encryption which means hashing technologies do not apply."

> "**Does StopNCII.org report content or individuals to the police?** StopNCII.org does not work with the police to report content, however our global network of partners can provide support to help you to take further action if needed."

### Handling the hardest edge cases, verbatim

> "**What if someone else is with me in the images I want to submit?** Regardless of who else is in the image, if you are in an intimate image and it is shared without your consent, this is NCII and you can hash this image."

> "**What about 'deepfake' or synthetic images?** If the 'deepfake' or synthetic image is of you, you have access to the image and it is nude/semi nude, then you can hash it. **We include these images in the definition of NCII.**"

> "**I'm a victim of sextortion/webcam blackmail can I use StopNCII?** Yes, if you have access to the content you can create a case, if you only have screen shots crop them as much as you can. **However this may not protect from a video being shared.**"

> "**Do I need to keep the intimate image on my device forever?** **No.** Once the hash is created, you can delete the image from your device if you wish and the hash will stay. **Like a lasting fingerprint, it will find the image if the match has been made on participating platforms.**"

*(That last one is a beautiful piece of writing: it answers the practical question and simultaneously gives the user permission to delete something they're desperate to be rid of.)*

> "**Can I change my mind and withdraw my hashes?** Yes, you can withdraw your case at any time... **While you have the ability to withdraw, please be aware that participating companies reserve the right to continue enforcing their policies once they've acquired knowledge of the hash.**"

Even the withdrawal right is qualified honestly.

---

## 4.2 Take It Down (NCMEC) — the under-18 equivalent

**URL:** https://takeitdown.ncmec.org/ · related: https://www.missingkids.org/gethelpnow/isyourexplicitcontentoutthere

### The H1 — the best single line of crisis copy in this entire brief

> **"Take It Down. Having nudes online is scary, but there is hope to get it taken down."**

Deconstruct it:
- Uses the word teenagers actually use: "**nudes**," not "intimate imagery" or "CSAM."
- **Validates first**: "is scary."
- **Then offers hope**, hedged honestly with "**there is hope to get it taken down**" — not "we will take it down."
- 14 words.

### The framing paragraph, verbatim

> "Take It Down is a free service that can help you remove or stop the online sharing of nude, partially nude, or sexually explicit images or videos taken of you when you were under 18 years old. **You can remain anonymous while using the service and you won't have to send your images or videos to anyone.** Take It Down will work on public or unencrypted online platforms that have agreed to participate."

### The anti-shame line — note the ordering

> "**It's scary when this happens to you, but it can happen to anyone. You've taken the first step, and we're here to help you with the next steps.**"

Four moves in 26 words: (1) validate the feeling, (2) universalise — de-isolate, (3) **credit the user for an action they've already taken**, (4) commit to continuity. The third move is the clever one: it converts a passive victim into someone who has already done something right.

### The one-line scoping to the sister service

> "If there is an explicit image of you from when you were 18 or older, you can get help at stopncii.org."

*One sentence. No dead end. No form to fill before being told you're in the wrong place.*

### Hashing explained for a teenager

> "Take It Down works by **assigning a unique digital fingerprint, called a hash value**, to nude, partially nude, or sexually explicit images or videos of people under the age of 18. Online platforms can use hash values to detect these images or videos on their services and remove this content. **This all happens without the image or video ever leaving your device or anyone viewing it. Only the hash value will be provided to NCMEC.**"

### Step-by-step, verbatim — including the emphasised warning

> "Select the explicit image or video that you want hashed from your device and click on '**Get Started**'. **Please do NOT send, share, or download any image or video in order to submit to Take It Down. Submissions should only be made for images or videos you already have on your device.**"
>
> "For each image or video, Take It Down will generate a 'hash' or digital fingerprint that can be used to identify an exact copy of that image or video."
>
> "**Your image or video remains on your device and is not uploaded.** The hash is added to a secure list maintained by NCMEC that is shared only with participating online platforms who have agreed to use this list to scan their public or unencrypted sites and apps for the hashes of your explicit content."
>
> "If an online platform detects an image or video on its public or unencrypted service that matches a hash value, it can take action to limit the spread of the explicit content!"

**The "don't re-download to submit" warning is a subtle safety design.** A minor trying to comply could re-acquire CSAM of themselves. NCMEC anticipated this and put it in bold caps at step one. **Any Indian NCII flow must carry the identical warning.**

### The consequence disclosure most services would omit

> "Please do not share the images/videos on any social media after you have submitted them here. Once the hash value for your image or video has been added to the list, online platforms may use them to scan their public or unencrypted services. **If you post the content in the future, it may be flagged and could put a block on your social media account.**"

They tell the user that the protection they just enabled can also work *against* them. That's the trustworthiness principle in action.

### The honest ceiling, then the pivot to hope

> "Online platforms may have limited capabilities to remove content that has already been posted in the past. For additional help, you can also report your image or video to NCMEC's CyberTipline where we can offer additional services and support."
>
> "**Most importantly, please remember, you are not alone!**"

**The sequence is: bad news → alternative action → reassurance.** Never bad news → reassurance alone (which reads as dismissive), and never bad news alone.

### Sister page: "Is Your Explicit Content Out There?"

> "Knowing your nudes or sexually exploitive images or videos taken when you were a child are on the internet can be frightening and overwhelming, **but there is hope to get them taken down**. **Survivors often say the process to remove images can be complicated, time consuming or feel invasive, but NCMEC is here to help.**"

Then — and this is the key structural move — it presents **three parallel options** and explicitly hands over control:

> "You may choose one or all three of these options, **but the choice is yours** and this page has information about all three."

The three: **CyberTipline** (analyst-assisted, needs URLs), **Take It Down** (hash-based, anonymous, no URL needed), **report directly to the companies** (self-service, with per-platform click-by-click instructions for Discord, Facebook, Google, Instagram, Imgur, Kik, Microsoft/Bing, Reddit, Snapchat, TikTok, Tumblr, X, YouTube, plus "Other Sites" via WHOIS registrar abuse contact).

The per-platform instructions are literal tap-by-tap sequences, e.g.:

> "To report a nude or sexually explicit image or video posted on Reddit:
> - Log into Reddit
> - Find the image or video you want to report in the app
> - Tap on the three dots '•••' in the top right corner of the image
> - Tap 'Report'
> - Select most appropriate reason (i.e., 'Non-consensual intimate media')
> - Select who the non-consensual media is of (yourself or someone else)
> - Hit 'Submit'"

And the template for what to say to an unlisted site's registrar:

> "- **Include your age**: it is important to tell them if you are a child/youth. Include your age at the time the image/video was taken as well as your current age.
> - **Say that you are the person in the image/video.** If you are recognizable in the image/video, include this as well – this may give your report a higher priority.
> - **Say that you did not post the image/video, did not agree to it being posted and want it removed.** They need to know that you object to the continued posting of the image/video."

**→ Direct NCRP recommendation:** build exactly this — a maintained, per-platform, tap-by-tap removal guide localised for the platforms Indian users actually use (Instagram, WhatsApp, Telegram, Snapchat, X, Facebook, YouTube, ShareChat, Moj, Josh), with a copy-paste request template.

---

## 4.3 Revenge Porn Helpline (UK)

**URL:** https://revengepornhelpline.org.uk/

**Layout / IA:** four expandable questions above the fold, phrased as the user's questions:
- "What is intimate image abuse?"
- "What issues can we help with?"
- "What can we do to help?"
- **"What we can't help with"** ← the fourth one is the notable one

**Managing expectations up front, verbatim:**

> "The Helpline is open from 10:00 to 16:00 Monday to Friday (excluding bank holidays). The Revenge Porn Helpline will currently be operating on an **email only basis on Fridays**."

*Stated in the header, not buried in a contact page. A user in crisis at 2am learns immediately that nobody is there, and can go elsewhere rather than waiting in false hope.*

**Legal clarity as reassurance:**

> "**Intimate image abuse is against the law in the UK.** The behaviours of taking, sharing and threatening to share intimate images without consent are against the law in the UK. **The legislation will differ depending on when the incident happened and where you live.**"

**Scope stated plainly:**
> "We are a UK service supporting **adults (aged 18+)** who are experiencing intimate image abuse, also known as, revenge porn."

**Social proof from a real user, chosen for the specific anxieties it answers:**
> "The person I spoke with was **very calming and professional**, she **listened very well** and gave me some excellent advice. **The rate that they worked to have the videos removed was so quick.** I appreciate everything they have done."

*(Answers three fears: will they judge me, will they listen, will they be slow.)*

**Anonymous reporting channel:** an anonymous "**Whisper**" report — a way to report without identifying yourself at all. Plus a chatbot framed with explicit scope-limiting:

> "I'm a chatbot here to support you in **finding information and reporting content at a time that works for you**."

**Also worth noting:** Women's Aid points at RPH with a line that itself is good copy —
> "Their site has lots of information about **what to expect when you get in touch with them**, which hopefully can make that first step a little bit easier."

---

## 4.4 Cyber Civil Rights Initiative (US)

**URLs:** https://cybercivilrights.org/ · https://cybercivilrights.org/ccri-crisis-helpline/ · https://cybercivilrights.org/ccri-safety-center · https://cybercivilrights.org/contact-us/

**Helpline:** 1-844-878-CCRI (2274), free, **24/7**, interpretation available in most languages.

**Verbatim:**
> "If you are a victim of nonconsensual pornography ('NCP', also known as 'revenge porn'), recorded sexual assault (RSA), or sextortion and you reside in the United States, please call the CCRI Crisis Helpline... **Compassionate and cross-trained representatives** can provide information, support, referrals, and non-legal advice."

**Expectation management, stated as respect rather than apology:**
> "**Thank you in advance for your patience, as we do have extended wait times.**"

**The mandatory-reporting disclosure — verbatim, and this is a model for NCRP:**
> "Please note that we do not offer services via email. **For your safety, please do not use this contact form to email images or other confidential information to CCRI.** If CCRI believes you or others are in danger of self-harm, suicide, child abuse or maltreatment, elder abuse or maltreatment, or other physical danger, **we may provide information that you have disclosed to us to the appropriate authorities.**"

*They disclose the limits of confidentiality before the user discloses anything. NCRP must do the same: state clearly, before the free-text box, what triggers mandatory escalation.*

### CCRI's sextortion bulletin — the anti-shame gold standard

**Source:** https://cybercivilrights.org/wp-content/uploads/2023/01/Sextortion-Scam-PSA.pdf

> "**Remember that this is not your fault and you are not alone. Thousands of internet users have been victimized by organized and deceitful sextortion scammers. You are not to blame for someone else's crime.**"

Note the mechanism: it doesn't just assert "not your fault." It gives a **reason** ("organized and deceitful," "thousands," "someone else's crime"). Assertion alone reads as scripted; assertion + reason reads as informed.

> "**If you are having thoughts of self-harm:** You may feel very embarrassed or worried. Remember, this is not your fault, and you do not have to go through this alone. **Dial '988'** to connect directly to the 988 Suicide and Crisis Lifeline."

*Note the ordering: name the feeling → normalise → give a one-step action. Not "if you're suicidal, call this."*

### CCRI's bystander guidance — the affirming-language script

**Source:** https://cybercivilrights.org/wp-content/uploads/2023/09/Bystander-_Guidance_9_13_23.pdf

> "You can use affirming language, like '**You're not alone**,' '**There's help available**,' and '**This is not your fault**.' Remember, **the offender is always responsible** for IBSA perpetration, and placing blame on the victim is never the right approach. **Avoid questions like, 'Why did you take that photo?' or 'How come you didn't have two-factor authentication on?'**"

**→ This is the single most directly actionable content-design rule for the NCRP form.** Every question in the report flow must be audited against it. Rewrite:

| ❌ Blaming | ✅ Neutral |
|---|---|
| "Why did you share your OTP?" | "Was an OTP or PIN shared during the call?" |
| "Did you verify the caller's identity?" | "How did the person contact you?" |
| "Why did you install the app?" | "Was any app or link opened on your device?" |
| "Did you click the link?" | "Which links were involved, if any?" |
| "How did you not realise it was a scam?" | *(delete — this field has no investigative value)* |
| "Did you send the photos voluntarily?" | "How did the person get the images?" |

---

## 4.5 IC3.gov (FBI Internet Crime Complaint Center)

**URL:** https://www.ic3.gov/

**Layout:** Clean US-federal template. Nav: About / File a Complaint / Alerts / Annual Report. Single dominant CTA: **"File A Complaint."**

### The first thing on the page is a warning about impersonation of itself

> "**Scammers are Impersonating the IC3**
>
> The IC3 does not work with any non-law enforcement entity, such as law firms or crypto services, to recuperate lost funds or investigate cases. **The IC3 will never directly contact you for information or money.** ... If you are approached by someone impersonating or claiming to work with IC3 or find a website impersonating the IC3, please file a complaint with the information. **Be sure to include the website link in your complaint.**"

**→ Highly relevant to India.** "Recovery scams" — second-wave frauds targeting people who already lost money — are rampant. The NCRP homepage should carry an equivalent, above the fold: *"NCRP and 1930 will never call you asking for money, OTPs, or remote-access apps to recover your funds. Anyone who does is a fraudster."*

### The lowered barrier to entry — verbatim

> "**Tell us what happened.** File a report to share information with the FBI. IC3 is the main intake form for a variety of complaints — everything from cyber-enabled frauds and scams to cybercrime — **so file a report even if you are unsure of whether your complaint qualifies.**"

*"Even if you are unsure whether your complaint qualifies" removes the biggest self-selection barrier: the fear of wasting an official's time or of being told this isn't a real crime.*

### The honest expectation-setting — this is the hardest thing to write well

> "**Your contribution and our mission.** Your report helps us fulfill our mission of protecting the American people. **While we cannot guarantee a response to every complaint, your report is still valuable.** It helps us understand the broader threat landscape. Furthermore, **in those cases where we are able to take action, we will work to provide justice.**"

> "Due to the massive number of complaints we receive each year, **IC3 cannot respond directly to every submission, but please know we take each report seriously.**"

### The anti-shame line

> "**Protect yourself and others.** If you have suffered from a cyber-enabled crime, **please know that you are not alone.** Use the resources on this site to learn more about how to protect yourself and others from cybercrime."

### Universalising the risk — removing the "only fools get scammed" frame

> "Criminals from every corner of the globe attack our digital systems on a near constant basis. They strike targets large and small — from corporate networks to personal smart phones. **No one — and no device — is immune from the threat.** The only way forward is together."

### The triage-before-you-start block

> "**If you or someone else is in immediate danger, please call 911 or your local police.**
>
> The IC3 focuses on collecting cyber-enabled crime. **Crimes against children should be filed with the National Center for Missing and Exploited Children.** Other types of crimes, such as threats of terrorism, should be reported at tips.fbi.gov."

*Routing is done before the form, in three sentences.*

### What IC3 does badly (learn from this too)

- The homepage foregrounds **aggregate loss statistics** — a bar chart of $4.2bn → $16.6bn (2020–2024), "over $50 billion dollars were reported lost." For an organisational or press audience this is impressive; **for a person who just lost their savings it is demoralising**, and it competes with the CTA for the tunneled user's single fixation. If NCRP shows statistics at all, put them below the fold and frame them as *company* ("you are one of many"), not *scale of futility*.
- The actual complaint form is long, dense, and desktop-oriented, with no visible save-and-return, no quick exit, and heavy legal preamble. **Do not copy the form.**

---

## 4.6 Scamwatch / National Anti-Scam Centre (Australia, ACCC)

**URLs:** https://www.scamwatch.gov.au/report-a-scam · https://www.nasc.gov.au/

### The "Before you report" block — verbatim, and note the ordering

> "**If you or someone else is in immediate danger, call 000.**
>
> If you've been the victim of a cybercrime (for example someone has stolen your personal information or money, or tried to extort you) you can make a police report.
>
> **Act fast if you've had your personal or financial information stolen. Contact your bank or credit card provider now and tell them to stop any transactions.**
>
> Find out what else to do if you've been scammed."

**The ordering is the design:** (1) life safety, (2) correct authority, (3) **the money-stopping action that must happen before the form**, (4) everything else. Scamwatch explicitly tells users to *leave the site and call their bank first*. That is trauma-informed prioritisation over funnel metrics — and it is exactly the posture the NCRP needs, given the golden-hour reality of CFCFRMS.

### Progressive disclosure via two Yes/No questions

Rather than a category tree, they ask two binary questions and route:

> "**Was your money stolen in the scam?** [Yes] [No] — We'll send you to our full report so you can tell us more."
>
> "**Was this an investment scam?** Investment scams promise big returns, but the goal is stealing money from you. [Yes] [No]"

Note the **inline definition** attached to the jargon term ("Investment scams promise big returns, but the goal is stealing money from you") — 13 words, grade ~6, right where the decision happens. No glossary, no tooltip.

### The "why bother" section — three reasons, each 2 sentences

Answering the unspoken "will this even do anything?":

> "**Help stop scams** — With your consent, we can use your report to work with organisations and remove scam websites, scam ads and contact details. Learning more about scammers' activities in Australia helps us design new and better ways to stop them.
>
> **Protect others** — Sharing details of a scam helps us warn the community of new or emerging scams. This way, we can all protect ourselves from scams by knowing what to look out for.
>
> **Get support** — If you're at risk of identity misuse or need support to recover from a scam, **we can help to connect you with IDCARE.**"

**Note "With your consent"** — even the *use of the report* is framed as the user's choice.

**Note the third reason.** Two of three benefits are altruistic; the third is a concrete personal benefit with a named partner (IDCARE, Australia's national identity & cyber support service). Never let all your "why report" reasons be about the state's needs.

### NASC framing and campaign

> "Scam reports are critical in helping us spot trends, disrupt scams and alert the community. **Help us fight back against scammers** by encouraging Australians to report scams."

Campaign mnemonic: **"Stop. Check. Protect."** — three words, three verbs.

**Humanising over statistics:**
> "**Real stories show no one is just a number this Scams Awareness Week** — Four courageous Australians share their stories... **They hope to encourage others to share their stories too.**"

*Note "courageous." Reporting is framed as an act of courage, which directly counters shame.*

---

## 4.7 Action Fraud & Stop! Think Fraud (UK)

**URLs:** https://www.actionfraud.police.uk/ · https://stopthinkfraud.campaign.gov.uk/

*(Note: actionfraud.police.uk is behind aggressive Cloudflare bot protection and could not be fetched directly during this research. The following is from secondary sources and the campaign site.)*

### Stop! Think Fraud — the anti-shame national campaign

Launched February 2024 by the Home Office, created by FCB London. Backed by City of London Police, NCSC and NCA.

**The core copy, verbatim:**

> "**Nobody is immune from fraud.** The criminals behind it target [people in] their homes, often emotionally [manipulating them]. **But there is something we can do.** By staying vigilant and always taking a moment to **stop, think and check** whenever we're approached, we can help to protect ourselves and each other from fraud."

> "**If you've been a victim of fraud, report it now.**"

Reporting routes stated plainly: England, Wales, NI → **Action Fraud online or 0300 123 2040**; Scotland → **Police Scotland, 101**.

### The evidence base for taking victim wellbeing seriously

Home Office / Savanta survey of **2,100+ UK fraud victims** (Feb–Mar), conducted for the campaign:
- **26%** reported **physical symptoms** — weight changes, headaches, panic attacks.
- Disturbed sleep was widespread.

Verbatim from a 64-year-old victim:
> "**I think more people need to recognise just how much of a toll fraud can have on someone's mental health.** The stress affects all aspects of your life, and if you don't have a good support network around you, it could easily become really overwhelming."

### The 2026 UK Fraud Strategy — the "Fraud Victims Charter"

From the Home Office launch speech (https://www.govwire.co.uk/news/home-office/fraud-strategy-launch-g1022471):

> "**Becoming a victim of fraud is devastating.** Our citizens and businesses deserve a response that is **modern, clear and compassionate.** That's why we're going to introduce a **Fraud Victims Charter** with consistent national standards of care that every victim should expect – **from response times, to emotional support, to reimbursement.**"

> "If you are a victim of fraud, the government's pledge is that this strategy will ensure **we will always find a way to listen, and provide assistance to support you.**"

**→ Direct NCRP recommendation:** publish an equivalent **NCRP Victim Service Standard** on the site itself — a short, plain-language, numbered commitment ("You will get an acknowledgement number immediately. A hold notice goes to the bank within X minutes. An officer will update you within Y days. You can check status anytime with your number."). A published standard is itself a trauma-informed artefact: it replaces uncertainty with a known shape.

### The documented reporting failure — why Action Fraud is a *cautionary* case

**Source:** Birkbeck/City of London research on UK online fraud victims — https://eprints.bbk.ac.uk/id/eprint/53739/1/33a035_103df035d9e94df9a48e89d17f73fb68.pdf

> "**The process of reporting online fraud in some cases contributed to and worsened the** [emotional impacts], with study participants describing feelings of anger, shame and anxiety."

> "Action Fraud is the national reporting centre for online fraud. **However, very few of our study participants reported to Action Fraud**, reflecting [that] most were unaware [of it]... most study participants did not report online [fraud] through this avenue, with **a lack of trust in** [the process]."

> "**Positive reporting experiences were characterised by quick, proactive and empathetic communication, while negative experiences were characterised by victim blaming and** [long waits] **for updates.**"

**→ That last sentence is the design brief in one line.** The two levers are: (1) speed and proactivity of communication, (2) absence of blame. Not features. Not form fields.

---

## 4.8 ScamShield & scamalert.sg (Singapore)

**URLs:** https://www.scamshield.gov.sg/ · https://www.scamshield.gov.sg/about-scamshield/what-is-scamshield/ · https://www.scamshield.gov.sg/check-for-scams/how-to-check-for-scams-on-scamshield-app/ · https://www.tech.gov.sg/products-and-services/for-citizens/scam-prevention/scamshield/
**Designer's account:** https://opengovsg.substack.com/p/behind-the-scenes-of-the-enhanced

*(Note: scamshield.gov.sg and scamalert.sg are behind CloudFront geo/bot restrictions and returned 403 during this research; content below is from GovTech pages, the Google Play listing, and OGP's published design write-up.)*

### The product suite — worth noting the multi-channel architecture

> "ScamShield is your defence against scams — **a suite of tools including an App, 1799 Helpline, website, and WhatsApp Alert Channel** to help you stay safe."

Four channels: **1799 helpline** (24/7), **app** (iOS/Android), **website**, **WhatsApp/Telegram alert channels**. Note that the helpline number is a memorable 4-digit number, like India's 1930.

### The best anti-urgency copy found anywhere in this research

> "**Check before you act.** **Scammers rely on urgency and confusion to get you to act quickly without thinking.** By taking a moment to check suspicious calls, messages, or links, you can ensure any transactions you're making are legitimate. Make it a habit to check suspicious things on the ScamShield app!"

**→ This names the manipulation mechanism explicitly.** For India's "digital arrest" epidemic — where the entire scam is a sustained artificial urgency — a line like *"Scammers rely on urgency and confusion to get you to act quickly without thinking"* placed prominently is a genuine intervention, not just copy.

### The "Check" flow — three steps

> "1. Let ScamShield know if you would like to check a number, message, or website link
> 2. Enter the suspicious number, message, or link you want to check. **For message checks, you can upload message screenshots from SMS, WhatsApp, and Telegram.**
> 3. ScamShield's AI-powered checker will let you know if it's a scam or not. **If it looks like a scam, ScamShield will also automatically report the relevant information to authorities to take action.**"

Three outcomes are stated plainly:
> "- Check if it's from a **verified source** like registered businesses and the government, and let you know it's safe
> - Check if it's **similar to known scam messages, numbers or links** previously identified by authorities, and let you know it looks like a scam
> - **Let you know if other scam-spotters in the community reported the number or message too**"

*(The third is peer support — SAMHSA principle 3 — implemented as a product feature.)*

### The privacy disclosures

> "**The App cannot read any SMSes you receive from contacts saved on your phone.** It only scans SMSes from unfamiliar numbers to look for any known signs of scams."

> "When you submit a scam encounter via the ScamShield app, **the authorities can only see the information you have submitted and not any personal information.**"

### The scope-limiting warning — verbatim from the Play Store listing

> "⚠️ **Heads up: Submitting a scam report in the app isn't the same as filing an official police report.** If you've been scammed, please file an e-report with the Singapore Police Force."

*Bluntly separating "helped the system" from "filed a case." Essential for NCRP, where users conflate a 1930 call, an NCRP complaint, and an FIR.*

### The usability finding — the most transferable lesson

From the OGP designer's write-up:

> "One key finding from our usability testing was that the '**Check and Report**' feature **confused some users, especially those new to ScamShield. The mental model of when to 'check' and when to 'report' was unclear to them. Separating these functions made the flow much more intuitive.**"

**→ Direct NCRP implication.** The NCRP conflates at least four distinct intents behind one "Report Cyber Crime" button:
1. **"Stop my money"** (urgent, financial, time-critical)
2. **"Is this a scam?"** (pre-victimisation check)
3. **"Get this content taken down"** (NCII/sextortion/impersonation)
4. **"Make a formal criminal complaint"** (FIR-track)

**These must be four separate entry points with four distinct mental models.** A person mid-"digital arrest" needs #1 and #2 in seconds. A sextortion victim needs #3 and may never want #4. Forcing all four through one taxonomy tree is a category error that costs money and dignity.

### The other stakeholder tension, honestly reported

> "One of our biggest design challenges was balancing ease of use with the needs of our stakeholders, particularly from authorities. **While we wanted to simplify reporting, such as allowing users to only submit a phone number, our collaboration with the authorities revealed that more detailed information was necessary to take action.**"

*Every crisis-reporting product hits this. The resolution is not to pick a side but to **stage** it: capture the minimum viable actionable set first, submit it, then invite the detail.*

### Scale
1.15M downloads; 99.8K+ unique reports; 42.9K users used "Check"; 48K submitted at least one report.

---

## 4.9 988 Suicide & Crisis Lifeline

**URL:** https://988lifeline.org/

Extremely spare. The whole homepage is four short blocks. That restraint *is* the design.

**Verbatim:**

> "**What to Expect** — The 988 Lifeline is available **24/7/365. Your conversations are free and confidential.**"

> "**Get in Touch** — The 988 Lifeline is for everyone. Through the 988 Lifeline, you have access to free, quality, one-on-one assistance. **Our skilled, judgment-free counselors are here to provide compassionate support. You deserve to feel heard and cared about anytime, anywhere, 24/7/365.**"

> "**Find Support for a Friend or Loved One** — Take care of a friend, a loved one, or yourself. Call, text, or chat with a 988 Lifeline counselor for help during difficult moments **anytime, day or night**."

Three phrases to steal:
- **"What to Expect"** as a heading. The single most reassuring heading you can write for a frightened user.
- **"judgment-free"** — the adjective that does the anti-shame work, applied to the *people*, not the service.
- **"You deserve to feel heard and cared about"** — second person, present tense, asserts worth. Not "we care about you" (which is a claim about the org); "you deserve" (a claim about the user).

Also note: **Spanish text/chat availability announced in Spanish, at the top.** Language parity is announced *in the language*, not in English.

---

## 4.10 Crisis Text Line

**URL:** https://www.crisistextline.org/

**The mechanic:** "**Text HOME to 741741**" — a single word to a five-digit number. Nothing to install, nothing to log into, nothing to read.

**Verbatim:**

> "Text HOME to 741741 from anywhere in the United States – **24/7, free, confidential.** Crisis Text Line is here for you. A live, trained volunteer Crisis Counselor will receive your text and respond with care and compassion. They're here to listen, support you, and **help you move from a hot moment to a cool calm.**"

> "**Need to vent?** Text HOME to 741741 to connect with a live volunteer Crisis Counselor."

Two brilliant lowerings of the threshold:
- **"a hot moment to a cool calm"** — a concrete, non-clinical description of the outcome. Not "reduce suicidal ideation."
- **"Need to vent?"** — permits contact without requiring the user to self-classify as in crisis. **Enormous.** Most people won't call a "crisis line" because they don't think they qualify. "Need to vent?" has no eligibility bar.

**The showcased conversation excerpt** — they publish a sample exchange so the user knows exactly what the interaction feels like before starting:

> Counsellor: "Hey there. It looks like you're going through a rough patch tonight. **Can you tell me a bit about why you're texting Crisis Text Line? I'm here to listen and help as best I can.**"
> Texter: "I just need someone to talk to."
> Counsellor: "**It sounds like you've been carrying your depression for a while, I imagine it's heavy.**"
> ...
> Counsellor: "**It's understandable to feel that way** when it's so hard to see past your depression. **Would you be interested in coming up with ways to manage the racing bothersome thoughts?**"

**The counselling moves visible in that transcript, all directly portable to UI microcopy:**
- Observe, don't diagnose: "It looks like you're going through a rough patch."
- Reflect with a metaphor: "I imagine it's heavy."
- Normalise before redirecting: "**It's understandable to feel that way.**"
- Offer, don't instruct: "**Would you be interested in...?**" not "You should..."

Their topic hubs are also named in user language: **"Financial Anxiety," "Doomscrolling," "Relationships."** Not "Mood Disorders."

> "**Financial anxiety happens when money worries take a toll on your life** — this resource offers tips to help you cope."

---

## 4.11 National Domestic Violence Hotline (US) — beyond the quick exit

**URL:** https://www.thehotline.org/

**The hero, in three words plus a promise:**

> "**Free. Confidential. 24/7. We're Here to Help**"

**Multi-channel, each labelled by what the user does, not by technology:**
- **Call** 1.800.799.SAFE (7233)
- **Chat** live now
- **Text** "START" to 88788
- **A.I. Chat** (framed as fallback only)

**The single best line on the site:**

> "**When you're ready, we're here to listen.**"

*Zero pressure. Puts the timing entirely in the user's control. Six words.*

**Survivor testimonials chosen to answer specific fears:**

> "**I felt seen and safe.** The advocate helped me understand my options and reminded me I wasn't alone." — Anonymous Chatter
>
> "**I didn't know where to start. They listened without judgment** and helped me make a plan that fit my situation." — Anonymous Caller
>
> "Ruth gave me hope and a will to live. To whomever created this, you save lives. Thank you." — Anonymous AI Caller

*("I didn't know where to start" is the exact anxiety of an NCRP user. Testimonials should be selected to pre-answer the objections that stop people reporting: I don't know where to start / they'll judge me / it won't help / it'll take forever.)*

**Scope honesty about what they don't do:**

> "The Hotline **does not provide direct financial assistance to individuals** (such as cash support, hotel vouchers, transportation vouchers, etc.) The Hotline can connect you with community resources that may be able to support these needs."

**Segmented helplines listed explicitly**, not hidden in a directory: StrongHearts (Native American/Alaska Native), National Teen Dating Abuse Helpline, The Deaf Hotline (videophone). **→ The Indian analogue is real and necessary:** separate, prominently listed routes for women (181), children (1098), senior citizens (14567), and cyber-financial (1930).

---

# PART 5 — LANGUAGE AND COPY FOR DISTRESSED USERS

## 5.1 The verbatim copy bank

Organised by the job the sentence does. All are from live services; sources given.

### Opening / arrival

| Copy | Source |
|---|---|
| "What do you do if someone is threatening to share your intimate images?" | StopNCII (H1) |
| "You are not alone" | StopNCII, IC3, NCMEC, Refuge, CCRI |
| "We are here to help" | StopNCII |
| "Having nudes online is scary, but there is hope to get it taken down." | Take It Down |
| "**You are not alone.** If you or someone you know is experiencing domestic abuse of any kind, Refuge is here to support you — **and we're glad you've found us.**" | Refuge |
| "Free. Confidential. 24/7. We're Here to Help" | The Hotline |
| "**When you're ready, we're here to listen.**" | The Hotline |
| "**Need to vent?**" | Crisis Text Line |
| "**What to Expect**" (as a section heading) | 988 |
| "Are you worried someone will find out you visited this website?" | 1800RESPECT |

### Anti-shame / anti-blame

| Copy | Source |
|---|---|
| "**This is not your fault and you are not alone. Thousands of internet users have been victimized by organized and deceitful sextortion scammers. You are not to blame for someone else's crime.**" | CCRI |
| "**Understand you are not at fault and you are not alone**" | FBI |
| "**IT IS NOT YOUR FAULT. You have been tricked and you are not alone!** You are a victim of organized crime, extorting many people, both minors and adults" | OJJDP/DOJ sextortion resource sheet |
| "**It is up to all of us to reassure them that they are not in trouble, there is hope, and they are not alone.**" | FBI Director Wray |
| "**Tell them they are not in trouble and they are not alone.**" | FBI Miami SAC |
| "It's scary when this happens to you, **but it can happen to anyone. You've taken the first step**, and we're here to help you with the next steps." | Take It Down |
| "**It is never the fault of the person who is experiencing it, and it is a crime.**" | Refuge |
| "**this is never your fault and you did nothing wrong. This can happen to anyone** and there is help available to you." | Women's Aid |
| "**Nobody is immune from fraud.**" | Stop! Think Fraud |
| "**No one — and no device — is immune from the threat.**" | IC3 |
| "**file a report even if you are unsure of whether your complaint qualifies**" | IC3 |
| "**courageous Australians share their stories**" | NASC |

### Explaining sensitive technical concepts

| Copy | Source |
|---|---|
| "Image hashing is the process of using an algorithm to assign a unique hash value to an image. Duplicate copies of the image all have the exact same hash value. For this reason, it is sometimes referred to as a '**digital fingerprint**'." | StopNCII |
| "A digital fingerprint – or a hash as it is technically known – **is like a barcode that is attached to an image/video**" | StopNCII |
| "**A hash will be sent from your device, but not the image/video itself. Your content will not be shared, it will remain on your device.**" | StopNCII |
| "**This all happens without the image or video ever leaving your device or anyone viewing it.**" | Take It Down |
| "**No-one else will see your images** when the hash is generated" | StopNCII |
| "**Like a lasting fingerprint**, it will find the image if the match has been made on participating platforms." | StopNCII |
| "The App **cannot read any SMSes you receive from contacts saved on your phone.** It only scans SMSes from unfamiliar numbers" | ScamShield |

### Setting expectations / delivering limits

| Copy | Source |
|---|---|
| "**StopNCII.org cannot remove images from the whole internet, only the participating platforms** listed on our partners page." | StopNCII |
| "**Online platforms may have limited capabilities to remove content that has already been posted in the past.** For additional help, you can also report your image or video to NCMEC's CyberTipline" | Take It Down |
| "**While we cannot guarantee a response to every complaint, your report is still valuable.**" | IC3 |
| "Due to the massive number of complaints we receive each year, IC3 cannot respond directly to every submission, **but please know we take each report seriously.**" | IC3 |
| "**Thank you in advance for your patience, as we do have extended wait times.**" | CCRI |
| "The green Exit Site button **will quickly hide the page but you will still need to delete your history.**" | Women's Aid |
| "**The following information may not completely hide your tracks.**" | Women's Aid |
| "This will **not be a foolproof way** of keeping all online information hidden but is **a line of defense**" | MoJ |
| "**Submitting a scam report in the app isn't the same as filing an official police report.**" | ScamShield |
| "**their internet browsing history will not be erased, which can still put them at risk**" | GOV.UK EtP pattern |

### Action instructions under stress

| Copy | Source |
|---|---|
| "**If you or someone else is in immediate danger, call 000.**" | Scamwatch |
| "**Act fast if you've had your personal or financial information stolen. Contact your bank or credit card provider now and tell them to stop any transactions.**" | Scamwatch |
| "**Don't pay them. If you already have, stop paying them.** Paying them only leads to a demand for more money." | OJJDP |
| "**Stop all contact.** Block them and report to the platform. **Don't delete any communication to/from them.**" | OJJDP |
| "**Block the predator, do not delete the profile or messages** and contact law enforcement." | FBI |
| "**Save all interactions; those can help law enforcement identify and stop the predator**" | FBI |
| "Please do **NOT** send, share, or download any image or video in order to submit" | Take It Down |
| "**Stop. Check. Protect.**" | NASC |
| "**Check before you act.**" | ScamShield |

---

## 5.2 Reassurance without condescension — the rules

**The failure mode:** reassurance that is *unearned*, *generic*, or *about the organisation rather than the user* reads as patronising or scripted.

### Rule 1 — Reassurance must carry information

| ❌ Empty | ✅ Informative |
|---|---|
| "Don't worry, we're here for you." | "**Your images stay on your phone. Only a fingerprint of them is sent.**" |
| "We understand this is difficult." | "**Most people who report this took days to decide. You can save this and come back.**" |
| "You're in safe hands." | "**Only the officer assigned to your case can see this report. Not your bank, not your family.**" |
| "Help is at hand!" | "**1930 is answered 24 hours. If they're busy, your report here still triggers the bank hold.**" |

### Rule 2 — Assert the user's worth, don't advertise your own virtue

- ❌ "We are a compassionate, caring organisation dedicated to victims."
- ✅ "**You deserve to feel heard and cared about anytime, anywhere.**" (988)
- ✅ "Our skilled, **judgment-free** counselors are here." (988) — the adjective describes what they *won't* do to you.

### Rule 3 — Credit the user for what they've already done

> "**You've taken the first step**, and we're here to help you with the next steps." (Take It Down)

This is the highest-leverage single sentence in crisis copy. It reframes the user from passive victim to active agent, and it costs nothing.

**NCRP applications:**
- On the report form: "You've already done the hardest part — deciding to report."
- On the confirmation: "You reported this in [X hours]. That gives the bank the best chance of freezing the money."
- After a partial save: "You've done three of the five sections. The rest can wait."

### Rule 4 — Observe, don't diagnose

- ❌ "You must be feeling traumatised."
- ❌ "We know you're devastated."
- ✅ "It looks like you're going through a rough patch tonight." (Crisis Text Line)
- ✅ "**It's understandable to feel that way.**" (Crisis Text Line)

Never tell someone what they feel. Offer a hypothesis, or normalise a feeling they may have.

### Rule 5 — Offer, don't instruct, on anything non-urgent

- ❌ "You should now change all your passwords."
- ✅ "**Would you be interested in** [doing X]?" (Crisis Text Line)
- ✅ "When you're ready, here's what usually helps next."

**Exception:** for the genuinely time-critical money-stopping steps, be directive and imperative. "**Contact your bank now and tell them to stop any transactions.**" (Scamwatch). The distinction is: **imperative for the urgent safety action, invitational for everything else.**

### Rule 6 — Cut the throat-clearing

Delete: "We are sorry to hear that…", "Unfortunately…", "Please be advised that…", "It has come to our attention…", "We regret to inform you…". Every one of these delays the information for a reader who will consume ~20% of your words.

### Rule 7 — Warmth is specific, not adjectival

Refuge's "**and we're glad you've found us**" is warm. "We are a warm and welcoming service" is not.

---

## 5.3 Anti-shame messaging — the evidence and the craft

### The research: shame is the primary reporting barrier

**Systematic review:** *Mental health and psychosocial sequelae of fraud victimization*, Frontiers in Psychology, 2026 (21 studies). https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1805536/full

> "Victims often experienced **shame, embarrassment, and self-blame, internalizing responsibility and interpreting victimization as a personal failure**. Such internalized blame was linked to **diminished self-worth, reduced confidence, and reluctance to disclose victimization, with fear of judgment and stigma frequently delaying help-seeking.**"

> "Consistent with stigma frameworks, fear of judgment and anticipated social disapproval were commonly reported as barriers to disclosure and seeking help, thereby limiting access to social validation and formal support. The qualitative studies... indicated that **delayed reporting, concealment, and social withdrawal were frequent**, particularly among emotionally manipulative scam victims, such as those experiencing romance fraud."

**Australian Institute of Criminology**, *The reporting experiences and support needs of victims of online fraud* (tandi518) — 80 in-depth interviews, all with losses ≥ AU$10,000. https://www.aic.gov.au/publications/tandi/tandi518

> Victims described the fraud as "**devastating**", "**soul-destroying**", or as an event that was "the first thing I thought about when I woke up and the last thing I thought of before I went to sleep".

> "The most common [emotional responses] were **shame or embarrassment, distress, sadness and anger.**"

> "**Previous research suggests victims blame themselves for their circumstances as a coping mechanism**, which allows them to make sense of what occurred, take control of the situation and thus recover from the impacts of the fraud (Janoff-Bulman 1985). In line with this, **many participants' sense of embarrassment or shame appears to stem from self-blame.**"

> "**Victims of online fraud are not always seen as genuine victims; rather, they are seen as partially responsible for their own victimisation** (Cross 2015). There is a **strong tendency to blame online fraud victims**, which impacts heavily on their willingness to report in the first place and, likely, their experience of doing so."

**UK (Birkbeck):** https://eprints.bbk.ac.uk/id/eprint/53739/1/33a035_103df035d9e94df9a48e89d17f73fb68.pdf

> "The emotional impact of being a victim of online fraud was significant and **worse than the financial impact**, with **self-blame featuring consistently** across study participants."

> "This was linked to the **preconceived notion that online fraud happened to 'others'**, resulting in shame and embarrassment that victims '**did not see that [it] was a scam**'. **The feelings of shame and embarrassment were particularly heightened for those who saw** [themselves as] **lacking technological skills.**"

**Older adults (UCL Dawes Centre, Havers, Tripathi, Burton, Martin, Cooper):** https://doi.org/10.21428/cb6ab371.8c4e3181

Four themes, verbatim:
> "**Theme 1: Shame and fear of repercussion**, described feelings of shame around reporting, **compounded by victim self-blame for relinquishing funds or device control**, and a modus operandi and anonymity of malicious actors that **evoked feelings of guilt in victims as well as fear of repercussions.**"
>
> "**Theme 2: Reporting perceived as unhelpful** to emotional or financial recovery... **fear that reporting may extend or worsen their distress**... Other participants anticipated more negative than positive consequences of reporting – **that they would not be heard, might be blamed and resources would not be recovered.**"
>
> "**Theme 3: Lack of knowledge** of scams and sources of support"
>
> "**Theme 4: Social support makes a difference:** ...supportive groups or professional relationships... **could reassure victims that they were not alone, cybercrime was common, and they could seek advice if targeted in future.**"

**→ Theme 2 is the killer.** Elderly Indian victims are not failing to report because the form is long. They are not reporting because they expect *not to be heard and to be blamed*. **The NCRP's front page must pre-empt both, in the first screen, in plain language.**

### The craft: how to write "not your fault" without sounding scripted

The generic line — "This is not your fault" — is now so common it can read as boilerplate. What makes it land is **pairing it with a reason**. Compare:

| Version | Effect |
|---|---|
| "This is not your fault." | Scripted. Asserted without evidence. Easy to dismiss. |
| "This is not your fault and you are not alone." | Slightly better — adds de-isolation. |
| "**This is not your fault and you are not alone. Thousands of internet users have been victimized by organized and deceitful sextortion scammers. You are not to blame for someone else's crime.**" (CCRI) | **Lands.** Provides: scale ("thousands"), attribution ("organized and deceitful"), and a moral argument ("someone else's crime"). |
| "**It is not your fault. You have been tricked and you are not alone! You are a victim of organized crime, extorting many people, both minors and adults.**" (OJJDP) | **Lands.** "You have been **tricked**" locates the agency in the offender. "Organized crime" reframes the user from gullible individual to target of a professional operation. |

**The four ingredients of a non-scripted anti-shame line:**

1. **Attribute agency to the perpetrator** — "you have been tricked," "someone else's crime," "used by someone to control," "designed to."
2. **Give scale** — "thousands," "this happens every day," a real number if you have one.
3. **Professionalise the offender** — "organized crime," "trained," "this is their full-time job," "a scripted operation." This is the most effective single move for financial fraud, because it directly contradicts the "I was stupid" narrative.
4. **Universalise** — "it can happen to anyone," "nobody is immune."

**Draft lines for the NCRP (built to these rules, adapted to Indian scam typologies):**

> **Financial fraud / UPI:**
> "This was done to you by people who do it for a living. They use scripts refined on thousands of people before you. **Losing money to them is not a failure of intelligence — it is the result of a professional deception.** Report it, and we will try to stop the money."

> **Digital arrest:**
> "**There is no such thing as a digital arrest.** No police officer, court, CBI, ED or customs official in India will ever arrest you over a video call, or ask you to stay on camera, or ask you to transfer money to prove you are innocent. **If you were told this, you were being deceived by criminals — not investigated.** You did nothing wrong by being frightened. Being frightened was the point."

> **Sextortion:**
> "**You are not in trouble. The person threatening you is committing a crime — you are not.** These are usually organised groups who contact hundreds of people at a time. **Paying them almost never stops it.** You do not have to send us the images to get help."

> **NCII:**
> "**Sharing an intimate image of someone without their consent is a crime in India.** It does not matter whether you took the photo, sent it, or trusted the person. **Consent to take an image is not consent to share it.** What happened to you is their crime, not your mistake."

> **Elderly victims (add):**
> "These calls are designed to sound official, and they are designed to work on careful people. **Many of the people who report this to us have worked in banks, in government, in the armed forces.**"

**Two things to avoid absolutely:**
- **Don't over-repeat it.** Saying "not your fault" on every screen becomes noise and starts to sound like the service protesting too much. Say it once, well, at the point of highest shame (the start of the flow and the moment before a disclosure field).
- **Don't pair it with a prevention tip.** "This isn't your fault. Next time, always verify the caller." The second sentence destroys the first. Prevention advice belongs on a *separate page, later*, framed as protecting others: "If you'd like to warn someone else, here's what to tell them."

---

## 5.4 Delivering bad news honestly without destroying hope

The archetypal NCRP case: money was moved through 8 accounts and withdrawn 40 minutes ago. It is almost certainly gone.

### The structural pattern that works (derived from Take It Down, IC3, StopNCII)

**1. Say the limit plainly and early. 2. Immediately give the next possible action. 3. Then, and only then, reassure.**

Take It Down's exact sequence:
> [Limit] "Online platforms may have limited capabilities to remove content that has already been posted in the past."
> [Action] "For additional help, you can also report your image or video to NCMEC's CyberTipline where we can offer additional services and support."
> [Reassurance] "**Most importantly, please remember, you are not alone!**"

IC3's exact sequence:
> [Limit] "While we cannot guarantee a response to every complaint,"
> [Value] "your report is still valuable. It helps us understand the broader threat landscape."
> [Hope, conditional and honest] "Furthermore, **in those cases where we are able to take action, we will work to provide justice.**"

**Note IC3's construction: "in those cases where we are able to take action."** It preserves hope by scoping it to a real subset rather than promising universally or denying flatly.

### The technique: separate what is uncertain from what is certain

Never leave a user with a single probability. Always give them at least one thing that is definitely true and definitely happening.

**❌ Wrong:**
> "Unfortunately, recovery of funds in cases like yours is unlikely. Most cybercrime cases do not result in restitution."

**❌ Also wrong (false hope):**
> "Don't worry! We will get your money back."

**✅ Right:**
> "**Here's what we've already done:** a hold notice went to [Bank] at 14:12 today, 22 minutes after you called 1930.
>
> **Here's what we don't know yet:** whether the money is still in that account. Banks usually confirm within 3 working days, and we'll tell you either way.
>
> **Here's the honest picture:** when money has already been withdrawn or moved on, it often cannot be recovered. **We will tell you as soon as we know, rather than leaving you waiting.**
>
> **Here's what still matters, whatever happens to the money:** your report is being matched against others. [Suspect's number] has now been reported by [N] other people, and that is what lets us go after the people who did this."

**The four moves:** (1) certain past action with a timestamp, (2) named uncertainty with a named deadline, (3) honest probability *with a commitment to communicate*, (4) a source of meaning that does not depend on the money.

### Phrases that preserve hope honestly

- "**often**" / "**usually**" / "**in many cases**" — never "always"/"never"
- "**We'll tell you either way**" — the commitment that costs nothing and buys the most trust
- "**Here's what happens next, and when**"
- "**Even if [X] isn't possible, [Y] still is**"
- "**Your report still matters, and here's exactly how**"

### Phrases that destroy hope or credibility

- "Unfortunately, there is nothing further we can do." *(a closed door with no next step)*
- "Your case has been closed." *(with no explanation of what closed means)*
- "Don't worry." *(instructs an emotion; the user will worry regardless, and now distrusts you)*
- "We will recover your money." *(unless you actually will)*
- "Rest assured that every effort is being made." *(passive, agentless, meaningless)*
- Silence. **Nothing destroys hope like an un-updated status.** The UK research is unambiguous: negative reporting experiences were characterised by "victim blaming and [long waits] for updates."

### The status-page principle

A "pending" status with no date is a wound. Every NCRP case status should show: **what happened, when it happened, what happens next, and by when.** If nothing has happened, say that: *"No update since 14 Aug. Cases like yours are usually reviewed within 21 days. Next expected update: 4 Sep."*

---

## 5.5 Warnings that are heeded but don't induce panic freeze

### The panic myth — settle this first

**Mileti, D.S. & Peek, L. (2000)**, *The social psychology of public response to warnings of a nuclear power plant accident*, Journal of Hazardous Materials 75(2-3):181–194. https://hazards.colorado.edu/uploads/publications/57_2000_Mileti_Peek.pdf

> "**First, it cannot be overemphasized that the public simply does not panic in response to warning of impending disasters**... This myth is largely the result of movie producers who depict masses of screaming, fleeing, completely panicked individuals in dangerous scenarios. This is not to say that people never panic, but panic only occurs in very particular circumstances that rarely, if ever, can be found in an actual emergency. These conditions include people being in a closed room with an immediate and clear source of death, and the presence of an escape route for which it is obvious that there is insufficient time for everyone to escape with their lives. **Note that panic behavior is different from elevated stress, which is a psychological response that the public and media often label as panic.**"

> "**The negative consequence of the myth of panic is that warning officials are reluctant to tell the truth or may withhold warning information because they are afraid of causing panic.** As discussed earlier, **people typically respond to warnings by doing everything in their power to obtain more information.** Thus, **withholding information from the public — whether that information is good or bad — is quite detrimental to the overall warning process.**"

Also confirmed in the PADM literature: "**contrary to widespread belief, panic rarely occurs.**" (Lindell & Perry, *The Protective Action Decision Model*, Risk Analysis 32(4), 2012 — https://training.weather.gov/wdtd/courses/woc/human-factors/crisis-comms-sm/risk-assess/story_content/external_files/Protective%20Action%20Decision%20Model.pdf)

**→ Two implications:**
1. **Do not soften or withhold bad news out of fear of panic.** The dominant real response is *information-seeking*, so give them the information.
2. **Do design for information-seeking.** After any warning, the very next thing the user will do is look for more. If you don't provide "more," they will find it on WhatsApp forwards or a recovery-scam site. **Every warning must have a "Read more about this" link immediately adjacent.**

### The five mandatory content elements of a warning

Mileti & Peek:

> "Five specific topics are important to include in assembling the actual content of a public warning message. These topics are **hazard, location, guidance, time, and source.**"

Applied to an NCRP warning:

| Element | Bad | Good |
|---|---|---|
| **Hazard** | "Beware of fraud!" | "Callers pretending to be from TRAI or the Mumbai Cyber Cell are telling people their SIM is being used for crime." |
| **Location** | (omitted) | "Reported across Maharashtra and Karnataka in the last 7 days." |
| **Guidance** | "Stay vigilant." | "**Hang up. Then call 1930.** No real officer will video-call you or ask you to stay on camera." |
| **Time** | (omitted) | "If money has already been sent, call 1930 **now** — the first hour matters most." |
| **Source** | (unattributed banner) | "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs — updated 22 Aug 2026." |

Note "Stay vigilant" fails the **guidance** test entirely — it names no action. It is the single most common and most useless line in Indian cyber-safety communication.

### PADM — the five questions a warning must answer

**Lindell & Perry (2012)**, plus NIST TN 1827 (https://doi.org/10.6028/NIST.TN.1827):

Three pre-decision processes: **reception → attention → comprehension.** Then five sequential questions:

1. "**Is there a real threat that I need to pay attention to?**" (threat belief)
2. "**Do I need to take protective action?**" (personalising the risk)
3. "What can be done?" (protective action search)
4. "What's the best method of protection?" (assessment)
5. "Does protective action need to be taken now?" (implementation)

> "The more certain, severe, and immediate the risk is perceived to be, the more likely the individual is to perform protective actions."

**→ Warning design rules from PADM:**
- **Reception:** the warning has to be seen. Sticky, but not modal. Not in a carousel.
- **Attention:** it must be distinguishable from routine chrome. One warning at a time. If everything is a warning, nothing is.
- **Comprehension:** grade 6–8, in the user's language.
- **Personalisation is the bottleneck.** A generic "cyber fraud is rising" fails at Q2. "**People in your state received 4,300 of these calls last month**" passes. Specificity is what converts a warning into an action.
- **Answer Q3–Q5 in the same block.** A warning without an immediately adjacent action is a freeze generator.

### The anti-freeze checklist for any NCRP warning

- [ ] States a specific hazard, not a category
- [ ] Names **one** action, as an imperative verb, first word if possible ("**Hang up.**")
- [ ] The action is achievable in ≤3 steps by an 70-year-old on a 5-inch phone
- [ ] Attributed to a named, dated source
- [ ] Has a "More about this" link (because information-seeking is the real response)
- [ ] No countdown timer, no flashing, no siren sound, no ALL CAPS
- [ ] No more than one warning visible at a time
- [ ] Does not use fear as the primary motivator where a factual statement will do
- [ ] Tested at grade 6–8 in every language it ships in

---

## 5.6 "Victim" vs "survivor" vs neutral phrasing

### The consensus position

**Sources:**
- SAKI TTA, *Victim or Survivor: Terminology from Investigation Through Prosecution* — https://www.sakitta.org/toolkit/docs/Victim-or-Survivor-Terminology-from-Investigation-Through-Prosecution.pdf
- Zero Tolerance (Scotland), *Language Guide* — https://www.zerotolerance.org.uk/resources/Language-Guide.pdf
- NAESV glossary — https://endsexualviolence.org/wp-content/uploads/2025/05/NAESV-FVPSA-SA-TA-Glossary.pdf
- NDDSVC language guide — https://nddsvc.org/wp-content/uploads/2026/04/Domestic-and-Sexual-Violence-Language-Guide.pdf

**SAKI TTA, verbatim:**
> "Although both terms are appropriate, they serve different needs. **The term victim typically refers to someone who has recently experienced a sexual assault; additionally, this word is commonly used when discussing a crime or when referencing the criminal justice system. The term survivor often refers to an individual who is going or has gone through the recovery process**... **The best way to be respectful is to ask for their preference.**"

> "**Explaining the definition of victim within the criminal justice system will help the individual understand the term as a legal status, not as a label.** Remember, don't assume that because someone felt empowered by the term survivor that they will always identify with that term... **a survivor may not always feel empowered.**"

**Zero Tolerance, verbatim:**
> "Some people identify as victims and some identify as survivors. **It is best to ask the individual which they would prefer.** Where this is not possible **use victim when an attack has resulted in the murder of a woman, when discussing the crime or criminal justice system. Use survivor when referring to the woman in all other instances. You can also use victim-survivor if you are not sure or if you are speaking in general terms.** Or if you have permission, use her name."

**NDDSVC, verbatim:**
> "Some people prefer the term '**victim**' because it **conveys that a crime was committed against them**... we typically use 'victim' whenever referencing a specific crime, legal information, or the legal system."
> "Some people prefer the term '**survivor**' because it **conveys strength and healing beyond the violence they experienced.**"

**The critique of "victim"** (RSACC, https://www.rsacc-thecentre.org.uk/guest-blogs/victim-survivor-the-importance-of-the-language-we-use-to-talk-about-people-who-have-experienced-sexual-violence/):
> "Victims have been framed as being '**passive,' 'weak,' 'traumatised,' 'stigmatised,' 'powerless**,' and even, in the most extreme cases, '**mentally ill**.'"

### Recommendation for the NCRP

**Best default: second person, no label at all.** In a service the user is *using*, you rarely need a noun.

| ❌ Labelled | ✅ Second person |
|---|---|
| "Victim details" | "**About you**" |
| "The victim should contact their bank." | "**Contact your bank.**" |
| "Victim Support" | "**Support for you**" |
| "Are you the victim?" | "**Did this happen to you, or to someone you're helping?**" |
| "Victim's statement" | "**What happened, in your words**" |

**Where a noun is unavoidable:**
- Use **"victim"** in strictly legal/procedural contexts (FIR text, BNSS references, "Victims' rights under Indian law", compensation schemes) — because there it is a **legal status that confers rights**, and the SAKI guidance is explicit that this is appropriate.
- Use **"survivor"** in support, healing, and community contexts, and for image-based abuse.
- Use **"victim-survivor"** in general/policy writing when addressing an unknown audience.
- **Never** use "alleged victim" in user-facing copy. **Never** use "complainant" — it is bureaucratic, slightly adversarial, and semantically implies the person is the one causing trouble.
- **Avoid "scam victim"** entirely as a self-selecting label on a landing page ("Are you a scam victim? Click here"). Many people won't click because they haven't accepted the label yet. Use the event instead: "**Have you lost money to a fraud?**" / "**Is someone threatening to share your photos?**"

**Never use these** (Indian-context additions): "gullible," "duped," "conned," "fell for," "taken in by," "naive." Also avoid the passive-blaming construction "the victim shared their OTP" in officer-facing UIs — write "an OTP was shared during the call."

**One more:** avoid "**revenge porn**" in primary copy — it centres the perpetrator's motive and implies the victim did something to be avenged. Use "**intimate image abuse**" or "**sharing intimate images without consent**." (Note that RPH and CCRI still use "revenge porn" alongside — for SEO and recognition. Do the same: use it as a secondary/searchable term, not as the primary label.)

---

## 5.7 Anti-scam-lookalike: what a legitimate service must NOT do

**This is the most under-considered constraint in the entire brief, and for the NCRP it is critical.**

The user arriving at the portal was, minutes or hours ago, successfully manipulated by an interface or a voice that used **urgency, authority, fear, secrecy, and pressure to act immediately.** Their threat-detection is now hair-trigger and simultaneously miscalibrated. **Any legitimate service that uses the same psychological levers will either be abandoned as a scam, or — worse — will retraumatise.**

There is also a hard second-order risk: **recovery scams.** Fraudsters harvest victims and re-approach them posing as recovery agents, lawyers, or officials. IC3 warns about impersonation of *itself* on its own homepage. If NCRP's real communications look like a scam, users cannot distinguish NCRP from the criminal impersonating NCRP.

### The manipulation levers used against these users — and the corresponding prohibitions

| Scammer lever | What it looked like in the scam | **NCRP must never** |
|---|---|---|
| **Artificial urgency** | "You have 2 hours before the warrant is executed." | Use countdown timers, "act now," "expires in", pulsing/flashing urgency, or any time-pressure that isn't a real legal deadline. Where time genuinely matters (golden hour), state it **once, factually**: "Reporting sooner gives the bank more chance to freeze the money." |
| **Authority display** | Fake uniforms, fake courtroom backdrops, fake CBI/ED letterheads, forged Supreme Court orders | Over-use official seals, badges, and emblems as *persuasion*. Use them once, in the standard government header, and let verifiability (the `.gov.in` domain, a published verification page) do the work instead. |
| **Isolation** | "Do not tell your family. Do not call a lawyer. National security." | Discourage the user from consulting anyone. **Actively do the opposite:** "You can ask a family member or friend to sit with you while you fill this in." "You may want to speak to a lawyer. That is your right." |
| **Continuous control** | Kept on video call for hours, told to stay on camera while sleeping | Require a synchronous session. Never require the user to stay on a call or on the page. **Save-and-return is an anti-scam signal.** |
| **Fear as motivator** | "You will be arrested. Your Aadhaar is linked to money laundering." | Use fear-based framing anywhere. Not in awareness content, not in nudges, not in security warnings. |
| **Payment demands** | "Transfer to this account to prove your innocence." | Ask for **any** payment, ever. State this explicitly and prominently: "**NCRP is free. We will never ask you for money.**" |
| **Credential harvesting** | OTP, PIN, CVV, Aadhaar, remote-access app | Ask for an OTP for anything other than the user's own login, or for a PIN, CVV, full card number, or net-banking password. **State the prohibition on the form itself, at the point where a scammer would ask.** |
| **Remote access** | AnyDesk / TeamViewer / QuickSupport | Ever ask a user to install anything. Say so: "We will never ask you to install an app or share your screen." |
| **Unverifiable contact** | Spoofed numbers, WhatsApp "officials" | Contact users from unpublished numbers. **Publish the exact numbers and sender IDs NCRP uses**, and let users verify any contact against that list. |
| **Secrecy about process** | "This is a confidential investigation; you cannot be told more." | Be vague about what happens next. Vagueness is the scammer's habitat. |

### The positive obligations (what a legitimate service must do *because* scams don't)

1. **Slow down instead of speeding up.** "Take your time. Nothing is submitted until you press Submit." A scam would never say this. **The permission to pause is itself a legitimacy signal.**
2. **Invite third parties in.** "You can ask someone you trust to help you with this." Scams isolate; legitimate services invite witnesses.
3. **Be verifiable in both directions.** Publish a page: *"How to check that a call, SMS, or email from NCRP is genuine."* List every sender ID, every number, and the things NCRP will never do. Make it linkable from every message NCRP sends.
4. **Never create an artificial secret.** If information must be withheld for investigative reasons, say *that* explicitly: "We can't share details of the investigation while it's open. Here's what we can tell you."
5. **Reversibility everywhere.** Every action editable, withdrawable, undoable. Scams are one-way ratchets; legitimacy is reversible.
6. **No unsolicited outbound asking for anything.** If NCRP needs more information, the message should say "**Log in to the portal to see a message about your case**" — never "reply with your account number."
7. **Carry the IC3-style self-impersonation warning above the fold:**
   > "**NCRP and the 1930 helpline will never ask you for money, an OTP, a PIN, or to install an app.** We will never call you offering to recover your funds for a fee. If someone does this, it is a fraud — report it here."

### The tone summary

**Calm, specific, slow, verifiable, reversible, and permission-giving.** Every one of those adjectives is the opposite of what the criminal sounded like. That contrast is not just ethically right — **it is the single strongest trust signal the NCRP can send to a person who has just been manipulated.**

---

# PART 6 — INDIA-SPECIFIC APPLICATION NOTES

Brief context so the recommendations above are grounded in the actual system.

**Sources:** I4C/MHA — http://i4c.mha.gov.in/ncrp.aspx · https://www.cybercrime.gov.in/Webform/FAQ.aspx · MHA SOP for NCRP/CFCFRMS (circulated 2026) — https://cdnbbsr.s3waas.gov.in/s3bc7f621451b4f5df308a8e098112185d/uploads/2026/06/202606181689326167.pdf

### The system as it stands
- **NCRP** (cybercrime.gov.in) launched 30 Aug 2019 (following the Supreme Court's directions in *Prajwala v. Union of India*), dedicated to the nation 20 Jan 2020. Scope widened from CSEAM/RGR-only to all cybercrime.
- **1930** — 24×7 national cyber-fraud helpline, live in all States/UTs, operated by State/UT police.
- **CFCFRMS** — Citizen Financial Cyber Fraud Reporting & Management System, connecting **85+ banks/payment intermediaries/wallets** for real-time lien-marking.
- The MHA SOP (dated Jan 2026) is explicitly framed as a "**uniform, transparent, and victim-centric framework**" and covers lien-marking and restoration under BNSS 2023 §§106, 94, 168, with a 90-day hold-release rule for amounts up to ₹50,000, and grievance officers at District (Addl. SP/DySP) and State (ADG/IG/DIG) levels.
- Current auth flow: register with name + Indian mobile → OTP valid **30 minutes**.
- Current chatbot: "Vani – CyberDost".

### The five highest-leverage trauma-informed interventions, ranked

1. **Split the single "Report Cyber Crime" entry point into four intent-based paths** (Stop my money / Is this a scam? / Take content down / File a formal complaint), per the ScamShield check-vs-report finding. This is the biggest single usability and dignity win available.
2. **Build a ≤3-field, ≤60-second "Stop the money" path** that triggers the CFCFRMS hold notice before any narrative, category selection, or evidence upload. Justified by the 0–10 minute noradrenaline window and the golden-hour reality. Everything else becomes a resumable draft.
3. **Tell-us-once across 1930 → NCRP → bank → police station → grievance officer**, keyed on the acknowledgement number. This is the Kamal Bal re-traumatisation argument, and it maps exactly onto the SOP's existing SMS acknowledgement flow ("XXNCRP", number starting with "3").
4. **A hash-based, image-never-uploaded intake for NCII and sextortion**, modelled on StopNCII/Take It Down, with their copy. Currently the NCRP asks victims to upload the very material they are terrified of. Combined with a maintained India-localised per-platform takedown guide.
5. **Site-wide quick exit + interruption page + safety content page**, GOV.UK spec, on all pages (not only sensitive ones, so its presence carries no signal). Plus an India-localised "Cover your tracks" page covering UPI apps, shared family phone plans, DigiLocker, mAadhaar, WhatsApp linked devices, and Google Family Link.

### Additional India-specific requirements
- **Language parity across all 22 scheduled languages** for the crisis path at minimum, with grade 6–8 reading level *tested in each language*, not just translated from English.
- **Elder-first defaults**: 18px+ body, high contrast, one question per page, prominent `tel:` link to 1930, and an explicit "**Ask someone you trust to help you**" invitation (which doubles as the anti-isolation, anti-scam-lookalike signal).
- **A "digital arrest" interrupt page** reachable in one tap from the homepage: "There is no such thing as a digital arrest. Hang up." — with the five red flags and the 1930 number, designed to be read by someone *currently on the call*, i.e. ≤50 words, one action, huge type.
- **A published NCRP self-impersonation warning** (IC3 model) and a "How to verify a message from NCRP" page.
- **A published Victim Service Standard** (UK Fraud Victims Charter model): acknowledgement times, hold-notice timing, update cadence, and how to escalate to the District/State grievance officer named in the SOP.

---

# APPENDIX — SOURCE INDEX

### Frameworks & principles
- SAMHSA (2014), *Concept of Trauma and Guidance for a Trauma-Informed Approach* — https://library.samhsa.gov/sites/default/files/sma14-4884.pdf
- UK OHID, *Working definition of trauma-informed practice* — https://www.gov.uk/government/publications/working-definition-of-trauma-informed-practice/working-definition-of-trauma-informed-practice
- Eggleston & Noel (2024), JUX — https://uxpajournal.org/trauma-informed-design-leveraging-usability-heuristics-on-a-social-services-website/
- Eggleston & Noel (2024), Diseña 24 — https://doi.org/10.7764/disena.24.article.7
- Melissa Eggleston — https://www.melissaegg.com/trauma-informed
- Rachael Dietkus — https://www.rachaeldietkus.com/ · https://www.socialworkerswho.design/aboutus · https://medium.com/surviving-ideo/trauma-and-design-62838cc14e94
- Chayn (2023) whitepaper — https://cdn.prod.website-files.com/60fdc9111506063bb9fe8e49/64b081438e3221d7ffc92b12_Trauma-informed%20design_%20the%20whitepaper%20by%20Chayn.pdf
- Chayn (2021) blog — https://blog.chayn.co/trauma-informed-design-understanding-trauma-and-healing-f289d281495c
- Chayn self-audit kit — https://www.chayn.co/partnerships
- Chen, Cobb, McDonald et al. (CHI 2022), *Trauma-Informed Computing* — https://amcdon.com/papers/trauma-chi22.pdf
- Scoping review of TIC principles in design & technology (2025), DIGITAL HEALTH — https://doi.org/10.1177/20552076251360925
- Catalyst / ProMo Cymru, *Trauma-Informed Design: An Introduction for Non-profits* — https://promo.cymru/resource-articles/trauma-informed-design-principles-how-to-apply-them-to-your-work/
- Center for Care Innovations — https://careinnovations.my.site.com/community/s/article/Changing-Clinics-Workplace-Culture-to-a-Place-of-Healing
- UX Content Collective, trauma-informed content design — https://uxcontent.com/a-guide-to-trauma-informed-content-design/

### Cognition under stress
- Cowan (2001), *The magical number 4* — https://doi.org/10.1017/S0140525X01003922
- Miller (1956), *The Magical Number Seven* — https://web-archive.southampton.ac.uk/cogprints.org/730/1/miller.html
- Mani, Mullainathan, Shafir & Zhao (2013), *Poverty Impedes Cognitive Function*, Science — https://www.science.org/doi/10.1126/science.1238041 · https://www.princeton.edu/news/2013/08/29/poor-concentration-poverty-reduces-brainpower-needed-navigating-other-areas-life
- Eysenck, Derakshan, Santos & Calvo (2007), *Attentional control theory* — https://doi.org/10.1037/1528-3542.7.2.336
- Shi, Sharpe & Abbott (2019), meta-analysis of anxiety & attentional control — https://www.sciencedirect.com/science/article/abs/pii/S0272735818304227
- *Time-dependent effects of acute stress on working memory* (2022) — https://www.sciencedirect.com/science/article/abs/pii/S0306453022003390
- Oei et al. (2006), stress impairs WM at high loads — https://scholarlypublications.universiteitleiden.nl/access/item%3A2873322/view
- Cold pressor stress & WM (2020), Front. Psychiatry — https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2020.544540/full
- Dirkin (1983), *Cognitive Tunneling* — https://doi.org/10.2466/pms.1983.56.1.191
- Attentional narrowing in ATC (ISAP 2015) — https://corescholar.libraries.wright.edu/cgi/viewcontent.cgi?article=1032&context=isap_2015
- Yerkes–Dodson overview — https://en.wikipedia.org/wiki/Yerkes%E2%80%93Dodson_law · https://yukaichou.com/behavioral-analysis/yerkes-dodson-law-arousal-optimal-performance/
- NN/g: *How Users Read on the Web* — https://www.nngroup.com/articles/how-users-read-on-the-web/ · *How Little Do Users Read?* — https://www.nngroup.com/articles/how-little-do-users-read/ · *How People Read Online (2020)* — https://www.nngroup.com/articles/how-people-read-online/ · *F-Shaped Pattern* — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/

### Quick exit
- Sutherland et al. (CHI 2023), *Click Here to Exit* — https://doi.org/10.1145/3544548.3581078 · https://www.cl.cam.ac.uk/~kst36/documents/click-here-to-exit.pdf
- GOV.UK Design System, *Exit this page* — https://design-system.service.gov.uk/components/exit-this-page/
- GOV.UK Design System, *Exit a page quickly* pattern — https://design-system.service.gov.uk/patterns/exit-a-page-quickly/
- GDS Design Notes (2023) — https://designnotes.blog.gov.uk/2023/08/14/exit-this-page-fast-with-the-design-systems-new-component/
- MoJ Justice Digital (2023) — https://mojdigital.blog.gov.uk/2023/11/01/trauma-informed-design-how-we-worked-together-to-develop-exit-this-page/
- Why not Escape — https://beeps.website/blog/2024-10-09-why-govuk-exit-this-page-doesnt-use-escape/
- Tech Safety Canada — https://techsafety.ca/resources/toolkits/designing-websites-to-increase-survivor-safety-and-privacy/
- Infoxchange / Ask Izzy — https://www.infoxchange.org/au/news/2018/05/how-increase-internet-safety-quick-exit-button
- Oomph — https://www.oomphinc.com/insights/user-safety-quick-exit-best-practices/
- Women's Aid, *Cover your tracks online* — https://www.womensaid.org.uk/cover-your-tracks-online/

### Services
- StopNCII — https://stopncii.org/ · /how-it-works/ · /faqs/
- Take It Down (NCMEC) — https://takeitdown.ncmec.org/
- NCMEC, *Is Your Explicit Content Out There?* — https://www.missingkids.org/gethelpnow/isyourexplicitcontentoutthere
- Revenge Porn Helpline — https://revengepornhelpline.org.uk/
- CCRI — https://cybercivilrights.org/ · /ccri-crisis-helpline/ · /ccri-safety-center · sextortion bulletin PDF · bystander guidance PDF
- IC3 — https://www.ic3.gov/
- Scamwatch — https://www.scamwatch.gov.au/report-a-scam · NASC — https://www.nasc.gov.au/
- Action Fraud — https://www.actionfraud.police.uk/ · Stop! Think Fraud — https://stopthinkfraud.campaign.gov.uk/
- ScamShield — https://www.scamshield.gov.sg/ · GovTech — https://www.tech.gov.sg/products-and-services/for-citizens/scam-prevention/scamshield/ · OGP design write-up — https://opengovsg.substack.com/p/behind-the-scenes-of-the-enhanced
- 988 Lifeline — https://988lifeline.org/
- Crisis Text Line — https://www.crisistextline.org/
- National DV Hotline — https://www.thehotline.org/
- Refuge — https://refuge.org.uk/
- 1800RESPECT — https://www.1800respect.org.au/

### Victim experience & shame
- Frontiers in Psychology (2026) systematic review — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1805536/full
- AIC tandi518 — https://www.aic.gov.au/publications/tandi/tandi518
- Birkbeck online fraud victims study — https://eprints.bbk.ac.uk/id/eprint/53739/1/33a035_103df035d9e94df9a48e89d17f73fb68.pdf
- Havers et al., older adults & cybercrime reporting — https://doi.org/10.21428/cb6ab371.8c4e3181
- Cross (2024), romance fraud help-seeking — https://doi.org/10.1016/j.jeconc.2024.100054
- FBI sextortion resources — https://www.fbi.gov/news/stories/the-financially-motivated-sextortion-threat · https://www.fbi.gov/news/stories/stop-sextortion-youth-face-risk-online-090319
- OJJDP sextortion victim resource sheet — https://ojjdp.ojp.gov/sites/ojjdp/files/media/document/sextortion-victim-resource-sheet.pdf

### Warnings & language
- Mileti & Peek (2000) — https://hazards.colorado.edu/uploads/publications/57_2000_Mileti_Peek.pdf
- Lindell & Perry (2012), PADM — https://training.weather.gov/wdtd/courses/woc/human-factors/crisis-comms-sm/risk-assess/story_content/external_files/Protective%20Action%20Decision%20Model.pdf
- NIST TN 1827 — https://doi.org/10.6028/NIST.TN.1827
- SAKI TTA, victim vs survivor — https://www.sakitta.org/toolkit/docs/Victim-or-Survivor-Terminology-from-Investigation-Through-Prosecution.pdf
- Zero Tolerance Language Guide — https://www.zerotolerance.org.uk/resources/Language-Guide.pdf
- NAESV glossary — https://endsexualviolence.org/wp-content/uploads/2025/05/NAESV-FVPSA-SA-TA-Glossary.pdf

### India
- I4C / NCRP — http://i4c.mha.gov.in/ncrp.aspx
- NCRP FAQ — https://www.cybercrime.gov.in/Webform/FAQ.aspx
- MHA SOP for NCRP & CFCFRMS — https://cdnbbsr.s3waas.gov.in/s3bc7f621451b4f5df308a8e098112185d/uploads/2026/06/202606181689326167.pdf

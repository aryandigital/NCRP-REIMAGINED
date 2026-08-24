# Raksha

Raksha is an independent cyber-fraud response prototype. It turns a synthetic incident story into an explainable action plan, mock response packets, and a recovery timeline.

## Setup

Copy `.env.example` to `.env.local` and add replacement credentials only if you want real model analysis or Neon persistence. Never use the API key previously pasted into chat.

Run the development server:

```bash
npm run dev
```

The public demo works without credentials through the local pattern matcher and the `DEMO0001` synthetic incident.

The complete demo path is: intake by message, voice, screenshot, identifier, or private local fingerprint; editable fact confirmation; ordered containment actions; recipient-specific mock packets; recovery tracking; redacted JSON export; and the synthetic operator console at `/operator`.

See [CAPABILITY_AUDIT.md](CAPABILITY_AUDIT.md) for the locally verified capability status and credential-gated items.

## Multilingual Raksha Samvaad agent

Raksha now includes a multilingual safety agent on the home page, with a language selector for English, Hindi, Tamil, Telugu, Bengali, and Marathi. It works in a local safety-guidance mode without credentials. To enable Sarvam-backed replies, create `.env.local` from `.env.example` and set a newly issued `SARVAM_API_KEY`; never paste a provider key into chat or commit it to the repository.

Useful checks:

```bash
npm run lint
npm run build
```

## Prototype boundary

No real complaint, bank request, police queue, payment, or platform report is submitted. Use synthetic information only. The project is not affiliated with any government body.

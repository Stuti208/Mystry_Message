# Mystery Message – Anonymous Messaging Platform

A full-stack web application that lets anyone send you an honest, anonymous message through a shareable link — no login required to send, no name attached, ever.

> Built with Next.js (App Router), MongoDB, and NextAuth, with AI-powered message suggestions via Groq's Llama models.

**Live Demo:** [mystery-message-ten-beta.vercel.app](https://mystery-message-ten-beta.vercel.app/)

---

## The Problem It Solves

People often want to say something honest — a compliment, a confession, feedback — but hesitate because their name is attached to it. Mystery Message removes that barrier. Registered users get a personal link they can share anywhere; anyone who opens it can send a message instantly, with zero account creation and zero identifying information passed back to the recipient.

---

## Key Technical Decisions

**NextAuth (JWT strategy) over custom auth**
Rather than building session management from scratch, NextAuth handles credential-based login, JWT issuance, and session resolution on the client via `useSession()`. Custom callbacks (`jwt`, `session`) attach `username`, `isVerified`, and `isAcceptingMessage` to the token so the frontend has everything it needs without extra API calls.

**No login required for senders**
The core design constraint: recipients need an account, senders never do. The public `/u/[username]` route is fully unauthenticated — it accepts a username from the URL, POSTs the message content, and never asks the sender to identify themselves. This is what makes the anonymity actually anonymous, not just "logged in under a pseudonym."

**Groq (Llama models) over OpenAI for AI suggestions**
The message-suggestion feature needed to be fast and free-tier-friendly since this is a side project with no budget behind it. Groq's inference speed made it a better fit than typical OpenAI latency for a lightweight "suggest 3 messages" feature that needs to feel instant, not like a loading screen.

**Graceful fallback over hard failure**
If the AI suggestion call fails or is slow, the UI doesn't show an error state or empty box — it falls back to a small set of pre-written sample suggestions, so the send flow never breaks even if the AI provider has an outage.

**MongoDB over SQL**
Users, messages, and verification state fit naturally as documents — no complex relational joins needed for a schema this simple, and it kept the data layer lightweight.

---

## Features

**Recipient Side**
- Sign up and log in via NextAuth-protected credentials flow, with email verification before login is allowed
- Personal dashboard showing all received messages, newest first
- One-click copy of your public shareable link
- Toggle to pause/resume accepting new messages at any time
- Delete unwanted messages with a confirmation step to prevent accidental removal

**Sender Side**
- Open any user's public link — no account, no login
- Write and send a message directly from the browser
- Tap "Suggest" for AI-generated message ideas if unsure what to write, powered by Groq's Llama models via the Vercel AI SDK
- Suggestions fall back to curated samples if the AI call fails, so the feature never blocks sending

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS, shadcn/ui |
| Database | MongoDB, Mongoose |
| Auth | NextAuth (JWT strategy) |
| AI | Groq (Llama models), Vercel AI SDK |
| Forms & Validation | React Hook Form, Zod |
| Email | Resend |

---

## Architecture Overview

```
Frontend (Next.js App Router)
    │
    ├── Server-side API routes → MongoDB (users, messages)
    │
    ├── NextAuth → JWT session → protected dashboard routes
    │
    └── Public route /u/[username] → unauthenticated POST → stores message
                                                        │
                                        AI suggestion route → Groq API
                                        (falls back to sample suggestions on failure)
```

---

## How the Anonymous Flow Works

```
Sender opens recipient's public link (/u/username)
    → No login required
    → Optionally taps "Suggest" for AI-generated message ideas
    → Writes/selects message and hits Send
    → POST request stores message tied only to recipient's username
    → Recipient sees it in their dashboard inbox
    → Sender's identity is never captured or stored
```

---

## How to Run Locally

**Prerequisites:** Node.js, MongoDB

```bash
# Clone the repo
git clone https://github.com/Stuti208/Mystery_Message.git
cd Mystery_Message

# Install dependencies
npm install

# Add environment variables
# Create a .env file with:
# MONGODB_URI=your_mongodb_uri
# NEXTAUTH_SECRET=your_secret_key
# NEXTAUTH_URL=http://localhost:3000
# RESEND_API_KEY=your_resend_key
# GROQ_API_KEY=your_groq_key

# Run the dev server
npm run dev
```

---

## Project Structure

```
Mystery_Message/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth options + route handler
│   │   ├── send-message/
│   │   ├── get-messages/
│   │   ├── accept-messages/
│   │   ├── delete-message/[id]/
│   │   └── suggest-messages/      # Groq AI suggestion endpoint
│   ├── dashboard/
│   └── u/[username]/              # Public, unauthenticated send-message page
├── components/
│   ├── MessageCard.tsx
│   ├── Navbar.tsx
│   └── ui/                        # shadcn/ui components
├── model/                         # User, Message schemas
├── schemas/                       # Zod validation schemas
└── lib/                           # dbConnect, resend, groq client
```

---

## Author

**Stuti Jain**
[LinkedIn](https://www.linkedin.com/in/stuti-jain-754b20244/) · [GitHub](https://github.com/Stuti208)

# Software Requirements Specification (SRS)

## Chat-G — AI-Integrated Web Chat Application

| | |
|---|---|
| **Document Type** | Software Requirements Specification |
| **Version** | 1.0 |
| **Status** | Draft for Review |
| **Date** | September 20, 2026 |
| **Prepared By** | <Candidate Name — Edit Me> |
| **Product** | Chat-G (AI conversational companion) |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Document Conventions
   - 1.3 Intended Audience and Reading Suggestions
   - 1.4 Product Scope
   - 1.5 References
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 Assumptions and Dependencies
3. [Specific Requirements](#3-specific-requirements)
   - 3.1 External Interface Requirements
   - 3.2 Functional Requirements
   - 3.3 Non-Functional Requirements
4. [Data Requirements](#4-data-requirements)
5. [Requirements Traceability Matrix](#5-requirements-traceability-matrix)
6. [Future Enhancements](#6-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for **Chat-G**, an AI-integrated web chat application. Chat-G allows registered users to create conversations and communicate with a large-language-model (LLM) assistant in real time through a polished, responsive, theme-aware interface. This document is the single source of truth for scope during design, development, testing, and acceptance.

### 1.2 Document Conventions

- Requirement identifiers are unique and traceable:
  - `FR-xxx` — Functional Requirement
  - `NFR-xxx` — Non-Functional Requirement
  - `IF-xxx` — Interface Requirement
- Text in `code style` indicates API endpoints, socket events, or technical identifiers.
- Priorities are assigned as **High** (must have for release), **Medium** (should have), and **Low** (nice to have).
- The terms *must*, *should*, and *may* follow [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) semantics.

### 1.3 Intended Audience and Reading Suggestions

| Audience | Suggested Reading |
|---|---|
| Product owner / stakeholders | Section 1, 2, 3.2 |
| Software architects & developers | Sections 2, 3, 4 |
| QA / test engineers | Sections 3 and 4 (traceability matrix in Section 5) |
| Security reviewers | Sections 3.1.2, 3.3.2, 4 |

### 1.4 Product Scope

Chat-G is a full-stack, real-time AI chat application targeting individual users who want a fast, beautiful, and private AI companion. The product:

- Provides authenticated user accounts (register, login, logout, session restore).
- Lets a user manage multiple independent chats and view full message history.
- Delivers AI responses in real time over WebSockets using the **Groq** LLM runtime (with OpenAI fallback).
- Enforces a **per-user daily AI request quota** (default 50) with automatic midnight reset to control cost and prevent API abuse.
- Exposes usage analytics (total chats, total messages, daily quota remaining) through a profile view.
- Supports light/dark themes with persistence and a polished, mobile-responsive interface.

### 1.5 References

| Ref | Title | Source |
|---|---|---|
| [1] | IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018 | SRS structure |
| [2] | RFC 2119 — Key words for requirement levels | https://www.rfc-editor.org/rfc/rfc2119 |
| [3] | Groq API Reference | https://console.groq.com/docs |
| [4] | Socket.IO Protocol | https://socket.io/docs |
| [5] | Tailwind CSS v4 Documentation | https://tailwindcss.com |

---

## 2. Overall Description

### 2.1 Product Perspective

Chat-G is a greenfield product composed of two cooperating subsystems:

1. **Backend service** (`backend/`) — Node.js + Express REST API, MongoDB (Atlas) persistence via Mongoose, and a Socket.IO real-time layer. Integrates LLM providers through LangChain adapters.
2. **Frontend application** (`frontend/`) — React 19 single-page application (Vite + Tailwind CSS v4) consuming the REST API and WebSocket channel.

### 2.2 Product Functions

1. User authentication and session management (`FR-001` to `FR-004`).
2. Chat management: create, list, and read chat history (`FR-005` to `FR-007`).
3. Real-time messaging and AI generation (`FR-008` to `FR-012`).
4. Daily AI request quota enforcement and visibility (`FR-013` to `FR-015`).
5. Profile viewing with usage statistics (`FR-016`).
6. Theme and responsive user experience (`FR-017` to `FR-018`).

### 2.3 User Classes and Characteristics

| Class | Characteristics | Privileges |
|---|---|---|
| Guest | Unauthenticated visitor | Register / view marketing screens only |
| Registered User | Authenticated individual | Create chats, send messages, receive AI replies, view own profile and history |
| System Administrator | Service operator | Environment configuration (`.env`), quota tuning, provider key management |

### 2.4 Operating Environment

| Layer | Component |
|---|---|
| Backend runtime | Node.js ≥ 22, CommonJS |
| Backend framework | Express ^5.2, Socket.IO ^4.3 |
| Data store | MongoDB Atlas (cloud, managed), Mongoose ^9 odm |
| AI providers | Groq (primary, via `@langchain/groq`), OpenAI (fallback, via `@langchain/openai`) |
| Frontend runtime | Modern evergreen browsers (Chrome, Edge, Firefox, Safari) |
| Frontend stack | React 19, React Router 7, TanStack Query 5, Axios, Tailwind CSS v4, socket.io-client |
| Dev tooling | Vite 7, ESLint 9 |

### 2.5 Design and Implementation Constraints

1. Authentication credentials must never be stored in plain text (bcrypt hashing required).
2. Session identity must be carried via an HTTP-only cookie holding a signed JWT (`cookie-parser`).
3. All protected routes must pass the `authUser` middleware; socket connections must authenticate during the handshake.
4. Frontend code must pass ESLint and a production `vite build` before acceptance.
5. Environment-specific secrets (JWT secret, DB URI, provider API keys) must live only in `.env` and must never be committed.
6. The AI request quota must survive server restarts (database-backed counters).

### 2.6 Assumptions and Dependencies

- A valid LLM provider API key (Groq or OpenAI) is provisioned in `.env`.
- A reachable MongoDB Atlas cluster is configured via `MONGODB_URI`.
- The AI provider returns responses within an acceptable time (dependence on external service SLA).
- No SMS/email verification is required at this release stage.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interface Requirements

- `UI-001` — The UI must present distinct screens for Guest (Login/Register), Main workspace (sidebar + chat area), and modal overlays (New Chat, Profile).
- `UI-002` — All interactive elements must provide loading, empty, and error states.
- `UI-003` — The interface must render responsively (desktop ≥ 1024, tablet 768–1023, mobile < 768 with a slide-in sidebar drawer).
- `UI-004` — AI reply bodies must be rendered with GitHub-Flavored Markdown (lists, tables, headings, fenced code).
- `UI-005` — The application must expose a persistent dark/light theme toggle with no flash-of-wrong-theme on load.

#### 3.1.2 REST API Interface (IF-001 …)

All endpoints are prefixed with `/api/v1`. Protected endpoints require a valid JWT cookie.

| IF-ID | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| IF-001 | POST | `/auth/register` | No | Create account (`fullName.{firstName,lastName}`, `email`, `password` ≥ 5 chars). Returns success payload. |
| IF-002 | POST | `/auth/login` | No | Authenticate with email + password; issues JWT via HTTP-only cookie. |
| IF-003 | POST | `/auth/logout` | Yes | Invalidate session (clears cookie). |
| IF-004 | GET | `/authme` | Yes | Return the current authenticated user (used to restore sessions). |
| IF-005 | POST | `/chat` | Yes | Create a new chat with a `title`. Returns the chat document. |
| IF-006 | GET | `/chat/getchatHistory` | Yes | Return the user's chat list. |
| IF-007 | GET | `/chat/getSingalChat/:chatId` | Yes | Return the message history of one chat. |
| IF-008 | GET | `/profile` | Yes | Return profile: full name, email, joined date, `dailyRequestLimit`, stats (`totalChats`, `totalMessages`, `requestsRemaining`). |

**Error convention:** all responses use `{ success: boolean, message: string, ... }`; failures return appropriate HTTP status codes (400/401/404/500).

#### 3.1.3 Real-Time WebSocket Interface (IF-020 …)

| IF-ID | Direction | Event | Payload | Description |
|---|---|---|---|---|
| IF-020 | Client → Server | `ai-message` | `{ chatId, message }` | User submits a message for AI processing. |
| IF-021 | Server → Client | `ai-response` | `{ content, chatId }` | AI generated reply delivered in real time. |
| IF-022 | Server → Client | `ai-remaining` | `{ chatId, remaining, total }` | Updated daily quota remaining after a consumed request. |
| IF-023 | Server → Client | `ai-limit` | `{ chatId, remaining, message }` | Quota exhausted — generation blocked, notice persisted as a `system` message. |
| IF-024 | Client ⇄ Server | `connect` / `disconnect` | — | Connection lifecycle; handshake validates JWT cookie. |

### 3.2 Functional Requirements

#### 3.2.1 Authentication & Authorization

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | The system **must** allow a guest to register with `firstName`, `lastName`, unique `email`, and a `password` of at least 5 characters; the password **must** be bcrypt-hashed before storage. | High |
| FR-002 | The system **must** allow a registered user to log in with email and password and **must** issue a signed JWT stored in an HTTP-only cookie for subsequent requests. | High |
| FR-003 | On page load, the system **must** attempt to restore the session via `GET /authme`; the UI **must** redirect guests away from protected routes and authenticated users away from auth pages. | High |
| FR-004 | The system **must** allow the user to log out, which clears the session cookie and returns the user to the login screen. | High |

#### 3.2.2 Chat Management

| ID | Requirement | Priority |
|---|---|---|
| FR-005 | An authenticated user **must** be able to create a chat with a user-provided `title`. | High |
| FR-006 | The system **must** return the authenticated user's chat history (most recent activity first) in the sidebar with loading skeletons and empty state. | High |
| FR-007 | When a chat is selected, the system **must** fetch and display its full message history; switching chats **must** reset the composer and scroll position cleanly. | High |

#### 3.2.3 Messaging & AI

| ID | Requirement | Priority |
|---|---|---|
| FR-008 | The user **must** be able to send a message (Enter to send, Shift+Enter for newline) in the active chat via socket event `ai-message`; the message is persisted with role `user`. | High |
| FR-009 | The backend **must** invoke the AI provider (Groq primary, OpenAI fallback) with chat context and persist the assistant reply with role `model`. | High |
| FR-010 | The reply **must** be delivered to the client in real time via `ai-response`; the UI **must** show a typing indicator while generation is in progress and auto-scroll to the newest message. | High |
| FR-011 | AI replies **must** be rendered as GitHub-Flavored Markdown (including syntax-highlighted code blocks). | Medium |
| FR-012 | The user **must** be able to copy any AI message to the clipboard with a visible confirmation state. | Low |

#### 3.2.4 Daily AI Request Quota

| ID | Requirement | Priority |
|---|---|---|
| FR-013 | The system **must** allow a maximum of `AI_DAILY_REQUEST_LIMIT` (default **50**) AI generation requests per user per calendar day; the counter is stored on the user document. | High |
| FR-014 | When the quota is exhausted, the backend **must** block AI generation (no provider call), persist both the user's message (role `user`) and a notice (role `system`), emit `ai-limit`, and return control immediately. | High |
| FR-015 | The counter **must** reset automatically on the next calendar day (server-local date). The quota **must** be visible to the user via the profile API, a live header chip, and a progress bar in the profile modal; the composer **must** be disabled once the quota is spent. | High |

#### 3.2.5 Profile

| ID | Requirement | Priority |
|---|---|---|
| FR-016 | The user **must** be able to view their profile in a modal: full name, email, member-since date, total chats, total messages, and daily AI request usage. | Medium |

#### 3.2.6 User Experience

| ID | Requirement | Priority |
|---|---|---|
| FR-017 | The application **must** support light and dark themes, persist the choice in `localStorage`, honor the OS preference on first visit, and apply the theme before first paint (no flash). | Medium |
| FR-018 | The layout **must** be responsive; on mobile the sidebar **must** collapse into a drawer opened from the navbar with a translucent backdrop. | Medium |

### 3.3 Non-Functional Requirements

| ID | Category | Requirement | Priority |
|---|---|---|---|
| NFR-001 | Performance | AI token generation is streamed over WebSockets; end-to-end delivery overhead beyond the provider latency **should** remain under 1 second. UI interactions **should** respond within 100 ms perceived latency. SPA assets **should** be code-split per route. | High |
| NFR-002 | Security | Passwords **must** be bcrypt-hashed. JWT **must** be stored in an HTTP-only cookie and signed with a strong secret. All protected routes and socket handshakes **must** enforce authentication. CORS **must** be restricted to the configured frontend origin. No secret **may** appear in client-side code or logs. | High |
| NFR-003 | Reliability | Provider failures **must** fall back gracefully (Groq → OpenAI). All controller failures **must** return `{ success: false, message }` with appropriate status codes. Socket disconnects **must** be handled without leaks. | High |
| NFR-004 | Usability | Keyboard-first messaging (Enter/Shift+Enter), clear loading/empty/error/limit states, toast notifications, and copy affordances on AI messages. Sufficient contrast in both themes. | Medium |
| NFR-005 | Maintainability | Layered architecture (`controllers`, `routes`, `models`, `services`, `sockets`, `utils`), shared design tokens in a single stylesheet, JSDoc on controllers, ESLint-clean code, zero-error production build. | Medium |
| NFR-006 | Portability | Must run on Windows/macOS/Linux with Node ≥ 22; all environment values configurable via `.env`; responsive across a defined device matrix. | Medium |
| NFR-007 | Availability | Persistence is on managed MongoDB Atlas; the service **should** recover automatically from transient DB/provider outages and report readiness on startup. | Medium |

---

## 4. Data Requirements

### 4.1 Data Entities

**User**
- `fullName: { firstName, lastName }`
- `email` (unique, lowercase)
- `password` (bcrypt hash)
- `dailyRequestCount: number` (default 0)
- `dailyRequestDate: string` (`YYYY-MM-DD`, quota bucket)
- `createdAt / updatedAt` (timestamps)

**Chat**
- `user` (ObjectId → User)
- `title: string`
- `lastActivity: date`
- `createdAt / updatedAt`

**Message**
- `chat` (ObjectId → Chat)
- `user` (ObjectId → User)
- `content: string`
- `role: enum["user", "model", "system"]`
- `createdAt / updatedAt`

### 4.2 Data Persistence & Integrity

- Persistence: MongoDB Atlas; ODM: Mongoose.
- Multi-document aggregation (`Promise.all`) computes profile stats and quota atomically per request.
- Quota counters are written through the user document so they persist across restarts (see FR-013/FR-014/FR-015).

---

## 5. Requirements Traceability Matrix

| Requirement | Backend Source | Frontend Source | Verified |
|---|---|---|---|
| FR-001, FR-002, FR-004 | `controllers/auth.Controller.js`, `routes/auth.routes.js` | `auth/ui/pages/{Login,Register}.jsx`, `auth/hooks/authHook.jsx` | ✔ |
| FR-003 | `controllers/authMe.controller.js`, `routes/authMe.routes.js`, `middleware/auth.middeleware.js` | `shared/hooks/authmeHook.jsx`, `auth/.../AuthProtect`, `MainProtect` | ✔ |
| FR-005 to FR-007 | `controllers/chat.controller.js`, `routes/chat.routes.js` | `main/ui/components/{NewChatModal,Sidebar,ChatArea}.jsx`, `main/api/createChatApi.jsx` | ✔ |
| FR-008 to FR-012 | `sockets/socket.server.js`, `services/ai.service.js`, `models/message.model.js` | `main/ui/components/ChatArea.jsx` | ✔ |
| FR-013 to FR-015 | `utils/requestLimit.util.js`, `controllers/profile.controller.js`, `sockets/socket.server.js`, `models/user.model.js` | `main/ui/components/ChatArea.jsx`, `ProfileModal.jsx`, `main/hooks/{profileHook,mainPageHook}.jsx` | ✔ |
| FR-016 | `controllers/profile.controller.js` | `main/ui/components/ProfileModal.jsx` | ✔ |
| FR-017 | — | `shared/hooks/themeContext.jsx`, `shared/ui/{ThemeToggle,ThemedToastContainer}.jsx`, `index.css`, `index.html` | ✔ |
| FR-018 | — | `Sidebar.jsx`, `Navbar.jsx`, `MainPage.jsx` | ✔ |

---

## 6. Future Enhancements

| ID | Enhancement | Benefit |
|---|---|---|
| FE-001 | Token-by-token AI response streaming | True ChatGPT-style typewriter experience |
| FE-002 | Regenerate / Stop-generation controls | Greater user control over generation |
| FE-003 | Auto-generated chat titles from first message | Zero-friction chat organization |
| FE-004 | Chat rename / delete / pin | Better conversation management |
| FE-005 | Multi-model & persona selection (Creative/Balanced/Precise) | Flexible, tailored responses |
| FE-006 | Export chat (Markdown) & full-text search across messages | Content portability and retrieval |
| FE-007 | Google OAuth + forgot-password (email) | Lower sign-up friction, account recovery |
| FE-008 | Usage analytics dashboard (activity charts) | Insight into engagement |
| FE-009 | Refresh-token rotation, rate limiting (HTTP), helmet security headers | Hardened production security |
| FE-010 | PWA installation + Docker deployment + automated test suite (unit + API + e2e) | Scale, offline support, CI/CD readiness |

---

*End of SRS v1.0 — Chat-G*
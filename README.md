<img
  alt="Bot Buddy - Intelligent AI Assistant"
  src="https://raw.githubusercontent.com/KingTroy125/Bot_Buddy/main/public/1.png"
  width="100%"
/>

<h3 align="center">Bot Buddy</h3>

<p align="center">
  A sleek, responsive, and powerful AI chatbot template built with <b>Next.js</b> and <b>shadcn/ui</b>.
</p>

<div align="center">
  <a href="https://github.com/KingTroy125/Bot_Buddy/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/KingTroy125/Bot_Buddy?style=flat-square">
  </a>
  <a href="https://github.com/KingTroy125/Bot_Buddy/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square">
  </a>
</div>

<br />

---

## About

**Bot Buddy** is a modern, beautifully crafted chat application template powered by **Next.js**, **Tailwind CSS**, and **shadcn/ui**. It delivers a premium AI integration experience, complete with customizable models, real-time streaming text generation, and local session handling right out of the box. Supported models include Google's **Gemini** architectures and Anthropic's **Claude**.

Whether you're bootstrapping a new SaaS product, an internal AI dashboard, or just a personal assistant web app, Bot Buddy provides an elegant, production-ready starting point.

---

## 🏗️ Project Architecture & File Structure

Here is a comprehensive breakdown of exactly how the core project is organized and what each directory and major file is responsible for performing:

### `app/`
This directory handles the core routing and backend APIs of the Next.js App Router application.
- **`layout.tsx`**: The root layout wrapping the entire application in global providers (e.g. `next-themes` styling).
- **`page.tsx`**: The main Landing Page composition. Aggregates all marketing and informational sections (Hero, FAQ, Testimonials) into a single optimized landing view.
- **`globals.css`**: Global design tokens and Tailwind CSS variables.

#### Sub-Routes
- **`chat/page.tsx`**: The primary application route (`/chat`). Loads and isolates the interactive Chat Dashboard interface.
- **`api/chat/route.ts`**: The backend logic endpoint! This file is responsible for receiving chat messages and routing requests appropriately. It securely connects to both **Google GenAI** (`@google/genai`) and **Anthropic** (`@anthropic-ai/sdk`) depending on the user's selected model, fetching streaming answers and piping them back to the frontend.

### `components/`
The UI is heavily modularized to guarantee reusability and clean architecture.
- **`chat-dashboard.tsx`**: The largest and most crucial component. Handles:
  - Sidebar layout & rendering previous chat memories.
  - Form inputs, message histories, and scroll behaviors.
  - The settings modal connecting user-provided API keys (`Gemini` & `Claude`) persistently via `localStorage`.
  - Managing active state and streaming updates dynamically from the backend API.
- **`MarkdownRenderer.tsx`**: Connects raw markdown API streams into beautiful formatting inside chat bubbles, powering syntactical highlighting for blocks of code and structured list elements.
- **`logo.tsx`**: Visual branding element component.
- **`theme-provider.tsx`**: Client-side provider logic wrapping standard `next-themes` setup explicitly.
- **Landing Page Sections**:
  - `hero-section.tsx` - High-polish, Framer Motion driven introduction banner.
  - `faq-section.tsx` - Interactive, accordion-style questions and answers.
  - `pricing-section.tsx` - Subscription tier descriptions.
  - `testimonial-section.tsx` - Simulated social proof and customer ratings.
  - `stats-section.tsx`, `cta-section.tsx`, `navbar-section.tsx`, `footer-section.tsx` - Core navigational and marketing wrappers.

#### `components/ui/`
This folder contains standardized UI components automatically generated via `shadcn/ui` based on Radix primitives. Items include buttons, dialog boxes, toggles, alerts, etc., which guarantee perfect a11y alignment across the app.

---

## Features

- **Multi-Model Support** – Seamlessly switch between cutting-edge AI models from the intelligent dropdown selector (Gemini 3 Flash, Gemini 3.1 Pro, Claude Sonnet 4.5 Beta).
- **Dynamic API Key Provisioning** – API keys are uniquely bound to your selected model provider inside the user settings modal, saving locally without pinging out-of-bounds database architectures.
- **Streaming Responses** – Real-time generative text typing for an authentic chat experience.
- **Modern Design System** – Built meticulously with **shadcn/ui** and Tailwind CSS for easy theme customization.
- **Fully Responsive Interface** – Polished mobile sidebar and buttery-smooth interactions powered by Framer Motion.
- **Local Storage Memory** – Your chats and preferences are automatically saved in the browser.

---

## Tech Stack

- **Next.js 16** (App Router / Turbopack)
- **React 19** 
- **TypeScript**
- **Tailwind CSS V4** (PostCSS integration)
- **shadcn/ui** & **Radix UI**
- **Framer Motion** & **Motion**

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/KingTroy125/Bot_Buddy.git
cd Bot_Buddy
```

Install the dependencies:

```bash
npm install
# or pnpm install / yarn
```

**Using the Chat:** The app natively pulls API keys from your `.env.local` configuration, or you can dynamically input your Gemini or Claude keys right from the UI Settings modal for maximum local control!

```bash
# Optional Setup: Create a .env.local file in the root
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_claude_key_here
```

Run the development server:

```bash
npm run dev
# or pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see your new assistant live!

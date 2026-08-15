# 🧠 NeuralMark.ai — AI Bookmark Organizer & Modern New Tab Hub

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-v3.0.0-4285F4?logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **The next-generation AI bookmark organizer, dead-link cleaner, and minimalist new-tab productivity workstation.** Turn cluttered browser bookmarks into an organized taxonomy of smart folders with tags, AI summaries, and zero telemetry.

---

## 🌟 Key Features

### 1. 🤖 AI Smart Taxonomy & Automatic Folder Categorization
- Automatically indexes bookmark URLs, titles, and web semantics.
- Proposes clean, intuitive, nested folder structures (e.g. `Development/React`, `AI/LLMs`, `Security/OSINT`).
- Auto-generates smart topical tags and summaries for instant searchability.
- **Safe Diff Confirmation**: Preview all proposed moves before applying them.

### 2. ⚡ Blazing Fast Minimalist Home Screen / New Tab
- Replace your empty new tab with an aesthetic dark glass productivity cockpit.
- **Multi-Engine Search**: Toggle instantly between Google, Perplexity AI, GitHub, DuckDuckGo, Hacker News, Hugging Face, YouTube, Reddit, and Wikipedia.
- **Live Widgets**: Focus Pomodoro timer (25/5/15 min intervals), persistent markdown scratchpad, priority todo checklist, and live clock.
- **Custom & Built-in Embeds**: Embed Spotify lofi playlists, YouTube ambient streams, Notion pages, and custom iframe URLs.

### 3. 🌐 Built-in 100+ Top Web Directory
- Curated index of premier websites across cutting-edge & classic domains:
  - 🤖 **A.I. & LLMs** (ChatGPT, Claude, Gemini, Perplexity, Hugging Face, Cursor, Ollama)
  - 🛡️ **Hacking & CyberSec** (Hack The Box, TryHackMe, Exploit-DB, Shodan, PortSwigger, CyberChef)
  - 🕵️‍♂️ **OSINT & Intelligence** (OSINT Framework, Bellingcat, Wayback Machine, Have I Been Pwned, Epieos, VirusTotal)
  - 💻 **GitHub Top Repos** (Awesome Lists, Next.js, Tailwind, Bun, Supabase, Excalidraw, Shadcn)
  - 💬 **Message Boards & Tech Forums** (Hacker News, Lobste.rs, Reddit, Dev.to, Product Hunt)
  - ❓ **Q&A & Knowledge** (Stack Overflow, Super User, Wolfram Alpha, arXiv, Kaggle)
  - 📥 **Downloads & FOSS** (AlternativeTo, F-Droid, Flathub, Ninite, PortableApps)
  - ⚡ **Productivity, Design, Crypto & Media**
- 1-click save to bookmarks with pre-populated tags and folder destinations.

### 4. 🛡️ Real-Time Broken Link & Dead URL Health Auditor
- Concurrently checks HTTP status codes (404, 500, DNS failures, expired domains).
- High-contrast health badges (`Dead Link`, `Unreachable Host`, `Healthy Online`).
- 1-click bulk removal or CSV report export.

### 5. 👥 Community Message Board & Marketplace
- Share curated bookmark bundles with custom share codes.
- Browse public, verified bookmark collections across web development, DevOps, and research.
- VIP Vault and vendor storefront integration.

---

## 🚀 Installation Guide

### Option A: Load Unpacked into Chromium Browsers (Chrome, Brave, Edge, Opera, Arc)

1. **Download or Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/ai-bookmark-organizer.git
   cd ai-bookmark-organizer
   ```
2. **Install Dependencies and Build**:
   ```bash
   npm install
   npm run build
   ```
3. **Download the Extension ZIP**:
   - In the application, click **"Extension .ZIP"** at the top right to download the ready-to-load package.
   - Unzip the downloaded file into a folder on your computer.
4. **Load into Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **"Developer mode"** in the top right corner.
   - Click **"Load unpacked"** and select the unzipped directory.
   - Pin the NeuralMark extension icon to your browser toolbar!

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **Backend API**: Node.js, Express, Google GenAI SDK (`@google/genai`)
- **Extension Runtime**: Chrome Extension Manifest V3 (SidePanel API, ContextMenus, Storage API)
- **Data Persistence**: Local-first (`chrome.storage.local` and browser `localStorage`)

---

## 🔒 Privacy & Chrome Web Store Policy Compliance

NeuralMark is built on a strict **Local-First Privacy Architecture**:

| Category | Policy Commitment |
| :--- | :--- |
| **Data Selling** | We **NEVER** sell, rent, or monetize your bookmark data. |
| **Telemetry & Ads** | **Zero** third-party ad trackers, pixels, or profiling scripts. |
| **AI Processing** | Only bookmark titles and URLs are sent over TLS to the Gemini API during an explicit user-initiated scan. |
| **Permissions** | Strictly minimal Manifest V3 permissions (`bookmarks`, `storage`, `sidePanel`, `activeTab`, `contextMenus`). |

---

## 📬 Developer Contact & Support

- **Lead Developer**: NeuralMark Engineering Team
- **Official Contact Email**: [bicknellmvp@gmail.com](mailto:bicknellmvp@gmail.com)
- **Store Category**: Productivity / Developer Tools
- **Version**: 3.0.0 (Manifest V3)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). © 2026 NeuralMark.ai. All rights reserved.

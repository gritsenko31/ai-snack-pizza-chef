# 🍕 AI Snack & Pizza Chef

> A children's educational web game that teaches kids (ages 5–9) how to write **long, detailed, and descriptive prompts** — a foundational AI literacy skill!

---

## 🎯 Concept

The child plays the role of a **chef**. A funny customer character places an order with specific wishes. The more details the child includes in their "recipe description" (prompt), the higher the score — up to **3 stars** — and the more exciting the result!

The game is powered by **OpenRouter AI** (Claude 3.5 Haiku) which acts as a friendly judge, analyzing the child's prompt and returning encouraging feedback.

---

## 🕹️ Levels

| Level | Dish | Goal |
|-------|------|------|
| **Level 1** | 🥪 Sandwich | Describe bread type, 2+ ingredients, colors, sauce |
| **Level 2** | 🍕 Party Pizza | Describe crust, sauce, cheese, 3+ toppings, decorations |

---

## ✨ Features

- **Live Prompt Completeness Meter** — a visual progress bar + checklist that lights up in real time as the child types keywords
- **AI Feedback** — Claude 3.5 Haiku evaluates the prompt and returns stars + personalized encouragement
- **Dish Preview** — animated emoji dish that "builds up" as more details are added
- **Confetti 🎉** — launched on a perfect 3-star score
- **Settings Modal** — enter a custom OpenRouter API key; falls back to a default key
- **Keyboard shortcut** — `Ctrl+Enter` / `Cmd+Enter` to submit the prompt
- **Responsive design** — works on tablets and phones

---

## 🚀 How to Run

### Option 1 — Open directly in browser (no server needed)
```bash
# Just open index.html in any modern browser
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 2 — Local dev server (recommended for API calls)
```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Then open: http://localhost:8080
```

> **Note:** The game makes live API calls to OpenRouter. A default API key is bundled in `script.js` for demo purposes. For production use, replace it with your own key via the ⚙️ Settings button.

---

## 🔑 API Key Setup

1. Click the **⚙️** icon in the top-right corner
2. Enter your [OpenRouter API key](https://openrouter.ai/keys)
3. Click **💾 Save Key**

The key is stored in `localStorage` and persists between sessions.

**Default key** (for demo): already set in `script.js` — no setup required to try the game.

---

## 📂 File Structure

```
/
├── index.html    — Game markup (single page)
├── styles.css    — Child-friendly UI styles (pure CSS, no framework)
├── script.js     — Game logic + OpenRouter API integration
└── README.md     — This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic game structure |
| CSS3 | Animations, gradients, responsive layout |
| Vanilla JavaScript (ES2020) | Game logic, live analysis, API calls |
| [OpenRouter API](https://openrouter.ai) | AI evaluation via Claude 3.5 Haiku |
| [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito) | Child-friendly rounded font |

---

## 🎓 Educational Goals

| Skill | How the game teaches it |
|-------|------------------------|
| **Descriptive writing** | Customer orders require specific details |
| **Color & adjective vocabulary** | Checklist rewards color words |
| **Prompt engineering basics** | More detail = higher AI score |
| **Cause & effect thinking** | Child sees direct link between effort and result |
| **Reading comprehension** | Child must read and understand the order card |

---

## 📸 UI Overview

```
┌─────────────────────────────────────────────────────┐
│  🍕 AI Snack & Pizza Chef          ⭐ Level 1   ⚙️  │
├──────────────────────────┬──────────────────────────┤
│  👧 Customer Order       │  📊 Prompt Completeness  │
│  ┌──────────────────┐    │  ████████░░░░  60%        │
│  │ "I want a huge   │    │  ✅ Bread / Base          │
│  │  sandwich with   │    │  ✅ Protein               │
│  │  yellow cheese!" │    │  ✅ Vegetables            │
│  └──────────────────┘    │  ☐  Sauce                 │
│                          │  ✅ Colors                │
│  🧑‍🍳 Your Recipe:         ├──────────────────────────┤
│  ┌──────────────────┐    │  🥪✨                     │
│  │ textarea...      │    │  toast  cheese  tomato    │
│  └──────────────────┘    │                           │
│  [🍳 Cook It! Run AI]    │                           │
└──────────────────────────┴──────────────────────────┘
```

---

## 📄 License

MIT — free to use, modify, and share for educational purposes.

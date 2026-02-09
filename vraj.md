<div align="center">

![Code Blue Universe](https://img.shields.io/badge/CODE_BLUE-UNIVERSE_EDITION-000000?style=for-the-badge&logo=react&logoColor=00f3ff&labelColor=000000)

# 🌌 The Zero-to-Hero Developer Curriculum
### *The Official Training Manual for IEEE SBNU Engineers*

![Course Length](https://img.shields.io/badge/Course_Length-Full_Semester-blueviolet?style=flat-square)
![Difficulty](https://img.shields.io/badge/Difficulty-Adaptive-orange?style=flat-square)
![Outcome](https://img.shields.io/badge/Outcome-Legendary_Dev-success?style=flat-square)

*“You don’t just write code here. You engineer the future.”*

[🎓 Module 1: The Basics](#-module-1-the-basics-git--github) • [�️ Module 2: The Architecture](#-module-2-the-architecture-code-blue-internal) • [⚔️ Module 3: The Workflow](#-module-3-the-workflow-how-we-build) • [� Module 4: The Standards](#-module-4-the-standards-writing-perfect-code)

</div>

---

# 🎓 Module 1: The Basics (Git & GitHub)
*Forget what you think you know. Let's start from the atoms.*

## 1.1 The Concept: What are we doing?
Imagine we are writing a **Book** together.
*   **Without Git**: I write Chapter 1. You write Chapter 1. We email them to each other. I accidentally delete your paragraph. It's a disaster.
*   **With Git**: We have a "Master Book" on a magic table (GitHub).
    *   I take a *photocopy* of the book (Clone).
    *   I write Chapter 1 on my copy.
    *   I tell the magic table, "Here are my changes" (Push).
    *   The magic table asks the Editor (Technical Head) to review it (Pull Request).
    *   The Editor glues my page into the Master Book (Merge).

## 1.2 The Vocabulary (Your Dictionary)

| Term | The Real Definition | The Analogy |
| :--- | :--- | :--- |
| **Repo** | Repository | The entire project folder/The Magic Table. |
| **Commit** | A snapshot of changes | A "Save Point" in a video game. |
| **Branch** | A parallel version | A parallel universe where you can break things safely. |
| **Remote** | The version on GitHub | The "Real World" copy everyone sees. |
| **HEAD** | Your current location | The "You Are Here" marker on the map. |

## 1.3 The Vital Commands (Cheat Sheet)

### Initialization
*   `git clone <url>` → Download the project.
*   `git config --global user.name "Vraj"` → Stick your nametag on your work.

### Daily Work
*   `git checkout -b <name>` → Create a new parallel universe.
*   `git add .` → Put things in the box.
*   `git commit -m "msg"` → Seal the box.
*   `git push` → Send the box to the cloud.
*   `git pull` → Get everyone else's boxes.

---

# �️ Module 2: The Architecture (Code Blue Internal)
*This is not just any React app. This is OUR app. Here is how it breathes.*

## 2.1 The Map (`src/`)

We build with **React 18** and **Vite** (It's faster than Create-React-App).

```bash
E:/IEEE/Code Blue/src/
├── 📂 components/       ➜ "The Bricks"
│   │   # These are REUSABLE pieces. They don't have a route.
│   │   # They just "look cool" or "do one thing".
│   ├── FaultyTerminal.jsx  # (Animation) The hacking text effect
│   ├── CurvedLoop.jsx      # (Animation) The spinning circle text
│   └── tubelight-navbar.jsx# (UI) The glowing header
│
├── 📂 pages/            ➜ "The Rooms"
│   │   # These are full screens users visit.
│   ├── Home.jsx            # The Landing Page (Entry point)
│   ├── About.jsx           # Team/Mission Page
│   └── Contact.jsx         # Connection Page
│
├── 📂 lib/              ➜ "The Tools"
│   └── utils.js            # Boring but necessary helper functions
│
├── App.jsx              ➜ "The Skeleton"
│   # This file decides: "If URL is /about, show About.jsx"
└── main.jsx             ➜ "The Spark"
    # This plugs React into the HTML file.
```

## 2.2 Why this structure?
1.  **Separation of Concerns**: If the *Navbar* is broken, you know exactly where to go (`components/`). If the *Home Page* layout is wrong, you go to `pages/`.
2.  **Performance**: We keep heavy logic in `lib/` so components render fast.
3.  **Scalability**: When we add a "Events" page later, we just add `pages/Events.jsx`. We don't break anything else.

---

# ⚔️ Module 3: The Workflow (How We Build)
*The precise steps to contribute without breaking production.*

## Step 0: The Golden Rule 🌟
**NEVER PUSH DIRECTLY TO `main` or `dev`.**
Always use a Feature Branch.

## Step 1: The Setup (Start of Day)
Sync your local machine with the cloud.
```bash
git checkout dev
git pull origin dev
```

## Step 2: The Branch (Start of Task)
Name your universe based on what you are doing.
```bash
# Syntax: type/description-of-task
git checkout -b feat/add-dark-mode-toggle
# OR
git checkout -b fix/resolve-navbar-glitch
```

## Step 3: The Code (The Fun Part)
Write your React code.
*   Make sure it looks good on Mobile.
*   Make sure there are no red squiggly lines in VS Code.

## Step 4: The Save (Commit)
Save often.
```bash
git add .
git commit -m "feat: ✨ added toggle switch component"
```

## Step 5: The Upload (Push)
```bash
git push -u origin feat/add-dark-mode-toggle
```

## Step 6: The Merge (Pull Request)
1.  Go to GitHub.
2.  Open a **Pull Request**.
3.  Set Base: `dev` ← Compare: `feat/...`
4.  Adding a screenshot of your change increases approval speed by 200%.

---

# 💎 Module 4: The Standards (Writing Perfect Code)
*We don't accept "it works". We accept "it's beautiful".*

## 4.1 Aesthetic Philosophy 🎨
*   **Glassmorphism**: We use `backdrop-filter: blur(10px)` to create depth.
*   **Neon**: Our primary accent is Cyan (`#00f3ff`). Use it for active states.
*   **Motion**: Things should fade in, slide up, or glow. Static sites are boring.

## 4.2 Coding Rules 📜
1.  **Components**: PascalCase (e.g., `FaultyTerminal.jsx`).
2.  **Functions**: camelCase (e.g., `calculateScore()`).
3.  **No Spaghetti**: If a component is > 200 lines, break it into smaller components.
4.  **Clean Console**: Remove `console.log` before pushing.

---

# 🔮 Module 5: Advanced Magic (Troubleshooting)

## "I messed up!"
**Undo last commit (keep code):**
```bash
git reset --soft HEAD~1
```

## "Conflict!"
**Resolve merge conflicts:**
1.  Open the file.
2.  Find `<<<<<<<`.
3.  Choose the code you want.
4.  Delete markers.
5.  Commit.

---

<div align="center">

### *Class Dismissed.*
**Welcome to Code Blue Engineering.**

*(c) IEEE SBNU Technical Team*

</div>

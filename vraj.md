<div align="center">

![Code Blue Manual](https://img.shields.io/badge/CODE_BLUE-OFFICIAL_MANUAL-000000?style=for-the-badge&logo=read-the-docs&logoColor=00f3ff&labelColor=000000)

# 📘 The Developer Manual
### *Simple. Clean. Professional.*

![Clarity](https://img.shields.io/badge/Clarity-Crystal_Clear-00f3ff?style=flat-square)
![Efficiency](https://img.shields.io/badge/Workflow-Optimized-success?style=flat-square)

*“Master the basics. Build the extraordinary.”*

[📚 Part 1: Core Concepts](#-part-1-core-concepts) • [🗺️ Part 2: Project Map](#-part-2-project-map) • [⚡ Part 3: The Workflow](#-part-3-the-workflow) • [✨ Part 4: Standards](#-part-4-standards)

</div>

---

## 📚 Part 1: Core Concepts
*Everything you need to know, explained simply.*

| Term | Definition |
| :--- | :--- |
| **Repository (Repo)** | The main project folder containing all our files and history. |
| **Branch** | Your personal workspace. Created from the main code so you can work safely. |
| **Commit** | A snapshot of your work. It saves your changes to the history. |
| **Push** | Uploading your saved changes locally to GitHub. |
| **Pull Request (PR)** | Asking the team to review and merge your branch into the main project. |

---

## 🗺️ Part 2: Project Map
*Where files live in **Code Blue**.*

```bash
src/
├── 📂 components/       # Reusable UI parts (Buttons, Navbars, Animations)
│   ├── FaultyTerminal.jsx  # The hacking text animation
│   └── tubelight-navbar.jsx# The navigation header
│
├── 📂 pages/            # Full website pages
│   ├── Home.jsx            # The main landing page
│   └── About.jsx           # Team information page
│
├── 📂 lib/              # Helper tools
│   └── utils.js            # Shared logic functions
│
├── App.jsx              # Main Router (Handles navigation)
└── main.jsx             # Entry Point (starts React)
```

---

## ⚡ Part 3: The Workflow
*Follow these 6 steps to contribute effectively.*

### 1. Sync 🔄
Always get the latest updates before starting.
```bash
git checkout dev
git pull origin dev
```

### 2. Create Workspace (Branch) 🌿
Create a new branch for your specific task.
```bash
# Naming format: category/task-name
git checkout -b feat/new-animation
# OR
git checkout -b fix/mobile-menu
```

### 3. Code 💻
Make your changes in VS Code.
*   **Tip**: Keep components small and focused.

### 4. Save (Commit) 💾
Save your progress with a clear message.
```bash
git add .
git commit -m "feat: added new loading animation"
```

### 5. Upload (Push) ☁️
Send your branch to GitHub.
```bash
git push -u origin feat/new-animation
```

### 6. Review (Pull Request) 🤝
1.  Go to the [GitHub Repository](https://github.com/IEEE-Student-Branch-NU/Code-Blue).
2.  Click **Compare & pull request**.
3.  Set the target to **`dev`**.
4.  Submit for review.

---

## ✨ Part 4: Standards
*How we write quality code at IEEE SBNU.*

### Visual Quality 💎
1.  **Modern UI**: We use "Glassmorphism" (blur effects) and Neon accents (`#00f3ff`).
2.  **Smooth Motion**: Avoid jerky animations. Everything should flow.
3.  **Responsive**: Always check your code on mobile view.

### Code Quality 🧹
1.  **Clear Names**: File names use `PascalCase` (e.g., `MyComponent.jsx`).
2.  **Clean Up**: Remove unused variables and `console.log` before pushing.
3.  **Format**: Ensure your code is properly indented.

---

## 🆘 Troubleshooting
*Quick fixes for common issues.*

*   **"I want to undo my last commit":** `git reset --soft HEAD~1`
*   **"I want to delete a branch":** `git branch -d branch-name`
*   **"Check status":** `git status`

---

<div align="center">

**(c) IEEE Student Branch Nirma University**

</div>

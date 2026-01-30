<div align="center">

![Code Blue Master Guide](https://img.shields.io/badge/CODE_BLUE-MASTER_GUIDE-000000?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=000000)

# 📘 The Complete Architect's Guide
### *From "What is a Branch?" to "How Code Blue Works"*

![Level](https://img.shields.io/badge/Level-Zero_to_Hero-success?style=flat-square)
![Focus](https://img.shields.io/badge/Focus-Architecture_%26_Workflow-blue?style=flat-square)

*“To build the skyscraper, you must first understand the brick.”*

[� Part 1: The Basics](#-part-1-the-foundation-concepts) • [🏰 Part 2: Our Architecture](#-part-2-the-castle-project-structure) • [🛠️ Part 3: The Tools](#-part-3-the-toolkit-git-commands) • [🚀 Part 4: The Workflow](#-part-4-the-ritual-contribution-workflow)

</div>

---

## � Part 1: The Foundation (Concepts)
*Before we code, we must understand the language of collaboration.*

### 1. What is a "Repository"? (The House) 🏠
Think of the **Repository (Repo)** as the **House** we are building.
*   It contains everything: walls (code), furniture (images), and blueprints (documentation).
*   **Code Blue** is our House.

### 2. What is a "Branch"? (The Parallel Dimensions) 🌌
Imagine you want to paint the living room **Neon Blue**, but you're scared you'll spill paint everywhere.
*   In Git, you create a **Branch**. This is a **copy** of the House in a parallel dimension.
*   You paint the room in this parallel dimension. If it looks terrible, you just delete the dimension! The real house is untouched.
*   If it looks great, you **Merge** it back into reality.

### 3. What is a "Commit"? (The Save Point) 💾
You just finished painting the wall. You take a photo.
*   That photo is a **Commit**.
*   It has a message: *"Painted wall neon blue"*.
*   If you make a mistake later, you can look at the photo and restore the wall exactly how it was.

---

## 🏰 Part 2: The Castle (Project Structure)
*Where does everything live in Code Blue?*

We use **React + Vite**. Here is the map of our territory:

```bash
src/
├── 📂 components/       # The Building Blocks (LEGO Bricks)
│   ├── FaultyTerminal.jsx  # 📟 The hacking animation on the home screen
│   ├── CurvedLoop.jsx      # ➰ The infinite scrolling text ring
│   ├── TextPressure.jsx    # 👆 Text that squishes when you hover
│   └── tubelight-navbar.jsx# 💡 The glowing navigation bar
│
├── 📂 pages/            # The Rooms (Full Screens)
│   ├── Home.jsx            # The Landing Page (Entry Hall)
│   ├── About.jsx           # Team Info (Trophy Room)
│   └── Contact.jsx         # Get in touch (Mail Room)
│
├── 📂 lib/              # The Tools (Utility Belt)
│   └── utils.js            # Helper functions (glue, duct tape)
│
├── App.jsx              # The Skeleton (Holds pages together)
└── main.jsx             # The Heart (Starts the app)
```

> [!TIP]
> **Rule of Thumb**:
> *   If it's a small piece of UI (like a button or animation), it goes in **`components/`**.
> *   If it's a full screen users navigate to, it goes in **`pages/`**.

---

## 🛠️ Part 3: The Toolkit (Git Commands)
*The spells you need to cast.*

| Spell (Command) | Effect |
| :--- | :--- |
| `git clone [url]` | **Summon**: Downloads the entire House to your computer. |
| `git checkout -b [name]` | **Multiverse**: Creates a new parallel dimension (Branch). |
| `git checkout [name]` | **Teleport**: Switch between dimensions. |
| `git add .` | **Prepare**: Put your changes in the box. |
| `git commit -m "msg"` | **Seal**: Tape the box and label it (Save Point). |
| `git push` | **Telecast**: Send your box to the Cloud (GitHub). |
| `git pull` | **Sync**: Download changes your teammates made. |

---

## � Part 4: The Ritual (Contribution Workflow)
*How we work together without destroying the House.*

### Step 1: Sync (Always start here)
Don't build on old foundations.
```bash
git checkout dev      # Go to the development floor
git pull origin dev   # Update everything
```

### Step 2: Branch (Create your dimension)
Naming rules: `feat` (new thing), `fix` (repair), `docs` (writing).
```bash
# Example: Adding a new gallery page
git checkout -b feat/gallery-page
```

### Step 3: Code (Build the brick)
1.  Go to `src/pages/`.
2.  Create `Gallery.jsx`.
3.  Write your React code.
4.  Import components from `src/components/`.

### Step 4: Save (Commit)
```bash
git add .
git commit -m "feat: created basic gallery layout"
```

### Step 5: Share (Push)
```bash
git push -u origin feat/gallery-page
```

### Step 6: Merge (The Pull Request)
1.  Go to GitHub.
2.  Click **"Compare & pull request"**.
3.  **Critical**: Merge into **`dev`** (NOT `main`).
4.  Ask **GalacticVraj** to review.

---

<div align="center">

### *You are now ready to build.*
**Go forth and code.**

</div>

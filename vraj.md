# 📘 The IEEE SBNU Developer Bible
> *Authored by Vraj - IEEE SBNU Technical Head*

Welcome to the ultimate guide for **Code Blue**. This document is your source of truth for everything Git, GitHub, and Project Standards. Read it, learn it, live it.

---

## 🧐 Part 1: Concepts (The "What's What")

Before typing commands, understand the vocabulary.

### 📦 The Basics
- **Repository (Repo)**: The project folder. It contains all code and the entire history of every change ever made.
- **Commit**: A snapshot of your code at a specific point in time. Think of it as a "Save Point" in a game.
- **Branch**: A parallel version of the project. It allows you to work on features without breaking the main code.
- **Remote (Origin)**: The version of the repo stored on the internet (GitHub).

### 🤝 Collaboration Terms
- **Clone**: Downloading the repo from GitHub to your computer for the first time.
- **Push**: Uploading your local commits to GitHub.
- **Pull**: Downloading updates from GitHub to your local machine.
- **Fork**: Creating a personal copy of someone else's repo (usually not needed if you are a collaborator).
- **Pull Request (PR)**: Asking the project maintainer to merge your branch into the main codebase.

---

## 🛠️ Part 2: The "A to Z" Workflow

This is how you will work every single day.

### 1️⃣ Setup (One Time Only)
Configure your identity so we know who wrote the code.
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2️⃣ Starting a New Task
Never work on `main` or `dev` directly. Always create a workspace.

1.  **Get the latest code**:
    ```bash
    git checkout dev
    git pull origin dev
    ```
2.  **Create your branch**:
    ```bash
    # Naming convention: type/description
    # types: feat (new feature), fix (bug fix), docs (documentation), style (formatting)
    git checkout -b feat/redesigned-navbar
    ```

### 3️⃣ Doing the Work
Write your code. When you hit a milestone:

1.  **Stage your changes** (Select files to save):
    ```bash
    git add .
    ```
2.  **Commit** (Save the snapshot):
    ```bash
    git commit -m "feat: add glassmorphism effect to navbar"
    ```

### 4️⃣ Sharing Your Work
Time to put it on GitHub.

1.  **Push** your branch:
    ```bash
    git push -u origin feat/redesigned-navbar
    ```

### 5️⃣ The Pull Request (PR)
This is where code reviews happen.

1.  Go to the [GitHub Repo](https://github.com/IEEE-Student-Branch-NU/Code-Blue).
2.  You will see a banner: "feat/redesigned-navbar had recent pushes". Click **Compare & Pull Request**.
3.  **Crucial**: Set the target branch to `dev`.
4.  Write a description of what you changed.
5.  Assign **GalacticVraj** as the reviewer.
6.  Click **Create Pull Request**.

---

## 🧰 Part 3: Advanced Features & "Oops" Moments

### "I made a mistake in my last commit message!"
```bash
git commit --amend -m "feat: corrected message"
```

### "I want to see who wrote this line of code."
```bash
# Shows line-by-line authorship
git blame filename.jsx
```

### "I have local changes but I need to switch branches."
Don't lose your work! Stash it.
```bash
# Save changes temporarily
git stash

# Switch branches, do whatever...

# Bring changes back
git stash pop
```

### "What exactly changed in this file?"
```bash
git diff filename.jsx
```

---

## 📜 Part 4: Project Guidelines (The Rules)

### 🎨 Design Philosophy
1.  **Premium Aesthetics**: We are building a "Wow" factor. No generic Bootstrap looks.
2.  **Vanilla CSS**: We use pure CSS for maximum control over animations and performance.
3.  **Responsive**: If it doesn't look good on a phone, it's not done.

### 💻 Code Standards
- **Comments**: Explain *why* you did something, not *what* you did.
- **No Console Logs**: Remove `console.log` before pushing.
- **Format**: Use Prettier/ESLint to keep code clean.

### ⚠️ The Golden Rules
1.  **NEVER push to `main`**.
2.  **ALWAYS pull before you push** to avoid conflicts.
3.  **Small Commits**: Don't save 1000 lines in one commit. Break it down.

---

*"Code varies, but standards remain."*

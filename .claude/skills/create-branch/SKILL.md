---
name: create-branch
description: Create a new git branch based on the changes made in the current conversation
allowed-tools: Bash, Read, Glob, Grep
---

Create a new git branch for the changes made in this conversation.

## Steps

1. Run `git status` and `git diff` to understand what has changed.
2. Analyze the changes and generate a branch name following this format:
   - `feat/<short-description>` for new features
   - `fix/<short-description>` for bug fixes
   - `chore/<short-description>` for maintenance tasks
   - `docs/<short-description>` for documentation changes
   - `refactor/<short-description>` for refactoring
   - Use kebab-case for the description, keep it under 5 words
3. Create the branch from `main`: `git checkout -b <branch-name>`
4. Do NOT stage or commit — just create the branch. Report the branch name and let the user decide on next steps.

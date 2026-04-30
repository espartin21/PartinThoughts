---
name: ship
description: Run all checks, fix issues, commit, push, and open a PR
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

Ship the current branch by running all checks, committing, pushing, and opening a PR.

## Steps

1. **Preflight** — Confirm we are NOT on `main`. If on main, stop and tell the user to create a branch first (suggest `/branch`). Also run `gh auth status` and check the active account. If `espartin21` is not the active account, run `gh auth switch -u espartin21` before continuing.

2. **Lint** — Run `npm run lint`. If it fails, run `npm run lint:fix` and re-check. If it still fails, read the errors, fix them manually, and re-run until clean.

3. **Format** — Run `npm run format:check`. If it fails, run `npm run format` to auto-fix, then verify with `format:check` again.

4. **Type check** — Run `npx astro check`. If it fails, read the errors, fix them, and re-run until clean.

5. **Build** — Run `npm run build`. If it fails, read the errors, fix them, and re-run until clean.

6. **Stage & Commit (one commit per logical change)** — Do NOT lump unrelated changes into a single commit. Group the working-tree changes by intent and create one focused commit per group.

   To identify groups, run `git status` and `git diff --stat` and ask: do these files change for the same reason? Examples of distinct groups that should be separate commits:
   - A new skill or agent (`.claude/skills/<name>/`)
   - A new feature (e.g. homepage changes)
   - A refactor or behavior change (e.g. tag-filter logic)
   - Content additions (a new post)
   - Content deletions (removed posts)
   - Configuration/schema changes

   Two changes that touch unrelated files almost always belong in separate commits. Two changes that touch the same file may still belong in separate commits if they were made for different reasons — use `git add -p` to stage hunks selectively when needed.

   For each group, in order (commit additions and refactors before deletions to keep history bisectable):
   - Stage only the files in that group with `git add <specific paths>`. Never `git add -A` or `git add .`.
   - Run `git status` to confirm the staging area matches the intended group.
   - Create the commit using a HEREDOC for the message. Use conventional-commit format (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.) with a focused subject line that describes only that group's change. Include the `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.
   - Do NOT stage `.env`, credentials, or other sensitive files.

   When all groups are committed, run `git status` to confirm the working tree is clean and `git log --oneline main..HEAD` to confirm the commit list reads cleanly.

7. **Push** — Push the branch to origin with `-u` flag.

8. **Open PR** — Use `gh pr create` with:
   - A short title (under 70 characters). If one commit is the headline change, follow its conventional-commit subject. If the branch covers several distinct changes, pick a short umbrella title (e.g. `chore: cleanup and polish`).
   - A body with a `## Summary` section that lists **one bullet per commit** (use the commit subjects, in order), and a `## Test plan` section.
   - Return the PR URL when done

## Important

- If any check fails more than 3 attempts, stop and report the issue to the user.
- Do NOT skip or bypass any checks.
- Do NOT use `--no-verify` on the commit.

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

6. **Stage & Commit** — Stage all relevant changed files (do NOT stage `.env`, credentials, or other sensitive files) and create a commit following conventional commit format. Analyze the changes to determine the appropriate type (`feat`, `fix`, `chore`, etc.) and write a concise commit message. Use a HEREDOC for the message. Include the co-author trailer.

7. **Push** — Push the branch to origin with `-u` flag.

8. **Open PR** — Use `gh pr create` with:
   - A short title (under 70 characters) following conventional commit style
   - A body with a `## Summary` section (2-3 bullet points) and a `## Test plan` section
   - Return the PR URL when done

## Important

- If any check fails more than 3 attempts, stop and report the issue to the user.
- Do NOT skip or bypass any checks.
- Do NOT use `--no-verify` on the commit.

# design-agents skill

Run consumer-drift and/or design-system-propagation checks on the current PR and post results as a PR comment.

## Steps

1. Get the current PR context:
   ```bash
   gh pr view --json number,baseRefOid,headRefOid,headRefName
   ```

2. Get changed files between base and head:
   ```bash
   git diff --name-only <base_sha> <head_sha>
   ```

3. Decide which agents to run based on changed files:
   - **consumer-drift** → run if any file matches `src/pages/**` or `src/patterns/**`
   - **design-system-propagation** → run if any file matches `src/components/**` or `*.stories.jsx`

4. For each applicable agent, read its instruction file and follow it exactly:
   - Consumer drift: `.claude/agents/consumer-drift.md`
   - Propagation: `.claude/agents/design-system-propagation.md`

5. Run consumer-drift first, then propagation (sequential — avoids simultaneous token pressure).

6. Post each report as a PR comment using the GitHub MCP tool `mcp__github__add_issue_comment`.

7. If neither category changed, post a brief comment:
   > ✅ No src/components, src/pages, or src/patterns changes detected — design agents skipped.

## Notes
- Report only — never modify files.
- If no PR is open on the current branch, ask the user for the PR number.

# DIRECTIVES.md

## Current Focus
- Fix all bugs before adding new features
- Prioritize issues affecting API correctness

## Off Limits
- Do not modify the auth token values or auth logic fundamentally

## Style Preferences
- Use async/await, never .then() chains
- All route handlers must have proper TypeScript types
- Use zod for all request body validation
- Error responses must follow format: { error: string, details?: string }

## Constraints
- All PRs must include at least one test
- Keep changes focused — one issue per PR

## Feature Guidance
- Pagination should follow cursor-based or offset-based pattern
- Timestamps should use ISO 8601 format

## Communication
- Use label `living-repo` on all automated PRs
- PR descriptions must explain what was wrong and how it was fixed

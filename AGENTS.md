# AGENTS.md

## External Search Workflow

- The user will manually use ChatGPT (latest) for internet research when up-to-date external information is needed.
- Do not browse or independently search the web if the user has not explicitly asked for it in the current turn.
- When external research is needed, ask the user to search instead of performing the search directly.
- In that request, provide concrete search keywords or search queries the user can paste into ChatGPT.
- When providing a prompt for the user to paste into AI tools such as ChatGPT, always present the entire prompt in Markdown fenced code blocks.
- Do not ask the user to perform work that the AI can complete locally in the repository or environment.
- Only ask the user to do something when it is genuinely user-exclusive, such as manual external research under this workflow, approvals, credentials, or decisions that cannot be inferred safely.
- After the user returns the results, continue the task based on those results.
- Do not repeatedly ask the user to re-explain this workflow once it is written here; follow it by default for this repository.

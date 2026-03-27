# AGENTS.md

## External Search Workflow

- The user will manually use ChatGPT (latest) for internet research when up-to-date external information is needed.
- Do not browse or independently search the web if the user has not explicitly asked for it in the current turn.
- When external research is needed, ask the user to search instead of performing the search directly.
- In that request, provide concrete search keywords or search queries the user can paste into ChatGPT.
- When providing a prompt for the user to paste into AI tools such as ChatGPT, always present the entire prompt in Markdown fenced code blocks.
- When asking the user to paste a prompt into another AI, assume that AI has no knowledge of this repository, codebase, data model, internal terminology, or prior conversation context unless that context is explicitly included in the prompt.
- Therefore, prompts for external AI research must be self-contained and understandable even to a person or model with zero prior knowledge of this repository, product, domain model, naming, or conversation history.
- Write such prompts so that a completely uninformed third party could read the prompt alone and still understand:
  - what is being researched,
  - why the research is being requested,
  - how the result will be used,
  - what each important term means,
  - what kind of output is expected.
- Explicitly explain repository-specific or implementation-specific terms in the prompt. Do not use internal field names or shorthand alone if their meaning would be unclear to an external AI.
- Do not rely on abbreviations, shorthand, internal jargon, or implicit project context unless each one is explained in plain language inside the prompt.
- If the research output is meant to be transformed into local structured data, explain the purpose of that data, the meaning of each required field, and how the output will be used.
- Do not ask an external AI to infer unstated assumptions that only exist in this repository. Provide the relevant assumptions directly in the prompt.
- If a term, field, classification, or output format could be misunderstood by someone outside the project, define it explicitly before asking for an answer.
- When requesting explanatory text from another AI, distinguish clearly between:
  - verified facts gathered from sources,
  - tentative interpretation based on those facts,
  - implementation-ready draft wording derived from those facts.
- Do not ask external AI to generate repository-specific explanatory fields such as rationale text without first explaining what those fields mean, how they will be used, and what level of certainty is expected.
- Prefer prompts that ask the external AI to separate source-backed facts from interpretation, especially when the output will later be converted into implementation text or recommendation logic.
- When helpful, specify the desired output structure explicitly so the returned result can be mapped into the local implementation with minimal ambiguity.
- Prompts for external AI research should instruct the model not to guess when information is unavailable, and to mark unknown items clearly.
- Do not ask the user to perform work that the AI can complete locally in the repository or environment.
- Only ask the user to do something when it is genuinely user-exclusive, such as manual external research under this workflow, approvals, credentials, or decisions that cannot be inferred safely.
- After the user returns the results, continue the task based on those results.
- Do not repeatedly ask the user to re-explain this workflow once it is written here; follow it by default for this repository.

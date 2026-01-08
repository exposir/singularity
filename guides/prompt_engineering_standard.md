# PROMPT ENGINEERING GUIDELINES

This document serves as the "Knowledge Base" for AI agents working in this repository. Use these principles when creating or refining prompts.

## 1. The Core Philosophy

A good prompt is a program written in natural language. It must have:

- **Input Definition**: What goes in.
- **Processing Logic**: How to think about the input.
- **Output Definition**: What comes out.

## 2. Structural Template (The "Golden Standard")

When generating new prompts for this repository, attempt to map them to this structure:

```markdown
# [Prompt Name]

## Metadata

- **Author**: [User/AI]
- **Tags**: [list, of, tags]
- **LLM Optimized For**: [e.g. Claude 3.5, GPT-4]

## System / Role

You are a expert [Role]. Your interaction style is [Adjectives].

## Task

Your task is to [Concise Objective].

## Steps

1. Step 1: Analyze...
2. Step 2: Extract...
3. Step 3: Generate...

## Constraints

- Do not...
- Ensure...
- Output text must be...

## Output Format

(Provide JSON schema, Markdown template, or specific layout)

## Examples

User: "..."
Assistant: "..."
```

## 3. Advanced Techniques to Apply

- **Few-Shot Prompting**: Always include 1-3 examples for complex logic.
- **Chain of Thought**: Instruct the model to "Think step-by-step" before outputting.
- **Delimiters**: Use `"""`, `---`, or XML tags `<input>` to separate instructions from data.

## 4. Maintenance

- If a prompt becomes obsolete or fails with newer models, create a versioned copy (e.g., `_v2.md`).

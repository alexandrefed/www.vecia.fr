# Claude Code Agents & Subagents Guide (2025)

Complete guide to creating and using specialized AI agents in Claude Code for maximum productivity.

## Table of Contents

- [What are Agents/Subagents?](#what-are-agentssubagents)
- [Why Use Agents?](#why-use-agents)
- [Quick Start](#quick-start)
- [Creating Custom Agents](#creating-custom-agents)
- [Agent Configuration](#agent-configuration)
- [Built-in vs Custom Agents](#built-in-vs-custom-agents)
- [Example Agents for Web Development](#example-agents-for-web-development)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

---

## What are Agents/Subagents?

**Agents** (also called **subagents** or **custom agents**) are specialized AI assistants within Claude Code that handle specific types of tasks. Think of them as domain experts on your team.

### Key Characteristics

Each agent has:
- **Dedicated purpose** - Specific expertise area (e.g., code review, debugging, testing)
- **Separate context window** - Works independently without cluttering main conversation
- **Custom system prompt** - Detailed instructions defining its role and behavior
- **Specific tool access** - Only uses tools necessary for its job
- **Automatic or manual invocation** - Claude can use them automatically or you can call them explicitly

### How They Work

```
Main Claude Code Session (Orchestrator)
         ↓
    Delegates Task
         ↓
Specialized Agent (e.g., Code Reviewer)
         ↓
    Returns Results
         ↓
Main Session Continues
```

---

## Why Use Agents?

### 1. **Context Preservation**

Each agent has its own context window, preventing the main conversation from getting cluttered with task-specific details.

**Without agents:**
```
Main: "Review this code"
Claude: [reads file, analyzes, gives feedback - all in main context]
Main: "Now write tests"
Claude: [context polluted with code review details]
```

**With agents:**
```
Main: "Review this code"
Code-Reviewer Agent: [analyzes in separate context]
Returns: "Found 3 issues: ..."
Main: [continues with clean context] "Now write tests"
Test-Writer Agent: [works in its own context]
```

### 2. **Specialized Expertise**

Agents can be fine-tuned with detailed, task-specific instructions that would clutter a general prompt.

### 3. **Reusability**

Once created, agents work across all projects. Share them with your team by committing to version control.

### 4. **Security & Safety**

Limit powerful tools (like file deletion or API calls) to only specific trusted agents.

### 5. **Parallel Processing**

Multiple agents can work simultaneously on different tasks.

---

## Quick Start

### Step 1: Open Agent Interface

```bash
/agents
```

### Step 2: Create New Agent

Choose:
- **Project-level** (`.claude/agents/`) - Available in current project only
- **User-level** (`~/.claude/agents/`) - Available across all projects

### Step 3: Define Agent

**Recommended approach:**
1. Ask Claude to generate initial agent configuration
2. Review and customize to your needs
3. Save and test

**Manual approach:**
1. Enter agent name (lowercase-with-hyphens)
2. Write description (when it should be used)
3. Select tools (or leave blank to inherit all)
4. Write system prompt (detailed instructions)

### Step 4: Use Agent

**Automatic (Recommended):**
```
> Fix the failing tests
> [Claude automatically uses test-runner agent if appropriate]
```

**Manual/Explicit:**
```
> Use the code-reviewer agent to check my recent changes
> Ask the debugger agent to investigate this error
> Have the astro-expert agent optimize this component
```

---

## Creating Custom Agents

### Agent File Structure

Agents are Markdown files with YAML frontmatter:

```markdown
---
name: agent-name
description: When this agent should be used
tools: Tool1, Tool2, Tool3  # Optional
model: sonnet  # Optional: sonnet, opus, haiku, or 'inherit'
---

# Agent's System Prompt

You are [role description].

When invoked:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Key responsibilities:
- [Responsibility 1]
- [Responsibility 2]

Guidelines:
- [Guideline 1]
- [Guideline 2]

For each task, provide:
- [Output format]
```

### Configuration Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | Yes | Unique identifier | `astro-expert` |
| `description` | Yes | When to use this agent | `Expert in Astro framework. Use for Astro-specific questions, optimization, and best practices.` |
| `tools` | No | Comma-separated tool list | `Read, Edit, Bash, Grep` |
| `model` | No | Model to use | `sonnet`, `opus`, `haiku`, or `inherit` |

### File Locations

| Type | Location | Scope | Priority |
|------|----------|-------|----------|
| **Project agents** | `.claude/agents/` | Current project only | **Highest** |
| **User agents** | `~/.claude/agents/` | All projects | Lower |

**Conflict resolution:** Project-level agents override user-level agents with same name.

---

## Agent Configuration

### Tool Access

**Option 1: Inherit all tools (default)**
```markdown
---
name: my-agent
description: Agent description
# tools field omitted - inherits all tools
---
```

**Option 2: Specific tools only**
```markdown
---
name: my-agent
description: Agent description
tools: Read, Grep, Bash
---
```

**Available tools:** Read, Write, Edit, Bash, Grep, Glob, MCP tools, etc.

### Model Selection

```markdown
---
model: sonnet      # Use Claude 3.5 Sonnet
model: opus        # Use Claude 3 Opus
model: haiku       # Use Claude 3 Haiku
model: inherit     # Use same model as main conversation
---
```

**Default:** If omitted, uses configured subagent model (usually `sonnet`)

---

## Built-in vs Custom Agents

### Built-in Agents

Claude Code may come with pre-configured agents. Check with:

```bash
/agents
```

### Custom Agents

You create these yourself for project-specific needs.

**Example workflow:**
1. Start with generic Claude
2. Identify repetitive specialized tasks
3. Create agents for those tasks
4. Refine over time

---

## Example Agents for Web Development

### 1. Astro Expert

```markdown
---
name: astro-expert
description: Expert in Astro web framework. Use proactively for Astro-specific questions, component optimization, performance tuning, and best practices implementation.
tools: Read, Edit, Grep, Glob, Bash
model: sonnet
---

You are an Astro framework expert specializing in modern web development with Astro.

**Reference Documentation:**
- Primary: `docs/ASTRO_REFERENCE.md`
- Quick Start: `docs/astro-quick-start.md`
- Integrations: `docs/astro-integrations.md`
- Deployment: `docs/astro-deployment.md`

When invoked:
1. Check relevant Astro documentation first
2. Identify the specific Astro feature or pattern needed
3. Provide solution following Astro best practices
4. Ensure performance optimization (islands architecture)

Key responsibilities:
- Answer Astro-specific questions
- Optimize component performance
- Implement Astro best practices
- Configure integrations correctly
- Debug Astro-specific issues

Best practices to enforce:
- Use `client:visible` for below-fold interactive components
- Optimize images with `<Image>` component
- Leverage content collections for type-safe Markdown
- Minimize client-side JavaScript (islands architecture)
- Use proper client directives

For each solution:
- Reference specific Astro documentation when applicable
- Explain trade-offs and performance implications
- Provide working code examples
- Include TypeScript types when relevant
```

### 2. Code Reviewer

```markdown
---
name: code-reviewer
description: Senior code reviewer. Use proactively after writing or modifying code. Reviews for quality, security, performance, and maintainability.
tools: Read, Grep, Glob, Bash
model: opus
---

You are a senior code reviewer ensuring high code quality and security.

When invoked:
1. Run `git diff` to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- **Code Quality**
  - Simple and readable
  - Well-named functions and variables
  - No duplicated code
  - Proper comments for complex logic

- **Security**
  - No exposed secrets or API keys
  - Input validation implemented
  - No SQL injection vulnerabilities
  - Environment variables used correctly

- **Performance**
  - Efficient algorithms
  - No unnecessary re-renders (React/Vue)
  - Proper use of client directives (Astro)
  - Image optimization

- **Testing**
  - Good test coverage
  - Edge cases considered
  - Tests actually test the behavior

- **Accessibility**
  - Semantic HTML
  - ARIA labels where needed
  - Keyboard navigation support

Provide feedback organized by priority:
- 🔴 **Critical issues** (must fix before merge)
- 🟡 **Warnings** (should fix)
- 🟢 **Suggestions** (consider improving)

Include specific examples of how to fix issues.
```

### 3. Debugger Specialist

```markdown
---
name: debugger
description: Debugging expert for errors, test failures, and unexpected behavior. Use proactively when encountering any issues or bugs.
tools: Read, Edit, Bash, Grep, Glob
model: sonnet
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and full stack trace
2. Identify steps to reproduce
3. Isolate the failure location
4. Form hypotheses about the cause
5. Test hypotheses systematically
6. Implement minimal fix
7. Verify solution works

Debugging process:
1. **Gather information**
   - Error messages and logs
   - Stack traces
   - Recent code changes (git log)
   - Environment details

2. **Reproduce**
   - Create minimal reproduction case
   - Document exact steps
   - Verify it fails consistently

3. **Isolate**
   - Binary search through code
   - Add strategic logging
   - Check variable states
   - Review recent commits

4. **Fix**
   - Implement minimal change
   - Avoid fixing symptoms only
   - Address root cause

5. **Verify**
   - Test the fix
   - Check for side effects
   - Run full test suite
   - Document the issue

For each bug, provide:
- Root cause explanation
- Evidence supporting diagnosis
- Specific code fix
- Test to prevent regression
- Prevention recommendations
```

### 4. Test Automation Expert

```markdown
---
name: test-writer
description: Test automation expert. Use proactively for writing unit tests, integration tests, and end-to-end tests. Follows TDD principles.
tools: Read, Write, Bash
model: sonnet
---

You are a test automation expert specializing in comprehensive testing strategies.

When invoked:
1. Understand the code to be tested
2. Identify test cases (happy path + edge cases)
3. Write clear, maintainable tests
4. Run tests to verify they work
5. Provide coverage report if possible

Testing principles:
- **Test behavior, not implementation**
- **Cover edge cases and error paths**
- **Make tests independent and isolated**
- **Use descriptive test names**
- **Keep tests simple and focused**

For unit tests:
- Test one thing per test
- Mock external dependencies
- Use arrange-act-assert pattern
- Cover edge cases:
  - Null/undefined inputs
  - Empty arrays/objects
  - Boundary values
  - Error conditions

For integration tests:
- Test component interactions
- Use realistic data
- Test critical user paths
- Verify error handling

Test file structure:
```javascript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle happy path', () => { ... });
    it('should handle edge case X', () => { ... });
    it('should throw error when Y', () => { ... });
  });
});
```

For each test suite:
- Explain what's being tested
- Document why edge cases are important
- Provide coverage metrics
- Suggest additional test cases if needed
```

### 5. Documentation Writer

```markdown
---
name: docs-writer
description: Technical documentation specialist. Use for creating or updating README files, API documentation, code comments, and user guides.
tools: Read, Write, Edit, Grep
model: sonnet
---

You are a technical documentation specialist focused on clear, helpful documentation.

When invoked:
1. Review existing documentation structure
2. Identify what needs documentation
3. Write clear, concise documentation
4. Include code examples
5. Verify accuracy

Documentation principles:
- **Clarity over cleverness**
- **Examples over explanations**
- **User perspective first**
- **Keep it up-to-date**

For READMEs:
- Project overview
- Quick start guide
- Installation instructions
- Usage examples
- Configuration options
- Troubleshooting section
- Contributing guidelines
- License information

For API documentation:
- Function/method signature
- Parameter descriptions
- Return value details
- Usage examples
- Error cases
- See also / related functions

For code comments:
- Explain WHY, not WHAT
- Document complex algorithms
- Note important assumptions
- Warn about gotchas
- Link to relevant docs/issues

Formatting:
- Use Markdown
- Include code blocks with language tags
- Add screenshots for UI features
- Use tables for reference data
- Link to related documentation
```

### 6. Performance Optimizer

```markdown
---
name: performance-optimizer
description: Performance optimization specialist. Use for analyzing and improving application performance, load times, and resource usage.
tools: Read, Edit, Bash, Grep
model: opus
---

You are a performance optimization expert for web applications.

When invoked:
1. Identify performance bottlenecks
2. Measure current performance
3. Propose optimization strategies
4. Implement improvements
5. Verify performance gains

Performance analysis areas:

**Frontend Performance:**
- JavaScript bundle size
- Image optimization
- CSS optimization
- Lazy loading strategy
- Client-side rendering vs SSR
- Caching strategies

**Astro-Specific:**
- Proper use of islands architecture
- Client directive optimization (visible > idle > load)
- Image component usage
- Prefetching configuration
- Static vs SSR/hybrid mode

**Build Performance:**
- Build time optimization
- Code splitting
- Tree shaking effectiveness
- Dependency analysis

**Runtime Performance:**
- Algorithmic complexity
- Memory usage
- Database query optimization
- API call optimization

Optimization checklist:
- Analyze bundle size (use `npx astro build --analyze`)
- Check Lighthouse scores
- Measure Core Web Vitals
- Review network waterfall
- Identify render-blocking resources
- Check for layout shifts

For each optimization:
- Measure baseline performance
- Implement change
- Measure improvement
- Document trade-offs
- Provide before/after metrics
```

### 7. Security Auditor

```markdown
---
name: security-auditor
description: Security expert. Use proactively to scan code for vulnerabilities, exposed secrets, and security best practices.
tools: Read, Grep, Bash
model: opus
---

You are a security expert specializing in web application security.

When invoked:
1. Scan for common vulnerabilities
2. Check for exposed secrets
3. Verify security best practices
4. Provide remediation steps

Security checklist:

**Secrets & Credentials:**
- No hardcoded API keys
- No credentials in code
- Environment variables used correctly
- `.env` files in `.gitignore`
- No secrets in git history

**Input Validation:**
- User input sanitized
- SQL injection prevention
- XSS prevention
- CSRF protection
- File upload validation

**Authentication & Authorization:**
- Strong password requirements
- Secure session management
- Proper JWT handling
- Role-based access control

**Data Protection:**
- HTTPS enforcement
- Sensitive data encryption
- No sensitive data in logs
- Secure cookie flags

**Dependencies:**
- No known vulnerabilities (`npm audit`)
- Dependencies up to date
- License compatibility

**API Security:**
- Rate limiting
- Authentication required
- Input validation
- Error messages don't leak info

For each issue:
- Severity level (Critical/High/Medium/Low)
- Detailed explanation
- Proof of concept (if applicable)
- Remediation steps
- Prevention recommendations
```

---

## Best Practices

### 1. Start with Claude-Generated Agents

**Recommended workflow:**
```
You: "Create a code reviewer agent for Astro projects"
Claude: [Generates agent configuration]
You: [Review, customize, save]
```

Benefits:
- Solid foundation
- Follows best practices
- Quick to iterate

### 2. Keep Agents Focused

✅ **Good:**
- `code-reviewer` - Reviews code
- `test-writer` - Writes tests
- `debugger` - Debugs issues

❌ **Bad:**
- `super-agent` - Reviews code, writes tests, debugs, AND generates documentation

**Why:** Focused agents are more reliable, predictable, and reusable.

### 3. Write Detailed System Prompts

**Poor prompt:**
```markdown
You are a code reviewer.
```

**Good prompt:**
```markdown
You are a senior code reviewer ensuring high standards.

When invoked:
1. Run git diff to see changes
2. Focus on modified files
3. Check for [specific issues]

Checklist:
- [Item 1]
- [Item 2]

Provide feedback as:
- Critical: [...]
- Warnings: [...]
- Suggestions: [...]
```

### 4. Limit Tool Access

Only grant tools the agent actually needs:

```markdown
# Code reviewer doesn't need Write or Edit
tools: Read, Grep, Glob, Bash

# Test writer needs Write to create test files
tools: Read, Write, Bash

# Debugger might need Edit to fix issues
tools: Read, Edit, Bash, Grep
```

### 5. Use Version Control

```bash
# Commit project agents
git add .claude/agents/
git commit -m "Add code-reviewer and test-writer agents"
```

**Benefits:**
- Team collaboration
- Agent history tracking
- Easy rollback
- Share across projects

### 6. Encourage Proactive Use

Add keywords to description:

```markdown
description: Expert code reviewer. Use PROACTIVELY after any code changes. MUST BE USED before committing.
```

Keywords that help:
- "PROACTIVELY"
- "AUTOMATICALLY"
- "ALWAYS"
- "MUST BE USED"

---

## Advanced Usage

### Chaining Agents

```
> First use the astro-expert to review component architecture,
  then use the performance-optimizer to improve it,
  then use the code-reviewer to verify the changes
```

### Parallel Processing

```
> Have multiple agents analyze this codebase:
  - security-auditor for vulnerabilities
  - performance-optimizer for bottlenecks
  - docs-writer to check documentation
```

### Dynamic Selection

Claude automatically selects agents based on:
- Task description in your request
- Agent `description` field
- Current context
- Available tools

### Agent Communication

Agents can reference each other's work:

```
Main: "Review and test this feature"
  → Code-Reviewer: [Reviews code, finds issues]
  → Main: [Fixes issues]
  → Test-Writer: [Creates tests based on review feedback]
```

---

## Troubleshooting

### Agent Not Being Used Automatically

**Problem:** Claude isn't using your agent automatically

**Solutions:**
1. Make description more specific and action-oriented
2. Add proactive keywords ("ALWAYS", "PROACTIVELY")
3. Explicitly mention the agent in your request
4. Check if agent name is unique (no conflicts)

### Agent Running Slowly

**Problem:** Agent takes a long time to respond

**Causes:**
- Agent gathering too much context
- Too many tools granted
- Complex system prompt

**Solutions:**
- Limit tool access to essentials
- Simplify system prompt
- Be more specific in prompts to agent

### Agent Giving Wrong Results

**Problem:** Agent not following instructions

**Solutions:**
1. Refine system prompt with more specific instructions
2. Add examples of good/bad outputs
3. Test with simpler tasks first
4. Check if agent has necessary tools

### Context Window Issues

**Problem:** Agent hitting context limits

**Solutions:**
- Create more focused agents for subtasks
- Use compaction (`/compact` command)
- Reduce tool count
- Shorten system prompts

---

## Resources

### Official Documentation
- [Claude Code Subagents Docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Community
- Reddit: [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/)
- Example Agents: [awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)

### Related Guides
- Main Astro Reference: `docs/ASTRO_REFERENCE.md`
- Claude Code Setup: `CLAUDE.md`

---

**Last Updated:** January 2025
**Claude Code Version:** 1.0.60+

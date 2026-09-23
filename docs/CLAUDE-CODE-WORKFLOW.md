# Claude Code workflow for this repo

Moved verbatim out of the root `CLAUDE.md` on 2026-09-23 (ICM migration, task
`c1a473f7`) — this is Claude-Code-operational guidance, not Astro reference material,
so it belongs here rather than in the entry file. Nothing below was rewritten.

## Phase Implementation Protocol (MANDATORY)

**BEFORE implementing ANY phase, you MUST:**

1. **Open** `docs/PHASE-CHECKLIST.md`
2. **Search** Tavily/Context7 for "2025 best practices [phase technology]"
3. **Report** findings to user in this format:
   ```
   ## Phase X Best Practices Check ✅
   **Searched**: [queries]
   **Findings**: [summary]
   **Changes Needed**: [Yes/No]
   **Recommendation**: [proceed/update]
   ```
4. **WAIT** for user approval before coding
5. **Update** todo list with phase tasks

**If user says "Check phase checklist"** → immediately reference `docs/PHASE-CHECKLIST.md`

**NO EXCEPTIONS** - This ensures we always use 2025 best practices.

## Workflow Best Practices

### When Starting a New Task

1. **Read relevant documentation first** - Check `docs/` for Astro patterns
2. **Plan before coding** - Use Plan Mode (Shift+Tab twice) for complex tasks
3. **Make small, focused changes** - Easier to review and debug
4. **Test frequently** - `npm run dev` has hot reload
5. **Commit often** - Small, descriptive commits

### When Implementing Features

1. **Check existing patterns** - Look at similar components/pages
2. **Follow Astro patterns** - Reference `docs/ASTRO_REFERENCE.md`
3. **Optimize from the start** - Use proper client directives
4. **Type safety** - Use TypeScript when possible
5. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

### When Fixing Bugs or User Reports Issues

**🚨 CRITICAL: NEVER make blind changes. ALWAYS diagnose first.**

**MANDATORY Debugging Protocol (DO THIS FIRST):**

1. **Ask user to hard refresh browser** - `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
   - Clears browser cache that might be showing old CSS/JS
   - Fixes 80% of "not working" issues

2. **Check browser DevTools BEFORE making any changes:**
   - Open DevTools (F12 or Cmd+Option+I)
   - **Elements tab**: Inspect the actual rendered HTML
   - **Computed styles**: See what CSS is actually applied
   - **Console tab**: Look for errors/warnings
   - **Network tab**: Check if CSS/JS files are loading (200 vs 404)
   - **Application tab**: Clear site data if needed

3. **Verify the actual problem:**
   - Screenshot or describe what you see in DevTools
   - Check if the classes are in the HTML
   - Check if the CSS rules exist
   - Check if something is overriding the styles

4. **Only THEN make targeted changes:**
   - Fix the specific root cause you identified
   - Don't try random "fixes" hoping something works
   - Test the fix immediately in browser

**Common Root Causes (check these first):**
- ❌ Browser cache (hard refresh fixes it)
- ❌ CSS not loading (check Network tab)
- ❌ Tailwind not generating the utility (check generated CSS)
- ❌ Specificity issues (something overriding your styles)
- ❌ Typo in class name
- ❌ Hot reload didn't pick up change (restart dev server)

**Anti-Patterns to AVOID:**
- ❌ Making changes without inspecting DevTools first
- ❌ Trying multiple "fixes" hoping one works
- ❌ Assuming the code is wrong without verification
- ❌ Relying on your memory of how something works
- ❌ Not asking user to hard refresh before debugging

## Testing

### Before Committing

**ALWAYS run these checks:**

```bash
# Type checking
npm run astro check

# Build test
npm run build

# Preview build locally
npm run preview
```

**Test in browser:**
- Check console for errors
- Verify responsive design (mobile/tablet/desktop)
- Test interactive components
- Check Lighthouse scores (aim for 90+ in all categories)

## Important Reminders for Claude Code AI

**CRITICAL - Read Documentation First:**
1. **Before implementing Astro features**, read the relevant section in `docs/ASTRO_REFERENCE.md`
2. **For quick reference**, check `docs/astro-quick-start.md`
3. **For integrations**, consult `docs/astro-integrations.md`
4. **For deployment**, refer to `docs/astro-deployment.md`
5. **For creating specialized agents**, see `docs/claude-code-agents.md`
6. **For VPS deployment with CI/CD**, see `docs/vps-deployment-github-actions.md`

**When Planning:**
- Use Plan Mode (Shift+Tab twice) for complex tasks
- Break down large features into smaller steps
- Verify approach against documentation first

**When Coding:**
- **ALWAYS use Context7/documentation FIRST** - Don't rely on generic knowledge
- Follow Astro best practices from documentation
- Use proper client directives (prefer `client:visible`)
- Optimize images with `<Image>` component
- Keep JavaScript minimal (islands architecture)
- Test frequently during development
- **When something doesn't work**: Follow the Debugging Protocol above

**When Committing:**
- Write clear, descriptive commit messages
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `style:`, etc.
- Run `npm run astro check` before committing
- Create focused commits (one feature/fix per commit)

**When in Doubt:**
- Ask questions before making assumptions
- Check existing code patterns
- Reference the documentation in `docs/`
- Use `/clear` to start fresh conversation when context is lost

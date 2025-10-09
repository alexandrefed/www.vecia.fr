# Vecia Blog: Agents & Published Articles Guide

**Last Updated**: October 9, 2025
**Purpose**: Complete reference for blog content creation agents and existing articles

---

## Table of Contents
1. [Blog Agent System Overview](#blog-agent-system-overview)
2. [Agent 1: AI Researcher](#agent-1-ai-researcher)
3. [Agent 2: Content Writer](#agent-2-content-writer)
4. [Complete Workflow: Research → Write → Publish](#complete-workflow-research--write--publish)
5. [Published Article #1: L'IA ne marche pas](#published-article-1-lia-ne-marche-pas)
6. [Published Article #2: L'IA Agentique en Entreprise](#published-article-2-lia-agentique-en-entreprise)
7. [Content Guidelines & Best Practices](#content-guidelines--best-practices)
8. [Examples Already Used (DO NOT REUSE)](#examples-already-used-do-not-reuse)

---

## Blog Agent System Overview

The Vecia blog uses a **two-agent workflow** to create high-quality, research-backed French AI content:

1. **AI Researcher Agent**: Gathers latest trends, statistics, and case studies
2. **Content Writer Agent**: Transforms research into aggressive, sarcastic French articles

### Key Benefits
- **Research-backed content**: All statistics and examples are verified from 2025 sources
- **Consistent voice**: Content Writer maintains Vecia's aggressive-but-professional tone
- **Scalable production**: Can produce multiple articles per week
- **SEO-optimized**: Built-in best practices for search engine visibility

### Technical Architecture
- **Communication**: Agents communicate via files (Write creates, Read consumes)
- **Context**: Each agent has independent context window
- **Tools**: Specialized MCP tools for research and writing
- **Output**: Production-ready HTML with Tailwind CSS v4

---

## Agent 1: AI Researcher

### Configuration
**Location**: `.claude/agents/ai-researcher.yaml`
**Type**: Research and data gathering
**Output Format**: Structured markdown reports

### Available Tools
```yaml
Tools:
  - mcp__brave-search__brave_web_search       # Web search
  - mcp__tavily-mcp__tavily-search            # AI-powered search
  - mcp__context7__resolve-library-id          # Library documentation
  - mcp__context7__get-library-docs            # Retrieve docs
  - mcp__fetch__fetch                          # Fetch URLs
  - WebFetch                                   # Web content fetching
  - Write                                      # Save research findings
```

### Research Focus Areas
1. **Agentic AI and Autonomous Systems**
   - Latest trends in AI agents
   - Enterprise adoption statistics
   - ROI and cost savings data

2. **Enterprise AI Automation**
   - Real-world implementation case studies
   - Industry-specific use cases
   - Best practices and frameworks

3. **AI Ethics and Transparency**
   - Responsible AI practices
   - GDPR compliance
   - Trust and transparency

4. **Scaling AI (Prototype → Production)**
   - Common pitfalls and failures
   - Success factors
   - Technical architecture

5. **SME AI Adoption**
   - Small/medium enterprise success stories
   - Budget-friendly implementations
   - Quick wins and practical advice

6. **AI vs Traditional Automation**
   - Comparative analysis
   - When to use which approach
   - Cost-benefit analysis

### Output Structure
The researcher creates markdown files with:

```markdown
# Research Report: [Topic]
**Date**: YYYY-MM-DD
**Focus**: [Primary research question]

## Key Statistics (2025)
- Statistic 1 with source
- Statistic 2 with source
- Statistic 3 with source

## Real-World Case Studies
### Case Study 1: [Company Name]
- Industry: [Industry]
- Problem: [Description]
- Solution: [Implementation details]
- Results: [Quantifiable outcomes]
- Source: [URL]

## Latest Trends
1. Trend 1 - [Description]
2. Trend 2 - [Description]

## Practical Implementation Advice
[Actionable recommendations]

## Ethical Considerations
[Important notes on responsible use]

## Sources
1. [Source 1 - URL]
2. [Source 2 - URL]
```

### Usage Examples

**Example 1: Basic Research**
```bash
> Use ai-researcher to gather latest 2025 AI agentic trends and ROI statistics
```

**Example 2: Specific Topic**
```bash
> Use ai-researcher to research prompt engineering best practices for enterprise AI,
  focusing on 2025 data and real case studies
```

**Example 3: Industry-Specific**
```bash
> Use ai-researcher to find AI automation success stories in e-commerce industry,
  with emphasis on cost reduction and ROI metrics
```

---

## Agent 2: Content Writer

### Configuration
**Location**: `.claude/agents/content-writer.yaml`
**Type**: Content creation and transformation
**Output Format**: Production-ready HTML blog articles

### Available Tools
```yaml
Tools:
  - Read    # Read research files and existing articles
  - Write   # Create new blog articles
  - Edit    # Modify existing articles
```

### Writing Style & Tone

#### Core Principles
- **Tone**: Confrontant, direct, sarcastique mais professionnel
- **Language**: French (France)
- **Target Audience**: C-level executives, tech decision makers, AI enthusiasts
- **Voice**: First-person perspective, personal and engaging

#### Style Characteristics
```
✅ GOOD Examples:
- "l'IA n'est pas à la traîne : c'est l'utilisateur qui est branlant"
- "tel le cocaïnomane que je suis" (self-deprecating humor)
- "fermez là" (casual but not vulgar)
- "sans s'essouffler" (professional crude)

❌ BAD Examples (DO NOT USE):
- "putain" → Too vulgar
- "merde" → Too vulgar
- "fermez votre gueule" → Use "fermez là" instead
- "sans crever" → Use "sans s'essouffler" instead
```

#### Signature Metaphor System
**Primary**: Muscu/fitness analogies
- Squat, développé couché, deadlift
- Nutrition (protéines, glucides, créatine)
- Gym culture (stalker who quits, rack collecting dust)
- Training programs and progression

**Rules**:
- ✅ Vary metaphors between articles
- ✅ Make them contextual and relevant
- ❌ NEVER reuse exact same examples
- ❌ Don't force fitness metaphors everywhere

### Writing Constraints

#### Article Length
- **Target**: 1200-1500 words MAX
- **Reason**: Maintain reader engagement
- **Structure**: Short punchy sections, not walls of text

#### Example Tracking
**CRITICAL**: Update agent YAML after each article with used examples to prevent repetition.

### Article Structure Template

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Article Title] - Blog Vecia</title>
    <meta name="description" content="[Short description]">

    <!-- Open Graph / Social -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="[Title]">
    <meta property="og:description" content="[Description]">
    <meta property="og:image" content="[Image URL]">

    <!-- Article Metadata -->
    <meta property="article:published_time" content="YYYY-MM-DD">
    <meta property="article:author" content="[Author Name]">
    <meta property="article:section" content="[Category]">

    <!-- Tailwind CSS v4 -->
    <link rel="stylesheet" href="/src/main.css">

    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>

<body class="bg-gray-50">
    <main class="max-w-4xl mx-auto px-6 pt-12 pb-16">

        <!-- Article Header -->
        <header class="mb-12 text-center">
            <!-- Meta Info: Date, Author, Reading Time -->
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <time datetime="YYYY-MM-DD">[Date]</time>
                <span>•</span>
                <span>[Author]</span>
                <span>•</span>
                <span>[X] min de lecture</span>
            </div>

            <!-- Title -->
            <h1 class="text-[28px] leading-tight font-bold text-gray-900 mb-6 font-display">
                [Article Title]
            </h1>

            <!-- Description -->
            <p class="text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                [Hook/Description]
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 justify-center mb-12">
                <span class="px-4 py-2 bg-blue-50 text-vecia-purple rounded-full text-sm font-semibold">tag-1</span>
                <span class="px-4 py-2 bg-blue-50 text-vecia-purple rounded-full text-sm font-semibold">tag-2</span>
            </div>

            <!-- Featured Image -->
            <div class="mb-12 rounded-2xl overflow-hidden shadow-lg">
                <img src="/assets/images/blog/[slug].png" alt="[Alt text]" class="w-full h-auto">
            </div>
        </header>

        <!-- Article Body with Tailwind Typography -->
        <article class="prose prose-lg max-w-none mx-auto [extensive typography classes]">

            <h2>[Section 1: Problem Statement]</h2>
            <p>[Provocative opening paragraph]</p>

            <h2>[Section 2: Deep Dive]</h2>
            <p>[Analysis with metaphors]</p>

            <h3>[Subsection]</h3>
            <ul>
                <li><strong>Point 1</strong>: Detail</li>
                <li><strong>Point 2</strong>: Detail</li>
            </ul>

            <h2>[Section 3: Solution]</h2>
            <p>[Practical advice with examples]</p>

            <h2>Conclusion</h2>
            <p>[Summary and engaging CTA]</p>

            <hr>

            <h2>Pour aller plus loin</h2>
            <p>[Related content suggestions]</p>

        </article>

        <!-- Navigation Footer -->
        <footer class="border-t border-gray-200 pt-8 mt-16">
            <a href="/blog.html">← Retour au blog</a>
            <a href="/contact.html">Discuter de votre projet</a>
        </footer>
    </main>
</body>
</html>
```

### Typography Classes (Tailwind v4)

The articles use extensive Tailwind Typography plugin customization:

```css
prose prose-lg max-w-none mx-auto
  /* Headings */
  prose-h1:text-[24px] prose-h1:leading-tight prose-h1:font-bold
  prose-h2:text-[22px] prose-h2:leading-tight prose-h2:font-bold prose-h2:tracking-tight
  prose-h3:text-[20px] prose-h3:leading-snug prose-h3:font-semibold
  prose-h4:text-[18px] prose-h4:leading-normal prose-h4:font-semibold

  /* Body */
  prose-p:text-[18px] prose-p:leading-7 prose-p:text-gray-700 prose-p:mb-6 prose-p:text-justify
  prose-li:text-[18px] prose-li:leading-7 prose-li:text-gray-700

  /* Lists */
  prose-ul:my-6 prose-ul:gap-y-2
  prose-ol:my-6 prose-ol:gap-y-2

  /* Links */
  prose-a:text-vecia-blue prose-a:underline prose-a:decoration-vecia-blue/30

  /* Other */
  prose-strong:font-semibold prose-strong:text-gray-900
  prose-blockquote:border-l-4 prose-blockquote:border-vecia-blue
  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1
  prose-img:rounded-xl prose-img:shadow-xl prose-img:my-12
```

### Usage Examples

**Example 1: Transform Research**
```bash
> Use content-writer to create a blog article from research-prompt-engineering-2025.md,
  save it to www.vecia.fr/blog/prompt-engineering-2025.html
```

**Example 2: Match Existing Tone**
```bash
> Use content-writer to write an article about AI automation in e-commerce,
  matching the tone and style of ia-ne-marche-pas.html
```

---

## Complete Workflow: Research → Write → Publish

### Step-by-Step Process

#### Phase 1: Research (30-45 min)
```bash
# Invoke the researcher
> Use ai-researcher to research [TOPIC] with focus on 2025 data and real case studies

# Example topics:
# - AI prompt engineering best practices
# - Enterprise AI automation ROI
# - MCP (Multi-Context Protocol) implementations
# - Deep Search vs traditional search
```

**Output**: `research-[topic]-2025.md` file with:
- Latest statistics (2025 sources)
- Real case studies with metrics
- Practical implementation advice
- Source URLs for verification

#### Phase 2: Writing (45-60 min)
```bash
# Invoke the writer
> Use content-writer to create article from research-[topic]-2025.md,
  save to www.vecia.fr/blog/[slug].html

# Writer will:
# 1. Read research markdown
# 2. Transform into Vecia's aggressive-sarcastic tone
# 3. Add fitness metaphors (avoiding already-used examples)
# 4. Structure with proper HTML and Tailwind classes
# 5. Write complete production-ready file
```

**Output**: `www.vecia.fr/blog/[slug].html` - Complete HTML article

#### Phase 3: Integration (15-20 min)

**3.1 Create Featured Image**
- Size: 1200x800px recommended
- Format: PNG or WebP
- Location: `/assets/images/blog/[slug].png`
- Tools: DALL-E, Midjourney, Canva, or stock photos

**3.2 Add to Blog Index**

Edit `blog.html` around line 675, add to `allPosts` array:

```javascript
allPosts: [
    {
        id: 11,  // Next available ID (current: 8 and 7 are taken)
        title: "Your Article Title",
        slug: "your-article-slug",
        description: "Hook that grabs attention (1-2 sentences)",
        content: "First paragraph or extended description for search",
        author: {
            name: "Équipe Vecia",  // or "Alexandre Fedotov" or "Tanguy Dray"
            avatar: "EV",  // First letters of name
            linkedin: "https://linkedin.com/company/vecia"
        },
        date: "2025-10-09",  // Publication date (YYYY-MM-DD)
        readingTime: 10,  // Minutes
        tags: ["Tag1", "Tag2", "Tag3"],
        category: "IA Agentique",  // or "Technique", "Étude de cas", "Industrie"
        image: "/assets/images/blog/your-slug.png",
        featured: false,  // Set true for hero article
        color: "from-vecia-purple to-vecia-blue",  // Gradient colors
        emoji: "🤖"  // Representative emoji
    },
    // ... existing articles (id: 8, 7)
]
```

**3.3 Test Locally**
```bash
# Start dev server
npm run dev

# Visit blog
open http://localhost:3000/blog.html

# Verify:
# ✓ Article appears in listing
# ✓ Search finds it
# ✓ Tags/category filters work
# ✓ Link opens article page correctly
# ✓ Article renders properly
# ✓ Images load
# ✓ Navigation works
```

#### Phase 4: Quality Check (10-15 min)

**Content Review**:
- [ ] No repeated examples from previous articles
- [ ] Statistics have source citations
- [ ] Tone matches existing articles (aggressive but professional)
- [ ] No vulgar language ("putain", "merde")
- [ ] Fitness metaphors are contextual and varied
- [ ] Article length: 1200-1500 words
- [ ] CTA is personal and engaging

**Technical Review**:
- [ ] All meta tags present (title, description, OG, Twitter)
- [ ] Article metadata correct (date, author, tags)
- [ ] Featured image exists and loads
- [ ] Tailwind classes applied correctly
- [ ] Typography readable on mobile
- [ ] Links work (blog index, contact)
- [ ] No console errors

**SEO Check**:
- [ ] Title < 60 characters
- [ ] Description < 160 characters
- [ ] URL is clean and descriptive
- [ ] Image has proper alt text
- [ ] Internal links to related content
- [ ] External links open in new tab (if needed)

#### Phase 5: Publication
```bash
# Commit changes
git add .
git commit -m "✍️ New blog article: [Title]

- Research: [topic]
- Author: [author name]
- Category: [category]
- Reading time: [X] min"

git push
```

---

## Published Article #1: L'IA ne marche pas

### Article Metadata

**Title**: L'IA ne marche pas, sa faute ou la vôtre ?
**Slug**: `ia-ne-marche-pas`
**ID**: 8
**Date**: 2025-06-19
**Author**: Équipe Vecia
**Reading Time**: 5 minutes
**Category**: IA
**Tags**: IA, Prompt Engineering, Deep Search

### Description
> ChatGPT vous déçoit ? Souvent, le problème n'est pas l'IA mais vos prompts – heureusement, ça se corrige.

### Article Structure

#### Section 1: Râler contre la machine, un classique
**Hook**: Personal story about being disappointed with ChatGPT
- Self-deprecating humor: "tel le cocaïnomane que je suis"
- Bad prompt example: "Crée-moi une appli pour concurrencer Airbnb, en plus joli"
- Analogy: Like asking to get ripped eating McDo without effort

#### Section 2: Du prompt bancal à l'ingénieur BAC+10 en prompting
**Focus**: Evolution from bad to good prompts

**Subsection 2.1**: Les débuts (copier-coller façon brouillard)
- Generic, vague requests
- Poor results

**Subsection 2.2**: La révélation (Prompt Engineering)
**Framework taught**:
- **Rôle**: "Tu es un coach expert en Body Building, vainqueur de l'Olympia"
- **Tâche**: "Construis un programme biceps sur mesure pour moi"
- **Contexte**: "À disposition : barre de traction et ma femme (50–70 kg)"
- **Règles et ton**: "Je suis prêt à investir dans du matériel. Utilise un ton sarcastique"
- **Exemple de style attendu**: Sample output desired
- **Notes**: "J'aimerais qu'on fixe tout ce dont j'ai besoin pour démarrer dès demain"

#### Section 3: Quand un simple prompt ne suffit plus (PRD)
**Focus**: Product Requirements Document

**Subsection 3.1**: Pourquoi vos idées restent à l'état de brouillon
- Vague requests lead to generic wireframes
- Without constraints, projects fail

**Subsection 3.2**: La révélation (Product Requirements Document)
**PRD Structure**:
- **Problème & audience**: Who you serve, what problem you solve
- **Fonctionnalités clés**: Core features
- **Contraintes**: Budget, GDPR, tech stack
- **Critères de succès**: Measurable goals

**Pro tip**: Co-create the PRD with AI

#### Section 4: Branchez l'IA à vos données (MCP & Deep Search)
**Focus**: Advanced AI tools

**Subsection 4.1**: MCP (Multi-Context Protocol)
- Connect AI to your tools (Google Sheets, Notion, PostgreSQL, CRM)
- Automation example: "Récupère les ventes du mois, génère un résumé stratégique"
- Saves 45 minutes every Monday morning

**Subsection 4.2**: Deep Search
- No more Wikipedia-style generic answers
- Cited sources, precision
- Example: "Selon le rapport McKinsey 2025, 72% des entreprises..."

#### Section 5: Ça foire encore ?
**Checklist**:
- ✓ Clear instructions instead of vague adolescent requests?
- ✓ Provided context, constraints, expected format?
- ✓ Tested with MCP or Deep Search?

**Quote**: "Souvent, l'IA n'est pas à la traîne : c'est l'utilisateur qui est branlant."

#### Conclusion
**Key message**: AI evolves fast, what blocked yesterday works today
**CTA**: "Essayez juste de structurer votre prompt sur votre prochaine idée et racontez-moi le résultat dans les commentaires — ou venez râler, j'adore ça."

### Key Tone Elements
- **Self-deprecating**: "tel le cocaïnomane que je suis"
- **Direct confrontation**: "c'est l'utilisateur qui est branlant"
- **Personal engagement**: "venez râler, j'adore ça"
- **Crude but not vulgar**: Uses "branlant" not vulgar alternatives

### Fitness Metaphors Used
- Gym culture (rack collecting dust)
- Nutrition (eating McDo, no effort)
- Training (biceps program)

### Technical Content
- Prompt engineering framework (role, task, context, rules, examples)
- PRD structure (problem, features, constraints, success criteria)
- MCP explanation (connecting AI to tools)
- Deep Search benefits (sources, precision)

---

## Published Article #2: L'IA Agentique en Entreprise

### Article Metadata

**Title**: L'IA Agentique en Entreprise : 5 Stratégies Gagnantes pour 2025
**Slug**: `ia-agentique-entreprise-strategies-2025`
**ID**: 7
**Date**: 2025-10-02
**Author**: Équipe Vecia
**Reading Time**: 12 minutes
**Category**: IA Agentique
**Tags**: IA Agentique, Transformation digitale, Entreprise, ROI

### Description
> 79% des entreprises ont adopté l'IA agentique, mais seulement 17% l'ont intégrée correctement. Voici comment ne pas foirer votre transformation.

### Article Structure

#### Opening Hook
**Key Statistics**:
- 79% adoption rate
- Only 17% successfully integrated into main workflows
- 83% wasted budget

**Analogy**: Like buying expensive gym equipment, letting it collect dust, wondering why no muscle growth

#### Section 1: IA Agentique vs IA Traditionnelle
**Comparison Table**:

| IA Traditionnelle / Chatbots | IA Agentique |
|------------------------------|--------------|
| Requiert un prompt à chaque réponse | Fonctionne de manière autonome après une instruction de haut niveau |
| Suit des workflows prédéfinies | Peut créer et adapter ses propres workflows |
| Répond à des questions simples | Planifie, raisonne et exécute des tâches complexes |
| Limitée à un seul domaine | Coordonne plusieurs systèmes et domaines métier |
| Passive, attend des instructions | Proactive, prend des initiatives |

**Definition**: "Un agent d'IA, c'est un programme logiciel capable d'agir de manière autonome pour comprendre, planifier et exécuter des tâches."

**Analogy**:
- Traditional AI = Intern who waits for orders every 5 minutes
- Agentic AI = Senior colleague who manages independently

#### Stratégie #1: Commencer petit et ciblé

**Statistics** (PwC AI Agent Survey 2025):
- 79% adopted AI agents
- Only 35% implemented at scale
- Only 17% integrated into main workflows

**Problem**: Companies try to transform everything at once (customer service, logistics, finance, HR, marketing, dev)

**Analogy**: Like the gym beginner who loads 100kg on bench press day 1, fails, and quits forever

**Solution**: Start with ONE business domain
- Service client: Automate level 1 responses
- Logistique: Optimize routes (UPS saves $300M/year)
- Finance: Automate bank reconciliation

**Progression**: Prove it works, generate ROI quickly, THEN expand

#### Stratégie #2: Moderniser l'infrastructure de données

**Analogy**: Like muscle building needs clean food (proteins, complex carbs, healthy fats), not junk food at 2am

**AI needs**:
- **Real-time access**: Not yesterday's data
- **Structured + unstructured data**: Databases, documents, emails
- **Scalability**: Infrastructure that can handle growth

**Source**: IBM & Bain & Company (2025): "AI agent systems can only succeed if anchored in reliable, fresh data"

**Quote**: "Pas de données propres = pas de résultats. Point barre."

#### Stratégie #3: Établir une gouvernance robuste

**Shocking Statistic** (Gartner 2025):
> "Plus de 40% des projets d'IA agentique seront annulés d'ici fin 2027, en raison de coûts croissants, de valeur métier floue ou de contrôles de risques inadéquats."

**Analogy**: Like loading 150kg without checking the collars are tight - might work, or weights slip and destroy you

**Governance Requirements**:
- **Cost controls**: Budget, consumption tracking
- **Value measurement**: Clear KPIs, expected ROI
- **Risk management**: GDPR compliance, data security, decision transparency
- **Dedicated team**: Real AI responsible (not consultant repeating slides)

**Statistic**: 53% of tech leaders cite security as main challenge

#### Stratégie #4: Investir dans les talents et la formation

**Case Study**: UPS ORION System
- 100 million miles saved annually
- $300 million cost savings per year
- **Success factor**: Drivers were trained, listened to, integrated in feedback loop
- AI proposes route → driver adjusts based on reality → AI learns and improves

**Critical Statistics**:
- 70% of AI adoption failures come from process/people problems, not technical gaps
- Employees with high AI literacy are less likely to have misconceptions
- 50%+ of AI-driven failures come from unrealistic leadership ROI timelines

**Quote**: "Formez vos équipes, impliquez-les, écoutez leurs retours. Sinon, votre projet IA va finir comme un abonnement de salle jamais utilisé."

#### Stratégie #5: Concevoir pour l'interopérabilité et l'évolutivité

**Requirement**: AI must connect to ALL systems (CRM, ERP, databases, business tools, third-party APIs)

**Analogy**: "C'est comme avoir des muscles énormes mais pas de cardio : impressionnant sur Instagram, mais incapable de monter trois étages sans crever."

**Investment Statistics** (Bain & Company 2025):
- 5-10% of tech spending over 3-5 years on foundational capabilities
- Eventually up to 50% on agents working across enterprise

**Warning**: If your AI can't scale and connect everywhere, you'll rebuild in 2 years. Much more expensive.

#### Exemples concrets

**Case #1**: Banking via WhatsApp (South America)
- South American bank uses AI agents for real-time PIX payments via WhatsApp
- Clients can pay bills, transfer money, check balance directly in WhatsApp
- Response time: instant
- Support cost: divided by 3

**Case #2**: UPS ORION (detailed)
- $300M savings/year
- 100M miles saved
- Secret: AI + human in the loop, not one without the other

#### ROI et économies de coûts

**Statistics**:
- 88% of executives plan to increase AI budgets in next 12 months
- 66% of companies report real productivity gains from agent deployments
- 86% need to upgrade existing tech stack to deploy AI agents effectively
- **By 2028**: At least 15% of daily work decisions will be made autonomously by AI (vs 0% in 2024)

**Moral**: Those who start now get massive head start. Others will struggle to catch up.

#### Les pièges à éviter

**Piège #1**: Technology-only approach
- 86% must upgrade tech stack AND reevaluate structures/processes
- Analogy: "Buying creatine while eating McDo: useless"

**Piège #2**: Lack of leadership alignment
- 50%+ failures from unrealistic ROI timelines
- "We want results in 3 months" - No. Takes time. Stop dreaming.

**Piège #3**: Not addressing AI literacy gaps
- High AI literacy → less misconceptions, more acceptance and trust
- Train your teams or they'll sabotage the project

**Piège #4**: Not engaging impacted users
- 70% of failures from process/people problems, not technical
- Imposing AI without listening to users = guaranteed failure

**Piège #5**: Neglecting governance and responsible AI
- 53% cite security as main challenge
- No governance = project canceled in 2 years

#### Conclusion

**Key Message**: AI agentique isn't a passing trend, it's structural change defining winners/losers for next 10 years

**Timeline**: By 2028, 15% of daily work decisions autonomous

**Binary choice**:
- Start now with right strategies → crush competition
- Or continue pretending, wasting budget on useless POCs → join the 83% who fail

**Comparison**: "Ou vous continuez à faire semblant, à claquer du budget dans des POC inutiles, et à rejoindre le club des 83% qui échouent."

**CTA**: "Vous voulez pas foirer votre transformation IA ? Venez me dire où vous en êtes dans les commentaires, ou contactez-nous pour qu'on vous aide à éviter les pièges — parce que franchement, j'en ai marre de voir des boîtes claquer des millions pour rien."

### Content Modifications Made
To maintain professional tone while keeping aggressive edge:
- Removed "PUTAIN" → "DIX-SEPT POURCENT, fermez là"
- Replaced Tren (steroid) metaphor with "stagiaire vs pro autonome"
- Removed McDo reference → "malbouffe" in body (kept in piège #1 as analogy)

### Key Tone Elements
- **Aggressive stats**: "DIX-SEPT POURCENT" (emphasis caps)
- **Direct challenges**: "Vous faites quoi ?"
- **Personal frustration**: "j'en ai marre de voir des boîtes claquer des millions pour rien"
- **Binary framing**: "C'est maintenant ou jamais", winners vs losers

### Fitness Metaphors Used
- Gym beginner loading 100kg bench press day 1, failing, quitting
- Clean nutrition vs junk food at 2am
- Building muscle through progression (adding weight gradually)
- Huge muscles but no cardio (impressive on Instagram, can't climb stairs)
- Gym membership never used

### Research Sources Cited
- PwC AI Agent Survey 2025
- Gartner Press Release 2025
- IBM & Bain & Company Technology Report 2025
- UPS ORION case study (real-world example)

---

## Content Guidelines & Best Practices

### DO's ✅

**Tone & Voice**:
- ✅ Be aggressive and confrontational
- ✅ Use sarcasm liberally
- ✅ Include self-deprecating humor
- ✅ Make it personal and engaging
- ✅ Use first-person perspective ("moi", "je")
- ✅ Call out bullshit directly
- ✅ Challenge reader's assumptions

**Content Quality**:
- ✅ Cite 2025 sources for all statistics
- ✅ Include real case studies with metrics
- ✅ Provide actionable advice
- ✅ Use analogies that resonate (fitness, everyday life)
- ✅ Structure with clear headings and short sections
- ✅ Include visual elements (tables, lists, blockquotes)
- ✅ End with personal, engaging CTA

**Technical**:
- ✅ Use Tailwind CSS v4 classes correctly
- ✅ Include all meta tags (OG, Twitter, Article)
- ✅ Optimize for mobile readability
- ✅ Ensure images have proper alt text
- ✅ Link to related content
- ✅ Include "Pour aller plus loin" section

### DON'Ts ❌

**Language**:
- ❌ Use vulgar words: "putain", "merde"
- ❌ Say "fermez votre gueule" → Use "fermez là"
- ❌ Say "sans crever" → Use "sans s'essouffler"
- ❌ Be offensive to readers personally
- ❌ Use discriminatory or hateful language

**Content**:
- ❌ Reuse exact same examples from previous articles
- ❌ Write walls of text (keep sections short)
- ❌ Exceed 1500 words
- ❌ Include unverified statistics
- ❌ Make claims without sources
- ❌ Force fitness metaphors where they don't fit

**Technical**:
- ❌ Forget meta descriptions
- ❌ Use inline styles (use Tailwind classes)
- ❌ Hardcode dates or make them inconsistent
- ❌ Leave broken links
- ❌ Forget to test on mobile

### Article Quality Checklist

Before publishing, verify:

**Content** (10 points):
- [ ] 1. Title is provocative and clear
- [ ] 2. Hook grabs attention in first paragraph
- [ ] 3. Problem clearly stated
- [ ] 4. Solution actionable and specific
- [ ] 5. Statistics have sources cited
- [ ] 6. Analogies are fresh (not reused)
- [ ] 7. Tone matches existing articles
- [ ] 8. CTA is personal and engaging
- [ ] 9. "Pour aller plus loin" suggests related content
- [ ] 10. Length is 1200-1500 words

**Technical** (10 points):
- [ ] 1. All meta tags present and correct
- [ ] 2. Open Graph image exists and loads
- [ ] 3. Article metadata accurate (date, author, tags)
- [ ] 4. Tailwind classes applied correctly
- [ ] 5. Typography readable on mobile
- [ ] 6. Images load and have alt text
- [ ] 7. Internal links work
- [ ] 8. No console errors
- [ ] 9. Navigation footer present
- [ ] 10. Responsive on all screen sizes

**SEO** (5 points):
- [ ] 1. Title < 60 characters
- [ ] 2. Description < 160 characters
- [ ] 3. URL slug is clean and descriptive
- [ ] 4. H1-H3 headings properly structured
- [ ] 5. Internal links to related content

**Score Guide**:
- 23-25: Excellent, publish immediately
- 20-22: Good, minor tweaks needed
- 15-19: Needs revision
- <15: Major rewrite required

---

## Examples Already Used (DO NOT REUSE)

**CRITICAL**: These examples have been used in published articles. Find NEW analogies and examples for future content.

### Fitness/Gym Metaphors
- ❌ Gym beginner loading 100kg on bench press, failing, quitting
- ❌ Rack collecting dust in garage
- ❌ Building muscle through progression (light weight → heavy weight)
- ❌ Clean eating (proteins, carbs, healthy fats) vs junk food at 2am
- ❌ Huge muscles but no cardio (impressive on Instagram, can't climb stairs)
- ❌ Gym membership never used
- ❌ Taking creatine while eating McDo
- ❌ Tren/steroids references
- ❌ Biceps program with pullup bar
- ❌ Training with your wife as weight (50-70kg)

### Self-Deprecating Humor
- ❌ "tel le cocaïnomane que je suis" (cocaine addict)
- ❌ "venez râler, j'adore ça" (come complain, I love it)

### Direct Confrontations
- ❌ "c'est l'utilisateur qui est branlant" (user is the problem)
- ❌ "fermez là" (shut up)
- ❌ "j'en ai marre de voir des boîtes claquer des millions pour rien"

### Case Studies
- ✅ UPS ORION ($300M savings) - Can reference but don't make it the ONLY example
- ✅ South American bank WhatsApp PIX payments - Same as above

### Statistics Used
- ✅ 79% adoption, 17% integration (PwC 2025)
- ✅ 40% projects canceled by 2027 (Gartner)
- ✅ 70% failures from people/process not tech
- ✅ 53% cite security as main challenge
- ✅ 15% decisions autonomous by 2028

**Note**: Statistics can be reused IF they're foundational, but try to find NEW 2025 stats to keep content fresh.

### Technology Concepts Explained
- ✅ Prompt Engineering (role, task, context, rules, examples)
- ✅ PRD (Product Requirements Document)
- ✅ MCP (Multi-Context Protocol)
- ✅ Deep Search
- ✅ Agentic AI vs Traditional AI comparison table

**Note**: Can reference these again but with different examples and explanations.

---

## Quick Reference

### File Locations
```
Blog Index:     /blog.html
Articles:       /blog/{slug}.html
Images:         /assets/images/blog/{slug}.png
Agents:         /.claude/agents/
Documentation:  /www.vecia.fr/blog/BLOG_DOCUMENTATION.md
```

### Current Article IDs
- **ID 8**: ia-ne-marche-pas (June 19, 2025)
- **ID 7**: ia-agentique-entreprise-strategies-2025 (Oct 2, 2025)
- **Next ID**: 11 (IDs 1-6, 9-10 reserved for archived placeholders)

### Agent Invocation Examples
```bash
# Research
> Use ai-researcher to research [topic] with 2025 data and case studies

# Write
> Use content-writer to create article from research-[topic].md,
  save to www.vecia.fr/blog/[slug].html
```

### Dev Server
```bash
npm run dev          # Start server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
```

### Testing URLs
```
Blog Index:  http://localhost:3000/blog.html
Article 1:   http://localhost:3000/blog/ia-ne-marche-pas.html
Article 2:   http://localhost:3000/blog/ia-agentique-entreprise-strategies-2025.html
```

---

## Future Article Ideas (Researched but Not Written)

From `PLACEHOLDER_ARTICLES.md`, 7 articles ready for production:

1. **Étude de Cas E-commerce** (id: 2)
   - 47% cost reduction case study
   - Category: Étude de cas

2. **Guide Workflow Automatisation** (id: 3)
   - Step-by-step automation guide
   - Category: Technique

3. **Prédictions IA 2025** (id: 4)
   - Industry trends and predictions
   - Category: IA Agentique

4. **Éthique IA en Entreprise** (id: 5)
   - Trust, transparency, responsible AI
   - Category: Industrie

5. **Scaling IA Production** (id: 6)
   - From prototype to production
   - Category: Technique

6. **PME Success Stories** (id: 9)
   - Small/medium business AI adoption
   - Category: Étude de cas

7. **Agents IA vs Chatbots** (id: 10)
   - Technology comparison
   - Category: IA Agentique

To publish these: Use agents to research and write full content, then follow the workflow above.

---

**Last Updated**: October 9, 2025
**Maintained By**: Vecia Content Team
**Questions?**: Contact alexandre@vecia.fr or tanguy@vecia.fr

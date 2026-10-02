/**
 * Site copy (EN) for the crew site — vecia.fr and the people subdomains.
 * Written natively; the FR file is written natively too, never translated from this one.
 * Shape is the source of truth: src/i18n/fr/site.ts must match it (typed as SiteCopy).
 */

export const site = {
  meta: {
    title: 'Vecia — a small crew that builds AI systems and shows the work',
    description:
      'Field notes on what AI is actually good and bad at, case files of real deployments told from the moment they broke, and a weekly log of the workbench.',
  },

  nav: {
    notes: 'Field notes',
    cases: 'Case files',
    workshop: 'Workbench',
    crew: 'Crew',
    officeHours: 'Office hours',
    switchLang: 'Français',
  },

  home: {
    kicker: 'Vecia · a small crew that builds AI systems',
    title: 'We build AI systems for real businesses. Then we show you how it went, including the parts that broke.',
    aside:
      'I spent two days on this particle animation. It was out of date the week it shipped, because AI moves faster than I do. I like it anyway, so it stays.',
    intro: [
      'This site used to have a savings calculator and a badge promising 40% more productivity. Nobody believed them, including us. They are gone.',
      'What is here instead is the work itself: notes on what AI does well and what it only pretends to do, written as we find out; real deployments, told from the moment something broke; and the log of what is on the bench this week.',
    ],
    notes: {
      title: 'Field notes',
      intro: 'Dated claims about AI, with the evidence. When the models change, the note gets an update instead of quietly disappearing. Disagree in the comments; that is what they are for.',
      empty: 'The first notes are being written. Come back on Monday.',
      all: 'All field notes',
    },
    cases: {
      title: 'Case files',
      intro: 'Real deployments, told from the moment they broke. Clients are described, never named.',
      empty: 'The first case files are in review.',
      all: 'All case files',
    },
    workshop: {
      title: 'On the workbench',
      intro: 'The weekly log. Drafted by the agents that did half the work, approved by the human who did the other half.',
      empty: 'The first weekly log lands on Sunday.',
      all: 'Every week so far',
    },
    crew: {
      title: 'The crew',
      intro:
        'Right now the crew is one person and an unreasonable number of agents. A few friends who build AI for a living may join; each of us gets a page and a subdomain.',
      more: 'More faces soon. Maybe.',
    },
    office: {
      title: 'Office hours',
      body: 'Twenty minutes, free, on whatever AI question is stuck in your head. If the question is good, the answer becomes a field note, anonymised. If it needs more than twenty minutes, we can talk about that too.',
      cta: 'See how it works',
    },
  },

  officeHours: {
    title: 'Office hours',
    description: 'A free 20-minute call on any AI question, then a paid call or a project if it needs one.',
    intro:
      'Austin Kleon runs office hours and publishes the answers. We copied the idea, with credit. Here is how it works, from free to "let\'s build it".',
    steps: [
      {
        name: 'Free call',
        length: '20 minutes · free',
        body: 'Bring one question about AI: a tool, a workflow, or whether the thing a vendor is selling you is real. You leave with an answer, or with an honest "I don\'t know, but here is who would". Three slots a week, because I also need to build things.',
        cta: 'Pick a slot',
        kind: 'free',
      },
      {
        name: 'Consulting call',
        length: '60–90 minutes · paid',
        body: 'When twenty minutes is not enough. We look at your actual setup: your tools, your data, the process that hurts. You leave with a plan you could carry out without us.',
        cta: 'Ask for one',
        kind: 'paid',
      },
      {
        name: 'A project with the crew',
        length: 'scoped together',
        body: 'When the plan needs building. We scope it, show you a working piece before you pay for the rest, and write the case file together at the end. Your name stays out unless you want it in.',
        cta: 'Tell us about it',
        kind: 'project',
      },
    ],
    promise: 'Questions that are useful to others become field notes. Nothing that identifies you, ever.',
    hiring: {
      title: 'Hiring?',
      body: 'I am open to forward-deployed engineer roles at small AI companies: the job where you sit with the customer, find out why the system does not work in their world, and make it work. The CV is one page and it does not oversell. I build by directing AI agents, not by typing Python from memory, and the case files show what that produces.',
      cvCta: 'Read the CV',
      casesCta: 'Read the case files',
    },
  },

  person: {
    nowLabel: 'Now',
    updatedLabel: 'updated',
    buildingLabel: 'What I am building',
    howLabel: 'How I work',
    offKeyboardLabel: 'Off the keyboard',
    notesBy: 'Field notes',
    casesBy: 'Case files',
    contactLabel: 'Talk to me',
    bookCta: 'Book a free 20-minute call',
    cvCta: 'Read the CV',
    vcardCta: 'Save my contact',
    emailCta: 'Email',
    backToCrew: 'The rest of the crew',
  },

  notes: {
    title: 'Field notes',
    description: 'Dated, evidence-backed notes on what AI is good at, what it fakes, and how that is changing.',
    intro: 'Each note makes one claim, dated, with the evidence. When the models change, the note gets an update instead of quietly disappearing.',
    verdict: { good: 'AI is good at this', bad: 'AI is bad at this', changing: 'This is changing' },
    updatedLabel: 'Updated',
    evidenceLabel: 'Evidence',
    archiveBanner: 'From the 2025 archive, written when this site still sold things. Kept because the content still holds; check the date before you trust the details.',
  },

  cases: {
    title: 'Case files',
    description: 'Real AI deployments, told from the moment they broke. Clients described, never named.',
    intro: 'One deployment per file: what the business needed, what broke, how we found it, what changed. The client is described by sector, never named.',
    broke: 'What broke',
    found: 'How we found it',
    changed: 'What changed',
    stack: 'Stack',
  },

  workshop: {
    title: 'Workbench',
    description: 'The weekly log: what got built, what broke, what the agents did.',
    intro: 'Every Sunday the agents read the week and draft this log. I cut the boring parts, fix what they got wrong, and approve it. The fleet numbers are real.',
    built: 'Built',
    broke: 'Broke',
    fleet: 'The fleet this week',
    week: 'Week',
  },

  // Interface labels (aria labels, breadcrumbs, small UI words).
  ui: {
    menu: 'Menu',
    home: 'Home',
    language: 'Language',
    minRead: 'min read',
    archive: 'Archive',
    readTranslation: 'Read this in French',
    by: 'By',
    cookies: 'Cookies',
    aiEthics: 'AI ethics',
    social: 'LinkedIn',
    footerNav: 'Footer',
  },

  cookieBanner: {
    title: 'Cookies, briefly',
    body: 'If you say yes, Google Analytics counts visits so we know which notes people read. No ads, no tracking pixels, nothing sold.',
    details: 'Details',
    reject: 'No thanks',
    accept: 'Fine',
  },

  footer: {
    tagline: 'A small crew that builds AI systems and shows the work.',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    feeds: 'Feeds: RSS · JSON · llms.txt',
  },
};

export type SiteCopy = typeof site;

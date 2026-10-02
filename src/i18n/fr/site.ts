/**
 * Textes du site (FR) — écrits en français, jamais traduits de la version anglaise.
 * La forme doit rester identique à src/i18n/en/site.ts (typée SiteCopy).
 */

import type { SiteCopy } from '../en/site';

export const site: SiteCopy = {
  meta: {
    title: 'Vecia — une petite équipe qui construit des systèmes d\'IA et montre le travail',
    description:
      'Des notes de terrain sur ce que l\'IA sait vraiment faire (et ce qu\'elle fait semblant de savoir faire), des dossiers de vrais déploiements racontés à partir du moment où ça a cassé, et le journal de l\'atelier.',
  },

  nav: {
    notes: 'Notes de terrain',
    cases: 'Dossiers',
    workshop: 'Atelier',
    crew: 'L\'équipe',
    officeHours: 'Permanence',
    switchLang: 'English',
  },

  home: {
    kicker: 'Vecia · une petite équipe qui construit des systèmes d\'IA',
    title: 'On construit des systèmes d\'IA pour de vraies entreprises. Et on vous montre comment ça s\'est passé, y compris ce qui a cassé.',
    aside:
      'J\'ai passé deux jours sur cette animation inutile, et elle est déjà dépassée parce que l\'IA va trop vite. Mais je l\'aime bien, alors vous la gardez.',
    intro: [
      'Avant, il y avait ici un calculateur d\'économies et un badge qui promettait 40 % de productivité en plus. Personne n\'y croyait, nous compris. Ils sont partis.',
      'À la place, le travail lui-même. Des notes sur ce que l\'IA fait bien et ce qu\'elle fait semblant de faire, écrites au fur et à mesure qu\'on le découvre. De vrais déploiements, racontés à partir du moment où ça a cassé. Et le journal de ce qui est sur l\'établi cette semaine.',
    ],
    notes: {
      title: 'Notes de terrain',
      intro: 'Des affirmations datées sur l\'IA, avec les preuves. Quand les modèles changent, la note est mise à jour au lieu de disparaître en douce. Pas d\'accord ? Les commentaires sont faits pour ça.',
      empty: 'Les premières notes sont en cours d\'écriture. Revenez lundi.',
      all: 'Toutes les notes',
    },
    cases: {
      title: 'Dossiers',
      intro: 'De vrais déploiements, racontés à partir du moment où ça a cassé. Les clients sont décrits, jamais nommés.',
      empty: 'Les premiers dossiers sont en relecture.',
      all: 'Tous les dossiers',
    },
    workshop: {
      title: 'Sur l\'établi',
      intro: 'Le journal de la semaine. Rédigé par les agents qui ont fait la moitié du travail, validé par l\'humain qui a fait l\'autre moitié.',
      empty: 'Le premier journal arrive dimanche.',
      all: 'Toutes les semaines',
    },
    crew: {
      title: 'L\'équipe',
      intro:
        'Pour l\'instant, l\'équipe, c\'est une personne et un nombre déraisonnable d\'agents. Quelques amis qui vivent de l\'IA vont peut-être nous rejoindre ; chacun aura sa page et son sous-domaine.',
      more: 'D\'autres têtes bientôt. Peut-être.',
    },
    office: {
      title: 'Permanence',
      body: 'Vingt minutes, gratuites, sur la question d\'IA qui vous trotte dans la tête. Si la question est bonne, la réponse devient une note de terrain, anonymisée. Si ça demande plus de vingt minutes, on en parle aussi.',
      cta: 'Comment ça marche',
    },
  },

  officeHours: {
    title: 'Permanence',
    description: 'Un appel gratuit de 20 minutes sur n\'importe quelle question d\'IA, puis un appel payant ou un projet si besoin.',
    intro:
      'Austin Kleon tient des permanences et publie les réponses. On a piqué l\'idée, en le citant. Voilà comment ça marche, du gratuit au « on le construit ».',
    steps: [
      {
        name: 'Appel gratuit',
        length: '20 minutes · gratuit',
        body: 'Venez avec une question sur l\'IA : un outil, une façon de travailler, ou ce que vous vend un prestataire, est-ce que c\'est du vent ? Vous repartez avec une réponse, ou avec un « je ne sais pas, mais voilà qui sait » honnête. Trois créneaux par semaine, parce qu\'il faut aussi que je construise des trucs.',
        cta: 'Choisir un créneau',
        kind: 'free',
      },
      {
        name: 'Appel conseil',
        length: '60–90 minutes · payant',
        body: 'Quand vingt minutes ne suffisent pas. On regarde votre installation réelle : vos outils, vos données, le processus qui fait mal. Vous repartez avec un plan que vous pourriez mener sans nous.',
        cta: 'En demander un',
        kind: 'paid',
      },
      {
        name: 'Un projet avec l\'équipe',
        length: 'cadré ensemble',
        body: 'Quand le plan doit être construit. On le cadre, on vous montre un morceau qui marche avant que vous payiez le reste, et on écrit le dossier ensemble à la fin. Votre nom reste dehors, sauf si vous le voulez dedans.',
        cta: 'Racontez-nous',
        kind: 'project',
      },
    ],
    promise: 'Les questions utiles aux autres deviennent des notes de terrain. Jamais rien qui permette de vous reconnaître.',
    hiring: {
      title: 'Vous recrutez ?',
      body: 'Je suis ouvert aux postes de forward-deployed engineer dans de petites boîtes d\'IA : le métier où l\'on s\'assoit à côté du client, où l\'on comprend pourquoi le système ne marche pas chez lui, et où on le fait marcher. Le CV tient sur une page et n\'en rajoute pas. Je construis en dirigeant des agents d\'IA, pas en tapant du Python de mémoire. Les dossiers montrent ce que ça donne.',
      cvCta: 'Lire le CV',
      casesCta: 'Lire les dossiers',
    },
  },

  person: {
    nowLabel: 'En ce moment',
    updatedLabel: 'mis à jour le',
    buildingLabel: 'Ce que je construis',
    howLabel: 'Comment je travaille',
    offKeyboardLabel: 'Loin du clavier',
    notesBy: 'Notes de terrain',
    casesBy: 'Dossiers',
    contactLabel: 'Me parler',
    bookCta: 'Réserver 20 minutes gratuites',
    cvCta: 'Lire le CV',
    vcardCta: 'Enregistrer mon contact',
    emailCta: 'E-mail',
    backToCrew: 'Le reste de l\'équipe',
  },

  notes: {
    title: 'Notes de terrain',
    description: 'Des notes datées et sourcées sur ce que l\'IA fait bien, ce qu\'elle fait semblant de faire, et comment ça bouge.',
    intro: 'Chaque note fait une affirmation, datée, avec la preuve. Quand les modèles changent, la note est mise à jour au lieu de disparaître en douce.',
    verdict: { good: 'L\'IA est bonne là-dessus', bad: 'L\'IA est mauvaise là-dessus', changing: 'Ça bouge' },
    updatedLabel: 'Mis à jour',
    evidenceLabel: 'Preuves',
    archiveBanner: 'Archive 2025, écrite quand ce site vendait encore des choses. Gardée parce que le fond tient toujours ; regardez la date avant de croire les détails.',
  },

  cases: {
    title: 'Dossiers',
    description: 'De vrais déploiements d\'IA, racontés à partir du moment où ça a cassé. Clients décrits, jamais nommés.',
    intro: 'Un déploiement par dossier : ce dont l\'entreprise avait besoin, ce qui a cassé, comment on l\'a trouvé, ce qui a changé. Le client est décrit par son secteur, jamais nommé.',
    broke: 'Ce qui a cassé',
    found: 'Comment on l\'a trouvé',
    changed: 'Ce qui a changé',
    stack: 'Outils',
  },

  workshop: {
    title: 'Atelier',
    description: 'Le journal de la semaine : ce qui a été construit, ce qui a cassé, ce qu\'ont fait les agents.',
    intro: 'Chaque dimanche, les agents relisent la semaine et rédigent ce journal. Je coupe le barbant, je corrige ce qu\'ils ont mal compris, et je valide. Les chiffres de la flotte sont vrais.',
    built: 'Construit',
    broke: 'Cassé',
    fleet: 'La flotte cette semaine',
    week: 'Semaine',
  },

  // Interface labels (aria labels, breadcrumbs, small UI words).
  ui: {
    menu: 'Menu',
    home: 'Accueil',
    language: 'Langue',
    minRead: 'min de lecture',
    archive: 'Archive',
    readTranslation: 'Lire en anglais',
    by: 'Par',
    cookies: 'Cookies',
    aiEthics: 'Éthique de l\'IA',
    social: 'LinkedIn',
    footerNav: 'Pied de page',
  },

  cookieBanner: {
    title: 'Les cookies, en bref',
    body: 'Si vous dites oui, Google Analytics compte les visites pour qu\'on sache quelles notes sont lues. Pas de pub, pas de pixel de suivi, rien n\'est vendu.',
    details: 'Détails',
    reject: 'Non merci',
    accept: 'D\'accord',
  },

  footer: {
    tagline: 'Une petite équipe qui construit des systèmes d\'IA et montre le travail.',
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    feeds: 'Flux : RSS · JSON · llms.txt',
  },
};

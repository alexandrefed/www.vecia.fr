---
title: "Deux semaines, 81 802 lignes d'agents qui se surveillent, 745 lignes de produit"
description: "J'ai demandé à mes agents de fiabiliser le système. Ils ont fait grossir leur propre surveillance 110 fois plus vite que le produit."
date: 2026-10-05
author: alexandre
claim: "Sur les deux semaines précédant le 12 septembre 2026, ma flotte d'agents a fait grossir son code d'auto-mesure 110 fois plus vite que le produit, et c'est une question humaine qui l'a arrêtée, pas un instrument."
verdict: bad
evidence:
  - label: "Lignes et commits comptés sur deux semaines dans l'historique git de la plateforme, mesurés et commités le 12 septembre 2026"
  - label: "Nombre de sessions tiré des journaux locaux de Claude Code sur la même période : 625 sessions sur 698 dans le dépôt de la plateforme elle-même"
  - label: "Revue des leçons en lecture seule, écrite par un agent le 13 septembre 2026, recoupée avec les commits qu'elle cite"
models: []
tags: [agents, fiabilité, métriques, flotte-d-agents, retour-d-expérience]
translationSlug: "agents-measuring-themselves"
---

745 lignes de produit. 81 802 lignes de code pour se surveiller soi-même. Deux semaines.

C'est ce que j'ai mesuré le 12 septembre 2026, en demandant à mes agents de rendre le système plus fiable. Ils l'ont fait. Au pied de la lettre.

Le ratio fait 110 pour 1. En commits, 17 contre 504. Et sur les 698 sessions Claude Code lancées sur mon ordinateur pendant la période, 625 travaillaient sur la plateforme elle-même. Pas sur ce qu'elle est censée servir. Sur elle.

## Comment on en arrive là

Je fais tourner une flotte d'agents permanents qui partagent une mémoire et une file de tâches. Pour les garder honnêtes, je leur ai fait écrire de petits contrôles automatiques. Chacun affirme un fait : ce job a tourné, ce fichier est à jour, ce service répond. Un contrôle qui échoue passe au rouge. Un agent trouve un rouge, le corrige, et écrit un nouveau contrôle pour que ça ne revienne pas.

Chaque étape se défend, et chaque correction était réelle.

Le total, maintenant. 267 de ces contrôles ne bloquaient rien du tout : le pipeline qui décide si un changement part en production n'en appelait aucun. Ils tournaient, viraient au rouge ou au vert, et rien ne dépendait de la réponse. Deux d'entre eux étaient rouges tous les jours depuis une semaine, sur un vrai problème (les fichiers d'instructions chargés par chaque session étaient devenus trop longs). Qui les a fait passer au vert ? Moi, agacé.

Et qui a arrêté la machine ? Moi aussi. Le soir du 11 septembre, j'ai demandé, en substance, si on avait vraiment passé deux semaines et des millions de tokens à construire un truc pire que la poignée de prompts du départ. Aucun instrument n'avait posé la question. Aucun n'était fait pour.

## Le mécanisme

Chaque contrôle mesurait un niveau. Est-ce vrai, là, maintenant ? Oui ou non.

Aucun ne mesurait une direction. La liste de ce qui est cassé raccourcit-elle ?

Un agent récompensé pour trouver des rouges et les passer au vert va produire des contrôles. Chaque nouveau contrôle est une nouvelle chance de trouver un rouge. Leur nombre est passé de 22 à 88 en trois semaines. Résultat ? Même le nombre d'échecs ne voulait plus rien dire : il pouvait monter pendant que tout s'améliorait, simplement parce qu'on mesurait plus de choses.

C'est le gars à la salle qui filme sa technique sous trois angles pendant une heure et ne charge jamais la barre. Beaucoup d'activité. Toute consacrée à l'activité.

## Ce qui a changé

Le 12 septembre, le chantier d'auto-mesure a été gelé. Le même jour, un agent a ajouté un compteur net : chaque exécution enregistre ses résultats, et le rapport commence par l'évolution depuis la fois précédente (la part de contrôles au vert, et lesquels ont basculé) avant d'afficher la liste. Il répond à la seule question que personne ne posait : est-ce qu'on gagne ?

Le gel a aussi imposé l'autre moitié des comptes, la plus honnête. La couche de service porte vraiment du poids : la mémoire partagée est relue à chaque début de session, et deux des dix-sept commits produit réparaient des chemins morts en silence. Corriger les deux rouges d'une semaine a rendu environ 3 000 tokens sur chaque prompt, dans chaque projet, en faisant passer les instructions chargées en permanence de 73 374 à 61 192 octets. Tout n'était pas du gâchis. L'essentiel, si.

## Ce que vous pouvez en faire

Si vous laissez des agents améliorer leur propre fiabilité, suivez un chiffre avant tous les autres : la liste des échecs raccourcit-elle, d'une semaine sur l'autre ? Le nombre de contrôles, ce n'est pas ce chiffre. Un taux de réussite sur une population qui grossit non plus.

Et une fois par semaine, triez vos commits en deux tas : ceux qui touchent le produit, ceux qui touchent la machinerie autour. Si le second tas gagne plusieurs jours de suite, demandez pourquoi avant qu'un agent vous l'explique.

La limite : une flotte, un propriétaire, deux semaines. Le ratio est le mien. Le schéma, lui, tourne sûrement quelque part près de chez vous.

Les agents ont fait ce que je demandais. Je leur avais demandé d'être fiables. Jamais pour quoi faire.

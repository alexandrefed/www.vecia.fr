---
title: "Une nuit d'agents assistants, une semaine de budget IA envolée"
description: "Des agents lancés sans nom de modèle ont hérité en silence du modèle le plus cher. Le quota de la semaine a fondu dès le deuxième jour."
date: 2026-10-05
author: alexandre
claim: "Dans la nuit du 14 au 15 septembre 2026, des agents assistants lancés sans nom de modèle ont hérité du modèle haut de gamme de leur parent et brûlé l'essentiel d'un quota hebdomadaire en cinq heures environ."
verdict: bad
evidence:
  - label: "Enquête en lecture seule du 15 septembre 2026, tokens recomptés dans chaque transcript de session local entre la remise à zéro hebdomadaire et 8 h le lendemain"
  - label: "Trace du même incident sur la file d'agents autonomes, du 28 au 31 août 2026 : nombre de sessions, total de tokens, et travail non commité perdu au moment du blocage"
  - label: "Le correctif en l'état : le réglage de modèle par défaut et le hook de pré-lancement, datés du 15 septembre 2026"
models: ["Claude Fable 5.1", "Claude Opus 5", "Claude Sonnet 5"]
tags: [agents, sous-agents, coûts, claude-code, réglages-par-défaut]
translationSlug: "one-night-one-weekly-budget"
---

Lundi 14 septembre 2026, 22 h : mon quota hebdomadaire repart à zéro. Mardi matin, le quota du modèle haut de gamme est à 100 %, et la limite globale de la semaine à 70 % environ. Deuxième jour sur sept.

Qui avait décidé de tout dépenser ? Personne. C'est bien le problème.

## Ce qui s'est passé

Recompté après coup dans chaque transcript de session de mon ordinateur : 3,34 millions de tokens de sortie sur le modèle haut de gamme entre la remise à zéro et 8 h, presque tous entre 22 h et 3 h du matin.

87 % de ce total (2,90 millions) vient d'un seul projet perso. Plus tôt dans la soirée, j'avais mis sa session principale sur le modèle haut de gamme pour un diagnostic. Usage tout à fait légitime. Sauf que la session est ensuite passée à la construction, et a lancé deux douzaines d'agents assistants pour faire le travail. Aucun de ces lancements ne précisait de modèle. Résultat ? 3 318 tours d'assistants, 2,43 millions de tokens sur le modèle le plus cher du catalogue, surtout pour écrire et vérifier des fichiers qu'un modèle moins cher gère très bien.

## Pourquoi

Dans Claude Code, un agent assistant lancé sans modèle hérite de celui de son parent. Le réglage se défend : personne n'a envie qu'on dégrade la qualité dans son dos. Mais du coup, le prix de chaque assistant dépend de ce sur quoi tourne le parent à ce moment-là. Mettez le parent sur le haut de gamme pour une bonne raison, et chaque assistant qu'il lance ensuite y passe aussi. Sans raison.

Le projet avait même une règle écrite : les agents qui rédigent tournent « sur le modèle de la session ». Règle appliquée à la lettre. Personne n'avait prévu le cas où le modèle de la session est le plus cher.

## Le détail qui pique

Ça s'était déjà produit. Du 28 au 31 août, sur la file qui fait tourner mes agents autonomes sur une autre machine : 135 sessions, 1,4 milliard de tokens, 100 % sur Opus, parce que le lanceur ne passait aucun modèle et que chaque agent prenait le défaut. Le mur hebdomadaire est tombé à 0 h 31, et six tâches sont mortes en pleine modification, avec 3 314 lignes de travail non commitées.

On avait corrigé. Pour ce lanceur-là. Les sessions interactives de mon ordinateur, qui lancent leurs assistants par un autre chemin, sont restées telles quelles. Même trou, une porte plus loin, deux semaines plus tard.

## Ce qui a changé

Deux choses, le jour même. D'abord, un modèle par défaut pour les assistants qui n'en nomment pas. Claude Code le lit dans une variable d'environnement (`CLAUDE_CODE_SUBAGENT_MODEL`), et chez nous c'est désormais Sonnet. On l'avait d'abord réglée sur Opus, avant de corriger quelques heures plus tard : Opus aussi était à court cette semaine-là.

Ensuite, un hook qui s'exécute avant chaque lancement d'agent et refuse net le cas de l'héritage : pas de modèle nommé, parent sur le haut de gamme, lancement refusé. Le modèle haut de gamme reste possible pour un assistant, avec une raison écrite, un seul à la fois, et chaque lancement de ce type est journalisé pour être revu.

Le dernier huitième de la nuit venait d'agents qu'on avait volontairement mis sur le haut de gamme, plusieurs en parallèle. Une autre erreur, de largeur cette fois, pas d'héritage. Le hook la plafonne aussi.

## Ce que vous pouvez faire aujourd'hui

Cherchez dans votre configuration chaque endroit qui lance un agent assistant, et regardez lesquels nomment un modèle. Ceux qui n'en nomment pas vont hériter. Autant savoir de quoi.

Ensuite, réglez la variable par défaut. Une ligne dans vos paramètres, et « ce que faisait le parent » devient un choix fait une fois, exprès.

Et quand vous colmatez une fuite de coûts, listez tous les chemins qui lancent des agents avant de crier victoire. On en a bouché un, l'autre est resté grand ouvert.

La limite, honnêtement : le hook bloque l'héritage, et le journal existe. Je n'ai pas encore de revue qui chiffre l'économie. C'est la prochaine mesure, et je préfère le dire que l'inventer.

Un réglage par défaut, c'est une décision. La nôtre, personne ne l'avait prise.

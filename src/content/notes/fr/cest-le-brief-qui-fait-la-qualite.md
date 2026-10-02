---
title: "Même tâche, onze essais : le modèle change la facture, le brief fait la qualité"
description: "Un brief précis, correct sur tous les modèles qui l'ont terminé, pour un coût qui varie de 1 à 4,4. Et notre résultat phare, retiré le lendemain."
date: 2026-10-05
author: alexandre
claim: "Le 1er septembre 2026, une tâche spécifiée au millimètre est sortie correcte sur tous les modèles Claude qui l'ont finie, le choix du modèle faisant varier le coût de 4,4 fois ; notre résultat le plus citable a été retiré le lendemain."
verdict: changing
evidence:
  - label: "Protocole du comparatif, commité avant le premier essai et jamais modifié : 11 essais, un brief par tâche, identique au titre près"
  - label: "Fichier de résultats, 1er et 2 septembre 2026 : coût de chaque essai lu dans les chiffres de facturation remontés par les essais, jamais estimé ; chaque page terminée auditée point par point ; prédictions écrites avant les essais"
  - label: "Le retrait, daté du 2 septembre 2026, conservé dans le même fichier juste à côté de l'affirmation qu'il annule"
  - label: "Revue en lecture seule du 15 septembre 2026, qui a cherché tout autre test de qualité sur le petit modèle et n'en a trouvé aucun"
models: ["Claude Fable 5.1", "Claude Opus 5", "Claude Sonnet 5", "Claude Haiku 4.5"]
tags: [agents, choix-de-modèle, coûts, évaluation, rétractation]
translationSlug: "the-brief-sets-the-quality"
---

Quel modèle faut-il pour un travail bien fait ? Sur ce test-là, n'importe lequel. Tous ceux qui ont fini ont rendu une page correcte. Seule la facture changeait.

Le 1er septembre 2026, j'ai fait tourner un comparatif par mes agents. Une tâche, écrite aussi précisément que possible : transformer un fichier de données en une page web de 325 éléments, titres et couleurs imposés. Le même brief part chez Claude Haiku, chez Sonnet à quatre niveaux d'effort, chez Opus et chez Fable, le modèle haut de gamme de Claude. Un second brief, plus libre, sur quatre essais de plus. Avant le premier essai, j'écris cinq prédictions et je les commite, pour ne pas pouvoir les retoucher en douce.

## Ce qui est revenu

Six pages produites sur la tâche précise. Auditées point par point (chaque titre, les 325 éléments, chaque lien, chaque couleur) : six sur six correctes.

La page correcte la moins chère : 0,94 $, sur Sonnet. Opus : 5,39 $ pour la même page. L'effort fait varier le coût de 2,3 fois entre les réglages de Sonnet. Le choix du modèle, de 4,4 fois, entre Sonnet en effort bas (1,22 $) et Opus.

Fable coûte environ deux fois plus cher qu'Opus au token, et pourtant il revient moins cher à la tâche, sur les deux briefs (4,62 $ contre 5,39 $, puis 13,74 $ contre 17,55 $), parce qu'il lui faut moins de tours : 46 contre 62, puis 81 contre 140. Une règle de routage écrite à partir des prix publics se serait plantée en beauté.

Trois de mes cinq prédictions étaient fausses. C'est pour ça qu'on les écrit avant.

## Le résultat qu'on a retiré

Le soir même, on tenait un titre parfait : le petit modèle, Haiku, n'a rien produit, six fois sur six. Chaque essai tournait entre 21 et 89 secondes, annonçait un truc du genre « je vais maintenant créer le script et la page »… et s'arrêtait net.

Puis on a regardé pourquoi. Dans deux cas sur six, l'agent avait demandé la permission d'écrire un fichier, et personne n'était là pour répondre. Dans les quatre autres, il avait terminé son tour et attendait un utilisateur qui n'existait pas. En cause, un mode de permissions par défaut qui piège les agents sans surveillance. Sonnet s'est d'ailleurs pris le même mur deux fois sur le second brief.

Le 2 septembre, le résultat Haiku a donc été retiré. Ni confirmé ni réfuté, et interdit de citation. Le retrait est écrit dans le même fichier, juste sous l'affirmation, pour qu'on ne puisse pas lire l'une sans l'autre.

Deux semaines plus tard, je me surprends à raconter qu'avec des consignes claires, Haiku et Sonnet égalent le haut de gamme. Pour Sonnet, c'est mesuré. Pour Haiku ? Jamais testé. Un agent de revue a tout fouillé : aucun test de qualité sur le petit modèle, nulle part. Ma mémoire avait promu en douce un résultat retiré au rang de découverte. Un retrait ne sert à rien s'il ne voyage pas avec l'affirmation.

## Pourquoi tout le monde a réussi

Le brief dictait le texte des titres et cinq codes couleur, et ne prononçait jamais le mot « qualité ». Il mesurait de la recopie. Et tous les modèles savent recopier.

Second round, brief de design ouvert, trois modèles : l'écart s'ouvre immédiatement. 122, 260 et 345 règles de style. 10, 11 et 37 recherches web. Est-ce du meilleur design ? Ça, c'est un jugement, et il me revient toujours.

## Comment on choisit le modèle maintenant

Deux questions. Le jugement est-il encore ouvert : qu'est-ce qui compte, à quoi ressemble le bon résultat ? Alors c'est le modèle fort, et son travail est d'écrire le brief, pas de construire. Existe-t-il un brief précis, autonome, avec des critères de réussite ? Alors un modèle moins cher l'exécute, et le modèle fort relit une fois, au regard de l'objectif. Le plus petit n'a droit qu'à des tâches étroites, vérifiées par quelqu'un.

Pour essayer chez vous : écrivez votre prochain brief comme si le modèle le moins cher allait le lire, et comparez le coût par tâche terminée, pas par token. Et si vous publiez une comparaison, prédictions avant, corrections à côté de l'affirmation.

La limite : un type de tâche, un essai par case, dans les cordes de tous les modèles. C'est une règle pour router du travail bien spécifié. Elle classe les briefs. Pas les modèles.

Le plus cher, ça n'a jamais été le modèle. C'est de savoir quoi lui demander.

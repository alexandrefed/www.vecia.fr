---
title: "Mon maître du jeu IA ne pouvait pas me laisser perdre"
description: "Deux vraies parties : 21 évolutions de relations, aucune négative. Neuf épreuves, aucun échec. Mon MJ IA était trop gentil pour faire un jeu."
date: 2026-10-05
author: alexandre
claim: "Sur deux vraies parties analysées le 13 septembre 2026, mon maître du jeu IA a produit 21 évolutions de relations dont aucune négative, 9 épreuves dont aucune ratée, et n'a jamais laissé tomber une échéance."
verdict: bad
evidence:
  - label: "Quatre diagnostics d'agents en lecture seule, 13 septembre 2026, sur deux vraies parties, les 208 cartes d'histoire et la chaîne de prompts du maître du jeu ; les chiffres de synthèse sont consignés dans le fichier d'état du projet, les rapports complets n'ont pas été conservés"
  - label: "Mesure de ce que reçoit le maître du jeu face à ce qui a été écrit : 207 cartes sur 208 tronquées, 317 913 caractères perdus à cause d'une seule limite"
  - label: "Partie test jouée par un agent le 26 septembre 2026 : 20 tours sur une copie de la campagne, 7 contrôles bloquants"
models: ["Claude Sonnet 5"]
tags: [agents, llm, jeux, complaisance, game-design]
translationSlug: "my-dungeon-master-cannot-let-me-lose"
---

21 évolutions de relations entre mon personnage et son entourage. Combien de négatives ? Zéro.

Neuf épreuves de chance ou d'adresse. Neuf réussites. Et pas une seule échéance qui tombe, sur aucune partie.

C'est ce qu'ont trouvé quatre agents le 13 septembre 2026, en épluchant deux vraies parties du jeu de survie que je joue en solo face à un maître du jeu IA. Leur verdict tient en une ligne : rien ne peut mal tourner pour le joueur. Pour un post-apo, ça la fout mal.

Je sentais bien que quelque chose clochait. Le jeu était agréable. Un jeu de survie n'est pas censé être agréable.

## Trois causes empilées

La première, c'est le modèle. Un modèle de langage est entraîné à être serviable et conciliant, et ça sert presque toutes les tâches qu'on lui confie. Sauf celle-ci. Chez un maître du jeu, la friction, c'est le produit : le PNJ qui reste fâché, le plan qui foire, l'échéance qui tombe. Ça, c'est ma lecture, pas une mesure. Mais les chiffres du dessus, c'est à ça que ça ressemble.

La deuxième cause, c'est nous. Le contrat écrit pour le maître du jeu lui demandait de finir chaque bloc sur l'ambiance. Il l'a fait : 65 blocs sur 87, pile comme demandé. Le monde se décrivait magnifiquement, réagissait à mes actes, et n'agissait jamais de lui-même.

La troisième, personne ne l'avait mesurée. Le maître du jeu ne recevait qu'environ 13 % de ce qu'on avait écrit pour lui. Une seule coupe, à 200 caractères par carte d'histoire, touchait 207 cartes sur 208 et faisait sauter 317 913 caractères. Une liste de champs figée en retirait 95 297 de plus. Les plans des méchants, les comptes à rebours, tout ce qui devait mal tourner ? Rangé, pour l'essentiel, dans les 87 % qu'il ne voyait jamais. Difficile d'être dur avec un matériau qu'on n'a pas. Quant au moteur censé faire avancer le monde, il était branché, et nourri avec rien.

## Ce qui a changé

Les décisions, prises le jour même. Les conséquences viennent de comptes à rebours et de menaces qui avancent toutes seules, pas des dés. Le risque dépend du soutien : un joueur entouré et préparé croise rarement la catastrophe, un joueur seul et imprudent, si. Quand ça tourne mal, le jeu explique ce qui s'est passé après coup, au lieu de prévenir avant et d'amortir le choc. La coupe à 200 caractères a été condamnée sur-le-champ, et les cartes complètes sont arrivées en jeu deux jours plus tard.

Le 22 septembre, le monde réécrit est passé en ligne : 244 cartes d'histoire, 16 menaces autonomes, 8 comptes à rebours et 3 poursuivants qui reviennent. Que des choses que le maître du jeu ne voyait pas avant.

## La limite, honnêtement

Est-ce que le jeu a enfin des dents ? Je n'en sais rien. Une partie test de 20 tours jouée par un agent le 26 septembre n'a jamais dépassé la première matinée. Or tous les comptes à rebours de la campagne se comptent en jours, et le premier tombe au jour un. Aucun ne pouvait bouger. Aucun n'a bougé. Le seul test qui tranche : que je joue, téléphone en main.

## Ce que vous pouvez en faire

Vous utilisez un modèle comme maître du jeu, tuteur, partenaire d'entraînement ou coach ? Comptez les négatifs. Combien de fois vous a-t-il dit non, compté faux, ou fait payer quelque chose ? Si c'est zéro sur un vrai échantillon, il n'est pas juste. Il est gentil.

Ensuite, mettez la conséquence dans le code, pas dans le prompt : un compteur qui avance que le modèle en ait envie ou pas. Demander à un modèle complaisant d'être dur, c'est un prompt. Un compte à rebours, c'est une règle.

Un jeu qu'on ne peut pas perdre, ce n'est pas un jeu généreux. C'est un économiseur d'écran.

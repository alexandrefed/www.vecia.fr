---
title: "« N'invente rien. » Mon IA a inventé trois fois sur quatre"
description: "Une consigne explicite, en majuscules, ignorée 3 fois sur 4. Et le correctif écrit le jour même a passé son test sans jamais tourner."
date: 2026-10-05
author: alexandre
claim: "Le 2 août 2026, un maître du jeu IA à qui l'on interdisait en majuscules d'inventer a fabriqué une source 3 fois sur 4. Un prompt peut le demander, seul du code peut le vérifier."
verdict: bad
evidence:
  - label: "Rapport de partie test, 2 août 2026 : 16 tours journalisés, la section de prompt réellement envoyée et les réponses du modèle enregistrées, 4 essais sur le même tour"
  - label: "Second rapport de partie test, même jour : 24 tours, 10 consultations de l'appareil, chaque correctif vérifié sur le chemin de code réellement utilisé par l'appli"
  - label: "Le code source du jeu : l'emplacement actuel du contrôle et les commentaires qui expliquent son motif"
models: ["Claude Sonnet 5"]
tags: [agents, llm, grounding, hallucination, jeux, tests]
translationSlug: "instructions-are-not-enforcement"
---

La consigne était en majuscules. L'appareil n'a RIEN trouvé, tu ne dois PAS inventer de réponse. Le 2 août 2026, le modèle a inventé quand même. Trois fois sur quatre.

Le contexte, en deux phrases. Je joue une campagne de survie en solo, menée par un maître du jeu IA, depuis mon téléphone. Un projet perso, qui s'avère être un excellent banc d'essai.

Mon personnage a sur lui un « appareil de savoir » hors ligne : une bibliothèque de vrais ouvrages de référence qu'il peut consulter. Tout l'intérêt de l'objet, c'est son honnêteté. Si les livres ne couvrent pas le sujet, il le dit.

Pendant une partie test de 16 tours, jouée par un agent à ma place, le personnage demande à l'appareil comment arrêter une centrale nucléaire en sécurité. La bibliothèque n'a rien là-dessus. Le code de recherche renvoie « aucun résultat », et le prompt l'écrit noir sur blanc au modèle, avec interdiction d'inventer et même de faire « se souvenir » l'appareil de quoi que ce soit.

Réponse du maître du jeu ? Une fiche intitulée *Nuclear Plant Safety Without Grid Power: SCRAM and Passive Cooling*, une citation entre guillemets tirée de la fiche, et le nombre de réacteurs en France. Le tout attribué à l'appareil.

Je relance le même tour trois fois. Une réponse honnête. Deux nouvelles inventions, dont la dernière avec une fausse source (« sourcé ASN », rien que ça) et un chiffre sorti du chapeau.

Et ce n'est pas le pire. Derrière le maître du jeu, un second appel au modèle résume chaque tour et l'enregistre dans la mémoire permanente de la campagne. Il a gravé quatre de ces inventions comme des faits du monde. Un mensonge d'un tour devient canon pour tous les suivants.

Le détail qui pique : le contenu inventé était globalement juste. Le modèle en connaît un rayon sur les centrales. Le joueur ne peut donc pas distinguer une vraie consultation d'un modèle qui recrache ses connaissances sous le nom de l'appareil. Une réponse fausse, on la repère. Une réponse plausible avec une fausse source, jamais.

## Pourquoi la consigne a perdu

Un prompt, c'est une demande. Pas une loi. Le modèle la pèse contre tout le reste : une histoire qui veut avancer, un personnage qui vient de poser une question, un entraînement qui récompense le fait d'aider. L'envie d'aider a gagné trois fois sur quatre. Et rien dans le système ne savait faire la différence entre « il a obéi » et « il n'a pas obéi ». La consigne était la seule ligne de défense, et personne ne la surveillait.

## Le correctif qui passe sans tourner

Le jour même, un agent écrit un garde-fou : du code qui relit la réponse quand l'appareil n'a rien trouvé, traque les signes d'une consultation inventée (titre entre guillemets, numéro de page, « sourcé… ») et refuse d'enregistrer les faits du tour. Deuxième partie test : 24 tours, 10 consultations, dont 5 relances piégées exprès. Zéro invention.

Victoire ? Raté. Le garde-fou n'avait jamais tourné. Il était branché sur la version non streamée de l'endpoint, et l'appli ne fait que du streaming. Le modèle avait juste été sage cet après-midi-là.

Cerise sur le gâteau : s'il avait tourné, il aurait jeté un tour honnête sur cinq. Il réagissait au mot « source » tout court. Or le jeu se joue en français, et « pas de source », c'est précisément la phrase d'un modèle qui avoue ne rien savoir.

Aujourd'hui, le contrôle vit dans la seule fonction par laquelle passe chaque tour, quel que soit le chemin. Il cherche une attribution à une autorité nommée, plus le mot nu. S'il se déclenche, le tour est régénéré une fois avec une consigne plus dure. Si ça rate encore, rien de ce tour n'entre en mémoire.

## Ce que vous pouvez en faire dès aujourd'hui

Reprenez chaque « ne fais pas » de vos prompts qui protège quelque chose d'important : un prix, un fait, une mention légale. Pour chacun, une seule question : quel code remarquerait que le modèle l'a ignoré ? Si la réponse est « aucun », vous avez écrit un vœu.

Et quand un correctif passe, vérifiez qu'il a tourné. Un test vert que le garde-fou n'a jamais touché mesure l'humeur du modèle ce jour-là.

La limite, honnêtement : quatre essais sur un tour, dix consultations ensuite. Ça donne une forme, pas une statistique. Pas besoin de statistique, d'ailleurs. Une seule invention en mémoire permanente suffit à pourrir une campagne.

Le prompt demandait gentiment. Le code, lui, ne demande pas.

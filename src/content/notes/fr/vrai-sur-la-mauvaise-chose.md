---
title: "Quatre pannes, tous les voyants au vert, tous les contrôles vrais"
description: "En une journée, quatre systèmes sans rapport étaient cassés alors que tous leurs contrôles passaient. Aucun ne mentait. Ils vérifiaient juste la mauvaise chose."
date: 2026-10-05
author: alexandre
claim: "Le 26 août 2026, quatre systèmes sans lien entre eux étaient en panne alors que tous leurs contrôles passaient, parce que chaque contrôle vérifiait un voisin du résultat au lieu du résultat lui-même."
verdict: bad
evidence:
  - label: "Commit d'infrastructure du 26 août 2026 qui nomme le schéma de panne, liste les quatre pannes et une cinquième de même forme, chiffres à l'appui"
  - label: "La page de convention écrite le même jour : pour chaque cas, le contrôle qui tenait, ce qui se passait vraiment, et l'assertion qui le remplace"
models: []
tags: [agents, supervision, fiabilité, exploitation, tests]
translationSlug: "true-about-the-wrong-thing"
---

Aucun contrôle ne mentait. C'est ça qui rend le 26 août 2026 si désagréable.

Ce jour-là, trois sessions d'agents qui travaillaient sur des sujets sans rapport sont tombées sur quatre systèmes en panne. Chacun avait son contrôle. Chaque contrôle était au vert. Et chaque contrôle disait la vérité.

Le pont de messagerie qui me permet de parler à mes agents depuis mon téléphone était « actif » : processus lancé depuis 16 heures. Messages livrés pendant ces 16 heures ? Zéro. Je parlais dans le vide.

La sauvegarde nocturne de mon serveur git auto-hébergé produisait chaque nuit une archive de 1,2 Go, vérifiée. Sauf qu'une bizarrerie du script le tuait juste après l'écriture de l'archive et juste avant la suppression des anciennes. Pendant 36 nuits d'affilée. Bilan : 45 archives, 51 Go, pour une politique de conservation de sept jours.

Les workflows de reporting d'un client avaient une documentation qui annonçait « prêt pour la production, livraison confirmée ». Leur historique d'exécution, lui, affichait 275 erreurs et zéro succès. Depuis octobre 2025. Jamais. Chaque étape avait été testée isolément. Le workflow assemblé n'était jamais allé au bout une seule fois.

Et une tâche de synchronisation entre deux de mes outils avait son minuteur activé, son service actif et une exécution récente au compteur. Chacune de ces exécutions restait bloquée jusqu'à son délai maximal de 300 secondes.

Une cinquième, le même jour, même forme, à l'envers : un service avait planté et redémarré 23 680 fois parce que son port était occupé. Occupé par qui ? Par un doublon de lui-même, qui servait parfaitement bien. Les utilisateurs ne voyaient rien. La boucle, elle, tournait depuis Dieu sait quand.

## Pourquoi le contrôle facile gagne toujours

Parce qu'il est simple à écrire et presque juste. Un processus qui tourne, c'est presque une livraison. Une archive sur le disque, c'est presque une sauvegarde. Un minuteur activé, c'est presque un job qui s'exécute. Un workflow qui démarre, c'est presque un workflow qui réussit.

Un jour normal, chaque paire est identique. L'écart ne s'ouvre que pendant l'incident, c'est-à-dire pile au moment où l'on compte sur le contrôle. Le voyant est donc vert exactement quand il devrait être rouge. Et un tableau tout vert ne se contente pas d'être inutile : il arrête les recherches.

## La règle qu'on a adoptée

Vérifier le résultat, pas le processus. Nommer ce que le système existe pour produire, et contrôler ça.

| Au lieu de vérifier | Vérifier |
|---|---|
| le service tourne | il tient une connexion vivante vers ce qu'il sert |
| l'archive de sauvegarde existe | elle se liste proprement, et le ménage a vraiment eu lieu |
| le minuteur est activé | le journal montre une exécution terminée, récente |
| le workflow est actif | il a un succès, pas juste une exécution |

Deux corollaires sont sortis de la même journée. Un taux cache les ruptures : « 3 échecs sur 144 exécutions », ça sonne acceptable, mais la vraie séquence était un succès en 4 secondes suivi de deux morts à 300 secondes. Une falaise, lissée en pente douce. Et l'absence de preuve n'est pas une preuve : un journal qui n'affiche pas un identifiant, c'est souvent un service qui le masque correctement, pas la preuve qu'il manquait.

## Ce que vous pouvez en faire

Prenez les trois contrôles auxquels vous faites le plus confiance. Pour chacun, écrivez en une phrase ce que le système existe pour produire, puis regardez ce que le contrôle lit vraiment. Si les deux phrases parlent de choses différentes, vous venez de trouver votre prochaine panne. En avance, pour une fois.

Ensuite, faites échouer chaque contrôle exprès, une fois. Un contrôle qu'on n'a jamais vu passer au rouge, c'est une hypothèse. Pas une garantie.

La limite : quatre cas en une journée, c'est un schéma, pas un recensement. Je ne peux pas vous dire combien de mes autres voyants verts ont le même défaut. Et c'est bien là le sujet. Trois des quatre ont été trouvés parce que quelqu'un cherchait autre chose. Aucun par la supervision.

La supervision était verte du début à la fin. À juste titre, selon sa propre définition.

---
titre: ClientLeak | Diagnostic Digital PME — Cahier des Charges
type: projet
contexte: b2b
secteur: tech
statut: devis
valeur_xaf: confidentiel
tags: [lead-magnet, diagnostic, whatsapp, pme, scoring, nextjs, tailwind]
date_creation: 2026-06-07
date_maj: 2026-06-07
sources:
  [
    01_B2B/raw/CDC_Diagnostic_Digital_PME.docx,
    01_B2B/raw/resume_session_strategie_b2b.md,
  ]
---

# Diagnostic Digital PME — Application Web Lead Magnet

Lié à : [[b2b-strategie-positionnement]]

## Concept

Application web de diagnostic automatisé pour PME africaines à process manuels.
**Ce n'est pas un site vitrine. C'est un outil de vente qui fonctionne 24h/24.**

Remplace le premier rendez-vous de découverte. Livre un prospect qui a lui-même chiffré sa douleur avant le premier message WhatsApp.

## Parcours utilisateur

1. Arrivée page d'accueil → "Démarrer mon diagnostic"
2. Sélection secteur (cartes cliquables avec icône)
3. Si cible principale → 4 modules (12–14 questions)
4. Si autre activité → message personnalisé + CTA WhatsApp direct (pas de rejet)
5. Rapport : score + 3 douleurs + pertes FCFA + CTA WhatsApp unique

**Règle absolue :** le rapport montre le problème chiffré, **jamais la solution**. Aucune mention de chatbot, app, automatisation ou technologie.

## Sélection du secteur (question entrée)

| Icône | Libellé                    | Chemin                 |
| ----- | -------------------------- | ---------------------- |
| 🛍️    | Boutique & commerce        | Diagnostic A           |
| 🍽️    | Restaurant & traiteur      | Diagnostic B           |
| 🏥    | Clinique & cabinet médical | Diagnostic C           |
| ✳️    | Autre activité             | Message + CTA WhatsApp |

## Module 0 — Qualification (non scoré, commun à toutes cibles)

| Question                         | Options                   | Valeur calibration        |
| -------------------------------- | ------------------------- | ------------------------- |
| Commandes/clients par jour       | < 5 / 5–20 / > 20         | Volume bas/moyen/élevé    |
| Montant moyen vente/consultation | < 5k / 5–25k / > 25k FCFA | Panier bas/moyen/élevé    |
| Employés gèrent les clients      | Moi seul / 2–3 / > 3      | Solo/petite équipe/équipe |

## Questions scorées — Boutique & commerce (40 pts max)

### Module A — Messages clients (12 pts)

- Temps/jour messages WhatsApp/FB : <1h=0 / 1–3h=2 / >3h=4
- Clients posent mêmes questions : rarement=0 / parfois=2 / tout le temps=4
- Ne pas répondre par surcharge : jamais=0 / parfois=2 / souvent=4

### Module B — Suivi commandes (12 pts)

- Suivi commandes en cours : outil=0 / cahier/Excel=2 / scroll WhatsApp=4
- Commandes oubliées/perdues : jamais=0 / 1–2/mois=2 / plusieurs/semaine=4
- Clients relancent pour statut : rarement=0 / parfois=2 / tous les jours=4

### Module C — Disponibilité & ventes manquées (8 pts)

- Contact nuit/week-end : toujours répondu=0 / lendemain=2 / achètent ailleurs=4
- Client perdu par lenteur de réponse : jamais=0 / quelquefois=2 / fréquent=4

### Module D — Paiements (8 pts)

- Vérification paiement avant livraison : auto=0 / manuel MoMo=2 / capture écran=4
- Livré sans paiement par erreur : jamais=0 / 1–2 fois=2 / plusieurs fois=4

## Questions scorées — Restaurant & traiteur (40 pts max)

### Module A — Commandes & réservations (12 pts)

- Réception commandes : système en ligne=0 / appel tel=2 / WhatsApp manuel=4
- Temps confirmation/correction commandes : <30min=0 / 30min–2h=2 / >2h=4
- Plat épuisé / erreur commande : jamais=0 / parfois=2 / régulièrement=4

### Module B — Livraisons (12 pts)

- Organisation livraisons : suivi temps réel=0 / cahier tournées=2 / de tête/WhatsApp=4
- Clients appellent pour statut livraison : rarement=0 / parfois=2 / plusieurs appels/jour=4
- Incidents livraison (mauvaise adresse, oubli) : jamais=0 / quelques fois=2 / fréquent=4

### Module C — Disponibilité (8 pts)

- Commande hors horaires : peut commander en ligne=0 / attend ouverture=2 / commande ailleurs=4
- Commandes perdues par indisponibilité : non=0 / quelquefois=2 / régulièrement=4

### Module D — Paiements (8 pts)

- Gestion paiements commandes : confirmation auto=0 / vérif manuelle=2 / confusion/impayés=4
- Récapitulatif fin de journée : clair=0 / parfois recompter=2 / souvent flou=4

## Questions scorées — Clinique & cabinet médical (40 pts max)

### Module A — Rendez-vous & accueil (12 pts)

- Prise de RDV : app/plateforme=0 / appel tel=2 / WhatsApp/physique=4
- Temps personnel gère RDV : <1h=0 / 1–3h=2 / >3h=4
- Patients oublient RDV : rarement=0 / quelquefois=2 / très souvent=4

### Module B — Dossiers patients (12 pts)

- Stockage dossiers : logiciel médical=0 / Excel/Word=2 / papier=4
- Accès dossier à distance : facilement=0 / compliqué=2 / impossible=4
- Temps perdu chercher dossier : jamais=0 / parfois=2 / régulièrement=4

### Module C — Communication patients (8 pts)

- Transmission résultats/ordonnances : app sécurisée=0 / appel/SMS manuel=2 / retour physique=4
- Messages WhatsApp questions simples : peu=0 / quelques-uns/jour=2 / beaucoup=4

### Module D — Facturation (8 pts)

- Facturation & suivi paiements : logiciel dédié=0 / Excel/cahier=2 / approximatif=4
- Paiements en attente non suivis : clairement suivi=0 / parfois oublis=2 / souvent flou=4
- Reçus/factures officielles : systématiquement=0 / sur demande=2 / rarement=0

## Système de scoring

| Score | Niveau                               | Couleur |
| ----- | ------------------------------------ | ------- |
| 0–10  | Faible — optimisation possible       | Vert    |
| 11–25 | Modéré — pertes réelles et évitables | Orange  |
| 26–40 | Critique — croissance bloquée        | Rouge   |

## Formules de calcul des pertes (FCFA, conservatrices)

| Type                           | Formule                                   |
| ------------------------------ | ----------------------------------------- |
| Ventes perdues (sans réponse)  | commandes/j × 15% × panier moyen × 22j    |
| Commandes oubliées             | fréquence déclarée × panier moyen × 4 sem |
| Ventes hors horaires           | commandes/j × 20% × panier moyen × 30j    |
| Temps humain gaspillé          | heures/j × 5j × 4 sem × 500 FCFA/h        |
| Pertes financières (confusion) | incidents déclarés × panier moyen         |

## Rapport généré

**Affiché :** prénom/nom business, secteur, score/40, niveau+couleur, 3 douleurs formulées métier, total pertes FCFA en grand+gras, texte d'accroche selon niveau.

**Textes d'accroche :**

- Faible : _"Votre activité tourne bien. Mais même à ce niveau, vous perdez environ [X] FCFA par mois sur des frictions que vous ne voyez pas encore..."_
- Modéré : _"Votre process manuel vous coûte environ [X] FCFA par mois en ventes perdues et temps gaspillé. Ce chiffre va augmenter avec votre croissance..."_
- Critique : _"Votre activité perd environ [X] FCFA chaque mois à cause de son organisation manuelle. Vos concurrents qui ont automatisé gagnent les clients que vous perdez la nuit et le week-end..."_

**CTA unique :** "📲 Recevoir mon plan d'action personnalisé sur WhatsApp"

Message WhatsApp pré-rempli :

> "Bonjour ! Je viens de faire le diagnostic digital de mon activité [secteur]. J'ai obtenu un score de [X]/40 avec des pertes estimées à [Y] FCFA/mois. Mes 3 problèmes principaux sont : [liste]. J'aimerais en discuter avec vous."

## Stack technique

| Composant   | Tech                          | Raison                              |
| ----------- | ----------------------------- | ----------------------------------- |
| Frontend    | Next.js + Tailwind CSS        | Flexibilité, rapidité               |
| Hébergement | Vercel                        | Zéro coût, déploiement en minutes   |
| Analytics   | Google Analytics              | Gratuit                             |
| CTA         | wa.me avec message pré-rempli | Ouverture directe sans friction     |
| Backend     | Aucun (V1)                    | Tout côté client, zéro coût serveur |

## Exigences UX

- Mobile-first Android (majorité au Cameroun)
- Chargement < 3s sur 3G
- Questions une par une avec animation transition
- Barre de progression visible
- Bouton WhatsApp flottant permanent bas d'écran
- Couleur principale : vert #1D9E75 (associé WhatsApp + confiance)
- Français uniquement V1
- Boutons de sélection uniquement (pas de saisie texte libre)

## URLs

- `/` — accueil
- `/diagnostic` — questionnaire interactif
- `/rapport` — résultats (généré dynamiquement côté client)

## Roadmap

| Phase | Durée          | Livrable                                                              |
| ----- | -------------- | --------------------------------------------------------------------- |
| V0    | 3–5 jours      | HTML/CSS statique, cible boutiques uniquement, tester sur 3 prospects |
| V1    | 7–10 jours     | 3 cibles + Autre, scoring complet, rapport, CTA WhatsApp, déployé     |
| V2    | Après 10 leads | Ajustements retours terrain, analytics                                |
| V3    | Mois 4+        | Nouvelles cibles, version anglaise optionnelle                        |

**Règle absolue :** commencer V0 → tester sur vraies personnes → itérer.

## KPIs

| Indicateur                    | Mois 1 | Mois 3 |
| ----------------------------- | ------ | ------ |
| Visites                       | 50+    | 200+   |
| Taux complétion questionnaire | > 60%  | > 70%  |
| Rapports générés              | 30+    | 120+   |
| Clic CTA WhatsApp             | > 40%  | > 50%  |
| Conversations WhatsApp        | 12+    | 60+    |
| Clients convertis             | 1 min  | 5+     |

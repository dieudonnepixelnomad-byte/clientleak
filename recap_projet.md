---
titre: ClientLeak — Récapitulatif du projet
date: 2026-06-07
statut: V0 en cours (boutiques + restaurant + clinique codés)
---

# Récapitulatif — Diagnostic Digital PME

## Contexte

Outil de vente automatisé ciblant les PME africaines à process manuels.
Pas un site vitrine. Un lead magnet qui remplace le premier rendez-vous de découverte.
Prospect arrive → répond à 13 questions → reçoit un rapport avec ses pertes FCFA chiffrées → clique WhatsApp avec message pré-rempli.

---

## Ce qui a été fait

### 1. Architecture projet

Stack : Next.js 16 + Tailwind CSS, zéro backend, zéro base de données.
Les données transitent via `sessionStorage` côté client uniquement.
Hébergement prévu : Vercel (gratuit).

```
app/
  page.tsx          → accueil (/)
  diagnostic/
    page.tsx        → questionnaire (/diagnostic)
  rapport/
    page.tsx        → rapport généré (/rapport)
lib/
  questions.ts      → toutes les questions des 3 secteurs
  scoring.ts        → moteur de calcul score + pertes
  config.ts         → numéro WhatsApp (237671960300)
```

---

### 2. Page d'accueil (`/`)

- Hero avec accroche principale + CTA "Démarrer mon diagnostic"
- Bande de stats : 5 min / 3 douleurs / FCFA
- Section "Comment ça fonctionne" — 4 étapes numérotées
- Section "Pour qui" — 3 secteurs avec emoji
- CTA final fond vert
- Footer
- Bouton WhatsApp flottant permanent (bas droite)
- Couleur principale `#1D9E75`, mobile-first

---

### 3. Questionnaire interactif (`/diagnostic`)

4 étapes séquentielles avec animations de transition :

| Étape | Contenu |
|-------|---------|
| `name` | Saisie du nom de l'établissement |
| `sector` | Choix du secteur (4 cartes cliquables) |
| `autre` | Message personnalisé + CTA WhatsApp direct (hors cible) |
| `questions` | Questions une par une avec barre de progression |

Fonctionnalités :
- Barre de progression visible + % affiché
- Badge module (ex: "Module A / Messages clients")
- Bouton retour fonctionnel (question précédente ou étape précédente)
- Réponse par bouton uniquement, aucune saisie libre
- Après dernière réponse → sauvegarde `sessionStorage` → redirect `/rapport`
- Bouton WhatsApp flottant permanent

---

### 4. Questions (`lib/questions.ts`)

**Module Qualification — commun (3 questions, non scorées)**
- Volume clients/jour → valeur de calibration (3 / 12 / 25)
- Panier moyen FCFA → valeur de calibration (2 500 / 15 000 / 40 000)
- Taille équipe

**Boutique & commerce — 10 questions scorées (40 pts max)**
- Module A Messages clients (12 pts)
- Module B Suivi commandes (12 pts)
- Module C Disponibilité (8 pts)
- Module D Paiements (8 pts)

**Restaurant & traiteur — 10 questions scorées (40 pts max)**
- Module A Commandes & réservations (12 pts)
- Module B Livraisons (12 pts)
- Module C Disponibilité (8 pts)
- Module D Paiements (8 pts)

**Clinique & cabinet médical — 11 questions scorées (40 pts max)**
- Module A Rendez-vous & accueil (12 pts)
- Module B Dossiers patients (12 pts)
- Module C Communication patients (8 pts)
- Module D Facturation (8 pts)

---

### 5. Moteur de scoring (`lib/scoring.ts`)

**Score total** : somme des points des questions scorées (0–40).

| Score | Niveau | Couleur |
|-------|--------|---------|
| 0–10 | Faible — optimisation possible | Vert |
| 11–25 | Modéré — pertes réelles et évitables | Orange |
| 26–40 | Critique — croissance bloquée | Rouge |

**Calcul des pertes par secteur (FCFA) :**

*Boutique :*
- Temps gaspillé messages : `heures/j × 5j × 4 sem × 500 FCFA/h`
- Ventes perdues (sans réponse) : `commandesJour × 10-15% × panierMoyen × 22j`
- Commandes oubliées : `fréquence × panierMoyen × 4 sem`
- Ventes hors horaires : `commandesJour × 10-20% × panierMoyen × 30j`
- Paiements non vérifiés : `incidents × panierMoyen`

*Restaurant :*
- Temps gaspillé confirmation commandes
- Commandes perdues par indisponibilité
- Incidents de livraison
- Confusion paiements

*Clinique :*
- Temps personnel gestion RDV
- Consultations perdues (no-show)
- Temps perdu chercher dossiers
- Paiements en attente non suivis

Total minimal forcé à 50 000 FCFA (floor de crédibilité).

**Top 3 douleurs** : catégories triées par score décroissant, top 3 affichées.

**Message WhatsApp pré-rempli** : généré dynamiquement avec nom établissement, secteur, score/40, total FCFA, liste des 3 douleurs.

---

### 6. Page rapport (`/rapport`)

5 blocs dans l'ordre :

| Bloc | Contenu |
|------|---------|
| Identité | Nom établissement + secteur |
| Score | Jauge SVG circulaire animée, score/40, badge verdict coloré |
| Pertes totales | Montant héro fond coloré + texte d'accroche selon niveau |
| 3 frictions | Titre + barre de progression + score module + description |
| Détail pertes | Chaque catégorie avec montant + explication du calcul |
| Méthodologie | Tableau des hypothèses conservatrices utilisées |
| CTA sticky | Bouton WhatsApp fixé en bas d'écran, toujours visible |

Lien "Refaire le diagnostic" en bas.
Aucun champ de saisie sur la page rapport.

---

## Ce qui n'a pas encore été fait

| Élément | Statut | Notes |
|---------|--------|-------|
| Cartes de douleur détaillées (4 couches) | Non implémenté | `feature_rapport_diagnostic.md` §6 décrit les textes complets par cible — ce qui se passe / pourquoi grave / analogie / impact chiffré |
| Google Analytics | Non intégré | Prévu V1 |
| Déploiement Vercel | Non fait | Prêt à déployer |
| Tests sur vraies PME | Non fait | Objectif immédiat après déploiement |
| Ajustement numéro WhatsApp | Fait | `237671960300` dans `lib/config.ts` |

---

## Prochaines étapes immédiates

1. **Déployer sur Vercel** — le projet est fonctionnel, zéro config serveur nécessaire
2. **Tester sur 3 PME de Douala** — boutiques en priorité
3. **Optionnel avant test** : implémenter les cartes de douleur détaillées (4 couches) du `feature_rapport_diagnostic.md` pour plus d'impact émotionnel
4. Itérer selon retours terrain

---

## KPIs mois 1 (rappel)

| Indicateur | Cible |
|------------|-------|
| Visites | 50+ |
| Taux complétion questionnaire | > 60% |
| Rapports générés | 30+ |
| Clic CTA WhatsApp | > 40% |
| Conversations ouvertes | 12+ |
| Clients signés | 1 minimum |

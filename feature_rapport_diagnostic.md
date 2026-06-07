# Feature — Page Rapport de Diagnostic
> Applicable aux 3 cibles : Boutique & commerce / Restaurant & traiteur / Clinique & cabinet médical

---

## 1. Vue d'ensemble

La page rapport est la **pièce maîtresse** du site diagnostic. Elle s'affiche après que l'utilisateur a répondu à toutes les questions. Elle doit :

- Montrer un score de douleur clair et visuel
- Chiffrer les pertes estimées en FCFA avec le détail par catégorie
- Expliquer **pourquoi** chaque problème coûte de l'argent (explication pédagogique + analogie + impact chiffré)
- Ne jamais révéler la solution
- Convertir via un unique CTA WhatsApp avec rapport pré-rempli

---

## 2. Structure générale de la page rapport

```
┌─────────────────────────────────────────┐
│  BLOC 1 — En-tête : identité + score    │
├─────────────────────────────────────────┤
│  BLOC 2 — Total des pertes en FCFA      │
│           (décomposé par catégorie)     │
├─────────────────────────────────────────┤
│  BLOC 3 — Douleurs identifiées          │
│           (1 carte par douleur)         │
│           → ce qui se passe             │
│           → pourquoi c'est grave        │
│           → analogie du quotidien       │
│           → impact chiffré              │
├─────────────────────────────────────────┤
│  BLOC 4 — Méthodologie de calcul        │
├─────────────────────────────────────────┤
│  BLOC 5 — CTA WhatsApp                  │
└─────────────────────────────────────────┘
```

---

## 3. Bloc 1 — En-tête : identité + score

### Données affichées
- Nom du business (saisi en début de questionnaire)
- Secteur d'activité sélectionné
- Score total sur 40
- Barre de progression visuelle (3 zones colorées)
- Badge de verdict

### Logique du verdict
| Score | Verdict | Couleur badge |
|-------|---------|---------------|
| 0 – 10 | Processus correct | Vert |
| 11 – 25 | Situation préoccupante | Orange |
| 26 – 40 | Situation critique | Rouge |

### Code de la logique verdict
```javascript
function getVerdict(score) {
  if (score <= 10) return { label: "Processus correct", color: "green" }
  if (score <= 25) return { label: "Situation préoccupante", color: "amber" }
  return { label: "Situation critique", color: "red" }
}
```

---

## 4. Bloc 2 — Pertes estimées en FCFA

### Principe
Les pertes sont calculées côté client (JavaScript) à partir des réponses du questionnaire. Aucune donnée n'est envoyée à un serveur.

### Variables d'entrée (issues du questionnaire de qualification)
```javascript
const inputs = {
  volumeJour: 5 | 15 | 25,        // bas / moyen / élevé
  panierMoyen: 2500 | 12500 | 30000, // bas / moyen / élevé
  tailleEquipe: 1 | 2 | 4          // solo / petite / équipe
}
```

### Les 4 catégories de pertes

#### Catégorie A — Ventes non conclues (messages sans réponse)
```
Formule :
volumeJour × 0.15 × panierMoyen × 22 jours

Explication :
15% des messages reçus ne reçoivent pas de réponse à temps.
Chaque message sans réponse = une vente potentielle perdue.
22 jours = jours ouvrés dans un mois.
```

#### Catégorie B — Commandes perdues ou oubliées
```
Formule :
nbCommandesOubliees × panierMoyen × 4 semaines

nbCommandesOubliees selon réponse :
- "Jamais" → 0
- "1 à 2 fois par mois" → 1.5 / mois (soit ~0.375/semaine)
- "Plusieurs fois par semaine" → 3 / semaine
```

#### Catégorie C — Ventes manquées hors horaires
```
Formule :
volumeJour × 0.20 × panierMoyen × 30 jours

Explication :
20% des intentions d'achat se produisent hors des heures
de disponibilité (soir, nuit, week-end).
Applicable uniquement si la réponse à la question
disponibilité est "Personne ne répond" ou "Je réponds le lendemain".
Si "Quelqu'un répond toujours" → cette catégorie = 0.
```

#### Catégorie D — Pertes financières (confusion paiements)
```
Formule :
nbIncidents × panierMoyen

nbIncidents selon réponse :
- "Jamais" → 0
- "1 à 2 fois" → 1.5 / mois
- "Plusieurs fois" → 4 / mois
```

#### Calcul du total
```javascript
function calculateLosses(inputs, answers) {
  const { volumeJour, panierMoyen } = inputs

  const perteMessages = volumeJour * 0.15 * panierMoyen * 22

  const oubliMap = { never: 0, sometimes: 1.5, often: 12 }
  const perteCommandes = oubliMap[answers.commandesOubliees] * panierMoyen

  const disponibiliteMap = { always: 0, nextDay: 0.10, never: 0.20 }
  const perteNuit = volumeJour * disponibiliteMap[answers.disponibilite] * panierMoyen * 30

  const incidentMap = { never: 0, sometimes: 1.5, often: 4 }
  const pertePaiements = incidentMap[answers.confusionPaiement] * panierMoyen

  return {
    messages: Math.round(perteMessages),
    commandes: Math.round(perteCommandes),
    nuit: Math.round(perteNuit),
    paiements: Math.round(pertePaiements),
    total: Math.round(perteMessages + perteCommandes + perteNuit + pertePaiements)
  }
}
```

### Affichage du total
- Montant total affiché en grand, en rouge, en FCFA
- Sous-totaux par catégorie dans 4 mini-cartes
- Libellés humains (pas de jargon technique) :
  - "Ventes non conclues"
  - "Commandes perdues"
  - "Indisponibilité nocturne"
  - "Confusion paiements"

---

## 5. Bloc 3 — Douleurs identifiées

### Principe de sélection
Le rapport affiche les **3 douleurs avec le score le plus élevé** parmi les 4 modules. Si deux modules ont le même score, on affiche le premier dans l'ordre des modules.

```javascript
function getTopPains(moduleScores) {
  return Object.entries(moduleScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([module, score]) => ({ module, score }))
}
```

### Structure d'une carte de douleur

Chaque carte contient exactement 4 couches dans cet ordre :

```
1. CE QUI SE PASSE (2-3 phrases, langage direct, présent)
   → Décrit concrètement la situation du prospect
   → Il doit se reconnaître immédiatement

2. POURQUOI C'EST GRAVE (explication pédagogique, 3-5 phrases)
   → Explique le mécanisme de la perte
   → Cite des ratios ou données crédibles
   → Pas de jargon, vocabulaire de commerçant

3. L'ANALOGIE (1-2 phrases, italique)
   → Utilise une image du quotidien africain ou camerounais
   → Rend l'abstrait concret et mémorable

4. L'IMPACT CHIFFRÉ (1 phrase, en rouge, chiffre en FCFA ou en unités)
   → Ancre la douleur dans une réalité financière
   → Chiffre calculé à partir des réponses réelles du prospect
```

---

## 6. Bibliothèque de douleurs par cible

### 6.1 Cible : Boutique & commerce

---

#### Douleur A — Messages sans réponse / Avalanche WhatsApp

**Ce qui se passe**
Vous passez plusieurs heures par jour à répondre aux mêmes questions sur WhatsApp et Facebook. Les clients demandent les prix, les disponibilités, les délais de livraison — et vous répondez manuellement à chacun, un par un.

**Pourquoi c'est grave**
Votre temps est votre ressource la plus précieuse en tant que chef d'entreprise. Chaque heure passée à répondre "C'est combien ?" est une heure que vous n'avez pas passée à développer votre activité, à gérer vos stocks, ou à fidéliser vos meilleurs clients. Des études sur les commerces en ligne montrent qu'un message sans réponse rapide a 70% de chances de se transformer en client perdu — car le prospect est allé acheter chez un concurrent qui a répondu plus vite. Et ce phénomène s'aggrave : plus votre activité grandit, plus le volume de messages augmente, et plus vous êtes débordé(e).

**Analogie**
C'est comme si vous étiez à la caisse de votre boutique, mais que vous deviez en même temps répondre au téléphone, gérer les livraisons et faire le ménage — seul(e). Quelque chose finit toujours par tomber.

**Impact chiffré**
Sur {heuresMessages} heures de messages par jour, environ 45 minutes représentent des questions auxquelles une réponse automatique aurait suffi — soit **{tempsPerduMois} heures perdues par mois**, l'équivalent de {joursEquivalents} journées entières de travail non productif.

---

#### Douleur B — Commandes perdues dans WhatsApp

**Ce qui se passe**
Vous suivez vos commandes en scrollant dans WhatsApp. Il n'y a pas de liste centralisée, pas de tableau de bord. Une commande passée hier soir peut facilement se noyer sous 40 nouveaux messages reçus ce matin.

**Pourquoi c'est grave**
WhatsApp n'a pas été conçu pour gérer des commandes — il a été conçu pour les conversations. Utiliser WhatsApp comme un carnet de commandes, c'est comme utiliser un cahier d'école pour tenir votre comptabilité : ça marche tant que le volume est faible, mais dès que votre activité grandit, le système s'effondre. Chaque commande oubliée est une perte directe d'argent, mais aussi une perte de confiance : un client livré en retard ou pas livré du tout ne revient pas, et en parle à ses proches. Le bouche-à-oreille négatif est particulièrement destructeur dans les quartiers de Douala où les communautés sont soudées.

**Analogie**
Imaginez une pharmacie qui range ses médicaments en vrac dans une grande boîte sans étiquettes ni rangement. Le pharmacien cherche à chaque fois. C'est exactement ce que vous faites avec vos commandes dans WhatsApp.

**Impact chiffré**
Avec {nbCommandesOubliees} commandes oubliées par semaine à un panier moyen de {panierMoyen} FCFA, vous perdez au minimum **{perteCommandes} FCFA par mois** — sans compter les clients qui ne reviendront plus jamais.

---

#### Douleur C — Ventes perdues la nuit et le week-end

**Ce qui se passe**
Quand un client vous contacte à 21h pour commander, personne ne répond. Le lendemain matin, il a déjà acheté ailleurs. Vous ne le savez même pas — et vous ne pouvez donc pas agir.

**Pourquoi c'est grave**
Les habitudes d'achat ont changé. Une grande partie des décisions d'achat se prennent le soir, entre 19h et 23h, quand les gens sont chez eux, détendus, sur leur téléphone. C'est précisément le moment où votre boutique est fermée et où votre WhatsApp ne reçoit plus de réponse. Selon les données du commerce mobile en Afrique francophone, 20 à 30% du volume de commandes en ligne se génère entre 19h et minuit. Si vous n'êtes pas disponible, vous cédez ce terrain à vos concurrents — souvent sans vous en rendre compte, car le client qui n'a pas eu de réponse part silencieusement, sans vous dire pourquoi.

**Analogie**
C'est comme avoir une boutique dans un marché qui reste ouvert 24h/24 — mais vous, vous éteignez la lumière à 18h. Les clients passent, frappent à la porte, puis vont chez le voisin qui est encore là.

**Impact chiffré**
Avec {volumeJour} commandes par jour en moyenne, **environ {commandesNuit} commandes potentielles se perdent chaque mois** en dehors de vos heures de disponibilité — soit {perteNuit} FCFA non encaissés.

---

#### Douleur D — Confusion paiements / livraisons sans paiement confirmé

**Ce qui se passe**
Vous faites confiance aux captures d'écran Mobile Money envoyées par les clients. Mais certaines sont modifiées, certains paiements ne sont pas encore arrivés, et dans la confusion du quotidien, il vous arrive de livrer sans avoir réellement été payé(e).

**Pourquoi c'est grave**
La fraude à la capture d'écran de paiement Mobile Money est un phénomène très répandu dans le commerce en ligne à Douala. Des clients envoient de fausses preuves de paiement en comptant sur votre bonne foi et votre manque de temps pour vérifier. Chaque livraison effectuée sans paiement confirmé est une perte sèche et définitive : vous avez dépensé le produit, le temps de livraison, et vous n'avez rien encaissé. Au fil des mois, ces petites pertes s'accumulent et peuvent représenter une somme significative que vous ne voyez pas parce qu'elles n'apparaissent nulle part dans vos comptes.

**Analogie**
C'est comme accepter un billet de banque sans regarder si c'est un faux. Sur le moment, tout semble normal. C'est seulement plus tard, quand vous comptez votre caisse, que vous réalisez le manque.

**Impact chiffré**
Avec {nbIncidents} incidents de confusion par mois à {panierMoyen} FCFA en moyenne, vous perdez **{pertePaiements} FCFA par mois** en livraisons non payées — de l'argent définitivement perdu, impossible à récupérer.

---

### 6.2 Cible : Restaurant & traiteur

---

#### Douleur A — Commandes mal gérées / erreurs fréquentes

**Ce qui se passe**
Vos commandes arrivent par WhatsApp, par appel, parfois en personne — tout en même temps. Vous ou votre équipe devez tout noter à la main, confirmer chaque commande manuellement, et mémoriser qui a commandé quoi, pour quelle heure.

**Pourquoi c'est grave**
Dans la restauration, une erreur de commande a une double conséquence : vous perdez les ingrédients déjà préparés, et vous perdez le client. Un repas préparé pour une personne qui n'est pas venue ou qui avait commandé autre chose, c'est du gaspillage direct. Des études sur les restaurants utilisant des systèmes de commande manuel versus digital montrent que les restaurants manuels ont en moyenne 3 fois plus d'erreurs de commande et 40% de taux de fidélisation client en moins. À Douala, le bouche-à-oreille est votre meilleur outil marketing — mais il fonctionne dans les deux sens.

**Analogie**
C'est comme un cuisinier à qui on donne les commandes à l'oral, sans bon de commande écrit, pendant qu'il cuisine. Il fait de son mieux — mais il oublie, confond, se trompe. Pas parce qu'il est mauvais, mais parce que le système ne lui permet pas de réussir.

**Impact chiffré**
Avec {nbErreurs} erreurs ou confusions de commande par semaine, à un coût moyen de {coutErreur} FCFA par incident (repas préparé + client perdu), vous perdez **{perteErreurs} FCFA par mois** rien qu'en erreurs de commande.

---

#### Douleur B — Livraisons désorganisées / clients qui rappellent

**Ce qui se passe**
Vos clients rappellent plusieurs fois pour savoir où est leur livraison. Votre livreur gère ses tournées de tête ou par messages WhatsApp. Il n'y a pas de suivi en temps réel, pas de notification automatique au client.

**Pourquoi c'est grave**
Chaque appel d'un client qui demande "Où est ma commande ?" mobilise votre attention pendant que vous êtes en plein service — le moment où vous avez le moins de disponibilité. Ces interruptions fragmentent votre concentration, ralentissent la préparation des commandes en cours, et stressent toute l'équipe. Par ailleurs, un client qui attend sans information finit par s'énerver, même si la livraison arrive à temps. L'absence de communication pendant l'attente est perçue comme du désintérêt. Dans un secteur aussi concurrentiel que la restauration à Douala, l'expérience de livraison est aussi importante que la qualité du repas.

**Analogie**
C'est comme prendre l'avion et ne jamais recevoir d'information sur votre vol — ni heure d'embarquement, ni retard, rien. Le vol arrive peut-être à l'heure, mais vous avez passé toute l'attente dans l'angoisse. Vous ne reprendrez pas cette compagnie.

**Impact chiffré**
Avec {nbAppelsJour} appels de suivi par jour en moyenne, chaque appel prend 3 à 5 minutes de votre temps ou de celui de votre équipe — soit **{tempsPerduMois} minutes perdues par mois**, l'équivalent de {heuresEquivalentes} heures de temps de préparation gaspillé.

---

#### Douleur C — Commandes manquées hors horaires

**Ce qui se passe**
Des clients essaient de commander le soir ou en dehors de vos heures d'ouverture. Personne ne répond. Ils commandent ailleurs ou renoncent. Vous ne saurez jamais combien de commandes vous avez manquées cette semaine.

**Pourquoi c'est grave**
La demande en restauration livrée est particulièrement forte le soir en semaine (après le travail) et le week-end. Ce sont précisément les moments où un restaurant traditionnel est soit fermé, soit en plein coup de feu sans capacité de traiter de nouveaux appels. Les plateformes comme Jumia Food et d'autres acteurs digitaux ont capté cette demande nocturne précisément parce que les restaurants traditionnels n'étaient pas disponibles. Vous pouvez récupérer ce segment sans passer par une plateforme tierce — à condition d'avoir un système qui répond automatiquement et prend les commandes même quand vous dormez.

**Analogie**
Un maquis qui ferme à 20h laisse tous les clients qui sortent du boulot après cette heure sans option. Ces clients ne disparaissent pas — ils vont manger ailleurs. Chaque soir, c'est un repas que vous auriez pu vendre.

**Impact chiffré**
En estimant seulement {commandesNuit} commandes perdues par soir hors horaires, à {panierMoyen} FCFA de panier moyen, vous perdez **{perteNuit} FCFA par mois** — une salle entière de clients invisibles.

---

#### Douleur D — Désordre financier en fin de journée

**Ce qui se passe**
En fin de journée, vous n'êtes pas sûr(e) du montant exact que vous avez encaissé. Les paiements arrivent en espèces, par Mobile Money, parfois à la livraison, parfois à l'avance. Reconstituer la journée prend du temps et reste approximatif.

**Pourquoi c'est grave**
Un restaurant qui ne connaît pas précisément son chiffre d'affaires quotidien ne peut pas piloter son activité. Vous ne savez pas quels jours sont les plus rentables, quels plats génèrent le plus de marge, ni si votre activité croît vraiment d'un mois à l'autre. Sans cette visibilité financière, chaque décision — recruter un livreur, acheter plus d'ingrédients, ouvrir le dimanche — repose sur des intuitions plutôt que sur des données réelles. C'est comme conduire de nuit sans phares : vous avancez, mais vous ne voyez pas ce qui est devant vous.

**Analogie**
C'est comme gérer un commerce de marché sans jamais compter sa caisse à la fermeture. Vous savez que vous avez vendu — mais vous ne savez pas vraiment combien, ni si c'est suffisant pour couvrir vos charges.

**Impact chiffré**
Des erreurs de comptage fréquentes, même petites, représentent en moyenne **{perteComptage} FCFA de manque à gagner par mois** — soit sur l'année, {perteAnnuelle} FCFA qui auraient pu être réinvestis dans votre activité.

---

### 6.3 Cible : Clinique & cabinet médical privé

---

#### Douleur A — Rendez-vous oubliés / patients no-show

**Ce qui se passe**
Des patients prennent rendez-vous puis ne viennent pas — sans prévenir. Vous avez réservé un créneau, peut-être préparé un dossier, et le médecin attend. Ce temps ne se récupère pas.

**Pourquoi c'est grave**
Dans un cabinet médical, chaque créneau horaire représente un revenu potentiel fixe. Un rendez-vous manqué sans annulation préalable est une perte sèche : le médecin est présent, le personnel aussi, les charges tournent — mais aucun acte n'est facturé. Des études en gestion médicale montrent que les no-show représentent en moyenne 15 à 20% des rendez-vous dans les établissements sans système de rappel automatique. Un simple rappel automatique par message, 24h avant le rendez-vous, réduit ce taux de 60 à 70%. C'est l'un des gains les plus rapides et les plus mesurables qu'un cabinet peut obtenir.

**Analogie**
C'est comme un taxi qui réserve sa voiture pour un client à 10h, refuse d'autres courses pour rester disponible — et le client ne se présente pas. Le taxi a perdu son temps ET ses autres clients potentiels.

**Impact chiffré**
Avec {nbRdvParJour} rendez-vous par jour et un taux de no-show estimé à 15%, vous perdez en moyenne **{rdvManques} rendez-vous par mois** — soit {perteRdv} FCFA de consultations non facturées.

---

#### Douleur B — Dossiers inaccessibles à distance

**Ce qui se passe**
Les dossiers patients sont sur papier ou sur un ordinateur au cabinet. Hors du cabinet, le médecin n'y a pas accès. En cas d'urgence, pour un suivi à domicile, ou simplement pour travailler le soir, il faut se déplacer ou travailler de mémoire.

**Pourquoi c'est grave**
La médecine moderne exige une continuité des soins qui dépasse les murs du cabinet. Un médecin qui ne peut pas consulter l'historique d'un patient avant de rappeler une famille, ou qui doit se souvenir de tête des prescriptions en cours, prend des risques médicaux et juridiques inutiles. Par ailleurs, les patients de plus en plus éduqués et connectés attendent un suivi personnalisé. Un cabinet qui peut offrir une communication de suivi rapide et informée sur les résultats d'analyse ou les ordonnances se distingue immédiatement de la concurrence et génère une fidélité forte.

**Analogie**
C'est comme un avocat qui laisserait tous ses dossiers clients dans son bureau et serait incapable de répondre à une question urgente de son client sans y retourner physiquement. Dans un secteur de confiance comme le droit ou la médecine, cette indisponibilité nuit gravement à la relation avec le patient.

**Impact chiffré**
Chaque déplacement non planifié au cabinet pour accéder à un dossier coûte en moyenne {tempsDeplacementMin} minutes. Avec {nbDeplacements} déplacements évitables par mois, vous perdez **{tempsPerduMois} heures** qui auraient pu être dédiées à des consultations ou au repos.

---

#### Douleur C — Avalanche de messages WhatsApp pour des questions simples

**Ce qui se passe**
Votre personnel — ou vous-même — reçoit chaque jour des messages WhatsApp de patients pour des questions simples : les horaires d'ouverture, les tarifs des consultations, si le médecin est disponible aujourd'hui, comment se préparer pour un examen. Ces réponses prennent du temps alors qu'elles sont toujours les mêmes.

**Pourquoi c'est grave**
Dans un cabinet médical, le temps du personnel d'accueil est précieux. Chaque minute passée à répondre à "Vous êtes ouverts le samedi ?" est une minute de moins pour accueillir les patients physiquement présents, gérer les dossiers, ou organiser les plannings. La qualité de l'accueil est le premier critère de satisfaction cité par les patients dans les enquêtes sur les cliniques privées africaines. Un accueil surchargé, distrait, qui fait attendre — même pour de bonnes raisons — génère une mauvaise impression qui ne se rattrape pas facilement.

**Analogie**
C'est comme si la standardiste d'un grand hôtel devait, en plus d'accueillir les clients à la réception, répondre simultanément à 30 appels téléphoniques posant tous les mêmes questions sur les tarifs des chambres. Personne ne peut bien faire les deux en même temps.

**Impact chiffré**
Avec {nbMessagesJour} messages de ce type par jour, à 3 minutes de traitement chacun en moyenne, votre personnel perd **{tempsPerduMois} heures par mois** sur des réponses qui pourraient être automatisées — temps qui devrait être consacré aux patients présents.

---

#### Douleur D — Créances non suivies / paiements oubliés

**Ce qui se passe**
Certains patients paient en plusieurs fois, ou règlent après la consultation. Sans système de suivi, il est difficile de savoir qui a un solde en attente, depuis combien de temps, et pour quel montant. Des créances se perdent.

**Pourquoi c'est grave**
Dans un cabinet médical, la relation avec le patient est une relation de confiance à long terme — et c'est précisément cette confiance qui rend difficile la relance pour un paiement en retard. Sans outil automatisé, les créances s'accumulent en silence. La plupart des cabinets ne relancent pas — par gêne, par oubli, ou par manque de temps. Le résultat : une trésorerie dégradée qui n'apparaît nulle part dans les comptes mais qui se ressent chaque fin de mois. C'est de l'argent que vous avez gagné, que vous avez le droit de percevoir, mais que vous ne récupérez jamais.

**Analogie**
C'est comme être boulanger et donner du pain à crédit à plusieurs clients, sans carnet de dettes. Vous savez vaguement qui vous doit quelque chose — mais sans preuve, sans suivi, la gêne sociale et l'oubli font le reste. La dette disparaît sans être remboursée.

**Impact chiffré**
En estimant seulement {nbCreances} créances non relancées par mois à {montantMoyenCreance} FCFA en moyenne, votre cabinet laisse **{perteCreances} FCFA non encaissés par mois** — de l'argent déjà gagné, mais jamais reçu.

---

## 7. Bloc 4 — Méthodologie de calcul

### Texte affiché (identique pour toutes les cibles)

> **Comment ces chiffres ont été calculés**
>
> Ces estimations sont basées sur vos réponses au questionnaire. Elles utilisent des ratios conservateurs issus de données sur le commerce et les services en Afrique francophone, croisés avec les volumes que vous avez déclarés. La réalité est souvent plus élevée — nous avons volontairement choisi les hypothèses les plus prudentes pour que ces chiffres restent incontestables.

### Tableau de transparence affiché

| Élément | Valeur utilisée |
|---------|----------------|
| Volume déclaré | {volumeJour} clients/commandes par jour |
| Panier ou ticket moyen | {panierMoyen} FCFA |
| Taux de perte messages | 15% (hypothèse conservatrice) |
| Taux de pertes nocturnes | 20% (hypothèse conservatrice) |
| Période de calcul | 22 jours ouvrés / 4 semaines |
| Source des ratios | Données commerce mobile Afrique francophone |

---

## 8. Bloc 5 — CTA WhatsApp

### Texte d'accroche final selon le verdict

**Verdict vert (0–10 pts)**
> Votre activité tourne bien. Mais même à ce niveau, vous perdez environ {total} FCFA par mois sur des frictions que vous ne voyez pas encore. Un ajustement ciblé pourrait faire une grande différence sans bouleverser votre organisation.

**Verdict orange (11–25 pts)**
> Votre organisation actuelle vous coûte {total} FCFA par mois en ventes perdues et temps gaspillé. Ce chiffre va augmenter avec votre croissance. Il est temps d'agir avant que la concurrence ne prenne les clients que vous perdez chaque semaine.

**Verdict rouge (26–40 pts)**
> Votre activité perd {total} FCFA chaque mois à cause de son organisation manuelle. Vos concurrents qui ont déjà automatisé gagnent les clients que vous perdez la nuit et le week-end. Chaque jour sans action est une perte réelle et mesurable.

### Bouton CTA

```
Texte : 📲 Recevoir mon plan d'action sur WhatsApp
Couleur : vert (#1D9E75)
Mention sous le bouton : Gratuit · Sans engagement · Réponse sous 24h
```

### Message WhatsApp pré-rempli (généré dynamiquement)

```javascript
function buildWhatsAppMessage(data) {
  const { businessName, sector, score, total, pains } = data
  return encodeURIComponent(
    `Bonjour ! Je viens de faire le diagnostic digital de mon activité.\n\n` +
    `🏢 Activité : ${businessName} (${sector})\n` +
    `📊 Score obtenu : ${score}/40 — ${data.verdict}\n` +
    `💸 Pertes estimées : ${total.toLocaleString('fr-FR')} FCFA/mois\n\n` +
    `Mes 3 problèmes principaux :\n` +
    pains.map((p, i) => `${i + 1}. ${p.title}`).join('\n') +
    `\n\nJ'aimerais discuter de ma situation et comprendre ce que vous pouvez faire pour moi.`
  )
}

const waLink = `https://wa.me/237XXXXXXXXX?text=${buildWhatsAppMessage(reportData)}`
```

---

## 9. Règles absolues de la page rapport

1. **Ne jamais mentionner la solution.** Pas de "chatbot", "automatisation", "application", "développement". Jamais. La seule sortie est le bouton WhatsApp.

2. **Toujours utiliser des chiffres réels.** Les montants affichés sont calculés à partir des réponses du prospect, pas des valeurs génériques. Si le calcul donne 0, afficher 0 — ne pas inventer.

3. **Langage commerçant, jamais langage technique.** Dire "vous perdez des ventes la nuit" — jamais "votre taux de conversion nocturne est sous-optimal".

4. **Mobile-first obligatoire.** Le rapport doit être lisible et convaincant sur un téléphone Android avec une connexion 3G. Pas de tableaux complexes, pas d'éléments qui débordent.

5. **Le bouton WhatsApp est toujours visible.** Il doit flotter en bas de l'écran sur mobile, ou être présent au minimum en bas du rapport après les douleurs.

6. **Aucun champ de formulaire sur la page rapport.** L'utilisateur ne saisit rien. Il lit, puis il clique.
```

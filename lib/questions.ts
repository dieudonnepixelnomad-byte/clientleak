export type Sector = 'boutique' | 'restaurant' | 'clinique';

export interface AnswerOption {
  label: string;
  score: number;
  calibrationValue?: number;
}

export interface Question {
  id: string;
  module: string;
  moduleLabel: string;
  text: string;
  options: AnswerOption[];
  scored: boolean;
  painCategory?: string;
}

export const qualificationQuestions: Question[] = [
  {
    id: 'q0_1',
    module: 'qualification',
    moduleLabel: 'Votre activité',
    text: 'Combien de commandes ou clients gérez-vous par jour en moyenne ?',
    scored: false,
    options: [
      { label: 'Moins de 5 clients / jour', score: 0, calibrationValue: 3 },
      { label: 'Entre 5 et 20 clients / jour', score: 0, calibrationValue: 12 },
      { label: 'Plus de 20 clients / jour', score: 0, calibrationValue: 25 },
    ],
  },
  {
    id: 'q0_2',
    module: 'qualification',
    moduleLabel: 'Votre activité',
    text: 'Quel est votre montant moyen par vente ou consultation ?',
    scored: false,
    options: [
      { label: 'Moins de 5 000 FCFA', score: 0, calibrationValue: 2500 },
      { label: 'Entre 5 000 et 25 000 FCFA', score: 0, calibrationValue: 15000 },
      { label: 'Plus de 25 000 FCFA', score: 0, calibrationValue: 40000 },
    ],
  },
  {
    id: 'q0_3',
    module: 'qualification',
    moduleLabel: 'Votre activité',
    text: 'Combien de personnes gèrent directement vos clients au quotidien ?',
    scored: false,
    options: [
      { label: 'Moi seul', score: 0 },
      { label: '2 à 3 personnes', score: 0 },
      { label: 'Plus de 3 personnes', score: 0 },
    ],
  },
];

export const boutiqueQuestions: Question[] = [
  // Module A — Messages clients (12 pts)
  {
    id: 'ba1',
    module: 'A',
    moduleLabel: 'Messages clients',
    text: 'Combien de temps passez-vous par jour à répondre aux messages WhatsApp ou Facebook ?',
    scored: true,
    painCategory: 'messages',
    options: [
      { label: 'Moins d\'1 heure', score: 0, calibrationValue: 0.5 },
      { label: 'Entre 1 et 3 heures', score: 2, calibrationValue: 2 },
      { label: 'Plus de 3 heures', score: 4, calibrationValue: 4 },
    ],
  },
  {
    id: 'ba2',
    module: 'A',
    moduleLabel: 'Messages clients',
    text: 'Vos clients posent-ils souvent les mêmes questions (prix, disponibilité, horaires...) ?',
    scored: true,
    painCategory: 'messages',
    options: [
      { label: 'Rarement', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Tout le temps', score: 4 },
    ],
  },
  {
    id: 'ba3',
    module: 'A',
    moduleLabel: 'Messages clients',
    text: 'Il vous arrive de ne pas répondre à des clients à cause du volume de messages ?',
    scored: true,
    painCategory: 'messages',
    options: [
      { label: 'Jamais', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Souvent', score: 4 },
    ],
  },
  // Module B — Suivi commandes (12 pts)
  {
    id: 'bb1',
    module: 'B',
    moduleLabel: 'Suivi des commandes',
    text: 'Comment suivez-vous vos commandes en cours ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Avec un outil de gestion dédié', score: 0 },
      { label: 'Dans un cahier ou sur Excel', score: 2 },
      { label: 'En scrollant dans WhatsApp', score: 4 },
    ],
  },
  {
    id: 'bb2',
    module: 'B',
    moduleLabel: 'Suivi des commandes',
    text: 'Des commandes ont-elles déjà été oubliées ou perdues ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Jamais', score: 0, calibrationValue: 0 },
      { label: '1 à 2 fois par mois', score: 2, calibrationValue: 1.5 },
      { label: 'Plusieurs fois par semaine', score: 4, calibrationValue: 8 },
    ],
  },
  {
    id: 'bb3',
    module: 'B',
    moduleLabel: 'Suivi des commandes',
    text: 'Vos clients vous relancent-ils pour connaître le statut de leur commande ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Rarement', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Tous les jours', score: 4 },
    ],
  },
  // Module C — Disponibilité (8 pts)
  {
    id: 'bc1',
    module: 'C',
    moduleLabel: 'Disponibilité',
    text: 'Quand un client vous contacte la nuit ou le week-end, que se passe-t-il ?',
    scored: true,
    painCategory: 'disponibilite',
    options: [
      { label: 'Je réponds toujours rapidement', score: 0 },
      { label: 'Je réponds le lendemain matin', score: 2 },
      { label: 'Ils achètent souvent ailleurs', score: 4 },
    ],
  },
  {
    id: 'bc2',
    module: 'C',
    moduleLabel: 'Disponibilité',
    text: 'Avez-vous déjà perdu un client parce que vous avez répondu trop lentement ?',
    scored: true,
    painCategory: 'disponibilite',
    options: [
      { label: 'Jamais', score: 0 },
      { label: 'Quelquefois', score: 2 },
      { label: 'Fréquemment', score: 4 },
    ],
  },
  // Module D — Paiements (8 pts)
  {
    id: 'bd1',
    module: 'D',
    moduleLabel: 'Paiements',
    text: 'Comment vérifiez-vous qu\'un paiement a bien été reçu avant la livraison ?',
    scored: true,
    painCategory: 'paiements',
    options: [
      { label: 'Vérification automatique', score: 0 },
      { label: 'Je vérifie manuellement sur MoMo / Orange Money', score: 2 },
      { label: 'Le client m\'envoie une capture d\'écran', score: 4 },
    ],
  },
  {
    id: 'bd2',
    module: 'D',
    moduleLabel: 'Paiements',
    text: 'Vous est-il arrivé de livrer sans avoir reçu le paiement par erreur ?',
    scored: true,
    painCategory: 'paiements',
    options: [
      { label: 'Jamais', score: 0, calibrationValue: 0 },
      { label: '1 à 2 fois', score: 2, calibrationValue: 1.5 },
      { label: 'Plusieurs fois', score: 4, calibrationValue: 4 },
    ],
  },
];

export const restaurantQuestions: Question[] = [
  // Module A — Commandes & réservations (12 pts)
  {
    id: 'ra1',
    module: 'A',
    moduleLabel: 'Commandes & réservations',
    text: 'Comment recevez-vous vos commandes et réservations ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Via un système en ligne dédié', score: 0 },
      { label: 'Par appel téléphonique', score: 2 },
      { label: 'Sur WhatsApp de façon manuelle', score: 4 },
    ],
  },
  {
    id: 'ra2',
    module: 'A',
    moduleLabel: 'Commandes & réservations',
    text: 'Combien de temps passez-vous chaque jour à confirmer ou corriger des commandes ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Moins de 30 minutes', score: 0, calibrationValue: 0.25 },
      { label: 'Entre 30 min et 2 heures', score: 2, calibrationValue: 1 },
      { label: 'Plus de 2 heures', score: 4, calibrationValue: 2.5 },
    ],
  },
  {
    id: 'ra3',
    module: 'A',
    moduleLabel: 'Commandes & réservations',
    text: 'Des erreurs ou ruptures de plats causent-elles des problèmes avec vos clients ?',
    scored: true,
    painCategory: 'commandes',
    options: [
      { label: 'Jamais', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Régulièrement', score: 4 },
    ],
  },
  // Module B — Livraisons (12 pts)
  {
    id: 'rb1',
    module: 'B',
    moduleLabel: 'Livraisons',
    text: 'Comment organisez-vous vos tournées de livraison ?',
    scored: true,
    painCategory: 'livraisons',
    options: [
      { label: 'Avec un suivi en temps réel', score: 0 },
      { label: 'Avec un cahier de tournées', score: 2 },
      { label: 'De mémoire ou via WhatsApp', score: 4 },
    ],
  },
  {
    id: 'rb2',
    module: 'B',
    moduleLabel: 'Livraisons',
    text: 'Vos clients appellent-ils pour savoir où est leur livraison ?',
    scored: true,
    painCategory: 'livraisons',
    options: [
      { label: 'Rarement', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Plusieurs appels par jour', score: 4 },
    ],
  },
  {
    id: 'rb3',
    module: 'B',
    moduleLabel: 'Livraisons',
    text: 'Avez-vous des incidents de livraison (mauvaise adresse, oubli, retard) ?',
    scored: true,
    painCategory: 'livraisons',
    options: [
      { label: 'Jamais', score: 0, calibrationValue: 0 },
      { label: 'Quelques fois', score: 2, calibrationValue: 2 },
      { label: 'Fréquemment', score: 4, calibrationValue: 5 },
    ],
  },
  // Module C — Disponibilité (8 pts)
  {
    id: 'rc1',
    module: 'C',
    moduleLabel: 'Disponibilité',
    text: 'Un client peut-il commander en dehors de vos horaires d\'ouverture ?',
    scored: true,
    painCategory: 'disponibilite',
    options: [
      { label: 'Oui, il peut commander en ligne', score: 0 },
      { label: 'Non, il attend l\'ouverture', score: 2 },
      { label: 'Non, il commande souvent ailleurs', score: 4 },
    ],
  },
  {
    id: 'rc2',
    module: 'C',
    moduleLabel: 'Disponibilité',
    text: 'Perdez-vous des commandes parce que vous étiez indisponible ?',
    scored: true,
    painCategory: 'disponibilite',
    options: [
      { label: 'Non, jamais', score: 0 },
      { label: 'Quelquefois', score: 2 },
      { label: 'Régulièrement', score: 4 },
    ],
  },
  // Module D — Paiements (8 pts)
  {
    id: 'rd1',
    module: 'D',
    moduleLabel: 'Paiements',
    text: 'Comment gérez-vous les paiements de vos commandes ?',
    scored: true,
    painCategory: 'paiements',
    options: [
      { label: 'Confirmation automatique', score: 0 },
      { label: 'Vérification manuelle pour chaque commande', score: 2 },
      { label: 'Confusions et impayés fréquents', score: 4 },
    ],
  },
  {
    id: 'rd2',
    module: 'D',
    moduleLabel: 'Paiements',
    text: 'Votre récapitulatif de fin de journée est-il toujours clair ?',
    scored: true,
    painCategory: 'paiements',
    options: [
      { label: 'Toujours clair', score: 0 },
      { label: 'Je dois parfois recompter', score: 2 },
      { label: 'Souvent flou', score: 4 },
    ],
  },
];

export const cliniqueQuestions: Question[] = [
  // Module A — Rendez-vous & accueil (12 pts)
  {
    id: 'ca1',
    module: 'A',
    moduleLabel: 'Rendez-vous & accueil',
    text: 'Comment vos patients prennent-ils rendez-vous ?',
    scored: true,
    painCategory: 'rdv',
    options: [
      { label: 'Via une application ou plateforme en ligne', score: 0 },
      { label: 'Par appel téléphonique', score: 2 },
      { label: 'Sur WhatsApp ou en personne', score: 4 },
    ],
  },
  {
    id: 'ca2',
    module: 'A',
    moduleLabel: 'Rendez-vous & accueil',
    text: 'Combien de temps votre personnel consacre-t-il à gérer les rendez-vous chaque jour ?',
    scored: true,
    painCategory: 'rdv',
    options: [
      { label: 'Moins d\'1 heure', score: 0, calibrationValue: 0.5 },
      { label: 'Entre 1 et 3 heures', score: 2, calibrationValue: 2 },
      { label: 'Plus de 3 heures', score: 4, calibrationValue: 4 },
    ],
  },
  {
    id: 'ca3',
    module: 'A',
    moduleLabel: 'Rendez-vous & accueil',
    text: 'Vos patients oublient-ils souvent leurs rendez-vous sans prévenir ?',
    scored: true,
    painCategory: 'rdv',
    options: [
      { label: 'Rarement', score: 0 },
      { label: 'Quelquefois', score: 2 },
      { label: 'Très souvent', score: 4 },
    ],
  },
  // Module B — Dossiers patients (12 pts)
  {
    id: 'cb1',
    module: 'B',
    moduleLabel: 'Dossiers patients',
    text: 'Comment sont stockés les dossiers de vos patients ?',
    scored: true,
    painCategory: 'dossiers',
    options: [
      { label: 'Dans un logiciel médical dédié', score: 0 },
      { label: 'Sur Excel ou Word', score: 2 },
      { label: 'Sur papier uniquement', score: 4 },
    ],
  },
  {
    id: 'cb2',
    module: 'B',
    moduleLabel: 'Dossiers patients',
    text: 'Pouvez-vous accéder à un dossier patient à distance facilement ?',
    scored: true,
    painCategory: 'dossiers',
    options: [
      { label: 'Oui, facilement depuis n\'importe où', score: 0 },
      { label: 'C\'est compliqué mais possible', score: 2 },
      { label: 'Impossible à distance', score: 4 },
    ],
  },
  {
    id: 'cb3',
    module: 'B',
    moduleLabel: 'Dossiers patients',
    text: 'Perdez-vous du temps à chercher des dossiers patients ?',
    scored: true,
    painCategory: 'dossiers',
    options: [
      { label: 'Jamais', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Régulièrement', score: 4 },
    ],
  },
  // Module C — Communication patients (8 pts)
  {
    id: 'cc1',
    module: 'C',
    moduleLabel: 'Communication patients',
    text: 'Comment transmettez-vous les résultats ou ordonnances à vos patients ?',
    scored: true,
    painCategory: 'communication',
    options: [
      { label: 'Via une application sécurisée', score: 0 },
      { label: 'Par appel ou SMS manuel', score: 2 },
      { label: 'Le patient doit revenir physiquement', score: 4 },
    ],
  },
  {
    id: 'cc2',
    module: 'C',
    moduleLabel: 'Communication patients',
    text: 'Recevez-vous beaucoup de messages WhatsApp pour des questions simples (résultats, RDV...) ?',
    scored: true,
    painCategory: 'communication',
    options: [
      { label: 'Très peu', score: 0 },
      { label: 'Quelques-uns par jour', score: 2 },
      { label: 'Beaucoup, c\'est très chronophage', score: 4 },
    ],
  },
  // Module D — Facturation (8 pts)
  {
    id: 'cd1',
    module: 'D',
    moduleLabel: 'Facturation',
    text: 'Comment gérez-vous votre facturation et le suivi des paiements ?',
    scored: true,
    painCategory: 'facturation',
    options: [
      { label: 'Avec un logiciel dédié', score: 0 },
      { label: 'Sur Excel ou un cahier', score: 2 },
      { label: 'De façon approximative', score: 4 },
    ],
  },
  {
    id: 'cd2',
    module: 'D',
    moduleLabel: 'Facturation',
    text: 'Suivez-vous clairement les paiements en attente de vos patients ?',
    scored: true,
    painCategory: 'facturation',
    options: [
      { label: 'Oui, c\'est clair et suivi', score: 0 },
      { label: 'Parfois des oublis', score: 2 },
      { label: 'Souvent flou', score: 4 },
    ],
  },
  {
    id: 'cd3',
    module: 'D',
    moduleLabel: 'Facturation',
    text: 'Délivrez-vous systématiquement des reçus ou factures officiels à vos patients ?',
    scored: true,
    painCategory: 'facturation',
    options: [
      { label: 'Systématiquement', score: 0 },
      { label: 'Sur demande seulement', score: 2 },
      { label: 'Rarement', score: 4 },
    ],
  },
];

export const sectorQuestions: Record<Sector, Question[]> = {
  boutique: boutiqueQuestions,
  restaurant: restaurantQuestions,
  clinique: cliniqueQuestions,
};

export const sectorLabels: Record<Sector, string> = {
  boutique: 'Boutique & commerce',
  restaurant: 'Restaurant & traiteur',
  clinique: 'Clinique & cabinet médical',
};

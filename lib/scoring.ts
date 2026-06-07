import { Sector, Question, qualificationQuestions, sectorQuestions, sectorLabels } from './questions';
import { WHATSAPP_NUMBER } from './config';

export interface DiagnosticData {
  businessName: string;
  sector: Sector;
  answers: Record<string, number>;
}

export interface PainPoint {
  category: string;
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface LossItem {
  label: string;
  amount: number;
  explanation: string;
}

export interface ScoreResult {
  totalScore: number;
  maxScore: number;
  level: 'faible' | 'modere' | 'critique';
  levelLabel: string;
  levelColor: string;
  levelBg: string;
  painPoints: PainPoint[];
  lossTotal: number;
  lossBreakdown: LossItem[];
  baseVolume: number;
  basePanier: number;
  accroche: string;
}

export function computeScore(data: DiagnosticData): ScoreResult {
  const { sector, answers } = data;
  const questions = sectorQuestions[sector];

  const commandes = qualificationQuestions[0].options[answers['q0_1'] ?? 1]?.calibrationValue ?? 12;
  const panier = qualificationQuestions[1].options[answers['q0_2'] ?? 1]?.calibrationValue ?? 15000;

  const categoryScores: Record<string, { score: number; maxScore: number; label: string }> = {};
  let totalScore = 0;

  for (const q of questions) {
    if (!q.scored || !q.painCategory) continue;
    const idx = answers[q.id] ?? 0;
    const score = q.options[idx]?.score ?? 0;
    totalScore += score;

    if (!categoryScores[q.painCategory]) {
      categoryScores[q.painCategory] = { score: 0, maxScore: 0, label: q.moduleLabel };
    }
    categoryScores[q.painCategory].score += score;
    categoryScores[q.painCategory].maxScore += 4;
  }

  let level: 'faible' | 'modere' | 'critique';
  let levelLabel: string;
  let levelColor: string;
  let levelBg: string;

  if (totalScore <= 10) {
    level = 'faible';
    levelLabel = 'Faible — optimisation possible';
    levelColor = '#16a34a';
    levelBg = '#dcfce7';
  } else if (totalScore <= 25) {
    level = 'modere';
    levelLabel = 'Modéré — pertes réelles et évitables';
    levelColor = '#ea580c';
    levelBg = '#ffedd5';
  } else {
    level = 'critique';
    levelLabel = 'Critique — croissance bloquée';
    levelColor = '#dc2626';
    levelBg = '#fee2e2';
  }

  const painDescriptions = getPainDescriptions(sector);

  const painPoints: PainPoint[] = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 3)
    .map(([cat, data]) => ({
      category: cat,
      label: data.label,
      score: data.score,
      maxScore: data.maxScore,
      description: painDescriptions[cat] ?? `Problèmes liés à ${data.label.toLowerCase()}`,
    }));

  const lossBreakdown = computeLosses(sector, answers, questions, commandes, panier);
  const lossTotal = Math.max(lossBreakdown.reduce((sum, l) => sum + l.amount, 0), 50000);

  const accroche = getAccroche(level, formatFCFA(lossTotal));

  return { totalScore, maxScore: 40, level, levelLabel, levelColor, levelBg, painPoints, lossTotal, lossBreakdown, baseVolume: commandes, basePanier: panier, accroche };
}

function getAnswer(questions: Question[], answers: Record<string, number>, id: string) {
  const q = questions.find(q => q.id === id);
  if (!q) return { score: 0, calibrationValue: 0 };
  const idx = answers[id] ?? 0;
  return { score: q.options[idx]?.score ?? 0, calibrationValue: q.options[idx]?.calibrationValue ?? 0 };
}

function computeLosses(
  sector: Sector,
  answers: Record<string, number>,
  questions: Question[],
  commandesParJour: number,
  panierMoyen: number
): LossItem[] {
  const losses: LossItem[] = [];
  const get = (id: string) => getAnswer(questions, answers, id);
  const n = (v: number) => new Intl.NumberFormat('fr-FR').format(Math.round(v));

  if (sector === 'boutique') {
    const heures = get('ba1').calibrationValue;
    if (heures > 0) {
      losses.push({
        label: 'Temps gaspillé à gérer les messages',
        amount: Math.round(heures * 5 * 4 * 500),
        explanation: `Vous déclarez passer ~${heures}h/jour sur les messages : ${heures}h × 5 jours × 4 semaines × 500 FCFA/h de valeur-temps`,
      });
    }
    const noReponseScore = get('ba3').score;
    if (noReponseScore > 0) {
      const pct = noReponseScore === 2 ? 0.10 : 0.15;
      losses.push({
        label: 'Ventes perdues (messages sans réponse)',
        amount: Math.round(commandesParJour * pct * panierMoyen * 22),
        explanation: `${pct * 100}% de vos ${commandesParJour} contacts/jour partent sans réponse rapide : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 22 jours`,
      });
    }
    const oublisFreq = get('bb2').calibrationValue;
    if (oublisFreq > 0) {
      losses.push({
        label: 'Pertes sur commandes oubliées',
        amount: Math.round(oublisFreq * panierMoyen * 4),
        explanation: `Vous déclarez ~${oublisFreq} commande${oublisFreq > 1 ? 's perdues' : ' perdue'}/semaine : ${oublisFreq} × ${n(panierMoyen)} FCFA × 4 semaines`,
      });
    }
    const nuitScore = get('bc1').score;
    if (nuitScore >= 2) {
      const pct = nuitScore === 2 ? 0.10 : 0.20;
      losses.push({
        label: 'Ventes manquées la nuit et le week-end',
        amount: Math.round(commandesParJour * pct * panierMoyen * 30),
        explanation: `${pct * 100}% de vos clients contactent hors horaires : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 30 jours`,
      });
    }
    const incidents = get('bd2').calibrationValue;
    if (incidents > 0) {
      losses.push({
        label: 'Pertes sur paiements non vérifiés',
        amount: Math.round(incidents * panierMoyen),
        explanation: `Vous déclarez ~${incidents} livraison${incidents > 1 ? 's' : ''} sans paiement confirmé/mois : ${incidents} × ${n(panierMoyen)} FCFA`,
      });
    }
  } else if (sector === 'restaurant') {
    const heures = get('ra2').calibrationValue;
    if (heures > 0) {
      losses.push({
        label: 'Temps gaspillé à gérer les commandes',
        amount: Math.round(heures * 5 * 4 * 500),
        explanation: `Vous déclarez passer ~${heures}h/jour à confirmer/corriger les commandes : ${heures}h × 5 jours × 4 semaines × 500 FCFA/h`,
      });
    }
    const dispoScore = get('rc1').score;
    if (dispoScore >= 2) {
      const pct = dispoScore === 2 ? 0.10 : 0.20;
      losses.push({
        label: 'Commandes perdues par indisponibilité',
        amount: Math.round(commandesParJour * pct * panierMoyen * 30),
        explanation: `${pct * 100}% de vos ${commandesParJour} clients/jour ne peuvent pas commander hors horaires : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 30 jours`,
      });
    }
    const incidentsLivraison = get('rb3').calibrationValue;
    if (incidentsLivraison > 0) {
      losses.push({
        label: 'Pertes sur incidents de livraison',
        amount: Math.round(incidentsLivraison * panierMoyen * 4),
        explanation: `Vous déclarez ~${incidentsLivraison} incident${incidentsLivraison > 1 ? 's' : ''} de livraison/semaine (mauvaise adresse, oubli) : ${incidentsLivraison} × ${n(panierMoyen)} FCFA × 4 semaines`,
      });
    }
    const paiementScore = get('rd1').score;
    if (paiementScore >= 2) {
      const pct = paiementScore === 2 ? 0.05 : 0.10;
      losses.push({
        label: 'Pertes sur confusion des paiements',
        amount: Math.round(commandesParJour * pct * panierMoyen * 22),
        explanation: `${pct * 100}% de vos ${commandesParJour} commandes/jour génèrent une confusion de paiement : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 22 jours`,
      });
    }
  } else {
    const heuresRDV = get('ca2').calibrationValue;
    if (heuresRDV > 0) {
      losses.push({
        label: 'Temps personnel sur gestion des RDV',
        amount: Math.round(heuresRDV * 5 * 4 * 500),
        explanation: `Votre personnel passe ~${heuresRDV}h/jour à gérer les rendez-vous : ${heuresRDV}h × 5 jours × 4 semaines × 500 FCFA/h`,
      });
    }
    const noshowScore = get('ca3').score;
    if (noshowScore >= 2) {
      const pct = noshowScore === 2 ? 0.10 : 0.20;
      losses.push({
        label: 'Consultations perdues (patients absents)',
        amount: Math.round(commandesParJour * pct * panierMoyen * 22),
        explanation: `${pct * 100}% de vos ${commandesParJour} patients/jour n'honorent pas leur RDV : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 22 jours`,
      });
    }
    const dossierScore = get('cb3').score;
    if (dossierScore >= 2) {
      const heures = dossierScore === 2 ? 0.5 : 1;
      losses.push({
        label: 'Temps perdu à chercher des dossiers',
        amount: Math.round(heures * 5 * 4 * 500),
        explanation: `~${heures}h/jour perdue à localiser des dossiers patients : ${heures}h × 5 jours × 4 semaines × 500 FCFA/h`,
      });
    }
    const factScore = get('cd2').score;
    if (factScore >= 2) {
      const pct = factScore === 2 ? 0.05 : 0.15;
      losses.push({
        label: 'Paiements en attente non suivis',
        amount: Math.round(commandesParJour * pct * panierMoyen * 22),
        explanation: `${pct * 100}% de vos ${commandesParJour} consultations/jour ont un paiement non relancé : ${commandesParJour} × ${pct * 100}% × ${n(panierMoyen)} FCFA × 22 jours`,
      });
    }
  }

  return losses;
}

const painDescriptionsBoutique: Record<string, string> = {
  messages: 'Trop de temps gaspillé à répondre manuellement aux mêmes questions clients',
  commandes: 'Des commandes oubliées ou mal suivies qui coûtent des ventes et des clients',
  disponibilite: 'Des clients perdus la nuit et le week-end faute de réponse rapide',
  paiements: 'Des erreurs de vérification paiement qui créent des pertes financières directes',
};

const painDescriptionsRestaurant: Record<string, string> = {
  commandes: 'Des commandes mal gérées qui causent erreurs, perte de temps et mécontentement',
  livraisons: 'Des livraisons désorganisées avec des incidents qui coûtent des clients fidèles',
  disponibilite: 'Des commandes perdues car les clients ne peuvent pas commander hors horaires',
  paiements: 'Une gestion des paiements floue qui génère des impayés et de la confusion',
};

const painDescriptionsClinique: Record<string, string> = {
  rdv: 'Trop de temps passé à gérer manuellement les rendez-vous et les no-shows répétés',
  dossiers: 'Des dossiers patients difficiles à trouver qui ralentissent chaque consultation',
  communication: 'Trop de messages WhatsApp pour questions simples qui mobilisent le personnel',
  facturation: 'Une facturation approximative avec des paiements en attente non suivis',
};

function getPainDescriptions(sector: Sector): Record<string, string> {
  if (sector === 'boutique') return painDescriptionsBoutique;
  if (sector === 'restaurant') return painDescriptionsRestaurant;
  return painDescriptionsClinique;
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}

function getAccroche(level: 'faible' | 'modere' | 'critique', loss: string): string {
  if (level === 'faible') {
    return `Votre activité tourne bien. Mais même à ce niveau, vous perdez environ ${loss} par mois sur des frictions que vous ne voyez pas encore...`;
  }
  if (level === 'modere') {
    return `Votre process manuel vous coûte environ ${loss} par mois en ventes perdues et temps gaspillé. Ce chiffre va augmenter avec votre croissance...`;
  }
  return `Votre activité perd environ ${loss} chaque mois à cause de son organisation manuelle. Vos concurrents qui ont automatisé gagnent les clients que vous perdez la nuit et le week-end...`;
}

export function buildWhatsAppURL(data: DiagnosticData, result: ScoreResult): string {
  const painList = result.painPoints
    .map((p, i) => `${i + 1}. ${p.description}`)
    .join('\n');

  const msg =
    `Bonjour ! Je viens de faire le diagnostic digital de mon activité (${sectorLabels[data.sector]}). ` +
    `J'ai obtenu un score de ${result.totalScore}/40 avec des pertes estimées à ${formatFCFA(result.lossTotal)}/mois. ` +
    `Mes 3 problèmes principaux sont :\n${painList}\nJ'aimerais en discuter avec vous.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

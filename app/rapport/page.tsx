'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiagnosticData, ScoreResult, computeScore, formatFCFA, buildWhatsAppURL } from '@/lib/scoring';
import { Sector, sectorLabels } from '@/lib/questions';
import { WHATSAPP_NUMBER } from '@/lib/config';

export default function RapportPage() {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('diagnostic');
      if (raw) {
        const parsed = JSON.parse(raw) as DiagnosticData;
        setData(parsed);
        setResult(computeScore(parsed));
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!data || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center gap-6">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-gray-900">Aucun diagnostic trouvé</h1>
        <p className="text-gray-500 text-sm">Complétez d&apos;abord le questionnaire pour voir votre rapport.</p>
        <Link href="/diagnostic" className="btn-brand">Démarrer le diagnostic</Link>
      </div>
    );
  }

  const waURL = buildWhatsAppURL(data, result);
  const scorePercent = Math.round((result.totalScore / result.maxScore) * 100);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <p className="text-sm font-bold" style={{ color: '#1D9E75' }}>Votre rapport de diagnostic</p>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 pb-32 flex flex-col gap-5">

        {/* Identity card */}
        <div className="animate-fade-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Rapport établi pour</p>
          <h1 className="text-xl font-extrabold text-gray-900">{data.businessName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sectorLabels[data.sector as Sector]}
          </p>
        </div>

        {/* Score card */}
        <div className="animate-fade-up bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          {/* SVG score ring */}
          <div className="relative">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="44" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="44"
                fill="none"
                stroke={result.levelColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-gray-900">{result.totalScore}</span>
              <span className="text-xs text-gray-400">/ {result.maxScore}</span>
            </div>
          </div>

          <div className="text-center">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
              style={{ background: result.levelBg, color: result.levelColor }}
            >
              {result.levelLabel}
            </span>
          </div>
        </div>

        {/* Loss amount — hero number */}
        <div
          className="animate-fade-up rounded-2xl p-6 text-center shadow-sm"
          style={{ background: result.levelColor }}
        >
          <p className="text-white/80 text-sm font-medium mb-1">Pertes estimées par mois</p>
          <p className="text-white font-extrabold leading-none mb-3" style={{ fontSize: 'clamp(1.75rem, 7vw, 2.5rem)' }}>
            {formatFCFA(result.lossTotal)}
          </p>
          <p className="text-white/80 text-xs leading-relaxed">{result.accroche}</p>
        </div>

        {/* Pain points */}
        {result.painPoints.length > 0 && (
          <div className="animate-fade-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-4">
              Vos 3 principales frictions
            </h2>
            <div className="flex flex-col gap-4">
              {result.painPoints.map((pain, i) => (
                <div key={pain.category} className="flex gap-3 items-start">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: result.levelColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{pain.description}</p>
                    <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(pain.score / pain.maxScore) * 100}%`,
                          background: result.levelColor,
                          transitionDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{pain.score}/{pain.maxScore} points · {pain.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loss breakdown */}
        {result.lossBreakdown.length > 0 && (
          <div className="animate-fade-up bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-4">
              Détail des pertes estimées
            </h2>
            <div className="flex flex-col gap-4">
              {result.lossBreakdown.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800 leading-tight flex-1">{item.label}</p>
                    <p className="text-sm font-bold flex-shrink-0" style={{ color: result.levelColor }}>
                      {formatFCFA(item.amount)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{item.explanation}</p>
                </div>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-3 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">Total mensuel estimé</p>
                <p className="text-base font-extrabold" style={{ color: result.levelColor }}>
                  {formatFCFA(result.lossTotal)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Methodology */}
        <div className="animate-fade-up rounded-2xl p-4 border border-gray-200" style={{ background: '#f8fafc' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Comment ces chiffres ont été calculés</p>
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Volume déclaré', value: `${result.baseVolume} clients/commandes par jour` },
              { label: 'Panier moyen', value: `${formatFCFA(result.basePanier)}` },
              { label: 'Taux de perte messages', value: '15 % (hypothèse conservatrice)' },
              { label: 'Taux de pertes nocturnes', value: '20 % (hypothèse conservatrice)' },
              { label: 'Période de calcul', value: '22 jours ouvrés / 4 semaines' },
            ].map(row => (
              <div key={row.label} className="flex justify-between gap-2">
                <p className="text-xs text-gray-500">{row.label}</p>
                <p className="text-xs font-medium text-gray-700 text-right">{row.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            La réalité est souvent plus élevée — nous avons volontairement choisi les hypothèses les plus prudentes pour que ces chiffres restent incontestables.
          </p>
        </div>

        {/* CTA redo */}
        <div className="flex justify-center">
          <Link href="/diagnostic" className="text-sm font-medium underline" style={{ color: '#1D9E75' }}>
            Refaire le diagnostic
          </Link>
        </div>
      </main>

      {/* Sticky CTA bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-5 py-4 shadow-lg">
        <a
          href={waURL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand w-full justify-center text-base"
          style={{ background: '#25D366' }}
        >
          <WhatsAppIcon />
          Recevoir mon plan d&apos;action sur WhatsApp
        </a>
      </div>

      {/* Floating WhatsApp icon (fallback) */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-5 z-40 w-12 h-12 flex items-center justify-center text-white rounded-full shadow-xl"
        style={{ background: '#25D366' }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

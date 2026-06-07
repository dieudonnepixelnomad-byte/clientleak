'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sector, qualificationQuestions, sectorQuestions, Question } from '@/lib/questions';
import { WHATSAPP_NUMBER } from '@/lib/config';

type Step = 'name' | 'sector' | 'autre' | 'questions';

const SECTORS: { id: Sector | 'autre'; emoji: string; label: string }[] = [
  { id: 'boutique', emoji: '🛍️', label: 'Boutique & commerce' },
  { id: 'restaurant', emoji: '🍽️', label: 'Restaurant & traiteur' },
  { id: 'clinique', emoji: '🏥', label: 'Clinique & cabinet médical' },
  { id: 'autre', emoji: '✳️', label: 'Autre activité' },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('name');
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState<Sector | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [animClass, setAnimClass] = useState('animate-slide-right');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'name') nameRef.current?.focus();
  }, [step]);

  const allQuestions: Question[] = sector
    ? [...qualificationQuestions, ...sectorQuestions[sector]]
    : [];

  const totalQuestions = allQuestions.length;
  const progress = step === 'questions' ? ((questionIndex) / totalQuestions) * 100 : 0;
  const currentQuestion = allQuestions[questionIndex];

  function goToQuestion(idx: number, dir: 'left' | 'right' = 'right') {
    setAnimClass(dir === 'right' ? 'animate-slide-right' : 'animate-slide-left');
    setQuestionIndex(idx);
  }

  function handleAnswer(optionIdx: number) {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: optionIdx };
    setAnswers(newAnswers);

    if (questionIndex + 1 >= totalQuestions) {
      sessionStorage.setItem(
        'diagnostic',
        JSON.stringify({ businessName, sector, answers: newAnswers })
      );
      router.push('/rapport');
    } else {
      setAnimClass('animate-slide-right');
      setQuestionIndex(questionIndex + 1);
    }
  }

  function handleBack() {
    if (questionIndex > 0) {
      goToQuestion(questionIndex - 1, 'left');
    } else {
      setStep('sector');
    }
  }

  function handleSectorSelect(id: Sector | 'autre') {
    if (id === 'autre') {
      setStep('autre');
    } else {
      setSector(id);
      setQuestionIndex(0);
      setAnswers({});
      setStep('questions');
    }
  }

  const whatsappAltreURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour ! Mon activité n'est pas encore dans votre diagnostic, mais j'aimerais en discuter avec vous.")}`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => {
            if (step === 'questions') handleBack();
            else if (step === 'sector' || step === 'autre') setStep('name');
            else router.push('/');
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Retour"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: '#1D9E75' }}>Diagnostic Digital PME</p>
          {step === 'questions' && (
            <p className="text-xs text-gray-400">Question {questionIndex + 1} sur {totalQuestions}</p>
          )}
        </div>
        {step === 'questions' && (
          <span className="text-xs font-semibold text-gray-500">{Math.round(progress)}%</span>
        )}
      </header>

      {/* Progress bar */}
      {step === 'questions' && (
        <div className="h-1.5 bg-gray-200">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: '#1D9E75' }}
          />
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-start px-5 py-8 max-w-lg mx-auto w-full">

        {/* Step: Name */}
        {step === 'name' && (
          <div className="animate-fade-up w-full">
            <div className="text-4xl mb-4 text-center">👋</div>
            <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-2">
              Bienvenue dans votre diagnostic
            </h1>
            <p className="text-gray-500 text-center text-sm mb-8">
              En 5 minutes, découvrez combien votre process manuel vous coûte chaque mois.
            </p>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de votre établissement
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder="ex: Boutique Mama Caro, Restaurant Ndolé Palace..."
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && businessName.trim() && setStep('sector')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors focus:border-[#1D9E75] mb-6"
              style={{ fontSize: '16px' }}
            />

            <button
              onClick={() => setStep('sector')}
              disabled={!businessName.trim()}
              className="btn-brand w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Commencer
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {/* Step: Sector */}
        {step === 'sector' && (
          <div className="animate-slide-right w-full">
            <h2 className="text-xl font-extrabold text-gray-900 text-center mb-2">
              Quel est votre type d&apos;activité ?
            </h2>
            <p className="text-gray-500 text-center text-sm mb-7">
              Sélectionnez pour accéder à votre diagnostic personnalisé
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSectorSelect(s.id)}
                  className="sector-card"
                >
                  <div className="text-4xl mb-3">{s.emoji}</div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{s.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Autre */}
        {step === 'autre' && (
          <div className="animate-fade-up w-full text-center">
            <div className="text-5xl mb-5">✳️</div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">
              Votre activité n&apos;est pas encore couverte
            </h2>
            <p className="text-gray-500 text-sm mb-2 leading-relaxed">
              Notre diagnostic est actuellement disponible pour les boutiques, restaurants et cliniques.
            </p>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
              Mais nous pouvons quand même vous aider ! Contactez-nous directement et nous ferons un diagnostic personnalisé ensemble.
            </p>
            <a
              href={whatsappAltreURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand w-full justify-center mb-4"
              style={{ background: '#25D366' }}
            >
              <WhatsAppIcon />
              Me contacter sur WhatsApp
            </a>
            <button
              onClick={() => setStep('sector')}
              className="text-sm text-gray-400 underline mt-2"
            >
              ← Retour au choix du secteur
            </button>
          </div>
        )}

        {/* Step: Questions */}
        {step === 'questions' && currentQuestion && (
          <div key={`${currentQuestion.id}-${questionIndex}`} className={`${animClass} w-full`}>
            {/* Module badge */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: '#e6f7f2', color: '#1D9E75' }}
              >
                {currentQuestion.scored ? `Module ${currentQuestion.module}` : 'Votre activité'}
              </span>
              <span className="text-xs text-gray-400">{currentQuestion.moduleLabel}</span>
            </div>

            {/* Question */}
            <h2 className="text-lg font-extrabold text-gray-900 leading-snug mb-6">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="answer-btn"
                >
                  <span className="inline-flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-xs font-bold"
                      style={{ color: '#1D9E75' }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Back button */}
            {(questionIndex > 0 || step === 'questions') && (
              <button
                onClick={handleBack}
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Question précédente
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 flex items-center justify-center text-white rounded-full shadow-xl"
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

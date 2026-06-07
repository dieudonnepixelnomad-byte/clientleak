import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/config";

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center px-5 pt-16 pb-14 flex-1"
        style={{ background: "linear-gradient(160deg, #f0faf6 0%, #ffffff 60%)" }}
      >
        <div className="animate-fade-up max-w-xl mx-auto">
          <span
            className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ background: "#e6f7f2", color: "#1D9E75" }}
          >
            Diagnostic gratuit · 5 minutes
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 mb-4">
            Votre PME perd de l&apos;argent{" "}
            <span style={{ color: "#1D9E75" }}>sans le savoir</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Répondez à 13 questions sur votre activité. On calcule exactement
            combien vos process manuels vous coûtent en ventes perdues et en
            temps gaspillé chaque mois.
          </p>

          <Link href="/diagnostic" className="btn-brand text-lg px-8 py-4 rounded-xl shadow-lg">
            Démarrer mon diagnostic
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <p className="text-sm text-gray-400 mt-4">Aucune inscription requise · 100% gratuit</p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-t border-gray-100 py-8 px-5">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: "5 min", label: "Pour compléter le diagnostic" },
            { value: "3", label: "Douleurs identifiées et chiffrées" },
            { value: "FCFA", label: "Pertes calculées précisément" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-extrabold" style={{ color: "#1D9E75" }}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 py-12 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-8">
            Comment ça fonctionne ?
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { step: "1", title: "Choisissez votre secteur", desc: "Boutique, restaurant ou clinique — le diagnostic est adapté à votre activité." },
              { step: "2", title: "Répondez à 13 questions", desc: "Questions simples sur vos process actuels. Sélection uniquement, aucune saisie." },
              { step: "3", title: "Recevez votre rapport", desc: "Score de maturité, 3 douleurs identifiées et total des pertes FCFA/mois." },
              { step: "4", title: "Discutez de votre plan d'action", desc: "Un message WhatsApp pré-rempli pour démarrer la conversation directement." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#1D9E75" }}>
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-12 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Pour qui ?</h2>
          <p className="text-center text-gray-500 text-sm mb-8">PME africaines avec des process encore manuels</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: "🛍️", label: "Boutiques & commerces" },
              { emoji: "🍽️", label: "Restaurants & traiteurs" },
              { emoji: "🏥", label: "Cliniques & cabinets" },
            ].map((s) => (
              <div key={s.label} className="sector-card">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <p className="text-xs font-semibold text-gray-700 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 px-5 text-center" style={{ background: "#1D9E75" }}>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Prêt à connaître votre score ?
          </h2>
          <p className="text-white/80 mb-7 text-sm">
            Rejoignez les PME qui ont chiffré leur problème avant d&apos;investir dans une solution.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-xl shadow-lg text-base"
            style={{ color: "#1D9E75" }}
          >
            Démarrer maintenant — c&apos;est gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 px-5 text-xs">
        <p>© 2026 · Diagnostic Digital PME · Conçu pour les PME d&apos;Afrique centrale</p>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-full shadow-xl animate-pulse-soft"
        style={{ background: "#25D366" }}
        aria-label="Nous contacter sur WhatsApp"
      >
        <WhatsAppIcon />
        <span className="hidden sm:inline">Nous contacter</span>
      </a>
    </main>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

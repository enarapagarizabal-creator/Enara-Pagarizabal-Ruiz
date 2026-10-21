import React from 'react';
import {
  GraduationCap,
  Award,
  Compass,
  Heart,
  Globe2,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ENARA_PROFILE, ExperienceItem } from '../data/enaraProfile.ts';

interface ResumePortfolioProps {
  onAskUma: (question: string) => void;
  onOpenCvModal: () => void;
}

export const ResumePortfolio: React.FC<ResumePortfolioProps> = ({
  onAskUma,
  onOpenCvModal,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Overview Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent border border-white/[0.08] p-6 sm:p-10 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Marketing & Digital Business Intelligence Profile</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight leading-tight">
              Enara Pagarizabal Ruiz
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              {ENARA_PROFILE.shortBioEn}
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-light italic leading-relaxed pt-1 border-t border-white/[0.05]">
              "{ENARA_PROFILE.shortBioEs}"
            </p>

            {/* Quick Contact & Action pills */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-zinc-300">
              <a
                href={`mailto:${ENARA_PROFILE.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-amber-200 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{ENARA_PROFILE.email}</span>
              </a>

              <a
                href={`tel:${ENARA_PROFILE.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>{ENARA_PROFILE.phone}</span>
              </a>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{ENARA_PROFILE.location}</span>
              </div>
            </div>
          </div>

          {/* Quick PDF & Talk Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenCvModal}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-medium text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Open PDF Resume</span>
            </button>

            <a
              href={ENARA_PROFILE.cvPdfPath}
              download="CV_Enara_Pagarizabal_Ruiz.pdf"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 font-medium text-xs sm:text-sm transition-all"
            >
              <ExternalLink className="w-4 h-4 text-zinc-400" />
              <span>Download Official CV</span>
            </a>
          </div>
        </div>
      </section>

      {/* Key Highlights Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ENARA_PROFILE.keyHighlights.map((hl, i) => (
          <div
            key={i}
            className="group relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-amber-500/30 transition-all"
          >
            <div className="font-serif text-2xl font-bold text-amber-200 tracking-tight">
              {hl.stat}
            </div>
            <div className="text-xs font-semibold text-zinc-200 mt-1 uppercase tracking-wider">
              {hl.labelEn}
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              {hl.detailEn}
            </p>
          </div>
        ))}
      </section>

      {/* Education & Academic Excellence */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-white">
                Education & Academic Specialization
              </h2>
              <p className="text-xs text-zinc-400 font-light">
                Deusto Business School & International Exchange
              </p>
            </div>
          </div>

          <button
            onClick={() => onAskUma("Can you explain Enara's university background and marketing specialization in detail?")}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Uma About Education</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENARA_PROFILE.education.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-amber-300 border border-white/[0.08] mb-3">
                  {item.year}
                </span>
                <h3 className="text-sm font-semibold text-white tracking-wide leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-amber-200/80 font-medium mt-1">
                  {item.institution}
                </p>
                <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.tags && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.04]">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & International Seminars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-white">
                Certifications & Executive Programs
              </h2>
              <p className="text-xs text-zinc-400 font-light">
                Luxury Brand Management, Global Strategy, and Financial Analysis
              </p>
            </div>
          </div>

          <button
            onClick={() => onAskUma("Tell me about Enara's INSIDE LVMH certificate and what it taught her about luxury brand management.")}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask About LVMH & Programs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENARA_PROFILE.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-serif text-amber-300">
                  {cert.year}
                </span>
                <h3 className="text-sm font-semibold text-white mt-1">
                  {cert.title}
                </h3>
                <p className="text-xs text-zinc-300 font-medium mt-1">
                  {cert.institution}
                </p>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {cert.tags && (
                <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-white/[0.04]">
                  {cert.tags.map((t, ti) => (
                    <span
                      key={ti}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Leadership, Athletics & Volunteering */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-white">
                Leadership, Values & Athletic Rigor
              </h2>
              <p className="text-xs text-zinc-400 font-light">
                High-performance equestrian sports, student representation, and community impact
              </p>
            </div>
          </div>

          <button
            onClick={() => onAskUma("How do Enara's equestrian background and class delegate experience shape her professional qualities?")}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask About Leadership</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ENARA_PROFILE.volunteerAndSports.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="text-base font-medium text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">{item.institution}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
                {item.description}
              </p>

              {item.tags && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.05]">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-amber-200/90 border border-white/[0.05]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills, Tools & Languages */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Core Competencies */}
        <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Core Competencies</span>
          </h3>
          <ul className="space-y-2.5">
            {ENARA_PROFILE.skills.map((s, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools & IT */}
        <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>IT & Marketing Toolkit</span>
          </h3>
          <ul className="space-y-2.5">
            {ENARA_PROFILE.tools.map((tool, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0" />
                <span>{tool}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Languages & Extras */}
        <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2 mb-4">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>Languages & Interests</span>
          </h3>
          <div className="space-y-3">
            {ENARA_PROFILE.languages.map((lang, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-center text-zinc-200 font-medium">
                  <span>{lang.language}</span>
                  <span className="text-amber-300 text-[11px] font-semibold">{lang.level}</span>
                </div>
                {lang.note && (
                  <p className="text-[11px] text-zinc-500 mt-0.5">{lang.note}</p>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-white/[0.05]">
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Aficiones / Personal Interests
              </div>
              <p className="text-xs text-zinc-300">
                Equitación de élite (14 años federada + Galope 7), Viajes culturales, Gastronomía y cocina creativa, Carnet de conducir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

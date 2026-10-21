import React from 'react';
import { X, Download, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { ENARA_PROFILE } from '../data/enaraProfile.ts';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-[#121316] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Enara Pagarizabal Ruiz — Official Curriculum Vitae
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-amber-200 border border-white/[0.08]">
                  Verified PDF
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Universidad de Deusto • ADE + Digital Business Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={ENARA_PROFILE.cvPdfPath}
              download="CV_marketing-_Enara_Pagarizabal_Ruiz.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium border border-amber-500/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <a
              href={ENARA_PROFILE.cvPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium border border-white/[0.08] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors ml-1 cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full h-full bg-zinc-950 relative">
          <iframe
            src={`${ENARA_PROFILE.cvPdfPath}#toolbar=1&navpanes=0`}
            title="Curriculum Vitae Enara Pagarizabal"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Microchip, Sparkles, CheckCircle2 } from 'lucide-react';

export const QualitySystemView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">QUALITY SYSTEM</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            Uncompromising Quality Assurance & Sterile Production Standards
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          ISO 9001:2015 Verified
        </span>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
        <p className="text-justify text-slate-700">
          At <strong className="text-slate-900 font-bold">Beryl Drugs Limited</strong>, Quality Assurance is embedded at every stage of the manufacturing process—from raw material testing to final sterile formulation packaging.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-6 border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-bold">
              <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold">WHO-GMP Cleanrooms</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Class 100 sterile filling rooms equipped with HEPA filtration, laminar air flow, and positive pressure air balance.
            </p>
          </div>

          <div className="p-6 border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-bold">
              <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl">
                <Microchip className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold">Analytical QC Laboratory</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In-house HPLC, UV-Vis Spectrophotometers, Gas Chromatography, and Sterility Incubators managed by certified QA chemists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

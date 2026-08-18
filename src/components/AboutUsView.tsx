import React from 'react';
import { Building2, Award, CheckCircle2, ShieldCheck, Target, Sparkles } from 'lucide-react';

export const AboutUsView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">ABOUT US</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            Beryl Drugs Limited — Quality Healthcare & Pharmaceutical Manufacturing Since 1993
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
          BSE Listed: 524680
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          <p className="text-justify">
            <strong className="text-slate-900 font-bold">Beryl Drugs Limited</strong> is a publicly listed BSE pharmaceutical company (Scrip Code: 524680) dedicated to the formulation and manufacturing of high-quality Small Volume Parenterals (SVP), Large Volume Parenterals (LVP), sterile injectables, eye drops, and allied healthcare products.
          </p>
          <p className="text-justify">
            Established with a vision of "Health to All with Economy and Quality", our manufacturing facility at Bicholi, Indore (M.P.) conforms strictly to international cGMP and WHO-GMP guidelines. Managed by a veteran team of industry experts with decades of pharmaceutical formulation experience.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100 relative group">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
            alt="Pharmaceutical Lab"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
          <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">WHO-GMP Certified</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Manufacturing process validated under stringent international standards.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
          <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Ethics & Transparency</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Compliant with SEBI, corporate disclosures and investor reporting.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
          <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Global Reach</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Active in domestic institution supplies and international pharmaceutical exports.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Factory, Cog, Wrench, ShieldCheck, Sparkles } from 'lucide-react';

export const InfrastructureView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">INFRASTRUCTURE</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            State-of-the-Art Pharmaceutical Formulation Facility located at Bicholi, Indore (M.P.)
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
          Automated BFS Lines
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          <p className="text-justify">
            Our state-of-the-art manufacturing plant is situated in the pharmaceutical industrial hub of Indore, Madhya Pradesh. Spanning extensive acreage with dedicated air-handling units (AHU), water purifiers (RO + WFI distillation), and automated high-speed washing, filling, and sealing lines.
          </p>
          <ul className="space-y-3 font-medium text-xs text-slate-800 pt-2">
            <li className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <Factory className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Dedicated LVP & SVP Parenteral Manufacturing Cleanroom Blocks</span>
            </li>
            <li className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <Cog className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Blow-Fill-Seal (BFS) & Form-Fill-Seal (FFS) High-Speed Machinery</span>
            </li>
            <li className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Multi-column Water-For-Injection (WFI) Distillation & Pure Steam Generators</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100 relative group">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
            alt="Pharmaceutical Plant Machinery"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};

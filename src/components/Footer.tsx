import React from 'react';
import { Building2, ShieldCheck, Mail, MapPin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 mt-12 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">BERYL DRUGS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              A premier pharmaceutical manufacturing enterprise committed to healthcare excellence through strict compliance with WHO-GMP and c-GMP standards.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-md text-[10px] border border-blue-500/30">
                BSE CODE: 524606
              </span>
              <span className="bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md text-[10px] border border-slate-700">
                ISIN: INE415H01017
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Corporate Governance</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Board of Directors</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Audit & Stakeholder Committees</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Vigil Mechanism & Whistle Blower</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">SEBI (LODR) Regulations</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Registered Office</h4>
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Registered office 29, neer nagar, mayank water park road, bicholi, indore- 452016 MP</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@beryldrugs.com</span>
              </p>
            </div>
          </div>

          {/* Certifications & Regulatory */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Certifications & Quality</h4>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>WHO-GMP Compliant Plant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                ISO 9001:2015 certified formulation facility specializing in Large & Small Volume Parenterals (LVP & SVP).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium pt-2">
          <p>© {new Date().getFullYear()} Beryl Drugs Limited. All Rights Reserved.</p>

          <div className="flex items-center space-x-4">
            <span>Corporate Investor & Compliance Portal</span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

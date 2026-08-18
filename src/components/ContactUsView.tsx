import React from 'react';
import { MapPin, Phone, Mail, Globe, Building2, Clock, Sparkles } from 'lucide-react';

export const ContactUsView: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">CONTACT US</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            Registered Office & Corporate Communications — Beryl Drugs Limited
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
          CIN: L02423MP1993PLC007840
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="space-y-4 border border-slate-200/80 rounded-2xl p-6 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Registered & Corporate Office</span>
          </h3>

          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">BERYL DRUGS LIMITED</p>
                <p>29, Neer Nagar, Mayank Water Park Road,</p>
                <p>Bicholi, Indore - 452016 (M.P.) India</p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1 bg-blue-100/60 px-2 py-0.5 rounded w-fit">
                  (Official Location w.e.f. 1st July 2026)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">+91 731 2592233 / +91 731 2592244</span>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <a href="mailto:info@beryldrugs.com" className="text-blue-600 font-bold hover:underline">
                info@beryldrugs.com
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">www.beryldrugs.com</span>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-slate-200 text-slate-500">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-xs">Working Hours: Mon - Sat (09:30 AM to 06:30 PM IST)</span>
            </div>
          </div>
        </div>

        {/* Location & Listing Card */}
        <div className="border border-slate-200/80 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 mb-3 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Plant & Stock Exchange Details</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Our parenteral and sterile formulation facility is situated at the Bicholi pharmaceutical industrial hub in Indore, Madhya Pradesh.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-medium">
              <p><strong className="text-slate-900">BSE Stock Exchange Scrip Code:</strong> <span className="text-blue-600 font-bold">524680</span></p>
              <p><strong className="text-slate-900">ISIN Security Number:</strong> INE415D01017</p>
              <p><strong className="text-slate-900">Corporate Identity Number (CIN):</strong> L02423MP1993PLC007840</p>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-center text-xs font-semibold">
            Registered with Registrar of Companies (ROC), Madhya Pradesh & Chhattisgarh, Gwalior
          </div>
        </div>
      </div>
    </div>
  );
};

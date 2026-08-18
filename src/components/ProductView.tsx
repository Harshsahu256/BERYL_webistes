import React from 'react';
import { Syringe, Pill, Droplets, Sparkles } from 'lucide-react';

export const ProductView: React.FC = () => {
  const categories = [
    {
      title: 'Small Volume Parenterals (SVP)',
      icon: Syringe,
      description: 'Sterile liquid injections in glass ampoules and FFS plastic bottles.',
      items: [
        'Water for Injection IP/BP (Sterile)',
        'Sodium Chloride Injection 0.9% w/v',
        'Dextrose Injection 5% & 10% w/v',
        'Potassium Chloride Injection USP',
        'Atropine Sulphate Injection IP',
      ],
    },
    {
      title: 'Large Volume Parenterals (LVP)',
      icon: Droplets,
      description: 'Intravenous infusion fluids formulated in high-grade sterile bottles.',
      items: [
        'Normal Saline IV Infusion (0.9% NaCl)',
        'Dextrose Normal Saline (DNS)',
        'Compound Sodium Lactate (Ringer Lactate)',
        'Mannitol IV Infusion 10% & 20%',
        'Ciprofloxacin Infusion IP 200mg/100ml',
      ],
    },
    {
      title: 'Eye & Ear Drops',
      icon: Droplets,
      description: 'Ophthalmic solutions manufactured in automated Class 100 cleanrooms.',
      items: [
        'Ciprofloxacin Eye & Ear Drops',
        'Gentamicin Ophthalmic Solution',
        'Carboxymethylcellulose Lubricant Eye Drops',
        'Moxifloxacin Ophthalmic Drops',
      ],
    },
    {
      title: 'Oral Solid Dosage & Allied Formulations',
      icon: Pill,
      description: 'High efficacy pharmaceutical tablets, capsules and dry syrups.',
      items: [
        'Broad Spectrum Antibiotic Formulations',
        'Analgesic & Anti-inflammatory Tablets',
        'Multivitamin & Mineral Supplements',
        'Pediatric Dry Suspensions',
      ],
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">PRODUCT RANGE</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            Comprehensive Portfolio of Sterile Injectables & Pharmaceutical Formulations
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
          WHO-GMP Validated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all duration-300 shadow-2xs hover:shadow-md space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{cat.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {cat.description}
              </p>

              <ul className="space-y-2 pt-3 border-t border-slate-200/60 text-xs">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

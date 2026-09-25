// import React from 'react';
// import { Building2, Award, CheckCircle2, ShieldCheck, Target, Sparkles } from 'lucide-react';

// export const AboutUsView: React.FC = () => {
//   return (
//     <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
//       <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">ABOUT US</h2>
//           <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
//             Beryl Drugs Limited — Quality Healthcare & Pharmaceutical Manufacturing Since 1993
//           </p>
//         </div>
//         <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
//           <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
//           BSE Listed: 524606
//         </span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//         <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
//           <p className="text-justify">
//             <strong className="text-slate-900 font-bold">Beryl Drugs Limited</strong> is a publicly listed BSE pharmaceutical company (Scrip Code: 524606) dedicated to the formulation and manufacturing of high-quality Small Volume Parenterals (SVP), Large Volume Parenterals (LVP), sterile injectables, eye drops, and allied healthcare products.
//           </p>
//           <p className="text-justify">
//             Established with a vision of "Health to All with Economy and Quality", our manufacturing facility at Bicholi, Indore (M.P.) conforms strictly to international cGMP and WHO-GMP guidelines. Managed by a veteran team of industry experts with decades of pharmaceutical formulation experience.
//           </p>
//         </div>

//         <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100 relative group">
//           <img
//             src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
//             alt="Pharmaceutical Lab"
//             referrerPolicy="no-referrer"
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
//         </div>
//       </div>

//       {/* Core Values */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <Award className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">WHO-GMP Certified</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Manufacturing process validated under stringent international standards.
//           </p>
//         </div>

//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <ShieldCheck className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">Ethics & Transparency</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Compliant with SEBI, corporate disclosures and investor reporting.
//           </p>
//         </div>

//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <Target className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">Global Reach</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Active in domestic institution supplies and international pharmaceutical exports.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useState, useEffect } from 'react';
// import { Award, ShieldCheck, Target, Sparkles } from 'lucide-react';

// interface Director {
//   id: string;
//   name: string;
//   designation: string;
// }

// const DEFAULT_DIRECTORS: Director[] = [
//   { id: '1', name: 'Mr. Sudhir Sethi', designation: 'Chairman & Director' },
//   { id: '2', name: 'Mr. Sanjay Sethi', designation: 'Managing Director' },
//   { id: '3', name: 'Mr. Abhinav Naik', designation: 'Independent Director' },
//   { id: '4', name: 'Ms. Shreya Saraf', designation: 'Independent Director' },
// ];

// export const AboutUsView: React.FC = () => {
//   const [directors, setDirectors] = useState<Director[]>(() => {
//     const saved = localStorage.getItem('beryl_directors');
//     return saved ? JSON.parse(saved) : DEFAULT_DIRECTORS;
//   });

//   useEffect(() => {
//     fetch('/api/directors')
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.directors) && data.directors.length > 0) {
//           setDirectors(data.directors);
//           localStorage.setItem('beryl_directors', JSON.stringify(data.directors));
//         }
//       })
//       .catch(() => {
//         // Fallback to local / default data
//       });
//   }, []);

//   return (
//     <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
//       {/* Top Header */}
//       <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">ABOUT US</h2>
//           <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
//             Beryl Drugs Limited — Quality Healthcare & Pharmaceutical Manufacturing Since 1993
//           </p>
//         </div>
//         <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
//           <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
//           BSE Listed: 524606
//         </span>
//       </div>

//       {/* Overview Paragraphs & Lab Image */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//         <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
//           <p className="text-justify">
//             <strong className="text-slate-900 font-bold">Beryl Drugs Limited</strong> is a publicly listed BSE pharmaceutical company (Scrip Code: 524606) dedicated to the formulation and manufacturing of high-quality Small Volume Parenterals (SVP), Large Volume Parenterals (LVP), sterile injectables, eye drops, and allied healthcare products.
//           </p>
//           <p className="text-justify">
//             Established with a vision of "Health to All with Economy and Quality", our manufacturing facility at Bicholi, Indore (M.P.) conforms strictly to international cGMP and WHO-GMP guidelines. Managed by a veteran team of industry experts with decades of pharmaceutical formulation experience.
//           </p>
//         </div>

//         <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100 relative group">
//           <img
//             src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
//             alt="Pharmaceutical Lab"
//             referrerPolicy="no-referrer"
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
//         </div>
//       </div>

//       {/* ======================================================== */}
//       {/* BOARD OF DIRECTORS SECTION (EXACT AS YOUR IMAGES) */}
//       {/* ======================================================== */}
//       <div className="pt-6 border-t border-slate-100">
//         <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
//           <h3 className="text-2xl font-normal text-slate-800 tracking-tight mb-6">
//             Board of Directors
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             {/* Left: Directors List with exact 3D Glossy Blue Dots */}
//             <div className="space-y-4">
//               {directors.map((director) => (
//                 <div key={director.id} className="flex items-center space-x-3 text-xs sm:text-sm text-slate-800">
//                   {/* Glossy 3D Blue Dot Bullet */}
//                   <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#93c5fd,#2563eb_45%,#1e3a8a_100%)] shadow-xs shrink-0" />
//                   <div>
//                     <span className="font-medium text-slate-900">{director.name}: </span>
//                     <span className="text-slate-700">{director.designation}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Right: Exact 2nd Boardroom Image */}
//             <div className="flex justify-center md:justify-end">
//               <img
//                 src="https://www.beryldrugs.com/images/bordofdire.png"
//                 alt="Board of Directors"
//                 className="w-full max-w-sm h-auto object-contain drop-shadow-xs"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Core Values */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <Award className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">WHO-GMP Certified</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Manufacturing process validated under stringent international standards.
//           </p>
//         </div>

//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <ShieldCheck className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">Ethics & Transparency</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Compliant with SEBI, corporate disclosures and investor reporting.
//           </p>
//         </div>

//         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
//           <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl w-fit mb-3">
//             <Target className="w-5 h-5" />
//           </div>
//           <h4 className="font-bold text-slate-900 text-sm">Global Reach</h4>
//           <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//             Active in domestic institution supplies and international pharmaceutical exports.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Target, Sparkles } from 'lucide-react';

interface Director {
  id: string;
  name: string;
  designation: string;
}

const DEFAULT_DIRECTORS: Director[] = [
  { id: '1', name: 'Mr. Sudhir Sethi', designation: 'Chairman & Director' },
  { id: '2', name: 'Mr. Sanjay Sethi', designation: 'Managing Director' },
  { id: '3', name: 'Mr. Abhinav Naik', designation: 'Independent Director' },
  { id: '4', name: 'Ms. Shreya Saraf', designation: 'Independent Director' },
];

export const AboutUsView: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>(DEFAULT_DIRECTORS);

  // हर ब्राउज़र में पेज लोड होते ही सीधा सर्वर से डेटा आएगा
  useEffect(() => {
    fetch('/api/directors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.directors) && data.directors.length > 0) {
          setDirectors(data.directors);
        }
      })
      .catch((err) => {
        console.warn('Server sync note:', err);
      });
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">ABOUT US</h2>
          <p className="text-xs sm:text-sm text-blue-600 font-bold mt-0.5">
            Beryl Drugs Limited — Quality Healthcare & Pharmaceutical Manufacturing Since 1993
          </p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
          BSE Listed: 524606
        </span>
      </div>

      {/* Overview Paragraphs & Lab Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          <p className="text-justify">
            <strong className="text-slate-900 font-bold">Beryl Drugs Limited</strong> is a publicly listed BSE pharmaceutical company (Scrip Code: 524606) dedicated to the formulation and manufacturing of high-quality Small Volume Parenterals (SVP), Large Volume Parenterals (LVP), sterile injectables, eye drops, and allied healthcare products.
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

      {/* ======================================================== */}
      {/* BOARD OF DIRECTORS SECTION (EXACT AS YOUR IMAGES) */}
      {/* ======================================================== */}
      <div className="pt-6 border-t border-slate-100">
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
          <h3 className="text-2xl font-normal text-slate-800 tracking-tight mb-6">
            Board of Directors
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Directors List with exact 3D Glossy Blue Dots */}
            <div className="space-y-4">
              {directors.map((director) => (
                <div key={director.id} className="flex items-center space-x-3 text-xs sm:text-sm text-slate-800">
                  {/* Glossy 3D Blue Dot Bullet */}
                  <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#93c5fd,#2563eb_45%,#1e3a8a_100%)] shadow-xs shrink-0" />
                  <div>
                    <span className="font-medium text-slate-900">{director.name}: </span>
                    <span className="text-slate-700">{director.designation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Exact 2nd Boardroom Image */}
            <div className="flex justify-center md:justify-end">
              <img
                src="https://www.beryldrugs.com/images/bordofdire.png"
                alt="Board of Directors"
                className="w-full max-w-sm h-auto object-contain drop-shadow-xs"
              />
            </div>
          </div>
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
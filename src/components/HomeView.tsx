import React from 'react';
import { Category } from '../types';
import { FileText, ChevronRight, ShieldCheck, Award, Building2, Sparkles, ExternalLink, Folder } from 'lucide-react';

interface HomeViewProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Welcome to Beryl Drugs Limited
              </h2>
              <p className="text-xs text-blue-600 font-bold">
                WHO-GMP & ISO 9001:2015 Certified Pharmaceutical Manufacturing Enterprise
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full text-xs border border-blue-200">
              BSE Scrip: 524606
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-normal">
          To create a <strong className="text-slate-900 font-semibold">'Beryl Drugs'</strong> brand identity synonymous with nurturing healthcare, eternal values, strong ethics and global quality of highest standards in pharmaceuticals and allied healthcare products. The company's motto is <em className="text-blue-700 font-medium">"Health to all with economy and quality"</em>. Our manufacturing unit conforms strictly to international cGMP and WHO-GMP standards.
        </p>

        {/* Badges Footer */}
        <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>WHO-GMP Validated Formulation Cleanrooms</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 font-semibold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Statutory Compliance Archive Active</span>
          </div>
        </div>
      </div>

      {/* Corporate Disclosures Category Section (Dynamic from Database) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Corporate Disclosures & Investor Categories
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Browse through official statutory categories and downloadable PDF documents
              </p>
            </div>
          </div>

          <span className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
            {categories.length} Categories Available
          </span>
        </div>

        {/* Dynamic Categories Grid */}
        {categories.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <Folder className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No categories found.</p>
            <p className="text-xs text-slate-400">Documents will appear once published by the corporate office.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((card) => {
              const pdfCount = card.pdfs?.length || 0;
              return (
                <div
                  key={card.id}
                  className="group bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Category Header */}
                    <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {card.name}
                      </h4>
                      <span className="text-[10px] font-extrabold tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                        {pdfCount} PDFs
                      </span>
                    </div>

                    {/* Category Thumbnail Image */}
                    <div
                      onClick={() => onSelectCategory(card.id)}
                      className="h-36 overflow-hidden cursor-pointer relative bg-slate-100"
                    >
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out filter brightness-[0.95]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                      {/* Floating Overlay Badge */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                        <span className="drop-shadow-md text-[11px]">Explore Documents</span>
                        <ExternalLink className="w-3.5 h-3.5 drop-shadow-md group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* View File CTA Button */}
                  <div className="p-3.5 bg-white border-t border-slate-100">
                    <button
                      onClick={() => onSelectCategory(card.id)}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-2 px-3.5 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2 text-xs active:scale-[0.98] cursor-pointer"
                    >
                      <span>View Category PDFs</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

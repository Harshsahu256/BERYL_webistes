import React, { useState } from 'react';
import { Category, Subcategory, PdfDocument } from '../types';
import { PdfTable } from './PdfTable';
import { ChevronRight, ArrowLeft, Home, FolderTree, Folder, ArrowRight } from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  onViewPdf: (doc: PdfDocument) => void;
  onDownloadPdf: (doc: PdfDocument) => void;
  onBackToHome: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  onViewPdf,
  onDownloadPdf,
  onBackToHome,
}) => {
  const subcategories = category.subcategories || [];
  const directPdfs = category.pdfs || [];

  // If category has subcategories, activeSubcategory state manages directory view vs opened subcategory
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const activeSubcategory = subcategories.find((s) => s.id === selectedSubcategoryId);

  // If category has subcategories AND no subcategory is selected yet -> SHOW DIRECTORY GRID (Image 3 & Image 4)
  if (subcategories.length > 0 && !selectedSubcategoryId) {
    return (
      <div className="space-y-6">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <button
              onClick={onBackToHome}
              className="text-slate-500 hover:text-blue-600 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">{category.name}</span>
          </div>

          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold transition-colors bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home Portal</span>
          </button>
        </div>

        {/* Directory Container Card matching Image 3 & Image 4 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-500/20">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {category.name} Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Select a disclosure category to open specific PDF file archives
              </p>
            </div>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subcategories.map((sub) => {
              return (
                <div
                  key={sub.id}
                  className="group bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Subcategory Title */}
                    <div className="p-4 bg-white border-b border-slate-100">
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </h3>
                    </div>

                    {/* Image Area */}
                    <div className="h-40 overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          sub.imageUrl ||
                          category.imageUrl ||
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={sub.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Open Documents Button */}
                  <div className="p-4 bg-white border-t border-slate-100">
                    <button
                      onClick={() => setSelectedSubcategoryId(sub.id)}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-slate-900/10 hover:shadow-blue-500/20 cursor-pointer"
                    >
                      <span>Open Documents</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If subcategory is selected OR category has NO subcategories -> SHOW PDF TABLE (Image 2 & Image 5)
  const displayedPdfs = activeSubcategory
    ? activeSubcategory.pdfs || []
    : directPdfs;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <button
            onClick={onBackToHome}
            className="text-slate-500 hover:text-blue-600 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {subcategories.length > 0 ? (
            <button
              onClick={() => setSelectedSubcategoryId(null)}
              className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {category.name}
            </button>
          ) : (
            <span className="text-slate-900 font-extrabold">{category.name}</span>
          )}

          {activeSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-600 font-extrabold">{activeSubcategory.name}</span>
            </>
          )}
        </div>

        <button
          onClick={() => {
            if (subcategories.length > 0 && selectedSubcategoryId) {
              setSelectedSubcategoryId(null);
            } else {
              onBackToHome();
            }
          }}
          className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold transition-colors bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {subcategories.length > 0 && selectedSubcategoryId
              ? `Back to ${category.name}`
              : 'Back to Home Portal'}
          </span>
        </button>
      </div>

      {/* PDF Documents Table */}
      <div>
        <PdfTable
          title={
            activeSubcategory
              ? `${category.name} — ${activeSubcategory.name}`
              : category.name
          }
          bannerImage={activeSubcategory?.imageUrl || category.imageUrl}
          documents={displayedPdfs}
          onViewPdf={onViewPdf}
          onDownloadPdf={onDownloadPdf}
        />
      </div>
    </div>
  );
};
